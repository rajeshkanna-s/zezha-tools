import React, { useState, useMemo } from 'react';
import { BarChart3, ArrowRight, TrendingDown, TrendingUp, Equal } from 'lucide-react';
import { AY_CONFIGS, AY_OPTIONS, computeOldSlabTax, computeOldSurcharge, applyOldMarginalRelief } from './OldRegimeTaxCalculator';
import { NEW_AY_CONFIGS, NEW_AY_OPTIONS, computeNewSlabTax, computeNewSurcharge, applyNewMarginalRelief, computeNew87ARebate } from './NewRegimeTaxCalculator';
import type { AgeKey } from './OldRegimeTaxCalculator';
import './calculators.css';

// ═══ Tax Compare Calculator — Old Regime vs New Regime (multi-AY) ═══

interface TaxResult {
  grossIncome: number; totalDeductions: number; taxableIncome: number;
  taxBeforeRebate: number; rebate87A: number; taxAfterRebate: number;
  surcharge: number; cess: number; totalTax: number; effectiveRate: number;
  slabBreakdown: { slab: string; amount: number; rate: string; tax: number }[];
}

const parseNum = (v: string) => { const n = parseFloat(v.replace(/,/g, '')); return isNaN(n) || n < 0 ? 0 : n; };
const fmt = (n: number) => n.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmtInput = (v: string) => { let d = v.replace(/[^0-9]/g, ''); if (!d) return ''; d = d.replace(/^0+/, '') || '0'; return Number(d).toLocaleString('en-IN'); };

export const TaxCompareCalculator: React.FC = () => {
  const [oldAY, setOldAY] = useState('2026-27');
  const [newAY, setNewAY] = useState('2026-27');
  const [grossIncome, setGrossIncome] = useState('');
  const [ageCategory, setAgeCategory] = useState<AgeKey>('below60');
  const [oldStdDed, setOldStdDed] = useState('');
  const [oldAllowances, setOldAllowances] = useState('');
  const [oldViaDed, setOldViaDed] = useState('');
  const [newStdDed, setNewStdDed] = useState('');

  const oldConfig = AY_CONFIGS[oldAY];
  const newConfig = NEW_AY_CONFIGS[newAY];
  const oldSlabs = oldConfig.slabs[ageCategory];
  const newSlabs = newConfig.slabs;

  const oldResult = useMemo((): TaxResult | null => {
    const gross = parseNum(grossIncome);
    if (gross <= 0) return null;
    const totalDed = parseNum(oldStdDed) + parseNum(oldAllowances) + parseNum(oldViaDed);
    const ti = Math.max(0, gross - totalDed);
    const { tax, breakdown } = computeOldSlabTax(ti, oldSlabs, fmt);
    const rebate = ti <= oldConfig.rebate87A.maxIncome ? Math.min(tax, oldConfig.rebate87A.maxRebate) : 0;
    const taxAfter = Math.max(0, tax - rebate);
    let sc = computeOldSurcharge(ti, taxAfter, oldConfig);
    sc = applyOldMarginalRelief(ti, taxAfter, sc, oldSlabs, oldConfig);
    const cess = Math.ceil((taxAfter + sc) * oldConfig.cessRate);
    const total = Math.ceil(taxAfter + sc + cess);
    return { grossIncome: gross, totalDeductions: totalDed, taxableIncome: ti, taxBeforeRebate: tax, rebate87A: rebate, taxAfterRebate: taxAfter, surcharge: sc, cess, totalTax: total, effectiveRate: gross > 0 ? Math.round((total / gross) * 10000) / 100 : 0, slabBreakdown: breakdown };
  }, [grossIncome, oldStdDed, oldAllowances, oldViaDed, ageCategory, oldAY]);

  const newResult = useMemo((): TaxResult | null => {
    const gross = parseNum(grossIncome);
    if (gross <= 0) return null;
    const stdDed = parseNum(newStdDed);
    const ti = Math.max(0, gross - stdDed);
    const { tax, breakdown } = computeNewSlabTax(ti, newSlabs, fmt);
    const rebate = computeNew87ARebate(ti, tax, newConfig, newSlabs);
    const taxAfter = Math.max(0, tax - rebate);
    let sc = computeNewSurcharge(ti, taxAfter, newConfig);
    sc = applyNewMarginalRelief(ti, taxAfter, sc, newSlabs, newConfig);
    const cess = Math.ceil((taxAfter + sc) * newConfig.cessRate);
    const total = Math.ceil(taxAfter + sc + cess);
    return { grossIncome: gross, totalDeductions: stdDed, taxableIncome: ti, taxBeforeRebate: tax, rebate87A: rebate, taxAfterRebate: taxAfter, surcharge: sc, cess, totalTax: total, effectiveRate: gross > 0 ? Math.round((total / gross) * 10000) / 100 : 0, slabBreakdown: breakdown };
  }, [grossIncome, newStdDed, newAY]);

  const saving = oldResult && newResult ? oldResult.totalTax - newResult.totalTax : 0;
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 3 };
  const selectStyle: React.CSSProperties = { width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 11, background: 'white', outline: 'none' };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 11, background: 'white', outline: 'none', boxSizing: 'border-box' as const };

  const ResultPanel = ({ title, color, result, cessLabel }: { title: string; color: string; result: TaxResult; cessLabel: string }) => (
    <div style={{ borderRadius: 10, border: `1px solid ${color}22`, background: `${color}08`, padding: 12 }}>
      <div style={{ textAlign: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase' }}>{title}</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: result.totalTax === 0 ? '#dc2626' : '#1e293b' }}>{result.totalTax === 0 ? 'NIL' : fmt(result.totalTax)}</div>
        <div style={{ fontSize: 9, color: '#94a3b8' }}>Effective Rate: {result.effectiveRate}%</div>
      </div>
      <div style={{ background: 'white', borderRadius: 8, border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: 8 }}>
        <div style={{ fontSize: 8, fontWeight: 700, color: '#64748b', padding: '5px 8px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Slab Breakdown</div>
        {result.slabBreakdown.map((s, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 8px', borderBottom: i < result.slabBreakdown.length - 1 ? '1px solid #f1f5f9' : 'none', fontSize: 9 }}>
            <span style={{ color: '#475569' }}>{s.slab} <span style={{ color: '#cbd5e1' }}>@ {s.rate}</span></span>
            <span style={{ fontWeight: 600 }}>{fmt(s.tax)}</span>
          </div>
        ))}
      </div>
      <div style={{ background: 'white', borderRadius: 8, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ fontSize: 8, fontWeight: 700, color: '#64748b', padding: '5px 8px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Computation</div>
        {[
          ['Gross Income', result.grossIncome],
          ...(result.totalDeductions > 0 ? [['(-) Deductions', -result.totalDeductions]] : []),
          ['Taxable Income', result.taxableIncome],
          ['Tax Before Rebate', result.taxBeforeRebate],
          ...(result.rebate87A > 0 ? [['(-) Rebate 87A', -result.rebate87A]] : []),
          ['Tax After Rebate', result.taxAfterRebate],
          ...(result.surcharge > 0 ? [['(+) Surcharge', result.surcharge]] : []),
          [`(+) ${cessLabel}`, result.cess],
          ['Total Tax', result.totalTax],
        ].map(([l, v], i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', padding: '3px 8px', fontSize: 9, borderBottom: '1px solid #f1f5f9',
            fontWeight: l === 'Total Tax' || l === 'Taxable Income' ? 700 : 400,
            background: l === 'Total Tax' ? `${color}08` : 'transparent',
          }}>
            <span style={{ color: '#475569' }}>{l as string}</span>
            <span style={{ fontWeight: 600, color: (v as number) < 0 ? '#dc2626' : '#1e293b' }}>
              {(v as number) < 0 ? `(${fmt(Math.abs(v as number))})` : fmt(v as number)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: 16 }}>
      <div style={{ background: 'linear-gradient(135deg, #db2777, #9333ea)', borderRadius: 16, padding: '18px 22px', color: 'white', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BarChart3 size={20} />
          <div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>Tax Regime Comparison</h2>
            <p style={{ margin: 0, fontSize: 10, opacity: 0.85 }}>Old Regime ({oldAY}) vs New Regime ({newAY}) · Side by Side</p>
          </div>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: 16 }}>
        {/* Common: Category + Residential */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
          <div>
            <label style={labelStyle}>Taxpayer Category *</label>
            <select style={selectStyle} defaultValue="individual"><option value="individual">Individual</option></select>
          </div>
          <div>
            <label style={labelStyle}>Residential Status *</label>
            <select style={selectStyle} defaultValue="resident"><option value="resident">RES (Resident)</option></select>
          </div>
        </div>

        {/* AY selectors — side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
          <div>
            <label style={labelStyle}>Old Regime — Assessment Year *</label>
            <select style={selectStyle} value={oldAY} onChange={e => setOldAY(e.target.value)}>
              {AY_OPTIONS.map(ay => <option key={ay} value={ay}>{AY_CONFIGS[ay].label}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>New Regime — Assessment Year *</label>
            <select style={selectStyle} value={newAY} onChange={e => setNewAY(e.target.value)}>
              {NEW_AY_OPTIONS.map(ay => <option key={ay} value={ay}>{NEW_AY_CONFIGS[ay].label}</option>)}
            </select>
          </div>
        </div>

        {/* Age */}
        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>Your Age *</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
            {([['below60', 'Below 60', '(Regular)'], ['senior', '60 – 79', '(Senior)'], ['superSenior', '80+', '(Super Senior)']] as const).map(([key, label, sub]) => (
              <button key={key} onClick={() => setAgeCategory(key)}
                style={{ padding: '8px 6px', border: 'none', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                  background: ageCategory === key ? '#9333ea' : '#f8fafc', color: ageCategory === key ? 'white' : '#475569',
                  borderRight: key !== 'superSenior' ? '1px solid #e2e8f0' : 'none' }}>
                <div style={{ fontSize: 10, fontWeight: 700 }}>{label}</div>
                <div style={{ fontSize: 8, opacity: 0.8 }}>{sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Gross Income */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Gross Annual Income *</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>₹</span>
            <input type="text" value={grossIncome} onChange={e => setGrossIncome(fmtInput(e.target.value))} placeholder="Enter gross annual income"
              style={{ ...inputStyle, paddingLeft: 24, fontSize: 13, padding: '10px 10px 10px 24px', fontWeight: 600 }} />
          </div>
        </div>

        {/* Side by side deductions + slab refs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          {/* Old */}
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#92400e', marginBottom: 6, textAlign: 'center' }}>📋 Old Regime ({oldAY})</div>
            <div style={{ background: '#fef3c7', borderRadius: 6, padding: '4px 8px', marginBottom: 8, fontSize: 8, color: '#78350f' }}>
              {oldSlabs.map(([lo, hi, rate], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{hi === Infinity ? `>${fmt(lo)}` : `${fmt(lo)}-${fmt(hi)}`}</span>
                  <span style={{ fontWeight: 700 }}>{rate === 0 ? 'Nil' : `${(rate * 100).toFixed(0)}%`}</span>
                </div>
              ))}
              <div style={{ marginTop: 2, borderTop: '1px solid #fbbf2480', paddingTop: 2, fontSize: 7 }}>
                87A: {fmt(oldConfig.rebate87A.maxRebate)} (≤{fmt(oldConfig.rebate87A.maxIncome)}) · {oldConfig.cessLabel}
              </div>
            </div>
            <div style={{ marginBottom: 6 }}>
              <label style={{ ...labelStyle, fontSize: 9 }}>Standard Deduction</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: '#94a3b8' }}>₹</span>
                <input type="text" value={oldStdDed} onChange={e => setOldStdDed(fmtInput(e.target.value))} placeholder="e.g. 50,000"
                  style={{ ...inputStyle, paddingLeft: 20, fontSize: 10 }} />
              </div>
            </div>
            <div style={{ marginBottom: 6 }}>
              <label style={{ ...labelStyle, fontSize: 9 }}>Allowances (HRA, LTA)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: '#94a3b8' }}>₹</span>
                <input type="text" value={oldAllowances} onChange={e => setOldAllowances(fmtInput(e.target.value))} placeholder="e.g. 2,00,000"
                  style={{ ...inputStyle, paddingLeft: 20, fontSize: 10 }} />
              </div>
            </div>
            <div>
              <label style={{ ...labelStyle, fontSize: 9 }}>Ch. VI-A (80C, 80D)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: '#94a3b8' }}>₹</span>
                <input type="text" value={oldViaDed} onChange={e => setOldViaDed(fmtInput(e.target.value))} placeholder="e.g. 1,50,000"
                  style={{ ...inputStyle, paddingLeft: 20, fontSize: 10 }} />
              </div>
            </div>
          </div>

          {/* New */}
          <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 10, padding: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#5b21b6', marginBottom: 6, textAlign: 'center' }}>📋 New Regime ({newAY})</div>
            <div style={{ background: '#ede9fe', borderRadius: 6, padding: '4px 8px', marginBottom: 8, fontSize: 8, color: '#4c1d95' }}>
              {newSlabs.map(([lo, hi, rate], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{hi === Infinity ? `>${fmt(lo)}` : `${fmt(lo)}-${fmt(hi)}`}</span>
                  <span style={{ fontWeight: 700 }}>{rate === 0 ? 'Nil' : `${(rate * 100).toFixed(0)}%`}</span>
                </div>
              ))}
              <div style={{ marginTop: 2, borderTop: '1px solid #c4b5fd80', paddingTop: 2, fontSize: 7 }}>
                87A: {fmt(newConfig.rebate87A.maxRebate)} (≤{fmt(newConfig.rebate87A.maxIncome)}) · Surcharge: {newConfig.surchargeLabel} · {newConfig.cessLabel}
              </div>
            </div>
            <div style={{ marginBottom: 6 }}>
              <label style={{ ...labelStyle, fontSize: 9 }}>Standard Deduction <span style={{ fontWeight: 400 }}>({newConfig.stdDeductionHint})</span></label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: '#94a3b8' }}>₹</span>
                <input type="text" value={newStdDed} onChange={e => setNewStdDed(fmtInput(e.target.value))} placeholder="Enter if applicable"
                  style={{ ...inputStyle, paddingLeft: 20, fontSize: 10 }} />
              </div>
            </div>
            <div style={{ background: '#fefce8', border: '1px solid #fde68a', borderRadius: 6, padding: '5px 8px', marginTop: 8, fontSize: 8, color: '#92400e' }}>
              <strong>Note:</strong> 80C, 80D, HRA NOT allowed in new regime.
            </div>
          </div>
        </div>

        {/* Saving banner */}
        {oldResult && newResult && parseNum(grossIncome) > 0 && (
          <div style={{
            borderRadius: 12, padding: '12px 16px', marginBottom: 14, textAlign: 'center',
            background: saving > 0 ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : saving < 0 ? 'linear-gradient(135deg, #d97706, #b45309)' : '#f1f5f9',
            color: saving !== 0 ? 'white' : '#475569',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {saving > 0 ? <TrendingDown size={16} /> : saving < 0 ? <TrendingUp size={16} /> : <Equal size={16} />}
              <span style={{ fontSize: 14, fontWeight: 800 }}>
                {saving > 0 ? `New Regime saves ${fmt(saving)}` : saving < 0 ? `Old Regime saves ${fmt(Math.abs(saving))}` : 'Both regimes = same tax'}
              </span>
            </div>
            <div style={{ fontSize: 10, opacity: 0.85, marginTop: 4 }}>
              Old ({oldAY}): {fmt(oldResult.totalTax)} ({oldResult.effectiveRate}%) <ArrowRight size={10} style={{ verticalAlign: 'middle', margin: '0 4px' }} /> New ({newAY}): {fmt(newResult.totalTax)} ({newResult.effectiveRate}%)
            </div>
          </div>
        )}

        {/* Side by side results */}
        {oldResult && newResult && parseNum(grossIncome) > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <ResultPanel title={`Old Regime (${oldAY})`} color="#d97706" result={oldResult} cessLabel={oldConfig.cessLabel} />
            <ResultPanel title={`New Regime (${newAY})`} color="#7c3aed" result={newResult} cessLabel={newConfig.cessLabel} />
          </div>
        )}
      </div>
    </div>
  );
};
