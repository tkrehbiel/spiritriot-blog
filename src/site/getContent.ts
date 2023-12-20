import { PageContent } from '@/data/interfaces/content';
import { getContentAtRouteLocal } from '@/data/local/fetchFromLocal';
import { getContentAtRouteS3 } from '@/data/s3/fetchFromS3';
import { ENV, getEnv } from '@config/env';

export async function getContentAtRoute(
    route: string[],
): Promise<PageContent | null> {
    // TODO: Should go back to some kind of provider class probably
    const contentSource = getEnv(ENV.DATA_SOURCE);
    if (contentSource === 's3') return getContentAtRouteS3(route);
    else if (contentSource === 'local') return getContentAtRouteLocal(route);
    else throw new Error(`unrecognizable content source: ${contentSource}`);
}
