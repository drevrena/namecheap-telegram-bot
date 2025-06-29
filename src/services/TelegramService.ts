import TelegramBot from "node-telegram-bot-api";
import {getDynamoData} from "../utils/dynamoUtils";
import {AuctionEvent} from "../types/auction-webhook.types";

const BOT_TOKEN = process.env.BOT_TOKEN ?? "";
const CHAT_ID = process.env.CHAT_ID ?? "";

const bot = new TelegramBot(BOT_TOKEN, {polling: false});

export async function processTelegramWebhook(body: any) {
    bot.processUpdate(body);
}

export async function sendMessage(text: string, options: any = {}) {
    const {
        chat: {id: chatId},
        message_id: messageId,
    } = await bot.sendMessage(CHAT_ID, text, options);
    return {chatId, messageId};
}

bot.on('callback_query', async (query) => {
    const data = query.data!;
    //Get Bid Data from Dynamo
    await bot.answerCallbackQuery(query.id);

    const chatId = query.message!.chat.id;
    const messageId = query.message!.message_id;

    if (data === "1") {
        const event: AuctionEvent = await getDynamoData(chatId, messageId)
        //Call Namecheap API
        console.log(`Calling API with saleId : ${event.data.sale.id} and amount: ${event.data.nextBid.amount}`);
        //await placeBid(saleId, amount)
    }

    await bot.sendMessage(chatId, `Bid confirmed!`);
});