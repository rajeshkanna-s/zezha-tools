import React, { useState, useMemo } from 'react';
import { GOVT_SCHEMES, INDIAN_STATES, CATEGORY_META } from './govtSchemesData';
import type { UserProfile, GovtScheme } from './govtSchemesData';

/* ─── Chip Component ────────────────────────────────────────── */
const Chip: React.FC<{ label: string; value: string; selected: boolean; onClick: () => void }> = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-150 ${selected
      ? 'bg-primary/10 border-primary text-primary shadow-sm'
      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
      }`}
  >{label}</button>
);

const ITEMS_PER_PAGE = 20;

/* ─── Main Component ────────────────────────────────────────── */
export const GovtSchemeFinder: React.FC = () => {
  /* Mode: 'home' | 'finder' | 'browse' */
  const [mode, setMode] = useState<'home' | 'finder' | 'browse'>('home');
  const [step, setStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterCat, setFilterCat] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  /* ─── Browse-mode filters ─── */
  const [searchQ, setSearchQ] = useState('');
  const [browseState, setBrowseState] = useState('all');
  const [browseCat, setBrowseCat] = useState('all');
  const [browseTag, setBrowseTag] = useState('all');
  const [browsePage, setBrowsePage] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);

  /* Advanced browse filters */
  const [browseMinistry, setBrowseMinistry] = useState('all');
  const [browseGender, setBrowseGender] = useState('all');
  const [browseArea, setBrowseArea] = useState('all');
  const [browseSocial, setBrowseSocial] = useState('all');
  const [browseEdu, setBrowseEdu] = useState('all');
  const [browseEmploy, setBrowseEmploy] = useState('all');
  const [browseIncome, setBrowseIncome] = useState('all');
  const [browseLifeStage, setBrowseLifeStage] = useState('all');
  const [browseBenefitRange, setBrowseBenefitRange] = useState('all');

  // Form state
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [area, setArea] = useState('');
  const [income, setIncome] = useState('');
  const [category, setCategory] = useState('');
  const [employment, setEmployment] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [lifeStage, setLifeStage] = useState<string[]>([]);
  const [needs, setNeeds] = useState<string[]>([]);
  const [ownHouse, setOwnHouse] = useState('');
  const [ownLand, setOwnLand] = useState('');
  const [healthIns, setHealthIns] = useState('');
  const [toilet, setToilet] = useState('');
  const [bizType, setBizType] = useState('none');
  const [education, setEducation] = useState('');
  const [special, setSpecial] = useState<string[]>([]);

  const toggleMulti = (arr: string[], val: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const profile: UserProfile = {
    age: parseInt(age) || 0, gender, state: stateVal, area, income, category, employment,
    bankAccount, lifeStage, needs, ownHouse, ownLand, healthIns, toilet, bizType, education, special,
  };

  /* ─── Finder results ─── */
  const matchedSchemes = useMemo(() => {
    if (!showResults) return [];
    return GOVT_SCHEMES.filter(s => { try { return s.match(profile); } catch { return false; } });
  }, [showResults, profile]);

  const filteredSchemes = useMemo(() => {
    if (filterCat === 'all') return matchedSchemes;
    return matchedSchemes.filter(s => s.category === filterCat);
  }, [matchedSchemes, filterCat]);

  const catCounts = useMemo(() => {
    const c: Record<string, number> = {};
    matchedSchemes.forEach(s => { c[s.category] = (c[s.category] || 0) + 1; });
    return c;
  }, [matchedSchemes]);

  const totalBenefit = useMemo(() => matchedSchemes.reduce((s, x) => s + x.amount, 0), [matchedSchemes]);

  /* ─── Browse: all unique tags and categories ─── */
  const allCategories = useMemo(() => {
    const cats = new Set(GOVT_SCHEMES.map(s => s.category));
    return Array.from(cats).sort();
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set(GOVT_SCHEMES.map(s => s.tag));
    return Array.from(tags).sort();
  }, []);

  const allMinistries = useMemo(() => {
    const m = new Set(GOVT_SCHEMES.map(s => s.ministry));
    return Array.from(m).sort();
  }, []);

  /* ─── Browse: filtered schemes ─── */
  const browseFiltered = useMemo(() => {
    let arr = [...GOVT_SCHEMES];

    // Text search
    if (searchQ.trim()) {
      const q = searchQ.toLowerCase().trim();
      arr = arr.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.about.toLowerCase().includes(q) ||
        s.tag.toLowerCase().includes(q) ||
        s.benefitAmount.toLowerCase().includes(q) ||
        s.ministry.toLowerCase().includes(q)
      );
    }

    // State filter
    if (browseState !== 'all') {
      arr = arr.filter(s =>
        s.ministry.toLowerCase().includes(browseState.toLowerCase()) ||
        s.ministry.toLowerCase().includes('government of india') ||
        s.ministry === 'Government of India'
      );
    }

    // Category filter
    if (browseCat !== 'all') {
      arr = arr.filter(s => s.category === browseCat);
    }

    // Tag filter
    if (browseTag !== 'all') {
      arr = arr.filter(s => s.tag === browseTag);
    }

    // Ministry filter
    if (browseMinistry !== 'all') {
      arr = arr.filter(s => s.ministry === browseMinistry);
    }

    // Benefit amount range
    if (browseBenefitRange !== 'all') {
      const ranges: Record<string, [number, number]> = {
        '0-10000': [0, 10000], '10001-50000': [10001, 50000], '50001-200000': [50001, 200000],
        '200001-500000': [200001, 500000], '500001+': [500001, Infinity],
      };
      const [min, max] = ranges[browseBenefitRange] || [0, Infinity];
      arr = arr.filter(s => s.amount >= min && s.amount <= max);
    }

    // Gender filter (keyword in eligibility/about)
    if (browseGender !== 'all') {
      const kw: Record<string, string[]> = {
        female: ['women', 'female', 'girl', 'mother', 'pregnant', 'widow', 'mahila'],
        male: ['male', 'men', 'boy'],
        transgender: ['transgender', 'trans'],
      };
      const words = kw[browseGender] || [];
      arr = arr.filter(s => {
        const text = `${s.about} ${s.eligibility.join(' ')} ${s.whoShouldApply}`.toLowerCase();
        return words.some(w => text.includes(w));
      });
    }

    // Area type filter
    if (browseArea !== 'all') {
      const kw: Record<string, string[]> = {
        rural: ['rural', 'village', 'gram', 'gramin'],
        urban: ['urban', 'city', 'municipal', 'nagar'],
      };
      const words = kw[browseArea] || [];
      arr = arr.filter(s => {
        const text = `${s.about} ${s.eligibility.join(' ')} ${s.whoShouldApply}`.toLowerCase();
        return words.some(w => text.includes(w));
      });
    }

    // Social category filter
    if (browseSocial !== 'all') {
      const kw: Record<string, string[]> = {
        sc: ['sc', 'scheduled caste', 'dalit'],
        st: ['st', 'scheduled tribe', 'tribal', 'adivasi'],
        obc: ['obc', 'other backward'],
        minority: ['minority', 'muslim', 'christian', 'sikh', 'buddhist', 'jain', 'parsi'],
        general: ['general', 'all categories', 'all citizens'],
      };
      const words = kw[browseSocial] || [];
      arr = arr.filter(s => {
        const text = `${s.about} ${s.eligibility.join(' ')} ${s.whoShouldApply}`.toLowerCase();
        return words.some(w => text.includes(w));
      });
    }

    // Education level filter
    if (browseEdu !== 'all') {
      const kw: Record<string, string[]> = {
        'no-formal': ['no formal', 'illiterate', 'uneducated'],
        'school': ['school', 'class', 'secondary', 'primary', 'matriculation'],
        'graduate': ['graduate', 'degree', 'bachelor', 'b.a', 'b.sc', 'b.com', 'b.tech'],
        'post-graduate': ['post-graduate', 'post graduate', 'master', 'm.a', 'm.sc', 'phd', 'doctorate'],
      };
      const words = kw[browseEdu] || [];
      arr = arr.filter(s => {
        const text = `${s.about} ${s.eligibility.join(' ')}`.toLowerCase();
        return words.some(w => text.includes(w));
      });
    }

    // Employment filter
    if (browseEmploy !== 'all') {
      const kw: Record<string, string[]> = {
        farmer: ['farmer', 'kisan', 'agricultural', 'farming', 'crop'],
        student: ['student', 'scholarship', 'education'],
        unemployed: ['unemployed', 'jobless', 'job seeker'],
        self_employed: ['self-employed', 'self employed', 'entrepreneur', 'startup', 'msme', 'business'],
        salaried: ['salaried', 'employee', 'organized sector'],
        labour: ['labour', 'labor', 'worker', 'unorganised', 'unorganized', 'construction'],
      };
      const words = kw[browseEmploy] || [];
      arr = arr.filter(s => {
        const text = `${s.about} ${s.eligibility.join(' ')} ${s.whoShouldApply}`.toLowerCase();
        return words.some(w => text.includes(w));
      });
    }

    // Income filter
    if (browseIncome !== 'all') {
      const kw: Record<string, string[]> = {
        bpl: ['bpl', 'below poverty', 'poor', 'destitute', 'antyodaya'],
        low: ['low income', 'economically weaker', 'ews', 'lig'],
        middle: ['middle income', 'middle class'],
      };
      const words = kw[browseIncome] || [];
      arr = arr.filter(s => {
        const text = `${s.about} ${s.eligibility.join(' ')} ${s.whoShouldApply}`.toLowerCase();
        return words.some(w => text.includes(w));
      });
    }

    // Life stage filter
    if (browseLifeStage !== 'all') {
      const kw: Record<string, string[]> = {
        senior: ['senior', 'elderly', 'old age', '60 years', 'pension'],
        children: ['child', 'children', 'infant', 'newborn', 'kid'],
        pregnant: ['pregnant', 'maternity', 'lactating', 'mother'],
        youth: ['youth', 'young', '18-35', 'adolescent'],
        disabled: ['disabled', 'disability', 'differently abled', 'handicapped', 'divyang'],
        widow: ['widow', 'destitute women'],
      };
      const words = kw[browseLifeStage] || [];
      arr = arr.filter(s => {
        const text = `${s.about} ${s.eligibility.join(' ')} ${s.whoShouldApply}`.toLowerCase();
        return words.some(w => text.includes(w));
      });
    }

    return arr;
  }, [searchQ, browseState, browseCat, browseTag, browseMinistry, browseBenefitRange, browseGender, browseArea, browseSocial, browseEdu, browseEmploy, browseIncome, browseLifeStage]);

  const browseCatCounts = useMemo(() => {
    const c: Record<string, number> = {};
    browseFiltered.forEach(s => { c[s.category] = (c[s.category] || 0) + 1; });
    return c;
  }, [browseFiltered]);

  const totalPages = Math.ceil(browseFiltered.length / ITEMS_PER_PAGE);
  const paginatedSchemes = browseFiltered.slice((browsePage - 1) * ITEMS_PER_PAGE, browsePage * ITEMS_PER_PAGE);

  /* ─── Handlers ─── */
  const handleFind = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setShowResults(true); }, 1800);
  };

  const handleReset = () => {
    setShowResults(false); setStep(1); setFilterCat('all'); setExpandedId(null);
    setAge(''); setGender(''); setStateVal(''); setArea(''); setIncome('');
    setCategory(''); setEmployment(''); setBankAccount('');
    setLifeStage([]); setNeeds([]); setOwnHouse(''); setOwnLand('');
    setHealthIns(''); setToilet(''); setBizType('none'); setEducation(''); setSpecial([]);
    setMode('home');
  };

  const handleBrowseReset = () => {
    setSearchQ(''); setBrowseState('all'); setBrowseCat('all'); setBrowseTag('all'); setBrowsePage(1);
    setBrowseMinistry('all'); setBrowseGender('all'); setBrowseArea('all'); setBrowseSocial('all');
    setBrowseEdu('all'); setBrowseEmploy('all'); setBrowseIncome('all'); setBrowseLifeStage('all');
    setBrowseBenefitRange('all');
  };

  const goStep = (n: number) => setStep(n);
  const pct = step * 20;

  const fmtAmount = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(1)} Lakh` : `₹${n.toLocaleString('en-IN')}`;

  /* ─── RENDER ──────────────────────────────────────────────── */
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 pb-20">
      {/* Hero */}
      <div className="hero-gradient rounded-3xl p-6 sm:p-10 mb-8 text-center relative overflow-hidden">
        <div className="hero-glow" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 glass-chip rounded-full px-4 py-1.5 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-5 animate-float">
            🇮🇳 Built for 1.4 Billion Indians
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 mb-2 leading-tight">
            Government Scheme <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-600 bg-clip-text text-transparent">Finder</span>
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto mb-6">
            Discover every government scheme, subsidy, and benefit you're eligible for. Crores go unclaimed every year.
          </p>
          <div className="flex justify-center gap-4 sm:gap-6 flex-wrap mb-8">
            {[[`${GOVT_SCHEMES.length}+`, 'Schemes Tracked', '📊'], ['₹18L Cr', 'Annual Budget', '💰'], ['100%', 'Free Forever', '🎯']].map(([v, l, ic]) => (
              <div key={l as string} className="glass-card rounded-xl px-5 py-3 min-w-[100px]">
                <div className="text-lg mb-0.5">{ic}</div>
                <div className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">{v}</div>
                <div className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">{l}</div>
              </div>
            ))}
          </div>

          {/* ─── Mode Buttons ─── */}
          {mode === 'home' && (
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in">
              <button
                onClick={() => setMode('finder')}
                className="group px-7 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-lg hover:shadow-2xl hover:shadow-amber-500/25 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 justify-center"
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold">Find My Schemes</div>
                  <div className="text-[10px] text-white/70 font-normal">Answer 5 questions to get matched</div>
                </div>
              </button>
              <button
                onClick={() => setMode('browse')}
                className="group px-7 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold shadow-lg hover:shadow-2xl hover:shadow-indigo-500/25 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 justify-center"
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold">Browse All Schemes</div>
                  <div className="text-[10px] text-white/70 font-normal">Explore & filter {GOVT_SCHEMES.length}+ schemes</div>
                </div>
              </button>
            </div>
          )}

          {mode !== 'home' && !showResults && !loading && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full glass-card text-xs text-slate-600 font-medium hover:shadow-md transition-all mt-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Back to Home
            </button>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ─── BROWSE ALL SCHEMES MODE ─── */}
      {/* ══════════════════════════════════════════════════════════ */}
      {mode === 'browse' && (
        <div className="animate-fade-in">
          {/* Filter Bar */}
          <div className="glass-card rounded-2xl p-4 sm:p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                Filter Schemes
              </h2>
              <button
                onClick={handleBrowseReset}
                className="text-[10px] text-slate-400 hover:text-red-500 font-semibold uppercase tracking-wide transition-colors"
              >
                ✕ Clear All
              </button>
            </div>

            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input
                  type="text"
                  placeholder="Search schemes by name, benefit, ministry..."
                  value={searchQ}
                  onChange={e => { setSearchQ(e.target.value); setBrowsePage(1); }}
                  className="input-field"
                  style={{ paddingLeft: '2.25rem' }}
                />
              </div>
            </div>

            {/* Dropdowns Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {/* State Filter */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">State</label>
                <select
                  value={browseState}
                  onChange={e => { setBrowseState(e.target.value); setBrowsePage(1); }}
                  className="input-field"
                >
                  <option value="all">🇮🇳 All States (Central + State)</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Category</label>
                <select
                  value={browseCat}
                  onChange={e => { setBrowseCat(e.target.value); setBrowsePage(1); }}
                  className="input-field"
                >
                  <option value="all">All Categories</option>
                  {allCategories.map(cat => {
                    const meta = CATEGORY_META[cat] || { icon: '📋', label: cat };
                    return <option key={cat} value={cat}>{meta.icon} {meta.label}</option>;
                  })}
                </select>
              </div>

              {/* Tag Filter */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Scheme Type</label>
                <select
                  value={browseTag}
                  onChange={e => { setBrowseTag(e.target.value); setBrowsePage(1); }}
                  className="input-field"
                >
                  <option value="all">All Types</option>
                  {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                </select>
              </div>
            </div>

            {/* ─── Advanced Filters Toggle ─── */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all mb-3 ${showAdvanced ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'}`}
            >
              <span className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                Advanced Filters
              </span>
              <span className="text-[10px]">{showAdvanced ? '▲ Hide' : '▼ Show 9 more filters'}</span>
            </button>

            {/* ─── Advanced Filters Grid ─── */}
            {showAdvanced && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 p-3 bg-slate-50/60 rounded-xl border border-slate-100 animate-fade-in">
                {/* Ministry */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">🏛️ Ministry</label>
                  <select value={browseMinistry} onChange={e => { setBrowseMinistry(e.target.value); setBrowsePage(1); }} className="input-field">
                    <option value="all">All Ministries</option>
                    {allMinistries.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                {/* Benefit Amount */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">💰 Benefit Amount</label>
                  <select value={browseBenefitRange} onChange={e => { setBrowseBenefitRange(e.target.value); setBrowsePage(1); }} className="input-field">
                    <option value="all">Any Amount</option>
                    <option value="0-10000">Up to ₹10,000</option>
                    <option value="10001-50000">₹10,001 – ₹50,000</option>
                    <option value="50001-200000">₹50,001 – ₹2,00,000</option>
                    <option value="200001-500000">₹2,00,001 – ₹5,00,000</option>
                    <option value="500001+">₹5,00,001+</option>
                  </select>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">👤 Gender</label>
                  <select value={browseGender} onChange={e => { setBrowseGender(e.target.value); setBrowsePage(1); }} className="input-field">
                    <option value="all">All Genders</option>
                    <option value="female">Women / Girls</option>
                    <option value="male">Men / Boys</option>
                    <option value="transgender">Transgender</option>
                  </select>
                </div>

                {/* Area Type */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">📍 Area Type</label>
                  <select value={browseArea} onChange={e => { setBrowseArea(e.target.value); setBrowsePage(1); }} className="input-field">
                    <option value="all">All Areas</option>
                    <option value="rural">Rural / Village</option>
                    <option value="urban">Urban / City</option>
                  </select>
                </div>

                {/* Social Category */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">🤝 Social Category</label>
                  <select value={browseSocial} onChange={e => { setBrowseSocial(e.target.value); setBrowsePage(1); }} className="input-field">
                    <option value="all">All Categories</option>
                    <option value="sc">SC (Scheduled Caste)</option>
                    <option value="st">ST (Scheduled Tribe)</option>
                    <option value="obc">OBC (Other Backward)</option>
                    <option value="minority">Minority</option>
                    <option value="general">General</option>
                  </select>
                </div>

                {/* Education Level */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">📚 Education Level</label>
                  <select value={browseEdu} onChange={e => { setBrowseEdu(e.target.value); setBrowsePage(1); }} className="input-field">
                    <option value="all">All Levels</option>
                    <option value="no-formal">No Formal Education</option>
                    <option value="school">School Level</option>
                    <option value="graduate">Graduate</option>
                    <option value="post-graduate">Post-Graduate</option>
                  </select>
                </div>

                {/* Employment Status */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">💼 Employment</label>
                  <select value={browseEmploy} onChange={e => { setBrowseEmploy(e.target.value); setBrowsePage(1); }} className="input-field">
                    <option value="all">All Employment</option>
                    <option value="farmer">Farmer / Agricultural</option>
                    <option value="student">Student / Scholar</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="self_employed">Self-Employed / Business</option>
                    <option value="salaried">Salaried Employee</option>
                    <option value="labour">Labour / Worker</option>
                  </select>
                </div>

                {/* Income Level */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">📊 Income Level</label>
                  <select value={browseIncome} onChange={e => { setBrowseIncome(e.target.value); setBrowsePage(1); }} className="input-field">
                    <option value="all">All Income Levels</option>
                    <option value="bpl">BPL (Below Poverty Line)</option>
                    <option value="low">EWS / Low Income</option>
                    <option value="middle">Middle Income</option>
                  </select>
                </div>

                {/* Life Stage */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">🌱 Life Stage</label>
                  <select value={browseLifeStage} onChange={e => { setBrowseLifeStage(e.target.value); setBrowsePage(1); }} className="input-field">
                    <option value="all">All Life Stages</option>
                    <option value="children">Children / Infants</option>
                    <option value="youth">Youth (18–35)</option>
                    <option value="pregnant">Pregnant / Maternity</option>
                    <option value="senior">Senior Citizens (60+)</option>
                    <option value="disabled">Differently Abled</option>
                    <option value="widow">Widow</option>
                  </select>
                </div>
              </div>
            )}

            {/* Active Filters Chips */}
            {(searchQ || browseState !== 'all' || browseCat !== 'all' || browseTag !== 'all' || browseMinistry !== 'all' || browseBenefitRange !== 'all' || browseGender !== 'all' || browseArea !== 'all' || browseSocial !== 'all' || browseEdu !== 'all' || browseEmploy !== 'all' || browseIncome !== 'all' || browseLifeStage !== 'all') && (
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                {searchQ && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-full text-[10px] text-amber-700 font-medium">
                    🔍 "{searchQ}" <button onClick={() => { setSearchQ(''); setBrowsePage(1); }} className="hover:text-red-500">✕</button>
                  </span>
                )}
                {browseState !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-full text-[10px] text-blue-700 font-medium">
                    📍 {browseState} <button onClick={() => { setBrowseState('all'); setBrowsePage(1); }} className="hover:text-red-500">✕</button>
                  </span>
                )}
                {browseCat !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full text-[10px] text-emerald-700 font-medium">
                    📂 {(CATEGORY_META[browseCat] || { label: browseCat }).label} <button onClick={() => { setBrowseCat('all'); setBrowsePage(1); }} className="hover:text-red-500">✕</button>
                  </span>
                )}
                {browseTag !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 border border-purple-200 rounded-full text-[10px] text-purple-700 font-medium">
                    🏷️ {browseTag} <button onClick={() => { setBrowseTag('all'); setBrowsePage(1); }} className="hover:text-red-500">✕</button>
                  </span>
                )}
                {browseMinistry !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 border border-indigo-200 rounded-full text-[10px] text-indigo-700 font-medium">
                    🏛️ Ministry <button onClick={() => { setBrowseMinistry('all'); setBrowsePage(1); }} className="hover:text-red-500">✕</button>
                  </span>
                )}
                {browseBenefitRange !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 border border-green-200 rounded-full text-[10px] text-green-700 font-medium">
                    💰 {browseBenefitRange} <button onClick={() => { setBrowseBenefitRange('all'); setBrowsePage(1); }} className="hover:text-red-500">✕</button>
                  </span>
                )}
                {browseGender !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-pink-50 border border-pink-200 rounded-full text-[10px] text-pink-700 font-medium">
                    👤 {browseGender} <button onClick={() => { setBrowseGender('all'); setBrowsePage(1); }} className="hover:text-red-500">✕</button>
                  </span>
                )}
                {browseArea !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-cyan-50 border border-cyan-200 rounded-full text-[10px] text-cyan-700 font-medium">
                    📍 {browseArea} <button onClick={() => { setBrowseArea('all'); setBrowsePage(1); }} className="hover:text-red-500">✕</button>
                  </span>
                )}
                {browseSocial !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-50 border border-teal-200 rounded-full text-[10px] text-teal-700 font-medium">
                    🤝 {browseSocial} <button onClick={() => { setBrowseSocial('all'); setBrowsePage(1); }} className="hover:text-red-500">✕</button>
                  </span>
                )}
                {browseEdu !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-50 border border-sky-200 rounded-full text-[10px] text-sky-700 font-medium">
                    📚 {browseEdu} <button onClick={() => { setBrowseEdu('all'); setBrowsePage(1); }} className="hover:text-red-500">✕</button>
                  </span>
                )}
                {browseEmploy !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 border border-orange-200 rounded-full text-[10px] text-orange-700 font-medium">
                    💼 {browseEmploy} <button onClick={() => { setBrowseEmploy('all'); setBrowsePage(1); }} className="hover:text-red-500">✕</button>
                  </span>
                )}
                {browseIncome !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-50 border border-yellow-200 rounded-full text-[10px] text-yellow-700 font-medium">
                    📊 {browseIncome} <button onClick={() => { setBrowseIncome('all'); setBrowsePage(1); }} className="hover:text-red-500">✕</button>
                  </span>
                )}
                {browseLifeStage !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-50 border border-violet-200 rounded-full text-[10px] text-violet-700 font-medium">
                    🌱 {browseLifeStage} <button onClick={() => { setBrowseLifeStage('all'); setBrowsePage(1); }} className="hover:text-red-500">✕</button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Results Count + Category Tabs */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-slate-600">
                Showing <strong className="text-slate-800">{browseFiltered.length}</strong> of {GOVT_SCHEMES.length} schemes
              </p>
              <p className="text-[10px] text-slate-400">Page {browsePage} of {totalPages || 1}</p>
            </div>

            {/* Quick Category Tabs */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              <button
                onClick={() => { setBrowseCat('all'); setBrowsePage(1); }}
                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-colors ${browseCat === 'all'
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                }`}
              >All ({browseFiltered.length})</button>
              {Object.entries(browseCatCounts).sort((a, b) => b[1] - a[1]).map(([cat, count]) => {
                const meta = CATEGORY_META[cat] || { icon: '📋', label: cat };
                return (
                  <button
                    key={cat}
                    onClick={() => { setBrowseCat(cat); setBrowsePage(1); }}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-colors ${browseCat === cat
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                  >{meta.icon} {meta.label} ({count})</button>
                );
              })}
            </div>
          </div>

          {/* Scheme Cards */}
          <div className="space-y-3">
            {paginatedSchemes.map(s => <SchemeCard key={s.id} scheme={s} expanded={expandedId === s.id} onToggle={() => setExpandedId(expandedId === s.id ? null : s.id)} />)}
          </div>

          {browseFiltered.length === 0 && (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">🔍</div>
              <p className="font-semibold text-slate-600 mb-1">No schemes match your filters</p>
              <p className="text-xs text-slate-400 mb-3">Try adjusting your search or removing some filters</p>
              <button onClick={handleBrowseReset} className="px-4 py-2 rounded-full bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors">
                Clear All Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                disabled={browsePage <= 1}
                onClick={() => { setBrowsePage(p => p - 1); setExpandedId(null); }}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >← Previous</button>

              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (browsePage <= 4) {
                  pageNum = i + 1;
                } else if (browsePage >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = browsePage - 3 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => { setBrowsePage(pageNum); setExpandedId(null); }}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${browsePage === pageNum
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'border border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >{pageNum}</button>
                );
              })}

              <button
                disabled={browsePage >= totalPages}
                onClick={() => { setBrowsePage(p => p + 1); setExpandedId(null); }}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >Next →</button>
            </div>
          )}

          <div className="text-center mt-6">
            <button onClick={handleReset} className="px-5 py-2 rounded-full border border-slate-200 text-slate-500 text-sm font-medium hover:bg-slate-50 transition-colors">
              ↺ Back to Home
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ─── FINDER MODE: FORM ─── */}
      {/* ══════════════════════════════════════════════════════════ */}
      {mode === 'finder' && !showResults && !loading && (
        <div className="max-w-2xl mx-auto animate-fade-in">
          {/* Progress */}
          <div className="h-1.5 bg-slate-100 rounded-full mb-6 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 via-amber-500 to-emerald-500 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
          </div>

          {step === 1 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <StepHeader n={1} title="Basic Demographics" sub="Tell us about yourself" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Age"><input type="number" className="input-field" placeholder="e.g. 28" value={age} onChange={e => setAge(e.target.value)} /></Field>
                <Field label="Gender">
                  <select className="input-field" value={gender} onChange={e => setGender(e.target.value)}>
                    <option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="transgender">Transgender</option>
                  </select>
                </Field>
                <Field label="State">
                  <select className="input-field" value={stateVal} onChange={e => setStateVal(e.target.value)}>
                    <option value="">Select State</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Area Type">
                  <div className="flex gap-2 flex-wrap">
                    {[['rural', 'Rural'], ['urban', 'Urban'], ['semi-urban', 'Semi-Urban']].map(([v, l]) => (
                      <Chip key={v} label={l} value={v} selected={area === v} onClick={() => setArea(v)} />
                    ))}
                  </div>
                </Field>
                <Field label="Social Category">
                  <div className="flex gap-2 flex-wrap">
                    {[['general', 'General'], ['obc', 'OBC'], ['sc', 'SC'], ['st', 'ST'], ['minority', 'Minority']].map(([v, l]) => (
                      <Chip key={v} label={l} value={v} selected={category === v} onClick={() => setCategory(v)} />
                    ))}
                  </div>
                </Field>
                <Field label="Education Level">
                  <select className="input-field" value={education} onChange={e => setEducation(e.target.value)}>
                    <option value="">Select</option><option value="no-formal">No Formal Education</option><option value="primary">Primary (1–5)</option><option value="secondary">Secondary (6–10)</option>
                    <option value="higher-secondary">Higher Secondary (11–12)</option><option value="graduate">Graduate</option><option value="post-graduate">Post-Graduate</option>
                  </select>
                </Field>
              </div>
              <BtnRow onNext={() => goStep(2)} />
            </div>
          )}

          {step === 2 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <StepHeader n={2} title="Financial Profile" sub="Helps identify economic benefits" />
              <div className="grid grid-cols-1 gap-4">
                <Field label="Annual Family Income">
                  <div className="flex gap-2 flex-wrap">
                    {[['below1', 'Below ₹1L'], ['1to2.5', '₹1–2.5L'], ['2.5to5', '₹2.5–5L'], ['5to10', '₹5–10L'], ['10to25', '₹10–25L'], ['above25', 'Above ₹25L']].map(([v, l]) => (
                      <Chip key={v} label={l} value={v} selected={income === v} onClick={() => setIncome(v)} />
                    ))}
                  </div>
                </Field>
                <Field label="Employment Status">
                  <div className="flex gap-2 flex-wrap">
                    {[['salaried', 'Salaried'], ['self-employed', 'Self-Employed'], ['business', 'Business'], ['farmer', 'Farmer'], ['student', 'Student'], ['unemployed', 'Unemployed'], ['retired', 'Retired']].map(([v, l]) => (
                      <Chip key={v} label={l} value={v} selected={employment === v} onClick={() => setEmployment(v)} />
                    ))}
                  </div>
                </Field>
                <Field label="Bank Account">
                  <div className="flex gap-2">
                    <Chip label="Yes" value="yes" selected={bankAccount === 'yes'} onClick={() => setBankAccount('yes')} />
                    <Chip label="No" value="no" selected={bankAccount === 'no'} onClick={() => setBankAccount('no')} />
                  </div>
                </Field>
              </div>
              <BtnRow onBack={() => goStep(1)} onNext={() => goStep(3)} />
            </div>
          )}

          {step === 3 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <StepHeader n={3} title="Life Situation" sub="Current life stage & needs" />
              <div className="grid grid-cols-1 gap-4">
                <Field label="Life Stage (select all that apply)">
                  <div className="flex gap-2 flex-wrap">
                    {[['pregnant', 'Pregnant'], ['new-parent', 'New Parent'], ['girl-child', 'Girl Child (<10)'], ['student-life', 'Student'], ['senior', 'Senior (60+)'], ['widow', 'Widow'], ['disabled', 'Differently Abled'], ['children', 'Children (<18)']].map(([v, l]) => (
                      <Chip key={v} label={l} value={v} selected={lifeStage.includes(v)} onClick={() => toggleMulti(lifeStage, v, setLifeStage)} />
                    ))}
                  </div>
                </Field>
                <Field label="What Do You Need? (select all)">
                  <div className="flex gap-2 flex-wrap">
                    {[['health', 'Healthcare'], ['education', 'Education'], ['housing', 'Housing'], ['employment', 'Job/Employment'], ['skill', 'Skill Training'], ['business', 'Business Loan'], ['pension', 'Pension'], ['insurance', 'Insurance'], ['food', 'Food Security'], ['digital', 'Digital Services'], ['sports', 'Sports']].map(([v, l]) => (
                      <Chip key={v} label={l} value={v} selected={needs.includes(v)} onClick={() => toggleMulti(needs, v, setNeeds)} />
                    ))}
                  </div>
                </Field>
              </div>
              <BtnRow onBack={() => goStep(2)} onNext={() => goStep(4)} />
            </div>
          )}

          {step === 4 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <StepHeader n={4} title="Assets & Infrastructure" sub="Help us check housing & sanitation benefits" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Own a House?">
                  <div className="flex gap-2 flex-wrap">
                    {[['yes', 'Yes — Pucca'], ['kutcha', 'Yes — Kutcha'], ['no', 'No House']].map(([v, l]) => (
                      <Chip key={v} label={l} value={v} selected={ownHouse === v} onClick={() => setOwnHouse(v)} />
                    ))}
                  </div>
                </Field>
                <Field label="Own Agricultural Land?">
                  <div className="flex gap-2">
                    <Chip label="Yes" value="yes" selected={ownLand === 'yes'} onClick={() => setOwnLand('yes')} />
                    <Chip label="No" value="no" selected={ownLand === 'no'} onClick={() => setOwnLand('no')} />
                  </div>
                </Field>
                <Field label="Health Insurance?">
                  <div className="flex gap-2">
                    <Chip label="Yes" value="yes" selected={healthIns === 'yes'} onClick={() => setHealthIns('yes')} />
                    <Chip label="No" value="no" selected={healthIns === 'no'} onClick={() => setHealthIns('no')} />
                  </div>
                </Field>
                <Field label="Toilet at Home?">
                  <div className="flex gap-2">
                    <Chip label="Yes" value="yes" selected={toilet === 'yes'} onClick={() => setToilet('yes')} />
                    <Chip label="No" value="no" selected={toilet === 'no'} onClick={() => setToilet('no')} />
                  </div>
                </Field>
                <Field label="Special Situations">
                  <div className="flex gap-2 flex-wrap">
                    {[['no-gas', 'No LPG Gas'], ['no-water', 'No Piped Water'], ['no-home', 'Homeless'], ['no-toilet', 'No Toilet']].map(([v, l]) => (
                      <Chip key={v} label={l} value={v} selected={special.includes(v)} onClick={() => toggleMulti(special, v, setSpecial)} />
                    ))}
                  </div>
                </Field>
              </div>
              <BtnRow onBack={() => goStep(3)} onNext={() => goStep(5)} />
            </div>
          )}

          {step === 5 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <StepHeader n={5} title="Business & Entrepreneurship" sub="Check business-related scheme eligibility" />
              <div className="grid grid-cols-1 gap-4">
                <Field label="Business Type">
                  <div className="flex gap-2 flex-wrap">
                    {[['none', 'None'], ['micro', 'Micro'], ['small', 'Small'], ['medium', 'Medium'], ['startup', 'Startup'], ['vendor', 'Street Vendor']].map(([v, l]) => (
                      <Chip key={v} label={l} value={v} selected={bizType === v} onClick={() => setBizType(v)} />
                    ))}
                  </div>
                </Field>
              </div>
              <div className="flex justify-between items-center mt-5">
                <button onClick={() => goStep(4)} className="px-5 py-2 rounded-full border border-slate-200 text-slate-500 text-sm font-medium hover:bg-slate-50 transition-colors">← Back</button>
                <button onClick={handleFind} className="px-7 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  Find My Schemes
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── LOADING ─── */}
      {loading && (
        <div className="text-center py-16 animate-fade-in">
          <div className="w-14 h-14 border-[3px] border-slate-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-5" style={{ animationDuration: '0.8s' }} />
          <p className="font-bold text-slate-700 mb-1 text-base">Scanning {GOVT_SCHEMES.length}+ Government Schemes...</p>
          <p className="text-sm text-slate-400">Matching your profile with Central & State benefits</p>
        </div>
      )}

      {/* ─── FINDER RESULTS ─── */}
      {mode === 'finder' && showResults && (
        <div className="animate-fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 text-xs font-semibold text-emerald-700 uppercase tracking-widest mb-3">
              🎉 Your Results
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-1">
              You're eligible for <span className="bg-gradient-to-r from-emerald-500 to-amber-500 bg-clip-text text-transparent">{matchedSchemes.length}</span> schemes
            </h2>
            <p className="text-slate-500 text-sm mt-1">Total potential benefit: <strong className="text-emerald-600 text-base">{fmtAmount(totalBenefit)}</strong></p>
          </div>

          {/* Category Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([cat, count]) => {
              const meta = CATEGORY_META[cat] || { icon: '📋', label: cat };
              return (
                <div key={cat} className="glass-card rounded-2xl p-4 text-center hover:shadow-md transition-all">
                  <div className="text-2xl mb-1">{meta.icon}</div>
                  <div className="text-2xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">{count}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{meta.label}</div>
                </div>
              );
            })}
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-5">
            <button onClick={() => setFilterCat('all')} className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${filterCat === 'all' ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
              All ({matchedSchemes.length})
            </button>
            {Object.entries(catCounts).sort((a, b) => b[1] - a[1]).map(([cat, count]) => {
              const meta = CATEGORY_META[cat] || { icon: '📋', label: cat };
              return (
                <button key={cat} onClick={() => setFilterCat(cat)} className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${filterCat === cat ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
                  {meta.icon} {meta.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Scheme Cards */}
          <div className="space-y-3">
            {filteredSchemes.map(s => <SchemeCard key={s.id} scheme={s} expanded={expandedId === s.id} onToggle={() => setExpandedId(expandedId === s.id ? null : s.id)} />)}
          </div>

          {filteredSchemes.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-sm">No schemes found in this category.</div>
          )}

          {/* Download PDF */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center mt-8">
            <h3 className="font-bold text-slate-800 text-sm mb-1">📄 Download Your Scheme Report</h3>
            <p className="text-xs text-slate-400 mb-3">Save a professionally formatted PDF with all your eligible schemes.</p>
            <button
              onClick={() => {
                const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
                const schemesHtml = matchedSchemes.map((s, idx) => `
                  <div style="page-break-inside:avoid;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:16px;border-left:4px solid #f59e0b;">
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
                      <h3 style="font-size:14px;font-weight:700;color:#1e293b;margin:0;">${idx + 1}. ${s.name}</h3>
                      <span style="background:#fef3c7;color:#92400e;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:600;white-space:nowrap;">${s.tag}</span>
                    </div>
                    <p style="font-size:11px;color:#64748b;margin:0 0 6px 0;">${s.tagline}</p>
                    <div style="display:flex;gap:12px;font-size:10px;color:#64748b;margin-bottom:10px;">
                      <span><strong>Ministry:</strong> ${s.ministry}</span>
                      <span><strong>Status:</strong> ${s.currentStatus}</span>
                      ${s.amount > 0 ? `<span><strong>Benefit:</strong> ₹${s.amount.toLocaleString('en-IN')}</span>` : ''}
                    </div>
                    <div style="margin-bottom:10px;">
                      <h4 style="font-size:11px;font-weight:700;color:#1e293b;margin:0 0 4px 0;">About</h4>
                      <p style="font-size:11px;color:#475569;margin:0;line-height:1.5;">${s.about}</p>
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                      <div>
                        <h4 style="font-size:11px;font-weight:700;color:#059669;margin:0 0 4px 0;">✅ Key Benefits</h4>
                        <ul style="font-size:10px;color:#475569;margin:0;padding-left:14px;line-height:1.6;">
                          ${s.keyBenefits.map(b => `<li>${b}</li>`).join('')}
                        </ul>
                      </div>
                      <div>
                        <h4 style="font-size:11px;font-weight:700;color:#d97706;margin:0 0 4px 0;">📋 Eligibility</h4>
                        <ul style="font-size:10px;color:#475569;margin:0;padding-left:14px;line-height:1.6;">
                          ${s.eligibility.map(e => `<li>${e}</li>`).join('')}
                        </ul>
                      </div>
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:10px;">
                      <div>
                        <h4 style="font-size:11px;font-weight:700;color:#2563eb;margin:0 0 4px 0;">📄 Documents Required</h4>
                        <ul style="font-size:10px;color:#475569;margin:0;padding-left:14px;line-height:1.6;">
                          ${s.documentsRequired.map(d => `<li>${d}</li>`).join('')}
                        </ul>
                      </div>
                      <div>
                        <h4 style="font-size:11px;font-weight:700;color:#7c3aed;margin:0 0 4px 0;">🚀 How to Apply</h4>
                        <ol style="font-size:10px;color:#475569;margin:0;padding-left:14px;line-height:1.6;">
                          ${s.howToApply.map(st => `<li>${st}</li>`).join('')}
                        </ol>
                      </div>
                    </div>
                    <div style="margin-top:8px;font-size:10px;color:#64748b;">
                      <strong>Website:</strong> ${s.officialWebsite} &nbsp;|&nbsp; <strong>Helpline:</strong> ${s.helpline}
                    </div>
                  </div>
                `).join('');

                const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Scheme Report - ReportsIQ</title>
                <style>
                  * { box-sizing: border-box; margin: 0; padding: 0; }
                  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; padding: 30px; max-width: 800px; margin: 0 auto; }
                  @media print {
                    body { padding: 15px; }
                    .no-print { display: none !important; }
                    @page { margin: 15mm 10mm; size: A4; }
                  }
                </style></head><body>
                <div class="no-print" style="text-align:center;margin-bottom:20px;">
                  <button onclick="window.print()" style="padding:10px 30px;background:linear-gradient(135deg,#f59e0b,#ef4444);color:white;border:none;border-radius:8px;font-weight:700;font-size:14px;cursor:pointer;">
                    📥 Save as PDF (Ctrl+P)
                  </button>
                </div>
                <div style="text-align:center;margin-bottom:24px;padding-bottom:20px;border-bottom:3px solid #f59e0b;">
                  <h1 style="font-size:22px;font-weight:800;color:#1e293b;margin-bottom:4px;">🇮🇳 Government Scheme Eligibility Report</h1>
                  <p style="font-size:12px;color:#64748b;">Generated by <strong>ReportsIQ</strong> (reportsiq.in) &nbsp;|&nbsp; ${dateStr}</p>
                </div>
                <div style="display:flex;gap:16px;margin-bottom:24px;">
                  <div style="flex:1;background:#ecfdf5;border-radius:10px;padding:14px;text-align:center;">
                    <div style="font-size:24px;font-weight:800;color:#059669;">${matchedSchemes.length}</div>
                    <div style="font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Eligible Schemes</div>
                  </div>
                  <div style="flex:1;background:#fffbeb;border-radius:10px;padding:14px;text-align:center;">
                    <div style="font-size:24px;font-weight:800;color:#d97706;">${fmtAmount(totalBenefit)}</div>
                    <div style="font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Total Benefit</div>
                  </div>
                </div>
                ${schemesHtml}
                <div style="text-align:center;margin-top:24px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:10px;color:#94a3b8;">
                  <p><strong>Disclaimer:</strong> Data sourced from government portals. Always verify eligibility on official websites before applying.</p>
                  <p style="margin-top:4px;">Powered by ReportsIQ — reportsiq.in</p>
                </div>
                </body></html>`;

                const w = window.open('', '_blank');
                if (w) { w.document.write(html); w.document.close(); }
              }}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-bold flex items-center gap-2 mx-auto hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download PDF Report
            </button>
          </div>

          <div className="text-center mt-6">
            <button onClick={handleReset} className="px-5 py-2 rounded-full border border-slate-200 text-slate-500 text-sm font-medium hover:bg-slate-50 transition-colors">
              ↺ Start Over
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center mt-12 pt-6 border-t border-slate-100">
        <p className="text-[11px] text-slate-400">Built with ❤️ by <strong className="text-slate-500">ReportsIQ</strong> — reportsiq.in</p>
        <p className="text-[10px] text-slate-300 mt-1">Data sourced from government portals. Always verify eligibility on official websites before applying.</p>
      </div>

      <style>{`
        .hero-gradient {
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 25%, #fff7ed 50%, #ecfdf5 75%, #f0f9ff 100%);
          border: 1px solid rgba(251,191,36,0.15);
        }
        .hero-glow {
          position: absolute; top: -50%; right: -20%; width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .glass-card {
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.8);
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }
        .glass-chip {
          background: rgba(255,251,235,0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(251,191,36,0.25);
        }
        .input-field {
          width: 100%;
          padding: 0.6rem 0.85rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 0.75rem;
          font-size: 0.8rem;
          color: #334155;
          background: #fff;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .input-field:focus {
          outline: none;
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245,158,11,0.1), 0 2px 8px rgba(245,158,11,0.08);
        }
        .input-field:hover:not(:focus) {
          border-color: #cbd5e1;
        }
        .scheme-card {
          transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .scheme-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px -5px rgba(0,0,0,0.08), 0 4px 10px -4px rgba(0,0,0,0.04);
        }
        .animate-fade-in {
          animation: fadeInUp 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
};

/* ─── Sub-components ──────────────────────────────────────────── */
const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div><label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">{label}</label>{children}</div>
);

const StepHeader: React.FC<{ n: number; title: string; sub: string }> = ({ n, title, sub }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-amber-500 flex items-center justify-center text-white text-sm font-bold shrink-0">{n}</div>
    <div><div className="text-base font-bold text-slate-800">{title}</div><div className="text-xs text-slate-400">{sub}</div></div>
  </div>
);

const BtnRow: React.FC<{ onBack?: () => void; onNext: () => void }> = ({ onBack, onNext }) => (
  <div className="flex justify-between items-center mt-5">
    {onBack ? (
      <button onClick={onBack} className="px-5 py-2 rounded-full border border-slate-200 text-slate-500 text-sm font-medium hover:bg-slate-50 transition-colors">← Back</button>
    ) : <div />}
    <button onClick={onNext} className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
      Continue →
    </button>
  </div>
);

const SchemeCard: React.FC<{ scheme: GovtScheme; expanded: boolean; onToggle: () => void }> = ({ scheme: s, expanded, onToggle }) => {
  const meta = CATEGORY_META[s.category] || { tagClass: 'bg-slate-100 text-slate-600', cardClass: 'border-l-slate-400' };
  return (
    <div onClick={onToggle} className={`scheme-card bg-white border border-slate-200/80 rounded-2xl p-5 cursor-pointer border-l-4 ${meta.cardClass}`}>
      <div className="flex justify-between items-start gap-3 mb-2">
        <h3 className="text-sm font-bold text-slate-800 leading-snug">{s.name}</h3>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap shrink-0 ${meta.tagClass}`}>{s.tag}</span>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed mb-2">{s.tagline}</p>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {s.benefitAmount.split(/[|+]/).map((b, i) => (
          <span key={i} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-medium">{b.trim()}</span>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 text-[10px] text-slate-400">
        {s.amount > 0 && <span><strong className="text-amber-600">₹{s.amount.toLocaleString('en-IN')}</strong> benefit</span>}
        <span>{expanded ? '▲ Click to collapse' : '▼ Click to expand'}</span>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 animate-fade-in" onClick={e => e.stopPropagation()}>
          {/* About */}
          <div><h4 className="text-xs font-bold text-slate-700 mb-1">About This Scheme</h4><p className="text-xs text-slate-500 leading-relaxed">{s.about}</p></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-500">
            <div><span className="font-semibold text-slate-600">Ministry:</span> {s.ministry}</div>
            <div><span className="font-semibold text-slate-600">Launched:</span> {s.launchedDate}</div>
            <div><span className="font-semibold text-slate-600">Status:</span> {s.currentStatus}</div>
            <div><span className="font-semibold text-slate-600">Helpline:</span> {s.helpline}</div>
          </div>

          {/* Key Benefits */}
          <div>
            <h4 className="text-xs font-bold text-emerald-700 mb-1.5">✅ Key Benefits</h4>
            <ul className="space-y-1">{s.keyBenefits.map((b, i) => <li key={i} className="text-xs text-slate-500 flex items-start gap-1.5"><span className="text-emerald-500 mt-0.5 shrink-0">•</span>{b}</li>)}</ul>
          </div>

          {/* Eligibility */}
          <div>
            <h4 className="text-xs font-bold text-amber-700 mb-1.5">📋 Eligibility Criteria</h4>
            <ul className="space-y-1">{s.eligibility.map((e, i) => <li key={i} className="text-xs text-slate-500 flex items-start gap-1.5"><span className="text-amber-500 mt-0.5 shrink-0">✓</span>{e}</li>)}</ul>
          </div>

          {/* Documents */}
          <div>
            <h4 className="text-xs font-bold text-blue-700 mb-1.5">📄 Documents Required</h4>
            <ul className="space-y-1">{s.documentsRequired.map((d, i) => <li key={i} className="text-xs text-slate-500 flex items-start gap-1.5"><span className="text-blue-500 mt-0.5 shrink-0">•</span>{d}</li>)}</ul>
          </div>

          {/* How to Apply */}
          <div>
            <h4 className="text-xs font-bold text-indigo-700 mb-1.5">🚀 How to Apply (Step-by-Step)</h4>
            <ol className="space-y-1.5">{s.howToApply.map((step, i) => (
              <li key={i} className="text-xs text-slate-500 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[9px] font-bold shrink-0 mt-px">{i + 1}</span>
                {step}
              </li>
            ))}</ol>
          </div>

          {/* Who Should Apply */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <h4 className="text-xs font-bold text-amber-800 mb-1">💡 Who Should Apply?</h4>
            <p className="text-xs text-amber-700">{s.whoShouldApply}</p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-2">
            <a href={s.officialWebsite} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors">
              🌐 Official Website
            </a>
            <a href={s.applyPortal} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors">
              📝 Apply Now
            </a>
            <CopySchemeBtn scheme={s} />
          </div>
        </div>
      )}
    </div>
  );
};

const CopySchemeBtn: React.FC<{ scheme: GovtScheme }> = ({ scheme: s }) => {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    const txt = [
      s.name,
      `Category: ${s.tag} | Benefit: ${s.benefitAmount}`,
      `Ministry: ${s.ministry}`,
      `Status: ${s.currentStatus}`,
      '',
      `About: ${s.about}`,
      '',
      'Key Benefits:',
      ...s.keyBenefits.map(b => `  • ${b}`),
      '',
      'Eligibility:',
      ...s.eligibility.map(e => `  ✓ ${e}`),
      '',
      'Documents Required:',
      ...s.documentsRequired.map(d => `  • ${d}`),
      '',
      'How to Apply:',
      ...s.howToApply.map((st, i) => `  ${i + 1}. ${st}`),
      '',
      `Who Should Apply: ${s.whoShouldApply}`,
      '',
      `Official Website: ${s.officialWebsite}`,
      `Apply Portal: ${s.applyPortal}`,
      `Helpline: ${s.helpline}`,
    ].join('\n');
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${copied ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'}`}>
      {copied ? '✅ Copied!' : '📋 Copy Details'}
    </button>
  );
};
