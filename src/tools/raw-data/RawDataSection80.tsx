import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Copy, CheckCircle2, Database, TableProperties, BookOpen } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { section80DeductionsData } from './section80Data';

interface Props { onBack: () => void; }

export const RawDataSection80: React.FC<Props> = ({ onBack }) => {
    const [search, setSearch] = useState('');
    const [copied, setCopied] = useState(false);
    const [regimeFilter, setRegimeFilter] = useState('All');

    const filtered = useMemo(() => {
        let d = section80DeductionsData;
        if (regimeFilter === 'New Regime') d = d.filter(r => r.availableInNewRegime);
        if (regimeFilter === 'Old Only') d = d.filter(r => !r.availableInNewRegime);
        if (search.trim()) { const q = search.toLowerCase(); d = d.filter(r => r.section.toLowerCase().includes(q) || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)); }
        return d;
    }, [search, regimeFilter]);

    const cols = ['#', 'Section', 'Title', 'Max Limit', 'Eligibility', 'New Regime?', 'Description', 'Remarks'];
    const row = (r: typeof section80DeductionsData[0]) => [r.sNo, r.section, r.title, r.maxLimit, r.eligibility, r.availableInNewRegime ? 'Yes' : 'No', r.description, r.remarks];

    const handleCopy = () => { navigator.clipboard.writeText([cols.join('\t'), ...filtered.map(r => row(r).join('\t'))].join('\n')); setCopied(true); setTimeout(() => setCopied(false), 2000); };
    const handleExcel = () => { const ws = XLSX.utils.json_to_sheet(filtered.map(r => ({'#':r.sNo,Section:r.section,Title:r.title,'Max Limit':r.maxLimit,Eligibility:r.eligibility,'New Regime':r.availableInNewRegime?'Yes':'No',Description:r.description,Remarks:r.remarks}))); const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Sec80'); XLSX.writeFile(wb, 'Section_80_Deductions.xlsx'); };
    const handlePDF = () => { const doc = new jsPDF({orientation:'landscape'}); doc.setFontSize(14); doc.text('Section 80 Deductions — FY 2025-26',14,18); autoTable(doc, {head:[cols],body:filtered.map(r=>row(r).map(String)),startY:28,styles:{fontSize:6},headStyles:{fillColor:[79,70,229]}}); doc.save('Section_80_Deductions.pdf'); };

    return (
        <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-violet-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none opacity-50" />
                <div className="relative z-10 flex items-center space-x-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft className="h-6 w-6 text-gray-500" /></button>
                    <div><h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><BookOpen className="h-6 w-6 text-violet-600" />Section 80 Deductions</h1><p className="text-gray-500 text-sm mt-1">{section80DeductionsData.length} deductions · 80C to 80U · FY 2025-26 limits</p></div>
                </div>
                <div className="flex items-center space-x-3 w-full md:w-auto mt-4 md:mt-0 relative z-10">
                    <button onClick={handleCopy} className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center space-x-2 text-sm font-medium text-gray-700 bg-white">{copied?<CheckCircle2 className="h-4 w-4 text-emerald-500"/>:<Copy className="h-4 w-4"/>}<span>{copied?'Copied':'Copy'}</span></button>
                    <button onClick={handlePDF} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 flex items-center space-x-2 text-sm font-medium border border-indigo-100"><Database className="h-4 w-4"/><span>PDF</span></button>
                    <button onClick={handleExcel} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 flex items-center space-x-2 text-sm font-medium border border-emerald-100"><TableProperties className="h-4 w-4"/><span>Excel</span></button>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50/50"><div className="flex flex-wrap gap-3 items-center">
                    <div className="relative flex-1 min-w-[200px] max-w-md"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400"/></div><input type="text" placeholder="Search section, title, keyword..." className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:text-sm shadow-sm" value={search} onChange={e=>setSearch(e.target.value)}/></div>
                    <select className="px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm shadow-sm" value={regimeFilter} onChange={e=>setRegimeFilter(e.target.value)}><option value="All">🏛️ All Sections</option><option value="New Regime">✅ Available in New Regime</option><option value="Old Only">📋 Old Regime Only</option></select>
                </div></div>
                <div className="overflow-x-auto"><table className="w-full text-left border-collapse"><thead><tr className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider">{cols.map(c=><th key={c} className="px-3 py-3 font-semibold border-b border-gray-100 whitespace-nowrap">{c}</th>)}</tr></thead>
                <tbody className="divide-y divide-gray-100">{filtered.length>0?filtered.map((r,i)=>(
                    <tr key={i} className={`hover:bg-violet-50/30 transition-colors ${r.availableInNewRegime?'bg-emerald-50/20':''}`}>
                        <td className="px-3 py-2 text-xs text-gray-400">{r.sNo}</td>
                        <td className="px-3 py-2 text-xs font-bold text-violet-700">{r.section}</td>
                        <td className="px-3 py-2 text-xs font-semibold text-gray-900">{r.title}</td>
                        <td className="px-3 py-2 text-xs font-bold text-emerald-700 whitespace-nowrap">{r.maxLimit}</td>
                        <td className="px-3 py-2 text-[10px] text-gray-600">{r.eligibility}</td>
                        <td className="px-3 py-2"><span className={`inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-medium ${r.availableInNewRegime?'bg-emerald-100 text-emerald-800':'bg-red-100 text-red-800'}`}>{r.availableInNewRegime?'Yes':'No'}</span></td>
                        <td className="px-3 py-2 text-[10px] text-gray-700 max-w-[250px]">{r.description}</td>
                        <td className="px-3 py-2 text-[10px] text-gray-500 max-w-[180px]">{r.remarks}</td>
                    </tr>
                )):<tr><td colSpan={8} className="px-6 py-12 text-center"><Search className="h-8 w-8 text-gray-300 mx-auto mb-3"/><p className="text-lg font-medium text-gray-900">No matching sections</p></td></tr>}</tbody></table></div>
                <div className="p-4 border-t border-gray-100 bg-gray-50 text-sm text-gray-500"><span>Showing {filtered.length} of {section80DeductionsData.length} sections</span></div>
            </div>
        </div>
    );
};
