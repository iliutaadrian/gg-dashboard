const { HybridSearch } = require('../lib/search');

async function initializeSearch() {
  console.log('Initializing search system...');
  
  try {
    const search = new HybridSearch();
    await search.initialize();
    console.log('Search system initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing search:', error);
    process.exit(1);
  }
}

initializeSearch();
