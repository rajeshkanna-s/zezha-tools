import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Copy, CheckCircle2, Database, TableProperties, Briefcase } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { minimumWagesData } from './minimumWagesData';

interface Props { onBack: () => void; }
const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

export const RawDataMinWages: React.FC<Props> = ({ onBack }) => {
    const [search, setSearch] = useState('');
    const [copied, setCopied] = useState(false);
    const [stateFilter, setStateFilter] = useState('All');
    const states = useMemo(() => ['All', ...Array.from(new Set(minimumWagesData.map(r => r.state))).sort()], []);
    const filtered = useMemo(() => {
        let data = minimumWagesData;
        if (stateFilter !== 'All') data = data.filter(r => r.state === stateFilter);
        if (search.trim()) { const q = search.toLowerCase(); data = data.filter(r => r.state.toLowerCase().includes(q) || r.category.toLowerCase().includes(q) || r.zone.toLowerCase().includes(q)); }
        return data;
    }, [search, stateFilter]);

    const cols = ['#', 'State', 'Category', 'Monthly Min', 'Daily Min', 'Effective From', 'Zone', 'Remarks'];
    const row = (r: typeof minimumWagesData[0]) => [r.sNo, r.state, r.category, fmt(r.monthlyMin), fmt(r.dailyMin), r.effectiveFrom, r.zone, r.remarks];

    const handleCopy = () => { navigator.clipboard.writeText([cols.join('\t'), ...filtered.map(r => row(r).join('\t'))].join('\n')); setCopied(true); setTimeout(() => setCopied(false), 2000); };
    const handleExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filtered.map(r => ({ '#': r.sNo, State: r.state, Category: r.category, 'Monthly Min': r.monthlyMin, 'Daily Min': r.dailyMin, 'Effective From': r.effectiveFrom, Zone: r.zone, Remarks: r.remarks })));
        const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Min Wages'); XLSX.writeFile(wb, 'Minimum_Wages_India.xlsx');
    };
    const handlePDF = () => {
        const doc = new jsPDF({ orientation: 'landscape' }); doc.setFontSize(14); doc.text('Minimum Wages — State-wise (India)', 14, 18);
        doc.setFontSize(9); doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 25);
        autoTable(doc, { head: [cols], body: filtered.map(r => row(r).map(String)), startY: 30, styles: { fontSize: 7 }, headStyles: { fillColor: [234, 88, 12] } });
        doc.save('Minimum_Wages_India.pdf');
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none opacity-50" />
                <div className="relative z-10 flex items-center space-x-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft className="h-6 w-6 text-gray-500" /></button>
                    <div><h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Briefcase className="h-6 w-6 text-orange-600" />Minimum Wages (State-wise)</h1><p className="text-gray-500 text-sm mt-1">{minimumWagesData.length} entries across {states.length - 1} states · Unskilled / Semi-skilled / Skilled</p></div>
                </div>
                <div className="flex items-center space-x-3 w-full md:w-auto mt-4 md:mt-0 relative z-10">
                    <button onClick={handleCopy} className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center space-x-2 text-sm font-medium text-gray-700 bg-white">{copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}<span>{copied ? 'Copied' : 'Copy'}</span></button>
                    <button onClick={handlePDF} className="px-4 py-2 bg-orange-50 text-orange-700 rounded-xl hover:bg-orange-100 flex items-center space-x-2 text-sm font-medium border border-orange-100"><Database className="h-4 w-4" /><span>PDF</span></button>
                    <button onClick={handleExcel} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 flex items-center space-x-2 text-sm font-medium border border-emerald-100"><TableProperties className="h-4 w-4" /><span>Excel</span></button>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-3">
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400" /></div>
                        <input type="text" placeholder="Search state, category, zone..." className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 sm:text-sm shadow-sm" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <select className="px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm shadow-sm" value={stateFilter} onChange={e => setStateFilter(e.target.value)}>{states.map(s => <option key={s} value={s}>{s === 'All' ? '🏭 All States' : s}</option>)}</select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">{cols.map(c => <th key={c} className="px-4 py-3 font-semibold border-b border-gray-100 whitespace-nowrap">{c}</th>)}</tr></thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.length > 0 ? filtered.map((r, i) => (
                                <tr key={i} className="hover:bg-orange-50/30 transition-colors">
                                    <td className="px-4 py-2.5 text-xs text-gray-400">{r.sNo}</td>
                                    <td className="px-4 py-2.5 text-xs font-bold text-gray-900">{r.state}</td>
                                    <td className="px-4 py-2.5"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.category.includes('Unskilled') ? 'bg-amber-100 text-amber-800' : r.category.includes('Semi') ? 'bg-blue-100 text-blue-800' : r.category.includes('Skilled') ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'}`}>{r.category}</span></td>
                                    <td className="px-4 py-2.5 text-xs font-bold text-orange-700 font-mono">{fmt(r.monthlyMin)}</td>
                                    <td className="px-4 py-2.5 text-xs text-gray-700 font-mono">{fmt(r.dailyMin)}</td>
                                    <td className="px-4 py-2.5 text-xs text-gray-600">{r.effectiveFrom}</td>
                                    <td className="px-4 py-2.5 text-[10px] text-gray-500">{r.zone}</td>
                                    <td className="px-4 py-2.5 text-[10px] text-gray-500 max-w-[200px]">{r.remarks}</td>
                                </tr>
                            )) : <tr><td colSpan={8} className="px-6 py-12 text-center"><Search className="h-8 w-8 text-gray-300 mx-auto mb-3" /><p className="text-lg font-medium text-gray-900">No matching data</p></td></tr>}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center text-sm text-gray-500">
                    <span>Showing {filtered.length} records</span><span className="font-mono bg-white px-2 py-1 border border-gray-200 rounded text-xs">Source: Ministry of Labour · State Notifications</span>
                </div>
            </div>
        </div>
    );
};
