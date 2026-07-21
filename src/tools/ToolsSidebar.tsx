import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import {
    ChevronDown, Search, X, PanelLeftClose, PanelLeft,
    Image, FileDown, Minimize2, Merge, FileImage, FileText, ScanText,
    Scissors, ArrowUpDown, Code2, Crop, Trash2,
    Receipt, TrendingUp, DollarSign, Percent, PiggyBank, Flame,
    Building2, FileSpreadsheet, FileBarChart, CreditCard, Landmark, Calendar,
    BarChart3, ClipboardList, FileOutput, BookOpen, FileSearch, FileScan,
    Wrench, Briefcase, Coins, WalletCards, Gauge,
    Lock, ShieldCheck, Mail, Send, MailCheck,
    Factory, Cog, Package, Tag, ArrowUpRight, ArrowRightLeft,
    RefreshCw, Clock, Target, ArrowDownRight, ArrowDownUp,
    Scale, RotateCcw, Banknote, Award, Wallet,
    HardHat, FileSignature, Layers, Zap, ShoppingCart, AlertTriangle,
    FileCheck, CalendarDays, Home, ListChecks,
    Truck, Fuel,
    Hammer, Ruler, KeyRound, CalendarMinus,
    Activity, Shield, GitCompare, UserCheck,
    Heart, CalendarCheck, GraduationCap, Armchair, PieChart,
    ClipboardCheck,
    Gift, Users,
    Braces, CheckCircle2, ArrowLeftRight, FileCode2, MousePointer, Layers3,
    Copy, Binary, Link, Database, Table2, Type, Timer,
    Hash, ShieldAlert, Fingerprint, Shuffle, Globe, Palette, Terminal, Compass, Calculator, Apple,
    MapPin, Map, Building, Car, Regex
} from 'lucide-react';
import { useCustomTools } from '@/hooks/useCustomTools';
import { useFavouriteTools } from '@/hooks/useFavouriteTools';
import { Star } from 'lucide-react';

export interface MenuItem { id: string; label: string; icon: React.FC<{ size?: number; className?: string }>; }
export interface MenuSection {
    id: string; label: string;
    icon: React.FC<{ size?: number; className?: string }>;
    items: MenuItem[];
}

export const MENU_SECTIONS: MenuSection[] = [
    {
        id: 'home', label: 'Home', icon: Home, items: [],
    },
    {
        id: 'convertors', label: 'Convertors', icon: Wrench,
        items: [
            { id: 'image-to-pdf', label: 'Image to PDF', icon: Image },
            { id: 'compress-pdf', label: 'Compress PDF', icon: FileDown },
            { id: 'edit-pdf', label: 'Edit PDF', icon: FileSignature },
            { id: 'compress-image', label: 'Compress Image', icon: Minimize2 },
            { id: 'merge-pdf', label: 'Merge PDF', icon: Merge },
            { id: 'pdf-to-image', label: 'PDF to Image', icon: FileImage },
            { id: 'word-to-pdf', label: 'Word to PDF', icon: FileText },
            { id: 'image-to-text', label: 'Image to Text', icon: ScanText },
            { id: 'split-pdf', label: 'Split PDF', icon: Scissors },
            { id: 'organize-pdf', label: 'Organize PDF', icon: ArrowUpDown },
            { id: 'html-to-pdf', label: 'HTML to PDF', icon: Code2 },
            { id: 'crop-pdf', label: 'Crop PDF', icon: Crop },
            { id: 'delete-pdf-pages', label: 'Delete PDF Pages', icon: Trash2 },
        ],
    },
    {
        id: 'business-tax', label: 'Business & Tax', icon: Building2,
        items: [
            { id: 'profit-loss-calculator', label: 'Profit & Loss', icon: TrendingUp },
            { id: 'roi-calculator', label: 'ROI Calculator', icon: BarChart3 },
            { id: 'break-even-calculator', label: 'Break-Even', icon: TrendingUp },
            { id: 'income-tax-estimator', label: 'Income Tax Estimator', icon: FileSpreadsheet },
            { id: 'old-regime-tax', label: 'Old Regime Tax', icon: FileSpreadsheet },
            { id: 'new-regime-tax', label: 'New Regime Tax', icon: FileSpreadsheet },
            { id: 'tax-compare', label: 'Tax Compare', icon: BarChart3 },
            { id: 'gst-vat-calculator', label: 'GST / VAT', icon: Receipt },
            { id: 'tds-calculator', label: 'TDS Calculator', icon: Receipt },
            { id: 'business-valuation', label: 'Business Valuation', icon: Building2 },
        ],
    },
    {
        id: 'loans-emi', label: 'Loans & EMI', icon: WalletCards,
        items: [
            { id: 'loan-calculator', label: 'Loan Calculator', icon: Landmark },
            { id: 'emi-calculator', label: 'EMI Calculator', icon: CreditCard },
            { id: 'loan-compare', label: 'Loan Compare Calculator', icon: GitCompare },
            { id: 'dti-calculator', label: 'DTI Calculator', icon: Percent },
            { id: 'ltv-calculator', label: 'LTV Calculator', icon: Landmark },
            { id: 'standard-calculator', label: 'Standard Calculator', icon: Calculator },
        ],
    },
    {
        id: 'investments', label: 'Investments', icon: Coins,
        items: [
            { id: 'fd-calculator', label: 'FD Calculator', icon: PiggyBank },
            { id: 'rd-calculator', label: 'RD Calculator', icon: PiggyBank },
            { id: 'sip-calculator', label: 'SIP Calculator', icon: TrendingUp },
        ],
    },
    {
        id: 'utilities', label: 'Utilities', icon: Gauge,
        items: [
            { id: 'unit-converter', label: 'Universal Unit Converter', icon: Calculator },
            { id: 'currency-calculator', label: 'Currency', icon: DollarSign },
            { id: 'percentage-calculator', label: 'Percentage', icon: Percent },
            { id: 'value-of-percentage', label: 'Value of %', icon: Percent },
            { id: 'dob-calculator', label: 'DOB Calculator', icon: Calendar },
            { id: 'find-day-calculator', label: 'Find Day', icon: Search },
            { id: 'startup-name-checker', label: 'Startup Name Checker', icon: Search },
            { id: 'festival-gift-planner', label: 'Festival Gift Planner', icon: Gift },
            { id: 'rent-vs-buy-calculator', label: 'Rent vs Buy Calculator', icon: Home },
            { id: 'marriage-budget-planner', label: 'Marriage Budget Planner', icon: Heart },
            { id: 'subscription-optimizer', label: 'Subscription Optimizer', icon: Wallet },
            { id: 'decision-matrix', label: 'Weighted Decision Matrix', icon: Scale },
            { id: 'time-boxer', label: 'Time-Boxer Planner', icon: Clock },
            { id: 'fire-calculator', label: 'FIRE Calculator', icon: Flame },
            { id: 'fitness-nutrition-planner', label: 'BMI & Nutrition Planner', icon: Apple },
        ],
    },
    {
        id: 'govt-scheme-finder', label: 'Govt Scheme Finder', icon: Landmark, items: [],
    },

    {
        id: 'dev-toolkit', label: 'Developer Toolkit', icon: Terminal,
        items: [
            { id: 'dev-json-formatter', label: 'JSON Formatter', icon: Braces },
            { id: 'dev-json-minifier', label: 'JSON Minifier', icon: Minimize2 },
            { id: 'dev-json-validator', label: 'JSON Validator', icon: CheckCircle2 },
            { id: 'dev-json-comparator', label: 'JSON Comparator', icon: ArrowLeftRight },
            { id: 'dev-json-to-csv', label: 'JSON to CSV', icon: FileDown },
            { id: 'dev-json-to-xml', label: 'JSON to XML', icon: FileCode2 },
            { id: 'dev-json-path', label: 'JSON Path Finder', icon: MousePointer },
            { id: 'dev-json-flattener', label: 'JSON Flattener', icon: Layers3 },
            { id: 'dev-text-diff', label: 'Text Diff Checker', icon: FileText },
            { id: 'dev-code-diff', label: 'Code Diff', icon: Code2 },
            { id: 'dev-file-compare', label: 'File Comparator', icon: FileImage },
            { id: 'dev-duplicate-finder', label: 'Duplicate Finder', icon: Copy },
            { id: 'dev-word-frequency', label: 'Word Frequency', icon: BarChart3 },
            { id: 'dev-base64', label: 'Base64 Encode/Decode', icon: Binary },
            { id: 'dev-jwt-decoder', label: 'JWT Decoder', icon: KeyRound },
            { id: 'dev-url-encoder', label: 'URL Encoder/Decoder', icon: Link },
            { id: 'dev-image-base64', label: 'Image to Base64', icon: Image },
            { id: 'dev-sql-formatter', label: 'SQL Formatter', icon: Database },
            { id: 'dev-csv-to-json', label: 'CSV to JSON', icon: Table2 },
            { id: 'dev-string-case', label: 'String Case Convert', icon: Type },
            { id: 'dev-unix-timestamp', label: 'Unix Timestamp', icon: Timer },
            { id: 'dev-hash-generator', label: 'Hash Generator', icon: Hash },
            { id: 'dev-password-checker', label: 'Password Checker', icon: ShieldAlert },
            { id: 'dev-uuid-generator', label: 'UUID Generator', icon: Fingerprint },
            { id: 'dev-token-generator', label: 'Token Generator', icon: Shuffle },
            { id: 'dev-ssl-checker', label: 'SSL Cert Checker', icon: Globe },
            { id: 'dev-color-converter', label: 'Color Converter', icon: Palette },
            { id: 'dev-regex-tester', label: 'Regex Tester', icon: Regex },
            { id: 'dev-cron-builder', label: 'Cron Builder', icon: Clock },
            { id: 'dev-code-checker', label: 'Code Syntax Checker', icon: CheckCircle2 },
        ]
    },
    {
        id: 'invitation-creator', label: 'Invitation Creator', icon: Heart, items: [],
    },
    {
        id: 'event-page-creator', label: 'Event Landing Page', icon: Globe, items: [],
    },
    {
        id: 'logo-creator', label: 'Logo Creator', icon: Palette, items: [],
    },
    {
        id: 'raw-data', label: 'Raw Data', icon: Database,
        items: [
            { id: 'indian-states-cities', label: 'Indian States', icon: Database },
            { id: 'indian-cities', label: 'Indian Cities', icon: Building2 },
            { id: 'indian-colleges', label: 'Indian Colleges', icon: GraduationCap },
            { id: 'indian-pin-codes', label: 'PIN Codes', icon: MapPin },
            { id: 'indian-districts', label: 'Districts', icon: Map },
            { id: 'indian-parliament', label: 'Parliament', icon: Landmark },
            { id: 'indian-holidays', label: 'Holidays', icon: Calendar },
            { id: 'indian-banks', label: 'Banks & IFSC', icon: Building },
            { id: 'gst-state-codes', label: 'GST Codes', icon: Receipt },
            { id: 'india-tax-slabs', label: 'Tax Slabs', icon: Scale },
            { id: 'indian-stock-market', label: 'Stock Market', icon: TrendingUp },
            { id: 'indian-cars', label: 'Indian Cars Prices', icon: Car },
            { id: 'tds-rate-chart', label: 'TDS Rate Chart', icon: Receipt },
            { id: 'professional-tax', label: 'Professional Tax', icon: Landmark },
            { id: 'minimum-wages', label: 'Minimum Wages', icon: Briefcase },
            { id: 'depreciation-rates', label: 'Depreciation Rates', icon: ArrowDownRight },
            { id: 'rbi-rates-history', label: 'RBI Rates History', icon: TrendingUp },
            { id: 'gst-rate-finder', label: 'GST Rate Finder', icon: Receipt },
            { id: 'section-80-deductions', label: 'Section 80 Deductions', icon: BookOpen },
            { id: 'cost-inflation-index', label: 'Cost Inflation Index', icon: TrendingUp },
            { id: 'itr-forms-guide', label: 'ITR Forms Guide', icon: FileText },
            { id: 'compliance-due-dates', label: 'Compliance Calendar', icon: CalendarDays },
            { id: 'interest-penalty-rates', label: 'Interest & Penalties', icon: AlertTriangle },
            { id: 'audit-threshold-limits', label: 'Audit Limits', icon: ClipboardCheck },
            { id: 'epf-interest-rates', label: 'EPF Interest Rates', icon: Landmark },
            { id: 'hr-leave-rules', label: 'Leave Entitlement', icon: CalendarDays },
            { id: 'gratuity-rules', label: 'Gratuity Rules', icon: Award },
            { id: 'bank-fd-rates', label: 'Bank FD Rates', icon: Building },
            { id: 'statutory-due-dates', label: 'Statutory Due Dates', icon: Clock },
        ]
    },
    {
        id: 'get-img-video', label: 'Get Img/Video', icon: Image,
        items: [
            { id: 'image-downloader', label: 'Image Downloader', icon: FileImage },
            { id: 'video-downloader', label: 'Video Downloader', icon: FileDown },
        ]
    },
    {
        id: 'products', label: 'Products', icon: ShoppingCart, items: [],
    },
];

/* ── Per-section icon colors (bg + text) ── */
const SECTION_COLORS: Record<string, { bg: string; text: string }> = {
    'home':                   { bg: 'bg-indigo-50',  text: 'text-indigo-600' },
    'get-img-video':          { bg: 'bg-pink-50',    text: 'text-pink-600' },
    'products':               { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    'convertors':             { bg: 'bg-blue-50',    text: 'text-blue-600' },
    'business-tax':           { bg: 'bg-amber-50',   text: 'text-amber-600' },
    'loans-emi':              { bg: 'bg-cyan-50',    text: 'text-cyan-600' },
    'investments':            { bg: 'bg-indigo-50',  text: 'text-indigo-600' },
    'utilities':              { bg: 'bg-slate-100',  text: 'text-slate-600' },
    'govt-scheme-finder':     { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    'hr-compliance':          { bg: 'bg-violet-50',  text: 'text-violet-500' },
    'dev-toolkit':            { bg: 'bg-cyan-50',    text: 'text-cyan-600' },
    'invitation-creator':     { bg: 'bg-pink-50',    text: 'text-pink-500' },
    'event-page-creator':     { bg: 'bg-purple-50',  text: 'text-purple-500' },
    'logo-creator':           { bg: 'bg-fuchsia-50', text: 'text-fuchsia-500' },
    'life-decision-simulator':{ bg: 'bg-rose-50',    text: 'text-rose-500' },
    'financial-profiler':     { bg: 'bg-teal-50',    text: 'text-teal-500' },
    'compliance-engine':      { bg: 'bg-red-50',     text: 'text-red-500' },
    'biziq':                  { bg: 'bg-green-50',   text: 'text-green-600' },
    'receivables-payables':   { bg: 'bg-sky-50',     text: 'text-sky-500' },
    'sales-revenue':          { bg: 'bg-emerald-50', text: 'text-emerald-500' },
    'seo-analyser':           { bg: 'bg-lime-50',    text: 'text-lime-600' },
    'raw-data':               { bg: 'bg-slate-100',  text: 'text-slate-500' },
    'trading-tools-suite':    { bg: 'bg-violet-50',  text: 'text-violet-600' },
    'ceo-dashboard':          { bg: 'bg-indigo-50',  text: 'text-indigo-600' },
};



interface ToolsSidebarProps {
    activeTool: string | null;
    activeSection: string;
    onSelectTool: (tool: string) => void;
    onSelectSection: (section: string) => void;
    isSubscribed: boolean;
    /** Mobile: whether the sidebar panel is visible */
    isOpen: boolean;
    /** Mobile: called when user closes the sidebar */
    onClose: () => void;
    /** Optional: only show sections whose IDs are in this list (domain filtering) */
    domainFilter?: string[];
}

const SIDEBAR_DEFAULT_W = 256;
const SIDEBAR_MIN_W = 56;
const SIDEBAR_MAX_W = 400;
const COLLAPSE_THRESHOLD = 120;
const EXPAND_THRESHOLD = 180;

export const ToolsSidebar: React.FC<ToolsSidebarProps> = ({
    activeTool, activeSection, onSelectTool, onSelectSection, isSubscribed, isOpen, onClose, domainFilter,
}) => {
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [collapsed, setCollapsed] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_W);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const startW = useRef(SIDEBAR_DEFAULT_W);

    const { hiddenIds } = useCustomTools();
    const { favouriteIds } = useFavouriteTools();

    // Resolve favourite tool metadata
    const favouriteTools = useMemo(() => {
        if (favouriteIds.length === 0) return [];
        const allItems = MENU_SECTIONS.flatMap(s =>
            s.items.length > 0
                ? s.items.map(item => ({ ...item, sectionId: s.id }))
                : [{ id: s.id, label: s.label, icon: s.icon, sectionId: s.id }]
        );
        return favouriteIds
            .map(id => allItems.find(item => item.id === id))
            .filter(Boolean) as { id: string; label: string; icon: React.FC<any>; sectionId: string }[];
    }, [favouriteIds]);


    // ── Auto-expand & scroll to the active tool's parent section ──
    useEffect(() => {
        if (!activeTool && !activeSection) return;

        // Find the section that contains the active tool
        const parentSection = MENU_SECTIONS.find(section => {
            // If this section IS the active tool (standalone sections with no items)
            if (section.id === activeTool && section.items.length === 0) return true;
            // If this section contains the active tool as a sub-item
            return section.items.some(item => item.id === activeTool);
        });

        if (parentSection) {
            // Auto-expand this section in the sidebar
            setExpandedSections(prev => {
                if (prev.has(parentSection.id)) return prev;
                return new Set([parentSection.id]);
            });
        } else if (activeSection) {
            // Fallback: expand the activeSection if we can find it
            const section = MENU_SECTIONS.find(s => s.id === activeSection);
            if (section && section.items.length > 0) {
                setExpandedSections(prev => {
                    if (prev.has(activeSection)) return prev;
                    return new Set([activeSection]);
                });
            }
        }
    }, [activeTool, activeSection]);

    // ── Auto-scroll to the active item after DOM updates ──
    useEffect(() => {
        if (!activeTool && !activeSection) return;
        // Use a small delay to let the expanded section render
        const timer = setTimeout(() => {
            const activeId = activeTool || activeSection;
            if (!activeId) return;
            const el = document.querySelector(`[data-sidebar-id="${activeId}"]`) as HTMLElement;
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 80);
        return () => clearTimeout(timer);
    }, [activeTool, activeSection, expandedSections]);

    /* ── Drag to resize ── */
    const onDragStart = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        isDragging.current = true;
        startX.current = e.clientX;
        startW.current = collapsed ? SIDEBAR_MIN_W : sidebarWidth;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    }, [collapsed, sidebarWidth]);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (!isDragging.current) return;
            const delta = e.clientX - startX.current;
            const newW = Math.max(SIDEBAR_MIN_W, Math.min(SIDEBAR_MAX_W, startW.current + delta));
            if (newW <= COLLAPSE_THRESHOLD) {
                setCollapsed(true);
                setSidebarWidth(SIDEBAR_DEFAULT_W); // Reset width for next expand
            } else {
                if (newW >= EXPAND_THRESHOLD) setCollapsed(false);
                setSidebarWidth(newW);
            }
        };
        const onUp = () => {
            if (isDragging.current) {
                isDragging.current = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            }
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    }, []);

    const toggleCollapse = () => setCollapsed(c => !c);

    const filteredSections = useMemo(() => {
        let sections = MENU_SECTIONS;
        // Domain filtering: only show sections belonging to the selected domain
        if (domainFilter && domainFilter.length > 0) {
            sections = sections.filter(s => domainFilter.includes(s.id));
        }
        // Custom tools visibility filtering
        if (hiddenIds.length > 0) {
            sections = sections.map(section => {
                if (hiddenIds.includes(section.id)) return null;
                const filteredItems = section.items.filter(item => !hiddenIds.includes(item.id));
                return { ...section, items: filteredItems };
            }).filter(Boolean) as MenuSection[];
        }
        return sections;
    }, [hiddenIds, domainFilter]);

    const allItems = useMemo(() => {
        return filteredSections.flatMap(section =>
            section.items.length > 0
                ? section.items.map(item => ({ ...item, sectionId: section.id }))
                : [{ id: section.id, label: section.label, icon: section.icon, sectionId: section.id }]
        );
    }, [filteredSections]);

    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return [];
        const q = searchQuery.toLowerCase();
        return allItems.filter(item => item.label.toLowerCase().includes(q));
    }, [searchQuery, allItems]);

    const handleSectionClick = (section: MenuSection) => {
        if (collapsed) {
            setCollapsed(false);
            setExpandedSections(new Set([section.id]));
            onSelectSection(section.id);
            if (section.items.length === 0) {
                onSelectTool(section.id);
                onClose();
            }
            return;
        }
        if (section.items.length > 0) {
            if (expandedSections.has(section.id)) {
                setExpandedSections(new Set());
            } else {
                setExpandedSections(new Set([section.id]));
            }
            onSelectSection(section.id);
        } else {
            setExpandedSections(new Set());
            onSelectSection(section.id);
            onSelectTool(section.id);
            onClose();
        }
    };

    const handleToolClick = (sectionId: string, toolId: string) => {
        onSelectSection(sectionId);
        onSelectTool(toolId);
        onClose();
    };

    const actualWidth = collapsed ? SIDEBAR_MIN_W : sidebarWidth;

    const sidebarContent = (
        <aside className="shrink-0 bg-white border-r border-slate-200/80 overflow-y-auto h-full flex flex-col relative transition-[width] duration-200 ease-in-out shadow-xl md:shadow-none" style={{ width: actualWidth, maxWidth: '85vw' }}>
            {/* Header */}
            <div className={`flex items-center px-2 pt-3 pb-2 gap-1 ${collapsed ? 'justify-center' : 'justify-between'}`}>
                {!collapsed && (
                    <div className="relative flex-1">
                        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search menus..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-slate-400"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                <X size={14} />
                            </button>
                        )}
                    </div>
                )}
                {/* Close button — visible only on mobile */}
                <button
                    onClick={onClose}
                    className={`md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors ${collapsed ? 'ml-0' : 'ml-2'}`}
                    aria-label="Close sidebar"
                >
                    <X size={16} />
                </button>
                {/* Collapse / Expand toggle */}
                <button
                    onClick={toggleCollapse}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors shrink-0"
                    title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {collapsed ? <PanelLeft size={14} /> : <PanelLeftClose size={14} />}
                </button>
            </div>

            {/* Search results */}
            {searchQuery.trim() && !collapsed && (
                <div className="border-b border-slate-100 pb-2 px-1">
                    {searchResults.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-3">No results found</p>
                    ) : (
                        searchResults.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTool === item.id || activeSection === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => { onSelectSection(item.sectionId); onSelectTool(item.id); setSearchQuery(''); onClose(); }}
                                    className={`w-full flex items-center gap-1 px-3 py-1.5 text-xs transition-colors rounded-md ${isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <Icon size={13} className={isActive ? 'text-primary' : (SECTION_COLORS[item.sectionId]?.text || 'text-slate-400')} />
                                    <span className="truncate">{item.label}</span>
                                </button>
                            );
                        })
                    )}
                </div>
            )}

            {/* Menu */}
            {!searchQuery.trim() && (
                <nav className="py-1 flex-1">
                    {/* ── Favourites Section ── */}
                    {favouriteTools.length > 0 && !collapsed && (
                        <div className="mb-2 px-1">
                            <div className="flex items-center gap-1.5 px-2.5 py-1.5">
                                <Star size={11} className="fill-amber-400 text-amber-400" />
                                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Favourites</span>
                            </div>
                            {favouriteTools.map(tool => {
                                const ToolIcon = tool.icon;
                                const isActive = activeTool === tool.id || activeSection === tool.id;
                                return (
                                    <button
                                        key={`fav-${tool.id}`}
                                        onClick={() => { onSelectSection(tool.sectionId); onSelectTool(tool.id); onClose(); }}
                                        className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-all rounded-md mb-0.5 ${
                                            isActive
                                                ? 'bg-amber-50 text-amber-700 font-semibold border-l-2 border-amber-400'
                                                : 'text-slate-600 hover:bg-amber-50/50 border-l-2 border-transparent'
                                        }`}
                                    >
                                        <ToolIcon size={13} className={isActive ? 'text-amber-600' : 'text-slate-400'} />
                                        <span className="truncate">{tool.label}</span>
                                    </button>
                                );
                            })}
                            <div className="border-b border-slate-100 mt-1.5 mb-1 mx-2" />
                        </div>
                    )}
                    {filteredSections.map(section => {
                        const isExpanded = !collapsed && expandedSections.has(section.id);
                        const isActiveSection = activeSection === section.id;
                        const SectionIcon = section.icon;

                        return (
                            <div key={section.id} className="mb-0.5">
                                {/* ── Main Menu Item ── */}
                                <button
                                    data-sidebar-id={section.id}
                                    onClick={() => handleSectionClick(section)}
                                    title={collapsed ? section.label : undefined}
                                    className={`w-full flex items-center ${collapsed ? 'justify-center px-0 py-2' : 'justify-between px-3 py-2.5'} text-[13px] font-bold tracking-tight transition-all duration-150 rounded-r-lg ${isActiveSection
                                        ? 'bg-gradient-to-r from-primary via-primary to-indigo-500 text-white border-l-[4px] border-primary-dark shadow-md shadow-primary/25'
                                        : 'text-slate-800 hover:bg-slate-50 border-l-[4px] border-transparent'
                                        }`}
                                >
                                    <div className={`flex items-center ${collapsed ? '' : 'gap-2.5'}`}>
                                        <div className={`flex items-center justify-center w-7 h-7 rounded-lg ${isActiveSection ? 'bg-white/20' : (SECTION_COLORS[section.id]?.bg || 'bg-slate-100')
                                            }`}>
                                            <SectionIcon size={15} className={isActiveSection ? 'text-white' : (SECTION_COLORS[section.id]?.text || 'text-slate-500')} />
                                        </div>
                                        {!collapsed && <span className="whitespace-nowrap">{section.label}</span>}
                                    </div>
                                    {!collapsed && (
                                        <div className="flex items-center gap-1.5">
                                            {isSubscribed ? (
                                                <ShieldCheck size={12} className={isActiveSection ? 'text-emerald-200' : 'text-emerald-500'} />
                                            ) : (
                                                <Lock size={12} className={isActiveSection ? 'text-orange-200' : 'text-orange-400'} />
                                            )}
                                            {section.items.length > 0 && (
                                                <ChevronDown
                                                    size={14}
                                                    className={`${isActiveSection ? 'text-white/70' : 'text-slate-400'} transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
                                                />
                                            )}
                                        </div>
                                    )}
                                </button>

                                {/* ── Sub Menu Items ── */}
                                {isExpanded && section.items.length > 0 && (
                                    <div className="relative ml-[22px] border-l-2 border-slate-200/80">
                                        {section.items.map((item, idx) => {
                                            const isActive = activeTool === item.id || activeSection === item.id;
                                            const Icon = item.icon;
                                            const isLast = idx === section.items.length - 1;
                                            return (
                                                <button
                                                    key={item.id}
                                                    data-sidebar-id={item.id}
                                                    onClick={() => handleToolClick(section.id, item.id)}
                                                    className={`w-full flex items-center gap-2 pl-4 pr-3 py-[7px] text-[11.5px] text-left transition-all duration-100 relative rounded-r-md ${isActive
                                                        ? 'text-white font-bold bg-gradient-to-r from-primary/90 to-indigo-500/80 shadow-sm shadow-primary/20'
                                                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/80 font-medium'
                                                        } ${isLast ? 'mb-1' : ''}`}
                                                >
                                                    {/* Horizontal connector line */}
                                                    <span className={`absolute left-0 top-1/2 w-3 h-[2px] ${isActive ? 'bg-primary' : 'bg-slate-200/80'}`} />
                                                    <Icon size={12} className={`shrink-0 ${isActive ? 'text-white' : (SECTION_COLORS[section.id]?.text || 'text-slate-400')}`} />
                                                    <span className="truncate flex-1">{item.label}</span>
                                                    <span className="shrink-0 ml-auto">
                                                        {isSubscribed
                                                            ? <ShieldCheck size={10} className={isActive ? 'text-emerald-200' : 'text-emerald-400'} />
                                                            : <Lock size={10} className={isActive ? 'text-orange-200' : 'text-orange-300'} />
                                                        }
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            )}
            {/* ── Drag resize handle ── */}
            <div
                onMouseDown={onDragStart}
                className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-primary/20 active:bg-primary/30 transition-colors z-10 group"
            >
                <div className="absolute top-1/2 -translate-y-1/2 right-0 w-1 h-8 rounded-full bg-slate-300 group-hover:bg-primary/50 transition-colors" />
            </div>
        </aside>
    );

    return (
        <>
            {/* ── Desktop: always visible ── */}
            <div className="hidden md:flex h-full">
                {sidebarContent}
            </div>

            {/* ── Mobile: slide-in overlay ── */}
            {/* Backdrop */}
            <div
                className={`md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-200 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />
            {/* Panel */}
            <div
                className={`md:hidden fixed inset-y-0 left-0 z-50 transition-transform duration-200 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {sidebarContent}
            </div>
        </>
    );
};
