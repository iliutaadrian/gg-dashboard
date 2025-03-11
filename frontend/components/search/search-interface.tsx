// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, BarChart3, Search, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from 'axios';
import SearchInput from './search-input';
import SearchResult from './search-result';
import { FilePreview } from './file-preview';
import AIResponse from './ai-response';

// Define types
interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface PopularSearch {
  icon: string;
  query: string;
  link?: string;
}

interface SearchResultItem {
  path: string;
  highlighted_content: string;
  content?: string;
  title?: string;
  category?: string;
}

interface PreviewData {
  fileUrl: string;
  fileType: string;
  title: string;
  content: string;
}

const tabs: Tab[] = [
  { id: 'all', label: 'All', icon: Search },
  { id: 'wiki', label: 'Wiki', icon: BookOpen },
  { id: 'kb', label: 'Knowledge Base', icon: FileText },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
];

const popularSearches: PopularSearch[] = [
  { icon: '🚀', query: 'what are the ggstest deploy commands' },
  { icon: '🗄️', query: 'fix postgress error export' },
  { icon: '☁️', query: 'who do i contact to get aws access' },
  { icon: '🌳', query: 'what type of branches can we have on github' },
  { icon: '🎨', query: 'what class should i use for a small button' },
  { icon: '💻', query: 'how to install setup onlocalhost' }
];

const starterSearches: PopularSearch[] = [
  { icon: '💻', query: 'Home', link: "https://github.com/golfgenius/golfgenius/wiki"},
  { icon: '🚀', query: 'Engineering Resources', link: "https://github.com/golfgenius/golfgenius/wiki/Engineering-Support-Resources" },
  { icon: '🗄️', query: 'Onboarding', link: "https://github.com/golfgenius/golfgenius/wiki/Onboarding-Checklist" },
];

const getDocumentCategory = (path: string): string => {
  const categoryMap: Record<string, string> = {
    '/app/docs/wiki': 'wiki',
    '/app/docs/kb': 'kb',
    '/app/docs/reports': 'reports'
  };
  return Object.entries(categoryMap).find(([prefix]) => path.startsWith(prefix))?.[1] || 'other';
};

export default function SearchInterface() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [aiAssistEnabled, setAiAssistEnabled] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [pageLoaded, setPageLoaded] = useState<boolean>(false);
  const [animateItems, setAnimateItems] = useState<boolean>(false);

  // Handle initial animations
  useEffect(() => {
    setPageLoaded(true);
    // Delay the animation of individual items
    const timer = setTimeout(() => {
      setAnimateItems(true);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = async (searchQuery: string, aiAssistEnabled: boolean = false) => {
    setLoading(true);
    setCurrentQuery(searchQuery);
    setAiSummary('');
    setHasSearched(true);
    try {
      const response = await axios.get(`/api/search?q=${searchQuery}&ai_assist=${aiAssistEnabled}`);
      const resultsWithCategories = response.data.search_results.map((result: SearchResultItem) => ({
        ...result,
        category: getDocumentCategory(result.path)
      }));
      
      // Add small delay before showing results to allow animation to complete
      setTimeout(() => {
        setResults(resultsWithCategories);
        if (aiAssistEnabled) {
          setAiSummary(response.data.ai_response);
        }
      }, 300);
      
      return response;
    } catch (error) {
      console.error('Search failed:', error);
      throw error;
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };

  const handlePreview = (result: SearchResultItem): void => {
    const filePath = result.path.replace('/app/docs/', '');
    const fileType = filePath.split('.').pop()?.toLowerCase() || '';

    if (fileType === 'md') {
      const fileName = filePath.split('/').pop()?.replace('.md', '') || '';
      window.open(`https://github.com/golfgenius/golfgenius/wiki/${fileName}`, '_blank');
      return;
    }

    if (['pdf', 'md', 'html'].includes(fileType)) {
      setPreview({
        fileUrl: `http://localhost:6969/docs/${filePath}`,
        fileType,
        title: filePath,
        content: result.highlighted_content
      });
    }
  };

  const handlePopularSearchClick = (query: string): void => {
    handleSearch(query, true);
  };

  const filteredResults = results.filter(result =>
    activeTab === 'all' || result.category === activeTab
  );

  const renderSearchTabs = () => {
    if (results.length === 0) return null;
    
    return (
      <div className="flex w-full border-b border-muted-foreground/20 mb-8 animate-fadeIn">
        {tabs.map((tab) => {
          const count = results.filter(r =>
            tab.id === 'all' ? true : r.category === tab.id
          ).length;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-all duration-300",
                activeTab === tab.id
                  ? "border-primary text-primary translate-y-0"
                  : "border-transparent hover:text-muted-foreground hover:border-muted-foreground"
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
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-12 text-muted-foreground animate-pulse">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <span className="animate-pulse">Searching...</span>
        </div>
      );
    }

    if (!hasSearched || results.length === 0) {
      return (
        <div className="space-y-8">
          {currentQuery && results.length === 0 && (
            <div className="text-center py-8 animate-fadeIn">
              <p className="text-lg text-muted-foreground mb-2">
                No results found for &quot;{currentQuery}&quot;
              </p>
              <p className="text-sm text-muted-foreground">
                Try different keywords or browse popular searches below
              </p>
            </div>
          )}

          <div className="space-y-4 animate-fadeSlideUp" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Don&apos;t know where to start?</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {starterSearches.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 text-sm text-left rounded-lg border border-border hover:bg-accent transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                  style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                >
                  <span className="text-lg transform transition-transform duration-300 hover:scale-125">{item.icon}</span>
                  <span className="text-foreground">{item.query}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4 animate-fadeSlideUp" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Popular Searches</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {popularSearches.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handlePopularSearchClick(item.query)}
                  className="flex items-center gap-3 p-4 text-sm text-left rounded-lg border border-border hover:bg-accent transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                  style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                >
                  <span className="text-lg transform transition-transform duration-300 hover:scale-125">{item.icon}</span>
                  <span className="text-foreground">{item.query}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-fadeSlideUp">
        {filteredResults.map((result, index) => (
          <div 
            key={index} 
            className="animate-fadeSlideUp" 
            style={{ animationDelay: `${0.1 + index * 0.05}s` }}
          >
            <SearchResult
              result={result}
              onPreview={handlePreview}
            />
          </div>
        ))}
      </div>
    );
  };

  // Calculate dynamic classes for vertical alignment
  const containerClasses = cn(
    "bg-background min-h-screen w-full flex flex-col transition-all duration-700",
    !hasSearched && "justify-center",
    pageLoaded ? "opacity-100" : "opacity-0"
  );

  const contentClasses = cn(
    "flex flex-col items-center px-6 py-16 w-full transition-all duration-700",
    !hasSearched && "flex-1 justify-center"
  );

  return (
    <div className={containerClasses}>
      <div className={contentClasses}>
        <div className="w-full max-w-5xl mx-auto">
          <div className={cn(
            "text-6xl font-bold mb-10 text-center transition-all duration-700 animate-fadeSlideDown",
            !hasSearched && "mb-16",
            animateItems ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
          )}>
            <span className="text-primary animate-colorPulse inline-block">GG</span>
            {' '}
            <span className="text-foreground">Docs</span>
          </div>

          <div className={cn(
            "w-full mb-10 transition-all duration-500",
            animateItems ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <SearchInput
              onSearch={handleSearch}
              className="w-full transition-transform duration-300 hover:scale-[1.01] focus-within:scale-[1.01]"
              initialQuery={currentQuery}
            />
          </div>

          <AIResponse response={aiSummary} />

          {renderSearchTabs()}
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

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-fadeSlideUp {
          animation: fadeSlideUp 0.5s ease-out forwards;
        }
        
        .animate-fadeSlideDown {
          animation: fadeSlideDown 0.5s ease-out forwards;
        }
        
        .animate-colorPulse {
          animation: colorPulse 3s infinite;
        }
      `}</style>
    </div>
  );
}
