"use client";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { CheckIcon, XIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Faq() {
  const faqs = [
    {
      question: "What is Tube Mind Sync?",
      answer:
        "Tube Mind Sync is a free platform that allows you to connect with others who are using the same platform.",
    },
    {
      question: "What is the price?",
      answer: "The price is $10 per month.",
    },
    {
      question: "What is Tube Mind Sync?",
      answer:
        "Tube Mind Sync is a free platform that allows you to connect with others who are using the same platform.",
    },
    {
      question: "What is the price?",
      answer: "The price is $10 per month.",
    },
    {
      question: "What is Tube Mind Sync?",
      answer:
        "Tube Mind Sync is a free platform that allows you to connect with others who are using the same platform.",
    },
    {
      question: "What is the price?",
      answer: "The price is $10 per month.",
    },
  ];
  return (
    <div
      className="md:max-w-5xl mx-auto py-10 flex flex-col md:flex-row"
      id="faq"
    >
      <div className="basis-1/2">
        <h1 className="text-2xl md:text-4xl text-primary text-center">
          Frequently Asked Questions
        </h1>
        <h1 className=" font-medium text-center">
          Have another question? Contact me on Twitter or by email.
        </h1>
      </div>
      <div className="basis-1/2 px-10">
        {faqs.map((faq, index) => (
          <Accordion key={index} type="single" collapsible>
            <AccordionItem value={faq.question} className="my-5">
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  );
}
