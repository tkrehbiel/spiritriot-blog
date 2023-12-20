import path from 'path';
import { promises as fs } from 'fs';
import {
    Endpoint,
    EndpointMap,
    SiteIndex,
    Section,
    SectionMap,
} from '@/data/interfaces/routes';
import { getLocalJSONFile } from './fetchFromLocal';
import { HugoJsonPage } from '../interfaces/hugo';
import { safeParseDateMillis } from '@/types/dates';
import { canonicalizeRoute } from '@/site/utilities';

// Create an index of all the site data
export async function indexSiteData(): Promise<SiteIndex> {
    const sectionMap: SectionMap = {};
    const endpoints: Endpoint[] = [];

    async function traverse(dirRoot: string, currentDir: string) {
        const routes: Section[] = [];
        const parts = currentDir.split('/');
        for (let i = 0; i < parts.length; i++) {
            const path = parts.slice(0, i).join('/');
            if (!sectionMap[path]) {
                sectionMap[path] = {
                    pageIndex: 1,
                    pageTotal: 1,
                    previousPagePath: null,
                    nextPagePath: null,
                    path: canonicalizeRoute(path),
                    timestamp: 0,
                    endpoints: [],
                };
            }
            routes.push(sectionMap[path]);
        }
        const items = await fs.readdir(path.join(dirRoot, currentDir));
        for (const item of items) {
            const itemPath = path.join(currentDir, item);
            const itemStats = await fs.stat(path.join(dirRoot, itemPath));

            if (itemStats.isDirectory()) {
                await traverse(dirRoot, itemPath);
            } else if (itemStats.isFile() && item.endsWith('index.json')) {
                // TODO: Unfortunately we have to load the file to get the timestamp
                let ts: number = 0;
                const data: HugoJsonPage = await getLocalJSONFile(
                    path.join(currentDir, 'index.json'),
                );
                if (data !== null) ts = safeParseDateMillis(data.date);
                const endpoint = {
                    path: canonicalizeRoute(currentDir),
                    timestamp: ts,
                };
                for (const route of routes) {
                    if (ts > route.timestamp) route.timestamp = ts;
                    route.endpoints.push(endpoint);
                }
                endpoints.push(endpoint);
            }
        }
    }

    await traverse(path.join(process.cwd(), 'data_local'), '');

    // ensure maps and arrays are built
    const paginatedSectionMap: SectionMap = {};
    for (const key in sectionMap) {
        const section = sectionMap[key];
        for (const page of paginateSection(section)) {
            paginatedSectionMap[page.path] = page;
        }
    }

    const endpointMap: EndpointMap = {};
    for (const endpoint of endpoints) {
        endpointMap[endpoint.path] = endpoint;
    }

    return {
        sectionMap: paginatedSectionMap,
        endpointMap: endpointMap,
    };
}

function paginatedPath(basePath: string, pageIndex: number): string {
    const pageLabel = 'pg';
    if (pageIndex === 0) return basePath;
    return path.join(basePath, pageLabel, String(pageIndex));
}

// Paginate a section of posts
function paginateSection(section: Section): Section[] {
    section.endpoints.sort((a, b) => b.timestamp - a.timestamp);
    const pageSize = 25;
    if (section.endpoints.length <= pageSize) {
        // not enough posts to paginate
        return [section];
    }
    const maxPage = Math.floor(section.endpoints.length / pageSize) + 1;
    const pages: Section[] = [];
    // The first unlabeled page is always the most recent posts.
    let page: Section = {
        pageIndex: 0,
        pageTotal: maxPage,
        nextPagePath: null,
        previousPagePath: paginatedPath(section.path, maxPage - 1),
        path: paginatedPath(section.path, 0),
        timestamp: section.timestamp,
        endpoints: section.endpoints.slice(0, pageSize),
    };
    pages.push(page);
    // After that the posts are paginated from oldest to newest.
    // So pg/1 is the oldest set of posts, and pg/2 is newer.
    // (That way the page numbers remain the same forever
    // even as new posts are added to the section.)
    page = {
        pageIndex: 1,
        pageTotal: maxPage,
        nextPagePath: paginatedPath(section.path, 2),
        previousPagePath: null,
        path: paginatedPath(section.path, 1),
        timestamp: section.timestamp,
        endpoints: [],
    };
    pages.push(page);
    for (let i = section.endpoints.length - 1; i >= 0; i--) {
        if (page.endpoints.length >= pageSize) {
            const newPage: Section = {
                pageIndex: page.pageIndex + 1,
                pageTotal: maxPage,
                nextPagePath: paginatedPath(section.path, page.pageIndex + 2),
                previousPagePath: paginatedPath(section.path, page.pageIndex),
                path: paginatedPath(section.path, page.pageIndex + 1),
                timestamp: section.timestamp,
                endpoints: [],
            };
            if (page.pageIndex + 2 > maxPage) newPage.nextPagePath = null;
            page = newPage;
            pages.push(page);
        }
        page.endpoints.push(section.endpoints[i]);
    }
    return pages;
}

export function isSection(path: string, index: SiteIndex): boolean {
    return index.sectionMap[path] !== undefined;
}

export function getSection(path: string, index: SiteIndex): Section {
    return index.sectionMap[path];
}

export function isEndpoint(path: string, index: SiteIndex): boolean {
    return index.endpointMap[path] !== undefined;
}
