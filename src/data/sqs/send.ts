import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { QueueEvent } from './event';
import { ENV, getEnv } from '@config/env';

export async function sendMessage(
    sqsClient: SQSClient,
    payload: QueueEvent,
): Promise<boolean> {
    const sqsEventQueueName = getEnv(ENV.EVENT_QUEUE);
    const command = new SendMessageCommand({
        QueueUrl: sqsEventQueueName,
        MessageBody: JSON.stringify(payload),
    });
    try {
        await sqsClient.send(command);
        return true;
    } catch (error) {
        // How are we supposed to handle these errors?
        console.log(error);
    }
    return false;
}
