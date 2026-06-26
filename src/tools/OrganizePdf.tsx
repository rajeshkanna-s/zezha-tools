import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { Upload, Loader2, ArrowUpDown, FileText, X, GripVertical, RotateCcw, Shield } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface PageItem {
    pageNum: number;
    dataUrl: string;
}

export const OrganizePdf: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [pages, setPages] = useState<PageItem[]>([]);
    const [originalOrder, setOriginalOrder] = useState<PageItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [rendering, setRendering] = useState(false);
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const onDrop = useCallback(async (files: File[]) => {
        if (!files[0]) return;
        setFile(files[0]);
        setRendering(true);

        try {
            const buf = await files[0].arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
            const items: PageItem[] = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 0.4 });
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const ctx = canvas.getContext('2d')!;
                await page.render({ canvasContext: ctx, viewport }).promise;
                items.push({ pageNum: i, dataUrl: canvas.toDataURL('image/jpeg', 0.7) });
            }
            setPages(items);
            setOriginalOrder([...items]);
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

    const handleDragStart = (index: number) => {
        dragItem.current = index;
    };

    const handleDragEnter = (index: number) => {
        dragOverItem.current = index;
    };

    const handleDragEnd = () => {
        if (dragItem.current === null || dragOverItem.current === null) return;
        const updated = [...pages];
        const dragged = updated.splice(dragItem.current, 1)[0];
        updated.splice(dragOverItem.current, 0, dragged);
        setPages(updated);
        dragItem.current = null;
        dragOverItem.current = null;
    };

    const moveUp = (index: number) => {
        if (index === 0) return;
        const updated = [...pages];
        [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
        setPages(updated);
    };

    const moveDown = (index: number) => {
        if (index >= pages.length - 1) return;
        const updated = [...pages];
        [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
        setPages(updated);
    };

    const resetOrder = () => {
        setPages([...originalOrder]);
    };

    const isReordered = pages.some((p, i) => p.pageNum !== originalOrder[i]?.pageNum);

    const savePdf = async () => {
        if (!file) return;
        setLoading(true);

        try {
            const buf = await file.arrayBuffer();
            const srcDoc = await PDFDocument.load(buf);
            const newDoc = await PDFDocument.create();
            const indices = pages.map(p => p.pageNum - 1);
            const copiedPages = await newDoc.copyPages(srcDoc, indices);
            copiedPages.forEach(p => newDoc.addPage(p));
            const bytes = await newDoc.save();
            const blob = new Blob([new Uint8Array(bytes).buffer], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `organized-${file.name}`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            alert('Error organizing PDF');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 pb-12">
            {/* ── Header ──────────────────────── */}
            <div className="flex items-center gap-4 mb-8 mt-2">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-200 hover:scale-105 transition-transform">
                    <ArrowUpDown size={32} />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">Organize PDF</h2>
                    <p className="text-base text-slate-500">Rearrange pages in your PDF by dragging and dropping</p>
                </div>
            </div>

            {/* ── Dropzone ──────────────────────── */}
            <div
                {...getRootProps()}
                className={`relative group border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 mb-6 ${isDragActive ? 'border-amber-400 bg-amber-50 scale-[1.01]' : 'border-slate-300 hover:border-amber-400 hover:bg-amber-50/30 bg-gradient-to-b from-slate-50 to-white'}`}
                style={{ outline: 'none' }}
            >
                <input {...getInputProps()} />
                <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${isDragActive ? 'bg-amber-100 text-amber-600 scale-110' : 'bg-slate-100 text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-500'}`}>
                    <Upload size={28} />
                </div>
                <p className="text-sm font-bold text-slate-900 mb-1">Drop a PDF file here</p>
                <p className="text-xs text-slate-400 mb-3">or click to browse</p>
                <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">PDF</span>
                <p className="text-[10px] text-slate-400 mt-2">Max 50 MB</p>
            </div>

            {/* ── File Card ──────────────────────── */}
            {file && (
                <div className="flex items-center justify-between border border-slate-200 rounded-xl p-4 bg-white shadow-sm mb-6" style={{ borderLeft: '4px solid #d97706' }}>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                            <FileText size={20} className="text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
                            <p className="text-xs text-slate-400">{formatSize(file.size)} · {pages.length} pages</p>
                        </div>
                    </div>
                    <button onClick={() => { setFile(null); setPages([]); setOriginalOrder([]); }} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                        <X size={16} />
                    </button>
                </div>
            )}

            {rendering && (
                <div className="flex items-center justify-center gap-3 text-amber-600 text-sm font-semibold mb-6 p-6 border-2 border-dashed border-amber-200 rounded-2xl bg-amber-50">
                    <Loader2 size={20} className="animate-spin" /> Generating page previews...
                </div>
            )}

            {pages.length > 0 && (
                <div className="border border-slate-200 rounded-2xl p-6 bg-white/80 backdrop-blur-sm shadow-sm">
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Drag pages to reorder</h3>
                        <div className="flex gap-2">
                            {isReordered && (
                                <button
                                    onClick={resetOrder}
                                    className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors"
                                >
                                    <RotateCcw size={12} /> Reset
                                </button>
                            )}
                            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${isReordered ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'}`}>
                                {isReordered ? 'Modified' : 'Original order'}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 mb-6 max-h-[500px] overflow-y-auto p-1 custom-scrollbar">
                        {pages.map((p, idx) => (
                            <div
                                key={`${p.pageNum}-${idx}`}
                                draggable
                                onDragStart={() => handleDragStart(idx)}
                                onDragEnter={() => handleDragEnter(idx)}
                                onDragEnd={handleDragEnd}
                                onDragOver={e => e.preventDefault()}
                                className="relative rounded-xl overflow-hidden border-2 border-slate-200 hover:border-amber-400 hover:shadow-md transition-all cursor-grab active:cursor-grabbing active:scale-95 group"
                            >
                                <div className="absolute top-2 left-2 bg-white/90 rounded-lg shadow-sm p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <GripVertical size={14} className="text-slate-400" />
                                </div>
                                <img src={p.dataUrl} alt={`Page ${p.pageNum}`} className="w-full h-auto object-cover" />
                                <div className="flex items-center justify-between px-2 py-1.5 bg-slate-50 border-t border-slate-200">
                                    <p className="text-[10px] font-bold text-slate-500">Page {p.pageNum}</p>
                                    <div className="flex gap-1">
                                        <button onClick={() => moveUp(idx)} disabled={idx === 0}
                                            className="text-[10px] text-slate-400 hover:text-amber-600 disabled:opacity-30 font-bold">▲</button>
                                        <button onClick={() => moveDown(idx)} disabled={idx === pages.length - 1}
                                            className="text-[10px] text-slate-400 hover:text-amber-600 disabled:opacity-30 font-bold">▼</button>
                                    </div>
                                </div>
                                {p.pageNum !== idx + 1 && (
                                    <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-bold rounded-lg px-1.5 py-0.5 shadow-sm">
                                        #{idx + 1}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {isReordered && (
                        <div className="mb-5 px-4 py-3 bg-amber-50 rounded-xl border border-amber-200">
                            <p className="text-xs font-medium text-amber-700">
                                New page order: {pages.map(p => p.pageNum).join(' → ')}
                            </p>
                        </div>
                    )}

                    <button onClick={savePdf} disabled={loading || !isReordered}
                        className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-amber-200">
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowUpDown size={18} />}
                        {loading ? 'Saving...' : 'Save Reorganized PDF'}
                    </button>
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
