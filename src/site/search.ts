import { PageContent } from '@/data/interfaces/content';
import EntryQueryParams from '@/data/interfaces/queryFilter';
import { searchEntriesDynamo } from '@/data/dynamo/searchDynamo';
import { searchEntriesLocal } from '@/data/local/searchLocal';
import { ENV, getEnv } from '@config/env';

export async function searchEntries(
    params: EntryQueryParams,
): Promise<PageContent[]> {
    const searchTable = getEnv(ENV.SEARCH_TABLE);
    if (searchTable && searchTable !== "")
        return searchEntriesDynamo(params);
    else
        return searchEntriesLocal(params);
}
