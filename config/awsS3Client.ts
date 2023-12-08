import { S3Client } from '@aws-sdk/client-s3';
import { fromNodeProviderChain } from '@aws-sdk/credential-providers';

export const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: fromNodeProviderChain(),
});
