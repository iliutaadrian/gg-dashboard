import { strict_output } from "./gpt";
import summary from "../public/summary.md";
import { Configuration } from "openai/dist/configuration";
import { OpenAIApi } from "openai";

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

export const checkOpenAIKey = async (key: string) => {
  if (!key) {
    return false; // If no key is provided, return false
  }

  try {
    const configuration = new Configuration({
      apiKey: key,
    });
    const openai = new OpenAIApi(configuration);

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

export const preprocessText = async (segment: string, key: any) => {
  const configuration = new Configuration({
    apiKey: key,
  });
  const openai = new OpenAIApi(configuration);

  const response = await openai.createChatCompletion({
    temperature: 1,
    model: "gpt-3.5-turbo",
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

export const openaiSummary = async (transcript: string, key: string) => {
  const configuration = new Configuration({
    apiKey: key,
  });
  const openai = new OpenAIApi(configuration);

  const response = await openai.createChatCompletion({
    temperature: 1,
    model: "gpt-3.5-turbo-0125",
    messages: [
      {
        role: "system",
        content: `You are an assistan, you will summarize the following text in the following format.`,
      },
      { role: "user", content: `${summary} Text: /${transcript}/` },
    ],
  });

  let res: string = response.data.choices[0].message?.content || "";

  return res;
};
