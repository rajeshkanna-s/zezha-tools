import React, { useMemo } from 'react';
import {
    Building2, Factory, Receipt, Users, Hammer, Coins,
    Wrench, Terminal, FileSignature, Sparkles, Database,
    TrendingUp, ArrowRight, Search
} from 'lucide-react';
import { MENU_SECTIONS } from './ToolsSidebar';
import { useCustomTools } from '@/hooks/useCustomTools';

/* ═══════════════════════════════════════════════════════════════
   Domain definitions — each domain groups multiple sidebar
   sections into a single high-level category
   ═══════════════════════════════════════════════════════════════ */

export interface ToolDomain {
    id: string;
    label: string;
    description: string;
    icon: React.FC<{ size?: number; className?: string }>;
    gradient: string;       // tailwind gradient classes for card accent
    iconBg: string;         // icon wrapper bg
    sectionIds: string[];   // sidebar section IDs belonging to this domain
    tags: string[];         // 2-3 representative categories as chips
}

export const TOOL_DOMAINS: ToolDomain[] = [
    {
        id: 'finance-accounting',
        label: 'Finance & Accounting',
        description: 'Tax calculations, loans, EMIs & investments analysis',
        icon: Building2,
        gradient: 'from-blue-600 to-indigo-700',
        iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
        sectionIds: ['business-tax', 'loans-emi', 'investments'],
        tags: ['Tax', 'Loans & EMI', 'Investments'],
    },
    {
        id: 'tax-compliance',
        label: 'Tax & Compliance',
        description: 'Compliance deadlines, government scheme finder & regulatory tools',
        icon: Receipt,
        gradient: 'from-purple-600 to-violet-700',
        iconBg: 'bg-gradient-to-br from-purple-500 to-violet-600',
        sectionIds: ['govt-scheme-finder'],
        tags: ['Compliance', 'Govt Schemes'],
    },
    {
        id: 'productivity',
        label: 'Productivity & Utilities',
        description: 'PDF converters, image tools, mail suite, spreadsheets & calculators',
        icon: Wrench,
        gradient: 'from-sky-500 to-blue-600',
        iconBg: 'bg-gradient-to-br from-sky-500 to-blue-600',
        sectionIds: ['get-img-video', 'products', 'convertors', 'utilities'],
        tags: ['PDF Tools', 'Media Search', 'Products'],
    },
    {
        id: 'developer-tools',
        label: 'Developer Tools',
        description: 'JSON formatters, diff checkers, encoding tools, security utilities & code helpers',
        icon: Terminal,
        gradient: 'from-cyan-500 to-teal-600',
        iconBg: 'bg-gradient-to-br from-cyan-500 to-teal-600',
        sectionIds: ['dev-toolkit'],
        tags: ['JSON', 'Encoding', 'Security & Code'],
    },
    {
        id: 'creative-career',
        label: 'Creative & Career',
        description: 'Invitations, logos, life decision tools, SEO analyser & creative utilities',
        icon: Sparkles,
        gradient: 'from-pink-500 to-rose-600',
        iconBg: 'bg-gradient-to-br from-pink-500 to-rose-600',
        sectionIds: ['invitation-creator', 'event-page-creator', 'logo-creator', 'life-decision-simulator'],
        tags: ['Invitations', 'Logos', 'Creative Tools'],
    },
    {
        id: 'raw-data',
        label: 'Raw Data & Reference',
        description: 'Indian states, cities, colleges, tax slabs, GST codes, compliance calendars & more',
        icon: Database,
        gradient: 'from-slate-500 to-zinc-600',
        iconBg: 'bg-gradient-to-br from-slate-500 to-zinc-600',
        sectionIds: ['raw-data'],
        tags: ['Datasets', 'Tax Slabs', 'Compliance'],
    },
];

/* ═══════════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════════ */

interface ToolsDomainLandingProps {
    onSelectDomain: (domainId: string) => void;
}

export const ToolsDomainLanding: React.FC<ToolsDomainLandingProps> = ({ onSelectDomain }) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const { hiddenIds } = useCustomTools();

    // Compute tool counts per domain (excluding hidden sections/tools)
    const domainCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        TOOL_DOMAINS.forEach(domain => {
            let total = 0;
            domain.sectionIds.forEach(sid => {
                // Skip entirely hidden sections
                if (hiddenIds.includes(sid)) return;
                const section = MENU_SECTIONS.find(s => s.id === sid);
                if (section) {
                    if (section.items.length > 0) {
                        // Count only non-hidden sub-items
                        const visibleItems = section.items.filter(item => !hiddenIds.includes(item.id));
                        total += visibleItems.length;
                    } else {
                        total += 1; // standalone section
                    }
                }
            });
            counts[domain.id] = total;
        });
        return counts;
    }, [hiddenIds]);

    // Total tools count
    const totalTools = useMemo(() =>
        Object.values(domainCounts).reduce((a, b) => a + b, 0)
    , [domainCounts]);

    // Filter domains by search AND exclude domains with zero visible tools
    const filteredDomains = useMemo(() => {
        let domains = TOOL_DOMAINS.filter(d => (domainCounts[d.id] || 0) > 0);
        if (!searchQuery.trim()) return domains;
        const q = searchQuery.toLowerCase();
        return domains.filter(d =>
            d.label.toLowerCase().includes(q) ||
            d.description.toLowerCase().includes(q) ||
            d.tags.some(t => t.toLowerCase().includes(q))
        );
    }, [searchQuery, domainCounts]);

    return (
        <div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
            {/* ── Compact Hero ── */}
            <div className="relative overflow-hidden border-b border-slate-100">
                {/* Animated background mesh */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-32 -right-32 w-80 h-80 bg-gradient-to-br from-primary/8 to-indigo-300/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-emerald-200/20 to-cyan-200/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-gradient-to-r from-violet-100/10 via-primary/5 to-rose-100/10 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        {/* Left: Title block */}
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-primary/25 shrink-0">
                                <TrendingUp size={18} />
                            </div>
                            <div>
                                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                                    All Domains
                                </h1>
                                <p className="text-[11px] text-slate-500 font-medium">
                                    {totalTools}+ tools across {filteredDomains.length} domains — pick one to dive in
                                </p>
                            </div>
                        </div>

                        {/* Right: Search */}
                        <div className="relative w-full sm:w-72">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Filter domains..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-white/80 backdrop-blur-sm border border-slate-200/70 rounded-xl text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Domain Cards Grid (4-col, compact) ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
                {filteredDomains.length === 0 ? (
                    <div className="text-center py-12">
                        <Search size={28} className="mx-auto text-slate-300 mb-3" />
                        <p className="text-slate-400 text-sm font-medium">No domains match "<span className="text-slate-600">{searchQuery}</span>"</p>
                        <button onClick={() => setSearchQuery('')} className="mt-2 text-primary text-xs font-semibold hover:underline">Clear search</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {filteredDomains.map((domain, idx) => {
                            const Icon = domain.icon;
                            const count = domainCounts[domain.id] || 0;
                            return (
                                <button
                                    key={domain.id}
                                    onClick={() => onSelectDomain(domain.id)}
                                    className="group relative bg-white rounded-xl border border-slate-200/60 p-3.5 text-left hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5 hover:border-primary/20 transition-all duration-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    style={{ animation: 'fadeInUp 0.3s ease-out both', animationDelay: `${idx * 40}ms` }}
                                >
                                    {/* Top gradient accent */}
                                    <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${domain.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-200`} />

                                    {/* Subtle hover glow */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${domain.gradient} opacity-0 group-hover:opacity-[0.02] transition-opacity duration-200 rounded-xl`} />

                                    <div className="relative">
                                        {/* Icon + Badge row */}
                                        <div className="flex items-center justify-between mb-2.5">
                                            <div className={`w-9 h-9 ${domain.iconBg} rounded-lg flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200`}>
                                                <Icon size={17} />
                                            </div>
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500 group-hover:bg-primary/8 group-hover:text-primary group-hover:border-primary/15 transition-colors">
                                                {count}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-[13px] font-bold text-slate-800 mb-1 leading-tight group-hover:text-primary transition-colors">
                                            {domain.label}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-[10.5px] text-slate-400 leading-snug mb-2.5 line-clamp-2">
                                            {domain.description}
                                        </p>

                                        {/* Tags row */}
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {domain.tags.map(tag => (
                                                <span key={tag} className="px-1.5 py-px rounded bg-slate-50 text-[9px] font-semibold text-slate-400 group-hover:text-primary/60 transition-colors">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Explore CTA */}
                                        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-300 group-hover:text-primary transition-colors">
                                            <span>Explore</span>
                                            <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Security footer bar */}
                <div className="mt-5 flex items-center justify-center gap-4 px-4 py-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100/50">
                    <div className="flex items-center gap-1.5 text-emerald-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        <span className="text-[10px] font-bold">100% Browser-Based</span>
                    </div>
                    <div className="w-px h-3 bg-emerald-200" />
                    <span className="text-[10px] font-medium text-emerald-500">No data uploaded to any server</span>
                    <div className="w-px h-3 bg-emerald-200" />
                    <span className="text-[10px] font-medium text-emerald-500">Privacy-first processing</span>
                </div>
            </div>

            {/* Keyframe animation for card entrance */}
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};
