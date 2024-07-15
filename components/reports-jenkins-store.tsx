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

export const useSelectedJenkinsReportsStore = create<{
  selectedReport_1: ReportJenkins;
  selectedReport_2: ReportJenkins;
  setSelectedReport_1: (newSelectedReport_1: ReportJenkins) => void;
  setSelectedReport_2: (newSelectedReport_2: ReportJenkins) => void;
}>((set) => ({
  selectedReport_1: {} as ReportJenkins,
  selectedReport_2: {} as ReportJenkins,
  setSelectedReport_1: (newSelectedReport_1: ReportJenkins) =>
    set({ selectedReport_1: newSelectedReport_1 }),
  setSelectedReport_2: (newSelectedReport_2: ReportJenkins) =>
    set({ selectedReport_2: newSelectedReport_2 }),
}));
