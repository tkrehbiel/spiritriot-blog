import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { fromNodeProviderChain } from '@aws-sdk/credential-providers';

export const dynamoClient = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: fromNodeProviderChain(),
});
