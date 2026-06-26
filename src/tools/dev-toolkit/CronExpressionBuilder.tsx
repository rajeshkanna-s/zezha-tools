import React, { useState, useMemo, useCallback } from 'react';
import { Clock, Copy, Check, RotateCcw } from 'lucide-react';

/* ── Cron Parser ── */
function describeCron(parts: string[]): string {
    if (parts.length < 5) return 'Invalid cron expression';
    const pieces: string[] = [];

    // Seconds (optional 6-field)
    const hasSeconds = parts.length === 6;
    const sec = hasSeconds ? parts[0] : undefined;
    const [m, h, d, mo, dw] = hasSeconds ? parts.slice(1) : parts;

    if (hasSeconds && sec && sec !== '*') pieces.push(`At second ${sec}`);

    if (m === '*' && h === '*') pieces.push('Every minute');
    else if (m === '*') pieces.push(`Every minute of hour ${h}`);
    else if (h === '*') pieces.push(`At minute ${m} of every hour`);
    else pieces.push(`At ${h.padStart(2, '0')}:${m.padStart(2, '0')}`);

    if (d !== '*' && d !== '?') pieces.push(`on day ${d} of the month`);
    if (mo !== '*') {
        const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const mVal = parseInt(mo);
        if (mVal >= 1 && mVal <= 12) pieces.push(`in ${months[mVal]}`);
        else pieces.push(`in month ${mo}`);
    }
    if (dw !== '*' && dw !== '?') {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const vals = dw.split(',').map(v => {
            const n = parseInt(v);
            return n >= 0 && n <= 6 ? days[n] : v;
        });
        pieces.push(`on ${vals.join(', ')}`);
    }

    return pieces.join(' ') || 'Every minute';
}

void describeCron; // keep reference for unused check

function getNextRuns(expression: string, count = 10): Date[] {
    const parts = expression.trim().split(/\s+/);
    if (parts.length < 5 || parts.length > 6) return [];
    const hasSeconds = parts.length === 6;
    const [secStr, minStr, hrStr, domStr, monStr, dowStr] = hasSeconds
        ? parts
        : ['0', ...parts];

    const parseField = (field: string, min: number, max: number): number[] => {
        const result: number[] = [];
        for (const part of field.split(',')) {
            if (part === '*' || part === '?') {
                for (let i = min; i <= max; i++) result.push(i);
            } else if (part.includes('/')) {
                const [base, step] = part.split('/');
                const start = base === '*' ? min : parseInt(base);
                const s = parseInt(step);
                for (let i = start; i <= max; i += s) result.push(i);
            } else if (part.includes('-')) {
                const [a, b] = part.split('-').map(Number);
                for (let i = a; i <= b; i++) result.push(i);
            } else {
                result.push(parseInt(part));
            }
        }
        return result.filter(n => n >= min && n <= max);
    };

    try {
        const seconds = parseField(secStr, 0, 59);
        const minutes = parseField(minStr, 0, 59);
        const hours = parseField(hrStr, 0, 23);
        const doms = parseField(domStr, 1, 31);
        const months = parseField(monStr, 1, 12);
        const dows = parseField(dowStr, 0, 6);

        const results: Date[] = [];
        const now = new Date();
        const cursor = new Date(now);
        cursor.setMilliseconds(0);

        const maxIterations = 525600; // 1 year in minutes
        let iterations = 0;

        while (results.length < count && iterations < maxIterations) {
            iterations++;
            cursor.setSeconds(cursor.getSeconds() + (hasSeconds ? 1 : 60));

            if (!months.includes(cursor.getMonth() + 1)) continue;
            if (!doms.includes(cursor.getDate())) continue;
            if (!dows.includes(cursor.getDay())) continue;
            if (!hours.includes(cursor.getHours())) continue;
            if (!minutes.includes(cursor.getMinutes())) continue;
            if (hasSeconds && !seconds.includes(cursor.getSeconds())) continue;
            if (!hasSeconds && cursor.getSeconds() !== 0) continue;

            results.push(new Date(cursor));
        }
        return results;
    } catch {
        return [];
    }
}

/* ── Presets ── */
const PRESETS = [
    { label: 'Every minute', value: '* * * * *' },
    { label: 'Every 5 minutes', value: '*/5 * * * *' },
    { label: 'Every 15 minutes', value: '*/15 * * * *' },
    { label: 'Every 30 minutes', value: '*/30 * * * *' },
    { label: 'Every hour', value: '0 * * * *' },
    { label: 'Every 2 hours', value: '0 */2 * * *' },
    { label: 'Daily at midnight', value: '0 0 * * *' },
    { label: 'Daily at 9 AM', value: '0 9 * * *' },
    { label: 'Daily at 6 PM', value: '0 18 * * *' },
    { label: 'Weekdays at 9 AM', value: '0 9 * * 1-5' },
    { label: 'Weekends at noon', value: '0 12 * * 0,6' },
    { label: 'Weekly (Sunday midnight)', value: '0 0 * * 0' },
    { label: 'Monthly (1st at midnight)', value: '0 0 1 * *' },
    { label: 'Quarterly (Jan/Apr/Jul/Oct)', value: '0 0 1 1,4,7,10 *' },
    { label: 'Yearly (Jan 1st midnight)', value: '0 0 1 1 *' },
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const CronExpressionBuilder: React.FC = () => {
    const [expression, setExpression] = useState('* * * * *');
    const [sixField, setSixField] = useState(false);
    const [copied, setCopied] = useState(false);

    // Visual builder state
    const [builderMin, setBuilderMin] = useState('*');
    const [builderHr, setBuilderHr] = useState('*');
    const [builderDom, setBuilderDom] = useState('*');
    const [builderMon, setBuilderMon] = useState('*');
    const [builderDow, setBuilderDow] = useState('*');
    const [builderSec, setBuilderSec] = useState('0');

    const syncFromBuilder = useCallback(() => {
        const parts = sixField
            ? [builderSec, builderMin, builderHr, builderDom, builderMon, builderDow]
            : [builderMin, builderHr, builderDom, builderMon, builderDow];
        setExpression(parts.join(' '));
    }, [builderSec, builderMin, builderHr, builderDom, builderMon, builderDow, sixField]);

    const handleFieldChange = useCallback((field: string, value: string) => {
        switch (field) {
            case 'sec': setBuilderSec(value); break;
            case 'min': setBuilderMin(value); break;
            case 'hr': setBuilderHr(value); break;
            case 'dom': setBuilderDom(value); break;
            case 'mon': setBuilderMon(value); break;
            case 'dow': setBuilderDow(value); break;
        }
    }, []);

    // Sync builder to expression after field changes
    React.useEffect(() => { syncFromBuilder(); }, [syncFromBuilder]);

    const description = useMemo(() => {
        const parts = expression.trim().split(/\s+/);
        return describeCron(parts);
    }, [expression]);

    const nextRuns = useMemo(() => getNextRuns(expression), [expression]);

    const loadPreset = useCallback((value: string) => {
        setExpression(value);
        const parts = value.split(/\s+/);
        if (parts.length >= 5) {
            const offset = parts.length === 6 ? 1 : 0;
            if (parts.length === 6) { setSixField(true); setBuilderSec(parts[0]); }
            setBuilderMin(parts[offset]); setBuilderHr(parts[offset + 1]);
            setBuilderDom(parts[offset + 2]); setBuilderMon(parts[offset + 3]); setBuilderDow(parts[offset + 4]);
        }
    }, []);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(expression);
        setCopied(true); setTimeout(() => setCopied(false), 1500);
    };

    const copyCrontabLine = async () => {
        await navigator.clipboard.writeText(`${expression} /path/to/command`);
        setCopied(true); setTimeout(() => setCopied(false), 1500);
    };

    const reset = () => {
        setExpression('* * * * *'); setBuilderMin('*'); setBuilderHr('*');
        setBuilderDom('*'); setBuilderMon('*'); setBuilderDow('*'); setBuilderSec('0'); setSixField(false);
    };

    return (
        <div className="p-4 max-w-4xl mx-auto space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                    <Clock size={22} />
                </div>
                <div>
                    <h2 className="text-base font-bold text-slate-800">Cron Expression Builder</h2>
                    <p className="text-xs text-slate-500">Visual builder with human-readable descriptions & next run preview</p>
                </div>
            </div>

            {/* Expression Display */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                    <input type="text" value={expression} onChange={e => setExpression(e.target.value)}
                        className="flex-1 text-lg font-mono font-bold text-purple-800 bg-white border border-purple-200 rounded-xl px-4 py-2.5 text-center focus:outline-none focus:ring-2 focus:ring-purple-300"
                        spellCheck={false} />
                    <button onClick={handleCopy}
                        className="px-3 py-2.5 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 flex items-center gap-1.5 transition-colors">
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button onClick={reset}
                        className="px-3 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center gap-1.5 transition-colors">
                        <RotateCcw className="w-3.5 h-3.5" /> Reset
                    </button>
                </div>
                <p className="text-sm text-purple-700 font-semibold text-center">📅 {description}</p>
                <div className="flex justify-center gap-1 mt-2">
                    <button onClick={copyCrontabLine}
                        className="text-[10px] font-bold text-purple-500 hover:text-purple-700 transition-colors">
                        Copy as crontab line
                    </button>
                </div>
            </div>

            {/* 6-field toggle */}
            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input type="checkbox" checked={sixField} onChange={e => setSixField(e.target.checked)} className="accent-purple-600 w-3.5 h-3.5" />
                <span className="font-semibold">6-field format (with seconds)</span>
            </label>

            {/* Visual Builder */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <h3 className="text-xs font-bold text-slate-700 mb-3">Visual Builder</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {sixField && (
                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Second</label>
                            <input type="text" value={builderSec} onChange={e => handleFieldChange('sec', e.target.value)}
                                className="w-full text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-purple-300 mt-1" />
                            <p className="text-[10px] text-slate-400 mt-0.5">0-59, *, */n</p>
                        </div>
                    )}
                    {[
                        { label: 'Minute', field: 'min', value: builderMin, hint: '0-59, *, */n' },
                        { label: 'Hour', field: 'hr', value: builderHr, hint: '0-23, *, */n' },
                        { label: 'Day of Month', field: 'dom', value: builderDom, hint: '1-31, *, */n' },
                        { label: 'Month', field: 'mon', value: builderMon, hint: '1-12, *' },
                        { label: 'Day of Week', field: 'dow', value: builderDow, hint: '0-6 (Sun=0)' },
                    ].map(f => (
                        <div key={f.field}>
                            <label className="text-[10px] font-bold text-slate-500 uppercase">{f.label}</label>
                            <input type="text" value={f.value} onChange={e => handleFieldChange(f.field, e.target.value)}
                                className="w-full text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-purple-300 mt-1" />
                            <p className="text-[10px] text-slate-400 mt-0.5">{f.hint}</p>
                        </div>
                    ))}
                </div>

                {/* Quick day/month selectors */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Quick: Day of Week</label>
                        <div className="flex gap-1 flex-wrap">
                            <button onClick={() => handleFieldChange('dow', '*')}
                                className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${builderDow === '*' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>All</button>
                            {DAYS.map((d, i) => (
                                <button key={d} onClick={() => handleFieldChange('dow', String(i))}
                                    className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${builderDow === String(i) ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                    {d}
                                </button>
                            ))}
                            <button onClick={() => handleFieldChange('dow', '1-5')}
                                className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${builderDow === '1-5' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Weekdays</button>
                            <button onClick={() => handleFieldChange('dow', '0,6')}
                                className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${builderDow === '0,6' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Weekends</button>
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Quick: Month</label>
                        <div className="flex gap-1 flex-wrap">
                            <button onClick={() => handleFieldChange('mon', '*')}
                                className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${builderMon === '*' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>All</button>
                            {MONTHS.map((m, i) => (
                                <button key={m} onClick={() => handleFieldChange('mon', String(i + 1))}
                                    className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${builderMon === String(i + 1) ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Presets */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <h3 className="text-xs font-bold text-slate-700 mb-2">Presets</h3>
                <div className="flex flex-wrap gap-1.5">
                    {PRESETS.map(p => (
                        <button key={p.value} onClick={() => loadPreset(p.value)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${expression === p.value
                                ? 'bg-purple-100 text-purple-700 border-purple-300'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200'
                            }`}>
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Next Runs */}
            {nextRuns.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-700 mb-2">Next 10 Run Times</h3>
                    <div className="space-y-1">
                        {nextRuns.map((date, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                                <span className="text-slate-400 w-6 text-right font-bold">{i + 1}.</span>
                                <span className="font-mono text-slate-700">
                                    {date.toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                </span>
                                <span className="font-mono font-bold text-purple-600">
                                    {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {nextRuns.length === 0 && expression.trim() && (
                <div className="text-center py-4 text-xs text-amber-600 bg-amber-50 rounded-xl border border-amber-200 p-3">
                    ⚠️ Could not compute next runs. Check your expression syntax.
                </div>
            )}
        </div>
    );
};
