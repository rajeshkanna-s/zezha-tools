import React, { useState, useMemo } from 'react';
import { Scale, Plus, Trash2, Award, Info, RefreshCw, Sparkles, Check, Download, AlertTriangle, ArrowRight } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface Criterion {
  id: string;
  name: string;
  weight: number; // 1-10 importance
}

interface Option {
  id: string;
  name: string;
  scores: Record<string, number>; // criterionId -> score (1-10)
}

// Preset templates for different types of choices
const DECISION_PRESETS: Record<string, { title: string; criteria: Criterion[]; options: Option[] }> = {
  job: {
    title: 'Choosing a Job Offer',
    criteria: [
      { id: 'c1', name: 'Salary & Compensation', weight: 9 },
      { id: 'c2', name: 'Work-Life Balance', weight: 8 },
      { id: 'c3', name: 'Growth Opportunities', weight: 7 },
      { id: 'c4', name: 'Commute & Location', weight: 5 },
      { id: 'c5', name: 'Tech Stack & Learning', weight: 6 },
    ],
    options: [
      { id: 'o1', name: 'Offer A (Fintech Startup)', scores: { c1: 9, c2: 4, c3: 9, c4: 8, c5: 9 } },
      { id: 'o2', name: 'Offer B (Enterprise Corp)', scores: { c1: 8, c2: 8, c3: 6, c4: 5, c5: 5 } },
      { id: 'o3', name: 'Offer C (Remote Consultant)', scores: { c1: 7, c2: 9, c3: 5, c4: 10, c5: 6 } },
    ]
  },
  car: {
    title: 'Buying a New Car',
    criteria: [
      { id: 'c1', name: 'Purchase Price', weight: 9 },
      { id: 'c2', name: 'Fuel Efficiency / Range', weight: 8 },
      { id: 'c3', name: 'Safety Ratings', weight: 7 },
      { id: 'c4', name: 'Comfort & Cabin Space', weight: 6 },
      { id: 'c5', name: 'Resale Value & Brand', weight: 5 },
    ],
    options: [
      { id: 'o1', name: 'SUV (Spacious but Costly)', scores: { c1: 5, c2: 5, c3: 9, c4: 9, c5: 8 } },
      { id: 'o2', name: 'Sedan (Balanced Comfort)', scores: { c1: 7, c2: 7, c3: 8, c4: 7, c5: 7 } },
      { id: 'o3', name: 'EV Hatchback (High Efficiency)', scores: { c1: 6, c2: 10, c3: 8, c4: 6, c5: 6 } },
    ]
  },
  apartment: {
    title: 'Renting an Apartment',
    criteria: [
      { id: 'c1', name: 'Monthly Rent', weight: 10 },
      { id: 'c2', name: 'Distance to Office', weight: 8 },
      { id: 'c3', name: 'Neighborhood Safety', weight: 8 },
      { id: 'c4', name: 'Amenities (Gym, Pool)', weight: 4 },
      { id: 'c5', name: 'Size & Sunlight', weight: 6 },
    ],
    options: [
      { id: 'o1', name: 'Downtown Condo (Small/Expensive)', scores: { c1: 4, c2: 10, c3: 8, c4: 9, c5: 5 } },
      { id: 'o2', name: 'Suburban Villa (Large/Cheap)', scores: { c1: 8, c2: 4, c3: 7, c4: 3, c5: 9 } },
      { id: 'o3', name: 'Midtown Flat (Shared/Balanced)', scores: { c1: 7, c2: 7, c3: 9, c4: 6, c5: 7 } },
    ]
  },
  techstack: {
    title: 'Choosing a Web Framework',
    criteria: [
      { id: 'c1', name: 'Performance & Speed', weight: 7 },
      { id: 'c2', name: 'Developer Ecosystem', weight: 9 },
      { id: 'c3', name: 'Learning Curve', weight: 8 },
      { id: 'c4', name: 'Hosting & Deployment Cost', weight: 6 },
      { id: 'c5', name: 'Time to Market / Speed', weight: 8 },
    ],
    options: [
      { id: 'o1', name: 'Next.js (React Stack)', scores: { c1: 8, c2: 10, c3: 7, c4: 7, c5: 9 } },
      { id: 'o2', name: 'Go + HTMX (Lightweight)', scores: { c1: 10, c2: 5, c3: 6, c4: 9, c5: 7 } },
      { id: 'o3', name: 'Ruby on Rails (Monolith)', scores: { c1: 6, c2: 8, c3: 8, c4: 6, c5: 10 } },
    ]
  }
};

export const DecisionMatrixPage: React.FC = () => {
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>('job');
  const [criteria, setCriteria] = useState<Criterion[]>(DECISION_PRESETS.job.criteria);
  const [options, setOptions] = useState<Option[]>(DECISION_PRESETS.job.options);

  // New Criterion Form State
  const [newCritName, setNewCritName] = useState('');
  const [newCritWeight, setNewCritWeight] = useState(5);

  // New Option Form State
  const [newOptName, setNewOptName] = useState('');

  // Handle Preset Load
  const handlePresetSelect = (key: string) => {
    setSelectedPresetKey(key);
    if (DECISION_PRESETS[key]) {
      setCriteria(DECISION_PRESETS[key].criteria);
      setOptions(DECISION_PRESETS[key].options);
    }
  };

  // Add a Criterion
  const handleAddCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCritName.trim()) return;

    const newId = 'crit_' + Date.now();
    const newCrit: Criterion = {
      id: newId,
      name: newCritName.trim(),
      weight: newCritWeight
    };

    setCriteria(prev => [...prev, newCrit]);
    // Initialize scores for this new criterion for all existing options to a default of 5
    setOptions(prev => prev.map(opt => ({
      ...opt,
      scores: {
        ...opt.scores,
        [newId]: 5
      }
    })));

    setNewCritName('');
    setNewCritWeight(5);
  };

  // Add an Option
  const handleAddOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOptName.trim()) return;

    // Initialize scores for all criteria to 5
    const initialScores: Record<string, number> = {};
    criteria.forEach(c => {
      initialScores[c.id] = 5;
    });

    const newOpt: Option = {
      id: 'opt_' + Date.now(),
      name: newOptName.trim(),
      scores: initialScores
    };

    setOptions(prev => [...prev, newOpt]);
    setNewOptName('');
  };

  // Delete Criterion
  const handleDeleteCriterion = (id: string) => {
    setCriteria(prev => prev.filter(c => c.id !== id));
    setOptions(prev => prev.map(opt => {
      const newScores = { ...opt.scores };
      delete newScores[id];
      return { ...opt, scores: newScores };
    }));
  };

  // Delete Option
  const handleDeleteOption = (id: string) => {
    setOptions(prev => prev.filter(o => o.id !== id));
  };

  // Update score for a specific cell
  const handleScoreChange = (optionId: string, criterionId: string, val: number) => {
    setOptions(prev => prev.map(opt => {
      if (opt.id === optionId) {
        return {
          ...opt,
          scores: {
            ...opt.scores,
            [criterionId]: val
          }
        };
      }
      return opt;
    }));
  };

  // Update criterion weight
  const handleWeightChange = (critId: string, val: number) => {
    setCriteria(prev => prev.map(c => c.id === critId ? { ...c, weight: val } : c));
  };

  // Calculations
  const calculatedResults = useMemo(() => {
    if (criteria.length === 0) return [];

    const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);

    const data = options.map(opt => {
      let weightedSum = 0;
      criteria.forEach(c => {
        const score = opt.scores[c.id] || 0;
        weightedSum += score * c.weight;
      });

      // Normalised score out of 10
      const scoreOutOfTen = totalWeight > 0 ? (weightedSum / totalWeight) : 0;
      const scorePct = scoreOutOfTen * 10; // Out of 100%

      return {
        id: opt.id,
        name: opt.name,
        weightedSum: Math.round(weightedSum),
        scoreOutOfTen: parseFloat(scoreOutOfTen.toFixed(2)),
        scorePct: parseFloat(scorePct.toFixed(1))
      };
    });

    // Sort by descending score to find the winner
    return [...data].sort((a, b) => b.scorePct - a.scorePct);
  }, [criteria, options]);

  // Find the winner & runner-up
  const analysis = useMemo(() => {
    if (calculatedResults.length === 0) return null;
    const winnerObj = calculatedResults[0];
    const runnerUp = calculatedResults[1] || null;

    let margin = 0;
    let advice = 'You have a single option listed. Add more to compare.';
    let type: 'clear' | 'marginal' | 'none' = 'none';

    if (runnerUp) {
      margin = parseFloat((winnerObj.scorePct - runnerUp.scorePct).toFixed(1));
      if (margin < 5) {
        type = 'marginal';
        advice = `⚠️ Marginal Call: The margin between "${winnerObj.name}" and "${runnerUp.name}" is extremely narrow (${margin}%). Re-evaluate your weights or check if there is an unlisted tie-breaker factor.`;
      } else {
        type = 'clear';
        advice = `🎉 Clear Choice: "${winnerObj.name}" stands out as a strong mathematically optimal choice with a comfortable ${margin}% lead over the runner-up.`;
      }
    } else if (winnerObj) {
      advice = `🏆 Leader: "${winnerObj.name}" is your primary choice. Add another alternative to see comparative stats.`;
    }

    return {
      winner: winnerObj,
      runnerUp,
      margin,
      advice,
      type
    };
  }, [calculatedResults]);

  // Chart Data: stacked bar chart showing contribution of each criterion
  const chartData = useMemo(() => {
    return options.map(opt => {
      const dataPoint: Record<string, any> = {
        name: opt.name
      };

      criteria.forEach(c => {
        // Weighted contribution of this criterion
        const score = opt.scores[c.id] || 0;
        dataPoint[c.name] = parseFloat((score * c.weight).toFixed(1));
      });

      return dataPoint;
    });
  }, [criteria, options]);

  // Pre-defined slate of colors for stacked bar elements
  const BAR_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6', '#f43f5e'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in bg-slate-50 min-h-screen">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm tracking-wider uppercase">
            <Sparkles size={16} />
            <span>Decision Intelligence</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Weighted Decision Matrix (Choice Helper)
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-2xl">
            Avoid analysis paralysis. Rank competing options against your customized criteria, weight their importance, and let mathematics guide your next big decision.
          </p>
        </div>

        {/* Preset Select Dropdown */}
        <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
          <label className="text-xs font-bold text-slate-500 uppercase whitespace-nowrap">Load Preset:</label>
          <select
            value={selectedPresetKey}
            onChange={e => handlePresetSelect(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm focus:outline-none"
          >
            <option value="job">Choosing a Job Offer</option>
            <option value="car">Buying a New Car</option>
            <option value="apartment">Renting an Apartment</option>
            <option value="techstack">Choosing a Web Framework</option>
          </select>
        </div>
      </div>

      {/* Winner Display Block */}
      {analysis?.winner && analysis.winner.scorePct > 0 && (
        <div className={`p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border ${
          analysis.type === 'marginal'
            ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 border-amber-400/20 text-white'
            : 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 border-indigo-500/20 text-white'
        }`}>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase text-white/90 flex items-center gap-1">
                <Award size={12} />
                Winner
              </span>
            </div>
            <h2 className="text-2xl font-black">{analysis.winner.name}</h2>
            <p className="text-white/90 text-xs font-medium max-w-2xl leading-relaxed">
              {analysis.advice}
            </p>
          </div>
          <div className="bg-white/10 px-6 py-4 rounded-2xl border border-white/10 flex flex-col items-center shrink-0">
            <span className="text-5xl font-black">{analysis.winner.scorePct}%</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 mt-1">Weighted Fit Score</span>
          </div>
        </div>
      )}

      {/* Grid: Controls & Option Adders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Manage Criteria Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3">
            <Scale size={16} className="text-indigo-600" />
            <span>Step 1: Set Decision Factors (Criteria)</span>
          </h3>

          <form onSubmit={handleAddCriterion} className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={newCritName}
                onChange={e => setNewCritName(e.target.value)}
                placeholder="e.g. Brand value, Commute time"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                required
              />
            </div>
            <div className="w-24">
              <select
                value={newCritWeight}
                onChange={e => setNewCritWeight(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold text-slate-700"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>Wt: {i + 1}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-indigo-100"
            >
              <Plus size={16} />
            </button>
          </form>

          {/* Quick list of factors with weights */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {criteria.map(crit => (
              <div key={crit.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/50">
                <span className="text-xs font-bold text-slate-700">{crit.name}</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-semibold">Weight:</span>
                    <select
                      value={crit.weight}
                      onChange={e => handleWeightChange(crit.id, Number(e.target.value))}
                      className="bg-white border border-slate-200 rounded-md text-[11px] font-bold text-slate-700 px-1.5 py-0.5"
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => handleDeleteCriterion(crit.id)}
                    className="text-slate-400 hover:text-rose-600 p-0.5 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Manage Options Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3">
            <Plus size={16} className="text-indigo-600" />
            <span>Step 2: Add Competitors (Options)</span>
          </h3>

          <form onSubmit={handleAddOption} className="flex gap-3">
            <input
              type="text"
              value={newOptName}
              onChange={e => setNewOptName(e.target.value)}
              placeholder="e.g. Brand New SUV, 3-Year Old Hatchback"
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
              required
            />
            <button
              type="submit"
              className="px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-center transition-colors shadow-lg shadow-indigo-100 shrink-0"
            >
              Add Option
            </button>
          </form>

          {/* Quick list of options */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {options.map(opt => (
              <div key={opt.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/50">
                <span className="text-xs font-bold text-slate-700">{opt.name}</span>
                <button
                  onClick={() => handleDeleteOption(opt.id)}
                  className="text-slate-400 hover:text-rose-600 p-0.5 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Matrix Scoring Table */}
      {criteria.length > 0 && options.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Step 3: Score Options (Rate 1-10)</h3>
              <p className="text-slate-400 text-[11px] mt-0.5">Rate how well each option performs in each category. 10 is perfect/best, 1 is poor.</p>
            </div>
            {/* Export TXT report */}
            <button
              onClick={() => {
                const textContent = `ZEZHATOOLS DECISION MATRIX REPORT\n\n` +
                  `DECISION: ${DECISION_PRESETS[selectedPresetKey]?.title || 'Custom Decision'}\n\n` +
                  `CRITERIA:\n` +
                  criteria.map(c => `- ${c.name} (Weight: ${c.weight})`).join('\n') +
                  `\n\nOPTIONS SCORING:\n` +
                  options.map(opt => {
                    const res = calculatedResults.find(r => r.id === opt.id);
                    return `* ${opt.name}\n` +
                      criteria.map(c => `  - ${c.name}: ${opt.scores[c.id]}/10`).join('\n') +
                      `\n  - Final Fit Score: ${res ? res.scorePct : 0}% (${res ? res.scoreOutOfTen : 0}/10)`;
                  }).join('\n\n') +
                  `\n\nWinner Recommendation: ${analysis?.winner?.name || 'None'}\n` +
                  `Analysis Advice: ${analysis?.advice || ''}\n\n` +
                  `Generated via ZezhaTools.com`;
                const blob = new Blob([textContent], { type: 'text/plain' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'decision_matrix_report.txt';
                link.click();
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-100 border border-indigo-500/20"
            >
              <Download size={14} />
              <span>Export Decision (TXT)</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4 min-w-[200px]">Options</th>
                  {criteria.map(c => (
                    <th key={c.id} className="px-4 py-4 text-center">
                      <div className="font-bold text-slate-700">{c.name}</div>
                      <div className="text-[10px] text-indigo-500 font-extrabold mt-0.5">Wt: {c.weight}</div>
                    </th>
                  ))}
                  <th className="px-6 py-4 text-right min-w-[120px]">Final Weighted Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {options.map(opt => {
                  const resultObj = calculatedResults.find(r => r.id === opt.id);
                  const isWinner = analysis?.winner && analysis.winner.id === opt.id;

                  return (
                    <tr key={opt.id} className={`hover:bg-slate-50/50 transition-colors ${isWinner ? 'bg-indigo-50/10' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {isWinner && <Award size={14} className="text-amber-500 fill-amber-500 shrink-0" />}
                          <span className={`font-bold ${isWinner ? 'text-indigo-900' : 'text-slate-800'}`}>{opt.name}</span>
                        </div>
                      </td>
                      {criteria.map(c => {
                        const score = opt.scores[c.id] || 5;
                        return (
                          <td key={c.id} className="px-4 py-4 text-center">
                            <select
                              value={score}
                              onChange={e => handleScoreChange(opt.id, c.id, Number(e.target.value))}
                              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 mx-auto"
                            >
                              {[...Array(10)].map((_, idx) => (
                                <option key={idx + 1} value={idx + 1}>{idx + 1}</option>
                              ))}
                            </select>
                          </td>
                        );
                      })}
                      <td className="px-6 py-4 text-right">
                        <div className="flex flex-col items-end">
                          <span className={`text-sm font-black ${isWinner ? 'text-indigo-700 animate-pulse' : 'text-slate-800'}`}>
                            {resultObj ? `${resultObj.scorePct}%` : '0%'}
                          </span>
                          <span className="text-[9px] text-slate-400 font-medium">
                            {resultObj ? `(${resultObj.scoreOutOfTen} / 10)` : '(0/10)'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center shadow-sm">
          <Scale size={48} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500 text-sm font-semibold">Add at least one Option and one Criterion factor to generate the Matrix Table.</p>
        </div>
      )}

      {/* Visual Charts & Breakdown */}
      {criteria.length > 0 && options.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-t border-slate-200 pt-8">
          {/* Stacked Chart displaying Criterion contribution */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 font-display">Weighted Points Contribution</h3>
            <p className="text-[11px] text-slate-400">
              Understanding the math: This chart breaks down how much each individual factor contributed to each option's final score. (Weighted Score = Rating × Weight).
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  />
                  <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 10, fontWeight: 600, pt: 10 }} />
                  {criteria.map((c, index) => (
                    <Bar
                      key={c.id}
                      dataKey={c.name}
                      stackId="a"
                      fill={BAR_COLORS[index % BAR_COLORS.length]}
                      radius={index === criteria.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Rank Standings list */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 font-display">Final Leaderboard Standings</h3>
            
            <div className="space-y-3 pt-2">
              {calculatedResults.map((res, index) => {
                const isWinner = index === 0;
                return (
                  <div
                    key={res.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      isWinner
                        ? 'bg-indigo-50/50 border-indigo-200 text-indigo-900 shadow-sm'
                        : 'bg-slate-50/50 border-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                        isWinner ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="text-xs font-extrabold truncate max-w-[130px]">{res.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black">{res.scorePct}%</span>
                      {isWinner && <Check size={14} className="text-indigo-600 shrink-0" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Informative tips box */}
      <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200/60 flex items-start gap-4">
        <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-200/50 flex items-center justify-center shrink-0 text-slate-500">
          <Info size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">How to get the most out of Decision Matrices</h4>
          <ul className="text-xs text-slate-500 space-y-1.5 list-disc pl-4 pt-1">
            <li><strong>Keep weights distinct:</strong> Don't make everything a 10. Give weights (1-10) to clearly distinguish your actual priorities.</li>
            <li><strong>Eliminate biases:</strong> Rate options for one criterion at a time (e.g. rate the price of all options first), rather than rating one option across all criteria. This keeps your scoring objective.</li>
            <li><strong>Perform Sensitivity Checks:</strong> If scores are very close, adjust a criterion's weight slightly to see if the winner changes. This helps you understand how sensitive your decision is to individual factors.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
