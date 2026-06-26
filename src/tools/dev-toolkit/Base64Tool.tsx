import React, { useState, useRef, useEffect, useCallback } from 'react';
import { LineNumberedTextarea } from './LineNumberedTextarea';

type Mode = 'encode' | 'decode';
type InputType = 'text' | 'file';

export const Base64Tool: React.FC = () => {
    const [mode, setMode] = useState<Mode>('encode');
    const [inputType, setInputType] = useState<InputType>('text');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [outputType, setOutputType] = useState<'text' | 'binary'>('text');
    const [binaryUrl, setBinaryUrl] = useState('');
    const [urlSafe, setUrlSafe] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [autoDetectHint, setAutoDetectHint] = useState('');
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isBase64 = (str: string): boolean => {
        if (str.length < 4) return false;
        const trimmed = str.trim();
        return /^[A-Za-z0-9+/\-_]+=*$/.test(trimmed) && trimmed.length % 4 <= 1;
    };

    const toUrlSafe = (b64: string): string =>
        b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const fromUrlSafe = (b64: string): string => {
        let result = b64.replace(/-/g, '+').replace(/_/g, '/');
        while (result.length % 4 !== 0) result += '=';
        return result;
    };

    const encodeText = useCallback((text: string): string => {
        try {
            let encoded = btoa(unescape(encodeURIComponent(text)));
            if (urlSafe) encoded = toUrlSafe(encoded);
            return encoded;
        } catch {
            throw new Error('Failed to encode text to Base64.');
        }
    }, [urlSafe]);

    const decodeText = useCallback((b64: string) => {
        try {
            let decoded = b64.trim();
            // Remove data URI prefix if present
            if (decoded.includes(',')) {
                decoded = decoded.split(',')[1];
            }
            if (urlSafe) decoded = fromUrlSafe(decoded);
            const rawAtob = atob(decoded);

            try {
                // Attempt to decode as valid UTF-8 text
                const text = decodeURIComponent(escape(rawAtob));
                setOutputType('text');
                setBinaryUrl('');
                return text;
            } catch {
                // If it fails, it's binary data (e.g. an image)
                const bytes = new Uint8Array(rawAtob.length);
                for (let i = 0; i < rawAtob.length; i++) {
                    bytes[i] = rawAtob.charCodeAt(i);
                }
                const blob = new Blob([bytes]);
                const url = URL.createObjectURL(blob);
                setOutputType('binary');
                setBinaryUrl(url);
                return `[Binary data: ${bytes.length} bytes]`;
            }
        } catch {
            throw new Error('Invalid Base64 string. Cannot decode.');
        }
    }, [urlSafe]);

    const processInput = useCallback(() => {
        if (!input.trim()) {
            setOutput('');
            setError('');
            setOutputType('text');
            setBinaryUrl('');
            return;
        }
        try {
            setError('');
            if (mode === 'encode') {
                setOutput(encodeText(input));
                setOutputType('text');
                setBinaryUrl('');
            } else {
                setOutput(decodeText(input));
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred.');
            setOutput('');
            setOutputType('text');
            setBinaryUrl('');
        }
    }, [input, mode, encodeText, decodeText]);

    useEffect(() => {
        if (inputType === 'text') {
            processInput();
        }
    }, [input, mode, urlSafe, inputType, processInput]);

    useEffect(() => {
        if (input.trim() && mode === 'encode' && isBase64(input.trim())) {
            setAutoDetectHint('Input looks like Base64. Switch to Decode?');
        } else {
            setAutoDetectHint('');
        }
    }, [input, mode]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1] || result;
            setInput(`[File: ${file.name}]`);
            let out = base64;
            if (urlSafe) out = toUrlSafe(out);
            setOutput(out);
            setError('');
        };
        reader.onerror = () => {
            setError('Failed to read file.');
        };
        reader.readAsDataURL(file);
    };

    const handleDownload = () => {
        if (!binaryUrl) return;
        const a = document.createElement('a');
        a.href = binaryUrl;
        a.download = 'decoded_file';
        a.click();
    };

    const copyOutput = async () => {
        if (!output || outputType === 'binary') return;
        try {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            setError('Failed to copy to clipboard.');
        }
    };

    const inputBytes = new Blob([input]).size;
    const outputBytes = new Blob([output]).size;
    const sizeIncrease = inputBytes > 0 ? (((outputBytes - inputBytes) / inputBytes) * 100).toFixed(1) : '0';

    return (
        <div className="p-4 max-w-6xl mx-auto space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-1">Base64 Encoder / Decoder</h2>
                <p className="text-xs text-slate-500 mb-4">Encode text or files to Base64, or decode Base64 back to text.</p>

                {/* Controls Row */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    {/* Mode Toggle */}
                    <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                        <button
                            onClick={() => { setMode('encode'); setOutput(''); setError(''); }}
                            className={`px-3 py-1.5 text-xs font-bold transition-colors ${mode === 'encode' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                        >
                            Encode
                        </button>
                        <button
                            onClick={() => { setMode('decode'); setOutput(''); setError(''); }}
                            className={`px-3 py-1.5 text-xs font-bold transition-colors ${mode === 'decode' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                        >
                            Decode
                        </button>
                    </div>

                    {/* Input Type Toggle */}
                    {mode === 'encode' && (
                        <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                            <button
                                onClick={() => { setInputType('text'); setOutput(''); setError(''); setFileName(''); }}
                                className={`px-3 py-1.5 text-xs font-bold transition-colors ${inputType === 'text' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                            >
                                Text
                            </button>
                            <button
                                onClick={() => { setInputType('file'); setOutput(''); setError(''); setInput(''); }}
                                className={`px-3 py-1.5 text-xs font-bold transition-colors ${inputType === 'file' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                            >
                                File
                            </button>
                        </div>
                    )}

                    {/* URL-safe Toggle */}
                    <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={urlSafe}
                            onChange={(e) => setUrlSafe(e.target.checked)}
                            className="w-3.5 h-3.5 rounded accent-blue-600"
                        />
                        <span className="font-semibold">URL-safe Base64</span>
                    </label>
                </div>

                {/* Auto-detect hint */}
                {autoDetectHint && (
                    <div className="mb-3 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                        <span className="text-xs text-amber-700">{autoDetectHint}</span>
                        <button
                            onClick={() => { setMode('decode'); setAutoDetectHint(''); }}
                            className="px-2 py-0.5 rounded text-xs font-bold bg-amber-200 text-amber-800 hover:bg-amber-300 transition-colors"
                        >
                            Switch to Decode
                        </button>
                    </div>
                )}

                {/* Two-panel layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Input Panel */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700">
                            {mode === 'encode' ? 'Input (Plain Text / File)' : 'Input (Base64)'}
                        </label>
                        {inputType === 'file' && mode === 'encode' ? (
                            <div className="space-y-2">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors"
                                >
                                    <p className="text-sm text-slate-500 font-semibold">Click to select a file</p>
                                    <p className="text-xs text-slate-400 mt-1">Any file type supported</p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                {fileName && (
                                    <p className="text-xs text-slate-500">Selected: <span className="font-semibold">{fileName}</span></p>
                                )}
                            </div>
                        ) : (
                            <LineNumberedTextarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Paste Base64 to decode...'}
                                className="w-full min-h-[200px] border-none rounded-none focus:ring-0 resize-y"
                                containerClassName="flex-1 focus-within:ring-blue-500/20"
                                spellCheck={false}
                            />
                        )}
                    </div>

                    {/* Output Panel */}
                    <div className="space-y-2 flex flex-col items-stretch">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-700">
                                {mode === 'encode' ? 'Output (Base64)' : 'Output (Decoded)'}
                            </label>
                            {outputType === 'binary' ? (
                                <button
                                    onClick={handleDownload}
                                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                >
                                    Download File
                                </button>
                            ) : (
                                <button
                                    onClick={copyOutput}
                                    disabled={!output}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${output
                                        ? copied
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        }`}
                                >
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            )}
                        </div>
                        {outputType === 'binary' ? (
                            <div className="w-full flex-grow border border-slate-200 rounded-lg p-3 min-h-[200px] bg-slate-50 flex flex-col items-center justify-center gap-3">
                                <p className="text-sm font-semibold text-slate-600">Successfully decoded binary data.</p>
                                <p className="text-xs text-slate-400">({output})</p>
                                <img src={binaryUrl} alt="Decoded output preview" className="max-w-xs max-h-48 object-contain border border-slate-200 rounded shadow-sm bg-white" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                            </div>
                        ) : (
                            <textarea
                                value={output}
                                readOnly
                                placeholder="Output will appear here..."
                                className="w-full font-mono text-xs border border-slate-200 rounded-lg p-3 min-h-[200px] flex-grow resize-y bg-slate-50 focus:outline-none"
                                spellCheck={false}
                            />
                        )}
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        <p className="text-xs text-red-600 font-semibold">{error}</p>
                    </div>
                )}

                {/* Size Info */}
                {output && (
                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                        <span>Original: <span className="font-bold text-slate-700">{inputBytes.toLocaleString()} bytes</span></span>
                        <span>Encoded: <span className="font-bold text-slate-700">{outputBytes.toLocaleString()} bytes</span></span>
                        <span>Size change: <span className={`font-bold ${Number(sizeIncrease) >= 0 ? 'text-amber-600' : 'text-green-600'}`}>
                            {Number(sizeIncrease) >= 0 ? '+' : ''}{sizeIncrease}%
                        </span></span>
                    </div>
                )}
            </div>
        </div>
    );
};
