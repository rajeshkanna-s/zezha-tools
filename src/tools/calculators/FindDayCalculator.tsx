import React, { useState, useMemo } from 'react';
import { CalendarDays } from 'lucide-react';
import './calculators.css';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_COLORS: Record<string, string> = {
    Sunday: '#dc2626', Monday: '#f59e0b', Tuesday: '#ef4444',
    Wednesday: '#22c55e', Thursday: '#f59e0b', Friday: '#3b82f6', Saturday: '#8b5cf6',
};

type Mode = 'find' | 'diff';

export const FindDayCalculator: React.FC = () => {
    const [mode, setMode] = useState<Mode>('find');
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const [selectedDate, setSelectedDate] = useState(todayStr);
    const [dateA, setDateA] = useState(todayStr);
    const [dateB, setDateB] = useState(todayStr);

    const findResult = useMemo(() => {
        if (!selectedDate) return null;
        const d = new Date(selectedDate);
        if (isNaN(d.getTime())) return null;

        const dayName = DAYS[d.getDay()];
        const isWeekend = d.getDay() === 0 || d.getDay() === 6;
        const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
        const leap = isLeap(d.getFullYear());

        // Day of year
        const startOfYear = new Date(d.getFullYear(), 0, 0);
        const dayOfYear = Math.floor((d.getTime() - startOfYear.getTime()) / 86400000);
        const totalDaysInYear = leap ? 366 : 365;

        // Quarter
        const quarter = Math.ceil((d.getMonth() + 1) / 3);

        // Week number (ISO)
        const jan1 = new Date(d.getFullYear(), 0, 1);
        const weekNum = Math.ceil((((d.getTime() - jan1.getTime()) / 86400000) + jan1.getDay() + 1) / 7);

        // Days from today
        const diffFromToday = Math.round((d.getTime() - today.getTime()) / 86400000);
        let diffLabel = '';
        if (diffFromToday === 0) diffLabel = 'Today';
        else if (diffFromToday === 1) diffLabel = 'Tomorrow';
        else if (diffFromToday === -1) diffLabel = 'Yesterday';
        else if (diffFromToday > 0) diffLabel = `${diffFromToday} days in the future`;
        else diffLabel = `${Math.abs(diffFromToday)} days ago`;

        return { dayName, isWeekend, leap, dayOfYear, totalDaysInYear, quarter, weekNum, diffLabel, color: DAY_COLORS[dayName] || '#334155' };
    }, [selectedDate]);

    const diffResult = useMemo(() => {
        if (!dateA || !dateB) return null;
        const a = new Date(dateA);
        const b = new Date(dateB);
        if (isNaN(a.getTime()) || isNaN(b.getTime())) return null;

        const diffMs = Math.abs(b.getTime() - a.getTime());
        const totalDays = Math.round(diffMs / 86400000);
        const weeks = Math.floor(totalDays / 7);
        const remainDays = totalDays % 7;
        const months = Math.round(totalDays / 30.44);
        const years = (totalDays / 365.25).toFixed(2);
        const hours = totalDays * 24;
        const weekdays = (() => {
            let count = 0;
            const start = new Date(Math.min(a.getTime(), b.getTime()));
            const end = new Date(Math.max(a.getTime(), b.getTime()));
            const cur = new Date(start);
            while (cur <= end) {
                if (cur.getDay() !== 0 && cur.getDay() !== 6) count++;
                cur.setDate(cur.getDate() + 1);
            }
            return count;
        })();
        const weekends = totalDays - weekdays;

        return { totalDays, weeks, remainDays, months, years, hours, weekdays, weekends };
    }, [dateA, dateB]);

    const statBox = (label: string, value: string) => (
        <div style={{
            background: '#f8fafc', borderRadius: 10, padding: '9px 10px',
            textAlign: 'center', border: '1px solid #e2e8f0',
        }}>
            <p style={{ fontSize: 16, fontWeight: 900, color: '#334155' }}>{value}</p>
            <p style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>{label}</p>
        </div>
    );

    return (
        <div className="calc-wrapper" style={{ maxWidth: 520 }}>
            <div className="calc-header">
                <div className="calc-header-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}><CalendarDays size={22} /></div>
                <div><h2 className="calc-header-title">Find Day Calculator</h2><p className="calc-header-desc">Day finder • Date difference</p></div>
            </div>

            {/* Mode Tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                {[
                    { id: 'find' as Mode, label: 'Find Day' },
                    { id: 'diff' as Mode, label: 'Days Between' },
                ].map(m => (
                    <button key={m.id} onClick={() => setMode(m.id)}
                        style={{
                            flex: 1, padding: '8px 12px', borderRadius: 10,
                            border: mode === m.id ? '2px solid #16a34a' : '1px solid #e2e8f0',
                            background: mode === m.id ? '#f0fdf4' : '#f8fafc',
                            color: mode === m.id ? '#16a34a' : '#64748b',
                            fontWeight: 700, fontSize: 13, cursor: 'pointer',
                        }}>
                        {m.label}
                    </button>
                ))}
            </div>

            {mode === 'find' ? (
                <>
                    <div className="calc-card">
                        <div className="calc-form-group">
                            <label className="calc-label">Select Any Date</label>
                            <input type="date" className="calc-input" value={selectedDate}
                                onChange={e => setSelectedDate(e.target.value)}
                                min="1900-01-01" max="2999-12-31"
                                style={{ fontSize: 14, fontWeight: 700 }} />
                        </div>
                    </div>

                    {findResult && (
                        <>
                            <div style={{
                                background: `linear-gradient(135deg, ${findResult.color}cc, ${findResult.color})`,
                                borderRadius: 14, padding: '22px 20px',
                                color: '#fff', textAlign: 'center', marginTop: 12,
                            }}>
                                <p style={{ fontSize: 9, opacity: 0.6, textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1 }}>Day of the Week</p>
                                <p style={{ fontSize: 32, fontWeight: 900, letterSpacing: -0.5 }}>{findResult.dayName}</p>
                                <div style={{ display: 'inline-block', marginTop: 6, padding: '3px 14px', borderRadius: 20, background: 'rgba(255,255,255,0.2)', fontSize: 11, fontWeight: 700 }}>
                                    {findResult.isWeekend ? '🏖️ Weekend' : '💼 Weekday'}
                                </div>
                                <p style={{ fontSize: 11, opacity: 0.7, marginTop: 8 }}>{findResult.diffLabel}</p>
                            </div>

                            <div className="calc-card" style={{ marginTop: 10 }}>
                                <h4 style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Date Details</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                                    {statBox('Day of Year', `${findResult.dayOfYear}/${findResult.totalDaysInYear}`)}
                                    {statBox('Week No.', `W${findResult.weekNum}`)}
                                    {statBox('Quarter', `Q${findResult.quarter}`)}
                                </div>
                                <div style={{ marginTop: 6, background: '#f1f5f9', borderRadius: 8, padding: '6px 10px', textAlign: 'center', fontSize: 11, color: '#64748b' }}>
                                    {findResult.leap ? '✅ Leap Year' : '❌ Not a Leap Year'}
                                </div>
                            </div>
                        </>
                    )}
                </>
            ) : (
                <>
                    <div className="calc-card">
                        <div className="calc-input-row">
                            <div className="calc-form-group" style={{ flex: 1 }}>
                                <label className="calc-label">From Date</label>
                                <input type="date" className="calc-input" value={dateA} onChange={e => setDateA(e.target.value)}
                                    style={{ fontSize: 14, fontWeight: 700 }} />
                            </div>
                            <div className="calc-form-group" style={{ flex: 1 }}>
                                <label className="calc-label">To Date</label>
                                <input type="date" className="calc-input" value={dateB} onChange={e => setDateB(e.target.value)}
                                    style={{ fontSize: 14, fontWeight: 700 }} />
                            </div>
                        </div>
                    </div>

                    {diffResult && (
                        <>
                            <div style={{
                                background: 'linear-gradient(135deg, #065f46, #16a34a)',
                                borderRadius: 14, padding: '22px 20px',
                                color: '#fff', textAlign: 'center', marginTop: 12,
                            }}>
                                <p style={{ fontSize: 9, opacity: 0.6, textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1 }}>Total Days</p>
                                <p style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1 }}>{diffResult.totalDays.toLocaleString()}</p>
                                <p style={{ fontSize: 12, opacity: 0.7 }}>
                                    {diffResult.weeks} weeks and {diffResult.remainDays} days
                                </p>
                            </div>

                            <div className="calc-card" style={{ marginTop: 10 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                                    {statBox('Months', `~${diffResult.months}`)}
                                    {statBox('Years', diffResult.years)}
                                    {statBox('Hours', diffResult.hours.toLocaleString())}
                                    {statBox('Weekdays', diffResult.weekdays.toLocaleString())}
                                </div>
                                <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                                    <div style={{ flex: 1, background: '#ecfdf5', borderRadius: 8, padding: '6px 10px', textAlign: 'center', fontSize: 11, color: '#059669', fontWeight: 700 }}>
                                        💼 {diffResult.weekdays} working days
                                    </div>
                                    <div style={{ flex: 1, background: '#fef3c7', borderRadius: 8, padding: '6px 10px', textAlign: 'center', fontSize: 11, color: '#d97706', fontWeight: 700 }}>
                                        🏖️ {diffResult.weekends} weekend days
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};
