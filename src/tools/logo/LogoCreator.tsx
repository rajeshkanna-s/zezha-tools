import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Undo2, Redo2, Download, Trash2, Copy, ChevronUp, ChevronDown,
  Type, Shapes, Palette, Image as ImageIcon, LayoutTemplate,
  AlignCenter, AlignLeft, AlignRight, Bold, Italic, Eye, EyeOff,
  Lock, Unlock, RotateCcw, FlipHorizontal, FlipVertical, Plus,
  Search, X, ZoomIn, ZoomOut, Monitor, ChevronDown as ChevronDownIcon,
  ArrowLeft, FileDown, Upload, Wrench,
} from 'lucide-react';
import { useLogoState } from './hooks/useLogoState';
import { useLogoDownload } from './hooks/useLogoDownload';
import { ICONS, ICON_CATEGORIES } from './data/icons';
import { FONTS, GOOGLE_FONTS_URL } from './data/fonts';
import { COLOR_SWATCHES, GRADIENT_PRESETS } from './data/colors';
import { TEMPLATES, TEMPLATE_CATEGORIES } from './data/templates';
import { CANVAS_SIZES } from './data/sizes';
import { SHAPE_ITEMS, SHAPE_CATEGORIES, getShapeSVGElement } from './data/shapes';
import type {
  AnyLayer, TextLayer, IconLayer, ShapeLayer, ImageLayer, LeftTab, DownloadFormat, CanvasBackground,
} from './types';

// ─── Helpers ────────────────────────────────────────────────────────────────

function uid() { return `l-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }

function applyTextTransform(text: string, transform: string): string {
  if (transform === 'uppercase') return text.toUpperCase();
  if (transform === 'lowercase') return text.toLowerCase();
  if (transform === 'capitalize') return text.replace(/\b\w/g, c => c.toUpperCase());
  return text;
}

function bgStyle(bg: CanvasBackground): React.CSSProperties {
  if (bg.type === 'transparent') return { background: 'transparent' };
  if (bg.type === 'gradient') {
    if (bg.gradientType === 'radial')
      return { background: `radial-gradient(circle, ${bg.gradientColor1}, ${bg.gradientColor2})` };
    return { background: `linear-gradient(${bg.gradientAngle}deg, ${bg.gradientColor1}, ${bg.gradientColor2})` };
  }
  return { background: bg.color };
}

// ─── Shape Renderer ─────────────────────────────────────────────────────────

function ShapeSVG({ layer }: { layer: ShapeLayer }) {
  const { shapeType, width: w, height: h, fill, stroke, strokeWidth, strokeDash, fillType, gradientColor1, gradientColor2 } = layer;
  const gid = `sg-${layer.id || 'p'}`;
  const fillAttr = fillType === 'none' ? 'none' : fillType === 'gradient' ? `url(#${gid})` : fill;
  const strokeParts = stroke !== 'none' && strokeWidth > 0
    ? `stroke="${stroke}" stroke-width="${strokeWidth}"${strokeDash ? ' stroke-dasharray="8 4"' : ''}`
    : '';

  const gradDef = fillType === 'gradient'
    ? `<defs><linearGradient id="${gid}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${gradientColor1}"/><stop offset="100%" stop-color="${gradientColor2}"/></linearGradient></defs>`
    : '';

  const inner = getShapeSVGElement(shapeType, w, h, fillAttr, strokeParts);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} dangerouslySetInnerHTML={{ __html: gradDef + inner }} />
  );
}

// ─── Layer Renderer ─────────────────────────────────────────────────────────

function LayerElement({
  layer, selected, onSelect, onDragStart,
}: {
  layer: AnyLayer;
  selected: boolean;
  onSelect: (id: string) => void;
  onDragStart: (e: React.MouseEvent, id: string) => void;
}) {
  if (!layer.visible) return null;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: layer.x,
    top: layer.y,
    width: layer.width,
    height: layer.height,
    transform: `rotate(${layer.rotation}deg)${layer.flipX ? ' scaleX(-1)' : ''}${layer.flipY ? ' scaleY(-1)' : ''}`,
    opacity: layer.opacity,
    cursor: layer.locked ? 'default' : 'move',
    userSelect: 'none',
    boxSizing: 'border-box',
    outline: selected ? '2px solid #3B82F6' : 'none',
    outlineOffset: '1px',
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (layer.locked) return;
    e.stopPropagation();
    onSelect(layer.id);
    onDragStart(e, layer.id);
  };

  if (layer.type === 'text') {
    const tl = layer as TextLayer;
    const text = applyTextTransform(tl.content, tl.textTransform);
    const shadow = tl.shadow
      ? `${tl.shadowX}px ${tl.shadowY}px ${tl.shadowBlur}px ${tl.shadowColor}`
      : undefined;
    const gradStyle: React.CSSProperties = tl.useGradient ? {
      background: `linear-gradient(90deg, ${tl.gradientColor1}, ${tl.gradientColor2})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    } : { color: tl.color };
    return (
      <div style={style} onMouseDown={handleMouseDown}>
        <span style={{
          fontFamily: tl.fontFamily,
          fontSize: tl.fontSize,
          fontWeight: tl.fontWeight,
          fontStyle: tl.fontStyle,
          textAlign: tl.textAlign,
          letterSpacing: tl.letterSpacing,
          lineHeight: tl.lineHeight,
          textTransform: tl.textTransform as any,
          textDecoration: tl.textDecoration,
          textShadow: shadow,
          display: 'block',
          width: '100%',
          whiteSpace: 'nowrap',
          ...gradStyle,
        }}>{text || 'Text'}</span>
      </div>
    );
  }

  if (layer.type === 'icon') {
    const il = layer as IconLayer;
    const iconDef = ICONS.find(i => i.id === il.iconId);
    if (!iconDef) return null;
    const shadow = il.shadow ? { filter: `drop-shadow(${il.shadowX}px ${il.shadowY}px ${il.shadowBlur}px ${il.shadowColor})` } : {};
    return (
      <div style={{ ...style, ...shadow }} onMouseDown={handleMouseDown}>
        <svg
          viewBox={iconDef.viewBox}
          width="100%"
          height="100%"
          style={{ display: 'block', color: il.fill }}
          dangerouslySetInnerHTML={{ __html: iconDef.svg }}
        />
      </div>
    );
  }

  if (layer.type === 'shape') {
    const sl = layer as ShapeLayer;
    const shadow = sl.shadow ? { filter: `drop-shadow(${sl.shadowX}px ${sl.shadowY}px ${sl.shadowBlur}px ${sl.shadowColor})` } : {};
    return (
      <div style={{ ...style, ...shadow }} onMouseDown={handleMouseDown}>
        <ShapeSVG layer={sl} />
      </div>
    );
  }

  if (layer.type === 'image') {
    const il = layer as ImageLayer;
    const shadow = il.shadow ? { filter: `drop-shadow(${il.shadowX}px ${il.shadowY}px ${il.shadowBlur}px ${il.shadowColor})` } : {};
    return (
      <div style={{ ...style, ...shadow, borderRadius: il.borderRadius }} onMouseDown={handleMouseDown}>
        <img
          src={il.src}
          alt="layer"
          style={{ width: '100%', height: '100%', objectFit: il.objectFit, borderRadius: il.borderRadius, display: 'block' }}
        />
      </div>
    );
  }

  return null;
}

// ─── Canvas Area ─────────────────────────────────────────────────────────────

function CanvasArea({
  design, selectedId, setSelectedId, updateLayer,
}: {
  design: ReturnType<typeof useLogoState>['design'];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  updateLayer: (id: string, updates: Partial<AnyLayer>) => void;
}) {
  const { canvasSize, background, layers } = design;
  const containerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    id: string; startX: number; startY: number; origX: number; origY: number;
  } | null>(null);

  const handleDragStart = useCallback((e: React.MouseEvent, id: string) => {
    const layer = design.layers.find(l => l.id === id);
    if (!layer) return;
    dragState.current = { id, startX: e.clientX, startY: e.clientY, origX: layer.x, origY: layer.y };
  }, [design.layers]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    updateLayer(dragState.current.id, {
      x: Math.round(dragState.current.origX + dx),
      y: Math.round(dragState.current.origY + dy),
    } as Partial<AnyLayer>);
  }, [updateLayer]);

  const handleMouseUp = useCallback(() => {
    dragState.current = null;
  }, []);

  const checkered: React.CSSProperties = background.type === 'transparent' ? {
    backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
  } : {};

  return (
    <div
      id="logo-canvas"
      ref={containerRef}
      style={{
        position: 'relative',
        width: canvasSize.width,
        height: canvasSize.height,
        flexShrink: 0,
        boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
        overflow: 'hidden',
        ...bgStyle(background),
        ...checkered,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseDown={() => setSelectedId(null)}
    >
      {layers.map(layer => (
        <LayerElement
          key={layer.id}
          layer={layer}
          selected={selectedId === layer.id}
          onSelect={setSelectedId}
          onDragStart={handleDragStart}
        />
      ))}
    </div>
  );
}

// ─── Color Picker ─────────────────────────────────────────────────────────────

function ColorPicker({ value, onChange, label }: { value: string; onChange: (v: string) => void; label?: string }) {
  return (
    <div>
      {label && <label className="block text-xs text-slate-500 mb-1">{label}</label>}
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="w-8 h-8 rounded-lg border-2 border-slate-200 cursor-pointer shadow-sm" style={{ background: value }} />
          <input
            type="color"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 text-xs font-mono border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/40"
        />
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        {COLOR_SWATCHES.slice(0, 20).map(sw => (
          <button
            key={sw.hex}
            title={sw.name}
            className="w-5 h-5 rounded-md border border-white/50 shadow-sm hover:scale-110 transition-transform"
            style={{ background: sw.hex }}
            onClick={() => onChange(sw.hex)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Left Panel ───────────────────────────────────────────────────────────────

function LeftPanel({
  activeTab, setActiveTab, addLayer, loadTemplate,
  selectedLayer, updateLayer, design, setBackground,
  uploadedImages, onUploadImage, deleteLayer, canvasSize,
}: {
  activeTab: LeftTab;
  setActiveTab: (t: LeftTab) => void;
  addLayer: (l: AnyLayer) => void;
  loadTemplate: ReturnType<typeof useLogoState>['loadTemplate'];
  selectedLayer: AnyLayer | null;
  updateLayer: ReturnType<typeof useLogoState>['updateLayer'];
  design: ReturnType<typeof useLogoState>['design'];
  setBackground: ReturnType<typeof useLogoState>['setBackground'];
  uploadedImages: string[];
  onUploadImage: (src: string) => void;
  deleteLayer: (id: string) => void;
  canvasSize: { width: number; height: number };
}) {
  const [iconSearch, setIconSearch] = useState('');
  const [iconCat, setIconCat] = useState('All');
  const [tmplCat, setTmplCat] = useState('All');
  const [shapeCat, setShapeCat] = useState('All');

  const filteredIcons = ICONS.filter(icon => {
    const matchCat = iconCat === 'All' || icon.category === iconCat;
    const matchSearch = !iconSearch || icon.name.toLowerCase().includes(iconSearch.toLowerCase()) || icon.keywords.some(k => k.includes(iconSearch.toLowerCase()));
    return matchCat && matchSearch;
  });

  const filteredTemplates = TEMPLATES.filter(t => tmplCat === 'All' || t.category === tmplCat);

  const addText = (heading: boolean) => {
    addLayer({
      id: uid(), type: 'text', name: heading ? 'Heading' : 'Subtext',
      x: 50, y: heading ? 180 : 260,
      width: 400, height: heading ? 70 : 40,
      rotation: 0, opacity: 1, visible: true, locked: false, flipX: false, flipY: false,
      content: heading ? 'BRAND NAME' : 'Your tagline here',
      fontFamily: 'Poppins', fontSize: heading ? 42 : 18, fontWeight: heading ? '700' : '400',
      fontStyle: 'normal', textAlign: 'center', color: '#1C1C1C',
      letterSpacing: heading ? 3 : 0, lineHeight: 1.2,
      textTransform: heading ? 'uppercase' : 'none',
      shadow: false, shadowColor: '#00000040', shadowX: 2, shadowY: 2, shadowBlur: 4,
      useGradient: false, gradientColor1: '#1A73E8', gradientColor2: '#9B59B6',
      textDecoration: 'none',
    } as TextLayer);
  };

  const addIcon = (iconId: string) => {
    addLayer({
      id: uid(), type: 'icon', name: ICONS.find(i => i.id === iconId)?.name ?? 'Icon',
      x: 175, y: 100, width: 150, height: 150,
      rotation: 0, opacity: 1, visible: true, locked: false, flipX: false, flipY: false,
      iconId, fill: '#1A73E8', stroke: 'none', strokeWidth: 0,
      shadow: false, shadowColor: '#00000040', shadowX: 3, shadowY: 3, shadowBlur: 6,
    } as IconLayer);
  };

  const addShape = (shapeType: ShapeLayer['shapeType']) => {
    addLayer({
      id: uid(), type: 'shape', name: shapeType,
      x: 175, y: 100, width: 150, height: 150,
      rotation: 0, opacity: 1, visible: true, locked: false, flipX: false, flipY: false,
      shapeType, fill: '#1A73E8', stroke: 'none', strokeWidth: 0, strokeDash: false, cornerRadius: 0,
      fillType: 'solid', gradientColor1: '#1A73E8', gradientColor2: '#48CAE4', gradientAngle: 135,
      shadow: false, shadowColor: '#00000040', shadowX: 4, shadowY: 4, shadowBlur: 8,
    } as ShapeLayer);
  };

  const TABS: { id: LeftTab; icon: React.FC<{ size?: number }>; label: string }[] = [
    { id: 'templates', icon: LayoutTemplate, label: 'Templates' },
    { id: 'icons', icon: ImageIcon, label: 'Icons' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'shapes', icon: Shapes, label: 'Shapes' },
    { id: 'colors', icon: Palette, label: 'Colors' },
    { id: 'upload', icon: Upload, label: 'Upload' },
    { id: 'tools', icon: Wrench, label: 'Tools' },
  ];

  return (
    <div className="flex h-full border-r border-slate-200">
      {/* Tab strip */}
      <div className="w-14 flex flex-col items-center pt-2 gap-1 bg-slate-50 border-r border-slate-200">
        {TABS.map(tab => (
          <button
            key={tab.id}
            title={tab.label}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-0.5 p-2 rounded-xl w-12 transition-all text-[9px] font-medium ${activeTab === tab.id ? 'bg-primary text-white shadow' : 'text-slate-500 hover:bg-slate-200'}`}
          >
            <tab.icon size={16} />
            <span>{tab.label.slice(0, 4)}</span>
          </button>
        ))}
      </div>

      {/* Panel content */}
      <div className="w-56 overflow-y-auto p-3 space-y-3">
        {/* Templates */}
        {activeTab === 'templates' && (
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-2">Logo Templates</p>
            <div className="flex gap-1 flex-wrap mb-2">
              {['All', ...TEMPLATE_CATEGORIES].map(c => (
                <button key={c} onClick={() => setTmplCat(c)}
                  className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${tmplCat === c ? 'bg-primary text-white border-primary' : 'border-slate-300 text-slate-600 hover:border-primary/50'}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {filteredTemplates.map(tpl => (
                <button key={tpl.id}
                  onClick={() => loadTemplate(tpl.design)}
                  className="rounded-xl overflow-hidden border-2 border-slate-200 hover:border-primary/60 transition-all hover:shadow-md group">
                  {/* Mini preview */}
                  <div className="w-full aspect-square flex items-center justify-center text-[9px] font-bold relative overflow-hidden"
                    style={{ ...bgStyle(tpl.design.background) }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {tpl.design.layers.filter(l => l.type === 'text').slice(0, 1).map(l => {
                        const tl = l as TextLayer;
                        return (
                          <span key={l.id} style={{ color: tl.color, fontFamily: tl.fontFamily, fontWeight: tl.fontWeight, fontSize: 9, textTransform: tl.textTransform as any }}>
                            {applyTextTransform(tl.content, tl.textTransform).slice(0, 8)}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="p-1 bg-white text-[9px] text-slate-600 text-center">{tpl.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Icons */}
        {activeTab === 'icons' && (
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-2">Icon Library</p>
            <div className="relative mb-2">
              <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={iconSearch} onChange={e => setIconSearch(e.target.value)} placeholder="Search icons..."
                className="w-full pl-6 pr-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/40" />
            </div>
            <div className="flex gap-1 flex-wrap mb-2">
              {['All', ...ICON_CATEGORIES].map(c => (
                <button key={c} onClick={() => setIconCat(c)}
                  className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${iconCat === c ? 'bg-primary text-white border-primary' : 'border-slate-300 text-slate-600 hover:border-primary/50'}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-1">
              {filteredIcons.map(icon => (
                <button key={icon.id} title={icon.name}
                  onClick={() => addIcon(icon.id)}
                  className="p-2 rounded-xl border border-slate-200 hover:border-primary/60 hover:bg-primary/5 transition-all group">
                  <svg viewBox={icon.viewBox} className="w-full h-6 text-slate-700 group-hover:text-primary"
                    dangerouslySetInnerHTML={{ __html: icon.svg }} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Text */}
        {activeTab === 'text' && (
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-2">Add Text</p>
            <button onClick={() => addText(true)}
              className="w-full flex items-center gap-2 p-2.5 rounded-xl border-2 border-dashed border-slate-300 hover:border-primary/60 hover:bg-primary/5 transition-all mb-2">
              <Type size={14} className="text-primary" />
              <div className="text-left">
                <div className="text-xs font-bold text-slate-700">Add Heading</div>
                <div className="text-[10px] text-slate-500">Brand name, title</div>
              </div>
            </button>
            <button onClick={() => addText(false)}
              className="w-full flex items-center gap-2 p-2.5 rounded-xl border-2 border-dashed border-slate-300 hover:border-primary/60 hover:bg-primary/5 transition-all mb-3">
              <Type size={12} className="text-slate-500" />
              <div className="text-left">
                <div className="text-xs font-medium text-slate-700">Add Subtext</div>
                <div className="text-[10px] text-slate-500">Tagline, descriptor</div>
              </div>
            </button>
            <p className="text-xs font-semibold text-slate-700 mb-2">Fonts</p>
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {FONTS.map(f => (
                <button key={f.name}
                  onClick={() => addLayer({
                    id: uid(), type: 'text', name: f.name,
                    x: 50, y: 200, width: 400, height: 60,
                    rotation: 0, opacity: 1, visible: true, locked: false, flipX: false, flipY: false,
                    content: 'Sample Text', fontFamily: f.name, fontSize: 36, fontWeight: '700',
                    fontStyle: 'normal', textAlign: 'center', color: '#1C1C1C',
                    letterSpacing: 1, lineHeight: 1.2, textTransform: 'none',
                    shadow: false, shadowColor: '#00000040', shadowX: 2, shadowY: 2, shadowBlur: 4,
                    useGradient: false, gradientColor1: '#1A73E8', gradientColor2: '#9B59B6',
                    textDecoration: 'none',
                  } as TextLayer)}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                  <span style={{ fontFamily: f.name }} className="text-sm">{f.name}</span>
                  <span className="text-[9px] text-slate-400 ml-1">— {f.bestFor}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Shapes */}
        {activeTab === 'shapes' && (
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-2">Shapes & Elements</p>
            <div className="flex gap-1 flex-wrap mb-2">
              {['All', ...SHAPE_CATEGORIES].map(c => (
                <button key={c} onClick={() => setShapeCat(c)}
                  className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${shapeCat === c ? 'bg-primary text-white border-primary' : 'border-slate-300 text-slate-600 hover:border-primary/50'}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(shapeCat === 'All' ? SHAPE_ITEMS : SHAPE_ITEMS.filter(s => s.category === shapeCat)).map(s => (
                <button key={s.id} onClick={() => addShape(s.id)}
                  className="p-2 rounded-xl border border-slate-200 hover:border-primary/60 hover:bg-primary/5 transition-all flex flex-col items-center gap-1">
                  <div className="w-8 h-8 flex items-center justify-center overflow-hidden">
                    <ShapeSVG layer={{ id: s.id, type: 'shape', name: s.name, x: 0, y: 0, width: 32, height: 32, rotation: 0, opacity: 1, visible: true, locked: false, flipX: false, flipY: false, shapeType: s.id, fill: '#1A73E8', stroke: 'none', strokeWidth: 0, strokeDash: false, cornerRadius: 0, fillType: 'solid', gradientColor1: '#1A73E8', gradientColor2: '#48CAE4', gradientAngle: 135, shadow: false, shadowColor: '#000', shadowX: 0, shadowY: 0, shadowBlur: 0 }} />
                  </div>
                  <span className="text-[9px] text-slate-600 text-center leading-tight">{s.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Background Colors */}
        {activeTab === 'colors' && (
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-2">Color Palette</p>
            <div className="flex flex-wrap gap-1">
              {COLOR_SWATCHES.map(sw => (
                <button key={sw.hex} title={sw.name}
                  className="w-6 h-6 rounded-md border-2 border-white shadow-sm hover:scale-110 transition-transform"
                  style={{ background: sw.hex }}
                  onClick={() => {
                    if (selectedLayer) {
                      if (selectedLayer.type === 'text') updateLayer(selectedLayer.id, { color: sw.hex } as Partial<TextLayer>);
                      else if (selectedLayer.type === 'icon') updateLayer(selectedLayer.id, { fill: sw.hex } as Partial<IconLayer>);
                      else if (selectedLayer.type === 'shape') updateLayer(selectedLayer.id, { fill: sw.hex, fillType: 'solid' } as Partial<ShapeLayer>);
                    } else {
                      setBackground({ ...design.background, type: 'solid', color: sw.hex });
                    }
                  }}
                />
              ))}
            </div>
            <p className="text-xs font-semibold text-slate-700 mt-3 mb-2">Gradient Presets</p>
            <div className="grid grid-cols-2 gap-1">
              {GRADIENT_PRESETS.map(g => (
                <button key={g.name} title={g.name}
                  className="h-8 rounded-lg border border-white/40 shadow-sm text-[9px] font-medium text-white/90 hover:scale-105 transition-transform overflow-hidden"
                  style={{ background: `linear-gradient(${g.angle}deg, ${g.color1}, ${g.color2})` }}
                  onClick={() => {
                    if (selectedLayer) {
                      if (selectedLayer.type === 'shape') updateLayer(selectedLayer.id, { fillType: 'gradient', gradientColor1: g.color1, gradientColor2: g.color2, gradientAngle: g.angle } as Partial<ShapeLayer>);
                      else if (selectedLayer.type === 'text') updateLayer(selectedLayer.id, { useGradient: true, gradientColor1: g.color1, gradientColor2: g.color2 } as Partial<TextLayer>);
                    } else {
                      setBackground({ ...design.background, type: 'gradient', gradientColor1: g.color1, gradientColor2: g.color2, gradientAngle: g.angle, gradientType: g.type ?? 'linear' });
                    }
                  }}>
                  <span className="drop-shadow">{g.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Upload */}
        {activeTab === 'upload' && (
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-2">Upload Image</p>
            <label className="w-full flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-primary/60 hover:bg-primary/5 transition-all cursor-pointer mb-3">
              <Upload size={20} className="text-primary" />
              <div className="text-center">
                <div className="text-xs font-medium text-slate-700">Click to upload</div>
                <div className="text-[10px] text-slate-500">PNG, JPG, SVG, WEBP</div>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={e => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = evt => {
                  const src = evt.target?.result as string;
                  if (src) onUploadImage(src);
                };
                reader.readAsDataURL(file);
                e.target.value = '';
              }} />
            </label>
            {uploadedImages.length > 0 && (
              <div>
                <p className="text-[10px] text-slate-500 mb-1">Click image to add to canvas</p>
                <div className="grid grid-cols-2 gap-2">
                  {uploadedImages.map((src, i) => (
                    <button key={i} onClick={() => addLayer({
                      id: uid(), type: 'image', name: `Image ${i+1}`,
                      x: 50, y: 50, width: 200, height: 200,
                      rotation: 0, opacity: 1, visible: true, locked: false, flipX: false, flipY: false,
                      src, objectFit: 'contain', borderRadius: 0,
                      shadow: false, shadowColor: '#00000040', shadowX: 4, shadowY: 4, shadowBlur: 8,
                    } as ImageLayer)}
                      className="rounded-xl overflow-hidden border-2 border-slate-200 hover:border-primary/60 transition-all">
                      <img src={src} alt={`img ${i}`} className="w-full h-20 object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
            {uploadedImages.length === 0 && (
              <p className="text-[10px] text-slate-400 text-center">No images uploaded yet</p>
            )}
          </div>
        )}

        {/* Tools */}
        {activeTab === 'tools' && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-700">Quick Actions</p>

            {/* Alignment */}
            {selectedLayer && (
              <div>
                <p className="text-[10px] text-slate-500 mb-1 font-medium">Align Layer</p>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { label: '←', title: 'Align Left', action: () => updateLayer(selectedLayer.id, { x: 0 } as Partial<AnyLayer>) },
                    { label: '↔', title: 'Center H', action: () => updateLayer(selectedLayer.id, { x: Math.round((canvasSize.width - selectedLayer.width) / 2) } as Partial<AnyLayer>) },
                    { label: '→', title: 'Align Right', action: () => updateLayer(selectedLayer.id, { x: canvasSize.width - selectedLayer.width } as Partial<AnyLayer>) },
                    { label: '↑', title: 'Align Top', action: () => updateLayer(selectedLayer.id, { y: 0 } as Partial<AnyLayer>) },
                    { label: '↕', title: 'Center V', action: () => updateLayer(selectedLayer.id, { y: Math.round((canvasSize.height - selectedLayer.height) / 2) } as Partial<AnyLayer>) },
                    { label: '↓', title: 'Align Bottom', action: () => updateLayer(selectedLayer.id, { y: canvasSize.height - selectedLayer.height } as Partial<AnyLayer>) },
                  ].map(a => (
                    <button key={a.title} title={a.title} onClick={a.action}
                      className="py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-primary/5 hover:border-primary/50 transition-colors">
                      {a.label}
                    </button>
                  ))}
                </div>
                <div className="mt-1">
                  <p className="text-[10px] text-slate-500 mb-1">Center on Canvas</p>
                  <button onClick={() => updateLayer(selectedLayer.id, {
                    x: Math.round((canvasSize.width - selectedLayer.width) / 2),
                    y: Math.round((canvasSize.height - selectedLayer.height) / 2),
                  } as Partial<AnyLayer>)}
                    className="w-full py-1 text-xs rounded-lg border border-slate-200 hover:bg-primary/5 hover:border-primary/50 transition-colors">
                    Center Both
                  </button>
                </div>
                <div className="mt-1">
                  <p className="text-[10px] text-slate-500 mb-1">Opacity: {Math.round(selectedLayer.opacity * 100)}%</p>
                  <input type="range" min={0} max={1} step={0.01} value={selectedLayer.opacity}
                    onChange={e => updateLayer(selectedLayer.id, { opacity: Number(e.target.value) } as Partial<AnyLayer>)}
                    className="w-full accent-primary" />
                </div>
                <div className="mt-1">
                  <p className="text-[10px] text-slate-500 mb-1">Rotation: {selectedLayer.rotation}°</p>
                  <input type="range" min={-180} max={180} value={selectedLayer.rotation}
                    onChange={e => updateLayer(selectedLayer.id, { rotation: Number(e.target.value) } as Partial<AnyLayer>)}
                    className="w-full accent-primary" />
                </div>
                <div className="flex gap-1 mt-1">
                  <button onClick={() => updateLayer(selectedLayer.id, { flipX: !selectedLayer.flipX } as Partial<AnyLayer>)}
                    className="flex-1 py-1 text-xs rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">⇄ Flip H</button>
                  <button onClick={() => updateLayer(selectedLayer.id, { flipY: !selectedLayer.flipY } as Partial<AnyLayer>)}
                    className="flex-1 py-1 text-xs rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">⇅ Flip V</button>
                </div>
              </div>
            )}

            {/* Quick Add */}
            <div>
              <p className="text-[10px] text-slate-500 mb-1 font-medium">Quick Add</p>
              <div className="space-y-1">
                {[
                  { label: '+ Heading Text', action: () => { addLayer({ id: uid(), type: 'text', name: 'Heading', x: 50, y: 180, width: 400, height: 70, rotation: 0, opacity: 1, visible: true, locked: false, flipX: false, flipY: false, content: 'BRAND NAME', fontFamily: 'Poppins', fontSize: 42, fontWeight: '700', fontStyle: 'normal', textAlign: 'center', color: '#1C1C1C', letterSpacing: 3, lineHeight: 1.2, textTransform: 'uppercase', shadow: false, shadowColor: '#00000040', shadowX: 2, shadowY: 2, shadowBlur: 4, useGradient: false, gradientColor1: '#1A73E8', gradientColor2: '#9B59B6', textDecoration: 'none' } as TextLayer); } },
                  { label: '+ Subtext', action: () => { addLayer({ id: uid(), type: 'text', name: 'Subtext', x: 50, y: 260, width: 400, height: 40, rotation: 0, opacity: 1, visible: true, locked: false, flipX: false, flipY: false, content: 'Your tagline here', fontFamily: 'Inter', fontSize: 18, fontWeight: '400', fontStyle: 'normal', textAlign: 'center', color: '#666666', letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', shadow: false, shadowColor: '#00000040', shadowX: 2, shadowY: 2, shadowBlur: 4, useGradient: false, gradientColor1: '#1A73E8', gradientColor2: '#9B59B6', textDecoration: 'none' } as TextLayer); } },
                  { label: '+ Circle Shape', action: () => { addLayer({ id: uid(), type: 'shape', name: 'circle', x: 175, y: 100, width: 150, height: 150, rotation: 0, opacity: 1, visible: true, locked: false, flipX: false, flipY: false, shapeType: 'circle', fill: '#1A73E8', stroke: 'none', strokeWidth: 0, strokeDash: false, cornerRadius: 0, fillType: 'solid', gradientColor1: '#1A73E8', gradientColor2: '#48CAE4', gradientAngle: 135, shadow: false, shadowColor: '#00000040', shadowX: 4, shadowY: 4, shadowBlur: 8 } as ShapeLayer); } },
                  { label: '+ H. Line', action: () => { addLayer({ id: uid(), type: 'shape', name: 'line-h', x: 50, y: 240, width: 400, height: 20, rotation: 0, opacity: 1, visible: true, locked: false, flipX: false, flipY: false, shapeType: 'line-h', fill: '#CCCCCC', stroke: 'none', strokeWidth: 0, strokeDash: false, cornerRadius: 0, fillType: 'solid', gradientColor1: '#CCC', gradientColor2: '#999', gradientAngle: 0, shadow: false, shadowColor: '#000', shadowX: 0, shadowY: 0, shadowBlur: 0 } as ShapeLayer); } },
                ].map(item => (
                  <button key={item.label} onClick={item.action}
                    className="w-full text-left px-2 py-1.5 text-xs rounded-lg border border-slate-200 hover:bg-primary/5 hover:border-primary/50 transition-colors">
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {!selectedLayer && (
              <p className="text-[10px] text-slate-400 italic text-center">Select a layer to see alignment tools</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Right Properties Panel ───────────────────────────────────────────────────

function RightPanel({
  selectedLayer, updateLayer, deleteLayer, duplicateLayer, moveLayerUp, moveLayerDown,
  design, setBackground, setCanvasSize,
}: {
  selectedLayer: AnyLayer | null;
  updateLayer: ReturnType<typeof useLogoState>['updateLayer'];
  deleteLayer: ReturnType<typeof useLogoState>['deleteLayer'];
  duplicateLayer: ReturnType<typeof useLogoState>['duplicateLayer'];
  moveLayerUp: ReturnType<typeof useLogoState>['moveLayerUp'];
  moveLayerDown: ReturnType<typeof useLogoState>['moveLayerDown'];
  design: ReturnType<typeof useLogoState>['design'];
  setBackground: ReturnType<typeof useLogoState>['setBackground'];
  setCanvasSize: ReturnType<typeof useLogoState>['setCanvasSize'];
}) {
  const bg = design.background;

  if (!selectedLayer) {
    // Canvas settings
    return (
      <div className="w-64 border-l border-slate-200 overflow-y-auto p-4 space-y-4">
        <div>
          <p className="text-xs font-semibold text-slate-700 mb-2">Canvas Size</p>
          <select
            value={design.canvasSize.id}
            onChange={e => {
              const s = CANVAS_SIZES.find(c => c.id === e.target.value);
              if (s) setCanvasSize(s);
            }}
            className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/40"
          >
            {CANVAS_SIZES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-700 mb-2">Background Type</p>
          <div className="flex gap-1">
            {(['solid', 'gradient', 'transparent'] as const).map(t => (
              <button key={t} onClick={() => setBackground({ ...bg, type: t })}
                className={`flex-1 text-[10px] py-1 rounded-lg border transition-colors ${bg.type === t ? 'bg-primary text-white border-primary' : 'border-slate-200 text-slate-600 hover:border-primary/40'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        {bg.type === 'solid' && (
          <ColorPicker value={bg.color} onChange={c => setBackground({ ...bg, color: c })} label="Background Color" />
        )}
        {bg.type === 'gradient' && (
          <div className="space-y-3">
            <ColorPicker value={bg.gradientColor1} onChange={c => setBackground({ ...bg, gradientColor1: c })} label="Color 1" />
            <ColorPicker value={bg.gradientColor2} onChange={c => setBackground({ ...bg, gradientColor2: c })} label="Color 2" />
            <div>
              <label className="block text-xs text-slate-500 mb-1">Angle: {bg.gradientAngle}°</label>
              <input type="range" min={0} max={360} value={bg.gradientAngle}
                onChange={e => setBackground({ ...bg, gradientAngle: Number(e.target.value) })}
                className="w-full accent-primary" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Type</label>
              <div className="flex gap-1">
                {(['linear', 'radial'] as const).map(t => (
                  <button key={t} onClick={() => setBackground({ ...bg, gradientType: t })}
                    className={`flex-1 text-[10px] py-1 rounded-lg border ${bg.gradientType === t ? 'bg-primary text-white border-primary' : 'border-slate-200 text-slate-600'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-700 mb-1">Gradient Presets</p>
            <div className="grid grid-cols-2 gap-1 max-h-40 overflow-y-auto">
              {GRADIENT_PRESETS.map(g => (
                <button key={g.name}
                  onClick={() => setBackground({ ...bg, type: 'gradient', gradientColor1: g.color1, gradientColor2: g.color2, gradientAngle: g.angle, gradientType: g.type })}
                  className="h-7 rounded-lg text-[9px] text-white/90 font-medium shadow-sm hover:scale-105 transition-transform"
                  style={{ background: `linear-gradient(${g.angle}deg, ${g.color1}, ${g.color2})` }}>
                  {g.name}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500 italic">Click any element on the canvas to edit its properties.</p>
        </div>
      </div>
    );
  }

  const l = selectedLayer;
  const upd = (updates: Partial<AnyLayer>) => updateLayer(l.id, updates);

  return (
    <div className="w-64 border-l border-slate-200 overflow-y-auto p-3 space-y-3">
      {/* Layer actions */}
      <div>
        <p className="text-xs font-semibold text-slate-700 mb-2 capitalize">{l.type} Properties</p>
        <div className="flex gap-1 flex-wrap">
          <button title="Move Up" onClick={() => moveLayerUp(l.id)} className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"><ChevronUp size={12} /></button>
          <button title="Move Down" onClick={() => moveLayerDown(l.id)} className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"><ChevronDown size={12} /></button>
          <button title="Duplicate" onClick={() => duplicateLayer(l.id)} className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"><Copy size={12} /></button>
          <button title="Toggle Visibility" onClick={() => upd({ visible: !l.visible } as Partial<AnyLayer>)} className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">{l.visible ? <Eye size={12} /> : <EyeOff size={12} />}</button>
          <button title="Toggle Lock" onClick={() => upd({ locked: !l.locked } as Partial<AnyLayer>)} className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">{l.locked ? <Lock size={12} /> : <Unlock size={12} />}</button>
          <button title="Flip H" onClick={() => upd({ flipX: !l.flipX } as Partial<AnyLayer>)} className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"><FlipHorizontal size={12} /></button>
          <button title="Flip V" onClick={() => upd({ flipY: !l.flipY } as Partial<AnyLayer>)} className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"><FlipVertical size={12} /></button>
          <button title="Delete" onClick={() => deleteLayer(l.id)} className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={12} /></button>
        </div>
      </div>

      {/* Position & Size */}
      <div>
        <p className="text-xs font-semibold text-slate-700 mb-1.5">Position & Size</p>
        <div className="grid grid-cols-2 gap-1.5">
          {([['X', 'x'], ['Y', 'y'], ['W', 'width'], ['H', 'height']] as [string, keyof AnyLayer][]).map(([lbl, key]) => (
            <div key={key}>
              <label className="text-[10px] text-slate-500">{lbl}</label>
              <input type="number" value={Math.round(l[key] as number)}
                onChange={e => upd({ [key]: Number(e.target.value) } as Partial<AnyLayer>)}
                className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary/40" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-1.5 mt-1.5">
          <div>
            <label className="text-[10px] text-slate-500">Rotation °</label>
            <input type="number" value={l.rotation}
              onChange={e => upd({ rotation: Number(e.target.value) } as Partial<AnyLayer>)}
              className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary/40" />
          </div>
          <div>
            <label className="text-[10px] text-slate-500">Opacity %</label>
            <input type="number" min={0} max={1} step={0.01} value={l.opacity}
              onChange={e => upd({ opacity: Number(e.target.value) } as Partial<AnyLayer>)}
              className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary/40" />
          </div>
        </div>
      </div>

      {/* Text Properties */}
      {l.type === 'text' && (() => {
        const tl = l as TextLayer;
        return (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-700">Text</p>
            <textarea value={tl.content} rows={2}
              onChange={e => upd({ content: e.target.value } as Partial<AnyLayer>)}
              className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none" />
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">Font Family</label>
              <select value={tl.fontFamily} onChange={e => upd({ fontFamily: e.target.value } as Partial<AnyLayer>)}
                className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/40">
                {FONTS.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Size</label>
                <input type="number" value={tl.fontSize} onChange={e => upd({ fontSize: Number(e.target.value) } as Partial<AnyLayer>)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary/40" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Weight</label>
                <select value={tl.fontWeight} onChange={e => upd({ fontWeight: e.target.value } as Partial<AnyLayer>)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/40">
                  {['300', '400', '500', '600', '700', '800', '900'].map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => upd({ fontStyle: tl.fontStyle === 'italic' ? 'normal' : 'italic' } as Partial<AnyLayer>)}
                className={`flex-1 py-1 text-xs rounded-lg border transition-colors ${tl.fontStyle === 'italic' ? 'bg-primary text-white border-primary' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                <Italic size={10} className="inline" /> Italic
              </button>
              {(['left', 'center', 'right'] as const).map(align => (
                <button key={align} onClick={() => upd({ textAlign: align } as Partial<AnyLayer>)}
                  className={`p-1.5 rounded-lg border transition-colors ${tl.textAlign === align ? 'bg-primary text-white border-primary' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                  {align === 'left' ? <AlignLeft size={10} /> : align === 'center' ? <AlignCenter size={10} /> : <AlignRight size={10} />}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">Letter Spacing: {tl.letterSpacing}px</label>
              <input type="range" min={-5} max={20} value={tl.letterSpacing}
                onChange={e => upd({ letterSpacing: Number(e.target.value) } as Partial<AnyLayer>)}
                className="w-full accent-primary" />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">Transform</label>
              <select value={tl.textTransform} onChange={e => upd({ textTransform: e.target.value as any } as Partial<AnyLayer>)}
                className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/40">
                <option value="none">None</option>
                <option value="uppercase">UPPERCASE</option>
                <option value="lowercase">lowercase</option>
                <option value="capitalize">Capitalize</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="useGrad" checked={tl.useGradient} onChange={e => upd({ useGradient: e.target.checked } as Partial<AnyLayer>)} className="accent-primary" />
              <label htmlFor="useGrad" className="text-xs text-slate-600">Gradient Text</label>
            </div>
            {tl.useGradient ? (
              <div className="space-y-1">
                <ColorPicker value={tl.gradientColor1} onChange={c => upd({ gradientColor1: c } as Partial<AnyLayer>)} label="Color 1" />
                <ColorPicker value={tl.gradientColor2} onChange={c => upd({ gradientColor2: c } as Partial<AnyLayer>)} label="Color 2" />
              </div>
            ) : (
              <ColorPicker value={tl.color} onChange={c => upd({ color: c } as Partial<AnyLayer>)} label="Text Color" />
            )}
            <div className="flex items-center gap-2">
              <input type="checkbox" id="tShadow" checked={tl.shadow} onChange={e => upd({ shadow: e.target.checked } as Partial<AnyLayer>)} className="accent-primary" />
              <label htmlFor="tShadow" className="text-xs text-slate-600">Shadow</label>
            </div>
            {tl.shadow && (
              <div className="grid grid-cols-2 gap-1.5">
                <ColorPicker value={tl.shadowColor} onChange={c => upd({ shadowColor: c } as Partial<AnyLayer>)} label="Shadow Color" />
                {([['X', 'shadowX'], ['Y', 'shadowY'], ['Blur', 'shadowBlur']] as [string, keyof TextLayer][]).map(([lbl, k]) => (
                  <div key={k}>
                    <label className="text-[10px] text-slate-500">{lbl}</label>
                    <input type="number" value={tl[k] as number} onChange={e => upd({ [k]: Number(e.target.value) } as Partial<AnyLayer>)}
                      className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary/40" />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* Icon Properties */}
      {l.type === 'icon' && (() => {
        const il = l as IconLayer;
        return (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-700">Icon</p>
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">Current: {il.iconId}</label>
              <p className="text-[10px] text-slate-400">Click an icon in the Icons tab to replace</p>
            </div>
            <ColorPicker value={il.fill} onChange={c => upd({ fill: c } as Partial<AnyLayer>)} label="Fill Color" />
            <div className="flex items-center gap-2">
              <input type="checkbox" id="iShadow" checked={il.shadow} onChange={e => upd({ shadow: e.target.checked } as Partial<AnyLayer>)} className="accent-primary" />
              <label htmlFor="iShadow" className="text-xs text-slate-600">Shadow</label>
            </div>
            {il.shadow && (
              <div className="grid grid-cols-2 gap-1.5">
                <ColorPicker value={il.shadowColor} onChange={c => upd({ shadowColor: c } as Partial<AnyLayer>)} label="Shadow Color" />
                {([['X', 'shadowX'], ['Y', 'shadowY'], ['Blur', 'shadowBlur']] as [string, keyof IconLayer][]).map(([lbl, k]) => (
                  <div key={k}>
                    <label className="text-[10px] text-slate-500">{lbl}</label>
                    <input type="number" value={il[k] as number} onChange={e => upd({ [k]: Number(e.target.value) } as Partial<AnyLayer>)}
                      className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary/40" />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* Image Properties */}
      {l.type === 'image' && (() => {
        const il = l as ImageLayer;
        return (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-700">Image</p>
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">Object Fit</label>
              <div className="flex gap-1">
                {(['contain', 'cover', 'fill'] as const).map(f => (
                  <button key={f} onClick={() => upd({ objectFit: f } as Partial<AnyLayer>)}
                    className={`flex-1 text-[10px] py-1 rounded-lg border transition-colors ${il.objectFit === f ? 'bg-primary text-white border-primary' : 'border-slate-200 text-slate-600 hover:border-primary/40'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">Border Radius: {il.borderRadius}px</label>
              <input type="range" min={0} max={100} value={il.borderRadius}
                onChange={e => upd({ borderRadius: Number(e.target.value) } as Partial<AnyLayer>)}
                className="w-full accent-primary" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="iImgShadow" checked={il.shadow} onChange={e => upd({ shadow: e.target.checked } as Partial<AnyLayer>)} className="accent-primary" />
              <label htmlFor="iImgShadow" className="text-xs text-slate-600">Shadow</label>
            </div>
            {il.shadow && (
              <div className="grid grid-cols-2 gap-1.5">
                <ColorPicker value={il.shadowColor} onChange={c => upd({ shadowColor: c } as Partial<AnyLayer>)} label="Shadow Color" />
                {([['X', 'shadowX'], ['Y', 'shadowY'], ['Blur', 'shadowBlur']] as [string, keyof ImageLayer][]).map(([lbl, k]) => (
                  <div key={k}>
                    <label className="text-[10px] text-slate-500">{lbl}</label>
                    <input type="number" value={il[k] as number} onChange={e => upd({ [k]: Number(e.target.value) } as Partial<AnyLayer>)}
                      className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary/40" />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* Shape Properties */}
      {l.type === 'shape' && (() => {
        const sl = l as ShapeLayer;
        return (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-700">Shape</p>
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">Fill Type</label>
              <div className="flex gap-1">
                {(['solid', 'gradient', 'none'] as const).map(t => (
                  <button key={t} onClick={() => upd({ fillType: t } as Partial<AnyLayer>)}
                    className={`flex-1 text-[10px] py-1 rounded-lg border transition-colors ${sl.fillType === t ? 'bg-primary text-white border-primary' : 'border-slate-200 text-slate-600 hover:border-primary/40'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {sl.fillType !== 'none' && <ColorPicker value={sl.fill} onChange={c => upd({ fill: c } as Partial<AnyLayer>)} label="Fill Color" />}
            {sl.fillType === 'gradient' && (
              <ColorPicker value={sl.gradientColor2} onChange={c => upd({ gradientColor2: c } as Partial<AnyLayer>)} label="Gradient Color 2" />
            )}
            {sl.shapeType === 'rect' && (
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Corner Radius: {sl.cornerRadius}%</label>
                <input type="range" min={0} max={50} value={sl.cornerRadius}
                  onChange={e => upd({ cornerRadius: Number(e.target.value) } as Partial<AnyLayer>)}
                  className="w-full accent-primary" />
              </div>
            )}
            <ColorPicker value={sl.stroke === 'none' ? '#000000' : sl.stroke} onChange={c => upd({ stroke: c } as Partial<AnyLayer>)} label="Stroke Color" />
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">Stroke Width: {sl.strokeWidth}px</label>
              <input type="range" min={0} max={20} value={sl.strokeWidth}
                onChange={e => upd({ strokeWidth: Number(e.target.value), stroke: Number(e.target.value) > 0 ? sl.stroke : 'none' } as Partial<AnyLayer>)}
                className="w-full accent-primary" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="sDash" checked={sl.strokeDash} onChange={e => upd({ strokeDash: e.target.checked } as Partial<AnyLayer>)} className="accent-primary" />
              <label htmlFor="sDash" className="text-xs text-slate-600">Dashed stroke</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="sShadow" checked={sl.shadow} onChange={e => upd({ shadow: e.target.checked } as Partial<AnyLayer>)} className="accent-primary" />
              <label htmlFor="sShadow" className="text-xs text-slate-600">Shadow</label>
            </div>
            {sl.shadow && (
              <div className="grid grid-cols-2 gap-1.5">
                <ColorPicker value={sl.shadowColor} onChange={c => upd({ shadowColor: c } as Partial<AnyLayer>)} label="Shadow Color" />
                {([['X', 'shadowX'], ['Y', 'shadowY'], ['Blur', 'shadowBlur']] as [string, keyof ShapeLayer][]).map(([lbl, k]) => (
                  <div key={k}>
                    <label className="text-[10px] text-slate-500">{lbl}</label>
                    <input type="number" value={sl[k] as number} onChange={e => upd({ [k]: Number(e.target.value) } as Partial<AnyLayer>)}
                      className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary/40" />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}

// ─── Download Modal ───────────────────────────────────────────────────────────

function DownloadModal({
  onClose, design, fileName, setFileName,
}: {
  onClose: () => void;
  design: ReturnType<typeof useLogoState>['design'];
  fileName: string;
  setFileName: (s: string) => void;
}) {
  const { download } = useLogoDownload();
  const [format, setFormat] = useState<DownloadFormat>('png');
  const [scale, setScale] = useState(2);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await download(design, format, scale, fileName);
    } catch (err) {
      console.error(err);
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2"><FileDown size={16} /> Download Logo</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 transition-colors"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">File Name</label>
            <input value={fileName} onChange={e => setFileName(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">Format</label>
            <div className="grid grid-cols-4 gap-2">
              {(['png', 'jpg', 'svg', 'pdf'] as DownloadFormat[]).map(f => (
                <button key={f} onClick={() => setFormat(f)}
                  className={`py-2 rounded-xl text-sm font-medium border-2 transition-all uppercase ${format === f ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-600 hover:border-primary/40'}`}>
                  {f}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {format === 'png' && 'Lossless, supports transparency. Recommended.'}
              {format === 'jpg' && 'Smaller size, no transparency. Good for email.'}
              {format === 'svg' && 'Vector, infinitely scalable. Best for printing.'}
              {format === 'pdf' && 'Print-ready PDF. Perfect for professional printing.'}
            </p>
          </div>
          {format !== 'svg' && (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">Resolution</label>
              <div className="grid grid-cols-3 gap-1">
                {[{ s: 1, label: 'Standard', size: '500px' }, { s: 2, label: 'High', size: '1000px' }, { s: 4, label: 'Ultra', size: '2000px' }].map(o => (
                  <button key={o.s} onClick={() => setScale(o.s)}
                    className={`py-2 rounded-xl text-xs border-2 transition-all ${scale === o.s ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-600 hover:border-primary/40'}`}>
                    <div className="font-medium">{o.label}</div>
                    <div className="text-[9px] opacity-70">{o.size}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          <button onClick={handleDownload} disabled={downloading}
            className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
            {downloading ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Preparing...</> : <><Download size={14} />Download {format.toUpperCase()}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Layer List (bottom of canvas sidebar) ────────────────────────────────────

function LayerList({
  layers, selectedId, setSelectedId, deleteLayer, updateLayer,
}: {
  layers: AnyLayer[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  deleteLayer: (id: string) => void;
  updateLayer: (id: string, updates: Partial<AnyLayer>) => void;
}) {
  if (!layers.length) return null;
  return (
    <div className="border-t border-slate-200 bg-slate-50">
      <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Layers ({layers.length})</div>
      <div className="max-h-28 overflow-y-auto">
        {[...layers].reverse().map(layer => (
          <div key={layer.id}
            onClick={() => setSelectedId(selectedId === layer.id ? null : layer.id)}
            className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-slate-100 transition-colors ${selectedId === layer.id ? 'bg-primary/5 border-l-2 border-primary' : ''}`}>
            <span className="text-[10px] capitalize text-slate-500 w-8">{layer.type}</span>
            <span className="text-xs text-slate-700 flex-1 truncate">{layer.name}</span>
            <button onClick={e => { e.stopPropagation(); updateLayer(layer.id, { visible: !layer.visible } as Partial<AnyLayer>); }}
              className="p-0.5 text-slate-400 hover:text-slate-700">
              {layer.visible ? <Eye size={11} /> : <EyeOff size={11} />}
            </button>
            <button onClick={e => { e.stopPropagation(); deleteLayer(layer.id); }}
              className="p-0.5 text-slate-400 hover:text-red-500">
              <Trash2 size={11} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main LogoCreator Component ───────────────────────────────────────────────

export function LogoCreator() {
  const state = useLogoState();
  const {
    design, selectedId, selectedLayer, setSelectedId, canUndo, canRedo, undo, redo,
    addLayer, updateLayer, deleteLayer, duplicateLayer, moveLayerUp, moveLayerDown,
    setBackground, setCanvasSize, loadTemplate, clearCanvas,
  } = state;

  const [activeTab, setActiveTab] = useState<LeftTab>('templates');
  const [showDownload, setShowDownload] = useState(false);
  const [fileName, setFileName] = useState('my-logo');
  const [zoom, setZoom] = useState(1);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleUploadImage = useCallback((src: string) => { setUploadedImages(prev => [...prev, src]); }, []);

  // Load Google Fonts
  useEffect(() => {
    if (!document.getElementById('logo-creator-fonts')) {
      const link = document.createElement('link');
      link.id = 'logo-creator-fonts';
      link.rel = 'stylesheet';
      link.href = GOOGLE_FONTS_URL;
      document.head.appendChild(link);
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') { e.preventDefault(); undo(); }
        if (e.key === 'y') { e.preventDefault(); redo(); }
        if (e.key === 'd') { e.preventDefault(); if (selectedId) duplicateLayer(selectedId); }
        if (e.key === 's') { e.preventDefault(); /* autosave already running */ }
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        deleteLayer(selectedId);
      }
      if (e.key === 'Escape') setSelectedId(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [undo, redo, selectedId, deleteLayer, duplicateLayer, setSelectedId]);

  // When icon is clicked in Icons tab → if a layer is selected and it's an icon → replace icon
  const handleAddLayer = useCallback((layer: AnyLayer) => {
    if (layer.type === 'icon' && selectedLayer?.type === 'icon') {
      updateLayer(selectedLayer.id, { iconId: (layer as IconLayer).iconId } as Partial<AnyLayer>);
    } else {
      addLayer(layer);
    }
  }, [selectedLayer, addLayer, updateLayer]);

  const canvasWidth = design.canvasSize.width;
  const canvasHeight = design.canvasSize.height;

  return (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Top Bar */}
      <div className="h-12 border-b border-slate-200 bg-white flex items-center px-4 gap-2 flex-shrink-0">
        <span className="font-bold text-primary text-sm">Logo Creator</span>
        <div className="h-4 w-px bg-slate-200 mx-1" />

        {/* Undo / Redo */}
        <button onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)"
          className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors">
          <Undo2 size={15} />
        </button>
        <button onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)"
          className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors">
          <Redo2 size={15} />
        </button>

        <div className="h-4 w-px bg-slate-200 mx-1" />

        {/* Canvas Size */}
        <Monitor size={14} className="text-slate-400" />
        <select value={design.canvasSize.id} onChange={e => { const s = CANVAS_SIZES.find(c => c.id === e.target.value); if (s) setCanvasSize(s); }}
          className="text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary/40">
          {CANVAS_SIZES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>

        {/* Zoom */}
        <button onClick={() => setZoom(z => Math.max(0.25, z - 0.1))} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"><ZoomOut size={14} /></button>
        <span className="text-xs text-slate-500 w-10 text-center">{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(z => Math.min(3, z + 0.1))} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"><ZoomIn size={14} /></button>
        <button onClick={() => setZoom(1)} title="Reset zoom" className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"><RotateCcw size={13} /></button>

        <div className="flex-1" />

        {/* Clear */}
        <button onClick={() => { if (confirm('Clear canvas?')) clearCanvas(); }}
          className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors">
          Clear
        </button>

        {/* File name */}
        <input value={fileName} onChange={e => setFileName(e.target.value)}
          className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 w-28 focus:outline-none focus:ring-1 focus:ring-primary/40"
          placeholder="file name" />

        {/* Download */}
        <button onClick={() => setShowDownload(true)}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm">
          <Download size={14} /> Download
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <LeftPanel activeTab={activeTab} setActiveTab={setActiveTab} addLayer={handleAddLayer} loadTemplate={loadTemplate}
          selectedLayer={selectedLayer} updateLayer={updateLayer} design={design} setBackground={setBackground}
          uploadedImages={uploadedImages} onUploadImage={handleUploadImage}
          deleteLayer={deleteLayer} canvasSize={design.canvasSize} />

        {/* Center Canvas */}
        <div className="flex-1 overflow-auto bg-slate-100 flex flex-col">
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
              marginTop: 24,
              marginBottom: 24,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <CanvasArea
              design={design}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              updateLayer={updateLayer}
            />
          </div>
          <div style={{ height: Math.max(0, (canvasHeight * zoom - canvasHeight) / 2 + 48) }} />
          <LayerList
            layers={design.layers}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            deleteLayer={deleteLayer}
            updateLayer={updateLayer}
          />
        </div>

        {/* Right Properties Panel */}
        <RightPanel
          selectedLayer={selectedLayer}
          updateLayer={updateLayer}
          deleteLayer={deleteLayer}
          duplicateLayer={duplicateLayer}
          moveLayerUp={moveLayerUp}
          moveLayerDown={moveLayerDown}
          design={design}
          setBackground={setBackground}
          setCanvasSize={setCanvasSize}
        />
      </div>

      {/* Download Modal */}
      {showDownload && (
        <DownloadModal
          onClose={() => setShowDownload(false)}
          design={design}
          fileName={fileName}
          setFileName={setFileName}
        />
      )}
    </div>
  );
}
