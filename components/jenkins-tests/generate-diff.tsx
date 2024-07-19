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
import { useStepStore, useSelectedJenkinsReportsStore } from "../reports-jenkins-store";
import axios from "axios";
import { toast } from "../ui/use-toast";
import { Accordion } from "@radix-ui/react-accordion";
import { AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

export const GenerateDiff = () => {
  const { step, setStep } = useStepStore();
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("");
  const [data, setData] = useState({} as { number: number; name: string; content: string }[]);
  const { selectedReport_1, selectedReport_2 } = useSelectedJenkinsReportsStore();

  const getDiff = async (e: any) => {
    setIsLoading(true);
    e.preventDefault();

    await axios
      .post(`/api/jenkins/test-difference`, {
        file_1: selectedReport_1.build,
        file_2: selectedReport_2.build,
      })
      .then((res) => {
        if (res.status === 200) {
          setData(res.data);
          let data = `Test difference between: Build #${selectedReport_1.build} - #${selectedReport_2.build} \n\n`;
          res.data.map((element: any) => {
            data += `${element.number}) ${element.name}\n`;
          });
          setValue(data);
          toast({
            description: "Test difference generated successfully.",
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
        setStep(4)
      });
  };

  const copyDiff = (e: any) => {
    e.preventDefault();
    navigator.clipboard.writeText(value);
    toast({
      description: "Test difference copied to clipboard.",
    });
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
          <Button className="w-40" disabled={step > 3 ? false : true} onClick={(e) => copyDiff(e)}>
            Copy Difference
          </Button>
        </form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <div className="flex flex-col items-center gap-5 w-full">
          {data.length &&
            data.map((element: any) => {
              return (
                <Accordion
                  key={element.number}
                  type="single"
                  collapsible
                  className="w-full"
                >
                  <AccordionItem value={`item-${element.name}`}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-5">
                        <div className="w-10 h-10 rounded-full border-2 border-primary flex justify-center items-center">
                          <p>{element.number}</p>
                        </div>
                        {element.name}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div
                        className="bg-gray-800 text-white p-5 text-sm rounded-sm h-[200px] overflow-y-auto"
                        dangerouslySetInnerHTML={{ __html: element.content }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )
            })
          }
        </div>

        {/* <div */}
        {/*   className="bg-gray-800 text-white p-5 text-sm w-full rounded-sm h-[300px] overflow-y-auto" */}
        {/*   dangerouslySetInnerHTML={{ __html: value }} */}
        {/* /> */}
      </CardFooter>
    </Card>
  );
};
