import React, { useState, useMemo } from 'react';
import { CreditCard, Plus, Trash2, Edit2, TrendingDown, Check, X, ShieldAlert, BadgeInfo, Sparkles, Calendar, Award, Download, Flame } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface Subscription {
  id: string;
  name: string;
  cost: number;
  cycle: 'monthly' | 'yearly';
  category: 'Entertainment' | 'SaaS/Software' | 'Health & Fitness' | 'Utilities' | 'Other';
  annualEquivalentCost?: number; // Potential cost if switched to annual
  isUnused: boolean; // Flag to check if they want to cancel
  renewalDate?: string; // YYYY-MM-DD
}

interface IndianSubscriptionPreset {
  name: string;
  cost: number;
  cycle: 'monthly' | 'yearly';
  category: Subscription['category'];
  annualEquivalentCost?: number;
}

const CATEGORY_COLORS = {
  'Entertainment': '#ec4899', // pink-500
  'SaaS/Software': '#6366f1', // indigo-500
  'Health & Fitness': '#10b981', // emerald-500
  'Utilities': '#3b82f6', // blue-500
  'Other': '#f59e0b' // amber-500
};

// 50+ Popular Indian Subscriptions Preset List
const INDIAN_PRESETS: IndianSubscriptionPreset[] = [
  // Entertainment Video
  { name: 'Netflix Premium (4K)', cost: 649, cycle: 'monthly', category: 'Entertainment', annualEquivalentCost: 5999 },
  { name: 'Netflix Standard (1080p)', cost: 499, cycle: 'monthly', category: 'Entertainment' },
  { name: 'Netflix Basic (720p)', cost: 199, cycle: 'monthly', category: 'Entertainment' },
  { name: 'Netflix Mobile (480p)', cost: 149, cycle: 'monthly', category: 'Entertainment' },
  { name: 'Amazon Prime (Monthly)', cost: 299, cycle: 'monthly', category: 'Entertainment', annualEquivalentCost: 1499 },
  { name: 'Amazon Prime (Annual)', cost: 1499, cycle: 'yearly', category: 'Entertainment', annualEquivalentCost: 1499 },
  { name: 'Disney+ Hotstar Premium (Monthly)', cost: 299, cycle: 'monthly', category: 'Entertainment', annualEquivalentCost: 1499 },
  { name: 'Disney+ Hotstar Premium (Annual)', cost: 1499, cycle: 'yearly', category: 'Entertainment', annualEquivalentCost: 1499 },
  { name: 'Disney+ Hotstar Super (Annual)', cost: 899, cycle: 'yearly', category: 'Entertainment', annualEquivalentCost: 899 },
  { name: 'JioCinema Premium (Monthly)', cost: 29, cycle: 'monthly', category: 'Entertainment' },
  { name: 'JioCinema Family (Monthly)', cost: 89, cycle: 'monthly', category: 'Entertainment' },
  { name: 'SonyLIV Premium (Monthly)', cost: 299, cycle: 'monthly', category: 'Entertainment', annualEquivalentCost: 999 },
  { name: 'SonyLIV Premium (Annual)', cost: 999, cycle: 'yearly', category: 'Entertainment', annualEquivalentCost: 999 },
  { name: 'Zee5 Premium (Annual)', cost: 699, cycle: 'yearly', category: 'Entertainment', annualEquivalentCost: 699 },
  { name: 'YouTube Premium Individual (Monthly)', cost: 149, cycle: 'monthly', category: 'Entertainment' },
  { name: 'YouTube Premium Family (Monthly)', cost: 299, cycle: 'monthly', category: 'Entertainment' },
  { name: 'YouTube Premium Student (Monthly)', cost: 79, cycle: 'monthly', category: 'Entertainment' },
  { name: 'Apple TV+ (Monthly)', cost: 350, cycle: 'monthly', category: 'Entertainment' },
  { name: 'Apple One Individual (Monthly)', cost: 365, cycle: 'monthly', category: 'Entertainment' },
  { name: 'Apple One Family (Monthly)', cost: 465, cycle: 'monthly', category: 'Entertainment' },
  
  // Entertainment Audio
  { name: 'Gaana Plus (Monthly)', cost: 99, cycle: 'monthly', category: 'Entertainment', annualEquivalentCost: 399 },
  { name: 'Gaana Plus (Annual)', cost: 399, cycle: 'yearly', category: 'Entertainment', annualEquivalentCost: 399 },
  { name: 'Spotify Premium Individual (Monthly)', cost: 119, cycle: 'monthly', category: 'Entertainment', annualEquivalentCost: 1189 },
  { name: 'Spotify Premium Individual (Annual)', cost: 1189, cycle: 'yearly', category: 'Entertainment', annualEquivalentCost: 1189 },
  { name: 'Spotify Premium Duo (Monthly)', cost: 149, cycle: 'monthly', category: 'Entertainment' },
  { name: 'Spotify Premium Family (Monthly)', cost: 179, cycle: 'monthly', category: 'Entertainment' },
  { name: 'Apple Music Individual (Monthly)', cost: 99, cycle: 'monthly', category: 'Entertainment' },
  { name: 'Gaana Plus (Annual Special)', cost: 299, cycle: 'yearly', category: 'Entertainment' },
  { name: 'Wynk Music Premium (Monthly)', cost: 49, cycle: 'monthly', category: 'Entertainment' },

  // SaaS & Software / Productivity
  { name: 'ChatGPT Plus', cost: 1999, cycle: 'monthly', category: 'SaaS/Software' },
  { name: 'Claude Pro', cost: 1999, cycle: 'monthly', category: 'SaaS/Software' },
  { name: 'Canva Pro (Monthly)', cost: 499, cycle: 'monthly', category: 'SaaS/Software', annualEquivalentCost: 3999 },
  { name: 'Canva Pro (Annual)', cost: 3999, cycle: 'yearly', category: 'SaaS/Software', annualEquivalentCost: 3999 },
  { name: 'Adobe Creative Cloud Individual', cost: 4630, cycle: 'monthly', category: 'SaaS/Software', annualEquivalentCost: 46000 },
  { name: 'Google One 100GB (Monthly)', cost: 130, cycle: 'monthly', category: 'Utilities', annualEquivalentCost: 1300 },
  { name: 'Google One 100GB (Annual)', cost: 1300, cycle: 'yearly', category: 'Utilities', annualEquivalentCost: 1300 },
  { name: 'Google One 200GB (Monthly)', cost: 210, cycle: 'monthly', category: 'Utilities', annualEquivalentCost: 2100 },
  { name: 'Google One 200GB (Annual)', cost: 2100, cycle: 'yearly', category: 'Utilities', annualEquivalentCost: 2100 },
  { name: 'Google One 2TB (Monthly)', cost: 650, cycle: 'monthly', category: 'Utilities', annualEquivalentCost: 6500 },
  { name: 'Google One 2TB (Annual)', cost: 6500, cycle: 'yearly', category: 'Utilities', annualEquivalentCost: 6500 },
  { name: 'iCloud+ 50GB (Monthly)', cost: 75, cycle: 'monthly', category: 'Utilities' },
  { name: 'iCloud+ 200GB (Monthly)', cost: 219, cycle: 'monthly', category: 'Utilities' },
  { name: 'iCloud+ 2TB (Monthly)', cost: 749, cycle: 'monthly', category: 'Utilities' },
  { name: 'Microsoft 365 Personal (Monthly)', cost: 489, cycle: 'monthly', category: 'SaaS/Software', annualEquivalentCost: 4899 },
  { name: 'Microsoft 365 Personal (Annual)', cost: 4899, cycle: 'yearly', category: 'SaaS/Software', annualEquivalentCost: 4899 },
  { name: 'Microsoft 365 Family (Monthly)', cost: 619, cycle: 'monthly', category: 'SaaS/Software', annualEquivalentCost: 6199 },
  { name: 'Microsoft 365 Family (Annual)', cost: 6199, cycle: 'yearly', category: 'SaaS/Software', annualEquivalentCost: 6199 },
  { name: 'Notion Plus (Monthly)', cost: 850, cycle: 'monthly', category: 'SaaS/Software' },
  { name: 'Midjourney Basic (Monthly)', cost: 850, cycle: 'monthly', category: 'SaaS/Software' },

  // Health & Fitness
  { name: 'Cult.fit Elite (Monthly)', cost: 3500, cycle: 'monthly', category: 'Health & Fitness', annualEquivalentCost: 14999 },
  { name: 'Cult.fit Elite (Annual)', cost: 14999, cycle: 'yearly', category: 'Health & Fitness', annualEquivalentCost: 14999 },
  { name: 'HealthifyMe Premium (Monthly)', cost: 999, cycle: 'monthly', category: 'Health & Fitness' },
  { name: 'Headspace (Monthly)', cost: 849, cycle: 'monthly', category: 'Health & Fitness', annualEquivalentCost: 4999 },
  { name: 'Headspace (Annual)', cost: 4999, cycle: 'yearly', category: 'Health & Fitness', annualEquivalentCost: 4999 },
  { name: 'Calm Premium (Monthly)', cost: 650, cycle: 'monthly', category: 'Health & Fitness', annualEquivalentCost: 3999 },
  { name: 'Calm Premium (Annual)', cost: 3999, cycle: 'yearly', category: 'Health & Fitness', annualEquivalentCost: 3999 },
  { name: 'Fitpass Membership (Monthly)', cost: 1599, cycle: 'monthly', category: 'Health & Fitness' },

  // Delivery & Shopping
  { name: 'Swiggy One (Monthly)', cost: 299, cycle: 'monthly', category: 'Utilities', annualEquivalentCost: 1299 },
  { name: 'Swiggy One (Annual)', cost: 1299, cycle: 'yearly', category: 'Utilities', annualEquivalentCost: 1299 },
  { name: 'Zomato Gold (3-Month)', cost: 299, cycle: 'monthly', category: 'Utilities', annualEquivalentCost: 999 },
  { name: 'Zomato Gold (Annual)', cost: 999, cycle: 'yearly', category: 'Utilities', annualEquivalentCost: 999 },
  { name: 'Flipkart VIP (Annual)', cost: 499, cycle: 'yearly', category: 'Utilities' },
  { name: 'Times Prime (Annual)', cost: 1199, cycle: 'yearly', category: 'Utilities' },

  // Gaming
  { name: 'PlayStation Plus Deluxe (Monthly)', cost: 849, cycle: 'monthly', category: 'Entertainment', annualEquivalentCost: 8599 },
  { name: 'PlayStation Plus Deluxe (Annual)', cost: 8599, cycle: 'yearly', category: 'Entertainment', annualEquivalentCost: 8599 },
  { name: 'Xbox Game Pass Ultimate (Monthly)', cost: 549, cycle: 'monthly', category: 'Entertainment' },

  // News & Business
  { name: 'Economic Times Prime (Monthly)', cost: 399, cycle: 'monthly', category: 'Other', annualEquivalentCost: 2499 },
  { name: 'Economic Times Prime (Annual)', cost: 2499, cycle: 'yearly', category: 'Other', annualEquivalentCost: 2499 },
  { name: 'The Hindu Digital (Annual)', cost: 999, cycle: 'yearly', category: 'Other' },
  { name: 'Indian Express Premium (Annual)', cost: 999, cycle: 'yearly', category: 'Other' },
];

const DEFAULT_SUBSCRIPTIONS: Subscription[] = [
  { id: '1', name: 'Netflix Premium (4K)', cost: 649, cycle: 'monthly', category: 'Entertainment', annualEquivalentCost: 5999, isUnused: false, renewalDate: '2026-07-28' },
  { id: '2', name: 'Spotify Premium Individual (Monthly)', cost: 119, cycle: 'monthly', category: 'Entertainment', annualEquivalentCost: 1189, isUnused: false, renewalDate: '2026-08-05' },
  { id: '3', name: 'Cult.fit Elite (Monthly)', cost: 3500, cycle: 'monthly', category: 'Health & Fitness', annualEquivalentCost: 14999, isUnused: true, renewalDate: '2026-07-25' },
  { id: '4', name: 'Adobe Creative Cloud Individual', cost: 4630, cycle: 'monthly', category: 'SaaS/Software', annualEquivalentCost: 46000, isUnused: false, renewalDate: '2026-08-12' },
  { id: '5', name: 'Google One 100GB (Annual)', cost: 1300, cycle: 'yearly', category: 'Utilities', annualEquivalentCost: 1300, isUnused: false, renewalDate: '2026-12-15' },
];

// Quick Access Badges for Instant Adds
const QUICK_ADD_PRESETS = [
  { name: 'Netflix Premium (4K)', icon: '🎬' },
  { name: 'Spotify Premium Individual (Monthly)', icon: '🎵' },
  { name: 'YouTube Premium Individual (Monthly)', icon: '📹' },
  { name: 'Amazon Prime (Annual)', icon: '📦' },
  { name: 'Zomato Gold (Annual)', icon: '🛵' },
  { name: 'Swiggy One (Annual)', icon: '🍔' },
  { name: 'ChatGPT Plus', icon: '🤖' },
  { name: 'Cult.fit Elite (Annual)', icon: '🏋️' }
];

export const SubscriptionOptimizerPage: React.FC = () => {
  const [subs, setSubs] = useState<Subscription[]>(DEFAULT_SUBSCRIPTIONS);
  
  // Form State
  const [name, setName] = useState('');
  const [costStr, setCostStr] = useState('');
  const [cycle, setCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [category, setCategory] = useState<Subscription['category']>('Entertainment');
  const [hasAnnualOption, setHasAnnualOption] = useState(false);
  const [annualCostStr, setAnnualCostStr] = useState('');
  const [isUnused, setIsUnused] = useState(false);
  const [renewalDate, setRenewalDate] = useState('');

  // What-if simulator sliders
  const [investmentReturn, setInvestmentReturn] = useState(12); // Default 12% returns
  const [investmentYears, setInvestmentYears] = useState(10); // Default 10 years compounding

  const [editingId, setEditingId] = useState<string | null>(null);

  const parseNum = (v: string) => {
    const n = parseFloat(v.replace(/,/g, ''));
    return isNaN(n) || n < 0 ? 0 : n;
  };

  // Handle Preset Autofill
  const handleNameChange = (val: string) => {
    setName(val);
    const preset = INDIAN_PRESETS.find(p => p.name.toLowerCase() === val.toLowerCase());
    if (preset) {
      setCostStr(preset.cost.toString());
      setCycle(preset.cycle);
      setCategory(preset.category);
      if (preset.annualEquivalentCost) {
        setHasAnnualOption(true);
        setAnnualCostStr(preset.annualEquivalentCost.toString());
      } else {
        setHasAnnualOption(false);
        setAnnualCostStr('');
      }
    }
  };

  // Instant Add from Quick-Add buttons
  const handleQuickAdd = (presetName: string) => {
    const preset = INDIAN_PRESETS.find(p => p.name === presetName);
    if (!preset) return;

    // Check if already in list to avoid duplicates
    if (subs.some(s => s.name === preset.name)) {
      alert(`${preset.name} is already in your subscriptions list.`);
      return;
    }

    const newSub: Subscription = {
      id: Date.now().toString() + Math.random().toString(),
      name: preset.name,
      cost: preset.cost,
      cycle: preset.cycle,
      category: preset.category,
      annualEquivalentCost: preset.annualEquivalentCost,
      isUnused: false,
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // default 30 days out
    };

    setSubs(prev => [...prev, newSub]);
  };

  const handleAddOrEditSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !costStr) return;

    const cost = parseNum(costStr);
    const annualEquivalentCost = hasAnnualOption && annualCostStr ? parseNum(annualCostStr) : undefined;

    if (editingId) {
      setSubs(prev => prev.map(s => s.id === editingId ? {
        ...s,
        name,
        cost,
        cycle,
        category,
        annualEquivalentCost,
        isUnused,
        renewalDate: renewalDate || undefined
      } : s));
      setEditingId(null);
    } else {
      const newSub: Subscription = {
        id: Date.now().toString(),
        name,
        cost,
        cycle,
        category,
        annualEquivalentCost,
        isUnused,
        renewalDate: renewalDate || undefined
      };
      setSubs(prev => [...prev, newSub]);
    }

    // Reset Form
    setName('');
    setCostStr('');
    setCycle('monthly');
    setCategory('Entertainment');
    setHasAnnualOption(false);
    setAnnualCostStr('');
    setIsUnused(false);
    setRenewalDate('');
  };

  const handleEditClick = (sub: Subscription) => {
    setEditingId(sub.id);
    setName(sub.name);
    setCostStr(sub.cost.toString());
    setCycle(sub.cycle);
    setCategory(sub.category);
    setHasAnnualOption(!!sub.annualEquivalentCost);
    setAnnualCostStr(sub.annualEquivalentCost ? sub.annualEquivalentCost.toString() : '');
    setIsUnused(sub.isUnused);
    setRenewalDate(sub.renewalDate || '');
  };

  const handleDelete = (id: string) => {
    setSubs(prev => prev.filter(s => s.id !== id));
    if (editingId === id) {
      setEditingId(null);
    }
  };

  const toggleUnused = (id: string) => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, isUnused: !s.isUnused } : s));
  };

  // Calculations
  const metrics = useMemo(() => {
    let currentMonthlyTotal = 0;
    let currentAnnualTotal = 0;
    let optimizedAnnualTotal = 0;
    let potentialAnnualSavings = 0;

    subs.forEach(s => {
      const annualCost = s.cycle === 'yearly' ? s.cost : s.cost * 12;
      currentAnnualTotal += annualCost;
      currentMonthlyTotal += s.cycle === 'monthly' ? s.cost : s.cost / 12;

      if (s.isUnused) {
        // If it's unused, the recommendation is to cancel it (optimized cost is 0)
        potentialAnnualSavings += annualCost;
      } else {
        // If it's used, but has a cheaper annual equivalent plan
        if (s.annualEquivalentCost && s.annualEquivalentCost < annualCost) {
          optimizedAnnualTotal += s.annualEquivalentCost;
          potentialAnnualSavings += (annualCost - s.annualEquivalentCost);
        } else {
          optimizedAnnualTotal += annualCost;
        }
      }
    });

    return {
      currentMonthlyTotal: Math.round(currentMonthlyTotal),
      currentAnnualTotal: Math.round(currentAnnualTotal),
      optimizedAnnualTotal: Math.round(optimizedAnnualTotal),
      potentialAnnualSavings: Math.round(potentialAnnualSavings),
      projected10YearCurrent: Math.round(currentAnnualTotal * 10),
      projected10YearOptimized: Math.round(optimizedAnnualTotal * 10),
      tenYearSavings: Math.round(potentialAnnualSavings * 10)
    };
  }, [subs]);

  // Future value calculation for opportunity cost simulator
  // FV of Annuity = P * [((1 + r)^n - 1) / r]
  const opportunityCostFV = useMemo(() => {
    const annualSavings = metrics.potentialAnnualSavings;
    if (annualSavings <= 0) return 0;
    
    const r = investmentReturn / 100;
    const n = investmentYears;
    
    if (r === 0) return annualSavings * n;
    
    // Compounded future value at end of period
    const fv = annualSavings * ((Math.pow(1 + r, n) - 1) / r);
    return Math.round(fv);
  }, [metrics.potentialAnnualSavings, investmentReturn, investmentYears]);

  // Pie chart data by category (current costs)
  const categoryData = useMemo(() => {
    const dataMap: Record<string, number> = {};
    subs.forEach(s => {
      const annualCost = s.cycle === 'yearly' ? s.cost : s.cost * 12;
      dataMap[s.category] = (dataMap[s.category] || 0) + annualCost;
    });
    return Object.keys(dataMap).map(cat => ({
      name: cat,
      value: dataMap[cat]
    }));
  }, [subs]);

  // Projections chart data including Future Value of Savings invested
  const simulationChartData = useMemo(() => {
    const data = [];
    const r = investmentReturn / 100;
    
    let cumCurrentSpend = 0;
    let cumOptimizedSpend = 0;
    let cumPortfolio = 0;

    for (let yr = 1; yr <= investmentYears; yr++) {
      cumCurrentSpend += metrics.currentAnnualTotal;
      cumOptimizedSpend += metrics.optimizedAnnualTotal;
      
      // Portfolio compounds and gets new annual contribution
      cumPortfolio = (cumPortfolio * (1 + r)) + metrics.potentialAnnualSavings;

      data.push({
        year: `Yr ${yr}`,
        'Spent (Current)': Math.round(cumCurrentSpend),
        'Spent (Optimized)': Math.round(cumOptimizedSpend),
        'Invested Savings Growth': Math.round(cumPortfolio)
      });
    }
    return data;
  }, [metrics, investmentReturn, investmentYears]);

  const formatCurrency = (val: number) => {
    return val.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    });
  };

  // Helper to calculate days remaining to renewal
  const getRenewalStatus = (dateStr?: string) => {
    if (!dateStr) return null;
    const today = new Date();
    today.setHours(0,0,0,0);
    const renewal = new Date(dateStr);
    renewal.setHours(0,0,0,0);
    
    const diffTime = renewal.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { label: 'Overdue', color: 'text-red-600 bg-red-50 border-red-200' };
    if (diffDays === 0) return { label: 'Renews Today', color: 'text-rose-600 bg-rose-50 border-rose-200 animate-pulse font-extrabold' };
    if (diffDays === 1) return { label: 'Renews Tomorrow', color: 'text-amber-600 bg-amber-50 border-amber-200 font-bold' };
    if (diffDays <= 7) return { label: `In ${diffDays} days`, color: 'text-amber-500 bg-amber-50 border-amber-100 font-medium' };
    return { label: `In ${diffDays} days`, color: 'text-slate-500 bg-slate-50 border-slate-100' };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in bg-slate-50 min-h-screen">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wider uppercase">
            <Sparkles size={16} />
            <span>Life Hack Toolkit</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Subscription Optimizer & Lifetime Cost Calculator
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-2xl">
            Reveal the true long-term financial impact of your subscriptions. Switch to annual savings plans and prune unused subscriptions to compound your wealth.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase">Current Monthly Cost</span>
          <span className="text-2xl font-black text-slate-900 mt-2">{formatCurrency(metrics.currentMonthlyTotal)}</span>
          <span className="text-[11px] text-slate-500 mt-1">~{formatCurrency(metrics.currentAnnualTotal)} / year</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between border-l-4 border-l-red-500">
          <span className="text-xs font-bold text-slate-400 uppercase">10-Year Projected Cost</span>
          <span className="text-2xl font-black text-rose-600 mt-2">{formatCurrency(metrics.projected10YearCurrent)}</span>
          <span className="text-[11px] text-slate-500 mt-1">If no changes are made</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between border-l-4 border-l-emerald-500">
          <span className="text-xs font-bold text-slate-400 uppercase text-emerald-600">Annual Potential Savings</span>
          <span className="text-2xl font-black text-emerald-600 mt-2">{formatCurrency(metrics.potentialAnnualSavings)}</span>
          <span className="text-[11px] text-slate-500 mt-1">Cancel unused & switch billing cycles</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between bg-gradient-to-br from-indigo-50 to-indigo-100/30">
          <span className="text-xs font-bold text-indigo-700 uppercase">10-Year Savings Value</span>
          <span className="text-3xl font-black text-indigo-800 mt-2">{formatCurrency(metrics.tenYearSavings)}</span>
          <span className="text-[11px] text-indigo-600 font-semibold mt-1">Compound interest potential!</span>
        </div>
      </div>

      {/* Main Grid: Form, List, Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Add/Edit subscription form & Quick Add */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <CreditCard size={18} className="text-primary" />
              {editingId ? 'Edit Subscription' : 'Add Subscription'}
            </h2>

            <form onSubmit={handleAddOrEditSub} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Subscription Name (Select or Type)</label>
                <input
                  type="text"
                  list="subscription-presets"
                  value={name}
                  onChange={e => handleNameChange(e.target.value)}
                  placeholder="e.g. Netflix Premium, AWS, Gym"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                  required
                />
                <datalist id="subscription-presets">
                  {INDIAN_PRESETS.map((preset) => (
                    <option key={preset.name} value={preset.name}>
                      {preset.category} - {preset.cycle === 'monthly' ? `₹${preset.cost}/mo` : `₹${preset.cost}/yr`}
                    </option>
                  ))}
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Cost (₹)</label>
                  <input
                    type="text"
                    value={costStr}
                    onChange={e => setCostStr(e.target.value.replace(/[^0-9.]/g, ''))}
                    placeholder="e.g. 649"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Billing Cycle</label>
                  <select
                    value={cycle}
                    onChange={e => setCycle(e.target.value as 'monthly' | 'yearly')}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-slate-700"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as Subscription['category'])}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-slate-700"
                  >
                    <option value="Entertainment">Entertainment</option>
                    <option value="SaaS/Software">SaaS / Software</option>
                    <option value="Health & Fitness">Health & Fitness</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Next Renewal</label>
                  <input
                    type="date"
                    value={renewalDate}
                    onChange={e => setRenewalDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-slate-700"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-700">Cheaper Annual Plan?</span>
                    <span className="text-[10px] text-slate-400">Specify if they offer a cheaper annual package</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasAnnualOption}
                    onChange={e => setHasAnnualOption(e.target.checked)}
                    className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary"
                  />
                </div>

                {hasAnnualOption && (
                  <div className="animate-fade-in">
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Equivalent Annual Plan Cost (₹)</label>
                    <input
                      type="text"
                      value={annualCostStr}
                      onChange={e => setAnnualCostStr(e.target.value.replace(/[^0-9.]/g, ''))}
                      placeholder="e.g. 5999"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                      required={hasAnnualOption}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-700">Mark as "Unused / Rare"</span>
                    <span className="text-[10px] text-slate-400">Suggest cancelling to save immediately</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isUnused}
                    onChange={e => setIsUnused(e.target.checked)}
                    className="w-4 h-4 text-rose-500 border-slate-300 rounded focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                >
                  {editingId ? 'Update Subscription' : 'Add Subscription'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setName('');
                      setCostStr('');
                      setCycle('monthly');
                      setCategory('Entertainment');
                      setHasAnnualOption(false);
                      setAnnualCostStr('');
                      setIsUnused(false);
                      setRenewalDate('');
                    }}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Quick-Add Panel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Plus size={16} className="text-primary" />
              <span>⚡ Quick Add Indian Presets</span>
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_ADD_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleQuickAdd(preset.name)}
                  className="p-2.5 text-[11px] font-bold bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 rounded-xl transition-all text-left flex items-center gap-2 truncate group"
                  title={`Add ${preset.name}`}
                >
                  <span className="text-sm shrink-0 group-hover:scale-110 transition-transform">{preset.icon}</span>
                  <span className="truncate">{preset.name.split(' (')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Middle/Right columns: Subscriptions List & Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subscription List Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800">Your Active Subscriptions ({subs.length})</h2>
              <span className="text-xs text-slate-400">Click toggles to customize optimizer recommendations</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-5 py-3.5">Name</th>
                    <th className="px-5 py-3.5">Cost</th>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5">Next Renewal</th>
                    <th className="px-5 py-3.5">Annual Alt</th>
                    <th className="px-5 py-3.5 text-center">Unused?</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {subs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-10 text-center text-slate-400">
                        No subscriptions added yet. Add your subscriptions to start optimizing!
                      </td>
                    </tr>
                  ) : (
                    subs.map(sub => {
                      const annualCost = sub.cycle === 'yearly' ? sub.cost : sub.cost * 12;
                      const hasPotentialAnnualSavings = sub.annualEquivalentCost && sub.annualEquivalentCost < annualCost;
                      const status = getRenewalStatus(sub.renewalDate);

                      return (
                        <tr key={sub.id} className={`hover:bg-slate-50/50 transition-colors ${sub.isUnused ? 'bg-rose-50/30' : ''}`}>
                          <td className="px-5 py-4">
                            <div className="font-bold text-slate-800">{sub.name}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{sub.cycle === 'monthly' ? 'Monthly Billing' : 'Annual Billing'}</div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="font-bold">{formatCurrency(sub.cost)}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">₹{Math.round(annualCost).toLocaleString('en-IN')}/yr</div>
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className="px-2.5 py-1 rounded-full text-[10px] font-bold border"
                              style={{
                                color: CATEGORY_COLORS[sub.category],
                                borderColor: `${CATEGORY_COLORS[sub.category]}22`,
                                backgroundColor: `${CATEGORY_COLORS[sub.category]}08`
                              }}
                            >
                              {sub.category}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            {status ? (
                              <span className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold whitespace-nowrap ${status.color}`}>
                                {status.label}
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            {sub.annualEquivalentCost ? (
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-800">{formatCurrency(sub.annualEquivalentCost)}/yr</span>
                                {hasPotentialAnnualSavings && !sub.isUnused && (
                                  <span className="text-[9px] text-emerald-600 font-bold">
                                    Save {formatCurrency(annualCost - sub.annualEquivalentCost)}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-center">
                            <button
                              onClick={() => toggleUnused(sub.id)}
                              className={`p-1.5 rounded-lg border transition-all ${
                                sub.isUnused
                                  ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                              }`}
                              title={sub.isUnused ? "Mark as Active" : "Mark as Unused / Cancel Candidate"}
                            >
                              {sub.isUnused ? <ShieldAlert size={14} /> : <X size={14} />}
                            </button>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditClick(sub)}
                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                title="Edit"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => handleDelete(sub.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Optimizer Recommendations Checklist */}
          {subs.length > 0 && (
            <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-lg border border-indigo-950 space-y-4">
              <h3 className="text-sm font-bold tracking-wider uppercase text-indigo-200 flex items-center gap-1.5">
                <TrendingDown size={16} />
                <span>Optimization Plan Recommendations</span>
              </h3>
              
              <div className="space-y-3">
                {subs.map(sub => {
                  const annualCost = sub.cycle === 'yearly' ? sub.cost : sub.cost * 12;
                  
                  if (sub.isUnused) {
                    return (
                      <div key={`rec-${sub.id}`} className="flex items-start gap-3 bg-white/8 p-3.5 rounded-xl border border-white/5">
                        <div className="w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <X size={12} className="text-white" />
                        </div>
                        <div>
                          <div className="text-xs font-bold">Prune Rare/Unused: <span className="text-rose-300 font-extrabold">{sub.name}</span></div>
                          <p className="text-[11px] text-indigo-200/80 mt-0.5">You marked this as rarely used. Cancelling it saves you <span className="text-white font-bold">{formatCurrency(annualCost)}</span> every year.</p>
                        </div>
                      </div>
                    );
                  }

                  if (sub.annualEquivalentCost && sub.annualEquivalentCost < annualCost) {
                    return (
                      <div key={`rec-${sub.id}`} className="flex items-start gap-3 bg-white/8 p-3.5 rounded-xl border border-white/5">
                        <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={12} className="text-white" />
                        </div>
                        <div>
                          <div className="text-xs font-bold">Switch Billing: <span className="text-emerald-300 font-extrabold">{sub.name}</span></div>
                          <p className="text-[11px] text-indigo-200/80 mt-0.5">
                            Switching from monthly to the annual plan (worth {formatCurrency(sub.annualEquivalentCost)}) will save you <span className="text-white font-bold">{formatCurrency(annualCost - sub.annualEquivalentCost)}</span> annually.
                          </p>
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}

                {subs.every(s => !s.isUnused && (!s.annualEquivalentCost || s.annualEquivalentCost >= (s.cycle === 'yearly' ? s.cost : s.cost * 12))) && (
                  <div className="text-center py-4 text-indigo-200 text-xs font-medium">
                    🎉 Excellent! Your current subscriptions are fully optimized! No immediate savings plans are needed.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Visual Analytics & Opportunity Cost Simulator */}
      {subs.length > 0 && (
        <div className="space-y-8 border-t border-slate-200 pt-8">
          {/* Interactive What-If Opportunity Cost Simulator */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm tracking-wider uppercase">
                  <Flame size={16} />
                  <span>The Savings Multiplier</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800">Interactive Opportunity Cost Simulator</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Instead of paying for optimized subscriptions, what if you invested that exact saved amount every single year? Slide parameters to see your wealth accumulate.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                    <span>Expected Investment Return</span>
                    <span className="text-indigo-600 font-black">{investmentReturn}% / year</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="20"
                    step="1"
                    value={investmentReturn}
                    onChange={e => setInvestmentReturn(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                    <span>Duration of Compounding</span>
                    <span className="text-indigo-600 font-black">{investmentYears} years</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="30"
                    step="1"
                    value={investmentYears}
                    onChange={e => setInvestmentYears(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">Future Wealth Created</span>
                <span className="text-3xl font-black text-indigo-900 mt-1">{formatCurrency(opportunityCostFV)}</span>
                <span className="text-[11px] text-indigo-600 font-bold mt-1.5 flex items-center gap-1">
                  <Award size={12} className="shrink-0" />
                  Invested at {investmentReturn}% over {investmentYears} years!
                </span>
              </div>
            </div>

            {/* Opportunity Cost Chart */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                <span>Wealth Projection Chart</span>
                <span className="text-slate-400 text-[10px] lowercase normal-case">Savings vs Subscriptions Cumulative Spend</span>
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={simulationChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="currentSpendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.05}/>
                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="optSpendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.05}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="year" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(value: any) => [formatCurrency(Number(value)), '']}
                      contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 10, fontWeight: 600 }} />
                    <Area type="monotone" dataKey="Spent (Current)" stroke="#ec4899" strokeWidth={1.5} strokeDasharray="4 4" fill="url(#currentSpendGrad)" />
                    <Area type="monotone" dataKey="Spent (Optimized)" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="4 4" fill="url(#optSpendGrad)" />
                    <Area type="monotone" dataKey="Invested Savings Growth" stroke="#10b981" strokeWidth={2.5} fill="url(#portfolioGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Lower Charts: Category Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-800">Category Share (Annual)</h3>
              <div className="h-64 flex items-center justify-center">
                {categoryData.length === 0 ? (
                  <span className="text-xs text-slate-400">No data available</span>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {categoryData.map((entry) => (
                          <Cell key={`cell-${entry.name}`} fill={CATEGORY_COLORS[entry.name as Subscription['category']] || '#cbd5e1'} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => [formatCurrency(Number(value)), 'Annual Cost']}
                        contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              {/* Legend */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                {categoryData.map(c => (
                  <div key={c.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_COLORS[c.name as Subscription['category']] }} />
                    <div className="text-[10px] font-semibold text-slate-600 truncate">
                      {c.name}: <span className="text-slate-800 font-extrabold">{formatCurrency(c.value)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick action checklist details */}
            <div className="md:col-span-2 bg-indigo-900 text-white p-6 rounded-2xl shadow-lg border border-indigo-950 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-sm font-bold tracking-wider uppercase text-indigo-200 flex items-center gap-1.5 border-b border-indigo-850 pb-2">
                  <BadgeInfo size={16} />
                  <span>How to Execute Your Optimization Plan</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <h4 className="font-bold text-indigo-300">Phase 1: Immediate Cancellations</h4>
                    <p className="text-[11px] text-indigo-200/80 leading-relaxed">
                      Log in to the accounts for <span className="font-bold text-white">rarely used</span> services (marked with the Shield Alert symbol) and turn off auto-renew immediately. They will continue working until the current billing cycle expires.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-indigo-300">Phase 2: Billing Cycle Switch</h4>
                    <p className="text-[11px] text-indigo-200/80 leading-relaxed">
                      For services you use regularly, check if they offer an annual option. Switching saves up to 25% on average. Swap to annual plans on their renewal dates.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-indigo-850 pt-4 mt-6 flex items-center justify-between flex-wrap gap-3">
                <div className="text-xs text-indigo-200">
                  Total annual savings: <span className="font-bold text-white">{formatCurrency(metrics.potentialAnnualSavings)}</span>
                </div>
                <button
                  onClick={() => {
                    const textContent = `ZEZHATOOLS SUBSCRIPTION OPTIMIZATION REPORT\n\n` +
                      `Current Monthly Outflow: ${formatCurrency(metrics.currentMonthlyTotal)}\n` +
                      `Current Annual Outflow: ${formatCurrency(metrics.currentAnnualTotal)}\n` +
                      `Optimized Annual Outflow: ${formatCurrency(metrics.optimizedAnnualTotal)}\n` +
                      `Potential Annual Savings: ${formatCurrency(metrics.potentialAnnualSavings)}\n\n` +
                      `ACTIVE SUBSCRIPTIONS:\n` +
                      subs.map(s => `- ${s.name}: ${formatCurrency(s.cost)}/${s.cycle} [Category: ${s.category}]${s.isUnused ? ' *UNUSED - CANCEL*' : ''}`).join('\n') +
                      `\n\nGenerated via ZezhaTools.com`;
                    const blob = new Blob([textContent], { type: 'text/plain' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = 'subscription_optimization_report.txt';
                    link.click();
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-950/50 border border-indigo-500/20"
                >
                  <Download size={14} />
                  <span>Export Report (TXT)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Helpful educational tips footer card */}
      <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200/60 flex items-start gap-4">
        <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-200/50 flex items-center justify-center shrink-0 text-slate-500">
          <BadgeInfo size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Subscription Optimization Hacks</h4>
          <ul className="text-xs text-slate-500 space-y-1.5 list-disc pl-4 pt-1">
            <li><strong>Calendar Auditing:</strong> Set a recurring quarterly reminder to review your bank statement specifically for subscriptions.</li>
            <li><strong>The "Free Trial" Hack:</strong> Cancel the subscription immediately after signing up for a free trial. You will still get the trial, but won't be charged if you forget.</li>
            <li><strong>Family Share & Slots:</strong> Look into multi-user family plans. Often, sharing a plan with 4 people costs less than 2 individual plans combined.</li>
            <li><strong>Compound Interest Alert:</strong> If you saved ₹{metrics.potentialAnnualSavings.toLocaleString('en-IN')} every year for 10 years and invested it at a 12% annual return, it would grow to approximately <span className="font-extrabold text-slate-800">₹{(metrics.potentialAnnualSavings * 17.5).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
