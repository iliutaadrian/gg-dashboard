export type UserClerk = {
  id: string;
  username: string | null | undefined;
  createdAt: number | null | undefined;
};
//
// export type FullProject = Project & {
//   files: FullProjectFile[]
// };
//
// export type FullProjectFile = ProjectFile & {
//   entries: FullEntryType[]
// }
//
// export type FullEntryType = Entry & {
//   translationValues: any;
// };
//
export type Usage = {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
};

export const MAX_FREE_CREDITS = 5;

export const summary_sections = [
  {
    name: "Timeline Summary",
    key: "timeline-summary",
    value: `Timeline Summary:Craft a timeline that captures 5 key moments from the video.
For each entry:
Include the timestamp from the video
Hyperlink the timestamp to the specific moment in the video using {{url}}
Example format:
- (correct emoji for the context) [00:00:00]({{url}}&t=0s): Introduction to the main topic`,
  },
  {
    name: "Key Insights",
    key: "key-insights",
    value: `Key Insights:Identify and list the most important takeaways and unique points made in the video. For increased clarity:

Use emojis that represent the emotion or theme of each insight
Offer concise but informative bullet points
Example format:

- (correct emoji for the context)📊 Insight about data trends`,
  },
  {
    name: "Best Quotes",
    key: "best-quotes",
    value: `Best Quotes:Select memorable quotes from the video. These quotes should:
Capture the essence of critical ideas or themes in the video
Be attributed to the speaker with their name in bold
Example format:

- (correct emoji for the context) Speaker Name: "This is a memorable quote."`,
  },
  {
    name: "Q&A Based on Transcript",
    key: "qa-transcript",
    value: `Q&A Based on Transcript:Based on the transcript, craft questions and provide informative answers that could be part of an interview or Q&A session. Focus on:

Diverse questions that touch on different aspects of the video content
Complete answers that provide a deeper understanding of the topics discussed
Example format:

- bold text: (correct emoji for the context) Question: (question) not in bold: Answer: (answer) new line`,
  },
  {
    name: "Assimilation Questions",
    key: "assimilation-questions",
    value: `Assimilation Questions:Conceive 5 engaging questions that will enable the viewer to reflect on and better assimilate the video content. These questions should:

Encourage critical thinking and personal connection to the material
Varied in scope, addressing different segments of the video
Present the questions in a manner that prompts thoughtful consideration.
    - bold text: (correct emoji for the context) Question: (question) not in bold: Answer: (answer) new line`,
  },
];
