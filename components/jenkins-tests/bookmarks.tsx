"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ComboList } from "@/types";
import { Book } from "lucide-react";
import Link from "next/link";
import React from "react";

interface Props {
  bookmarks: { name: string; url: string }[];
}

export const Bookmarks = ({ bookmarks }: Props) => {
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <Card className="shadow-neon border-muted-foreground bg-primary/5 hover:bg-primary/10 pb-2">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-5">
            <div className="w-10 h-10 rounded-full border-2 border-primary flex justify-center items-center">
              <p>
                <Book />
              </p>
            </div>
            Bookmarks
          </div>
        </CardTitle>
        <CardDescription>Usefull links for your deployment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          {bookmarks.map((link) => (
            <Button key={link.name} isLoading={isLoading} className="w-40">
              <Link href={link.url} target="_blank">
                {link.name}
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
