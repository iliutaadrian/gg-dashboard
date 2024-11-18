import re
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from typing import List, Set

nltk.download('punkt_tab')
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('omw-1.4')

# Initialize global objects (more efficient than creating them each time)
STEMMER = PorterStemmer()
STOP_WORDS = set(stopwords.words('english'))

# Add custom stop words that might not be helpful for search
CUSTOM_STOP_WORDS = {
    'etc', 'eg', 'ie', 'example', 'use', 'using', 'used', 'would', 'could', 
    'should', 'may', 'might', 'must', 'shall'
}
STOP_WORDS.update(CUSTOM_STOP_WORDS)

def get_custom_stop_words() -> Set[str]:
    """
    Return the combined set of stop words.
    This can be useful for debugging or adjusting stop words.
    """
    return STOP_WORDS

def clean_text(text, use_stemming = True): 
    if not isinstance(text, str):
        return ""
    
    # Convert to lowercase
    text = text.lower()
    
    # Remove URLs
    text = re.sub(r'http[s]?://\S+', '', text)
    
    # Remove email addresses
    text = re.sub(r'\S+@\S+', '', text)
    
    # Remove special characters and digits, replace with space
    text = re.sub(r'[^a-z\s]', ' ', text)
    
    # Remove extra whitespace
    text = ' '.join(text.split())
    
    # Tokenize
    try:
        tokens = word_tokenize(text)
    except Exception as e:
        print(f"Tokenization error: {e}")
        tokens = text.split()
    
    # Process tokens
    processed_tokens = []
    for token in tokens:
        if (len(token) >= 2 and  # Skip single characters
            token not in STOP_WORDS):  # Skip stop words
            if use_stemming:
                token = STEMMER.stem(token)
            if token:  # Only add non-empty tokens
                processed_tokens.append(token)
    
    # Join tokens back together
    return ' '.join(processed_tokens)

def find_snippet(text, query, snippet_length=100):
    query_terms = query.lower().split()
    text_lower = text.lower()
    
    # Find the earliest occurrence of any query term
    earliest_pos = len(text)
    for term in query_terms:
        pos = text_lower.find(term)
        if pos != -1 and pos < earliest_pos:
            earliest_pos = pos
    
    # If no term is found, return the beginning of the text
    if earliest_pos == len(text):
        return highlight_terms(text[:snippet_length] + "...", query)
    
    # Calculate snippet start and end
    start = max(0, earliest_pos - snippet_length // 2)
    end = min(len(text), start + snippet_length)
    
    # Adjust start if end is at text length
    if end == len(text):
        start = max(0, end - snippet_length)
    
    snippet = text[start:end]
    
    # Add ellipsis if snippet is not at the start or end of the text
    if start > 0:
        snippet = "..." + snippet
    if end < len(text):
        snippet = snippet + "..."
    
    return highlight_terms(snippet, query)

def highlight_terms(text, query):
    highlighted = text
    for term in query.split():
        if len(term) < 2:
            continue

        # Create a regular expression pattern for case-insensitive matching
        pattern = re.compile(re.escape(term), re.IGNORECASE)
        
        # Use the pattern to replace all occurrences with the highlighted version
        highlighted = pattern.sub(lambda m: f"<mark>{m.group()}</mark>", highlighted)
    
    return highlighted
