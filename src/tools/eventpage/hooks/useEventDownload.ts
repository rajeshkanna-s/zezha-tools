import { useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import type { EventPageData } from '../types';

/**
 * Capture the event page using onclone — NEVER modifies the original DOM.
 * Strips all CSS zoom, expands all ancestors in the cloned document.
 */
async function captureFullPage(elementId: string): Promise<HTMLCanvasElement> {
  const el = document.getElementById(elementId);
  if (!el) throw new Error('Element not found: ' + elementId);

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    onclone: (_doc: Document, clonedEl: HTMLElement) => {
      // Strip ALL zoom from every element
      _doc.querySelectorAll('*').forEach(node => {
        if (node instanceof HTMLElement) {
          if (node.style.zoom) {
            node.style.zoom = '';
          }

          // ── Fix Tailwind v4 oklch() crash ──
          // html2canvas doesn't support oklch() color format, so we replace it with a fallback.
          const style = window.getComputedStyle(node);
          if (style.backgroundColor.includes('oklch')) node.style.backgroundColor = '#ffffff';
          if (style.color.includes('oklch')) node.style.color = '#333333';
          if (style.borderColor.includes('oklch')) node.style.borderColor = '#e2e8f0';
        }
      });

      // Expand the element to full scroll height
      clonedEl.style.overflow = 'visible';
      clonedEl.style.height = 'auto';
      clonedEl.style.maxHeight = 'none';

      // Expand all ancestors
      let ancestor: HTMLElement | null = clonedEl.parentElement;
      while (ancestor && ancestor.tagName !== 'HTML') {
        ancestor.style.overflow = 'visible';
        ancestor.style.height = 'auto';
        ancestor.style.maxHeight = 'none';
        ancestor.style.width = 'auto';
        ancestor.style.maxWidth = 'none';
        ancestor.style.transform = 'none';
        ancestor.style.zoom = '';
        ancestor = ancestor.parentElement;
      }
    },
  });

  return canvas;
}

export function useEventDownload() {
  const downloadAsHTML = useCallback((data: EventPageData) => {
    const el = document.getElementById('event-page-preview');
    if (!el) return;

    const clone = el.cloneNode(true) as HTMLElement;
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${data.description.slice(0, 160)}">
  <meta property="og:title" content="${data.eventName}">
  <meta property="og:description" content="${data.tagline}">
  <title>${data.eventName} — ${data.tagline}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
${clone.outerHTML}
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${data.eventName.replace(/\s+/g, '-')}-landing-page.html`;
    link.click();
    URL.revokeObjectURL(link.href);
  }, []);

  const downloadAsPDF = useCallback(async (data: EventPageData) => {
    try {
      const canvas = await captureFullPage('event-page-preview');

      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      // Create a single continuous PDF page instead of slicing into A4
      const pdfWidth = canvas.width;
      const pdfHeight = canvas.height;

      const pdf = new jsPDF({
        orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
        unit: 'px',
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${data.eventName.replace(/\s+/g, '-')}-landing-page.pdf`);
    } catch (err) {
      console.error('[useEventDownload] PDF download error:', err);
      alert('PDF download failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  }, []);

  const downloadAsZIP = useCallback(async (data: EventPageData) => {
    const el = document.getElementById('event-page-preview');
    if (!el) return;

    const clone = el.cloneNode(true) as HTMLElement;
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.eventName}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body>
${clone.outerHTML}
</body>
</html>`;

    try {
      const zip = new JSZip();
      zip.file('index.html', htmlContent);
      zip.file('README.md', `# ${data.eventName}\n\nOpen index.html in a browser to view the landing page.`);

      const blob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${data.eventName.replace(/\s+/g, '-')}-landing-page.zip`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error('[useEventDownload] ZIP download error:', err);
      alert('ZIP download failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  }, []);

  return { downloadAsHTML, downloadAsPDF, downloadAsZIP };
}
