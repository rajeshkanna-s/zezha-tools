import React, { useState, useMemo } from 'react';
import { Percent } from 'lucide-react';
import './calculators.css';

type Mode = 'value' | 'reverse' | 'tip';

const MODES: { id: Mode; label: string; desc: string }[] = [
    { id: 'value', label: 'Value of %', desc: 'Find X% of a number' },
    { id: 'reverse', label: 'Reverse %', desc: 'What was the original before % increase?' },
    { id: 'tip', label: 'Tip / Split', desc: 'Calculate tip and split the bill' },
];

const fmt = (n: number) => n.toLocaleString('en-IN', { maximumFractionDigits: 2 });

export const ValueOfPercentageCalculator: React.FC = () => {
    const [mode, setMode] = useState<Mode>('value');
    const [total, setTotal] = useState('10000');
    const [pct, setPct] = useState('18');
    const [people, setPeople] = useState('4');

    const result = useMemo(() => {
        const vt = parseFloat(total) || 0;
        const vp = parseFloat(pct) || 0;
        const vPeople = parseInt(people) || 1;

        switch (mode) {
            case 'value': {
                const value = vt * vp / 100;
                return {
                    hero: `₹${fmt(value)}`,
                    sub: `${fmt(vp)}% of ₹${fmt(vt)}`,
                    extras: [
                        { label: 'Remaining', value: `₹${fmt(vt - value)}` },
                        { label: 'As fraction', value: `${vp}/100` },
                        { label: 'As decimal', value: (vp / 100).toFixed(4) },
                    ]
                };
            }
            case 'reverse': {
                if (vp === 100) return null;
                const original = vt / (1 + vp / 100);
                const addedAmt = vt - original;
                return {
                    hero: `₹${fmt(original)}`,
                    sub: `Original price before ${fmt(vp)}% increase`,
                    extras: [
                        { label: 'Amount added', value: `₹${fmt(addedAmt)}` },
                        { label: 'Current total', value: `₹${fmt(vt)}` },
                    ]
                };
            }
            case 'tip': {
                const tipAmt = vt * vp / 100;
                const totalBill = vt + tipAmt;
                const perPerson = totalBill / vPeople;
                return {
                    hero: `₹${fmt(perPerson)}`,
                    sub: `Per person (${vPeople} people)`,
                    extras: [
                        { label: 'Tip amount', value: `₹${fmt(tipAmt)}` },
                        { label: 'Total bill', value: `₹${fmt(totalBill)}` },
                        { label: 'Bill before tip', value: `₹${fmt(vt)}` },
                    ]
                };
            }
            default: return null;
        }
    }, [mode, total, pct, people]);

    return (
        <div className="calc-wrapper" style={{ maxWidth: 520 }}>
            <div className="calc-header">
                <div className="calc-header-icon" style={{ background: '#ecfdf5', color: '#059669' }}><Percent size={22} /></div>
                <div><h2 className="calc-header-title">Value of Percentage</h2><p className="calc-header-desc">3 modes • Auto-calculate</p></div>
            </div>

            {/* Mode Tabs */}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
                {MODES.map(m => (
                    <button key={m.id} onClick={() => setMode(m.id)}
                        style={{
                            padding: '6px 12px', borderRadius: 10,
                            border: mode === m.id ? '2px solid #059669' : '1px solid #e2e8f0',
                            background: mode === m.id ? '#ecfdf5' : '#f8fafc',
                            color: mode === m.id ? '#059669' : '#64748b',
                            fontWeight: 700, fontSize: 11, cursor: 'pointer',
                            transition: 'all 0.15s',
                        }}>
                        {m.label}
                    </button>
                ))}
            </div>

            <div className="calc-card">
                <p style={{ fontSize: 11, color: '#94a3b8', marginBottom: 10, fontWeight: 600 }}>
                    {MODES.find(m => m.id === mode)?.desc}
                </p>

                <div className="calc-input-row">
                    <div className="calc-form-group" style={{ flex: 1 }}>
                        <label className="calc-label">
                            {mode === 'tip' ? 'Bill Amount (₹)' : mode === 'reverse' ? 'Current Amount (₹)' : 'Total Value (₹)'}
                        </label>
                        <input type="number" className="calc-input" value={total} onChange={e => setTotal(e.target.value)}
                            placeholder="e.g. 10000" style={{ fontSize: 16, fontWeight: 700 }} />
                    </div>
                    <div className="calc-form-group" style={{ flex: 1 }}>
                        <label className="calc-label">
                            {mode === 'tip' ? 'Tip %' : mode === 'reverse' ? 'Increase %' : 'Percentage (%)'}
                        </label>
                        <input type="number" className="calc-input" value={pct} onChange={e => setPct(e.target.value)}
                            placeholder="e.g. 18" style={{ fontSize: 16, fontWeight: 700 }} />
                    </div>
                </div>

                {mode === 'tip' && (
                    <div className="calc-form-group" style={{ marginTop: 6 }}>
                        <label className="calc-label">Split Between (people)</label>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            {[2, 3, 4, 5, 6].map(n => (
                                <button key={n} onClick={() => setPeople(String(n))}
                                    style={{
                                        width: 36, height: 36, borderRadius: 10,
                                        border: people === String(n) ? '2px solid #059669' : '1px solid #e2e8f0',
                                        background: people === String(n) ? '#ecfdf5' : '#f8fafc',
                                        color: people === String(n) ? '#059669' : '#64748b',
                                        fontWeight: 700, fontSize: 13, cursor: 'pointer',
                                    }}>
                                    {n}
                                </button>
                            ))}
                            <input type="number" className="calc-input" value={people} onChange={e => setPeople(e.target.value)}
                                style={{ width: 60, textAlign: 'center', fontSize: 14, fontWeight: 700 }} min="1" />
                        </div>
                    </div>
                )}

                {/* Quick % Presets */}
                {mode === 'value' && (
                    <div style={{ marginTop: 8 }}>
                        <p style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>Quick</p>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            {[5, 10, 12, 15, 18, 20, 25, 28, 50].map(p => (
                                <button key={p} onClick={() => setPct(String(p))}
                                    style={{
                                        padding: '4px 10px', borderRadius: 8,
                                        border: pct === String(p) ? '2px solid #059669' : '1px solid #e2e8f0',
                                        background: pct === String(p) ? '#ecfdf5' : '#f8fafc',
                                        color: pct === String(p) ? '#059669' : '#64748b',
                                        fontWeight: 700, fontSize: 11, cursor: 'pointer',
                                    }}>
                                    {p}%
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Hero Result */}
            {result && (
                <div style={{
                    background: 'linear-gradient(135deg, #064e3b, #059669)',
                    borderRadius: 14, padding: '20px 22px',
                    color: '#fff', textAlign: 'center', marginTop: 12,
                }}>
                    <p style={{ fontSize: 30, fontWeight: 900, letterSpacing: -1 }}>{result.hero}</p>
                    <p style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>{result.sub}</p>

                    {result.extras && (
                        <div style={{
                            display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap',
                            marginTop: 14, paddingTop: 12,
                            borderTop: '1px solid rgba(255,255,255,0.15)',
                        }}>
                            {result.extras.map((e, i) => (
                                <div key={i}>
                                    <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>{e.label}</p>
                                    <p style={{ fontSize: 13, fontWeight: 700 }}>{e.value}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
