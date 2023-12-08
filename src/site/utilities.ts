import path from 'path';
import { siteConfig } from '@config/siteConfig';

// TODO: All of this needs unit tests

// Generate a permalink to a route within the site,
// with an optional hostname override.
export function permalink(
    relUrl: string,
    hostname: string = siteConfig.siteHost,
): string {
    return ensureTrailingSlash(linkWithDomain(hostname, relUrl), true);
}

export function linkWithDomain(hostname: string, pathname: string): string {
    return ensureHttps(path.join(hostname, canonicalizePath(pathname)));
}

export function ensureHttps(url: string): string {
    // TODO: naive, what if we pass in http://something?
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
// Next.js doesn't want slashes on the end
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

export function ensureTrailingSlash(path: string, add: boolean): string {
    if (add) {
        // add a slash if it doesn't exist
        if (path.endsWith('/')) return path;
        return path + '/';
    } else {
        // remove slash if it exists
        if (!path.endsWith('/')) return path;
        return path.substring(0, path.length - 1);
    }
}
