import getSummaryList from "@/actions/getSummaryList";
import Image from "next/image";
import Link from "next/link";

async function Page() {
  const summaryList = await getSummaryList();

  if (!summaryList) {
    return <div>No summary found</div>;
  }

  return (
    <div className="flex flex-col text-white max-w-7xl w-full px-10 mx-auto">
      <div className="flex flex-col mb-4">
        <h1 className="text-4xl font-bold tracking-tight">
          GPT-powered Summary List
        </h1>

        <p className="mb-5 mt-2">
          Eightify is the perfect tool for busy professionals who want to get
          the most out of their YouTube viewing experience. Our AI-powered
          Chrome extension quickly summarizes any YouTube video into 8 key
          ideas, allowing you to quickly decide if the video is worth watching.
          With Eightify, you can save time and get the most out of business
          education, podcasts, interviews, news, and lectures.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center lg:justify-start">
        {summaryList.map((summary) => (
          <div
            key={summary.id}
            className=" flex flex-col items-center shadow-neon rounded-md p-4 m-4 w-[350px] h-[300px] group"
          >
            <p className="text-xl truncate whitespace-nowrap overflow-hidden w-[300px]">
              {summary.title}
            </p>
            <Image
              src={summary.image || "/placeholder.png"}
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
    </div>
  );
}

export default Page;
