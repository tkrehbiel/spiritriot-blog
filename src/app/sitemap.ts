import { getContentAtRoute } from '@/site/getContent';
import { permalink } from '@/site/utilities';

// sitemap.xml
export default async function Sitemap() {
    const allPages = await getContentAtRoute(['_pagemap']);
    if (allPages && allPages.children) {
        return allPages.children.map((entry) => ({
            url: permalink(entry.route),
            lastModified: new Date(entry.timestamp),
        }));
    }
    return [];
}
