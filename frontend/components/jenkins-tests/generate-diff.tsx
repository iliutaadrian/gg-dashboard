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

type Test = {
  number: number;
  name: string;
  content: string;
  occurrences: number;
  occurrences_builds: string[];
}
export const GenerateDiff = () => {
  const { step, setStep } = useStepStore();
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("");
  const [testDiff, setTestDiff] = useState({} as Test[]);
  const [otherTests, setOtherTests] = useState({} as Test[]);
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
          setTestDiff(res.data.test_diff);
          setOtherTests(res.data.other_tests);

          let data = `Test difference between: Build #${selectedReport_1.build} - ${selectedReport_1.date} -> #${selectedReport_2.build} - ${selectedReport_2.date} \n\n`;
          res.data.test_diff.map((element: any) => {
            data += `${element.number}) ${element.name} - ${element.occurrences}/30: ${element.occurrences_builds}\n`;
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

  const getSeverity = (number: number) => {
    if (number > 4) {
      return "bg-green-500";
    } else if (number >= 2) {
      return "bg-yellow-500";
    } else {
      return "bg-red-500";
    }
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
          See test difference between selected reports and occurrences of each test in the last 10 builds.
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
      <CardFooter className="flex flex-col gap-10 border-t px-6 py-4">
        <div className="flex flex-col gap-5 w-full">
          Test Difference
          {testDiff.length === 0 && <p className="text-muted-foreground">No difference found between the two reports.</p>}
          {testDiff.length > 0 &&
            testDiff.map((element: Test) => {
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
                        <div className={`${getSeverity(element.occurrences)} w-10 h-10 rounded-full border-2 border-primary flex justify-center items-center`}>
                          <p> {element.number}</p>
                        </div>
                        {element.name.length > 70 ? element.name.substring(0, 70) + "..." : element.name} {element.occurrences}/30
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-5">
                      <p className="flex items-center text-md gap-2">
                        <span className="font-bold text-primary">Name</span>
                        {element.name}
                      </p>


                      <p className="flex items-center text-md gap-2">
                        <span className="font-bold text-primary">Occurrences</span>
                        {element.occurrences}
                      </p>

                      <p className="flex items-center text-md gap-2">
                        <span className="font-bold text-primary">Builds</span>
                        {element.occurrences_builds.join(", ")}
                      </p>

                      <div
                        className="bg-gray-800 text-white p-3 text-sm rounded-sm h-[200px] overflow-y-auto"
                        style={{ whiteSpace: 'pre-wrap' }}
                        dangerouslySetInnerHTML={{ __html: element.content }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )
            })
          }
        </div>

        <div className="flex flex-col gap-5 w-full">
          Other Tests
          {otherTests.length &&
            otherTests.map((element: Test) => {
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
                        <div className={`${getSeverity(element.occurrences)} w-10 h-10 rounded-full border-2 border-primary flex justify-center items-center`}>
                          <p> {element.number}</p>
                        </div>
                        {element.name} {element.occurrences}/30
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-5">
                      <p className="flex items-center text-md gap-2">
                        <span className="font-bold text-primary">Occurrences</span>
                        {element.occurrences}
                      </p>

                      <p className="flex items-center text-md gap-2">
                        <span className="font-bold text-primary">Builds</span>
                        {element.occurrences_builds.join(", ")}
                      </p>

                      <div
                        className="bg-gray-800 text-white p-3 text-sm rounded-sm h-[200px] overflow-y-auto"
                        style={{ whiteSpace: 'pre-wrap' }}
                        dangerouslySetInnerHTML={{ __html: element.content }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )
            })
          }
        </div>
      </CardFooter>
    </Card>
  );
};
