import React, { useState, useMemo } from 'react';
import {
    ArrowLeft, Search, Copy, CheckCircle2,
    Database, TableProperties, Building2, MapPin,
    GraduationCap
} from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { indianCollegesData } from './indianCollegesData';

interface RawDataIndianCollegesProps {
    onBack: () => void;
}

export const RawDataIndianColleges: React.FC<RawDataIndianCollegesProps> = ({ onBack }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [copied, setCopied] = useState(false);

    const filteredData = useMemo(() => {
        if (!searchQuery.trim()) return indianCollegesData;
        const query = searchQuery.toLowerCase();
        return indianCollegesData.filter((item: any) =>
            (item['State / UT'] || '').toLowerCase().includes(query) ||
            (item['City'] || '').toLowerCase().includes(query) ||
            (item['College / University Name'] || '').toLowerCase().includes(query) ||
            (item['Institution Type'] || '').toLowerCase().includes(query) ||
            (item['Courses Offered'] || '').toLowerCase().includes(query)
        );
    }, [searchQuery]);

    const handleCopy = () => {
        const textToCopy = [
            ['S.No', 'State/UT', 'City', 'College Name', 'Type', 'Courses', 'Est. Year', 'Status'].join('\t'),
            ...filteredData.map((row: any) => [
                row['S.No'],
                row['State / UT'],
                row['City'],
                row['College / University Name'],
                row['Institution Type'],
                row['Courses Offered'],
                row['Est. Year'],
                row['Status']
            ].join('\t'))
        ].join('\n');

        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData.map((row: any) => ({
            'S.No': row['S.No'],
            'State / UT': row['State / UT'],
            'City': row['City'],
            'College / University Name': row['College / University Name'],
            'Institution Type': row['Institution Type'],
            'Courses Offered': row['Courses Offered'],
            'Est. Year': row['Est. Year'],
            'Status': row['Status']
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Indian Colleges");
        XLSX.writeFile(workbook, "Indian_Colleges_Data.xlsx");
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF('landscape');

        doc.setFontSize(18);
        doc.text("Indian Colleges Data", 14, 22);

        doc.setFontSize(11);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

        const tableColumn = ["S.No", "State / UT", "City", "College Name", "Type", "Est.", "Status"];
        const tableRows = filteredData.map((row: any) => [
            row['S.No']?.toString(),
            row['State / UT'],
            row['City'],
            // Truncate long names slightly for PDF fit
            row['College / University Name']?.substring(0, 40) + (row['College / University Name']?.length > 40 ? '...' : ''),
            row['Institution Type'],
            row['Est. Year']?.toString(),
            row['Status']
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [79, 70, 229] } // Indigo 600
        });

        doc.save("Indian_Colleges_Data.pdf");
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
                            <GraduationCap className="h-6 w-6 text-indigo-600" />
                            Indian Colleges Database
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Raw dataset of higher-education institutions with details.</p>
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
                            placeholder="Search colleges, cities, states..."
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:text-sm transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider relative">
                                <th className="px-6 py-4 font-semibold border-b border-gray-100">S.No</th>
                                <th className="px-6 py-4 font-semibold border-b border-gray-100">College / University Name</th>
                                <th className="px-6 py-4 font-semibold border-b border-gray-100">State / UT</th>
                                <th className="px-6 py-4 font-semibold border-b border-gray-100">City</th>
                                <th className="px-6 py-4 font-semibold border-b border-gray-100">Institution Type</th>
                                <th className="px-6 py-4 font-semibold border-b border-gray-100">Est. Year</th>
                                <th className="px-6 py-4 font-semibold border-b border-gray-100">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredData.length > 0 ? (
                                filteredData.map((row: any, index: number) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-indigo-50/30 transition-colors group"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {row['S.No']}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs ring-2 ring-white">
                                                    {row['College / University Name']?.charAt(0) || '?'}
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors line-clamp-2">{row['College / University Name']}</p>
                                                    <p className="text-xs text-gray-500 truncate max-w-[200px]" title={row['Courses Offered']}>{row['Courses Offered']}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {row['State / UT']}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                {row['City']}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row['Institution Type']?.includes('Private') ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {row['Institution Type']}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-gray-600">
                                            {row['Est. Year']}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono text-xs font-semibold px-2 py-1 bg-gray-100 text-emerald-700 rounded border border-gray-200">
                                                {row['Status']}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
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
