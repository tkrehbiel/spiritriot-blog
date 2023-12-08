import {
    PageContent,
    renderArticleAsHTML,
    renderSummaryAsHTML,
} from '@/data/interfaces/content';
import EntryDateTime from './dateTime';
import { canonicalizePath } from '@/site/utilities';

export default function ContentSummary({
    entry,
    summary,
}: {
    entry: PageContent;
    summary: boolean;
}) {
    let htmlContent: string;
    if (summary) {
        htmlContent = renderSummaryAsHTML(entry);
    } else {
        htmlContent = renderArticleAsHTML(entry);
    }
    return (
        <>
            <article>
                <header>
                    <h2>
                        <a href={canonicalizePath(entry.route)}>
                            {entry.title}
                        </a>
                    </h2>
                    <p>
                        <EntryDateTime timestamp={entry.timestamp} />
                    </p>
                </header>
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                <footer></footer>
            </article>
        </>
    );
}
