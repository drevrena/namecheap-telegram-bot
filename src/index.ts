import { AuctionEvent, AuctionEventType } from './types/auction-webhook.types'
import {handleEnded, handleClosed, handleWinnerRunner, handleOutbid, handleWin} from "./services/AuctionService";
import {processTelegramWebhook} from "./services/TelegramService";
import {Context} from "aws-lambda";

export const handler = async (lambdaEvent: any, context: Context) => {

    console.log("Received event", JSON.stringify(lambdaEvent));
    console.log("Received context", JSON.stringify(context));
    //Telegram Bot Webhook, handling two webhook in the same lambda for convenience
    //Namecheap webhook doesn't have "result" field
    if (lambdaEvent.result) {
        await handleTelegramWebhook(lambdaEvent);
    } else {
        await handleNamecheapWebhook(lambdaEvent);
    }
};

async function handleTelegramWebhook(lambdaEvent: any) {
    const body = JSON.parse(lambdaEvent.body!);
    await processTelegramWebhook(body);
    return {
        statusCode: 200,
        body: 'OK',
    };
}

async function handleNamecheapWebhook(lambdaEvent: any) {

    const event: AuctionEvent = lambdaEvent.event;

    switch (event.type) {
        case AuctionEventType.AUCTION_ENDED:
            handleEnded(event);
            break;
        case AuctionEventType.AUCTION_CLOSED:
            handleClosed(event);
            break;
        case AuctionEventType.AUCTION_WINNER_RUNNERUP:
            handleWinnerRunner(event);
            break;
        case AuctionEventType.AUCTION_OUTBID:
            await handleOutbid(event);
            break;
        case AuctionEventType.AUCTION_WINNER:
            handleWin(event);
            break
        default:
            console.log(`Error: Auction event type ${event.type} not implemented.`);
            break;
    }
}