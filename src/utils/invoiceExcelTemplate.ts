import * as XLSX from 'xlsx';

export const downloadSampleTemplate = () => {
    const headers = [
        'businessName',      // NEW
        'businessAddress',
        'clientName',
        'clientAddress',
        'invoiceNumber',     // leave blank = auto-generated unique number
        'issueDate',
        'dueDate',
        'currency',
        'discount',
        'notes',
        'item1_name', 'item1_qty', 'item1_price', 'item1_tax1', 'item1_tax2',
        'item2_name', 'item2_qty', 'item2_price', 'item2_tax1', 'item2_tax2',
        'item3_name', 'item3_qty', 'item3_price', 'item3_tax1', 'item3_tax2',
        'item4_name', 'item4_qty', 'item4_price', 'item4_tax1', 'item4_tax2',
        'item5_name', 'item5_qty', 'item5_price', 'item5_tax1', 'item5_tax2',
        'item6_name', 'item6_qty', 'item6_price', 'item6_tax1', 'item6_tax2',
        'item7_name', 'item7_qty', 'item7_price', 'item7_tax1', 'item7_tax2',
        'item8_name', 'item8_qty', 'item8_price', 'item8_tax1', 'item8_tax2',
        'item9_name', 'item9_qty', 'item9_price', 'item9_tax1', 'item9_tax2',
        'item10_name', 'item10_qty', 'item10_price', 'item10_tax1', 'item10_tax2',
    ];

    const sample1 = [
        'ZEZHA TECHNOLOGY',
        '123 Business Street\nSuite 100\nChennai, Tamil Nadu 600001\nIndia',
        'ABC Corporation',
        '456 Client Ave, Floor 5\nChennai, TN 600001',
        '',                  // leave blank → auto unique number
        '2024-01-15',
        '2024-02-15',
        'INR',
        5,
        'Payment due within 30 days. Late fee 1.5%/month.',
        'Website Development', 1, 25000, 9, 9,
        'SEO Optimization', 3, 5000, 9, 9,
        'Logo Design', 1, 7500, 0, 0,
        '', '', '', '', '',
        '', '', '', '', '',
        '', '', '', '', '',
        '', '', '', '', '',
        '', '', '', '', '',
        '', '', '', '', '',
        '', '', '', '', '',
    ];

    const sample2 = [
        'My Other Company',
        '789 Business Park\nMumbai 400001\nIndia',
        'XYZ Pvt Ltd',
        '789 Business Park\nMumbai 400001',
        '',                  // leave blank → auto unique number
        '2024-01-20',
        '2024-02-20',
        'INR',
        0,
        'Thank you for your business!',
        'App Development', 1, 80000, 9, 9,
        'UI/UX Design', 1, 20000, 9, 9,
        'Monthly Hosting', 6, 2000, 9, 9,
        'Domain Registration', 1, 1500, 0, 0,
        '', '', '', '', '',
        '', '', '', '', '',
        '', '', '', '', '',
        '', '', '', '', '',
        '', '', '', '', '',
        '', '', '', '', '',
    ];

    const wsData = [headers, sample1, sample2];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    ws['!cols'] = [
        { wch: 22 }, { wch: 30 }, // businessName, businessAddress
        { wch: 20 }, { wch: 30 }, // clientName, clientAddress
        { wch: 18 }, { wch: 12 }, { wch: 12 }, // invoiceNumber, issueDate, dueDate
        { wch: 8 }, { wch: 10 }, { wch: 40 }, // currency, discount, notes
        ...Array(50).fill({ wch: 14 }),
    ];

    const instructions = [
        ['ZEZHA TECHNOLOGY — Invoice Bulk Upload Template'],
        [''],
        ['INSTRUCTIONS:'],
        ['1. Fill the "Invoices" sheet from row 2 onwards (row 1 = headers, do NOT edit headers)'],
        ['2. Each row = one invoice'],
        ['3. businessName: Your business/company name for this invoice'],
        ['4. Date format: YYYY-MM-DD  (e.g. 2024-03-15)'],
        ['5. Leave invoiceNumber blank → auto-generated unique number (recommended)'],
        ['6. Leave dueDate blank to hide it on the invoice'],
        ['7. currency: USD | EUR | GBP | INR | JPY | CAD | AUD | CHF | SEK | CNY'],
        ['8. discount: number between 0 and 100 (percentage)'],
        ['9. tax1 / tax2: percentage per item (e.g. 9 for CGST 9%)'],
        ['10. Leave item columns blank if not needed'],
        ['11. Max 10 items per invoice'],
        [''],
        ['TAX QUICK REFERENCE (India):'],
        ['CGST + SGST  →  tax1=9,  tax2=9  (18% GST intra-state)'],
        ['IGST         →  tax1=18, tax2=0  (18% GST inter-state)'],
        ['GST 5%       →  tax1=5,  tax2=0'],
        ['GST 12%      →  tax1=12, tax2=0'],
        ['GST 28%      →  tax1=28, tax2=0'],
        ['No Tax       →  tax1=0,  tax2=0'],
    ];
    const wsInfo = XLSX.utils.aoa_to_sheet(instructions);
    wsInfo['!cols'] = [{ wch: 70 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Invoices');
    XLSX.utils.book_append_sheet(wb, wsInfo, 'Instructions');

    XLSX.writeFile(wb, 'zezha_invoice_template.xlsx');
};
