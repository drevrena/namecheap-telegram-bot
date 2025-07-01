import {handleNamecheapWebhook} from "./controllers/namecheap-controller";
import {handleTelegramWebhook} from "./controllers/telegram-controller";

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

