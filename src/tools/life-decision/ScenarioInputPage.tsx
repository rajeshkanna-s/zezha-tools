import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type {
    BaselineData, ScenarioResult,
    HomeBuyingInputs,
    JobChangeInputs,
    ChildInputs,
    BusinessInputs,
    SabbaticalInputs,
    GenericScenarioInputs,
} from './lifeDecisionEngine';
import {
    computeHomeBuying,
    computeJobChange,
    computeHavingChild,
    computeStartingBusiness,
    computeSabbatical,
    computeGenericScenario,
} from './lifeDecisionEngine';

interface Props {
    scenarioId: string;
    baseline: BaselineData;
    onResult: (result: ScenarioResult) => void;
    onBack: () => void;
}

// ── Shared slider ──
const Slider: React.FC<{ label: string; value: number; onChange: (v: number) => void; min: number; max: number; step?: number; format?: (v: number) => string }> =
    ({ label, value, onChange, min, max, step = 1, format = v => v.toString() }) => (
        <div className="space-y-1">
            <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-500">{label}</label>
                <span className="text-xs font-black text-primary">{format(value)}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md" />
            <div className="flex justify-between text-[9px] text-slate-400">
                <span>{format(min)}</span><span>{format(max)}</span>
            </div>
        </div>
    );

const Toggle: React.FC<{ label: string; value: boolean; onChange: (v: boolean) => void }> = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">{label}</span>
        <button onClick={() => onChange(!value)} className={`w-10 h-5 rounded-full transition-colors relative ${value ? 'bg-primary' : 'bg-slate-300'}`}>
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? 'left-5' : 'left-0.5'}`} />
        </button>
    </div>
);

const InputField: React.FC<{ label: string; value: number; onChange: (v: number) => void; prefix?: string }> = ({ label, value, onChange, prefix = '₹' }) => (
    <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-500">{label}</label>
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-primary/20">
            {prefix && <span className="text-xs text-slate-400 font-bold">{prefix}</span>}
            <input type="number" value={value || ''} onChange={e => onChange(Number(e.target.value) || 0)}
                className="flex-1 bg-transparent text-sm font-semibold text-slate-800 outline-none min-w-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="0" />
        </div>
    </div>
);

const DropdownField: React.FC<{ label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }> = ({ label, value, onChange, options }) => (
    <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-500">{label}</label>
        <select value={value} onChange={e => onChange(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20">
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
    </div>
);

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

// ── Home Buying ──
const HomeBuyingForm: React.FC<{ baseline: BaselineData; onResult: (r: ScenarioResult) => void }> = ({ baseline, onResult }) => {
    const [inp, setInp] = useState<HomeBuyingInputs>({ propertyValue: 5000000, downPaymentPct: 20, loanTenure: 20, startDelay: 0, propertyGrowth: 5, spouseStopsWorking: false, currentRent: 15000 });
    const u = (k: keyof HomeBuyingInputs, v: any) => setInp(p => ({ ...p, [k]: v }));
    const loanAmt = inp.propertyValue * (1 - inp.downPaymentPct / 100);
    const monthlyEMI = loanAmt * 0.085 / 12 * Math.pow(1 + 0.085 / 12, inp.loanTenure * 12) / (Math.pow(1 + 0.085 / 12, inp.loanTenure * 12) - 1);
    const newEmiRatio = ((baseline.currentEMIs + monthlyEMI) / (baseline.primaryIncome + baseline.secondaryIncome + baseline.spouseIncome)) * 100;

    return (
        <div className="space-y-4">
            <Slider label="Property Value" value={inp.propertyValue} onChange={v => u('propertyValue', v)} min={2000000} max={50000000} step={500000} format={v => fmt(v)} />
            <Slider label={`Down Payment — ${inp.downPaymentPct}% = ${fmt(Math.round(inp.propertyValue * inp.downPaymentPct / 100))}`} value={inp.downPaymentPct} onChange={v => u('downPaymentPct', v)} min={10} max={50} format={v => `${v}%`} />
            <Slider label="Loan Tenure" value={inp.loanTenure} onChange={v => u('loanTenure', v)} min={5} max={30} format={v => `${v} years`} />
            <Slider label="Expected Property Growth" value={inp.propertyGrowth} onChange={v => u('propertyGrowth', v)} min={2} max={12} step={0.5} format={v => `${v}%/yr`} />
            <InputField label="Current Rent (will be saved)" value={inp.currentRent} onChange={v => u('currentRent', v)} />
            <Toggle label="Will Spouse Stop Working?" value={inp.spouseStopsWorking} onChange={v => u('spouseStopsWorking', v)} />

            {/* Live Preview */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Preview</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                    <div><span className="text-slate-400">Loan:</span> <span className="font-bold text-slate-800">{fmt(Math.round(loanAmt))}</span></div>
                    <div><span className="text-slate-400">EMI:</span> <span className="font-bold text-slate-800">{fmt(Math.round(monthlyEMI))}</span></div>
                    <div><span className="text-slate-400">EMI Ratio:</span> <span className={`font-bold ${newEmiRatio > 50 ? 'text-red-600' : newEmiRatio > 40 ? 'text-amber-600' : 'text-emerald-600'}`}>{newEmiRatio.toFixed(1)}%</span></div>
                </div>
            </div>

            <button onClick={() => onResult(computeHomeBuying(baseline, inp))} className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-sm">
                🏠 Calculate Full Impact
            </button>
        </div>
    );
};

// ── Job Change ──
const JobChangeForm: React.FC<{ baseline: BaselineData; onResult: (r: ScenarioResult) => void }> = ({ baseline, onResult }) => {
    const [inp, setInp] = useState<JobChangeInputs>({ newSalary: Math.round(baseline.primaryIncome * 1.3), joiningBonus: 100000, careerGrowthRate: 15, noticePeriodMonths: 2, gapMonths: 1, esopLoss: 0, relocationCost: 0, pfWithdraw: false });
    const u = (k: keyof JobChangeInputs, v: any) => setInp(p => ({ ...p, [k]: v }));

    return (
        <div className="space-y-4">
            <InputField label="New Monthly Salary Offer" value={inp.newSalary} onChange={v => u('newSalary', v)} />
            <InputField label="Joining Bonus (one-time)" value={inp.joiningBonus} onChange={v => u('joiningBonus', v)} />
            <Slider label="Expected Career Growth Rate" value={inp.careerGrowthRate} onChange={v => u('careerGrowthRate', v)} min={5} max={30} format={v => `${v}%/yr`} />
            <Slider label="Gap Between Jobs" value={inp.gapMonths} onChange={v => u('gapMonths', v)} min={0} max={3} format={v => `${v} months`} />
            <InputField label="ESOP/Vesting Loss (if any)" value={inp.esopLoss} onChange={v => u('esopLoss', v)} />
            <InputField label="Relocation Cost" value={inp.relocationCost} onChange={v => u('relocationCost', v)} />
            <Toggle label="Will You Withdraw PF?" value={inp.pfWithdraw} onChange={v => u('pfWithdraw', v)} />
            <button onClick={() => onResult(computeJobChange(baseline, inp))} className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-sm">
                💼 Calculate Full Impact
            </button>
        </div>
    );
};

// ── Having a Child ──
const HavingChildForm: React.FC<{ baseline: BaselineData; onResult: (r: ScenarioResult) => void }> = ({ baseline, onResult }) => {
    const [inp, setInp] = useState<ChildInputs>({ birthDelay: 0, spouseBreakMonths: 6, educationPlan: 'mid-private', city: 'metro', secondChild: false });
    const u = (k: keyof ChildInputs, v: any) => setInp(p => ({ ...p, [k]: v }));

    return (
        <div className="space-y-4">
            <Slider label="When? (months from now)" value={inp.birthDelay} onChange={v => u('birthDelay', v)} min={0} max={24} format={v => v === 0 ? 'Now' : `${v}mo`} />
            <Slider label="Spouse Career Break" value={inp.spouseBreakMonths} onChange={v => u('spouseBreakMonths', v)} min={0} max={24} format={v => `${v} months`} />
            <DropdownField label="Education Plan" value={inp.educationPlan} onChange={v => u('educationPlan', v)}
                options={[{ value: 'government', label: 'Government School' }, { value: 'mid-private', label: 'Mid-level Private' }, { value: 'premium-private', label: 'Premium Private' }, { value: 'iit-target', label: 'IIT-target Coaching' }, { value: 'abroad', label: 'Study Abroad' }]} />
            <DropdownField label="City" value={inp.city} onChange={v => u('city', v)}
                options={[{ value: 'metro', label: 'Metro City' }, { value: 'tier2', label: 'Tier 2 City' }, { value: 'tier3', label: 'Tier 3 City' }]} />
            <Toggle label="Planning a Second Child?" value={inp.secondChild} onChange={v => u('secondChild', v)} />
            <button onClick={() => onResult(computeHavingChild(baseline, inp))} className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-sm">
                👶 Calculate Full Impact
            </button>
        </div>
    );
};

// ── Starting Business ──
const StartingBusinessForm: React.FC<{ baseline: BaselineData; onResult: (r: ScenarioResult) => void }> = ({ baseline, onResult }) => {
    const [inp, setInp] = useState<BusinessInputs>({ businessType: 'service', startupCapital: 500000, capitalSource: 'savings', revenueMonth6: 30000, revenueMonth12: 80000, quitImmediately: false, runwayMonths: 8, spouseSupport: baseline.spouseIncome > 0 });
    const u = (k: keyof BusinessInputs, v: any) => setInp(p => ({ ...p, [k]: v }));

    return (
        <div className="space-y-4">
            <DropdownField label="Business Type" value={inp.businessType} onChange={v => u('businessType', v)}
                options={[{ value: 'service', label: 'Service' }, { value: 'product', label: 'Product' }, { value: 'online', label: 'Online/Digital' }, { value: 'consulting', label: 'Consulting' }]} />
            <InputField label="Startup Capital Needed" value={inp.startupCapital} onChange={v => u('startupCapital', v)} />
            <DropdownField label="Source of Capital" value={inp.capitalSource} onChange={v => u('capitalSource', v)}
                options={[{ value: 'savings', label: 'From Savings' }, { value: 'loan', label: 'Business Loan' }, { value: 'both', label: 'Both' }]} />
            <InputField label="Expected Revenue (Month 6)" value={inp.revenueMonth6} onChange={v => u('revenueMonth6', v)} />
            <InputField label="Expected Revenue (Month 12)" value={inp.revenueMonth12} onChange={v => u('revenueMonth12', v)} />
            <Slider label="Runway Needed (months to profit)" value={inp.runwayMonths} onChange={v => u('runwayMonths', v)} min={3} max={24} format={v => `${v} months`} />
            <Toggle label="Quit Job Immediately?" value={inp.quitImmediately} onChange={v => u('quitImmediately', v)} />
            <Toggle label="Will Spouse Income Support?" value={inp.spouseSupport} onChange={v => u('spouseSupport', v)} />
            <button onClick={() => onResult(computeStartingBusiness(baseline, inp))} className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-sm">
                🚀 Calculate Full Impact
            </button>
        </div>
    );
};

// ── Sabbatical ──
const SabbaticalForm: React.FC<{ baseline: BaselineData; onResult: (r: ScenarioResult) => void }> = ({ baseline, onResult }) => {
    const [inp, setInp] = useState<SabbaticalInputs>({ durationMonths: 6, purpose: 'personal', continuedIncome: 0, withdrawPF: false });
    const u = (k: keyof SabbaticalInputs, v: any) => setInp(p => ({ ...p, [k]: v }));

    return (
        <div className="space-y-4">
            <Slider label="Break Duration" value={inp.durationMonths} onChange={v => u('durationMonths', v)} min={1} max={12} format={v => `${v} months`} />
            <DropdownField label="Purpose" value={inp.purpose} onChange={v => u('purpose', v)}
                options={[{ value: 'travel', label: 'Travel' }, { value: 'health', label: 'Health' }, { value: 'study', label: 'Study' }, { value: 'personal', label: 'Personal' }, { value: 'startup-prep', label: 'Startup Prep' }]} />
            <InputField label="Will any income continue?" value={inp.continuedIncome} onChange={v => u('continuedIncome', v)} />
            <Toggle label="Will You Withdraw PF?" value={inp.withdrawPF} onChange={v => u('withdrawPF', v)} />
            <button onClick={() => onResult(computeSabbatical(baseline, inp))} className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-sm">
                🏖️ Calculate Full Impact
            </button>
        </div>
    );
};

// ── Generic / Custom Scenario ──
const GenericForm: React.FC<{ baseline: BaselineData; onResult: (r: ScenarioResult) => void; preset: { name: string; icon: string; desc: string; cost?: number; expense?: number; income?: number; months?: number } }> =
    ({ baseline, onResult, preset }) => {
        const [inp, setInp] = useState<GenericScenarioInputs>({
            name: preset.name, icon: preset.icon, oneTimeCost: preset.cost || 0,
            monthlyExpenseChange: preset.expense || 0, monthlyIncomeChange: preset.income || 0,
            durationMonths: preset.months || 12, description: preset.desc,
        });
        const u = (k: keyof GenericScenarioInputs, v: any) => setInp(p => ({ ...p, [k]: v }));

        return (
            <div className="space-y-4">
                {!preset.cost && <InputField label="One-Time Cost" value={inp.oneTimeCost} onChange={v => u('oneTimeCost', v)} />}
                <InputField label="Monthly Expense Change (+/−)" value={inp.monthlyExpenseChange} onChange={v => u('monthlyExpenseChange', v)} />
                <InputField label="Monthly Income Change (+/−)" value={inp.monthlyIncomeChange} onChange={v => u('monthlyIncomeChange', v)} />
                <Slider label="Duration" value={inp.durationMonths} onChange={v => u('durationMonths', v)} min={1} max={60} format={v => `${v} months`} />
                <button onClick={() => onResult(computeGenericScenario(baseline, inp))} className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-sm">
                    {preset.icon} Calculate Full Impact
                </button>
            </div>
        );
    };

// ── Presets for generic scenarios ──
const genericPresets: Record<string, { name: string; icon: string; desc: string; cost?: number; expense?: number; months?: number }> = {
    'higher-education': { name: 'Higher Education', icon: '🎓', desc: 'MBA or MS degree — tuition + opportunity cost of not working', cost: 2500000, expense: 20000, months: 24 },
    'moving-abroad': { name: 'Moving Abroad', icon: '🌍', desc: 'Relocation + visa + initial setup costs for moving abroad', cost: 800000, expense: 15000, months: 12 },
    'getting-married': { name: 'Getting Married', icon: '💍', desc: 'Wedding costs + honeymoon + new household setup', cost: 1500000, expense: 10000, months: 6 },
    'medical-emergency': { name: 'Medical Emergency', icon: '🏥', desc: 'Unplanned medical expenses and recovery period', cost: 500000, expense: 20000, months: 6 },
    'big-investment': { name: 'Big Investment', icon: '📈', desc: 'Lump sum investment in stocks, property, or business', cost: 1000000, months: 1 },
    'buying-car': { name: 'Buying a Car', icon: '🚗', desc: 'Car purchase — down payment + EMI + running costs', cost: 300000, expense: 25000, months: 60 },
    'custom': { name: 'Custom Scenario', icon: '✏️', desc: 'Build your own scenario with custom income and expense changes' },
};

// ── Main Component ──
export const ScenarioInputPage: React.FC<Props> = ({ scenarioId, baseline, onResult, onBack }) => {
    const titles: Record<string, string> = {
        'buying-home': '🏠 Buying a Home', 'changing-jobs': '💼 Changing Jobs',
        'having-child': '👶 Having a Child', 'starting-business': '🚀 Starting a Business',
        'sabbatical': '🏖️ Taking a Sabbatical',
    };

    const preset = genericPresets[scenarioId];
    const title = titles[scenarioId] || (preset ? `${preset.icon} ${preset.name}` : '✏️ Custom Scenario');

    return (
        <div className="max-w-xl mx-auto">
            <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors mb-4">
                <ArrowLeft size={14} /> Back to Scenarios
            </button>

            <div className="text-center mb-5">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">{title}</h2>
                <p className="text-xs text-slate-500 mt-1">Adjust the variables below and see the full financial impact</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                {scenarioId === 'buying-home' && <HomeBuyingForm baseline={baseline} onResult={onResult} />}
                {scenarioId === 'changing-jobs' && <JobChangeForm baseline={baseline} onResult={onResult} />}
                {scenarioId === 'having-child' && <HavingChildForm baseline={baseline} onResult={onResult} />}
                {scenarioId === 'starting-business' && <StartingBusinessForm baseline={baseline} onResult={onResult} />}
                {scenarioId === 'sabbatical' && <SabbaticalForm baseline={baseline} onResult={onResult} />}
                {preset && <GenericForm baseline={baseline} onResult={onResult} preset={preset} />}
            </div>
        </div>
    );
};
