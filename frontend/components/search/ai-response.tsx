import React, { useState, useEffect } from 'react';
import { Bot } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AIResponse = ({ response }: { response: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypingDone, setIsTypingDone] = useState(false);

  useEffect(() => {
    if (!response) {
      setDisplayedText('');
      setCurrentIndex(0);
      setIsTypingDone(false);
      return;
    }

    const interval = setInterval(() => {
      if (currentIndex < response.length) {
        setDisplayedText(prev => prev + response[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      } else {
        clearInterval(interval);
        setIsTypingDone(true);
      }
    }, 5);

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
          {isTypingDone && (
            <div className="mt-4 text-xs text-muted-foreground">
              Note: This is an AI-generated response. Please verify any critical information.
            </div>
          )}
        </pre>
      </CardContent>
    </Card>
  );
};

export default AIResponse;
