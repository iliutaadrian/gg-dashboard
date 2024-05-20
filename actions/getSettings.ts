import { SettingsTable, db } from "@/lib/db";
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

    return {
      ...settings[0],
      projects: settings[0].projects
        ? settings[0].projects.split(",").map((p) => ({ value: p, label: p }))
        : [],
      bookmarks: settings[0].bookmarks ? JSON.parse(settings[0].bookmarks) : [],
    };
  } catch (error: any) {
    console.log(error);
    return null;
  }
};

export default getSettings;
