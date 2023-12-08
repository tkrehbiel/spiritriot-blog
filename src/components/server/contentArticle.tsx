import Image from 'next/image';
import { PageContent, renderArticleAsHTML } from '@/data/interfaces/content';
import { canonicalizePath } from '@/site/utilities';
import { safeStringify } from '@/types/strings';
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

    return (
        <>
            <article>
                <header>
                    <h1>
                        <a href={entry.route.replace(/\/index\.json$/, '')}>
                            {entry.title}
                        </a>
                    </h1>
                    <p>
                        <EntryDateTime timestamp={entry.timestamp} />
                    </p>
                    <p>{safeStringify(entry.summary)}</p>
                    {image}
                </header>
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                <footer></footer>
            </article>
            <section>
                <MastodonThreadLayout route={url} />
            </section>
            {commentBoxComponent}
        </>
    );
}
