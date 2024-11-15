// lib/search/document-loader.ts
const { DirectoryLoader } = require("langchain/document_loaders/fs/directory");
const { TextLoader } = require("langchain/document_loaders/fs/text");
const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const { DocxLoader } = require("langchain/document_loaders/fs/docx");
const { JSONLoader } = require("langchain/document_loaders/fs/json");
const { CSVLoader } = require("langchain/document_loaders/fs/csv");
const { UnstructuredMarkdownLoader } = require("langchain/document_loaders/fs/unstructured/markdown");
const { Document } = require("langchain/document");
const path = require('path');
const { SEARCH_CONFIG } = require('./config');

const loadCategoryDocuments = async (basePath, category) => {
  const categoryPath = path.join(basePath, category);
  
  const loader = new DirectoryLoader(categoryPath, {
    ".txt": (path) => new TextLoader(path),
    ".md": (path) => new UnstructuredMarkdownLoader(path),
    ".mdx": (path) => new UnstructuredMarkdownLoader(path),
    ".pdf": (path) => new PDFLoader(path),
    ".docx": (path) => new DocxLoader(path),
    ".json": (path) => new JSONLoader(path),
    ".csv": (path) => new CSVLoader(path),
  });

  const docs = await loader.load();

  return docs.map(doc => {
    const filename = doc.metadata.source.split('/').pop() || '';
    const title = filename.replace(/\.[^/.]+$/, "");

    return new Document({
      pageContent: doc.pageContent,
      metadata: {
        source: path.join(category, filename),
        type: category,
        title,
        url: `/docs/${category}/${filename}`
      }
    });
  });
};

const loadDocuments = async (basePath = path.join(process.cwd(), SEARCH_CONFIG.docsDir)) => {
  const categories = ['kb', 'reports', 'wiki'];
  const allDocs = [];

  for (const category of categories) {
    try {
      console.log(`Loading documents from ${category}...`);
      const docs = await loadCategoryDocuments(basePath, category);
      allDocs.push(...docs);
    } catch (error) {
      console.error(`Error loading documents from ${category}:`, error);
    }
  }

  return allDocs;
};

module.exports = { loadDocuments };
