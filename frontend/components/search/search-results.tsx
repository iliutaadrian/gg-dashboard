import React, { useState } from 'react';
import SearchResult from './SearchResult';
import { FilePreview } from './FilePreview';

const SearchResultsContainer = ({ results }) => {
  const [previewState, setPreviewState] = useState({
    isOpen: false,
    path: '',
    title: '',
    fileType: 'text',
    content: ''
  });

  const handlePreview = async ({ path, title, fileType }) => {
    try {
      // Fetch the file content
      const response = await fetch(`/api/docs/${path}`);
      const content = await response.text();
      
      setPreviewState({
        isOpen: true,
        path,
        title,
        fileType,
        content
      });
    } catch (error) {
      console.error('Failed to fetch file content:', error);
    }
  };

  const handleClosePreview = () => {
    setPreviewState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="space-y-4">
      {results.map((result, index) => (
        <SearchResult
          key={index}
          result={result}
          onPreview={handlePreview}
          onClick={(result) => {
            // Handle any additional click actions
            console.log('Result clicked:', result);
          }}
        />
      ))}

      <FilePreview
        isOpen={previewState.isOpen}
        onClose={handleClosePreview}
        fileUrl={`/api/docs/${previewState.path}`}
        fileType={previewState.fileType}
        title={previewState.title}
        content={previewState.content}
      />
    </div>
  );
};

export default SearchResultsContainer;
