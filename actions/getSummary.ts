import { db, SummaryTable } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";

const getSummary = async (summaryId: string) => {
  const user = await currentUser();

  if (!user?.id || !summaryId) {
    return null;
  }

  try {
    const summary = await db
      .select()
      .from(SummaryTable)
      .where(eq(SummaryTable.id, summaryId));

    if (summary.length === 0) {
      return null;
    }

    return summary[0];
  } catch (error: any) {
    console.log(error);
    return null;
  }
};

export default getSummary;
