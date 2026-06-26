import React, { useState, useMemo } from 'react';
import { PiggyBank, Info } from 'lucide-react';
import './calculators.css';

// ═══ FD Calculator — Fixed Deposit Maturity & Returns ═══
// Formula: A = P × (1 + r/n)^(n × t)
// P = Principal, r = annual rate, n = compounding frequency, t = time in years

type CompoundFreq = 'monthly' | 'quarterly' | 'halfYearly' | 'yearly';

const COMPOUND_OPTIONS: { value: CompoundFreq; label: string; n: number }[] = [
  { value: 'monthly', label: 'Monthly (12/yr)', n: 12 },
  { value: 'quarterly', label: 'Quarterly (4/yr)', n: 4 },
  { value: 'halfYearly', label: 'Half-Yearly (2/yr)', n: 2 },
  { value: 'yearly', label: 'Yearly (1/yr)', n: 1 },
];

interface FdResult {
  principal: number;
  maturity: number;
  interest: number;
  effectiveRate: number;
  yearlyBreakdown: { year: number; opening: number; interestEarned: number; closing: number }[];
}

export const FdCalculator: React.FC = () => {
  const [investment, setInvestment] = useState('1,00,000');
  const [rate, setRate] = useState('7');
  const [timePeriod, setTimePeriod] = useState('5');
  const [timeUnit, setTimeUnit] = useState<'years' | 'months'>('years');
  const [compounding, setCompounding] = useState<CompoundFreq>('quarterly');

  const parseNum = (v: string) => { const n = parseFloat(v.replace(/,/g, '')); return isNaN(n) || n < 0 ? 0 : n; };
  const fmt = (n: number) => n.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const fmtInput = (v: string) => { let d = v.replace(/[^0-9]/g, ''); if (!d) return ''; d = d.replace(/^0+/, '') || '0'; return Number(d).toLocaleString('en-IN'); };

  const n = COMPOUND_OPTIONS.find(c => c.value === compounding)!.n;

  const result = useMemo((): FdResult | null => {
    const P = parseNum(investment);
    const r = parseFloat(rate) / 100;
    const period = parseFloat(timePeriod);
    if (!P || P < 1 || isNaN(r) || r <= 0 || isNaN(period) || period <= 0) return null;

    const tYears = timeUnit === 'years' ? period : period / 12;
    const maturity = Math.round(P * Math.pow(1 + r / n, n * tYears));
    const interest = maturity - P;
    const effectiveRate = Math.round(((Math.pow(1 + r / n, n) - 1) * 100) * 100) / 100;

    // Year-wise breakdown
    const fullYears = Math.floor(tYears);
    const fractionalYear = tYears - fullYears;
    const yearlyBreakdown: FdResult['yearlyBreakdown'] = [];
    for (let y = 1; y <= fullYears; y++) {
      const opening = Math.round(P * Math.pow(1 + r / n, n * (y - 1)));
      const closing = Math.round(P * Math.pow(1 + r / n, n * y));
      yearlyBreakdown.push({ year: y, opening, interestEarned: closing - opening, closing });
    }
    if (fractionalYear > 0.001) {
      const opening = Math.round(P * Math.pow(1 + r / n, n * fullYears));
      yearlyBreakdown.push({ year: fullYears + 1, opening, interestEarned: maturity - opening, closing: maturity });
    }

    return { principal: P, maturity, interest, effectiveRate, yearlyBreakdown };
  }, [investment, rate, timePeriod, timeUnit, compounding]);

  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 13, background: 'white', outline: 'none', boxSizing: 'border-box' };
  const selectStyle: React.CSSProperties = { ...inputStyle };

  // Donut chart
  const pctInvestment = result ? Math.round((result.principal / result.maturity) * 100) : 0;
  const pctReturn = 100 - pctInvestment;

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: 16 }}>
      <div style={{ background: 'linear-gradient(135deg, #059669, #047857)', borderRadius: 16, padding: '16px 20px', color: 'white', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <PiggyBank size={20} />
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>FD Calculator</h2>
            <p style={{ margin: 0, fontSize: 11, opacity: 0.85 }}>Fixed Deposit Maturity & Returns · Compound Interest</p>
          </div>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: 18 }}>
        {/* Formula badge */}
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10, padding: '6px 12px', marginBottom: 14, fontSize: 10, color: '#065f46', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Info size={10} /> <strong>Formula:</strong> A = P × (1 + r/n)<sup>n×t</sup> &nbsp;|&nbsp; P=Principal, r=Rate, n=Compounding frequency, t=Tenure
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label style={labelStyle}>Investment Amount (₹) *</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>₹</span>
              <input type="text" value={investment} onChange={e => setInvestment(fmtInput(e.target.value))} placeholder="e.g. 1,00,000"
                style={{ ...inputStyle, paddingLeft: 26 }} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Interest Rate (% p.a.) *</label>
            <input type="number" min={0} max={20} step={0.1} value={rate}
              onChange={e => { const v = e.target.value; if (v === '' || (Number(v) >= 0 && Number(v) <= 20)) setRate(v); }}
              style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Time Period *</label>
            <input type="number" min={1} max={timeUnit === 'years' ? 50 : 600} value={timePeriod}
              onChange={e => { const v = e.target.value; if (v === '' || (Number(v) >= 0 && Number(v) <= (timeUnit === 'years' ? 50 : 600))) setTimePeriod(v); }}
              style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Unit</label>
            <select style={selectStyle} value={timeUnit} onChange={e => setTimeUnit(e.target.value as any)}>
              <option value="years">Years</option><option value="months">Months</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Compounding</label>
            <select style={selectStyle} value={compounding} onChange={e => setCompounding(e.target.value as CompoundFreq)}>
              {COMPOUND_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div style={{ borderRadius: 14, border: '1px solid #a7f3d0', background: '#f0fdf4', padding: 18 }}>
            {/* Summary cards + visual */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px', gap: 16, marginBottom: 16 }}>
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                  {[['Invested', fmt(result.principal), '#1e293b'], ['Interest Earned', fmt(result.interest), '#059669'], ['Maturity Amount', fmt(result.maturity), '#7c3aed'], ['Effective Rate', `${result.effectiveRate}%`, '#d97706']].map(([l, v, c], i) => (
                    <div key={i} style={{ background: 'white', borderRadius: 8, padding: 10, border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase' }}>{l}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: c as string }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Donut */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="110" height="110" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#059669" strokeWidth="12"
                    strokeDasharray={`${pctReturn * 2.51} ${251 - pctReturn * 2.51}`}
                    strokeDashoffset="63" strokeLinecap="round" />
                  <text x="50" y="48" textAnchor="middle" fontSize="11" fontWeight="800" fill="#059669">{pctReturn}%</text>
                  <text x="50" y="60" textAnchor="middle" fontSize="7" fill="#94a3b8">Returns</text>
                </svg>
                <div style={{ display: 'flex', gap: 8, marginTop: 5, fontSize: 10 }}>
                  <span><span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#e2e8f0', marginRight: 2 }} />Invested</span>
                  <span><span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#059669', marginRight: 2 }} />Interest</span>
                </div>
              </div>
            </div>

            {/* Year-wise growth */}
            {result.yearlyBreakdown.length > 0 && result.yearlyBreakdown.length <= 30 && (
              <div style={{ background: 'white', borderRadius: 8, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', padding: '8px 12px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Year-wise Growth</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr', fontSize: 10, fontWeight: 600, color: '#94a3b8', padding: '6px 12px', borderBottom: '1px solid #e2e8f0' }}>
                  <span>Yr</span><span style={{ textAlign: 'right' }}>Opening</span><span style={{ textAlign: 'right' }}>Interest</span><span style={{ textAlign: 'right' }}>Closing</span>
                </div>
                {result.yearlyBreakdown.map((y, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr', fontSize: 11, padding: '6px 12px', borderBottom: i < result.yearlyBreakdown.length - 1 ? '1px solid #f1f5f9' : 'none', color: '#475569' }}>
                    <span style={{ fontWeight: 600 }}>{y.year}</span>
                    <span style={{ textAlign: 'right' }}>{fmt(y.opening)}</span>
                    <span style={{ textAlign: 'right', color: '#059669' }}>+{fmt(y.interestEarned)}</span>
                    <span style={{ textAlign: 'right', fontWeight: 600 }}>{fmt(y.closing)}</span>
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
