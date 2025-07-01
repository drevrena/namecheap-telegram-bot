import {AuctionEvent, Sale} from "../types/auction-webhook-types";
import {getTimeLeft, padTime} from "../utils/date-utils";
import {sendMessage} from "./telegram-service";
import {getAuctionInfo} from "../integrations/namecheap-api";
import {AuctionDataRepository} from "../repositories/auction-data-repository";

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

    const sale: Sale = await getAuctionInfo(event.data.sale.id);
    const timeLeft = getTimeLeft(new Date(), new Date(sale.endDate));

    const {chatId, messageId} = await sendMessage(
        `Hey, You got outbid on the domain 🌐 ${sale.name}, you got: \n` +
        `📅 <b>${timeLeft.days} Days and ⏳${padTime(timeLeft.hours)}:${padTime(timeLeft.minutes)}:${padTime(timeLeft.seconds)}</b> \n` +
        `💸 ${sale.minBid}$ + (${sale.renewPrice}$) \n\n` +
        `Please reply to the message with the bid amount if you want to continue`);

    await AuctionDataRepository.set(chatId, messageId, event);
}

export function handleWin(event: AuctionEvent) {
    console.log("handleWin");
}