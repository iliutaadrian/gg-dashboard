// @ts-nocheck
import summaryRules from "@/public/summary.md";
import { OpenAIApi } from "openai";
import { Configuration } from "openai/dist/configuration";

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

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const checkOpenAIKey = async () => {
  try {
    const response = await openai.createChatCompletion({
      temperature: 1,
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "system",
          content: `You are an assistan, you will confirm me that the request is ok`,
        },
        { role: "user", content: "Respond me with OK." },
      ],
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const preprocessText = async (segment: string) => {
  const response = await openai.createChatCompletion({
    temperature: 1,
    model: "gpt-3.5-turbo-0125",
    messages: [
      {
        role: "system",
        content: `You will receive a part of a video transcript. Clean up the transcript by removing any unnecessary filler words, repeated phrases, or irrelevant content. Only respond with the text.`,
      },
      { role: "user", content: `Segment: ${segment} ` },
    ],
  });
  let res: string = response.data.choices[0].message?.content || "";
  return res;
};

export const openaiSummary = async (transcript: string) => {
  let response = await openai.createChatCompletion({
    temperature: 1,
    model: "gpt-3.5-turbo-0125",
    messages: [
      {
        role: "system",
        content: `You are an assitant, you will summarize the following text in the following format.`,
      },
      { role: "user", content: `${summaryRules} Text: /${transcript}/` },
    ],
  });
  const summary = response.data.choices[0].message?.content || "";

  response = await openai.createChatCompletion({
    temperature: 1,
    model: "gpt-3.5-turbo-0125",
    messages: [
      {
        role: "system",
        content: `You are an assitant, you will summarize the following text in the following format.`,
      },
      {
        role: "user",
        content: `Give me a good title for the following. Only respond with the title. Text: /${transcript}/`,
      },
    ],
  });
  const title = response.data.choices[0].message?.content || "";

  response = await openai.createChatCompletion({
    temperature: 1,
    model: "gpt-3.5-turbo-0125",
    messages: [
      {
        role: "system",
        content: `You are an assitant, you will summarize the following text in the following format.`,
      },
      {
        role: "user",
        content: `Give me a good description for the following text. Maximum 250 characters. Only respond with the description. Text: /${transcript}/`,
      },
    ],
  });
  const description = response.data.choices[0].message?.content || "";

  return {
    summary,
    title,
    description,
  };
};
