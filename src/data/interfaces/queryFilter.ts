import { PageContent } from './content';
import { safeTextSearch } from '@/types/strings';

// A standard set of filters for querying entries
export default interface EntryQueryParams {
    routeStartsWith: string;
    contains: string;
}

// A constant to match all entries
export const MATCH_ALL_ENTRIES: EntryQueryParams = {
    routeStartsWith: '',
    contains: '',
};

// Test to see if an entry passes the filter parameters
export function entryMatchesFilter(
    entry: PageContent,
    filter: EntryQueryParams,
): boolean {
    if (entry === null || entry === undefined) return false;
    if (filter === null || filter === undefined) return true;
    if (filter.routeStartsWith !== '') {
        if (!entry.route.startsWith(filter.routeStartsWith)) return false;
    }
    if (filter.contains !== '') {
        if (
            !safeTextSearch(entry.title, filter.contains) &&
            !safeTextSearch(entry.summary, filter.contains) &&
            !safeTextSearch(entry.article, filter.contains)
        )
            return false;
    }
    return true;
}
