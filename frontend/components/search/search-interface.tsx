import React, { useState } from 'react';
import { BookOpen, FileText, BarChart3, Search, Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import axios from 'axios';
import SearchInput from './search-input';
import SearchResult from './search-result';
import { FilePreview } from './file-preview';

const tabs = [
  { id: 'all', label: 'All', icon: Search },
  { id: 'wiki', label: 'Wiki', icon: BookOpen },
  { id: 'kb', label: 'Knowledge Base', icon: FileText },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
];

const getDocumentCategory = (path) => {
  const categoryMap = {
    '/app/docs/wiki': 'wiki',
    '/app/docs/kb': 'kb',
    '/app/docs/reports': 'reports'
  };
  return Object.entries(categoryMap).find(([prefix]) => path.startsWith(prefix))?.[1] || 'other';
};

const SearchInterface = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [results, setResults] = useState([]);
  const [preview, setPreview] = useState(null);
  const [aiSummary, setAiSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/search?q=${searchQuery}`);
      const resultsWithCategories = response.data.search_results.map(result => ({
        ...result,
        category: getDocumentCategory(result.path)
      }));
      setResults(resultsWithCategories);
      setAiSummary(response.data.ai_response);
      return response;
    } catch (error) {
      console.error('Search failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (result) => {
    const filePath = result.path.replace('/app/docs/', '');
    const fileType = filePath.split('.').pop().toLowerCase();

    if (['pdf', 'docx', 'md'].includes(fileType)) {
      setPreview({
        fileUrl: `http://localhost:6969/docs/${filePath}`,
        fileType,
        title: filePath,
        content: result.highlighted_content
      });
    }
  };

  const filteredResults = results.filter(result =>
    activeTab === 'all' || result.category === activeTab
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <div className="animate-spin w-6 h-6 border-2 rounded-full mx-auto mb-4" />
          Searching...
        </div>
      );
    }

    if (filteredResults.length === 0) {
      return (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground mb-2">
            {results.length > 0 ? 'No matches found in this category' : 'Search for documents...'}
          </p>
          {results.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Try selecting a different category or adjusting your search terms
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {filteredResults.map((result, index) => (
          <SearchResult
            key={index}
            result={result}
            onClick={handlePreview}
            onResultClick={() => setSuggestions([])}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col items-center justify-start px-6 py-16">
        <div className="w-full max-w-5xl mx-auto">
          <div className="text-5xl font-bold mb-10 text-center">
            <span className="text-primary">GG</span>
            {' '}
            <span className="text-foreground">Docs</span>
          </div>

          <div className="w-full mb-5">
            <SearchInput onSearch={handleSearch} className="w-full" />
          </div>

          {aiSummary && (
            <Card className="w-full mb-5 bg-primary/5 border-muted-foreground">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold text-primary">AI Summary</span>
                </div>
                <p className="text-foreground text-sm leading-relaxed">{aiSummary}</p>
              </CardContent>
            </Card>
          )}

          <div className="flex w-full border-b border-muted-foreground/20 mb-8">
            {tabs.map((tab) => {
              const count = results.filter(r =>
                tab.id === 'all' ? true : r.category === tab.id
              ).length;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent  hover:text-white hover:border-muted-foreground"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                  {count > 0 && (
                    <span className="ml-1.5 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {renderContent()}
        </div>

        {preview && (
          <FilePreview
            isOpen={!!preview}
            onClose={() => setPreview(null)}
            {...preview}
          />
        )}
      </div>
    </div>
  );
};

export default SearchInterface;
