import {
  checkOpenAIKey,
  openaiSummary,
  preprocessText,
  segmentText,
} from "@/lib/summary-process";
import { options } from "@/types";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const { link, ok } = body;

  const isValidKey = await checkOpenAIKey(ok);

  if (!isValidKey) {
    return new NextResponse(
      "Bad OpenAI API key. Make sure to set it in settings.",
      { status: 401 },
    );
  }

  if (!link) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  try {
    const transcriptYT = await YoutubeTranscript.fetchTranscript(link);
    const transcript = transcriptYT.map((item) => item.text).join(" ");

    if (!transcript) {
      return new NextResponse("No transcript", { status: 400 });
    }

    let summary = transcript;
    if (summary.length > 20000) {
      let segments = segmentText(transcript);

      const segmentPromises = segments.map((segment) =>
        preprocessText(segment, ok),
      );
      const summaries = await Promise.all(segmentPromises);
      summary = summaries.join("");
    }

    const response = await openaiSummary(summary, ok);

    return new NextResponse(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
