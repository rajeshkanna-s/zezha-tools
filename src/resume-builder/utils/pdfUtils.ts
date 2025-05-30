
// @ts-ignore
import html2pdf from 'html2pdf.js';
export const downloadResumeAsPDF = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      html2pdf().from(element).save();
    }
  };