import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import JSZip from 'jszip';
import { Upload, Download, Loader2, X, Image as ImageIcon, FileText, Shield } from 'lucide-react';

interface CompressedResult {
  name: string;
  original: number;
  compressed: number;
  blob: Blob;
}

export const CompressImage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(70);
  const [maxWidth, setMaxWidth] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CompressedResult[]>([]);

  const onDrop = useCallback((accepted: File[]) => {
    setFiles(prev => [...prev, ...accepted]);
    setResults([]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'] },
    maxSize: 50 * 1024 * 1024,
  });

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const compress = async () => {
    if (files.length === 0) return;
    setLoading(true);
    const compressed: CompressedResult[] = [];

    try {
      for (const file of files) {
        const sizeMB = file.size / (1024 * 1024);
        const options: any = {
          maxSizeMB: quality < 30 ? 0.2 : quality < 60 ? 0.5 : quality < 80 ? 1 : 2,
          useWebWorker: false,
          initialQuality: quality / 100,
          fileType: 'image/jpeg',
          alwaysKeepResolution: maxWidth <= 0
        };

        if (sizeMB < options.maxSizeMB) {
          options.maxSizeMB = Math.max(0.01, sizeMB * 0.95);
        }

        if (maxWidth > 0) options.maxWidthOrHeight = maxWidth;

        let output = await imageCompression(file, options);

        if (output.size > file.size && file.type === 'image/jpeg') {
          output = file;
        }

        compressed.push({
          name: file.name,
          original: file.size,
          compressed: output.size,
          blob: output,
        });
      }
      setResults(compressed);
    } catch (err) {
      console.error(err);
      alert('Error compressing images');
    } finally {
      setLoading(false);
    }
  };

  const downloadSingle = (r: CompressedResult) => {
    const url = URL.createObjectURL(r.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed-${r.name}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAll = async () => {
    if (results.length === 1) return downloadSingle(results[0]);
    const zip = new JSZip();
    results.forEach(r => zip.file(`compressed-${r.name}`, r.blob));
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compressed-images.zip';
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalSaved = results.reduce((sum, r) => sum + (r.original - r.compressed), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      {/* ── Header ──────────────────────── */}
      <div className="flex items-center gap-4 mb-8 mt-2">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-purple-200 hover:scale-105 transition-transform">
          <ImageIcon size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">Compress Image</h2>
          <p className="text-base text-slate-500">Reduce image file sizes with quality control</p>
        </div>
      </div>

      {/* ── Dropzone ──────────────────────── */}
      <div
        {...getRootProps()}
        className={`relative group border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 mb-6 ${isDragActive ? 'border-purple-400 bg-purple-50 scale-[1.01]' : 'border-slate-300 hover:border-purple-400 hover:bg-purple-50/30 bg-gradient-to-b from-slate-50 to-white'}`}
        style={{ outline: 'none' }}
      >
        <input {...getInputProps()} />
        <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${isDragActive ? 'bg-purple-100 text-purple-600 scale-110' : 'bg-slate-100 text-slate-400 group-hover:bg-purple-100 group-hover:text-purple-500'}`}>
          <Upload size={28} />
        </div>
        <p className="text-sm font-bold text-slate-900 mb-1">Drop images here</p>
        <p className="text-xs text-slate-400 mb-3">or click to browse</p>
        <div className="flex justify-center gap-2">
          <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">PNG</span>
          <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">JPG</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-2">Max 50 MB per file</p>
      </div>

      {files.length > 0 && (
        <>
          {/* ── File List ──────────────────────── */}
          <div className="space-y-2 mb-6">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between border border-slate-200 rounded-xl p-3.5 bg-white shadow-sm" style={{ borderLeft: '4px solid #9333ea' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
                    <FileText size={16} className="text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-xs">{f.name}</p>
                    <p className="text-xs text-slate-400">{formatSize(f.size)}</p>
                  </div>
                </div>
                <button onClick={() => { setFiles(prev => prev.filter((_, j) => j !== i)); setResults([]); }} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* ── Options ──────────────────────── */}
          <div className="border border-slate-200 rounded-2xl p-6 bg-white/80 backdrop-blur-sm shadow-sm mb-6">
            <div className="space-y-6 mb-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quality</label>
                  <span className="text-sm font-black text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-lg">{quality}%</span>
                </div>
                <input type="range" min={10} max={100} value={quality} onChange={e => setQuality(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600" />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-bold uppercase tracking-wider">
                  <span>Smaller file</span>
                  <span>Higher quality</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Max Width (optional)</label>
                <input type="number" value={maxWidth || ''} onChange={e => setMaxWidth(Number(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all font-medium placeholder:text-slate-400" placeholder="e.g. 1920" />
              </div>
            </div>

            <button onClick={compress} disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-violet-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-violet-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-200 mb-3">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
              {loading ? 'Compressing...' : `Compress ${files.length} ${files.length === 1 ? 'image' : 'images'}`}
            </button>

            <p className="text-xs text-slate-400 text-center">Output format is JPEG · PNG transparency replaced with white</p>
          </div>
        </>
      )}

      {/* ── Results ──────────────────────── */}
      {results.length > 0 && (
        <div className="border border-slate-200 rounded-2xl p-6 bg-white/80 backdrop-blur-sm shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Results</h3>
              {totalSaved > 0 && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">{formatSize(totalSaved)} total saved</span>
              )}
            </div>
            {results.length > 1 && (
              <button onClick={downloadAll}
                className="px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-xs font-bold rounded-xl hover:from-slate-700 flex items-center gap-2 shadow-lg shadow-slate-300">
                <Download size={14} /> Download ZIP
              </button>
            )}
          </div>
          <div className="space-y-2">
            {results.map((r, i) => {
              const pctSaved = r.original === r.compressed ? 0 : ((r.original - r.compressed) / r.original * 100);
              return (
                <div key={i} className="flex items-center justify-between bg-slate-50 rounded-xl p-3.5 border border-slate-100 hover:shadow-sm transition-all">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{r.name}</p>
                    <p className="text-xs text-slate-500">
                      {r.original === r.compressed
                        ? `${formatSize(r.original)} (already optimized)`
                        : <>{formatSize(r.original)} → <span className="font-bold text-emerald-600">{formatSize(r.compressed)}</span> <span className="text-emerald-500">({pctSaved.toFixed(1)}% saved)</span></>}
                    </p>
                  </div>
                  <button onClick={() => downloadSingle(r)} className="text-purple-500 hover:text-purple-700 transition-colors p-2 rounded-lg hover:bg-purple-50"><Download size={16} /></button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Privacy Badge ──────────────────────── */}
      {files.length > 0 && (
        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-400">
          <Shield size={12} />
          <span>100% Client-Side · Files never leave your browser</span>
        </div>
      )}
    </div>
  );
};
