"use client";
import { FetchData } from "@/components/jenkins-tests/fetch-data";
import { GenerateDiff } from "@/components/jenkins-tests/generate-diff";
import { SelectReportDate } from "@/components/jenkins-tests/select-report-date";
import React from "react";
import { ComboList } from "@/types";

interface Props {
  project: ComboList[];
}
export const JenkinsSteps = ({ project }: Props) => {
  return (
    <div className="p-10 max-w-5xl mx-auto flex flex-col gap-5">
      <FetchData project={project} />
      <SelectReportDate />
      <GenerateDiff />
    </div>
  );
};
