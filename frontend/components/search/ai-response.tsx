import React, { useState, useEffect } from 'react';
import { Bot, Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AIResponse = ({ response }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (!response) {
      setDisplayedText('');
      setCurrentIndex(0);
      return;
    }

    const interval = setInterval(() => {
      if (currentIndex < response.length) {
        setDisplayedText(prev => prev + response[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      } else {
        clearInterval(interval);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [response, currentIndex]);

  if (!response) return null;

  return (
    <Card className="w-full mb-5 border-muted-foreground/10">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold text-primary">GG Bot</span>
        </div>
        <pre className="text-foreground whitespace-pre-line text-sm">
          {displayedText}
          {currentIndex < response.length && (
            <span className="animate-pulse">|</span>
          )}
        </pre>
      </CardContent>
    </Card>
  );
};

export default AIResponse;
