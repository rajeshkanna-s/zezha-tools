export interface InvoiceTemplate {
    id: string;
    name: string;
    primaryColor: string;
    fontFamily: string;
    description: string;
    preview: string;
}

export const INVOICE_TEMPLATES: InvoiceTemplate[] = [
    {
        id: 'modern',
        name: 'Modern Blue',
        primaryColor: '#3b82f6',
        fontFamily: 'Arial',
        description: 'Clean & professional',
        preview: '🔵',
    },
    {
        id: 'midnight',
        name: 'Midnight',
        primaryColor: '#1e293b',
        fontFamily: 'Georgia',
        description: 'Dark & elegant',
        preview: '🌑',
    },
    {
        id: 'emerald',
        name: 'Emerald',
        primaryColor: '#059669',
        fontFamily: 'Verdana',
        description: 'Fresh & trustworthy',
        preview: '🟢',
    },
    {
        id: 'crimson',
        name: 'Crimson',
        primaryColor: '#dc2626',
        fontFamily: 'Georgia',
        description: 'Bold & striking',
        preview: '🔴',
    },
    {
        id: 'violet',
        name: 'Violet',
        primaryColor: '#7c3aed',
        fontFamily: 'Helvetica',
        description: 'Creative & modern',
        preview: '🟣',
    },
    {
        id: 'amber',
        name: 'Amber',
        primaryColor: '#d97706',
        fontFamily: 'Times New Roman',
        description: 'Warm & classic',
        preview: '🟡',
    },
    {
        id: 'slate',
        name: 'Slate',
        primaryColor: '#475569',
        fontFamily: 'Helvetica',
        description: 'Minimal & clean',
        preview: '⬜',
    },
    {
        id: 'rose',
        name: 'Rose Gold',
        primaryColor: '#e11d48',
        fontFamily: 'Georgia',
        description: 'Luxury & refined',
        preview: '🌸',
    },
];

export const getTemplateById = (id: string): InvoiceTemplate =>
    INVOICE_TEMPLATES.find(t => t.id === id) ?? INVOICE_TEMPLATES[0];
