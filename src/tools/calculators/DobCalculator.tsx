import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, Cake, Star } from 'lucide-react';
import './calculators.css';

const ZODIAC: { sign: string; emoji: string; from: [number, number]; to: [number, number] }[] = [
    { sign: 'Capricorn', emoji: '♑', from: [12, 22], to: [1, 19] },
    { sign: 'Aquarius', emoji: '♒', from: [1, 20], to: [2, 18] },
    { sign: 'Pisces', emoji: '♓', from: [2, 19], to: [3, 20] },
    { sign: 'Aries', emoji: '♈', from: [3, 21], to: [4, 19] },
    { sign: 'Taurus', emoji: '♉', from: [4, 20], to: [5, 20] },
    { sign: 'Gemini', emoji: '♊', from: [5, 21], to: [6, 20] },
    { sign: 'Cancer', emoji: '♋', from: [6, 21], to: [7, 22] },
    { sign: 'Leo', emoji: '♌', from: [7, 23], to: [8, 22] },
    { sign: 'Virgo', emoji: '♍', from: [8, 23], to: [9, 22] },
    { sign: 'Libra', emoji: '♎', from: [9, 23], to: [10, 22] },
    { sign: 'Scorpio', emoji: '♏', from: [10, 23], to: [11, 21] },
    { sign: 'Sagittarius', emoji: '♐', from: [11, 22], to: [12, 21] },
];

const getZodiac = (m: number, d: number) => {
    for (const z of ZODIAC) {
        if (z.sign === 'Capricorn') {
            if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return z;
        } else {
            if ((m === z.from[0] && d >= z.from[1]) || (m === z.to[0] && d <= z.to[1])) return z;
        }
    }
    return ZODIAC[0];
};

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const fmt = (n: number) => n.toLocaleString('en-IN');

export const DobCalculator: React.FC = () => {
    const [dob, setDob] = useState('');
    const [now, setNow] = useState(() => {
        const t = new Date();
        return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
    });

    // Live tick
    const [tick, setTick] = useState(0);
    useEffect(() => {
        if (!dob) return;
        const id = setInterval(() => setTick(t => t + 1), 1000);
        return () => clearInterval(id);
    }, [dob]);

    const result = useMemo(() => {
        if (!dob) return null;
        const birth = new Date(dob);
        const today = new Date();

        if (birth > today) return null;

        // Age calc
        let years = today.getFullYear() - birth.getFullYear();
        let months = today.getMonth() - birth.getMonth();
        let days = today.getDate() - birth.getDate();
        if (days < 0) { months--; days += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); }
        if (months < 0) { years--; months += 12; }

        // Totals
        const diffMs = today.getTime() - birth.getTime();
        const totalDays = Math.floor(diffMs / 86400000);
        const totalWeeks = Math.floor(totalDays / 7);
        const totalHours = Math.floor(diffMs / 3600000);
        const totalMinutes = Math.floor(diffMs / 60000);
        const totalSeconds = Math.floor(diffMs / 1000);

        // Next birthday
        let nextBday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
        if (nextBday <= today) nextBday = new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate());
        const daysToNext = Math.ceil((nextBday.getTime() - today.getTime()) / 86400000);
        const turningAge = nextBday.getFullYear() - birth.getFullYear();

        // Born day
        const bornDay = DAYS[birth.getDay()];

        // Zodiac
        const zodiac = getZodiac(birth.getMonth() + 1, birth.getDate());

        // Life stats
        const heartbeats = Math.round(totalMinutes * 72); // avg 72 bpm
        const breaths = Math.round(totalMinutes * 16); // 16 breaths/min
        const sleepDays = Math.round(totalDays * 0.33);

        return {
            years, months, days,
            totalDays, totalWeeks, totalHours, totalMinutes, totalSeconds,
            daysToNext, turningAge, bornDay, zodiac,
            heartbeats, breaths, sleepDays,
            nextBday,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dob, now, tick]);

    const statBox = (label: string, value: string, color = '#334155') => (
        <div style={{
            background: '#f8fafc', borderRadius: 10, padding: '10px 12px',
            textAlign: 'center', border: '1px solid #e2e8f0',
        }}>
            <p style={{ fontSize: 18, fontWeight: 900, color, letterSpacing: -0.5 }}>{value}</p>
            <p style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>{label}</p>
        </div>
    );

    return (
        <div className="calc-wrapper" style={{ maxWidth: 520 }}>
            <div className="calc-header">
                <div className="calc-header-icon" style={{ background: '#fef3c7', color: '#d97706' }}><Calendar size={22} /></div>
                <div><h2 className="calc-header-title">DOB / Age Calculator</h2><p className="calc-header-desc">Age • Birthday • Zodiac • Life stats</p></div>
            </div>

            <div className="calc-card">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="calc-form-group">
                        <label className="calc-label">Date of Birth</label>
                        <input type="date" className="calc-input" value={dob} onChange={e => setDob(e.target.value)} max={now}
                            style={{ fontSize: 14, fontWeight: 700 }} />
                    </div>
                    <div className="calc-form-group">
                        <label className="calc-label">As of Date</label>
                        <input type="date" className="calc-input" value={now} onChange={e => setNow(e.target.value)}
                            style={{ fontSize: 14, fontWeight: 700 }} />
                    </div>
                </div>
            </div>

            {result && (
                <>
                    {/* Hero – Age */}
                    <div style={{
                        background: 'linear-gradient(135deg, #92400e, #d97706)',
                        borderRadius: 14, padding: '22px 20px',
                        color: '#fff', textAlign: 'center', marginTop: 12,
                    }}>
                        <p style={{ fontSize: 9, opacity: 0.5, textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1 }}>Your Age</p>
                        <p style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1 }}>
                            {result.years} yrs, {result.months} mo, {result.days} days
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12, borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 10 }}>
                            <div>
                                <p style={{ fontSize: 9, opacity: 0.5, textTransform: 'uppercase' }}>Born on</p>
                                <p style={{ fontSize: 13, fontWeight: 700 }}>{result.bornDay}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: 9, opacity: 0.5, textTransform: 'uppercase' }}>Zodiac</p>
                                <p style={{ fontSize: 13, fontWeight: 700 }}>{result.zodiac.emoji} {result.zodiac.sign}</p>
                            </div>
                        </div>
                    </div>

                    {/* Next Birthday */}
                    <div style={{
                        background: '#fef3c7', borderRadius: 12, padding: '14px 16px',
                        marginTop: 10, display: 'flex', alignItems: 'center', gap: 12,
                        border: '1px solid #fde68a',
                    }}>
                        <Cake size={22} style={{ color: '#d97706', flexShrink: 0 }} />
                        <div>
                            <p style={{ fontSize: 13, fontWeight: 800, color: '#92400e' }}>
                                {result.daysToNext === 0 ? '🎉 Happy Birthday!' : `${result.daysToNext} days to your birthday!`}
                            </p>
                            <p style={{ fontSize: 11, color: '#b45309' }}>
                                Turning {result.turningAge} on {result.nextBday.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    {/* Time Lived Grid */}
                    <div className="calc-card" style={{ marginTop: 10 }}>
                        <h4 style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                            You Have Lived
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                            {statBox('Total Days', fmt(result.totalDays))}
                            {statBox('Weeks', fmt(result.totalWeeks))}
                            {statBox('Hours', fmt(result.totalHours))}
                            {statBox('Minutes', fmt(result.totalMinutes))}
                        </div>
                        <div style={{ marginTop: 6, background: '#f1f5f9', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
                            <p style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                                {fmt(result.totalSeconds)} <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>seconds</span>
                            </p>
                        </div>
                    </div>

                    {/* Fun Life Stats */}
                    <div className="calc-card" style={{ marginTop: 10 }}>
                        <h4 style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                            <Star size={12} style={{ display: 'inline', marginRight: 4 }} />Life Statistics (Approx)
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                            {statBox('Heartbeats', fmt(result.heartbeats), '#dc2626')}
                            {statBox('Breaths', fmt(result.breaths), '#2563eb')}
                            {statBox('Days Slept', fmt(result.sleepDays), '#7c3aed')}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
