import React, { useEffect, useState, useCallback } from 'react';
import { ArrowRightLeft, RefreshCw, TrendingUp, Info } from 'lucide-react';
import './calculators.css';

const CURRENCIES: Record<string, { name: string; flag: string; symbol: string }> = {
    USD: { name: 'US Dollar', flag: '🇺🇸', symbol: '$' },
    EUR: { name: 'Euro', flag: '🇪🇺', symbol: '€' },
    GBP: { name: 'Pound Sterling', flag: '🇬🇧', symbol: '£' },
    INR: { name: 'Indian Rupee', flag: '🇮🇳', symbol: '₹' },
    JPY: { name: 'Japanese Yen', flag: '🇯🇵', symbol: '¥' },
    AUD: { name: 'Australian Dollar', flag: '🇦🇺', symbol: 'A$' },
    CAD: { name: 'Canadian Dollar', flag: '🇨🇦', symbol: 'C$' },
    CHF: { name: 'Swiss Franc', flag: '🇨🇭', symbol: 'Fr' },
    CNY: { name: 'Chinese Yuan', flag: '🇨🇳', symbol: '¥' },
    SGD: { name: 'Singapore Dollar', flag: '🇸🇬', symbol: 'S$' },
    HKD: { name: 'Hong Kong Dollar', flag: '🇭🇰', symbol: 'HK$' },
    KRW: { name: 'South Korean Won', flag: '🇰🇷', symbol: '₩' },
    MXN: { name: 'Mexican Peso', flag: '🇲🇽', symbol: 'MX$' },
    BRL: { name: 'Brazilian Real', flag: '🇧🇷', symbol: 'R$' },
    ZAR: { name: 'South African Rand', flag: '🇿🇦', symbol: 'R' },
    SEK: { name: 'Swedish Krona', flag: '🇸🇪', symbol: 'kr' },
    NOK: { name: 'Norwegian Krone', flag: '🇳🇴', symbol: 'kr' },
    DKK: { name: 'Danish Krone', flag: '🇩🇰', symbol: 'kr' },
    NZD: { name: 'New Zealand Dollar', flag: '🇳🇿', symbol: 'NZ$' },
    THB: { name: 'Thai Baht', flag: '🇹🇭', symbol: '฿' },
    MYR: { name: 'Malaysian Ringgit', flag: '🇲🇾', symbol: 'RM' },
    IDR: { name: 'Indonesian Rupiah', flag: '🇮🇩', symbol: 'Rp' },
    PHP: { name: 'Philippine Peso', flag: '🇵🇭', symbol: '₱' },
    PLN: { name: 'Polish Złoty', flag: '🇵🇱', symbol: 'zł' },
    CZK: { name: 'Czech Koruna', flag: '🇨🇿', symbol: 'Kč' },
    HUF: { name: 'Hungarian Forint', flag: '🇭🇺', symbol: 'Ft' },
    RON: { name: 'Romanian Leu', flag: '🇷🇴', symbol: 'lei' },
    BGN: { name: 'Bulgarian Lev', flag: '🇧🇬', symbol: 'лв' },
    ISK: { name: 'Icelandic Króna', flag: '🇮🇸', symbol: 'kr' },
    TRY: { name: 'Turkish Lira', flag: '🇹🇷', symbol: '₺' },
    ILS: { name: 'Israeli Shekel', flag: '🇮🇱', symbol: '₪' },
};

const POPULAR = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD', 'SGD'];

const fmtNum = (n: number, decimals = 2) => {
    if (Math.abs(n) >= 1000) return n.toLocaleString('en-IN', { maximumFractionDigits: decimals });
    if (Math.abs(n) < 0.01) return n.toFixed(6);
    return n.toFixed(decimals);
};

export const CurrencyCalculator: React.FC = () => {
    const allCodes = Object.keys(CURRENCIES).sort();
    const [amount, setAmount] = useState<string>('1');
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('INR');
    const [allRates, setAllRates] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [lastUpdated, setLastUpdated] = useState('');

    const fetchRates = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`https://api.frankfurter.dev/v1/latest?from=${fromCurrency}`);
            if (!res.ok) throw new Error('API error');
            const data = await res.json();
            setAllRates(data.rates);
            setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
        } catch {
            setError('Failed to fetch rates. Check connection.');
            setAllRates({});
        } finally {
            setLoading(false);
        }
    }, [fromCurrency]);

    useEffect(() => { fetchRates(); }, [fetchRates]);

    const swap = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    const parsed = parseFloat(amount) || 0;
    const rate = allRates[toCurrency] || 0;
    const converted = parsed * rate;
    const inverseRate = rate > 0 ? 1 / rate : 0;

    const from = CURRENCIES[fromCurrency] || { name: fromCurrency, flag: '', symbol: '' };
    const to = CURRENCIES[toCurrency] || { name: toCurrency, flag: '', symbol: '' };

    return (
        <div className="calc-wrapper" style={{ maxWidth: 580 }}>
            <div className="calc-header">
                <div className="calc-header-icon" style={{ background: '#eff6ff', color: '#2563eb' }}><ArrowRightLeft size={22} /></div>
                <div><h2 className="calc-header-title">Currency Converter</h2><p className="calc-header-desc">Live exchange rates • 33 currencies</p></div>
            </div>

            {/* ── Conversion Card ── */}
            <div className="calc-card">
                {/* Amount Input */}
                <div className="calc-form-group">
                    <label className="calc-label">Amount</label>
                    <input
                        type="number"
                        className="calc-input"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        min="0"
                        placeholder="Enter amount"
                        style={{ fontSize: 18, fontWeight: 700, padding: '12px 14px' }}
                    />
                </div>

                {/* From / Swap / To Row */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginTop: 8 }}>
                    {/* FROM */}
                    <div className="calc-form-group" style={{ flex: 1 }}>
                        <label className="calc-label">{from.flag} From</label>
                        <select className="calc-select" value={fromCurrency} onChange={e => setFromCurrency(e.target.value)}
                            style={{ fontSize: 14, fontWeight: 600, padding: '10px 12px' }}>
                            {allCodes.map(c => (
                                <option key={c} value={c}>{c} – {CURRENCIES[c]?.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* SWAP BUTTON */}
                    <button
                        onClick={swap}
                        style={{
                            width: 42, height: 42, borderRadius: 12,
                            border: '2px solid #e2e8f0', background: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', flexShrink: 0, marginBottom: 4,
                            transition: 'all 0.2s',
                        }}
                        onMouseOver={e => { (e.target as HTMLElement).style.background = '#eff6ff'; (e.target as HTMLElement).style.borderColor = '#3b82f6'; }}
                        onMouseOut={e => { (e.target as HTMLElement).style.background = '#fff'; (e.target as HTMLElement).style.borderColor = '#e2e8f0'; }}
                        title="Swap currencies"
                    >
                        <ArrowRightLeft size={18} style={{ color: '#3b82f6' }} />
                    </button>

                    {/* TO */}
                    <div className="calc-form-group" style={{ flex: 1 }}>
                        <label className="calc-label">{to.flag} To</label>
                        <select className="calc-select" value={toCurrency} onChange={e => setToCurrency(e.target.value)}
                            style={{ fontSize: 14, fontWeight: 600, padding: '10px 12px' }}>
                            {allCodes.map(c => (
                                <option key={c} value={c}>{c} – {CURRENCIES[c]?.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Popular Currency Shortcuts */}
                <div style={{ marginTop: 10 }}>
                    <p style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Popular</p>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                        {POPULAR.filter(c => c !== fromCurrency).map(c => (
                            <button
                                key={c}
                                onClick={() => setToCurrency(c)}
                                style={{
                                    padding: '5px 10px',
                                    borderRadius: 8,
                                    border: toCurrency === c ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                    background: toCurrency === c ? '#eff6ff' : '#f8fafc',
                                    color: toCurrency === c ? '#2563eb' : '#64748b',
                                    fontWeight: 600,
                                    fontSize: 11,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                }}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Conversion Result ── */}
            {loading ? (
                <div style={{
                    textAlign: 'center', padding: '24px 16px',
                    background: '#f8fafc', borderRadius: 14, marginTop: 12,
                }}>
                    <RefreshCw size={20} style={{ color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
                    <p style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>Fetching live rates...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                </div>
            ) : error ? (
                <div style={{
                    textAlign: 'center', padding: '16px',
                    background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 14, marginTop: 12,
                    color: '#dc2626', fontSize: 13, fontWeight: 600,
                }}>{error}</div>
            ) : rate > 0 && (
                <div style={{ marginTop: 12 }}>
                    {/* Hero Result */}
                    <div style={{
                        background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
                        borderRadius: 14,
                        padding: '22px 20px',
                        color: '#fff',
                        textAlign: 'center',
                    }}>
                        {/* From amount */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
                            <span style={{ fontSize: 28 }}>{from.flag}</span>
                            <div>
                                <p style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>
                                    {from.symbol}{fmtNum(parsed)} {fromCurrency}
                                </p>
                            </div>
                        </div>

                        {/* Arrow */}
                        <div style={{ margin: '6px 0', opacity: 0.5 }}>
                            <TrendingUp size={16} />
                        </div>

                        {/* To amount */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            <span style={{ fontSize: 28 }}>{to.flag}</span>
                            <div>
                                <p style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5 }}>
                                    {to.symbol}{fmtNum(converted)} {toCurrency}
                                </p>
                            </div>
                        </div>

                        {/* Rate info */}
                        <div style={{
                            display: 'flex', justifyContent: 'center', gap: 16,
                            marginTop: 12, paddingTop: 10,
                            borderTop: '1px solid rgba(255,255,255,0.15)',
                        }}>
                            <div>
                                <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Rate</p>
                                <p style={{ fontSize: 13, fontWeight: 700 }}>1 {fromCurrency} = {fmtNum(rate, 4)} {toCurrency}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Inverse</p>
                                <p style={{ fontSize: 13, fontWeight: 700 }}>1 {toCurrency} = {fmtNum(inverseRate, 4)} {fromCurrency}</p>
                            </div>
                        </div>

                        {lastUpdated && (
                            <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
                                Updated at {lastUpdated}
                            </p>
                        )}
                    </div>

                    {/* Quick Conversion Table */}
                    <div className="calc-card" style={{ marginTop: 12 }}>
                        <h4 style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Quick Reference
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                            {[1, 5, 10, 50, 100, 500, 1000, 5000].map(n => (
                                <div key={n} style={{
                                    display: 'flex', justifyContent: 'space-between',
                                    padding: '6px 10px', borderRadius: 8,
                                    background: n === parsed ? '#eff6ff' : '#f8fafc',
                                    border: n === parsed ? '1px solid #bfdbfe' : '1px solid transparent',
                                    fontSize: 12, fontWeight: n === parsed ? 700 : 500,
                                    color: n === parsed ? '#2563eb' : '#334155',
                                }}>
                                    <span>{from.symbol}{n.toLocaleString()}</span>
                                    <span>{to.symbol}{fmtNum(n * rate)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── All Rates Grid ── */}
            {Object.keys(allRates).length > 0 && (
                <div className="calc-card" style={{ marginTop: 12 }}>
                    <h4 style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        All Rates (1 {fromCurrency})
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                        {Object.entries(allRates)
                            .sort(([a], [b]) => a.localeCompare(b))
                            .map(([code, val]) => {
                                return (
                                    <div
                                        key={code}
                                        onClick={() => setToCurrency(code)}
                                        style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            padding: '7px 10px', borderRadius: 8, cursor: 'pointer',
                                            background: toCurrency === code ? '#eff6ff' : 'transparent',
                                            border: toCurrency === code ? '1px solid #bfdbfe' : '1px solid transparent',
                                            transition: 'all 0.15s',
                                        }}
                                    >
                                        <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>
                                            {code}
                                        </span>
                                        <span style={{ fontSize: 12, fontWeight: 500, color: '#64748b' }}>
                                            {fmtNum(val, 4)}
                                        </span>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', alignItems: 'start', gap: 6, marginTop: 10, padding: '0 4px' }}>
                <Info size={12} style={{ color: '#94a3b8', flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                    Rates from European Central Bank via Frankfurter API. Updated on banking days. For indicative purposes only — not for financial transactions.
                </p>
            </div>
        </div>
    );
};
