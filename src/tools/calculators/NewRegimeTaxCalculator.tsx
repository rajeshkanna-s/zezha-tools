import React, { useState, useMemo } from 'react';
import { FileSpreadsheet, Info } from 'lucide-react';
import './calculators.css';

// ═══ New Regime Tax Calculator — AY 2021-22 to AY 2026-27 ═══
// Source: incometaxindia.gov.in — Section 115BAC

type Slab = [number, number, number][]; // [from, to, rate]

interface NewAYConfig {
  label: string;
  slabs: Slab;
  surcharge: { threshold: number; rate: number }[];
  surchargeLabel: string;
  cessRate: number;
  cessLabel: string;
  rebate87A: { maxIncome: number; maxRebate: number };
  stdDeductionHint: string;
}

// ─── New Regime Assessment Year configs ───
const NEW_AY_CONFIGS: Record<string, NewAYConfig> = {
  '2026-27': {
    label: 'AY 2026-27 (FY 2025-26)',
    slabs: [[0,400000,0],[400000,800000,0.05],[800000,1200000,0.10],[1200000,1600000,0.15],[1600000,2000000,0.20],[2000000,2400000,0.25],[2400000,Infinity,0.30]],
    surcharge: [{threshold:5000000,rate:0.10},{threshold:10000000,rate:0.15},{threshold:20000000,rate:0.25}],
    surchargeLabel: 'Max 25% (37% not applicable)',
    cessRate: 0.04, cessLabel: 'Health & Education Cess (4%)',
    rebate87A: { maxIncome: 1200000, maxRebate: 60000 },
    stdDeductionHint: '₹75,000 for salaried',
  },
  '2025-26': {
    label: 'AY 2025-26 (FY 2024-25)',
    slabs: [[0,300000,0],[300000,700000,0.05],[700000,1000000,0.10],[1000000,1200000,0.15],[1200000,1500000,0.20],[1500000,Infinity,0.30]],
    surcharge: [{threshold:5000000,rate:0.10},{threshold:10000000,rate:0.15},{threshold:20000000,rate:0.25}],
    surchargeLabel: 'Max 25% (37% not applicable)',
    cessRate: 0.04, cessLabel: 'Health & Education Cess (4%)',
    rebate87A: { maxIncome: 700000, maxRebate: 25000 },
    stdDeductionHint: '₹75,000 for salaried',
  },
  '2024-25': {
    label: 'AY 2024-25 (FY 2023-24)',
    slabs: [[0,300000,0],[300000,600000,0.05],[600000,900000,0.10],[900000,1200000,0.15],[1200000,1500000,0.20],[1500000,Infinity,0.30]],
    surcharge: [{threshold:5000000,rate:0.10},{threshold:10000000,rate:0.15},{threshold:20000000,rate:0.25}],
    surchargeLabel: 'Max 25% (37% not applicable)',
    cessRate: 0.04, cessLabel: 'Health & Education Cess (4%)',
    rebate87A: { maxIncome: 700000, maxRebate: 25000 },
    stdDeductionHint: '₹50,000 for salaried',
  },
  '2023-24': {
    label: 'AY 2023-24 (FY 2022-23)',
    slabs: [[0,250000,0],[250000,500000,0.05],[500000,750000,0.10],[750000,1000000,0.15],[1000000,1250000,0.20],[1250000,1500000,0.25],[1500000,Infinity,0.30]],
    surcharge: [{threshold:5000000,rate:0.10},{threshold:10000000,rate:0.15},{threshold:20000000,rate:0.25},{threshold:50000000,rate:0.37}],
    surchargeLabel: 'Up to 37%',
    cessRate: 0.04, cessLabel: 'Health & Education Cess (4%)',
    rebate87A: { maxIncome: 500000, maxRebate: 12500 },
    stdDeductionHint: 'Not available under new regime',
  },
  '2022-23': {
    label: 'AY 2022-23 (FY 2021-22)',
    slabs: [[0,250000,0],[250000,500000,0.05],[500000,750000,0.10],[750000,1000000,0.15],[1000000,1250000,0.20],[1250000,1500000,0.25],[1500000,Infinity,0.30]],
    surcharge: [{threshold:5000000,rate:0.10},{threshold:10000000,rate:0.15},{threshold:20000000,rate:0.25},{threshold:50000000,rate:0.37}],
    surchargeLabel: 'Up to 37%',
    cessRate: 0.04, cessLabel: 'Health & Education Cess (4%)',
    rebate87A: { maxIncome: 500000, maxRebate: 12500 },
    stdDeductionHint: 'Not available under new regime',
  },
  '2021-22': {
    label: 'AY 2021-22 (FY 2020-21)',
    slabs: [[0,250000,0],[250000,500000,0.05],[500000,750000,0.10],[750000,1000000,0.15],[1000000,1250000,0.20],[1250000,1500000,0.25],[1500000,Infinity,0.30]],
    surcharge: [{threshold:5000000,rate:0.10},{threshold:10000000,rate:0.15},{threshold:20000000,rate:0.25},{threshold:50000000,rate:0.37}],
    surchargeLabel: 'Up to 37%',
    cessRate: 0.04, cessLabel: 'Health & Education Cess (4%)',
    rebate87A: { maxIncome: 500000, maxRebate: 12500 },
    stdDeductionHint: 'Not available under new regime',
  },
};

const NEW_AY_OPTIONS = Object.keys(NEW_AY_CONFIGS);

// ─── Export for TaxCompare ───
export { NEW_AY_CONFIGS, NEW_AY_OPTIONS };
export type { NewAYConfig };

// ─── Calculation helpers ───
export const computeNewSlabTax = (ti: number, slabs: Slab, fmt: (n: number) => string) => {
  const breakdown: { slab: string; amount: number; rate: string; tax: number }[] = [];
  if (ti <= 0) return { tax: 0, breakdown };
  let tax = 0;
  for (const [lo, hi, rate] of slabs) {
    if (ti <= lo) break;
    const amt = Math.min(ti, hi) - lo;
    const t = Math.round(amt * rate);
    breakdown.push({ slab: hi === Infinity ? `Above ${fmt(lo)}` : `${fmt(lo)} – ${fmt(hi)}`, amount: amt, rate: `${(rate * 100).toFixed(0)}%`, tax: t });
    tax += t;
  }
  return { tax: Math.round(tax), breakdown };
};

export const computeNewSurcharge = (ti: number, tax: number, config: NewAYConfig) => {
  let rate = 0;
  for (let i = config.surcharge.length - 1; i >= 0; i--) {
    if (ti > config.surcharge[i].threshold) { rate = config.surcharge[i].rate; break; }
  }
  return Math.round(tax * rate);
};

export const applyNewMarginalRelief = (ti: number, tax: number, surcharge: number, slabs: Slab, config: NewAYConfig) => {
  const thresholds = config.surcharge.map(s => s.threshold);
  for (const th of thresholds) {
    if (ti > th) {
      const taxAtTh = computeNewSlabTax(th, slabs, () => '').tax;
      const scAtTh = computeNewSurcharge(th, taxAtTh, config);
      const max = taxAtTh + scAtTh + (ti - th);
      if (tax + surcharge > max) return Math.max(0, max - tax);
    }
  }
  return surcharge;
};

export const computeNew87ARebate = (ti: number, tax: number, config: NewAYConfig, slabs: Slab) => {
  // Standard rebate if within limit
  if (ti <= config.rebate87A.maxIncome) {
    return Math.min(tax, config.rebate87A.maxRebate);
  }
  // Marginal relief on rebate (for AY 2026-27 especially)
  if (config.rebate87A.maxRebate >= 25000) {
    const excess = ti - config.rebate87A.maxIncome;
    const taxAtLimit = computeNewSlabTax(config.rebate87A.maxIncome, slabs, () => '').tax;
    const rebateAtLimit = Math.min(taxAtLimit, config.rebate87A.maxRebate);
    const payAtLimit = taxAtLimit - rebateAtLimit;
    const maxPay = payAtLimit + excess;
    if (tax > maxPay) return tax - maxPay;
  }
  return 0;
};

interface TaxResult {
  grossIncome: number; standardDeduction: number; taxableIncome: number;
  taxBeforeRebate: number; rebate87A: number; taxAfterRebate: number;
  surcharge: number; cess: number; totalTax: number; effectiveRate: number;
  slabBreakdown: { slab: string; amount: number; rate: string; tax: number }[];
}

export const NewRegimeTaxCalculator: React.FC = () => {
  const [assessmentYear, setAssessmentYear] = useState('2026-27');
  const [grossIncome, setGrossIncome] = useState('');
  const [standardDeduction, setStandardDeduction] = useState('');

  const parseNum = (v: string) => { const n = parseFloat(v.replace(/,/g, '')); return isNaN(n) || n < 0 ? 0 : n; };
  const fmt = (n: number) => n.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const fmtInput = (v: string) => { let d = v.replace(/[^0-9]/g, ''); if (!d) return ''; d = d.replace(/^0+/, '') || '0'; return Number(d).toLocaleString('en-IN'); };

  const config = NEW_AY_CONFIGS[assessmentYear];
  const slabs = config.slabs;

  const result = useMemo((): TaxResult | null => {
    const gross = parseNum(grossIncome);
    if (gross <= 0) return null;
    const stdDed = parseNum(standardDeduction);
    const ti = Math.max(0, gross - stdDed);
    const { tax: taxBefore, breakdown } = computeNewSlabTax(ti, slabs, fmt);
    const rebate = computeNew87ARebate(ti, taxBefore, config, slabs);
    const taxAfter = Math.max(0, taxBefore - rebate);
    let sc = computeNewSurcharge(ti, taxAfter, config);
    sc = applyNewMarginalRelief(ti, taxAfter, sc, slabs, config);
    const cess = Math.ceil((taxAfter + sc) * config.cessRate);
    const total = Math.ceil(taxAfter + sc + cess);
    return {
      grossIncome: gross, standardDeduction: stdDed, taxableIncome: ti,
      taxBeforeRebate: taxBefore, rebate87A: rebate, taxAfterRebate: taxAfter,
      surcharge: sc, cess, totalTax: total,
      effectiveRate: gross > 0 ? Math.round((total / gross) * 10000) / 100 : 0,
      slabBreakdown: breakdown,
    };
  }, [grossIncome, standardDeduction, assessmentYear]);

  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 };
  const selectStyle: React.CSSProperties = { width: '100%', padding: '9px 10px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 11, background: 'white', outline: 'none' };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '9px 10px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 11, background: 'white', outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: 16 }}>
      <div style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', borderRadius: 16, padding: '18px 22px', color: 'white', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <FileSpreadsheet size={20} />
          <div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>New Regime Tax Calculator</h2>
            <p style={{ margin: 0, fontSize: 10, opacity: 0.85 }}>{config.label} · Section 115BAC</p>
          </div>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: 18 }}>
        {/* Row 1: Assessment Year + Category */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <div>
            <label style={labelStyle}>Assessment Year *</label>
            <select style={selectStyle} value={assessmentYear} onChange={e => setAssessmentYear(e.target.value)}>
              {NEW_AY_OPTIONS.map(ay => <option key={ay} value={ay}>{NEW_AY_CONFIGS[ay].label}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Taxpayer Category *</label>
            <select style={selectStyle} defaultValue="individual"><option value="individual">Individual</option></select>
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Residential Status *</label>
          <select style={selectStyle} defaultValue="resident"><option value="resident">RES (Resident)</option></select>
        </div>

        {/* Dynamic Slab reference */}
        <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 10, padding: '8px 12px', marginBottom: 14 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#5b21b6', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Info size={10} /> New Regime Slabs — {assessmentYear} (Section 115BAC)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1px 14px', fontSize: 9, color: '#4c1d95' }}>
            {slabs.map(([lo, hi, rate], i) => (
              <React.Fragment key={i}>
                <span>{hi === Infinity ? `Above ${fmt(lo)}` : `${fmt(lo)} – ${fmt(hi)}`}</span>
                <span style={{ fontWeight: 700 }}>{rate === 0 ? 'Nil' : `${(rate * 100).toFixed(0)}%`}</span>
              </React.Fragment>
            ))}
          </div>
          <div style={{ fontSize: 8, color: '#5b21b6', marginTop: 3 }}>
            Rebate 87A: {fmt(config.rebate87A.maxRebate)} (income ≤ {fmt(config.rebate87A.maxIncome)}) · Surcharge: {config.surchargeLabel} · {config.cessLabel}
          </div>
        </div>

        {/* Income input */}
        <div style={{ marginBottom: 10 }}>
          <label style={labelStyle}>Total Taxable Income (Gross) *</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>₹</span>
            <input type="text" value={grossIncome} onChange={e => setGrossIncome(fmtInput(e.target.value))} placeholder="Enter income"
              style={{ ...inputStyle, paddingLeft: 24 }} />
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Standard Deduction <span style={{ color: '#94a3b8', fontWeight: 400 }}>({config.stdDeductionHint})</span></label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>₹</span>
            <input type="text" value={standardDeduction} onChange={e => setStandardDeduction(fmtInput(e.target.value))} placeholder="Enter if applicable"
              style={{ ...inputStyle, paddingLeft: 24 }} />
          </div>
        </div>

        {/* Note */}
        <div style={{ background: '#fefce8', border: '1px solid #fde68a', borderRadius: 8, padding: '6px 10px', marginBottom: 14, fontSize: 9, color: '#92400e' }}>
          <strong>Note:</strong> Under new regime, most deductions (80C, 80D, HRA, Home Loan) are NOT allowed. Only Standard Deduction + Employer NPS (80CCD(2)) available.
        </div>

        {/* Taxable income */}
        {result && (
          <div style={{ background: '#f5f3ff', borderRadius: 10, padding: '8px 12px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#475569' }}>Net Taxable Income</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#1e293b' }}>{fmt(result.taxableIncome)}</span>
          </div>
        )}

        {/* Results */}
        {result && result.grossIncome > 0 && (
          <div style={{ borderRadius: 14, border: '1px solid #c4b5fd', background: '#faf5ff', padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 14 }}>
              {[['Taxable Income', fmt(result.taxableIncome), '#1e293b'], ['Total Tax', result.totalTax === 0 ? 'NIL' : fmt(result.totalTax), result.totalTax === 0 ? '#dc2626' : '#166534'], ['Effective Rate', `${result.effectiveRate}%`, '#7c3aed']].map(([l, v, c], i) => (
                <div key={i} style={{ background: 'white', borderRadius: 8, padding: 8, textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 8, color: '#94a3b8', textTransform: 'uppercase' }}>{l}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: c as string }}>{v}</div>
                </div>
              ))}
            </div>

            {result.totalTax === 0 && result.taxableIncome <= config.rebate87A.maxIncome && (
              <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: '6px 10px', marginBottom: 10, fontSize: 10, color: '#166534', fontWeight: 600 }}>
                ✅ Income effectively tax-free under Section 87A rebate (taxable income ≤ {fmt(config.rebate87A.maxIncome)})
              </div>
            )}

            {/* Slab breakdown */}
            <div style={{ background: 'white', borderRadius: 8, border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: 10 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#64748b', padding: '6px 10px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Slab-wise Breakdown</div>
              {result.slabBreakdown.map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 10px', borderBottom: i < result.slabBreakdown.length - 1 ? '1px solid #f1f5f9' : 'none', fontSize: 10 }}>
                  <span style={{ color: '#475569' }}>{s.slab} <span style={{ color: '#94a3b8' }}>@ {s.rate}</span></span>
                  <span style={{ fontWeight: 600 }}>{fmt(s.tax)}</span>
                </div>
              ))}
            </div>

            {/* Detailed computation */}
            <div style={{ background: 'white', borderRadius: 8, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#64748b', padding: '6px 10px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Detailed Computation</div>
              {[
                ['Gross Income', result.grossIncome],
                ...(result.standardDeduction > 0 ? [['(-) Standard Deduction', -result.standardDeduction]] : []),
                ['Taxable Income', result.taxableIncome],
                ['Tax on Income', result.taxBeforeRebate],
                ...(result.rebate87A > 0 ? [['(-) Rebate u/s 87A', -result.rebate87A]] : []),
                ['Tax after Rebate', result.taxAfterRebate],
                ...(result.surcharge > 0 ? [['(+) Surcharge', result.surcharge]] : []),
                [`(+) ${config.cessLabel}`, result.cess],
                ['Total Tax Payable', result.totalTax],
              ].map(([l, v], i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', padding: '5px 10px', fontSize: 10,
                  borderBottom: '1px solid #f1f5f9',
                  fontWeight: l === 'Total Tax Payable' || l === 'Taxable Income' ? 700 : 400,
                  background: l === 'Total Tax Payable' ? '#faf5ff' : 'transparent',
                }}>
                  <span style={{ color: '#475569' }}>{l as string}</span>
                  <span style={{ fontWeight: 600, color: (v as number) < 0 ? '#7c3aed' : '#1e293b' }}>
                    {(v as number) < 0 ? `(${fmt(Math.abs(v as number))})` : fmt(v as number)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
