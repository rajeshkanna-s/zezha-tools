import { useState, useEffect, useCallback } from 'react';
import type { InvoiceData } from '../tools/invoice/InvoiceForm';

const STORAGE_KEY = 'zezha_invoice_history';
const MAX_HISTORY = 50;

export interface HistoryEntry {
    invoice: InvoiceData;
    savedAt: string;
}

const load = (): HistoryEntry[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
    } catch {
        return [];
    }
};

const persist = (entries: HistoryEntry[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
        const trimmed = entries.slice(0, Math.floor(entries.length / 2));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    }
};

export const useInvoiceHistory = () => {
    const [history, setHistory] = useState<HistoryEntry[]>([]);

    useEffect(() => {
        setHistory(load());
    }, []);

    const saveToHistory = useCallback((invoice: InvoiceData) => {
        setHistory(prev => {
            const without = prev.filter(e => e.invoice.invoiceNumber !== invoice.invoiceNumber);
            const updated = [{ invoice, savedAt: new Date().toISOString() }, ...without].slice(0, MAX_HISTORY);
            persist(updated);
            return updated;
        });
    }, []);

    const deleteFromHistory = useCallback((invoiceNumber: string) => {
        setHistory(prev => {
            const updated = prev.filter(e => e.invoice.invoiceNumber !== invoiceNumber);
            persist(updated);
            return updated;
        });
    }, []);

    const clearHistory = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setHistory([]);
    }, []);

    const duplicateInvoice = useCallback((entry: HistoryEntry, newNumber: string): InvoiceData => {
        return {
            ...entry.invoice,
            invoiceNumber: newNumber,
            issueDate: new Date().toISOString().split('T')[0],
            dueDate: (() => {
                const d = new Date();
                d.setDate(d.getDate() + 30);
                return d.toISOString().split('T')[0];
            })(),
            status: 'draft',
        };
    }, []);

    return {
        history,
        saveToHistory,
        deleteFromHistory,
        clearHistory,
        duplicateInvoice,
    };
};
