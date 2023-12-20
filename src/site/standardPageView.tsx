import { JSX } from 'react';
import { PageContent } from '@/data/interfaces/content';
import { safeStringify } from '@/types/strings';
import { getContentAtRoute } from '@/site/getContent';
import ContentList from '@/components/server/contentList';
import ContentArticle from '@/components/server/contentArticle';
import ContentMicropost from '@/components/server/contentMicropost';
import ContentPager from '@/components/server/contentPager';
import { indexSiteData, isEndpoint, isSection } from '@/data/local/indexData';
import { canonicalizeRoute } from './utilities';
import { SiteIndex } from '@/data/interfaces/routes';
import ContentList2 from '@/components/server/contentList2';
import { TextType } from '@/types/contentText';

// Detect which view component to use to render
// the given json page data.
// There are basically three kinds:
// - A section view, which is a list of posts
// - A post view, which is a single post article
// - A micropost view, which is a single microblog post
function getView(entry: PageContent): JSX.Element {
    let component: JSX.Element;
    if (entry.children && entry.children.length > 0) {
        component = (
            <>
                <ContentList
                    title={safeStringify(entry.title)}
                    content={safeStringify(entry.article)}
                    list={entry.children}
                />
                <ContentPager entry={entry} />
            </>
        );
    } else {
        if (entry.type === 'micropost') {
            component = <ContentMicropost entry={entry} />;
        } else {
            component = <ContentArticle entry={entry} />;
        }
    }
    return component;
}

let siteIndex: SiteIndex | undefined = undefined;

export async function standardPageComponent(
    route: string[],
): Promise<JSX.Element | null> {
    const startTime = performance.now();
    if (siteIndex === undefined) siteIndex = await indexSiteData();
    const path = canonicalizeRoute(route.join('/'));
    let component = <></>;
    if (isEndpoint(path, siteIndex)) {
        const entry = await getContentAtRoute(route);
        if (entry === null) {
            // no content found at route
            return null;
        }
        component = getView(entry);
    } else if (isSection(path, siteIndex)) {
        const children: PageContent[] = [];
        for (const page of siteIndex.sectionMap[path].endpoints) {
            const r = page.path.split('/');
            const entry = await getContentAtRoute(r);
            if (entry) children.push(entry);
        }
        const section: PageContent = {
            route: path,
            timestamp: Date.now(),
            children: children,
            article: new TextType('content'),
        };
        component = (
            <ContentList2
                entry={section}
                section={siteIndex.sectionMap[path]}
            />
        );
    } else {
        component = <p>The content here is unknown.</p>;
    }
    const elapsed = performance.now() - startTime;
    return (
        <main>
            {component}
            <footer>
                <p>Page was generated in {elapsed.toFixed(2)}ms.</p>
            </footer>
        </main>
    );
}
