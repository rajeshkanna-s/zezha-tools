import React, { useState, useRef, useCallback } from 'react';
import { LineNumberedTextarea } from './LineNumberedTextarea';

type OutputTab = 'base64' | 'datauri' | 'html' | 'css';
type ToolMode = 'encode' | 'decode';

interface ImageInfo {
    fileName: string;
    type: string;
    originalSize: number;
    base64Size: number;
}

export const ImageToBase64Tool: React.FC = () => {
    const [toolMode, setToolMode] = useState<ToolMode>('encode');
    const [dataUri, setDataUri] = useState('');
    const [base64, setBase64] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
    const [activeTab, setActiveTab] = useState<OutputTab>('base64');
    const [copied, setCopied] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    // Decode mode state
    const [decodeInput, setDecodeInput] = useState('');
    const [decodedPreview, setDecodedPreview] = useState('');
    const [decodeError, setDecodeError] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'];

    const processFile = (file: File) => {
        if (!ACCEPTED_TYPES.includes(file.type)) {
            setError('Unsupported file type. Please upload PNG, JPG, GIF, WebP, or SVG.');
            return;
        }

        setError('');
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            setDataUri(result);
            const b64 = result.split(',')[1] || '';
            setBase64(b64);
            setImagePreview(result);
            setImageInfo({
                fileName: file.name,
                type: file.type,
                originalSize: file.size,
                base64Size: new Blob([b64]).size,
            });
        };
        reader.onerror = () => {
            setError('Failed to read file.');
        };
        reader.readAsDataURL(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const getHtmlTag = (): string => {
        return `<img src="${dataUri}" alt="${imageInfo?.fileName || 'image'}" />`;
    };

    const getCssValue = (): string => {
        return `background-image: url("${dataUri}");`;
    };

    const getOutputContent = (): string => {
        switch (activeTab) {
            case 'base64': return base64;
            case 'datauri': return dataUri;
            case 'html': return getHtmlTag();
            case 'css': return getCssValue();
            default: return '';
        }
    };

    const copyContent = async (content: string, label: string) => {
        if (!content) return;
        try {
            await navigator.clipboard.writeText(content);
            setCopied(label);
            setTimeout(() => setCopied(null), 2000);
        } catch { /* silently fail */ }
    };

    const sizeIncrease = imageInfo
        ? (((imageInfo.base64Size - imageInfo.originalSize) / imageInfo.originalSize) * 100).toFixed(1)
        : '0';

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    };

    const resetEncode = () => {
        setDataUri('');
        setBase64('');
        setImagePreview('');
        setImageInfo(null);
        setError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // Decode mode
    const handleDecodeInput = (val: string) => {
        setDecodeInput(val);
        setDecodeError('');
        setDecodedPreview('');

        if (!val.trim()) return;

        const trimmed = val.trim();

        // If it's a data URI
        if (trimmed.startsWith('data:image/')) {
            setDecodedPreview(trimmed);
            return;
        }

        // Try treating as raw base64 — wrap in a data URI with a generic type
        try {
            // Verify it's valid base64
            atob(trimmed.replace(/-/g, '+').replace(/_/g, '/'));
            setDecodedPreview(`data:image/png;base64,${trimmed}`);
        } catch {
            setDecodeError('Invalid Base64 string. Paste a valid Base64-encoded image or data URI.');
        }
    };

    const downloadDecodedImage = () => {
        if (!decodedPreview) return;
        const link = document.createElement('a');
        link.href = decodedPreview;
        // Extract extension from data URI
        const match = decodedPreview.match(/data:image\/(\w+)/);
        const ext = match ? match[1] : 'png';
        link.download = `decoded-image.${ext}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const tabs: { key: OutputTab; label: string }[] = [
        { key: 'base64', label: 'Base64' },
        { key: 'datauri', label: 'Data URI' },
        { key: 'html', label: 'HTML <img>' },
        { key: 'css', label: 'CSS' },
    ];

    return (
        <div className="p-4 max-w-5xl mx-auto space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-1">Image to Base64</h2>
                <p className="text-xs text-slate-500 mb-4">Convert images to Base64 strings for embedding in HTML, CSS, or data URIs.</p>

                {/* Mode Toggle */}
                <div className="flex rounded-lg border border-slate-200 overflow-hidden mb-4 w-fit">
                    <button
                        onClick={() => setToolMode('encode')}
                        className={`px-3 py-1.5 text-xs font-bold transition-colors ${toolMode === 'encode' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                    >
                        Image to Base64
                    </button>
                    <button
                        onClick={() => setToolMode('decode')}
                        className={`px-3 py-1.5 text-xs font-bold transition-colors ${toolMode === 'decode' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                    >
                        Base64 to Image
                    </button>
                </div>

                {toolMode === 'encode' && (
                    <>
                        {/* Drop Zone */}
                        {!imagePreview ? (
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onClick={() => fileInputRef.current?.click()}
                                className={`w-full border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${isDragging
                                    ? 'border-blue-400 bg-blue-50'
                                    : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50/30'
                                    }`}
                            >
                                <div className="text-3xl text-slate-300 mb-2">&#128247;</div>
                                <p className="text-sm text-slate-500 font-semibold">
                                    {isDragging ? 'Drop your image here' : 'Drag & drop an image here'}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">or click to browse</p>
                                <p className="text-xs text-slate-400 mt-2">PNG, JPG, GIF, WebP, SVG</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Image Preview + Info */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="bg-[repeating-conic-gradient(#e2e8f0_0%_25%,transparent_0%_50%)] bg-[length:16px_16px] rounded-lg border border-slate-200 p-2 flex items-center justify-center min-h-[120px] max-h-[200px] w-full sm:w-48 shrink-0 overflow-hidden">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="max-w-full max-h-[180px] object-contain"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        {imageInfo && (
                                            <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 space-y-1.5">
                                                <div className="text-xs">
                                                    <span className="font-bold text-slate-600">Filename: </span>
                                                    <span className="text-slate-700">{imageInfo.fileName}</span>
                                                </div>
                                                <div className="text-xs">
                                                    <span className="font-bold text-slate-600">Type: </span>
                                                    <span className="text-slate-700">{imageInfo.type}</span>
                                                </div>
                                                <div className="text-xs">
                                                    <span className="font-bold text-slate-600">Original Size: </span>
                                                    <span className="text-slate-700">{formatBytes(imageInfo.originalSize)}</span>
                                                </div>
                                                <div className="text-xs">
                                                    <span className="font-bold text-slate-600">Base64 Size: </span>
                                                    <span className="text-slate-700">{formatBytes(imageInfo.base64Size)}</span>
                                                </div>
                                                <div className="text-xs">
                                                    <span className="font-bold text-slate-600">Size Increase: </span>
                                                    <span className="text-amber-600 font-bold">+{sizeIncrease}%</span>
                                                </div>
                                            </div>
                                        )}
                                        <button
                                            onClick={resetEncode}
                                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                                        >
                                            Choose Different Image
                                        </button>
                                    </div>
                                </div>

                                {/* Output Tabs */}
                                <div>
                                    <div className="flex border-b border-slate-200">
                                        {tabs.map((tab) => (
                                            <button
                                                key={tab.key}
                                                onClick={() => setActiveTab(tab.key)}
                                                className={`px-4 py-2 text-xs font-bold transition-colors border-b-2 -mb-px ${activeTab === tab.key
                                                    ? 'border-blue-600 text-blue-600'
                                                    : 'border-transparent text-slate-500 hover:text-slate-700'
                                                    }`}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="mt-3 space-y-2">
                                        <div className="flex items-center justify-end">
                                            <button
                                                onClick={() => copyContent(getOutputContent(), activeTab)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${copied === activeTab ? 'bg-green-100 text-green-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                            >
                                                {copied === activeTab ? 'Copied!' : 'Copy'}
                                            </button>
                                        </div>
                                        <textarea
                                            value={getOutputContent()}
                                            readOnly
                                            className="w-full font-mono text-xs border border-slate-200 rounded-lg p-3 min-h-[120px] resize-y bg-slate-50 focus:outline-none"
                                            spellCheck={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </>
                )}

                {/* Decode Mode */}
                {toolMode === 'decode' && (
                    <div className="space-y-4">
                        <div className="space-y-2 flex flex-col">
                            <label className="text-xs font-bold text-slate-700">Paste Base64 or Data URI</label>
                            <LineNumberedTextarea
                                value={decodeInput}
                                onChange={(e) => handleDecodeInput(e.target.value)}
                                placeholder="Paste a Base64 string or data:image/... URI here..."
                                className="w-full min-h-[100px] border-none rounded-none focus:ring-0 resize-y"
                                containerClassName="flex-1 focus-within:ring-blue-500/20"
                                spellCheck={false}
                            />
                        </div>

                        {decodeError && (
                            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                <p className="text-xs text-red-600 font-semibold">{decodeError}</p>
                            </div>
                        )}

                        {decodedPreview && (
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-700">Image Preview</label>
                                <div className="bg-[repeating-conic-gradient(#e2e8f0_0%_25%,transparent_0%_50%)] bg-[length:16px_16px] rounded-lg border border-slate-200 p-4 flex items-center justify-center">
                                    <img
                                        src={decodedPreview}
                                        alt="Decoded preview"
                                        className="max-w-full max-h-[300px] object-contain"
                                        onError={() => {
                                            setDecodeError('Failed to render image. The Base64 data may be invalid or corrupted.');
                                            setDecodedPreview('');
                                        }}
                                    />
                                </div>
                                <button
                                    onClick={downloadDecodedImage}
                                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                >
                                    Download Image
                                </button>
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
