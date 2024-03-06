import { CreditsAvailable } from "@/components/credits-available";
import { YoutubeForm } from "@/components/youtube-summary/youtube-form";

async function Page() {
  return (
    <div className="flex flex-col-reverse lg:flex-row sm:gap-20 max-w-7xl w-full px-10 mx-auto">
      <div className="flex flex-col mb-4">
        <h1 className="text-4xl font-bold tracking-tight">Youtube Summary</h1>
        <p className="mb-5 mt-2">
          <span className="text-muted-foreground">
            This tool will help you summarize YouTube videos. Input your link
            below.
          </span>
        </p>
        <YoutubeForm />
      </div>
      <CreditsAvailable />
    </div>
  );
}

export default Page;
