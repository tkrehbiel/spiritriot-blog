import path from 'path';
import { promises as fs } from 'fs';
import { PageContent } from '@/data/interfaces/content';
import { HugoJsonPage } from '../interfaces/hugo';
import { hugoToPage, hugoToPageList } from '@/types/page';

// TODO: Ever heard of classes? OOP? Yeah, do that.
// Make a provider class and implementations for S3, Dynamo, and local.
// Although, to be fair, we're only going to pick one to use.

export const getContentAtRouteLocal = async (
    route: string[],
): Promise<PageContent> => {
    const relativepath = path.join(route.join('/'), 'index.json');
    const data: HugoJsonPage = await getLocalJSONFile(relativepath);
    if (data.children && data.children.length > 0) {
        // List page
        const children = hugoToPageList(data.children);
        return hugoToPage(data, children);
    } else {
        // Single page
        return hugoToPage(data, []);
    }
};

export async function getLocalJSONFile(relativepath: string): Promise<any> {
    const pathname = path.join(
        process.cwd(),
        'content',
        relativepath,
    );
    try {
        const body = await fs.readFile(pathname, 'utf8');
        return JSON.parse(body);
    } catch(error) {
        // file not found probably
        return null;
    }
}
