import React, { useState, useMemo } from 'react';
import { Receipt, Info } from 'lucide-react';
import { CurrencySelect } from './CurrencySelect';
import './calculators.css';

type CalcMode = 'exclusive' | 'inclusive';
type SupplyType = 'intra' | 'inter';

const RATE_PRESETS = [0, 5, 12, 18, 28];

export const GstVatCalculator: React.FC = () => {
    const [currency, setCurrency] = useState('₹');
    const [mode, setMode] = useState<CalcMode>('exclusive');
    const [supplyType, setSupplyType] = useState<SupplyType>('intra');
    const [basePrice, setBasePrice] = useState(1000);
    const [totalPrice, setTotalPrice] = useState(1180);
    const [gstRate, setGstRate] = useState(18);
    const [cessPct, setCessPct] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [inputGst, setInputGst] = useState(0);
    const [outputGst, setOutputGst] = useState(0);

    const fmt = (n: number) => `${currency}${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

    // Auto-calculate results
    const results = useMemo(() => {
        const rate = (gstRate || 0) / 100;
        const cessRate = (cessPct || 0) / 100;
        const qty = quantity || 1;
        let unitBase = 0, unitGst = 0, unitFinal = 0;

        if (mode === 'exclusive') {
            unitBase = basePrice || 0;
            unitGst = unitBase * rate;
            unitFinal = unitBase + unitGst;
        } else {
            unitFinal = totalPrice || 0;
            unitBase = rate > 0 ? unitFinal / (1 + rate) : unitFinal;
            unitGst = unitFinal - unitBase;
        }

        const cessAmt = unitBase * cessRate;
        const totalBase = unitBase * qty;
        const totalGstAmt = unitGst * qty;
        const totalCess = cessAmt * qty;
        const grandTotal = (unitFinal + cessAmt) * qty;

        // CGST/SGST/IGST split
        let cgst = 0, sgst = 0, igst = 0;
        if (supplyType === 'intra') {
            cgst = totalGstAmt / 2;
            sgst = totalGstAmt / 2;
        } else {
            igst = totalGstAmt;
        }

        // Net GST payable (business)
        let netGst: number | null = null;
        if (inputGst || outputGst) netGst = (outputGst || 0) - (inputGst || 0);

        return {
            unitBase: parseFloat(unitBase.toFixed(2)),
            unitGst: parseFloat(unitGst.toFixed(2)),
            unitCess: parseFloat(cessAmt.toFixed(2)),
            unitFinal: parseFloat((unitFinal + cessAmt).toFixed(2)),
            totalBase: parseFloat(totalBase.toFixed(2)),
            totalGstAmt: parseFloat(totalGstAmt.toFixed(2)),
            totalCess: parseFloat(totalCess.toFixed(2)),
            grandTotal: parseFloat(grandTotal.toFixed(2)),
            cgst: parseFloat(cgst.toFixed(2)),
            sgst: parseFloat(sgst.toFixed(2)),
            igst: parseFloat(igst.toFixed(2)),
            netGst: netGst !== null ? parseFloat(netGst.toFixed(2)) : null,
            gstPct: gstRate || 0,
        };
    }, [mode, supplyType, basePrice, totalPrice, gstRate, cessPct, quantity, inputGst, outputGst, currency]);

    return (
        <div className="calc-wrapper" style={{ maxWidth: 580 }}>
            <div className="calc-header">
                <div className="calc-header-icon" style={{ background: '#ecfdf5', color: '#059669' }}><Receipt size={22} /></div>
                <div><h2 className="calc-header-title">GST / VAT Calculator</h2><p className="calc-header-desc">CGST + SGST / IGST split, rate presets, cess & net payable</p></div>
            </div>

            {/* ── Section 1: Tax Setup ── */}
            <div className="calc-card">
                <h3 className="calc-title">1. Tax Setup</h3>
                <div className="calc-input-row-2">
                    <div className="calc-form-group">
                        <label className="calc-label">Calculation Type:</label>
                        <select className="calc-select" value={mode} onChange={e => setMode(e.target.value as CalcMode)}>
                            <option value="exclusive">Add GST (Exclusive)</option>
                            <option value="inclusive">Remove GST (Inclusive)</option>
                        </select>
                    </div>
                    <div className="calc-form-group">
                        <label className="calc-label">Supply Type:</label>
                        <select className="calc-select" value={supplyType} onChange={e => setSupplyType(e.target.value as SupplyType)}>
                            <option value="intra">Intra-State (CGST + SGST)</option>
                            <option value="inter">Inter-State (IGST)</option>
                        </select>
                    </div>
                </div>

                {/* Rate Presets */}
                <div className="calc-form-group">
                    <label className="calc-label">GST Rate (%):</label>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                        {RATE_PRESETS.map(r => (
                            <button
                                key={r}
                                onClick={() => setGstRate(r)}
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: 8,
                                    border: gstRate === r ? '2px solid #059669' : '1px solid #e2e8f0',
                                    background: gstRate === r ? '#ecfdf5' : '#fff',
                                    color: gstRate === r ? '#059669' : '#64748b',
                                    fontWeight: 700,
                                    fontSize: 13,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                }}
                            >
                                {r}%
                            </button>
                        ))}
                        <input
                            type="number"
                            className="calc-input"
                            value={gstRate}
                            min={0}
                            max={100}
                            onChange={e => setGstRate(parseFloat(e.target.value || '0'))}
                            style={{ width: 80, textAlign: 'center' }}
                            placeholder="Custom"
                        />
                    </div>
                </div>

                <div className="calc-input-row-2">
                    <div className="calc-form-group">
                        <label className="calc-label">Cess % (luxury/sin goods):</label>
                        <input type="number" className="calc-input" value={cessPct} min={0} onChange={e => setCessPct(parseFloat(e.target.value || '0'))} />
                    </div>
                    <div className="calc-form-group">
                        <label className="calc-label">Currency:</label>
                        <CurrencySelect value={currency} onChange={setCurrency} />
                    </div>
                </div>
            </div>

            {/* ── Section 2: Price & Quantity ── */}
            <div className="calc-card">
                <h3 className="calc-title">2. Price & Quantity</h3>
                <div className="calc-input-row-2">
                    <div className="calc-form-group">
                        <label className="calc-label">{mode === 'exclusive' ? `Base Price (before GST) (${currency}):` : `Total Price (GST inclusive) (${currency}):`}</label>
                        {mode === 'exclusive' ? (
                            <input type="number" className="calc-input" value={basePrice} onChange={e => setBasePrice(parseFloat(e.target.value || '0'))} />
                        ) : (
                            <input type="number" className="calc-input" value={totalPrice} onChange={e => setTotalPrice(parseFloat(e.target.value || '0'))} />
                        )}
                    </div>
                    <div className="calc-form-group">
                        <label className="calc-label">Quantity:</label>
                        <input type="number" className="calc-input" value={quantity} min={1} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value || '1')))} />
                    </div>
                </div>
            </div>

            {/* ── Auto Results ── */}
            <div className="calc-result-card" style={{ marginTop: 12 }}>
                <h4 className="calc-result-title">GST Breakdown</h4>

                {/* Per-unit breakdown */}
                {quantity > 1 && (
                    <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, padding: '0 0 6px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Per Unit</div>
                )}
                <ul className="calc-result-list">
                    <li className="calc-result-item"><span>Base Price</span><span>{fmt(results.unitBase)}</span></li>
                    {supplyType === 'intra' ? (
                        <>
                            <li className="calc-result-item" style={{ color: '#2563eb' }}><span>CGST @ {(results.gstPct / 2)}%</span><span>{fmt(results.unitGst / 2)}</span></li>
                            <li className="calc-result-item" style={{ color: '#2563eb' }}><span>SGST @ {(results.gstPct / 2)}%</span><span>{fmt(results.unitGst / 2)}</span></li>
                        </>
                    ) : (
                        <li className="calc-result-item" style={{ color: '#7c3aed' }}><span>IGST @ {results.gstPct}%</span><span>{fmt(results.unitGst)}</span></li>
                    )}
                    {results.unitCess > 0 && (
                        <li className="calc-result-item" style={{ color: '#d97706' }}><span>Cess @ {cessPct}%</span><span>{fmt(results.unitCess)}</span></li>
                    )}
                    <li className="calc-result-item" style={{ fontWeight: 800, fontSize: 14 }}>
                        <span>Total (incl. GST{results.unitCess > 0 ? ' + Cess' : ''})</span>
                        <span style={{ color: '#047857' }}>{fmt(results.unitFinal)}</span>
                    </li>
                </ul>

                {/* Multi-quantity total */}
                {quantity > 1 && (
                    <>
                        <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, padding: '10px 0 6px', textTransform: 'uppercase', letterSpacing: 0.5, borderTop: '2px solid #e2e8f0', marginTop: 8 }}>
                            Total for {quantity} units
                        </div>
                        <ul className="calc-result-list">
                            <li className="calc-result-item"><span>Taxable Value</span><span>{fmt(results.totalBase)}</span></li>
                            {supplyType === 'intra' ? (
                                <>
                                    <li className="calc-result-item" style={{ color: '#2563eb' }}><span>Total CGST</span><span>{fmt(results.cgst)}</span></li>
                                    <li className="calc-result-item" style={{ color: '#2563eb' }}><span>Total SGST</span><span>{fmt(results.sgst)}</span></li>
                                </>
                            ) : (
                                <li className="calc-result-item" style={{ color: '#7c3aed' }}><span>Total IGST</span><span>{fmt(results.igst)}</span></li>
                            )}
                            {results.totalCess > 0 && (
                                <li className="calc-result-item" style={{ color: '#d97706' }}><span>Total Cess</span><span>{fmt(results.totalCess)}</span></li>
                            )}
                            <li className="calc-result-item" style={{ fontWeight: 800, fontSize: 15 }}>
                                <span>Grand Total</span>
                                <span style={{ color: '#047857' }}>{fmt(results.grandTotal)}</span>
                            </li>
                        </ul>
                    </>
                )}
            </div>

            {/* ── Section 3: ITC / Net Payable ── */}
            <div className="calc-card" style={{ marginTop: 12 }}>
                <h3 className="calc-title">3. Input Tax Credit (Business) <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 400 }}>(Optional)</span></h3>
                <div className="calc-input-row-2">
                    <div className="calc-form-group">
                        <label className="calc-label">Input GST (ITC claimed):</label>
                        <input type="number" className="calc-input" value={inputGst} onChange={e => setInputGst(parseFloat(e.target.value || '0'))} />
                    </div>
                    <div className="calc-form-group">
                        <label className="calc-label">Output GST (collected):</label>
                        <input type="number" className="calc-input" value={outputGst} onChange={e => setOutputGst(parseFloat(e.target.value || '0'))} />
                    </div>
                </div>
                {results.netGst !== null && (
                    <div style={{
                        background: results.netGst >= 0 ? '#fef2f2' : '#ecfdf5',
                        border: `1px solid ${results.netGst >= 0 ? '#fecaca' : '#a7f3d0'}`,
                        borderRadius: 10,
                        padding: '10px 14px',
                        marginTop: 8,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: results.netGst >= 0 ? '#dc2626' : '#047857' }}>
                            {results.netGst >= 0 ? 'Net GST Payable to Govt' : 'ITC Refund Claimable'}
                        </span>
                        <span style={{ fontSize: 16, fontWeight: 800, color: results.netGst >= 0 ? '#dc2626' : '#047857' }}>
                            {fmt(Math.abs(results.netGst))}
                        </span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div style={{ display: 'flex', alignItems: 'start', gap: 6, marginTop: 10, padding: '0 4px' }}>
                <Info size={12} style={{ color: '#94a3b8', flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                    Intra-state: CGST = SGST = GST/2. Inter-state: IGST = full GST. Cess is applied on base value separately. Net Payable = Output GST − Input GST (ITC). Standard Indian GST rates: 5%, 12%, 18%, 28%.
                </p>
            </div>
        </div>
    );
};
