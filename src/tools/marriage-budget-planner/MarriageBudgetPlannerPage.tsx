import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Heart, Download, Plus, Trash2, Edit2, CheckCircle2, Filter, BarChart3, TrendingUp, AlertTriangle, Search, X, IndianRupee, Wallet, PiggyBank, Clock } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ── Indian Marriage Categories (grouped) ──
const CATEGORIES = [
    { id: 'venue-main', label: 'Main Wedding Venue', group: 'Venue & Hospitality' },
    { id: 'venue-reception', label: 'Reception Venue', group: 'Venue & Hospitality' },
    { id: 'venue-sangeet', label: 'Sangeet/Mehendi Venue', group: 'Venue & Hospitality' },
    { id: 'venue-haldi', label: 'Haldi Ceremony Venue', group: 'Venue & Hospitality' },
    { id: 'venue-mandap', label: 'Mandap/Stage Setup', group: 'Venue & Hospitality' },
    { id: 'venue-guest-rooms', label: 'Guest Room Booking', group: 'Venue & Hospitality' },
    { id: 'venue-farmhouse', label: 'Farmhouse/Lawn Rental', group: 'Venue & Hospitality' },
    { id: 'venue-generator', label: 'Generator & Power Backup', group: 'Venue & Hospitality' },
    { id: 'venue-ac', label: 'AC/Cooler/Fan Setup', group: 'Venue & Hospitality' },

    { id: 'food-wedding', label: 'Wedding Day Catering', group: 'Food & Catering' },
    { id: 'food-reception', label: 'Reception Dinner', group: 'Food & Catering' },
    { id: 'food-sangeet', label: 'Sangeet Night Food', group: 'Food & Catering' },
    { id: 'food-haldi', label: 'Haldi Ceremony Food', group: 'Food & Catering' },
    { id: 'food-mehendi', label: 'Mehendi Function Food', group: 'Food & Catering' },
    { id: 'food-baraat', label: 'Baraat Welcome Snacks', group: 'Food & Catering' },
    { id: 'food-sweets', label: 'Sweets & Mithai Boxes', group: 'Food & Catering' },
    { id: 'food-icecream', label: 'Ice Cream/Live Counters', group: 'Food & Catering' },
    { id: 'food-beverages', label: 'Beverages & Drinks', group: 'Food & Catering' },
    { id: 'food-staff', label: 'Staff/Helper Meals', group: 'Food & Catering' },

    { id: 'jewelry-bridal-gold', label: 'Bridal Gold Jewelry', group: 'Jewelry & Gold' },
    { id: 'jewelry-bridal-diamond', label: 'Bridal Diamond Set', group: 'Jewelry & Gold' },
    { id: 'jewelry-groom', label: 'Groom Jewelry/Watch', group: 'Jewelry & Gold' },
    { id: 'jewelry-mangalsutra', label: 'Mangalsutra', group: 'Jewelry & Gold' },
    { id: 'jewelry-rings', label: 'Engagement/Wedding Rings', group: 'Jewelry & Gold' },
    { id: 'jewelry-gift-sets', label: 'Gift Jewelry Sets', group: 'Jewelry & Gold' },
    { id: 'jewelry-silver', label: 'Silver Articles/Pooja Items', group: 'Jewelry & Gold' },

    { id: 'decor-mandap', label: 'Mandap Decoration', group: 'Decoration & Production' },
    { id: 'decor-floral', label: 'Floral Arrangements', group: 'Decoration & Production' },
    { id: 'decor-lighting', label: 'Lighting & LED Setup', group: 'Decoration & Production' },
    { id: 'decor-stage', label: 'Stage & Backdrop Design', group: 'Decoration & Production' },
    { id: 'decor-entrance', label: 'Entrance Gate/Welcome Board', group: 'Decoration & Production' },
    { id: 'decor-rangoli', label: 'Rangoli & Floor Art', group: 'Decoration & Production' },
    { id: 'decor-table', label: 'Table Centerpieces', group: 'Decoration & Production' },
    { id: 'decor-haldi', label: 'Haldi Decor Setup', group: 'Decoration & Production' },
    { id: 'decor-mehendi', label: 'Mehendi Decor Setup', group: 'Decoration & Production' },
    { id: 'decor-car', label: 'Car/Doli Decoration', group: 'Decoration & Production' },

    { id: 'attire-bridal-lehenga', label: 'Bridal Lehenga/Saree', group: 'Bridal & Groom Attire' },
    { id: 'attire-reception-bride', label: 'Reception Outfit (Bride)', group: 'Bridal & Groom Attire' },
    { id: 'attire-sangeet-bride', label: 'Sangeet Outfit (Bride)', group: 'Bridal & Groom Attire' },
    { id: 'attire-mehendi-bride', label: 'Mehendi Outfit (Bride)', group: 'Bridal & Groom Attire' },
    { id: 'attire-groom-sherwani', label: 'Groom Sherwani/Suit', group: 'Bridal & Groom Attire' },
    { id: 'attire-groom-reception', label: 'Groom Reception Outfit', group: 'Bridal & Groom Attire' },
    { id: 'attire-dupatta', label: 'Bridal Dupatta/Chunri', group: 'Bridal & Groom Attire' },
    { id: 'attire-accessories', label: 'Accessories (Kalire, Chura)', group: 'Bridal & Groom Attire' },
    { id: 'attire-footwear', label: 'Wedding Footwear (Both)', group: 'Bridal & Groom Attire' },
    { id: 'attire-family', label: 'Family Outfits', group: 'Bridal & Groom Attire' },

    { id: 'photo-wedding', label: 'Wedding Day Photography', group: 'Photography & Video' },
    { id: 'photo-prewedding', label: 'Pre-Wedding Shoot', group: 'Photography & Video' },
    { id: 'photo-video', label: 'Cinematic Videography', group: 'Photography & Video' },
    { id: 'photo-drone', label: 'Drone Coverage', group: 'Photography & Video' },
    { id: 'photo-album', label: 'Photo Album/Coffee Table Book', group: 'Photography & Video' },
    { id: 'photo-booth', label: 'Instant Print Photo Booth', group: 'Photography & Video' },

    { id: 'beauty-bridal', label: 'Bridal Makeup Artist', group: 'Beauty & Grooming' },
    { id: 'beauty-reception', label: 'Reception Makeup', group: 'Beauty & Grooming' },
    { id: 'beauty-hair', label: 'Bridal Hair Styling', group: 'Beauty & Grooming' },
    { id: 'beauty-groom', label: 'Groom Grooming & Spa', group: 'Beauty & Grooming' },
    { id: 'beauty-family', label: 'Family Makeup/Draping', group: 'Beauty & Grooming' },
    { id: 'beauty-skincare', label: 'Pre-Wedding Skincare', group: 'Beauty & Grooming' },

    { id: 'ent-dj', label: 'DJ & Sound System', group: 'Entertainment & Music' },
    { id: 'ent-band', label: 'Band/Baja/Dhol', group: 'Entertainment & Music' },
    { id: 'ent-singer', label: 'Live Singer/Orchestra', group: 'Entertainment & Music' },
    { id: 'ent-dance', label: 'Dance Performance/Troupe', group: 'Entertainment & Music' },
    { id: 'ent-choreo', label: 'Sangeet Choreography', group: 'Entertainment & Music' },
    { id: 'ent-fireworks', label: 'Fireworks/Cold Pyro', group: 'Entertainment & Music' },

    { id: 'mehendi-bride', label: 'Mehendi Artist (Bride)', group: 'Mehendi & Ceremonies' },
    { id: 'mehendi-guests', label: 'Mehendi for Guests', group: 'Mehendi & Ceremonies' },
    { id: 'mehendi-materials', label: 'Henna Cones/Materials', group: 'Mehendi & Ceremonies' },
    { id: 'ceremony-haldi', label: 'Haldi Materials & Setup', group: 'Mehendi & Ceremonies' },
    { id: 'ceremony-tilak', label: 'Tilak Ceremony Arrangements', group: 'Mehendi & Ceremonies' },

    { id: 'gifts-trousseau', label: 'Bride Trousseau/Dahej', group: 'Gifts & Trousseau' },
    { id: 'gifts-groom-family', label: 'Gifts for Groom Family', group: 'Gifts & Trousseau' },
    { id: 'gifts-bride-family', label: 'Gifts for Bride Family', group: 'Gifts & Trousseau' },
    { id: 'gifts-shagun', label: 'Shagun Envelopes/Cash', group: 'Gifts & Trousseau' },
    { id: 'gifts-return', label: 'Return Gifts/Favors', group: 'Gifts & Trousseau' },
    { id: 'gifts-coconut', label: 'Coconut/Fruit Baskets', group: 'Gifts & Trousseau' },
    { id: 'gifts-kids', label: 'Kids Gift Packs', group: 'Gifts & Trousseau' },

    { id: 'pooja-pandit', label: 'Pandit/Priest Dakshina', group: 'Religious & Pooja' },
    { id: 'pooja-samagri', label: 'Pooja Samagri/Havan Items', group: 'Religious & Pooja' },
    { id: 'pooja-ganesh', label: 'Ganesh Puja Setup', group: 'Religious & Pooja' },
    { id: 'pooja-fire', label: 'Sacred Fire/Agni Setup', group: 'Religious & Pooja' },
    { id: 'pooja-sindoor', label: 'Sindoor/Kumkum/Turmeric', group: 'Religious & Pooja' },
    { id: 'pooja-kalash', label: 'Nariyal/Supari/Kalash', group: 'Religious & Pooja' },
    { id: 'pooja-temple', label: 'Temple Visit/Donation', group: 'Religious & Pooja' },
    { id: 'pooja-muhurat', label: 'Muhurat/Astrology Fees', group: 'Religious & Pooja' },

    { id: 'transport-baraat-car', label: 'Baraat Car/Vintage Car', group: 'Transport & Logistics' },
    { id: 'transport-horse', label: 'Baraat Horse/Ghodi', group: 'Transport & Logistics' },
    { id: 'transport-bus', label: 'Guest Bus/Van Rental', group: 'Transport & Logistics' },
    { id: 'transport-bridal', label: 'Bridal Entry Car/Doli', group: 'Transport & Logistics' },
    { id: 'transport-airport', label: 'Airport Pickup/Drop', group: 'Transport & Logistics' },
    { id: 'transport-local', label: 'Local Taxi/Auto', group: 'Transport & Logistics' },
    { id: 'transport-parking', label: 'Valet/Parking Management', group: 'Transport & Logistics' },
    { id: 'transport-bidaai', label: 'Bidaai Vehicle Decoration', group: 'Transport & Logistics' },

    { id: 'invite-cards', label: 'Printed Invitation Cards', group: 'Invitations & Stationery' },
    { id: 'invite-digital', label: 'E-Invitations/Video', group: 'Invitations & Stationery' },
    { id: 'invite-boxes', label: 'Invitation Boxes/Premium', group: 'Invitations & Stationery' },
    { id: 'invite-courier', label: 'Courier/Delivery Charges', group: 'Invitations & Stationery' },
    { id: 'invite-thankyou', label: 'Thank You Cards', group: 'Invitations & Stationery' },
    { id: 'invite-banner', label: 'Banners & Name Boards', group: 'Invitations & Stationery' },

    { id: 'honeymoon-flights', label: 'Honeymoon Flights', group: 'Honeymoon' },
    { id: 'honeymoon-hotel', label: 'Honeymoon Hotel/Resort', group: 'Honeymoon' },
    { id: 'honeymoon-activities', label: 'Activities & Sightseeing', group: 'Honeymoon' },
    { id: 'honeymoon-shopping', label: 'Honeymoon Shopping', group: 'Honeymoon' },
    { id: 'honeymoon-visa', label: 'Visa/Passport/Insurance', group: 'Honeymoon' },
    { id: 'honeymoon-luggage', label: 'New Luggage/Travel Gear', group: 'Honeymoon' },
    { id: 'honeymoon-forex', label: 'Forex/Currency Exchange', group: 'Honeymoon' },

    { id: 'misc-planner', label: 'Wedding Planner Fee', group: 'Miscellaneous' },
    { id: 'misc-insurance', label: 'Wedding Insurance', group: 'Miscellaneous' },
    { id: 'misc-security', label: 'Security/Bouncers', group: 'Miscellaneous' },
    { id: 'misc-cleaning', label: 'Venue Cleaning Staff', group: 'Miscellaneous' },
    { id: 'misc-tips', label: 'Tips/Bakshish', group: 'Miscellaneous' },
    { id: 'misc-emergency', label: 'Emergency Fund', group: 'Miscellaneous' },
    { id: 'misc-helpers', label: 'Helper/Labour Charges', group: 'Miscellaneous' },
    { id: 'misc-medical', label: 'First Aid/Medical Kit', group: 'Miscellaneous' },
    { id: 'misc-pan', label: 'Pan/Supari/Mouth Freshener', group: 'Miscellaneous' },
    { id: 'misc-water', label: 'Mineral Water/Cold Drinks', group: 'Miscellaneous' },
    { id: 'misc-tent', label: 'Tent House Items', group: 'Miscellaneous' },
    { id: 'misc-registration', label: 'Marriage Registration/Legal', group: 'Miscellaneous' },
    { id: 'misc-new-home', label: 'New Home Setup/Furniture', group: 'Miscellaneous' },
    { id: 'misc-packing', label: 'Clothes Packing/Wrapping', group: 'Miscellaneous' },

    { id: 'other', label: 'Other (Custom)', group: 'Other' },
];

const GROUPS = [...new Set(CATEGORIES.map(c => c.group))];

const GROUP_COLORS: Record<string, string> = {
    'Venue & Hospitality': '#6366f1',
    'Food & Catering': '#f59e0b',
    'Jewelry & Gold': '#ec4899',
    'Decoration & Production': '#8b5cf6',
    'Bridal & Groom Attire': '#14b8a6',
    'Photography & Video': '#3b82f6',
    'Beauty & Grooming': '#f472b6',
    'Entertainment & Music': '#a855f7',
    'Mehendi & Ceremonies': '#10b981',
    'Gifts & Trousseau': '#ef4444',
    'Religious & Pooja': '#f97316',
    'Transport & Logistics': '#64748b',
    'Invitations & Stationery': '#06b6d4',
    'Honeymoon': '#e11d48',
    'Miscellaneous': '#78716c',
    'Other': '#94a3b8',
};

interface Expense {
    id: string;
    categoryId: string;
    customLabel: string;
    amount: number;
    paid: number;
    vendor: string;
    notes: string;
}

const fmt = (v: number) => {
    if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`;
    if (v >= 100000) return `₹${(v / 100000).toFixed(2)} L`;
    if (v >= 1000) return `₹${(v / 1000).toFixed(1)}K`;
    return `₹${v.toLocaleString('en-IN')}`;
};

type Tab = 'expenses' | 'report';

export const MarriageBudgetPlannerPage: React.FC = () => {
    useAuth();
    const [totalBudget, setTotalBudget] = useState(2500000);
    const [budgetInput, setBudgetInput] = useState('25,00,000');
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tab, setTab] = useState<Tab>('expenses');
    const [searchQ, setSearchQ] = useState('');
    const [filterGroup, setFilterGroup] = useState('all');
    const [sortBy, setSortBy] = useState<'newest' | 'amount-high' | 'amount-low' | 'group'>('newest');

    // Form state
    const [fCat, setFCat] = useState('venue-main');
    const [fCustom, setFCustom] = useState('');
    const [fAmount, setFAmount] = useState('');
    const [fPaid, setFPaid] = useState('');
    const [fVendor, setFVendor] = useState('');
    const [fNotes, setFNotes] = useState('');

    const resetForm = () => {
        setFCat('venue-main'); setFCustom(''); setFAmount(''); setFPaid(''); setFVendor(''); setFNotes('');
        setEditingId(null); setShowModal(false);
    };

    const openAdd = () => { resetForm(); setShowModal(true); };

    const openEdit = (e: Expense) => {
        setFCat(e.categoryId); setFCustom(e.customLabel); setFAmount(e.amount.toString()); setFPaid(e.paid.toString()); setFVendor(e.vendor); setFNotes(e.notes);
        setEditingId(e.id); setShowModal(true);
    };

    const handleSave = () => {
        const amount = Number(fAmount) || 0;
        if (amount <= 0) return;
        const entry: Expense = { id: editingId || Math.random().toString(36).substr(2, 9), categoryId: fCat, customLabel: fCustom, amount, paid: Number(fPaid) || 0, vendor: fVendor, notes: fNotes };
        if (editingId) setExpenses(expenses.map(x => x.id === editingId ? entry : x));
        else setExpenses([...expenses, entry]);
        resetForm();
    };

    const handleDelete = (id: string) => setExpenses(expenses.filter(x => x.id !== id));

    const handleBudgetChange = (v: string) => {
        setBudgetInput(v);
        const num = Number(v.replace(/,/g, ''));
        if (!isNaN(num) && num >= 0) setTotalBudget(num);
    };

    // Computed
    const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
    const totalPaid = expenses.reduce((s, e) => s + e.paid, 0);
    const remaining = Math.max(0, totalBudget - totalSpent);
    const pending = Math.max(0, totalSpent - totalPaid);

    const getCatLabel = (e: Expense) => {
        if (e.categoryId === 'other' && e.customLabel) return e.customLabel;
        return CATEGORIES.find(c => c.id === e.categoryId)?.label || 'Other';
    };
    const getCatGroup = (e: Expense) => CATEGORIES.find(c => c.id === e.categoryId)?.group || 'Other';

    // Filtered & sorted expenses
    const displayExpenses = useMemo(() => {
        let list = [...expenses];
        if (searchQ) {
            const q = searchQ.toLowerCase();
            list = list.filter(e => getCatLabel(e).toLowerCase().includes(q) || e.vendor.toLowerCase().includes(q) || e.notes.toLowerCase().includes(q));
        }
        if (filterGroup !== 'all') list = list.filter(e => getCatGroup(e) === filterGroup);
        if (sortBy === 'amount-high') list.sort((a, b) => b.amount - a.amount);
        else if (sortBy === 'amount-low') list.sort((a, b) => a.amount - b.amount);
        else if (sortBy === 'group') list.sort((a, b) => getCatGroup(a).localeCompare(getCatGroup(b)));
        else list.reverse(); // newest first
        return list;
    }, [expenses, searchQ, filterGroup, sortBy]);

    // Group analytics
    const groupStats = useMemo(() => {
        const stats: Record<string, { spent: number; paid: number; count: number }> = {};
        GROUPS.forEach(g => (stats[g] = { spent: 0, paid: 0, count: 0 }));
        expenses.forEach(e => {
            const g = getCatGroup(e);
            if (stats[g]) { stats[g].spent += e.amount; stats[g].paid += e.paid; stats[g].count++; }
        });
        return GROUPS.map(g => ({ group: g, ...stats[g], pct: totalSpent > 0 ? (stats[g].spent / totalSpent) * 100 : 0 })).filter(g => g.count > 0).sort((a, b) => b.spent - a.spent);
    }, [expenses, totalSpent]);

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20); doc.text('Marriage Budget Report', 14, 22);
        doc.setFontSize(11);
        doc.text(`Budget: Rs. ${totalBudget.toLocaleString('en-IN')}  |  Spent: Rs. ${totalSpent.toLocaleString('en-IN')}  |  Remaining: Rs. ${remaining.toLocaleString('en-IN')}`, 14, 32);
        autoTable(doc, {
            startY: 42,
            head: [['#', 'Category', 'Item', 'Vendor', 'Amount', 'Paid', 'Balance']],
            body: expenses.map((e, i) => [i + 1, getCatGroup(e), getCatLabel(e), e.vendor || '-', `Rs. ${e.amount.toLocaleString('en-IN')}`, `Rs. ${e.paid.toLocaleString('en-IN')}`, `Rs. ${(e.amount - e.paid).toLocaleString('en-IN')}`]),
            theme: 'striped', styles: { fontSize: 8 }, headStyles: { fillColor: [236, 72, 153] }
        });
        doc.save('marriage-budget-report.pdf');
    };

    return (
        <>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 animate-fade-in">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
                        <Heart className="text-pink-500" size={28} /> Marriage Budget Planner
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Simple expense tracking for your Indian wedding</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={generatePDF} className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors flex items-center gap-1.5">
                        <Download size={15} /> PDF
                    </button>
                    <button onClick={openAdd} className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-lg shadow-pink-500/20">
                        <Plus size={16} /> Add Expense
                    </button>
                </div>
            </div>

            {/* ── Budget Input + Stats Row ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="bg-white rounded-xl border border-slate-200 p-4 col-span-2 sm:col-span-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Budget</p>
                    <div className="flex items-center gap-1">
                        <span className="text-slate-400 text-sm">₹</span>
                        <input
                            type="text"
                            value={budgetInput}
                            onChange={e => handleBudgetChange(e.target.value)}
                            className="w-full text-lg font-bold text-slate-900 bg-transparent border-none outline-none p-0"
                            placeholder="25,00,000"
                        />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">{fmt(totalBudget)}</p>
                </div>
                <div className={`rounded-xl border p-4 ${totalSpent > totalBudget ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Wallet size={10} /> Total Spent</p>
                    <p className={`text-lg font-bold ${totalSpent > totalBudget ? 'text-rose-600' : 'text-emerald-700'}`}>{fmt(totalSpent)}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0}% used</p>
                </div>
                <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><CheckCircle2 size={10} /> Paid</p>
                    <p className="text-lg font-bold text-blue-700">{fmt(totalPaid)}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{totalSpent > 0 ? ((totalPaid / totalSpent) * 100).toFixed(1) : 0}% settled</p>
                </div>
                <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Clock size={10} /> Remaining</p>
                    <p className="text-lg font-bold text-amber-700">{fmt(remaining)}</p>
                    <p className="text-[10px] text-slate-500 mt-1">₹{pending.toLocaleString('en-IN')} pending</p>
                </div>
            </div>

            {/* ── Budget Progress Bar ── */}
            {totalBudget > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <span>Budget Progress</span>
                    <span>{fmt(totalSpent)} / {fmt(totalBudget)}</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${totalSpent > totalBudget ? 'bg-gradient-to-r from-rose-500 to-red-500' : 'bg-gradient-to-r from-pink-400 to-rose-500'}`}
                        style={{ width: `${Math.min(100, (totalSpent / totalBudget) * 100)}%` }}
                    />
                </div>
            </div>
            )}

            {/* ── Tabs ── */}
            <div className="flex gap-2 mb-4 border-b border-slate-200 pb-2">
                <button onClick={() => setTab('expenses')} className={`px-4 py-2 rounded-t-lg text-sm font-semibold transition-colors ${tab === 'expenses' ? 'bg-pink-500 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
                    Expenses ({expenses.length})
                </button>
                <button onClick={() => setTab('report')} className={`px-4 py-2 rounded-t-lg text-sm font-semibold transition-colors ${tab === 'report' ? 'bg-pink-500 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
                    <BarChart3 size={14} className="inline mr-1.5 -mt-0.5" /> Report
                </button>
            </div>

            {/* ═══════ EXPENSES TAB ═══════ */}
            {tab === 'expenses' && (
            <div>
                {/* Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search expenses..." value={searchQ} onChange={e => setSearchQ(e.target.value)} className="w-full pl-8 pr-8 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500" />
                        {searchQ && <button onClick={() => setSearchQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={14} /></button>}
                    </div>
                    <select value={filterGroup} onChange={e => setFilterGroup(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600">
                        <option value="all">All Categories</option>
                        {GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600">
                        <option value="newest">Newest First</option>
                        <option value="amount-high">Amount: High → Low</option>
                        <option value="amount-low">Amount: Low → High</option>
                        <option value="group">By Category</option>
                    </select>
                </div>

                {expenses.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                        <PiggyBank size={48} className="mx-auto text-pink-300 mb-4" />
                        <h3 className="text-lg font-semibold text-slate-700 mb-2">Start Adding Expenses</h3>
                        <p className="text-slate-500 text-sm mb-4">Click the pink <strong>"+ Add Expense"</strong> button to add your first wedding expense.</p>
                        <button onClick={openAdd} className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-pink-500/20 inline-flex items-center gap-1.5">
                            <Plus size={16} /> Add First Expense
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {displayExpenses.map(exp => {
                            const group = getCatGroup(exp);
                            const color = GROUP_COLORS[group] || '#94a3b8';
                            const balance = exp.amount - exp.paid;
                            const isPaid = exp.paid >= exp.amount;
                            return (
                                <div key={exp.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            <div className="w-1 h-10 rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: color }} />
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h4 className="font-semibold text-slate-800 text-sm">{getCatLabel(exp)}</h4>
                                                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ backgroundColor: color + '15', color }}>{group}</span>
                                                    {isPaid && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><CheckCircle2 size={8} />Paid</span>}
                                                </div>
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-slate-500">
                                                    <span className="font-semibold text-slate-800 text-sm">{fmt(exp.amount)}</span>
                                                    {exp.paid > 0 && <span className="text-emerald-600">Paid: {fmt(exp.paid)}</span>}
                                                    {balance > 0 && <span className="text-amber-600">Due: {fmt(balance)}</span>}
                                                    {exp.vendor && <span>📍 {exp.vendor}</span>}
                                                    {exp.notes && <span className="text-slate-400 truncate max-w-[150px]">💬 {exp.notes}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            <button onClick={() => openEdit(exp)} className="p-1.5 text-slate-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"><Edit2 size={14} /></button>
                                            <button onClick={() => handleDelete(exp.id)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {displayExpenses.length === 0 && searchQ && (
                            <div className="text-center py-8 text-slate-500 text-sm">No expenses match your search.</div>
                        )}
                    </div>
                )}
            </div>
            )}

            {/* ═══════ REPORT TAB ═══════ */}
            {tab === 'report' && (
            <div className="space-y-6">
                {expenses.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                        <BarChart3 size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-semibold text-slate-700 mb-2">No Data Yet</h3>
                        <p className="text-slate-500 text-sm">Add expenses first to see your budget report.</p>
                    </div>
                ) : (
                <>
                    {/* Group Breakdown */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <h3 className="font-bold text-slate-800 mb-4">Spending by Category</h3>
                        <div className="space-y-3">
                            {groupStats.map(g => (
                                <div key={g.group}>
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: GROUP_COLORS[g.group] }} />
                                            <span className="text-sm font-medium text-slate-700">{g.group}</span>
                                            <span className="text-xs text-slate-400">({g.count})</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs">
                                            <span className="font-bold text-slate-800">{fmt(g.spent)}</span>
                                            <span className="text-slate-400">{g.pct.toFixed(1)}%</span>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${g.pct}%`, backgroundColor: GROUP_COLORS[g.group] }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Full Report Table */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                            <h3 className="font-bold text-slate-800">Complete Expense Report</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider border-b">
                                    <tr>
                                        <th className="px-4 py-3">#</th>
                                        <th className="px-4 py-3">Category</th>
                                        <th className="px-4 py-3">Item</th>
                                        <th className="px-4 py-3">Vendor</th>
                                        <th className="px-4 py-3 text-right">Amount</th>
                                        <th className="px-4 py-3 text-right">Paid</th>
                                        <th className="px-4 py-3 text-right">Balance</th>
                                        <th className="px-4 py-3 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {expenses.map((e, i) => {
                                        const bal = e.amount - e.paid;
                                        const isPaid = e.paid >= e.amount && e.amount > 0;
                                        return (
                                            <tr key={e.id} className="hover:bg-slate-50/50 text-sm">
                                                <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                                                <td className="px-4 py-3">
                                                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ backgroundColor: (GROUP_COLORS[getCatGroup(e)] || '#94a3b8') + '15', color: GROUP_COLORS[getCatGroup(e)] || '#94a3b8' }}>
                                                        {getCatGroup(e)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 font-medium text-slate-800">{getCatLabel(e)}</td>
                                                <td className="px-4 py-3 text-slate-500">{e.vendor || '-'}</td>
                                                <td className="px-4 py-3 text-right font-semibold text-slate-800">₹{e.amount.toLocaleString('en-IN')}</td>
                                                <td className="px-4 py-3 text-right text-emerald-600">₹{e.paid.toLocaleString('en-IN')}</td>
                                                <td className="px-4 py-3 text-right text-amber-600 font-medium">₹{bal.toLocaleString('en-IN')}</td>
                                                <td className="px-4 py-3 text-center">
                                                    {isPaid ? <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Paid</span>
                                                    : bal > 0 ? <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Pending</span>
                                                    : <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">New</span>}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                                    <tr className="font-bold text-sm">
                                        <td className="px-4 py-3" colSpan={4}>TOTAL ({expenses.length} items)</td>
                                        <td className="px-4 py-3 text-right text-slate-800">₹{totalSpent.toLocaleString('en-IN')}</td>
                                        <td className="px-4 py-3 text-right text-emerald-600">₹{totalPaid.toLocaleString('en-IN')}</td>
                                        <td className="px-4 py-3 text-right text-amber-600">₹{pending.toLocaleString('en-IN')}</td>
                                        <td />
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Quick Insights */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-100 p-5">
                            <h4 className="text-xs font-bold text-pink-700 uppercase tracking-wider mb-3">Top 5 Expenses</h4>
                            <div className="space-y-2">
                                {[...expenses].sort((a, b) => b.amount - a.amount).slice(0, 5).map((e, i) => (
                                    <div key={e.id} className="flex justify-between text-sm">
                                        <span className="text-slate-700 truncate max-w-[65%]">{i + 1}. {getCatLabel(e)}</span>
                                        <span className="font-bold text-pink-700">{fmt(e.amount)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-100 p-5">
                            <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3">Largest Pending</h4>
                            <div className="space-y-2">
                                {[...expenses].filter(e => e.amount > e.paid).sort((a, b) => (b.amount - b.paid) - (a.amount - a.paid)).slice(0, 5).map((e, i) => (
                                    <div key={e.id} className="flex justify-between text-sm">
                                        <span className="text-slate-700 truncate max-w-[65%]">{i + 1}. {getCatLabel(e)}</span>
                                        <span className="font-bold text-amber-700">{fmt(e.amount - e.paid)}</span>
                                    </div>
                                ))}
                                {expenses.filter(e => e.amount > e.paid).length === 0 && <p className="text-xs text-slate-500">All paid up! 🎉</p>}
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100 p-5">
                            <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">Summary</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-slate-600">Budget Used</span><span className={`font-bold ${totalSpent > totalBudget ? 'text-rose-600' : 'text-slate-800'}`}>{totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0}%</span></div>
                                <div className="flex justify-between"><span className="text-slate-600">Payment Done</span><span className="font-bold text-emerald-700">{totalSpent > 0 ? ((totalPaid / totalSpent) * 100).toFixed(1) : 0}%</span></div>
                                <div className="flex justify-between"><span className="text-slate-600">Total Entries</span><span className="font-bold text-slate-800">{expenses.length}</span></div>
                                <div className="flex justify-between"><span className="text-slate-600">Categories</span><span className="font-bold text-slate-800">{groupStats.length}</span></div>
                                <div className="flex justify-between"><span className="text-slate-600">Avg per Item</span><span className="font-bold text-slate-800">{expenses.length > 0 ? fmt(Math.round(totalSpent / expenses.length)) : '₹0'}</span></div>
                            </div>
                        </div>
                    </div>
                </>
                )}
            </div>
            )}
        </div>

        {/* ═══════ ADD/EDIT MODAL ═══════ */}
        {showModal && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]" onClick={resetForm}>
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-4 flex items-center justify-between text-white">
                        <h3 className="font-bold text-lg">{editingId ? 'Edit Expense' : 'Add Expense'}</h3>
                        <button onClick={resetForm} className="text-white/80 hover:text-white text-xl font-bold">✕</button>
                    </div>

                    <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
                        {/* Category - grouped dropdown */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Category *</label>
                            <select value={fCat} onChange={e => setFCat(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500">
                                {GROUPS.map(g => (
                                    <optgroup key={g} label={g}>
                                        {CATEGORIES.filter(c => c.group === g).map(c => (
                                            <option key={c.id} value={c.id}>{c.label}</option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </div>

                        {/* Custom label for "Other" */}
                        {fCat === 'other' && (
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Custom Name *</label>
                                <input type="text" placeholder="E.g. Custom expense name" value={fCustom} onChange={e => setFCustom(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500" />
                            </div>
                        )}

                        {/* Amount */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Amount (₹) *</label>
                            <input type="number" placeholder="0" value={fAmount} onChange={e => setFAmount(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-lg font-semibold" />
                        </div>

                        {/* Paid */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Paid / Advance (₹)</label>
                            <input type="number" placeholder="0" value={fPaid} onChange={e => setFPaid(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500" />
                        </div>

                        {/* Vendor & Notes - side by side */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Vendor</label>
                                <input type="text" placeholder="Optional" value={fVendor} onChange={e => setFVendor(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Notes</label>
                                <input type="text" placeholder="Optional" value={fNotes} onChange={e => setFNotes(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 px-6 py-4 flex gap-3 border-t border-slate-100 justify-end">
                        <button onClick={resetForm} className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors">Cancel</button>
                        <button onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                            {editingId ? 'Update' : 'Add Expense'}
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};
