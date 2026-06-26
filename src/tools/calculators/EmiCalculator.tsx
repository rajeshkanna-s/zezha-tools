import React, { useState, useMemo } from 'react';
import { CreditCard, Info } from 'lucide-react';
import './calculators.css';

// ═══ EMI Calculator — Quick EMI, Interest & Affordability ═══
// EMI = P × R × (1+R)^N / ((1+R)^N - 1)

export const EmiCalculator: React.FC = () => {
  const [amountStr, setAmountStr] = useState('5,00,000');
  const [rateStr, setRateStr] = useState('8.5');
  const [tenureStr, setTenureStr] = useState('3');
  const [timeUnit, setTimeUnit] = useState<'years' | 'months'>('years');

  const parseNum = (v: string) => { const n = parseFloat(v.replace(/,/g, '')); return isNaN(n) || n < 0 ? 0 : n; };
  const fmt = (n: number) => n.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const fmtInput = (v: string) => { let d = v.replace(/[^0-9]/g, ''); if (!d) return ''; d = d.replace(/^0+/, '') || '0'; return Number(d).toLocaleString('en-IN'); };

  const result = useMemo(() => {
    const P = parseNum(amountStr);
    const annualRate = parseFloat(rateStr);
    const tenure = parseFloat(tenureStr);
    if (!P || P < 1 || isNaN(annualRate) || annualRate <= 0 || isNaN(tenure) || tenure <= 0) return null;

    const N = Math.round(timeUnit === 'years' ? tenure * 12 : tenure);
    const R = annualRate / 12 / 100;
    const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const totalPayment = emi * N;
    const totalInterest = totalPayment - P;
    const interestPct = (totalInterest / P) * 100;

    // Affordability check: what salary needed if EMI should be < 40% of income
    const minSalary = emi / 0.4;

    return { emi: Math.round(emi), totalPayment: Math.round(totalPayment), totalInterest: Math.round(totalInterest), principal: P, months: N, interestPct: Math.round(interestPct * 10) / 10, minSalary: Math.round(minSalary) };
  }, [amountStr, rateStr, tenureStr, timeUnit]);

  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 13, background: 'white', outline: 'none', boxSizing: 'border-box' };
  const selectStyle: React.CSSProperties = { ...inputStyle };

  const pctInterest = result ? Math.round((result.totalInterest / result.totalPayment) * 100) : 0;
  const pctPrincipal = 100 - pctInterest;

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: 16 }}>
      <div style={{ background: 'linear-gradient(135deg, #059669, #047857)', borderRadius: 16, padding: '16px 20px', color: 'white', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <CreditCard size={20} />
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>EMI Calculator</h2>
            <p style={{ margin: 0, fontSize: 11, opacity: 0.85 }}>Monthly EMI · Interest Breakdown · Affordability</p>
          </div>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: 18 }}>
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10, padding: '6px 12px', marginBottom: 14, fontSize: 10, color: '#065f46', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Info size={10} /> <strong>Formula:</strong> EMI = P × R × (1+R)<sup>N</sup> / ((1+R)<sup>N</sup> - 1) &nbsp;|&nbsp; P=Principal, R=Monthly rate, N=Months
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label style={labelStyle}>Loan Amount (₹) *</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>₹</span>
              <input type="text" value={amountStr} onChange={e => setAmountStr(fmtInput(e.target.value))} placeholder="e.g. 5,00,000"
                style={{ ...inputStyle, paddingLeft: 26 }} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Interest Rate (% p.a.) *</label>
            <input type="number" min={0} max={50} step={0.1} value={rateStr}
              onChange={e => { const v = e.target.value; if (v === '' || (Number(v) >= 0 && Number(v) <= 50)) setRateStr(v); }}
              style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <label style={labelStyle}>Loan Tenure *</label>
            <input type="number" min={1} max={timeUnit === 'years' ? 30 : 360} value={tenureStr}
              onChange={e => { const v = e.target.value; if (v === '' || (Number(v) >= 0 && Number(v) <= (timeUnit === 'years' ? 30 : 360))) setTenureStr(v); }}
              style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Unit</label>
            <select style={selectStyle} value={timeUnit} onChange={e => setTimeUnit(e.target.value as any)}>
              <option value="years">Years</option><option value="months">Months</option>
            </select>
          </div>
        </div>

        {result && (
          <div style={{ borderRadius: 14, border: '1px solid #a7f3d0', background: '#f0fdf4', padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px', gap: 16, marginBottom: 10 }}>
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
                  {[['Monthly EMI', fmt(result.emi), '#059669'], ['Total Interest', fmt(result.totalInterest), '#f59e0b'], ['Total Payment', fmt(result.totalPayment), '#7c3aed']].map(([l, v, c], i) => (
                    <div key={i} style={{ background: 'white', borderRadius: 8, padding: 10, border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase' }}>{l}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: c as string }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div style={{ background: 'white', borderRadius: 8, padding: '6px 10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: 10 }}>
                    <span style={{ color: '#64748b' }}>Interest Cost</span>
                    <span style={{ fontWeight: 700, color: '#f59e0b' }}>{result.interestPct}% of loan</span>
                  </div>
                  <div style={{ background: 'white', borderRadius: 8, padding: '6px 10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: 10 }}>
                    <span style={{ color: '#64748b' }}>Min. Salary (40% DTI)</span>
                    <span style={{ fontWeight: 700, color: '#059669' }}>{fmt(result.minSalary)}/mo</span>
                  </div>
                </div>
              </div>
              {/* Donut */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="110" height="110" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#059669" strokeWidth="12" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="12"
                    strokeDasharray={`${pctInterest * 2.51} ${251 - pctInterest * 2.51}`}
                    strokeDashoffset="63" strokeLinecap="round" />
                  <text x="50" y="48" textAnchor="middle" fontSize="10" fontWeight="800" fill="#1e293b">{pctPrincipal}%</text>
                  <text x="50" y="59" textAnchor="middle" fontSize="7" fill="#94a3b8">Principal</text>
                </svg>
                <div style={{ display: 'flex', gap: 8, marginTop: 5, fontSize: 9 }}>
                  <span><span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#059669', marginRight: 2 }} />Principal</span>
                  <span><span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', marginRight: 2 }} />Interest</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
