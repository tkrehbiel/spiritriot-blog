// It occurred to me that AWS SQS might work well
// for event notifications, such as publishing posts,
// or receiving webmentions. These structures define
// standard payloads for SQS messages.

// We probably aren't going to use this in the site app
interface UpdatePayload {
    publishDate: string; // ISO 8601
    permalink: string;
    path: string;
}

// Generated when a webmention is received
interface WebMentionPayload {
    source: string;
    target: string;
}

// Message payload sent to AWS SQS queues
export interface QueueEvent {
    eventID: string; // a guid for reference
    eventType: 'publish' | 'update' | 'webmention';
    eventHost: string; // site generating the event
    eventDate: string; // ISO 8601
    eventPayload: UpdatePayload | WebMentionPayload;
}
