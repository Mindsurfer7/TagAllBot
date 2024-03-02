import OpenAI from "openai";
import { config } from "dotenv";
config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const whisper = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export const transcribeVoice = async (file) => {
  const payload = {
    file: file,
    model: "whisper-1",
  };

  const transcription = await whisper.audio.transcriptions.create(payload);

  console.log("Success");

  return transcription.text;
};
