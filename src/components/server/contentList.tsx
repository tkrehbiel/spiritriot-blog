import { PageContent } from '@/data/interfaces/content';
import ContentSummary from './contentSummary';
import ContentMicropost from './contentMicropost';

export default function ContentList({
    title,
    content,
    list,
}: {
    title: string;
    content: string;
    list: PageContent[];
}) {
    return (
        <>
            <header>
                <h1>{title}</h1>
                <div dangerouslySetInnerHTML={{ __html: content }} />
            </header>
            <section>
                {list.map((entry) => {
                    if (entry.type === 'micropost') {
                        return (
                            <ContentMicropost key={entry.route} entry={entry} />
                        );
                    } else {
                        return (
                            <ContentSummary
                                key={entry.route}
                                entry={entry}
                                summary={true}
                            />
                        );
                    }
                })}
            </section>
            <footer></footer>
        </>
    );
}
