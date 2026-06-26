import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Copy, CheckCircle2, Database, TableProperties, TrendingUp } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { costInflationIndexData } from './costInflationIndexData';

interface Props { onBack: () => void; }

export const RawDataCii: React.FC<Props> = ({ onBack }) => {
    const [search, setSearch] = useState('');
    const [copied, setCopied] = useState(false);

    const filtered = useMemo(() => {
        if (!search.trim()) return costInflationIndexData;
        const q = search.toLowerCase();
        return costInflationIndexData.filter(r => r.financialYear.includes(q) || r.assessmentYear.includes(q) || String(r.ciiValue).includes(q));
    }, [search]);

    const cols = ['#', 'Financial Year', 'Assessment Year', 'CII Value', 'YoY Change', 'CBDT Notification'];
    const row = (r: typeof costInflationIndexData[0]) => [r.sNo, r.financialYear, r.assessmentYear, r.ciiValue, r.yoyChange, r.notification];

    const handleCopy = () => { navigator.clipboard.writeText([cols.join('\t'), ...filtered.map(r => row(r).join('\t'))].join('\n')); setCopied(true); setTimeout(() => setCopied(false), 2000); };
    const handleExcel = () => { const ws = XLSX.utils.json_to_sheet(filtered.map(r => ({'#':r.sNo,'Financial Year':r.financialYear,'Assessment Year':r.assessmentYear,'CII Value':r.ciiValue,'YoY Change':r.yoyChange,Notification:r.notification}))); const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'CII'); XLSX.writeFile(wb, 'Cost_Inflation_Index.xlsx'); };
    const handlePDF = () => { const doc = new jsPDF(); doc.setFontSize(14); doc.text('Cost Inflation Index (CII) — 2001-02 to 2025-26',14,18); autoTable(doc, {head:[cols],body:filtered.map(r=>row(r).map(String)),startY:28,styles:{fontSize:8},headStyles:{fillColor:[79,70,229]}}); doc.save('Cost_Inflation_Index.pdf'); };

    return (
        <div className="max-w-[1000px] mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-cyan-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none opacity-50" />
                <div className="relative z-10 flex items-center space-x-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft className="h-6 w-6 text-gray-500" /></button>
                    <div><h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><TrendingUp className="h-6 w-6 text-cyan-600" />Cost Inflation Index (CII)</h1><p className="text-gray-500 text-sm mt-1">{costInflationIndexData.length} years · Base Year 2001-02 = 100 · For LTCG indexation</p></div>
                </div>
                <div className="flex items-center space-x-3 w-full md:w-auto mt-4 md:mt-0 relative z-10">
                    <button onClick={handleCopy} className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center space-x-2 text-sm font-medium text-gray-700 bg-white">{copied?<CheckCircle2 className="h-4 w-4 text-emerald-500"/>:<Copy className="h-4 w-4"/>}<span>{copied?'Copied':'Copy'}</span></button>
                    <button onClick={handlePDF} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 flex items-center space-x-2 text-sm font-medium border border-indigo-100"><Database className="h-4 w-4"/><span>PDF</span></button>
                    <button onClick={handleExcel} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 flex items-center space-x-2 text-sm font-medium border border-emerald-100"><TableProperties className="h-4 w-4"/><span>Excel</span></button>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50/50"><div className="relative max-w-md"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400"/></div><input type="text" placeholder="Search year or CII value..." className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:text-sm shadow-sm" value={search} onChange={e=>setSearch(e.target.value)}/></div></div>
                <div className="overflow-x-auto"><table className="w-full text-left border-collapse"><thead><tr className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider">{cols.map(c=><th key={c} className="px-4 py-3 font-semibold border-b border-gray-100 whitespace-nowrap">{c}</th>)}</tr></thead>
                <tbody className="divide-y divide-gray-100">{filtered.map((r,i)=>(
                    <tr key={i} className={`hover:bg-cyan-50/30 transition-colors ${r.financialYear==='2025-26'?'bg-cyan-50/50 font-bold':''}`}>
                        <td className="px-4 py-2.5 text-sm text-gray-400">{r.sNo}</td>
                        <td className="px-4 py-2.5 text-sm font-semibold text-gray-900">{r.financialYear}</td>
                        <td className="px-4 py-2.5 text-sm text-gray-700">{r.assessmentYear}</td>
                        <td className="px-4 py-2.5 text-sm font-bold text-cyan-700">{r.ciiValue}</td>
                        <td className="px-4 py-2.5 text-sm"><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${r.yoyChange==='Base Year'?'bg-gray-100 text-gray-700':'bg-emerald-100 text-emerald-800'}`}>{r.yoyChange}</span></td>
                        <td className="px-4 py-2.5 text-xs text-gray-500">{r.notification}</td>
                    </tr>
                ))}</tbody></table></div>
                <div className="p-4 border-t border-gray-100 bg-gray-50 text-sm text-gray-500">Showing {filtered.length} of {costInflationIndexData.length} years</div>
            </div>
        </div>
    );
};
