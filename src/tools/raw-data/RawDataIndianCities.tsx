import React, { useState, useMemo } from 'react';
import {
    ArrowLeft, Search, Copy, CheckCircle2,
    Database, TableProperties, Building2, MapPin
} from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { indianCitiesData } from './indianCitiesData';

interface RawDataIndianCitiesProps {
    onBack: () => void;
}

export const RawDataIndianCities: React.FC<RawDataIndianCitiesProps> = ({ onBack }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [copied, setCopied] = useState(false);

    const filteredData = useMemo(() => {
        if (!searchQuery.trim()) return indianCitiesData;
        const query = searchQuery.toLowerCase();
        return indianCitiesData.filter(item =>
            (item.city || '').toLowerCase().includes(query) ||
            (item.stateOrUt || '').toLowerCase().includes(query) ||
            (item.stateCode || '').toLowerCase().includes(query) ||
            (item.knownFor || '').toLowerCase().includes(query) ||
            (item.tier || '').toLowerCase().includes(query)
        );
    }, [searchQuery]);

    const handleCopy = () => {
        const textToCopy = [
            ['City', 'State/UT', 'State Code', 'Known For', 'Population', 'Tier'].join('\t'),
            ...filteredData.map(row => [
                row.city,
                row.stateOrUt,
                row.stateCode,
                row.knownFor,
                row.population,
                row.tier
            ].join('\t'))
        ].join('\n');

        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData.map(row => ({
            'City': row.city,
            'State / Union Territory': row.stateOrUt,
            'State Code': row.stateCode,
            'Known For': row.knownFor,
            'Population (Census/Est.)': row.population,
            'Tier Classification': row.tier
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Indian Cities");
        XLSX.writeFile(workbook, "Indian_Cities.xlsx");
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Indian Major Cities Data", 14, 22);

        doc.setFontSize(11);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

        const tableColumn = ["City", "State / UT", "State Code", "Known For", "Pop.", "Tier"];
        const tableRows = filteredData.map(row => [
            row.city,
            row.stateOrUt,
            row.stateCode,
            row.knownFor,
            row.population,
            row.tier
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [79, 70, 229] } // Indigo 600
        });

        doc.save("Indian_Cities.pdf");
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none opacity-50"></div>
                <div className="relative z-10 flex items-center space-x-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                    >
                        <ArrowLeft className="h-6 w-6 text-gray-500 group-hover:text-gray-900" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Building2 className="h-6 w-6 text-indigo-600" />
                            Indian Major Cities
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Raw dataset of {indianCitiesData.length} prominent cities across India.</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto mt-4 md:mt-0 relative z-10">
                    <button
                        onClick={handleCopy}
                        className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-2 text-sm font-medium text-gray-700 bg-white"
                    >
                        {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                        onClick={handleDownloadPDF}
                        className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-colors flex items-center space-x-2 text-sm font-medium border border-indigo-100"
                    >
                        <Database className="h-4 w-4" />
                        <span>PDF</span>
                    </button>
                    <button
                        onClick={handleDownloadExcel}
                        className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors flex items-center space-x-2 text-sm font-medium border border-emerald-100"
                    >
                        <TableProperties className="h-4 w-4" />
                        <span>Excel</span>
                    </button>
                </div>
            </div>

            {/* Content / Table */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search cities, states, known for..."
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:text-sm transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold border-b border-gray-100">S.No</th>
                                <th className="px-6 py-4 font-semibold border-b border-gray-100">City</th>
                                <th className="px-6 py-4 font-semibold border-b border-gray-100">State / UT</th>
                                <th className="px-6 py-4 font-semibold border-b border-gray-100">Tier</th>
                                <th className="px-6 py-4 font-semibold border-b border-gray-100">Known For</th>
                                <th className="px-6 py-4 font-semibold border-b border-gray-100">Population</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredData.length > 0 ? (
                                filteredData.map((row, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-indigo-50/30 transition-colors group"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs ring-2 ring-white">
                                                    {row.city?.charAt(0) || '?'}
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">{row.city}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                {row.stateOrUt}
                                                <span className="text-xs text-gray-400">({row.stateCode})</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.tier === 'Tier 1' ? 'bg-fuchsia-100 text-fuchsia-800' :
                                                row.tier === 'Tier 2' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {row.tier}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 line-clamp-2 min-w-[200px]">
                                            {row.knownFor}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono text-sm text-gray-700">
                                                {row.population}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Search className="h-8 w-8 text-gray-300 mb-3" />
                                            <p className="text-lg font-medium text-gray-900">No matching data found</p>
                                            <p className="text-sm">Try adjusting your search criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center text-sm text-gray-500">
                    <span>Showing {filteredData.length} records</span>
                    <span className="font-mono bg-white px-2 py-1 border border-gray-200 rounded">Source: Internal</span>
                </div>
            </div>
        </div>
    );
};
