import React, { useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const SearchInput = ({ query, setQuery, loading, handleSearch, suggestions, setSuggestions }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [setSuggestions]);

  const renderSuggestions = () => {
    if (suggestions.length === 0) return null;
    
    return (
      <div className="absolute w-full z-50">
        <Card className="w-full mt-1 backdrop-blur-lg bg-background/80 border-border">
          <ul className="py-1">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2.5 hover:bg-primary/10 cursor-pointer text-sm border-b border-border/50 last:border-0"
                onClick={() => {
                  setQuery(suggestion);
                  handleSearch(suggestion);
                  setSuggestions([]);
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    );
  };

  return (
    <div className="w-full max-w-3xl mb-8 relative" ref={inputRef}>
      <div className="relative">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
              setSuggestions([]);
            }
            if (e.key === 'Escape') setSuggestions([]);
          }}
          className="w-full h-12 pl-12 pr-12 bg-background border-primary/20 hover:border-primary/40 focus:border-primary transition-colors"
          placeholder="Search documentation..."
        />
        <Search
          className={cn(
            "absolute left-4 top-3.5 h-5 w-5 text-muted-foreground cursor-pointer",
            loading && "animate-spin"
          )}
          onClick={() => {
            if (!loading) {
              handleSearch();
              setSuggestions([]);
            }
          }}
        />
        <Settings className="absolute right-4 top-3.5 h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary" />
      </div>

      {renderSuggestions()}
    </div>
  );
};

export default SearchInput;
