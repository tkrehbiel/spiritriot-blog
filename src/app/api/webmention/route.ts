import { sendMessage } from '@/data/sqs/send';
import { safeStringify } from '@/types/strings';
import { sqsClient } from '@config/awsSQSClient';
import { siteConfig } from '@config/siteConfig';
import { randomUUID } from 'crypto';

// Creates a 400 error page response with a message
function error400(message: string): Response {
    console.log(message);
    return new Response(message, {
        status: 400,
    });
}

// Incoming webmention endpoint
export async function POST(request: Request) {
    let data: FormData;
    // Very basic validations
    try {
        data = await request.formData();
    } catch (error) {
        return error400('Cannot parse form data');
    }
    if (!data.get('source')) {
        return error400('No source parameter');
    }
    if (!data.get('target')) {
        return error400('No target parameter');
    }
    const source = safeStringify(data.get('source')?.toString());
    const target = safeStringify(data.get('target')?.toString());
    try {
        new URL(source); // just checking format
    } catch (error) {
        return error400('Cannot parse source url');
    }
    try {
        new URL(target); // just checking format
    } catch (error) {
        return error400('Cannot parse target url');
    }
    if (source === target) {
        return error400('Source cannot equal target');
    }
    // Send a message to an event queue for actual processing
    const success = await sendMessage(sqsClient, {
        eventType: 'webmention',
        eventID: randomUUID(), // todo: don't need
        eventDate: new Date().toISOString(),
        eventHost: siteConfig.siteHost,
        eventPayload: {
            source: source,
            target: target,
        },
    });
    if (success) {
        return new Response('WebMention Queued', {
            status: 202,
        });
    }
    return error400('Unable to queue webmention for processing');
}
