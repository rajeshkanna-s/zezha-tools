import React, { useState, useMemo, useCallback } from 'react';
import { Copy, Check, RotateCcw, Type } from 'lucide-react';
import { LineNumberedTextarea } from './LineNumberedTextarea';

/* ── Tokenizer ── */
function tokenize(input: string): string[] {
    let spaced = input.replace(/([a-z])([A-Z])/g, '$1 $2');
    spaced = spaced.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
    return spaced.split(/[_\-\s./\\]+/).map(t => t.trim()).filter(t => t.length > 0);
}

/* ── Case Converters ── */
const toCamelCase = (t: string[]) => t.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
const toPascalCase = (t: string[]) => t.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
const toSnakeCase = (t: string[]) => t.map(w => w.toLowerCase()).join('_');
const toUpperSnakeCase = (t: string[]) => t.map(w => w.toUpperCase()).join('_');
const toKebabCase = (t: string[]) => t.map(w => w.toLowerCase()).join('-');
const toUpperKebabCase = (t: string[]) => t.map(w => w.toUpperCase()).join('-');
const toTitleCase = (t: string[]) => t.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
const toSentenceCase = (t: string[]) => t.map((w, i) => i === 0 ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w.toLowerCase()).join(' ');
const toUpperCase = (t: string[]) => t.map(w => w.toUpperCase()).join(' ');
const toLowerCase = (t: string[]) => t.map(w => w.toLowerCase()).join(' ');
const toDotCase = (t: string[]) => t.map(w => w.toLowerCase()).join('.');
const toPathCase = (t: string[]) => t.map(w => w.toLowerCase()).join('/');
const toTrainCase = (t: string[]) => t.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('-');
const toSwapCase = (_t: string[], original: string) => original.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
const toReverseText = (_t: string[], original: string) => original.split('').reverse().join('');
const toROT13 = (_t: string[], original: string) => original.replace(/[a-zA-Z]/g, c => {
    const base = c <= 'Z' ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
});

interface CaseFormat {
    label: string;
    example: string;
    fn: (tokens: string[], original: string) => string;
    color: string;
}

const CASE_FORMATS: CaseFormat[] = [
    { label: 'camelCase', example: 'myVarName', fn: (t) => toCamelCase(t), color: 'border-blue-200 bg-blue-50/50' },
    { label: 'PascalCase', example: 'MyVarName', fn: (t) => toPascalCase(t), color: 'border-violet-200 bg-violet-50/50' },
    { label: 'snake_case', example: 'my_var_name', fn: (t) => toSnakeCase(t), color: 'border-emerald-200 bg-emerald-50/50' },
    { label: 'SCREAMING_SNAKE', example: 'MY_VAR_NAME', fn: (t) => toUpperSnakeCase(t), color: 'border-red-200 bg-red-50/50' },
    { label: 'kebab-case', example: 'my-var-name', fn: (t) => toKebabCase(t), color: 'border-amber-200 bg-amber-50/50' },
    { label: 'UPPER-KEBAB', example: 'MY-VAR-NAME', fn: (t) => toUpperKebabCase(t), color: 'border-orange-200 bg-orange-50/50' },
    { label: 'Title Case', example: 'My Var Name', fn: (t) => toTitleCase(t), color: 'border-cyan-200 bg-cyan-50/50' },
    { label: 'Sentence case', example: 'My var name', fn: (t) => toSentenceCase(t), color: 'border-teal-200 bg-teal-50/50' },
    { label: 'UPPER CASE', example: 'MY VAR NAME', fn: (t) => toUpperCase(t), color: 'border-rose-200 bg-rose-50/50' },
    { label: 'lower case', example: 'my var name', fn: (t) => toLowerCase(t), color: 'border-slate-200 bg-slate-50/50' },
    { label: 'dot.case', example: 'my.var.name', fn: (t) => toDotCase(t), color: 'border-indigo-200 bg-indigo-50/50' },
    { label: 'path/case', example: 'my/var/name', fn: (t) => toPathCase(t), color: 'border-sky-200 bg-sky-50/50' },
    { label: 'Train-Case', example: 'My-Var-Name', fn: (t) => toTrainCase(t), color: 'border-purple-200 bg-purple-50/50' },
    { label: 'sWAP cASE', example: 'sWAP cASE', fn: (_, o) => toSwapCase([], o), color: 'border-pink-200 bg-pink-50/50' },
    { label: 'Reverse', example: 'esreveR', fn: (_, o) => toReverseText([], o), color: 'border-lime-200 bg-lime-50/50' },
    { label: 'ROT13', example: 'EBG13', fn: (_, o) => toROT13([], o), color: 'border-yellow-200 bg-yellow-50/50' },
];

/* ── Case Detection ── */
function detectCase(input: string): string {
    const trimmed = input.trim();
    if (!trimmed) return '';
    if (/^[a-z][a-zA-Z0-9]*$/.test(trimmed) && /[A-Z]/.test(trimmed)) return 'Detected: camelCase';
    if (/^[A-Z][a-zA-Z0-9]*$/.test(trimmed) && /[a-z]/.test(trimmed)) return 'Detected: PascalCase';
    if (/^[a-z][a-z0-9]*(_[a-z0-9]+)+$/.test(trimmed)) return 'Detected: snake_case';
    if (/^[A-Z][A-Z0-9]*(_[A-Z0-9]+)+$/.test(trimmed)) return 'Detected: SCREAMING_SNAKE_CASE';
    if (/^[a-z][a-z0-9]*(-[a-z0-9]+)+$/.test(trimmed)) return 'Detected: kebab-case';
    if (/^[A-Z][A-Z0-9]*(-[A-Z0-9]+)+$/.test(trimmed)) return 'Detected: UPPER-KEBAB-CASE';
    if (/^[a-z][a-z0-9]*(\.[a-z0-9]+)+$/.test(trimmed)) return 'Detected: dot.case';
    if (/^[A-Z][a-z]*(\s[A-Z][a-z]*)+$/.test(trimmed)) return 'Detected: Title Case';
    if (/^[A-Z][a-z]*(\-[A-Z][a-z]*)+$/.test(trimmed)) return 'Detected: Train-Case';
    if (trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed)) return 'Detected: UPPER CASE';
    if (trimmed === trimmed.toLowerCase()) return 'Detected: lower case';
    return 'Mixed / unknown case';
}

/* ── Copy Button ── */
function CopyBtn({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = useCallback(async () => {
        try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* */ }
    }, [text]);
    return (
        <button onClick={handleCopy}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${copied ? 'bg-green-100 text-green-700' : 'bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700'} border border-slate-200`}>
            {copied ? <><Check className="w-3 h-3 inline -mt-0.5" /> Copied</> : <><Copy className="w-3 h-3 inline -mt-0.5" /> Copy</>}
        </button>
    );
}

export const StringCaseConverter: React.FC = () => {
    const [input, setInput] = useState('');
    const [batchMode, setBatchMode] = useState(false);

    const detectedCase = useMemo(() => {
        if (batchMode || !input.trim()) return '';
        return detectCase(input.trim());
    }, [input, batchMode]);

    const textStats = useMemo(() => {
        if (!input.trim()) return null;
        const text = input.trim();
        const chars = text.length;
        const words = text.split(/\s+/).filter(w => w.length > 0).length;
        const lines = text.split('\n').length;
        const bytes = new Blob([text]).size;
        return { chars, words, lines, bytes };
    }, [input]);

    const results = useMemo(() => {
        if (!input.trim()) return [];
        if (batchMode) {
            const lines = input.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            return CASE_FORMATS.map(fmt => ({
                label: fmt.label,
                example: fmt.example,
                color: fmt.color,
                value: lines.map(line => fmt.fn(tokenize(line), line)).join('\n'),
            }));
        }
        const trimmed = input.trim();
        const tokens = tokenize(trimmed);
        return CASE_FORMATS.map(fmt => ({
            label: fmt.label,
            example: fmt.example,
            color: fmt.color,
            value: fmt.fn(tokens, trimmed),
        }));
    }, [input, batchMode]);

    const handleQuickApply = useCallback((value: string) => {
        setInput(value);
    }, []);

    return (
        <div className="p-4 max-w-5xl mx-auto space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Type size={22} />
                </div>
                <div>
                    <h2 className="text-base font-bold text-slate-800">String Case Converter</h2>
                    <p className="text-xs text-slate-500">Convert between 16 case formats — camelCase, snake_case, ROT13 & more</p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={batchMode} onChange={e => setBatchMode(e.target.checked)} className="accent-blue-600 w-3.5 h-3.5" />
                    <span className="text-xs font-semibold text-slate-600">Batch Mode (one per line)</span>
                </label>
                {input.trim() && (
                    <button onClick={() => setInput('')}
                        className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors">
                        <RotateCcw className="w-3 h-3" /> Clear
                    </button>
                )}
            </div>

            {/* Input */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700">Input Text</label>
                    {detectedCase && (
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{detectedCase}</span>
                    )}
                </div>
                <LineNumberedTextarea value={input} onChange={e => setInput(e.target.value)}
                    placeholder={batchMode ? 'Enter strings, one per line...\nmyVariableName\nsome-other-string' : 'Enter text to convert... e.g. myVariableName'}
                    rows={batchMode ? 5 : 2}
                    className="w-full border-none rounded-none focus:ring-0 resize-y"
                    containerClassName="focus-within:ring-blue-500/20" spellCheck={false} />
                {textStats && (
                    <div className="flex gap-4 mt-2 text-[10px] text-slate-400">
                        <span>{textStats.chars} chars</span>
                        <span>{textStats.words} words</span>
                        <span>{textStats.lines} lines</span>
                        <span>{textStats.bytes} bytes</span>
                    </div>
                )}
            </div>

            {/* Results Grid */}
            {results.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {results.map(r => (
                        <div key={r.label}
                            className={`rounded-xl border p-3 shadow-sm hover:shadow-md transition-all ${r.color}`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-slate-700">{r.label}</span>
                                <div className="flex gap-1">
                                    <button onClick={() => handleQuickApply(r.value)}
                                        title="Apply as input"
                                        className="px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-400 hover:bg-white hover:text-slate-700 transition-colors border border-transparent hover:border-slate-200">
                                        ↑ Apply
                                    </button>
                                    <CopyBtn text={r.value} />
                                </div>
                            </div>
                            {batchMode ? (
                                <pre className="font-mono text-sm text-slate-900 bg-white/70 rounded-lg p-2 overflow-x-auto whitespace-pre-wrap break-all max-h-28 overflow-y-auto border border-white/50">
                                    {r.value}
                                </pre>
                            ) : (
                                <div className="font-mono text-sm text-slate-900 bg-white/70 rounded-lg p-2 overflow-x-auto break-all border border-white/50">
                                    {r.value}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {!input.trim() && (
                <div className="text-center py-10">
                    <Type className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-xs text-slate-400">Enter text above to see all 16 case conversions</p>
                    <p className="text-[10px] text-slate-300 mt-1">Supports camelCase, PascalCase, snake_case, kebab-case, ROT13, swap case & more</p>
                </div>
            )}
        </div>
    );
};
