import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Copy, CheckCircle2, Database, TableProperties, Landmark } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { professionalTaxData } from './professionalTaxData';

interface Props { onBack: () => void; }
const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

export const RawDataProfTax: React.FC<Props> = ({ onBack }) => {
    const [search, setSearch] = useState('');
    const [copied, setCopied] = useState(false);
    const [stateFilter, setStateFilter] = useState('All');
    const states = useMemo(() => ['All', ...Array.from(new Set(professionalTaxData.map(r => r.state))).sort()], []);
    const filtered = useMemo(() => {
        let data = professionalTaxData;
        if (stateFilter !== 'All') data = data.filter(r => r.state === stateFilter);
        if (search.trim()) { const q = search.toLowerCase(); data = data.filter(r => r.state.toLowerCase().includes(q) || r.remarks.toLowerCase().includes(q)); }
        return data;
    }, [search, stateFilter]);

    const cols = ['#', 'State', 'Slab From', 'Slab To', 'Monthly Tax', 'Max Annual', 'Remarks'];
    const row = (r: typeof professionalTaxData[0]) => [r.sNo, r.state, fmt(r.monthlySlabFrom), r.monthlySlabTo ? fmt(r.monthlySlabTo) : 'Above', fmt(r.monthlyTax), fmt(r.maxAnnual), r.remarks];

    const handleCopy = () => { navigator.clipboard.writeText([cols.join('\t'), ...filtered.map(r => row(r).join('\t'))].join('\n')); setCopied(true); setTimeout(() => setCopied(false), 2000); };
    const handleExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filtered.map(r => ({ '#': r.sNo, State: r.state, 'Slab From': r.monthlySlabFrom, 'Slab To': r.monthlySlabTo || 'Above', 'Monthly Tax': r.monthlyTax, 'Max Annual': r.maxAnnual, Remarks: r.remarks })));
        const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Prof Tax'); XLSX.writeFile(wb, 'Professional_Tax_Rates.xlsx');
    };
    const handlePDF = () => {
        const doc = new jsPDF({ orientation: 'landscape' }); doc.setFontSize(14); doc.text('Professional Tax — State-wise Rates', 14, 18);
        doc.setFontSize(9); doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 25);
        autoTable(doc, { head: [cols], body: filtered.map(r => row(r).map(String)), startY: 30, styles: { fontSize: 7 }, headStyles: { fillColor: [168, 85, 247] } });
        doc.save('Professional_Tax_Rates.pdf');
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none opacity-50" />
                <div className="relative z-10 flex items-center space-x-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft className="h-6 w-6 text-gray-500" /></button>
                    <div><h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Landmark className="h-6 w-6 text-purple-600" />Professional Tax Rates (State-wise)</h1><p className="text-gray-500 text-sm mt-1">{states.length - 1} states · Monthly slabs & annual maximum</p></div>
                </div>
                <div className="flex items-center space-x-3 w-full md:w-auto mt-4 md:mt-0 relative z-10">
                    <button onClick={handleCopy} className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center space-x-2 text-sm font-medium text-gray-700 bg-white">{copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}<span>{copied ? 'Copied' : 'Copy'}</span></button>
                    <button onClick={handlePDF} className="px-4 py-2 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 flex items-center space-x-2 text-sm font-medium border border-purple-100"><Database className="h-4 w-4" /><span>PDF</span></button>
                    <button onClick={handleExcel} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 flex items-center space-x-2 text-sm font-medium border border-emerald-100"><TableProperties className="h-4 w-4" /><span>Excel</span></button>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-3">
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400" /></div>
                        <input type="text" placeholder="Search state, remarks..." className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 sm:text-sm shadow-sm" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <select className="px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm shadow-sm" value={stateFilter} onChange={e => setStateFilter(e.target.value)}>{states.map(s => <option key={s} value={s}>{s === 'All' ? '🏛️ All States' : s}</option>)}</select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">{cols.map(c => <th key={c} className="px-5 py-4 font-semibold border-b border-gray-100">{c}</th>)}</tr></thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.length > 0 ? filtered.map((r, i) => (
                                <tr key={i} className={`hover:bg-purple-50/30 transition-colors ${r.monthlyTax === 0 && r.maxAnnual === 0 ? 'bg-green-50/30' : ''}`}>
                                    <td className="px-5 py-3 text-sm text-gray-400">{r.sNo}</td>
                                    <td className="px-5 py-3 text-sm font-bold text-gray-900">{r.state}</td>
                                    <td className="px-5 py-3 font-mono text-sm text-gray-700">{fmt(r.monthlySlabFrom)}</td>
                                    <td className="px-5 py-3 font-mono text-sm text-gray-700">{r.monthlySlabTo ? fmt(r.monthlySlabTo) : 'Above'}</td>
                                    <td className="px-5 py-3 text-sm font-bold text-purple-700">{fmt(r.monthlyTax)}</td>
                                    <td className="px-5 py-3 text-sm text-gray-600">{fmt(r.maxAnnual)}</td>
                                    <td className="px-5 py-3 text-xs text-gray-500">{r.remarks}</td>
                                </tr>
                            )) : <tr><td colSpan={7} className="px-6 py-12 text-center"><Search className="h-8 w-8 text-gray-300 mx-auto mb-3" /><p className="text-lg font-medium text-gray-900">No matching data</p></td></tr>}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center text-sm text-gray-500">
                    <span>Showing {filtered.length} records</span><span className="font-mono bg-white px-2 py-1 border border-gray-200 rounded text-xs">Source: State Revenue Depts · Max ₹2,500/year (Article 276)</span>
                </div>
            </div>
        </div>
    );
};
