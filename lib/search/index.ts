// lib/search/index.ts
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { BM25Retriever } = require("langchain/retrievers/bm25");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { Chroma } = require("langchain/vectorstores/chroma");
const { OpenAI } = require("langchain/llms/openai");
const { loadDocuments } = require("./document-loader");
const { SEARCH_CONFIG } = require("./config");
const path = require('path');

class HybridSearch {
  constructor() {
    this.llm = new OpenAI({
      temperature: SEARCH_CONFIG.temperature,
      modelName: SEARCH_CONFIG.modelName,
    });
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      console.log('Loading documents...');
      const docs = await loadDocuments(
        path.join(process.cwd(), SEARCH_CONFIG.docsDir)
      );

      console.log('Splitting documents...');
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: SEARCH_CONFIG.chunkSize,
        chunkOverlap: SEARCH_CONFIG.chunkOverlap,
      });
      const splitDocs = await splitter.splitDocuments(docs);

      console.log('Initializing BM25...');
      this.bm25Retriever = await BM25Retriever.fromDocuments(splitDocs);

      console.log('Initializing vector store...');
      this.vectorStore = await Chroma.fromDocuments(
        splitDocs,
        new OpenAIEmbeddings(),
        SEARCH_CONFIG.vectorStore
      );

      this.initialized = true;
      console.log('Search system initialized successfully');
    } catch (error) {
      console.error('Error initializing search:', error);
      throw error;
    }
  }

  reciprocalRankFusion(bm25Results, vectorResults) {
    const scores = new Map();
    const k = SEARCH_CONFIG.fusionK;
    
    bm25Results.forEach((doc, i) => {
      const key = doc.metadata.source;
      scores.set(key, (scores.get(key) || 0) + 1 / (k + i));
    });

    vectorResults.forEach((doc, i) => {
      const key = doc.metadata.source;
      scores.set(key, (scores.get(key) || 0) + 1 / (k + i));
    });

    const combinedResults = Array.from(scores.entries())
      .sort(([, a], [, b]) => b - a)
      .map(([source, score]) => {
        const doc = [...bm25Results, ...vectorResults]
          .find(d => d.metadata.source === source);

        if (!doc) throw new Error(`Document not found for source: ${source}`);
        
        return {
          title: doc.metadata.title,
          snippet: this.generateSnippet(doc.pageContent),
          type: doc.metadata.type,
          url: doc.metadata.url,
          score
        };
      });

    return combinedResults;
  }

  generateSnippet(content) {
    return content
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 200) + '...';
  }

  async generateAISummary(query, results) {
    const prompt = `Analyze and summarize these search results for the query "${query}":
      ${results.slice(0, 3).map(r => `
      Title: ${r.title}
      Content: ${r.snippet}
      Type: ${r.type}
      `).join('\n')}
      
      Provide a concise summary that:
      1. Highlights the main themes and connections
      2. Points out any important insights
      3. Suggests potential next steps or related topics
      
      Summary:`;

    return await this.llm.predict(prompt);
  }

  async search(query) {
    if (!this.initialized) {
      await this.initialize();
    }

    const [bm25Results, vectorResults] = await Promise.all([
      this.bm25Retriever.getRelevantDocuments(query),
      this.vectorStore.similaritySearch(query, SEARCH_CONFIG.retrievalK),
    ]);

    const fusedResults = this.reciprocalRankFusion(
      bm25Results,
      vectorResults
    );

    const summary = await this.generateAISummary(query, fusedResults);

    return { results: fusedResults, summary };
  }
}

module.exports = { HybridSearch };
