export const SEARCH_CONFIG = {
  // Document processing
  chunkSize: 1000,
  chunkOverlap: 200,
  
  // Search parameters
  retrievalK: 10,  // Number of documents to retrieve from each retriever
  fusionK: 60,     // Rank fusion constant
  
  // OpenAI configuration
  modelName: "gpt-3.5-turbo",
  temperature: 0.3,
  
  // Vector store settings
  vectorStore: {
    collectionName: "gg-docs",
    distance: "cosine",
  },
  
  // Base directory for documents
  docsDir: 'docs-gg',
  
  // Cache settings
  cache: {
    ttl: 1000 * 60 * 60, // 1 hour
    maxSize: 100,        // Maximum number of cached queries
  }
};
