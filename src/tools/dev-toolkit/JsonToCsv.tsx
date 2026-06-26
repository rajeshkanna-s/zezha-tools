import React, { useState, useCallback } from 'react';
import { Table, Copy, Download } from 'lucide-react';
import { LineNumberedTextarea } from './LineNumberedTextarea';

export const JsonToCsv: React.FC = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [delimiter, setDelimiter] = useState<',' | ';' | '\t'>(',');
    const [headers, setHeaders] = useState<string[]>([]);
    const [previewRows, setPreviewRows] = useState<string[][]>([]);
    const [rowCount, setRowCount] = useState(0);
    const [colCount, setColCount] = useState(0);

    const flattenObject = useCallback((obj: unknown, prefix = ''): Record<string, string> => {
        const result: Record<string, string> = {};

        if (obj === null || obj === undefined) {
            if (prefix) result[prefix] = '';
            return result;
        }

        if (typeof obj !== 'object') {
            if (prefix) result[prefix] = String(obj);
            return result;
        }

        if (Array.isArray(obj)) {
            if (prefix) result[prefix] = JSON.stringify(obj);
            return result;
        }

        const record = obj as Record<string, unknown>;
        for (const key of Object.keys(record)) {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            const val = record[key];

            if (val === null || val === undefined) {
                result[fullKey] = '';
            } else if (Array.isArray(val)) {
                result[fullKey] = JSON.stringify(val);
            } else if (typeof val === 'object') {
                const nested = flattenObject(val, fullKey);
                Object.assign(result, nested);
            } else {
                result[fullKey] = String(val);
            }
        }
        return result;
    }, []);

    const escapeCsvField = useCallback((field: string, delim: string) => {
        if (field.includes(delim) || field.includes('"') || field.includes('\n')) {
            return `"${field.replace(/"/g, '""')}"`;
        }
        return field;
    }, []);

    const convert = useCallback((value: string, delim: ',' | ';' | '\t') => {
        if (!value.trim()) {
            setOutput('');
            setError('');
            setHeaders([]);
            setPreviewRows([]);
            setRowCount(0);
            setColCount(0);
            return;
        }

        try {
            const parsed = JSON.parse(value);
            let arr: unknown[];

            if (Array.isArray(parsed)) {
                arr = parsed;
            } else if (typeof parsed === 'object' && parsed !== null) {
                arr = [parsed];
            } else {
                setError('JSON must be an array of objects or a single object.');
                setOutput('');
                return;
            }

            if (arr.length === 0) {
                setError('JSON array is empty.');
                setOutput('');
                return;
            }

            const flatRows = arr.map(item => flattenObject(item));
            const headerSet = new Set<string>();
            for (const row of flatRows) {
                for (const key of Object.keys(row)) {
                    headerSet.add(key);
                }
            }
            const hdrs = Array.from(headerSet);

            const csvRows: string[] = [];
            csvRows.push(hdrs.map(h => escapeCsvField(h, delim)).join(delim));

            const preview: string[][] = [];

            for (let i = 0; i < flatRows.length; i++) {
                const row = flatRows[i];
                const values = hdrs.map(h => escapeCsvField(row[h] ?? '', delim));
                csvRows.push(values.join(delim));
                if (i < 10) {
                    preview.push(hdrs.map(h => row[h] ?? ''));
                }
            }

            const csvOutput = csvRows.join('\n');
            setOutput(csvOutput);
            setError('');
            setHeaders(hdrs);
            setPreviewRows(preview);
            setRowCount(flatRows.length);
            setColCount(hdrs.length);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Invalid JSON';
            setError(msg);
            setOutput('');
            setHeaders([]);
            setPreviewRows([]);
            setRowCount(0);
            setColCount(0);
        }
    }, [flattenObject, escapeCsvField]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setInput(val);
        convert(val, delimiter);
    }, [convert, delimiter]);

    const handleDelimiterChange = useCallback((d: ',' | ';' | '\t') => {
        setDelimiter(d);
        convert(input, d);
    }, [convert, input]);

    const handleCopy = useCallback(async () => {
        if (!output) return;
        await navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [output]);

    const handleDownload = useCallback(() => {
        if (!output) return;
        const blob = new Blob([output], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'output.csv';
        a.click();
        URL.revokeObjectURL(url);
    }, [output]);

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                    <Table size={22} />
                </div>
                <div>
                    <h2 className="text-base font-bold text-slate-800">JSON to CSV</h2>
                    <p className="text-xs text-slate-500">Convert JSON arrays to CSV with auto-detected headers</p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-slate-600">Delimiter:</span>
                {([{ val: ',', label: 'Comma' }, { val: ';', label: 'Semicolon' }, { val: '\t', label: 'Tab' }] as const).map(d => (
                    <button
                        key={d.val}
                        onClick={() => handleDelimiterChange(d.val)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${delimiter === d.val ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        {d.label}
                    </button>
                ))}
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
                        Download .csv
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col">
                    <label className="text-xs font-semibold text-slate-600 mb-2 block">Input JSON Array</label>
                    <LineNumberedTextarea
                        value={input}
                        onChange={handleInputChange}
                        placeholder='[{"name":"Alice","age":30},{"name":"Bob","age":25}]'
                        className="w-full h-64 border-none rounded-none focus:ring-0 resize-none"
                        containerClassName="flex-1 focus-within:ring-teal-500/20"
                        spellCheck={false}
                    />
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <label className="text-xs font-semibold text-slate-600 mb-2 block">CSV Output</label>
                    {error ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
                            <span className="font-bold">Error: </span>{error}
                        </div>
                    ) : output ? (
                        <textarea
                            value={output}
                            readOnly
                            className="w-full h-64 font-mono text-xs border border-slate-200 rounded-lg p-3 bg-slate-50 resize-none focus:outline-none"
                        />
                    ) : (
                        <div className="h-64 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400 text-xs">
                            CSV output will appear here
                        </div>
                    )}
                </div>
            </div>

            {rowCount > 0 && (
                <div className="flex items-center gap-4 mb-3 text-xs">
                    <span className="text-slate-500">Rows: <span className="font-bold text-slate-700">{rowCount}</span></span>
                    <span className="text-slate-500">Columns: <span className="font-bold text-slate-700">{colCount}</span></span>
                </div>
            )}

            {headers.length > 0 && previewRows.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-700 mb-3">Preview (first {Math.min(previewRows.length, 10)} rows)</h4>
                    <div className="overflow-auto max-h-64">
                        <table className="w-full text-xs border-collapse">
                            <thead>
                                <tr className="bg-slate-100">
                                    {headers.map((h, i) => (
                                        <th key={i} className="text-left px-3 py-2 font-bold text-slate-700 border border-slate-200 whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {previewRows.map((row, ri) => (
                                    <tr key={ri} className="hover:bg-slate-50">
                                        {row.map((cell, ci) => (
                                            <td key={ci} className="px-3 py-1.5 border border-slate-200 text-slate-600 font-mono truncate max-w-48">{cell}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
