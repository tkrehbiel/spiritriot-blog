import { TextType, contentToHTML } from '@/types/contentText';

export type PageContentType = 'post' | 'micropost' | undefined;

// A single displayable content entry.
// Presumably one of a list of entries,
// which can be sorted by date.
// TODO: add basic string metadata key/value pairs
export interface PageContent {
    type?: PageContentType;
    timestamp: number; // UTC milliseconds from unix epoch
    route: string; // route to the content entry, essentially a unique identifier
    summary?: TextType;
    article: TextType;
    title?: string;
    image?: string; // header image url
    children?: PageContent[];
}

export const ERROR_ENTRY: PageContent = {
    timestamp: Date.now(),
    route: '',
    article: new TextType('Error'),
};

export function renderSummaryAsHTML(entry: PageContent): string {
    if (entry.summary !== null && entry.summary !== undefined)
        return contentToHTML(entry.summary);
    else return 'no summary';
}

export function renderArticleAsHTML(entry: PageContent): string {
    if (entry.article !== null && entry.article !== undefined)
        return contentToHTML(entry.article);
    else if (entry.summary !== null && entry.summary !== undefined)
        return contentToHTML(entry.summary);
    else return 'no article';
}
