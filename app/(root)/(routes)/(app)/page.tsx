"use client";
import { Rules } from "@/components/rules";
import { YoutubeForm } from "@/components/youtube-summary/youtube-form";
import { useState } from "react";

function Page() {
  const [clicked, setClicked] = useState(false);

  return (
    <div className="relative min-h-screen bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-orange-950 to-gray-900">
      <div className="relative z-10 flex flex-col items-center h-screen md:max-w-5xl mx-auto max-md:px-2">
        <div className="mt-16 flex flex-col items-center gap-4 text-white w-full px-10">
          <h1 className="text-2xl md:text-4xl font-bold text-primary text-center">
            Tube Mind Sync
          </h1>
          <h1 className="text-xl font-medium text-center">
            Conversations Redefined, Boundaries Unleashed
          </h1>
          {!clicked && (
            <div className="mt-4 px-3 text-sm text-center">
              <Rules />
            </div>
          )}
          <div className="flex items-center gap-4 w-full shadow-neonLight rounded-lg my-10">
            <div className="p-10 rounded-lg bg-background/50 hover:bg-background group w-full">
              <div className="flex items-center flex-col mb-2">
                <h2 className="text-xl font-bold text-primary tracking-tight">
                  Youtube Summary
                </h2>
                <p className="text-muted-foreground">
                  This tool will help you summarize YouTube videos. Input your
                  link below.
                </p>
              </div>
              <YoutubeForm setClicked={setClicked} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
