export type UserClerk = {
  id: string;
  username: string | null | undefined;
  createdAt: number | null | undefined;
};

export type ReportJenkins = {
  build: string;
  date: string;
  link: string;
  number_of_failures: string;
  subject: string;
};

export type ComboList = {
  label: string;
  value: string;
};

export type Usage = {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
};

export const MAX_FREE_CREDITS = 5;
