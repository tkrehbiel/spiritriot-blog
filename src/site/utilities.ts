import { siteConfig } from '@config/siteConfig';

export function linkWithDomain(hostname: string, path: string): string {
    return 'https://' + hostname + canonicalizePath(path);
}

// Host and path to this site
export function thisSiteUrl(relUrl: string): string {
    return siteConfig.homePage + canonicalizePath(relUrl);
}

// Generate a link to an existing public site based on the route.
// Used when developing new site in parallel with an old one.
export function canonicalSiteUrl(relUrl: string): string {
    return linkWithDomain(siteConfig.canonicalHostName, relUrl);
}

export function ensureHttps(url: string): string {
    if (url.startsWith('https://')) return url;
    return 'https://' + url;
}

export function stripIndexJson(url: string): string {
    if (url && url.endsWith('/index.json')) {
        return url.substring(0, url.length - '/index.json'.length);
    }
    return url;
}

// Path = /path/to/content
export function canonicalizePath(path: string): string {
    if (path === '') return '/';
    let newPath = stripIndexJson(path);
    if (!newPath.startsWith('/')) newPath = '/' + newPath;
    if (newPath.endsWith('/'))
        newPath = newPath.substring(0, newPath.length - 1);
    return newPath;
}

// Route is same as path but does not have a leading /
export function canonicalizeRoute(path: string): string {
    let route = canonicalizePath(path);
    if (route.startsWith('/')) route = route.substring(1);
    return route;
}

export function ensureTrailingSlash(path: string): string {
    if (path.endsWith('/')) return path;
    return path + '/';
}
