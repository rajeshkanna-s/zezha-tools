import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, DollarSign, Landmark, Target } from 'lucide-react';
import type { BaselineData } from './lifeDecisionEngine';
import { getDefaultBaseline, totalMonthlyIncome, totalMonthlyExpenses, totalAssets, totalDebts } from './lifeDecisionEngine';

interface BaselineFormProps {
    initial: BaselineData;
    onComplete: (data: BaselineData) => void;
}

const tabs = [
    { id: 'income', label: 'Income & Expenses', icon: DollarSign },
    { id: 'assets', label: 'Assets & Debts', icon: Landmark },
    { id: 'life', label: 'Life & Goals', icon: Target },
];

const InputField: React.FC<{ label: string; value: number; onChange: (v: number) => void; prefix?: string; suffix?: string; min?: number; max?: number; step?: number }> = ({ label, value, onChange, prefix = '₹', suffix, min = 0, max, step = 1000 }) => (
    <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-500">{label}</label>
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
            {prefix && <span className="text-xs text-slate-400 font-bold">{prefix}</span>}
            <input type="number" value={value || ''} onChange={e => onChange(Number(e.target.value) || 0)} min={min} max={max} step={step}
                className="flex-1 bg-transparent text-sm font-semibold text-slate-800 outline-none min-w-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="0" />
            {suffix && <span className="text-xs text-slate-400 font-bold">{suffix}</span>}
        </div>
    </div>
);

export const BaselineForm: React.FC<BaselineFormProps> = ({ initial, onComplete }) => {
    const [tab, setTab] = useState(0);
    const [data, setData] = useState<BaselineData>(initial);

    const u = (field: keyof BaselineData, value: any) => setData(prev => ({ ...prev, [field]: value }));

    const income = totalMonthlyIncome(data);
    const expenses = totalMonthlyExpenses(data);
    const surplus = income - expenses;
    const savingsRate = income > 0 ? (surplus / income * 100) : 0;
    const assets = totalAssets(data);
    const debts = totalDebts(data);
    const netWorth = assets - debts;

    return (
        <div className="max-w-2xl mx-auto">
            {/* Tab Bar */}
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6">
                {tabs.map((t, i) => {
                    const Icon = t.icon;
                    return (
                        <button key={t.id} onClick={() => setTab(i)}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all ${tab === i ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                            <Icon size={14} /> <span className="hidden sm:inline">{t.label}</span><span className="sm:hidden">{t.label.split(' ')[0]}</span>
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                {tab === 0 && (
                    <div className="space-y-5">
                        <h3 className="text-sm font-black text-slate-800 mb-3">💰 Monthly Income</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <InputField label="Primary Income (Salary/Business)" value={data.primaryIncome} onChange={v => u('primaryIncome', v)} />
                            <InputField label="Secondary Income (Rent/Freelance)" value={data.secondaryIncome} onChange={v => u('secondaryIncome', v)} />
                            <InputField label="Spouse Income (if any)" value={data.spouseIncome} onChange={v => u('spouseIncome', v)} />
                            <div className="flex flex-col justify-end">
                                <div className="bg-primary/5 border border-primary/20 rounded-lg px-3 py-2.5">
                                    <span className="text-[10px] text-primary font-bold block">TOTAL MONTHLY INCOME</span>
                                    <span className="text-sm font-black text-primary">₹{income.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-sm font-black text-slate-800 mt-6 mb-3">📊 Monthly Expenses</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <InputField label="Essential Expenses (Rent, Groceries, Bills)" value={data.essentialExpenses} onChange={v => u('essentialExpenses', v)} />
                            <InputField label="Discretionary Expenses (Dining, Shopping)" value={data.discretionaryExpenses} onChange={v => u('discretionaryExpenses', v)} />
                            <InputField label="Current Monthly EMIs" value={data.currentEMIs} onChange={v => u('currentEMIs', v)} />
                            <InputField label="Monthly Investments / SIPs" value={data.monthlyInvestments} onChange={v => u('monthlyInvestments', v)} />
                        </div>

                        {/* Live Stats */}
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            <div className={`rounded-lg px-3 py-2 border ${surplus >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                                <span className="text-[10px] font-bold block text-slate-500">Monthly Savings</span>
                                <span className={`text-sm font-black ${surplus >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>₹{surplus.toLocaleString('en-IN')}</span>
                            </div>
                            <div className={`rounded-lg px-3 py-2 border ${savingsRate >= 20 ? 'bg-emerald-50 border-emerald-200' : savingsRate >= 10 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
                                <span className="text-[10px] font-bold block text-slate-500">Savings Rate</span>
                                <span className={`text-sm font-black ${savingsRate >= 20 ? 'text-emerald-700' : savingsRate >= 10 ? 'text-amber-700' : 'text-red-700'}`}>{savingsRate.toFixed(1)}%</span>
                            </div>
                        </div>
                        {expenses > income && <p className="text-xs text-red-600 font-semibold mt-2 bg-red-50 rounded-lg px-3 py-2">⚠️ You're spending more than you earn</p>}
                    </div>
                )}

                {tab === 1 && (
                    <div className="space-y-5">
                        <h3 className="text-sm font-black text-slate-800 mb-3">💎 Assets</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <InputField label="Cash & Bank Balance" value={data.cashBank} onChange={v => u('cashBank', v)} />
                            <InputField label="Mutual Funds / Stocks / FDs" value={data.mfStocksFD} onChange={v => u('mfStocksFD', v)} />
                            <InputField label="EPF / PPF / NPS Balance" value={data.epfPpfNps} onChange={v => u('epfPpfNps', v)} />
                            <InputField label="Property Value (if owned)" value={data.propertyValue} onChange={v => u('propertyValue', v)} />
                            <InputField label="Gold & Other" value={data.goldOther} onChange={v => u('goldOther', v)} />
                            <div className="flex flex-col justify-end">
                                <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2.5">
                                    <span className="text-[10px] text-emerald-600 font-bold block">TOTAL ASSETS</span>
                                    <span className="text-sm font-black text-emerald-700">₹{assets.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-sm font-black text-slate-800 mt-6 mb-3">💳 Outstanding Debts</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <InputField label="Home Loan Balance" value={data.homeLoan} onChange={v => u('homeLoan', v)} />
                            <InputField label="Car Loan Balance" value={data.carLoan} onChange={v => u('carLoan', v)} />
                            <InputField label="Personal Loan Balance" value={data.personalLoan} onChange={v => u('personalLoan', v)} />
                            <InputField label="Credit Card Outstanding" value={data.creditCardDebt} onChange={v => u('creditCardDebt', v)} />
                            <div className="flex flex-col justify-end">
                                <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                                    <span className="text-[10px] text-red-600 font-bold block">TOTAL DEBTS</span>
                                    <span className="text-sm font-black text-red-700">₹{debts.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                            <div className="flex flex-col justify-end">
                                <div className={`rounded-lg px-3 py-2.5 border ${netWorth >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'}`}>
                                    <span className="text-[10px] font-bold block text-slate-500">NET WORTH</span>
                                    <span className={`text-sm font-black ${netWorth >= 0 ? 'text-blue-700' : 'text-red-700'}`}>₹{netWorth.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {tab === 2 && (
                    <div className="space-y-5">
                        <h3 className="text-sm font-black text-slate-800 mb-3">👤 Personal Details</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <InputField label="Current Age" value={data.currentAge} onChange={v => u('currentAge', v)} prefix="" suffix="years" min={18} max={80} step={1} />
                            <InputField label="Spouse Age (optional)" value={data.spouseAge} onChange={v => u('spouseAge', v)} prefix="" suffix="years" min={0} max={80} step={1} />
                            <InputField label="Number of Children" value={data.numChildren} onChange={v => { u('numChildren', v); u('childrenAges', Array(v).fill(0)); }} prefix="" min={0} max={10} step={1} />
                        </div>
                        {data.numChildren > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                {Array.from({ length: data.numChildren }).map((_, i) => (
                                    <InputField key={i} label={`Child ${i + 1} Age`} value={data.childrenAges[i] || 0} onChange={v => { const ages = [...data.childrenAges]; ages[i] = v; u('childrenAges', ages); }} prefix="" suffix="yr" min={0} max={30} step={1} />
                                ))}
                            </div>
                        )}
                        <div>
                            <label className="text-xs font-semibold text-slate-500 mb-1 block">Employment Type</label>
                            <div className="flex gap-2">
                                {(['salaried', 'business', 'freelance'] as const).map(t => (
                                    <button key={t} onClick={() => u('employmentType', t)}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${data.employmentType === t ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                        {t.charAt(0).toUpperCase() + t.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <h3 className="text-sm font-black text-slate-800 mt-6 mb-3">🎯 Goals</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <InputField label="Target Retirement Age" value={data.retirementAge} onChange={v => u('retirementAge', v)} prefix="" suffix="years" min={40} max={80} step={1} />
                            <InputField label="Expected Retirement Monthly Need" value={data.retirementMonthlyNeed} onChange={v => u('retirementMonthlyNeed', v)} />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 mb-1 block">Emergency Fund Target</label>
                            <div className="flex gap-2">
                                {([3, 6, 12] as const).map(m => (
                                    <button key={m} onClick={() => u('emergencyFundTarget', m)}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${data.emergencyFundTarget === m ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                        {m} months
                                    </button>
                                ))}
                            </div>
                        </div>

                        <h3 className="text-sm font-black text-slate-800 mt-6 mb-3">⚙️ Assumptions</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <InputField label="Expected Investment Return" value={data.expectedReturn} onChange={v => u('expectedReturn', v)} prefix="" suffix="%" min={1} max={30} step={0.5} />
                            <InputField label="Expected Inflation" value={data.expectedInflation} onChange={v => u('expectedInflation', v)} prefix="" suffix="%" min={1} max={15} step={0.5} />
                            <InputField label="Expected Salary Growth" value={data.salaryGrowth} onChange={v => u('salaryGrowth', v)} prefix="" suffix="%" min={0} max={30} step={0.5} />
                            <InputField label="Life Expectancy" value={data.lifeExpectancy} onChange={v => u('lifeExpectancy', v)} prefix="" suffix="years" min={60} max={100} step={1} />
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-5">
                <button onClick={() => setTab(Math.max(0, tab - 1))} disabled={tab === 0}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${tab === 0 ? 'opacity-30 cursor-not-allowed bg-slate-100 text-slate-400' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                    <ChevronLeft size={14} /> Previous
                </button>
                {tab < 2 ? (
                    <button onClick={() => setTab(tab + 1)}
                        className="flex items-center gap-1.5 px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all shadow-sm">
                        Next <ChevronRight size={14} />
                    </button>
                ) : (
                    <button onClick={() => onComplete(data)}
                        className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-sm animate-pulse">
                        ✨ Generate Financial Snapshot
                    </button>
                )}
            </div>
        </div>
    );
};
