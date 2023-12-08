import { canonicalizePath } from '@/site/utilities';
import { safeStringify } from '@/types/strings';
import {
    AttributeValue,
    GetItemCommand,
    ScanCommand,
} from '@aws-sdk/client-dynamodb';
import { PageContent, ERROR_ENTRY } from '../interfaces/content';
import { safeParseDateMillis } from '@/types/dates';
import { TextType } from '@/types/contentText';
import { dynamoClient } from '@config/awsDynamoClient';

export async function getContentAtRouteDynamo(
    route: string[],
): Promise<PageContent> {
    const pageEntry = await getPageAtRoute(route);
    if (pageEntry) return pageEntry;
    const sectionEntry = await getSectionAtRoute(route);
    if (sectionEntry) return sectionEntry;
    return ERROR_ENTRY;
}

async function getPageAtRoute(route: string[]): Promise<PageContent | null> {
    const key = canonicalizePath(route.join('/'));
    const command = new GetItemCommand({
        TableName: 'endgameviable-generated-pages',
        Key: {
            pagePath: { S: key },
        },
    });
    try {
        const response = await dynamoClient.send(command);
        if (response.Item) {
            console.log(`${key} page read from dynamoDB`);
            const item = response.Item;
            return {
                type: 'post',
                timestamp: safeParseDateMillis(item.pageDate.S),
                route: safeStringify(getS(item.pagePath)),
                summary: new TextType(getS(item.pageSummary), 'text/plain'),
                article: new TextType(getS(item.pageContentHtml), 'text/html'),
                title: getS(item.pageTitle),
                image: getS(item.pageImage),
            };
        } else {
            console.log(`${key} page not found in dynamoDB`);
        }
    } catch (error) {
        console.log(error);
    }
    return null;
}

async function getSectionAtRoute(route: string[]): Promise<PageContent | null> {
    // TODO: I don't think I can ever make this work
    // Can't do a ScanCommand that sorts by date descending
    // Can't do a QueryCommand where pageSection starts with a string
    let lastKey: any = undefined;
    const section = canonicalizePath(route.join('/'));
    const children: PageContent[] = [];
    do {
        const command = new ScanCommand({
            TableName: 'endgameviable-generated-pages',
            IndexName: 'pageSection-pageDate-index',
            ExclusiveStartKey: lastKey,
            FilterExpression: 'begins_with(pageSection, :sectionPrefix)',
            ExpressionAttributeValues: {
                ':sectionPrefix': { S: section },
            },
        });
        const response = await dynamoClient.send(command);
        if (response.Items && response.Items.length > 0) {
            const entries: PageContent[] = response.Items.map((item) => ({
                type: 'post',
                timestamp: safeParseDateMillis(getS(item.pageDate)),
                route: safeStringify(getS(item.pagePath)),
                summary: new TextType(getS(item.pageSummary), 'text/plain'),
                article: new TextType(getS(item.pageContentHtml), 'text/html'),
                title: getS(item.pageTitle),
                image: getS(item.pageImage),
            }));
            children.push(...entries);
        }
        lastKey = response.LastEvaluatedKey;
    } while (lastKey);
    if (children.length > 0) {
        children.sort((a, b) => b.timestamp - a.timestamp);
        console.log(
            `${section} section found in dynamoDB (${children.length} items)`,
        );
        return {
            route: section,
            timestamp: Date.now(),
            article: new TextType('Entries at ' + section),
            children: children.slice(0, 25),
        };
    }
    console.log(`${section} section not found in dynamoDB`);
    return null;
}

export function getS(attribute: AttributeValue): string | undefined {
    if (!attribute) return undefined;
    if (attribute.S) return attribute.S;
    return undefined;
}
