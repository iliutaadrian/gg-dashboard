import { currentUser } from "@clerk/nextjs";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { query } = body;

    const response = await axios.post(
      `${process.env.PYTHON_URL}/api/search/update_click_count`,
      { query }
    );
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Click count update error:", error);
    return new NextResponse("Click count update failed", { status: 500 });
  }
}
