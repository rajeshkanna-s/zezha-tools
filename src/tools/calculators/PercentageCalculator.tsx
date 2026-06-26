import React, { useState, useMemo } from 'react';
import { Percent } from 'lucide-react';
import './calculators.css';

type Mode = 'basic' | 'change' | 'increase' | 'discount' | 'fraction';

const MODES: { id: Mode; label: string; desc: string }[] = [
    { id: 'basic', label: '% of Total', desc: 'What % is X of Y?' },
    { id: 'change', label: '% Change', desc: 'From → To change' },
    { id: 'increase', label: '% Inc / Dec', desc: 'Increase or decrease by %' },
    { id: 'discount', label: 'Discount', desc: 'Price after % off' },
    { id: 'fraction', label: 'Fraction → %', desc: 'Convert fraction to %' },
];

const fmt = (n: number) => {
    if (Number.isInteger(n)) return n.toLocaleString('en-IN');
    return n.toLocaleString('en-IN', { maximumFractionDigits: 4 });
};

export const PercentageCalculator: React.FC = () => {
    const [mode, setMode] = useState<Mode>('basic');
    const [a, setA] = useState('25');
    const [b, setB] = useState('200');
    const [pct, setPct] = useState('15');

    // Fraction inputs
    const [num, setNum] = useState('3');
    const [den, setDen] = useState('8');

    const result = useMemo(() => {
        const va = parseFloat(a) || 0;
        const vb = parseFloat(b) || 0;
        const vp = parseFloat(pct) || 0;
        const vn = parseFloat(num) || 0;
        const vd = parseFloat(den) || 0;

        switch (mode) {
            case 'basic': {
                if (vb === 0) return null;
                const perc = (va / vb) * 100;
                return { hero: `${fmt(perc)}%`, sub: `${fmt(va)} is ${fmt(perc)}% of ${fmt(vb)}` };
            }
            case 'change': {
                if (va === 0) return null;
                const change = ((vb - va) / Math.abs(va)) * 100;
                const dir = change >= 0 ? 'Increase' : 'Decrease';
                return { hero: `${change >= 0 ? '+' : ''}${fmt(change)}%`, sub: `${dir} from ${fmt(va)} → ${fmt(vb)}`, positive: change >= 0 };
            }
            case 'increase': {
                const inc = va + (va * vp / 100);
                const dec = va - (va * vp / 100);
                return { hero: `₹${fmt(inc)}`, sub: `Increased by ${fmt(vp)}%`, extra: `Decreased: ₹${fmt(dec)}` };
            }
            case 'discount': {
                const saved = va * vp / 100;
                const final_ = va - saved;
                return { hero: `₹${fmt(final_)}`, sub: `You save ₹${fmt(saved)} (${fmt(vp)}% off ₹${fmt(va)})` };
            }
            case 'fraction': {
                if (vd === 0) return null;
                const perc = (vn / vd) * 100;
                return { hero: `${fmt(perc)}%`, sub: `${vn}/${vd} = ${fmt(perc)}%` };
            }
            default: return null;
        }
    }, [mode, a, b, pct, num, den]);

    const renderInputs = () => {
        const inp = (label: string, val: string, set: (v: string) => void, ph = '0') => (
            <div className="calc-form-group" style={{ flex: 1 }}>
                <label className="calc-label">{label}</label>
                <input type="number" className="calc-input" value={val} onChange={e => set(e.target.value)} placeholder={ph}
                    style={{ fontSize: 16, fontWeight: 700 }} />
            </div>
        );

        switch (mode) {
            case 'basic':
                return <div className="calc-input-row">{inp('Part (Value)', a, setA, 'e.g. 25')}{inp('Total (Whole)', b, setB, 'e.g. 200')}</div>;
            case 'change':
                return <div className="calc-input-row">{inp('Old Value', a, setA, 'e.g. 100')}{inp('New Value', b, setB, 'e.g. 150')}</div>;
            case 'increase':
                return <div className="calc-input-row">{inp('Base Amount', a, setA, 'e.g. 5000')}{inp('Percentage (%)', pct, setPct, 'e.g. 15')}</div>;
            case 'discount':
                return <div className="calc-input-row">{inp('Original Price (₹)', a, setA, 'e.g. 2999')}{inp('Discount (%)', pct, setPct, 'e.g. 20')}</div>;
            case 'fraction':
                return <div className="calc-input-row">{inp('Numerator', num, setNum, 'e.g. 3')}{inp('Denominator', den, setDen, 'e.g. 8')}</div>;
        }
    };

    return (
        <div className="calc-wrapper" style={{ maxWidth: 520 }}>
            <div className="calc-header">
                <div className="calc-header-icon" style={{ background: '#eff6ff', color: '#2563eb' }}><Percent size={22} /></div>
                <div><h2 className="calc-header-title">Percentage Calculator</h2><p className="calc-header-desc">5 modes • Real-time results</p></div>
            </div>

            {/* Mode Tabs */}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
                {MODES.map(m => (
                    <button key={m.id} onClick={() => setMode(m.id)}
                        style={{
                            padding: '6px 12px', borderRadius: 10,
                            border: mode === m.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                            background: mode === m.id ? '#eff6ff' : '#f8fafc',
                            color: mode === m.id ? '#2563eb' : '#64748b',
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
                {renderInputs()}
            </div>

            {/* Hero Result */}
            {result && (
                <div style={{
                    background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
                    borderRadius: 14, padding: '20px 22px',
                    color: '#fff', textAlign: 'center', marginTop: 12,
                }}>
                    <p style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1 }}>{result.hero}</p>
                    <p style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>{result.sub}</p>
                    {'extra' in result && result.extra && (
                        <p style={{ fontSize: 11, opacity: 0.5, marginTop: 6 }}>{result.extra}</p>
                    )}
                    {'positive' in result && (
                        <div style={{
                            display: 'inline-block', marginTop: 8,
                            padding: '3px 12px', borderRadius: 20,
                            background: result.positive ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)',
                            color: result.positive ? '#34d399' : '#f87171',
                            fontSize: 11, fontWeight: 700,
                        }}>
                            {result.positive ? '↑ Increase' : '↓ Decrease'}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
