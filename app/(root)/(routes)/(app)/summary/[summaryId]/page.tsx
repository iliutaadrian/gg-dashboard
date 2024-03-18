import getSummary from "@/actions/getSummary";
import { CreditsAvailable } from "@/components/credits-available";
import { Button } from "@/components/ui/button";
import { ReportArticle } from "@/components/youtube-summary/report-article";
import { marked } from "marked";
import Link from "next/link";

interface Params {
  summaryId: string;
}

async function Page({ params }: { params: Params }) {
  const summary = await getSummary(params.summaryId);

  if (!summary) {
    return <div>No summary found</div>;
  }
  const sections = JSON.parse(summary.summary);

  return (
    <div className="flex flex-col-reverse lg:flex-row sm:gap-20 text-white max-w-7xl w-full px-10 mx-auto">
      <div className="flex flex-col mb-4">
        <h1 className="text-4xl font-bold tracking-tight">{summary.title}</h1>
        <p className="mb-5 mt-2">
          <span className="text-muted-foreground uppercase">Description </span>
          {summary.description}
        </p>
        {sections.map(
          (s: {
            name: string;
            key: string;
            value: string;
            response: string;
          }) => (
            <div key={s.key} className="flex flex-col mb-4 mt-5 gap-5">
              <h2 className="text-2xl font-bold tracking-tight">{s.name}</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: marked(s.response),
                }}
              />
            </div>
          ),
        )}
      </div>

      <div className="flex flex-col mb-4 mt-5 gap-5">
        <Link href={`/summary/`} className="w-full px-5">
          <Button className="w-full">Generate Summary</Button>
        </Link>

        <CreditsAvailable />

        <iframe
          id="myIframe"
          src={`//www.youtube.com/embed/${summary.id}`}
          className="w-full h-96"
          width="360"
          height="315"
        ></iframe>
        <p className="text-muted-foreground">
          Summary for the video:{" "}
          <span className="italic">{summary.title} </span>
        </p>
        <ReportArticle summaryId={params.summaryId} />
      </div>
    </div>
  );
}

export default Page;
