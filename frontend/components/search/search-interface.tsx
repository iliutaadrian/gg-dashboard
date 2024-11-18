import React, { useState } from 'react';
import { BookOpen, FileText, BarChart3, Search, Brain, TrendingUp } from "lucide-react";
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

  const popularSearches = [
    { icon: '🚀', query: 'what are the ggstest deploy commands' },
    { icon: '🗄️', query: 'fix postgress error export' },
    { icon: '☁️', query: 'who do i contact to get aws access' },
    { icon: '🌳', query: 'what type of branches can we have on github' },
    { icon: '🎨', query: 'what class should i use for a small button' },
    { icon: '💻', query: 'how to install setup onlocalhost' }
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
  const [currentQuery, setCurrentQuery] = useState('');

  const handleSearch = async (searchQuery) => {
    setLoading(true);
    setCurrentQuery(searchQuery); // Update the current query
    setAiSummary('');
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

  const handlePopularSearchClick = (query) => {
    handleSearch(query);
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

    if (results.length === 0) {
      return (
        <div className="space-y-8">
          {currentQuery && (
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground mb-2">
                No results found for "{currentQuery}"
              </p>
              <p className="text-sm text-muted-foreground">
                Try different keywords or browse popular searches below
              </p>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Popular Searches</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {popularSearches.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handlePopularSearchClick(item.query)}
                  className="flex items-center gap-3 p-4 text-sm text-left rounded-lg border border-border hover:bg-accent transition-colors duration-200"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-foreground">{item.query}</span>
                </button>
              ))}
            </div>
          </div>
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
            <SearchInput 
              onSearch={handleSearch} 
              className="w-full"
              initialQuery={currentQuery} 
            />
          </div>

          {aiSummary && (
            <Card className="w-full mb-5 border-muted-foreground/10">
              <CardContent className="p-6">
                <pre className="flex items-center gap-2 mb-4">
                  <Brain className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold text-primary">AI Summary</span>
                </pre>
                <p className="text-foreground text-sm leading-relaxed">{aiSummary}</p>
              </CardContent>
            </Card>
          )}

          {results.length > 0 && (
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
                        : "border-transparent hover:text-white hover:border-muted-foreground"
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
          )}

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
