import { standardPageComponent } from '@/site/standardPageView';
import { indexSiteData } from '@/data/local/indexData';

// This is the main dynamic route page endpoint.
// Basically any site links that aren't the home page
// will end up here.

type pageParams = {
    route: string[];
};

// 404 for any requested page not generated statically below.
export const dynamicParams = false;

// generateStaticRoutes() provides a list of
// page routes to create statically at build time.
// We generate a list of pages from the content data source,
// and return a list so that the majority of the site's
// landing pages are created staticially.
// (Currently this is over 1500 static pages.)
// Page requests that aren't in this list should return a 404.

export async function generateStaticParams() {
    const params: pageParams[] = [];
    const index = await indexSiteData();
    for (const route in index.endpointMap) {
        if (route !== '') {
            params.push({ route: route.split('/') });
        }
    }
    for (const route in index.sectionMap) {
        if (route !== '') {
            params.push({ route: route.split('/') });
        }
    }
    return params;
}

// Fetch source data for the given route and render a page view.
// This is the main landing page for any permalinks.
export default async function Page({
    params,
}: {
    params: { route: string[] };
}) {
    try {
        return standardPageComponent(params.route);
    } catch (error) {
        console.log('error generating Page for', params.route.join('/'));
        throw error;
    }
}
