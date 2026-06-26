import React, { useState, useMemo } from 'react';
import { Home, Info } from 'lucide-react';
import './calculators.css';

// ═══ LTV Calculator — Loan-to-Value Ratio ═══
// LTV = (Loan Amount / Property Value) × 100
// RBI Guidelines for Home Loans:
//   ≤ ₹30L → 90% LTV, ₹30-75L → 80% LTV, > ₹75L → 75% LTV

export const LtvCalculator: React.FC = () => {
  const [propertyStr, setPropertyStr] = useState('50,00,000');
  const [loanStr, setLoanStr] = useState('40,00,000');
  const [downStr, setDownStr] = useState('');

  const parseNum = (v: string) => { const n = parseFloat(v.replace(/,/g, '')); return isNaN(n) || n < 0 ? 0 : n; };
  const fmt = (n: number) => n.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const fmtInput = (v: string) => { let d = v.replace(/[^0-9]/g, ''); if (!d) return ''; d = d.replace(/^0+/, '') || '0'; return Number(d).toLocaleString('en-IN'); };

  const result = useMemo(() => {
    const propertyValue = parseNum(propertyStr);
    if (!propertyValue || propertyValue < 1) return null;

    const loanAmount = parseNum(loanStr);
    const downPayment = parseNum(downStr);

    // If loan is 0 but down payment given, derive loan
    let effectiveLoan = loanAmount;
    if (!loanAmount && downPayment > 0) effectiveLoan = Math.max(propertyValue - downPayment, 0);

    const ltv = (effectiveLoan / propertyValue) * 100;
    const effectiveDown = propertyValue - effectiveLoan;

    // Risk assessment
    const risk = ltv < 60 ? 'Very Low Risk' : ltv < 75 ? 'Low Risk' : ltv <= 80 ? 'Normal' : ltv <= 90 ? 'Higher Risk' : 'Very High Risk';
    const riskColor = ltv < 60 ? '#059669' : ltv < 75 ? '#16a34a' : ltv <= 80 ? '#d97706' : ltv <= 90 ? '#ea580c' : '#dc2626';
    const riskEmoji = ltv < 60 ? '✅' : ltv < 75 ? '👍' : ltv <= 80 ? '⚠️' : ltv <= 90 ? '🔶' : '❌';

    // RBI guideline LTV limit
    const rbiLimit = propertyValue <= 3000000 ? 90 : propertyValue <= 7500000 ? 80 : 75;
    const rbiMaxLoan = Math.round(propertyValue * rbiLimit / 100);
    const rbiMinDown = propertyValue - rbiMaxLoan;
    const withinRbi = ltv <= rbiLimit;

    return {
      propertyValue, effectiveLoan, effectiveDown, ltv: Math.round(ltv * 100) / 100,
      risk, riskColor, riskEmoji, rbiLimit, rbiMaxLoan, rbiMinDown, withinRbi
    };
  }, [propertyStr, loanStr, downStr]);

  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 13, background: 'white', outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: 16 }}>
      <div style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', borderRadius: 16, padding: '16px 20px', color: 'white', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Home size={20} />
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>LTV Calculator</h2>
            <p style={{ margin: 0, fontSize: 11, opacity: 0.85 }}>Loan-to-Value Ratio · RBI Guidelines · Risk Assessment</p>
          </div>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: 18 }}>
        <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 10, padding: '6px 12px', marginBottom: 14, fontSize: 10, color: '#5b21b6', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Info size={10} /> <strong>Formula:</strong> LTV = (Loan / Property Value) × 100 &nbsp;|&nbsp; RBI: ≤30L→90%, 30-75L→80%, 75L+→75%
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label style={labelStyle}>Property Market Value (₹) *</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>₹</span>
              <input type="text" value={propertyStr} onChange={e => setPropertyStr(fmtInput(e.target.value))} placeholder="e.g. 50,00,000"
                style={{ ...inputStyle, paddingLeft: 26 }} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Loan Amount (₹)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>₹</span>
              <input type="text" value={loanStr} onChange={e => setLoanStr(fmtInput(e.target.value))} placeholder="e.g. 40,00,000"
                style={{ ...inputStyle, paddingLeft: 26 }} />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Down Payment (₹) <span style={{ fontWeight: 400, fontSize: 9 }}>(auto-calculates loan if loan=0)</span></label>
          <div style={{ position: 'relative', maxWidth: '48%' }}>
            <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>₹</span>
            <input type="text" value={downStr} onChange={e => setDownStr(fmtInput(e.target.value))} placeholder="Optional"
              style={{ ...inputStyle, paddingLeft: 26 }} />
          </div>
        </div>

        {result && (
          <div style={{ borderRadius: 14, border: `2px solid ${result.riskColor}20`, background: `${result.riskColor}08`, padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
              {[
                ['Property Value', fmt(result.propertyValue), '#1e293b'],
                ['Loan Amount', fmt(result.effectiveLoan), '#7c3aed'],
                ['LTV Ratio', `${result.ltv}%`, result.riskColor],
              ].map(([l, v, c], i) => (
                <div key={i} style={{ background: 'white', borderRadius: 8, padding: 10, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase' }}>{l}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: c as string }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
              <div style={{ background: 'white', borderRadius: 8, padding: '8px 12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase' }}>Risk Assessment</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: result.riskColor }}>{result.riskEmoji} {result.risk}</div>
              </div>
              <div style={{ background: 'white', borderRadius: 8, padding: '8px 12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase' }}>Down Payment</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{fmt(result.effectiveDown)} ({(100 - result.ltv).toFixed(1)}%)</div>
              </div>
            </div>

            {/* RBI Guidelines */}
            <div style={{ background: 'white', borderRadius: 8, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', padding: '8px 12px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                <span>RBI Home Loan Guidelines</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: result.withinRbi ? '#059669' : '#dc2626' }}>
                  {result.withinRbi ? '✅ Within Limit' : '❌ Exceeds Limit'}
                </span>
              </div>
              <div style={{ padding: '8px 12px', fontSize: 11 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 8 }}>
                  {[['≤ ₹30 Lakh', '90%', 3000000], ['₹30L - ₹75L', '80%', 7500000], ['> ₹75 Lakh', '75%', Infinity]].map(([range, limit, _], i) => (
                    <div key={i} style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #e2e8f0',
                      background: result.rbiLimit === parseInt(limit as string) ? '#f0fdf4' : '#f8fafc' }}>
                      <div style={{ fontSize: 9, color: '#94a3b8' }}>{range as string}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: result.rbiLimit === parseInt(limit as string) ? '#059669' : '#64748b' }}>Max {limit as string}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                    <span>Max Eligible Loan ({result.rbiLimit}%)</span>
                    <span style={{ fontWeight: 700 }}>{fmt(result.rbiMaxLoan)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                    <span>Min Down Payment Required</span>
                    <span style={{ fontWeight: 700 }}>{fmt(result.rbiMinDown)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* LTV Scale */}
            <div style={{ marginTop: 10, background: 'white', borderRadius: 8, padding: '8px 12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 9, color: '#64748b', fontWeight: 600, marginBottom: 6 }}>LTV SCALE</div>
              <div style={{ position: 'relative', height: 8, borderRadius: 4, background: 'linear-gradient(to right, #059669 0%, #16a34a 60%, #d97706 75%, #ea580c 90%, #dc2626 100%)' }}>
                <div style={{ position: 'absolute', left: `${Math.min(result.ltv, 100)}%`, top: -4, width: 3, height: 16, background: '#1e293b', borderRadius: 2, transform: 'translateX(-50%)' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, color: '#94a3b8', marginTop: 3 }}>
                <span>0%</span><span>60%</span><span>75%</span><span>80%</span><span>90%</span><span>100%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
