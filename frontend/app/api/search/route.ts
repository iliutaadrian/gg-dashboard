// app/api/search/route.ts
import { currentUser } from "@clerk/nextjs";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const aiAssist = searchParams.get("ai_assist") === "true";

  const aggregationMethod = searchParams.get("aggregationMethod") || "rank_fusion";
  const syntacticMethods = ["bm25"];
  const semanticMethods = ["openai"];
  const options = aiAssist ? ["ai_assist", "caching"] : ["caching"];

  try {
    const response = await axios.get(`${process.env.PYTHON_URL}/api/search`, {
      params: {
        q: query,
        aggregationMethod,
        syntacticMethods: JSON.stringify(syntacticMethods),
        semanticMethods: JSON.stringify(semanticMethods),
        options: JSON.stringify(options)
      }
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Search error:", error);
    return new NextResponse("Search failed", { status: 500 });
  }
}
