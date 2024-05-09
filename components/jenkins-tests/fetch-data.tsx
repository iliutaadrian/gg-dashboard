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
import Link from "next/link";
import { toast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import axios from "axios";
import React from "react";
import { ComboList, ReportJenkins } from "@/types";
import {
  useReportsJenkinsStore,
  useStepStore,
  useTestsJenkinsStore,
} from "../reports-jenkins-store";
import { setSeconds } from "date-fns";

interface Props {
  project: ComboList[];
}

export const FetchData = ({ project }: Props) => {
  const { reports, setReports } = useReportsJenkinsStore();
  const { setStep } = useStepStore();

  const [value, setValue] = React.useState(project[0]?.value);
  const [isLoading, setIsLoading] = React.useState(false);

  const onClick = async (e: any) => {
    setIsLoading(true);
    e.preventDefault();
    if (!project) {
      toast({
        duration: 2000,
        variant: "default",
        description:
          "Make sure to add your email details and project name in settings.",
        action: (
          <ToastAction altText="Settings">
            <Link href="settings">Settings</Link>
          </ToastAction>
        ),
      });
    }

    await axios
      .get(`/api/jenkins/fetch-data/${value}`)
      .then((res) => {
        if (res.status === 200) {
          setReports(res.data);
          toast({
            description: "Data fetched successfully.",
          });
        }
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          description: err.response.data,
        });
      })
      .finally(() => {
        setIsLoading(false);
        setStep(2);
      });
  };
  return (
    <Card className="shadow-neon border-muted-foreground bg-primary/5 hover:bg-primary/10 pb-2">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-5">
            <div className="w-10 h-10 rounded-full border-2 border-primary flex justify-center items-center">
              <p>1.</p>
            </div>
            Fetch Data
          </div>
        </CardTitle>
        <CardDescription>
          Select Jenkins project from your email to fetch data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex gap-5 items-center">
          <Combobox
            list={project}
            value={value}
            setValue={setValue}
            text="Select your project..."
          />
          <Link href="settings">
            <Button size="icon" className="text-xl">
              +
            </Button>
          </Link>
          <Button
            isLoading={isLoading}
            className="w-40"
            onClick={(e) => onClick(e)}
          >
            Fetch Data
          </Button>
        </form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4 flex flex-col gap-2">
        {reports.length === 0 ? (
          <div className="bg-gray-800 text-white p-5 text-sm w-full rounded-sm">
            Last Report <br />
            xxxx_xxxxxxx - Build # xxxx - Successful! - x failures
            <Link href="#" className="ml-3 underline">
              View Report
            </Link>
          </div>
        ) : (
          <div className="bg-gray-800 text-white p-5 text-sm w-full rounded-sm">
            Last Report <br />
            {reports[reports.length - 1].subject} -{" "}
            {reports[reports.length - 1].number_of_failures} failures
            <Link
              href={reports[reports.length - 1].link}
              className="ml-3 underline"
            >
              View Report
            </Link>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
