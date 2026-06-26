import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import mammoth from 'mammoth';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Upload, Loader2, FileText, X, Shield } from 'lucide-react';

export const WordToPdf: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((files: File[]) => {
    if (files[0]) setFile(files[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
  });

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const convert = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const buf = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer: buf });

      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;height:0;border:none;visibility:hidden;';
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) throw new Error('Failed to create rendering context');

      iframeDoc.open();
      iframeDoc.write(`<!DOCTYPE html><html><head><style>
        body { margin:0; padding:40px; font-family:Arial,sans-serif; font-size:12pt; line-height:1.6; color:#000; background:#fff; width:714px; }
        h1 { font-size: 24pt; font-weight: bold; margin: 16px 0 8px; }
        h2 { font-size: 18pt; font-weight: bold; margin: 14px 0 6px; }
        h3 { font-size: 14pt; font-weight: bold; margin: 12px 0 4px; }
        p { margin: 6px 0; }
        table { border-collapse: collapse; width: 100%; margin: 10px 0; }
        td, th { border: 1px solid #ccc; padding: 6px 10px; text-align: left; }
        ul, ol { margin: 6px 0; padding-left: 24px; }
        img { max-width: 100%; height: auto; }
      </style></head><body>${result.value}</body></html>`);
      iframeDoc.close();

      await new Promise(resolve => setTimeout(resolve, 200));
      iframe.style.height = `${iframeDoc.body.scrollHeight}px`;

      const canvas = await html2canvas(iframeDoc.body, {
        scale: 2,
        useCORS: true,
        windowWidth: 794,
        windowHeight: iframeDoc.body.scrollHeight,
      });
      document.body.removeChild(iframe);

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const imgW = pdfW - 20;
      const imgH = (canvas.height * imgW) / canvas.width;

      let position = 10;
      let heightLeft = imgH;

      pdf.addImage(imgData, 'JPEG', 10, position, imgW, imgH);
      heightLeft -= (pdfH - 20);

      while (heightLeft > 0) {
        position -= (pdfH - 20);
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 10, position, imgW, imgH);
        heightLeft -= (pdfH - 20);
      }

      pdf.save(`${file.name.replace(/\.docx?$/i, '')}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Error converting Word document. Only .docx files are supported.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      {/* ── Header ──────────────────────── */}
      <div className="flex items-center gap-4 mb-8 mt-2">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-200 hover:scale-105 transition-transform">
          <FileText size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">Word to PDF</h2>
          <p className="text-base text-slate-500">Convert DOCX documents to PDF format</p>
        </div>
      </div>

      {/* ── Dropzone ──────────────────────── */}
      <div
        {...getRootProps()}
        className={`relative group border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 mb-6 ${isDragActive ? 'border-indigo-400 bg-indigo-50 scale-[1.01]' : 'border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/30 bg-gradient-to-b from-slate-50 to-white'}`}
        style={{ outline: 'none' }}
      >
        <input {...getInputProps()} />
        <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${isDragActive ? 'bg-indigo-100 text-indigo-600 scale-110' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-500'}`}>
          <Upload size={28} />
        </div>
        <p className="text-sm font-bold text-slate-900 mb-1">Drop a DOCX file here</p>
        <p className="text-xs text-slate-400 mb-3">or click to browse</p>
        <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">DOCX</span>
        <p className="text-[10px] text-slate-400 mt-2">Max 50 MB</p>
      </div>

      {file && (
        <>
          {/* ── File Card ──────────────────────── */}
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
            <button onClick={() => setFile(null)} className="text-slate-300 hover:text-red-500 transition-colors p-1">
              <X size={16} />
            </button>
          </div>

          {/* ── Convert ──────────────────────── */}
          <div className="border border-slate-200 rounded-2xl p-6 bg-white/80 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-3 mb-5 bg-indigo-50 rounded-xl p-3.5 border border-indigo-200">
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-400 to-blue-500" />
              <p className="text-xs font-semibold text-indigo-700">Detected <span className="font-black">Word Document</span> — ready to convert</p>
            </div>

            <button onClick={convert} disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold rounded-xl hover:from-indigo-600 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 mb-3">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
              {loading ? 'Converting...' : 'Convert to PDF'}
            </button>

            <p className="text-xs text-slate-400 text-center">Complex layouts and specific fonts may differ slightly from the original</p>
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
