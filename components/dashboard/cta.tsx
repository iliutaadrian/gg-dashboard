import { Button } from "../ui/button";

export const Cta = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-5">
      <div className="mx-auto max-w-5xl rounded-lg bg-background/50 hover:bg-background flex flex-col gap-5 p-20">
        <h1 className="text-2xl md:text-4xl font-bold text-primary text-center">
          Boost your app, launch, earn
        </h1>
        <h1 className="text-xl font-medium text-center">
          Don't let your data go to waste
        </h1>
        <Button>Get Started</Button>
      </div>
    </div>
  );
};
