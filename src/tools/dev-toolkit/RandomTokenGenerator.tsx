import React, { useState, useCallback } from 'react';
import { Key, Copy, Check, RefreshCw } from 'lucide-react';

const CHARSETS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    special: '!@#$%^&*()-_=+[]{}|;:,.<>?',
};

interface Preset {
    label: string;
    length: number;
    charset: string;
    prefix: string;
}

const PRESETS: Record<string, Preset> = {
    apiKey: { label: 'API Key (32 alphanumeric)', length: 32, charset: CHARSETS.uppercase + CHARSETS.lowercase + CHARSETS.numbers, prefix: '' },
    secretKey: { label: 'Secret Key (64 hex)', length: 64, charset: '0123456789abcdef', prefix: '' },
    sessionToken: { label: 'Session Token (128 base64-like)', length: 128, charset: CHARSETS.uppercase + CHARSETS.lowercase + CHARSETS.numbers + '+/', prefix: '' },
};

function generateToken(length: number, charset: string): string {
    if (charset.length === 0) return '';
    const values = new Uint32Array(length);
    crypto.getRandomValues(values);
    let result = '';
    for (let i = 0; i < length; i++) {
        result += charset[values[i] % charset.length];
    }
    return result;
}

export const RandomTokenGenerator: React.FC = () => {
    const [length, setLength] = useState(32);
    const [useUppercase, setUseUppercase] = useState(true);
    const [useLowercase, setUseLowercase] = useState(true);
    const [useNumbers, setUseNumbers] = useState(true);
    const [useSpecial, setUseSpecial] = useState(false);
    const [customChars, setCustomChars] = useState('');
    const [prefix, setPrefix] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [tokens, setTokens] = useState<string[]>([]);
    const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
    const [copiedAll, setCopiedAll] = useState(false);
    const [activePreset, setActivePreset] = useState<string | null>(null);

    const buildCharset = useCallback(() => {
        if (customChars.length > 0) return customChars;
        let cs = '';
        if (useUppercase) cs += CHARSETS.uppercase;
        if (useLowercase) cs += CHARSETS.lowercase;
        if (useNumbers) cs += CHARSETS.numbers;
        if (useSpecial) cs += CHARSETS.special;
        return cs || CHARSETS.lowercase;
    }, [useUppercase, useLowercase, useNumbers, useSpecial, customChars]);

    const generate = useCallback(() => {
        const cs = buildCharset();
        const q = Math.max(1, Math.min(100, quantity));
        const len = Math.max(1, Math.min(256, length));
        const list: string[] = [];
        for (let i = 0; i < q; i++) {
            list.push(prefix + generateToken(len, cs));
        }
        setTokens(list);
        setCopiedIdx(null);
        setCopiedAll(false);
    }, [buildCharset, quantity, length, prefix]);

    const applyPreset = (key: string) => {
        const p = PRESETS[key];
        setLength(p.length);
        setPrefix(p.prefix);
        setCustomChars(p.charset);
        setActivePreset(key);
    };

    const clearPreset = () => {
        setCustomChars('');
        setActivePreset(null);
    };

    const copySingle = async (idx: number) => {
        await navigator.clipboard.writeText(tokens[idx]);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 1500);
    };

    const copyAll = async () => {
        await navigator.clipboard.writeText(tokens.join('\n'));
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 1500);
    };

    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <Key className="w-5 h-5 text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-800">Random Token Generator</h2>
            </div>

            {/* Presets */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-700">Presets</h3>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(PRESETS).map(([key, p]) => (
                        <button
                            key={key}
                            onClick={() => applyPreset(key)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${activePreset === key ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}
                        >
                            {p.label}
                        </button>
                    ))}
                    {activePreset && (
                        <button onClick={clearPreset} className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50">
                            Clear Preset
                        </button>
                    )}
                </div>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Token Length (1-256)</label>
                        <input
                            type="number"
                            min={1}
                            max={256}
                            value={length}
                            onChange={e => { setLength(Math.max(1, Math.min(256, Number(e.target.value) || 1))); setActivePreset(null); }}
                            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Quantity (1-100)</label>
                        <input
                            type="number"
                            min={1}
                            max={100}
                            value={quantity}
                            onChange={e => setQuantity(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
                            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Prefix (optional)</label>
                    <input
                        type="text"
                        value={prefix}
                        onChange={e => setPrefix(e.target.value)}
                        placeholder='e.g., sk_live_, api_'
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                </div>

                {/* Character sets */}
                <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">Character Sets</label>
                    <div className="flex flex-wrap gap-3">
                        {([['useUppercase', 'A-Z', useUppercase, setUseUppercase],
                        ['useLowercase', 'a-z', useLowercase, setUseLowercase],
                        ['useNumbers', '0-9', useNumbers, setUseNumbers],
                        ['useSpecial', '!@#$%', useSpecial, setUseSpecial]] as const).map(([id, label, val, setter]) => (
                            <label key={id} className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={val}
                                    onChange={e => { (setter as React.Dispatch<React.SetStateAction<boolean>>)(e.target.checked); setActivePreset(null); setCustomChars(''); }}
                                    className="rounded"
                                    disabled={customChars.length > 0}
                                />
                                {label}
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Custom Character Set (overrides checkboxes)</label>
                    <input
                        type="text"
                        value={customChars}
                        onChange={e => { setCustomChars(e.target.value); setActivePreset(null); }}
                        placeholder="Leave empty to use checkboxes above"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                </div>

                <button
                    onClick={generate}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5"
                >
                    <RefreshCw className="w-3.5 h-3.5" /> Generate
                </button>
            </div>

            {/* Tokens */}
            {tokens.length > 0 && (
                <>
                    <div className="flex gap-2">
                        <button
                            onClick={copyAll}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1.5"
                        >
                            {copiedAll ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                            {copiedAll ? 'Copied!' : 'Copy All'}
                        </button>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <div className="max-h-80 overflow-y-auto space-y-1">
                            {tokens.map((token, idx) => (
                                <div key={idx} className="flex items-center gap-2 group">
                                    <span className="text-xs text-slate-400 w-6 shrink-0 text-right">{idx + 1}.</span>
                                    <code className="text-xs font-mono text-slate-700 flex-1 bg-slate-50 rounded px-2 py-1 break-all">{token}</code>
                                    <button
                                        onClick={() => copySingle(idx)}
                                        className="opacity-0 group-hover:opacity-100 px-2 py-1 rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-50 shrink-0 transition-opacity"
                                    >
                                        {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
