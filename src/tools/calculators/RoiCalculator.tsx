import React, { useState, useMemo } from 'react';
import { TrendingUp, Plus, X, Info } from 'lucide-react';
import { CurrencySelect } from './CurrencySelect';
import './calculators.css';

type CostItem = { id: number; label: string; amount: number };
type TimeUnit = 'months' | 'years';

let nextCostId = 3;

export const RoiCalculator: React.FC = () => {
    const [currency, setCurrency] = useState('₹');
    const [initialInvestment, setInitialInvestment] = useState(100000);
    const [finalValue, setFinalValue] = useState(130000);

    const [costItems, setCostItems] = useState<CostItem[]>([
        { id: 1, label: 'Maintenance', amount: 5000 },
        { id: 2, label: 'Marketing', amount: 10000 },
    ]);

    const [timeValue, setTimeValue] = useState(12);
    const [timeUnit, setTimeUnit] = useState<TimeUnit>('months');

    const [campaignRevenue, setCampaignRevenue] = useState(0);
    const [campaignCost, setCampaignCost] = useState(0);

    const fmt = (n: number) => `${currency}${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

    // Cost CRUD
    const addCost = () => { setCostItems(p => [...p, { id: nextCostId++, label: `Cost ${p.length + 1}`, amount: 0 }]); };
    const updCost = (id: number, field: keyof CostItem, val: string) => {
        setCostItems(cs => cs.map(c => c.id === id ? { ...c, [field]: field === 'label' ? val : parseFloat(val || '0') } : c));
    };
    const delCost = (id: number) => { if (costItems.length > 1) setCostItems(c => c.filter(x => x.id !== id)); };

    // Auto-calculate
    const results = useMemo(() => {
        if (!initialInvestment || initialInvestment <= 0) return null;

        const additionalCosts = costItems.reduce((s, c) => s + (c.amount || 0), 0);
        const totalCost = (initialInvestment || 0) + additionalCosts;
        const netProfit = (finalValue || 0) - totalCost;
        const simpleRoi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;
        const profitMultiplier = totalCost > 0 ? finalValue / totalCost : 0;

        // CAGR (Annualized ROI)
        let cagr: number | null = null;
        const months = timeUnit === 'months' ? timeValue : timeValue * 12;
        const years = months / 12;
        if (years > 0 && totalCost > 0 && finalValue > 0) {
            cagr = (Math.pow(finalValue / totalCost, 1 / years) - 1) * 100;
        }

        // Payback Period
        let paybackMonths: number | null = null;
        if (netProfit > 0 && months > 0) {
            const monthlyProfit = netProfit / months;
            if (monthlyProfit > 0) paybackMonths = totalCost / monthlyProfit;
        }

        // Monthly profit
        const monthlyProfit = months > 0 ? netProfit / months : null;

        // Marketing ROI
        let marketingRoi: number | null = null;
        if (campaignRevenue && campaignCost > 0) {
            marketingRoi = ((campaignRevenue - campaignCost) / campaignCost) * 100;
        }

        const verdict = netProfit > 0 ? '✅ Positive ROI' : netProfit < 0 ? '❌ Negative ROI' : '➖ Break-even';

        return {
            totalCost: parseFloat(totalCost.toFixed(2)),
            additionalCosts: parseFloat(additionalCosts.toFixed(2)),
            netProfit: parseFloat(netProfit.toFixed(2)),
            simpleRoi: parseFloat(simpleRoi.toFixed(2)),
            profitMultiplier: parseFloat(profitMultiplier.toFixed(3)),
            cagr: cagr !== null ? parseFloat(cagr.toFixed(2)) : null,
            paybackMonths: paybackMonths !== null ? parseFloat(paybackMonths.toFixed(1)) : null,
            monthlyProfit: monthlyProfit !== null ? parseFloat(monthlyProfit.toFixed(2)) : null,
            marketingRoi: marketingRoi !== null ? parseFloat(marketingRoi.toFixed(2)) : null,
            verdict,
            months,
        };
    }, [initialInvestment, finalValue, costItems, timeValue, timeUnit, campaignRevenue, campaignCost, currency]);

    return (
        <div className="calc-wrapper" style={{ maxWidth: 560 }}>
            <div className="calc-header">
                <div className="calc-header-icon" style={{ background: '#ede9fe', color: '#7c3aed' }}><TrendingUp size={22} /></div>
                <div><h2 className="calc-header-title">ROI Calculator</h2><p className="calc-header-desc">Simple ROI, CAGR, payback period & marketing ROI</p></div>
            </div>

            {/* Core Inputs */}
            <div className="calc-card">
                <h3 className="calc-title">1. Investment Details</h3>
                <div className="calc-form-group">
                    <label className="calc-label">Currency:</label>
                    <CurrencySelect value={currency} onChange={setCurrency} />
                </div>
                <div className="calc-input-row-2">
                    <div className="calc-form-group">
                        <label className="calc-label">Initial Investment ({currency}):</label>
                        <input type="number" className="calc-input" value={initialInvestment} onChange={e => setInitialInvestment(parseFloat(e.target.value || '0'))} />
                    </div>
                    <div className="calc-form-group">
                        <label className="calc-label">Final Value / Return ({currency}):</label>
                        <input type="number" className="calc-input" value={finalValue} onChange={e => setFinalValue(parseFloat(e.target.value || '0'))} />
                    </div>
                </div>
            </div>

            {/* Additional Costs */}
            <div className="calc-card">
                <h3 className="calc-title">2. Additional Costs</h3>
                <div className="calc-pnl-table-wrap">
                    <table className="calc-pnl-table">
                        <thead><tr><th>Label</th><th>Amount</th><th></th></tr></thead>
                        <tbody>
                            {costItems.map(c => (
                                <tr key={c.id}>
                                    <td><input type="text" className="calc-input" value={c.label} onChange={e => updCost(c.id, 'label', e.target.value)} /></td>
                                    <td><input type="number" className="calc-input" value={c.amount} onChange={e => updCost(c.id, 'amount', e.target.value)} /></td>
                                    <td>{costItems.length > 1 && <button className="calc-pnl-del" onClick={() => delCost(c.id)}><X size={14} /></button>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button className="calc-pnl-add" onClick={addCost}><Plus size={14} /> Add Cost</button>
            </div>

            {/* Time-based */}
            <div className="calc-card">
                <h3 className="calc-title">3. Time Period</h3>
                <div className="calc-input-row-2">
                    <div className="calc-form-group">
                        <label className="calc-label">Duration:</label>
                        <input type="number" className="calc-input" value={timeValue} min={0} onChange={e => setTimeValue(parseFloat(e.target.value || '0'))} />
                    </div>
                    <div className="calc-form-group">
                        <label className="calc-label">Unit:</label>
                        <select className="calc-select" value={timeUnit} onChange={e => setTimeUnit(e.target.value as TimeUnit)}>
                            <option value="months">Months</option><option value="years">Years</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Marketing ROI */}
            <div className="calc-card">
                <h3 className="calc-title">4. Marketing ROI <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 400 }}>(Optional)</span></h3>
                <div className="calc-input-row-2">
                    <div className="calc-form-group">
                        <label className="calc-label">Campaign Revenue:</label>
                        <input type="number" className="calc-input" value={campaignRevenue} onChange={e => setCampaignRevenue(parseFloat(e.target.value || '0'))} />
                    </div>
                    <div className="calc-form-group">
                        <label className="calc-label">Campaign Cost:</label>
                        <input type="number" className="calc-input" value={campaignCost} onChange={e => setCampaignCost(parseFloat(e.target.value || '0'))} />
                    </div>
                </div>
            </div>

            {/* Results */}
            {results && (
                <div style={{ marginTop: 12 }}>
                    {/* Hero ROI Card */}
                    <div style={{
                        background: results.netProfit >= 0
                            ? 'linear-gradient(135deg, #047857, #059669)'
                            : 'linear-gradient(135deg, #991b1b, #dc2626)',
                        borderRadius: 14,
                        padding: '20px 18px',
                        color: '#fff',
                        textAlign: 'center',
                        marginBottom: 12,
                    }}>
                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 4 }}>
                            Return on Investment
                        </p>
                        <p style={{ fontSize: 30, fontWeight: 900, letterSpacing: -0.5 }}>{results.simpleRoi}%</p>
                        <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>{results.verdict}</p>
                    </div>

                    {/* Metrics Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
                        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 10, textAlign: 'center' }}>
                            <p style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>Net Profit</p>
                            <p style={{ fontSize: 16, fontWeight: 800, color: results.netProfit >= 0 ? '#047857' : '#dc2626' }}>{fmt(results.netProfit)}</p>
                        </div>
                        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 10, textAlign: 'center' }}>
                            <p style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>Multiplier</p>
                            <p style={{ fontSize: 16, fontWeight: 800, color: '#2563eb' }}>{results.profitMultiplier}×</p>
                        </div>
                        {results.cagr !== null && (
                            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 10, textAlign: 'center' }}>
                                <p style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>CAGR</p>
                                <p style={{ fontSize: 16, fontWeight: 800, color: '#7c3aed' }}>{results.cagr}%</p>
                            </div>
                        )}
                    </div>

                    {/* Detailed Breakdown */}
                    <div className="calc-result-card">
                        <h4 className="calc-result-title">Detailed Breakdown</h4>
                        <ul className="calc-result-list">
                            <li className="calc-result-item"><span>Initial Investment</span><span>{fmt(initialInvestment)}</span></li>
                            <li className="calc-result-item" style={{ color: '#dc2626' }}><span>Additional Costs</span><span>+{fmt(results.additionalCosts)}</span></li>
                            <li className="calc-result-item" style={{ fontWeight: 700 }}><span>Total Cost</span><span>{fmt(results.totalCost)}</span></li>
                            <li className="calc-result-item"><span>Final Value</span><span>{fmt(finalValue)}</span></li>
                            {results.monthlyProfit !== null && (
                                <li className="calc-result-item" style={{ color: '#2563eb' }}>
                                    <span>Monthly Profit</span><span>{fmt(results.monthlyProfit)}</span>
                                </li>
                            )}
                            {results.paybackMonths !== null && results.paybackMonths > 0 && (
                                <li className="calc-result-item" style={{ color: '#d97706', fontWeight: 700 }}>
                                    <span>Payback Period</span>
                                    <span>{results.paybackMonths <= 12 ? `${results.paybackMonths} months` : `${(results.paybackMonths / 12).toFixed(1)} years`}</span>
                                </li>
                            )}
                            {results.marketingRoi !== null && (
                                <li className="calc-result-item" style={{ color: '#0891b2' }}>
                                    <span>Marketing ROI</span><span>{results.marketingRoi}%</span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', alignItems: 'start', gap: 6, marginTop: 10, padding: '0 4px' }}>
                <Info size={12} style={{ color: '#94a3b8', flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                    ROI = (Net Profit / Total Cost) × 100. CAGR = (FV/Cost)^(1/Years) − 1. Payback = Total Cost / Monthly Profit. Marketing ROI = (Revenue − Cost) / Cost × 100.
                </p>
            </div>
        </div>
    );
};
