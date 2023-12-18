import { PageContent } from '@/data/interfaces/content';

export default function ContentPager({ entry }: { entry: PageContent }) {
    if (!entry.pagination) return <></>;

    let previous: JSX.Element = <></>;
    let next: JSX.Element = <></>;
    if (
        entry.pagination.previousRoute &&
        entry.pagination.previousRoute !== ''
    ) {
        previous = <a href={entry.pagination.previousRoute}>Previous</a>;
    }
    if (entry.pagination.nextRoute && entry.pagination.nextRoute !== '') {
        next = <a href={entry.pagination.nextRoute}>Next</a>;
    }
    return (
        <nav>
            {previous} {next}
        </nav>
    );
}
