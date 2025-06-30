import {AuctionEvent, AuctionEventType} from './types/auction-webhook.types'
import {handleClosed, handleEnded, handleOutbid, handleWin, handleWinnerRunner} from "./services/AuctionService";
import {processTelegramWebhook} from "./services/TelegramService";

export const handler = async (lambdaEvent: any) => {

    console.log("Received body", JSON.stringify(lambdaEvent.body));
    const body = JSON.parse(lambdaEvent.body);
    //Telegram Bot Webhook, handling two webhook in the same lambda for convenience
    //Namecheap webhook doesn't have "update_id" field
    if (body.update_id) {
        await handleTelegramWebhook(body);
    } else {
        await handleNamecheapWebhook(body);
    }
};

async function handleTelegramWebhook(body: any) {
    await processTelegramWebhook(body);
    return {
        statusCode: 200,
        body: 'OK',
    };
}

async function handleNamecheapWebhook(body: any) {

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