import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Heart, Settings, PieChart, Activity, Download, Plus, Trash2, Edit2, CheckCircle2, Filter, BarChart3, TrendingUp, AlertTriangle, ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ── 100+ Indian Marriage Categories ──
const CATEGORIES = [
    // Venue & Hospitality (~18%)
    { id: 'venue-main', label: 'Main Wedding Venue', defaultPct: 6, group: 'Venue & Hospitality' },
    { id: 'venue-reception', label: 'Reception Venue', defaultPct: 3, group: 'Venue & Hospitality' },
    { id: 'venue-sangeet', label: 'Sangeet/Mehendi Venue', defaultPct: 2, group: 'Venue & Hospitality' },
    { id: 'venue-haldi', label: 'Haldi Ceremony Venue', defaultPct: 1, group: 'Venue & Hospitality' },
    { id: 'venue-mandap', label: 'Mandap/Stage Setup', defaultPct: 2, group: 'Venue & Hospitality' },
    { id: 'venue-guest-rooms', label: 'Guest Room Booking', defaultPct: 2, group: 'Venue & Hospitality' },
    { id: 'venue-farmhouse', label: 'Farmhouse/Lawn Rental', defaultPct: 1, group: 'Venue & Hospitality' },
    { id: 'venue-generator', label: 'Generator & Power Backup', defaultPct: 0.5, group: 'Venue & Hospitality' },
    { id: 'venue-ac-cooling', label: 'AC/Cooler/Fan Setup', defaultPct: 0.5, group: 'Venue & Hospitality' },

    // Food & Catering (~15%)
    { id: 'food-wedding', label: 'Wedding Day Catering', defaultPct: 5, group: 'Food & Catering' },
    { id: 'food-reception', label: 'Reception Dinner', defaultPct: 3, group: 'Food & Catering' },
    { id: 'food-sangeet', label: 'Sangeet Night Food', defaultPct: 1.5, group: 'Food & Catering' },
    { id: 'food-haldi', label: 'Haldi Ceremony Food', defaultPct: 1, group: 'Food & Catering' },
    { id: 'food-mehendi', label: 'Mehendi Function Food', defaultPct: 1, group: 'Food & Catering' },
    { id: 'food-baraat', label: 'Baraat Welcome Snacks', defaultPct: 0.5, group: 'Food & Catering' },
    { id: 'food-sweets', label: 'Sweets & Mithai Boxes', defaultPct: 1, group: 'Food & Catering' },
    { id: 'food-icecream', label: 'Ice Cream/Live Counters', defaultPct: 0.5, group: 'Food & Catering' },
    { id: 'food-beverages', label: 'Beverages & Drinks', defaultPct: 0.5, group: 'Food & Catering' },
    { id: 'food-staff-meals', label: 'Staff/Helper Meals', defaultPct: 0.5, group: 'Food & Catering' },

    // Jewelry & Gold (~12%)
    { id: 'jewelry-bridal-gold', label: 'Bridal Gold Jewelry', defaultPct: 4, group: 'Jewelry & Gold' },
    { id: 'jewelry-bridal-diamond', label: 'Bridal Diamond Set', defaultPct: 2, group: 'Jewelry & Gold' },
    { id: 'jewelry-groom', label: 'Groom Jewelry/Watch', defaultPct: 1, group: 'Jewelry & Gold' },
    { id: 'jewelry-mangalsutra', label: 'Mangalsutra', defaultPct: 1.5, group: 'Jewelry & Gold' },
    { id: 'jewelry-rings', label: 'Engagement/Wedding Rings', defaultPct: 1, group: 'Jewelry & Gold' },
    { id: 'jewelry-gift-sets', label: 'Gift Jewelry Sets', defaultPct: 1.5, group: 'Jewelry & Gold' },
    { id: 'jewelry-silver', label: 'Silver Articles/Pooja Items', defaultPct: 1, group: 'Jewelry & Gold' },

    // Decoration & Production (~8%)
    { id: 'decor-mandap', label: 'Mandap Decoration', defaultPct: 1.5, group: 'Decoration & Production' },
    { id: 'decor-floral', label: 'Floral Arrangements', defaultPct: 1.5, group: 'Decoration & Production' },
    { id: 'decor-lighting', label: 'Lighting & LED Setup', defaultPct: 1, group: 'Decoration & Production' },
    { id: 'decor-stage', label: 'Stage & Backdrop Design', defaultPct: 1, group: 'Decoration & Production' },
    { id: 'decor-entrance', label: 'Entrance Gate/Welcome Board', defaultPct: 0.5, group: 'Decoration & Production' },
    { id: 'decor-rangoli', label: 'Rangoli & Floor Art', defaultPct: 0.3, group: 'Decoration & Production' },
    { id: 'decor-table', label: 'Table Centerpieces', defaultPct: 0.5, group: 'Decoration & Production' },
    { id: 'decor-haldi-setup', label: 'Haldi Decor Setup', defaultPct: 0.5, group: 'Decoration & Production' },
    { id: 'decor-mehendi-setup', label: 'Mehendi Decor Setup', defaultPct: 0.5, group: 'Decoration & Production' },
    { id: 'decor-car', label: 'Car/Doli Decoration', defaultPct: 0.2, group: 'Decoration & Production' },

    // Bridal & Groom Attire (~8%)
    { id: 'attire-bridal-lehenga', label: 'Bridal Lehenga/Saree', defaultPct: 2, group: 'Bridal & Groom Attire' },
    { id: 'attire-reception-outfit', label: 'Reception Outfit (Bride)', defaultPct: 1, group: 'Bridal & Groom Attire' },
    { id: 'attire-sangeet-outfit', label: 'Sangeet Outfit (Bride)', defaultPct: 0.5, group: 'Bridal & Groom Attire' },
    { id: 'attire-mehendi-outfit', label: 'Mehendi Outfit (Bride)', defaultPct: 0.5, group: 'Bridal & Groom Attire' },
    { id: 'attire-groom-sherwani', label: 'Groom Sherwani/Suit', defaultPct: 1.5, group: 'Bridal & Groom Attire' },
    { id: 'attire-groom-reception', label: 'Groom Reception Outfit', defaultPct: 0.5, group: 'Bridal & Groom Attire' },
    { id: 'attire-bridal-dupatta', label: 'Bridal Dupatta/Chunri', defaultPct: 0.3, group: 'Bridal & Groom Attire' },
    { id: 'attire-accessories', label: 'Accessories (Kalire, Chura)', defaultPct: 0.5, group: 'Bridal & Groom Attire' },
    { id: 'attire-footwear', label: 'Wedding Footwear (Both)', defaultPct: 0.3, group: 'Bridal & Groom Attire' },
    { id: 'attire-family', label: 'Family Outfits', defaultPct: 0.9, group: 'Bridal & Groom Attire' },

    // Photography & Videography (~5%)
    { id: 'photo-wedding', label: 'Wedding Day Photography', defaultPct: 1.5, group: 'Photography & Videography' },
    { id: 'photo-prewedding', label: 'Pre-Wedding Shoot', defaultPct: 1, group: 'Photography & Videography' },
    { id: 'photo-video', label: 'Cinematic Videography', defaultPct: 1, group: 'Photography & Videography' },
    { id: 'photo-drone', label: 'Drone Coverage', defaultPct: 0.5, group: 'Photography & Videography' },
    { id: 'photo-album', label: 'Photo Album/Coffee Table Book', defaultPct: 0.5, group: 'Photography & Videography' },
    { id: 'photo-instant', label: 'Instant Print Photo Booth', defaultPct: 0.5, group: 'Photography & Videography' },

    // Beauty & Grooming (~3%)
    { id: 'beauty-bridal-makeup', label: 'Bridal Makeup Artist', defaultPct: 1, group: 'Beauty & Grooming' },
    { id: 'beauty-reception-makeup', label: 'Reception Makeup', defaultPct: 0.5, group: 'Beauty & Grooming' },
    { id: 'beauty-hair', label: 'Bridal Hair Styling', defaultPct: 0.3, group: 'Beauty & Grooming' },
    { id: 'beauty-groom', label: 'Groom Grooming & Spa', defaultPct: 0.3, group: 'Beauty & Grooming' },
    { id: 'beauty-family', label: 'Family Makeup/Draping', defaultPct: 0.5, group: 'Beauty & Grooming' },
    { id: 'beauty-skincare', label: 'Pre-Wedding Skincare', defaultPct: 0.4, group: 'Beauty & Grooming' },

    // Entertainment & Music (~3%)
    { id: 'entertainment-dj', label: 'DJ & Sound System', defaultPct: 1, group: 'Entertainment & Music' },
    { id: 'entertainment-band', label: 'Band/Baja/Dhol', defaultPct: 0.5, group: 'Entertainment & Music' },
    { id: 'entertainment-singer', label: 'Live Singer/Orchestra', defaultPct: 0.5, group: 'Entertainment & Music' },
    { id: 'entertainment-dance', label: 'Dance Performance/Troupe', defaultPct: 0.3, group: 'Entertainment & Music' },
    { id: 'entertainment-sangeet-choreo', label: 'Sangeet Choreography', defaultPct: 0.5, group: 'Entertainment & Music' },
    { id: 'entertainment-fireworks', label: 'Fireworks/Cold Pyro', defaultPct: 0.2, group: 'Entertainment & Music' },

    // Mehendi & Ceremonies (~2%)
    { id: 'mehendi-artist', label: 'Mehendi Artist (Bride)', defaultPct: 0.5, group: 'Mehendi & Ceremonies' },
    { id: 'mehendi-guests', label: 'Mehendi for Guests', defaultPct: 0.3, group: 'Mehendi & Ceremonies' },
    { id: 'mehendi-materials', label: 'Henna Cones/Materials', defaultPct: 0.2, group: 'Mehendi & Ceremonies' },
    { id: 'ceremony-haldi', label: 'Haldi Materials & Setup', defaultPct: 0.5, group: 'Mehendi & Ceremonies' },
    { id: 'ceremony-tilak', label: 'Tilak Ceremony Arrangements', defaultPct: 0.5, group: 'Mehendi & Ceremonies' },

    // Gifts & Trousseau (~5%)
    { id: 'gifts-bride-trousseau', label: 'Bride Trousseau/Dahej', defaultPct: 1.5, group: 'Gifts & Trousseau' },
    { id: 'gifts-groom-family', label: 'Gifts for Groom Family', defaultPct: 1, group: 'Gifts & Trousseau' },
    { id: 'gifts-bride-family', label: 'Gifts for Bride Family', defaultPct: 0.5, group: 'Gifts & Trousseau' },
    { id: 'gifts-shagun', label: 'Shagun Envelopes/Cash', defaultPct: 0.5, group: 'Gifts & Trousseau' },
    { id: 'gifts-return', label: 'Return Gifts/Favors', defaultPct: 1, group: 'Gifts & Trousseau' },
    { id: 'gifts-coconut', label: 'Coconut/Fruit Baskets', defaultPct: 0.3, group: 'Gifts & Trousseau' },
    { id: 'gifts-kids', label: 'Kids Gift Packs', defaultPct: 0.2, group: 'Gifts & Trousseau' },

    // Religious & Pooja (~2%)
    { id: 'pooja-pandit', label: 'Pandit/Priest Dakshina', defaultPct: 0.5, group: 'Religious & Pooja' },
    { id: 'pooja-samagri', label: 'Pooja Samagri/Havan Items', defaultPct: 0.3, group: 'Religious & Pooja' },
    { id: 'pooja-ganesh', label: 'Ganesh Puja Setup', defaultPct: 0.2, group: 'Religious & Pooja' },
    { id: 'pooja-fire', label: 'Sacred Fire/Agni Setup', defaultPct: 0.2, group: 'Religious & Pooja' },
    { id: 'pooja-sindoor', label: 'Sindoor/Kumkum/Turmeric', defaultPct: 0.1, group: 'Religious & Pooja' },
    { id: 'pooja-coconut', label: 'Nariyal/Supari/Kalash', defaultPct: 0.1, group: 'Religious & Pooja' },
    { id: 'pooja-temple', label: 'Temple Visit/Donation', defaultPct: 0.3, group: 'Religious & Pooja' },
    { id: 'pooja-muhurat', label: 'Muhurat/Astrology Fees', defaultPct: 0.3, group: 'Religious & Pooja' },

    // Transport & Logistics (~3%)
    { id: 'transport-baraat-car', label: 'Baraat Car/Vintage Car', defaultPct: 0.5, group: 'Transport & Logistics' },
    { id: 'transport-horse', label: 'Baraat Horse/Ghodi', defaultPct: 0.3, group: 'Transport & Logistics' },
    { id: 'transport-bus', label: 'Guest Bus/Van Rental', defaultPct: 0.5, group: 'Transport & Logistics' },
    { id: 'transport-bridal-car', label: 'Bridal Entry Car/Doli', defaultPct: 0.3, group: 'Transport & Logistics' },
    { id: 'transport-airport', label: 'Airport Pickup/Drop', defaultPct: 0.5, group: 'Transport & Logistics' },
    { id: 'transport-local', label: 'Local Taxi/Auto Arrangements', defaultPct: 0.5, group: 'Transport & Logistics' },
    { id: 'transport-parking', label: 'Valet/Parking Management', defaultPct: 0.2, group: 'Transport & Logistics' },
    { id: 'transport-bidaai', label: 'Bidaai Vehicle Decoration', defaultPct: 0.2, group: 'Transport & Logistics' },

    // Invitations & Stationery (~2%)
    { id: 'invite-cards', label: 'Printed Invitation Cards', defaultPct: 0.5, group: 'Invitations & Stationery' },
    { id: 'invite-digital', label: 'E-Invitations/Video', defaultPct: 0.3, group: 'Invitations & Stationery' },
    { id: 'invite-boxes', label: 'Invitation Boxes/Premium', defaultPct: 0.5, group: 'Invitations & Stationery' },
    { id: 'invite-courier', label: 'Courier/Delivery Charges', defaultPct: 0.3, group: 'Invitations & Stationery' },
    { id: 'invite-thankyou', label: 'Thank You Cards', defaultPct: 0.2, group: 'Invitations & Stationery' },
    { id: 'invite-banner', label: 'Banners & Name Boards', defaultPct: 0.2, group: 'Invitations & Stationery' },

    // Honeymoon (~7%)
    { id: 'honeymoon-flights', label: 'Honeymoon Flights', defaultPct: 2, group: 'Honeymoon' },
    { id: 'honeymoon-hotel', label: 'Honeymoon Hotel/Resort', defaultPct: 2, group: 'Honeymoon' },
    { id: 'honeymoon-activities', label: 'Activities & Sightseeing', defaultPct: 1, group: 'Honeymoon' },
    { id: 'honeymoon-shopping', label: 'Honeymoon Shopping', defaultPct: 0.5, group: 'Honeymoon' },
    { id: 'honeymoon-visa', label: 'Visa/Passport/Insurance', defaultPct: 0.5, group: 'Honeymoon' },
    { id: 'honeymoon-luggage', label: 'New Luggage/Travel Gear', defaultPct: 0.5, group: 'Honeymoon' },
    { id: 'honeymoon-forex', label: 'Forex/Currency Exchange', defaultPct: 0.5, group: 'Honeymoon' },

    // Miscellaneous & Others (~7%)
    { id: 'misc-wedding-planner', label: 'Wedding Planner Fee', defaultPct: 1.5, group: 'Miscellaneous & Others' },
    { id: 'misc-insurance', label: 'Wedding Insurance', defaultPct: 0.3, group: 'Miscellaneous & Others' },
    { id: 'misc-security', label: 'Security/Bouncers', defaultPct: 0.3, group: 'Miscellaneous & Others' },
    { id: 'misc-cleaning', label: 'Venue Cleaning Staff', defaultPct: 0.2, group: 'Miscellaneous & Others' },
    { id: 'misc-tips', label: 'Tips/Bakshish', defaultPct: 0.5, group: 'Miscellaneous & Others' },
    { id: 'misc-emergency', label: 'Emergency Fund', defaultPct: 2, group: 'Miscellaneous & Others' },
    { id: 'misc-helpers', label: 'Helper/Labour Charges', defaultPct: 0.3, group: 'Miscellaneous & Others' },
    { id: 'misc-medical', label: 'First Aid/Medical Kit', defaultPct: 0.1, group: 'Miscellaneous & Others' },
    { id: 'misc-pan-masala', label: 'Pan/Supari/Mouth Freshener', defaultPct: 0.1, group: 'Miscellaneous & Others' },
    { id: 'misc-water', label: 'Mineral Water/Cold Drinks', defaultPct: 0.2, group: 'Miscellaneous & Others' },
    { id: 'misc-tent-house', label: 'Tent House Items', defaultPct: 0.5, group: 'Miscellaneous & Others' },
    { id: 'misc-registration', label: 'Marriage Registration/Legal', defaultPct: 0.2, group: 'Miscellaneous & Others' },
    { id: 'misc-new-home', label: 'New Home Setup/Furniture', defaultPct: 0.5, group: 'Miscellaneous & Others' },
    { id: 'misc-clothes-packing', label: 'Clothes Packing/Wrapping', defaultPct: 0.3, group: 'Miscellaneous & Others' },

    // Other (catch-all)
    { id: 'other', label: 'Other', defaultPct: 0, group: 'Other' },
];

const CATEGORY_GROUPS = [...new Set(CATEGORIES.map(c => c.group))];

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

type ViewTab = 'planner' | 'report';

export const MarriageBudgetPlannerPage: React.FC = () => {
    const { user } = useAuth();
    const [totalBudget, setTotalBudget] = useState(2500000);
    const [guestCount, setGuestCount] = useState(500);
    const [weddingStyle, setWeddingStyle] = useState('Traditional');
    const [savings, setSavings] = useState({ eInvites: false, dayWedding: false, offSeason: false, minimalDecor: false });
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<Partial<Expense>>({ categoryId: 'venue-main', item: '', estimatedCost: 0, actualCost: 0, paid: 0, vendor: '', notes: '' });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<ViewTab>('planner');
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(CATEGORY_GROUPS));
    const [categorySearch, setCategorySearch] = useState('');
    const [reportFilterGroup, setReportFilterGroup] = useState('all');
    const [reportFilterStatus, setReportFilterStatus] = useState<'all' | 'paid' | 'pending' | 'overspent'>('all');
    const [reportSort, setReportSort] = useState<'category' | 'actual-desc' | 'actual-asc' | 'balance-desc'>('category');

    const adjustedAllocations = useMemo(() => {
        const allocations = CATEGORIES.map(c => ({ ...c }));
        if (weddingStyle === 'Destination') {
            const v = allocations.find(c => c.id === 'venue-main'); if (v) v.defaultPct += 3;
            const t = allocations.find(c => c.id === 'transport-baraat-car'); if (t) t.defaultPct += 2;
            const j = allocations.find(c => c.id === 'jewelry-bridal-gold'); if (j) j.defaultPct -= 3;
        } else if (weddingStyle === 'Intimate') {
            const f = allocations.find(c => c.id === 'food-wedding'); if (f) f.defaultPct -= 2;
            const p = allocations.find(c => c.id === 'photo-wedding'); if (p) p.defaultPct += 1;
        }
        let eb = totalBudget;
        if (savings.eInvites) eb *= 0.99;
        if (savings.offSeason) eb *= 0.90;
        if (savings.dayWedding) eb *= 0.95;
        if (savings.minimalDecor) eb *= 0.95;
        return allocations.map(c => ({ ...c, allocatedAmount: eb * (c.defaultPct / 100), originalAmount: totalBudget * (c.defaultPct / 100) }));
    }, [totalBudget, weddingStyle, savings]);

    const categoryTotals = useMemo(() => {
        const t: Record<string, { est: number; act: number; paid: number }> = {};
        CATEGORIES.forEach(c => (t[c.id] = { est: 0, act: 0, paid: 0 }));
        expenses.forEach(e => { if (t[e.categoryId]) { t[e.categoryId].est += e.estimatedCost; t[e.categoryId].act += e.actualCost; t[e.categoryId].paid += e.paid; } });
        return t;
    }, [expenses]);

    const totalActual = expenses.reduce((s, e) => s + e.actualCost, 0);
    const totalPaid = expenses.reduce((s, e) => s + e.paid, 0);
    const effectiveBudgetTarget = adjustedAllocations.reduce((s, c) => s + c.allocatedAmount, 0);

    const handleSave = () => {
        if (!formData.categoryId) return;
        if (editingId) { setExpenses(expenses.map(e => (e.id === editingId ? { ...e, ...(formData as Expense) } : e))); }
        else { setExpenses([...expenses, { ...(formData as Expense), id: Math.random().toString(36).substr(2, 9) }]); }
        setShowForm(false); setEditingId(null);
        setFormData({ categoryId: 'venue-main', item: '', estimatedCost: 0, actualCost: 0, paid: 0, vendor: '', notes: '' });
    };
    const handleEdit = (exp: Expense) => { setFormData(exp); setEditingId(exp.id); setShowForm(true); };
    const handleDelete = (id: string) => setExpenses(expenses.filter(e => e.id !== id));
    const toggleGroup = (g: string) => setExpandedGroups(p => { const n = new Set(p); if (n.has(g)) n.delete(g); else n.add(g); return n; });
    const resetForm = () => { setShowForm(false); setEditingId(null); setFormData({ categoryId: 'venue-main', item: '', estimatedCost: 0, actualCost: 0, paid: 0, vendor: '', notes: '' }); };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20); doc.text('Marriage Budget Reality Planner', 14, 22);
        doc.setFontSize(11);
        doc.text(`Total Target Budget: Rs. ${effectiveBudgetTarget.toLocaleString()}`, 14, 32);
        doc.text(`Total Actual Spent: Rs. ${totalActual.toLocaleString()}`, 14, 38);
        autoTable(doc, { startY: 45, head: [['Item', 'Category', 'Vendor', 'Estimated', 'Actual', 'Paid']], body: expenses.map(e => [e.item || '-', CATEGORIES.find(c => c.id === e.categoryId)?.label || 'Other', e.vendor || 'TBD', `Rs. ${e.estimatedCost.toLocaleString()}`, `Rs. ${e.actualCost.toLocaleString()}`, `Rs. ${e.paid.toLocaleString()}`]), theme: 'striped', styles: { fontSize: 9 }, headStyles: { fillColor: [236, 72, 153] } });
        doc.save('marriage-budget-planner.pdf');
    };

    const formatLakhs = (v: number) => { if (v >= 100000) return `\u20B9${(v / 100000).toFixed(2)}L`; if (v >= 1000) return `\u20B9${(v / 1000).toFixed(0)}K`; return `\u20B9${v}`; };

    const filteredCategories = useMemo(() => { if (!categorySearch) return CATEGORIES; const q = categorySearch.toLowerCase(); return CATEGORIES.filter(c => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q)); }, [categorySearch]);

    const reportExpenses = useMemo(() => {
        let f = [...expenses];
        if (reportFilterGroup !== 'all') { const ids = CATEGORIES.filter(c => c.group === reportFilterGroup).map(c => c.id); f = f.filter(e => ids.includes(e.categoryId)); }
        if (reportFilterStatus === 'paid') f = f.filter(e => e.paid >= e.actualCost && e.actualCost > 0);
        else if (reportFilterStatus === 'pending') f = f.filter(e => e.paid < e.actualCost);
        else if (reportFilterStatus === 'overspent') f = f.filter(e => { const a = adjustedAllocations.find(x => x.id === e.categoryId); return a ? e.actualCost > a.allocatedAmount : false; });
        if (reportSort === 'actual-desc') f.sort((a, b) => b.actualCost - a.actualCost);
        else if (reportSort === 'actual-asc') f.sort((a, b) => a.actualCost - b.actualCost);
        else if (reportSort === 'balance-desc') f.sort((a, b) => (b.actualCost - b.paid) - (a.actualCost - a.paid));
        return f;
    }, [expenses, reportFilterGroup, reportFilterStatus, reportSort, adjustedAllocations]);

    const groupAnalytics = useMemo(() => CATEGORY_GROUPS.map(group => {
        const ids = CATEGORIES.filter(c => c.group === group).map(c => c.id);
        const ge = expenses.filter(e => ids.includes(e.categoryId));
        const allocated = adjustedAllocations.filter(a => ids.includes(a.id)).reduce((s, a) => s + a.allocatedAmount, 0);
        const actual = ge.reduce((s, e) => s + e.actualCost, 0);
        const paid = ge.reduce((s, e) => s + e.paid, 0);
        return { group, allocated, actual, paid, count: ge.length, overspent: actual > allocated && allocated > 0 };
    }).filter(g => g.count > 0 || g.allocated > 0), [expenses, adjustedAllocations]);

    return (
        <>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3"><Heart className="text-pink-500" size={32} /> Marriage Budget Reality Planner</h1>
                    <p className="mt-2 text-slate-600">Track 100+ expense categories for your Indian wedding budget.</p>
                </div>
                <button onClick={generatePDF} className="flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"><Download size={18} /> Download PDF</button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button onClick={() => setActiveTab('planner')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'planner' ? 'bg-pink-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}><Settings size={14} className="inline mr-1.5 -mt-0.5" />Planner</button>
                <button onClick={() => setActiveTab('report')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'report' ? 'bg-pink-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}><BarChart3 size={14} className="inline mr-1.5 -mt-0.5" />Analytics & Report{expenses.length > 0 && <span className="ml-1.5 bg-white/20 px-1.5 py-0.5 rounded text-xs">{expenses.length}</span>}</button>
            </div>

            {activeTab === 'planner' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><Settings size={18} className="text-pink-500" /> Core Setup</h3>
                        <div className="space-y-4">
                            <div><label className="block text-sm font-medium text-slate-600 mb-1">Total Budget (Rs.)</label><input type="number" value={totalBudget} onChange={e => setTotalBudget(Number(e.target.value))} className="w-full px-3 py-2 border rounded-md text-slate-800 font-medium" /><p className="text-xs text-slate-400 mt-1">{formatLakhs(totalBudget)}</p></div>
                            <div><label className="block text-sm font-medium text-slate-600 mb-1">Expected Guests</label><input type="number" value={guestCount} onChange={e => setGuestCount(Number(e.target.value))} className="w-full px-3 py-2 border rounded-md" /></div>
                            <div><label className="block text-sm font-medium text-slate-600 mb-1">Wedding Style</label><select value={weddingStyle} onChange={e => setWeddingStyle(e.target.value)} className="w-full px-3 py-2 border rounded-md"><option value="Traditional">Big Traditional</option><option value="Destination">Destination</option><option value="Intimate">Intimate Boutique</option></select></div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl shadow-sm border border-pink-100 p-6">
                        <h3 className="text-sm font-semibold text-pink-800 mb-4 flex items-center gap-2"><Activity size={18} /> Smart Savings</h3>
                        <div className="space-y-3">
                            {([['eInvites','E-Invites Only','~1%'],['dayWedding','Day Wedding','~5%'],['offSeason','Off-Season Dates','~10%'],['minimalDecor','Minimal Decor','~5%']] as const).map(([k,t,d]) => (
                                <label key={k} className="flex items-start gap-3 p-2 bg-white/60 rounded-lg hover:bg-white cursor-pointer transition-colors">
                                    <input type="checkbox" checked={savings[k]} onChange={e => setSavings({...savings,[k]:e.target.checked})} className="mt-1 text-pink-500 rounded" />
                                    <div><p className="text-sm font-medium text-slate-800">{t}</p><p className="text-xs text-slate-500">Saves {d}</p></div>
                                </label>
                            ))}
                        </div>
                        {(savings.eInvites||savings.dayWedding||savings.offSeason||savings.minimalDecor)&&(<div className="mt-4 pt-4 border-t border-pink-200/50"><p className="text-xs font-semibold text-pink-700 uppercase tracking-wide">Effective Budget</p><p className="text-2xl font-bold text-pink-900">{formatLakhs(effectiveBudgetTarget)}</p><p className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><CheckCircle2 size={12}/>Saved {formatLakhs(totalBudget-effectiveBudgetTarget)}!</p></div>)}
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wide">Overall Tracker</h3>
                        <div className="space-y-4">
                            <div><div className="flex justify-between text-sm mb-1"><span className="text-slate-500">Total Spent</span><span className="font-semibold text-slate-800">{formatLakhs(totalActual)}</span></div><div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${totalActual>effectiveBudgetTarget?'bg-rose-500':'bg-emerald-500'}`} style={{width:`${Math.min(100,(totalActual/effectiveBudgetTarget)*100)}%`}}/></div><p className="text-xs mt-1 text-right text-slate-400">of {formatLakhs(effectiveBudgetTarget)}</p></div>
                            <div className="pt-2 border-t border-slate-100"><div className="flex justify-between text-sm mb-1"><span className="text-slate-500">Total Paid</span><span className="font-semibold text-blue-600">{formatLakhs(totalPaid)}</span></div><div className="flex justify-between text-sm"><span className="text-slate-500">Pending</span><span className="font-semibold text-amber-600">{formatLakhs(Math.max(0,totalActual-totalPaid))}</span></div></div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3 space-y-6">
                    <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input type="text" placeholder="Search categories..." value={categorySearch} onChange={e=>setCategorySearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"/>{categorySearch&&<button onClick={()=>setCategorySearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={14}/></button>}</div>

                    {CATEGORY_GROUPS.map(group => {
                        const gc = filteredCategories.filter(c => c.group === group);
                        if (!gc.length) return null;
                        const isExp = expandedGroups.has(group);
                        return (<div key={group}>
                            <button onClick={()=>toggleGroup(group)} className="flex items-center gap-2 w-full text-left mb-3">{isExp?<ChevronUp size={16} className="text-pink-500"/>:<ChevronDown size={16} className="text-slate-400"/>}<span className="text-sm font-bold text-slate-700 uppercase tracking-wider">{group}</span><span className="text-xs text-slate-400">({gc.length})</span></button>
                            {isExp&&<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mb-4">{gc.map(cat=>{const alloc=adjustedAllocations.find(a=>a.id===cat.id);const stats=categoryTotals[cat.id]||{est:0,act:0,paid:0};const aa=alloc?.allocatedAmount||0;const ov=stats.act>aa&&aa>0;return(<div key={cat.id} className={`bg-white rounded-xl shadow-sm border p-3 transition-all hover:shadow-md ${ov?'border-rose-200':'border-slate-200'}`}><div className="flex justify-between items-start mb-1"><h4 className="font-semibold text-xs text-slate-800 max-w-[75%] leading-tight">{cat.label}</h4>{cat.defaultPct>0&&<span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded">{cat.defaultPct}%</span>}</div><div className="space-y-0.5 mb-2"><p className="text-[10px] text-slate-500 flex justify-between"><span>Target:</span><span className="font-medium text-slate-700">{formatLakhs(aa)}</span></p><p className="text-[10px] text-slate-500 flex justify-between"><span>Actual:</span><span className={`font-semibold ${ov?'text-rose-600':'text-emerald-600'}`}>{formatLakhs(stats.act)}</span></p></div>{aa>0&&<div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden mb-2"><div className={`h-full ${ov?'bg-rose-500':'bg-pink-400'}`} style={{width:`${Math.min(100,(stats.act/aa)*100)}%`}}/></div>}<button onClick={()=>{setFormData({...formData,categoryId:cat.id});setEditingId(null);setShowForm(true);}} className="w-full py-1 border border-dashed border-slate-300 rounded text-[10px] text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors flex items-center justify-center gap-1"><Plus size={12}/>Add</button></div>);})}</div>}
                        </div>);
                    })}

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50"><h3 className="font-bold text-slate-800">Line Item Tracker ({expenses.length})</h3><button onClick={()=>{setEditingId(null);setFormData({categoryId:'venue-main',item:'',estimatedCost:0,actualCost:0,paid:0,vendor:'',notes:''});setShowForm(true);}} className="text-sm font-semibold text-pink-600 hover:text-pink-700 flex items-center gap-1"><Plus size={16}/>New Entry</button></div>
                        <div className="overflow-x-auto">{expenses.length===0?(<div className="py-12 text-center text-slate-500">No expenses added yet.</div>):(<table className="w-full text-left text-sm whitespace-nowrap"><thead className="bg-slate-50 text-slate-500 font-semibold border-b"><tr><th className="px-6 py-3">Item / Category</th><th className="px-6 py-3">Vendor</th><th className="px-6 py-3 text-right">Actual</th><th className="px-6 py-3 text-right">Paid</th><th className="px-6 py-3 text-right">Balance</th><th className="px-6 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{expenses.map(exp=>{const cat=CATEGORIES.find(c=>c.id===exp.categoryId);const bal=exp.actualCost-exp.paid;return(<tr key={exp.id} className="hover:bg-slate-50/50"><td className="px-6 py-3"><p className="font-medium text-slate-800">{exp.item||cat?.label||'-'}</p><p className="text-xs text-slate-500">{cat?.label}</p></td><td className="px-6 py-3 text-slate-600">{exp.vendor||'-'}</td><td className="px-6 py-3 text-right font-medium">Rs. {exp.actualCost.toLocaleString()}</td><td className="px-6 py-3 text-right text-emerald-600">Rs. {exp.paid.toLocaleString()}</td><td className="px-6 py-3 text-right text-amber-600">Rs. {bal.toLocaleString()}</td><td className="px-6 py-3 text-right"><button onClick={()=>handleEdit(exp)} className="p-1 text-slate-400 hover:text-pink-500 mx-1"><Edit2 size={16}/></button><button onClick={()=>handleDelete(exp.id)} className="p-1 text-slate-400 hover:text-rose-500 mx-1"><Trash2 size={16}/></button></td></tr>);})}</tbody></table>)}</div>
                    </div>
                </div>
            </div>
            )}

            {activeTab === 'report' && (
            <div className="space-y-6">
                {expenses.length===0?(<div className="bg-white rounded-2xl border border-slate-200 p-12 text-center"><BarChart3 size={48} className="mx-auto text-slate-300 mb-4"/><h3 className="text-lg font-semibold text-slate-700 mb-2">No Data Yet</h3><p className="text-slate-500 text-sm">Add expenses in the Planner tab first.</p><button onClick={()=>setActiveTab('planner')} className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600 transition-colors">Go to Planner</button></div>):(
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[{l:'Total Budget',v:formatLakhs(effectiveBudgetTarget),c:'text-slate-800',bg:'bg-slate-50',b:'border-slate-200'},{l:'Total Spent',v:formatLakhs(totalActual),c:totalActual>effectiveBudgetTarget?'text-rose-600':'text-emerald-600',bg:totalActual>effectiveBudgetTarget?'bg-rose-50':'bg-emerald-50',b:totalActual>effectiveBudgetTarget?'border-rose-200':'border-emerald-200'},{l:'Total Paid',v:formatLakhs(totalPaid),c:'text-blue-600',bg:'bg-blue-50',b:'border-blue-200'},{l:'Pending',v:formatLakhs(Math.max(0,totalActual-totalPaid)),c:'text-amber-600',bg:'bg-amber-50',b:'border-amber-200'}].map((s,i)=>(<div key={i} className={`${s.bg} border ${s.b} rounded-xl p-4`}><p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{s.l}</p><p className={`text-xl font-bold ${s.c}`}>{s.v}</p></div>))}
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <h3 className="font-bold text-slate-800 mb-1">Budget Utilization</h3>
                        <p className="text-xs text-slate-500 mb-4">How much of your budget has been used</p>
                        <div className="relative h-6 bg-slate-100 rounded-full overflow-hidden">
                            <div className="absolute inset-y-0 left-0 bg-amber-400/60 rounded-full" style={{width:`${Math.min(100,(totalActual/effectiveBudgetTarget)*100)}%`}}/>
                            <div className="absolute inset-y-0 left-0 bg-emerald-500 rounded-full" style={{width:`${Math.min(100,(totalPaid/effectiveBudgetTarget)*100)}%`}}/>
                        </div>
                        <div className="flex gap-6 mt-3 text-xs text-slate-600">
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block"/>Paid ({((totalPaid/effectiveBudgetTarget)*100).toFixed(1)}%)</span>
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-amber-400 rounded-full inline-block"/>Committed ({((totalActual/effectiveBudgetTarget)*100).toFixed(1)}%)</span>
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-slate-200 rounded-full inline-block"/>Remaining ({(Math.max(0,100-(totalActual/effectiveBudgetTarget)*100)).toFixed(1)}%)</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><PieChart size={18} className="text-pink-500"/>Category Group Breakdown</h3>
                        <div className="space-y-3">{groupAnalytics.filter(g=>g.actual>0||g.allocated>0).map(g=>(<div key={g.group} className={`p-3 rounded-lg border ${g.overspent?'border-rose-200 bg-rose-50/50':'border-slate-100 bg-slate-50/50'}`}><div className="flex items-center justify-between mb-1"><span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">{g.overspent&&<AlertTriangle size={13} className="text-rose-500"/>}{g.group}</span><span className="text-xs text-slate-500">{g.count} items</span></div><div className="grid grid-cols-4 gap-2 text-xs mt-2"><div><p className="text-slate-400 font-medium">Allocated</p><p className="font-bold text-slate-700">{formatLakhs(g.allocated)}</p></div><div><p className="text-slate-400 font-medium">Actual</p><p className={`font-bold ${g.overspent?'text-rose-600':'text-slate-700'}`}>{formatLakhs(g.actual)}</p></div><div><p className="text-slate-400 font-medium">Paid</p><p className="font-bold text-emerald-600">{formatLakhs(g.paid)}</p></div><div><p className="text-slate-400 font-medium">Pending</p><p className="font-bold text-amber-600">{formatLakhs(Math.max(0,g.actual-g.paid))}</p></div></div><div className="h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden"><div className={`h-full rounded-full ${g.overspent?'bg-rose-500':'bg-pink-500'}`} style={{width:`${g.allocated>0?Math.min(100,(g.actual/g.allocated)*100):0}%`}}/></div></div>))}</div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50"><div className="flex flex-col md:flex-row md:items-center justify-between gap-3"><h3 className="font-bold text-slate-800 flex items-center gap-2"><Filter size={16} className="text-pink-500"/>Detailed Report</h3><div className="flex flex-wrap gap-2"><select value={reportFilterGroup} onChange={e=>setReportFilterGroup(e.target.value)} className="px-3 py-1.5 border rounded-lg text-xs font-medium text-slate-600"><option value="all">All Groups</option>{CATEGORY_GROUPS.map(g=><option key={g} value={g}>{g}</option>)}</select><select value={reportFilterStatus} onChange={e=>setReportFilterStatus(e.target.value as any)} className="px-3 py-1.5 border rounded-lg text-xs font-medium text-slate-600"><option value="all">All Status</option><option value="paid">Fully Paid</option><option value="pending">Pending</option><option value="overspent">Over Budget</option></select><select value={reportSort} onChange={e=>setReportSort(e.target.value as any)} className="px-3 py-1.5 border rounded-lg text-xs font-medium text-slate-600"><option value="category">Sort: Category</option><option value="actual-desc">Cost High-Low</option><option value="actual-asc">Cost Low-High</option><option value="balance-desc">Balance High-Low</option></select></div></div></div>
                        {reportExpenses.length===0?(<div className="py-8 text-center text-slate-500 text-sm">No expenses match filters.</div>):(<div className="overflow-x-auto"><table className="w-full text-left text-sm whitespace-nowrap"><thead className="bg-slate-50/50 text-slate-500 font-semibold border-b text-xs uppercase tracking-wider"><tr><th className="px-6 py-3">Item</th><th className="px-6 py-3">Category</th><th className="px-6 py-3">Vendor</th><th className="px-6 py-3 text-right">Est.</th><th className="px-6 py-3 text-right">Actual</th><th className="px-6 py-3 text-right">Paid</th><th className="px-6 py-3 text-right">Balance</th><th className="px-6 py-3 text-center">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{reportExpenses.map(exp=>{const cat=CATEGORIES.find(c=>c.id===exp.categoryId);const bal=exp.actualCost-exp.paid;const isPaid=exp.paid>=exp.actualCost&&exp.actualCost>0;const alloc=adjustedAllocations.find(a=>a.id===exp.categoryId);const isOver=alloc?exp.actualCost>alloc.allocatedAmount:false;return(<tr key={exp.id} className="hover:bg-slate-50/50 text-sm"><td className="px-6 py-3 font-medium text-slate-800">{exp.item||'-'}</td><td className="px-6 py-3 text-slate-600 text-xs">{cat?.label}</td><td className="px-6 py-3 text-slate-600">{exp.vendor||'-'}</td><td className="px-6 py-3 text-right text-slate-500">{'\u20B9'}{exp.estimatedCost.toLocaleString()}</td><td className="px-6 py-3 text-right font-semibold text-slate-800">{'\u20B9'}{exp.actualCost.toLocaleString()}</td><td className="px-6 py-3 text-right text-emerald-600">{'\u20B9'}{exp.paid.toLocaleString()}</td><td className="px-6 py-3 text-right text-amber-600 font-medium">{'\u20B9'}{bal.toLocaleString()}</td><td className="px-6 py-3 text-center">{isPaid?<span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full"><CheckCircle2 size={10}/>Paid</span>:isOver?<span className="inline-flex items-center gap-1 bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full"><AlertTriangle size={10}/>Over</span>:<span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full"><TrendingUp size={10}/>Pending</span>}</td></tr>);})}</tbody><tfoot className="bg-slate-50 border-t-2 border-slate-200"><tr className="font-bold text-sm"><td className="px-6 py-3" colSpan={3}>TOTALS ({reportExpenses.length} items)</td><td className="px-6 py-3 text-right text-slate-600">{'\u20B9'}{reportExpenses.reduce((s,e)=>s+e.estimatedCost,0).toLocaleString()}</td><td className="px-6 py-3 text-right text-slate-800">{'\u20B9'}{reportExpenses.reduce((s,e)=>s+e.actualCost,0).toLocaleString()}</td><td className="px-6 py-3 text-right text-emerald-600">{'\u20B9'}{reportExpenses.reduce((s,e)=>s+e.paid,0).toLocaleString()}</td><td className="px-6 py-3 text-right text-amber-600">{'\u20B9'}{reportExpenses.reduce((s,e)=>s+(e.actualCost-e.paid),0).toLocaleString()}</td><td/></tr></tfoot></table></div>)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-100 p-5"><h4 className="text-xs font-bold text-pink-700 uppercase tracking-wider mb-2">Top 3 Costliest</h4><div className="space-y-2">{[...expenses].sort((a,b)=>b.actualCost-a.actualCost).slice(0,3).map((e,i)=>(<div key={e.id} className="flex justify-between text-sm"><span className="text-slate-700 truncate max-w-[60%]">{i+1}. {e.item||CATEGORIES.find(c=>c.id===e.categoryId)?.label}</span><span className="font-bold text-pink-700">{formatLakhs(e.actualCost)}</span></div>))}</div></div>
                        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-100 p-5"><h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">Largest Pending</h4><div className="space-y-2">{[...expenses].filter(e=>e.actualCost>e.paid).sort((a,b)=>(b.actualCost-b.paid)-(a.actualCost-a.paid)).slice(0,3).map((e,i)=>(<div key={e.id} className="flex justify-between text-sm"><span className="text-slate-700 truncate max-w-[60%]">{i+1}. {e.item||CATEGORIES.find(c=>c.id===e.categoryId)?.label}</span><span className="font-bold text-amber-700">{formatLakhs(e.actualCost-e.paid)}</span></div>))}{expenses.filter(e=>e.actualCost>e.paid).length===0&&<p className="text-xs text-slate-500">All paid up!</p>}</div></div>
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100 p-5"><h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Budget Health</h4><div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-slate-600">Budget Used</span><span className="font-bold text-slate-800">{((totalActual/effectiveBudgetTarget)*100).toFixed(1)}%</span></div><div className="flex justify-between"><span className="text-slate-600">Payment Progress</span><span className="font-bold text-emerald-700">{totalActual>0?((totalPaid/totalActual)*100).toFixed(1):0}%</span></div><div className="flex justify-between"><span className="text-slate-600">Entries</span><span className="font-bold text-slate-800">{expenses.length}</span></div><div className="flex justify-between"><span className="text-slate-600">Avg/Entry</span><span className="font-bold text-slate-800">{expenses.length>0?formatLakhs(Math.round(totalActual/expenses.length)):'\u20B90'}</span></div></div></div>
                    </div>
                </>
                )}
            </div>
            )}
        </div>

        {showForm&&(<div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]" onClick={resetForm}><div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden" onClick={e=>e.stopPropagation()}>
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-4 flex items-center justify-between text-white"><h3 className="font-bold text-lg">{editingId?'Edit Expense':'Add New Expense'}</h3><button onClick={resetForm} className="text-white hover:text-white/80 font-bold text-xl">{'\u2715'}</button></div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div><label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Category</label><select value={formData.categoryId} onChange={e=>setFormData({...formData,categoryId:e.target.value})} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500">{CATEGORY_GROUPS.map(g=>(<optgroup key={g} label={g}>{CATEGORIES.filter(c=>c.group===g).map(c=>(<option key={c.id} value={c.id}>{c.label}</option>))}</optgroup>))}</select></div>
                <div><label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Item Description (Optional)</label><input type="text" placeholder="E.g. Main Hall Rent" value={formData.item} onChange={e=>setFormData({...formData,item:e.target.value})} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"/></div>
                <div><label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Vendor (Optional)</label><input type="text" placeholder="E.g. ITC Grand" value={formData.vendor} onChange={e=>setFormData({...formData,vendor:e.target.value})} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"/></div>
                <div className="grid grid-cols-3 gap-3"><div><label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Est. Cost</label><input type="number" value={formData.estimatedCost||''} onChange={e=>setFormData({...formData,estimatedCost:Number(e.target.value)})} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"/></div><div><label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Actual Cost</label><input type="number" value={formData.actualCost||''} onChange={e=>setFormData({...formData,actualCost:Number(e.target.value)})} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"/></div><div><label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Paid (Adv.)</label><input type="number" value={formData.paid||''} onChange={e=>setFormData({...formData,paid:Number(e.target.value)})} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"/></div></div>
            </div>
            <div className="bg-slate-50 px-6 py-4 flex gap-3 border-t border-slate-100 justify-end"><button onClick={resetForm} className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors">Cancel</button><button onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">Save Entry</button></div>
        </div></div>)}
        </>
    );
};
