import React from 'react';

export const CURRENCIES = [
    { label: 'Indian Rupee (INR)', symbol: '₹' },
    { label: 'US Dollar (USD)', symbol: '$' },
    { label: 'Euro (EUR)', symbol: '€' },
    { label: 'British Pound (GBP)', symbol: '£' },
    { label: 'Japanese Yen (JPY)', symbol: '¥' },
    { label: 'Chinese Yuan (CNY)', symbol: '¥' },
    { label: 'Swiss Franc (CHF)', symbol: 'CHF' },
    { label: 'Pakistani Rupee (PKR)', symbol: '₨' },
    { label: 'Sri Lankan Rupee (LKR)', symbol: '₨' },
    { label: 'Bangladeshi Taka (BDT)', symbol: '৳' },
    { label: 'Singapore Dollar (SGD)', symbol: 'S$' },
    { label: 'Hong Kong Dollar (HKD)', symbol: 'HK$' },
    { label: 'Australian Dollar (AUD)', symbol: 'A$' },
    { label: 'Canadian Dollar (CAD)', symbol: 'C$' },
    { label: 'Saudi Riyal (SAR)', symbol: '﷼' },
    { label: 'UAE Dirham (AED)', symbol: 'AED' },
    { label: 'Thai Baht (THB)', symbol: '฿' },
    { label: 'South Korean Won (KRW)', symbol: '₩' },
];

interface CurrencySelectProps {
    value: string;
    onChange: (symbol: string) => void;
}

export const CurrencySelect: React.FC<CurrencySelectProps> = ({ value, onChange }) => (
    <select
        className="calc-select"
        value={value}
        onChange={e => onChange(e.target.value)}
    >
        {CURRENCIES.map(c => (
            <option key={c.label} value={c.symbol}>
                {c.symbol} — {c.label}
            </option>
        ))}
    </select>
);
