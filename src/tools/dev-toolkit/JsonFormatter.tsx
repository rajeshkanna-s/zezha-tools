import React, { useState, useCallback, useMemo } from 'react';
import { Braces, Copy, Download, Sun, Moon, ChevronRight, ChevronDown, Minimize2, ArrowDownAZ, FileUp, Wrench, Code } from 'lucide-react';
import { LineNumberedTextarea } from './LineNumberedTextarea';

/* ── JSON Repair ── */
function repairJson(input: string): string {
    let s = input.trim();
    // Remove trailing commas before } or ]
    s = s.replace(/,\s*([\]}])/g, '$1');
    // Replace single quotes with double quotes (but not inside double-quoted strings)
    s = s.replace(/(?<![\\])'([^']*?)(?<![\\])'/g, '"$1"');
    // Add quotes around unquoted keys
    s = s.replace(/(\{|,)\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');
    // Replace undefined with null
    s = s.replace(/:\s*undefined\b/g, ': null');
    return s;
}

/* ── TypeScript Interface Generator ── */
function jsonToTsInterface(obj: unknown, name = 'Root', indent = 0): string {
    const pad = '  '.repeat(indent);
    if (obj === null || obj === undefined) return `${pad}type ${name} = null;\n`;
    if (typeof obj !== 'object') return `${pad}type ${name} = ${typeof obj};\n`;
    if (Array.isArray(obj)) {
        if (obj.length === 0) return `${pad}type ${name} = unknown[];\n`;
        const first = obj[0];
        if (typeof first === 'object' && first !== null && !Array.isArray(first)) {
            const itemInterface = jsonToTsInterface(first, `${name}Item`, indent);
            return itemInterface + `${pad}type ${name} = ${name}Item[];\n`;
        }
        return `${pad}type ${name} = ${typeof first}[];\n`;
    }
    const entries = Object.entries(obj as Record<string, unknown>);
    const lines: string[] = [`${pad}interface ${name} {`];
    const subInterfaces: string[] = [];
    for (const [key, value] of entries) {
        const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`;
        if (value === null) {
            lines.push(`${pad}  ${safeKey}: null;`);
        } else if (Array.isArray(value)) {
            if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
                const subName = key.charAt(0).toUpperCase() + key.slice(1) + 'Item';
                subInterfaces.push(jsonToTsInterface(value[0], subName, indent));
                lines.push(`${pad}  ${safeKey}: ${subName}[];`);
            } else {
                const itemType = value.length > 0 ? typeof value[0] : 'unknown';
                lines.push(`${pad}  ${safeKey}: ${itemType}[];`);
            }
        } else if (typeof value === 'object') {
            const subName = key.charAt(0).toUpperCase() + key.slice(1);
            subInterfaces.push(jsonToTsInterface(value, subName, indent));
            lines.push(`${pad}  ${safeKey}: ${subName};`);
        } else {
            lines.push(`${pad}  ${safeKey}: ${typeof value};`);
        }
    }
    lines.push(`${pad}}`);
    return subInterfaces.join('\n') + lines.join('\n') + '\n';
}

/* ── Sort Keys Recursively ── */
function sortKeysDeep(obj: unknown): unknown {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(sortKeysDeep);
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(obj as Record<string, unknown>).sort()) {
        sorted[key] = sortKeysDeep((obj as Record<string, unknown>)[key]);
    }
    return sorted;
}

/* ── Tree View Component ── */
function JsonTreeNode({ name, value, depth = 0 }: { name?: string; value: unknown; depth?: number }) {
    const [expanded, setExpanded] = useState(depth < 2);

    if (value === null) return (
        <div className="flex items-center gap-1" style={{ paddingLeft: depth * 16 }}>
            {name && <span className="text-purple-600 text-xs font-semibold">{name}:</span>}
            <span className="text-slate-400 text-xs italic">null</span>
        </div>
    );

    if (typeof value === 'boolean') return (
        <div className="flex items-center gap-1" style={{ paddingLeft: depth * 16 }}>
            {name && <span className="text-purple-600 text-xs font-semibold">{name}:</span>}
            <span className="text-orange-600 text-xs font-bold">{String(value)}</span>
        </div>
    );

    if (typeof value === 'number') return (
        <div className="flex items-center gap-1" style={{ paddingLeft: depth * 16 }}>
            {name && <span className="text-purple-600 text-xs font-semibold">{name}:</span>}
            <span className="text-blue-600 text-xs font-bold">{value}</span>
        </div>
    );

    if (typeof value === 'string') return (
        <div className="flex items-center gap-1" style={{ paddingLeft: depth * 16 }}>
            {name && <span className="text-purple-600 text-xs font-semibold">{name}:</span>}
            <span className="text-green-600 text-xs">&quot;{value.length > 80 ? value.slice(0, 80) + '…' : value}&quot;</span>
        </div>
    );

    if (Array.isArray(value)) {
        return (
            <div>
                <button onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-0.5 hover:bg-slate-100 rounded px-1 -ml-1 transition-colors"
                    style={{ paddingLeft: depth * 16 }}>
                    {expanded ? <ChevronDown className="w-3 h-3 text-slate-400" /> : <ChevronRight className="w-3 h-3 text-slate-400" />}
                    {name && <span className="text-purple-600 text-xs font-semibold">{name}:</span>}
                    <span className="text-xs text-slate-400">[{value.length}]</span>
                </button>
                {expanded && value.map((item, i) => (
                    <JsonTreeNode key={i} name={String(i)} value={item} depth={depth + 1} />
                ))}
            </div>
        );
    }

    if (typeof value === 'object') {
        const keys = Object.keys(value as Record<string, unknown>);
        return (
            <div>
                <button onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-0.5 hover:bg-slate-100 rounded px-1 -ml-1 transition-colors"
                    style={{ paddingLeft: depth * 16 }}>
                    {expanded ? <ChevronDown className="w-3 h-3 text-slate-400" /> : <ChevronRight className="w-3 h-3 text-slate-400" />}
                    {name && <span className="text-purple-600 text-xs font-semibold">{name}:</span>}
                    <span className="text-xs text-slate-400">{'{' + keys.length + '}'}</span>
                </button>
                {expanded && keys.map(key => (
                    <JsonTreeNode key={key} name={key} value={(value as Record<string, unknown>)[key]} depth={depth + 1} />
                ))}
            </div>
        );
    }

    return null;
}

export const JsonFormatter: React.FC = () => {
    const [input, setInput] = useState('');
    const [formatted, setFormatted] = useState('');
    const [highlightedHtml, setHighlightedHtml] = useState('');
    const [error, setError] = useState('');
    const [indent, setIndent] = useState<'2' | '4' | 'tab'>('2');
    const [copied, setCopied] = useState(false);
    const [dark, setDark] = useState(false);
    const [sortKeys, setSortKeys] = useState(false);
    const [viewMode, setViewMode] = useState<'raw' | 'tree' | 'ts'>('raw');
    const [stats, setStats] = useState<{ keys: number; depth: number; size: number; lines: number } | null>(null);
    const [parsedObj, setParsedObj] = useState<unknown>(null);
    const [tsInterface, setTsInterface] = useState('');

    const getIndent = useCallback(() => {
        if (indent === '2') return 2;
        if (indent === '4') return 4;
        return '\t';
    }, [indent]);

    const countKeysAndDepth = useCallback((obj: unknown, depth = 0): { keys: number; depth: number } => {
        if (obj === null || typeof obj !== 'object') return { keys: 0, depth };
        if (Array.isArray(obj)) {
            let maxD = depth, totalK = 0;
            for (const item of obj) { const r = countKeysAndDepth(item, depth + 1); totalK += r.keys; if (r.depth > maxD) maxD = r.depth; }
            return { keys: totalK, depth: maxD };
        }
        const entries = Object.keys(obj);
        let totalK = entries.length, maxD = depth;
        for (const key of entries) { const r = countKeysAndDepth((obj as Record<string, unknown>)[key], depth + 1); totalK += r.keys; if (r.depth > maxD) maxD = r.depth; }
        return { keys: totalK, depth: maxD };
    }, []);

    const syntaxHighlight = useCallback((json: string, isDark: boolean) => {
        const escaped = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return escaped.replace(
            /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?|\bnull\b)/g,
            (match) => {
                let cls = isDark ? 'color:#6cb6ff' : 'color:#2563eb';
                if (/^"/.test(match)) { cls = /:$/.test(match) ? (isDark ? 'color:#d2a8ff' : 'color:#7c3aed') : (isDark ? 'color:#7ee787' : 'color:#16a34a'); }
                else if (/true|false/.test(match)) { cls = isDark ? 'color:#ffa657' : 'color:#ea580c'; }
                else if (/null/.test(match)) { cls = isDark ? 'color:#8b949e' : 'color:#6b7280'; }
                return `<span style="${cls}">${match}</span>`;
            }
        );
    }, []);

    const formatJson = useCallback((value: string, sort = sortKeys) => {
        if (!value.trim()) { setFormatted(''); setHighlightedHtml(''); setError(''); setStats(null); setParsedObj(null); setTsInterface(''); return; }
        try {
            let parsed = JSON.parse(value);
            if (sort) parsed = sortKeysDeep(parsed);
            const result = JSON.stringify(parsed, null, getIndent());
            setFormatted(result);
            setHighlightedHtml(syntaxHighlight(result, dark));
            setError('');
            const s = countKeysAndDepth(parsed);
            setStats({ ...s, size: new Blob([result]).size, lines: result.split('\n').length });
            setParsedObj(parsed);
            setTsInterface(jsonToTsInterface(parsed));
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Invalid JSON';
            setError(msg); setFormatted(''); setHighlightedHtml(''); setStats(null); setParsedObj(null); setTsInterface('');
        }
    }, [getIndent, syntaxHighlight, dark, countKeysAndDepth, sortKeys]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value; setInput(val); formatJson(val);
    }, [formatJson]);

    const handleIndentChange = useCallback((val: '2' | '4' | 'tab') => {
        setIndent(val);
        if (!input.trim()) return;
        try {
            let parsed = JSON.parse(input);
            if (sortKeys) parsed = sortKeysDeep(parsed);
            const ind = val === '2' ? 2 : val === '4' ? 4 : '\t';
            const result = JSON.stringify(parsed, null, ind);
            setFormatted(result);
            setHighlightedHtml(syntaxHighlight(result, dark));
            setStats(prev => prev ? { ...prev, size: new Blob([result]).size, lines: result.split('\n').length } : null);
        } catch { /* already handled */ }
    }, [input, syntaxHighlight, dark, sortKeys]);

    const handleSortToggle = useCallback(() => {
        const newSort = !sortKeys; setSortKeys(newSort);
        if (input.trim()) formatJson(input, newSort);
    }, [sortKeys, input, formatJson]);

    const handleDarkToggle = useCallback(() => {
        const newDark = !dark; setDark(newDark);
        if (formatted) setHighlightedHtml(syntaxHighlight(formatted, newDark));
    }, [dark, formatted, syntaxHighlight]);

    const handleMinify = useCallback(() => {
        if (!input.trim()) return;
        try {
            let parsed = JSON.parse(input);
            if (sortKeys) parsed = sortKeysDeep(parsed);
            const minified = JSON.stringify(parsed);
            setFormatted(minified);
            setHighlightedHtml(syntaxHighlight(minified, dark));
            setStats(prev => prev ? { ...prev, size: new Blob([minified]).size, lines: 1 } : null);
        } catch { /* ignore */ }
    }, [input, sortKeys, syntaxHighlight, dark]);

    const handleRepair = useCallback(() => {
        const repaired = repairJson(input);
        setInput(repaired);
        formatJson(repaired);
    }, [input, formatJson]);

    const handleCopy = useCallback(async () => {
        const text = viewMode === 'ts' ? tsInterface : formatted;
        if (!text) return;
        await navigator.clipboard.writeText(text);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    }, [formatted, tsInterface, viewMode]);

    const handleDownload = useCallback(() => {
        if (!formatted) return;
        const blob = new Blob([formatted], { type: 'application/json' });
        const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'formatted.json'; a.click(); URL.revokeObjectURL(url);
    }, [formatted]);

    const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => { const text = reader.result as string; setInput(text); formatJson(text); };
        reader.readAsText(file);
    }, [formatJson]);

    const inputStats = useMemo(() => {
        if (!input.trim()) return null;
        return { bytes: new Blob([input]).size, lines: input.split('\n').length };
    }, [input]);

    return (
        <div className="p-4 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600">
                    <Braces size={22} />
                </div>
                <div>
                    <h2 className="text-base font-bold text-slate-800">JSON Formatter & Tools</h2>
                    <p className="text-xs text-slate-500">Format, minify, sort, repair JSON & generate TypeScript interfaces</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-slate-600">Indent:</span>
                {(['2', '4', 'tab'] as const).map(val => (
                    <button key={val} onClick={() => handleIndentChange(val)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${indent === val ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                        {val === 'tab' ? 'Tab' : `${val} sp`}
                    </button>
                ))}
                <div className="w-px h-5 bg-slate-200 mx-1" />
                <button onClick={handleMinify} disabled={!formatted}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 flex items-center gap-1 transition-colors">
                    <Minimize2 size={12} /> Minify
                </button>
                <button onClick={handleSortToggle}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${sortKeys ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    <ArrowDownAZ size={12} /> Sort Keys
                </button>
                <button onClick={handleRepair}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 flex items-center gap-1 transition-colors">
                    <Wrench size={12} /> Repair
                </button>
                <div className="ml-auto flex items-center gap-2">
                    <label className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center gap-1 cursor-pointer transition-colors">
                        <FileUp size={12} /> Upload
                        <input type="file" accept=".json,.txt" onChange={handleFileUpload} className="hidden" />
                    </label>
                    <button onClick={handleDarkToggle}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center gap-1 transition-colors">
                        {dark ? <Sun size={12} /> : <Moon size={12} />}
                    </button>
                    <button onClick={handleCopy} disabled={!formatted && !tsInterface}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-40 flex items-center gap-1 transition-colors">
                        <Copy size={12} /> {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button onClick={handleDownload} disabled={!formatted}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-40 flex items-center gap-1 transition-colors">
                        <Download size={12} /> Download
                    </button>
                </div>
            </div>

            {/* View Mode Tabs */}
            {formatted && (
                <div className="flex gap-1 mb-3">
                    {([
                        { v: 'raw' as const, icon: <Braces size={12} />, label: 'Raw' },
                        { v: 'tree' as const, icon: <ChevronRight size={12} />, label: 'Tree View' },
                        { v: 'ts' as const, icon: <Code size={12} />, label: 'TypeScript' },
                    ]).map(tab => (
                        <button key={tab.v} onClick={() => setViewMode(tab.v)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${viewMode === tab.v ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Main Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Input */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-slate-600">Input JSON</label>
                        {inputStats && (
                            <span className="text-[10px] text-slate-400">{inputStats.bytes.toLocaleString()} bytes · {inputStats.lines} lines</span>
                        )}
                    </div>
                    <LineNumberedTextarea value={input} onChange={handleInputChange}
                        placeholder='Paste JSON, or upload a file…'
                        className="w-full h-96 border-none rounded-none focus:ring-0 resize-none"
                        containerClassName="flex-1 focus-within:ring-violet-500/20" spellCheck={false} />
                </div>

                {/* Output */}
                <div className={`rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col ${dark ? 'bg-slate-900' : 'bg-white'}`}>
                    <div className="flex items-center justify-between mb-2">
                        <label className={`text-xs font-semibold ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {viewMode === 'ts' ? 'TypeScript Interface' : viewMode === 'tree' ? 'Tree View' : 'Formatted Output'}
                        </label>
                        {stats && viewMode === 'raw' && (
                            <span className={`text-[10px] ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{stats.size.toLocaleString()} bytes · {stats.lines} lines</span>
                        )}
                    </div>
                    {error ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
                            <span className="font-bold">Error: </span>{error}
                        </div>
                    ) : viewMode === 'tree' && parsedObj !== null ? (
                        <div className={`h-96 overflow-auto rounded-lg p-3 border ${dark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                            <JsonTreeNode value={parsedObj} />
                        </div>
                    ) : viewMode === 'ts' && tsInterface ? (
                        <pre className={`h-96 overflow-auto font-mono text-xs rounded-lg p-3 border ${dark ? 'bg-slate-800 border-slate-700 text-blue-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                            {tsInterface}
                        </pre>
                    ) : highlightedHtml ? (
                        <pre className={`h-96 overflow-auto font-mono text-xs rounded-lg p-3 border ${dark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                            dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
                    ) : (
                        <div className={`h-96 flex items-center justify-center rounded-lg border ${dark ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400'} text-xs`}>
                            Formatted JSON will appear here
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Bar */}
            {stats && (
                <div className="mt-3 bg-white rounded-xl border border-slate-200 p-3 shadow-sm flex flex-wrap items-center gap-6 text-xs">
                    <span className="font-semibold text-slate-600">Status:</span>
                    <span className="text-slate-500">Keys: <span className="font-bold text-slate-700">{stats.keys}</span></span>
                    <span className="text-slate-500">Depth: <span className="font-bold text-slate-700">{stats.depth}</span></span>
                    <span className="text-slate-500">Lines: <span className="font-bold text-slate-700">{stats.lines}</span></span>
                    <span className="text-slate-500">Size: <span className="font-bold text-slate-700">{stats.size.toLocaleString()} B</span></span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">Valid JSON</span>
                </div>
            )}
        </div>
    );
};
