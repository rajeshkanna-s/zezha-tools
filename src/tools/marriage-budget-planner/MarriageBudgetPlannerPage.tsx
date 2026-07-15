import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Heart, Settings, PieChart, Activity, Download, Plus, Trash2, Edit2, AlertCircle, ChevronDown, CheckCircle2, IndianRupee, MapPin, Search } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const CATEGORIES = [
    { id: 'venue', label: 'Venue & Accommodation', defaultPct: 15 },
    { id: 'food', label: 'Food & Catering', defaultPct: 15 },
    { id: 'jewelry', label: 'Jewelry (Gold/Diamond)', defaultPct: 15 },
    { id: 'honeymoon', label: 'Honeymoon Package', defaultPct: 10 },
    { id: 'decor', label: 'Decor & Production', defaultPct: 8 },
    { id: 'apparel', label: 'Bridal & Groom Apparel', defaultPct: 8 },
    { id: 'photo', label: 'Photography & Cinema', defaultPct: 5 },
    { id: 'gifts', label: 'Gifts & Trousseau', defaultPct: 5 },
    { id: 'makeup', label: 'Makeup Artist / Hair', defaultPct: 2 },
    { id: 'entertainment', label: 'Entertainment & DJ', defaultPct: 2 },
    { id: 'sangeet', label: 'Sangeet Choreography', defaultPct: 2 },
    { id: 'transport', label: 'Transport & Logistics', defaultPct: 2 },
    { id: 'favors', label: 'Return Gifts / Favors', defaultPct: 2 },
    { id: 'priest', label: 'Priest & Puja Samagri', defaultPct: 1 },
    { id: 'invitations', label: 'Invitations & Stationery', defaultPct: 1 },
    { id: 'prewedding', label: 'Pre-Wedding Shoot', defaultPct: 1 },
    { id: 'mehendi', label: 'Mehendi Artist & Setup', defaultPct: 1 },
    { id: 'misc', label: 'Miscellaneous/Emergency', defaultPct: 5 },
];

interface Expense {
    id: string;
    categoryId: string;
    item: string;
    estimatedCost: number;
    actualCost: number;
    paid: number;
    vendor: string;
    notes: string;
}

export const MarriageBudgetPlannerPage: React.FC = () => {
    const { user } = useAuth();

    // Settings
    const [totalBudget, setTotalBudget] = useState(2500000); // 25 Lakh default
    const [guestCount, setGuestCount] = useState(500);
    const [weddingStyle, setWeddingStyle] = useState('Traditional'); // Traditional, Destination, Intimate

    // Smart Savings Toggles
    const [savings, setSavings] = useState({
        eInvites: false, // saves 1% of total
        dayWedding: false, // saves 5% on lighting/venue
        offSeason: false, // saves 10% on major vendors
        minimalDecor: false, // saves 5% on decor
    });

    // Items
    const [expenses, setExpenses] = useState<Expense[]>([]);

    // UI State
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<Partial<Expense>>({
        categoryId: 'venue', item: '', estimatedCost: 0, actualCost: 0, paid: 0, vendor: '', notes: ''
    });
    const [editingId, setEditingId] = useState<string | null>(null);

    // Calculations
    const adjustedAllocations = useMemo(() => {
        let allocations = CATEGORIES.map(c => ({ ...c }));

        // Adjust based on style
        if (weddingStyle === 'Destination') {
            allocations.find(c => c.id === 'venue')!.defaultPct += 5;
            allocations.find(c => c.id === 'transport')!.defaultPct += 5;
            allocations.find(c => c.id === 'jewelry')!.defaultPct -= 10;
        } else if (weddingStyle === 'Intimate') {
            allocations.find(c => c.id === 'food')!.defaultPct -= 5;
            allocations.find(c => c.id === 'photo')!.defaultPct += 3;
            // Adjust others up slightly to equal 100
            allocations.find(c => c.id === 'misc')!.defaultPct += 2;
        }

        // Applying Smart Savings visually (we'll just reduce the recommended amount, but keep % same for simplicity, or reduce total effective budget)
        let effectiveBudget = totalBudget;
        if (savings.eInvites) effectiveBudget *= 0.99;
        if (savings.offSeason) effectiveBudget *= 0.90;
        if (savings.dayWedding) effectiveBudget *= 0.95;
        if (savings.minimalDecor) effectiveBudget *= 0.95;

        return allocations.map(c => ({
            ...c,
            allocatedAmount: effectiveBudget * (c.defaultPct / 100),
            originalAmount: totalBudget * (c.defaultPct / 100)
        }));

    }, [totalBudget, weddingStyle, savings]);

    const categoryTotals = useMemo(() => {
        const totals: Record<string, { est: number, act: number, paid: number }> = {};
        CATEGORIES.forEach(c => totals[c.id] = { est: 0, act: 0, paid: 0 });

        expenses.forEach(e => {
            if (totals[e.categoryId]) {
                totals[e.categoryId].est += e.estimatedCost;
                totals[e.categoryId].act += e.actualCost;
                totals[e.categoryId].paid += e.paid;
            }
        });
        return totals;
    }, [expenses]);

    const totalEstimated = expenses.reduce((sum, e) => sum + e.estimatedCost, 0);
    const totalActual = expenses.reduce((sum, e) => sum + e.actualCost, 0);
    const totalPaid = expenses.reduce((sum, e) => sum + e.paid, 0);
    const effectiveBudgetTarget = adjustedAllocations.reduce((sum, c) => sum + c.allocatedAmount, 0);

    // Handlers
    const handleSave = () => {
        if (!formData.item || !formData.categoryId) return;

        if (editingId) {
            setExpenses(expenses.map(e => e.id === editingId ? { ...e, ...formData as Expense } : e));
        } else {
            setExpenses([...expenses, { ...formData as Expense, id: Math.random().toString(36).substr(2, 9) }]);
        }

        setShowForm(false);
        setEditingId(null);
        setFormData({ categoryId: 'venue', item: '', estimatedCost: 0, actualCost: 0, paid: 0, vendor: '', notes: '' });
    };

    const handleEdit = (exp: Expense) => {
        setFormData(exp);
        setEditingId(exp.id);
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        setExpenses(expenses.filter(e => e.id !== id));
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text('Marriage Budget Reality Planner', 14, 22);

        doc.setFontSize(11);
        doc.text(`Total Target Budget: Rs. ${effectiveBudgetTarget.toLocaleString()}`, 14, 32);
        doc.text(`Total Actual Spent: Rs. ${totalActual.toLocaleString()}`, 14, 38);

        const head = [['Item', 'Category', 'Vendor', 'Estimated', 'Actual Spent', 'Paid Adv.']];
        const body = expenses.map(e => [
            e.item,
            CATEGORIES.find(c => c.id === e.categoryId)?.label || 'Other',
            e.vendor || 'TBD',
            `Rs. ${e.estimatedCost.toLocaleString()}`,
            `Rs. ${e.actualCost.toLocaleString()}`,
            `Rs. ${e.paid.toLocaleString()}`
        ]);

        autoTable(doc, {
            startY: 45,
            head,
            body,
            theme: 'striped',
            styles: { fontSize: 9 },
            headStyles: { fillColor: [236, 72, 153] } // pink-500
        });

        doc.save('marriage-budget-planner.pdf');
    };

    const formatLakhs = (val: number) => {
        if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
        if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
        return `₹${val}`;
    };

    return (
        <>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <Heart className="text-pink-500" size={32} />
                        Marriage Budget Reality Planner
                    </h1>
                    <p className="mt-2 text-slate-600">
                        Control the chaos. Track 18 expense categories and smartly optimize your Indian wedding budget.
                    </p>
                </div>
                <button
                    onClick={generatePDF}
                    className="flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                    <Download size={18} /> Download Planner
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Left Side: Setup & Summary */}
                <div className="lg:col-span-1 space-y-6">

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <Settings size={18} className="text-pink-500" /> Core Setup
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Total Target Budget (Rs.)</label>
                                <input type="number" value={totalBudget} onChange={e => setTotalBudget(Number(e.target.value))} className="w-full px-3 py-2 border rounded-md text-slate-800 font-medium" />
                                <p className="text-xs text-slate-400 mt-1">{formatLakhs(totalBudget)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Expected Guests</label>
                                <input type="number" value={guestCount} onChange={e => setGuestCount(Number(e.target.value))} className="w-full px-3 py-2 border rounded-md" />
                                <p className="text-xs text-slate-400 mt-1">Cost per plate configures food targets.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Wedding Style</label>
                                <select value={weddingStyle} onChange={e => setWeddingStyle(e.target.value)} className="w-full px-3 py-2 border rounded-md">
                                    <option value="Traditional">Big Traditional (High Food/Jewelry)</option>
                                    <option value="Destination">Destination (High Venue/Travel)</option>
                                    <option value="Intimate">Intimate Boutique (High Photo/Decor)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl shadow-sm border border-pink-100 p-6">
                        <h3 className="text-sm font-semibold text-pink-800 mb-4 flex items-center gap-2">
                            <Activity size={18} /> Smart Savings
                        </h3>
                        <div className="space-y-3">
                            <label className="flex items-start gap-3 p-2 bg-white/60 rounded-lg hover:bg-white cursor-pointer transition-colors">
                                <input type="checkbox" checked={savings.eInvites} onChange={e => setSavings({ ...savings, eInvites: e.target.checked })} className="mt-1 text-pink-500 focus:ring-pink-500 rounded" />
                                <div>
                                    <p className="text-sm font-medium text-slate-800">Use E-Invites Only</p>
                                    <p className="text-xs text-slate-500">Saves ~1% on printing & courier</p>
                                </div>
                            </label>
                            <label className="flex items-start gap-3 p-2 bg-white/60 rounded-lg hover:bg-white cursor-pointer transition-colors">
                                <input type="checkbox" checked={savings.dayWedding} onChange={e => setSavings({ ...savings, dayWedding: e.target.checked })} className="mt-1 text-pink-500 focus:ring-pink-500 rounded" />
                                <div>
                                    <p className="text-sm font-medium text-slate-800">Day Wedding Format</p>
                                    <p className="text-xs text-slate-500">Saves ~5% on venue lighting & generator cost</p>
                                </div>
                            </label>
                            <label className="flex items-start gap-3 p-2 bg-white/60 rounded-lg hover:bg-white cursor-pointer transition-colors">
                                <input type="checkbox" checked={savings.offSeason} onChange={e => setSavings({ ...savings, offSeason: e.target.checked })} className="mt-1 text-pink-500 focus:ring-pink-500 rounded" />
                                <div>
                                    <p className="text-sm font-medium text-slate-800">Off-Season Dates</p>
                                    <p className="text-xs text-slate-500">Saves ~10% on venues & vendors</p>
                                </div>
                            </label>
                        </div>
                        {(savings.eInvites || savings.dayWedding || savings.offSeason || savings.minimalDecor) && (
                            <div className="mt-4 pt-4 border-t border-pink-200/50">
                                <p className="text-xs font-semibold text-pink-700 uppercase tracking-wide">Effective Budget Target</p>
                                <p className="text-2xl font-bold text-pink-900">{formatLakhs(effectiveBudgetTarget)}</p>
                                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><CheckCircle2 size={12} /> Saved {formatLakhs(totalBudget - effectiveBudgetTarget)} so far!</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wide">Overall Tracker</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-500">Total Actual Spent</span>
                                    <span className="font-semibold text-slate-800">{formatLakhs(totalActual)}</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${totalActual > effectiveBudgetTarget ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, (totalActual / effectiveBudgetTarget) * 100)}%` }}></div>
                                </div>
                                <p className="text-xs mt-1 text-right text-slate-400">of {formatLakhs(effectiveBudgetTarget)} budget</p>
                            </div>

                            <div className="pt-2 border-t border-slate-100">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-500">Total Paid (Advances)</span>
                                    <span className="font-semibold text-blue-600">{formatLakhs(totalPaid)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Pending Payable</span>
                                    <span className="font-semibold text-amber-600">{formatLakhs(Math.max(0, totalActual - totalPaid))}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Side: Category Breakdown & Entries */}
                <div className="lg:col-span-3 space-y-6">

                    {/* Category Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {adjustedAllocations.map(cat => {
                            const stats = categoryTotals[cat.id] || { est: 0, act: 0, paid: 0 };
                            const overspent = stats.act > cat.allocatedAmount;

                            return (
                                <div key={cat.id} className={`bg-white rounded-xl shadow-sm border p-4 transition-all hover:shadow-md ${overspent ? 'border-rose-200' : 'border-slate-200'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-sm text-slate-800 max-w-[75%] leading-tight">{cat.label}</h4>
                                        <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded">{cat.defaultPct}%</span>
                                    </div>

                                    <div className="space-y-1 mb-3">
                                        <p className="text-xs text-slate-500 flex justify-between">
                                            <span>Target:</span> <span className="font-medium text-slate-700">{formatLakhs(cat.allocatedAmount)}</span>
                                        </p>
                                        <p className="text-xs text-slate-500 flex justify-between">
                                            <span>Actual:</span> <span className={`font-semibold ${overspent ? 'text-rose-600' : 'text-emerald-600'}`}>{formatLakhs(stats.act)}</span>
                                        </p>
                                    </div>

                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${overspent ? 'bg-rose-500' : 'bg-primary/80'}`} style={{ width: `${Math.min(100, (stats.act / cat.allocatedAmount) * 100)}%` }}></div>
                                    </div>

                                    <button
                                        onClick={() => { setFormData({ ...formData, categoryId: cat.id }); setShowForm(true); }}
                                        className="mt-3 w-full py-1.5 border border-dashed border-slate-300 rounded text-xs text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors flex items-center justify-center gap-1"
                                    >
                                        <Plus size={14} /> Add Expense
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Expenses List section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h3 className="font-bold text-slate-800">Line Item Tracker</h3>
                            <button
                                onClick={() => { setEditingId(null); setShowForm(true); }}
                                className="text-sm font-semibold text-primary hover:text-primary-dark flex items-center gap-1"
                            >
                                <Plus size={16} /> New Entry
                            </button>
                        </div>


                        <div className="overflow-x-auto">
                            {expenses.length === 0 ? (
                                <div className="py-12 text-center text-slate-500">No expenses added yet.</div>
                            ) : (
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                        <tr>
                                            <th className="px-6 py-3">Item / Category</th>
                                            <th className="px-6 py-3">Vendor</th>
                                            <th className="px-6 py-3 text-right">Actual Cost</th>
                                            <th className="px-6 py-3 text-right">Paid</th>
                                            <th className="px-6 py-3 text-right">Balance</th>
                                            <th className="px-6 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {expenses.map(exp => {
                                            const cat = CATEGORIES.find(c => c.id === exp.categoryId);
                                            const balance = exp.actualCost - exp.paid;
                                            return (
                                                <tr key={exp.id} className="hover:bg-slate-50/50">
                                                    <td className="px-6 py-3">
                                                        <p className="font-medium text-slate-800">{exp.item}</p>
                                                        <p className="text-xs text-slate-500">{cat?.label}</p>
                                                    </td>
                                                    <td className="px-6 py-3 text-slate-600">{exp.vendor || '-'}</td>
                                                    <td className="px-6 py-3 text-right font-medium">Rs. {exp.actualCost.toLocaleString()}</td>
                                                    <td className="px-6 py-3 text-right text-emerald-600">Rs. {exp.paid.toLocaleString()}</td>
                                                    <td className="px-6 py-3 text-right text-amber-600">Rs. {balance.toLocaleString()}</td>
                                                    <td className="px-6 py-3 text-right">
                                                        <button onClick={() => handleEdit(exp)} className="p-1 text-slate-400 hover:text-primary mx-1"><Edit2 size={16} /></button>
                                                        <button onClick={() => handleDelete(exp.id)} className="p-1 text-slate-400 hover:text-rose-500 mx-1"><Trash2 size={16} /></button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </div>

        {showForm && (
            <div 
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
                onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ categoryId: 'venue', item: '', estimatedCost: 0, actualCost: 0, paid: 0, vendor: '', notes: '' });
                }}
            >
                <div 
                    className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden animate-fade-in"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-4 flex items-center justify-between text-white">
                        <h3 className="font-bold text-lg">
                            {editingId ? 'Edit Expense Entry' : 'Add New Expense Entry'}
                        </h3>
                        <button 
                            onClick={() => {
                                setShowForm(false);
                                setEditingId(null);
                                setFormData({ categoryId: 'venue', item: '', estimatedCost: 0, actualCost: 0, paid: 0, vendor: '', notes: '' });
                            }}
                            className="text-white hover:text-white/80 font-bold text-xl"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Form Fields */}
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Category</label>
                            <select 
                                value={formData.categoryId} 
                                onChange={e => setFormData({ ...formData, categoryId: e.target.value })} 
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                            >
                                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Item Description *</label>
                            <input 
                                type="text" 
                                placeholder="E.g. Main Hall Rent" 
                                value={formData.item} 
                                onChange={e => setFormData({ ...formData, item: e.target.value })} 
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500" 
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Vendor (Optional)</label>
                            <input 
                                type="text" 
                                placeholder="E.g. ITC Grand" 
                                value={formData.vendor} 
                                onChange={e => setFormData({ ...formData, vendor: e.target.value })} 
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500" 
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Est. Cost</label>
                                <input 
                                    type="number" 
                                    value={formData.estimatedCost || ''} 
                                    onChange={e => setFormData({ ...formData, estimatedCost: Number(e.target.value) })} 
                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Actual Cost</label>
                                <input 
                                    type="number" 
                                    value={formData.actualCost || ''} 
                                    onChange={e => setFormData({ ...formData, actualCost: Number(e.target.value) })} 
                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Paid (Adv.)</label>
                                <input 
                                    type="number" 
                                    value={formData.paid || ''} 
                                    onChange={e => setFormData({ ...formData, paid: Number(e.target.value) })} 
                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="bg-slate-50 px-6 py-4 flex gap-3 border-t border-slate-100 justify-end">
                        <button 
                            onClick={() => {
                                setShowForm(false);
                                setEditingId(null);
                                setFormData({ categoryId: 'venue', item: '', estimatedCost: 0, actualCost: 0, paid: 0, vendor: '', notes: '' });
                            }} 
                            className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave} 
                            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                            Save Entry
                        </button>
                    </div>
                </div>
            </div>
        )}
    </>
  );
};
