import {processTelegramWebhook} from "../services/telegram-service";

export async function handleTelegramWebhook(body: any) {
    await processTelegramWebhook(body);
    return {
        statusCode: 200,
        body: 'OK',
    };
}
