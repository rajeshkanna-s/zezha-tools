import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Loader2, Code2, Eye, EyeOff, Shield } from 'lucide-react';

export const HtmlToPdf: React.FC = () => {
    const [html, setHtml] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const previewRef = useRef<HTMLIFrameElement>(null);

    const defaultHtml = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
    h1 { color: #1a56db; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; }
    p { line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #d1d5db; padding: 8px 12px; text-align: left; }
    th { background: #f3f4f6; font-weight: bold; }
  </style>
</head>
<body>
  <h1>Sample Document</h1>
  <p>This is a sample HTML document. Edit this content or paste your own HTML.</p>
  <table>
    <tr><th>Feature</th><th>Status</th></tr>
    <tr><td>Tables</td><td>✓ Supported</td></tr>
    <tr><td>Images</td><td>✓ Supported</td></tr>
    <tr><td>Styling</td><td>✓ Supported</td></tr>
  </table>
</body>
</html>`;

    const convert = async () => {
        const content = html.trim() || defaultHtml;
        setLoading(true);

        try {
            const iframe = document.createElement('iframe');
            iframe.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;height:0;border:none;visibility:hidden;zoom:1;';
            document.body.appendChild(iframe);

            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (!iframeDoc) throw new Error('Failed to create rendering context');

            iframeDoc.open();
            iframeDoc.write(content);
            iframeDoc.close();

            await new Promise(resolve => setTimeout(resolve, 300));
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

            pdf.save('html-to-pdf.pdf');
        } catch (err) {
            console.error(err);
            alert('Error converting HTML to PDF');
        } finally {
            setLoading(false);
        }
    };

    const previewHtml = html.trim() || defaultHtml;

    return (
        <div className="max-w-4xl mx-auto px-4 pb-12">
            {/* ── Header ──────────────────────── */}
            <div className="flex items-center gap-4 mb-8 mt-2">
                <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-cyan-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-sky-200 hover:scale-105 transition-transform">
                    <Code2 size={32} />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">HTML to PDF</h2>
                    <p className="text-base text-slate-500">Convert HTML content to a downloadable PDF</p>
                </div>
            </div>

            {/* ── HTML Editor ──────────────────────── */}
            <div className="border border-slate-200 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm mb-6 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-sky-400 to-cyan-500" />
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">HTML Code</p>
                    </div>
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-sky-50"
                    >
                        {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                        {showPreview ? 'Hide Preview' : 'Show Preview'}
                    </button>
                </div>
                <textarea
                    value={html}
                    onChange={e => setHtml(e.target.value)}
                    placeholder={defaultHtml}
                    className="w-full h-64 p-4 text-sm font-mono text-slate-800 bg-white border-none resize-y focus:outline-none placeholder:text-slate-300"
                    spellCheck={false}
                />
            </div>

            {/* ── Preview ──────────────────────── */}
            {showPreview && (
                <div className="border border-slate-200 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm mb-6 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Preview</p>
                    </div>
                    <iframe
                        ref={previewRef}
                        srcDoc={previewHtml}
                        className="w-full border-none bg-white"
                        style={{ height: '400px' }}
                        sandbox="allow-same-origin"
                        title="HTML Preview"
                    />
                </div>
            )}

            {/* ── Convert Button ──────────────────────── */}
            <div className="border border-slate-200 rounded-2xl p-6 bg-white/80 backdrop-blur-sm shadow-sm">
                <button
                    onClick={convert}
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-cyan-600 text-white font-bold rounded-xl hover:from-sky-600 hover:to-cyan-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-sky-200 mb-3"
                >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Code2 size={18} />}
                    {loading ? 'Converting...' : 'Convert to PDF'}
                </button>
                <p className="text-xs text-slate-400 text-center">Paste your HTML above or use the sample template</p>
            </div>

            {/* ── Privacy Badge ──────────────────────── */}
            <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-400">
                <Shield size={12} />
                <span>100% Client-Side · Files never leave your browser</span>
            </div>
        </div>
    );
};
