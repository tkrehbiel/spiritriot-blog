import { Feed } from 'feed';
import {
    renderArticleAsHTML,
    renderSummaryAsHTML,
} from '../data/interfaces/content';
import { PAGE_SIZE, siteConfig } from '@config/siteConfig';
import { safeStringify } from '@/types/strings';
import { getAllLatestPosts } from './getAllLatestPosts';
import { linkWithDomain, thisSiteUrl } from './utilities';

export async function generateFeed(): Promise<Feed> {
    const entries = await getAllLatestPosts();
    entries.sort((b, a) => a.timestamp - b.timestamp);
    const feed = new Feed({
        title: siteConfig.siteName,
        description: `RSS feed for ${siteConfig.siteName}`,
        id: siteConfig.homePage,
        link: siteConfig.homePage,
        feedLinks: {
            json: linkWithDomain(siteConfig.siteHost, '/index.json'),
            rss: linkWithDomain(siteConfig.siteHost, '/index.xml'),
        },
        updated: new Date(),
        copyright: 'Copyright', // TODO
    });
    const feedStartingTimestamp = Date.parse(siteConfig.feedBeginsAt);
    entries.slice(0, PAGE_SIZE).map((entry) => {
        if (entry.timestamp >= feedStartingTimestamp) {
            feed.addItem({
                date: new Date(entry.timestamp),
                title: safeStringify(entry.title, 'Untitled'),
                id: thisSiteUrl(entry.route),
                link: linkWithDomain(siteConfig.siteHost, entry.route),
                description: renderSummaryAsHTML(entry),
                content: renderArticleAsHTML(entry),
            });
        }
    });
    return feed;
}
