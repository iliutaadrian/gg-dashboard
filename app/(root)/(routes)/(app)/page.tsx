import getSettings from "@/actions/getSettings";
import { JenkinsSteps } from "@/components/jenkins-tests/jenkins-steps";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

async function Page() {
  const settings: any = await getSettings();
  if (!settings) {
    return null;
  }

  // TODO
  // change date forma
  // add ocurrences to each test
  // test copy details
  // test copy markdown with new details

  return (
    <div className="flex flex-col p-10 max-w-5xl mx-auto">
      <div className="flex fles-row justify-between align-middle items-center">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold tracking-tight">
            Jenkins Report Test Difference
          </h2>
          <p className="text-muted-foreground">Make sure to follow each step.</p>
        </div>

        <Button variant="default">
          <Link href="/settings">Settings</Link>
        </Button>
      </div>
      <Separator className="bg-muted-foreground my-5" />
      <JenkinsSteps
        project={settings.projects}
        bookmarks={settings.bookmarks}
        builds={settings.builds}
      />
    </div>
  );
}

export default Page;
