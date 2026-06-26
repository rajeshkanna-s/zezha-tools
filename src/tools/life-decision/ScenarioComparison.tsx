import React from 'react';
import type { ComparisonResult } from './lifeDecisionEngine';
import { ArrowLeft, Trophy } from 'lucide-react';

interface Props {
    comparison: ComparisonResult;
    onBack: () => void;
}

export const ScenarioComparison: React.FC<Props> = ({ comparison, onBack }) => {
    if (comparison.scenarios.length < 2) return (
        <div className="max-w-2xl mx-auto text-center py-12">
            <p className="text-sm text-slate-500">Save at least 2 scenarios to compare them side by side.</p>
            <button onClick={onBack} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold">Go Back</button>
        </div>
    );

    const cols = comparison.scenarios;
    const metrics = [
        { label: 'Monthly Cash Flow', get: (r: any) => `₹${r.newMonthlySurplus.toLocaleString('en-IN')}`, better: 'higher' },
        { label: 'Risk Level', get: (r: any) => r.riskLevel, better: 'lower' },
        { label: 'Retire at Age', get: (r: any) => `${r.newRetirementAge}`, better: 'lower' },
        { label: 'Overall Score', get: (r: any) => `${r.overallScore}/100`, better: 'higher' },
    ];

    return (
        <div className="max-w-3xl mx-auto">
            <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors mb-4">
                <ArrowLeft size={14} /> Back
            </button>

            <h2 className="text-lg font-black text-slate-900 mb-4 text-center">📊 Scenario Comparison</h2>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="text-left px-4 py-3 text-slate-500 font-bold">Metric</th>
                            {cols.map((c, i) => (
                                <th key={i} className="text-center px-4 py-3">
                                    <div className="flex items-center justify-center gap-1.5 font-bold text-slate-800">
                                        {c.result.scenarioIcon} {c.name}
                                        {i === comparison.winner && <Trophy size={12} className="text-amber-500" />}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {metrics.map((m, i) => (
                            <tr key={i} className="border-b border-slate-100 last:border-0">
                                <td className="px-4 py-2.5 font-semibold text-slate-600">{m.label}</td>
                                {cols.map((c, j) => {
                                    const val = m.get(c.result);
                                    const isWinner = j === comparison.winner;
                                    return (
                                        <td key={j} className={`px-4 py-2.5 text-center font-bold ${isWinner ? 'text-primary bg-primary/5' : 'text-slate-700'}`}>
                                            {val} {isWinner && '✅'}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                <p className="text-sm font-bold text-emerald-800">
                    🏆 Winner: {cols[comparison.winner].result.scenarioIcon} {cols[comparison.winner].name} — Score {cols[comparison.winner].result.overallScore}/100
                </p>
            </div>
        </div>
    );
};
