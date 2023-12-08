import { canonicalizeRoute } from '@/site/utilities';
import { standardPageComponent } from '@/site/standardPageView';
import { getContentAtRoute } from '@/site/getContent';

// This is the main dynamic route page endpoint.
// Basically any site links that aren't the home page
// will end up here.

type pageParams = {
    route: string[];
};

// generateStaticRoutes() provides a list of
// page routes to create statically at build time.
// We fetch a list of pages from the content data source,
// and return a list so that the majority of the site's
// landing pages are created staticially.
// (Currently this is over 1500 static pages.)

export async function generateStaticParams() {
    const params: pageParams[] = [];
    // _sectionmap is a list of content sections in the blog
    try {
        const allSections = await getContentAtRoute(['_sectionmap']);
        if (allSections.children) {
            for (const page of allSections.children) {
                if (page.route) {
                    const route = canonicalizeRoute(page.route);
                    params.push({ route: route.split('/') });
                }
            }
        }
    } catch (error) {
        console.log('error generating section routes');
        throw error;
    }
    try {
        // _pagemap is a list of all content pages in the blog
        const allPages = await getContentAtRoute(['_pagemap']);
        if (allPages.children) {
            for (const page of allPages.children) {
                if (page.route) {
                    const route = canonicalizeRoute(page.route);
                    params.push({ route: route.split('/') });
                }
            }
        }
    } catch (error) {
        console.log('error generating page routes');
        throw error;
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
