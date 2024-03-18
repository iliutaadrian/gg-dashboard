import { summary_sections } from "@/types";
import { gpt_response } from "./gpt";

export const segmentText = (inputText: string) => {
  const segments = [];
  const words = inputText.split(" ");

  let currentSegment = "";
  for (const word of words) {
    if ((currentSegment + word).length < 20000) {
      currentSegment += `${word} `;
    } else {
      segments.push(currentSegment.trim());
      currentSegment = `${word} `;
    }
  }

  if (currentSegment.trim().length > 0) {
    segments.push(currentSegment.trim());
  }

  return segments;
};

export const checkOpenAIKey = async () => {
  const response = await gpt_response(
    "You are an assistan, you will confirm me that the request is ok",
    "Respond me with OK.",
  );
  return response === "OK";
};

export const preprocessText = async (segment: string) => {
  const response = await gpt_response(
    "You will receive a part of a video transcript. Clean up the transcript by removing any unnecessary filler words, repeated phrases, or irrelevant content. Only respond with the text.",
    `Segment: ${segment} `,
  );

  return response;
};

export const openaiSummary = async (transcript: string) => {
  const title = await gpt_response(
    "You are a english professional. You will summarize the following text in the following format.",
    `Give me a good title for the following. Only respond with the title. Text: /${transcript}/`,
  );

  const description = await gpt_response(
    "You are a english professional. You will summarize the following text in the following format.",
    `Give me a good description for the following text. Maximum 250 characters. Only respond with the description. Text: /${transcript}/`,
  );

  const segmentPromises = summary_sections.map(async (section) => {
    const response = await gpt_response(
      "Transform the following video transcript into a structured Markdown section with the detailed sections listed below. Do not include Section name.",
      `Section: ${section.value} Text: /${transcript}/`,
    );

    return {
      ...section,
      response,
    };
  });

  const summary = await Promise.all(segmentPromises);

  return {
    summary,
    title,
    description,
  };
};
