// SMTP Mail helper — calls the Supabase Edge Function relay
// Credentials live only in component memory, never persisted

export interface SmtpConfig {
    fromName: string;
    fromEmail: string;
    host: string;
    port: number;
    encryption: 'tls' | 'ssl' | 'none';
    username: string;
    password: string;
}

export interface MailPayload {
    to: string;
    cc?: string;
    subject: string;
    body: string;
}

// Use direct fetch instead of supabase.functions.invoke for better error handling
const SUPABASE_URL = 'https://xprafkvyhdztdxprbqfw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwcmFma3Z5aGR6dGR4cHJicWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MjQwMTAsImV4cCI6MjA4NzQwMDAxMH0.SfZlsqmQr9vCFQhCnma5hKSRqUzLo_dQ9t3FLpa0QGE';

export async function sendMailViaRelay(
    smtpConfig: SmtpConfig,
    mail: MailPayload
): Promise<void> {
    const url = `${SUPABASE_URL}/functions/v1/send-mail`;

    console.log('[SendMail] Calling edge function:', url);

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ smtpConfig, ...mail }),
    });

    const text = await res.text();
    console.log('[SendMail] Response:', res.status, text);

    let data: any;
    try {
        data = JSON.parse(text);
    } catch {
        throw new Error(`Server returned non-JSON: ${text.slice(0, 200)}`);
    }

    if (!res.ok) {
        throw new Error(friendlyError(data?.error || `Server error: ${res.status}`));
    }

    if (data?.error) {
        throw new Error(friendlyError(data.error));
    }
}

/** Convert raw SMTP errors into user-friendly messages */
function friendlyError(raw: string): string {
    const lower = raw.toLowerCase();
    if (lower.includes('application-specific password required') || lower.includes('invalidsecondfactor')) {
        return '🔑 Gmail requires an App Password (not your regular password). Go to https://myaccount.google.com/apppasswords → create one → paste it in "Mail ID Password".';
    }
    if (lower.includes('invalid login') || lower.includes('authentication failed') || lower.includes('535')) {
        return '❌ Login failed — check your email and password. For Gmail, use an App Password.';
    }
    if (lower.includes('connection refused') || lower.includes('econnrefused')) {
        return '🔌 Cannot connect to SMTP server. Check the host and port.';
    }
    if (lower.includes('bare lf')) {
        return '⚠️ Email format error. Please try again.';
    }
    return raw;
}
