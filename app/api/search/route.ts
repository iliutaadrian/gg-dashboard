// app/api/search/route.ts
import { HybridSearch } from "@/lib/search";
import { NextResponse } from "next/server";

let searchEngine: HybridSearch | null = null;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    if (!searchEngine) {
      searchEngine = new HybridSearch();
      await searchEngine.initialize();
    }

    const results = await searchEngine.search(query);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
