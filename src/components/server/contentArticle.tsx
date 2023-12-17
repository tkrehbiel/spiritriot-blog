import Image from 'next/image';
import {
    PageContent,
    renderArticleAsHTML,
    renderSummaryAsHTML,
} from '@/data/interfaces/content';
import { canonicalizePath } from '@/site/utilities';
import EntryDateTime from './dateTime';
import MastodonThreadLayout from '../client/mastodonThread';
import CommentBoxLayout from '../client/commentBox';
import { commentBoxAppID } from '@config/clientConfig';

export default function ContentArticle({ entry }: { entry: PageContent }) {
    const htmlContent = renderArticleAsHTML(entry);
    const url = canonicalizePath(entry.route);
    let image: JSX.Element = <></>;
    if (entry.image) {
        image = (
            <Image
                src={entry.image}
                alt="{entry.title}"
                width={1024}
                height={1024}
                priority={true}
            />
        );
    }

    let commentBoxComponent = <></>;
    if (commentBoxAppID && commentBoxAppID !== '')
        commentBoxComponent = <CommentBoxLayout />;

    let next = <></>;
    if (entry.next && entry.next.title) {
        next = (
            <nav>
                Next:{' '}
                <a href={canonicalizePath(entry.next.route)}>
                    {entry.next.title}
                </a>
            </nav>
        );
    }
    let previous = <></>;
    if (entry.previous && entry.previous.title) {
        previous = (
            <nav>
                Previously:{' '}
                <a href={canonicalizePath(entry.previous.route)}>
                    {entry.previous.title}
                </a>
            </nav>
        );
    }

    return (
        <>
            {previous}
            <article>
                <header>
                    <h1>
                        <a href={canonicalizePath(entry.route)}>
                            {entry.title}
                        </a>
                    </h1>
                    <p>
                        <EntryDateTime timestamp={entry.timestamp} />
                    </p>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: renderSummaryAsHTML(entry),
                        }}
                    />
                    {image}
                </header>
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                <footer></footer>
            </article>
            {next}
            <section>
                <MastodonThreadLayout route={url} />
            </section>
            {commentBoxComponent}
        </>
    );
}
