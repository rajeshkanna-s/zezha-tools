import React, { useState, useMemo } from 'react';
import { TrendingUp, Building2, BarChart3, DollarSign, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import './calculators.css';

// ─── Industry Multiples (hardcoded lookup tables) ────────────────────────────
type BusinessType = 'trading' | 'manufacturing' | 'it-software' | 'restaurant' | 'healthcare' | 'construction' | 'retail' | 'professional-services' | 'ecommerce' | 'other';

interface MultipleRange { min: number; max: number; }

const EARNINGS_MULTIPLES: Record<BusinessType, MultipleRange> = {
    'trading': { min: 2, max: 4 },
    'manufacturing': { min: 3, max: 6 },
    'it-software': { min: 5, max: 12 },
    'restaurant': { min: 1.5, max: 3 },
    'healthcare': { min: 4, max: 7 },
    'construction': { min: 3, max: 5 },
    'retail': { min: 1.5, max: 3 },
    'professional-services': { min: 4, max: 8 },
    'ecommerce': { min: 3, max: 8 },
    'other': { min: 2, max: 5 },
};

const REVENUE_MULTIPLES: Record<BusinessType, MultipleRange> = {
    'trading': { min: 0.3, max: 0.6 },
    'manufacturing': { min: 0.5, max: 1 },
    'it-software': { min: 1, max: 3 },
    'restaurant': { min: 0.3, max: 0.6 },
    'healthcare': { min: 0.5, max: 1.5 },
    'construction': { min: 0.3, max: 0.7 },
    'retail': { min: 0.3, max: 0.6 },
    'professional-services': { min: 0.5, max: 1 },
    'ecommerce': { min: 0.8, max: 2 },
    'other': { min: 0.4, max: 0.8 },
};

const BUSINESS_LABELS: Record<BusinessType, string> = {
    'trading': 'Trading',
    'manufacturing': 'Manufacturing',
    'it-software': 'IT & Software / SaaS',
    'restaurant': 'Restaurant & Food',
    'healthcare': 'Healthcare / Clinic',
    'construction': 'Construction',
    'retail': 'Retail',
    'professional-services': 'Professional Services',
    'ecommerce': 'E-commerce',
    'other': 'Other',
};

const DEFAULT_REPLACEMENT_SALARY = 600000; // ₹6L/year

// ─── Result Types ────────────────────────────────────────────────────────────
interface ValuationResult {
    assetValue: number;
    earningsValue: number;
    revenueValue: number;
    adjustedEarningsValue: number;
    adjustedProfit: number;
    earningsMultipleUsed: number;
    earningsRange: MultipleRange;
    revenueMultipleUsed: number;
    revenueRange: MultipleRange;
    rangeMin: number;
    rangeMax: number;
    grade: string;
    gradeColor: string;
    gradeDesc: string;
    insight: string;
    profitMargin: number;
    multiplePosition: string;
    negativeAsset: boolean;
    adjustments: string[];
}

// ─── Component ───────────────────────────────────────────────────────────────
export const BusinessValuationCalculator: React.FC = () => {
    // Step 1 — Business Profile
    const [businessType, setBusinessType] = useState<BusinessType>('trading');
    const [businessAge, setBusinessAge] = useState(5);
    const [employees, setEmployees] = useState(10);

    // Step 2 — Financial Numbers
    const [annualRevenue, setAnnualRevenue] = useState(5500000);
    const [netProfit, setNetProfit] = useState(850000);
    const [totalAssets, setTotalAssets] = useState(3500000);
    const [totalLiabilities, setTotalLiabilities] = useState(1200000);
    const [ownerSalary, setOwnerSalary] = useState(900000);

    // Step 3 — Optional
    const [revenueGrowth, setRevenueGrowth] = useState(15);
    const [hasRecurring, setHasRecurring] = useState(false);
    const [hasIP, setHasIP] = useState(false);

    const fmt = (n: number) => {
        if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
        if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
        return `₹${n.toLocaleString('en-IN')}`;
    };

    // Auto-calculate
    const result = useMemo((): ValuationResult | null => {
        if (annualRevenue <= 0 && netProfit <= 0) return null;

        const adjustedProfit = netProfit + ownerSalary - DEFAULT_REPLACEMENT_SALARY;

        let assetValue = totalAssets - totalLiabilities;
        const negativeAsset = assetValue < 0;
        if (negativeAsset) assetValue = 0;

        const eRange = EARNINGS_MULTIPLES[businessType];
        const eMid = (eRange.min + eRange.max) / 2;
        const earningsValue = Math.max(0, adjustedProfit * eMid);

        const rRange = REVENUE_MULTIPLES[businessType];
        const rMid = (rRange.min + rRange.max) / 2;
        const revenueValue = annualRevenue * rMid;

        let adjustedEarnings = earningsValue;
        const adjustments: string[] = [];

        if (revenueGrowth > 40) { adjustedEarnings *= 1.25; adjustments.push('Growth >40%: +25% premium applied'); }
        else if (revenueGrowth > 20) { adjustedEarnings *= 1.15; adjustments.push('Growth >20%: +15% premium applied'); }
        if (hasRecurring) { adjustedEarnings *= 1.10; adjustments.push('Recurring contracts: +10% premium'); }
        if (hasIP) { adjustedEarnings *= 1.10; adjustments.push('Proprietary IP/Brand: +10% premium'); }
        if (businessAge < 2) { adjustedEarnings *= 0.80; adjustments.push('Business <2 years: −20% risk discount'); }
        else if (businessAge > 10) { adjustedEarnings *= 1.10; adjustments.push('Business >10 years: +10% stability premium'); }

        // Employee productivity adjusters
        if (employees > 0) {
            const revPerEmp = annualRevenue / employees;
            if (revPerEmp > 5000000) { adjustedEarnings *= 1.05; adjustments.push(`High productivity (₹${(revPerEmp/100000).toFixed(0)}L/employee): +5% premium`); }
        }

        const rangeMin = Math.min(assetValue, adjustedEarnings, revenueValue);
        const rangeMax = Math.max(assetValue, adjustedEarnings, revenueValue);

        const effectiveMultiple = adjustedProfit > 0 ? adjustedEarnings / adjustedProfit : 0;
        let multiplePosition = 'N/A';
        if (adjustedProfit > 0) {
            if (effectiveMultiple >= eRange.max) multiplePosition = 'Above industry range';
            else if (effectiveMultiple > eMid) multiplePosition = 'Upper half of range';
            else if (effectiveMultiple >= eRange.min) multiplePosition = 'Within normal range ✅';
            else multiplePosition = 'Below industry range';
        }

        const profitMargin = annualRevenue > 0 ? (netProfit / annualRevenue) * 100 : 0;
        let grade: string, gradeColor: string, gradeDesc: string;
        if (effectiveMultiple >= eRange.max * 0.8 && adjustedProfit > 0) { grade = '🏆 Premium Business'; gradeColor = '#047857'; gradeDesc = 'Strong fundamentals, buyer-ready'; }
        else if (effectiveMultiple >= eMid && adjustedProfit > 0) { grade = '✅ Fair Value'; gradeColor = '#2563eb'; gradeDesc = 'Healthy; typical market transaction price'; }
        else if (adjustedProfit > 0) { grade = '⚠️ Below Average'; gradeColor = '#d97706'; gradeDesc = 'Improve profitability before selling'; }
        else { grade = '🔴 Undervalued / Distressed'; gradeColor = '#dc2626'; gradeDesc = 'Serious issues to address first'; }

        let insight = '';
        if (negativeAsset) insight = 'Negative net worth means Asset Method gives ₹0 floor. Focus on earnings-based valuation.';
        else if (profitMargin < 5 && annualRevenue > 0) { const iv = annualRevenue * 0.10 * eMid; insight = `Low margin (${profitMargin.toFixed(1)}%). Improving to 10% → ~${fmt(iv)}.`; }
        else if (revenueGrowth > 30) insight = 'Strong growth adding a premium. Maintain 1 more year to unlock higher multiples.';
        else if (adjustedProfit > netProfit * 1.3) insight = `Owner salary adjustment added ₹${((ownerSalary - DEFAULT_REPLACEMENT_SALARY) / 100000).toFixed(1)}L to adjusted profit.`;
        else if (businessAge < 3) insight = 'Young business age applies risk discount. Crossing 3-year mark will improve buyer confidence.';
        else insight = `Valued at ~${effectiveMultiple.toFixed(1)}× adjusted profit. ${BUSINESS_LABELS[businessType]} benchmark: ${eRange.min}×–${eRange.max}×.`;

        return {
            assetValue, earningsValue, revenueValue, adjustedEarningsValue: adjustedEarnings, adjustedProfit,
            earningsMultipleUsed: eMid, earningsRange: eRange, revenueMultipleUsed: rMid, revenueRange: rRange,
            rangeMin, rangeMax, grade, gradeColor, gradeDesc, insight, profitMargin, multiplePosition, negativeAsset, adjustments,
        };
    }, [businessType, businessAge, employees, annualRevenue, netProfit, totalAssets, totalLiabilities, ownerSalary, revenueGrowth, hasRecurring, hasIP]);

    return (
        <div className="calc-wrapper" style={{ maxWidth: 620 }}>
            <div className="calc-header">
                <div className="calc-header-icon" style={{ background: '#dbeafe', color: '#2563eb' }}><Building2 size={22} /></div>
                <div><h2 className="calc-header-title">Business Valuation Calculator</h2><p className="calc-header-desc">Estimate your business value using 3 methods — Asset, Earnings & Revenue</p></div>
            </div>

            {/* ── Step 1: Business Profile ── */}
            <div className="calc-card">
                <h3 className="calc-title">1. Business Profile</h3>
                <div className="calc-form-group">
                    <label className="calc-label">Business Type:</label>
                    <select className="calc-select" value={businessType} onChange={e => setBusinessType(e.target.value as BusinessType)}>
                        {Object.entries(BUSINESS_LABELS).map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                        ))}
                    </select>
                </div>
                <div className="calc-input-row-2">
                    <div className="calc-form-group">
                        <label className="calc-label">Business Age (years):</label>
                        <input type="number" className="calc-input" value={businessAge} min={0} onChange={e => setBusinessAge(parseFloat(e.target.value || '0'))} />
                    </div>
                    <div className="calc-form-group">
                        <label className="calc-label">No. of Employees:</label>
                        <input type="number" className="calc-input" value={employees} min={0} onChange={e => setEmployees(parseFloat(e.target.value || '0'))} />
                    </div>
                </div>
            </div>

            {/* ── Step 2: Financial Numbers ── */}
            <div className="calc-card">
                <h3 className="calc-title">2. Financial Numbers</h3>
                <div className="calc-input-row-2">
                    <div className="calc-form-group">
                        <label className="calc-label">Annual Revenue (₹):</label>
                        <input type="number" className="calc-input" value={annualRevenue} onChange={e => setAnnualRevenue(parseFloat(e.target.value || '0'))} />
                    </div>
                    <div className="calc-form-group">
                        <label className="calc-label">Net Profit After Tax (₹):</label>
                        <input type="number" className="calc-input" value={netProfit} onChange={e => setNetProfit(parseFloat(e.target.value || '0'))} />
                    </div>
                </div>
                <div className="calc-input-row-2">
                    <div className="calc-form-group">
                        <label className="calc-label">Total Assets (₹):</label>
                        <input type="number" className="calc-input" value={totalAssets} onChange={e => setTotalAssets(parseFloat(e.target.value || '0'))} />
                    </div>
                    <div className="calc-form-group">
                        <label className="calc-label">Total Liabilities (₹):</label>
                        <input type="number" className="calc-input" value={totalLiabilities} onChange={e => setTotalLiabilities(parseFloat(e.target.value || '0'))} />
                    </div>
                </div>
                <div className="calc-form-group">
                    <label className="calc-label">Owner's Salary Drawn (₹/year):</label>
                    <input type="number" className="calc-input" value={ownerSalary} onChange={e => setOwnerSalary(parseFloat(e.target.value || '0'))} />
                    <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>Market replacement salary = ₹6,00,000/year. Difference adjusts valuation profit.</p>
                </div>
            </div>

            {/* ── Step 3: Optional Boosters ── */}
            <div className="calc-card">
                <h3 className="calc-title">3. Growth & Premium Adjusters <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 400 }}>(Optional)</span></h3>
                <div className="calc-form-group">
                    <label className="calc-label">YoY Revenue Growth % (avg last 2 years):</label>
                    <input type="number" className="calc-input" value={revenueGrowth} onChange={e => setRevenueGrowth(parseFloat(e.target.value || '0'))} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 6 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#475569', cursor: 'pointer' }}>
                        <input type="checkbox" checked={hasRecurring} onChange={e => setHasRecurring(e.target.checked)}
                            style={{ width: 16, height: 16, accentColor: '#2563eb' }} />
                        Recurring contracts or long-term clients?
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#475569', cursor: 'pointer' }}>
                        <input type="checkbox" checked={hasIP} onChange={e => setHasIP(e.target.checked)}
                            style={{ width: 16, height: 16, accentColor: '#2563eb' }} />
                        Proprietary product, brand, or IP?
                    </label>
                </div>
            </div>



            {/* ── Results ── */}
            {result && (
                <div style={{ marginTop: 16 }}>
                    {/* Valuation Range Hero */}
                    <div style={{
                        background: 'linear-gradient(135deg, #1e293b, #334155)',
                        borderRadius: 14,
                        padding: '24px 20px',
                        color: '#fff',
                        textAlign: 'center',
                        marginBottom: 14,
                    }}>
                        <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 4 }}>Your Business Valuation Range</p>
                        <p style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.5 }}>
                            {fmt(result.rangeMin)} — {fmt(result.rangeMax)}
                        </p>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            marginTop: 10,
                            padding: '5px 14px',
                            borderRadius: 999,
                            background: result.gradeColor + '22',
                            color: result.gradeColor === '#047857' ? '#a7f3d0' : result.gradeColor === '#2563eb' ? '#bfdbfe' : result.gradeColor === '#d97706' ? '#fde68a' : '#fca5a5',
                            fontSize: 13,
                            fontWeight: 700,
                        }}>
                            {result.grade}
                        </div>
                        <p style={{ fontSize: 11, color: '#cbd5e1', marginTop: 6 }}>{result.gradeDesc}</p>
                    </div>

                    {/* 3 Method Breakdown */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                        {/* Asset */}
                        <div style={{ background: '#f8fafc', borderRadius: 10, padding: 14, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
                                <DollarSign size={14} style={{ color: '#64748b' }} />
                                <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Asset Method</span>
                            </div>
                            <p style={{ fontSize: 18, fontWeight: 800, color: '#334155' }}>{fmt(result.assetValue)}</p>
                            <p style={{ fontSize: 9, color: '#94a3b8', marginTop: 4 }}>Conservative floor</p>
                            {result.negativeAsset && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'center', marginTop: 6 }}>
                                    <AlertTriangle size={10} style={{ color: '#ef4444' }} />
                                    <span style={{ fontSize: 9, color: '#ef4444', fontWeight: 600 }}>Negative net worth</span>
                                </div>
                            )}
                        </div>

                        {/* Earnings — Primary */}
                        <div style={{ background: '#eff6ff', borderRadius: 10, padding: 14, border: '2px solid #3b82f6', textAlign: 'center', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', background: '#3b82f6', color: '#fff', fontSize: 8, fontWeight: 800, padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                Primary
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
                                <BarChart3 size={14} style={{ color: '#2563eb' }} />
                                <span style={{ fontSize: 10, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>Earnings</span>
                            </div>
                            <p style={{ fontSize: 18, fontWeight: 800, color: '#1e40af' }}>{fmt(result.adjustedEarningsValue)}</p>
                            <p style={{ fontSize: 9, color: '#3b82f6', marginTop: 4 }}>Most relevant ({result.earningsMultipleUsed.toFixed(1)}× multiple)</p>
                        </div>

                        {/* Revenue */}
                        <div style={{ background: '#f8fafc', borderRadius: 10, padding: 14, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
                                <TrendingUp size={14} style={{ color: '#64748b' }} />
                                <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Revenue</span>
                            </div>
                            <p style={{ fontSize: 18, fontWeight: 800, color: '#334155' }}>{fmt(result.revenueValue)}</p>
                            <p style={{ fontSize: 9, color: '#94a3b8', marginTop: 4 }}>Ceiling / growth potential</p>
                        </div>
                    </div>

                    {/* Detailed Breakdown */}
                    <div className="calc-result-card">
                        <h4 className="calc-result-title">Detailed Breakdown</h4>
                        <ul className="calc-result-list">
                            <li className="calc-result-item"><span>Adjusted Net Profit</span><span>{fmt(result.adjustedProfit)}</span></li>
                            <li className="calc-result-item"><span>Profit Margin</span><span>{result.profitMargin.toFixed(1)}%</span></li>
                            {employees > 0 && (
                                <>
                                    <li className="calc-result-item" style={{ color: '#2563eb' }}><span>Revenue / Employee</span><span>{fmt(annualRevenue / employees)}</span></li>
                                    <li className="calc-result-item" style={{ color: '#2563eb' }}><span>Profit / Employee</span><span>{fmt(netProfit / employees)}</span></li>
                                </>
                            )}
                            <li className="calc-result-item"><span>Earnings Multiple Used</span><span>{result.earningsMultipleUsed.toFixed(1)}× (range: {result.earningsRange.min}–{result.earningsRange.max}×)</span></li>
                            <li className="calc-result-item"><span>Revenue Multiple Used</span><span>{result.revenueMultipleUsed.toFixed(1)}× (range: {result.revenueRange.min}–{result.revenueRange.max}×)</span></li>
                            <li className="calc-result-item"><span>Industry Position</span><span>{result.multiplePosition}</span></li>
                        </ul>
                    </div>

                    {/* Adjustments Applied */}
                    {result.adjustments.length > 0 && (
                        <div style={{ background: '#fefce8', border: '1px solid #fef08a', borderRadius: 10, padding: 12, marginTop: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                                <CheckCircle2 size={13} style={{ color: '#ca8a04' }} />
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#854d0e' }}>Score Adjustments Applied</span>
                            </div>
                            {result.adjustments.map((a, i) => (
                                <p key={i} style={{ fontSize: 11, color: '#713f12', marginLeft: 19, marginBottom: 2 }}>• {a}</p>
                            ))}
                        </div>
                    )}

                    {/* Key Insight */}
                    <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: 12, marginTop: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'start', gap: 6 }}>
                            <Info size={13} style={{ color: '#2563eb', flexShrink: 0, marginTop: 1 }} />
                            <p style={{ fontSize: 11, color: '#1e40af', lineHeight: 1.5, fontWeight: 500 }}>{result.insight}</p>
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <p style={{ fontSize: 9, color: '#94a3b8', marginTop: 12, lineHeight: 1.5, padding: '0 4px', textAlign: 'center' }}>
                        ⚖️ This is an indicative valuation for reference only. For legal, investment, or sale purposes, engage a SEBI-registered Category I Merchant Banker or a qualified Chartered Accountant.
                    </p>
                </div>
            )}
        </div>
    );
};
