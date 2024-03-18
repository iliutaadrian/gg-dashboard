import { SummaryTable, db } from "@/lib/db";
import {
  openaiSummary,
  preprocessText,
  segmentText,
} from "@/lib/gpt/summary-process";
import {
  checkUserApiLimit,
  increaseUserApiLimit,
} from "@/lib/stripe/api-limits";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const { link, redo } = body;

  const freeTrial = await checkUserApiLimit();
  if (!freeTrial) {
    return new NextResponse("No more credits!", { status: 429 });
  }

  var regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match = link.match(regExp);
  const linkId = match && match[2].length == 11 ? match[2] : "";
  if (!link || !linkId) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  const summaryStored = await db
    .select()
    .from(SummaryTable)
    .where(eq(SummaryTable.id, linkId));
  if (!redo) {
    if (summaryStored.length > 0) {
      return new NextResponse(linkId, { status: 200 });
    }
  } else {
    await db.delete(SummaryTable).where(eq(SummaryTable.id, linkId));
  }

  try {
    const transcriptYT = await YoutubeTranscript.fetchTranscript(link);
    const transcript = transcriptYT.map((item) => item.text).join(" ");

    if (!transcript) {
      return new NextResponse("No transcript", { status: 400 });
    }

    let summaryTranscript = transcript;
    if (summaryTranscript.length > 20000) {
      let segments = segmentText(transcript);

      const segmentPromises = segments.map((segment) =>
        preprocessText(segment),
      );
      const summaries = await Promise.all(segmentPromises);
      summaryTranscript = summaries.join("");
    }

    const { summary, title, description } =
      await openaiSummary(summaryTranscript);

    await db.insert(SummaryTable).values({
      id: linkId,
      user_id: user.id,
      summary: JSON.stringify(summary),
      link: link,
      image: `https://img.youtube.com/vi/${linkId}/0.jpg`,
      title: title,
      description: description,
    });
    await increaseUserApiLimit();

    return new NextResponse(linkId, { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
