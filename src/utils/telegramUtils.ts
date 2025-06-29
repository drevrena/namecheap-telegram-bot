import {TelegramReplyButton} from "../types/telegram.types";

export function createReplyButtons(buttons: TelegramReplyButton[]) {

    return {
        reply_markup: {
            inline_keyboard: [
                buttons
            ]
        }
    };
}