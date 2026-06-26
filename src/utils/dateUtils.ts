/**
 * Generates an ISO string explicitly offset to Indian Standard Time (+05:30).
 * Useful for ensuring server/database storage aligns strictly to IST regardless
 * of the user's local hardware timezone setting.
 */
export function getISTTimestamp(date: Date = new Date()): string {
    // Extract UTC components
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    // Offset by +5:30 (19800000 milliseconds)
    const istTime = new Date(utc + 3600000 * 5.5);

    const pad = (n: number) => n.toString().padStart(2, '0');

    const yyyy = istTime.getFullYear();
    const MM = pad(istTime.getMonth() + 1);
    const dd = pad(istTime.getDate());
    const HH = pad(istTime.getHours());
    const mm = pad(istTime.getMinutes());
    const ss = pad(istTime.getSeconds());
    const ms = istTime.getMilliseconds().toString().padStart(3, '0');

    // Supabase timestamptz formatting with explicit +05:30 offset
    return `${yyyy}-${MM}-${dd}T${HH}:${mm}:${ss}.${ms}+05:30`;
}
