import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Upload, X, Loader2, Image as ImageIcon, FileText, ChevronDown, Shield } from 'lucide-react';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

export const ImageToPdf: React.FC = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'auto'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages(prev => [...prev, ...newImages]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'] },
    maxSize: 50 * 1024 * 1024,
  });

  const removeImage = (id: string) => {
    setImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter(i => i.id !== id);
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(images);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setImages(items);
  };

  const getPageDimensions = () => {
    const isLandscape = orientation === 'landscape';
    if (pageSize === 'a4') return isLandscape ? [841.89, 595.28] : [595.28, 841.89];
    if (pageSize === 'letter') return isLandscape ? [792, 612] : [612, 792];
    return null; // auto
  };

  const convert = async () => {
    if (images.length === 0) return;
    setLoading(true);
    setProgress(0);

    try {
      const pdfDoc = await PDFDocument.create();
      const dims = getPageDimensions();

      for (let i = 0; i < images.length; i++) {
        const file = images[i].file;
        const imgBytes = await file.arrayBuffer();

        const fileType = file.type.toLowerCase();
        const fileName = file.name.toLowerCase();
        const isJpeg = fileType === 'image/jpeg' || fileType === 'image/jpg' || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg');

        const imgData = new Uint8Array(imgBytes);

        let embedded;
        try {
          embedded = isJpeg
            ? await pdfDoc.embedJpg(imgData)
            : await pdfDoc.embedPng(imgData);
        } catch (embedErr) {
          console.warn('Failed with primary format, trying the other...', embedErr);
          try {
            embedded = !isJpeg
              ? await pdfDoc.embedJpg(imgData)
              : await pdfDoc.embedPng(imgData);
          } catch (fallbackErr) {
            throw new Error(`Failed to embed image ${file.name}: not a valid PNG or JPEG`);
          }
        }

        let pageW: number, pageH: number;
        if (dims) {
          [pageW, pageH] = dims;
        } else {
          pageW = embedded.width;
          pageH = embedded.height;
        }

        const page = pdfDoc.addPage([pageW, pageH]);
        const scale = Math.min(pageW / embedded.width, pageH / embedded.height);
        const drawW = embedded.width * scale;
        const drawH = embedded.height * scale;

        page.drawImage(embedded, {
          x: (pageW - drawW) / 2,
          y: (pageH - drawH) / 2,
          width: drawW,
          height: drawH,
        });

        setProgress(Math.round(((i + 1) / images.length) * 100));
      }

      const pdfBytesRaw = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytesRaw).buffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'images-converted.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Error converting images to PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      {/* ── Header ──────────────────────── */}
      <div className="flex items-center gap-4 mb-8 mt-2">
        <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-rose-200 hover:scale-105 transition-transform">
          <ImageIcon size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">Image to PDF</h2>
          <p className="text-base text-slate-500">Convert multiple images to a single PDF document</p>
        </div>
      </div>

      {/* ── Dropzone ──────────────────────── */}
      <div
        {...getRootProps()}
        className={`relative group border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 mb-6 ${isDragActive ? 'border-rose-400 bg-rose-50 scale-[1.01]' : 'border-slate-300 hover:border-rose-400 hover:bg-rose-50/30 bg-gradient-to-b from-slate-50 to-white'}`}
        style={{ outline: 'none' }}
      >
        <input {...getInputProps()} />
        <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${isDragActive ? 'bg-rose-100 text-rose-600 scale-110' : 'bg-slate-100 text-slate-400 group-hover:bg-rose-100 group-hover:text-rose-500'}`}>
          <Upload size={28} />
        </div>
        <p className="text-sm font-bold text-slate-900 mb-1">Drop images here</p>
        <p className="text-xs text-slate-400 mb-3">or click to browse files</p>
        <div className="flex justify-center gap-2">
          <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">PNG</span>
          <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">JPG</span>
          <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">JPEG</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-2">Max 50 MB per file</p>
      </div>

      {images.length > 0 && (
        <>
          {/* ── File List ──────────────────────── */}
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="images">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3 mb-6">
                  {images.map((img, idx) => (
                    <Draggable key={img.id} draggableId={img.id} index={idx}>
                      {(prov, snapshot) => (
                        <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}
                          className={`flex items-center justify-between border rounded-xl p-3 bg-white transition-all ${snapshot.isDragging ? 'shadow-lg border-rose-300 scale-[1.02]' : 'border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'}`}
                          style={{ ...prov.draggableProps.style, borderLeft: '4px solid', borderLeftColor: `hsl(${(idx * 40) % 360}, 70%, 60%)` }}>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                              <img src={img.preview} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900 truncate max-w-[180px] sm:max-w-xs">{img.file.name}</p>
                              <p className="text-xs text-slate-400">{formatSize(img.file.size)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 w-6 h-6 rounded-full flex items-center justify-center">{idx + 1}</span>
                            <button onClick={() => removeImage(img.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {/* ── Options Panel ──────────────────────── */}
          <div className="border border-slate-200 rounded-2xl p-6 bg-white/80 backdrop-blur-sm shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Page Size</label>
                <div className="relative">
                  <select value={pageSize} onChange={e => setPageSize(e.target.value as any)} className="w-full appearance-none px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all">
                    <option value="a4">A4</option>
                    <option value="letter">Letter</option>
                    <option value="auto">Auto-fit</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Orientation</label>
                <div className="relative">
                  <select value={orientation} onChange={e => setOrientation(e.target.value as any)} className="w-full appearance-none px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all">
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Progress */}
            {loading && (
              <div className="mb-5">
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                  <span>Converting...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-300 relative" style={{ width: `${progress}%` }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                  </div>
                </div>
              </div>
            )}

            <button onClick={convert} disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-xl hover:from-rose-600 hover:to-pink-700 transition-all disabled:opacity-50 disabled:hover:from-rose-500 flex items-center justify-center gap-2 shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
              {loading ? 'Converting...' : `Convert ${images.length} ${images.length === 1 ? 'image' : 'images'} to PDF`}
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
