require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const issueParser = require("./libs/Parser");
const Github = require("./libs/Github");

const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const githubToken = process.env.GITHUB_TOKEN;
const githubUser = process.env.GITHUB_USER;
const githubRepository = process.env.GITHUB_REPOSITORY;

const bot = new TelegramBot(telegramBotToken, {
    polling: true
});
const github = Github(githubToken, githubUser, githubRepository);

bot.on("message", async (msg) => {
    const chatId = msg.chat.id;

    try {
        const issue = issueParser(msg);
        await github.createIssue(issue);

        bot.sendMessage(chatId, "Received your issue. Thanks!");
    } catch (err) {
        console.log(err)
        bot.sendMessage(
            chatId,
            "Your issue isn't receive. Sorry please try again later."
        );
    }
});