import {docClient} from "../utils/dynamo-utils";
import {DeleteCommand, GetCommand, PutCommand} from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = process.env.AUCTION_TABLE_NAME;

export const AuctionDataRepository = {

    async set(chatId: number, messageId: number, data: any, expire: number = 259200 /*3 days*/) {
        const expirationTime = Math.floor(Date.now() / 1000) + expire;
        const item: any = {
            id: `${chatId}:${messageId}`,
            data,
            expirationTime: expirationTime
        };


        const command = new PutCommand({
            TableName: TABLE_NAME,
            Item: item,
        });

        await docClient.send(command);
    },

    async get(chatId: number, messageId: number) {
        const command = new GetCommand({
            TableName: TABLE_NAME,
            Key: {id: `${chatId}:${messageId}`},
        });

        const result = await docClient.send(command);
        return result.Item?.data;
    },

    async delete(chatId: number, messageId: number) {
        const command = new DeleteCommand({
            TableName: TABLE_NAME,
            Key: {id: `${chatId}:${messageId}`},
        });

        await docClient.send(command);
    },
};
