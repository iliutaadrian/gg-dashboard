import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export const FilePreview = ({ isOpen, onClose, fileUrl, fileType, title, content }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[80vw] h-[85vh] p-0 flex flex-col">
        <DialogHeader className="shrink-0 px-4 py-2 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <DialogTitle className="text-base">{title || "Document Preview"}</DialogTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(fileUrl, "_blank")}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Open
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 min-h-0">
          {fileType === 'pdf' || fileType === 'html' ? (
            <iframe
              src={`${fileUrl}#toolbar=0`}
              className="w-full h-full border-0"
            />
          ) : (
            <ScrollArea className="h-full">
              <div className="px-6 pb-2">
                <pre 
                  dangerouslySetInnerHTML={{ __html: content }}
                  className="text-sm font-mono whitespace-pre-wrap"
                />
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
