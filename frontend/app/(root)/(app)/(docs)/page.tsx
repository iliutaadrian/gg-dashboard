"use client"
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Settings, BookOpen, FileText, BarChart3, Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const tabs = [
  { id: 'all', label: 'All', icon: Search },
  { id: 'wiki', label: 'Wiki', icon: BookOpen },
  { id: 'kb', label: 'Knowledge Base', icon: FileText },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
];

const mockResults = [
  {
    title: "Jenkins Test Implementation Guide",
    snippet: "A comprehensive guide on implementing automated testing using Jenkins. This document covers test configuration, pipeline setup, and best practices for continuous integration.",
    type: "wiki",
    url: "#"
  },
  {
    title: "Test Failure Analysis Documentation",
    snippet: "Learn how to analyze and debug test failures in the CI/CD pipeline. Includes common failure patterns and troubleshooting steps.",
    type: "kb",
    url: "#"
  },
  {
    title: "Q4 2023 Test Coverage Report",
    snippet: "Detailed analysis of test coverage across all microservices. Includes metrics on code coverage, test success rates, and areas for improvement.",
    type: "reports",
    url: "#"
  },
];

const SearchResults = () => {
  const [activeTab, setActiveTab] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('Jenkins Test Implementation');

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col items-center justify-start pt-12 px-4">
        <div className="text-5xl font-bold mb-8">
          <span className="text-primary">GG</span>
          {' '}
          <span className="text-foreground">Docs</span>
        </div>
        
        <div className="w-full max-w-3xl mb-8">
          <div className="relative">
            <Input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-12 bg-primary/5 border-muted-foreground hover:bg-primary/10"
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
            <Settings className="absolute right-4 top-3.5 h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary" />
          </div>
        </div>

        {/* AI Summary */}
        <Card className="w-full max-w-3xl mb-6 bg-primary/5 border-muted-foreground">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-primary">AI Summary</span>
            </div>
            <p className="text-foreground text-sm">
              Based on the search results, Jenkins test implementation involves setting up automated testing pipelines with proper configuration. The documentation covers both basic setup and advanced troubleshooting. Key aspects include continuous integration practices, test failure analysis, and maintaining high test coverage across services. Recent reports indicate a focus on improving code coverage and test reliability.
            </p>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex w-full max-w-3xl border-b border-muted-foreground mb-6">
          {tabs.map((tab) => (
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
            </button>
          ))}
        </div>

        {/* Search Results */}
        <div className="w-full max-w-3xl space-y-4">
          {mockResults
            .filter(result => activeTab === 'all' || result.type === activeTab)
            .map((result, index) => (
              <Card 
                key={index} 
                className="bg-primary/5 border-muted-foreground hover:bg-primary/10 transition-colors cursor-pointer"
              >
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {result.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {result.snippet}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {result.type.toUpperCase()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
