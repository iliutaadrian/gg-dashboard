import sqlite3
import os
import re
from collections import defaultdict
import pickle
from config.config import DATA_FOLDER
import numpy as np
import time
from collections import Counter


from engine.search.syntactic_helper import clean_text 

# Global file paths
AUTOCOMPLETE_DB_PATH = os.path.join(DATA_FOLDER, 'autocomplete.db')

# Configuration constants
MAX_PHRASE_LENGTH = 5
BATCH_SIZE = 1000
TOP_BM25_WORDS = 20

# BM25 thresholds
MIN_BM25_THRESHOLD_WORD = 1.0
MIN_BM25_THRESHOLD_PHRASE = 3.0
MIN_BM25_THRESHOLD_DOC_NAME = 0

# Document distribution thresholds
MIN_DOCUMENTS_PERCENTAGE = 5  # Minimum percentage of documents that should contain the phrase

# Weights for the ranking formula
SCORE_WEIGHT = 0.3
CLICK_COUNT_WEIGHT = 0.3
DOC_NAME_WEIGHT = 0.4

def get_db_connection():
    conn = sqlite3.connect(AUTOCOMPLETE_DB_PATH)
    conn.execute("PRAGMA journal_mode=WAL")
    return conn

def init_autocomplete(documents, indexed_count=0):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.executescript('''
        CREATE TABLE IF NOT EXISTS autocomplete_items (
            id INTEGER PRIMARY KEY,
            phrase TEXT UNIQUE,
            score REAL,
            click_count INTEGER DEFAULT 0,
            is_doc_name BOOLEAN DEFAULT 0
        );
        CREATE INDEX IF NOT EXISTS idx_autocomplete_items_phrase ON autocomplete_items(phrase);
    ''')
    
    conn.commit()
    conn.close()
    
    build_inverted_index(documents)

def should_reject_phrase(phrase):
    """Return True if phrase should be rejected"""
    words = phrase.split()
    
    # Reject repeated words (like "hotmail meljrobertson hotmail meljrobertson")
    word_counts = {}
    for word in words:
        word_counts[word] = word_counts.get(word, 0) + 1
    if max(word_counts.values()) > 2:  # More than 2 occurrences of any word
        return True
        
    return False


def build_inverted_index(documents, max_phrase_length=4, min_doc_count=2):
    # Prepare corpus for BM25
    cleaned_documents = [clean_text(doc['original_content'], use_lemmatization=False, remove_numeric=True) for doc in documents]

    # Build inverted index: maps phrases to the set of documents they appear in
    phrase_to_docs = defaultdict(set)
    
    # Process each document
    for doc_id, doc_text in enumerate(cleaned_documents):
        words = doc_text.split()
        word_set = set(words)
        
        # Process single words
        for word in word_set:
            if len(word) > 1 and any(c.isalnum() for c in word):
                phrase_to_docs[word].add(doc_id)
        
        # Process multi-word phrases
        for n in range(2, max_phrase_length + 1):
            for i in range(len(words) - n + 1):
                phrase = ' '.join(words[i:i+n])
                
                if should_reject_phrase(phrase):
                    continue
                
                phrase_to_docs[phrase].add(doc_id)
    
    # Calculate minimum document threshold
    total_docs = len(cleaned_documents)

    # Filter phrases by document distribution
    qualified_phrases = [(phrase, len(doc_ids) / total_docs) 
                         for phrase, doc_ids in phrase_to_docs.items() 
                         if len(doc_ids) >= min_doc_count]
    
    print(f"Found {len(qualified_phrases)} phrases that appear in at least {min_doc_count} documents")
    
    # Handle document names
    doc_names = [(clean_text(doc['name'], use_lemmatization=False, remove_numeric=True), 15.0) for doc in documents]

    add_or_update_items(qualified_phrases)
    add_or_update_items(doc_names, is_doc_name=True)


def update_click_count(phrase):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE autocomplete_items
        SET click_count = click_count + 1
        WHERE phrase = ?
    ''', (phrase.lower(),))
    
    conn.commit()
    conn.close()

def get_autocomplete_suggestions(query, limit=10):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT phrase,
               (? * score + 
                ? * (CAST(click_count AS REAL) / (SELECT MAX(click_count) FROM autocomplete_items)) + 
                ? * CAST(is_doc_name AS REAL)) AS combined_score
        FROM autocomplete_items
        WHERE phrase LIKE ? || '%'
        ORDER BY combined_score DESC, length(phrase) ASC
        LIMIT ?
    ''', (SCORE_WEIGHT, CLICK_COUNT_WEIGHT, DOC_NAME_WEIGHT, query.lower(), limit))
    
    suggestions = [row[0] for row in cursor.fetchall()]
    
    conn.close()
    
    return suggestions


def add_or_update_items(items, is_doc_name=False):
    if not items:
        return

    conn = get_db_connection()
    cursor = conn.cursor()
    
    for item, score in items:
        cursor.execute('''
            INSERT INTO autocomplete_items (phrase, score, is_doc_name)
            VALUES (?, ?, ?)
            ON CONFLICT(phrase) DO UPDATE SET 
                score = MAX(score, ?),
                is_doc_name = ?
        ''', (item, score, is_doc_name, score, is_doc_name))
    
    conn.commit()
    conn.close()




