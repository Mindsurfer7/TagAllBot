import TelegramBot from "node-telegram-bot-api";
import { transcribeVoice } from "./whisperAI.js";
import { oggConverter } from "./soundConverter.js";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { config } from "dotenv";
config();

console.log(`server started on ${process.env.PORT} port `);

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const TELEGRAM_API_TOKEN = process.env.TELEGRAM_API_TOKEN;

// const TELEGRAM_API_TOKEN = "6621662944:AAH8ixhp2roKlwWeUwspG0lIRYYckT6D35c";

export const __dirname = dirname(fileURLToPath(import.meta.url));

const bot = new TelegramBot(TELEGRAM_API_TOKEN, {
  polling: true,
});

const oggConverterInstance = new oggConverter();

bot.on("voice", async (msg) => {
  if (msg.voice) {
    console.log("VOICE MESSAGE ", msg.voice);

    try {
      const audioFileURL = await bot.downloadFile(
        msg.voice.file_id,
        resolve(__dirname, "./voices")
      );

      const mp3URL = await oggConverterInstance.toMp3(
        audioFileURL,
        msg.voice.file_id
      );

      const file = fs.createReadStream(mp3URL);

      const translatedText = await transcribeVoice(file);
      const answer = `${msg.from.username} хочет сказать всем, что: <blockquote> ${translatedText}</blockquote> `;
      await bot.sendMessage(msg.chat.id, answer, { parse_mode: "HTML" });
    } catch (e) {
      console.log(e, "voice error");
    }
  }
});

bot.on("message", async (msg) => {
  if (msg.text && msg.text?.includes("/call")) {
    const commandRegex = new RegExp(`^/call\\b`, "i");
    const textWithoutCommand = msg.text.replace(commandRegex, "").trim();

    await bot.sendMessage(msg.chat.id, "че над?)", { parse_mode: "HTML" });
  }

  if (msg.text && msg.text?.includes("/teamcall")) {
    const admins = await bot.getChatAdministrators(msg.chat.id);

    const commandRegex = new RegExp(`^/teamcall\\b`, "i");

    const textWithoutCommand = msg.text.replace(commandRegex, "").trim();

    const usernames = admins
      .map((admin) => {
        return admin.user.username;
      })
      .map((username) => `@${username}`);

    const answer = `${msg.from.username} хочет сказать всем (${usernames.join(
      ", "
    )}), что: <blockquote> ${textWithoutCommand}</blockquote> `;

    await bot.sendMessage(msg.chat.id, answer, { parse_mode: "HTML" });
  }
});
