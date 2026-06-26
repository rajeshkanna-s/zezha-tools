import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
    Gift, Calendar as CalendarIcon, PieChart, TrendingUp, Users,
    Plus, Trash2, Edit2, CheckCircle2, AlertCircle, Download,
    ChevronRight, Heart
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const OCCASIONS = [
    'Birthday', 'Anniversary', 'Diwali', 'Eid', 'Christmas',
    'Raksha Bandhan', 'Holi', 'Navratri', 'Pongal', 'Onam',
    'Durga Puja', 'Baby Shower', 'Housewarming', 'Wedding',
    'Office', "Teacher's Day", "Mother's Day", "Father's Day",
    "Valentine's Day", 'New Year', 'Other'
];

const RELATIONSHIPS = [
    'Spouse / Partner', 'Parent (Own)', 'Parent (In-Law)',
    'Sibling', 'Child (Own)', 'Close Friend', 'Colleague / Boss',
    'Relative (Extended)', 'Teacher / Mentor', 'Neighbour',
    'Domestic Help / Driver', 'Client / Business Contact'
];

const GIFT_IDEAS: Record<string, string[]> = {
    'Spouse / Partner': ['Tech Wearables', 'Spa Getaway', 'Fine Jewelry', 'Designer Bags'],
    'Parent (Own)': ['Health Tech', 'Personalized Art', 'Religious Tour', 'Smart Home Hubs'],
    'Parent (In-Law)': ['Premium Kitchenware', 'Silk Sarees', 'Gourmet Hampers', 'Orthopedic Mattresses'],
    'Sibling': ['Gaming Gear', 'Retail Gift Cards', 'Concert Tickets', 'Wireless Earbuds'],
    'Child (Own)': ['STEM Kits', 'Bicycles/Sports', 'Books Library', 'Theme Park Tickets'],
    'Close Friend': ['Experiential Dining', 'Coffee Table Books', 'Subscriptions', 'Custom Barware'],
    'Colleague / Boss': ['Desktop Organizer', 'Gourmet Coffee', 'High-end Planners', 'Succulent Plants'],
    'Relative (Extended)': ['Dry Fruit Boxes', 'Silver Coins', 'Home Decor', 'Festive Hampers'],
    'Teacher / Mentor': ['Leather Journals', 'Premium Pens', 'Assorted Teas', 'Book Vouchers'],
    'Neighbour': ['Baked Goods', 'Indoor Plants', 'Scented Candles', 'Handmade Soaps'],
    'Domestic Help / Driver': ['Cash Bonuses', 'Winter Blankets', 'Utility Appliances', 'School Bags'],
    'Client / Business Contact': ['Corporate Hampers', 'Fine Wine', 'Digital Frames', 'Luxury Chocolates']
};

interface PersonOccasion {
    id: string;
    name: string;
    relationship: string;
    occasion: string;
    month: number;
    day: number;
    budget: number;
    purchased: boolean;
    actualSpent: number;
}

export const GiftBudgetPlannerPage: React.FC = () => {
    const { user } = useAuth();

    // Profile State
    const [monthlyIncome, setMonthlyIncome] = useState<number>(100000);
    const [annualBudget, setAnnualBudget] = useState<number>(30000);

    // Entries State
    const [entries, setEntries] = useState<PersonOccasion[]>([]);

    // Form State
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        relationship: 'Close Friend',
        occasion: 'Birthday',
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
        budget: 1000
    });

    const handleSaveEntry = () => {
        if (!formData.name.trim()) return;

        if (editingId) {
            setEntries(entries.map(e => e.id === editingId ? { ...e, ...formData } : e));
        } else {
            setEntries([...entries, {
                ...formData,
                id: Math.random().toString(36).substr(2, 9),
                purchased: false,
                actualSpent: 0
            }]);
        }

        setShowForm(false);
        setEditingId(null);
        setFormData({
            name: '',
            relationship: 'Close Friend',
            occasion: 'Birthday',
            month: new Date().getMonth() + 1,
            day: new Date().getDate(),
            budget: 1000
        });
    };

    const editEntry = (entry: PersonOccasion) => {
        setFormData({
            name: entry.name,
            relationship: entry.relationship,
            occasion: entry.occasion,
            month: entry.month,
            day: entry.day,
            budget: entry.budget
        });
        setEditingId(entry.id);
        setShowForm(true);
    };

    const togglePurchased = (id: string) => {
        setEntries(entries.map(e => {
            if (e.id === id) {
                const nextPurchased = !e.purchased;
                return {
                    ...e,
                    purchased: nextPurchased,
                    actualSpent: nextPurchased ? e.budget : 0 // auto fill actual with budget initially
                };
            }
            return e;
        }));
    };

    const updateActualSpent = (id: string, amount: number) => {
        setEntries(entries.map(e => e.id === id ? { ...e, actualSpent: amount } : e));
    };

    const removeEntry = (id: string) => {
        setEntries(entries.filter(e => e.id !== id));
    };

    // Calculations
    const totalBudgeted = entries.reduce((acc, curr) => acc + curr.budget, 0);
    const totalSpent = entries.filter(e => e.purchased).reduce((acc, curr) => acc + curr.actualSpent, 0);
    const percentIncome = (totalBudgeted / (monthlyIncome * 12)) * 100;

    const monthlyBreakdown = useMemo(() => {
        const months = Array(12).fill(0);
        const counts = Array(12).fill(0);
        entries.forEach(e => {
            months[e.month - 1] += e.budget;
            counts[e.month - 1] += 1;
        });
        return { months, counts };
    }, [entries]);

    const maxMonthValue = Math.max(...monthlyBreakdown.months, 1);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const downloadReport = () => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text('Annual Gift & Holiday Budget Planner', 14, 22);

        doc.setFontSize(11);
        doc.text(`Total Budget Target: Rs. ${annualBudget.toLocaleString()}`, 14, 32);
        doc.text(`Total Allocated: Rs. ${totalBudgeted.toLocaleString()}`, 14, 38);

        // Process data for table
        const tableData = entries
            .sort((a, b) => a.month !== b.month ? a.month - b.month : a.day - b.day)
            .map(e => [
                monthNames[e.month - 1],
                `${e.day} ${monthNames[e.month - 1]}`,
                e.name,
                e.occasion,
                `Rs. ${e.budget.toLocaleString()}`,
                e.purchased ? 'Yes' : 'No',
                e.purchased ? `Rs. ${e.actualSpent.toLocaleString()}` : '-'
            ]);

        autoTable(doc, {
            startY: 45,
            head: [['Month', 'Date', 'Recipient', 'Occasion', 'Budget', 'Purchased', 'Actual Spent']],
            body: tableData,
            theme: 'grid',
            styles: { fontSize: 9 },
            headStyles: { fillColor: [44, 62, 80] }
        });

        doc.save('gifting-budget-planner.pdf');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <Gift className="text-rose-500" size={32} />
                        Festival & Holiday Gift Budget Planner
                    </h1>
                    <p className="mt-2 text-slate-600">
                        Plan all your gifting for the year — before it destroys your budget.
                    </p>
                </div>
                <button
                    onClick={downloadReport}
                    disabled={entries.length === 0}
                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 disabled:opacity-50"
                >
                    <Download size={18} /> Download Planner
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Left Column: Settings & Dashboard */}
                <div className="lg:col-span-1 space-y-6">

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <TrendingUp size={20} className="text-primary" />
                            Your Profile
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Income (Rs.)</label>
                                <input
                                    type="number"
                                    value={monthlyIncome}
                                    onChange={(e) => setMonthlyIncome(Number(e.target.value) || 0)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Annual Gifting Target (Rs.)</label>
                                <input
                                    type="number"
                                    value={annualBudget}
                                    onChange={(e) => setAnnualBudget(Number(e.target.value) || 0)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                                />
                                <p className="text-xs text-slate-500 mt-1">Recommended: 2% - 5% of income (Rs. {(monthlyIncome * 12 * 0.03).toLocaleString()})</p>
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-2xl shadow-sm border p-6 flex flex-col gap-2 ${percentIncome > 8 ? 'bg-rose-50 border-rose-200' :
                        percentIncome > 5 ? 'bg-orange-50 border-orange-200' :
                            'bg-emerald-50 border-emerald-200'
                        }`}>
                        <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                            <PieChart size={16} /> Budget Health
                        </h3>
                        <p className="text-3xl font-bold tracking-tight text-slate-900">
                            {percentIncome.toFixed(1)}% <span className="text-sm font-normal text-slate-600">of income</span>
                        </p>
                        <div className="w-full h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                            <div
                                className={`h-full ${percentIncome > 8 ? 'bg-rose-500' : percentIncome > 5 ? 'bg-orange-500' : 'bg-emerald-500'}`}
                                style={{ width: `${Math.min(100, percentIncome * 10)}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                            {percentIncome > 8 ? 'Red Alert: You are over-committed.' :
                                percentIncome > 5 ? 'Warning: Spending is stretched.' :
                                    'Healthy: You are well within limits.'}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-sm font-semibold text-slate-800 mb-4">Summary</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Target Budget</span>
                                <span className="font-medium">Rs. {annualBudget.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Allocated</span>
                                <span className={`font-medium ${totalBudgeted > annualBudget ? 'text-rose-600' : 'text-slate-900'}`}>Rs. {totalBudgeted.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-slate-100">
                                <span className="text-slate-500">Total Spent So Far</span>
                                <span className="font-semibold text-emerald-600">Rs. {totalSpent.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Gift Ideas Database */}
                    <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl shadow-sm border border-rose-100 p-6">
                        <h3 className="text-sm font-semibold text-rose-900 mb-4 flex items-center gap-2">
                            <Heart size={16} /> Gift Ideas Database
                        </h3>
                        <p className="text-xs text-rose-700 mb-3">Smart tier-based gift recommendations:</p>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {Object.entries(GIFT_IDEAS).map(([rel, ideas]) => (
                                <div key={rel} className="bg-white/60 p-2.5 rounded-lg text-xs border border-white shadow-sm">
                                    <span className="font-bold text-slate-800 block mb-1">{rel}</span>
                                    <span className="text-slate-600 leading-relaxed">{ideas.join(' • ')}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right Column: Calendar & Entries */}
                <div className="lg:col-span-3 space-y-6">

                    {/* Monthly Bar Chart */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                            <CalendarIcon size={20} className="text-primary" />
                            12-Month Gifting Cash Flow
                        </h3>

                        <div className="h-48 flex items-end gap-2 sm:gap-4 overflow-x-auto pb-2">
                            {monthlyBreakdown.months.map((val, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center justify-end min-w-[30px] group relative">
                                    {/* Tooltip */}
                                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-slate-800 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap z-10 transition-opacity">
                                        Rs. {val.toLocaleString()} <br /> ({monthlyBreakdown.counts[idx]} events)
                                    </div>
                                    <div
                                        className={`w-full max-w-[40px] rounded-t-lg transition-all ${val > (annualBudget * 0.15) ? 'bg-rose-400' : val > 0 ? 'bg-primary/80' : 'bg-slate-100'}`}
                                        style={{ height: `${Math.max(4, (val / maxMonthValue) * 100)}%` }}
                                    ></div>
                                    <span className="text-xs text-slate-500 mt-2">{monthNames[idx]}</span>
                                </div>
                            ))}
                        </div>
                        {monthlyBreakdown.months.some(v => v > (annualBudget * 0.15)) && (
                            <p className="text-sm text-rose-600 flex items-center gap-1.5 mt-4">
                                <AlertCircle size={16} /> Red months indicate over 15% of annual budget concentrated in one month. Plan ahead.
                            </p>
                        )}
                    </div>

                    {/* Entries Header */}
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-800">Occasions Tracker ({entries.length})</h3>
                        <button
                            onClick={() => { setEditingId(null); setShowForm(true); }}
                            className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
                        >
                            <Plus size={16} /> Add Occasion
                        </button>
                    </div>

                    {/* Add/Edit Form */}
                    {showForm && (
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-semibold text-slate-800">{editingId ? 'Edit Occasion' : 'Add New Occasion'}</h4>
                                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><Trash2 size={18} /></button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="col-span-1 sm:col-span-2 md:col-span-1">
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Recipient Name</label>
                                    <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="E.g. Rahul" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-primary outline-none" />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Relationship</label>
                                    <select value={formData.relationship} onChange={e => setFormData({ ...formData, relationship: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-primary outline-none">
                                        {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Occasion</label>
                                    <select value={formData.occasion} onChange={e => setFormData({ ...formData, occasion: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-primary outline-none">
                                        {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Date</label>
                                    <div className="flex gap-2">
                                        <select value={formData.day} onChange={e => setFormData({ ...formData, day: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-primary outline-none">
                                            {Array.from({ length: 31 }).map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                                        </select>
                                        <select value={formData.month} onChange={e => setFormData({ ...formData, month: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-primary outline-none">
                                            {monthNames.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Budget (Rs.)</label>
                                    <input type="number" value={formData.budget} onChange={e => setFormData({ ...formData, budget: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-primary outline-none" />
                                </div>

                                <div className="flex items-end">
                                    <button onClick={handleSaveEntry} className="w-full bg-slate-900 text-white py-2 rounded-md text-sm font-semibold hover:bg-slate-800 transition-colors">
                                        Save Entry
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Entries List */}
                    <div className="space-y-3">
                        {entries.length === 0 && !showForm && (
                            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
                                <Gift className="mx-auto text-slate-300 mb-3" size={48} />
                                <p className="text-slate-500">No occasions added yet. Click Add Occasion to get started.</p>
                            </div>
                        )}

                        {entries
                            .sort((a, b) => a.month !== b.month ? a.month - b.month : a.day - b.day)
                            .map(entry => (
                                <div key={entry.id} className={`bg-white border rounded-xl p-4 sm:px-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between transition-colors ${entry.purchased ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200'}`}>

                                    <div className="flex items-center gap-4 flex-1">
                                        {/* Date Badge */}
                                        <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-100 rounded-lg shrink-0">
                                            <span className="text-xs font-bold text-slate-500 uppercase leading-none">{monthNames[entry.month - 1]}</span>
                                            <span className="text-lg font-bold text-slate-800 leading-tight">{entry.day}</span>
                                        </div>

                                        {/* Info */}
                                        <div>
                                            <h4 className="font-bold text-slate-800">{entry.name} <span className="font-normal text-slate-500 text-sm ml-1">({entry.relationship})</span></h4>
                                            <p className="text-sm text-slate-600">{entry.occasion}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 sm:gap-6 ml-16 sm:ml-0">
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Budget</p>
                                            <p className="font-bold text-slate-800">Rs. {entry.budget.toLocaleString()}</p>
                                        </div>

                                        {entry.purchased && (
                                            <div className="text-right flex-1 min-w-[80px]">
                                                <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide">Actual Spent</p>
                                                <input
                                                    type="number"
                                                    value={entry.actualSpent}
                                                    onChange={(e) => updateActualSpent(entry.id, Number(e.target.value))}
                                                    className="w-24 text-right px-2 py-1 border border-emerald-200 rounded text-emerald-700 font-bold bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                                    title="Edit actual spent amount"
                                                />
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => togglePurchased(entry.id)}
                                                className={`p-2 rounded-full transition-colors ${entry.purchased ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                                                title={entry.purchased ? "Mark as unpaid" : "Mark as purchased"}
                                            >
                                                <CheckCircle2 size={20} />
                                            </button>
                                            {!entry.purchased && (
                                                <button onClick={() => editEntry(entry)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                                                    <Edit2 size={16} />
                                                </button>
                                            )}
                                            <button onClick={() => removeEntry(entry.id)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            ))}
                    </div>

                </div>
            </div>
        </div>
    );
};
