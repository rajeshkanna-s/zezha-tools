import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { Upload, Loader2, Crop, FileText, X, Shield } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export const CropPdf: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [rendering, setRendering] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(0);

    const [cropTop, setCropTop] = useState(0);
    const [cropBottom, setCropBottom] = useState(0);
    const [cropLeft, setCropLeft] = useState(0);
    const [cropRight, setCropRight] = useState(0);
    const [applyToAll, setApplyToAll] = useState(true);
    const [cropPage, setCropPage] = useState(1);

    const onDrop = useCallback(async (files: File[]) => {
        if (!files[0]) return;
        setFile(files[0]);
        setRendering(true);
        setCropTop(0); setCropBottom(0); setCropLeft(0); setCropRight(0);

        try {
            const buf = await files[0].arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
            setTotalPages(pdf.numPages);

            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 0.5 });

            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d')!;
            await page.render({ canvasContext: ctx, viewport }).promise;
            setPreviewUrl(canvas.toDataURL('image/jpeg', 0.8));
        } catch (err) {
            console.error(err);
            alert('Error reading PDF');
        } finally {
            setRendering(false);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1,
        maxSize: 50 * 1024 * 1024,
    });

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const handleCrop = async () => {
        if (!file) return;
        setLoading(true);

        try {
            const buf = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(buf);
            const pageCount = pdfDoc.getPageCount();

            const pagesToCrop = applyToAll
                ? Array.from({ length: pageCount }, (_, i) => i)
                : [Math.max(0, Math.min(cropPage - 1, pageCount - 1))];

            for (const idx of pagesToCrop) {
                const page = pdfDoc.getPage(idx);
                const { width, height } = page.getSize();

                const left = (cropLeft / 100) * width;
                const right = (cropRight / 100) * width;
                const top = (cropTop / 100) * height;
                const bottom = (cropBottom / 100) * height;

                page.setCropBox(
                    left,
                    bottom,
                    width - left - right,
                    height - top - bottom
                );
            }

            const bytes = await pdfDoc.save();
            const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `cropped-${file.name}`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            alert('Error cropping PDF');
        } finally {
            setLoading(false);
        }
    };

    const hasCrop = cropTop > 0 || cropBottom > 0 || cropLeft > 0 || cropRight > 0;

    return (
        <div className="max-w-4xl mx-auto px-4 pb-12">
            {/* ── Header ──────────────────────── */}
            <div className="flex items-center gap-4 mb-8 mt-2">
                <div className="w-16 h-16 bg-gradient-to-br from-lime-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-lime-200 hover:scale-105 transition-transform">
                    <Crop size={32} />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">Crop PDF</h2>
                    <p className="text-base text-slate-500">Trim margins and crop pages in your PDF</p>
                </div>
            </div>

            {/* ── Dropzone ──────────────────────── */}
            <div
                {...getRootProps()}
                className={`relative group border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 mb-6 ${isDragActive ? 'border-lime-400 bg-lime-50 scale-[1.01]' : 'border-slate-300 hover:border-lime-400 hover:bg-lime-50/30 bg-gradient-to-b from-slate-50 to-white'}`}
                style={{ outline: 'none' }}
            >
                <input {...getInputProps()} />
                <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${isDragActive ? 'bg-lime-100 text-lime-600 scale-110' : 'bg-slate-100 text-slate-400 group-hover:bg-lime-100 group-hover:text-lime-500'}`}>
                    <Upload size={28} />
                </div>
                <p className="text-sm font-bold text-slate-900 mb-1">Drop a PDF file here</p>
                <p className="text-xs text-slate-400 mb-3">or click to browse</p>
                <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">PDF</span>
                <p className="text-[10px] text-slate-400 mt-2">Max 50 MB</p>
            </div>

            {/* ── File Card ──────────────────────── */}
            {file && (
                <div className="flex items-center justify-between border border-slate-200 rounded-xl p-4 bg-white shadow-sm mb-6" style={{ borderLeft: '4px solid #65a30d' }}>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-lime-50 flex items-center justify-center">
                            <FileText size={20} className="text-lime-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
                            <p className="text-xs text-slate-400">{formatSize(file.size)} · {totalPages} pages</p>
                        </div>
                    </div>
                    <button onClick={() => { setFile(null); setPreviewUrl(null); }} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                        <X size={16} />
                    </button>
                </div>
            )}

            {rendering && (
                <div className="flex items-center justify-center gap-3 text-lime-600 text-sm font-semibold mb-6 p-6 border-2 border-dashed border-lime-200 rounded-2xl bg-lime-50">
                    <Loader2 size={20} className="animate-spin" /> Loading PDF preview...
                </div>
            )}

            {previewUrl && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Preview */}
                    <div className="border border-slate-200 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preview (Page 1)</p>
                        </div>
                        <div className="p-4 flex items-center justify-center bg-slate-50/50 relative">
                            <div className="relative inline-block">
                                <img src={previewUrl} alt="PDF Preview" className="max-w-full max-h-[400px] object-contain rounded-lg" />
                                {hasCrop && (
                                    <>
                                        <div className="absolute left-0 top-0 right-0 bg-red-500/25 pointer-events-none rounded-t-lg" style={{ height: `${cropTop}%` }} />
                                        <div className="absolute left-0 bottom-0 right-0 bg-red-500/25 pointer-events-none rounded-b-lg" style={{ height: `${cropBottom}%` }} />
                                        <div className="absolute left-0 top-0 bottom-0 bg-red-500/25 pointer-events-none rounded-l-lg" style={{ width: `${cropLeft}%` }} />
                                        <div className="absolute right-0 top-0 bottom-0 bg-red-500/25 pointer-events-none rounded-r-lg" style={{ width: `${cropRight}%` }} />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Crop Controls */}
                    <div className="border border-slate-200 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Crop Settings</p>
                        </div>
                        <div className="p-5 space-y-5">
                            {[
                                { label: 'Top', value: cropTop, set: setCropTop },
                                { label: 'Bottom', value: cropBottom, set: setCropBottom },
                                { label: 'Left', value: cropLeft, set: setCropLeft },
                                { label: 'Right', value: cropRight, set: setCropRight },
                            ].map(({ label, value, set }) => (
                                <div key={label}>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
                                        <span className="text-sm font-black text-lime-600">{value}%</span>
                                    </div>
                                    <input
                                        type="range" min={0} max={45} value={value}
                                        onChange={e => set(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-lime-600"
                                    />
                                </div>
                            ))}

                            <div className="pt-3 border-t border-slate-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={applyToAll} onChange={e => setApplyToAll(e.target.checked)} className="rounded accent-lime-600" />
                                        <span className="text-sm font-medium text-slate-700">Apply to all pages</span>
                                    </label>
                                </div>
                                {!applyToAll && (
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Page number</label>
                                        <input type="number" min={1} max={totalPages} value={cropPage} onChange={e => setCropPage(Number(e.target.value))}
                                            className="w-full max-w-[120px] px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lime-200 font-medium" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {previewUrl && (
                <div className="border border-slate-200 rounded-2xl p-6 bg-white/80 backdrop-blur-sm shadow-sm">
                    <button
                        onClick={handleCrop}
                        disabled={loading || !hasCrop}
                        className="w-full py-3.5 bg-gradient-to-r from-lime-500 to-emerald-600 text-white font-bold rounded-xl hover:from-lime-600 hover:to-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-lime-200 mb-3"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Crop size={18} />}
                        {loading ? 'Cropping...' : `Crop ${applyToAll ? 'All Pages' : `Page ${cropPage}`}`}
                    </button>
                    <p className="text-xs text-slate-400 text-center">Red overlay shows the area that will be removed</p>
                </div>
            )}

            {file && (
                <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-400">
                    <Shield size={12} />
                    <span>100% Client-Side · Files never leave your browser</span>
                </div>
            )}
        </div>
    );
};
