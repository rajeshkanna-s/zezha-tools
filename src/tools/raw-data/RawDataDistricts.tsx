import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Copy, CheckCircle2, Database, TableProperties, Map } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { indianDistrictsData } from './indianDistrictsData';

interface Props { onBack: () => void; }

export const RawDataDistricts: React.FC<Props> = ({ onBack }) => {
    const [search, setSearch] = useState('');
    const [copied, setCopied] = useState(false);
    const filtered = useMemo(() => { if (!search.trim()) return indianDistrictsData; const q = search.toLowerCase(); return indianDistrictsData.filter(r => r.district.toLowerCase().includes(q) || r.state.toLowerCase().includes(q) || r.headquarters.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)); }, [search]);
    const cols = ['S.No', 'District', 'State', 'Population', 'Area (sq km)', 'Literacy', 'Headquarters', 'Category'];
    const row = (r: typeof indianDistrictsData[0]) => [r.sNo, r.district, r.state, r.population, r.area, r.literacy, r.headquarters, r.category];
    const handleCopy = () => { navigator.clipboard.writeText([cols.join('\t'), ...filtered.map(r => row(r).join('\t'))].join('\n')); setCopied(true); setTimeout(() => setCopied(false), 2000); };
    const handleExcel = () => { const ws = XLSX.utils.json_to_sheet(filtered.map(r => ({ 'S.No': r.sNo, 'District': r.district, 'State': r.state, 'Population': r.population, 'Area (sq km)': r.area, 'Literacy': r.literacy, 'Headquarters': r.headquarters, 'Category': r.category }))); const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Districts'); XLSX.writeFile(wb, 'Indian_Districts.xlsx'); };
    const handlePDF = () => { const doc = new jsPDF({ orientation: 'landscape' }); doc.setFontSize(16); doc.text('Indian Districts', 14, 20); doc.setFontSize(10); doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28); autoTable(doc, { head: [cols], body: filtered.map(r => row(r).map(String)), startY: 35, styles: { fontSize: 8 }, headStyles: { fillColor: [16, 185, 129] } }); doc.save('Indian_Districts.pdf'); };
    const catColor = (c: string) => c === 'Metro' ? 'bg-purple-100 text-purple-800' : c === 'Tier 1' ? 'bg-blue-100 text-blue-800' : c === 'Tier 2' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800';

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none opacity-50" />
                <div className="relative z-10 flex items-center space-x-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft className="h-6 w-6 text-gray-500" /></button>
                    <div><h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Map className="h-6 w-6 text-emerald-600" />Indian Districts</h1><p className="text-gray-500 text-sm mt-1">Raw dataset of {indianDistrictsData.length} districts with population, area, literacy rate.</p></div>
                </div>
                <div className="flex items-center space-x-3 w-full md:w-auto mt-4 md:mt-0 relative z-10">
                    <button onClick={handleCopy} className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center space-x-2 text-sm font-medium text-gray-700 bg-white">{copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}<span>{copied ? 'Copied' : 'Copy'}</span></button>
                    <button onClick={handlePDF} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 flex items-center space-x-2 text-sm font-medium border border-emerald-100"><Database className="h-4 w-4" /><span>PDF</span></button>
                    <button onClick={handleExcel} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 flex items-center space-x-2 text-sm font-medium border border-emerald-100"><TableProperties className="h-4 w-4" /><span>Excel</span></button>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50"><div className="relative max-w-md"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400" /></div><input type="text" placeholder="Search district, state, headquarters..." className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 sm:text-sm shadow-sm" value={search} onChange={e => setSearch(e.target.value)} /></div></div>
                <div className="overflow-x-auto"><table className="w-full text-left border-collapse"><thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">{cols.map(c => <th key={c} className="px-5 py-4 font-semibold border-b border-gray-100">{c}</th>)}</tr></thead><tbody className="divide-y divide-gray-100">{filtered.length > 0 ? filtered.map((r, i) => (<tr key={i} className="hover:bg-emerald-50/30 transition-colors"><td className="px-5 py-3 text-sm text-gray-500">{r.sNo}</td><td className="px-5 py-3 text-sm font-semibold text-gray-900">{r.district}</td><td className="px-5 py-3"><span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{r.state}</span></td><td className="px-5 py-3 text-sm text-gray-700 font-mono">{r.population}</td><td className="px-5 py-3 text-sm text-gray-600">{r.area}</td><td className="px-5 py-3 text-sm font-semibold text-emerald-700">{r.literacy}</td><td className="px-5 py-3 text-sm text-gray-700">{r.headquarters}</td><td className="px-5 py-3"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${catColor(r.category)}`}>{r.category}</span></td></tr>)) : <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-500"><Search className="h-8 w-8 text-gray-300 mx-auto mb-3" /><p className="text-lg font-medium">No matching data</p></td></tr>}</tbody></table></div>
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center text-sm text-gray-500"><span>Showing {filtered.length} records</span><span className="font-mono bg-white px-2 py-1 border border-gray-200 rounded">Source: Census 2011</span></div>
            </div>
        </div>
    );
};
