import {AuctionEvent, AuctionEventType} from "../types/auction-webhook-types";
import {handleClosed, handleEnded, handleOutbid, handleWin, handleWinnerRunner} from "../services/auction-service";

export async function handleNamecheapWebhook(body: any) {

    const event: AuctionEvent = body.event;

    switch (event.type) {
        case AuctionEventType.AUCTION_ENDED:
            await handleEnded(event);
            break;
        case AuctionEventType.AUCTION_CLOSED:
            await handleClosed(event);
            break;
        case AuctionEventType.AUCTION_WINNER_RUNNERUP:
            await handleWinnerRunner(event);
            break;
        case AuctionEventType.AUCTION_OUTBID:
            await handleOutbid(event);
            break;
        case AuctionEventType.AUCTION_WINNER:
            await handleWin(event);
            break
        default:
            console.log(`Error: Auction event type ${event.type} not implemented.`);
            break;
    }
}