import { strict_output } from "./gpt";

export const segmentText = (inputText: string) => {
  const segments = [];
  const words = inputText.split(" ");

  let currentSegment = "";
  for (const word of words) {
    if ((currentSegment + word).length < 3000) {
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
    await strict_output(
      `You are an assistan, you will confirm me that the request is ok`,
      "Respond me with OK.",
      { text: "OK" },
      { api_key: key, num_tries: 3, verbose: false },
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const gptTranslate = async (
  default_language: string,
  language: string,
  note: string,
  value: string,
  key: string,
) => {
  const output = await strict_output(
    `You are the best translator. You will receive a text in ${default_language}. You will translate the following text in ${language}. Take into consideration the following note points for translation: ${note}. I will include the text inside the symbols //: /text to be translated/. Do not include the symbol: /. Translate words like: empty, none, answer.`,
    `Text: /${value}/ Translated text:`,
    {
      initial_text: "Initial text",
      translated_text: "Translated text",
    },
    { api_key: key, num_tries: 3, verbose: true },
  );

  return output;
};
