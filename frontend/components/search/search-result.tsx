import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface SearchResultProps {
  result: any;
  onPreview?: (data: any) => void;
}
const SearchResult = ({ result, onPreview }: SearchResultProps) => {
  const handleClick = async () => {
    try {
      // Open the preview
      if (onPreview) {
        onPreview({
          path: result.path,
          title: result.path.split('/').pop(),
          fileType: getFileType(result.path)
        });
      }
      
    } catch (error) {
      console.error('Failed to handle click:', error);
    }
  };

  const getFileType = (path: any) => {
    const extension = path.split('.').pop().toLowerCase();
    return extension === 'pdf' ? 'pdf' : 'text';
  };

  return (
    <Card
      className="border border-primary/10 hover:border-primary/20 transition-all duration-200 cursor-pointer group"
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start gap-4 mb-4">
          <h3
            className="text-xl font-semibold  group-hover:text-primary transition-colors"
            dangerouslySetInnerHTML={{ __html: result.highlighted_name }}
          />
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary capitalize">
              {result.category}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary">
              Score: {Math.round(result.relevance_score)}
            </span>
          </div>
        </div>
        <p
          className="text-base text-muted-foreground leading-relaxed mb-4"
          dangerouslySetInnerHTML={{ __html: result.content_snippet }}
        />
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground bg-background/50 px-2.5 py-1 rounded-full">
            {result.path.split('/').pop()}
          </span>
          <span className="text-xs text-muted-foreground">
            {(result.content_length / 1024).toFixed(1)}kb
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchResult;
