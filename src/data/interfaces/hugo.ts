export interface HugoMetadata {
    title?: string;
    type?: string;
    images?: string[];
    alternates?: string[];
    tags?: string[];
    categories?: string[];
    norss?: boolean;
    unlisted?: boolean;
}

export interface HugoJsonPage {
    metadata?: HugoMetadata;
    date: string; // format: ISO 8601 yyyy-mm-ddThh:mm:ss-zzzz
    link: string;
    summary?: string;
    content?: string;
    plain?: string;
    children?: HugoJsonPage[];
    next?: HugoJsonPageLink;
    previous?: HugoJsonPageLink;
}

export interface HugoJsonPageLink {
    link: string;
    title?: string;
}
