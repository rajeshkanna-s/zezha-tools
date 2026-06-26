import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Copy, CheckCircle2, Database, TableProperties, ClipboardCheck } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { auditLimitsData } from './auditLimitsData';

interface Props { onBack: () => void; }

export const RawDataAuditLimits: React.FC<Props> = ({ onBack }) => {
    const [search, setSearch] = useState('');
    const [copied, setCopied] = useState(false);
    const [actFilter, setActFilter] = useState('All');

    const acts = useMemo(() => ['All', ...Array.from(new Set(auditLimitsData.map(r => r.act))).sort()], []);

    const filtered = useMemo(() => {
        let d = auditLimitsData;
        if (actFilter !== 'All') d = d.filter(r => r.act === actFilter);
        if (search.trim()) { const q = search.toLowerCase(); d = d.filter(r => r.auditType.toLowerCase().includes(q) || r.section.toLowerCase().includes(q) || r.applicableTo.toLowerCase().includes(q) || r.threshold.toLowerCase().includes(q)); }
        return d;
    }, [search, actFilter]);

    const cols = ['#', 'Audit Type', 'Section', 'Act', 'Applicable To', 'Threshold', 'Due Date', 'Form', 'Penalty', 'Remarks'];
    const row = (r: typeof auditLimitsData[0]) => [r.sNo, r.auditType, r.section, r.act, r.applicableTo, r.threshold, r.dueDate, r.auditForm, r.penaltyForNonCompliance, r.remarks];

    const handleCopy = () => { navigator.clipboard.writeText([cols.join('\t'), ...filtered.map(r => row(r).join('\t'))].join('\n')); setCopied(true); setTimeout(() => setCopied(false), 2000); };
    const handleExcel = () => { const ws = XLSX.utils.json_to_sheet(filtered.map(r => ({'#':r.sNo,'Audit Type':r.auditType,Section:r.section,Act:r.act,'Applicable To':r.applicableTo,Threshold:r.threshold,'Due Date':r.dueDate,Form:r.auditForm,Penalty:r.penaltyForNonCompliance,Remarks:r.remarks}))); const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Audit_Limits'); XLSX.writeFile(wb, 'Audit_Threshold_Limits.xlsx'); };
    const handlePDF = () => { const doc = new jsPDF({orientation:'landscape'}); doc.setFontSize(14); doc.text('Audit Threshold Limits — Tax, GST, Company, Cost, Secretarial',14,18); autoTable(doc, {head:[cols],body:filtered.map(r=>row(r).map(String)),startY:28,styles:{fontSize:5.5},headStyles:{fillColor:[79,70,229]}}); doc.save('Audit_Threshold_Limits.pdf'); };

    return (
        <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none opacity-50" />
                <div className="relative z-10 flex items-center space-x-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft className="h-6 w-6 text-gray-500" /></button>
                    <div><h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><ClipboardCheck className="h-6 w-6 text-teal-600" />Audit Threshold Limits</h1><p className="text-gray-500 text-sm mt-1">{auditLimitsData.length} entries · Tax, GST, Company, Cost, Secretarial, TP Audit</p></div>
                </div>
                <div className="flex items-center space-x-3 w-full md:w-auto mt-4 md:mt-0 relative z-10">
                    <button onClick={handleCopy} className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center space-x-2 text-sm font-medium text-gray-700 bg-white">{copied?<CheckCircle2 className="h-4 w-4 text-emerald-500"/>:<Copy className="h-4 w-4"/>}<span>{copied?'Copied':'Copy'}</span></button>
                    <button onClick={handlePDF} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 flex items-center space-x-2 text-sm font-medium border border-indigo-100"><Database className="h-4 w-4"/><span>PDF</span></button>
                    <button onClick={handleExcel} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 flex items-center space-x-2 text-sm font-medium border border-emerald-100"><TableProperties className="h-4 w-4"/><span>Excel</span></button>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50/50"><div className="flex flex-wrap gap-3 items-center">
                    <div className="relative flex-1 min-w-[200px] max-w-md"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400"/></div><input type="text" placeholder="Search audit type, section, threshold..." className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:text-sm shadow-sm" value={search} onChange={e=>setSearch(e.target.value)}/></div>
                    <select className="px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm shadow-sm" value={actFilter} onChange={e=>setActFilter(e.target.value)}>{acts.map(a=><option key={a} value={a}>{a==='All'?'⚖️ All Acts':a}</option>)}</select>
                </div></div>
                <div className="overflow-x-auto"><table className="w-full text-left border-collapse"><thead><tr className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider">{cols.map(c=><th key={c} className="px-3 py-3 font-semibold border-b border-gray-100 whitespace-nowrap">{c}</th>)}</tr></thead>
                <tbody className="divide-y divide-gray-100">{filtered.length>0?filtered.map((r,i)=>(
                    <tr key={i} className="hover:bg-teal-50/30 transition-colors">
                        <td className="px-3 py-2 text-xs text-gray-400">{r.sNo}</td>
                        <td className="px-3 py-2 text-xs font-bold text-teal-700">{r.auditType}</td>
                        <td className="px-3 py-2 text-xs font-mono text-indigo-700">{r.section}</td>
                        <td className="px-3 py-2 text-[10px] text-gray-600">{r.act}</td>
                        <td className="px-3 py-2 text-[10px] text-gray-700">{r.applicableTo}</td>
                        <td className="px-3 py-2 text-[10px] font-medium text-gray-900 max-w-[200px]">{r.threshold}</td>
                        <td className="px-3 py-2 text-xs font-medium text-blue-700 whitespace-nowrap">{r.dueDate}</td>
                        <td className="px-3 py-2 text-[10px] text-gray-600">{r.auditForm}</td>
                        <td className="px-3 py-2 text-[10px] text-red-600 max-w-[150px]">{r.penaltyForNonCompliance}</td>
                        <td className="px-3 py-2 text-[10px] text-gray-500 max-w-[150px]">{r.remarks}</td>
                    </tr>
                )):<tr><td colSpan={10} className="px-6 py-12 text-center"><Search className="h-8 w-8 text-gray-300 mx-auto mb-3"/><p className="text-lg font-medium text-gray-900">No matching entries</p></td></tr>}</tbody></table></div>
                <div className="p-4 border-t border-gray-100 bg-gray-50 text-sm text-gray-500">Showing {filtered.length} of {auditLimitsData.length} entries</div>
            </div>
        </div>
    );
};
