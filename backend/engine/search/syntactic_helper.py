import re
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer, WordNetLemmatizer
import string
from urllib.parse import urlparse

nltk.download('punkt_tab')
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('omw-1.4')

# Tokenization: The process of breaking text into individual words or tokens
# - Splits text at word boundaries, punctuation, etc.
# - Preserves the original form of words
# - Is the first step in text processing before stemming or lemmatization

# Stemming: Removes word endings to get the word stem (often crude/aggressive)
# - Fast but imprecise algorithm that chops off word endings
# - Can produce non-words (e.g., "running" → "run")
# - Doesn't consider word context or part of speech
STEMMER = PorterStemmer()

# Lemmatization: Converts words to their dictionary base form (more accurate)
# - Uses vocabulary and morphological analysis to get the base form
# - Considers the context and part of speech
# - Always produces valid words
LEMMATIZER = WordNetLemmatizer()
STOP_WORDS = set(stopwords.words('english'))

# Add custom stop words that might not be helpful for search
CUSTOM_STOP_WORDS = {
    'etc', 'eg', 'ie', 'example', 'use', 'using', 'used', 'would', 'could', 
    'should', 'may', 'might', 'must', 'shall', 'com'
}
STOP_WORDS.update(CUSTOM_STOP_WORDS)

def get_custom_stop_words():
    return STOP_WORDS


def extract_domain_from_url(url):
    try:
        parsed = urlparse(url)
        return parsed.netloc
    except:
        return ""

def replace_urls_with_domains(text):
    # Find all URLs in the text
    url_pattern = r'https?://[^\s)"]+'
    urls = re.findall(url_pattern, text)
    
    # Replace each URL with its domain
    processed_text = text
    for url in urls:
        domain = extract_domain_from_url(url)
        if domain:
            processed_text = processed_text.replace(url, domain)
    
    return processed_text

def clean_text(text, 
               use_stemming=False, 
               use_lemmatization=True, 
               min_token_length=2):
    """
    Clean and normalize text for document indexing.
    
    Args:
        text: The text to clean
        use_stemming: Whether to apply stemming
        use_lemmatization: Whether to apply lemmatization
        min_token_length: Minimum token length to keep
        
    Returns:
        str: Cleaned text
    """
    if not isinstance(text, str):
        return ""
    
    # Replace URLs with domains before processing
    text_with_domains = replace_urls_with_domains(text)

    # Remove figure references (Fig. X.X.X.) but keep the caption text
    # Pattern matches variations like "Fig.", "Figure", "FIG" followed by numbers and dots
    fig_pattern = r'(?i)(fig(?:ure)?\.?\s+\d+(?:\.\d+)*\.?)\s+'
    text = re.sub(fig_pattern, '', text)
    
    # Convert to lowercase
    text = text_with_domains.lower()
    
    # Replace punctuation with spaces
    translator = str.maketrans({c: ' ' for c in string.punctuation})
    text = text.translate(translator)
    
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
        # Skip tokens that are too short
        if len(token) < min_token_length:
            continue
            
        # Skip stop words
        if token in STOP_WORDS:
            continue
        
        # Apply lemmatization (gentler than stemming)
        if use_lemmatization:
            token = LEMMATIZER.lemmatize(token)
        
        # Apply stemming if requested (more aggressive)
        if use_stemming:
            token = STEMMER.stem(token)
        
        if token:  # Only add non-empty tokens
            processed_tokens.append(token)
    
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
