import { SQSClient } from '@aws-sdk/client-sqs';
import { fromNodeProviderChain } from '@aws-sdk/credential-providers';

export const sqsClient = new SQSClient({
    region: process.env.AWS_REGION,
    credentials: fromNodeProviderChain(),
});
