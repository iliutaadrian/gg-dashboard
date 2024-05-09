"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { useStepStore, useTestsJenkinsStore } from "../reports-jenkins-store";
import axios from "axios";
import { toast } from "../ui/use-toast";

export const GenerateDiff = () => {
  const { step, setStep } = useStepStore();
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("");
  const { file_1, file_2 } = useTestsJenkinsStore();

  const getDiff = async (e: any) => {
    setIsLoading(true);
    e.preventDefault();

    await axios
      .post(`/api/jenkins/test-difference`, {
        file_1,
        file_2,
      })
      .then((res) => {
        if (res.status === 200) {
          let data = "";
          res.data.map((element: any) => {
            data += `<b>${element.number}) ${element.name}</b><br />`;
            data += element.content + "<br /><br />";
          });
          setValue(data);
          toast({
            description: "Test diff generated successfully.",
          });
        }
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          description: err,
        });
      })
      .finally(() => {
        setIsLoading(false);
        // setStep(4)
      });
  };

  const generateFile = async (e: any) => {
    e.preventDefault();
  };

  return (
    <Card className="shadow-neon border-muted-foreground bg-primary/5 hover:bg-primary/10 pb-2">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-5">
            <div className="w-10 h-10 rounded-full border-2 border-primary flex justify-center items-center">
              <p>3.</p>
            </div>
            Generate Difference between reports
          </div>
        </CardTitle>
        <CardDescription>
          Select the report date you want to compare with.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex gap-5">
          <Button
            className="w-40"
            disabled={step > 2 ? false : true}
            isLoading={isLoading}
            onClick={(e) => getDiff(e)}
          >
            See difference
          </Button>
          <Button className="w-40" disabled={step > 4 ? false : true}>
            Download File
          </Button>
        </form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <div
          className="bg-gray-800 text-white p-5 text-sm w-full rounded-sm h-[300px] overflow-y-auto"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      </CardFooter>
    </Card>
  );
};
