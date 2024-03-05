import { db, SummaryTable } from "@/lib/db";

const getSummaryList = async () => {
  try {
    const summaryList = await db.select().from(SummaryTable);

    if (summaryList.length === 0) {
      return null;
    }

    return summaryList;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};

export default getSummaryList;
