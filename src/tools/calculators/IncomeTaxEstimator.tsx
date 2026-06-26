import React, { useState, useMemo } from 'react';
import { Calculator, Plus, X, Info } from 'lucide-react';
import './calculators.css';

type TaxSlab = { id: number; lower: number; upper: number | null; rate: number };
type RegimeType = 'new' | 'old' | 'custom';

const NEW_REGIME_SLABS: TaxSlab[] = [
    { id: 1, lower: 0, upper: 400000, rate: 0 },
    { id: 2, lower: 400000, upper: 800000, rate: 5 },
    { id: 3, lower: 800000, upper: 1200000, rate: 10 },
    { id: 4, lower: 1200000, upper: 1600000, rate: 15 },
    { id: 5, lower: 1600000, upper: 2000000, rate: 20 },
    { id: 6, lower: 2000000, upper: 2400000, rate: 25 },
    { id: 7, lower: 2400000, upper: null, rate: 30 },
];

const OLD_REGIME_SLABS: TaxSlab[] = [
    { id: 1, lower: 0, upper: 250000, rate: 0 },
    { id: 2, lower: 250000, upper: 500000, rate: 5 },
    { id: 3, lower: 500000, upper: 1000000, rate: 20 },
    { id: 4, lower: 1000000, upper: null, rate: 30 },
];

let nextSlabId = 10;

export const IncomeTaxEstimator: React.FC = () => {
    const [regime, setRegime] = useState<RegimeType>('new');
    const [grossIncome, setGrossIncome] = useState(1200000);
    const [stdDeduction, setStdDeduction] = useState(75000);
    const [otherDeductions, setOtherDeductions] = useState(0);
    const [exemptions, setExemptions] = useState(0);
    const [cessPct, setCessPct] = useState(4);

    const [slabs, setSlabs] = useState<TaxSlab[]>([...NEW_REGIME_SLABS]);

    const handleRegimeChange = (r: RegimeType) => {
        setRegime(r);
        if (r === 'new') {
            setSlabs([...NEW_REGIME_SLABS]);
            setStdDeduction(75000);
        } else if (r === 'old') {
            setSlabs([...OLD_REGIME_SLABS]);
            setStdDeduction(50000);
        }
    };

    const fmtSlab = (s: TaxSlab) => {
        const f = (n: number) => {
            if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`;
            return `₹${n.toLocaleString('en-IN')}`;
        };
        return s.upper === null ? `${f(s.lower)}+ @ ${s.rate}%` : `${f(s.lower)} – ${f(s.upper)} @ ${s.rate}%`;
    };
    const fmt = (n: number) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

    const addSlab = () => { setSlabs(s => [...s, { id: nextSlabId++, lower: 0, upper: null, rate: 0 }]); setRegime('custom'); };
    const updSlab = (id: number, field: keyof TaxSlab, val: string) => {
        setSlabs(ss => ss.map(s => s.id === id ? { ...s, [field]: field === 'upper' && val === '' ? null : parseFloat(val || '0') } : s));
        setRegime('custom');
    };
    const delSlab = (id: number) => { if (slabs.length > 1) { setSlabs(s => s.filter(x => x.id !== id)); setRegime('custom'); } };

    // Auto-calculate
    const results = useMemo(() => {
        if (grossIncome < 0 || slabs.length === 0) return null;

        let taxableIncome = (grossIncome || 0) - (stdDeduction || 0) - (otherDeductions || 0) - (exemptions || 0);
        if (taxableIncome < 0) taxableIncome = 0;

        const sorted = [...slabs].sort((a, b) => a.lower - b.lower);
        let totalBeforeCess = 0;
        const slabTaxes: { label: string; tax: number }[] = [];

        for (const slab of sorted) {
            const upper = slab.upper === null ? Infinity : slab.upper;
            if (taxableIncome <= slab.lower) { slabTaxes.push({ label: fmtSlab(slab), tax: 0 }); continue; }
            const incomeInSlab = Math.min(taxableIncome, upper) - slab.lower;
            const tax = incomeInSlab > 0 ? incomeInSlab * (slab.rate / 100) : 0;
            totalBeforeCess += tax;
            slabTaxes.push({ label: fmtSlab(slab), tax: parseFloat(tax.toFixed(0)) });
        }

        // Section 87A Rebate (New Regime: ₹60,000 if taxable ≤ ₹12L; Old Regime: ₹12,500 if taxable ≤ ₹5L)
        let rebate87A = 0;
        if (regime === 'new' && taxableIncome <= 1200000) {
            rebate87A = Math.min(totalBeforeCess, 60000);
        } else if (regime === 'old' && taxableIncome <= 500000) {
            rebate87A = Math.min(totalBeforeCess, 12500);
        }

        const taxAfterRebate = Math.max(0, totalBeforeCess - rebate87A);

        // Surcharge (on tax, not income)
        let surchargeRate = 0;
        if (taxableIncome > 50000000) surchargeRate = 37;
        else if (taxableIncome > 20000000) surchargeRate = 25;
        else if (taxableIncome > 10000000) surchargeRate = 15;
        else if (taxableIncome > 5000000) surchargeRate = 10;
        const surchargeAmt = taxAfterRebate * (surchargeRate / 100);

        const taxPlusSurcharge = taxAfterRebate + surchargeAmt;
        const cessAmt = taxPlusSurcharge * ((cessPct || 0) / 100);
        const totalPayable = taxPlusSurcharge + cessAmt;
        const monthlyTds = totalPayable / 12;
        const effectiveRate = grossIncome > 0 ? (totalPayable / grossIncome) * 100 : 0;
        const inHandMonthly = (grossIncome - totalPayable) / 12;

        return {
            taxableIncome: parseFloat(taxableIncome.toFixed(0)),
            totalDeductions: parseFloat(((stdDeduction || 0) + (otherDeductions || 0) + (exemptions || 0)).toFixed(0)),
            slabTaxes,
            totalBeforeCess: parseFloat(totalBeforeCess.toFixed(0)),
            rebate87A: parseFloat(rebate87A.toFixed(0)),
            taxAfterRebate: parseFloat(taxAfterRebate.toFixed(0)),
            surchargeRate,
            surchargeAmt: parseFloat(surchargeAmt.toFixed(0)),
            cessAmt: parseFloat(cessAmt.toFixed(0)),
            totalPayable: parseFloat(totalPayable.toFixed(0)),
            monthlyTds: parseFloat(monthlyTds.toFixed(0)),
            effectiveRate: parseFloat(effectiveRate.toFixed(2)),
            inHandMonthly: parseFloat(inHandMonthly.toFixed(0)),
        };
    }, [grossIncome, stdDeduction, otherDeductions, exemptions, cessPct, slabs, regime]);

    return (
        <div className="calc-wrapper" style={{ maxWidth: 580 }}>
            <div className="calc-header">
                <div className="calc-header-icon" style={{ background: '#fce7f3', color: '#db2777' }}><Calculator size={22} /></div>
                <div><h2 className="calc-header-title">Income Tax Estimator</h2><p className="calc-header-desc">FY 2025-26 slabs, Section 87A rebate, surcharge & cess</p></div>
            </div>

            {/* Regime Toggle */}
            <div className="calc-card">
                <h3 className="calc-title">Tax Regime</h3>
                <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                    {(['new', 'old'] as const).map(r => (
                        <button
                            key={r}
                            onClick={() => handleRegimeChange(r)}
                            style={{
                                flex: 1,
                                padding: '10px 16px',
                                borderRadius: 10,
                                border: regime === r ? '2px solid #db2777' : '1px solid #e2e8f0',
                                background: regime === r ? '#fce7f3' : '#fff',
                                color: regime === r ? '#db2777' : '#64748b',
                                fontWeight: 700,
                                fontSize: 13,
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                            }}
                        >
                            {r === 'new' ? '🆕 New Regime (FY 25-26)' : '📋 Old Regime'}
                        </button>
                    ))}
                </div>
                <p style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.5 }}>
                    {regime === 'new'
                        ? 'New regime: Std deduction ₹75K. No 80C/80D/HRA. Rebate u/s 87A up to ₹60K if taxable ≤ ₹12L.'
                        : regime === 'old'
                            ? 'Old regime: Std deduction ₹50K. Allows 80C (₹1.5L), 80D, HRA exemptions. Rebate u/s 87A up to ₹12.5K if taxable ≤ ₹5L.'
                            : 'Custom slabs applied.'}
                </p>
            </div>

            {/* Income & Deductions */}
            <div className="calc-card">
                <h3 className="calc-title">1. Income & Deductions</h3>
                <div className="calc-input-row-2">
                    <div className="calc-form-group"><label className="calc-label">Annual Gross Income (₹):</label><input type="number" className="calc-input" value={grossIncome} onChange={e => setGrossIncome(parseFloat(e.target.value || '0'))} /></div>
                    <div className="calc-form-group"><label className="calc-label">Standard Deduction (₹):</label><input type="number" className="calc-input" value={stdDeduction} onChange={e => setStdDeduction(parseFloat(e.target.value || '0'))} /></div>
                </div>
                <div className="calc-input-row-2">
                    <div className="calc-form-group"><label className="calc-label">Other Deductions (80C etc.):</label><input type="number" className="calc-input" value={otherDeductions} onChange={e => setOtherDeductions(parseFloat(e.target.value || '0'))} /></div>
                    <div className="calc-form-group"><label className="calc-label">Exemptions (HRA etc.):</label><input type="number" className="calc-input" value={exemptions} onChange={e => setExemptions(parseFloat(e.target.value || '0'))} /></div>
                </div>
                <div className="calc-form-group"><label className="calc-label">Cess %:</label><input type="number" className="calc-input" value={cessPct} style={{ maxWidth: 100 }} onChange={e => setCessPct(parseFloat(e.target.value || '0'))} /></div>
            </div>

            {/* Tax Slabs */}
            <div className="calc-card">
                <h3 className="calc-title">2. Tax Slabs {regime !== 'custom' && <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 400 }}>({regime === 'new' ? 'New Regime FY 2025-26' : 'Old Regime'})</span>}</h3>
                <div className="calc-pnl-table-wrap">
                    <table className="calc-pnl-table">
                        <thead><tr><th>Lower (₹)</th><th>Upper (blank = ∞)</th><th>Rate %</th><th></th></tr></thead>
                        <tbody>
                            {slabs.map(s => (
                                <tr key={s.id}>
                                    <td><input type="number" className="calc-input" value={s.lower} onChange={e => updSlab(s.id, 'lower', e.target.value)} /></td>
                                    <td><input type="number" className="calc-input" value={s.upper ?? ''} placeholder="∞" onChange={e => updSlab(s.id, 'upper', e.target.value)} /></td>
                                    <td><input type="number" className="calc-input" value={s.rate} onChange={e => updSlab(s.id, 'rate', e.target.value)} /></td>
                                    <td>{slabs.length > 1 && <button className="calc-pnl-del" onClick={() => delSlab(s.id)}><X size={14} /></button>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button className="calc-pnl-add" onClick={addSlab}><Plus size={14} /> Add Slab</button>
            </div>

            {/* Results */}
            {results && (
                <div style={{ marginTop: 12 }}>
                    {/* Hero Card */}
                    <div style={{
                        background: 'linear-gradient(135deg, #831843, #db2777)',
                        borderRadius: 14,
                        padding: '20px 18px',
                        color: '#fff',
                        textAlign: 'center',
                        marginBottom: 12,
                    }}>
                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 4 }}>Total Tax Payable</p>
                        <p style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.5 }}>{fmt(results.totalPayable)}</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 8 }}>
                            <div>
                                <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)' }}>Monthly TDS</p>
                                <p style={{ fontSize: 15, fontWeight: 700 }}>{fmt(results.monthlyTds)}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)' }}>Effective Rate</p>
                                <p style={{ fontSize: 15, fontWeight: 700 }}>{results.effectiveRate}%</p>
                            </div>
                            <div>
                                <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)' }}>In-Hand / Month</p>
                                <p style={{ fontSize: 15, fontWeight: 700 }}>{fmt(results.inHandMonthly)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Breakdown */}
                    <div className="calc-result-card">
                        <h4 className="calc-result-title">Tax Computation</h4>
                        <ul className="calc-result-list">
                            <li className="calc-result-item"><span>Gross Income</span><span>{fmt(grossIncome)}</span></li>
                            <li className="calc-result-item" style={{ color: '#059669' }}><span>Total Deductions</span><span>−{fmt(results.totalDeductions)}</span></li>
                            <li className="calc-result-item" style={{ fontWeight: 700 }}><span>Taxable Income</span><span>{fmt(results.taxableIncome)}</span></li>
                        </ul>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', padding: '8px 0 4px' }}>Slab-wise Tax</div>
                        <ul className="calc-result-list">
                            {results.slabTaxes.map((st, i) => (
                                <li key={i} className="calc-result-item" style={{ fontSize: 11 }}><span>{st.label}</span><span>{fmt(st.tax)}</span></li>
                            ))}
                        </ul>
                        <ul className="calc-result-list" style={{ borderTop: '2px solid #e2e8f0' }}>
                            <li className="calc-result-item"><span>Tax (before adjustments)</span><span>{fmt(results.totalBeforeCess)}</span></li>
                            {results.rebate87A > 0 && (
                                <li className="calc-result-item" style={{ color: '#059669' }}><span>Section 87A Rebate</span><span>−{fmt(results.rebate87A)}</span></li>
                            )}
                            <li className="calc-result-item"><span>Tax after Rebate</span><span>{fmt(results.taxAfterRebate)}</span></li>
                            {results.surchargeAmt > 0 && (
                                <li className="calc-result-item" style={{ color: '#d97706' }}><span>Surcharge ({results.surchargeRate}%)</span><span>+{fmt(results.surchargeAmt)}</span></li>
                            )}
                            <li className="calc-result-item" style={{ color: '#d97706' }}><span>Health & Education Cess ({cessPct}%)</span><span>+{fmt(results.cessAmt)}</span></li>
                            <li className="calc-result-item" style={{ fontWeight: 800, fontSize: 14, color: '#dc2626' }}><span>Total Tax Payable</span><span>{fmt(results.totalPayable)}</span></li>
                        </ul>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', alignItems: 'start', gap: 6, marginTop: 10, padding: '0 4px' }}>
                <Info size={12} style={{ color: '#94a3b8', flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                    FY 2025-26. New Regime: Std deduction ₹75K, 87A rebate ₹60K (taxable ≤ ₹12L). Old Regime: Std deduction ₹50K, 87A rebate ₹12.5K (taxable ≤ ₹5L). Surcharge: 10% (₹50L+), 15% (₹1Cr+), 25% (₹2Cr+), 37% (₹5Cr+). Cess 4%.
                </p>
            </div>
        </div>
    );
};
