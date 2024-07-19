import { Build, TestTable, db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import axios from "axios";
import { and, eq, or } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const { file_1, file_2 } = body;

  if (!file_1 || !file_2) {
    return new NextResponse("Missing parameters", { status: 400 });
  }

  try {
    const builds = [] as string[]

    // take last 10 builds
    for (let i = 0; i < 10; i++) {
      builds.push((parseInt(file_2) - i).toString());
    }

    // Find the builds in the Drizzle ORM
    const testResults = await db
      .select()
      .from(TestTable)
      .where((b) => builds.includes(b.build))
      .execute();

    // Separate tests by file
    const testsFile1 = testResults.filter((test) => test.build === file_1);
    const testsFile2 = testResults.filter((test) => test.build === file_2);

    console.log(testsFile1.length);
    console.log(testsFile2.length);

    // Find the difference between tests based on test name
    const failedTestsFile1 = testsFile1.filter((test1) =>
      !testsFile2.some((test2) => test1.name === test2.name)
    );

    // Count occurrences of failed tests in the last 10 builds
    const failedTestsCount = failedTestsFile1.map((failedTest) => {
      const count = testResults.filter(
        (test) => test.name === failedTest.name && builds.includes(test.build)
      ).length;
      return { ...failedTest, count };
    });

    return new NextResponse(JSON.stringify(failedTestsFile1), { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
