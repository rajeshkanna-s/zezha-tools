import React, { useState, useMemo } from 'react';
import { CreditCard, Info } from 'lucide-react';
import './calculators.css';

// ═══ EMI Calculator — Quick EMI, Interest & Affordability ═══
// EMI = P × R × (1+R)^N / ((1+R)^N - 1)

interface AmortRow { period: number; emi: number; interest: number; principal: number; balance: number }

function solveInterestRate(P: number, N: number, E: number): number {
  if (E <= P / N) return 0;
  let low = 0.0001, high = 500, mid = 0;
  const maxIterations = 50;
  for (let i = 0; i < maxIterations; i++) {
    mid = (low + high) / 2;
    const R = mid / 12 / 100;
    const computedEmi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    if (computedEmi > E) {
      high = mid;
    } else {
      low = mid;
    }
  }
  return mid;
}

export const EmiCalculator: React.FC = () => {
  const [calcMode, setCalcMode] = useState<'loanToEmi' | 'emiToLoan' | 'emiToRate'>('loanToEmi');
  const [amountStr, setAmountStr] = useState('5,00,000');
  const [emiStr, setEmiStr] = useState('20,000');
  const [emiType, setEmiType] = useState<'monthly' | 'yearly'>('monthly');
  const [rateStr, setRateStr] = useState('8.5');
  const [tenureStr, setTenureStr] = useState('3');
  const [timeUnit, setTimeUnit] = useState<'years' | 'months'>('years');
  const [view, setView] = useState<'yearly' | 'monthly'>('yearly');
  const [activeModal, setActiveModal] = useState<'emi' | 'interest' | 'payment' | null>(null);

  const parseNum = (v: string) => { const n = parseFloat(v.replace(/,/g, '')); return isNaN(n) || n < 0 ? 0 : n; };
  const fmt = (n: number) => n.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const fmtInput = (v: string, maxVal = 1000000000) => {
    let d = v.replace(/[^0-9]/g, '');
    if (!d) return '';
    d = d.replace(/^0+/, '') || '0';
    let val = Number(d);
    if (val > maxVal) val = maxVal;
    return val.toLocaleString('en-IN');
  };

  const result = useMemo(() => {
    const tenure = parseFloat(tenureStr);
    if (isNaN(tenure) || tenure <= 0) return null;
    const N = Math.round(timeUnit === 'years' ? tenure * 12 : tenure);

    let P = 0;
    let emi = 0;
    let annualRate = 0;

    if (calcMode === 'loanToEmi') {
      annualRate = parseFloat(rateStr);
      if (isNaN(annualRate) || annualRate <= 0) return null;
      P = parseNum(amountStr);
      if (!P || P < 1) return null;
      const R = annualRate / 12 / 100;
      emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    } else if (calcMode === 'emiToLoan') {
      annualRate = parseFloat(rateStr);
      if (isNaN(annualRate) || annualRate <= 0) return null;
      const inputEmi = parseNum(emiStr);
      if (!inputEmi || inputEmi < 1) return null;
      emi = emiType === 'monthly' ? inputEmi : inputEmi / 12;
      const R = annualRate / 12 / 100;
      P = (emi * (Math.pow(1 + R, N) - 1)) / (R * Math.pow(1 + R, N));
    } else { // emiToRate
      P = parseNum(amountStr);
      const inputEmi = parseNum(emiStr);
      if (!P || P < 1 || !inputEmi || inputEmi < 1) return null;
      emi = inputEmi;
      if (emi <= P / N) {
        return {
          emi: Math.round(emi),
          totalPayment: 0,
          totalInterest: 0,
          principal: P,
          months: N,
          rate: 0,
          interestPct: 0,
          minSalary: 0,
          monthly: [],
          yearly: [],
          error: `EMI must be greater than ₹${Math.ceil(P / N).toLocaleString('en-IN')}/mo to cover the principal.`
        };
      }
      annualRate = solveInterestRate(P, N, emi);
    }

    const R = annualRate / 12 / 100;
    const roundedEmi = Math.round(emi);
    const totalPayment = roundedEmi * N;
    const totalInterest = totalPayment - P;
    const interestPct = (totalInterest / P) * 100;
    const minSalary = roundedEmi / 0.4;

    // Build amortization
    let balance = P;
    const monthly: AmortRow[] = [];
    const yearly: AmortRow[] = [];
    let yrInt = 0, yrPrin = 0, yrEmi = 0;

    for (let i = 1; i <= N; i++) {
      const intPaid = balance * R;
      let prinPaid = emi - intPaid;
      if (i === N) prinPaid = balance;
      balance = Math.max(balance - prinPaid, 0);
      monthly.push({ period: i, emi: Math.round(intPaid + prinPaid), interest: Math.round(intPaid), principal: Math.round(prinPaid), balance: Math.round(balance) });

      yrInt += intPaid; yrPrin += prinPaid; yrEmi += intPaid + prinPaid;
      if (i % 12 === 0 || i === N) {
        yearly.push({ period: Math.ceil(i / 12), emi: Math.round(yrEmi), interest: Math.round(yrInt), principal: Math.round(yrPrin), balance: Math.round(balance) });
        yrInt = 0; yrPrin = 0; yrEmi = 0;
      }
    }

    return { 
      emi: Math.round(emi), 
      totalPayment: Math.round(totalPayment), 
      totalInterest: Math.round(totalInterest), 
      principal: Math.round(P), 
      months: N, 
      rate: Math.round(annualRate * 100) / 100, 
      interestPct: Math.round(interestPct * 10) / 10, 
      minSalary: Math.round(minSalary), 
      monthly, 
      yearly 
    };
  }, [calcMode, amountStr, emiStr, emiType, rateStr, tenureStr, timeUnit]);

  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 13, background: 'white', outline: 'none', boxSizing: 'border-box' };
  const selectStyle: React.CSSProperties = { ...inputStyle };

  const pctInterest = result ? Math.round((result.totalInterest / result.totalPayment) * 100) : 0;
  const pctPrincipal = 100 - pctInterest;

  const rows = result ? (view === 'yearly' ? result.yearly : result.monthly) : [];
  const showTable = rows.length > 0 && rows.length <= 360;

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
        {/* Calc Mode Toggles */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, borderBottom: '1px solid #e2e8f0', paddingBottom: 10, overflowX: 'auto' }}>
          {[
            ['loanToEmi', 'Calculate EMI'],
            ['emiToRate', 'Calculate Interest Rate'],
            ['emiToLoan', 'Calculate Loan Amount']
          ].map(([mode, label]) => (
            <button
              key={mode}
              onClick={() => setCalcMode(mode as any)}
              style={{
                padding: '8px 16px',
                fontSize: 12,
                fontWeight: 700,
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                background: calcMode === mode ? '#059669' : '#f1f5f9',
                color: calcMode === mode ? 'white' : '#475569',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              {label}
            </button>
          ))}
        </div>



        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          {calcMode === 'loanToEmi' ? (
            <>
              <div>
                <label style={labelStyle}>Loan Amount (₹) *</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>₹</span>
                  <input type="text" value={amountStr} onChange={e => setAmountStr(fmtInput(e.target.value, 1000000000))} placeholder="e.g. 5,00,000"
                    style={{ ...inputStyle, paddingLeft: 26 }} />
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  step="50000"
                  value={Math.min(parseNum(amountStr), 10000000)}
                  onChange={e => setAmountStr(Number(e.target.value).toLocaleString('en-IN'))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 mt-2"
                />
              </div>
              <div>
                <label style={labelStyle}>Interest Rate (% p.a.) *</label>
                <input type="number" min={0} max={99} step={0.1} value={rateStr}
                  onChange={e => { const v = e.target.value; if (v === '' || (Number(v) >= 0 && Number(v) <= 99)) setRateStr(v); }}
                  style={inputStyle} />
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="0.1"
                  value={Math.min(parseFloat(rateStr) || 0, 30)}
                  onChange={e => setRateStr(e.target.value)}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 mt-2"
                />
              </div>
            </>
          ) : calcMode === 'emiToLoan' ? (
            <>
              <div>
                <label style={labelStyle}>EMI Amount (₹) *</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>₹</span>
                  <input type="text" value={emiStr} onChange={e => setEmiStr(fmtInput(e.target.value, 1000000000))} placeholder="e.g. 20,000"
                    style={{ ...inputStyle, paddingLeft: 26 }} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>EMI Period</label>
                <select style={selectStyle} value={emiType} onChange={e => setEmiType(e.target.value as any)}>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label style={labelStyle}>Loan Amount (₹) *</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>₹</span>
                  <input type="text" value={amountStr} onChange={e => setAmountStr(fmtInput(e.target.value, 1000000000))} placeholder="e.g. 5,00,000"
                    style={{ ...inputStyle, paddingLeft: 26 }} />
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  step="50000"
                  value={Math.min(parseNum(amountStr), 10000000)}
                  onChange={e => setAmountStr(Number(e.target.value).toLocaleString('en-IN'))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 mt-2"
                />
              </div>
              <div>
                <label style={labelStyle}>EMI Amount (₹) *</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>₹</span>
                  <input type="text" value={emiStr} onChange={e => setEmiStr(fmtInput(e.target.value, 1000000000))} placeholder="e.g. 20,000"
                    style={{ ...inputStyle, paddingLeft: 26 }} />
                </div>
              </div>
            </>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          {calcMode === 'loanToEmi' ? (
            <>
              <div>
                <label style={labelStyle}>Loan Tenure *</label>
                <input type="number" min={1} max={timeUnit === 'years' ? 100 : 1200} value={tenureStr}
                  onChange={e => { const v = e.target.value; const maxT = timeUnit === 'years' ? 100 : 1200; if (v === '' || (Number(v) >= 0 && Number(v) <= maxT)) setTenureStr(v); }}
                  style={inputStyle} />
                <input
                  type="range"
                  min="1"
                  max={timeUnit === 'years' ? 30 : 360}
                  step="1"
                  value={Math.min(parseFloat(tenureStr) || 0, timeUnit === 'years' ? 30 : 360)}
                  onChange={e => setTenureStr(e.target.value)}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 mt-2"
                />
              </div>
              <div>
                <label style={labelStyle}>Unit</label>
                <select style={selectStyle} value={timeUnit} onChange={e => setTimeUnit(e.target.value as any)}>
                  <option value="years">Years</option><option value="months">Months</option>
                </select>
              </div>
            </>
          ) : calcMode === 'emiToLoan' ? (
            <>
              <div>
                <label style={labelStyle}>Interest Rate (% p.a.) *</label>
                <input type="number" min={0} max={99} step={0.1} value={rateStr}
                  onChange={e => { const v = e.target.value; if (v === '' || (Number(v) >= 0 && Number(v) <= 99)) setRateStr(v); }}
                  style={inputStyle} />
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="0.1"
                  value={Math.min(parseFloat(rateStr) || 0, 30)}
                  onChange={e => setRateStr(e.target.value)}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 mt-2"
                />
              </div>
              <div>
                <label style={labelStyle}>Loan Tenure *</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="number" min={1} max={timeUnit === 'years' ? 100 : 1200} value={tenureStr}
                    onChange={e => { const v = e.target.value; const maxT = timeUnit === 'years' ? 100 : 1200; if (v === '' || (Number(v) >= 0 && Number(v) <= maxT)) setTenureStr(v); }}
                    style={{ ...inputStyle, flex: 2 }} />
                  <select style={{ ...selectStyle, flex: 1 }} value={timeUnit} onChange={e => setTimeUnit(e.target.value as any)}>
                    <option value="years">Years</option><option value="months">Months</option>
                  </select>
                </div>
                <input
                  type="range"
                  min="1"
                  max={timeUnit === 'years' ? 30 : 360}
                  step="1"
                  value={Math.min(parseFloat(tenureStr) || 0, timeUnit === 'years' ? 30 : 360)}
                  onChange={e => setTenureStr(e.target.value)}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 mt-2"
                />
              </div>
            </>
          ) : (
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Loan Tenure *</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="number" min={1} max={timeUnit === 'years' ? 100 : 1200} value={tenureStr}
                  onChange={e => { const v = e.target.value; const maxT = timeUnit === 'years' ? 100 : 1200; if (v === '' || (Number(v) >= 0 && Number(v) <= maxT)) setTenureStr(v); }}
                  style={{ ...inputStyle, flex: 2 }} />
                <select style={{ ...selectStyle, flex: 1 }} value={timeUnit} onChange={e => setTimeUnit(e.target.value as any)}>
                  <option value="years">Years</option><option value="months">Months</option>
                </select>
              </div>
              <input
                type="range"
                min="1"
                max={timeUnit === 'years' ? 30 : 360}
                step="1"
                value={Math.min(parseFloat(tenureStr) || 0, timeUnit === 'years' ? 30 : 360)}
                onChange={e => setTenureStr(e.target.value)}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 mt-2"
              />
            </div>
          )}
        </div>

        {result && result.error && (
          <div style={{ borderRadius: 14, border: '1px solid #f87171', background: '#fef2f2', padding: 16, color: '#991b1b', fontSize: 12, fontWeight: 600, marginTop: 14 }}>
            ⚠️ {result.error}
          </div>
        )}

        {result && !result.error && (
          <div style={{ borderRadius: 14, border: '1px solid #a7f3d0', background: '#f0fdf4', padding: 16, marginTop: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px', gap: 16, marginBottom: 10 }}>
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
                  {[
                    [
                      calcMode === 'loanToEmi' ? 'Monthly EMI' : calcMode === 'emiToLoan' ? 'Loan Amount' : 'Interest Rate',
                      calcMode === 'loanToEmi' ? fmt(result.emi) : calcMode === 'emiToLoan' ? fmt(result.principal) : `${result.rate}% p.a.`,
                      '#059669',
                      'emi' as const
                    ],
                    ['Total Interest', fmt(result.totalInterest), '#f59e0b', 'interest' as const],
                    ['Total Payment', fmt(result.totalPayment), '#7c3aed', 'payment' as const]
                  ].map(([l, v, c, type], i) => (
                    <div key={i}
                      onClick={() => setActiveModal(type as any)}
                      style={{
                        background: 'white',
                        borderRadius: 8,
                        padding: 10,
                        border: '1px solid #e2e8f0',
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                        e.currentTarget.style.borderColor = c as string;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                      }}
                    >
                      <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{l}</span>
                        <span style={{ fontSize: 8, color: '#94a3b8', opacity: 0.6 }}>🔍 Details</span>
                      </div>
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
            {/* Amortization Table */}
            {showTable && (
              <div style={{ background: 'white', borderRadius: 8, border: '1px solid #e2e8f0', overflow: 'hidden', marginTop: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>Amortization Schedule</span>
                  <div style={{ display: 'flex', gap: 0, border: '1px solid #e2e8f0', borderRadius: 6, overflow: 'hidden' }}>
                    {(['yearly', 'monthly'] as const).map(v => (
                      <button key={v} onClick={() => setView(v)}
                        style={{ padding: '3px 10px', fontSize: 9, fontWeight: 600, border: 'none', cursor: 'pointer',
                          background: view === v ? '#059669' : 'white', color: view === v ? 'white' : '#64748b' }}>
                        {v === 'yearly' ? 'Yearly' : 'Monthly'}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 1fr 1fr', minWidth: 460, fontSize: 10, fontWeight: 600, color: '#94a3b8', padding: '6px 12px', borderBottom: '1px solid #e2e8f0' }}>
                    <span>{view === 'yearly' ? 'Yr' : 'Mo'}</span><span style={{ textAlign: 'right' }}>EMI</span><span style={{ textAlign: 'right' }}>Interest</span><span style={{ textAlign: 'right' }}>Principal</span><span style={{ textAlign: 'right' }}>Balance</span>
                  </div>
                  <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                    {rows.map((r, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 1fr 1fr', minWidth: 460, fontSize: 11, padding: '6px 12px', borderBottom: i < rows.length - 1 ? '1px solid #f1f5f9' : 'none', color: '#475569' }}>
                        <span style={{ fontWeight: 700 }}>{r.period}</span>
                        <span style={{ textAlign: 'right' }}>{fmt(r.emi)}</span>
                        <span style={{ textAlign: 'right', color: '#f59e0b' }}>{fmt(r.interest)}</span>
                        <span style={{ textAlign: 'right', color: '#10b981' }}>{fmt(r.principal)}</span>
                        <span style={{ textAlign: 'right', fontWeight: 700 }}>{fmt(r.balance)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {activeModal && result && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 16
        }} onClick={() => setActiveModal(null)}>
          <div style={{
            background: 'white',
            borderRadius: 16,
            width: '100%',
            maxWidth: 360,
            maxHeight: 'calc(100vh - 32px)',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
          }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #059669, #047857)',
              padding: '16px 20px',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexShrink: 0
            }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>
                {activeModal === 'emi' ? 'Equated Installment Breakdown' : activeModal === 'interest' ? 'Interest Paid Breakdown' : 'Total Payment Breakdown'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: 'pointer',
                  opacity: 0.8
                }}
              >
                ✕
              </button>
            </div>
            {/* List */}
            <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
              {(() => {
                let baseVal = 0;
                if (activeModal === 'emi') {
                  baseVal = result.emi;
                } else if (activeModal === 'interest') {
                  baseVal = result.totalInterest;
                } else {
                  baseVal = result.totalPayment;
                }

                const isEmi = activeModal === 'emi';
                const totalDays = (result.months / 12) * 365;
                const daily = isEmi ? (baseVal * 12) / 365 : baseVal / totalDays;
                const weekly = daily * 7;
                const monthly = isEmi ? baseVal : baseVal / result.months;
                const quarterly = monthly * 3;
                const halfly = monthly * 6;
                const yearly = monthly * 12;

                const items: [string, number, boolean][] = isEmi ? [
                  ['Daily (Per Day)', daily, true],
                  ['Weekly', weekly, true]
                ] : [
                  ['Daily (Per Day)', daily, true],
                  ['Weekly', weekly, true],
                  ['Monthly', monthly, false],
                  ['Quarterly', quarterly, false],
                  ['Half-Yearly (Halfly)', halfly, false],
                  ['Yearly', yearly, false]
                ];

                const fmtD = (n: number) => n.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 });

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {items.map(([label, val, isDecimal], idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingBottom: idx < items.length - 1 ? 10 : 0,
                        borderBottom: idx < items.length - 1 ? '1px solid #f1f5f9' : 'none'
                      }}>
                        <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{label}</span>
                        <span style={{ fontSize: 13, color: '#1e293b', fontWeight: 700 }}>
                          {isDecimal ? fmtD(val) : fmt(Math.round(val))}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
            {/* Footer */}
            <div style={{
              background: '#f8fafc',
              padding: '12px 20px',
              textAlign: 'right',
              borderTop: '1px solid #e2e8f0',
              flexShrink: 0
            }}>
              <button
                onClick={() => setActiveModal(null)}
                style={{
                  background: '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  padding: '6px 16px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
