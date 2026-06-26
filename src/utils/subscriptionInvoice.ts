import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const downloadSubscriptionInvoice = (payment: any, profile: any, userEmail: string) => {
    const doc = new jsPDF();
    const primaryColor: [number, number, number] = [59, 130, 246]; // #3b82f6

    // Header
    doc.setFontSize(28);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 14, 25);

    // Company Info
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'bold');
    doc.text('ReportsIQ', 14, 34);
    doc.setFont('helvetica', 'normal');
    doc.text('Zezha Technology Private Limited', 14, 39);
    doc.text('contact@zezha.in', 14, 44);

    // Invoice Details (Right Aligned)
    const invoiceNo = `INV-${payment.razorpay_payment_id ? payment.razorpay_payment_id.substring(4).toUpperCase() : payment.id.substring(0, 8).toUpperCase()}`;
    const dateStr = new Date(payment.created_at).toLocaleDateString();

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Invoice Number', 196, 25, { align: 'right' });
    doc.setTextColor(...primaryColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(invoiceNo, 196, 31, { align: 'right' });

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${dateStr}`, 196, 39, { align: 'right' });
    doc.text(`Status: ${payment.status.toUpperCase()}`, 196, 44, { align: 'right' });

    // Divider
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.line(14, 52, 196, 52);

    // Bill To
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 14, 62);

    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    const billName = profile?.company_name || profile?.full_name || 'Customer';
    doc.text(billName, 14, 68);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    let yPos = 73;
    if (userEmail) {
        doc.text(userEmail, 14, yPos);
        yPos += 5;
    }
    if (profile?.business_address) {
        const addrLines = doc.splitTextToSize(profile.business_address, 80);
        doc.text(addrLines, 14, yPos);
    }

    // Items Table
    const tableBody = [
        ['ReportsIQ Subscription', payment.plan_name ? payment.plan_name.toUpperCase() : 'Premium', '1', `INR ${payment.amount_inr}.00`, `INR ${payment.amount_inr}.00`]
    ];

    autoTable(doc, {
        startY: yPos + 10,
        headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold' },
        columnStyles: {
            0: { cellWidth: 80 },
            4: { halign: 'right' }
        },
        head: [['Description', 'Plan', 'Qty', 'Unit Price', 'Total']],
        body: tableBody,
        theme: 'striped',
        margin: { top: 10, left: 14, right: 14 },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;

    // Totals Area
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('Total Paid:', 160, finalY, { align: 'right' });

    doc.setFontSize(18);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text(`INR ${payment.amount_inr}.00`, 196, finalY, { align: 'right' });

    // Footer
    doc.setDrawColor(230, 230, 230);
    doc.line(14, finalY + 20, 196, finalY + 20);
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for subscribing to ReportsIQ!', 105, finalY + 30, { align: 'center' });

    doc.save(`ReportsIQ_Invoice_${invoiceNo}.pdf`);
};
