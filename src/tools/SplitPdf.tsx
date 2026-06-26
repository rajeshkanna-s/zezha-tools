import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { Upload, Loader2, Scissors, FileText, X, Shield } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface PageThumb {
    pageNum: number;
    dataUrl: string;
}

export const SplitPdf: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [thumbnails, setThumbnails] = useState<PageThumb[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [rendering, setRendering] = useState(false);
    const [splitMode, setSplitMode] = useState<'all' | 'range' | 'every'>('all');
    const [rangeFrom, setRangeFrom] = useState(1);
    const [rangeTo, setRangeTo] = useState(1);
    const [everyN, setEveryN] = useState(1);

    const onDrop = useCallback(async (files: File[]) => {
        if (!files[0]) return;
        setFile(files[0]);
        setRendering(true);

        try {
            const buf = await files[0].arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
            setTotalPages(pdf.numPages);
            setRangeTo(pdf.numPages);
            const thumbs: PageThumb[] = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 0.3 });
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const ctx = canvas.getContext('2d')!;
                await page.render({ canvasContext: ctx, viewport }).promise;
                thumbs.push({ pageNum: i, dataUrl: canvas.toDataURL('image/jpeg', 0.6) });
            }
            setThumbnails(thumbs);
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

    const downloadPdf = (bytes: Uint8Array, name: string) => {
        const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        a.click();
        URL.revokeObjectURL(url);
    };

    const splitAll = async (buf: ArrayBuffer) => {
        const srcDoc = await PDFDocument.load(buf);
        for (let i = 0; i < srcDoc.getPageCount(); i++) {
            const newDoc = await PDFDocument.create();
            const [page] = await newDoc.copyPages(srcDoc, [i]);
            newDoc.addPage(page);
            const bytes = await newDoc.save();
            downloadPdf(new Uint8Array(bytes), `page-${i + 1}.pdf`);
            await new Promise(r => setTimeout(r, 300));
        }
    };

    const splitRange = async (buf: ArrayBuffer) => {
        const srcDoc = await PDFDocument.load(buf);
        const from = Math.max(1, Math.min(rangeFrom, totalPages));
        const to = Math.max(from, Math.min(rangeTo, totalPages));
        const newDoc = await PDFDocument.create();
        const indices = [];
        for (let i = from - 1; i < to; i++) indices.push(i);
        const pages = await newDoc.copyPages(srcDoc, indices);
        pages.forEach(p => newDoc.addPage(p));
        const bytes = await newDoc.save();
        downloadPdf(new Uint8Array(bytes), `pages-${from}-to-${to}.pdf`);
    };

    const splitEvery = async (buf: ArrayBuffer) => {
        const srcDoc = await PDFDocument.load(buf);
        const pageCount = srcDoc.getPageCount();
        const n = Math.max(1, everyN);
        let chunkIdx = 1;

        for (let i = 0; i < pageCount; i += n) {
            const newDoc = await PDFDocument.create();
            const indices = [];
            for (let j = i; j < Math.min(i + n, pageCount); j++) indices.push(j);
            const pages = await newDoc.copyPages(srcDoc, indices);
            pages.forEach(p => newDoc.addPage(p));
            const bytes = await newDoc.save();
            downloadPdf(new Uint8Array(bytes), `split-part-${chunkIdx}.pdf`);
            chunkIdx++;
            await new Promise(r => setTimeout(r, 300));
        }
    };

    const handleSplit = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const buf = await file.arrayBuffer();
            if (splitMode === 'all') await splitAll(buf);
            else if (splitMode === 'range') await splitRange(buf);
            else if (splitMode === 'every') await splitEvery(buf);
        } catch (err) {
            console.error(err);
            alert('Error splitting PDF');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 pb-12">
            {/* ── Header ──────────────────────── */}
            <div className="flex items-center gap-4 mb-8 mt-2">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-violet-200 hover:scale-105 transition-transform">
                    <Scissors size={32} />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">Split PDF</h2>
                    <p className="text-base text-slate-500">Split a PDF into individual pages or page ranges</p>
                </div>
            </div>

            {/* ── Dropzone ──────────────────────── */}
            <div
                {...getRootProps()}
                className={`relative group border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 mb-6 ${isDragActive ? 'border-violet-400 bg-violet-50 scale-[1.01]' : 'border-slate-300 hover:border-violet-400 hover:bg-violet-50/30 bg-gradient-to-b from-slate-50 to-white'}`}
                style={{ outline: 'none' }}
            >
                <input {...getInputProps()} />
                <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${isDragActive ? 'bg-violet-100 text-violet-600 scale-110' : 'bg-slate-100 text-slate-400 group-hover:bg-violet-100 group-hover:text-violet-500'}`}>
                    <Upload size={28} />
                </div>
                <p className="text-sm font-bold text-slate-900 mb-1">Drop a PDF file here</p>
                <p className="text-xs text-slate-400 mb-3">or click to browse</p>
                <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">PDF</span>
                <p className="text-[10px] text-slate-400 mt-2">Max 50 MB</p>
            </div>

            {/* ── File Card ──────────────────────── */}
            {file && (
                <div className="flex items-center justify-between border border-slate-200 rounded-xl p-4 bg-white shadow-sm mb-6" style={{ borderLeft: '4px solid #8b5cf6' }}>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
                            <FileText size={20} className="text-violet-500" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
                            <p className="text-xs text-slate-400">{formatSize(file.size)} · {totalPages} pages</p>
                        </div>
                    </div>
                    <button onClick={() => { setFile(null); setThumbnails([]); setTotalPages(0); }} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* ── Rendering state ──────────────────────── */}
            {rendering && (
                <div className="flex items-center justify-center gap-3 text-violet-600 text-sm font-semibold mb-6 p-6 border-2 border-dashed border-violet-200 rounded-2xl bg-violet-50">
                    <Loader2 size={20} className="animate-spin" /> Generating page previews...
                </div>
            )}

            {/* ── Main Panel ──────────────────────── */}
            {thumbnails.length > 0 && (
                <div className="border border-slate-200 rounded-2xl p-6 bg-white/80 backdrop-blur-sm shadow-sm">
                    {/* Page thumbnails */}
                    <div className="mb-6">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Page Previews</label>
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5 max-h-[300px] overflow-y-auto p-1 custom-scrollbar">
                            {thumbnails.map(t => (
                                <div key={t.pageNum} className="rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md hover:scale-105 transition-all bg-white">
                                    <img src={t.dataUrl} alt={`Page ${t.pageNum}`} className="w-full h-auto" />
                                    <p className="text-center text-[10px] font-bold py-1.5 bg-slate-50 text-slate-500 border-t border-slate-100">{t.pageNum}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Split Mode */}
                    <div className="mb-6">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Split Mode</label>
                        <div className="grid grid-cols-3 gap-2">
                            {([
                                { id: 'all' as const, label: 'Every Page', desc: `${totalPages} files` },
                                { id: 'range' as const, label: 'Page Range', desc: 'Extract pages' },
                                { id: 'every' as const, label: 'Every N Pages', desc: 'Chunk split' },
                            ]).map(mode => (
                                <button
                                    key={mode.id}
                                    onClick={() => setSplitMode(mode.id)}
                                    className={`px-4 py-3 text-left rounded-xl transition-all border-2 ${splitMode === mode.id
                                        ? 'border-violet-400 bg-violet-50 shadow-md shadow-violet-100 scale-[1.02]'
                                        : 'border-slate-200 bg-slate-50 hover:border-violet-200'}`}
                                >
                                    <p className={`text-sm font-bold ${splitMode === mode.id ? 'text-violet-700' : 'text-slate-700'}`}>{mode.label}</p>
                                    <p className="text-[10px] text-slate-500">{mode.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {splitMode === 'range' && (
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">From Page</label>
                                <input type="number" min={1} max={totalPages} value={rangeFrom} onChange={e => setRangeFrom(Number(e.target.value))}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition-all font-medium" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">To Page</label>
                                <input type="number" min={rangeFrom} max={totalPages} value={rangeTo} onChange={e => setRangeTo(Number(e.target.value))}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition-all font-medium" />
                            </div>
                        </div>
                    )}

                    {splitMode === 'every' && (
                        <div className="mb-6">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Split every N pages</label>
                            <input type="number" min={1} max={totalPages} value={everyN} onChange={e => setEveryN(Number(e.target.value))}
                                className="w-full max-w-xs px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition-all font-medium" />
                        </div>
                    )}

                    <button onClick={handleSplit} disabled={loading}
                        className="w-full py-3.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold rounded-xl hover:from-violet-600 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-violet-200">
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Scissors size={18} />}
                        {loading ? 'Splitting...' : splitMode === 'all' ? `Split into ${totalPages} files` : splitMode === 'range' ? `Extract pages ${rangeFrom}–${rangeTo}` : `Split every ${everyN} pages`}
                    </button>
                </div>
            )}

            {/* ── Privacy Badge ──────────────────────── */}
            {file && (
                <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-400">
                    <Shield size={12} />
                    <span>100% Client-Side · Files never leave your browser</span>
                </div>
            )}
        </div>
    );
};
