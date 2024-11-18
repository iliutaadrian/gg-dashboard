import os
import pickle
from rank_bm25 import BM25Okapi
from config.config import DATA_FOLDER
from engine.search.syntactic_helper import clean_text, find_snippet, highlight_terms

# Global variables
documents = None
bm25 = None
tokenized_corpus = None

# Path for model storage
BM25_MODEL_PATH = os.path.join(DATA_FOLDER, "bm25_model.pkl")

def load_bm25_model():
    """Load BM25 model and tokenized corpus"""
    if os.path.exists(BM25_MODEL_PATH):
        with open(BM25_MODEL_PATH, 'rb') as f:
            data = pickle.load(f)
            return data['bm25'], data['tokenized_corpus']
    return None, None

def init(docs):
    global documents, bm25, tokenized_corpus
    
    documents = docs
    
    # Try to load existing BM25 model
    bm25, tokenized_corpus = load_bm25_model()
    
    if bm25 is None or tokenized_corpus is None:
        # Process documents for BM25
        processed_docs = [f"{doc['name']} {doc['content']}" for doc in docs]
        tokenized_corpus = [doc.split() for doc in processed_docs]
        
        # Initialize BM25
        bm25 = BM25Okapi(tokenized_corpus)
        
        # Store the model
        with open(BM25_MODEL_PATH, 'wb') as f:
            pickle.dump({
                'bm25': bm25,
                'tokenized_corpus': tokenized_corpus
            }, f)
    
    print(f"BM25 search initialized with {len(documents)} documents.")

def search(query, k=5):
    if bm25 is None:
        raise ValueError("BM25 search not initialized. Call init() first.")
    
    # Process query
    processed_query = clean_text(query)
    query_terms = processed_query.split()
    
    # Get BM25 scores directly from the model
    doc_scores = bm25.get_scores(query_terms)
    
    # Get top k document indices
    top_k_indices = doc_scores.argsort()[-k:][::-1]
    
    # Format results
    search_results = []
    for idx in top_k_indices:
        doc = documents[idx]
        score = float(doc_scores[idx])
        
        # Skip documents with zero relevance
        if score == 0:
            continue
            
        content = doc['content']
        original_content = doc['original_content']
        
        search_results.append({
            "path": doc['path'],
            "highlighted_name": highlight_terms(doc['name'], query),
            "content_snippet": find_snippet(content, query),
            "content": content,
            "original_content": original_content,
            "highlighted_content": highlight_terms(original_content, query),
            "content_length": len(original_content),
            "relevance_score": score
        })
    
    return search_results
