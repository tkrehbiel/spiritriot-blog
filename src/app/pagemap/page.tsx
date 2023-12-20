import { Endpoint, Section } from '@/data/interfaces/routes';
import { indexSiteData } from '@/data/local/indexData';

export default async function Page() {
    const index = await indexSiteData();
    const sections: Section[] = [];
    const endpoints: Endpoint[] = [];
    for (const section in index.sectionMap)
        sections.push(index.sectionMap[section]);
    for (const endpoint in index.endpointMap)
        endpoints.push(index.endpointMap[endpoint]);
    return (
        <>
            <p>Section Endpoints</p>
            <ol>
                {sections.map((s) => (
                    <li key={s.path}>
                        /{s.path} ({s.endpoints.length} pages)
                    </li>
                ))}
            </ol>
            <p>Page Endpoints</p>
            <ol>
                {endpoints.map((s) => (
                    <li key={s.path}>
                        /{s.path} ({s.timestamp})
                    </li>
                ))}
            </ol>
        </>
    );
}
