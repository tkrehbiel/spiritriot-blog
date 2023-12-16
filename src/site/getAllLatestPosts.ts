import { getContentAtRoute } from '@/site/getContent';
import { PageContent } from '@/data/interfaces/content';

export async function getAllLatestPosts(): Promise<PageContent[]> {
    const entry = await getContentAtRoute([]);
    return entry && entry.children ? entry.children : [];
}
