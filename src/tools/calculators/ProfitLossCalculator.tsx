import React, { useState, useMemo } from 'react';
import { BarChart3, Plus, X, Info } from 'lucide-react';
import { CurrencySelect } from './CurrencySelect';
import './calculators.css';

type Product = { id: number; name: string; qty: number; price: number };
type OpexItem = { id: number; label: string; amount: number };
type CogsMode = 'stock_based' | 'per_unit';

let nextProdId = 2;
let nextOpexId = 3;

export const ProfitLossCalculator: React.FC = () => {
    const [currency, setCurrency] = useState('₹');
    const [periodLabel, setPeriodLabel] = useState('Current Period');

    const [products, setProducts] = useState<Product[]>([
        { id: 1, name: 'Product A', qty: 100, price: 500 },
    ]);

    const [cogsMode, setCogsMode] = useState<CogsMode>('stock_based');
    const [openingStock, setOpeningStock] = useState(0);
    const [purchases, setPurchases] = useState(0);
    const [directCosts, setDirectCosts] = useState(0);
    const [closingStock, setClosingStock] = useState(0);
    const [costPerUnit, setCostPerUnit] = useState(300);

    const [opexItems, setOpexItems] = useState<OpexItem[]>([
        { id: 1, label: 'Rent', amount: 20000 },
        { id: 2, label: 'Salaries', amount: 80000 },
    ]);

    const [interest, setInterest] = useState(0);
    const [depreciation, setDepreciation] = useState(0);
    const [taxRate, setTaxRate] = useState(25);

    const fmt = (n: number) => `${currency}${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

    // Product CRUD
    const addProduct = () => { setProducts(p => [...p, { id: nextProdId++, name: `Product ${p.length + 1}`, qty: 0, price: 0 }]); };
    const updProduct = (id: number, field: keyof Product, val: string) => {
        setProducts(ps => ps.map(p => p.id === id ? { ...p, [field]: field === 'name' ? val : parseFloat(val || '0') } : p));
    };
    const delProduct = (id: number) => { if (products.length > 1) setProducts(p => p.filter(x => x.id !== id)); };

    // Opex CRUD
    const addOpex = () => { setOpexItems(o => [...o, { id: nextOpexId++, label: `Expense ${o.length + 1}`, amount: 0 }]); };
    const updOpex = (id: number, field: keyof OpexItem, val: string) => {
        setOpexItems(os => os.map(o => o.id === id ? { ...o, [field]: field === 'label' ? val : parseFloat(val || '0') } : o));
    };
    const delOpex = (id: number) => { if (opexItems.length > 1) setOpexItems(o => o.filter(x => x.id !== id)); };

    // Auto-calculate
    const results = useMemo(() => {
        // Revenue
        const totalRevenue = products.reduce((s, p) => s + (p.qty || 0) * (p.price || 0), 0);

        // COGS
        let cogs = 0;
        if (cogsMode === 'stock_based') {
            cogs = (openingStock || 0) + (purchases || 0) + (directCosts || 0) - (closingStock || 0);
        } else {
            const totalUnits = products.reduce((s, p) => s + (p.qty || 0), 0);
            cogs = (costPerUnit || 0) * totalUnits;
        }

        const grossProfit = totalRevenue - cogs;
        const totalOpex = opexItems.reduce((s, o) => s + (o.amount || 0), 0);
        const ebitda = grossProfit - totalOpex + (depreciation || 0);
        const ebit = grossProfit - totalOpex;
        const pbt = ebit - (interest || 0) - (depreciation || 0);
        const taxAmt = pbt > 0 ? pbt * ((taxRate || 0) / 100) : 0;
        const pat = pbt - taxAmt;

        // Margins
        const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
        const ebitdaMargin = totalRevenue > 0 ? (ebitda / totalRevenue) * 100 : 0;
        const operatingMargin = totalRevenue > 0 ? (ebit / totalRevenue) * 100 : 0;
        const netMargin = totalRevenue > 0 ? (pat / totalRevenue) * 100 : 0;

        return {
            totalRevenue: parseFloat(totalRevenue.toFixed(2)),
            cogs: parseFloat(cogs.toFixed(2)),
            grossProfit: parseFloat(grossProfit.toFixed(2)),
            totalOpex: parseFloat(totalOpex.toFixed(2)),
            ebitda: parseFloat(ebitda.toFixed(2)),
            ebit: parseFloat(ebit.toFixed(2)),
            pbt: parseFloat(pbt.toFixed(2)),
            taxAmt: parseFloat(taxAmt.toFixed(2)),
            pat: parseFloat(pat.toFixed(2)),
            grossMargin: parseFloat(grossMargin.toFixed(2)),
            ebitdaMargin: parseFloat(ebitdaMargin.toFixed(2)),
            operatingMargin: parseFloat(operatingMargin.toFixed(2)),
            netMargin: parseFloat(netMargin.toFixed(2)),
        };
    }, [products, cogsMode, openingStock, purchases, directCosts, closingStock, costPerUnit, opexItems, interest, depreciation, taxRate]);

    return (
        <div className="calc-wrapper" style={{ maxWidth: 640 }}>
            <div className="calc-header">
                <div className="calc-header-icon" style={{ background: '#fef3c7', color: '#d97706' }}><BarChart3 size={22} /></div>
                <div><h2 className="calc-header-title">Profit & Loss Calculator</h2><p className="calc-header-desc">Full P&L with multi-product, COGS, OPEX, EBITDA & margins</p></div>
            </div>

            {/* Meta */}
            <div className="calc-card">
                <div className="calc-input-row-2">
                    <div className="calc-form-group">
                        <label className="calc-label">Period:</label>
                        <input type="text" className="calc-input" value={periodLabel} onChange={e => setPeriodLabel(e.target.value)} />
                    </div>
                    <div className="calc-form-group">
                        <label className="calc-label">Currency:</label>
                        <CurrencySelect value={currency} onChange={setCurrency} />
                    </div>
                </div>
            </div>

            {/* Products */}
            <div className="calc-card">
                <h3 className="calc-title">1. Revenue – Products</h3>
                <div className="calc-pnl-table-wrap">
                    <table className="calc-pnl-table">
                        <thead><tr><th>Name</th><th>Qty</th><th>Price/Unit</th><th>Revenue</th><th></th></tr></thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id}>
                                    <td><input type="text" className="calc-input" value={p.name} onChange={e => updProduct(p.id, 'name', e.target.value)} /></td>
                                    <td><input type="number" className="calc-input" value={p.qty} onChange={e => updProduct(p.id, 'qty', e.target.value)} /></td>
                                    <td><input type="number" className="calc-input" value={p.price} onChange={e => updProduct(p.id, 'price', e.target.value)} /></td>
                                    <td style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{fmt((p.qty || 0) * (p.price || 0))}</td>
                                    <td>{products.length > 1 && <button className="calc-pnl-del" onClick={() => delProduct(p.id)}><X size={14} /></button>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button className="calc-pnl-add" onClick={addProduct}><Plus size={14} /> Add Product</button>
            </div>

            {/* COGS */}
            <div className="calc-card">
                <h3 className="calc-title">2. Cost of Goods Sold</h3>
                <div className="calc-form-group">
                    <label className="calc-label">COGS Mode:</label>
                    <select className="calc-select" value={cogsMode} onChange={e => setCogsMode(e.target.value as CogsMode)}>
                        <option value="stock_based">Stock-based</option><option value="per_unit">Per-unit</option>
                    </select>
                </div>
                {cogsMode === 'stock_based' ? (
                    <div className="calc-input-row-2">
                        <div className="calc-form-group"><label className="calc-label">Opening Stock:</label><input type="number" className="calc-input" value={openingStock} onChange={e => setOpeningStock(parseFloat(e.target.value || '0'))} /></div>
                        <div className="calc-form-group"><label className="calc-label">Purchases:</label><input type="number" className="calc-input" value={purchases} onChange={e => setPurchases(parseFloat(e.target.value || '0'))} /></div>
                        <div className="calc-form-group"><label className="calc-label">Direct Costs:</label><input type="number" className="calc-input" value={directCosts} onChange={e => setDirectCosts(parseFloat(e.target.value || '0'))} /></div>
                        <div className="calc-form-group"><label className="calc-label">Closing Stock:</label><input type="number" className="calc-input" value={closingStock} onChange={e => setClosingStock(parseFloat(e.target.value || '0'))} /></div>
                    </div>
                ) : (
                    <div className="calc-form-group"><label className="calc-label">Cost Price / Unit:</label><input type="number" className="calc-input" value={costPerUnit} onChange={e => setCostPerUnit(parseFloat(e.target.value || '0'))} /></div>
                )}
            </div>

            {/* OPEX */}
            <div className="calc-card">
                <h3 className="calc-title">3. Operating Expenses</h3>
                <div className="calc-pnl-table-wrap">
                    <table className="calc-pnl-table">
                        <thead><tr><th>Label</th><th>Amount</th><th></th></tr></thead>
                        <tbody>
                            {opexItems.map(o => (
                                <tr key={o.id}>
                                    <td><input type="text" className="calc-input" value={o.label} onChange={e => updOpex(o.id, 'label', e.target.value)} /></td>
                                    <td><input type="number" className="calc-input" value={o.amount} onChange={e => updOpex(o.id, 'amount', e.target.value)} /></td>
                                    <td>{opexItems.length > 1 && <button className="calc-pnl-del" onClick={() => delOpex(o.id)}><X size={14} /></button>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button className="calc-pnl-add" onClick={addOpex}><Plus size={14} /> Add Expense</button>
            </div>

            {/* Additional & Tax */}
            <div className="calc-card">
                <h3 className="calc-title">4. Additional Costs & Tax</h3>
                <div className="calc-input-row">
                    <div className="calc-form-group"><label className="calc-label">Interest:</label><input type="number" className="calc-input" value={interest} onChange={e => setInterest(parseFloat(e.target.value || '0'))} /></div>
                    <div className="calc-form-group"><label className="calc-label">Depreciation:</label><input type="number" className="calc-input" value={depreciation} onChange={e => setDepreciation(parseFloat(e.target.value || '0'))} /></div>
                    <div className="calc-form-group"><label className="calc-label">Tax Rate %:</label><input type="number" className="calc-input" value={taxRate} min={0} max={100} onChange={e => setTaxRate(parseFloat(e.target.value || '0'))} /></div>
                </div>
            </div>

            {/* Auto Results */}
            <div style={{ marginTop: 12 }}>
                {/* Margin Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6, marginBottom: 12 }}>
                    {[
                        { label: 'Gross Margin', value: results.grossMargin, color: '#2563eb' },
                        { label: 'EBITDA Margin', value: results.ebitdaMargin, color: '#7c3aed' },
                        { label: 'Operating Margin', value: results.operatingMargin, color: '#d97706' },
                        { label: 'Net Margin', value: results.netMargin, color: results.netMargin >= 0 ? '#047857' : '#dc2626' },
                    ].map(m => (
                        <div key={m.label} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
                            <p style={{ fontSize: 8, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4, lineHeight: 1.2 }}>{m.label}</p>
                            <p style={{ fontSize: 17, fontWeight: 800, color: m.color }}>{m.value}%</p>
                        </div>
                    ))}
                </div>

                {/* P&L Statement */}
                <div className="calc-result-card">
                    <h4 className="calc-result-title">P&L Statement — {periodLabel}</h4>
                    <ul className="calc-result-list">
                        <li className="calc-result-item" style={{ fontWeight: 700 }}><span>Total Revenue</span><span>{fmt(results.totalRevenue)}</span></li>
                        <li className="calc-result-item" style={{ color: '#dc2626' }}><span>Cost of Goods Sold</span><span>−{fmt(results.cogs)}</span></li>
                        <li className="calc-result-item" style={{ fontWeight: 700, background: '#f0fdf4', borderRadius: 6, padding: '6px 8px', margin: '2px -8px' }}>
                            <span>Gross Profit</span><span style={{ color: results.grossProfit >= 0 ? '#047857' : '#dc2626' }}>{fmt(results.grossProfit)}</span>
                        </li>
                        <li className="calc-result-item" style={{ color: '#dc2626' }}><span>Operating Expenses</span><span>−{fmt(results.totalOpex)}</span></li>
                        <li className="calc-result-item" style={{ fontWeight: 700, background: '#ede9fe', borderRadius: 6, padding: '6px 8px', margin: '2px -8px' }}>
                            <span>EBITDA</span><span style={{ color: '#7c3aed' }}>{fmt(results.ebitda)}</span>
                        </li>
                        {depreciation > 0 && (
                            <li className="calc-result-item" style={{ color: '#dc2626' }}><span>Depreciation</span><span>−{fmt(depreciation)}</span></li>
                        )}
                        <li className="calc-result-item"><span>Operating Profit (EBIT)</span><span>{fmt(results.ebit)}</span></li>
                        {interest > 0 && (
                            <li className="calc-result-item" style={{ color: '#dc2626' }}><span>Interest Expense</span><span>−{fmt(interest)}</span></li>
                        )}
                        <li className="calc-result-item"><span>Profit Before Tax (PBT)</span><span>{fmt(results.pbt)}</span></li>
                        <li className="calc-result-item" style={{ color: '#dc2626' }}><span>Tax ({taxRate}%)</span><span>−{fmt(results.taxAmt)}</span></li>
                        <li className="calc-result-item" style={{ fontWeight: 800, fontSize: 14, background: results.pat >= 0 ? '#ecfdf5' : '#fef2f2', borderRadius: 6, padding: '8px', margin: '4px -8px' }}>
                            <span>Net Profit (PAT)</span>
                            <span style={{ color: results.pat >= 0 ? '#047857' : '#dc2626' }}>{fmt(results.pat)}</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'start', gap: 6, marginTop: 10, padding: '0 4px' }}>
                <Info size={12} style={{ color: '#94a3b8', flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                    Revenue = Σ(Qty × Price). COGS: Stock-based or Per-unit. GP = Revenue − COGS. EBITDA = GP − OPEX + Dep. EBIT = GP − OPEX. PBT = EBIT − Interest − Dep. PAT = PBT − Tax.
                </p>
            </div>
        </div>
    );
};
