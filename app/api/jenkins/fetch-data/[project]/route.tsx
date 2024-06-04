import { Build, BuildTable, SettingsTable, db } from "@/lib/db";
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

    const previousBuilds = await db
      .select()
      .from(BuildTable)
      .where(eq(BuildTable.project, params.project));
    const builds = previousBuilds.map((item) => item.build);

    try {
      const data = await axios
        .get(`http://python:6969/fetch_data`, {
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

      for (const item of data) {
        if (!builds.includes(item.build)) {
          await db.insert(BuildTable).values({
            project: params.project,
            build: item.build,
            date: item.date,
            link: item.link,
            number_of_failures: item.number_of_failures,
            subject: item.subject,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }

    return new NextResponse(
      JSON.stringify(
        previousBuilds.slice(previousBuilds.length - 10, previousBuilds.length),
      ),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log(error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
