import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Copy, CheckCircle2, Database, TableProperties, Building } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { bankFdRatesData } from './bankFdRatesData';

interface Props { onBack: () => void; }

export const RawDataBankFdRates: React.FC<Props> = ({ onBack }) => {
    const [search, setSearch] = useState('');
    const [copied, setCopied] = useState(false);
    const [typeFilter, setTypeFilter] = useState('All');
    const types = useMemo(() => ['All', ...Array.from(new Set(bankFdRatesData.map(r => r.bankType))).sort()], []);
    const filtered = useMemo(() => {
        let data = bankFdRatesData;
        if (typeFilter !== 'All') data = data.filter(r => r.bankType === typeFilter);
        if (search.trim()) { const q = search.toLowerCase(); data = data.filter(r => r.bankName.toLowerCase().includes(q) || r.remarks.toLowerCase().includes(q)); }
        return data;
    }, [search, typeFilter]);

    const cols = ['#', 'Bank', 'Type', '91-180d', '181d-1yr', '1 yr', '1-2 yr', '2-3 yr', '3-5 yr', '5yr+', 'Sr.Citz +', 'Tax Saver'];
    const row = (r: typeof bankFdRatesData[0]) => [r.sNo, r.bankName, r.bankType, r.tenure91to180days || '-', r.tenure181daysTo1yr || '-', r.tenure1yr, r.tenure1to2yr, r.tenure2to3yr, r.tenure3to5yr, r.tenure5to10yr, '+' + r.seniorCitizenExtra + '%', r.taxSaverFD];

    const handleCopy = () => { navigator.clipboard.writeText([cols.join('\t'), ...filtered.map(r => row(r).join('\t'))].join('\n')); setCopied(true); setTimeout(() => setCopied(false), 2000); };
    const handleExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filtered.map(r => ({ '#': r.sNo, Bank: r.bankName, Type: r.bankType, '91-180d': r.tenure91to180days, '181d-1yr': r.tenure181daysTo1yr, '1yr': r.tenure1yr, '1-2yr': r.tenure1to2yr, '2-3yr': r.tenure2to3yr, '3-5yr': r.tenure3to5yr, '5yr+': r.tenure5to10yr, 'Sr Citizen Extra': r.seniorCitizenExtra, 'Tax Saver 5yr': r.taxSaverFD, Remarks: r.remarks })));
        const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'FD Rates'); XLSX.writeFile(wb, 'Bank_FD_Rates.xlsx');
    };
    const handlePDF = () => {
        const doc = new jsPDF({ orientation: 'landscape' }); doc.setFontSize(14); doc.text('Bank FD Interest Rates — Comparison', 14, 18);
        doc.setFontSize(9); doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 25);
        autoTable(doc, { head: [cols], body: filtered.map(r => row(r).map(String)), startY: 30, styles: { fontSize: 6.5 }, headStyles: { fillColor: [79, 70, 229] } });
        doc.save('Bank_FD_Rates.pdf');
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none opacity-50" />
                <div className="relative z-10 flex items-center space-x-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft className="h-6 w-6 text-gray-500" /></button>
                    <div><h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Building className="h-6 w-6 text-indigo-600" />Bank FD Rates — Comparison</h1><p className="text-gray-500 text-sm mt-1">{bankFdRatesData.length} banks · PSU, Private, SFB, NBFC & Post Office</p></div>
                </div>
                <div className="flex items-center space-x-3 w-full md:w-auto mt-4 md:mt-0 relative z-10">
                    <button onClick={handleCopy} className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center space-x-2 text-sm font-medium text-gray-700 bg-white">{copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}<span>{copied ? 'Copied' : 'Copy'}</span></button>
                    <button onClick={handlePDF} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 flex items-center space-x-2 text-sm font-medium border border-indigo-100"><Database className="h-4 w-4" /><span>PDF</span></button>
                    <button onClick={handleExcel} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 flex items-center space-x-2 text-sm font-medium border border-emerald-100"><TableProperties className="h-4 w-4" /><span>Excel</span></button>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-3">
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400" /></div>
                        <input type="text" placeholder="Search bank name..." className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:text-sm shadow-sm" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <select className="px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm shadow-sm" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>{types.map(s => <option key={s} value={s}>{s === 'All' ? '🏦 All Types' : s}</option>)}</select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">{cols.map(c => <th key={c} className="px-4 py-4 font-semibold border-b border-gray-100 whitespace-nowrap">{c}</th>)}</tr></thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.length > 0 ? filtered.map((r, i) => (
                                <tr key={i} className="hover:bg-indigo-50/30 transition-colors">
                                    <td className="px-4 py-3 text-sm text-gray-400">{r.sNo}</td>
                                    <td className="px-4 py-3 text-sm font-bold text-gray-900 whitespace-nowrap">{r.bankName}</td>
                                    <td className="px-4 py-3 text-xs"><span className={`px-2 py-0.5 rounded-full font-bold ${r.bankType === 'PSU' ? 'bg-blue-100 text-blue-800' : r.bankType === 'Private' ? 'bg-purple-100 text-purple-800' : r.bankType === 'SFB' ? 'bg-amber-100 text-amber-800' : r.bankType === 'NBFC' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{r.bankType}</span></td>
                                    <td className="px-4 py-3 font-mono text-sm text-gray-600">{r.tenure91to180days || '-'}</td>
                                    <td className="px-4 py-3 font-mono text-sm text-gray-600">{r.tenure181daysTo1yr || '-'}</td>
                                    <td className="px-4 py-3 font-mono text-sm font-bold text-indigo-700">{r.tenure1yr}%</td>
                                    <td className="px-4 py-3 font-mono text-sm text-gray-700">{r.tenure1to2yr}</td>
                                    <td className="px-4 py-3 font-mono text-sm text-gray-700">{r.tenure2to3yr}</td>
                                    <td className="px-4 py-3 font-mono text-sm text-gray-700">{r.tenure3to5yr}</td>
                                    <td className="px-4 py-3 font-mono text-sm text-gray-700">{r.tenure5to10yr}</td>
                                    <td className="px-4 py-3 text-sm text-emerald-700 font-bold">+{r.seniorCitizenExtra}%</td>
                                    <td className="px-4 py-3 text-xs font-semibold text-gray-600">{r.taxSaverFD}</td>
                                </tr>
                            )) : <tr><td colSpan={12} className="px-6 py-12 text-center"><Search className="h-8 w-8 text-gray-300 mx-auto mb-3" /><p className="text-lg font-medium text-gray-900">No matching data</p></td></tr>}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center text-sm text-gray-500">
                    <span>Showing {filtered.length} records</span><span className="font-mono bg-white px-2 py-1 border border-gray-200 rounded text-xs">Source: Bank websites · Rates may change without notice</span>
                </div>
            </div>
        </div>
    );
};
