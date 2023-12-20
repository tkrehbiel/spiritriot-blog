import { PageContent } from '@/data/interfaces/content';
import ContentSummary from './contentSummary';
import ContentMicropost from './contentMicropost';
import { Section } from '@/data/interfaces/routes';
import ContentPager2 from './contentPager2';

export default function ContentList2({
    entry,
    section,
}: {
    entry: PageContent;
    section: Section;
}) {
    if (!entry.children) return <></>;
    return (
        <>
            <header>
                <h1>{entry.title}</h1>
            </header>
            <ContentPager2 section={section} />
            <section>
                {entry.children.map((entry) => {
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
            <ContentPager2 section={section} />
            <footer></footer>
        </>
    );
}
