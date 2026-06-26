import React, { useState, useMemo } from 'react';
import { TrendingUp, Info } from 'lucide-react';
import './calculators.css';

// ═══ SIP Calculator — Systematic Investment Plan & Lumpsum ═══
// SIP Formula (Future Value of Annuity Due):
//   FV = P × {[(1+r)^n - 1] / r} × (1+r)
//   P = monthly, r = monthly rate, n = total months
// Step-up SIP: Annual increase % in SIP amount
// Lumpsum: A = P × (1+r)^n

type InvestMode = 'sip' | 'stepUpSip' | 'lumpsum';

interface SipResult {
  totalInvested: number;
  totalReturns: number;
  maturityAmount: number;
  effectiveReturn: number;
  inflationAdjusted: number;
  yearlyBreakdown: { year: number; invested: number; cumulativeInvested: number; value: number; gain: number }[];
}

export const SipCalculator: React.FC = () => {
  const [mode, setMode] = useState<InvestMode>('sip');
  const [monthlyStr, setMonthlyStr] = useState('10,000');
  const [lumpStr, setLumpStr] = useState('1,00,000');
  const [rateStr, setRateStr] = useState('12');
  const [yearsStr, setYearsStr] = useState('10');
  const [stepUpStr, setStepUpStr] = useState('10');
  const [inflationStr, setInflationStr] = useState('6');

  const parseNum = (v: string) => { const n = parseFloat(v.replace(/,/g, '')); return isNaN(n) || n < 0 ? 0 : n; };
  const fmt = (n: number) => n.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const fmtInput = (v: string) => { let d = v.replace(/[^0-9]/g, ''); if (!d) return ''; d = d.replace(/^0+/, '') || '0'; return Number(d).toLocaleString('en-IN'); };

  const result = useMemo((): SipResult | null => {
    const rate = parseFloat(rateStr);
    const years = parseFloat(yearsStr);
    const inflation = parseFloat(inflationStr) || 6;
    if (isNaN(rate) || rate <= 0 || isNaN(years) || years < 1) return null;

    const mr = rate / 100 / 12; // Monthly rate
    const yearlyBreakdown: SipResult['yearlyBreakdown'] = [];

    let totalInvested = 0, maturity = 0;

    if (mode === 'lumpsum') {
      const P = parseNum(lumpStr);
      if (!P || P < 1) return null;
      totalInvested = P;
      maturity = Math.round(P * Math.pow(1 + rate / 100, years));

      for (let y = 1; y <= years; y++) {
        const value = Math.round(P * Math.pow(1 + rate / 100, y));
        yearlyBreakdown.push({ year: y, invested: y === 1 ? P : 0, cumulativeInvested: P, value, gain: value - P });
      }
    } else if (mode === 'sip') {
      const P = parseNum(monthlyStr);
      if (!P || P < 1) return null;
      const n = years * 12;
      // FV = P × {[(1+r)^n - 1] / r} × (1+r)
      maturity = Math.round(P * (((Math.pow(1 + mr, n) - 1) / mr) * (1 + mr)));
      totalInvested = P * n;

      for (let y = 1; y <= years; y++) {
        const months = y * 12;
        const value = Math.round(P * (((Math.pow(1 + mr, months) - 1) / mr) * (1 + mr)));
        const invested = P * months;
        yearlyBreakdown.push({ year: y, invested: P * 12, cumulativeInvested: invested, value, gain: value - invested });
      }
    } else {
      // Step-up SIP: Each year, monthly SIP increases by stepUp%
      const baseP = parseNum(monthlyStr);
      const stepUp = parseFloat(stepUpStr) / 100;
      if (!baseP || baseP < 1 || isNaN(stepUp)) return null;

      let cumulativeValue = 0;
      let cumInvested = 0;

      for (let y = 1; y <= years; y++) {
        const currentP = Math.round(baseP * Math.pow(1 + stepUp, y - 1));
        const yearInvested = currentP * 12;
        cumInvested += yearInvested;

        // Each month's SIP in this year compounds for remaining months
        for (let m = 1; m <= 12; m++) {
          const remainingMonths = (years - y) * 12 + (12 - m + 1);
          cumulativeValue += currentP * Math.pow(1 + mr, remainingMonths);
        }

        const valueAtEndOfYear = (() => {
          let v = 0;
          for (let yr = 1; yr <= y; yr++) {
            const p = Math.round(baseP * Math.pow(1 + stepUp, yr - 1));
            for (let m = 1; m <= 12; m++) {
              const remaining = (y - yr) * 12 + (12 - m + 1);
              v += p * Math.pow(1 + mr, remaining);
            }
          }
          return Math.round(v);
        })();

        yearlyBreakdown.push({ year: y, invested: yearInvested, cumulativeInvested: cumInvested, value: valueAtEndOfYear, gain: valueAtEndOfYear - cumInvested });
      }

      totalInvested = cumInvested;
      maturity = Math.round(cumulativeValue);
    }

    const totalReturns = maturity - totalInvested;
    const effectiveReturn = totalInvested > 0 ? Math.round((totalReturns / totalInvested) * 10000) / 100 : 0;
    const inflationAdjusted = Math.round(maturity / Math.pow(1 + inflation / 100, years));

    return { totalInvested, totalReturns, maturityAmount: maturity, effectiveReturn, inflationAdjusted, yearlyBreakdown };
  }, [mode, monthlyStr, lumpStr, rateStr, yearsStr, stepUpStr, inflationStr]);

  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 13, background: 'white', outline: 'none', boxSizing: 'border-box' };

  const pctInvestment = result ? Math.round((result.totalInvested / result.maturityAmount) * 100) : 0;
  const pctReturn = 100 - pctInvestment;

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: 16 }}>
      <div style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', borderRadius: 16, padding: '16px 20px', color: 'white', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <TrendingUp size={20} />
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>SIP Calculator</h2>
            <p style={{ margin: 0, fontSize: 11, opacity: 0.85 }}>SIP · Step-Up SIP · Lumpsum · Wealth Growth Estimator</p>
          </div>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: 18 }}>
        {/* Mode selector */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Investment Type</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
            {([['sip', 'SIP', 'Monthly fixed'], ['stepUpSip', 'Step-Up SIP', 'Annual increase'], ['lumpsum', 'Lumpsum', 'One-time']] as const).map(([key, label, sub]) => (
              <button key={key} onClick={() => setMode(key)}
                style={{ padding: '10px 8px', border: 'none', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                  background: mode === key ? '#16a34a' : '#f8fafc', color: mode === key ? 'white' : '#475569',
                  borderRight: key !== 'lumpsum' ? '1px solid #e2e8f0' : 'none' }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{label}</div>
                <div style={{ fontSize: 9, opacity: 0.8 }}>{sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Formula badge */}
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '6px 12px', marginBottom: 14, fontSize: 10, color: '#166534', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Info size={10} />
          {mode === 'lumpsum'
            ? <span><strong>Formula:</strong> A = P × (1+r)<sup>n</sup> &nbsp;|&nbsp; P=Principal, r=Annual rate, n=Years</span>
            : <span><strong>Formula:</strong> FV = P × [(1+r)<sup>n</sup>-1] / r × (1+r) &nbsp;|&nbsp; P=Monthly, r=Monthly rate, n=Months</span>
          }
        </div>

        {/* Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: mode === 'stepUpSip' ? '1fr 1fr 1fr' : '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label style={labelStyle}>{mode === 'lumpsum' ? 'Lumpsum Amount (₹) *' : 'Monthly SIP (₹) *'}</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>₹</span>
              {mode === 'lumpsum' ? (
                <input type="text" value={lumpStr} onChange={e => setLumpStr(fmtInput(e.target.value))} placeholder="e.g. 1,00,000"
                  style={{ ...inputStyle, paddingLeft: 26 }} />
              ) : (
                <input type="text" value={monthlyStr} onChange={e => setMonthlyStr(fmtInput(e.target.value))} placeholder="e.g. 10,000"
                  style={{ ...inputStyle, paddingLeft: 26 }} />
              )}
            </div>
          </div>
          <div>
            <label style={labelStyle}>Expected Return (% p.a.) *</label>
            <input type="number" min={1} max={50} step={0.5} value={rateStr}
              onChange={e => { const v = e.target.value; if (v === '' || (Number(v) >= 0 && Number(v) <= 50)) setRateStr(v); }}
              style={inputStyle} />
          </div>
          {mode === 'stepUpSip' && (
            <div>
              <label style={labelStyle}>Annual Step-Up (%) *</label>
              <input type="number" min={1} max={50} step={1} value={stepUpStr}
                onChange={e => { const v = e.target.value; if (v === '' || (Number(v) >= 0 && Number(v) <= 50)) setStepUpStr(v); }}
                style={inputStyle} />
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Time Period (Years) *</label>
            <input type="number" min={1} max={40} value={yearsStr}
              onChange={e => { const v = e.target.value; if (v === '' || (Number(v) >= 0 && Number(v) <= 40)) setYearsStr(v); }}
              style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Inflation Rate (%) <span style={{ fontWeight: 400 }}>(for adjusted value)</span></label>
            <input type="number" min={0} max={15} step={0.5} value={inflationStr}
              onChange={e => { const v = e.target.value; if (v === '' || (Number(v) >= 0 && Number(v) <= 15)) setInflationStr(v); }}
              style={inputStyle} />
          </div>
        </div>

        {/* Results */}
        {result && (
          <div style={{ borderRadius: 14, border: '1px solid #bbf7d0', background: '#f0fdf4', padding: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px', gap: 16, marginBottom: 16 }}>
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                  {[
                    ['Total Invested', fmt(result.totalInvested), '#1e293b'],
                    ['Est. Returns', fmt(result.totalReturns), '#16a34a'],
                    ['Maturity Value', fmt(result.maturityAmount), '#7c3aed'],
                    ['Wealth Gain', `${result.effectiveReturn}%`, '#d97706'],
                  ].map(([l, v, c], i) => (
                    <div key={i} style={{ background: 'white', borderRadius: 8, padding: 10, border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase' }}>{l}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: c as string }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'white', borderRadius: 8, padding: '8px 12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#64748b' }}>Inflation-Adjusted Value</span>
                  <span style={{ fontWeight: 700, color: '#dc2626' }}>{fmt(result.inflationAdjusted)}</span>
                </div>
              </div>
              {/* Donut */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="110" height="110" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#16a34a" strokeWidth="12"
                    strokeDasharray={`${pctReturn * 2.51} ${251 - pctReturn * 2.51}`}
                    strokeDashoffset="63" strokeLinecap="round" />
                  <text x="50" y="48" textAnchor="middle" fontSize="11" fontWeight="800" fill="#16a34a">{pctReturn}%</text>
                  <text x="50" y="60" textAnchor="middle" fontSize="7" fill="#94a3b8">Returns</text>
                </svg>
                <div style={{ display: 'flex', gap: 8, marginTop: 5, fontSize: 10 }}>
                  <span><span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#e2e8f0', marginRight: 2 }} />Invested</span>
                  <span><span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#16a34a', marginRight: 2 }} />Returns</span>
                </div>
              </div>
            </div>

            {/* Year-wise growth */}
            {result.yearlyBreakdown.length > 0 && result.yearlyBreakdown.length <= 40 && (
              <div style={{ background: 'white', borderRadius: 8, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', padding: '8px 12px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Year-wise Growth</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr 1fr', fontSize: 10, fontWeight: 600, color: '#94a3b8', padding: '6px 12px', borderBottom: '1px solid #e2e8f0' }}>
                  <span>Yr</span><span style={{ textAlign: 'right' }}>Yr Invested</span><span style={{ textAlign: 'right' }}>Total Invested</span><span style={{ textAlign: 'right' }}>Value</span><span style={{ textAlign: 'right' }}>Gain</span>
                </div>
                {result.yearlyBreakdown.map((y, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr 1fr', fontSize: 11, padding: '6px 12px', borderBottom: i < result.yearlyBreakdown.length - 1 ? '1px solid #f1f5f9' : 'none', color: '#475569' }}>
                    <span style={{ fontWeight: 600 }}>{y.year}</span>
                    <span style={{ textAlign: 'right' }}>{fmt(y.invested)}</span>
                    <span style={{ textAlign: 'right' }}>{fmt(y.cumulativeInvested)}</span>
                    <span style={{ textAlign: 'right', fontWeight: 600 }}>{fmt(y.value)}</span>
                    <span style={{ textAlign: 'right', color: '#16a34a' }}>+{fmt(y.gain)}</span>
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
