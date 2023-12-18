import { JSX } from 'react';
import { PageContent } from '@/data/interfaces/content';
import { safeStringify } from '@/types/strings';
import { getContentAtRoute } from '@/site/getContent';
import ContentList from '@/components/server/contentList';
import ContentArticle from '@/components/server/contentArticle';
import ContentMicropost from '@/components/server/contentMicropost';
import ContentPager from '@/components/server/contentPager';

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

export async function standardPageComponent(
    route: string[],
): Promise<JSX.Element | null> {
    const startTime = performance.now();
    const entry = await getContentAtRoute(route);
    if (entry === null) {
        // no content found at route
        return null;
    }
    const component = getView(entry);
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
