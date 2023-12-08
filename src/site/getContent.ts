import { PageContent } from '@/data/interfaces/content';
import { getContentAtRouteLocal } from '@/data/local/fetchFromLocal';
import { getContentAtRouteS3 } from '@/data/s3/fetchFromS3';
import { ENV, getEnv } from '@config/env';

const contentUrl = new URL(getEnv(ENV.DATA_LOCATION));

export async function getContentAtRoute(route: string[]): Promise<PageContent> {
    // TODO: Should go back to some kind of provider class probably
    if (contentUrl.protocol === 's3:') return getContentAtRouteS3(route);
    else if (contentUrl.protocol === 'file:')
        return getContentAtRouteLocal(route);
    else throw new Error(`unrecognizable content location: ${contentUrl}`);
}
