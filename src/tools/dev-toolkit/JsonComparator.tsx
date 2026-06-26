import React, { useCallback, useMemo, useState } from 'react';
import {
    AlertTriangle,
    CheckCircle2,
    ClipboardList,
    Copy,
    Eye,
    EyeOff,
    GitCompareArrows,
    RotateCcw,
} from 'lucide-react';
import { LineNumberedTextarea } from './LineNumberedTextarea';

type DiffStatus = 'added' | 'removed' | 'changed' | 'type' | 'equal';
type PathSegment = string | number;

interface DiffRow {
    id: string;
    path: string;
    status: DiffStatus;
    valueA?: unknown;
    valueB?: unknown;
    kindA?: string;
    kindB?: string;
}

interface DiffStats {
    added: number;
    removed: number;
    changed: number;
    typeChanged: number;
    unchanged: number;
    total: number;
}

const SAMPLE_A = JSON.stringify({
    customer: {
        id: 1024,
        name: 'Asha Traders',
        active: true,
        gstin: '29ABCDE1234F1Z5',
    },
    plan: 'starter',
    limits: {
        users: 3,
        exports: 25,
    },
    tags: ['retail', 'gst'],
}, null, 2);

const SAMPLE_B = JSON.stringify({
    customer: {
        id: 1024,
        name: 'Asha Traders Pvt Ltd',
        active: true,
        phone: '+91-90000-00000',
    },
    plan: 'pro',
    limits: {
        users: 10,
        exports: 100,
    },
    tags: ['retail', 'gst', 'priority'],
}, null, 2);

function valueKind(value: unknown): string {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function formatPath(segments: PathSegment[]): string {
    if (segments.length === 0) return '$';
    return segments.reduce((path, segment) => {
        if (typeof segment === 'number') return `${path}[${segment}]`;
        if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(segment)) return `${path}.${segment}`;
        return `${path}[${JSON.stringify(segment)}]`;
    }, '$');
}

function rowId(path: string, status: DiffStatus): string {
    return `${status}:${path}`;
}

function addRow(rows: DiffRow[], segments: PathSegment[], status: DiffStatus, valueA?: unknown, valueB?: unknown) {
    const path = formatPath(segments);
    rows.push({
        id: rowId(path, status),
        path,
        status,
        valueA,
        valueB,
        kindA: valueA === undefined ? undefined : valueKind(valueA),
        kindB: valueB === undefined ? undefined : valueKind(valueB),
    });
}

function compareJsonValues(valueA: unknown, valueB: unknown, segments: PathSegment[], rows: DiffRow[]) {
    const kindA = valueKind(valueA);
    const kindB = valueKind(valueB);

    if (kindA !== kindB) {
        addRow(rows, segments, 'type', valueA, valueB);
        return;
    }

    if (isRecord(valueA) && isRecord(valueB)) {
        const keys = Array.from(new Set([...Object.keys(valueA), ...Object.keys(valueB)])).sort();
        if (keys.length === 0) {
            addRow(rows, segments, 'equal', valueA, valueB);
            return;
        }

        for (const key of keys) {
            const hasA = Object.prototype.hasOwnProperty.call(valueA, key);
            const hasB = Object.prototype.hasOwnProperty.call(valueB, key);
            if (!hasA) {
                addRow(rows, [...segments, key], 'added', undefined, valueB[key]);
            } else if (!hasB) {
                addRow(rows, [...segments, key], 'removed', valueA[key], undefined);
            } else {
                compareJsonValues(valueA[key], valueB[key], [...segments, key], rows);
            }
        }
        return;
    }

    if (Array.isArray(valueA) && Array.isArray(valueB)) {
        if (valueA.length === 0 && valueB.length === 0) {
            addRow(rows, segments, 'equal', valueA, valueB);
            return;
        }

        const maxLength = Math.max(valueA.length, valueB.length);
        for (let index = 0; index < maxLength; index++) {
            if (index >= valueA.length) {
                addRow(rows, [...segments, index], 'added', undefined, valueB[index]);
            } else if (index >= valueB.length) {
                addRow(rows, [...segments, index], 'removed', valueA[index], undefined);
            } else {
                compareJsonValues(valueA[index], valueB[index], [...segments, index], rows);
            }
        }
        return;
    }

    addRow(rows, segments, Object.is(valueA, valueB) ? 'equal' : 'changed', valueA, valueB);
}

function semanticDiff(valueA: unknown, valueB: unknown): DiffRow[] {
    const rows: DiffRow[] = [];
    compareJsonValues(valueA, valueB, [], rows);
    return rows;
}

function summarizeRows(rows: DiffRow[]): DiffStats {
    return rows.reduce<DiffStats>((stats, row) => {
        stats.total++;
        if (row.status === 'added') stats.added++;
        else if (row.status === 'removed') stats.removed++;
        else if (row.status === 'changed') stats.changed++;
        else if (row.status === 'type') stats.typeChanged++;
        else stats.unchanged++;
        return stats;
    }, { added: 0, removed: 0, changed: 0, typeChanged: 0, unchanged: 0, total: 0 });
}

function valuePreview(value: unknown): string {
    if (value === undefined) return 'Missing';
    if (typeof value === 'string') return JSON.stringify(value);
    const text = JSON.stringify(value, null, 2);
    return text === undefined ? String(value) : text;
}

function parseErrorMessage(label: string, raw: string, error: unknown): string {
    const message = error instanceof Error ? error.message : 'Invalid JSON';
    const positionMatch = message.match(/position\s+(\d+)/i);
    if (!positionMatch) return `${label} is invalid: ${message}`;

    const position = Number(positionMatch[1]);
    const before = raw.slice(0, position);
    const line = before.split('\n').length;
    const lastBreak = before.lastIndexOf('\n');
    const column = lastBreak === -1 ? position + 1 : position - lastBreak;
    return `${label} is invalid at line ${line}, column ${column}: ${message}`;
}

function statusLabel(status: DiffStatus): string {
    switch (status) {
        case 'added': return 'Added';
        case 'removed': return 'Removed';
        case 'changed': return 'Changed';
        case 'type': return 'Type changed';
        default: return 'Same';
    }
}

function statusClasses(status: DiffStatus): string {
    switch (status) {
        case 'added': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        case 'removed': return 'bg-red-50 text-red-700 border-red-200';
        case 'changed': return 'bg-amber-50 text-amber-700 border-amber-200';
        case 'type': return 'bg-violet-50 text-violet-700 border-violet-200';
        default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
}

function rowClasses(status: DiffStatus): string {
    switch (status) {
        case 'added': return 'bg-emerald-50/45';
        case 'removed': return 'bg-red-50/45';
        case 'changed': return 'bg-amber-50/55';
        case 'type': return 'bg-violet-50/50';
        default: return 'bg-white';
    }
}

export const JsonComparator: React.FC = () => {
    const [inputA, setInputA] = useState('');
    const [inputB, setInputB] = useState('');
    const [diffRows, setDiffRows] = useState<DiffRow[]>([]);
    const [error, setError] = useState('');
    const [compared, setCompared] = useState(false);
    const [showUnchanged, setShowUnchanged] = useState(false);
    const [copied, setCopied] = useState(false);

    const parseBoth = useCallback(() => {
        if (!inputA.trim() || !inputB.trim()) {
            throw new Error('Please provide JSON in both panels.');
        }

        let parsedA: unknown;
        let parsedB: unknown;
        try {
            parsedA = JSON.parse(inputA);
        } catch (parseError) {
            throw new Error(parseErrorMessage('JSON A', inputA, parseError));
        }

        try {
            parsedB = JSON.parse(inputB);
        } catch (parseError) {
            throw new Error(parseErrorMessage('JSON B', inputB, parseError));
        }

        return { parsedA, parsedB };
    }, [inputA, inputB]);

    const handleCompare = useCallback(() => {
        try {
            const { parsedA, parsedB } = parseBoth();
            const rows = semanticDiff(parsedA, parsedB);
            setDiffRows(rows);
            setError('');
            setCompared(true);
        } catch (compareError) {
            setError(compareError instanceof Error ? compareError.message : 'Unable to compare JSON.');
            setDiffRows([]);
            setCompared(false);
        }
    }, [parseBoth]);

    const handleFormatInputs = useCallback(() => {
        try {
            const { parsedA, parsedB } = parseBoth();
            setInputA(JSON.stringify(parsedA, null, 2));
            setInputB(JSON.stringify(parsedB, null, 2));
            setError('');
        } catch (formatError) {
            setError(formatError instanceof Error ? formatError.message : 'Unable to format JSON.');
        }
    }, [parseBoth]);

    const handleLoadSample = useCallback(() => {
        setInputA(SAMPLE_A);
        setInputB(SAMPLE_B);
        setDiffRows([]);
        setError('');
        setCompared(false);
    }, []);

    const handleClear = useCallback(() => {
        setInputA('');
        setInputB('');
        setDiffRows([]);
        setError('');
        setCompared(false);
    }, []);

    const stats = useMemo(() => summarizeRows(diffRows), [diffRows]);
    const differenceCount = stats.added + stats.removed + stats.changed + stats.typeChanged;
    const matchPercent = stats.total === 0 ? 100 : Math.round((stats.unchanged / stats.total) * 100);

    const visibleRows = useMemo(() => {
        return showUnchanged ? diffRows : diffRows.filter(row => row.status !== 'equal');
    }, [diffRows, showUnchanged]);

    const reportText = useMemo(() => {
        if (!compared || error) return '';
        if (differenceCount === 0) return 'JSON Comparator Report\nNo differences found.';
        return [
            'JSON Comparator Report',
            `Added: ${stats.added}`,
            `Removed: ${stats.removed}`,
            `Changed: ${stats.changed}`,
            `Type changed: ${stats.typeChanged}`,
            '',
            ...diffRows
                .filter(row => row.status !== 'equal')
                .map(row => {
                    const left = row.valueA === undefined ? 'Missing' : valuePreview(row.valueA).replace(/\s+/g, ' ');
                    const right = row.valueB === undefined ? 'Missing' : valuePreview(row.valueB).replace(/\s+/g, ' ');
                    return `${statusLabel(row.status)} ${row.path}: ${left} -> ${right}`;
                }),
        ].join('\n');
    }, [compared, differenceCount, diffRows, error, stats]);

    const handleCopyReport = useCallback(async () => {
        if (!reportText) return;
        await navigator.clipboard.writeText(reportText);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }, [reportText]);

    return (
        <div className="p-4 max-w-7xl mx-auto">
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                        <GitCompareArrows size={22} />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-800">JSON Comparator</h2>
                        <p className="text-xs text-slate-500">Semantic path comparison with readable value changes</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        onClick={handleLoadSample}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-1"
                    >
                        <ClipboardList size={13} />
                        Sample
                    </button>
                    <button
                        onClick={handleClear}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-1"
                    >
                        <RotateCcw size={13} />
                        Clear
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col min-w-0">
                    <label className="text-xs font-semibold text-slate-600 mb-2 block">JSON A (Original)</label>
                    <LineNumberedTextarea
                        value={inputA}
                        onChange={e => setInputA(e.target.value)}
                        placeholder="Paste original JSON..."
                        className="w-full min-h-[260px] border-none rounded-none focus:ring-0 resize-y"
                        containerClassName="flex-1 focus-within:ring-cyan-500/20"
                        spellCheck={false}
                    />
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col min-w-0">
                    <label className="text-xs font-semibold text-slate-600 mb-2 block">JSON B (Modified)</label>
                    <LineNumberedTextarea
                        value={inputB}
                        onChange={e => setInputB(e.target.value)}
                        placeholder="Paste modified JSON..."
                        className="w-full min-h-[260px] border-none rounded-none focus:ring-0 resize-y"
                        containerClassName="flex-1 focus-within:ring-cyan-500/20"
                        spellCheck={false}
                    />
                </div>
            </div>

            <div className="flex justify-center gap-2 mb-3 flex-wrap">
                <button
                    onClick={handleCompare}
                    className="px-6 py-2 rounded-lg text-xs font-bold bg-cyan-600 text-white hover:bg-cyan-700 transition-colors flex items-center gap-2 shadow-sm"
                >
                    <GitCompareArrows size={14} />
                    Compare JSON
                </button>
                <button
                    onClick={handleFormatInputs}
                    disabled={!inputA.trim() || !inputB.trim()}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 transition-colors"
                >
                    Format Both
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3 text-xs text-red-700 flex items-start gap-2">
                    <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {compared && !error && (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Result</div>
                            <div className={`mt-1 text-sm font-black ${differenceCount === 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                                {differenceCount === 0 ? 'Identical' : `${differenceCount} diff${differenceCount === 1 ? '' : 's'}`}
                            </div>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Match</div>
                            <div className="mt-1 text-sm font-black text-slate-800">{matchPercent}%</div>
                        </div>
                        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-3">
                            <div className="text-[10px] font-bold text-emerald-500 uppercase">Added</div>
                            <div className="mt-1 text-sm font-black text-emerald-700">{stats.added}</div>
                        </div>
                        <div className="bg-red-50 rounded-xl border border-red-200 p-3">
                            <div className="text-[10px] font-bold text-red-500 uppercase">Removed</div>
                            <div className="mt-1 text-sm font-black text-red-700">{stats.removed}</div>
                        </div>
                        <div className="bg-amber-50 rounded-xl border border-amber-200 p-3">
                            <div className="text-[10px] font-bold text-amber-500 uppercase">Changed</div>
                            <div className="mt-1 text-sm font-black text-amber-700">{stats.changed}</div>
                        </div>
                        <div className="bg-violet-50 rounded-xl border border-violet-200 p-3">
                            <div className="text-[10px] font-bold text-violet-500 uppercase">Types</div>
                            <div className="mt-1 text-sm font-black text-violet-700">{stats.typeChanged}</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between gap-3 p-3 border-b border-slate-200 bg-slate-50 flex-wrap">
                            <div className="flex items-center gap-2">
                                {differenceCount === 0 ? (
                                    <CheckCircle2 size={16} className="text-emerald-600" />
                                ) : (
                                    <GitCompareArrows size={16} className="text-cyan-600" />
                                )}
                                <span className="text-xs font-bold text-slate-700">
                                    {differenceCount === 0 ? 'No differences found' : 'Differences by JSON path'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowUnchanged(prev => !prev)}
                                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1"
                                >
                                    {showUnchanged ? <EyeOff size={12} /> : <Eye size={12} />}
                                    {showUnchanged ? 'Hide same' : 'Show same'}
                                </button>
                                <button
                                    onClick={handleCopyReport}
                                    disabled={!reportText}
                                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors flex items-center gap-1"
                                >
                                    <Copy size={12} />
                                    {copied ? 'Copied' : 'Copy report'}
                                </button>
                            </div>
                        </div>

                        {visibleRows.length === 0 ? (
                            <div className="p-8 text-center text-xs text-slate-500">
                                No changed paths to display.
                            </div>
                        ) : (
                            <div className="overflow-auto max-h-[620px]">
                                <table className="w-full text-xs border-collapse">
                                    <thead className="sticky top-0 z-10 bg-white shadow-sm">
                                        <tr className="text-left text-slate-500">
                                            <th className="p-2 border-b border-slate-200 w-[120px]">Status</th>
                                            <th className="p-2 border-b border-slate-200 min-w-[180px]">Path</th>
                                            <th className="p-2 border-b border-slate-200 min-w-[260px]">JSON A</th>
                                            <th className="p-2 border-b border-slate-200 min-w-[260px]">JSON B</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {visibleRows.map(row => (
                                            <tr key={row.id} className={`${rowClasses(row.status)} border-b border-slate-100 align-top`}>
                                                <td className="p-2">
                                                    <span className={`inline-flex px-2 py-1 rounded-full border text-[10px] font-black ${statusClasses(row.status)}`}>
                                                        {statusLabel(row.status)}
                                                    </span>
                                                </td>
                                                <td className="p-2 font-mono text-slate-700 break-all">
                                                    {row.path}
                                                    {row.status === 'type' && (
                                                        <div className="text-[10px] text-violet-600 mt-1">
                                                            {row.kindA} to {row.kindB}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-2">
                                                    <pre className="whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-slate-700 bg-white/70 border border-white/80 rounded-lg p-2 max-h-40 overflow-auto">{valuePreview(row.valueA)}</pre>
                                                </td>
                                                <td className="p-2">
                                                    <pre className="whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-slate-700 bg-white/70 border border-white/80 rounded-lg p-2 max-h-40 overflow-auto">{valuePreview(row.valueB)}</pre>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
