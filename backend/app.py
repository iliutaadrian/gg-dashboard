from flask import Flask, jsonify, render_template, request, send_from_directory
from routes.test_routes import test_routes
from routes.search_routes import search_routes
from dotenv import load_dotenv

import sys
sys.path.extend([
    'engine',
    'engine/search',
    'config',
    'routes'
])

from document_processor import init_processor
from search_module import init_search_module
from autocomplete.autocomplete_module import init_autocomplete

app = Flask(__name__)

# Tests:
# - GET  /api/tests/fetch-data
# - GET  /api/tests/get_test_diff
# - GET  /api/tests/get_test

# Search:
# - POST /api/search/

# Register blueprints
app.register_blueprint(test_routes, url_prefix='/api/tests')
app.register_blueprint(search_routes, url_prefix='/api/search')

@app.route("/docs/<path:filepath>")
def serve_docs(filepath):
    return send_from_directory('docs', filepath)

@app.route("/")
def index():
    return render_template("index.html", data=[])

if __name__ == "__main__":
    print("\nInitializing documents", flush=True)
    indexed_count, documents = init_processor()

    print("\nInitializing search module", flush=True)
    init_search_module(documents)

    # print("\nInitializing cache module", flush=True)
    # init_cache_module()

    print("\nInitializing autocomplete module", flush=True)
    init_autocomplete(documents, indexed_count)

    # print("\nInitializing LLM module", flush=True)
    # init_llm()

    app.run(debug=True, host="0.0.0.0", port=6969)
