import React, { useState, useEffect, useCallback } from 'react';
import { Link, ArrowRightLeft } from 'lucide-react';
import { LineNumberedTextarea } from './LineNumberedTextarea';

type Mode = 'encode' | 'decode' | 'parse' | 'build';
type EncodeType = 'uri' | 'component';

interface QueryParam {
    key: string;
    value: string;
    id: number;
}

const isLikelyEncoded = (str: string): boolean => {
    // Check for common URL-encoded patterns like %20, %2F, %3A etc.
    return /%[0-9A-Fa-f]{2}/.test(str);
};

export const UrlEncoderDecoder: React.FC = () => {
    const [mode, setMode] = useState<Mode>('encode');
    const [encodeType, setEncodeType] = useState<EncodeType>('component');
    const [encodeInput, setEncodeInput] = useState('');
    const [encodeOutput, setEncodeOutput] = useState('');
    const [decodeInput, setDecodeInput] = useState('');
    const [decodeOutput, setDecodeOutput] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState<string | null>(null);
    const [batchMode, setBatchMode] = useState(false);

    // Parse mode state
    const [parseInput, setParseInput] = useState('');
    const [parsedBaseUrl, setParsedBaseUrl] = useState('');
    const [parsedParams, setParsedParams] = useState<{ key: string; encodedKey: string; value: string; encodedValue: string }[]>([]);

    // Build mode state
    const [buildBaseUrl, setBuildBaseUrl] = useState('https://example.com/path');
    const [buildParams, setBuildParams] = useState<QueryParam[]>([
        { key: '', value: '', id: 1 },
    ]);
    const [buildOutput, setBuildOutput] = useState('');
    const [nextId, setNextId] = useState(2);

    // ─── Encode logic ───
    const doEncode = useCallback((text: string, type: EncodeType, batch: boolean) => {
        if (!text.trim()) { setEncodeOutput(''); setError(''); return; }
        try {
            setError('');
            if (batch) {
                const lines = text.split('\n').filter(l => l.trim());
                setEncodeOutput(lines.map(l => type === 'uri' ? encodeURI(l) : encodeURIComponent(l)).join('\n'));
            } else {
                setEncodeOutput(type === 'uri' ? encodeURI(text) : encodeURIComponent(text));
            }
        } catch {
            setError('Failed to encode. Check input.'); setEncodeOutput('');
        }
    }, []);

    useEffect(() => {
        if (mode === 'encode') doEncode(encodeInput, encodeType, batchMode);
    }, [encodeInput, encodeType, batchMode, mode, doEncode]);

    // ─── Decode logic ───
    const doDecode = useCallback((text: string, batch: boolean) => {
        if (!text.trim()) { setDecodeOutput(''); setError(''); return; }
        try {
            setError('');
            if (batch) {
                const lines = text.split('\n').filter(l => l.trim());
                setDecodeOutput(lines.map(l => decodeURIComponent(l)).join('\n'));
            } else {
                setDecodeOutput(decodeURIComponent(text));
            }
        } catch {
            setError('Failed to decode. Malformed encoding found.'); setDecodeOutput('');
        }
    }, []);

    useEffect(() => {
        if (mode === 'decode') doDecode(decodeInput, batchMode);
    }, [decodeInput, batchMode, mode, doDecode]);

    // ─── Parse URL ───
    const parseUrl = useCallback((text: string) => {
        if (!text.trim()) { setParsedBaseUrl(''); setParsedParams([]); setError(''); return; }
        try {
            setError('');
            let urlStr = text.trim();
            if (!/^https?:\/\//i.test(urlStr) && !urlStr.startsWith('//')) urlStr = 'https://' + urlStr;
            const url = new URL(urlStr);
            setParsedBaseUrl(`${url.origin}${url.pathname}`);
            const params: typeof parsedParams = [];
            // Get raw query string for encoded display
            const rawQs = url.search.slice(1); // remove ?
            const rawPairs = rawQs.split('&').filter(Boolean);
            const rawMap: Record<string, string> = {};
            for (const pair of rawPairs) {
                const [k, ...v] = pair.split('=');
                rawMap[decodeURIComponent(k)] = v.join('=');
            }
            url.searchParams.forEach((value, key) => {
                params.push({
                    key,
                    encodedKey: encodeURIComponent(key),
                    value,
                    encodedValue: rawMap[key] ?? encodeURIComponent(value),
                });
            });
            setParsedParams(params);
        } catch {
            setError('Invalid URL. Please enter a valid URL with query parameters.');
            setParsedBaseUrl(''); setParsedParams([]);
        }
    }, []);

    useEffect(() => {
        if (mode === 'parse') parseUrl(parseInput);
    }, [parseInput, mode, parseUrl]);

    // ─── Build URL ───
    const rebuildUrl = useCallback(() => {
        const base = buildBaseUrl.trim();
        if (!base) { setBuildOutput(''); return; }
        const params = buildParams.filter(p => p.key.trim());
        if (params.length === 0) { setBuildOutput(base); return; }
        const qs = params.map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join('&');
        setBuildOutput(`${base}?${qs}`);
    }, [buildBaseUrl, buildParams]);

    useEffect(() => {
        if (mode === 'build') rebuildUrl();
    }, [mode, rebuildUrl]);

    const addParam = () => {
        setBuildParams([...buildParams, { key: '', value: '', id: nextId }]);
        setNextId(nextId + 1);
    };
    const removeParam = (id: number) => setBuildParams(buildParams.filter(p => p.id !== id));
    const updateParam = (id: number, field: 'key' | 'value', val: string) =>
        setBuildParams(buildParams.map(p => (p.id === id ? { ...p, [field]: val } : p)));

    const copyText = async (text: string, label: string) => {
        if (!text) return;
        await navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(null), 2000);
    };

    // Swap: send encode output → decode input (or vice versa)
    const swapToDecode = () => {
        setDecodeInput(encodeOutput || encodeInput);
        setMode('decode');
    };
    const swapToEncode = () => {
        setEncodeInput(decodeOutput || decodeInput);
        setMode('encode');
    };

    return (
        <div className="p-4 max-w-6xl mx-auto space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                    <Link size={18} className="text-green-600" />
                    <h2 className="text-lg font-bold text-slate-800">URL Encoder / Decoder</h2>
                </div>
                <p className="text-xs text-slate-500 mb-4">Encode, decode, parse, and build URLs with query parameters.</p>

                {/* Mode Toggle */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                        {(['encode', 'decode', 'parse', 'build'] as Mode[]).map(m => (
                            <button
                                key={m}
                                onClick={() => { setMode(m); setError(''); }}
                                className={`px-4 py-1.5 text-xs font-bold capitalize transition-colors ${mode === m ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>

                    {mode === 'encode' && (
                        <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                            <button
                                onClick={() => setEncodeType('component')}
                                className={`px-3 py-1.5 text-xs font-bold transition-colors ${encodeType === 'component' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                            >
                                Component
                            </button>
                            <button
                                onClick={() => setEncodeType('uri')}
                                className={`px-3 py-1.5 text-xs font-bold transition-colors ${encodeType === 'uri' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                            >
                                Full URI
                            </button>
                        </div>
                    )}

                    {(mode === 'encode' || mode === 'decode') && (
                        <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                            <input type="checkbox" checked={batchMode} onChange={e => setBatchMode(e.target.checked)} className="w-3.5 h-3.5 rounded accent-blue-600" />
                            <span className="font-semibold">Batch mode (one per line)</span>
                        </label>
                    )}
                </div>

                {/* Encode Type Info */}
                {mode === 'encode' && (
                    <div className="mb-3 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                        <p className="text-xs text-blue-700">
                            {encodeType === 'component'
                                ? "encodeURIComponent() — Encodes ALL special characters including : / ? # [ ] @ ! $ & ' ( ) * + , ; ="
                                : 'encodeURI() — Encodes special characters but preserves URL structure characters (: / ? # @ etc.)'}
                        </p>
                    </div>
                )}

                {/* ─── ENCODE MODE ─── */}
                {mode === 'encode' && (
                    <>
                        {/* Auto-detect warning */}
                        {encodeInput.trim() && isLikelyEncoded(encodeInput) && (
                            <div className="mb-3 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                                <span className="text-xs text-amber-700 font-semibold">⚠️ Input looks already encoded — you might get double-encoding!</span>
                                <button
                                    onClick={swapToDecode}
                                    className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                                >
                                    Switch to Decode →
                                </button>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 flex flex-col">
                                <label className="text-xs font-bold text-slate-700">Input (Plain Text / URL)</label>
                                <LineNumberedTextarea
                                    value={encodeInput}
                                    onChange={e => setEncodeInput(e.target.value)}
                                    placeholder={batchMode
                                        ? "Enter plain text, one per line...\nhello world\nname=John Doe&city=New York"
                                        : "Enter plain text or URL to encode...\ne.g. hello world or name=John Doe&city=New York"}
                                    className="w-full min-h-[200px] border-none rounded-none focus:ring-0 resize-y"
                                    containerClassName="flex-1 focus-within:ring-blue-500/20"
                                    spellCheck={false}
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-slate-700">Output (Encoded)</label>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={swapToDecode}
                                            disabled={!encodeOutput}
                                            title="Send to Decode"
                                            className="px-2 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 flex items-center gap-1 transition-colors"
                                        >
                                            <ArrowRightLeft size={11} /> Decode this
                                        </button>
                                        <button
                                            onClick={() => copyText(encodeOutput, 'encode')}
                                            disabled={!encodeOutput}
                                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${encodeOutput ? copied === 'encode' ? 'bg-green-100 text-green-700' : 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                                        >
                                            {copied === 'encode' ? 'Copied!' : 'Copy'}
                                        </button>
                                    </div>
                                </div>
                                <textarea
                                    value={encodeOutput}
                                    readOnly
                                    placeholder="Encoded output will appear here..."
                                    className="w-full font-mono text-xs border border-slate-200 rounded-lg p-3 min-h-[200px] resize-y bg-slate-50 focus:outline-none"
                                    spellCheck={false}
                                />
                            </div>
                        </div>
                        {/* Char-by-char diff */}
                        {encodeInput.trim() && encodeOutput && !isLikelyEncoded(encodeInput) && (
                            <div className="mt-3 bg-slate-50 rounded-lg border border-slate-200 p-3">
                                <h4 className="text-xs font-bold text-slate-700 mb-1">Characters Encoded</h4>
                                <p className="text-xs text-slate-500">
                                    {(() => {
                                        const encoded: string[] = [];
                                        for (const ch of encodeInput) {
                                            const enc = encodeType === 'uri' ? encodeURI(ch) : encodeURIComponent(ch);
                                            if (enc !== ch) encoded.push(`"${ch}" → ${enc}`);
                                        }
                                        return encoded.length > 0
                                            ? encoded.slice(0, 20).join('  ·  ') + (encoded.length > 20 ? ` ... and ${encoded.length - 20} more` : '')
                                            : 'No characters were encoded — input is already URL-safe.';
                                    })()}
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* ─── DECODE MODE ─── */}
                {mode === 'decode' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 flex flex-col">
                            <label className="text-xs font-bold text-slate-700">Input (Encoded URL / Text)</label>
                            <LineNumberedTextarea
                                value={decodeInput}
                                onChange={e => setDecodeInput(e.target.value)}
                                placeholder={batchMode
                                    ? "Paste encoded URLs, one per line...\nhello%20world\nname%3DJohn%20Doe%26city%3DNew%20York"
                                    : "Paste encoded URL or text to decode...\ne.g. hello%20world or %2F%20%3F%20%23%20%40"}
                                className="w-full min-h-[200px] border-none rounded-none focus:ring-0 resize-y"
                                containerClassName="flex-1 focus-within:ring-blue-500/20"
                                spellCheck={false}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-700">Output (Decoded / Human-readable)</label>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={swapToEncode}
                                        disabled={!decodeOutput}
                                        title="Send to Encode"
                                        className="px-2 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 flex items-center gap-1 transition-colors"
                                    >
                                        <ArrowRightLeft size={11} /> Encode this
                                    </button>
                                    <button
                                        onClick={() => copyText(decodeOutput, 'decode')}
                                        disabled={!decodeOutput}
                                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${decodeOutput ? copied === 'decode' ? 'bg-green-100 text-green-700' : 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                                    >
                                        {copied === 'decode' ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                            </div>
                            <textarea
                                value={decodeOutput}
                                readOnly
                                placeholder="Decoded output will appear here..."
                                className="w-full font-mono text-xs border border-slate-200 rounded-lg p-3 min-h-[200px] resize-y bg-slate-50 focus:outline-none"
                                spellCheck={false}
                            />
                        </div>
                    </div>
                )}

                {/* ─── PARSE MODE ─── */}
                {mode === 'parse' && (
                    <div className="space-y-4">
                        <div className="space-y-2 flex flex-col">
                            <label className="text-xs font-bold text-slate-700">URL to Parse</label>
                            <LineNumberedTextarea
                                value={parseInput}
                                onChange={e => setParseInput(e.target.value)}
                                placeholder="Paste a full URL with query parameters, e.g. https://example.com/page?name=John%20Doe&age=30"
                                className="w-full min-h-[80px] border-none rounded-none focus:ring-0 resize-y"
                                containerClassName="flex-1 focus-within:ring-blue-500/20"
                                spellCheck={false}
                            />
                        </div>
                        {parsedBaseUrl && (
                            <div className="space-y-3">
                                <div className="bg-slate-50 rounded-lg border border-slate-200 p-3">
                                    <span className="text-xs font-bold text-slate-700">Base URL: </span>
                                    <span className="text-xs font-mono text-blue-600 break-all">{parsedBaseUrl}</span>
                                </div>
                                {parsedParams.length > 0 ? (
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-700 mb-2">Query Parameters ({parsedParams.length})</h4>
                                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                                            <table className="w-full text-xs">
                                                <thead>
                                                    <tr className="bg-slate-50">
                                                        <th className="text-left px-3 py-2 font-bold text-slate-600 border-b border-slate-200">#</th>
                                                        <th className="text-left px-3 py-2 font-bold text-slate-600 border-b border-slate-200">Key</th>
                                                        <th className="text-left px-3 py-2 font-bold text-slate-600 border-b border-slate-200">Decoded Value</th>
                                                        <th className="text-left px-3 py-2 font-bold text-slate-600 border-b border-slate-200">Encoded Value</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {parsedParams.map((param, i) => (
                                                        <tr key={i} className="border-b border-slate-100 last:border-b-0">
                                                            <td className="px-3 py-2 text-slate-400">{i + 1}</td>
                                                            <td className="px-3 py-2 font-mono font-semibold text-blue-700">{param.key}</td>
                                                            <td className="px-3 py-2 font-mono text-slate-700 break-all">{param.value}</td>
                                                            <td className="px-3 py-2 font-mono text-slate-400 break-all">{param.encodedValue}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-400 italic">No query parameters found in this URL.</p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ─── BUILD MODE ─── */}
                {mode === 'build' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700">Base URL</label>
                            <input
                                type="text"
                                value={buildBaseUrl}
                                onChange={e => setBuildBaseUrl(e.target.value)}
                                placeholder="https://example.com/path"
                                className="w-full font-mono text-xs border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-700">Query Parameters</label>
                                <button onClick={addParam} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                                    + Add Parameter
                                </button>
                            </div>
                            <div className="space-y-2">
                                {buildParams.map(param => (
                                    <div key={param.id} className="flex items-center gap-2">
                                        <input
                                            type="text" value={param.key}
                                            onChange={e => updateParam(param.id, 'key', e.target.value)}
                                            placeholder="Key"
                                            className="flex-1 font-mono text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <span className="text-slate-400 text-xs">=</span>
                                        <input
                                            type="text" value={param.value}
                                            onChange={e => updateParam(param.id, 'value', e.target.value)}
                                            placeholder="Value"
                                            className="flex-1 font-mono text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <button onClick={() => removeParam(param.id)} className="px-2 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {buildOutput && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-slate-700">Generated URL</label>
                                    <button
                                        onClick={() => copyText(buildOutput, 'build')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${copied === 'build' ? 'bg-green-100 text-green-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                    >
                                        {copied === 'build' ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                                    <p className="font-mono text-xs text-slate-700 break-all">{buildOutput}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        <p className="text-xs text-red-600 font-semibold">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
