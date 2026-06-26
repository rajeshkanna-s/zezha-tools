import React, { useState, useMemo } from 'react';
import {
    ArrowLeft, Search, Copy, CheckCircle2,
    Database, TableProperties, Building2, MapPin
} from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { indianStatesCitiesData } from './indianStatesData';

interface RawDataIndianStatesProps {
    onBack: () => void;
}

export const RawDataIndianStates: React.FC<RawDataIndianStatesProps> = ({ onBack }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [copied, setCopied] = useState(false);

    const filteredData = useMemo(() => {
        if (!searchQuery.trim()) return indianStatesCitiesData;
        const query = searchQuery.toLowerCase();
        return indianStatesCitiesData.filter(item =>
            (item.stateOrUt || '').toLowerCase().includes(query) ||
            (item.type || '').toLowerCase().includes(query) ||
            (item.capital || '').toLowerCase().includes(query) ||
            (item.officialLanguages || '').toLowerCase().includes(query) ||
            (item.isoCode || '').toLowerCase().includes(query)
        );
    }, [searchQuery]);

    const handleCopy = () => {
        const textToCopy = [
            ['S.No', 'State/UT', 'Type', 'Capital', 'Languages', 'ISO Code'].join('\t'),
            ...filteredData.map(row => [
                row.sNo,
                row.stateOrUt,
                row.type,
                row.capital,
                row.officialLanguages,
                row.isoCode
            ].join('\t'))
        ].join('\n');

        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData.map(row => ({
            'S.No': row.sNo,
            'State / Union Territory': row.stateOrUt,
            'Type': row.type,
            'Capital': row.capital,
            'Official Language(s)': row.officialLanguages,
            'ISO Code': row.isoCode
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "States and Cities");
        XLSX.writeFile(workbook, "Indian_States_Cities.xlsx");
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Indian States and Cities Data", 14, 22);

        doc.setFontSize(11);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

        const tableColumn = ["S.No", "State / Union Territory", "Type", "Capital", "Official Language(s)", "ISO"];
        const tableRows = filteredData.map(row => [
            row.sNo.toString(),
            row.stateOrUt,
            row.type,
            row.capital,
            row.officialLanguages,
            row.isoCode
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [79, 70, 229] } // Indigo 600
        });

        doc.save("Indian_States_Cities.pdf");
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
                            <MapPin className="h-6 w-6 text-indigo-600" />
                            Indian States and Cities
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Raw dataset of 36 States and Union Territories with details.</p>
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
                            placeholder="Search states, capitals, languages..."
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
                                <th className="px-6 py-4 font-semibold border-b border-gray-100">State / Union Territory</th>
                                <th className="px-6 py-4 font-semibold border-b border-gray-100">Type</th>
                                <th className="px-6 py-4 font-semibold border-b border-gray-100">Capital</th>
                                <th className="px-6 py-4 font-semibold border-b border-gray-100">Official Language(s)</th>
                                <th className="px-6 py-4 font-semibold border-b border-gray-100">ISO Code</th>
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
                                            {row.sNo}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs ring-2 ring-white">
                                                    {row.stateOrUt?.charAt(0) || '?'}
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">{row.stateOrUt}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.type === 'State' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {row.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            <div className="flex items-center gap-1.5">
                                                <Building2 className="w-4 h-4 text-gray-400" />
                                                {row.capital}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-gray-600">
                                            {row.officialLanguages}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-700 rounded border border-gray-200">
                                                {row.isoCode}
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
        </div >
    );
};
