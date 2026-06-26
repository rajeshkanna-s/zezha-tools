import React from 'react';
import { Image, FileDown, Minimize2, Merge, Trash2, FileImage, FileText, ScanText, Scissors, ArrowUpDown, Code2, Crop, FileSignature } from 'lucide-react';
import { useCustomTools } from '@/hooks/useCustomTools';

interface ToolsHomeProps {
  onSelectTool: (tool: string) => void;
}

const tools = [
  { id: 'image-to-pdf', icon: Image, title: 'Image to PDF', desc: 'Convert multiple images into a single PDF document', color: 'bg-blue-500' },
  { id: 'compress-pdf', icon: FileDown, title: 'Compress PDF', desc: 'Reduce PDF file size while maintaining quality', color: 'bg-purple-500' },
  { id: 'edit-pdf', icon: FileSignature, title: 'Edit PDF', desc: 'Visually edit PDFs, add text, watermarks & signatures', color: 'bg-indigo-600' },
  { id: 'compress-image', icon: Minimize2, title: 'Compress Image', desc: 'Reduce image file sizes with quality control', color: 'bg-teal-500' },
  { id: 'merge-pdf', icon: Merge, title: 'Merge PDF', desc: 'Combine multiple PDF files into one', color: 'bg-orange-500' },
  { id: 'pdf-to-image', icon: FileImage, title: 'PDF to Image', desc: 'Convert PDF pages to PNG or JPG images', color: 'bg-rose-500' },
  { id: 'word-to-pdf', icon: FileText, title: 'Word to PDF', desc: 'Convert DOCX documents to PDF format', color: 'bg-indigo-500' },
  { id: 'image-to-text', icon: ScanText, title: 'Image to Text', desc: 'Extract text from images using Tesseract OCR', color: 'bg-cyan-500' },
  { id: 'split-pdf', icon: Scissors, title: 'Split PDF', desc: 'Split a PDF into individual pages or ranges', color: 'bg-violet-500' },
  { id: 'organize-pdf', icon: ArrowUpDown, title: 'Organize PDF', desc: 'Rearrange pages in your PDF by drag and drop', color: 'bg-amber-500' },
  { id: 'html-to-pdf', icon: Code2, title: 'HTML to PDF', desc: 'Convert HTML content to a downloadable PDF', color: 'bg-sky-500' },
  { id: 'crop-pdf', icon: Crop, title: 'Crop PDF', desc: 'Trim margins and crop pages in your PDF', color: 'bg-lime-500' },
  { id: 'delete-pdf-pages', icon: Trash2, title: 'Delete PDF Pages', desc: 'Remove specific pages from a PDF file', color: 'bg-red-500' },
];

export const ToolsHome: React.FC<ToolsHomeProps> = ({ onSelectTool }) => {
  const { hiddenIds } = useCustomTools();
  const visibleTools = tools.filter(t => !hiddenIds.includes(t.id));

  if (visibleTools.length === 0) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-4">
      <div className="text-center mb-4">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-1">
          File Conversion & PDF Tools
        </h1>
        <p className="text-emerald-600 text-xs max-w-lg mx-auto font-semibold animate-pulse">
          🔒 All tools run 100% in your browser. No files are uploaded to any server.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {visibleTools.map(tool => (
          <button
            key={tool.id}
            onClick={() => onSelectTool(tool.id)}
            className="bg-white rounded-xl border border-slate-200 p-4 text-left hover:shadow-lg hover:border-primary/20 hover:-translate-y-1 transition-all group"
          >
            <div className={`w-9 h-9 ${tool.color} text-white rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <tool.icon size={18} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-0.5">{tool.title}</h3>
            <p className="text-[11px] text-slate-500 leading-snug">{tool.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

