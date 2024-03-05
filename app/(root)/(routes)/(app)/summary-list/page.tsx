import getSummaryList from "@/actions/getSummaryList";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

async function Page() {
  const summaryList = await getSummaryList();

  if (!summaryList) {
    return <div>No summary found</div>;
  }

  return (
    <div className="flex">
      {summaryList.map((summary) => (
        <div
          key={summary.id}
          className=" flex flex-col items-center shadow-neon rounded-md p-4 m-4 w-[350px] h-[300px] group"
        >
          <p className="text-xl truncate whitespace-nowrap overflow-hidden w-[300px]">
            {summary.title}
          </p>
          <Image
            src={summary.image}
            alt={summary.title}
            width={350}
            height={200}
          />

          <div className="hidden absolute w-[330px] h-[280px] bg-background/90 p-5 group group-hover:block">
            <p className="max-h-[200px] overflow-y-scroll mb-5">
              {summary.description}
            </p>
            <Link href={`/summary/${summary.id}`}>See Full Summary</Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Page;
