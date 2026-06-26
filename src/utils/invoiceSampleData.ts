import type { InvoiceData } from '../tools/invoice/InvoiceForm';

// ─── Auto-increment invoice number ───────────────────────────────────────────
const COUNTER_KEY = 'zezha_invoice_counter';
const YEAR = new Date().getFullYear();

export const getNextInvoiceNumber = (): string => {
    try {
        const raw = localStorage.getItem(COUNTER_KEY);
        const last = raw ? JSON.parse(raw) : { year: YEAR, count: 0 };
        if (last.year !== YEAR) {
            last.year = YEAR;
            last.count = 0;
        }
        last.count += 1;
        localStorage.setItem(COUNTER_KEY, JSON.stringify(last));
        return `INV-${YEAR}-${String(last.count).padStart(6, '0')}`;
    } catch {
        return `INV-${YEAR}-000001`;
    }
};

export const peekCurrentNumber = (): string => {
    try {
        const raw = localStorage.getItem(COUNTER_KEY);
        const last = raw ? JSON.parse(raw) : { year: YEAR, count: 0 };
        if (last.year !== YEAR) return `INV-${YEAR}-000001`;
        return `INV-${YEAR}-${String(last.count + 1).padStart(6, '0')}`;
    } catch {
        return `INV-${YEAR}-000001`;
    }
};

// ─── Sample data ──────────────────────────────────────────────────────────────
export const getSampleInvoiceData = (): InvoiceData => {
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 30);

    const savedCompanyName = (() => { try { return localStorage.getItem('riq-company-name') || ''; } catch { return ''; } })();
    const savedBusinessAddress = (() => { try { return localStorage.getItem('riq-business-address') || ''; } catch { return ''; } })();

    return {
        businessName: savedCompanyName || 'Your Business Name',
        businessAddress: savedBusinessAddress || '123 Business Street\nSuite 100\nChennai, Tamil Nadu 600001\nIndia',
        businessLogo: '',
        clientName: 'ABC Corporation',
        clientAddress: '456 Client Avenue\nFloor 5\nMumbai, Maharashtra 400001\nIndia',
        invoiceNumber: peekCurrentNumber(),
        issueDate: today.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        currency: 'INR',
        dateFormat: 'LONG',
        discount: 5,
        primaryColor: '#3b82f6',
        fontFamily: 'Arial',
        status: 'draft',
        isTaxInclusive: false,
        notes: 'Payment due within 30 days.\nLate payment fee of 1.5% per month applies.\nThank you for your business!',
        items: [
            {
                id: '1',
                name: 'Website Development',
                quantity: 1,
                unitPrice: 25000,
                taxPercent1: 9,
                taxPercent2: 9,
                isTaxable: true,
            },
            {
                id: '2',
                name: 'SEO Optimization',
                quantity: 3,
                unitPrice: 4500,
                taxPercent1: 9,
                taxPercent2: 9,
                isTaxable: true,
            },
            {
                id: '3',
                name: 'Monthly Maintenance',
                quantity: 6,
                unitPrice: 2000,
                taxPercent1: 5,
                taxPercent2: 0,
                isTaxable: true,
            },
            {
                id: '4',
                name: 'Logo Design',
                quantity: 1,
                unitPrice: 7500,
                taxPercent1: 0,
                taxPercent2: 0,
                isTaxable: false,
            },
        ],
    };
};
