import React, { useState, useEffect, useRef } from 'react';
import { Search, Bot, Folder } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import axios from 'axios';

interface SearchInputProps {
  onSearch: (query: string, useAI?: boolean) => Promise<void>;
  className?: string;
  initialQuery?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch, className, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState('');
  const [shouldFetchSuggestions, setShouldFetchSuggestions] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const closeSuggestions = () => {
    setSuggestions([]);
    setShouldFetchSuggestions(false);
    setSelectedIndex(-1);
  };

  const updateClickCount = async (selectedQuery: string) => {
    try {
      await axios.post('/api/click_count', { query: selectedQuery });
    } catch (error) {
      console.error('Error updating click count:', error);
    }
  };

  useEffect(() => {
    if (!shouldFetchSuggestions || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const response = await axios.get(`/api/autocomplete?q=${query}`);
        setSuggestions(response.data);
      } catch (error) {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [query, shouldFetchSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeSuggestions();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = async (searchQuery: string = query, aiAssist: boolean) => { 
    if (!searchQuery.trim()) return;
    
    setLoading(aiAssist ? 'ai' : 'search');
    closeSuggestions();
    
    try {
      await onSearch(searchQuery, aiAssist); 
    } finally {
      setLoading('');
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    setQuery(suggestion);
    closeSuggestions();
    await updateClickCount(suggestion);
    await handleSearch(suggestion, false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShouldFetchSuggestions(true);
    setSelectedIndex(-1);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length > 0) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
          break;
          
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) {
            const selectedSuggestion = suggestions[selectedIndex];
            await handleSuggestionClick(selectedSuggestion);
          } 
          else {
            updateClickCount(query);
            await handleSearch(query, false);
          }
          break;
          
        case 'Escape':
          closeSuggestions();
          break;
      }
    } else if (e.key === 'Enter') {
      await updateClickCount(query);
      await handleSearch(query, false);
    }
  };

  return (
    <div ref={containerRef} className={className}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="h-14 bg-foreground/10 border-0 text-lg focus-visible:ring-foreground/10 pr-20"
          placeholder="Search documents..."
        />
        <div className="absolute right-4 top-4 flex gap-4">
          <Search 
            className={`h-6 w-6 text-foreground hover:text-primary transition-colors duration-200 ${
              loading == 'search' ? 'animate-pulse text-primary' : ''
            } cursor-pointer`}
            onClick={() => !loading && handleSearch(query, false)}
          />
          <Bot 
            className={`h-6 w-6 text-foreground hover:text-primary transition-colors duration-200 ${
              loading == 'ai' ? 'animate-pulse text-primary' : ''
            } cursor-pointer`}
            onClick={() => !loading && handleSearch(query, true)}
          />
        </div>
        
        {suggestions.length > 0 && (
          <Card className="absolute w-full mt-2 bg-foreground/5 border-0 backdrop-blur-sm">
            <ul className="py-2">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className={`flex items-center gap-2 px-4 py-2 cursor-pointer ${
                    index === selectedIndex 
                      ? 'bg-foreground/20' 
                      : 'hover:bg-foreground/10'
                  }`}
                  onClick={() => handleSuggestionClick(suggestion[0])}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  {suggestion[1] == "1" && <Folder size={16} /> }

                  {suggestion[0]}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
