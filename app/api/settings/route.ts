import { checkOpenAIKey } from "@/lib/summary-process";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const { ok } = body;
  const isValidKey = await checkOpenAIKey(ok);

  if (!isValidKey) {
    return new NextResponse(
      "Bad OpenAI API key. Make sure you are using a valid key.",
      { status: 401 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}
