import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Copy, CheckCircle2, Database, TableProperties, Clock } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { statutoryDueDatesData } from './statutoryDueDatesData';

interface Props { onBack: () => void; }

export const RawDataStatutoryDueDates: React.FC<Props> = ({ onBack }) => {
    const [search, setSearch] = useState('');
    const [copied, setCopied] = useState(false);
    const [deptFilter, setDeptFilter] = useState('All');
    const depts = useMemo(() => ['All', ...Array.from(new Set(statutoryDueDatesData.map(r => r.department))).sort()], []);
    const filtered = useMemo(() => {
        let data = statutoryDueDatesData;
        if (deptFilter !== 'All') data = data.filter(r => r.department === deptFilter);
        if (search.trim()) { const q = search.toLowerCase(); data = data.filter(r => r.obligation.toLowerCase().includes(q) || r.applicableLaw.toLowerCase().includes(q) || r.remarks.toLowerCase().includes(q)); }
        return data;
    }, [search, deptFilter]);

    const cols = ['#', 'Obligation', 'Due Date', 'Frequency', 'Law', 'Late Fee / Penalty', 'Dept', 'Remarks'];
    const row = (r: typeof statutoryDueDatesData[0]) => [r.sNo, r.obligation, r.dueDate, r.frequency, r.applicableLaw, r.lateFee, r.department, r.remarks];

    const handleCopy = () => { navigator.clipboard.writeText([cols.join('\t'), ...filtered.map(r => row(r).join('\t'))].join('\n')); setCopied(true); setTimeout(() => setCopied(false), 2000); };
    const handleExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filtered.map(r => ({ '#': r.sNo, Obligation: r.obligation, 'Due Date': r.dueDate, Frequency: r.frequency, Law: r.applicableLaw, 'Late Fee': r.lateFee, Dept: r.department, Remarks: r.remarks })));
        const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Due Dates'); XLSX.writeFile(wb, 'Statutory_Due_Dates.xlsx');
    };
    const handlePDF = () => {
        const doc = new jsPDF({ orientation: 'landscape' }); doc.setFontSize(14); doc.text('Statutory Payment Due Dates — HR & Finance', 14, 18);
        doc.setFontSize(9); doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 25);
        autoTable(doc, { head: [cols], body: filtered.map(r => row(r).map(String)), startY: 30, styles: { fontSize: 6.5 }, headStyles: { fillColor: [220, 38, 38] } });
        doc.save('Statutory_Due_Dates.pdf');
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-red-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none opacity-50" />
                <div className="relative z-10 flex items-center space-x-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft className="h-6 w-6 text-gray-500" /></button>
                    <div><h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Clock className="h-6 w-6 text-red-600" />Statutory Payment Due Dates</h1><p className="text-gray-500 text-sm mt-1">{statutoryDueDatesData.length} obligations · PF, ESI, TDS, GST, IT, ROC & Labour</p></div>
                </div>
                <div className="flex items-center space-x-3 w-full md:w-auto mt-4 md:mt-0 relative z-10">
                    <button onClick={handleCopy} className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center space-x-2 text-sm font-medium text-gray-700 bg-white">{copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}<span>{copied ? 'Copied' : 'Copy'}</span></button>
                    <button onClick={handlePDF} className="px-4 py-2 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 flex items-center space-x-2 text-sm font-medium border border-red-100"><Database className="h-4 w-4" /><span>PDF</span></button>
                    <button onClick={handleExcel} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 flex items-center space-x-2 text-sm font-medium border border-emerald-100"><TableProperties className="h-4 w-4" /><span>Excel</span></button>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-3">
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400" /></div>
                        <input type="text" placeholder="Search obligation, law..." className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 sm:text-sm shadow-sm" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <select className="px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm shadow-sm" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>{depts.map(s => <option key={s} value={s}>{s === 'All' ? '🏢 All Departments' : s === 'HR' ? '👥 HR' : s === 'Finance' ? '💰 Finance' : '📋 Both'}</option>)}</select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">{cols.map(c => <th key={c} className="px-4 py-4 font-semibold border-b border-gray-100">{c}</th>)}</tr></thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.length > 0 ? filtered.map((r, i) => (
                                <tr key={i} className="hover:bg-red-50/30 transition-colors">
                                    <td className="px-4 py-3 text-sm text-gray-400">{r.sNo}</td>
                                    <td className="px-4 py-3 text-sm font-bold text-gray-900">{r.obligation}</td>
                                    <td className="px-4 py-3 text-sm font-bold text-red-700">{r.dueDate}</td>
                                    <td className="px-4 py-3 text-xs"><span className={`px-2 py-0.5 rounded-full font-bold ${r.frequency === 'Monthly' ? 'bg-blue-100 text-blue-800' : r.frequency === 'Quarterly' ? 'bg-amber-100 text-amber-800' : r.frequency === 'Annual' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'}`}>{r.frequency}</span></td>
                                    <td className="px-4 py-3 text-xs text-gray-600">{r.applicableLaw}</td>
                                    <td className="px-4 py-3 text-xs text-red-600 font-semibold">{r.lateFee}</td>
                                    <td className="px-4 py-3 text-xs"><span className={`px-2 py-0.5 rounded-full font-bold ${r.department === 'HR' ? 'bg-emerald-100 text-emerald-800' : r.department === 'Finance' ? 'bg-indigo-100 text-indigo-800' : 'bg-pink-100 text-pink-800'}`}>{r.department}</span></td>
                                    <td className="px-4 py-3 text-xs text-gray-500">{r.remarks}</td>
                                </tr>
                            )) : <tr><td colSpan={8} className="px-6 py-12 text-center"><Search className="h-8 w-8 text-gray-300 mx-auto mb-3" /><p className="text-lg font-medium text-gray-900">No matching data</p></td></tr>}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center text-sm text-gray-500">
                    <span>Showing {filtered.length} records</span><span className="font-mono bg-white px-2 py-1 border border-gray-200 rounded text-xs">Source: EPFO, ESIC, IT Act, CGST Act, Companies Act</span>
                </div>
            </div>
        </div>
    );
};
