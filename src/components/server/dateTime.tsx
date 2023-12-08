export default function EntryDateTime({ timestamp }: { timestamp: number }) {
    const dt = new Date(timestamp);
    const isoString = dt.toISOString();

    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long', // Full weekday name
        month: 'short', // Short month name
        day: 'numeric', // Numeric day of the month
        hour: 'numeric', // Hour (12-hour clock)
        minute: 'numeric', // Minute
        hour12: true, // Use 12-hour clock
    };
    const dateString = new Intl.DateTimeFormat('en-US', options).format(dt);

    return (
        <>
            <time dateTime={isoString}>{dateString}</time>
        </>
    );
}
