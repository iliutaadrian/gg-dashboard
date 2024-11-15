import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Settings, BookOpen, FileText, BarChart3, Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import axios from 'axios';
import { useDebounce } from '@/hooks/use-debounce';
import { FilePreview } from '@/components/search/file-preview';
import SearchInput from './search-input';

const getDocumentCategory = (path) => {
  const categoryMap = {
    '/app/docs/wiki': 'wiki',
    '/app/docs/kb': 'kb',
    '/app/docs/reports': 'reports'
  };
  return Object.entries(categoryMap).find(([prefix]) => path.startsWith(prefix))?.[1] || 'other';
};

const tabs = [
  { id: 'all', label: 'All', icon: Search },
  { id: 'wiki', label: 'Wiki', icon: BookOpen },
  { id: 'kb', label: 'Knowledge Base', icon: FileText },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
];

export const SearchResults = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState([]);
  const [aiSummary, setAiSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await axios.get(`/api/autocomplete?q=${debouncedQuery}`);
        setSuggestions(response.data);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleSearch = async (searchQuery = query) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/search?q=${searchQuery}`);
      const resultsWithCategories = response.data.search_results.map(result => ({
        ...result,
        category: getDocumentCategory(result.path)
      }));
      setResults(resultsWithCategories);
      setAiSummary(response.data.ai_response);
      setSuggestions([]);
    } catch (error) {
      console.error('Search failed:', error);
    }
    setLoading(false);
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

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col items-center justify-start pt-12 px-4">
        <div className="text-5xl font-bold mb-8">
          <span className="text-primary">GG</span>
          {' '}
          <span className="text-foreground">Docs</span>
        </div>

        <SearchInput
          query={query}
          setQuery={setQuery}
          loading={loading}
          handleSearch={handleSearch}
          suggestions={suggestions}
          setSuggestions={setSuggestions}
        />

        {preview && (
          <FilePreview
            isOpen={!!preview}
            onClose={() => setPreview(null)}
            {...preview}
          />
        )}

        {aiSummary && (
          <Card className="w-full max-w-3xl mb-6 bg-primary/5 border-muted-foreground">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold text-primary">AI Summary</span>
              </div>
              <p className="text-foreground text-sm">{aiSummary}</p>
            </CardContent>
          </Card>
        )}

        <div className="flex w-full max-w-3xl border-b border-muted-foreground mb-6">
          {tabs.map((tab) => {
            const count = results.filter(r =>
              tab.id === 'all' ? true : r.category === tab.id
            ).length;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-white hover:border-muted-foreground"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                {count > 0 && (
                  <span className="ml-1 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="w-full max-w-3xl space-y-4">
          {loading ? (
            <div className="text-center text-muted-foreground">Searching...</div>
          ) : filteredResults.length > 0 ? (
            filteredResults.map((result, index) => (
              <Card
                key={index}
                className="bg-primary/5 border-muted-foreground hover:bg-primary/10 transition-colors cursor-pointer"
                onClick={() => handlePreview(result)}
              >
                <CardContent className="pt-6">
                  <h3
                    className="text-lg font-semibold text-white mb-2"
                    dangerouslySetInnerHTML={{ __html: result.highlighted_name }}
                  />
                  <p
                    className="text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: result.content_snippet }}
                  />
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary capitalize">
                      {result.category}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      Score: {Math.round(result.relevance_score)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : query && (
            <div className="text-center text-muted-foreground">No results found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
