import React, { useState, useMemo } from 'react';
import { FileSpreadsheet, Info } from 'lucide-react';
import './calculators.css';

// ═══ Old Regime Tax Calculator — AY 2016-17 to AY 2026-27 ═══
// Source: incometaxindia.gov.in — Individual & HUF Tax Rates

type AgeKey = 'below60' | 'senior' | 'superSenior';
type Slab = [number, number, number][]; // [from, to, rate]

interface AYConfig {
  label: string;
  slabs: Record<AgeKey, Slab>;
  surcharge: { threshold: number; rate: number }[];
  cessRate: number;
  cessLabel: string;
  rebate87A: { maxIncome: number; maxRebate: number };
}

// ─── Assessment Year configurations ───
const AY_CONFIGS: Record<string, AYConfig> = {
  '2026-27': {
    label: 'AY 2026-27 (FY 2025-26)',
    slabs: {
      below60: [[0,250000,0],[250000,500000,0.05],[500000,1000000,0.20],[1000000,Infinity,0.30]],
      senior: [[0,300000,0],[300000,500000,0.05],[500000,1000000,0.20],[1000000,Infinity,0.30]],
      superSenior: [[0,500000,0],[500000,1000000,0.20],[1000000,Infinity,0.30]],
    },
    surcharge: [{threshold:5000000,rate:0.10},{threshold:10000000,rate:0.15},{threshold:20000000,rate:0.25},{threshold:50000000,rate:0.37}],
    cessRate: 0.04, cessLabel: 'Health & Education Cess (4%)',
    rebate87A: { maxIncome: 500000, maxRebate: 12500 },
  },
  '2025-26': {
    label: 'AY 2025-26 (FY 2024-25)',
    slabs: {
      below60: [[0,250000,0],[250000,500000,0.05],[500000,1000000,0.20],[1000000,Infinity,0.30]],
      senior: [[0,300000,0],[300000,500000,0.05],[500000,1000000,0.20],[1000000,Infinity,0.30]],
      superSenior: [[0,500000,0],[500000,1000000,0.20],[1000000,Infinity,0.30]],
    },
    surcharge: [{threshold:5000000,rate:0.10},{threshold:10000000,rate:0.15},{threshold:20000000,rate:0.25},{threshold:50000000,rate:0.37}],
    cessRate: 0.04, cessLabel: 'Health & Education Cess (4%)',
    rebate87A: { maxIncome: 500000, maxRebate: 12500 },
  },
  '2024-25': {
    label: 'AY 2024-25 (FY 2023-24)',
    slabs: {
      below60: [[0,250000,0],[250000,500000,0.05],[500000,1000000,0.20],[1000000,Infinity,0.30]],
      senior: [[0,300000,0],[300000,500000,0.05],[500000,1000000,0.20],[1000000,Infinity,0.30]],
      superSenior: [[0,500000,0],[500000,1000000,0.20],[1000000,Infinity,0.30]],
    },
    surcharge: [{threshold:5000000,rate:0.10},{threshold:10000000,rate:0.15},{threshold:20000000,rate:0.25},{threshold:50000000,rate:0.37}],
    cessRate: 0.04, cessLabel: 'Health & Education Cess (4%)',
    rebate87A: { maxIncome: 500000, maxRebate: 12500 },
  },
  '2023-24': {
    label: 'AY 2023-24 (FY 2022-23)',
    slabs: {
      below60: [[0,250000,0],[250000,500000,0.05],[500000,1000000,0.20],[1000000,Infinity,0.30]],
      senior: [[0,300000,0],[300000,500000,0.05],[500000,1000000,0.20],[1000000,Infinity,0.30]],
      superSenior: [[0,500000,0],[500000,1000000,0.20],[1000000,Infinity,0.30]],
    },
    surcharge: [{threshold:5000000,rate:0.10},{threshold:10000000,rate:0.15},{threshold:20000000,rate:0.25},{threshold:50000000,rate:0.37}],
    cessRate: 0.04, cessLabel: 'Health & Education Cess (4%)',
    rebate87A: { maxIncome: 500000, maxRebate: 12500 },
  },
  '2022-23': {
    label: 'AY 2022-23 (FY 2021-22)',
    slabs: {
      below60: [[0,250000,0],[250000,500000,0.05],[500000,1000000,0.20],[1000000,Infinity,0.30]],
      senior: [[0,300000,0],[300000,500000,0.05],[500000,1000000,0.20],[1000000,Infinity,0.30]],
      superSenior: [[0,500000,0],[500000,1000000,0.20],[1000000,Infinity,0.30]],
    },
    surcharge: [{threshold:5000000,rate:0.10},{threshold:10000000,rate:0.15},{threshold:20000000,rate:0.25},{threshold:50000000,rate:0.37}],
    cessRate: 0.04, cessLabel: 'Health & Education Cess (4%)',
    rebate87A: { maxIncome: 500000, maxRebate: 12500 },
  },
  '2021-22': {
    label: 'AY 2021-22 (FY 2020-21)',
    slabs: {
      below60: [[0,250000,0],[250000,500000,0.05],[500000,1000000,0.20],[1000000,Infinity,0.30]],
      senior: [[0,300000,0],[300000,500000,0.05],[500000,1000000,0.20],[1000000,Infinity,0.30]],
      superSenior: [[0,500000,0],[500000,1000000,0.20],[1000000,Infinity,0.30]],
    },
    surcharge: [{threshold:5000000,rate:0.10},{threshold:10000000,rate:0.15},{threshold:20000000,rate:0.25},{threshold:50000000,rate:0.37}],
    cessRate: 0.04, cessLabel: 'Health & Education Cess (4%)',
    rebate87A: { maxIncome: 500000, maxRebate: 12500 },
  },
  '2020-21': {
    label: 'AY 2020-21 (FY 2019-20)',
    slabs: {
      below60: [[0,250000,0],[250000,500000,0.05],[500000,1000000,0.20],[1000000,Infinity,0.30]],
      senior: [[0,300000,0],[300000,500000,0.05],[500000,1000000,0.20],[1000000,Infinity,0.30]],
      superSenior: [[0,500000,0],[500000,1000000,0.20],[1000000,Infinity,0.30]],
    },
    surcharge: [{threshold:5000000,rate:0.10},{threshold:10000000,rate:0.15},{threshold:20000000,rate:0.25},{threshold:50000000,rate:0.37}],
    cessRate: 0.04, cessLabel: 'Health & Education Cess (4%)',
    rebate87A: { maxIncome: 500000, maxRebate: 12500 },
  },
  '2019-20': {
    label: 'AY 2019-20 (FY 2018-19)',
    slabs: {
      below60: [[0,250000,0],[250000,500000,0.05],[500000,1000000,0.20],[1000000,Infinity,0.30]],
      senior: [[0,300000,0],[300000,500000,0.05],[500000,1000000,0.20],[1000000,Infinity,0.30]],
      superSenior: [[0,500000,0],[500000,1000000,0.20],[1000000,Infinity,0.30]],
    },
    surcharge: [{threshold:5000000,rate:0.10},{threshold:10000000,rate:0.15}],
    cessRate: 0.04, cessLabel: 'Health & Education Cess (4%)',
    rebate87A: { maxIncome: 500000, maxRebate: 12500 },
  },
  '2018-19': {
    label: 'AY 2018-19 (FY 2017-18)',
    slabs: {
      below60: [[0,250000,0],[250000,500000,0.05],[500000,1000000,0.20],[1000000,Infinity,0.30]],
      senior: [[0,300000,0],[300000,500000,0.05],[500000,1000000,0.20],[1000000,Infinity,0.30]],
      superSenior: [[0,500000,0],[500000,1000000,0.20],[1000000,Infinity,0.30]],
    },
    surcharge: [{threshold:5000000,rate:0.10},{threshold:10000000,rate:0.15}],
    cessRate: 0.03, cessLabel: 'Edu Cess 2% + SHEC 1% (3%)',
    rebate87A: { maxIncome: 350000, maxRebate: 2500 },
  },
  '2017-18': {
    label: 'AY 2017-18 (FY 2016-17)',
    slabs: {
      below60: [[0,250000,0],[250000,500000,0.10],[500000,1000000,0.20],[1000000,Infinity,0.30]],
      senior: [[0,300000,0],[300000,500000,0.10],[500000,1000000,0.20],[1000000,Infinity,0.30]],
      superSenior: [[0,500000,0],[500000,1000000,0.20],[1000000,Infinity,0.30]],
    },
    surcharge: [{threshold:10000000,rate:0.15}],
    cessRate: 0.03, cessLabel: 'Edu Cess 2% + SHEC 1% (3%)',
    rebate87A: { maxIncome: 500000, maxRebate: 5000 },
  },
  '2016-17': {
    label: 'AY 2016-17 (FY 2015-16)',
    slabs: {
      below60: [[0,250000,0],[250000,500000,0.10],[500000,1000000,0.20],[1000000,Infinity,0.30]],
      senior: [[0,300000,0],[300000,500000,0.10],[500000,1000000,0.20],[1000000,Infinity,0.30]],
      superSenior: [[0,500000,0],[500000,1000000,0.20],[1000000,Infinity,0.30]],
    },
    surcharge: [{threshold:10000000,rate:0.12}],
    cessRate: 0.03, cessLabel: 'Edu Cess 2% + SHEC 1% (3%)',
    rebate87A: { maxIncome: 500000, maxRebate: 5000 },
  },
};

const AY_OPTIONS = Object.keys(AY_CONFIGS);

// ─── Export configs for use by TaxCompare ───
export { AY_CONFIGS, AY_OPTIONS };
export type { AYConfig, AgeKey, Slab };

// ─── Shared calculation functions ───
export const computeOldSlabTax = (ti: number, slabs: Slab, fmt: (n: number) => string) => {
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

export const computeOldSurcharge = (ti: number, tax: number, config: AYConfig) => {
  let rate = 0;
  for (let i = config.surcharge.length - 1; i >= 0; i--) {
    if (ti > config.surcharge[i].threshold) { rate = config.surcharge[i].rate; break; }
  }
  return Math.round(tax * rate);
};

export const applyOldMarginalRelief = (ti: number, tax: number, surcharge: number, slabs: Slab, config: AYConfig) => {
  const thresholds = config.surcharge.map(s => s.threshold);
  for (const th of thresholds) {
    if (ti > th) {
      const taxAtTh = computeOldSlabTax(th, slabs, () => '').tax;
      const scAtTh = computeOldSurcharge(th, taxAtTh, config);
      const max = taxAtTh + scAtTh + (ti - th);
      if (tax + surcharge > max) return Math.max(0, max - tax);
    }
  }
  return surcharge;
};

interface TaxResult {
  grossIncome: number; totalDeductions: number; taxableIncome: number;
  taxBeforeRebate: number; rebate87A: number; taxAfterRebate: number;
  surcharge: number; cess: number; totalTax: number; effectiveRate: number;
  slabBreakdown: { slab: string; amount: number; rate: string; tax: number }[];
}

export const OldRegimeTaxCalculator: React.FC = () => {
  const [assessmentYear, setAssessmentYear] = useState('2026-27');
  const [grossIncome, setGrossIncome] = useState('');
  const [standardDeduction, setStandardDeduction] = useState('');
  const [allowances, setAllowances] = useState('');
  const [viaDeductions, setViaDeductions] = useState('');
  const [ageCategory, setAgeCategory] = useState<AgeKey>('below60');

  const parseNum = (v: string) => { const n = parseFloat(v.replace(/,/g, '')); return isNaN(n) || n < 0 ? 0 : n; };
  const fmt = (n: number) => n.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const fmtInput = (v: string) => { let d = v.replace(/[^0-9]/g, ''); if (!d) return ''; d = d.replace(/^0+/, '') || '0'; return Number(d).toLocaleString('en-IN'); };

  const config = AY_CONFIGS[assessmentYear];
  const slabs = config.slabs[ageCategory];

  const result = useMemo((): TaxResult | null => {
    const gross = parseNum(grossIncome);
    if (gross <= 0) return null;
    const stdDed = parseNum(standardDeduction);
    const allow = parseNum(allowances);
    const via = parseNum(viaDeductions);
    const totalDed = stdDed + allow + via;
    const ti = Math.max(0, gross - totalDed);
    const { tax: taxBefore, breakdown } = computeOldSlabTax(ti, slabs, fmt);
    const rebate = ti <= config.rebate87A.maxIncome ? Math.min(taxBefore, config.rebate87A.maxRebate) : 0;
    const taxAfter = Math.max(0, taxBefore - rebate);
    let sc = computeOldSurcharge(ti, taxAfter, config);
    sc = applyOldMarginalRelief(ti, taxAfter, sc, slabs, config);
    const cess = Math.ceil((taxAfter + sc) * config.cessRate);
    const total = Math.ceil(taxAfter + sc + cess);
    return {
      grossIncome: gross, totalDeductions: totalDed, taxableIncome: ti,
      taxBeforeRebate: taxBefore, rebate87A: rebate, taxAfterRebate: taxAfter,
      surcharge: sc, cess, totalTax: total,
      effectiveRate: gross > 0 ? Math.round((total / gross) * 10000) / 100 : 0,
      slabBreakdown: breakdown,
    };
  }, [grossIncome, standardDeduction, allowances, viaDeductions, ageCategory, assessmentYear]);

  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 };
  const selectStyle: React.CSSProperties = { width: '100%', padding: '9px 10px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 11, background: 'white', outline: 'none' };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '9px 10px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 11, background: 'white', outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: 16 }}>
      <div style={{ background: 'linear-gradient(135deg, #d97706, #b45309)', borderRadius: 16, padding: '18px 22px', color: 'white', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <FileSpreadsheet size={20} />
          <div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>Old Regime Tax Calculator</h2>
            <p style={{ margin: 0, fontSize: 10, opacity: 0.85 }}>{config.label} · Income Tax Act</p>
          </div>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: 18 }}>
        {/* Row 1: Assessment Year + Category + Residential Status */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <div>
            <label style={labelStyle}>Assessment Year *</label>
            <select style={selectStyle} value={assessmentYear} onChange={e => setAssessmentYear(e.target.value)}>
              {AY_OPTIONS.map(ay => <option key={ay} value={ay}>{AY_CONFIGS[ay].label}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Taxpayer Category *</label>
            <select style={selectStyle} defaultValue="individual"><option value="individual">Individual</option></select>
          </div>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label style={labelStyle}>Residential Status *</label>
          <select style={selectStyle} defaultValue="resident"><option value="resident">RES (Resident)</option></select>
        </div>

        {/* Age selector */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Your Age *</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
            {([['below60', 'Below 60 years', '(Regular Citizen)'], ['senior', '60 – 79 years', '(Senior Citizen)'], ['superSenior', '80 and above', '(Super Senior)']] as const).map(([key, label, sub]) => (
              <button key={key} onClick={() => setAgeCategory(key)}
                style={{ padding: '10px 6px', border: 'none', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                  background: ageCategory === key ? '#1e40af' : '#f8fafc', color: ageCategory === key ? 'white' : '#475569',
                  borderRight: key !== 'superSenior' ? '1px solid #e2e8f0' : 'none' }}>
                <div style={{ fontSize: 11, fontWeight: 700 }}>{label}</div>
                <div style={{ fontSize: 9, opacity: 0.8, marginTop: 2 }}>{sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Slab reference */}
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '8px 12px', marginBottom: 14 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#92400e', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Info size={10} /> Old Regime Slabs — {assessmentYear}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1px 14px', fontSize: 9, color: '#78350f' }}>
            {slabs.map(([lo, hi, rate], i) => (
              <React.Fragment key={i}>
                <span>{hi === Infinity ? `Above ${fmt(lo)}` : `${fmt(lo)} – ${fmt(hi)}`}</span>
                <span style={{ fontWeight: 700 }}>{rate === 0 ? 'Nil' : `${(rate * 100).toFixed(0)}%`}</span>
              </React.Fragment>
            ))}
          </div>
          <div style={{ fontSize: 8, color: '#92400e', marginTop: 3 }}>
            Rebate 87A: {fmt(config.rebate87A.maxRebate)} (income ≤ {fmt(config.rebate87A.maxIncome)}) · {config.cessLabel}
          </div>
        </div>

        {/* Income inputs */}
        <div style={{ marginBottom: 10 }}>
          <label style={labelStyle}>Total Taxable Income (Gross) *</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>₹</span>
            <input type="text" value={grossIncome} onChange={e => setGrossIncome(fmtInput(e.target.value))} placeholder="Enter income"
              style={{ ...inputStyle, paddingLeft: 24 }} />
          </div>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label style={labelStyle}>Standard Deduction <span style={{ color: '#94a3b8', fontWeight: 400 }}>(enter if applicable)</span></label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>₹</span>
            <input type="text" value={standardDeduction} onChange={e => setStandardDeduction(fmtInput(e.target.value))} placeholder="e.g. 50,000"
              style={{ ...inputStyle, paddingLeft: 24 }} />
          </div>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label style={labelStyle}>Allowances / Exemptions (HRA, LTA)</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>₹</span>
            <input type="text" value={allowances} onChange={e => setAllowances(fmtInput(e.target.value))} placeholder="e.g. 2,00,000"
              style={{ ...inputStyle, paddingLeft: 24 }} />
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Chapter VI-A Deductions (80C, 80D)</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>₹</span>
            <input type="text" value={viaDeductions} onChange={e => setViaDeductions(fmtInput(e.target.value))} placeholder="e.g. 1,50,000"
              style={{ ...inputStyle, paddingLeft: 24 }} />
          </div>
        </div>

        {/* Taxable income bar */}
        {result && (
          <div style={{ background: '#f1f5f9', borderRadius: 10, padding: '8px 12px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#475569' }}>Net Taxable Income</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#1e293b' }}>{fmt(result.taxableIncome)}</span>
          </div>
        )}

        {/* Results */}
        {result && result.grossIncome > 0 && (
          <div style={{ borderRadius: 14, border: '1px solid #bbf7d0', background: '#f0fdf4', padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 14 }}>
              {[['Taxable Income', fmt(result.taxableIncome), '#1e293b'], ['Total Tax', result.totalTax === 0 ? 'NIL' : fmt(result.totalTax), result.totalTax === 0 ? '#dc2626' : '#166534'], ['Effective Rate', `${result.effectiveRate}%`, '#7c3aed']].map(([l, v, c], i) => (
                <div key={i} style={{ background: 'white', borderRadius: 8, padding: 8, textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 8, color: '#94a3b8', textTransform: 'uppercase' }}>{l}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: c as string }}>{v}</div>
                </div>
              ))}
            </div>

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
                ...(result.totalDeductions > 0 ? [['(-) Total Deductions', -result.totalDeductions]] : []),
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
                  background: l === 'Total Tax Payable' ? '#f0fdf4' : 'transparent',
                }}>
                  <span style={{ color: '#475569' }}>{l as string}</span>
                  <span style={{ fontWeight: 600, color: (v as number) < 0 ? '#dc2626' : '#1e293b' }}>
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
