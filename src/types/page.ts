import { PageContent } from '@/data/interfaces/content';
import { HugoJsonPage } from '@/data/interfaces/hugo';
import { canonicalizePath } from '@/site/utilities';
import { TextType } from './contentText';
import { safeStringify } from './strings';
import { safeParseDateMillis } from './dates';

// Convert the json returned from S3 endpoints to an Entry
export function hugoToPage(
    json: HugoJsonPage,
    children: PageContent[] = [],
): PageContent {
    try {
        let image: string | undefined = undefined;
        if (json.metadata && json.metadata.images) {
            image = json.metadata.images[0];
        }
        const entry: PageContent = {
            timestamp: safeParseDateMillis(safeStringify(json.date)),
            route: canonicalizePath(safeStringify(json.link)),
            summary: new TextType(safeStringify(json.summary), 'text/plain'),
            article: new TextType(safeStringify(json.content), 'text/html'),
            title: json.metadata?.title,
            type:
                json.metadata?.type?.toLowerCase() === 'micropost'
                    ? 'micropost'
                    : 'post',
            image: image,
            metadata: json.metadata,
            children: children,
        };
        if (json.next) {
            entry.next = {
                route: canonicalizePath(safeStringify(json.next.link)),
                title: json.next.title,
            };
        }
        if (json.previous) {
            entry.previous = {
                route: canonicalizePath(safeStringify(json.previous.link)),
                title: json.previous.title,
            };
        }
        if (json.pagination) {
            entry.pagination = {
                currentPage: json.pagination.currentPage,
                totalPages: json.pagination.totalPages,
                nextRoute: canonicalizePath(
                    safeStringify(json.pagination.nextPage),
                ),
                previousRoute: canonicalizePath(
                    safeStringify(json.pagination.previousPage),
                ),
            };
        }
        return entry;
    } catch (error) {
        console.log('error in', JSON.stringify(json));
        throw error;
    }
}

export function hugoToPageList(dataPages: HugoJsonPage[]): PageContent[] {
    const entries: PageContent[] = [];
    for (const jsonPage of dataPages) {
        if (
            jsonPage.metadata &&
            jsonPage.metadata.unlisted !== undefined &&
            jsonPage.metadata.unlisted === true
        )
            continue;
        const entry = hugoToPage(jsonPage, []);
        entries.push(entry);
    }
    return entries;
}
