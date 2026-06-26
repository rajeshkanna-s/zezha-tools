import React from 'react';
import type { BaselineSnapshot as SnapshotType } from './lifeDecisionEngine';

interface Props {
    snapshot: SnapshotType;
    onContinue: () => void;
    onEditBaseline: () => void;
}

const statusIcon = (s: 'green' | 'yellow' | 'red') => s === 'green' ? '🟢' : s === 'yellow' ? '🟡' : '🔴';
const statusBg = (s: 'green' | 'yellow' | 'red') => s === 'green' ? 'bg-emerald-50 border-emerald-200' : s === 'yellow' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200';
const statusText = (s: 'green' | 'yellow' | 'red') => s === 'green' ? 'text-emerald-700' : s === 'yellow' ? 'text-amber-700' : 'text-red-700';

export const BaselineSnapshotView: React.FC<Props> = ({ snapshot, onContinue, onEditBaseline }) => {
    return (
        <div className="max-w-2xl mx-auto">
            {/* Snapshot Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-2xl mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 pointer-events-none" />
                <div className="relative z-10">
                    <div className="text-center mb-5">
                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">Your Financial Baseline</p>
                        <h2 className="text-lg font-black tracking-tight">Financial Snapshot — {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {snapshot.metrics.map((m, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl px-3.5 py-2.5 border border-white/10">
                                <span className="text-sm">{statusIcon(m.status)}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] text-slate-400 font-semibold truncate">{m.label}</p>
                                    <p className="text-sm font-black text-white">{m.value}</p>
                                </div>
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${m.status === 'green' ? 'bg-emerald-500/20 text-emerald-300' : m.status === 'yellow' ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'}`}>
                                    {m.detail}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="text-center space-y-3">
                <p className="text-sm text-slate-600 font-medium">Now test any life decision → see what changes</p>
                <button onClick={onContinue}
                    className="px-8 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    🚀 Test a Life Decision
                </button>
                <div>
                    <button onClick={onEditBaseline}
                        className="text-xs text-slate-400 hover:text-primary font-semibold transition-colors">
                        ✏️ Edit Baseline
                    </button>
                </div>
            </div>
        </div>
    );
};
