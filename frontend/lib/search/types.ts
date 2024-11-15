export interface SearchResult {
  title: string;
  snippet: string;
  type: 'wiki' | 'kb' | 'reports';
  url: string;
  score: number;
}

export interface SearchResponse {
  results: SearchResult[];
  summary: string;
}

export interface DocumentMetadata {
  source: string;
  title?: string;
  type: 'wiki' | 'kb' | 'reports';
  url: string;
}
