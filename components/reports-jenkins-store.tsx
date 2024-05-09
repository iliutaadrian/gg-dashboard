import { create } from "zustand";
import { ReportJenkins } from "@/types";

type ReportJenkinsState = {
  reports: ReportJenkins[];
  setReports: (newReports: ReportJenkins[]) => void;
};

export const useReportsJenkinsStore = create<ReportJenkinsState>((set) => ({
  reports: [],
  setReports: (newReports: ReportJenkins[]) => set({ reports: newReports }),
}));

export const useStepStore = create<{
  step: number;
  setStep: (newStep: number) => void;
}>((set) => ({
  step: 1,
  setStep: (newStep: number) => set({ step: newStep }),
}));

export const useTestsJenkinsStore = create<{
  file_1: string;
  file_2: string;
  setFile_1: (newFile_1: string) => void;
  setFile_2: (newFile_2: string) => void;
}>((set) => ({
  file_1: "",
  file_2: "",
  setFile_1: (newFile_1: string) => set({ file_1: newFile_1 }),
  setFile_2: (newFile_2: string) => set({ file_2: newFile_2 }),
}));
