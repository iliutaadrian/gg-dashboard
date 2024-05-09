import getSettings from "@/actions/getSettings";
import { JenkinsSteps } from "@/components/jenkins-tests/jenkins-steps";
import { Separator } from "@/components/ui/separator";

async function Page() {
  const settings = await getSettings();
  if (!settings) {
    return null;
  }

  return (
    <div className="flex flex-col p-10 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold tracking-tight">
        Jenkins Report Test Difference
      </h2>
      <p className="text-muted-foreground">Make sure to follow each step.</p>
      <Separator className="bg-muted-foreground my-5" />
      <JenkinsSteps project={settings.projects} />
    </div>
  );
}

export default Page;
