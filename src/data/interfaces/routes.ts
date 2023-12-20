export interface Endpoint {
    path: string;
    timestamp: number;
}

export type EndpointMap = {
    [key: string]: Endpoint;
};

export interface Section {
    pageIndex: number;
    pageTotal: number;
    nextPagePath: string | null;
    previousPagePath: string | null;
    path: string;
    timestamp: number;
    endpoints: Endpoint[];
}

export type SectionMap = {
    [key: string]: Section;
};

export interface SiteIndex {
    sectionMap: SectionMap;
    endpointMap: EndpointMap;
}
