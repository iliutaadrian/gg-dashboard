from search.bm25_search import init as init_bm25, search as search_bm25
from search.openai_search import init as init_openai, search as search_openai
from collections import defaultdict

METHOD_WEIGHTS = {
    'bm25': 0.4,       
    'openai': 0.6,      
}

# Fusion method configurations
RANK_FUSION_K = 60  # Controls penalty for lower ranks
CASCADE_THRESHOLD = 0.65  # Minimum score to consider result good enough

def search(query, methods=[], weights=None, combination_method='linear'):
    all_results = {}
    for method in methods:
        if method == 'bm25':
            all_results[method] = search_bm25(query)
        elif method == 'openai':
            all_results[method] = search_openai(query)
    if combination_method == 'rank_fusion':
        return rank_fusion(all_results)
    else:
        raise ValueError(f"Unknown combination method: {combination_method}")

def rank_fusion(results):
    """
    Reciprocal Rank Fusion (RRF) with hardcoded k value.
    Each document gets a score of 1/(rank + k) from each method,
    where k reduces the impact of high rankings.
    
    A smaller k (e.g., 20) gives more weight to top results
    A larger k (e.g., 60) makes ranking more democratic
    """
    fused_scores = defaultdict(float)
    all_docs = {}
    rank_contributions = defaultdict(dict)
    
    for method, method_results in results.items():
        weight = METHOD_WEIGHTS.get(method, 1.0/len(results))
        
        for rank, result in enumerate(method_results, start=1):
            doc_id = result['path']
            all_docs[doc_id] = result
            
            # RRF score formula with method weight
            rrf_score = (1 / (rank + RANK_FUSION_K)) * weight
            fused_scores[doc_id] += rrf_score
            
            # Store contribution for debugging
            rank_contributions[doc_id][method] = {
                'rank': rank,
                'rrf_score': rrf_score,
                'weight': weight
            }
    
    # Normalize to 0-100
    max_score = max(fused_scores.values()) if fused_scores else 1
    for doc_id in fused_scores:
        fused_scores[doc_id] = (fused_scores[doc_id] / max_score) * 100
    
    sorted_results = sorted(fused_scores.items(), key=lambda x: x[1], reverse=True)
    
    final_results = []
    for doc_id, fused_score in sorted_results:
        result = all_docs[doc_id].copy()
        result['relevance_score'] = int(fused_score)
        result['rank_contributions'] = rank_contributions[doc_id]
        final_results.append(result)
    
    return final_results


