import React, { useState, useMemo } from 'react';
import { PiggyBank, Info } from 'lucide-react';
import './calculators.css';

// ═══ RD Calculator — Recurring Deposit Maturity ═══
// Standard bank RD formula with quarterly compounding
// Each monthly deposit earns compound interest for remaining tenure
// M = Σ R × (1 + i)^((N-k)/3) for k = 0 to N-1 months, i = quarterly rate

interface RdResult {
  monthlyDeposit: number;
  totalMonths: number;
  totalInvested: number;
  totalInterest: number;
  maturityAmount: number;
  effectiveReturn: number;
  quarterlyBreakdown: { quarter: number; deposited: number; cumulativeDeposit: number; interestAccrued: number; balance: number }[];
}

export const RdCalculator: React.FC = () => {
  const [monthlyStr, setMonthlyStr] = useState('5,000');
  const [rateStr, setRateStr] = useState('7');
  const [periodStr, setPeriodStr] = useState('3');
  const [timeUnit, setTimeUnit] = useState<'years' | 'months'>('years');

  const parseNum = (v: string) => { const n = parseFloat(v.replace(/,/g, '')); return isNaN(n) || n < 0 ? 0 : n; };
  const fmt = (n: number) => n.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const fmtInput = (v: string) => { let d = v.replace(/[^0-9]/g, ''); if (!d) return ''; d = d.replace(/^0+/, '') || '0'; return Number(d).toLocaleString('en-IN'); };

  const result = useMemo((): RdResult | null => {
    const R = parseNum(monthlyStr);
    const annualRate = parseFloat(rateStr);
    const period = parseFloat(periodStr);
    if (!R || R < 1 || isNaN(annualRate) || annualRate <= 0 || isNaN(period) || period <= 0) return null;

    const totalMonths = Math.round(timeUnit === 'years' ? period * 12 : period);
    if (totalMonths < 1) return null;

    const n = 4; // Quarterly compounding
    const r = annualRate / 100;

    // Standard RD calculation: each monthly deposit compounds for remaining duration
    let maturity = 0;
    for (let i = 1; i <= totalMonths; i++) {
      const remainingMonths = totalMonths - i + 1;
      const t = remainingMonths / 12; // Convert to years
      maturity += R * Math.pow(1 + r / n, n * t);
    }
    maturity = Math.round(maturity);

    const totalInvested = R * totalMonths;
    const totalInterest = maturity - totalInvested;
    const effectiveReturn = totalInvested > 0 ? Math.round((totalInterest / totalInvested) * 10000) / 100 : 0;

    // Quarter-wise breakdown
    const quarterlyBreakdown: RdResult['quarterlyBreakdown'] = [];
    const totalQuarters = Math.ceil(totalMonths / 3);
    for (let q = 1; q <= totalQuarters; q++) {
      const monthsInQ = Math.min(3, totalMonths - (q - 1) * 3);
      const deposited = R * monthsInQ;
      const cumulativeDeposit = R * Math.min(q * 3, totalMonths);

      // Calculate balance at end of this quarter
      let balance = 0;
      const monthsCompleted = Math.min(q * 3, totalMonths);
      for (let i = 1; i <= monthsCompleted; i++) {
        const remainingFromNow = monthsCompleted - i + 1;
        const t = remainingFromNow / 12;
        balance += R * Math.pow(1 + r / n, n * t);
      }
      balance = Math.round(balance);
      const interestAccrued = balance - cumulativeDeposit;

      quarterlyBreakdown.push({ quarter: q, deposited, cumulativeDeposit, interestAccrued, balance });
    }

    return { monthlyDeposit: R, totalMonths, totalInvested, totalInterest, maturityAmount: maturity, effectiveReturn, quarterlyBreakdown };
  }, [monthlyStr, rateStr, periodStr, timeUnit]);

  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 13, background: 'white', outline: 'none', boxSizing: 'border-box' };
  const selectStyle: React.CSSProperties = { ...inputStyle };

  const pctInvestment = result ? Math.round((result.totalInvested / result.maturityAmount) * 100) : 0;
  const pctReturn = 100 - pctInvestment;

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: 16 }}>
      <div style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', borderRadius: 16, padding: '16px 20px', color: 'white', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <PiggyBank size={20} />
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>RD Calculator</h2>
            <p style={{ margin: 0, fontSize: 11, opacity: 0.85 }}>Recurring Deposit Maturity · Quarterly Compounding</p>
          </div>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: 18 }}>
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '6px 12px', marginBottom: 14, fontSize: 10, color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Info size={10} /> <strong>Formula:</strong> M = Σ R × (1 + r/4)<sup>4×t</sup> for each month &nbsp;|&nbsp; Quarterly compound interest on each deposit
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label style={labelStyle}>Monthly Deposit (₹) *</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>₹</span>
              <input type="text" value={monthlyStr} onChange={e => setMonthlyStr(fmtInput(e.target.value))} placeholder="e.g. 5,000"
                style={{ ...inputStyle, paddingLeft: 26 }} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Interest Rate (% p.a.) *</label>
            <input type="number" min={0} max={15} step={0.1} value={rateStr}
              onChange={e => { const v = e.target.value; if (v === '' || (Number(v) >= 0 && Number(v) <= 15)) setRateStr(v); }}
              style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Tenure *</label>
            <input type="number" min={1} max={timeUnit === 'years' ? 10 : 120} value={periodStr}
              onChange={e => { const v = e.target.value; if (v === '' || (Number(v) >= 0 && Number(v) <= (timeUnit === 'years' ? 10 : 120))) setPeriodStr(v); }}
              style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Unit</label>
            <select style={selectStyle} value={timeUnit} onChange={e => setTimeUnit(e.target.value as any)}>
              <option value="years">Years</option><option value="months">Months</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div style={{ borderRadius: 14, border: '1px solid #bfdbfe', background: '#eff6ff', padding: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px', gap: 16, marginBottom: 16 }}>
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                  {[
                    ['Monthly Deposit', fmt(result.monthlyDeposit), '#1e293b'],
                    ['Total Invested', fmt(result.totalInvested), '#475569'],
                    ['Interest Earned', fmt(result.totalInterest), '#2563eb'],
                    ['Maturity Amount', fmt(result.maturityAmount), '#7c3aed'],
                  ].map(([l, v, c], i) => (
                    <div key={i} style={{ background: 'white', borderRadius: 8, padding: 10, border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase' }}>{l}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: c as string }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'white', borderRadius: 8, padding: '8px 12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#64748b' }}>Effective Return on Investment</span>
                  <span style={{ fontWeight: 700, color: '#2563eb' }}>{result.effectiveReturn}%</span>
                </div>
              </div>
              {/* Donut */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="110" height="110" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#2563eb" strokeWidth="12"
                    strokeDasharray={`${pctReturn * 2.51} ${251 - pctReturn * 2.51}`}
                    strokeDashoffset="63" strokeLinecap="round" />
                  <text x="50" y="48" textAnchor="middle" fontSize="11" fontWeight="800" fill="#2563eb">{pctReturn}%</text>
                  <text x="50" y="60" textAnchor="middle" fontSize="7" fill="#94a3b8">Returns</text>
                </svg>
                <div style={{ display: 'flex', gap: 8, marginTop: 5, fontSize: 10 }}>
                  <span><span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#e2e8f0', marginRight: 2 }} />Invested</span>
                  <span><span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#2563eb', marginRight: 2 }} />Interest</span>
                </div>
              </div>
            </div>

            {/* Quarter-wise breakdown */}
            {result.quarterlyBreakdown.length > 0 && result.quarterlyBreakdown.length <= 40 && (
              <div style={{ background: 'white', borderRadius: 8, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', padding: '8px 12px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Quarter-wise Growth</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr 1fr', fontSize: 10, fontWeight: 600, color: '#94a3b8', padding: '6px 12px', borderBottom: '1px solid #e2e8f0' }}>
                  <span>Q</span><span style={{ textAlign: 'right' }}>Deposited</span><span style={{ textAlign: 'right' }}>Cumulative</span><span style={{ textAlign: 'right' }}>Interest</span><span style={{ textAlign: 'right' }}>Balance</span>
                </div>
                {result.quarterlyBreakdown.map((q, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr 1fr', fontSize: 11, padding: '6px 12px', borderBottom: i < result.quarterlyBreakdown.length - 1 ? '1px solid #f1f5f9' : 'none', color: '#475569' }}>
                    <span style={{ fontWeight: 600 }}>Q{q.quarter}</span>
                    <span style={{ textAlign: 'right' }}>{fmt(q.deposited)}</span>
                    <span style={{ textAlign: 'right' }}>{fmt(q.cumulativeDeposit)}</span>
                    <span style={{ textAlign: 'right', color: '#2563eb' }}>+{fmt(q.interestAccrued)}</span>
                    <span style={{ textAlign: 'right', fontWeight: 600 }}>{fmt(q.balance)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
