import { YoutubeForm } from "@/components/youtube-summary/youtube-form";
import { Steps } from "@/components/dashboard/steps";
import { getUserApiLimit } from "@/lib/stripe/api-limits";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

async function Page() {
  const limit = await getUserApiLimit();

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

      <div className="flex flex-col mb-4">
        <div className="flex flex-col gap-3 items-center shadow-neon rounded-md p-4 m-4">
          <p>
            {limit[0]}/{limit[1]}{" "}
            <span className="text-muted-foreground animate-pulse">
              Free Generations
            </span>
          </p>
          <Progress value={(limit[0] / limit[1]) * 100} />
          <Button>
            Get More Generations <Zap className="w-4 h-4 ml-2" />
          </Button>
        </div>
        {/* <iframe */}
        {/*   id="myIframe" */}
        {/*   src={`//www.youtube.com/embed/-v8pD0d5Bmk`} */}
        {/*   width="360" */}
        {/*   height="315" */}
        {/* ></iframe> */}
        {/* <p className="text-muted-foreground"> */}
        {/*   Summary for the video: <span className="italic">summary.id</span> */}
        {/* </p> */}
      </div>
    </div>
  );
}

export default Page;
