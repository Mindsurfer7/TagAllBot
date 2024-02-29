import TelegramBot from "node-telegram-bot-api";

console.log("server started");

//https://habr.com/ru/articles/740796/
//https://habr.com/ru/companies/timeweb/articles/665124/
// let x = "2cYJ7oRJ6KnGQHyaHJ8HlULMlOR_2yGN7YbAgjq6j57cELoMm";

const TG_API_TOKEN = "6621662944:AAH8ixhp2roKlwWeUwspG0lIRYYckT6D35c";

const bot = new TelegramBot(TG_API_TOKEN, {
  polling: true,
});

bot.on("text", async (msg) => {
  console.log(msg);
});

bot.on("message", async (msg) => {
  console.log(msg);

  if (msg.text?.includes("/teamcall")) {
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
  } else if (msg.text.includes("/start")) {
    await bot.sendMessage(msg.chat.id, "Я сказала стартуем!");
  }
});
