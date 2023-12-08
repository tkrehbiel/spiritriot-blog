'use client';

import { useEffect } from 'react';
import commentBox from 'commentbox.io';

// Using a NEXT_PUBLIC_ variable here passes the build-time env var
// to the client-side runtime environment. At build time,
// the env var lookup is replaced with the env var value.
// https://nextjs.org/docs/app/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser
const commentBoxAppID = process.env.NEXT_PUBLIC_COMMENTBOX_APPID;

export default function CommentBoxLayout() {
    useEffect(() => {
        commentBox(commentBoxAppID);
    }, []);
    return (
        <>
            <div className="commentbox"></div>
        </>
    );
}
