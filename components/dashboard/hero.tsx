"use client";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <div className="relative bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-orange-950 to-gray-900">
      <div className="relative z-10 flex flex-col items-center justify-center max-md:px-2 h-[50vh]">
        <h1 className="text-2xl md:text-4xl font-bold text-primary text-center">
          Tube Mind Sync
        </h1>
        <h1 className="text-xl font-medium text-center">
          Conversations Redefined, Boundaries Unleashed
        </h1>
        <Button>Get Started</Button>
      </div>
    </div>
  );
};
