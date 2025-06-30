import TelegramBot from "node-telegram-bot-api";
import {getDynamoData} from "../utils/dynamoUtils";

const BOT_TOKEN = process.env.BOT_TOKEN ?? "";
const CHAT_ID = process.env.CHAT_ID ?? "";

const bot = new TelegramBot(BOT_TOKEN, {polling: false});

export async function processTelegramWebhook(body: any) {
    /* We will process data manually since using the library event emitter async will cause the lambda
     * to terminate eager without processing the event.
     *
     * We only care about callback_query don't need to listen for messages.
     */
    if (body.callback_query) {
        await callbackHandler(body.callback_query)
    }
}

export async function sendMessage(text: string, options: any = {}, parseMode: string = "HTML") {

    options.parse_mode = parseMode;

    const {
        chat: {id: chatId},
        message_id: messageId,
    } = await bot.sendMessage(CHAT_ID, text, options);
    return {chatId, messageId};
}

const callbackHandler = async (query: TelegramBot.CallbackQuery) => {
    const chatId = query.message?.chat.id;
    const messageId = query.message?.message_id;

    if (query.data === "1" && chatId && messageId) {
        const event = await getDynamoData(chatId, messageId);
        //TODO: Call NamecheapAPI
        await bot.sendMessage(chatId, `✅ Bid confirmed for domain ${event.data.sale.name}! Amount: ${event.data.nextBid.amount}$`);
    }

    await bot.answerCallbackQuery(query.id);
};
