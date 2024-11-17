from flask import Blueprint, jsonify, request
import json

from engine.search.search_module import perform_search
from engine.autocomplete.autocomplete_module import get_autocomplete_suggestions, update_click_count
from engine.llm.llm_module import generate_ai_response
from engine.cache.cache_module import get_results, store_results

search_routes = Blueprint('search_routes', __name__)


@search_routes.route('/', methods=['GET'])
def search():
    query = request.args.get('q', '')
    aggregation_method = request.args.get('aggregationMethod', 'rank_fusion')
    
    syntactic_methods = ['bm25']
    semantic_methods = ['openai']
    options = ['ai_assist', 'caching']

    if not query:
        return jsonify({"error": "No query provided"}), 400

    update_click_count(query)

    search_methods = syntactic_methods + semantic_methods

    if 'caching' in options:
        cached_results = get_results(query, aggregation_method, search_methods, options)
        if cached_results:
            return jsonify(cached_results)

    results = perform_search(query, aggregation_method, syntactic_methods, semantic_methods)

    ai_response = None
    if 'ai_assist' in options:
        ai_response = generate_ai_response(query, results[:3])
    
    response = {
        "search_results": results[:10],
        "ai_response": ai_response.get('full_content', '') if ai_response else None
    }

    if 'caching' in options:
        store_results(query, aggregation_method, search_methods, options, results, response.get('ai_response'))
    
    return jsonify(response)

@search_routes.route('/autocomplete', methods=['GET'])
def autocomplete():
    query = request.args.get('q', '')
    if not query:
        return jsonify([])
    
    suggestions = get_autocomplete_suggestions(query)
    print(suggestions, flush=True)
    return jsonify(suggestions)

@search_routes.route('/update_click_count', methods=['POST'])
def update_click():
    data = request.json
    phrase = data.get('query')
    if not phrase:
        return jsonify({"error": "No phrase provided"}), 400
    
    update_click_count(phrase)
    return jsonify({"success": True, "message": "Click count updated"})

