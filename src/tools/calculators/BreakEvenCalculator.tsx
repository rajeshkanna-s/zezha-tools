import React, { useState, useMemo } from 'react';
import { Target, Info } from 'lucide-react';
import { CurrencySelect } from './CurrencySelect';
import './calculators.css';

export const BreakEvenCalculator: React.FC = () => {
    const [currency, setCurrency] = useState('₹');
    const [fixedCosts, setFixedCosts] = useState(100000);
    const [sellingPrice, setSellingPrice] = useState(500);
    const [variableCost, setVariableCost] = useState(300);
    const [expectedUnits, setExpectedUnits] = useState(600);
    const [targetProfit, setTargetProfit] = useState(0);

    const fmt = (n: number) => `${currency}${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

    // Auto-calculate
    const results = useMemo(() => {
        if (sellingPrice <= 0 || sellingPrice <= variableCost || fixedCosts < 0) return null;

        const cm = sellingPrice - variableCost;
        const cmRatio = (cm / sellingPrice) * 100;
        const beUnits = cm > 0 ? fixedCosts / cm : 0;
        const beRevenue = beUnits * sellingPrice;

        // Target profit analysis
        let targetUnits: number | null = null;
        let targetRevenue: number | null = null;
        if (targetProfit > 0 && cm > 0) {
            targetUnits = (fixedCosts + targetProfit) / cm;
            targetRevenue = targetUnits * sellingPrice;
        }

        // Expected sales analysis
        let profit: number | null = null;
        let mosUnits: number | null = null;
        let mosPct: number | null = null;
        let mosRevenue: number | null = null;
        let operatingLeverage: number | null = null;
        if (expectedUnits > 0) {
            profit = expectedUnits * cm - fixedCosts;
            mosUnits = expectedUnits - beUnits;
            mosPct = (mosUnits / expectedUnits) * 100;
            mosRevenue = mosUnits * sellingPrice;
            // Degree of Operating Leverage = Total CM / Operating Profit
            const totalCm = expectedUnits * cm;
            if (profit !== 0) operatingLeverage = totalCm / profit;
        }

        return {
            cm: parseFloat(cm.toFixed(2)),
            cmRatio: parseFloat(cmRatio.toFixed(2)),
            beUnits: parseFloat(beUnits.toFixed(2)),
            beRevenue: parseFloat(beRevenue.toFixed(2)),
            profit: profit !== null ? parseFloat(profit.toFixed(2)) : null,
            mosUnits: mosUnits !== null ? parseFloat(mosUnits.toFixed(2)) : null,
            mosPct: mosPct !== null ? parseFloat(mosPct.toFixed(2)) : null,
            mosRevenue: mosRevenue !== null ? parseFloat(mosRevenue.toFixed(2)) : null,
            operatingLeverage: operatingLeverage !== null ? parseFloat(operatingLeverage.toFixed(2)) : null,
            targetUnits: targetUnits !== null ? parseFloat(targetUnits.toFixed(2)) : null,
            targetRevenue: targetRevenue !== null ? parseFloat(targetRevenue.toFixed(2)) : null,
        };
    }, [fixedCosts, sellingPrice, variableCost, expectedUnits, targetProfit]);

    const hasError = sellingPrice <= 0 || sellingPrice <= variableCost;

    return (
        <div className="calc-wrapper" style={{ maxWidth: 560 }}>
            <div className="calc-header">
                <div className="calc-header-icon" style={{ background: '#fef3c7', color: '#d97706' }}><Target size={22} /></div>
                <div><h2 className="calc-header-title">Break‑Even Calculator</h2><p className="calc-header-desc">BEP, contribution margin, margin of safety & target profit</p></div>
            </div>

            {/* Core Inputs */}
            <div className="calc-card">
                <h3 className="calc-title">1. Cost & Pricing</h3>
                {hasError && sellingPrice > 0 && (
                    <div className="calc-field-error" style={{ textAlign: 'center', marginBottom: 8 }}>Selling Price must exceed Variable Cost</div>
                )}
                <div className="calc-form-group">
                    <label className="calc-label">Currency:</label>
                    <CurrencySelect value={currency} onChange={setCurrency} />
                </div>
                <div className="calc-form-group">
                    <label className="calc-label">Total Fixed Costs (FC):</label>
                    <input type="number" className="calc-input" value={fixedCosts} onChange={e => setFixedCosts(parseFloat(e.target.value || '0'))} />
                </div>
                <div className="calc-input-row-2">
                    <div className="calc-form-group">
                        <label className="calc-label">Selling Price / Unit (SP):</label>
                        <input type="number" className="calc-input" value={sellingPrice} onChange={e => setSellingPrice(parseFloat(e.target.value || '0'))} />
                    </div>
                    <div className="calc-form-group">
                        <label className="calc-label">Variable Cost / Unit (VC):</label>
                        <input type="number" className="calc-input" value={variableCost} onChange={e => setVariableCost(parseFloat(e.target.value || '0'))} />
                    </div>
                </div>
            </div>

            {/* Sales & Targets */}
            <div className="calc-card">
                <h3 className="calc-title">2. Sales & Target <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 400 }}>(Optional)</span></h3>
                <div className="calc-input-row-2">
                    <div className="calc-form-group">
                        <label className="calc-label">Expected Sales (Units):</label>
                        <input type="number" className="calc-input" value={expectedUnits} onChange={e => setExpectedUnits(parseFloat(e.target.value || '0'))} />
                    </div>
                    <div className="calc-form-group">
                        <label className="calc-label">Target Profit ({currency}):</label>
                        <input type="number" className="calc-input" value={targetProfit} onChange={e => setTargetProfit(parseFloat(e.target.value || '0'))} />
                    </div>
                </div>
            </div>

            {/* Results */}
            {results && (
                <div style={{ marginTop: 12 }}>
                    {/* Hero BEP Card */}
                    <div style={{
                        background: 'linear-gradient(135deg, #92400e, #d97706)',
                        borderRadius: 14,
                        padding: '20px 18px',
                        color: '#fff',
                        textAlign: 'center',
                        marginBottom: 12,
                    }}>
                        <p style={{ fontSize: 10, color: '#fef3c7', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 4 }}>Break-Even Point</p>
                        <p style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5 }}>{results.beUnits} Units</p>
                        <p style={{ fontSize: 15, fontWeight: 700, color: '#fef3c7', marginTop: 2 }}>{fmt(results.beRevenue)} Revenue</p>
                    </div>

                    {/* Key Metrics Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                            <p style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>Contribution Margin</p>
                            <p style={{ fontSize: 20, fontWeight: 800, color: '#2563eb' }}>{fmt(results.cm)}</p>
                            <p style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>per unit</p>
                        </div>
                        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                            <p style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>CM Ratio</p>
                            <p style={{ fontSize: 20, fontWeight: 800, color: '#7c3aed' }}>{results.cmRatio}%</p>
                            <p style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>of selling price</p>
                        </div>
                    </div>

                    {/* Expected Sales Analysis */}
                    {results.profit !== null && (
                        <div className="calc-result-card">
                            <h4 className="calc-result-title">Expected Sales Analysis ({expectedUnits} units)</h4>
                            <ul className="calc-result-list">
                                <li className="calc-result-item" style={{ color: results.profit >= 0 ? '#047857' : '#dc2626', fontWeight: 800 }}>
                                    <span>{results.profit >= 0 ? 'Profit' : 'Loss'} at Expected Sales</span>
                                    <span>{fmt(Math.abs(results.profit))}</span>
                                </li>
                                <li className="calc-result-item">
                                    <span>Margin of Safety (Units)</span>
                                    <span style={{ color: (results.mosUnits ?? 0) >= 0 ? '#047857' : '#dc2626' }}>{results.mosUnits} units</span>
                                </li>
                                <li className="calc-result-item" style={{ fontWeight: 700 }}>
                                    <span>Margin of Safety %</span>
                                    <span style={{ color: (results.mosPct ?? 0) >= 0 ? '#047857' : '#dc2626' }}>{results.mosPct}%</span>
                                </li>
                                {results.mosRevenue !== null && (
                                    <li className="calc-result-item">
                                        <span>Margin of Safety (Revenue)</span>
                                        <span>{fmt(results.mosRevenue)}</span>
                                    </li>
                                )}
                                {results.operatingLeverage !== null && results.operatingLeverage > 0 && (
                                    <li className="calc-result-item" style={{ color: '#2563eb' }}>
                                        <span>Degree of Operating Leverage</span>
                                        <span>{results.operatingLeverage}×</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}

                    {/* Target Profit */}
                    {results.targetUnits !== null && (
                        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '10px 14px', marginTop: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ fontSize: 9, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', marginBottom: 2 }}>To earn {fmt(targetProfit)} profit</p>
                                    <p style={{ fontSize: 15, fontWeight: 800, color: '#1e40af' }}>{results.targetUnits} units needed</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: 9, color: '#64748b', fontWeight: 600 }}>Revenue Required</p>
                                    <p style={{ fontSize: 14, fontWeight: 800, color: '#1e40af' }}>{fmt(results.targetRevenue!)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div style={{ display: 'flex', alignItems: 'start', gap: 6, marginTop: 10, padding: '0 4px' }}>
                <Info size={12} style={{ color: '#94a3b8', flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                    CM = SP − VC. CM Ratio = CM/SP × 100. BEP = FC/CM. MoS% = (Actual − BEP)/Actual × 100. Target Units = (FC + Target Profit)/CM. DOL = Total CM / Operating Profit.
                </p>
            </div>
        </div>
    );
};
