import TelegramBot from "node-telegram-bot-api";
import {placeAuctionBid} from "../integrations/namecheap-api";
import {AuctionDataRepository} from "../repositories/auction-data-repository";

const BOT_TOKEN = process.env.BOT_TOKEN ?? "";
const CHAT_ID = process.env.CHAT_ID ?? "";

const bot = new TelegramBot(BOT_TOKEN, {polling: false});

export async function processTelegramWebhook(body: any) {
    /* We will process data manually since using the library event emitter async will cause the lambda
     * to terminate eager without processing the event.
     */
    if (body.message.text) {
        await commandHandler(body.message)
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


async function commandHandler(message: TelegramBot.Message) {
    const replyMessage = message.reply_to_message
    const chatId = replyMessage?.chat.id;
    const messageId = replyMessage?.message_id;

    //Someone found and started the bot
    if (message.chat.id != chatId) {
        return
    }

    if (!chatId || !messageId) {
        await sendMessage(`Please reply to the message with the bid Amount!`);
        return;
    }

    try {
        const amount = Number(message.text);
        const event = await AuctionDataRepository.get(chatId, messageId);

        await placeAuctionBid(event.data.sale.id, amount);
        await AuctionDataRepository.delete(chatId, messageId);
        await bot.sendMessage(chatId, `✅ Bid confirmed for domain ${event.data.sale.name}!`);

    } catch (err: any) {
        await sendMessage(`An error occurred during the Bid operation. Check logs for more details.`);
    }

}