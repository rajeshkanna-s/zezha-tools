import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { InvoiceData } from '../tools/invoice/InvoiceForm';

/**
 * Renders one invoice to PDF bytes by:
 * 1. Temporarily mounting a hidden InvoicePreview into the DOM
 * 2. Cloning its rendered HTML into an isolated iframe
 * 3. Capturing via html2canvas → jsPDF
 * 4. Returning raw bytes for inclusion in ZIP
 */
const renderInvoiceToPDF = async (invoice: InvoiceData, index: number): Promise<Uint8Array> => {
    // ── Step 1: Mount a temporary React preview ──────────────────────────────
    const { createRoot } = await import('react-dom/client');
    const { createElement } = await import('react');
    const { InvoicePreview } = await import('../tools/invoice/InvoicePreview');

    const mountDiv = document.createElement('div');
    mountDiv.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;visibility:hidden;z-index:-999;';
    document.body.appendChild(mountDiv);

    const root = createRoot(mountDiv);
    root.render(createElement(InvoicePreview, { data: invoice }));

    // Wait for React to flush + fonts/images
    await new Promise(resolve => setTimeout(resolve, 600));

    const previewEl = mountDiv.querySelector('#invoice-preview') as HTMLElement | null;
    if (!previewEl) {
        root.unmount();
        document.body.removeChild(mountDiv);
        throw new Error(`Invoice #${index + 1} (${invoice.invoiceNumber}): preview element not found after render.`);
    }

    // ── Step 2: Copy rendered HTML into an isolated iframe (same as invoicePdfGenerator) ──
    const htmlContent = previewEl.outerHTML;
    root.unmount();
    document.body.removeChild(mountDiv);

    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;height:1px;border:none;visibility:hidden;';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
        document.body.removeChild(iframe);
        throw new Error('Could not create iframe rendering context.');
    }

    iframeDoc.open();
    iframeDoc.write(`<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { margin: 0; padding: 0; background: #fff; font-family: ${invoice.fontFamily || 'Arial'}, sans-serif; }
    table { border-collapse: collapse; width: 100%; }
  </style>
</head>
<body>${htmlContent}</body>
</html>`);
    iframeDoc.close();

    // Wait for iframe to render
    await new Promise(resolve => setTimeout(resolve, 400));
    iframe.style.height = `${iframeDoc.body.scrollHeight}px`;

    try {
        // ── Step 3: Capture with html2canvas ─────────────────────────────────
        const canvas = await html2canvas(iframeDoc.body, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            windowWidth: 794,
            windowHeight: iframeDoc.body.scrollHeight,
        });

        document.body.removeChild(iframe);

        // ── Step 4: Convert to jsPDF bytes ───────────────────────────────────
        const imgData = canvas.toDataURL('image/jpeg', 0.92);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfW = pdf.internal.pageSize.getWidth();
        const pdfH = pdf.internal.pageSize.getHeight();
        const imgW = pdfW;
        const imgH = (canvas.height * imgW) / canvas.width;

        let position = 0;
        let heightLeft = imgH;

        pdf.addImage(imgData, 'JPEG', 0, position, imgW, imgH);
        heightLeft -= pdfH;

        // Only add pages when there is meaningful content remaining (> 5mm tolerance to avoid blank pages)
        while (heightLeft > 5) {
            position -= pdfH;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, imgW, imgH);
            heightLeft -= pdfH;
        }

        return new Uint8Array(pdf.output('arraybuffer'));
    } catch (err) {
        if (document.body.contains(iframe)) document.body.removeChild(iframe);
        throw err;
    }
};

// ── Main export ───────────────────────────────────────────────────────────────
export const generateBulkPDFs = async (
    invoices: InvoiceData[],
    onProgress?: (current: number, total: number, label: string) => void,
): Promise<{ generated: number; failed: number }> => {
    const zip = new JSZip();
    let generated = 0;
    let failed = 0;

    for (let i = 0; i < invoices.length; i++) {
        const inv = invoices[i];
        const label = `${inv.invoiceNumber} — ${inv.clientName}`;
        onProgress?.(i + 1, invoices.length, label);

        try {
            const pdfBytes = await renderInvoiceToPDF(inv, i);
            const safeNum = (inv.invoiceNumber || `invoice-${i + 1}`).replace(/[^a-zA-Z0-9\-_]/g, '_');
            zip.file(`${safeNum}.pdf`, pdfBytes);
            generated++;
        } catch (err) {
            console.error(`[BulkPDF] Failed for "${inv.invoiceNumber}":`, err);
            failed++;
        }
    }

    if (generated === 0) {
        throw new Error('No PDFs could be generated. Please try again.');
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, `invoices-bulk-${new Date().toISOString().split('T')[0]}.zip`);
    return { generated, failed };
};
