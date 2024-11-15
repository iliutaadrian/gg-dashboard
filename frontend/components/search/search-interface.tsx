import React, { useState, useEffect } from 'react';
import { Search, X, ExternalLink, BookOpen, FileText, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from "@/lib/utils";
import axios from 'axios';

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
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
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
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [debouncedQuery]);

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const response = await axios.get(`/api/search?q=${searchQuery}`);
      const resultsWithCategories = response.data.search_results.map(result => ({
        ...result,
        category: getDocumentCategory(result.path)
      }));
      setResults(resultsWithCategories);
      setSuggestions([]);
    } catch (error) {
      console.error('Search failed:', error);
    }
    setLoading(false);
  };

  const filteredResults = results.filter(result =>
    activeTab === 'all' || result.category === activeTab
  );

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto pt-32 px-4">
        <div className="text-5xl font-bold mb-8 text-center">
          <span className="text-primary">GG</span>
          {' '}
          <span className="text-white">Docs</span>
        </div>

        <div className="relative">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="h-14 bg-white/5 border-0 text-white placeholder:text-white/50 text-lg focus-visible:ring-white/20"
            placeholder="Search documents..."
          />
          <Search 
            className={`absolute right-4 top-4 h-6 w-6 text-white/50 ${loading ? 'animate-spin' : ''}`}
            onClick={() => !loading && handleSearch()}
          />
          
          {suggestions.length > 0 && (
            <Card className="absolute w-full mt-2 bg-white/5 border-0 backdrop-blur-sm">
              <ul className="py-2">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 text-white/70 hover:bg-white/10 cursor-pointer"
                    onClick={() => {
                      setQuery(suggestion);
                      handleSearch(suggestion);
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        <div className="flex w-full border-b border-white/10 mt-8 mb-6">
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
                    : "border-transparent text-white/50 hover:text-white hover:border-white/20"
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

        <div className="mt-8 space-y-2">
          {filteredResults.map((result, index) => (
            <div 
              key={index}
              className="group p-4 hover:bg-white/5 rounded-lg cursor-pointer transition-all"
              onClick={() => window.open(result.path, '_blank')}
            >
              <div className="flex justify-between items-start gap-4 mb-1">
                <h3 
                  className="text-lg font-medium text-white group-hover:text-primary"
                  dangerouslySetInnerHTML={{ __html: result.highlighted_name }}
                />
                <span className="text-sm text-white/40 shrink-0">
                  Score: {Math.round(result.relevance_score)}
                </span>
              </div>
              <p 
                className="text-white/60 text-sm mb-2 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: result.content_snippet }}
              />
              <div className="flex items-center gap-2">
                <span className="text-xs bg-white/10 text-white/70 px-2 py-0.5 rounded">
                  {result.path.split('/').pop()}
                </span>
                <span className="text-xs text-white/40">
                  {(result.content_length / 1024).toFixed(1)}kb
                </span>
              </div>
            </div>
          ))}
          
          {filteredResults.length === 0 && query && !loading && (
            <div className="text-center py-12">
              <p className="text-white/50 text-lg">No results found</p>
              <p className="text-white/30 text-sm mt-2">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </div>

      {preview && (
        <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
          <DialogContent className="max-w-4xl h-[90vh] p-0 bg-white/5 border-0">
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <h2 className="text-lg text-white font-medium">{preview.title}</h2>
              <div className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-white/70 cursor-pointer" 
                  onClick={() => window.open(preview.fileUrl, '_blank')}
                />
                <X className="h-5 w-5 text-white/70 cursor-pointer" 
                  onClick={() => setPreview(null)}
                />
              </div>
            </div>
            <div className="p-6 overflow-auto text-white/90" 
              dangerouslySetInnerHTML={{ __html: preview.content }} 
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SearchInterface;
