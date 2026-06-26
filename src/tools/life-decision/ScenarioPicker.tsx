import React from 'react';

interface Props {
    onSelect: (scenarioId: string) => void;
}

const scenarios = [
    { id: 'buying-home', icon: '🏠', title: 'Buying a Home', desc: 'See full impact on your finances', color: 'from-blue-500/10 to-blue-600/5 border-blue-200 hover:border-blue-400' },
    { id: 'changing-jobs', icon: '💼', title: 'Changing Jobs', desc: 'Salary change + career growth', color: 'from-amber-500/10 to-amber-600/5 border-amber-200 hover:border-amber-400' },
    { id: 'starting-business', icon: '🚀', title: 'Starting a Business', desc: 'Leave job risk + upside', color: 'from-violet-500/10 to-violet-600/5 border-violet-200 hover:border-violet-400' },
    { id: 'having-child', icon: '👶', title: 'Having a Child', desc: 'Cost of raising child in India', color: 'from-pink-500/10 to-pink-600/5 border-pink-200 hover:border-pink-400' },
    { id: 'higher-education', icon: '🎓', title: 'Higher Education', desc: 'MBA / MS cost + career impact', color: 'from-indigo-500/10 to-indigo-600/5 border-indigo-200 hover:border-indigo-400' },
    { id: 'moving-abroad', icon: '🌍', title: 'Moving Abroad', desc: 'NRI financial implications', color: 'from-teal-500/10 to-teal-600/5 border-teal-200 hover:border-teal-400' },
    { id: 'getting-married', icon: '💍', title: 'Getting Married', desc: 'Cost + combined financial plan', color: 'from-rose-500/10 to-rose-600/5 border-rose-200 hover:border-rose-400' },
    { id: 'medical-emergency', icon: '🏥', title: 'Medical Emergency', desc: 'Unplanned cost impact', color: 'from-red-500/10 to-red-600/5 border-red-200 hover:border-red-400' },
    { id: 'big-investment', icon: '📈', title: 'Big Investment', desc: 'Lump sum or SIP timing', color: 'from-emerald-500/10 to-emerald-600/5 border-emerald-200 hover:border-emerald-400' },
    { id: 'buying-car', icon: '🚗', title: 'Buying a Car', desc: 'Loan vs cash analysis', color: 'from-orange-500/10 to-orange-600/5 border-orange-200 hover:border-orange-400' },
    { id: 'sabbatical', icon: '🏖️', title: 'Taking a Sabbatical', desc: '3–12 months off work', color: 'from-cyan-500/10 to-cyan-600/5 border-cyan-200 hover:border-cyan-400' },
    { id: 'custom', icon: '✏️', title: 'Build Your Own', desc: 'Any combination of changes', color: 'from-slate-500/10 to-slate-600/5 border-slate-200 hover:border-slate-400' },
];

export const ScenarioPicker: React.FC<Props> = ({ onSelect }) => {
    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-6">
                <h2 className="text-xl font-black text-slate-900 tracking-tight mb-1">What Decision Are You Thinking About?</h2>
                <p className="text-sm text-slate-500">Pick a life decision and see the complete ripple effect on your finances</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {scenarios.map(s => (
                    <button key={s.id} onClick={() => onSelect(s.id)}
                        className={`bg-gradient-to-br ${s.color} border rounded-xl p-4 text-left transition-all hover:shadow-lg hover:-translate-y-1 group`}>
                        <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform inline-block">{s.icon}</span>
                        <h3 className="text-sm font-bold text-slate-900 mb-0.5 leading-tight">{s.title}</h3>
                        <p className="text-[10px] text-slate-500 leading-snug">{s.desc}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};
