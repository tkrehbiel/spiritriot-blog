export function safeStringify(s: any, defaultValue: string = ''): string {
    if (s === null || s === undefined) return defaultValue;
    const stringified: string = s.toString();
    if (stringified === '') return defaultValue;
    return stringified;
}

export function safeTextSearch(searchIn: any, searchFor: string): boolean {
    // Yeesh why is it so hard to deal with strings
    if (searchFor === null || searchFor === undefined || searchFor === '')
        return false;
    if (searchIn === null || searchIn === undefined) return false;
    const content: string = searchIn.toString();
    if (content === null || content === undefined || content === '')
        return false;
    return content.toLowerCase().includes(searchFor.toLowerCase());
}
