import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Copy, CheckCircle2, Database, TableProperties, Car } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { indianCarsData } from './indianCarsData';

interface Props { onBack: () => void; }
const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

export const RawDataIndianCars: React.FC<Props> = ({ onBack }) => {
    const [search, setSearch] = useState('');
    const [copied, setCopied] = useState(false);
    const [brandFilter, setBrandFilter] = useState('All');
    const [fuelFilter, setFuelFilter] = useState('All');
    const [segmentFilter, setSegmentFilter] = useState('All');
    const [cityView, setCityView] = useState<'delhi'|'mumbai'|'bangalore'|'chennai'|'hyderabad'|'kolkata'|'pune'|'ahmedabad'>('delhi');

    const brands = useMemo(() => ['All', ...Array.from(new Set(indianCarsData.map(r => r.make))).sort()], []);
    const fuels = useMemo(() => ['All', ...Array.from(new Set(indianCarsData.map(r => r.fuel))).sort()], []);
    const segments = useMemo(() => ['All', ...Array.from(new Set(indianCarsData.map(r => r.segment))).sort()], []);

    const filtered = useMemo(() => {
        let data = indianCarsData;
        if (brandFilter !== 'All') data = data.filter(r => r.make === brandFilter);
        if (fuelFilter !== 'All') data = data.filter(r => r.fuel === fuelFilter);
        if (segmentFilter !== 'All') data = data.filter(r => r.segment === segmentFilter);
        if (search.trim()) {
            const q = search.toLowerCase();
            data = data.filter(r =>
                r.make.toLowerCase().includes(q) || r.model.toLowerCase().includes(q) ||
                r.variant.toLowerCase().includes(q) || r.segment.toLowerCase().includes(q) ||
                r.fuel.toLowerCase().includes(q)
            );
        }
        return data;
    }, [search, brandFilter, fuelFilter, segmentFilter]);

    const cityLabel: Record<string, string> = { delhi: 'Delhi', mumbai: 'Mumbai', bangalore: 'Bangalore', chennai: 'Chennai', hyderabad: 'Hyderabad', kolkata: 'Kolkata', pune: 'Pune', ahmedabad: 'Ahmedabad' };
    const getOnRoad = (r: typeof indianCarsData[0]) => {
        const m: Record<string, number> = { delhi: r.onRoadDelhi, mumbai: r.onRoadMumbai, bangalore: r.onRoadBangalore, chennai: r.onRoadChennai, hyderabad: r.onRoadHyderabad, kolkata: r.onRoadKolkata, pune: r.onRoadPune, ahmedabad: r.onRoadAhmedabad };
        return m[cityView];
    };

    const cols = ['#', 'Make', 'Model', 'Variant', 'Fuel', 'Trans', 'Segment', 'CC', 'Ex-Showroom Delhi', `On-Road ${cityLabel[cityView]}`];
    const row = (r: typeof indianCarsData[0]) => [r.sNo, r.make, r.model, r.variant, r.fuel, r.transmission, r.segment, r.engineCC || 'EV', fmt(r.exShowroomDelhi), fmt(getOnRoad(r))];

    const handleCopy = () => {
        const allCols = ['#','Make','Model','Variant','Fuel','Trans','Segment','CC','Ex-Showroom Delhi','On-Road Delhi','On-Road Mumbai','On-Road Bangalore','On-Road Chennai','On-Road Hyderabad','On-Road Kolkata','On-Road Pune','On-Road Ahmedabad'];
        const allRow = (r: typeof indianCarsData[0]) => [r.sNo,r.make,r.model,r.variant,r.fuel,r.transmission,r.segment,r.engineCC||'EV',r.exShowroomDelhi,r.onRoadDelhi,r.onRoadMumbai,r.onRoadBangalore,r.onRoadChennai,r.onRoadHyderabad,r.onRoadKolkata,r.onRoadPune,r.onRoadAhmedabad];
        navigator.clipboard.writeText([allCols.join('\t'), ...filtered.map(r => allRow(r).join('\t'))].join('\n'));
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    };
    const handleExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filtered.map(r => ({
            '#': r.sNo, Make: r.make, Model: r.model, Variant: r.variant, Fuel: r.fuel,
            Transmission: r.transmission, Segment: r.segment, 'Engine CC': r.engineCC || 'EV',
            'Ex-Showroom Delhi': r.exShowroomDelhi,
            'On-Road Delhi': r.onRoadDelhi, 'On-Road Mumbai': r.onRoadMumbai,
            'On-Road Bangalore': r.onRoadBangalore, 'On-Road Chennai': r.onRoadChennai,
            'On-Road Hyderabad': r.onRoadHyderabad, 'On-Road Kolkata': r.onRoadKolkata,
            'On-Road Pune': r.onRoadPune, 'On-Road Ahmedabad': r.onRoadAhmedabad,
        })));
        const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Cars'); XLSX.writeFile(wb, 'Indian_Cars_Prices.xlsx');
    };
    const handlePDF = () => {
        const doc = new jsPDF({ orientation: 'landscape' }); doc.setFontSize(14); doc.text('Indian Cars — Ex-Showroom & On-Road Prices', 14, 18);
        doc.setFontSize(9); doc.text(`Generated: ${new Date().toLocaleDateString()} | ${filtered.length} models | Prices as of March 2026 | City: ${cityLabel[cityView]}`, 14, 25);
        autoTable(doc, { head: [cols], body: filtered.map(r => row(r).map(String)), startY: 30, styles: { fontSize: 6.5 }, headStyles: { fillColor: [79, 70, 229] } });
        doc.save('Indian_Cars_Prices.pdf');
    };

    const fuelColor = (f: string) => {
        switch (f) {
            case 'Petrol': return 'bg-blue-100 text-blue-800';
            case 'Diesel': return 'bg-amber-100 text-amber-800';
            case 'Electric': return 'bg-emerald-100 text-emerald-800';
            case 'CNG': return 'bg-teal-100 text-teal-800';
            case 'Hybrid': return 'bg-purple-100 text-purple-800';
            case 'Turbo Petrol': return 'bg-indigo-100 text-indigo-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const cityColors: Record<string, string> = { delhi: 'bg-blue-600', mumbai: 'bg-orange-600', bangalore: 'bg-purple-600', chennai: 'bg-emerald-600', hyderabad: 'bg-pink-600', kolkata: 'bg-yellow-600', pune: 'bg-red-600', ahmedabad: 'bg-cyan-600' };
    const cityTextColors: Record<string, string> = { delhi: 'text-blue-700', mumbai: 'text-orange-700', bangalore: 'text-purple-700', chennai: 'text-emerald-700', hyderabad: 'text-pink-700', kolkata: 'text-yellow-700', pune: 'text-red-700', ahmedabad: 'text-cyan-700' };

    return (
        <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none opacity-50" />
                <div className="relative z-10 flex items-center space-x-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft className="h-6 w-6 text-gray-500" /></button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Car className="h-6 w-6 text-indigo-600" />Indian Cars Price Database</h1>
                        <p className="text-gray-500 text-sm mt-1">{indianCarsData.length} variants · {brands.length - 1} brands · Ex-showroom + on-road for 8 metro cities</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3 w-full md:w-auto mt-4 md:mt-0 relative z-10">
                    <button onClick={handleCopy} className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center space-x-2 text-sm font-medium text-gray-700 bg-white">
                        {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}<span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button onClick={handlePDF} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 flex items-center space-x-2 text-sm font-medium border border-indigo-100"><Database className="h-4 w-4" /><span>PDF</span></button>
                    <button onClick={handleExcel} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 flex items-center space-x-2 text-sm font-medium border border-emerald-100"><TableProperties className="h-4 w-4" /><span>Excel</span></button>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50/50 space-y-3">
                    <div className="flex flex-wrap gap-3 items-center">
                        <div className="relative flex-1 min-w-[200px] max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400" /></div>
                            <input type="text" placeholder="Search make, model, variant..." className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:text-sm shadow-sm" value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <select className="px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm shadow-sm focus:border-indigo-500" value={brandFilter} onChange={e => setBrandFilter(e.target.value)}>
                            {brands.map(b => <option key={b} value={b}>{b === 'All' ? '🚗 All Brands' : b}</option>)}
                        </select>
                        <select className="px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm shadow-sm focus:border-indigo-500" value={fuelFilter} onChange={e => setFuelFilter(e.target.value)}>
                            {fuels.map(f => <option key={f} value={f}>{f === 'All' ? '⛽ All Fuels' : f}</option>)}
                        </select>
                        <select className="px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm shadow-sm focus:border-indigo-500" value={segmentFilter} onChange={e => setSegmentFilter(e.target.value)}>
                            {segments.map(s => <option key={s} value={s}>{s === 'All' ? '📐 All Segments' : s}</option>)}
                        </select>
                    </div>
                    {/* City Selector */}
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-xs font-semibold text-gray-500 mr-1">📍 On-Road City:</span>
                        {Object.entries(cityLabel).map(([key, label]) => (
                            <button key={key} onClick={() => setCityView(key as typeof cityView)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${cityView === key ? `${cityColors[key]} text-white shadow-md` : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead><tr className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider">
                            {cols.map(c => <th key={c} className="px-3 py-3 font-semibold border-b border-gray-100 whitespace-nowrap">{c}</th>)}
                        </tr></thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.length > 0 ? filtered.map((r, i) => (
                                <tr key={i} className="hover:bg-indigo-50/30 transition-colors">
                                    <td className="px-3 py-2 text-xs text-gray-400">{r.sNo}</td>
                                    <td className="px-3 py-2 text-xs font-bold text-gray-900">{r.make}</td>
                                    <td className="px-3 py-2 text-xs font-semibold text-indigo-700">{r.model}</td>
                                    <td className="px-3 py-2 text-xs text-gray-700 max-w-[160px] truncate" title={r.variant}>{r.variant}</td>
                                    <td className="px-3 py-2"><span className={`inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-medium ${fuelColor(r.fuel)}`}>{r.fuel}</span></td>
                                    <td className="px-3 py-2 text-[10px] text-gray-600">{r.transmission}</td>
                                    <td className="px-3 py-2 text-[10px] text-gray-600">{r.segment}</td>
                                    <td className="px-3 py-2 text-xs font-mono text-gray-500">{r.engineCC || 'EV'}</td>
                                    <td className="px-3 py-2 text-xs font-bold text-gray-900 whitespace-nowrap">{fmt(r.exShowroomDelhi)}</td>
                                    <td className={`px-3 py-2 text-xs font-semibold whitespace-nowrap ${cityTextColors[cityView]}`}>{fmt(getOnRoad(r))}</td>
                                </tr>
                            )) : <tr><td colSpan={10} className="px-6 py-12 text-center"><Search className="h-8 w-8 text-gray-300 mx-auto mb-3" /><p className="text-lg font-medium text-gray-900">No matching cars</p></td></tr>}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-wrap justify-between items-center text-sm text-gray-500 gap-2">
                    <span>Showing {filtered.length} of {indianCarsData.length} variants</span>
                </div>
            </div>
        </div>
    );
};
