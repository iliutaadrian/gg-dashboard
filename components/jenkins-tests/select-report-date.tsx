"use client";
import { Combobox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReportJenkins } from "@/types";
import {
  useReportsJenkinsStore,
  useStepStore,
  useTestsJenkinsStore,
} from "../reports-jenkins-store";
import React from "react";
import { Copy } from "lucide-react";
import { toast } from "../ui/use-toast";

export const SelectReportDate = () => {
  const { reports } = useReportsJenkinsStore();
  const { step, setStep } = useStepStore();
  const { setFile_1, setFile_2 } = useTestsJenkinsStore();

  const [value, setValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const [markdown, setMarkdown] = React.useState("");

  const reportsList =
    reports.length > 0
      ? reports.map((report: ReportJenkins) => ({
          label: `${report.subject} - ${report.date} - ${report.number_of_failures}`,
          value: report.subject,
        }))
      : [];

  const select_report = async (e: any) => {
    e.preventDefault();
    let last = reports[reportsList.length - 1];
    let selected = reports.find(
      (report) => report.subject.toLocaleLowerCase() === value,
    );

    setFile_1(selected.link);
    setFile_2(last.link);
    setMarkdown(
      `     **Test Suite Status** <br />
            Test failures today:
            [${last.number_of_failures}](${last.link})
            failures <br />
            Test failures before:
            [${selected.number_of_failures}](${selected.link})
            failures
`,
    );

    setIsLoading(false);
    setStep(3);
    return;
  };

  const copyMarkdown = () => {
    navigator.clipboard.writeText(markdown);
    toast({
      description: "Markdown copied to clipboard.",
    });
  };
  return (
    <Card className="shadow-neon border-muted-foreground bg-primary/5 hover:bg-primary/10 pb-2">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-5">
            <div className="w-10 h-10 rounded-full border-2 border-primary flex justify-center items-center">
              <p>2.</p>
            </div>
            Select Report Date
          </div>
        </CardTitle>
        <CardDescription>
          Select the report date you want to compare with.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex gap-5 items-center">
          <Combobox
            disabled={step > 1 ? false : true}
            list={reportsList}
            setValue={setValue}
            text="Select your report..."
            value={value}
          />
          <Button
            onClick={select_report}
            isLoading={isLoading}
            className="w-40"
            disabled={step > 1 ? false : true}
          >
            Select Report
          </Button>
        </form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4 flex flex-col gap-2">
        {markdown ? (
          <div className="bg-gray-800 text-white p-5 text-sm w-full rounded-sm relative">
            <Copy
              className="w-5 h-5 absolute top-2 right-2 z-10 hover:text-primary cursor-pointer"
              onClick={() => copyMarkdown()}
            />
            <div dangerouslySetInnerHTML={{ __html: markdown }}></div>
          </div>
        ) : (
          <div className="bg-gray-800 text-white p-5 text-sm w-full rounded-sm">
            **Test Suite Status** <br />
            Test failures today:
            [x](http://s3.amazonaws.com/xxxxxxxxxx-xxx/coverage/20xx-xx-xx/xx-xx/rspec.txt)
            failures <br />
            Test failures before:
            [x](http://s3.amazonaws.com/xxxxxxxxxx-xxx/coverage/20xx-xx-xx/xx-xx/rspec.txt)
            failures
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
