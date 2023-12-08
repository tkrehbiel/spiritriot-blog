import { generateFeed } from '@/site/generateFeed';

// RSS feed
export async function GET() {
    const feed = await generateFeed();
    return new Response(feed.rss2(), {
        headers: {
            'Content-Type': 'application/rss+xml; charset=utf-8',
        },
    });
}
