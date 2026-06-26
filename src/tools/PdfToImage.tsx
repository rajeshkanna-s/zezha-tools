import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { Upload, Download, Loader2, Image as ImageIcon, FileText, X, Shield } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface PageImage {
  pageNum: number;
  dataUrl: string;
  blob: Blob;
}

export const PdfToImage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [pageRange, setPageRange] = useState('all');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<PageImage[]>([]);

  const onDrop = useCallback(async (files: File[]) => {
    if (!files[0]) return;
    setFile(files[0]);
    setResults([]);
    try {
      const buf = await files[0].arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      setPageCount(pdf.numPages);
    } catch {
      setPageCount(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
  });

  const parseRange = (): number[] => {
    if (pageRange === 'all' || !pageRange.trim()) return Array.from({ length: pageCount }, (_, i) => i + 1);
    const pages: number[] = [];
    const parts = pageRange.split(',');
    for (const part of parts) {
      if (part.includes('-')) {
        const [s, e] = part.split('-').map(Number);
        for (let i = s; i <= Math.min(e, pageCount); i++) if (i >= 1) pages.push(i);
      } else {
        const n = Number(part.trim());
        if (n >= 1 && n <= pageCount) pages.push(n);
      }
    }
    return [...new Set(pages)].sort((a, b) => a - b);
  };

  const convert = async () => {
    if (!file) return;
    setLoading(true);
    setProgress(0);
    setResults([]);

    try {
      const buf = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      const pages = parseRange();
      const images: PageImage[] = [];

      for (let i = 0; i < pages.length; i++) {
        const page = await pdf.getPage(pages[i]);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport }).promise;

        const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
        const dataUrl = canvas.toDataURL(mimeType, 0.92);
        const blob = await new Promise<Blob>((resolve) => canvas.toBlob(b => resolve(b!), mimeType, 0.92));

        images.push({ pageNum: pages[i], dataUrl, blob });
        setProgress(Math.round(((i + 1) / pages.length) * 100));
      }

      setResults(images);
    } catch (err) {
      console.error(err);
      alert('Error converting PDF to images');
    } finally {
      setLoading(false);
    }
  };

  const downloadAll = async () => {
    if (results.length === 1) {
      const url = URL.createObjectURL(results[0].blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `page-${results[0].pageNum}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    const zip = new JSZip();
    results.forEach(r => zip.file(`page-${r.pageNum}.${format}`, r.blob));
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pdf-pages.zip';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      {/* ── Header ──────────────────────── */}
      <div className="flex items-center gap-4 mb-8 mt-2">
        <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-pink-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-fuchsia-200 hover:scale-105 transition-transform">
          <ImageIcon size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">PDF to Image</h2>
          <p className="text-base text-slate-500">Convert PDF pages to PNG or JPG images</p>
        </div>
      </div>

      {/* ── Dropzone ──────────────────────── */}
      <div
        {...getRootProps()}
        className={`relative group border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 mb-6 ${isDragActive ? 'border-fuchsia-400 bg-fuchsia-50 scale-[1.01]' : 'border-slate-300 hover:border-fuchsia-400 hover:bg-fuchsia-50/30 bg-gradient-to-b from-slate-50 to-white'}`}
        style={{ outline: 'none' }}
      >
        <input {...getInputProps()} />
        <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${isDragActive ? 'bg-fuchsia-100 text-fuchsia-600 scale-110' : 'bg-slate-100 text-slate-400 group-hover:bg-fuchsia-100 group-hover:text-fuchsia-500'}`}>
          <Upload size={28} />
        </div>
        <p className="text-sm font-bold text-slate-900 mb-1">Drop a PDF file here</p>
        <p className="text-xs text-slate-400 mb-3">or click to browse</p>
        <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">PDF</span>
        <p className="text-[10px] text-slate-400 mt-2">Max 50 MB</p>
      </div>

      {file && (
        <>
          {/* ── File Card ──────────────────────── */}
          <div className="flex items-center justify-between border border-slate-200 rounded-xl p-4 bg-white shadow-sm mb-6" style={{ borderLeft: '4px solid #d946ef' }}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-fuchsia-50 flex items-center justify-center">
                <FileText size={20} className="text-fuchsia-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
                <p className="text-xs text-slate-400">{pageCount} pages</p>
              </div>
            </div>
            <button onClick={() => { setFile(null); setResults([]); }} className="text-slate-300 hover:text-red-500 transition-colors p-1">
              <X size={16} />
            </button>
          </div>

          {/* ── Options ──────────────────────── */}
          <div className="border border-slate-200 rounded-2xl p-6 bg-white/80 backdrop-blur-sm shadow-sm mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Format</label>
                <div className="flex gap-2">
                  {(['png', 'jpeg'] as const).map(f => (
                    <button key={f} onClick={() => setFormat(f)}
                      className={`flex-1 px-4 py-3 text-sm font-bold rounded-xl transition-all border-2 ${format === f
                        ? 'border-fuchsia-400 bg-fuchsia-50 text-fuchsia-700 shadow-md shadow-fuchsia-100'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-fuchsia-200'}`}>
                      {f.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Page Range</label>
                <input value={pageRange} onChange={e => setPageRange(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-fuchsia-200 focus:border-fuchsia-300 transition-all font-medium placeholder:text-slate-400" placeholder="all or 1-5,8" />
              </div>
            </div>

            {loading && (
              <div className="mb-5">
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                  <span>Converting...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 transition-all duration-300 relative" style={{ width: `${progress}%` }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                  </div>
                </div>
              </div>
            )}

            <button onClick={convert} disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-fuchsia-500 to-pink-600 text-white font-bold rounded-xl hover:from-fuchsia-600 hover:to-pink-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-200">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
              {loading ? 'Converting...' : 'Convert to Images'}
            </button>
          </div>
        </>
      )}

      {/* ── Results ──────────────────────── */}
      {results.length > 0 && (
        <div className="border border-slate-200 rounded-2xl p-6 bg-white/80 backdrop-blur-sm shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Converted Pages</h3>
            <button onClick={downloadAll}
              className="px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-xs font-bold rounded-xl hover:from-slate-700 flex items-center gap-2 shadow-lg shadow-slate-300">
              <Download size={14} /> {results.length > 1 ? 'Download ZIP' : 'Download'}
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {results.map(r => (
              <div key={r.pageNum} className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all">
                <img src={r.dataUrl} alt={`Page ${r.pageNum}`} className="w-full h-auto object-cover" />
                <p className="text-center text-[10px] font-bold text-slate-500 py-1.5 border-t border-slate-100 bg-slate-50">Page {r.pageNum}</p>
              </div>
            ))}
          </div>
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
