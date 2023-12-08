import { generateFeed } from '@/site/generateFeed';

// JSON feed
export async function GET() {
    const feed = await generateFeed();
    return new Response(feed.json1());
}
