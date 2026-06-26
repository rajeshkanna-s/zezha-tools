import { useCallback } from 'react';
import jsPDF from 'jspdf';
import type { LogoDesign, DownloadFormat, AnyLayer, TextLayer, IconLayer, ShapeLayer } from '../types';
import { ICONS } from '../data/icons';

function applyTextTransform(text: string, transform: string): string {
  if (transform === 'uppercase') return text.toUpperCase();
  if (transform === 'lowercase') return text.toLowerCase();
  if (transform === 'capitalize') return text.replace(/\b\w/g, c => c.toUpperCase());
  return text;
}

function getBackgroundCSS(design: LogoDesign): string {
  const bg = design.background;
  if (bg.type === 'transparent') return 'transparent';
  if (bg.type === 'gradient') {
    if (bg.gradientType === 'radial') {
      return `radial-gradient(circle, ${bg.gradientColor1}, ${bg.gradientColor2})`;
    }
    return `linear-gradient(${bg.gradientAngle}deg, ${bg.gradientColor1}, ${bg.gradientColor2})`;
  }
  return bg.color;
}

function buildSVGString(design: LogoDesign, scale = 1): string {
  const { width, height } = design.canvasSize;
  const w = width * scale;
  const h = height * scale;
  const bg = design.background;

  const defs: string[] = [];
  const elements: string[] = [];

  // Background
  if (bg.type === 'gradient') {
    const gId = 'bg-grad';
    if (bg.gradientType === 'radial') {
      defs.push(`<radialGradient id="${gId}"><stop offset="0%" stop-color="${bg.gradientColor1}"/><stop offset="100%" stop-color="${bg.gradientColor2}"/></radialGradient>`);
    } else {
      const rad = (bg.gradientAngle * Math.PI) / 180;
      const x2 = 50 + 50 * Math.cos(rad);
      const y2 = 50 + 50 * Math.sin(rad);
      defs.push(`<linearGradient id="${gId}" x1="0%" y1="0%" x2="${x2}%" y2="${y2}%"><stop offset="0%" stop-color="${bg.gradientColor1}"/><stop offset="100%" stop-color="${bg.gradientColor2}"/></linearGradient>`);
    }
    elements.push(`<rect width="${w}" height="${h}" fill="url(#${gId})"/>`);
  } else if (bg.type === 'solid') {
    elements.push(`<rect width="${w}" height="${h}" fill="${bg.color}"/>`);
  }

  // Layers
  design.layers.filter(l => l.visible).forEach(layer => {
    const x = layer.x * scale;
    const y = layer.y * scale;
    const lw = layer.width * scale;
    const lh = layer.height * scale;
    const cx = x + lw / 2;
    const cy = y + lh / 2;

    const scaleX = layer.flipX ? -1 : 1;
    const scaleY = layer.flipY ? -1 : 1;
    const transform = `translate(${cx},${cy}) rotate(${layer.rotation}) scale(${scaleX},${scaleY}) translate(${-lw / 2},${-lh / 2})`;
    const opacity = layer.opacity;

    if (layer.type === 'text') {
      const tl = layer as TextLayer;
      const text = applyTextTransform(tl.content, tl.textTransform);
      const fs = tl.fontSize * scale;
      const anchor = tl.textAlign === 'center' ? 'middle' : tl.textAlign === 'right' ? 'end' : 'start';
      const tx = tl.textAlign === 'center' ? lw / 2 : tl.textAlign === 'right' ? lw : 0;
      let fillAttr = tl.color;
      let gradEl = '';
      if (tl.useGradient) {
        const gid = `tg-${layer.id}`;
        gradEl = `<linearGradient id="${gid}" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="${tl.gradientColor1}"/><stop offset="100%" stop-color="${tl.gradientColor2}"/></linearGradient>`;
        defs.push(gradEl);
        fillAttr = `url(#${gid})`;
      }
      const shadow = tl.shadow ? `filter: drop-shadow(${tl.shadowX}px ${tl.shadowY}px ${tl.shadowBlur}px ${tl.shadowColor});` : '';
      elements.push(
        `<g transform="${transform}" opacity="${opacity}" style="${shadow}">` +
        `<text x="${tx}" y="${fs}" font-family="${tl.fontFamily}, sans-serif" font-size="${fs}" font-weight="${tl.fontWeight}" font-style="${tl.fontStyle}" fill="${fillAttr}" text-anchor="${anchor}" letter-spacing="${tl.letterSpacing * scale}">${text}</text>` +
        `</g>`
      );
    } else if (layer.type === 'icon') {
      const il = layer as IconLayer;
      const iconDef = ICONS.find(i => i.id === il.iconId);
      if (iconDef) {
        const shadow = il.shadow ? `filter: drop-shadow(${il.shadowX}px ${il.shadowY}px ${il.shadowBlur}px ${il.shadowColor});` : '';
        const vbParts = iconDef.viewBox.split(' ').map(Number);
        const vbW = vbParts[2] || 24;
        const vbH = vbParts[3] || 24;
        const iconSvg = iconDef.svg.replace(/currentColor/g, il.fill);
        elements.push(
          `<g transform="${transform}" opacity="${opacity}" style="${shadow}">` +
          `<svg x="0" y="0" width="${lw}" height="${lh}" viewBox="0 0 ${vbW} ${vbH}">${iconSvg}</svg>` +
          `</g>`
        );
      }
    } else if (layer.type === 'shape') {
      const sl = layer as ShapeLayer;
      let fillAttr = sl.fill;
      if (sl.fillType === 'none') fillAttr = 'none';
      if (sl.fillType === 'gradient') {
        const gid = `sg-${layer.id}`;
        defs.push(`<linearGradient id="${gid}" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="${sl.gradientColor1}"/><stop offset="100%" stop-color="${sl.gradientColor2}"/></linearGradient>`);
        fillAttr = `url(#${gid})`;
      }
      const strokeAttr = sl.stroke !== 'none' ? `stroke="${sl.stroke}" stroke-width="${sl.strokeWidth * scale}"${sl.strokeDash ? ` stroke-dasharray="8,4"` : ''}` : '';
      const shadow = sl.shadow ? `filter: drop-shadow(${sl.shadowX}px ${sl.shadowY}px ${sl.shadowBlur}px ${sl.shadowColor});` : '';
      let shapeEl = '';
      if (sl.shapeType === 'circle') {
        shapeEl = `<ellipse cx="${lw / 2}" cy="${lh / 2}" rx="${lw / 2}" ry="${lh / 2}" fill="${fillAttr}" ${strokeAttr}/>`;
      } else if (sl.shapeType === 'rect') {
        shapeEl = `<rect width="${lw}" height="${lh}" rx="${(sl.cornerRadius / 100) * Math.min(lw, lh)}" fill="${fillAttr}" ${strokeAttr}/>`;
      } else if (sl.shapeType === 'triangle') {
        shapeEl = `<polygon points="${lw / 2},0 ${lw},${lh} 0,${lh}" fill="${fillAttr}" ${strokeAttr}/>`;
      } else if (sl.shapeType === 'diamond') {
        shapeEl = `<polygon points="${lw / 2},0 ${lw},${lh / 2} ${lw / 2},${lh} 0,${lh / 2}" fill="${fillAttr}" ${strokeAttr}/>`;
      } else if (sl.shapeType === 'hexagon') {
        const hx = lw / 2, hy = lh / 2, rx = lw / 2, ry = lh / 2;
        const pts = Array.from({ length: 6 }, (_, i) => {
          const a = (Math.PI / 3) * i - Math.PI / 6;
          return `${hx + rx * Math.cos(a)},${hy + ry * Math.sin(a)}`;
        }).join(' ');
        shapeEl = `<polygon points="${pts}" fill="${fillAttr}" ${strokeAttr}/>`;
      } else if (sl.shapeType === 'star') {
        const pts: string[] = [];
        for (let i = 0; i < 10; i++) {
          const a = (Math.PI / 5) * i - Math.PI / 2;
          const r = i % 2 === 0 ? lw / 2 : lw / 4;
          pts.push(`${lw / 2 + r * Math.cos(a)},${lh / 2 + r * Math.sin(a)}`);
        }
        shapeEl = `<polygon points="${pts.join(' ')}" fill="${fillAttr}" ${strokeAttr}/>`;
      } else if (sl.shapeType === 'ring') {
        shapeEl = `<circle cx="${lw / 2}" cy="${lh / 2}" r="${lw * 0.4}" fill="none" stroke="${sl.fill}" stroke-width="${lw * 0.12}"/>`;
      } else if (sl.shapeType === 'cross') {
        const t = lw * 0.25;
        shapeEl = `<path d="M${t},0 h${lw - 2 * t} v${t} h${t} v${lh - 2 * t} h-${t} v${t} h-${lw - 2 * t} v-${t} h-${t} v-${lh - 2 * t} h${t} z" fill="${fillAttr}" ${strokeAttr}/>`;
      } else if (sl.shapeType === 'pentagon') {
        const pts2: string[] = [];
        for (let i = 0; i < 5; i++) {
          const a = (2 * Math.PI / 5) * i - Math.PI / 2;
          pts2.push(`${lw / 2 + (lw / 2) * Math.cos(a)},${lh / 2 + (lh / 2) * Math.sin(a)}`);
        }
        shapeEl = `<polygon points="${pts2.join(' ')}" fill="${fillAttr}" ${strokeAttr}/>`;
      }
      elements.push(`<g transform="${transform}" opacity="${opacity}" style="${shadow}">${shapeEl}</g>`);
    }
  });

  const defsBlock = defs.length ? `<defs>${defs.join('')}</defs>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${defsBlock}${elements.join('')}</svg>`;
}

async function svgToCanvas(svgStr: string, width: number, height: number): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return reject(new Error('No canvas context'));
    const img = new Image();
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      resolve(canvas);
    };
    img.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
    img.src = url;
  });
}

export function useLogoDownload() {
  const download = useCallback(async (
    design: LogoDesign,
    format: DownloadFormat,
    scale: number,
    fileName: string
  ) => {
    const { width, height } = design.canvasSize;
    const name = fileName || 'logo';

    if (format === 'svg') {
      const svgStr = buildSVGString(design, 1);
      const blob = new Blob([svgStr], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}.svg`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 500);
      return;
    }

    const svgStr = buildSVGString(design, scale);
    const canvas = await svgToCanvas(svgStr, width * scale, height * scale);

    if (format === 'pdf') {
      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      const pdf = new jsPDF({
        orientation: width > height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [width * scale, height * scale],
      });
      pdf.addImage(imgData, 'JPEG', 0, 0, width * scale, height * scale);
      pdf.save(`${name}.pdf`);
      return;
    }

    const mime = format === 'png' ? 'image/png' : 'image/jpeg';
    const dataUrl = canvas.toDataURL(mime, format === 'jpg' ? 0.92 : 1);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${name}.${format}`;
    a.click();
  }, []);

  return { download };
}
