import { PageContent } from '../interfaces/content';
import EntryQueryParams from '../interfaces/queryFilter';
import { ScanCommand } from '@aws-sdk/client-dynamodb';
import { getS } from './fetchFromDynamo';
import { getContentObject } from '../s3/fetchFromS3';
import { hugoToPage } from '@/types/page';
import { dynamoClient } from '@config/awsDynamoClient';
import { ENV, getEnv } from '@config/env';

export async function searchEntriesDynamo(
    params: EntryQueryParams,
): Promise<PageContent[]> {
    const searchContentTableName = getEnv(ENV.SEARCH_TABLE);
    console.log(`scanning ${searchContentTableName} for search parameters`);
    let lastKey: any = undefined;
    // const children: Entry[] = [];
    const promises: Promise<PageContent>[] = [];
    do {
        const command = new ScanCommand({
            TableName: searchContentTableName,
            ExclusiveStartKey: lastKey,
            FilterExpression: 'contains(pageSearchContent, :searchKeyword)',
            ExpressionAttributeValues: {
                ':searchKeyword': { S: params.contains.toLowerCase() },
            },
        });
        const response = await dynamoClient.send(command);
        if (response.Items && response.Items.length > 0) {
            for (const item of response.Items) {
                const key = getS(item.objectKey);
                if (key) {
                    promises.push(readEntry(key));
                }
            }
        }
        lastKey = response.LastEvaluatedKey;
    } while (lastKey);
    const children = await Promise.all(promises);
    if (children.length > 0) {
        children.sort((a, b) => b.timestamp - a.timestamp);
        console.log(`search found ${children.length} items`);
        return children;
    }
    console.log(`search didn't find any results`);
    return [];
}

async function readEntry(key: string): Promise<PageContent> {
    const json = await getContentObject(key);
    return hugoToPage(json);
}
