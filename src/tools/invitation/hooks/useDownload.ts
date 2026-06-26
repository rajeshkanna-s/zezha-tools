import { useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { QualityOption, OutputFormat, DownloadFormat } from '../types';

/**
 * Use html2canvas's built-in onclone to fix the CLONED document.
 * IMPORTANT: We NEVER modify the original DOM — this prevents visible layout shifts.
 * 
 * The `onclone` callback receives the cloned document + cloned element.
 * html2canvas preserves all stylesheets in the clone, so fonts/CSS work correctly.
 * 
 * In onclone we:
 *  1. Strip CSS `zoom` from ALL elements (html2canvas@1.4.1 crashes on zoom)
 *  2. Remove preview transforms and set native size
 *  3. Expand all ancestor containers to prevent clipping
 */
async function captureElement(
    elementId: string,
    quality: QualityOption,
    outputFormat: OutputFormat
): Promise<HTMLCanvasElement> {
    const el = document.getElementById(elementId);
    if (!el) throw new Error('Element not found: ' + elementId);

    const canvas = await html2canvas(el, {
        scale: quality.scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        width: outputFormat.width,
        height: outputFormat.height,
        windowWidth: outputFormat.width + 200,
        windowHeight: outputFormat.height + 200,
        logging: false,
        onclone: (_doc: Document, clonedEl: HTMLElement) => {
            // ── 1. Strip ALL zoom from EVERY element in the cloned doc ──
            // html2canvas@1.4.1 does NOT support CSS zoom and may crash on it
            const allEls = _doc.querySelectorAll('*');
            allEls.forEach(node => {
                if (node instanceof HTMLElement) {
                    if (node.style.zoom) {
                        node.style.zoom = '';
                    }

                    // ── Fix Tailwind v4 oklch() crash ──
                    // html2canvas throws "unsupported color function oklch"
                    // We must convert computed oklch colors to rgb before capture
                    const style = window.getComputedStyle(node);
                    if (style.backgroundColor.includes('oklch')) node.style.backgroundColor = '#ffffff';
                    if (style.color.includes('oklch')) node.style.color = '#333333';
                    if (style.borderColor.includes('oklch')) node.style.borderColor = '#e2e8f0';

                    // ── Fix WebkitBackgroundClip: text (gradient text) ──
                    // html2canvas does NOT support -webkit-background-clip: text.
                    // It renders the gradient as a solid background box while keeping
                    // the text transparent, causing a colored rectangle in the export.
                    // Fix: remove the gradient background and apply a solid fallback color.
                    const bgClip = style.webkitBackgroundClip || style.backgroundClip || '';
                    if (bgClip === 'text') {
                        node.style.backgroundImage = 'none';
                        node.style.background = 'none';
                        node.style.webkitBackgroundClip = 'unset';
                        node.style.backgroundClip = 'unset';
                        node.style.webkitTextFillColor = '#EC4899';
                        node.style.color = '#EC4899';
                    }
                }
            });

            // ── 2. Fix the target element — native size, no transform ──
            clonedEl.style.transform = 'none';
            clonedEl.style.transformOrigin = 'top left';
            clonedEl.style.width = `${outputFormat.width}px`;
            clonedEl.style.height = `${outputFormat.height}px`;
            clonedEl.style.overflow = 'visible';
            clonedEl.style.position = 'relative';
            clonedEl.style.zoom = '';

            // ── 3. Expand ALL ancestors to prevent clipping ──
            let ancestor: HTMLElement | null = clonedEl.parentElement;
            while (ancestor && ancestor.tagName !== 'HTML') {
                ancestor.style.overflow = 'visible';
                ancestor.style.height = 'auto';
                ancestor.style.maxHeight = 'none';
                ancestor.style.width = 'auto';
                ancestor.style.maxWidth = 'none';
                ancestor.style.minHeight = '0';
                ancestor.style.minWidth = '0';
                ancestor.style.transform = 'none';
                ancestor.style.position = 'static';
                ancestor.style.zoom = '';
                ancestor = ancestor.parentElement;
            }
        },
    });

    return canvas;
}

export function useDownload() {
    const downloadAsImage = useCallback(async (
        elementId: string,
        format: DownloadFormat,
        quality: QualityOption,
        outputFormat: OutputFormat,
        fileName?: string
    ) => {
        try {
            const canvas = await captureElement(elementId, quality, outputFormat);
            const mime = format === 'png' ? 'image/png' : 'image/jpeg';
            const dataUrl = canvas.toDataURL(mime, format === 'png' ? 1 : 0.92);
            const name = fileName || 'invitation';

            const link = document.createElement('a');
            link.download = `${name}.${format}`;
            link.href = dataUrl;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            setTimeout(() => document.body.removeChild(link), 500);
        } catch (err) {
            console.error('[useDownload] Image download error:', err);
            alert('Download failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    }, []);

    const downloadAsPDF = useCallback(async (
        elementId: string,
        quality: QualityOption,
        outputFormat: OutputFormat,
        fileName?: string
    ) => {
        try {
            const canvas = await captureElement(elementId, quality, outputFormat);
            const imgData = canvas.toDataURL('image/jpeg', 0.92);
            const orientation = outputFormat.width > outputFormat.height ? 'landscape' : 'portrait';

            const pdf = new jsPDF({
                orientation,
                unit: 'px',
                format: [outputFormat.width, outputFormat.height],
            });

            pdf.addImage(imgData, 'JPEG', 0, 0, outputFormat.width, outputFormat.height);
            pdf.save(`${fileName || 'invitation'}.pdf`);
        } catch (err) {
            console.error('[useDownload] PDF download error:', err);
            alert('PDF download failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    }, []);

    return { downloadAsImage, downloadAsPDF };
}
