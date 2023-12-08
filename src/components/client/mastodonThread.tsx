'use client';

import { Mention } from '@/data/interfaces/mention';
import { canonicalSiteUrl } from '@/site/utilities';
import { useState, useEffect } from 'react';

// Client-side component to query the api for ActivityPub mentions
export default function MastodonThreadLayout({ route }: { route: string }) {
    const url = canonicalSiteUrl(route);
    const initial: Mention[] = [];
    const [mentions, setMentions] = useState(initial);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        console.log('api starting');
        fetch(`/api/mentions?url=${url}`)
            .then((res) => {
                if (res.status === 500) {
                    console.log("error response");
                    setMentions([]);
                    setLoading(false);
                } else {
                    return res.json();
                }
            })
            .then((data) => {
                console.log('api done:', data);
                setMentions(data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setMentions([]);
                setLoading(false);
            });
    }, [url]);

    if (isLoading) {
        return (
            <section>
                <p>Looking for fediverse mentions...</p>
                <noscript>
                    <p>
                        ...but they&apos;ll never be found because Javascript is
                        disabled.
                    </p>
                </noscript>
            </section>
        );
    }

    if (!mentions || mentions.length === 0) {
        return (
            <section>
                <p>No fediverse mentions found.</p>
            </section>
        );
    }

    return (
        <>
            <section>
                <header>
                    <h2>Mentions from The Fediverse</h2>
                </header>
                {mentions.map((comment) => {
                    const dt = new Date(comment.date);
                    const options: Intl.DateTimeFormatOptions = {
                        month: 'numeric',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: false,
                    };
                    const dateString = new Intl.DateTimeFormat(
                        'default',
                        options,
                    ).format(dt);
                    return (
                        <p key={comment.url}>
                            {dateString} {comment.content}
                        </p>
                    );
                })}
            </section>
        </>
    );
}
