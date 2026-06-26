import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Fingerprint, Copy, Check, Download, RefreshCw, Trash2, Clock } from 'lucide-react';

/* ── ID Generation Functions ── */

function generateUUIDv4(): string {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

function generateUUIDv1(): string {
    const now = BigInt(Date.now());
    const offset = BigInt('122192928000000000');
    const ts = (now * BigInt(10000)) + offset;
    const timeLow = (ts & BigInt(0xFFFFFFFF)).toString(16).padStart(8, '0');
    const timeMid = ((ts >> BigInt(32)) & BigInt(0xFFFF)).toString(16).padStart(4, '0');
    const timeHi = ((ts >> BigInt(48)) & BigInt(0x0FFF)).toString(16).padStart(4, '0');
    const version = '1' + timeHi.slice(1);
    const bytes = new Uint8Array(8);
    crypto.getRandomValues(bytes);
    const clockSeq = ((bytes[0] & 0x3f) | 0x80).toString(16).padStart(2, '0') + bytes[1].toString(16).padStart(2, '0');
    const node = Array.from(bytes.slice(2)).map(b => b.toString(16).padStart(2, '0')).join('');
    return `${timeLow}-${timeMid}-${version}-${clockSeq}-${node}`;
}

function generateUUIDv7(): string {
    const now = Date.now();
    const msHex = now.toString(16).padStart(12, '0');
    const bytes = new Uint8Array(10);
    crypto.getRandomValues(bytes);
    bytes[0] = (bytes[0] & 0x0f) | 0x70; // version 7
    bytes[2] = (bytes[2] & 0x3f) | 0x80; // variant
    const randHex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    return `${msHex.slice(0, 8)}-${msHex.slice(8, 12)}-${randHex.slice(0, 4)}-${randHex.slice(4, 8)}-${randHex.slice(8, 20)}`;
}

function generateULID(): string {
    const ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
    const now = Date.now();
    let timeStr = '';
    let t = now;
    for (let i = 0; i < 10; i++) { timeStr = ENCODING[t % 32] + timeStr; t = Math.floor(t / 32); }
    const bytes = new Uint8Array(10);
    crypto.getRandomValues(bytes);
    let randStr = '';
    for (let i = 0; i < 16; i++) {
        const byteIdx = Math.floor((i * 5) / 8);
        const bitOffset = (i * 5) % 8;
        let val = (bytes[byteIdx] >> (3 - bitOffset));
        if (bitOffset > 3 && byteIdx + 1 < bytes.length) {
            val = (val | (bytes[byteIdx + 1] << (8 - bitOffset))) & 0x1f;
        } else {
            val = val & 0x1f;
        }
        randStr += ENCODING[val % 32];
    }
    return timeStr + randStr;
}

function generateNanoID(size = 21): string {
    const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
    const bytes = new Uint8Array(size);
    crypto.getRandomValues(bytes);
    return Array.from(bytes).map(b => ALPHABET[b & 63]).join('');
}

function generateCUID2(): string {
    const timestamp = Date.now().toString(36);
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    const random = Array.from(bytes).map(b => b.toString(36).padStart(2, '0')).join('').slice(0, 20);
    return 'c' + timestamp + random;
}

type IDType = 'uuid-v4' | 'uuid-v1' | 'uuid-v7' | 'ulid' | 'nanoid' | 'cuid2';
type FormatOption = 'default' | 'uppercase' | 'no-hyphens' | 'uppercase-no-hyphens' | 'braces' | 'urn';
type SepOption = 'newline' | 'comma' | 'json' | 'sql';

const ID_TYPES: { value: IDType; label: string; desc: string }[] = [
    { value: 'uuid-v4', label: 'UUID v4', desc: 'Random (most common)' },
    { value: 'uuid-v1', label: 'UUID v1', desc: 'Timestamp-based' },
    { value: 'uuid-v7', label: 'UUID v7', desc: 'Sortable timestamp' },
    { value: 'ulid', label: 'ULID', desc: 'Sortable, Crockford Base32' },
    { value: 'nanoid', label: 'NanoID', desc: 'Compact URL-safe' },
    { value: 'cuid2', label: 'CUID2', desc: 'Collision-resistant' },
];

function generateID(type: IDType): string {
    switch (type) {
        case 'uuid-v4': return generateUUIDv4();
        case 'uuid-v1': return generateUUIDv1();
        case 'uuid-v7': return generateUUIDv7();
        case 'ulid': return generateULID();
        case 'nanoid': return generateNanoID();
        case 'cuid2': return generateCUID2();
    }
}

function formatID(id: string, format: FormatOption, type: IDType): string {
    if (!['uuid-v4', 'uuid-v1', 'uuid-v7'].includes(type)) return id;
    switch (format) {
        case 'default': return id.toLowerCase();
        case 'uppercase': return id.toUpperCase();
        case 'no-hyphens': return id.replace(/-/g, '').toLowerCase();
        case 'uppercase-no-hyphens': return id.replace(/-/g, '').toUpperCase();
        case 'braces': return `{${id.toLowerCase()}}`;
        case 'urn': return `urn:uuid:${id.toLowerCase()}`;
    }
}

function getIDBreakdown(id: string, type: IDType): { label: string; value: string }[] {
    if (type === 'uuid-v4') {
        return [
            { label: 'Version', value: '4 (Random)' },
            { label: 'Variant', value: 'RFC 4122' },
            { label: 'Bits of randomness', value: '122' },
        ];
    }
    if (type === 'uuid-v1') {
        return [
            { label: 'Version', value: '1 (Timestamp)' },
            { label: 'Variant', value: 'RFC 4122' },
            { label: 'Generated at', value: new Date().toISOString() },
        ];
    }
    if (type === 'uuid-v7') {
        const msHex = id.replace(/-/g, '').slice(0, 12);
        const ms = parseInt(msHex, 16);
        return [
            { label: 'Version', value: '7 (Sortable Timestamp)' },
            { label: 'Timestamp', value: new Date(ms).toISOString() },
            { label: 'Sortable', value: 'Yes — monotonically increasing' },
        ];
    }
    if (type === 'ulid') {
        return [
            { label: 'Format', value: 'Crockford Base32' },
            { label: 'Length', value: '26 characters' },
            { label: 'Sortable', value: 'Yes — lexicographic' },
        ];
    }
    if (type === 'nanoid') {
        return [
            { label: 'Format', value: 'URL-safe Base64' },
            { label: 'Length', value: `${id.length} characters` },
            { label: 'Collision probability', value: '~1 in 149 billion (at 1000 IDs/s for 1 year)' },
        ];
    }
    return [
        { label: 'Format', value: 'CUID2' },
        { label: 'Prefix', value: 'c (always starts with c)' },
        { label: 'Collision-resistant', value: 'Yes — designed for distributed systems' },
    ];
}

const HISTORY_KEY = 'riq-uuid-history';
const MAX_HISTORY = 50;

export const UuidGenerator: React.FC = () => {
    const [idType, setIdType] = useState<IDType>('uuid-v4');
    const [ids, setIds] = useState<string[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [format, setFormat] = useState<FormatOption>('default');
    const [separator, setSeparator] = useState<SepOption>('newline');
    const [prefix, setPrefix] = useState('');
    const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
    const [copiedAll, setCopiedAll] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState<{ id: string; type: string; time: string }[]>([]);

    useEffect(() => {
        try { const h = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); setHistory(h); } catch { /* ignore */ }
    }, []);

    const saveToHistory = useCallback((newIds: string[], type: IDType) => {
        const entries = newIds.map(id => ({ id, type, time: new Date().toISOString() }));
        setHistory(prev => {
            const updated = [...entries, ...prev].slice(0, MAX_HISTORY);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    const generate = useCallback(() => {
        const q = Math.max(1, Math.min(1000, quantity));
        const list: string[] = [];
        for (let i = 0; i < q; i++) list.push(generateID(idType));
        setIds(list);
        setCopiedIdx(null);
        setCopiedAll(false);
        saveToHistory(list, idType);
    }, [quantity, idType, saveToHistory]);

    useEffect(() => { generate(); }, []);

    const isUUID = ['uuid-v4', 'uuid-v1', 'uuid-v7'].includes(idType);

    const formattedIds = useMemo(() =>
        ids.map(id => {
            const formatted = isUUID ? formatID(id, format, idType) : id;
            return prefix ? `${prefix}${formatted}` : formatted;
        }),
    [ids, format, idType, prefix, isUUID]);

    const joinedOutput = useMemo(() => {
        switch (separator) {
            case 'newline': return formattedIds.join('\n');
            case 'comma': return formattedIds.join(', ');
            case 'json': return JSON.stringify(formattedIds, null, 2);
            case 'sql': return `('${formattedIds.join("', '")}')`;
        }
    }, [formattedIds, separator]);

    const copySingle = async (idx: number) => {
        await navigator.clipboard.writeText(formattedIds[idx]);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 1500);
    };
    const copyAll = async () => {
        await navigator.clipboard.writeText(joinedOutput);
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 1500);
    };
    const downloadTxt = () => {
        const blob = new Blob([joinedOutput], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `${idType}-ids.txt`; a.click();
        URL.revokeObjectURL(url);
    };
    const clearHistory = () => { setHistory([]); localStorage.removeItem(HISTORY_KEY); };

    const breakdown = ids.length > 0 ? getIDBreakdown(ids[0], idType) : [];

    return (
        <div className="p-4 max-w-5xl mx-auto space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Fingerprint size={22} />
                </div>
                <div>
                    <h2 className="text-base font-bold text-slate-800">ID Generator</h2>
                    <p className="text-xs text-slate-500">UUID v1/v4/v7, ULID, NanoID, CUID2 — all generated locally</p>
                </div>
            </div>

            {/* ID Type Selector */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <label className="text-xs font-bold text-slate-700 block mb-2">ID Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {ID_TYPES.map(t => (
                        <button
                            key={t.value}
                            onClick={() => { setIdType(t.value); }}
                            className={`rounded-xl border-2 px-3 py-2.5 text-left transition-all ${idType === t.value
                                ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                            }`}
                        >
                            <p className={`text-xs font-bold ${idType === t.value ? 'text-indigo-700' : 'text-slate-700'}`}>{t.label}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{t.desc}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className="flex flex-wrap items-end gap-4">
                    <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Quantity (1-1000)</label>
                        <input
                            type="number" min={1} max={1000} value={quantity}
                            onChange={e => setQuantity(Math.max(1, Math.min(1000, Number(e.target.value) || 1)))}
                            className="w-24 text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Prefix (optional)</label>
                        <input
                            type="text" value={prefix} onChange={e => setPrefix(e.target.value)}
                            placeholder="e.g. usr_, txn_"
                            className="w-32 text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 font-mono"
                        />
                    </div>
                    {isUUID && (
                        <div>
                            <label className="text-xs font-semibold text-slate-600 block mb-1">Format</label>
                            <select value={format} onChange={e => setFormat(e.target.value as FormatOption)}
                                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                                <option value="default">lowercase-hyphens</option>
                                <option value="uppercase">UPPERCASE-HYPHENS</option>
                                <option value="no-hyphens">lowercase no hyphens</option>
                                <option value="uppercase-no-hyphens">UPPERCASE no hyphens</option>
                                <option value="braces">{'{'}lowercase{'}'}</option>
                                <option value="urn">urn:uuid:lowercase</option>
                            </select>
                        </div>
                    )}
                    <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Separator</label>
                        <select value={separator} onChange={e => setSeparator(e.target.value as SepOption)}
                            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                            <option value="newline">Newline</option>
                            <option value="comma">Comma</option>
                            <option value="json">JSON Array</option>
                            <option value="sql">SQL VALUES</option>
                        </select>
                    </div>
                    <button onClick={generate}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5 transition-colors shadow-sm">
                        <RefreshCw className="w-3.5 h-3.5" /> Generate
                    </button>
                </div>
            </div>

            {/* Actions Bar */}
            {ids.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    <button onClick={copyAll}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center gap-1.5 transition-colors">
                        {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedAll ? 'Copied!' : 'Copy All'}
                    </button>
                    <button onClick={downloadTxt}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center gap-1.5 transition-colors">
                        <Download className="w-3.5 h-3.5" /> Download .txt
                    </button>
                    <button onClick={() => setShowHistory(!showHistory)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${showHistory ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                        <Clock className="w-3.5 h-3.5" /> History ({history.length})
                    </button>
                </div>
            )}

            {/* ID Breakdown */}
            {breakdown.length > 0 && (
                <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl border border-indigo-100 p-4 shadow-sm">
                    <h3 className="text-xs font-bold text-indigo-700 mb-2">ID Breakdown</h3>
                    <div className="flex flex-wrap gap-x-6 gap-y-1">
                        {breakdown.map((b, i) => (
                            <span key={i} className="text-xs text-slate-600">
                                {b.label}: <span className="font-bold text-slate-800">{b.value}</span>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* ID List */}
            {ids.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="max-h-80 overflow-y-auto space-y-1">
                        {formattedIds.map((uid, idx) => (
                            <div key={idx} className="flex items-center gap-2 group">
                                <span className="text-xs text-slate-400 w-8 shrink-0 text-right">{idx + 1}.</span>
                                <code className="text-xs font-mono text-slate-700 flex-1 bg-slate-50 rounded px-2 py-1 select-all">{uid}</code>
                                <button onClick={() => copySingle(idx)}
                                    className="opacity-0 group-hover:opacity-100 px-2 py-1 rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-50 shrink-0 transition-opacity">
                                    {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* History Panel */}
            {showHistory && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-bold text-slate-700">Recent History</h3>
                        {history.length > 0 && (
                            <button onClick={clearHistory}
                                className="px-2 py-1 rounded text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-1 transition-colors">
                                <Trash2 className="w-3 h-3" /> Clear
                            </button>
                        )}
                    </div>
                    {history.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-4">No history yet</p>
                    ) : (
                        <div className="max-h-48 overflow-y-auto space-y-1">
                            {history.map((h, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs group">
                                    <span className="text-[10px] text-slate-400 w-14 shrink-0">{new Date(h.time).toLocaleTimeString()}</span>
                                    <span className="text-[10px] font-bold text-slate-500 w-14 shrink-0">{h.type}</span>
                                    <code className="font-mono text-slate-600 flex-1 truncate">{h.id}</code>
                                    <button onClick={async () => { await navigator.clipboard.writeText(h.id); }}
                                        className="opacity-0 group-hover:opacity-100 text-indigo-500 hover:text-indigo-700 shrink-0 transition-opacity">
                                        <Copy className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
