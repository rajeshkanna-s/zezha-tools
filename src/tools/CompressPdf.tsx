import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { Upload, Loader2, FileDown, FileText, X, Zap, Info, Shield } from 'lucide-react';

// Set the worker source for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface CompressionResult {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  pageCount: number;
}

type Level = 'low' | 'medium' | 'high' | 'extreme';

const LEVEL_CONFIG: Record<Level, { dpi: number; quality: number; label: string; desc: string; color: string }> = {
  low: { dpi: 200, quality: 0.92, label: 'Low', desc: 'Best quality — minimal size reduction', color: 'from-emerald-400 to-teal-500' },
  medium: { dpi: 150, quality: 0.75, label: 'Medium', desc: 'Good balance — 40–60% smaller', color: 'from-blue-400 to-indigo-500' },
  high: { dpi: 120, quality: 0.55, label: 'High', desc: 'Smaller files — some quality loss', color: 'from-amber-400 to-orange-500' },
  extreme: { dpi: 96, quality: 0.35, label: 'Extreme', desc: 'Maximum compression — noticeable quality loss', color: 'from-rose-400 to-red-500' },
};

async function compressPdf(file: File, level: Level, onProgress: (p: number) => void): Promise<CompressionResult> {
  const { dpi, quality } = LEVEL_CONFIG[level];
  const arrayBuffer = await file.arrayBuffer();
  const originalSize = arrayBuffer.byteLength;

  const pdfDoc = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  const pageCount = pdfDoc.numPages;
  const newPdf = await PDFDocument.create();

  for (let i = 1; i <= pageCount; i++) {
    onProgress(Math.round((i / pageCount) * 90));
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: 1 });
    const scale = dpi / 72;
    const renderViewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = renderViewport.width;
    canvas.height = renderViewport.height;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvasContext: ctx, viewport: renderViewport }).promise;

    const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
    const jpegBytes = Uint8Array.from(atob(jpegDataUrl.split(',')[1]), c => c.charCodeAt(0));
    const jpegImage = await newPdf.embedJpg(jpegBytes);

    const newPage = newPdf.addPage([viewport.width, viewport.height]);
    newPage.drawImage(jpegImage, { x: 0, y: 0, width: viewport.width, height: viewport.height });

    canvas.width = 0;
    canvas.height = 0;
  }

  onProgress(95);

  const pdfBytes = await newPdf.save();
  let finalBytes = pdfBytes;

  if (pdfBytes.length >= originalSize) {
    const origDoc = await PDFDocument.load(arrayBuffer);
    const copyDoc = await PDFDocument.create();
    const copiedPages = await copyDoc.copyPages(origDoc, origDoc.getPageIndices());
    copiedPages.forEach(p => copyDoc.addPage(p));
    copyDoc.setTitle(''); copyDoc.setAuthor(''); copyDoc.setSubject('');
    copyDoc.setProducer(''); copyDoc.setCreator('');
    const fallbackBytes = await copyDoc.save({ useObjectStreams: true });
    finalBytes = fallbackBytes.length < originalSize ? fallbackBytes : new Uint8Array(arrayBuffer);
  }

  onProgress(100);

  const blob = new Blob([new Uint8Array(finalBytes) as BlobPart], { type: 'application/pdf' });
  return { blob, originalSize, compressedSize: finalBytes.length, pageCount };
}

// ── Component ──────────────────────────────────────────────────
export const CompressPdf: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [level, setLevel] = useState<Level>('medium');
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [error, setError] = useState('');

  const onDrop = useCallback((files: File[]) => {
    if (files[0]) {
      setFile(files[0]);
      setResult(null);
      setError('');
      setProgress(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024,
  });

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleCompress = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setResult(null);
    setProgress(0);
    try {
      const res = await compressPdf(file, level, setProgress);
      setResult(res);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error compressing PDF. The file may be corrupted or password-protected.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed-${file.name}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const savings = result
    ? ((result.originalSize - result.compressedSize) / result.originalSize * 100)
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      {/* ── Header ──────────────────────── */}
      <div className="flex items-center gap-4 mb-8 mt-2">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-200 hover:scale-105 transition-transform">
          <FileDown size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">Compress PDF</h2>
          <p className="text-base text-slate-500">Reduce PDF file size by re-rendering pages as optimized images</p>
        </div>
      </div>

      {/* ── Dropzone ──────────────────────── */}
      <div
        {...getRootProps()}
        className={`relative group border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 mb-6 ${isDragActive ? 'border-blue-400 bg-blue-50 scale-[1.01]' : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50/30 bg-gradient-to-b from-slate-50 to-white'}`}
        style={{ outline: 'none' }}
      >
        <input {...getInputProps()} />
        <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${isDragActive ? 'bg-blue-100 text-blue-600 scale-110' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500'}`}>
          <Upload size={28} />
        </div>
        <p className="text-sm font-bold text-slate-900 mb-1">Drop a PDF file here</p>
        <p className="text-xs text-slate-400 mb-3">or click to browse</p>
        <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">PDF</span>
        <p className="text-[10px] text-slate-400 mt-2">Max 100 MB</p>
      </div>

      {/* ── File Card ──────────────────────── */}
      {file && (
        <div className="flex items-center justify-between border border-slate-200 rounded-xl p-4 bg-white shadow-sm mb-6" style={{ borderLeft: '4px solid #6366f1' }}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
              <FileText size={20} className="text-indigo-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
              <p className="text-xs text-slate-400">{formatSize(file.size)}</p>
            </div>
          </div>
          <button onClick={() => { setFile(null); setResult(null); setError(''); }} className="text-slate-300 hover:text-red-500 transition-colors p-1">
            <X size={16} />
          </button>
        </div>
      )}

      {/* ── Options ──────────────────────── */}
      {file && (
        <div className="border border-slate-200 rounded-2xl p-6 bg-white/80 backdrop-blur-sm shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Original size</p>
          <p className="text-lg font-black text-slate-900 mb-5">{formatSize(file.size)}</p>

          {/* Compression Level */}
          <div className="mb-6">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Compression Level</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.entries(LEVEL_CONFIG) as [Level, typeof LEVEL_CONFIG[Level]][]).map(([key, cfg]) => (
                <button key={key} onClick={() => setLevel(key)}
                  className={`px-3 py-3.5 text-left rounded-xl transition-all border-2 ${level === key
                    ? 'border-indigo-400 bg-indigo-50 shadow-md shadow-indigo-100 scale-[1.02]'
                    : 'border-slate-200 bg-slate-50 hover:border-indigo-200 hover:bg-indigo-50/50'
                    }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${cfg.color}`} />
                    <span className={`text-sm font-bold ${level === key ? 'text-indigo-700' : 'text-slate-700'}`}>{cfg.label}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 leading-relaxed">{cfg.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div className="flex items-start gap-2.5 mb-6 bg-blue-50 border border-blue-200 rounded-xl p-3.5">
            <Info size={14} className="text-blue-500 mt-0.5 shrink-0" />
            <p className="text-[11px] text-blue-800 font-medium leading-relaxed">
              Each page is rendered at {LEVEL_CONFIG[level].dpi} DPI and re-encoded as JPEG at {Math.round(LEVEL_CONFIG[level].quality * 100)}% quality. This produces real file size reduction (typically 40–80%) but converts text to images.
            </p>
          </div>

          {/* Progress */}
          {loading && (
            <div className="mb-6">
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                <span>Compressing...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 relative" style={{ width: `${progress}%` }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <p className="text-sm font-bold text-red-700">{error}</p>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className={`rounded-2xl p-5 mb-4 border-2 ${savings > 5 ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${savings > 5 ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                  <Zap size={24} className={savings > 5 ? 'text-emerald-600' : 'text-amber-600'} />
                </div>
                <div>
                  <p className={`text-xl font-black ${savings > 5 ? 'text-emerald-800' : 'text-amber-800'}`}>
                    {savings > 5 ? `${savings.toFixed(1)}% Smaller!` : 'Already optimized'}
                  </p>
                  <p className="text-xs text-slate-500">{result.pageCount} pages processed</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: 'Original', value: formatSize(result.originalSize), color: 'text-slate-900' },
                  { label: 'Compressed', value: formatSize(result.compressedSize), color: savings > 5 ? 'text-emerald-700' : 'text-slate-900' },
                  { label: 'Saved', value: formatSize(result.originalSize - result.compressedSize), color: savings > 5 ? 'text-emerald-700' : 'text-amber-700' },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-xl p-3 text-center border border-slate-200 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">{s.label}</p>
                    <p className={`text-sm font-black ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>
              <button onClick={handleDownload}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200">
                <FileDown size={18} /> Download Compressed PDF ({formatSize(result.compressedSize)})
              </button>
            </div>
          )}

          {!result && (
            <button onClick={handleCompress} disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-200 mb-4">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
              {loading ? `Compressing... ${progress}%` : 'Compress PDF'}
            </button>
          )}

          {/* Privacy */}
          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400">
            <Shield size={12} />
            <span>100% Client-Side · Files never leave your browser</span>
          </div>
        </div>
      )}
    </div>
  );
};
