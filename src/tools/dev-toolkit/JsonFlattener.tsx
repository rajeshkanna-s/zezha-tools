import React, { useState, useCallback } from 'react';
import { Layers, Copy, Download, ArrowRightLeft } from 'lucide-react';
import { LineNumberedTextarea } from './LineNumberedTextarea';

type Separator = '.' | '_' | '__' | string;

function flattenJSON(obj: unknown, prefix: string, sep: Separator, result: Record<string, unknown>): void {
    if (obj === null || obj === undefined) {
        result[prefix || '(root)'] = obj;
        return;
    }
    if (Array.isArray(obj)) {
        if (obj.length === 0) {
            result[prefix || '(root)'] = [];
            return;
        }
        obj.forEach((item, i) => {
            const key = prefix ? `${prefix}[${i}]` : `[${i}]`;
            if (typeof item === 'object' && item !== null) {
                flattenJSON(item, key, sep, result);
            } else {
                result[key] = item;
            }
        });
        return;
    }
    if (typeof obj === 'object') {
        const keys = Object.keys(obj as Record<string, unknown>);
        if (keys.length === 0) {
            result[prefix || '(root)'] = {};
            return;
        }
        for (const k of keys) {
            const val = (obj as Record<string, unknown>)[k];
            const newKey = prefix ? `${prefix}${sep}${k}` : k;
            if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
                flattenJSON(val, newKey, sep, result);
            } else if (Array.isArray(val)) {
                flattenJSON(val, newKey, sep, result);
            } else {
                result[newKey] = val;
            }
        }
        return;
    }
    result[prefix || '(root)'] = obj;
}

function unflattenJSON(flat: Record<string, unknown>, sep: string): unknown {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(flat)) {
        // Split by separator and array indices
        const parts: (string | number)[] = [];
        // Replace array indices [n] first
        const segments = key.replace(/\[(\d+)\]/g, `${sep}$1`).split(sep).filter(Boolean);
        for (const seg of segments) {
            if (/^\d+$/.test(seg)) {
                parts.push(Number(seg));
            } else {
                parts.push(seg);
            }
        }

        let current: Record<string, unknown> = result;
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            const nextPart = parts[i + 1];
            const keyStr = String(part);

            if (current[keyStr] === undefined) {
                current[keyStr] = typeof nextPart === 'number' ? [] : {};
            }
            current = current[keyStr] as Record<string, unknown>;
        }

        const lastPart = String(parts[parts.length - 1]);
        current[lastPart] = value;
    }

    return result;
}

function getDepth(obj: unknown): number {
    if (typeof obj !== 'object' || obj === null) return 0;
    if (Array.isArray(obj)) {
        if (obj.length === 0) return 1;
        return 1 + Math.max(...obj.map(getDepth));
    }
    const vals = Object.values(obj as Record<string, unknown>);
    if (vals.length === 0) return 1;
    return 1 + Math.max(...vals.map(getDepth));
}

function countKeys(obj: unknown): number {
    if (typeof obj !== 'object' || obj === null) return 0;
    if (Array.isArray(obj)) return obj.reduce((s: number, v) => s + countKeys(v), obj.length);
    return Object.keys(obj as object).length + Object.values(obj as Record<string, unknown>).reduce((s: number, v) => s + (typeof v === 'object' && v !== null ? countKeys(v) : 0), 0);
}

export const JsonFlattener: React.FC = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [separator, setSeparator] = useState<Separator>('.');
    const [customSep, setCustomSep] = useState('');
    const [mode, setMode] = useState<'flatten' | 'unflatten'>('flatten');
    const [stats, setStats] = useState<{
        inputKeys: number;
        outputKeys: number;
        inputDepth: number;
        outputDepth: number;
    } | null>(null);

    const effectiveSep = separator === 'custom' ? (customSep || '.') : separator;

    const process = useCallback((value: string, sep: string, m: 'flatten' | 'unflatten') => {
        if (!value.trim()) {
            setOutput('');
            setError('');
            setStats(null);
            return;
        }
        try {
            const parsed = JSON.parse(value);

            if (m === 'flatten') {
                const result: Record<string, unknown> = {};
                flattenJSON(parsed, '', sep, result);
                const out = JSON.stringify(result, null, 2);
                setOutput(out);
                setError('');
                setStats({
                    inputKeys: countKeys(parsed),
                    outputKeys: Object.keys(result).length,
                    inputDepth: getDepth(parsed),
                    outputDepth: 1,
                });
            } else {
                // unflatten
                if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
                    setError('Unflatten requires a flat JSON object (not array or primitive).');
                    setOutput('');
                    setStats(null);
                    return;
                }
                const result = unflattenJSON(parsed as Record<string, unknown>, sep);
                const out = JSON.stringify(result, null, 2);
                setOutput(out);
                setError('');
                setStats({
                    inputKeys: Object.keys(parsed as object).length,
                    outputKeys: countKeys(result),
                    inputDepth: 1,
                    outputDepth: getDepth(result),
                });
            }
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Invalid JSON';
            setError(msg);
            setOutput('');
            setStats(null);
        }
    }, []);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setInput(val);
        process(val, effectiveSep, mode);
    }, [process, effectiveSep, mode]);

    const handleSepChange = useCallback((s: Separator) => {
        setSeparator(s);
        const eff = s === 'custom' ? (customSep || '.') : s;
        process(input, eff, mode);
    }, [process, input, mode, customSep]);

    const handleCustomSepChange = useCallback((v: string) => {
        setCustomSep(v);
        if (separator === 'custom') {
            process(input, v || '.', mode);
        }
    }, [process, input, mode, separator]);

    const handleModeToggle = useCallback(() => {
        const next = mode === 'flatten' ? 'unflatten' : 'flatten';
        setMode(next as 'flatten' | 'unflatten');
        process(input, effectiveSep, next as 'flatten' | 'unflatten');
    }, [process, input, effectiveSep, mode]);

    const handleCopy = useCallback(async () => {
        if (!output) return;
        await navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [output]);

    const handleDownload = useCallback(() => {
        if (!output) return;
        const blob = new Blob([output], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = mode === 'flatten' ? 'flattened.json' : 'unflattened.json';
        a.click();
        URL.revokeObjectURL(url);
    }, [output, mode]);

    const separators: { val: Separator; label: string }[] = [
        { val: '.', label: 'Dot (.)' },
        { val: '_', label: 'Underscore (_)' },
        { val: '__', label: 'Double (__)' },
        { val: 'custom', label: 'Custom' },
    ];

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Layers size={22} />
                </div>
                <div>
                    <h2 className="text-base font-bold text-slate-800">Nested JSON Flattener</h2>
                    <p className="text-xs text-slate-500">Flatten nested JSON to single-level or unflatten back</p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
                {/* Mode toggle */}
                <button
                    onClick={handleModeToggle}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${mode === 'flatten' ? 'bg-indigo-600 text-white' : 'bg-amber-600 text-white'}`}
                >
                    <ArrowRightLeft size={12} />
                    {mode === 'flatten' ? 'Flatten' : 'Unflatten'}
                </button>

                <span className="text-xs text-slate-400">|</span>

                <span className="text-xs font-semibold text-slate-600">Separator:</span>
                {separators.map(s => (
                    <button
                        key={s.val}
                        onClick={() => handleSepChange(s.val)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${separator === s.val ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        {s.label}
                    </button>
                ))}
                {separator === 'custom' && (
                    <input
                        value={customSep}
                        onChange={e => handleCustomSepChange(e.target.value)}
                        placeholder="::"
                        className="w-16 px-2 py-1.5 text-xs border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                )}

                <div className="ml-auto flex items-center gap-2">
                    <button
                        onClick={handleCopy}
                        disabled={!output}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-40 flex items-center gap-1 transition-colors"
                    >
                        <Copy size={12} />
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                        onClick={handleDownload}
                        disabled={!output}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-40 flex items-center gap-1 transition-colors"
                    >
                        <Download size={12} />
                        Download
                    </button>
                </div>
            </div>

            {/* Input / Output */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col">
                    <label className="text-xs font-semibold text-slate-600 mb-2 block">
                        {mode === 'flatten' ? 'Input (Nested JSON)' : 'Input (Flat JSON)'}
                    </label>
                    <LineNumberedTextarea
                        value={input}
                        onChange={handleInputChange}
                        placeholder={mode === 'flatten'
                            ? '{\n  "user": {\n    "name": "Alice",\n    "address": {\n      "city": "Mumbai"\n    }\n  }\n}'
                            : '{\n  "user.name": "Alice",\n  "user.address.city": "Mumbai"\n}'
                        }
                        className="w-full h-80 border-none rounded-none focus:ring-0 resize-none"
                        containerClassName="flex-1 focus-within:ring-indigo-500/20"
                        spellCheck={false}
                    />
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <label className="text-xs font-semibold text-slate-600 mb-2 block">
                        {mode === 'flatten' ? 'Output (Flattened)' : 'Output (Nested)'}
                    </label>
                    {error ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
                            <span className="font-bold">Error: </span>{error}
                        </div>
                    ) : output ? (
                        <textarea
                            value={output}
                            readOnly
                            className="w-full h-80 font-mono text-xs border border-slate-200 rounded-lg p-3 bg-slate-50 resize-none focus:outline-none"
                        />
                    ) : (
                        <div className="h-80 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400 text-xs">
                            {mode === 'flatten' ? 'Flattened' : 'Nested'} output will appear here
                        </div>
                    )}
                </div>
            </div>

            {/* Stats */}
            {stats && (
                <div className="mt-3 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-700 mb-3">Statistics</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-slate-50 rounded-lg p-3 text-center">
                            <div className="text-xs text-slate-500 mb-1">Input Keys</div>
                            <div className="text-sm font-bold text-slate-800">{stats.inputKeys}</div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3 text-center">
                            <div className="text-xs text-slate-500 mb-1">Output Keys</div>
                            <div className="text-sm font-bold text-slate-800">{stats.outputKeys}</div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3 text-center">
                            <div className="text-xs text-slate-500 mb-1">Input Depth</div>
                            <div className="text-sm font-bold text-slate-800">{stats.inputDepth} {stats.inputDepth === 1 ? 'level' : 'levels'}</div>
                        </div>
                        <div className={`rounded-lg p-3 text-center ${mode === 'flatten' ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                            <div className={`text-xs mb-1 ${mode === 'flatten' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                Output Depth
                            </div>
                            <div className={`text-sm font-bold ${mode === 'flatten' ? 'text-emerald-700' : 'text-amber-700'}`}>
                                {stats.outputDepth} {stats.outputDepth === 1 ? 'level' : 'levels'}
                                {mode === 'flatten' && stats.inputDepth > 1 && (
                                    <span className="text-[10px] ml-1">↓ {stats.inputDepth - 1}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
