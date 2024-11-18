import sqlite3
import os
import re
from collections import defaultdict
from rank_bm25 import BM25Okapi
import pickle
from config.config import DATA_FOLDER
import numpy as np

from engine.search.syntactic_helper import clean_text 

AUTOCOMPLETE_DB_PATH = os.path.join(DATA_FOLDER, 'autocomplete.db')
AUTOCOMPLETE_MODEL_PATH = os.path.join(DATA_FOLDER, 'autocomplete_bm25.pkl')
MAX_PHRASE_LENGTH = 5
BATCH_SIZE = 1000
TOP_BM25_WORDS = 20

MIN_BM25_THRESHOLD_WORD = 0.5
MIN_BM25_THRESHOLD_PHRASE = 0.5
MIN_BM25_THRESHOLD_DOC_NAME = 0

# Weights for the ranking formula
BM25_WEIGHT = 0.3
CLICK_COUNT_WEIGHT = 0.3
DOC_NAME_WEIGHT = 0.4


STOP_WORDS = set(['www', 'http', 'https', 'fig'])

def get_db_connection():
    conn = sqlite3.connect(AUTOCOMPLETE_DB_PATH)
    conn.execute("PRAGMA journal_mode=WAL")
    return conn

def init_autocomplete(documents, indexed_count=0):
    os.makedirs(os.path.dirname(AUTOCOMPLETE_MODEL_PATH), exist_ok=True)

    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.executescript('''
        CREATE TABLE IF NOT EXISTS autocomplete_items (
            id INTEGER PRIMARY KEY,
            phrase TEXT UNIQUE,
            bm25_score REAL,
            click_count INTEGER DEFAULT 0,
            is_doc_name BOOLEAN DEFAULT 0
        );
        CREATE INDEX IF NOT EXISTS idx_autocomplete_items_phrase ON autocomplete_items(phrase);
    ''')
    
    conn.commit()
    conn.close()
    
    if indexed_count > 0:
        populate_autocomplete_from_documents(documents)

def consolidate_phrases(phrases):
    if not phrases:
        return []

    phrase_dict = defaultdict(lambda: {'bm25_score': 0})
    for phrase, score in phrases:
        # Use the original phrase as the key, preserving word order
        phrase_dict[phrase]['bm25_score'] = max(phrase_dict[phrase]['bm25_score'], score)
    
    return [(phrase, data['bm25_score']) for phrase, data in phrase_dict.items()]

def add_or_update_items(items, is_doc_name=False):
    if not items:
        return

    conn = get_db_connection()
    cursor = conn.cursor()
    
    for item, bm25_score in items:
        if is_doc_name:
            threshold = MIN_BM25_THRESHOLD_DOC_NAME
        if ' ' in item:  # It's a phrase
            threshold = MIN_BM25_THRESHOLD_PHRASE
        else:  # It's a single word
            threshold = MIN_BM25_THRESHOLD_WORD

        if bm25_score >= threshold or is_doc_name:
            cursor.execute('''
                INSERT INTO autocomplete_items (phrase, bm25_score, is_doc_name)
                VALUES (?, ?, ?)
                ON CONFLICT(phrase) DO UPDATE SET 
                    bm25_score = MAX(bm25_score, ?),
                    is_doc_name = ?
            ''', (item, bm25_score, is_doc_name, bm25_score, is_doc_name))
    
    conn.commit()
    conn.close()

def populate_autocomplete_from_documents(documents):
    phrases = []
    doc_names = []
    
    # Prepare corpus for BM25
    cleaned_documents = [clean_text(doc['original_content'], use_stemming=False) for doc in documents]
    tokenized_corpus = [doc.split() for doc in cleaned_documents]
    

    # Initialize BM25
    bm25 = BM25Okapi(tokenized_corpus)
    
    # Save the BM25 model for future use
    with open(AUTOCOMPLETE_MODEL_PATH, 'wb') as f:
        pickle.dump({
            'bm25': bm25,
            'tokenized_corpus': tokenized_corpus
        }, f)
    
    # Process each document
    for doc_index, (doc, cleaned_content) in enumerate(zip(documents, cleaned_documents)):
        words = cleaned_content.split()
        
        # Extract and score phrases
        for i in range(len(words)):
            for j in range(i + 1, min(i + MAX_PHRASE_LENGTH + 1, len(words) + 1)):
                phrase = ' '.join(words[i:j])
                if not any(word in STOP_WORDS for word in phrase.split()):
                    # Get BM25 score for the phrase
                    phrase_score = np.mean(bm25.get_scores(phrase.split()))
                    if phrase_score > 0:
                        phrases.append((phrase, phrase_score))

        # Handle document names
        doc_name = clean_text(doc['name'], use_stemming=False)
        if doc_name:
            doc_names.append((doc_name, 1.0))

    # Process phrases
    consolidated_phrases = consolidate_phrases(phrases)
    add_or_update_items(consolidated_phrases)

    # Process document names
    add_or_update_items(doc_names, is_doc_name=True)
    
    # Extract quality words using BM25
    quality_words = []
    unique_words = set(word for doc in tokenized_corpus for word in doc)
    
    for word in unique_words:
        if word not in STOP_WORDS:
            word_score = np.max(bm25.get_scores([word]))
            if word_score > 0:
                quality_words.append((word, word_score))
    
    # Sort and get top words
    quality_words.sort(key=lambda x: x[1], reverse=True)
    top_quality_words = quality_words[:TOP_BM25_WORDS]
    
    if top_quality_words:
        add_or_update_items(top_quality_words)
    else:
        print("No quality words found.")

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
               (? * bm25_score + 
                ? * (CAST(click_count AS REAL) / (SELECT MAX(click_count) FROM autocomplete_items)) + 
                ? * CAST(is_doc_name AS REAL)) AS combined_score
        FROM autocomplete_items
        WHERE phrase LIKE ? || '%'
        ORDER BY combined_score DESC, length(phrase) ASC
        LIMIT ?
    ''', (BM25_WEIGHT, CLICK_COUNT_WEIGHT, DOC_NAME_WEIGHT, query.lower(), limit))
    
    suggestions = [row[0] for row in cursor.fetchall()]
    
    conn.close()
    
    return suggestions
