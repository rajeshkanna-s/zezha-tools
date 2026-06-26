import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import {
    Upload, Loader2, FileDown, FileText, X, Type, ImageIcon, PenTool, Stamp,
    Highlighter, EyeOff, Square, Lock, ChevronLeft, ChevronRight, ZoomIn, ZoomOut,
    RotateCw, Undo2, Trash2, Download, Plus, Minus, Shield
} from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

/* ─── Types ─── */
type Tool = 'select' | 'text' | 'image' | 'signature' | 'watermark' | 'highlight' | 'redact' | 'shape';

interface EditItem {
    id: string; type: Tool; page: number;
    x: number; y: number; w: number; h: number;
    text?: string; fontSize?: number; fontColor?: string; fontFamily?: string;
    imgData?: string; opacity?: number; angle?: number; color?: string;
    shapeType?: 'rect' | 'line' | 'circle';
}

const TOOLS: { id: Tool; icon: React.FC<{ size?: number }>; label: string; color: string }[] = [
    { id: 'text', icon: Type, label: 'Text', color: '#2563eb' },
    { id: 'image', icon: ImageIcon, label: 'Image', color: '#059669' },
    { id: 'signature', icon: PenTool, label: 'Sign', color: '#7c3aed' },
    { id: 'watermark', icon: Stamp, label: 'Watermark', color: '#d97706' },
    { id: 'highlight', icon: Highlighter, label: 'Highlight', color: '#eab308' },
    { id: 'redact', icon: EyeOff, label: 'Redact', color: '#dc2626' },
    { id: 'shape', icon: Square, label: 'Shape', color: '#475569' },
];

const uid = () => Math.random().toString(36).slice(2, 9);

/* ─── Component ─── */
export const EditPdf: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [scale, setScale] = useState(1.5);
    const [activeTool, setActiveTool] = useState<Tool>('select');
    const [edits, setEdits] = useState<EditItem[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [rendering, setRendering] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [pageDims, setPageDims] = useState({ w: 0, h: 0 });

    // Text tool defaults
    const [fontSize, setFontSize] = useState(14);
    const [fontColor, setFontColor] = useState('#000000');
    const [newText, setNewText] = useState('');

    // Watermark
    const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
    const [watermarkOpacity, setWatermarkOpacity] = useState(0.15);

    // Shape
    const [shapeType, setShapeType] = useState<'rect' | 'line' | 'circle'>('rect');
    const [shapeColor, setShapeColor] = useState('#dc2626');

    // Signature pad
    const [showSigPad, setShowSigPad] = useState(false);
    const sigCanvasRef = useRef<HTMLCanvasElement>(null);
    const sigDrawing = useRef(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const imgInputRef = useRef<HTMLInputElement>(null);

    // Dragging state
    const dragging = useRef<{ id: string; offX: number; offY: number } | null>(null);
    const drawStart = useRef<{ x: number; y: number } | null>(null);

    /* ─── File Upload ─── */
    const onDrop = useCallback(async (files: File[]) => {
        if (!files[0]) return;
        setFile(files[0]);
        const ab = await files[0].arrayBuffer();
        setPdfBytes(ab);
        const doc = await pdfjsLib.getDocument({ data: new Uint8Array(ab) }).promise;
        setPageCount(doc.numPages);
        setCurrentPage(1);
        setEdits([]);
        setSelectedId(null);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1, maxSize: 50 * 1024 * 1024,
    });

    /* ─── Render Current Page ─── */
    useEffect(() => {
        if (!pdfBytes || !canvasRef.current) return;
        let cancelled = false;
        (async () => {
            setRendering(true);
            const doc = await pdfjsLib.getDocument({ data: new Uint8Array(pdfBytes) }).promise;
            const page = await doc.getPage(currentPage);
            const vp = page.getViewport({ scale });
            const canvas = canvasRef.current!;
            canvas.width = vp.width;
            canvas.height = vp.height;
            setPageDims({ w: vp.width, h: vp.height });
            const ctx = canvas.getContext('2d')!;
            await page.render({ canvasContext: ctx, viewport: vp }).promise;
            if (!cancelled) setRendering(false);
        })();
        return () => { cancelled = true; };
    }, [pdfBytes, currentPage, scale]);

    /* ─── Overlay Click ─── */
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (activeTool === 'select') { setSelectedId(null); return; }
        const rect = overlayRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (activeTool === 'text' && newText) {
            setEdits(prev => [...prev, { id: uid(), type: 'text', page: currentPage, x, y, w: 200, h: 30, text: newText, fontSize, fontColor }]);
        } else if (activeTool === 'highlight') {
            setEdits(prev => [...prev, { id: uid(), type: 'highlight', page: currentPage, x, y, w: 150, h: 22, color: '#ffff00', opacity: 0.4 }]);
        } else if (activeTool === 'redact') {
            setEdits(prev => [...prev, { id: uid(), type: 'redact', page: currentPage, x, y, w: 150, h: 22, color: '#000000' }]);
        } else if (activeTool === 'shape') {
            setEdits(prev => [...prev, { id: uid(), type: 'shape', page: currentPage, x, y, w: 100, h: 60, shapeType, color: shapeColor }]);
        } else if (activeTool === 'image') {
            imgInputRef.current?.click();
        }
    };

    /* ─── Image Upload ─── */
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]; if (!f) return;
        const reader = new FileReader();
        reader.onload = () => {
            setEdits(prev => [...prev, { id: uid(), type: 'image', page: currentPage, x: 50, y: 50, w: 150, h: 100, imgData: reader.result as string }]);
        };
        reader.readAsDataURL(f);
        e.target.value = '';
    };

    /* ─── Signature Pad ─── */
    const initSigPad = () => {
        setShowSigPad(true);
        setTimeout(() => {
            const c = sigCanvasRef.current; if (!c) return;
            c.width = 400; c.height = 150;
            const ctx = c.getContext('2d')!;
            ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 400, 150);
            ctx.lineWidth = 2; ctx.strokeStyle = '#000'; ctx.lineCap = 'round';
        }, 50);
    };

    const sigMouseDown = (e: React.MouseEvent) => {
        sigDrawing.current = true;
        const c = sigCanvasRef.current!; const ctx = c.getContext('2d')!;
        const r = c.getBoundingClientRect();
        ctx.beginPath(); ctx.moveTo(e.clientX - r.left, e.clientY - r.top);
    };
    const sigMouseMove = (e: React.MouseEvent) => {
        if (!sigDrawing.current) return;
        const c = sigCanvasRef.current!; const ctx = c.getContext('2d')!;
        const r = c.getBoundingClientRect();
        ctx.lineTo(e.clientX - r.left, e.clientY - r.top); ctx.stroke();
    };
    const sigMouseUp = () => { sigDrawing.current = false; };
    const applySig = () => {
        const c = sigCanvasRef.current!;
        const data = c.toDataURL('image/png');
        setEdits(prev => [...prev, { id: uid(), type: 'signature', page: currentPage, x: 50, y: pageDims.h - 100, w: 180, h: 60, imgData: data }]);
        setShowSigPad(false);
    };

    /* ─── Add Watermark to All Pages ─── */
    const addWatermark = () => {
        const items: EditItem[] = [];
        for (let p = 1; p <= pageCount; p++) {
            items.push({ id: uid(), type: 'watermark', page: p, x: pageDims.w * 0.1, y: pageDims.h * 0.4, w: pageDims.w * 0.8, h: 80, text: watermarkText, opacity: watermarkOpacity, angle: 45, fontSize: 54, fontColor: '#999999' });
        }
        setEdits(prev => [...prev, ...items]);
    };

    /* ─── Drag Edit Items ─── */
    const startDrag = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setSelectedId(id);
        const item = edits.find(i => i.id === id)!;
        dragging.current = { id, offX: e.nativeEvent.offsetX, offY: e.nativeEvent.offsetY };
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!dragging.current) return;
        const rect = overlayRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left - dragging.current.offX;
        const y = e.clientY - rect.top - dragging.current.offY;
        setEdits(prev => prev.map(i => i.id === dragging.current!.id ? { ...i, x, y } : i));
    };

    const onMouseUp = () => { dragging.current = null; };

    /* ─── Delete Selected ─── */
    const deleteSelected = () => {
        if (selectedId) { setEdits(prev => prev.filter(i => i.id !== selectedId)); setSelectedId(null); }
    };

    /* ─── Resize Handle ─── */
    const startResize = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        e.preventDefault();
        const item = edits.find(i => i.id === id)!;
        const startX = e.clientX; const startY = e.clientY;
        const startW = item.w; const startH = item.h;
        const onMove = (me: MouseEvent) => {
            const dw = me.clientX - startX; const dh = me.clientY - startY;
            setEdits(prev => prev.map(i => i.id === id ? { ...i, w: Math.max(30, startW + dw), h: Math.max(20, startH + dh) } : i));
        };
        const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    };

    /* ─── Export PDF ─── */
    const exportPdf = async () => {
        if (!pdfBytes) return;
        setExporting(true);
        try {
            const doc = await PDFDocument.load(pdfBytes);
            const helvetica = await doc.embedFont(StandardFonts.Helvetica);
            const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);

            for (const edit of edits) {
                const page = doc.getPages()[edit.page - 1]; if (!page) continue;
                const { height: pH } = page.getSize();
                // Convert screen coords to PDF coords
                const pdfX = edit.x / scale;
                const pdfY = pH - (edit.y / scale) - (edit.h / scale);

                if (edit.type === 'text' && edit.text) {
                    const fs = (edit.fontSize || 14);
                    page.drawText(edit.text, {
                        x: pdfX, y: pH - (edit.y / scale) - fs,
                        size: fs,
                        font: helvetica,
                        color: hexToRgb(edit.fontColor || '#000000'),
                    });
                } else if ((edit.type === 'image' || edit.type === 'signature') && edit.imgData) {
                    const isPng = edit.imgData.includes('image/png');
                    const b64 = edit.imgData.split(',')[1];
                    const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
                    const img = isPng ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
                    page.drawImage(img, { x: pdfX, y: pdfY, width: edit.w / scale, height: edit.h / scale });
                } else if (edit.type === 'watermark' && edit.text) {
                    page.drawText(edit.text, {
                        x: pdfX, y: pH - (edit.y / scale),
                        size: edit.fontSize || 54,
                        font: helveticaBold,
                        color: rgb(0.75, 0.75, 0.75),
                        opacity: edit.opacity || 0.15,
                        rotate: degrees(edit.angle || 45),
                    });
                } else if (edit.type === 'highlight') {
                    page.drawRectangle({ x: pdfX, y: pdfY, width: edit.w / scale, height: edit.h / scale, color: rgb(1, 1, 0), opacity: edit.opacity || 0.4 });
                } else if (edit.type === 'redact') {
                    page.drawRectangle({ x: pdfX, y: pdfY, width: edit.w / scale, height: edit.h / scale, color: rgb(0, 0, 0), opacity: 1 });
                } else if (edit.type === 'shape') {
                    const [r, g, b] = hexToRgbArr(edit.color || '#dc2626');
                    if (edit.shapeType === 'rect') {
                        page.drawRectangle({ x: pdfX, y: pdfY, width: edit.w / scale, height: edit.h / scale, borderColor: rgb(r, g, b), borderWidth: 2, opacity: 0 });
                    } else if (edit.shapeType === 'circle') {
                        const cx = pdfX + (edit.w / scale) / 2; const cy = pdfY + (edit.h / scale) / 2;
                        page.drawEllipse({ x: cx, y: cy, xScale: (edit.w / scale) / 2, yScale: (edit.h / scale) / 2, borderColor: rgb(r, g, b), borderWidth: 2, opacity: 0 });
                    } else if (edit.shapeType === 'line') {
                        page.drawLine({ start: { x: pdfX, y: pdfY }, end: { x: pdfX + edit.w / scale, y: pdfY + edit.h / scale }, thickness: 2, color: rgb(r, g, b) });
                    }
                }
            }

            const outBytes = await doc.save();
            const blob = new Blob([outBytes.buffer.slice(outBytes.byteOffset, outBytes.byteOffset + outBytes.byteLength) as ArrayBuffer], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = `edited-${file?.name || 'document.pdf'}`; a.click();
            URL.revokeObjectURL(url);
        } catch (err) { console.error(err); alert('Export error: ' + (err as Error).message); }
        finally { setExporting(false); }
    };

    const hexToRgb = (hex: string) => { const v = parseInt(hex.replace('#', ''), 16); return rgb((v >> 16) / 255, ((v >> 8) & 0xff) / 255, (v & 0xff) / 255); };
    const hexToRgbArr = (hex: string): [number, number, number] => { const v = parseInt(hex.replace('#', ''), 16); return [(v >> 16) / 255, ((v >> 8) & 0xff) / 255, (v & 0xff) / 255]; };

    const pageEdits = edits.filter(e => e.page === currentPage);

    /* ─── No file: Upload screen ─── */
    if (!file) return (
        <div className="max-w-4xl mx-auto px-4 pb-12">
            <div className="flex items-center gap-4 mb-8 mt-2">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-violet-200 hover:scale-105 transition-transform"><PenTool size={32} /></div>
                <div><h2 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">Edit PDF</h2><p className="text-base text-slate-500">Add text, images, signatures, highlights, watermarks and more</p></div>
            </div>
            <div {...getRootProps()} className={`relative group border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300 ${isDragActive ? 'border-violet-400 bg-violet-50 scale-[1.01]' : 'border-slate-300 hover:border-violet-400 hover:bg-violet-50/30 bg-gradient-to-b from-slate-50 to-white'}`} style={{ outline: 'none' }}>
                <input {...getInputProps()} />
                <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${isDragActive ? 'bg-violet-100 text-violet-600 scale-110' : 'bg-slate-100 text-slate-400 group-hover:bg-violet-100 group-hover:text-violet-500'}`}>
                    <Upload size={28} />
                </div>
                <p className="text-sm font-bold text-slate-900 mb-1">Drop a PDF file here</p>
                <p className="text-xs text-slate-400 mb-3">or click to browse</p>
                <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">PDF</span>
                <p className="text-[10px] text-slate-400 mt-2">Max 50 MB</p>
            </div>
            <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-400">
                <Shield size={12} />
                <span>100% Client-Side · Files never leave your browser</span>
            </div>
        </div>
    );

    /* ─── Editor ─── */
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 72px)', overflow: 'hidden', background: '#f1f5f9' }}>
            {/* Top Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#fff', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
                {/* Close */}
                <button onClick={() => { setFile(null); setPdfBytes(null); setEdits([]); }} style={{ padding: '6px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: '#f1f5f9', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}><X size={14} /> Close</button>
                <div style={{ width: 1, height: 28, background: '#e2e8f0' }} />

                {/* Tool buttons */}
                {TOOLS.map(t => (
                    <button key={t.id} onClick={() => {
                        setActiveTool(t.id);
                        if (t.id === 'signature') initSigPad();
                        if (t.id === 'image') imgInputRef.current?.click();
                        if (t.id === 'watermark') addWatermark();
                    }}
                        style={{ padding: '6px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, border: `2px solid ${activeTool === t.id ? t.color : 'transparent'}`, background: activeTool === t.id ? t.color + '15' : '#f8fafc', color: activeTool === t.id ? t.color : '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, transition: 'all 0.15s' }}>
                        <t.icon size={14} /> {t.label}
                    </button>
                ))}

                <div style={{ width: 1, height: 28, background: '#e2e8f0' }} />

                {/* Undo + Delete */}
                <button onClick={() => setEdits(prev => prev.slice(0, -1))} disabled={edits.length === 0} style={{ padding: '6px', borderRadius: 6, background: '#f1f5f9', border: 'none', cursor: 'pointer', color: '#64748b', opacity: edits.length === 0 ? 0.3 : 1 }}><Undo2 size={16} /></button>
                <button onClick={deleteSelected} disabled={!selectedId} style={{ padding: '6px', borderRadius: 6, background: selectedId ? '#fef2f2' : '#f1f5f9', border: 'none', cursor: 'pointer', color: selectedId ? '#dc2626' : '#64748b', opacity: selectedId ? 1 : 0.3 }}><Trash2 size={16} /></button>

                <div style={{ flex: 1 }} />

                {/* Zoom */}
                <button onClick={() => setScale(s => Math.max(0.5, s - 0.25))} style={{ padding: '4px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}><ZoomOut size={16} /></button>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', minWidth: 40, textAlign: 'center' }}>{Math.round(scale * 100)}%</span>
                <button onClick={() => setScale(s => Math.min(3, s + 0.25))} style={{ padding: '4px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}><ZoomIn size={16} /></button>

                <div style={{ width: 1, height: 28, background: '#e2e8f0' }} />

                {/* Export */}
                <button onClick={exportPdf} disabled={exporting} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 800, background: 'linear-gradient(to right, #7c3aed, #6d28d9)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, opacity: exporting ? 0.6 : 1, boxShadow: '0 4px 12px rgba(124,58,237,0.25)' }}>
                    {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} {exporting ? 'Exporting...' : 'Download PDF'}
                </button>
            </div>

            {/* Properties bar (depends on active tool) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 12px', background: '#fafbfc', borderBottom: '1px solid #e2e8f0', fontSize: 11, flexWrap: 'wrap' }}>
                {activeTool === 'text' && (
                    <>
                        <input type="text" value={newText} onChange={e => setNewText(e.target.value)} placeholder="Type text here..." style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 11, width: 200, fontWeight: 600 }} />
                        <label style={{ fontWeight: 700, color: '#64748b' }}>Size:</label>
                        <input type="number" value={fontSize} min={6} max={72} onChange={e => setFontSize(parseInt(e.target.value) || 12)} style={{ width: 45, padding: '4px', borderRadius: 4, border: '1px solid #d1d5db', fontSize: 11 }} />
                        <input type="color" value={fontColor} onChange={e => setFontColor(e.target.value)} style={{ width: 28, height: 24, border: 'none', cursor: 'pointer' }} />
                        <span style={{ color: '#94a3b8' }}>Click on PDF to place text</span>
                    </>
                )}
                {activeTool === 'highlight' && <span style={{ color: '#92400e', fontWeight: 700 }}>Click on PDF to add highlight region — drag corners to resize</span>}
                {activeTool === 'redact' && <span style={{ color: '#dc2626', fontWeight: 700 }}>Click on PDF to add black redaction bar — drag corners to resize</span>}
                {activeTool === 'shape' && (
                    <>
                        <label style={{ fontWeight: 700, color: '#64748b' }}>Shape:</label>
                        {(['rect', 'circle', 'line'] as const).map(s => (
                            <button key={s} onClick={() => setShapeType(s)} style={{ padding: '3px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, border: `1px solid ${shapeType === s ? shapeColor : '#d1d5db'}`, background: shapeType === s ? shapeColor + '20' : '#fff', color: shapeType === s ? shapeColor : '#64748b', cursor: 'pointer', textTransform: 'capitalize' }}>{s}</button>
                        ))}
                        <input type="color" value={shapeColor} onChange={e => setShapeColor(e.target.value)} style={{ width: 28, height: 20, border: 'none', cursor: 'pointer' }} />
                    </>
                )}
                {activeTool === 'watermark' && (
                    <>
                        <input type="text" value={watermarkText} onChange={e => setWatermarkText(e.target.value)} style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 11, width: 160, fontWeight: 600 }} />
                        <label style={{ fontWeight: 700, color: '#64748b' }}>Opacity:</label>
                        <input type="range" min={5} max={50} value={watermarkOpacity * 100} onChange={e => setWatermarkOpacity(parseInt(e.target.value) / 100)} style={{ width: 80 }} />
                        <span style={{ color: '#94a3b8' }}>{Math.round(watermarkOpacity * 100)}% — click Watermark button again to reapply</span>
                    </>
                )}
                {activeTool === 'select' && <span style={{ color: '#94a3b8', fontWeight: 600 }}>Click an element to select — drag to move — use corner handle to resize — press Delete to remove</span>}
                {(activeTool === 'image') && <span style={{ color: '#94a3b8', fontWeight: 600 }}>Select a PNG or JPG image to place on the page</span>}
                {(activeTool === 'signature') && <span style={{ color: '#94a3b8', fontWeight: 600 }}>Draw your signature in the pad below</span>}
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Main Canvas Area */}
                <div style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', padding: 20 }}>
                    <div style={{ position: 'relative', display: 'inline-block', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', borderRadius: 4, overflow: 'hidden' }}>
                        <canvas ref={canvasRef} style={{ display: 'block' }} />
                        {/* Editing overlay */}
                        <div ref={overlayRef}
                            onClick={handleOverlayClick}
                            onMouseMove={onMouseMove}
                            onMouseUp={onMouseUp}
                            style={{ position: 'absolute', top: 0, left: 0, width: pageDims.w, height: pageDims.h, cursor: activeTool !== 'select' ? 'crosshair' : 'default' }}>
                            {pageEdits.map(item => (
                                <div key={item.id}
                                    onMouseDown={e => startDrag(e, item.id)}
                                    style={{
                                        position: 'absolute', left: item.x, top: item.y, width: item.w, height: item.h,
                                        border: selectedId === item.id ? '2px solid #2563eb' : '1px dashed rgba(0,0,0,0.2)',
                                        cursor: 'move', borderRadius: 2,
                                        background: item.type === 'highlight' ? `rgba(255,255,0,${item.opacity || 0.4})`
                                            : item.type === 'redact' ? '#000'
                                                : item.type === 'watermark' ? 'transparent'
                                                    : 'transparent',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        overflow: 'hidden',
                                        transform: item.type === 'watermark' ? `rotate(-${item.angle || 45}deg)` : undefined,
                                    }}>
                                    {item.type === 'text' && (
                                        <span style={{ fontSize: item.fontSize, color: item.fontColor, fontWeight: 600, whiteSpace: 'nowrap', pointerEvents: 'none' }}>{item.text}</span>
                                    )}
                                    {(item.type === 'image' || item.type === 'signature') && item.imgData && (
                                        <img src={item.imgData} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
                                    )}
                                    {item.type === 'watermark' && (
                                        <span style={{ fontSize: item.fontSize || 54, fontWeight: 900, color: item.fontColor || '#999', opacity: item.opacity || 0.15, whiteSpace: 'nowrap', pointerEvents: 'none' }}>{item.text}</span>
                                    )}
                                    {item.type === 'shape' && item.shapeType === 'rect' && (
                                        <div style={{ width: '100%', height: '100%', border: `2px solid ${item.color}`, borderRadius: 2 }} />
                                    )}
                                    {item.type === 'shape' && item.shapeType === 'circle' && (
                                        <div style={{ width: '100%', height: '100%', border: `2px solid ${item.color}`, borderRadius: '50%' }} />
                                    )}
                                    {item.type === 'shape' && item.shapeType === 'line' && (
                                        <svg style={{ width: '100%', height: '100%', position: 'absolute' }}><line x1="0" y1="100%" x2="100%" y2="0" stroke={item.color} strokeWidth={2} /></svg>
                                    )}
                                    {/* Resize handle */}
                                    {selectedId === item.id && (
                                        <div onMouseDown={e => startResize(e, item.id)} style={{ position: 'absolute', right: -4, bottom: -4, width: 10, height: 10, background: '#2563eb', borderRadius: 2, cursor: 'se-resize', border: '1px solid #fff' }} />
                                    )}
                                </div>
                            ))}
                        </div>
                        {rendering && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 size={32} className="animate-spin" style={{ color: '#2563eb' }} /></div>}
                    </div>
                </div>
            </div>

            {/* Page Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px', background: 'linear-gradient(to right, #faf5ff, #f5f3ff)', borderTop: '1px solid #e2e8f0' }}>
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1} style={{ padding: '5px 10px', border: '1px solid #d1d5db', borderRadius: 8, background: '#fff', cursor: 'pointer', color: '#475569', opacity: currentPage <= 1 ? 0.4 : 1, transition: 'all 0.15s' }}><ChevronLeft size={16} /></button>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#334155', background: '#fff', padding: '4px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>Page {currentPage} of {pageCount}</span>
                <button onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))} disabled={currentPage >= pageCount} style={{ padding: '5px 10px', border: '1px solid #d1d5db', borderRadius: 8, background: '#fff', cursor: 'pointer', color: '#475569', opacity: currentPage >= pageCount ? 0.4 : 1, transition: 'all 0.15s' }}><ChevronRight size={16} /></button>
            </div>

            {/* Hidden file input for images */}
            <input ref={imgInputRef} type="file" accept="image/png,image/jpeg,image/jpg" hidden onChange={handleImageUpload} />

            {/* Signature Pad Modal */}
            {showSigPad && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                    <div style={{ background: '#fff', borderRadius: 16, padding: 24, width: 460, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
                        <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16, color: '#1e293b' }}>✍️ Draw Your Signature</h3>
                        <canvas ref={sigCanvasRef} onMouseDown={sigMouseDown} onMouseMove={sigMouseMove} onMouseUp={sigMouseUp} onMouseLeave={sigMouseUp}
                            style={{ border: '2px solid #e2e8f0', borderRadius: 12, cursor: 'crosshair', display: 'block', width: 400, height: 150, background: '#fafbfc' }} />
                        <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
                            <button onClick={() => {
                                const c = sigCanvasRef.current!; const ctx = c.getContext('2d')!;
                                ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 400, 150);
                            }} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #d1d5db', background: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', color: '#64748b' }}>Clear</button>
                            <button onClick={() => setShowSigPad(false)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #d1d5db', background: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', color: '#64748b' }}>Cancel</button>
                            <button onClick={applySig} style={{ padding: '8px 16px', borderRadius: 10, border: 'none', background: 'linear-gradient(to right, #7c3aed, #6d28d9)', color: '#fff', fontSize: 12, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}>Apply Signature</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
