import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateInvoicePDF = async (invoiceNumber: string) => {
    const element = document.getElementById('invoice-preview-container');
    if (!element) {
        throw new Error('Invoice preview element not found.');
    }

    // Use an iframe for isolated rendering (same approach as HtmlToPdf / WordToPdf)
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;height:0;border:none;visibility:hidden;';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
        document.body.removeChild(iframe);
        throw new Error('Failed to create rendering context');
    }

    // Copy the invoice preview HTML into the iframe with inline styles
    const htmlContent = element.outerHTML;

    iframeDoc.open();
    iframeDoc.write(`<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { margin: 0; padding: 0; background: #fff; font-family: Arial, sans-serif; }
    table { border-collapse: collapse; width: 100%; }
  </style>
</head>
<body>${htmlContent}</body>
</html>`);
    iframeDoc.close();

    // Wait for content to render
    await new Promise(resolve => setTimeout(resolve, 500));

    // Resize iframe to fit content
    iframe.style.height = `${iframeDoc.body.scrollHeight}px`;

    try {
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
        const imgW = pdfW; // Full width, no side margins — the invoice page has its own internal padding
        const imgH = (canvas.height * imgW) / canvas.width;

        const usableH = pdfH; // Full page height
        let position = 0;
        let heightLeft = imgH;

        pdf.addImage(imgData, 'JPEG', 0, position, imgW, imgH);
        heightLeft -= usableH;

        // Only add pages when there is meaningful content remaining (> 5mm tolerance to avoid blank pages)
        while (heightLeft > 5) {
            position -= usableH;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, imgW, imgH);
            heightLeft -= usableH;
        }

        pdf.save(`invoice-${invoiceNumber || 'draft'}.pdf`);
    } catch (error) {
        if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
        }
        console.error('PDF generation error:', error);
        throw error;
    }
};
