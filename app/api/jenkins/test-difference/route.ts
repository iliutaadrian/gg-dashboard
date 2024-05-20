import { currentUser } from "@clerk/nextjs";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const { file_1, file_2 } = body;
  if (!file_1 || !file_2) {
    return new NextResponse("Missing required fields", { status: 400 });
  }
  try {
    const data = await axios
      .get(`${process.env.BACKEND_URL}/get_test_diff`, {
        params: {
          file_1,
          file_2,
        },
      })
      .then((res) => {
        return res.data;
      });

    return new NextResponse(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
