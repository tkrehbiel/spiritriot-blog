// Mentions are essentially comments read from
// an external source, such as Mastodon replies.
export interface Mention {
    url: string; // should also be a unique id
    date: string; // ISO 8601
    content: string; // should be plain text
}
