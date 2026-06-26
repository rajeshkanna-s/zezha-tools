import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { Upload, Loader2, Trash2, CheckSquare, Square, Shield } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface PageThumb {
  pageNum: number;
  dataUrl: string;
}

export const DeletePdfPages: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnails, setThumbnails] = useState<PageThumb[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [rendering, setRendering] = useState(false);

  const onDrop = useCallback(async (files: File[]) => {
    if (!files[0]) return;
    setFile(files[0]);
    setSelected(new Set());
    setRendering(true);

    try {
      const buf = await files[0].arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      const thumbs: PageThumb[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.4 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport }).promise;
        thumbs.push({ pageNum: i, dataUrl: canvas.toDataURL('image/jpeg', 0.7) });
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

  const togglePage = (pageNum: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(pageNum)) next.delete(pageNum);
      else next.add(pageNum);
      return next;
    });
  };

  const deletePages = async () => {
    if (!file || selected.size === 0) return;
    if (selected.size >= thumbnails.length) {
      alert('Cannot delete all pages');
      return;
    }
    setLoading(true);

    try {
      const buf = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buf);
      const pagesToDelete = [...selected].sort((a, b) => b - a);
      for (const pageNum of pagesToDelete) {
        pdfDoc.removePage(pageNum - 1);
      }

      const bytesRaw = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(bytesRaw).buffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cleaned-${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Error deleting PDF pages');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      {/* ── Header ──────────────────────── */}
      <div className="flex items-center gap-4 mb-8 mt-2">
        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-red-200 hover:scale-105 transition-transform">
          <Trash2 size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">Delete PDF Pages</h2>
          <p className="text-base text-slate-500">Remove unnecessary pages from your PDF file</p>
        </div>
      </div>

      {/* ── Dropzone ──────────────────────── */}
      <div
        {...getRootProps()}
        className={`relative group border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 mb-6 ${isDragActive ? 'border-red-400 bg-red-50 scale-[1.01]' : 'border-slate-300 hover:border-red-400 hover:bg-red-50/30 bg-gradient-to-b from-slate-50 to-white'}`}
        style={{ outline: 'none' }}
      >
        <input {...getInputProps()} />
        <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${isDragActive ? 'bg-red-100 text-red-600 scale-110' : 'bg-slate-100 text-slate-400 group-hover:bg-red-100 group-hover:text-red-500'}`}>
          <Upload size={28} />
        </div>
        <p className="text-sm font-bold text-slate-900 mb-1">Drop a PDF file here</p>
        <p className="text-xs text-slate-400 mb-3">or click to browse</p>
        <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">PDF</span>
        <p className="text-[10px] text-slate-400 mt-2">Max 50 MB</p>
      </div>

      {rendering && (
        <div className="flex items-center justify-center gap-3 text-red-500 text-sm font-semibold mb-6 p-6 border-2 border-dashed border-red-200 rounded-2xl bg-red-50">
          <Loader2 size={20} className="animate-spin" /> Generating page previews...
        </div>
      )}

      {thumbnails.length > 0 && (
        <div className="border border-slate-200 rounded-2xl p-6 bg-white/80 backdrop-blur-sm shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Pages to Delete</h3>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${selected.size > 0 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'}`}>
              {selected.size} selected
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 mb-6 max-h-[500px] overflow-y-auto p-1 custom-scrollbar">
            {thumbnails.map(t => {
              const isSelected = selected.has(t.pageNum);
              return (
                <button
                  key={t.pageNum}
                  onClick={() => togglePage(t.pageNum)}
                  className={`relative rounded-xl overflow-hidden border-2 transition-all group ${isSelected ? 'border-red-500 ring-2 ring-red-200 scale-[0.97]' : 'border-slate-200 hover:border-red-300 hover:shadow-md'}`}
                >
                  <img src={t.dataUrl} alt={`Page ${t.pageNum}`} className="w-full h-auto object-cover" />
                  <div className="absolute top-2 right-2 bg-white rounded-lg shadow-sm p-0.5">
                    {isSelected ? <CheckSquare size={18} className="text-red-500" /> : <Square size={18} className="text-slate-300 group-hover:text-red-300 transition-colors" />}
                  </div>
                  <p className={`text-center text-[10px] font-bold py-1.5 border-t ${isSelected ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>Page {t.pageNum}</p>
                  {isSelected && <div className="absolute inset-0 bg-red-500/10 pointer-events-none" />}
                </button>
              );
            })}
          </div>

          <button onClick={deletePages} disabled={loading || selected.size === 0}
            className="w-full py-3.5 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-rose-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-red-200">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
            {loading ? 'Processing...' : `Delete ${selected.size} Page${selected.size === 1 ? '' : 's'}`}
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
