import { HybridSearch } from '../lib/search';
import * as readline from 'readline';

async function interactiveSearch() {
  try {
    console.log('Initializing search system...');
    const search = new HybridSearch();
    await search.initialize();
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log('\nSearch system initialized! Enter your queries (type "exit" to quit)');

    const askQuery = () => {
      rl.question('\nEnter search query: ', async (query) => {
        if (query.toLowerCase() === 'exit') {
          rl.close();
          process.exit(0);
        }

        try {
          const results = await search.search(query);
          
          console.log('\n=== AI Summary ===');
          console.log(results.summary);
          
          console.log('\n=== Search Results ===');
          results.results.forEach((result, index) => {
            console.log(`\n${index + 1}. ${result.title}`);
            console.log(`Type: ${result.type}`);
            console.log(`Score: ${result.score.toFixed(4)}`);
            console.log(`URL: ${result.url}`);
            console.log('Snippet:', result.snippet);
          });

          // Ask for next query
          askQuery();
        } catch (error) {
          console.error('Error performing search:', error);
          askQuery();
        }
      });
    };

    askQuery();

  } catch (error) {
    console.error('Error initializing search:', error);
    process.exit(1);
  }
}

interactiveSearch();
