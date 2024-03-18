"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUser } from "@clerk/nextjs";
import { Flag } from "lucide-react";
import { useState } from "react";
import { toast } from "../ui/use-toast";
import axios from "axios";

interface Props {
  summaryId: string;
}
export function ReportArticle({ summaryId }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { isSignedIn } = useUser();

  const reportArticle = async () => {
    setIsLoading(true);
    if (!isSignedIn) {
      toast({
        description: "Please sign in to use this feature.",
      });
      setIsLoading(false);
      return;
    }

    const data = {
      link: `https://www.youtube.com/watch?v=${summaryId}`,
      redo: true,
    };

    try {
      await axios.post("/api/youtube-summary", data).then((res) => {
        window.location.href = `/summary/${res.data}`;
      });
    } catch (error) {
      toast({
        variant: "destructive",
        // @ts-ignore
        description: error.response.data,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Flag className="w-4 h-4 mr-2" />
          Report Article
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report Article</DialogTitle>
          <DialogDescription>
            By reporting this article, we will generate another AI summary.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            className="w-full"
            isLoading={isLoading}
            onClick={reportArticle}
          >
            <Flag className="w-4 h-4 mr-2" />
            Report Article
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
