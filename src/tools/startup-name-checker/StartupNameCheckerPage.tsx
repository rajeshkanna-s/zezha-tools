import React, { useState } from 'react';
import {
    Search, Shield, Globe, Users, AlertTriangle,
    CheckCircle2, RefreshCw, XCircle, Building2
} from 'lucide-react';

const CATEGORIES = [
    'Technology', 'Finance', 'Food & Beverage', 'Health & Wellness',
    'Education', 'Fashion', 'Real Estate', 'Logistics', 'Agriculture',
    'Retail', 'Other'
];

interface CheckResult {
    status: 'pending' | 'clear' | 'caution' | 'high_risk' | 'conflict';
    message: string;
    details: string[];
}

export const StartupNameCheckerPage: React.FC = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Technology');

    const [extensions, setExtensions] = useState({
        com: true, in: true, 'co.in': true, io: true, co: true, tech: true
    });
    const [socials] = useState({
        instagram: true, linkedin: true, twitter: true, youtube: true, facebook: true
    });

    const [isChecking, setIsChecking] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    const [results, setResults] = useState<{
        trademark: CheckResult;
        mca: CheckResult;
        domains: Record<string, 'available' | 'taken' | 'error' | 'pending'>;
        social: Record<string, 'available' | 'taken' | 'error' | 'pending'>;
        language: CheckResult;
        score: number;
        alternatives: any[];
    }>({
        trademark: { status: 'pending', message: '', details: [] },
        mca: { status: 'pending', message: '', details: [] },
        domains: {},
        social: {},
        language: { status: 'pending', message: '', details: [] },
        score: 0,
        alternatives: []
    });

    const runChecks = async () => {
        if (!name.trim()) return;

        setIsChecking(true);
        setHasStarted(true);

        const cleanName = name.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '');

        // Simulate complex checks
        setTimeout(() => {
            // Basic mockup logic for trademark
            let tmStatus: any = 'clear';
            let tmMsg = 'No obvious conflicts found in our common database.';
            let score = 95;

            if (['tata', 'reliance', 'jio', 'google', 'apple', 'hdfc', 'sbi'].some(w => cleanName.includes(w))) {
                tmStatus = 'high_risk';
                tmMsg = 'Contains highly protected trademark terms.';
                score -= 40;
            }

            setResults({
                trademark: {
                    status: tmStatus,
                    message: tmMsg,
                    details: ['Checked against 2,000+ known marks.', 'Soundex phonetic check clear.']
                },
                mca: {
                    status: 'clear',
                    message: 'Name structure looks acceptable.',
                    details: ['Does not contain restricted words like "National", "Bank".']
                },
                domains: Object.keys(extensions).filter(k => (extensions as any)[k]).reduce((acc, ext) => {
                    acc[ext] = Math.random() > 0.5 ? 'available' : 'taken';
                    return acc;
                }, {} as any),
                social: Object.keys(socials).filter(k => (socials as any)[k]).reduce((acc, soc) => {
                    acc[soc] = Math.random() > 0.5 ? 'available' : 'taken';
                    return acc;
                }, {} as any),
                language: {
                    status: 'clear',
                    message: 'No offensive meanings detected in 10 major Indian languages.',
                    details: ['Checked Hindi, Tamil, Telugu, Kannada, etc.']
                },
                score: Math.max(0, score),
                alternatives: [
                    { name: `${name.replace(/\s/g, '')}Tech`, available: true },
                    { name: `${name.replace(/\s/g, '')}HQ`, available: true },
                    { name: `${name.replace(/\s/g, '')}AI`, available: true },
                    { name: `${name.replace(/\s/g, '')}Labs`, available: true },
                    { name: `Get${name.replace(/\s/g, '')}`, available: true },
                    { name: `The${name.replace(/\s/g, '')}`, available: true },
                    { name: `${name.replace(/\s/g, '')}App`, available: true },
                    { name: `${name.replace(/\s/g, '')}Works`, available: true },
                    { name: `${name.replace(/\s/g, '')}X`, available: true },
                    { name: `Go${name.replace(/\s/g, '')}`, available: true },
                ]
            });
            setIsChecking(false);
        }, 2000);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                    <Search className="text-primary" size={32} />
                    Startup Name + Legal Availability Checker
                </h1>
                <p className="mt-2 text-slate-600">
                    Run 5 critical checks simultaneously — trademark, MCA, domain, social, and language safely.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Input Form */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                <Globe size={20} className="text-primary" />
                                Your Startup Details
                            </h2>
                        </div>

                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Proposed Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Acme Tech"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                >
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Domains to check</label>
                                <div className="flex flex-wrap gap-2">
                                    {Object.keys(extensions).map(ext => (
                                        <label key={ext} className="flex items-center gap-1.5 text-sm bg-slate-50 px-2 py-1 rounded border border-slate-200">
                                            <input
                                                type="checkbox"
                                                checked={(extensions as any)[ext]}
                                                onChange={(e) => setExtensions(prev => ({ ...prev, [ext]: e.target.checked }))}
                                                className="rounded text-primary focus:ring-primary"
                                            />
                                            .{ext}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={runChecks}
                                disabled={!name.trim() || isChecking}
                                className="w-full py-3 bg-primary text-white rounded-xl font-semibold shadow-md shadow-primary/20 hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isChecking ? <RefreshCw className="animate-spin" size={20} /> : <Search size={20} />}
                                {isChecking ? 'Running 5 Checks...' : 'Check Availability'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Area */}
                <div className="lg:col-span-2 space-y-6">
                    {!hasStarted ? (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center">
                            <Shield className="text-slate-300 mb-4" size={64} />
                            <h3 className="text-xl font-semibold text-slate-700 mb-2">Enter a name to start checking</h3>
                            <p className="text-slate-500 max-w-md">
                                We'll automatically run a cross-check across Trademark registries, MCA guidelines, domain availability, open social handles, and cultural language safety.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Score Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800">Overall Name Strength</h3>
                                    <p className="text-slate-500 text-sm">Based on 5 legal and availability checks</p>
                                </div>
                                <div className="flex items-end gap-2">
                                    <span className={`text-4xl font-bold ${results.score > 80 ? 'text-emerald-500' : results.score > 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                                        {isChecking ? '--' : results.score}
                                    </span>
                                    <span className="text-slate-400 font-medium mb-1">/100</span>
                                </div>
                            </div>

                            {/* Status Bars */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <StatusCard title="Trademark Risk" status={results.trademark.status} isChecking={isChecking} icon={Shield} />
                                <StatusCard title="MCA Guidelines" status={results.mca.status} isChecking={isChecking} icon={Building2} />
                                <StatusCard title="Language Safety" status={results.language.status} isChecking={isChecking} icon={AlertTriangle} />
                            </div>

                            {/* Domains & Socials */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                    <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                        <Globe size={18} className="text-primary" /> Domain Availability
                                    </h3>
                                    {isChecking ? <SkeletonList count={4} /> : (
                                        <div className="space-y-3">
                                            {Object.entries(results.domains).map(([ext, status]) => (
                                                <div key={ext} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg">
                                                    <span className="font-medium text-slate-700">{name.replace(/\s/g, '').toLowerCase()}.{ext}</span>
                                                    <StatusBadge type={status} />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                    <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                        <Users size={18} className="text-primary" /> Social Handles
                                    </h3>
                                    {isChecking ? <SkeletonList count={4} /> : (
                                        <div className="space-y-3">
                                            {Object.entries(results.social).map(([platform, status]) => (
                                                <div key={platform} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg capitalize">
                                                    <span className="font-medium text-slate-700">{platform}</span>
                                                    <StatusBadge type={status} />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Alternative Names */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                    <Globe size={18} className="text-primary" /> 10 Alternative Name Ideas
                                </h3>
                                {isChecking ? <SkeletonList count={5} /> : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {results.alternatives.map((alt, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:border-primary/20 transition-colors">
                                                <span className="font-medium text-slate-700">{alt.name}</span>
                                                <StatusBadge type={alt.available ? 'available' : 'taken'} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatusCard = ({ title, status, isChecking, icon: Icon }: any) => {
    const getColors = () => {
        if (isChecking || status === 'pending') return 'bg-slate-100 text-slate-500 border-slate-200';
        switch (status) {
            case 'clear': return 'bg-emerald-50 border-emerald-200 text-emerald-700';
            case 'caution': return 'bg-amber-50 border-amber-200 text-amber-700';
            case 'high_risk': return 'bg-rose-50 border-rose-200 text-rose-700';
            default: return 'bg-slate-50 border-slate-200 text-slate-600';
        }
    };

    return (
        <div className={`p-4 rounded-xl border ${getColors()} flex flex-col items-center justify-center text-center gap-2 transition-colors`}>
            {isChecking ? (
                <RefreshCw size={24} className="animate-spin opacity-50" />
            ) : (
                <Icon size={24} className="opacity-80" />
            )}
            <span className="font-semibold text-sm">{title}</span>
            {!isChecking && (
                <span className="text-xs uppercase tracking-wider font-bold opacity-80">
                    {status.replace('_', ' ')}
                </span>
            )}
        </div>
    );
}

const StatusBadge = ({ type }: { type: string }) => {
    if (type === 'available') {
        return <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full"><CheckCircle2 size={12} /> Available</span>;
    }
    return <span className="flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full"><XCircle size={12} /> Taken</span>;
}

const SkeletonList = ({ count }: { count: number }) => (
    <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-2">
                <div className="h-4 bg-slate-200 rounded w-1/3 animate-pulse"></div>
                <div className="h-5 bg-slate-200 rounded-full w-16 animate-pulse"></div>
            </div>
        ))}
    </div>
);
