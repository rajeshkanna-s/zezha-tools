import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader2, ScanText, FileText, X, Copy, Check, AlertCircle, Shield } from 'lucide-react';

interface OcrResult {
    text: string;
    confidence: number;
    wordCount: number;
    originalFile: string;
}

export const ImageToText: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState<OcrResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const onDrop = useCallback((accepted: File[]) => {
        if (accepted[0]) {
            setFile(accepted[0]);
            setPreview(URL.createObjectURL(accepted[0]));
            setResult(null);
            setError(null);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/webp': ['.webp'],
            'image/bmp': ['.bmp'],
            'image/tiff': ['.tiff', '.tif'],
        },
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024,
    });

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const removeFile = () => {
        if (preview) URL.revokeObjectURL(preview);
        setFile(null);
        setPreview(null);
        setResult(null);
        setError(null);
    };

    const extractText = async () => {
        if (!file) return;
        setLoading(true);
        setProgress(0);
        setError(null);
        setResult(null);

        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) return prev;
                return prev + Math.random() * 15;
            });
        }, 500);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const res = await fetch('/api/ocr', {
                method: 'POST',
                body: formData,
            });

            clearInterval(progressInterval);
            setProgress(100);

            if (!res.ok) {
                const data = await res.json().catch(() => ({ error: 'Server error' }));
                throw new Error(data.error || `Server returned ${res.status}`);
            }

            const data: OcrResult = await res.json();

            if (!data.text || data.text.length === 0) {
                setError('No text could be extracted from this image. Try a clearer image with visible text.');
            } else {
                setResult(data);
            }
        } catch (err: any) {
            console.error('OCR Error:', err);
            setError(err.message || 'Failed to extract text. Make sure the OCR server is running.');
        } finally {
            clearInterval(progressInterval);
            setLoading(false);
        }
    };

    const copyText = async () => {
        if (!result?.text) return;
        try {
            await navigator.clipboard.writeText(result.text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const ta = document.createElement('textarea');
            ta.value = result.text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
        if (confidence >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    return (
        <div className="max-w-4xl mx-auto px-4 pb-12">
            {/* ── Header ──────────────────────── */}
            <div className="flex items-center gap-4 mb-8 mt-2">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-cyan-200 hover:scale-105 transition-transform">
                    <ScanText size={32} />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">Image to Text</h2>
                    <p className="text-base text-slate-500">Extract text from images using Tesseract OCR</p>
                </div>
            </div>

            {/* ── Dropzone ──────────────────────── */}
            <div
                {...getRootProps()}
                className={`relative group border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 mb-6 ${isDragActive ? 'border-cyan-400 bg-cyan-50 scale-[1.01]' : 'border-slate-300 hover:border-cyan-400 hover:bg-cyan-50/30 bg-gradient-to-b from-slate-50 to-white'}`}
                style={{ outline: 'none' }}
            >
                <input {...getInputProps()} />
                <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${isDragActive ? 'bg-cyan-100 text-cyan-600 scale-110' : 'bg-slate-100 text-slate-400 group-hover:bg-cyan-100 group-hover:text-cyan-500'}`}>
                    <Upload size={28} />
                </div>
                <p className="text-sm font-bold text-slate-900 mb-1">Drop an image here</p>
                <p className="text-xs text-slate-400 mb-3">or click to browse</p>
                <div className="flex justify-center gap-2 flex-wrap">
                    {['JPG', 'PNG', 'WebP', 'BMP', 'TIFF'].map(ext => (
                        <span key={ext} className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{ext}</span>
                    ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-2">Max 10 MB</p>
            </div>

            {/* ── File Card ──────────────────────── */}
            {file && (
                <div className="flex items-center justify-between border border-slate-200 rounded-xl p-3.5 bg-white shadow-sm mb-6" style={{ borderLeft: '4px solid #06b6d4' }}>
                    <div className="flex items-center gap-3">
                        {preview && (
                            <img src={preview} alt="Preview" className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                        )}
                        <div>
                            <p className="text-sm font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
                            <p className="text-xs text-slate-400">{formatSize(file.size)}</p>
                        </div>
                    </div>
                    <button onClick={removeFile} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* ── Side-by-side: Preview + Extracted Text ──────────────────────── */}
            {file && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Image Preview */}
                    <div className="border border-slate-200 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Image Preview</p>
                        </div>
                        <div className="p-4 flex items-center justify-center min-h-[250px] bg-slate-50/50">
                            {preview && (
                                <img src={preview} alt="Uploaded" className="max-w-full max-h-[400px] rounded-lg object-contain shadow-sm" />
                            )}
                        </div>
                    </div>

                    {/* Extracted Text */}
                    <div className="border border-slate-200 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden flex flex-col">
                        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Extracted Text</p>
                            {result && (
                                <button
                                    onClick={copyText}
                                    className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${copied ? 'text-emerald-600 bg-emerald-50' : 'text-cyan-600 hover:bg-cyan-50'}`}
                                >
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            )}
                        </div>
                        <div className="p-4 flex-1 min-h-[250px]">
                            {result ? (
                                <pre className="text-sm text-slate-800 whitespace-pre-wrap font-sans leading-relaxed max-h-[400px] overflow-y-auto">
                                    {result.text}
                                </pre>
                            ) : error ? (
                                <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                                        <AlertCircle size={24} className="text-red-400" />
                                    </div>
                                    <p className="text-sm text-red-600 font-medium max-w-xs">{error}</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                                        <FileText size={24} />
                                    </div>
                                    <p className="text-sm font-medium">Extracted text will appear here</p>
                                </div>
                            )}
                        </div>

                        {result && (
                            <div className="px-4 py-3 border-t border-slate-100 flex items-center gap-3 bg-slate-50/50">
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${getConfidenceColor(result.confidence)}`}>
                                    {result.confidence}% confidence
                                </span>
                                <span className="text-xs text-slate-500 font-medium">
                                    {result.wordCount} {result.wordCount === 1 ? 'word' : 'words'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Extract Button + Progress ──────────────────────── */}
            {file && (
                <div className="border border-slate-200 rounded-2xl p-6 bg-white/80 backdrop-blur-sm shadow-sm">
                    {loading && (
                        <div className="mb-5">
                            <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                                <span>{progress < 30 ? 'Preprocessing image...' : progress < 80 ? 'Running OCR engine...' : 'Finalizing...'}</span>
                                <span>{Math.round(Math.min(progress, 100))}%</span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 transition-all duration-300 relative" style={{ width: `${Math.min(progress, 100)}%` }}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={extractText}
                        disabled={loading}
                        className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-teal-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-cyan-200 mb-3"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <ScanText size={18} />}
                        {loading ? 'Extracting Text...' : 'Extract Text'}
                    </button>

                    <p className="text-xs text-slate-400 text-center">Preprocessed with sharp, then processed by Tesseract OCR</p>
                </div>
            )}

            {/* ── Privacy Badge ──────────────────────── */}
            {file && (
                <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-400">
                    <Shield size={12} />
                    <span>Image is sent to server for OCR processing</span>
                </div>
            )}
        </div>
    );
};
