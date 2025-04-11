import { currentUser } from "@clerk/nextjs";
import axios from "axios";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
  // const user = await currentUser();
  // if (!user) {
  //   return new NextResponse("Unauthorized", { status: 401 });
  // }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_PYTHON_URL}/api/search/autocomplete`,
      {
        params: { q: query }
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Autocomplete error:", error);
    return new NextResponse("Autocomplete failed", { status: 500 });
  }
}
