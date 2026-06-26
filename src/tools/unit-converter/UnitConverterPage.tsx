import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Copy, RefreshCw, Star, Search, SlidersHorizontal, CheckCircle2, ArrowRightLeft } from 'lucide-react';
import {
    LENGTH_UNITS, AREA_UNITS, WEIGHT_UNITS, VOLUME_UNITS,
    SPEED_UNITS, TIME_UNITS, DATA_UNITS,
    formatResult, convertTempAll, type TempUnit
} from './converters';

interface UnitConverterPageProps {
    onBack: () => void;
}

type Category = 'Length' | 'Area' | 'Weight' | 'Volume' | 'Temperature' | 'Speed' | 'Time' | 'Data';

const CATEGORIES: Category[] = ['Length', 'Area', 'Weight', 'Volume', 'Temperature', 'Speed', 'Time', 'Data'];

const CATEGORY_ICONS: Record<Category, string> = {
    Length: '📏',
    Area: '📐',
    Weight: '⚖️',
    Volume: '🧪',
    Temperature: '🌡️',
    Speed: '⚡',
    Time: '⏱️',
    Data: '💾',
};

const CATEGORY_GRADIENTS: Record<Category, string> = {
    Length: 'from-blue-500 to-cyan-400',
    Area: 'from-emerald-500 to-teal-400',
    Weight: 'from-amber-500 to-orange-400',
    Volume: 'from-purple-500 to-violet-400',
    Temperature: 'from-red-500 to-rose-400',
    Speed: 'from-yellow-500 to-amber-400',
    Time: 'from-indigo-500 to-blue-400',
    Data: 'from-fuchsia-500 to-pink-400',
};

const CATEGORY_MAP: Record<Exclude<Category, 'Temperature'>, any> = {
    Length: LENGTH_UNITS,
    Area: AREA_UNITS,
    Weight: WEIGHT_UNITS,
    Volume: VOLUME_UNITS,
    Speed: SPEED_UNITS,
    Time: TIME_UNITS,
    Data: DATA_UNITS
};

export const UnitConverterPage: React.FC<UnitConverterPageProps> = ({ onBack }) => {
    const [activeCategory, setActiveCategory] = useState<Category>('Length');
    const [inputValue, setInputValue] = useState<string>('1');
    const [fromUnit, setFromUnit] = useState<string>('m');
    const [searchQuery, setSearchQuery] = useState('');
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const [precision, setPrecision] = useState<'auto' | '4' | '8'>('auto');
    const [animateCards, setAnimateCards] = useState(false);

    const [favorites, setFavorites] = useState<Record<Category, string[]>>(() => {
        try {
            const saved = localStorage.getItem('riq-converter-favs');
            return saved ? JSON.parse(saved) : {
                Length: [], Area: [], Weight: [], Volume: [], Temperature: [], Speed: [], Time: [], Data: []
            };
        } catch {
            return { Length: [], Area: [], Weight: [], Volume: [], Temperature: [], Speed: [], Time: [], Data: [] };
        }
    });

    useEffect(() => {
        localStorage.setItem('riq-converter-favs', JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
        setSearchQuery('');
        setAnimateCards(false);
        if (activeCategory === 'Temperature') {
            setFromUnit('C');
        } else {
            const units = CATEGORY_MAP[activeCategory];
            const keys = Object.keys(units);
            const defaultUnit = keys.find(k => units[k].factor === 1) || keys[0];
            setFromUnit(defaultUnit);
        }
        // Trigger stagger animation
        requestAnimationFrame(() => {
            setTimeout(() => setAnimateCards(true), 50);
        });
    }, [activeCategory]);

    // Also animate on input change
    useEffect(() => {
        setAnimateCards(false);
        requestAnimationFrame(() => {
            setTimeout(() => setAnimateCards(true), 30);
        });
    }, [inputValue, fromUnit]);

    const toggleFavorite = (unitKey: string) => {
        setFavorites(prev => {
            const catFavs = prev[activeCategory] || [];
            if (catFavs.includes(unitKey)) {
                return { ...prev, [activeCategory]: catFavs.filter(k => k !== unitKey) };
            }
            return { ...prev, [activeCategory]: [...catFavs, unitKey] };
        });
    };

    const handleCopy = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const allResults = useMemo(() => {
        const num = parseFloat(inputValue);
        if (!inputValue || isNaN(num)) return [];

        if (activeCategory === 'Temperature') {
            const validTempUnits: TempUnit[] = ['C', 'F', 'K', 'R'];
            if (!validTempUnits.includes(fromUnit as TempUnit)) return [];
            const results = convertTempAll(num, fromUnit as TempUnit);
            return Object.entries(results).map(([key, data]) => ({
                key,
                label: data.label,
                symbol: data.symbol,
                result: data.result
            }));
        }

        const units = CATEGORY_MAP[activeCategory];
        if (!units[fromUnit]) return [];
        const inBase = num * units[fromUnit].factor;
        return Object.keys(units).map(key => ({
            key,
            label: units[key].label,
            symbol: units[key].symbol,
            result: inBase / units[key].factor
        }));
    }, [inputValue, fromUnit, activeCategory]);

    const formatValue = (val: number) => {
        if (precision === 'auto') return formatResult(val);
        if (precision === '4') return parseFloat(val.toFixed(4)).toString();
        return parseFloat(val.toFixed(8)).toString();
    };

    const displayUnits = useMemo(() => {
        if (!allResults.length) return [];

        let filtered = allResults;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(u =>
                u.label.toLowerCase().includes(q) || u.symbol.toLowerCase().includes(q)
            );
        }

        const catFavs = favorites[activeCategory] || [];
        return [...filtered].sort((a, b) => {
            const aFav = catFavs.includes(a.key);
            const bFav = catFavs.includes(b.key);
            if (aFav && !bFav) return -1;
            if (!aFav && bFav) return 1;
            return a.label.localeCompare(b.label);
        });
    }, [allResults, searchQuery, favorites, activeCategory]);

    const availableUnitsDropdown = useMemo(() => {
        if (activeCategory === 'Temperature') {
            return [
                { key: 'C', label: 'Celsius (°C)', isFav: favorites.Temperature.includes('C') },
                { key: 'F', label: 'Fahrenheit (°F)', isFav: favorites.Temperature.includes('F') },
                { key: 'K', label: 'Kelvin (K)', isFav: favorites.Temperature.includes('K') },
                { key: 'R', label: 'Rankine (°R)', isFav: favorites.Temperature.includes('R') },
            ];
        }
        const units = CATEGORY_MAP[activeCategory];
        const catFavs = favorites[activeCategory] || [];
        return Object.keys(units).map(key => ({
            key,
            label: `${units[key].label} (${units[key].symbol})`,
            isFav: catFavs.includes(key)
        })).sort((a, b) => {
            if (a.isFav && !b.isFav) return -1;
            if (!a.isFav && b.isFav) return 1;
            return a.label.localeCompare(b.label);
        });
    }, [activeCategory, favorites]);

    const activeGradient = CATEGORY_GRADIENTS[activeCategory];

    return (
        <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">

            {/* ─── Gradient Header ─── */}
            <div className={`relative bg-gradient-to-r ${activeGradient} px-6 py-5 shrink-0 z-10 transition-all duration-500`}>
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-sm" />
                <div className="absolute bottom-0 left-1/3 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 blur-sm" />

                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white backdrop-blur-sm transition-all duration-200 hover:scale-105 active:scale-95"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-white flex items-center gap-2.5 font-display tracking-tight">
                                <span className="text-2xl">{CATEGORY_ICONS[activeCategory]}</span>
                                Universal Unit Converter
                            </h1>
                            <p className="text-white/70 text-xs font-medium mt-0.5">Type once, see all conversions instantly</p>
                        </div>
                    </div>

                    {/* Decimal Precision Controls */}
                    <div className="hidden sm:flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                        <span className="text-white/70 text-xs font-semibold whitespace-nowrap flex items-center gap-1.5">
                            <SlidersHorizontal size={13} />
                            Decimals
                        </span>
                        <div className="flex gap-1">
                            {([
                                { key: 'auto' as const, label: 'Smart' },
                                { key: '4' as const, label: '4 Digits' },
                                { key: '8' as const, label: '8 Digits' },
                            ]).map(p => (
                                <button
                                    key={p.key}
                                    onClick={() => setPrecision(p.key)}
                                    title={p.key === 'auto' ? 'Automatically picks the best precision' : `Show ${p.key} decimal places`}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${precision === p.key
                                        ? 'bg-white text-slate-800 shadow-lg shadow-black/10'
                                        : 'text-white/80 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

                    {/* ─── Category Tabs with Icons ─── */}
                    <div className="overflow-x-auto custom-scrollbar pb-1 -mx-1 px-1">
                        <div className="flex gap-2 min-w-max">
                            {CATEGORIES.map(cat => {
                                const isActive = activeCategory === cat;
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap ${isActive
                                            ? `bg-gradient-to-r ${CATEGORY_GRADIENTS[cat]} text-white shadow-lg shadow-slate-900/10 scale-[1.02]`
                                            : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 hover:border-slate-300 hover:shadow-sm'
                                            }`}
                                    >
                                        <span className={`text-base transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                            {CATEGORY_ICONS[cat]}
                                        </span>
                                        {cat}
                                        {isActive && (
                                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 bg-white/60 rounded-full" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ─── Input Area — Glassmorphism Card ─── */}
                    <div className="relative bg-white rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-200/50 overflow-hidden">
                        {/* Gradient accent bar at top */}
                        <div className={`h-1 bg-gradient-to-r ${activeGradient}`} />

                        {/* Decorative background */}
                        <div className="absolute top-4 right-4 opacity-[0.04] pointer-events-none">
                            <RefreshCw size={160} strokeWidth={1} />
                        </div>

                        <div className="relative z-10 p-6 sm:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                                {/* Value Input */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${activeGradient}`} />
                                        Value to Convert
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type="number"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder="0"
                                            className="w-full text-4xl sm:text-5xl font-black bg-transparent border-0 border-b-3 border-slate-200 focus:border-primary focus:ring-0 p-0 text-slate-900 placeholder:text-slate-200 transition-all duration-300 py-3 group-hover:border-slate-300"
                                        />
                                        <div className={`absolute bottom-0 left-0 h-[3px] bg-gradient-to-r ${activeGradient} transition-all duration-500 w-0 group-focus-within:w-full`} />
                                    </div>
                                </div>

                                {/* Unit Selector */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <ArrowRightLeft size={12} />
                                        From Unit
                                    </label>
                                    <div className="relative group">
                                        <select
                                            value={fromUnit}
                                            onChange={(e) => setFromUnit(e.target.value)}
                                            className="w-full text-lg font-bold bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-4 pr-12 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 cursor-pointer appearance-none text-slate-800 hover:shadow-md"
                                        >
                                            {availableUnitsDropdown.map(u => (
                                                <option key={u.key} value={u.key}>
                                                    {u.isFav ? '★ ' : ''}{u.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-slate-600 transition-colors">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ─── Results Header ─── */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-bold text-slate-800 font-display">
                                Conversions
                            </h2>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r ${activeGradient} text-white`}>
                                {displayUnits.length}
                            </span>
                        </div>
                        <div className="relative w-full max-w-xs group">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Filter units..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm hover:shadow-md transition-all duration-200"
                            />
                        </div>
                    </div>

                    {/* ─── Results Grid ─── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {displayUnits.map((unit, idx) => {
                            const isFav = (favorites[activeCategory] || []).includes(unit.key);
                            const formattedVal = formatValue(unit.result);
                            const isCurrentFrom = unit.key === fromUnit;
                            const staggerDelay = Math.min(idx * 40, 400);

                            return (
                                <div
                                    key={unit.key}
                                    style={{
                                        transitionDelay: animateCards ? `${staggerDelay}ms` : '0ms',
                                        opacity: animateCards ? 1 : 0,
                                        transform: animateCards ? 'translateY(0)' : 'translateY(12px)',
                                    }}
                                    className={`group relative rounded-2xl transition-all duration-300 ease-out cursor-default overflow-hidden ${isCurrentFrom
                                        ? 'ring-2 ring-primary/30 shadow-lg shadow-primary/10'
                                        : 'hover:shadow-lg hover:-translate-y-0.5 shadow-sm'
                                        }`}
                                >
                                    {/* Card gradient accent (top) */}
                                    <div className={`h-0.5 ${isCurrentFrom
                                        ? `bg-gradient-to-r ${activeGradient}`
                                        : 'bg-gradient-to-r from-transparent via-slate-200 to-transparent group-hover:from-slate-300 group-hover:via-slate-400 group-hover:to-slate-300'
                                        } transition-all duration-300`} />

                                    <div className={`p-5 ${isCurrentFrom ? 'bg-gradient-to-br from-primary/5 to-primary/[0.02]' : 'bg-white'}`}>
                                        {/* Top row: Label & Actions */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-2 pr-16 min-w-0">
                                                <span className="font-semibold text-slate-600 text-sm leading-tight truncate">
                                                    {unit.label}
                                                </span>
                                                {isCurrentFrom && (
                                                    <span className={`px-2 py-0.5 rounded-full bg-gradient-to-r ${activeGradient} text-white text-[10px] font-bold uppercase tracking-wider shrink-0 shadow-sm`}>
                                                        Input
                                                    </span>
                                                )}
                                            </div>

                                            <div className="absolute top-6 right-4 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                                <button
                                                    onClick={() => toggleFavorite(unit.key)}
                                                    className={`p-1.5 rounded-lg transition-all duration-200 hover:scale-110 ${isFav ? 'text-amber-500 hover:bg-amber-50' : 'text-slate-300 hover:bg-slate-100 hover:text-slate-500'}`}
                                                    title={isFav ? "Unpin" : "Pin to top"}
                                                >
                                                    <Star size={15} fill={isFav ? "currentColor" : "none"} />
                                                </button>
                                                <button
                                                    onClick={() => handleCopy(`${formattedVal} ${unit.symbol}`, unit.key)}
                                                    className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-100 hover:text-slate-500 transition-all duration-200 hover:scale-110"
                                                    title="Copy result"
                                                >
                                                    {copiedKey === unit.key
                                                        ? <CheckCircle2 size={15} className="text-emerald-500" />
                                                        : <Copy size={15} />
                                                    }
                                                </button>
                                            </div>
                                        </div>

                                        {/* Value & Symbol */}
                                        <div className="flex items-baseline gap-2 overflow-hidden">
                                            <span
                                                className={`text-2xl font-black truncate ${isCurrentFrom ? 'text-primary' : 'text-slate-900'}`}
                                                title={unit.result.toString()}
                                            >
                                                {formattedVal}
                                            </span>
                                            <span className="text-slate-400 font-bold text-sm shrink-0">
                                                {unit.symbol}
                                            </span>
                                        </div>

                                        {/* Swap button */}
                                        {!isCurrentFrom && (
                                            <button
                                                onClick={() => {
                                                    setFromUnit(unit.key);
                                                    setInputValue(unit.result.toString());
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                className={`mt-3 w-full flex items-center justify-center gap-2 bg-gradient-to-r ${activeGradient} text-white rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-all duration-300 text-xs font-bold tracking-wide hover:shadow-md hover:shadow-primary/20 translate-y-1 group-hover:translate-y-0 active:scale-[0.98]`}
                                            >
                                                <ArrowRightLeft size={13} />
                                                Convert from this
                                            </button>
                                        )}

                                        {/* Favorite indicator (always visible) */}
                                        {isFav && (
                                            <div className="absolute top-5 right-4 group-hover:opacity-0 transition-opacity duration-200">
                                                <Star size={14} className="text-amber-400" fill="currentColor" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Empty State */}
                    {displayUnits.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                                <Search className="h-7 w-7 text-slate-400" />
                            </div>
                            <h3 className="text-sm font-bold text-slate-700">No units found</h3>
                            <p className="text-sm text-slate-400 mt-1">Try adjusting your search query.</p>
                        </div>
                    )}

                    {/* Bottom spacing */}
                    <div className="h-4" />
                </div>
            </div>
        </div>
    );
};
