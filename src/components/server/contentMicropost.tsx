import { PageContent, renderArticleAsHTML } from '@/data/interfaces/content';
import EntryDateTime from './dateTime';
import { canonicalizePath } from '@/site/utilities';

export default function ContentMicropost({ entry }: { entry: PageContent }) {
    const htmlContent = renderArticleAsHTML(entry);
    return (
        <>
            <article>
                <header>
                    <p>
                        <a href={canonicalizePath(entry.route)}>
                            <EntryDateTime timestamp={entry.timestamp} />
                        </a>
                    </p>
                </header>
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                <footer></footer>
            </article>
        </>
    );
}
