from search.bm25_search import init as init_bm25, search as search_bm25
from search.openai_search import init as init_openai, search as search_openai
from search.hybrid_search import search as hybrid_search

def perform_search(query, aggregation_method, syntactic_methods, semantic_methods):
    all_methods = syntactic_methods + semantic_methods
    return hybrid_search(query, methods=all_methods, combination_method=aggregation_method)
    

def get_search_function(method):
    search_functions = {
        'bm25': search_bm25,
        'openai': search_openai,
    }
    return search_functions.get(method.lower(), search_fulltext)


def init_search_module(docs):
    init_bm25(docs)
    init_openai(docs)
