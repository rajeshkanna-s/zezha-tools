import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import { Upload, Loader2, X, FileText, ArrowUp, ArrowDown, Merge, Shield, GripVertical } from 'lucide-react';

interface PdfFile {
  id: string;
  file: File;
  pageCount: number | null;
}

export const MergePdf: React.FC = () => {
  const [pdfs, setPdfs] = useState<PdfFile[]>([]);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(async (files: File[]) => {
    const newPdfs: PdfFile[] = [];
    for (const file of files) {
      let pageCount: number | null = null;
      try {
        const buf = await file.arrayBuffer();
        const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
        pageCount = doc.getPageCount();
      } catch { /* ignore */ }
      newPdfs.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, file, pageCount });
    }
    setPdfs(prev => [...prev, ...newPdfs]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 50 * 1024 * 1024,
    maxFiles: 20,
  });

  const merge = async () => {
    if (pdfs.length < 2) { alert('Please add at least 2 PDFs'); return; }
    setLoading(true);
    try {
      const merged = await PDFDocument.create();
      for (const pdf of pdfs) {
        const buf = await pdf.file.arrayBuffer();
        const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach(p => merged.addPage(p));
      }
      const bytesRaw = await merged.save();
      const blob = new Blob([new Uint8Array(bytesRaw).buffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Error merging PDFs. Some files may be corrupted or password-protected.');
    } finally {
      setLoading(false);
    }
  };

  const movePdf = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newPdfs = [...pdfs];
      [newPdfs[index - 1], newPdfs[index]] = [newPdfs[index], newPdfs[index - 1]];
      setPdfs(newPdfs);
    } else if (direction === 'down' && index < pdfs.length - 1) {
      const newPdfs = [...pdfs];
      [newPdfs[index + 1], newPdfs[index]] = [newPdfs[index], newPdfs[index + 1]];
      setPdfs(newPdfs);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const totalPages = pdfs.reduce((sum, p) => sum + (p.pageCount || 0), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      {/* ── Header ──────────────────────── */}
      <div className="flex items-center gap-4 mb-8 mt-2">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-200 hover:scale-105 transition-transform">
          <Merge size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">Merge PDF</h2>
          <p className="text-base text-slate-500">Combine multiple PDFs into one document</p>
        </div>
      </div>

      {/* ── Dropzone ──────────────────────── */}
      <div
        {...getRootProps()}
        className={`relative group border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 mb-6 ${isDragActive ? 'border-orange-400 bg-orange-50 scale-[1.01]' : 'border-slate-300 hover:border-orange-400 hover:bg-orange-50/30 bg-gradient-to-b from-slate-50 to-white'}`}
        style={{ outline: 'none' }}
      >
        <input {...getInputProps()} />
        <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${isDragActive ? 'bg-orange-100 text-orange-600 scale-110' : 'bg-slate-100 text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-500'}`}>
          <Upload size={28} />
        </div>
        <p className="text-sm font-bold text-slate-900 mb-1">Drop PDF files here <span className="text-slate-400 font-normal">(minimum 2)</span></p>
        <p className="text-xs text-slate-400 mb-3">or click to browse</p>
        <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">PDF</span>
        <p className="text-[10px] text-slate-400 mt-2">Max 50 MB per file · Up to 20 files</p>
      </div>

      {pdfs.length > 0 && (
        <>
          {/* ── File Summary ──────────────────────── */}
          <div className="flex items-center justify-between mb-4 px-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{pdfs.length} files · {totalPages} pages total</p>
            <button onClick={() => setPdfs([])} className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors">Clear all</button>
          </div>

          {/* ── File List ──────────────────────── */}
          <div className="space-y-2.5 mb-6">
            {pdfs.map((pdf, idx) => (
              <div key={pdf.id} className="flex items-center justify-between border border-slate-200 rounded-xl p-3.5 bg-white shadow-sm hover:shadow-md transition-all"
                style={{ borderLeft: '4px solid', borderLeftColor: `hsl(${30 + idx * 25}, 70%, 55%)` }}>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-white bg-gradient-to-br from-orange-400 to-amber-500 w-7 h-7 rounded-lg flex items-center justify-center shadow-sm">{idx + 1}</span>
                  <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">
                    <FileText size={18} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 truncate max-w-[160px] sm:max-w-xs">{pdf.file.name}</p>
                    <p className="text-xs text-slate-400">
                      {formatSize(pdf.file.size)}
                      {pdf.pageCount !== null && <span className="ml-1.5">· {pdf.pageCount} pages</span>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => movePdf(idx, 'up')} disabled={idx === 0}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50 disabled:opacity-30 transition-all">
                    <ArrowUp size={14} />
                  </button>
                  <button onClick={() => movePdf(idx, 'down')} disabled={idx === pdfs.length - 1}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50 disabled:opacity-30 transition-all">
                    <ArrowDown size={14} />
                  </button>
                  <button onClick={() => setPdfs(prev => prev.filter(p => p.id !== pdf.id))}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all ml-1">
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ── Merge Order ──────────────────────── */}
          <div className="border border-slate-200 rounded-2xl p-6 bg-white/80 backdrop-blur-sm shadow-sm">
            <div className="mb-5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Merge Order Preview</label>
              <div className="flex flex-wrap gap-2">
                {pdfs.map((pdf, idx) => (
                  <div key={pdf.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200">
                    <span className="text-xs font-black text-orange-600">{idx + 1}</span>
                    <span className="text-xs font-medium text-slate-700 truncate max-w-[100px]">{pdf.file.name.replace(/\.pdf$/i, '')}</span>
                    {idx < pdfs.length - 1 && <GripVertical size={10} className="text-slate-300 ml-1" />}
                  </div>
                ))}
              </div>
            </div>

            <button onClick={merge} disabled={loading || pdfs.length < 2}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-amber-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-orange-200">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Merge size={18} />}
              {loading ? 'Merging...' : `Merge ${pdfs.length} PDFs into one`}
            </button>
          </div>

          {/* ── Privacy Badge ──────────────────────── */}
          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-400">
            <Shield size={12} />
            <span>100% Client-Side · Files never leave your browser</span>
          </div>
        </>
      )}
    </div>
  );
};
