import {AuctionEvent} from "../types/auction-webhook.types";
import {getTimeLeftFormatted} from "../utils/dateUtils";
import {sendMessage} from "./TelegramService";
import {setDynamoData} from "../utils/dynamoUtils";
import {createReplyButtons} from "../utils/telegramUtils";
import {TelegramReplyButton} from "../types/telegram.types";

export function handleWinnerRunner(event: AuctionEvent) {
    console.log("handleWinnerRunnerup");
}

export function handleClosed(event: AuctionEvent) {
    console.log("handleClosed");

}

export function handleEnded(event: AuctionEvent) {
    console.log("handleEnded");
}

export async function handleOutbid(event: AuctionEvent) {

    const {
        sale: {name: domain, endDate},
        nextBid: {amount}
    } = event.data;

    const timeLeft = getTimeLeftFormatted(new Date(), new Date(endDate));

    const buttons: TelegramReplyButton[] = [
        {text: `👎 Don't Bid`, callback_data: "0"},
        {text: `👍 Okay Bid`, callback_data: "1"},
    ]

    const{chatId, messageId} = await sendMessage(
        `Hey, You got outbid on the domain ${domain}, You got ${timeLeft} left, the next bid is ${amount}`,
        createReplyButtons(buttons));

    await setDynamoData(chatId, messageId, event.data);
}

export function handleWin(event: AuctionEvent) {
    console.log("handleWin");
}