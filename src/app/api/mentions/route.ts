import { Mention } from '@/data/interfaces/mention';
import { ensureHttps, ensureTrailingSlash } from '@/site/utilities';
import { safeStringify } from '@/types/strings';
import { GetItemCommand } from '@aws-sdk/client-dynamodb';
import { dynamoClient } from '@config/awsDynamoClient';
import { ENV, getEnv } from '@config/env';
import * as cheerio from 'cheerio';

// TODO: Someday might need to turn this into a paged interface.
// If e.g. there are hundreds or thousands of mentions (har).

const mastodonApiToken = getEnv(ENV.MASTODON_TOKEN);

async function lookupUrl(url: string): Promise<any> {
    const notificationTableName = getEnv(ENV.METADATA_TABLE);
    const command = new GetItemCommand({
        TableName: notificationTableName,
        Key: {
            url: { S: url },
        },
    });
    return dynamoClient.send(command).then((data) => data.Item);
}

async function authorizedGet(apiUrl: string): Promise<any> {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${mastodonApiToken}`);
    console.log(`querying ${apiUrl}`);
    return fetch(apiUrl, { method: 'GET', headers: headers }).then(
        (response) => {
            return response.json();
        },
    );
}

function statusToMention(status: any): Mention {
    console.log(status);
    const html = cheerio.load(status.content);
    return {
        date: safeStringify(status.created_at),
        content: safeStringify(html.text()),
        url: status.url,
    };
}

async function getThread(instance?: string, id?: string): Promise<Mention[]> {
    if (!instance || !id) return [];
    const mentions: Mention[] = [];
    instance = ensureHttps(instance);
    const status = await authorizedGet(`${instance}/api/v1/statuses/${id}`);
    if (!status) return [];
    mentions.push(statusToMention(status));
    await authorizedGet(`${instance}/api/v1/statuses/${id}/context`)
        .then((data) => {
            if (data.descendants) {
                for (const status of data.descendants) {
                    mentions.push(statusToMention(status));
                }
            }
        })
        .catch((error) => {
            console.log(error);
        });
    return mentions;
}

export async function GET(request: Request) {
    const linkTable = getEnv(ENV.METADATA_TABLE);
    if (!linkTable || linkTable === '')
        return new Response(
            JSON.stringify({ error: 'link table unconfigured' }),
            { status: 500 },
        );
    if (!mastodonApiToken || mastodonApiToken === '')
        return new Response(
            JSON.stringify({ error: 'api token unconfigured' }),
            { status: 500 },
        );

    const startTime = performance.now();
    const { searchParams } = new URL(request.url);
    const url = safeStringify(searchParams.get('url'));

    // Lookup url in the metadata linking table.
    // The table holds links from urls to metadata.
    let mentions: Mention[] = [];
    let item = await lookupUrl(ensureTrailingSlash(url, false));
    if (!item) {
        // try with a trailing slash for Hugo links
        item = await lookupUrl(ensureTrailingSlash(url, true));
    }
    if (item) {
        const instanceName = item.activityPubInstance.S;
        const statusId = item.activityPubStatusID.S;
        if (instanceName && statusId) {
            // If we have a link to an ActivityPub status ID,
            // call Mastodon api to fetch related statuses.
            mentions = await getThread(instanceName, statusId);
        }
    }

    const elapsed = performance.now() - startTime;
    console.log(`got ${mentions.length} mentions for ${url} in ${elapsed}ms`);

    return Response.json(mentions);
}
