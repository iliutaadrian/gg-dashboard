import { BuildTable, SettingsTable, db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";

const getSettings = async () => {
  const user = await currentUser();

  if (!user?.id) {
    return null;
  }

  try {
    const settings = await db
      .select()
      .from(SettingsTable)
      .where(eq(SettingsTable.user_id, user.id));

    if (settings.length === 0) {
      return {
        imap: "imap.gmail.com",
        email: "",
        api_key: "",
        projects: [],
        bookmarks: [],
      };
    }

    const buildsQuery = await db
      .select()
      .from(BuildTable)
      .where(eq(BuildTable.project, "test_develop"));
    const buildsNumber = buildsQuery.map((b) => b.build);
    const buildsFailed = buildsQuery.map((b) => b.number_of_failures);

    return {
      ...settings[0],
      projects: settings[0].projects
        ? settings[0].projects.split(",").map((p) => ({ value: p, label: p }))
        : [],
      bookmarks: settings[0].bookmarks ? JSON.parse(settings[0].bookmarks) : [],
      builds: {
        data: buildsQuery,
        buildsNumber,
        buildsFailed,
      },
    };
  } catch (error: any) {
    console.log(error);
    return null;
  }
};

export default getSettings;
