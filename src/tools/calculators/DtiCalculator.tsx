import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Scale, Info, Plus, Trash2 } from 'lucide-react';
import './calculators.css';

// ═══ DTI Calculator — Debt-to-Income Ratio ═══
// DTI = (Total Monthly Debt / Gross Monthly Income) × 100
// Thresholds: <30% Excellent, 30-36% Good, 36-43% Acceptable, 43-50% Risky, >50% High Risk

interface ListItem { id: number; label: string; amount: string }

export const DtiCalculator: React.FC = () => {
  const nextId = useRef(10);
  const [debts, setDebts] = useState<ListItem[]>([
    { id: 1, label: 'Home Loan EMI', amount: '25000' },
    { id: 2, label: 'Car Loan EMI', amount: '8000' },
  ]);
  const [incomes, setIncomes] = useState<ListItem[]>([
    { id: 3, label: 'Salary (Gross)', amount: '90000' },
  ]);

  const fmt = (n: number) => n.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const addDebt = useCallback(() => { setDebts(d => [...d, { id: nextId.current++, label: '', amount: '' }]); }, []);
  const addIncome = useCallback(() => { setIncomes(i => [...i, { id: nextId.current++, label: '', amount: '' }]); }, []);
  const updDebt = (id: number, f: 'label' | 'amount', v: string) => setDebts(ds => ds.map(d => d.id === id ? { ...d, [f]: v } : d));
  const updIncome = (id: number, f: 'label' | 'amount', v: string) => setIncomes(is => is.map(i => i.id === id ? { ...i, [f]: v } : i));
  const delDebt = (id: number) => { if (debts.length > 1) setDebts(d => d.filter(x => x.id !== id)); };
  const delIncome = (id: number) => { if (incomes.length > 1) setIncomes(i => i.filter(x => x.id !== id)); };

  const result = useMemo(() => {
    const totalDebt = debts.reduce((s, d) => s + (parseFloat(d.amount) || 0), 0);
    const totalIncome = incomes.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
    if (totalIncome <= 0) return null;

    const dti = (totalDebt / totalIncome) * 100;
    const risk = dti < 30 ? 'Excellent' : dti < 36 ? 'Good' : dti < 43 ? 'Acceptable' : dti <= 50 ? 'Risky' : 'High Risk';
    const riskColor = dti < 30 ? '#059669' : dti < 36 ? '#16a34a' : dti < 43 ? '#d97706' : dti <= 50 ? '#ea580c' : '#dc2626';
    const riskEmoji = dti < 30 ? '✅' : dti < 36 ? '👍' : dti < 43 ? '⚠️' : dti <= 50 ? '🔶' : '❌';
    const maxNewEmi = Math.max(0, totalIncome * 0.4 - totalDebt); // 40% rule

    return { totalDebt, totalIncome, dti: Math.round(dti * 100) / 100, risk, riskColor, riskEmoji, maxNewEmi: Math.round(maxNewEmi) };
  }, [debts, incomes]);

  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, background: 'white', outline: 'none', boxSizing: 'border-box' };

  const renderItems = (items: ListItem[], onUpdate: (id: number, f: 'label' | 'amount', v: string) => void, onDelete: (id: number) => void, canDelete: boolean, placeholder: string) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map(item => (
        <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 28px', gap: 6, alignItems: 'center' }}>
          <input type="text" value={item.label} placeholder={placeholder} onChange={e => onUpdate(item.id, 'label', e.target.value)} style={inputStyle} />
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: '#94a3b8' }}>₹</span>
            <input type="number" value={item.amount} placeholder="0" onChange={e => onUpdate(item.id, 'amount', e.target.value)}
              style={{ ...inputStyle, paddingLeft: 22 }} />
          </div>
          {canDelete ? (
            <button onClick={() => onDelete(item.id)} style={{ width: 28, height: 28, border: 'none', background: '#fee2e2', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
              <Trash2 size={12} />
            </button>
          ) : <div style={{ width: 28 }} />}
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: 16 }}>
      <div style={{ background: 'linear-gradient(135deg, #d97706, #b45309)', borderRadius: 16, padding: '16px 20px', color: 'white', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Scale size={20} />
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>DTI Calculator</h2>
            <p style={{ margin: 0, fontSize: 11, opacity: 0.85 }}>Debt-to-Income Ratio · Risk Assessment · Loan Eligibility</p>
          </div>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: 18 }}>
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '6px 12px', marginBottom: 14, fontSize: 10, color: '#92400e', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Info size={10} /> <strong>Formula:</strong> DTI = (Total Monthly Debt / Gross Monthly Income) × 100 &nbsp;|&nbsp; Target: below 36%
        </div>

        {/* Debts */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Monthly Debt Obligations</label>
          {renderItems(debts, updDebt, delDebt, debts.length > 1, 'e.g. Home Loan EMI')}
          <button onClick={addDebt} style={{ marginTop: 6, padding: '5px 12px', fontSize: 10, fontWeight: 600, border: '1px dashed #d97706', borderRadius: 8, background: '#fffbeb', color: '#d97706', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Plus size={10} /> Add Debt
          </button>
        </div>

        {/* Income */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Monthly Gross Income</label>
          {renderItems(incomes, updIncome, delIncome, incomes.length > 1, 'e.g. Salary')}
          <button onClick={addIncome} style={{ marginTop: 6, padding: '5px 12px', fontSize: 10, fontWeight: 600, border: '1px dashed #059669', borderRadius: 8, background: '#ecfdf5', color: '#059669', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Plus size={10} /> Add Income Source
          </button>
        </div>

        {/* Result */}
        {result && (
          <div style={{ borderRadius: 14, border: `2px solid ${result.riskColor}20`, background: `${result.riskColor}08`, padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
              {[['Total Debt/mo', fmt(result.totalDebt), '#dc2626'], ['Gross Income/mo', fmt(result.totalIncome), '#059669'], ['DTI Ratio', `${result.dti}%`, result.riskColor]].map(([l, v, c], i) => (
                <div key={i} style={{ background: 'white', borderRadius: 8, padding: 10, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase' }}>{l}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: c as string }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div style={{ background: 'white', borderRadius: 8, padding: '8px 12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase' }}>Risk Assessment</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: result.riskColor }}>{result.riskEmoji} {result.risk}</div>
              </div>
              <div style={{ background: 'white', borderRadius: 8, padding: '8px 12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase' }}>Max New EMI (40% rule)</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: result.maxNewEmi > 0 ? '#059669' : '#dc2626' }}>{fmt(result.maxNewEmi)}/mo</div>
              </div>
            </div>

            {/* DTI Scale */}
            <div style={{ marginTop: 12, background: 'white', borderRadius: 8, padding: '8px 12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 9, color: '#64748b', fontWeight: 600, marginBottom: 6 }}>DTI SCALE</div>
              <div style={{ position: 'relative', height: 8, borderRadius: 4, background: 'linear-gradient(to right, #059669 0%, #16a34a 30%, #d97706 43%, #ea580c 50%, #dc2626 100%)' }}>
                <div style={{ position: 'absolute', left: `${Math.min(result.dti, 100)}%`, top: -4, width: 3, height: 16, background: '#1e293b', borderRadius: 2, transform: 'translateX(-50%)' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, color: '#94a3b8', marginTop: 3 }}>
                <span>0%</span><span>30%</span><span>36%</span><span>43%</span><span>50%+</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
