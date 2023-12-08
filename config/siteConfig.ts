// Very high level site configuration.
import { branding } from '@data/branding';

interface headLink {
    rel: string;
    href: string;
}

export interface siteMetaData {
    siteName: string;
    // This is where the site is actually hosted:
    siteHost: string;
    // Url listed as where users should go
    homePage: string;
    // This is the hostname used to lookup pages in the dynamoDB mapping table.
    // (This lets us run the old site and the new site in parallel.)
    canonicalHostName: string;
    // Date at which feed items will begin broadcasting.
    // Items prior to this will not be generated in the feed.
    // Assists in switching users from old site with old feed to new.
    feedBeginsAt: string;
    // Links to display at the top of each page in <head>
    links: headLink[];
}

// TODO: Seems very weak sauce to require this branding config
// to be Javascript instead of a json data file.
export const siteConfig = branding as siteMetaData;

// Default limit to rss feeds and list pages
export const PAGE_SIZE: number = 25;
