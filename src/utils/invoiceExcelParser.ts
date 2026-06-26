import * as XLSX from 'xlsx';
import type { InvoiceData, InvoiceItem } from '../tools/invoice/InvoiceForm';
import { getNextInvoiceNumber } from './invoiceSampleData';

const str = (v: unknown): string => (v !== undefined && v !== null ? String(v).trim() : '');
const num = (v: unknown): number => (isNaN(Number(v)) ? 0 : Number(v));
const taxBool = (tax1: number, tax2: number): boolean => tax1 > 0 || tax2 > 0;

const toDateStr = (v: unknown): string => {
    if (!v) return '';
    if (typeof v === 'number') {
        const date = XLSX.SSF.parse_date_code(v);
        const y = date.y;
        const m = String(date.m).padStart(2, '0');
        const d = String(date.d).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
    const s = String(v).trim();
    const parsed = new Date(s);
    if (!isNaN(parsed.getTime())) {
        return parsed.toISOString().split('T')[0];
    }
    return s;
};

const rowToInvoice = (row: Record<string, unknown>, idx: number): InvoiceData => {
    const items: InvoiceItem[] = [];

    for (let i = 1; i <= 10; i++) {
        const name = str(row[`item${i}_name`]);
        if (!name) continue;
        const tax1 = num(row[`item${i}_tax1`]);
        const tax2 = num(row[`item${i}_tax2`]);
        items.push({
            id: `${idx}_${i}_${Date.now()}`,
            name,
            quantity: Math.max(1, num(row[`item${i}_qty`])),
            unitPrice: num(row[`item${i}_price`]),
            taxPercent1: tax1,
            taxPercent2: tax2,
            isTaxable: taxBool(tax1, tax2),
        });
    }

    // Use provided invoice number OR auto-generate a unique one
    const invoiceNumber = str(row['invoiceNumber']) || getNextInvoiceNumber();

    // businessName: from Excel column, fallback to empty (not hardcoded)
    const businessName = str(row['businessName']) || 'My Business';

    return {
        businessName,
        businessAddress: str(row['businessAddress']),
        businessLogo: '',
        clientName: str(row['clientName']) || `Client ${idx + 1}`,
        clientAddress: str(row['clientAddress']),
        invoiceNumber,
        issueDate: toDateStr(row['issueDate']),
        dueDate: toDateStr(row['dueDate']),
        currency: str(row['currency']) || 'INR',
        dateFormat: 'LONG',
        discount: Math.min(100, Math.max(0, num(row['discount']))),
        primaryColor: '#3b82f6',
        fontFamily: 'Arial',
        notes: str(row['notes']),
        status: 'draft',
        items,
    };
};

export interface ParseResult {
    invoices: InvoiceData[];
    errors: string[];
}

export const parseExcelToInvoices = (file: File): Promise<ParseResult> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onerror = () => reject(new Error('Failed to read file.'));

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target!.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array', cellDates: false });

                const sheetName = workbook.SheetNames.includes('Invoices')
                    ? 'Invoices'
                    : workbook.SheetNames[0];

                const sheet = workbook.Sheets[sheetName];
                const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });

                const invoices: InvoiceData[] = [];
                const errors: string[] = [];

                rows.forEach((row, idx) => {
                    try {
                        const invoice = rowToInvoice(row, idx);
                        if (invoice.items.length === 0) {
                            errors.push(`Row ${idx + 2}: No items found — skipped.`);
                            return;
                        }
                        invoices.push(invoice);
                    } catch (err) {
                        errors.push(`Row ${idx + 2}: ${err instanceof Error ? err.message : 'Unknown error'}`);
                    }
                });

                resolve({ invoices, errors });
            } catch {
                reject(new Error('Invalid Excel file. Please use the official template.'));
            }
        };

        reader.readAsArrayBuffer(file);
    });
};
