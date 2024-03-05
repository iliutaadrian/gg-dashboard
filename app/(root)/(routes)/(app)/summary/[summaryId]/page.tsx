import getSummary from "@/actions/getSummary";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getUserApiLimit } from "@/lib/stripe/api-limits";
import { Zap } from "lucide-react";
import Link from "next/link";

interface Params {
  summaryId: string;
}

async function Page({ params }: { params: Params }) {
  const summary = await getSummary(params.summaryId);
  const limit = await getUserApiLimit();

  if (!summary) {
    return <div>No summary found</div>;
  }

  return (
    <div className="flex flex-col-reverse lg:flex-row sm:gap-20 text-white max-w-7xl w-full px-10 mx-auto">
      <div className="flex flex-col mb-4">
        <h1 className="text-4xl font-bold tracking-tight">{summary.title}</h1>
        <p className="mb-5 mt-2">
          <span className="text-muted-foreground uppercase">Description </span>
          {summary.description}
        </p>
        <p className="bg-transparent relative">{summary.summary}</p>
      </div>

      <div className="flex flex-col mb-4 mt-5 gap-5">
        <Link href={`/summary/`} className="w-full px-5">
          <Button className="w-full">Generate Summary</Button>
        </Link>
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
        <iframe
          id="myIframe"
          src={`//www.youtube.com/embed/${summary.id}`}
          width="360"
          height="315"
        ></iframe>
        <p className="text-muted-foreground">
          Summary for the video:{" "}
          <span className="italic">{summary.title} </span>
        </p>
      </div>
    </div>
  );
}

export default Page;
