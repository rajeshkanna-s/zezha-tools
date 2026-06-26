import React, { useRef, useMemo } from 'react';
import {
    Download, Upload, AlertTriangle, Info, ShieldCheck, EyeOff, Eye, RotateCcw,
    HardDrive, Star, Sun, Moon, Monitor,
    Calendar, Hash, Type, Keyboard, Layout, Volume2, VolumeX, Zap, ZapOff,
    Globe, Home, Minus
} from 'lucide-react';
import { toast } from 'sonner';
import { MENU_SECTIONS } from '../ToolsSidebar';
import { useCustomTools } from '@/hooks/useCustomTools';
import { useFavouriteTools } from '@/hooks/useFavouriteTools';
import { useAppPreferences, type FontSize, type DateFormat } from '@/hooks/useAppPreferences';
import { TOOL_DOMAINS } from '../ToolsDomainLanding';
import { CloudBackupSection } from './CloudBackupSection';

/* ═══════════════════════════════════════════════════════════════
   Reusable toggle switch
   ═══════════════════════════════════════════════════════════════ */
const ToggleSwitch: React.FC<{ on: boolean; onChange: () => void; size?: 'sm' | 'md' }> = ({ on, onChange, size = 'md' }) => {
    const w = size === 'sm' ? 'w-8 h-[18px]' : 'w-9 h-5';
    const dot = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
    const onPos = size === 'sm' ? 'left-[15px]' : 'left-[18px]';
    return (
        <button
            onClick={onChange}
            className={`relative ${w} rounded-full transition-colors duration-200 shrink-0 ${on ? 'bg-gradient-to-r from-indigo-500 to-violet-500' : 'bg-slate-200'}`}
        >
            <span className={`absolute top-0.5 ${dot} rounded-full bg-white shadow-sm transition-transform duration-200 ${on ? onPos : 'left-0.5'}`} />
        </button>
    );
};

/* ═══════════════════════════════════════════════════════════════
   Reusable option card for radio-style selections
   ═══════════════════════════════════════════════════════════════ */
const OptionCard: React.FC<{
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    description?: string;
}> = ({ active, onClick, icon, label, description }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all duration-200 ${active
            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm shadow-indigo-100'
            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            }`}
    >
        <div className={`shrink-0 ${active ? 'text-indigo-500' : 'text-slate-400'}`}>{icon}</div>
        <div className="min-w-0">
            <span className={`text-xs font-semibold block ${active ? 'text-indigo-700' : 'text-slate-700'}`}>{label}</span>
            {description && <span className="text-[10px] text-slate-400 block mt-0.5">{description}</span>}
        </div>
    </button>
);

export const GlobalSettings: React.FC = () => {
    const fileRef = useRef<HTMLInputElement>(null);
    const { hiddenIds, toggleItem, resetVisibility, isLoaded } = useCustomTools();
    const { favouriteIds, toggleFavourite, resetFavourites } = useFavouriteTools();
    const { prefs, updatePref } = useAppPreferences();


    const handleExport = () => {
        try {
            const data: Record<string, any> = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key) {
                    try {
                        data[key] = JSON.parse(localStorage.getItem(key) || 'null');
                    } catch {
                        data[key] = localStorage.getItem(key);
                    }
                }
            }

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `reportiq-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast.success('System data successfully exported!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to export data');
        }
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target?.result as string);
                if (typeof data !== 'object' || data === null) {
                    throw new Error('Invalid backup file structure');
                }

                if (!window.confirm('⚠️ WARNING: This will overwrite ALL your current saved data (invoices, trackers, history, settings). Are you sure you want to proceed?')) {
                    if (fileRef.current) fileRef.current.value = '';
                    return;
                }

                Object.keys(data).forEach(key => {
                    const value = data[key];
                    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
                });

                toast.success('Data imported successfully! Reloading page to apply...');
                setTimeout(() => window.location.reload(), 1500);

            } catch (err) {
                console.error(err);
                toast.error('Invalid backup file format');
            }
            if (fileRef.current) fileRef.current.value = '';
        };
        reader.onerror = () => {
            toast.error('Failed to read file');
            if (fileRef.current) fileRef.current.value = '';
        };
        reader.readAsText(file);
    };

    const totalTools = MENU_SECTIONS.reduce((sum, s) => sum + s.items.length + 1, 0);
    const visibleTools = totalTools - hiddenIds.length;

    // Compute storage usage
    const storageInfo = useMemo(() => {
        let totalBytes = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
                const val = localStorage.getItem(key) || '';
                totalBytes += key.length * 2 + val.length * 2; // UTF-16
            }
        }
        const maxBytes = 5 * 1024 * 1024; // ~5MB typical limit
        return {
            usedBytes: totalBytes,
            maxBytes,
            usedMB: (totalBytes / (1024 * 1024)).toFixed(2),
            percentage: Math.min(100, Math.round((totalBytes / maxBytes) * 100)),
        };
    }, []);

    // All tools flattened for favourite selection
    const allTools = useMemo(() => {
        const tools: { id: string; label: string; sectionLabel: string; icon: React.FC<any> }[] = [];
        MENU_SECTIONS.forEach(section => {
            if (section.items.length > 0) {
                section.items.forEach(item => {
        tools.push({ id: item.id, label: item.label, sectionLabel: section.label, icon: item.icon });
                });
            } else {
                tools.push({ id: section.id, label: section.label, sectionLabel: '', icon: section.icon });
            }
        });
        return tools;
    }, []);

    /* ── Keyboard shortcuts data ─────────────────────────────────── */
    const shortcuts = [
        { keys: ['Ctrl', 'K'], description: 'Open Global Search' },
        { keys: ['Esc'], description: 'Close dialogs / Go back' },
        { keys: ['↑', '↓'], description: 'Navigate search results' },
        { keys: ['Enter'], description: 'Select search result / Confirm' },
    ];

    return (
        <div className="max-w-3xl mx-auto space-y-8">

            {/* ═══════════════════════════════════════════════════════════
                SECTION 1 — APPEARANCE & DISPLAY
               ═══════════════════════════════════════════════════════════ */}
            <div>
                <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-100 to-pink-100 flex items-center justify-center">
                        <Sun size={16} className="text-violet-600" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">Appearance & Display</h2>
                </div>
                <p className="text-slate-400 text-xs ml-[42px] mb-4">Customise how ReportIQ looks and feels.</p>

                <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white shadow-sm">
                    {/* Theme mode */}
                    <div className="p-4 border-b border-slate-100">
                        <label className="text-xs font-semibold text-slate-700 block mb-3">Theme</label>
                        <div className="grid grid-cols-3 gap-2">
                            <OptionCard
                                active={prefs.theme === 'light'}
                                onClick={() => updatePref('theme', 'light')}
                                icon={<Sun size={16} />}
                                label="Light"
                            />
                            <OptionCard
                                active={prefs.theme === 'dark'}
                                onClick={() => updatePref('theme', 'dark')}
                                icon={<Moon size={16} />}
                                label="Dark"
                            />
                            <OptionCard
                                active={prefs.theme === 'system'}
                                onClick={() => updatePref('theme', 'system')}
                                icon={<Monitor size={16} />}
                                label="System"
                                description="Auto-detect"
                            />
                        </div>
                    </div>

                    {/* Font size */}
                    <div className="p-4 border-b border-slate-100">
                        <label className="text-xs font-semibold text-slate-700 block mb-3">
                            <Type size={12} className="inline mr-1.5 -mt-0.5 text-slate-400" />
                            Text Size
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {([
                                { val: 'compact' as FontSize, label: 'Compact', icon: <Minus size={14} /> },
                                { val: 'default' as FontSize, label: 'Default', icon: <Type size={14} /> },
                                { val: 'comfortable' as FontSize, label: 'Large', icon: <Type size={18} /> },
                            ]).map(opt => (
                                <OptionCard
                                    key={opt.val}
                                    active={prefs.fontSize === opt.val}
                                    onClick={() => updatePref('fontSize', opt.val)}
                                    icon={opt.icon}
                                    label={opt.label}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Sidebar density */}
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Layout size={15} className="text-slate-400" />
                            <div>
                                <span className="text-xs font-semibold text-slate-700 block">Compact Sidebar</span>
                                <span className="text-[10px] text-slate-400">Reduce sidebar padding for more content</span>
                            </div>
                        </div>
                        <ToggleSwitch on={prefs.sidebarDensity === 'compact'} onChange={() => updatePref('sidebarDensity', prefs.sidebarDensity === 'compact' ? 'default' : 'compact')} />
                    </div>

                    {/* Animations */}
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {prefs.animationsEnabled ? <Zap size={15} className="text-amber-500" /> : <ZapOff size={15} className="text-slate-400" />}
                            <div>
                                <span className="text-xs font-semibold text-slate-700 block">Animations</span>
                                <span className="text-[10px] text-slate-400">Micro-animations and hover effects</span>
                            </div>
                        </div>
                        <ToggleSwitch on={prefs.animationsEnabled} onChange={() => updatePref('animationsEnabled', !prefs.animationsEnabled)} />
                    </div>

                    {/* Sound effects */}
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {prefs.soundEffects ? <Volume2 size={15} className="text-emerald-500" /> : <VolumeX size={15} className="text-slate-400" />}
                            <div>
                                <span className="text-xs font-semibold text-slate-700 block">Sound Effects</span>
                                <span className="text-[10px] text-slate-400">Play sounds on actions (export, save)</span>
                            </div>
                        </div>
                        <ToggleSwitch on={prefs.soundEffects} onChange={() => updatePref('soundEffects', !prefs.soundEffects)} />
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 2 — FORMAT & LOCALE
               ═══════════════════════════════════════════════════════════ */}
            <div>
                <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center">
                        <Globe size={16} className="text-sky-600" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">Format & Locale</h2>
                </div>
                <p className="text-slate-400 text-xs ml-[42px] mb-4">Applies to Expense Tracker, Debt Tracker, Budget Tracker and Reports.</p>

                <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white shadow-sm">
                    {/* Date format */}
                    <div className="p-4 border-b border-slate-100">
                        <label className="text-xs font-semibold text-slate-700 block mb-3">
                            <Calendar size={12} className="inline mr-1.5 -mt-0.5 text-slate-400" />
                            Date Format
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {([
                                { val: 'DD/MM/YYYY' as DateFormat, label: 'DD/MM/YYYY', desc: '08/04/2026' },
                                { val: 'MM/DD/YYYY' as DateFormat, label: 'MM/DD/YYYY', desc: '04/08/2026' },
                                { val: 'YYYY-MM-DD' as DateFormat, label: 'YYYY-MM-DD', desc: '2026-04-08' },
                            ]).map(opt => (
                                <OptionCard
                                    key={opt.val}
                                    active={prefs.dateFormat === opt.val}
                                    onClick={() => updatePref('dateFormat', opt.val)}
                                    icon={<Calendar size={14} />}
                                    label={opt.label}
                                    description={opt.desc}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Number format */}
                    <div className="p-4 border-b border-slate-100">
                        <label className="text-xs font-semibold text-slate-700 block mb-3">
                            <Hash size={12} className="inline mr-1.5 -mt-0.5 text-slate-400" />
                            Number Format
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <OptionCard
                                active={prefs.numberFormat === 'indian'}
                                onClick={() => updatePref('numberFormat', 'indian')}
                                icon={<Hash size={14} />}
                                label="Indian"
                                description="12,34,567.00"
                            />
                            <OptionCard
                                active={prefs.numberFormat === 'international'}
                                onClick={() => updatePref('numberFormat', 'international')}
                                icon={<Hash size={14} />}
                                label="International"
                                description="1,234,567.00"
                            />
                        </div>
                    </div>

                    {/* Currency */}
                    <div className="p-4">
                        <label className="text-xs font-semibold text-slate-700 block mb-2">Currency Symbol</label>
                        <div className="flex gap-2">
                            {['₹', '$', '€', '£', '¥'].map(sym => (
                                <button
                                    key={sym}
                                    onClick={() => updatePref('currencySymbol', sym)}
                                    className={`w-10 h-10 rounded-xl border text-sm font-bold transition-all duration-200 ${prefs.currencySymbol === sym
                                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                        }`}
                                >
                                    {sym}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 3 — DEFAULT START PAGE
               ═══════════════════════════════════════════════════════════ */}
            <div>
                <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                        <Home size={16} className="text-emerald-600" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">Default Start Page</h2>
                </div>
                <p className="text-slate-400 text-xs ml-[42px] mb-4">Choose which page opens when you log in.</p>

                <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white shadow-sm p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <OptionCard
                            active={prefs.defaultDomainOnLogin === ''}
                            onClick={() => updatePref('defaultDomainOnLogin', '')}
                            icon={<Home size={14} />}
                            label="Home"
                            description="Default landing"
                        />
                        <OptionCard
                            active={prefs.defaultDomainOnLogin === 'tools'}
                            onClick={() => updatePref('defaultDomainOnLogin', 'tools')}
                            icon={<Layout size={14} />}
                            label="All Tools"
                            description="Domain selector"
                        />
                        {TOOL_DOMAINS.slice(0, 4).map(d => {
                            const DIcon = d.icon;
                            return (
                                <OptionCard
                                    key={d.id}
                                    active={prefs.defaultDomainOnLogin === d.id}
                                    onClick={() => updatePref('defaultDomainOnLogin', d.id)}
                                    icon={<DIcon size={14} />}
                                    label={d.label.split(' ')[0]}
                                    description={d.tags[0]}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 4 — FAVOURITE TOOLS
               ═══════════════════════════════════════════════════════════ */}
            <div>
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                            <Star size={16} className="text-amber-600" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Favourite Tools</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 font-medium">{favouriteIds.length} pinned</span>
                        {favouriteIds.length > 0 && (
                            <button
                                onClick={resetFavourites}
                                className="flex items-center gap-1 text-[11px] text-amber-600 hover:text-amber-700 font-semibold px-2 py-1 rounded-md hover:bg-amber-50 transition-colors"
                            >
                                <RotateCcw size={11} /> Clear All
                            </button>
                        )}
                    </div>
                </div>
                <p className="text-slate-400 text-xs ml-[42px] mb-4">Star your most-used tools for quick access in the sidebar.</p>

                {/* Current favourites */}
                {favouriteIds.length > 0 && (
                    <div className="border border-amber-200/60 rounded-xl bg-amber-50/40 p-3 mb-3">
                        <div className="flex flex-wrap gap-1.5">
                            {favouriteIds.map(id => {
                                const tool = allTools.find(t => t.id === id);
                                if (!tool) return null;
                                return (
                                    <button
                                        key={id}
                                        onClick={() => toggleFavourite(id)}
                                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 text-xs font-medium text-amber-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all group"
                                        title="Click to remove"
                                    >
                                        <Star size={11} className="fill-amber-400 text-amber-400 group-hover:fill-red-400 group-hover:text-red-400" />
                                        {tool.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Browse all tools */}
                <div className="border border-slate-200/80 rounded-xl bg-white shadow-sm overflow-hidden max-h-[300px] overflow-y-auto custom-scrollbar">
                    {MENU_SECTIONS.filter(s => s.items.length > 0).map(section => {
                        const SIcon = section.icon;
                        return (
                            <div key={section.id} className="border-b border-slate-50 last:border-0">
                                <div className="px-3 py-2 bg-slate-50/80 flex items-center gap-2">
                                    <SIcon size={12} className="text-slate-400" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{section.label}</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-50">
                                    {section.items.map(tool => {
                                        const isFav = favouriteIds.includes(tool.id);
                                        const ToolIcon = tool.icon;
                                        return (
                                            <button
                                                key={tool.id}
                                                onClick={() => toggleFavourite(tool.id)}
                                                className={`flex items-center gap-2 px-3 py-2 text-xs transition-all ${isFav
                                                    ? 'bg-amber-50 text-amber-700 font-semibold'
                                                    : 'bg-white text-slate-600 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <Star size={11} className={isFav ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />
                                                <ToolIcon size={12} className={isFav ? 'text-amber-600' : 'text-slate-400'} />
                                                <span className="truncate">{tool.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 5 — DATA & BACKUP
               ═══════════════════════════════════════════════════════════ */}
            <div>
                <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                        <HardDrive size={16} className="text-indigo-600" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">Data & Backup</h2>
                </div>
                <p className="text-slate-400 text-xs ml-[42px] mb-4">Manage your local browser data securely.</p>

                {/* Storage meter */}
                <div className="border border-slate-200/80 rounded-xl bg-white shadow-sm p-4 mb-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-700">Browser Storage Usage</span>
                        <span className={`text-[11px] font-bold ${storageInfo.percentage > 80 ? 'text-red-500' : storageInfo.percentage > 50 ? 'text-amber-500' : 'text-emerald-600'}`}>
                            {storageInfo.usedMB} MB / ~5 MB
                        </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${storageInfo.percentage > 80 ? 'bg-gradient-to-r from-red-400 to-red-500' : storageInfo.percentage > 50 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-emerald-400 to-teal-500'}`}
                            style={{ width: `${storageInfo.percentage}%` }}
                        />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1.5">Regular exports recommended to prevent data loss from browser cache clearing.</p>
                </div>

                {/* Info banner */}
                <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl p-3.5 flex gap-3 text-xs text-amber-700 mb-3">
                    <Info className="shrink-0 mt-0.5 text-amber-500" size={15} />
                    <div>
                        <strong>Privacy Notice:</strong> All data is stored locally in your browser. <strong>Take a daily export</strong> to avoid data loss if your browser data gets cleared.
                    </div>
                </div>

                {/* Export & Import cards */}
                <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white shadow-sm">
                    {/* Export */}
                    <div className="p-4 flex items-center gap-4 border-b border-slate-100">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center shrink-0">
                            <Download size={18} className="text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-slate-800">Export All Data</h3>
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">Downloads a complete backup — trackers, invoices, configs, and history.</p>
                        </div>
                        <button
                            onClick={handleExport}
                            className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-xs font-bold shadow-sm shadow-emerald-200 hover:shadow-md hover:shadow-emerald-200 transition-all"
                        >
                            <Download size={13} /> Export
                        </button>
                    </div>

                    {/* Import */}
                    <div className="p-4 flex items-center gap-4 bg-slate-50/30">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center shrink-0">
                            <Upload size={18} className="text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                                Import Backup
                                <span className="bg-red-100 text-red-600 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded">Danger</span>
                            </h3>
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                                <AlertTriangle size={10} className="inline text-amber-500 -mt-0.5 mr-0.5" />
                                Overwrites all current browser data with your backup file.
                            </p>
                        </div>
                        <div>
                            <input type="file" accept=".json" ref={fileRef} onChange={handleImport} className="hidden" />
                            <button
                                onClick={() => fileRef.current?.click()}
                                className="shrink-0 flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all"
                            >
                                <Upload size={13} /> Import
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 6 — CLOUD BACKUP (Google Drive)
               ═══════════════════════════════════════════════════════════ */}
            <CloudBackupSection />

            {/* ═══════════════════════════════════════════════════════════
                SECTION 7 — KEYBOARD SHORTCUTS
               ═══════════════════════════════════════════════════════════ */}
            <div>
                <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-100 to-zinc-100 flex items-center justify-center">
                        <Keyboard size={16} className="text-slate-600" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">Keyboard Shortcuts</h2>
                </div>
                <p className="text-slate-400 text-xs ml-[42px] mb-4">Quick reference for power users.</p>

                <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white shadow-sm divide-y divide-slate-50">
                    {shortcuts.map((s, i) => (
                        <div key={i} className="px-4 py-3 flex items-center justify-between">
                            <span className="text-xs text-slate-600 font-medium">{s.description}</span>
                            <div className="flex gap-1">
                                {s.keys.map((k, j) => (
                                    <React.Fragment key={j}>
                                        {j > 0 && <span className="text-slate-300 text-[10px] self-center">+</span>}
                                        <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-md text-[11px] font-mono font-bold text-slate-600 shadow-sm">
                                            {k}
                                        </kbd>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 8 — TOOLS AVAILABILITY
               ═══════════════════════════════════════════════════════════ */}
            <div>
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center">
                            <ShieldCheck size={16} className="text-violet-600" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Tools Availability</h2>
                    </div>
                    {/* Stats badge */}
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 font-medium">{visibleTools}/{totalTools} visible</span>
                        {hiddenIds.length > 0 && (
                            <button
                                onClick={resetVisibility}
                                className="flex items-center gap-1 text-[11px] text-violet-600 hover:text-violet-700 font-semibold px-2 py-1 rounded-md hover:bg-violet-50 transition-colors"
                            >
                                <RotateCcw size={11} /> Reset All
                            </button>
                        )}
                    </div>
                </div>
                <p className="text-slate-400 text-xs ml-[42px] mb-4">Toggle tools and categories to customise your workspace.</p>

                {/* Currently hidden tools summary */}
                {hiddenIds.length > 0 && (
                    <div className="border border-violet-200/60 rounded-xl bg-violet-50/40 p-3 mb-3">
                        <div className="flex flex-wrap gap-1.5">
                            {hiddenIds.map(id => {
                                const tool = allTools.find(t => t.id === id);
                                const section = MENU_SECTIONS.find(s => s.id === id);
                                const label = tool?.label || section?.label;
                                if (!label) return null;
                                return (
                                    <button
                                        key={id}
                                        onClick={() => toggleItem(id, true)}
                                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-violet-200 text-xs font-medium text-violet-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 transition-all group"
                                        title="Click to show"
                                    >
                                        <EyeOff size={11} className="text-violet-400 group-hover:hidden" />
                                        <Eye size={11} className="text-emerald-400 hidden group-hover:block" />
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Scrollable tools list — same style as Favourite Tools */}
                {isLoaded && (
                    <div className="border border-slate-200/80 rounded-xl bg-white shadow-sm overflow-hidden max-h-[340px] overflow-y-auto custom-scrollbar">
                        {MENU_SECTIONS.filter(s => s.items.length > 0).map(section => {
                            const isCategoryHidden = hiddenIds.includes(section.id);
                            const SectionIcon = section.icon;
                            const hiddenToolCount = section.items.filter(t => hiddenIds.includes(t.id)).length;
                            return (
                                <div key={section.id} className="border-b border-slate-50 last:border-0">
                                    {/* Category header row */}
                                    <div className="px-3 py-2 bg-slate-50/80 flex items-center gap-2 justify-between">
                                        <div className="flex items-center gap-2">
                                            <SectionIcon size={12} className={isCategoryHidden ? 'text-slate-300' : 'text-slate-400'} />
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${isCategoryHidden ? 'text-slate-300 line-through' : 'text-slate-500'}`}>
                                                {section.label}
                                            </span>
                                            {!isCategoryHidden && hiddenToolCount > 0 && (
                                                <span className="text-[9px] text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded-full">{hiddenToolCount} hidden</span>
                                            )}
                                        </div>
                                        <ToggleSwitch on={!isCategoryHidden} onChange={() => toggleItem(section.id, !isCategoryHidden)} size="sm" />
                                    </div>
                                    {/* Individual tools grid */}
                                    {!isCategoryHidden && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-50">
                                            {section.items.map(tool => {
                                                const isToolHidden = hiddenIds.includes(tool.id);
                                                const ToolIcon = tool.icon;
                                                return (
                                                    <button
                                                        key={tool.id}
                                                        onClick={() => toggleItem(tool.id, !isToolHidden)}
                                                        className={`flex items-center gap-2 px-3 py-2 text-xs transition-all ${isToolHidden
                                                            ? 'bg-slate-50/50 text-slate-400'
                                                            : 'bg-white text-slate-600 hover:bg-slate-50'
                                                            }`}
                                                    >
                                                        {isToolHidden ? (
                                                            <EyeOff size={11} className="text-slate-300" />
                                                        ) : (
                                                            <Eye size={11} className="text-emerald-400" />
                                                        )}
                                                        <ToolIcon size={12} className={isToolHidden ? 'text-slate-300' : 'text-slate-400'} />
                                                        <span className={`truncate ${isToolHidden ? 'line-through' : ''}`}>{tool.label}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
