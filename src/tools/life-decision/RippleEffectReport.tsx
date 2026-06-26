import React from 'react';
import type { ScenarioResult } from './lifeDecisionEngine';
import { ArrowLeft, Share2, Save, BarChart3 } from 'lucide-react';

interface Props {
    result: ScenarioResult;
    onBack: () => void;
    onSave: () => void;
    onCompare: () => void;
}

const statusBadge = (s: 'green' | 'yellow' | 'red' | 'neutral') => {
    if (s === 'green') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (s === 'yellow') return 'bg-amber-100 text-amber-700 border-amber-200';
    if (s === 'red') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-slate-100 text-slate-600 border-slate-200';
};

const riskBadge = (r: string) => {
    if (r === 'Low') return 'bg-emerald-100 text-emerald-700';
    if (r === 'Medium') return 'bg-amber-100 text-amber-700';
    if (r === 'High') return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
};

export const RippleEffectReport: React.FC<Props> = ({ result, onBack, onSave, onCompare }) => {
    return (
        <div className="max-w-3xl mx-auto space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors">
                    <ArrowLeft size={14} /> Back to Scenarios
                </button>
                <div className="flex gap-2">
                    <button onClick={onSave} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-all">
                        <Save size={12} /> Save
                    </button>
                    <button onClick={onCompare} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-100 text-violet-700 rounded-lg text-xs font-bold hover:bg-violet-200 transition-all">
                        <BarChart3 size={12} /> Compare
                    </button>
                </div>
            </div>

            {/* Title */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{result.scenarioIcon}</span>
                    <div>
                        <h2 className="text-lg font-black">{result.scenarioName}</h2>
                        <p className="text-xs text-slate-400">Full Impact Analysis</p>
                    </div>
                    <div className="ml-auto flex gap-2 items-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${riskBadge(result.riskLevel)}`}>{result.riskLevel} Risk</span>
                        <span className="text-2xl font-black text-primary">{result.overallScore}<span className="text-xs text-slate-400">/100</span></span>
                    </div>
                </div>
            </div>

            {/* Immediate Impact */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3">⚡ Immediate Impact</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {result.immediateImpact.map((item, i) => (
                        <div key={i} className={`rounded-lg px-3 py-2.5 border ${statusBadge(item.status)}`}>
                            <p className="text-[10px] font-semibold opacity-70">{item.label}</p>
                            <p className="text-sm font-black">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cash Flow Table */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3">📊 Monthly Cash Flow Impact</h3>
                <div className="overflow-x-auto -mx-4 px-4">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="text-left py-2 text-slate-500 font-bold">Metric</th>
                                <th className="text-right py-2 text-slate-500 font-bold">Now</th>
                                <th className="text-right py-2 text-slate-500 font-bold">After</th>
                                <th className="text-right py-2 text-slate-500 font-bold">Change</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.cashFlowRows.map((row, i) => (
                                <tr key={i} className="border-b border-slate-100 last:border-0">
                                    <td className="py-2 font-semibold text-slate-700">{row.label}</td>
                                    <td className="py-2 text-right text-slate-600 font-medium">{row.before}</td>
                                    <td className="py-2 text-right font-bold text-slate-800">{row.after}</td>
                                    <td className={`py-2 text-right font-bold ${row.status === 'green' ? 'text-emerald-600' : row.status === 'red' ? 'text-red-600' : 'text-amber-600'}`}>{row.change}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Impact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className={`rounded-xl border p-4 ${statusBadge(result.emergencyFundStatus)}`}>
                    <p className="text-[10px] font-black uppercase tracking-wider mb-1 opacity-70">🛡️ Emergency Fund</p>
                    <p className="text-xs font-bold">{result.emergencyFundImpact}</p>
                </div>
                <div className={`rounded-xl border p-4 ${statusBadge(result.retirementStatus)}`}>
                    <p className="text-[10px] font-black uppercase tracking-wider mb-1 opacity-70">🏖️ Retirement</p>
                    <p className="text-xs font-bold">{result.retirementImpact}</p>
                </div>
                <div className={`rounded-xl border p-4 ${statusBadge(result.taxStatus)}`}>
                    <p className="text-[10px] font-black uppercase tracking-wider mb-1 opacity-70">💰 Tax Impact</p>
                    <p className="text-xs font-bold">{result.taxImpact}</p>
                </div>
            </div>

            {/* Long Term Wealth */}
            {result.longTermWealth.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3">📈 Long-Term Wealth Impact</h3>
                    <div className="space-y-2">
                        {result.longTermWealth.map((row, i) => (
                            <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                                <span className="text-xs text-slate-600 font-semibold">{row.label}</span>
                                <div className="flex gap-6 text-xs">
                                    {row.withoutScenario > 0 && <span className="text-slate-500 font-medium">Without: ₹{(row.withoutScenario / 100000).toFixed(1)}L</span>}
                                    {row.withScenario > 0 && <span className="text-primary font-bold">With: ₹{(row.withScenario / 100000).toFixed(1)}L</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Plain English Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="text-xs font-black text-blue-800 uppercase tracking-wider mb-2">📝 The Honest Take</h3>
                <p className="text-sm text-blue-900 leading-relaxed font-medium">{result.summary}</p>
            </div>

            {/* Fix Suggestions */}
            {result.fixes.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3">🔧 How to Make This Work</h3>
                    <div className="space-y-2">
                        {result.fixes.map((fix, i) => (
                            <div key={i} className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                                <span className="text-xs bg-emerald-200 text-emerald-800 font-black rounded-full w-5 h-5 flex items-center justify-center shrink-0">{String.fromCharCode(65 + i)}</span>
                                <div>
                                    <p className="text-xs font-bold text-emerald-800">{fix.title}</p>
                                    <p className="text-[11px] text-emerald-700 mt-0.5">{fix.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
