import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient, GetCommand, PutCommand} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({region: process.env.AWS_REGION});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.DYNAMO_TABLE_NAME;

export async function setDynamoData(
    chatId: number,
    messageId: number,
    data: any,
) {
    const key = `${chatId}:${messageId}`;

    const item = {
        id: key,
        data,
    };

    await docClient.send(
        new PutCommand({
            TableName: TABLE_NAME,
            Item: item
        })
    );
}

export async function getDynamoData(chatId: number, messageId: number) {
    const key = `${chatId}:${messageId}`;

    const res = await docClient.send(
        new GetCommand({
            TableName: TABLE_NAME,
            Key: {id: key}
        })
    );

    return res.Item?.data;
}
