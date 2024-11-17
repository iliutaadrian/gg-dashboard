import React, { useState, useEffect, useRef } from 'react';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import axios from 'axios';

interface SearchInputProps {
  onSearch: (query: string) => Promise<void>;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [shouldFetchSuggestions, setShouldFetchSuggestions] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
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

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    closeSuggestions();
    
    try {
      await onSearch(searchQuery);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    setQuery(suggestion);
    closeSuggestions();
    await updateClickCount(suggestion);
    await handleSearch(suggestion);
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
          } else {
            await updateClickCount(query);
            await handleSearch();
          }
          break;
          
        case 'Escape':
          closeSuggestions();
          break;
      }
    } else if (e.key === 'Enter') {
      await updateClickCount(query);
      await handleSearch();
    }
  };

  return (
    <div ref={containerRef}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="h-14 bg-white/5 border-0 text-white placeholder:text-white/50 text-lg focus-visible:ring-white/5"
          placeholder="Search documents..."
        />
        <Search 
          className={`absolute right-4 top-4 h-6 w-6 text-white/50 ${loading ? 'animate-spin' : ''} cursor-pointer`}
          onClick={() => !loading && handleSearch()}
        />
        
        {suggestions.length > 0 && (
          <Card className="absolute w-full mt-2 bg-white/5 border-0 backdrop-blur-sm">
            <ul className="py-2">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className={`px-4 py-2 text-white/70 cursor-pointer ${
                    index === selectedIndex 
                      ? 'bg-white/20' 
                      : 'hover:bg-white/10'
                  }`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  {suggestion}
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
