import { SettingsTable, db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import axios from "axios";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { project: string } },
) {
  const user = await currentUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!params.project) {
    return new NextResponse("Make sure to add your project name in settings.", {
      status: 401,
    });
  }

  try {
    const userSettings = await db
      .select()
      .from(SettingsTable)
      .where(eq(SettingsTable.user_id, user.id));

    if (userSettings.length === 0) {
      return new NextResponse(
        "Make sure to add your email details and project name in settings.",
        { status: 401 },
      );
    }

    const data = await axios
      .get(`${process.env.BACKEND_URL}/fetch_data`, {
        params: {
          imap_server: "imap.gmail.com",
          email_address: userSettings[0].email,
          password: userSettings[0].api_key,
          project: params.project,
        },
      })
      .then((res) => {
        return res.data.data;
      });

    return new NextResponse(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
