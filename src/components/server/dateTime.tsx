export default function EntryDateTime({ timestamp }: { timestamp: number }) {
    const dt = new Date(timestamp);
    const isoString = dt.toISOString();
    const dateString = dt.toLocaleString('en-US', {
        timeZone: 'America/New_York',
    });

    return (
        <>
            <time dateTime={isoString}>{dateString}</time>
        </>
    );
}
