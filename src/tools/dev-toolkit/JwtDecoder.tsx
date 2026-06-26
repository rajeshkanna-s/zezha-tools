import React, { useState, useEffect, useCallback } from 'react';
import { LineNumberedTextarea } from './LineNumberedTextarea';

interface JwtHeader {
    alg?: string;
    typ?: string;
    [key: string]: unknown;
}

interface JwtPayload {
    sub?: string;
    iat?: number;
    exp?: number;
    nbf?: number;
    iss?: string;
    aud?: string | string[];
    [key: string]: unknown;
}

const CLAIM_LABELS: Record<string, string> = {
    sub: 'Subject',
    iat: 'Issued At',
    exp: 'Expires',
    nbf: 'Not Before',
    iss: 'Issuer',
    aud: 'Audience',
    jti: 'JWT ID',
    name: 'Name',
    email: 'Email',
    role: 'Role',
    scope: 'Scope',
};

export const JwtDecoder: React.FC = () => {
    const [token, setToken] = useState('');
    const [header, setHeader] = useState<JwtHeader | null>(null);
    const [payload, setPayload] = useState<JwtPayload | null>(null);
    const [signature, setSignature] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState<string | null>(null);
    const [now, setNow] = useState(Date.now());

    // Tick every second for live countdown
    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    const base64UrlDecode = (str: string): string => {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4 !== 0) base64 += '=';
        return decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
    };

    const decodeToken = useCallback((raw: string) => {
        const trimmed = raw.trim();
        if (!trimmed) {
            setHeader(null);
            setPayload(null);
            setSignature('');
            setError('');
            return;
        }

        const parts = trimmed.split('.');
        if (parts.length !== 3) {
            setError('Invalid JWT: token must have exactly 3 parts separated by dots.');
            setHeader(null);
            setPayload(null);
            setSignature('');
            return;
        }

        try {
            const h = JSON.parse(base64UrlDecode(parts[0]));
            const p = JSON.parse(base64UrlDecode(parts[1]));
            setHeader(h);
            setPayload(p);
            setSignature(parts[2]);
            setError('');
        } catch {
            setError('Failed to decode JWT. Ensure the token is valid.');
            setHeader(null);
            setPayload(null);
            setSignature('');
        }
    }, []);

    useEffect(() => {
        decodeToken(token);
    }, [token, decodeToken]);

    const formatTimestamp = (ts: number): string => {
        const date = new Date(ts * 1000);
        return date.toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'medium',
        });
    };

    const getExpiryInfo = (): { text: string; isExpired: boolean } => {
        if (!payload?.exp) return { text: 'No expiration set', isExpired: false };
        const expMs = payload.exp * 1000;
        const diff = expMs - now;
        const absDiff = Math.abs(diff);

        const days = Math.floor(absDiff / 86400000);
        const hours = Math.floor((absDiff % 86400000) / 3600000);
        const minutes = Math.floor((absDiff % 3600000) / 60000);
        const seconds = Math.floor((absDiff % 60000) / 1000);

        if (diff > 0) {
            const parts: string[] = [];
            if (days > 0) parts.push(`${days}d`);
            if (hours > 0) parts.push(`${hours}h`);
            if (minutes > 0) parts.push(`${minutes}m`);
            parts.push(`${seconds}s`);
            return { text: `Expires in ${parts.join(' ')}`, isExpired: false };
        } else {
            const parts: string[] = [];
            if (days > 0) parts.push(`${days}d`);
            if (hours > 0) parts.push(`${hours}h`);
            if (minutes > 0) parts.push(`${minutes}m`);
            parts.push(`${seconds}s`);
            return { text: `Expired ${parts.join(' ')} ago`, isExpired: true };
        }
    };

    const copyText = async (text: string, label: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(label);
            setTimeout(() => setCopied(null), 2000);
        } catch { /* silently fail */ }
    };

    const formatClaimValue = (key: string, value: unknown): string => {
        if ((key === 'iat' || key === 'exp' || key === 'nbf') && typeof value === 'number') {
            return formatTimestamp(value);
        }
        if (typeof value === 'object') return JSON.stringify(value, null, 2);
        return String(value);
    };

    const expiryInfo = payload ? getExpiryInfo() : null;

    // Color-coded token display
    const renderColoredToken = () => {
        if (!token.trim()) return null;
        const parts = token.trim().split('.');
        if (parts.length !== 3) return null;
        return (
            <div className="font-mono text-xs break-all leading-relaxed bg-slate-900 rounded-lg p-3 mt-3">
                <span className="text-red-400">{parts[0]}</span>
                <span className="text-slate-500">.</span>
                <span className="text-purple-400">{parts[1]}</span>
                <span className="text-slate-500">.</span>
                <span className="text-cyan-400">{parts[2]}</span>
            </div>
        );
    };

    return (
        <div className="p-4 max-w-5xl mx-auto space-y-4">
            {/* Security Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-start gap-2">
                <span className="text-amber-500 text-sm mt-0.5">&#9888;</span>
                <p className="text-xs text-amber-700">
                    <span className="font-bold">Security Notice:</span> Never enter production tokens in online tools. This decoder runs entirely in your browser — no data is sent to any server.
                </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-1">JWT Decoder</h2>
                <p className="text-xs text-slate-500 mb-4">Paste a JSON Web Token to decode its header, payload, and inspect claims.</p>

                {/* Token Input */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700">JWT Token</label>
                        <button
                            onClick={() => setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')}
                            className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors flex items-center gap-1"
                        >
                            🧪 Load Sample JWT
                        </button>
                    </div>
                    <LineNumberedTextarea
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="Paste your JWT token here... (eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
                        className="w-full min-h-[80px] border-none rounded-none focus:ring-0 resize-y"
                        containerClassName="focus-within:ring-blue-500/20"
                        spellCheck={false}
                    />
                </div>

                {/* Color-coded display */}
                {renderColoredToken()}

                {/* Error */}
                {error && (
                    <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        <p className="text-xs text-red-600 font-semibold">{error}</p>
                    </div>
                )}
            </div>

            {/* Decoded Sections */}
            {header && payload && (
                <>
                    {/* Token Status */}
                    {expiryInfo && payload.exp && (
                        <div className={`rounded-xl border px-4 py-3 flex items-center justify-between ${expiryInfo.isExpired
                            ? 'bg-red-50 border-red-200'
                            : 'bg-green-50 border-green-200'
                            }`}>
                            <div className="flex items-center gap-3">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${expiryInfo.isExpired
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-green-100 text-green-700'
                                    }`}>
                                    {expiryInfo.isExpired ? 'EXPIRED' : 'VALID'}
                                </span>
                                <span className="text-xs text-slate-600">{expiryInfo.text}</span>
                            </div>
                            <span className="text-xs text-slate-400">exp: {formatTimestamp(payload.exp)}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Header */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                                    <h3 className="text-sm font-bold text-slate-800">Header</h3>
                                </div>
                                <button
                                    onClick={() => copyText(JSON.stringify(header, null, 2), 'header')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${copied === 'header' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                >
                                    {copied === 'header' ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                            <pre className="bg-red-50 border border-red-100 rounded-lg p-3 font-mono text-xs text-slate-800 overflow-auto max-h-[200px]">
                                {JSON.stringify(header, null, 2)}
                            </pre>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {header.alg && (
                                    <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded">
                                        Algorithm: {header.alg}
                                    </span>
                                )}
                                {header.typ && (
                                    <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded">
                                        Type: {header.typ}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Payload */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                                    <h3 className="text-sm font-bold text-slate-800">Payload</h3>
                                </div>
                                <button
                                    onClick={() => copyText(JSON.stringify(payload, null, 2), 'payload')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${copied === 'payload' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                >
                                    {copied === 'payload' ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                            <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 space-y-2 overflow-auto max-h-[300px]">
                                {Object.entries(payload).map(([key, value]) => (
                                    <div key={key} className="flex items-start gap-2 text-xs">
                                        <span className="font-bold text-purple-700 min-w-[80px] shrink-0">
                                            {CLAIM_LABELS[key] || key}
                                        </span>
                                        <span className="font-mono text-slate-700 break-all">
                                            {formatClaimValue(key, value)}
                                        </span>
                                        {key === 'exp' && expiryInfo && (
                                            <span className={`ml-1 px-1.5 py-0.5 rounded text-xs font-bold shrink-0 ${expiryInfo.isExpired
                                                ? 'bg-red-100 text-red-600'
                                                : 'bg-green-100 text-green-600'
                                                }`}>
                                                {expiryInfo.isExpired ? 'EXPIRED' : 'VALID'}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Signature */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                                <h3 className="text-sm font-bold text-slate-800">Signature</h3>
                            </div>
                            <button
                                onClick={() => copyText(signature, 'signature')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${copied === 'signature' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                {copied === 'signature' ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <div className="bg-cyan-50 border border-cyan-100 rounded-lg p-3">
                            <p className="font-mono text-xs text-slate-700 break-all">{signature}</p>
                        </div>
                        <p className="mt-2 text-xs text-slate-400 italic">
                            Signature cannot be verified without the secret key or public key. This tool only decodes — it does not validate the signature.
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};
