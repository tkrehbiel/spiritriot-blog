import { PageContent } from '@/data/interfaces/content';
import EntryQueryParams from '@/data/interfaces/queryFilter';
import { PAGE_SIZE } from '@config/siteConfig';
import { safeStringify } from '@/types/strings';
import { TextType } from '@/types/contentText';
import { searchEntries } from '@/site/search';

// Search API route
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const textFilter = safeStringify(searchParams.get('text'));
    console.log(`querying text=${textFilter}`);

    const startTime = performance.now();
    const filter: EntryQueryParams = {
        routeStartsWith: '',
        contains: textFilter,
    };
    console.log(filter);

    // Query for matching entries
    try {
        const searchResults: PageContent[] = await searchEntries(filter);
        const elapsed = performance.now() - startTime;

        const returnedResults = searchResults.slice(0, PAGE_SIZE);

        const summary = new TextType(
            `Search returned ${
                searchResults.length
            } results in ${elapsed.toFixed(2)}ms. ${
                searchResults.length - returnedResults.length
            } results omitted.`,
        );
        returnedResults.push({
            route: '/search',
            timestamp: Date.now(),
            title: 'Search Statistics',
            summary: summary,
            article: summary,
        });

        console.log(
            `returning ${searchResults.length} entries queried in ${elapsed}ms`,
        );
        return Response.json(returnedResults);
    } catch (error) {
        console.log(error);
        return Response.json([
            {
                route: '/search',
                timestamp: Date.now(),
                title: 'Server-Side Search Error',
                summary: new TextType(
                    'An error occurred at runtime while trying to access search resources',
                ),
                article: new TextType(
                    'An error occurred at runtime while trying to access search resources',
                ),
            },
        ]);
    }
}
