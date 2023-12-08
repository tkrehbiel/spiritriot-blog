// Everything is chaos even in Typescript
export function safeParseDate(s: string): Date {
    if (s === null || s === undefined || s === '') return new Date(0);
    const parsedMillis = Date.parse(s);
    const dt = new Date(parsedMillis);
    if (dt !== null) return dt;
    return new Date(0);
}

// Assumes UTC time zone
export function safeParseDateMillis(s: string | undefined): number {
    if (s === null || s === undefined || s === '') return 0;
    return Date.parse(s);
}
