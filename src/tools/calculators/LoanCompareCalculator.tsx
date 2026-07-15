import React, { useState, useMemo } from 'react';
import { Landmark, GitCompare, Info } from 'lucide-react';
import './calculators.css';

interface LoanConfig {
  amountStr: string;
  rateStr: string;
  tenureStr: string;
  timeUnit: 'years' | 'months';
}

export const LoanCompareCalculator: React.FC = () => {
  const [loanA, setLoanA] = useState<LoanConfig>({
    amountStr: '10,00,000',
    rateStr: '8.5',
    tenureStr: '5',
    timeUnit: 'years'
  });

  const [loanB, setLoanB] = useState<LoanConfig>({
    amountStr: '10,00,000',
    rateStr: '9.0',
    tenureStr: '5',
    timeUnit: 'years'
  });

  const parseNum = (v: string) => {
    const n = parseFloat(v.replace(/,/g, ''));
    return isNaN(n) || n < 0 ? 0 : n;
  };

  const fmt = (n: number) =>
    n.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });

  const fmtInput = (v: string, maxVal = 1000000000) => {
    let d = v.replace(/[^0-9]/g, '');
    if (!d) return '';
    d = d.replace(/^0+/, '') || '0';
    let val = Number(d);
    if (val > maxVal) val = maxVal;
    return val.toLocaleString('en-IN');
  };

  const calculateLoan = (cfg: LoanConfig) => {
    const P = parseNum(cfg.amountStr);
    const annualRate = parseFloat(cfg.rateStr);
    const tenure = parseFloat(cfg.tenureStr);

    if (P <= 0 || isNaN(annualRate) || annualRate < 0 || isNaN(tenure) || tenure <= 0) {
      return null;
    }

    const N = Math.round(cfg.timeUnit === 'years' ? tenure * 12 : tenure);
    if (N <= 0) return null;

    let emi = 0;
    if (annualRate === 0) {
      emi = P / N;
    } else {
      const R = annualRate / 12 / 100;
      emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    }

    const roundedEmi = Math.round(emi);
    const totalPayment = roundedEmi * N;
    const totalInterest = Math.max(totalPayment - P, 0);

    return {
      emi: roundedEmi,
      totalPayment,
      totalInterest,
      principal: P,
      months: N,
      rate: annualRate
    };
  };

  const resA = useMemo(() => calculateLoan(loanA), [loanA]);
  const resB = useMemo(() => calculateLoan(loanB), [loanB]);

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 11,
    fontWeight: 700,
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 4
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: 10,
    fontSize: 13,
    background: 'white',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const selectStyle: React.CSSProperties = { ...inputStyle };

  // Difference calculations
  const difference = useMemo(() => {
    if (!resA || !resB) return null;
    return {
      emi: resA.emi - resB.emi,
      interest: resA.totalInterest - resB.totalInterest,
      payment: resA.totalPayment - resB.totalPayment
    };
  }, [resA, resB]);

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 16 }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #4f46e5, #3730a3)', borderRadius: 16, padding: '16px 20px', color: 'white', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <GitCompare size={20} />
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Loan Compare Calculator</h2>
            <p style={{ margin: 0, fontSize: 11, opacity: 0.85 }}>Compare two loan offers side-by-side instantly</p>
          </div>
        </div>
      </div>

      {/* Dual Inputs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 16 }}>
        {/* Option A */}
        <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, borderBottom: '2px solid #3b82f6', paddingBottom: 6 }}>
            <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: '#3b82f6' }} />
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1e293b' }}>Loan Option 1</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>Loan Amount (₹) *</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>₹</span>
                <input
                  type="text"
                  value={loanA.amountStr}
                  onChange={e => setLoanA({ ...loanA, amountStr: fmtInput(e.target.value, 1000000000) })}
                  placeholder="e.g. 10,00,000"
                  style={{ ...inputStyle, paddingLeft: 26 }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="10000000"
                step="50000"
                value={Math.min(parseNum(loanA.amountStr), 10000000)}
                onChange={e => setLoanA({ ...loanA, amountStr: Number(e.target.value).toLocaleString('en-IN') })}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={labelStyle}>Interest Rate (% p.a.) *</label>
                <input
                  type="number"
                  min={0}
                  max={99}
                  step={0.1}
                  value={loanA.rateStr}
                  onChange={e => {
                    const v = e.target.value;
                    if (v === '' || (Number(v) >= 0 && Number(v) <= 99)) {
                      setLoanA({ ...loanA, rateStr: v });
                    }
                  }}
                  style={inputStyle}
                />
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="0.1"
                  value={Math.min(parseFloat(loanA.rateStr) || 0, 30)}
                  onChange={e => setLoanA({ ...loanA, rateStr: e.target.value })}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
                />
              </div>

              <div>
                <label style={labelStyle}>Loan Tenure *</label>
                <input
                  type="number"
                  min={1}
                  max={loanA.timeUnit === 'years' ? 100 : 1200}
                  value={loanA.tenureStr}
                  onChange={e => {
                    const v = e.target.value;
                    const maxT = loanA.timeUnit === 'years' ? 100 : 1200;
                    if (v === '' || (Number(v) >= 0 && Number(v) <= maxT)) {
                      setLoanA({ ...loanA, tenureStr: v });
                    }
                  }}
                  style={inputStyle}
                />
                <input
                  type="range"
                  min="1"
                  max={loanA.timeUnit === 'years' ? 30 : 360}
                  step="1"
                  value={Math.min(parseFloat(loanA.tenureStr) || 0, loanA.timeUnit === 'years' ? 30 : 360)}
                  onChange={e => setLoanA({ ...loanA, tenureStr: e.target.value })}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Tenure Unit</label>
              <select
                style={selectStyle}
                value={loanA.timeUnit}
                onChange={e => setLoanA({ ...loanA, timeUnit: e.target.value as any })}
              >
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>
        </div>

        {/* Option B */}
        <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, borderBottom: '2px solid #8b5cf6', paddingBottom: 6 }}>
            <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: '#8b5cf6' }} />
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1e293b' }}>Loan Option 2</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>Loan Amount (₹) *</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>₹</span>
                <input
                  type="text"
                  value={loanB.amountStr}
                  onChange={e => setLoanB({ ...loanB, amountStr: fmtInput(e.target.value, 1000000000) })}
                  placeholder="e.g. 10,00,000"
                  style={{ ...inputStyle, paddingLeft: 26 }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="10000000"
                step="50000"
                value={Math.min(parseNum(loanB.amountStr), 10000000)}
                onChange={e => setLoanB({ ...loanB, amountStr: Number(e.target.value).toLocaleString('en-IN') })}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600 mt-2"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={labelStyle}>Interest Rate (% p.a.) *</label>
                <input
                  type="number"
                  min={0}
                  max={99}
                  step={0.1}
                  value={loanB.rateStr}
                  onChange={e => {
                    const v = e.target.value;
                    if (v === '' || (Number(v) >= 0 && Number(v) <= 99)) {
                      setLoanB({ ...loanB, rateStr: v });
                    }
                  }}
                  style={inputStyle}
                />
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="0.1"
                  value={Math.min(parseFloat(loanB.rateStr) || 0, 30)}
                  onChange={e => setLoanB({ ...loanB, rateStr: e.target.value })}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600 mt-2"
                />
              </div>

              <div>
                <label style={labelStyle}>Loan Tenure *</label>
                <input
                  type="number"
                  min={1}
                  max={loanB.timeUnit === 'years' ? 100 : 1200}
                  value={loanB.tenureStr}
                  onChange={e => {
                    const v = e.target.value;
                    const maxT = loanB.timeUnit === 'years' ? 100 : 1200;
                    if (v === '' || (Number(v) >= 0 && Number(v) <= maxT)) {
                      setLoanB({ ...loanB, tenureStr: v });
                    }
                  }}
                  style={inputStyle}
                />
                <input
                  type="range"
                  min="1"
                  max={loanB.timeUnit === 'years' ? 30 : 360}
                  step="1"
                  value={Math.min(parseFloat(loanB.tenureStr) || 0, loanB.timeUnit === 'years' ? 30 : 360)}
                  onChange={e => setLoanB({ ...loanB, tenureStr: e.target.value })}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600 mt-2"
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Tenure Unit</label>
              <select
                style={selectStyle}
                value={loanB.timeUnit}
                onChange={e => setLoanB({ ...loanB, timeUnit: e.target.value as any })}
              >
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Analysis Section */}
      {resA && resB && difference && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Savings Highlight Banner */}
          <div
            style={{
              borderRadius: 14,
              border: '1px solid #bfdbfe',
              background: '#eff6ff',
              padding: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}
          >
            <Info size={22} className="text-blue-600 shrink-0" />
            <div style={{ fontSize: 13, color: '#1e3a8a', fontWeight: 600 }}>
              {difference.payment === 0 ? (
                <span>Both loan offers cost exactly the same in total payment.</span>
              ) : difference.payment < 0 ? (
                <span>
                  Option 1 is cheaper! It will save you <span style={{ color: '#059669', fontWeight: 800 }}>{fmt(Math.abs(difference.payment))}</span> in total payments and <span style={{ color: '#059669', fontWeight: 800 }}>{fmt(Math.abs(difference.interest))}</span> in interest compared to Option 2.
                </span>
              ) : (
                <span>
                  Option 2 is cheaper! It will save you <span style={{ color: '#059669', fontWeight: 800 }}>{fmt(Math.abs(difference.payment))}</span> in total payments and <span style={{ color: '#059669', fontWeight: 800 }}>{fmt(Math.abs(difference.interest))}</span> in interest compared to Option 1.
                </span>
              )}
            </div>
          </div>

          {/* Comparison Metrics Grid */}
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: 18, overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr 1fr 1fr', minWidth: 550, borderBottom: '2px solid #f1f5f9', paddingBottom: 8, fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
              <span>Comparison Metric</span>
              <span style={{ textAlign: 'right', color: '#3b82f6' }}>Option 1</span>
              <span style={{ textAlign: 'right', color: '#8b5cf6' }}>Option 2</span>
              <span style={{ textAlign: 'right', color: '#475569' }}>Difference</span>
            </div>

            {/* Monthly EMI */}
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr 1fr 1fr', minWidth: 550, borderBottom: '1px solid #f1f5f9', padding: '12px 0', fontSize: 13, alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: '#334155' }}>Monthly EMI</span>
              <span style={{ textAlign: 'right', fontWeight: 700, color: '#1e293b' }}>{fmt(resA.emi)}</span>
              <span style={{ textAlign: 'right', fontWeight: 700, color: '#1e293b' }}>{fmt(resB.emi)}</span>
              <span style={{ textAlign: 'right', fontWeight: 700, color: difference.emi < 0 ? '#059669' : difference.emi > 0 ? '#dc2626' : '#64748b' }}>
                {difference.emi === 0 ? '-' : `${difference.emi < 0 ? '-' : '+'}${fmt(Math.abs(difference.emi))}`}
              </span>
            </div>

            {/* Total Interest */}
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr 1fr 1fr', minWidth: 550, borderBottom: '1px solid #f1f5f9', padding: '12px 0', fontSize: 13, alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: '#334155' }}>Total Interest</span>
              <span style={{ textAlign: 'right', fontWeight: 600, color: '#f59e0b' }}>{fmt(resA.totalInterest)}</span>
              <span style={{ textAlign: 'right', fontWeight: 600, color: '#f59e0b' }}>{fmt(resB.totalInterest)}</span>
              <span style={{ textAlign: 'right', fontWeight: 700, color: difference.interest < 0 ? '#059669' : difference.interest > 0 ? '#dc2626' : '#64748b' }}>
                {difference.interest === 0 ? '-' : `${difference.interest < 0 ? '-' : '+'}${fmt(Math.abs(difference.interest))}`}
              </span>
            </div>

            {/* Total Payment */}
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr 1fr 1fr', minWidth: 550, padding: '12px 0', fontSize: 13, alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: '#334155' }}>Total Payment</span>
              <span style={{ textAlign: 'right', fontWeight: 700, color: '#1e293b' }}>{fmt(resA.totalPayment)}</span>
              <span style={{ textAlign: 'right', fontWeight: 700, color: '#1e293b' }}>{fmt(resB.totalPayment)}</span>
              <span style={{ textAlign: 'right', fontWeight: 800, color: difference.payment < 0 ? '#059669' : difference.payment > 0 ? '#dc2626' : '#64748b' }}>
                {difference.payment === 0 ? '-' : `${difference.payment < 0 ? '-' : '+'}${fmt(Math.abs(difference.payment))}`}
              </span>
            </div>
          </div>

          {/* Visual Progress Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {/* Option 1 Bar Chart */}
            <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: 18 }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: 12, fontWeight: 700, color: '#334155' }}>Option 1 Payment Breakdown</h4>
              <div style={{ display: 'flex', height: 24, borderRadius: 6, overflow: 'hidden', background: '#e2e8f0' }}>
                <div
                  style={{
                    width: `${Math.round((resA.principal / resA.totalPayment) * 100)}%`,
                    background: '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 10,
                    fontWeight: 700
                  }}
                >
                  {Math.round((resA.principal / resA.totalPayment) * 100)}%
                </div>
                <div
                  style={{
                    width: `${Math.round((resA.totalInterest / resA.totalPayment) * 100)}%`,
                    background: '#f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 10,
                    fontWeight: 700
                  }}
                >
                  {Math.round((resA.totalInterest / resA.totalPayment) * 100)}%
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10, color: '#64748b' }}>
                <span style={{ marginRight: 16 }}>
                  <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', marginRight: 4 }} />
                  Principal ({fmt(resA.principal)})
                </span>
                <span>
                  <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', marginRight: 4 }} />
                  Interest ({fmt(resA.totalInterest)})
                </span>
              </div>
            </div>

            {/* Option 2 Bar Chart */}
            <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: 18 }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: 12, fontWeight: 700, color: '#334155' }}>Option 2 Payment Breakdown</h4>
              <div style={{ display: 'flex', height: 24, borderRadius: 6, overflow: 'hidden', background: '#e2e8f0' }}>
                <div
                  style={{
                    width: `${Math.round((resB.principal / resB.totalPayment) * 100)}%`,
                    background: '#8b5cf6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 10,
                    fontWeight: 700
                  }}
                >
                  {Math.round((resB.principal / resB.totalPayment) * 100)}%
                </div>
                <div
                  style={{
                    width: `${Math.round((resB.totalInterest / resB.totalPayment) * 100)}%`,
                    background: '#f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 10,
                    fontWeight: 700
                  }}
                >
                  {Math.round((resB.totalInterest / resB.totalPayment) * 100)}%
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10, color: '#64748b' }}>
                <span style={{ marginRight: 16 }}>
                  <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#8b5cf6', marginRight: 4 }} />
                  Principal ({fmt(resB.principal)})
                </span>
                <span>
                  <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', marginRight: 4 }} />
                  Interest ({fmt(resB.totalInterest)})
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
