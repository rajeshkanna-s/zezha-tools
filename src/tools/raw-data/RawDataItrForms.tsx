import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Copy, CheckCircle2, Database, TableProperties, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { itrFormsData } from './itrFormsData';

interface Props { onBack: () => void; }

export const RawDataItrForms: React.FC<Props> = ({ onBack }) => {
    const [search, setSearch] = useState('');
    const [copied, setCopied] = useState(false);

    const filtered = useMemo(() => {
        if (!search.trim()) return itrFormsData;
        const q = search.toLowerCase();
        return itrFormsData.filter(r => r.form.toLowerCase().includes(q) || r.applicableTo.toLowerCase().includes(q) || r.incomeTypes.toLowerCase().includes(q));
    }, [search]);

    const cols = ['#', 'Form', 'Applicable To', 'Income Types', 'Not Applicable If', 'Due Date', 'Audit?', 'Remarks'];
    const row = (r: typeof itrFormsData[0]) => [r.sNo, r.form, r.applicableTo, r.incomeTypes, r.notApplicableIf, r.dueDate, r.auditRequired, r.remarks];

    const handleCopy = () => { navigator.clipboard.writeText([cols.join('\t'), ...filtered.map(r => row(r).join('\t'))].join('\n')); setCopied(true); setTimeout(() => setCopied(false), 2000); };
    const handleExcel = () => { const ws = XLSX.utils.json_to_sheet(filtered.map(r => ({'#':r.sNo,Form:r.form,'Applicable To':r.applicableTo,'Income Types':r.incomeTypes,'Not Applicable If':r.notApplicableIf,'Due Date':r.dueDate,'Audit Required':r.auditRequired,Remarks:r.remarks}))); const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'ITR_Forms'); XLSX.writeFile(wb, 'ITR_Forms_Guide.xlsx'); };
    const handlePDF = () => { const doc = new jsPDF({orientation:'landscape'}); doc.setFontSize(14); doc.text('ITR Forms Guide — AY 2026-27',14,18); autoTable(doc, {head:[cols],body:filtered.map(r=>row(r).map(String)),startY:28,styles:{fontSize:6},headStyles:{fillColor:[79,70,229]}}); doc.save('ITR_Forms_Guide.pdf'); };

    const formColor = (f: string) => f.includes('ITR-1') ? 'bg-emerald-100 text-emerald-800' : f.includes('ITR-2') ? 'bg-blue-100 text-blue-800' : f.includes('ITR-3') ? 'bg-violet-100 text-violet-800' : f.includes('ITR-4') ? 'bg-amber-100 text-amber-800' : f.includes('ITR-U') ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800';

    return (
        <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none opacity-50" />
                <div className="relative z-10 flex items-center space-x-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft className="h-6 w-6 text-gray-500" /></button>
                    <div><h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><FileText className="h-6 w-6 text-rose-600" />ITR Forms Guide</h1><p className="text-gray-500 text-sm mt-1">{itrFormsData.length} forms · Which form for which entity · AY 2026-27</p></div>
                </div>
                <div className="flex items-center space-x-3 w-full md:w-auto mt-4 md:mt-0 relative z-10">
                    <button onClick={handleCopy} className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center space-x-2 text-sm font-medium text-gray-700 bg-white">{copied?<CheckCircle2 className="h-4 w-4 text-emerald-500"/>:<Copy className="h-4 w-4"/>}<span>{copied?'Copied':'Copy'}</span></button>
                    <button onClick={handlePDF} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 flex items-center space-x-2 text-sm font-medium border border-indigo-100"><Database className="h-4 w-4"/><span>PDF</span></button>
                    <button onClick={handleExcel} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 flex items-center space-x-2 text-sm font-medium border border-emerald-100"><TableProperties className="h-4 w-4"/><span>Excel</span></button>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50/50"><div className="relative max-w-md"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400"/></div><input type="text" placeholder="Search form, entity type, income type..." className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:text-sm shadow-sm" value={search} onChange={e=>setSearch(e.target.value)}/></div></div>
                <div className="overflow-x-auto"><table className="w-full text-left border-collapse"><thead><tr className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider">{cols.map(c=><th key={c} className="px-3 py-3 font-semibold border-b border-gray-100 whitespace-nowrap">{c}</th>)}</tr></thead>
                <tbody className="divide-y divide-gray-100">{filtered.map((r,i)=>(
                    <tr key={i} className="hover:bg-rose-50/30 transition-colors">
                        <td className="px-3 py-3 text-xs text-gray-400">{r.sNo}</td>
                        <td className="px-3 py-3"><span className={`inline-flex px-2 py-1 rounded-lg text-xs font-bold ${formColor(r.form)}`}>{r.form}</span></td>
                        <td className="px-3 py-3 text-xs font-semibold text-gray-900">{r.applicableTo}</td>
                        <td className="px-3 py-3 text-[10px] text-gray-700 max-w-[220px]">{r.incomeTypes}</td>
                        <td className="px-3 py-3 text-[10px] text-red-600 max-w-[200px]">{r.notApplicableIf}</td>
                        <td className="px-3 py-3 text-xs font-medium text-blue-700 whitespace-nowrap">{r.dueDate}</td>
                        <td className="px-3 py-3 text-xs text-gray-600">{r.auditRequired}</td>
                        <td className="px-3 py-3 text-[10px] text-gray-500 max-w-[180px]">{r.remarks}</td>
                    </tr>
                ))}</tbody></table></div>
                <div className="p-4 border-t border-gray-100 bg-gray-50 text-sm text-gray-500">Showing {filtered.length} of {itrFormsData.length} forms</div>
            </div>
        </div>
    );
};
