import React, { useState, useCallback } from 'react';
import { Minimize2, Copy, Download } from 'lucide-react';
import { LineNumberedTextarea } from './LineNumberedTextarea';

export const JsonMinifier: React.FC = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [sizeInfo, setSizeInfo] = useState<{
        originalBytes: number;
        minifiedBytes: number;
        percentSaved: number;
        originalChars: number;
        minifiedChars: number;
    } | null>(null);

    const minify = useCallback((value: string) => {
        if (!value.trim()) {
            setOutput('');
            setError('');
            setSizeInfo(null);
            return;
        }
        try {
            const parsed = JSON.parse(value);
            const minified = JSON.stringify(parsed);
            setOutput(minified);
            setError('');

            const originalBytes = new Blob([value]).size;
            const minifiedBytes = new Blob([minified]).size;
            const percentSaved = originalBytes > 0
                ? Math.round(((originalBytes - minifiedBytes) / originalBytes) * 10000) / 100
                : 0;

            setSizeInfo({
                originalBytes,
                minifiedBytes,
                percentSaved,
                originalChars: value.length,
                minifiedChars: minified.length,
            });
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Invalid JSON';
            setError(msg);
            setOutput('');
            setSizeInfo(null);
        }
    }, []);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setInput(val);
        minify(val);
    }, [minify]);

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
        a.download = 'minified.json';
        a.click();
        URL.revokeObjectURL(url);
    }, [output]);

    const formatBytes = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                    <Minimize2 size={22} />
                </div>
                <div>
                    <h2 className="text-base font-bold text-slate-800">JSON Minifier</h2>
                    <p className="text-xs text-slate-500">Minify JSON by removing all whitespace</p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-3 justify-end">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col">
                    <label className="text-xs font-semibold text-slate-600 mb-2 block">Input (Formatted JSON)</label>
                    <LineNumberedTextarea
                        value={input}
                        onChange={handleInputChange}
                        placeholder='Paste your formatted JSON here...'
                        className="w-full h-80 border-none rounded-none focus:ring-0 resize-none"
                        containerClassName="flex-1 focus-within:ring-orange-500/20"
                        spellCheck={false}
                    />
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <label className="text-xs font-semibold text-slate-600 mb-2 block">Output (Minified)</label>
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
                            Minified JSON will appear here
                        </div>
                    )}
                </div>
            </div>

            {sizeInfo && (
                <div className="mt-3 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-700 mb-3">Size Comparison</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <div className="bg-slate-50 rounded-lg p-3 text-center">
                            <div className="text-xs text-slate-500 mb-1">Original Size</div>
                            <div className="text-sm font-bold text-slate-800">{formatBytes(sizeInfo.originalBytes)}</div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3 text-center">
                            <div className="text-xs text-slate-500 mb-1">Minified Size</div>
                            <div className="text-sm font-bold text-slate-800">{formatBytes(sizeInfo.minifiedBytes)}</div>
                        </div>
                        <div className="bg-emerald-50 rounded-lg p-3 text-center">
                            <div className="text-xs text-emerald-600 mb-1">Saved</div>
                            <div className="text-sm font-bold text-emerald-700">{sizeInfo.percentSaved}%</div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3 text-center">
                            <div className="text-xs text-slate-500 mb-1">Original Chars</div>
                            <div className="text-sm font-bold text-slate-800">{sizeInfo.originalChars.toLocaleString()}</div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3 text-center">
                            <div className="text-xs text-slate-500 mb-1">Minified Chars</div>
                            <div className="text-sm font-bold text-slate-800">{sizeInfo.minifiedChars.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
