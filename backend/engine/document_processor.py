import os
import sqlite3
from typing import List, Dict, Any
import re

from langchain_community.document_loaders import (
    UnstructuredMarkdownLoader,
    PDFMinerLoader,
    TextLoader,
    UnstructuredHTMLLoader,
    Docx2txtLoader
)
from langchain_core.documents import Document

from config.config import DATA_FOLDER, DB_PATH, DOCS_FOLDER
from search.syntactic_helper import clean_text

# Map file extensions to appropriate LangChain loaders
LOADER_MAPPING = {
    '.md': UnstructuredMarkdownLoader,
    '.pdf': PDFMinerLoader,
    '.txt': TextLoader,
    '.html': UnstructuredHTMLLoader,
    '.docx': Docx2txtLoader
}

def init_db():
    """Initialize SQLite database with FTS5 virtual table"""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE VIRTUAL TABLE IF NOT EXISTS documents USING fts5(
                 path UNINDEXED,
                 name,
                 content,
                 original_content,
                 last_modified UNINDEXED
               )''')
    conn.commit()
    conn.close()
    print(f"Database initialized at {DB_PATH}")

def load_document(file_path: str) -> str:
    """
    Load a document using the appropriate LangChain loader based on file extension
    Returns the raw content as a string
    """
    _, ext = os.path.splitext(file_path)
    
    if ext not in LOADER_MAPPING:
        raise ValueError(f"Unsupported file extension: {ext}")
    
    loader_class = LOADER_MAPPING[ext]
    loader = loader_class(file_path)
    
    try:
        # Load document and get its content
        documents = loader.load()
        if not documents:
            return ""
        # Just return the raw content - no splitting needed
        return documents[0].page_content
    except Exception as e:
        print(f"Error loading {file_path}: {str(e)}")
        return ""

def extract_doc_name(path: str) -> str:
    """Extract and clean document name from path"""
    file_name = os.path.basename(path)
    file_name = os.path.splitext(file_name)[0]
    file_name = re.sub(r'\[.*?\]', '', file_name)
    return file_name.strip()

def index_documents() -> int:
    """Index all documents in the DOCS_FOLDER using LangChain tools"""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    indexed_count = 0
    
    for root, _, files in os.walk(DOCS_FOLDER):
        for file in files:
            file_path = os.path.join(root, file)
            _, ext = os.path.splitext(file)
            
            if ext not in LOADER_MAPPING:
                continue
                
            last_modified = os.path.getmtime(file_path)
            
            c.execute("SELECT last_modified FROM documents WHERE path = ?", (file_path,))
            result = c.fetchone()
            
            if not result or result[0] < last_modified:
                try:
                    # Load document content directly
                    original_content = load_document(file_path)
                    
                    if not original_content:
                        continue
                        
                    # Process the content
                    optimized_content = clean_text(original_content)
                    name = extract_doc_name(file_path)
                    path = file_path.replace(DOCS_FOLDER, '')
                    
                    c.execute("""INSERT OR REPLACE INTO documents 
                                 (path, name, content, original_content, last_modified) 
                                 VALUES (?, ?, ?, ?, ?)""",
                              (file_path, name, optimized_content, 
                               original_content, last_modified))
                    
                    indexed_count += 1
                    print(f"Indexed: {file_path}")
                    
                except Exception as e:
                    print(f"Error processing {file_path}: {str(e)}")
                    continue
            else:
                print(f"Skipping unchanged file: {file_path}")
    
    conn.commit()
    conn.close()
    print(f"Indexed or updated {indexed_count} documents")
    return indexed_count

def get_all_documents() -> List[Dict[str, Any]]:
    """Retrieve all documents from the database"""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT path, name, content, original_content FROM documents")
    documents = [{"path": path, "name": name, "content": opt_content, "original_content": orig_content} 
                 for path, name, opt_content, orig_content in c.fetchall()]
    conn.close()
    print(f"Fetched {len(documents)} documents from the database")
    return documents

def init_processor() -> tuple[int, List[Dict[str, Any]]]:
    """Initialize the document processor and return indexed count and documents"""
    init_db()
    indexed_count = index_documents()
    return indexed_count, get_all_documents()
