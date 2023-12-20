import { Section } from '@/data/interfaces/routes';
import { canonicalizePath } from '@/site/utilities';

export default function ContentPager2({ section }: { section: Section }) {
    let previous: JSX.Element = <></>;
    let next: JSX.Element = <></>;
    if (section.previousPagePath !== null) {
        const s = section.previousPagePath;
        previous = <a href={canonicalizePath(s)}>Previous Posts</a>;
    }
    if (section.nextPagePath !== null) {
        const s = section.nextPagePath;
        next = <a href={canonicalizePath(s)}>Next Posts</a>;
    }
    return (
        <nav>
            {previous} {next}
        </nav>
    );
}
