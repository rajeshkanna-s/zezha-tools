import React, { useState, useMemo, useCallback } from 'react';
import { Regex, Copy, Check, BookOpen, Play, Replace } from 'lucide-react';

/* ── Preset Library ── */
const PRESETS: { category: string; items: { label: string; pattern: string; flags: string; desc: string }[] }[] = [
    {
        category: 'Common',
        items: [
            { label: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', flags: 'gi', desc: 'Email addresses' },
            { label: 'URL', pattern: 'https?://[\\w\\-._~:/?#[\\]@!$&\'()*+,;=%]+', flags: 'gi', desc: 'HTTP/HTTPS URLs' },
            { label: 'Phone (US)', pattern: '\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}', flags: 'g', desc: 'US phone numbers' },
            { label: 'Phone (IN)', pattern: '(?:\\+91[\\-\\s]?)?[6-9]\\d{9}', flags: 'g', desc: 'Indian phone numbers' },
            { label: 'IP Address (v4)', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', flags: 'g', desc: 'IPv4 addresses' },
        ]
    },
    {
        category: 'Dates & Numbers',
        items: [
            { label: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])', flags: 'g', desc: 'ISO date format' },
            { label: 'Date (DD/MM/YYYY)', pattern: '(?:0[1-9]|[12]\\d|3[01])/(?:0[1-9]|1[0-2])/\\d{4}', flags: 'g', desc: 'Indian date format' },
            { label: 'Time (HH:MM)', pattern: '(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d)?', flags: 'g', desc: '24h time' },
            { label: 'Integer', pattern: '-?\\d+', flags: 'g', desc: 'Whole numbers' },
            { label: 'Decimal', pattern: '-?\\d+\\.\\d+', flags: 'g', desc: 'Floating point numbers' },
            { label: 'Currency (₹)', pattern: '₹[\\s]?[\\d,]+(?:\\.\\d{2})?', flags: 'g', desc: 'Indian Rupee amounts' },
            { label: 'Hex Color', pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b', flags: 'gi', desc: 'CSS hex colors' },
        ]
    },
    {
        category: 'India-Specific',
        items: [
            { label: 'PAN', pattern: '[A-Z]{5}\\d{4}[A-Z]', flags: 'g', desc: 'PAN card number' },
            { label: 'Aadhaar', pattern: '\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}', flags: 'g', desc: 'Aadhaar number' },
            { label: 'GSTIN', pattern: '\\d{2}[A-Z]{5}\\d{4}[A-Z][A-Z\\d]Z[A-Z\\d]', flags: 'g', desc: 'GST number' },
            { label: 'IFSC', pattern: '[A-Z]{4}0[A-Z0-9]{6}', flags: 'g', desc: 'Bank IFSC code' },
            { label: 'PIN Code', pattern: '\\b[1-9]\\d{5}\\b', flags: 'g', desc: '6-digit PIN code' },
        ]
    },
    {
        category: 'Web & Code',
        items: [
            { label: 'HTML Tag', pattern: '<\\/?[a-z][\\w-]*(?:\\s[^>]*)?\\/?>',flags: 'gi', desc: 'HTML elements' },
            { label: 'CSS Class', pattern: '\\.[a-zA-Z_][\\w-]*', flags: 'g', desc: 'CSS class selectors' },
            { label: 'JSON Key', pattern: '"([^"]+)"\\s*:', flags: 'g', desc: 'JSON object keys' },
            { label: 'UUID', pattern: '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}', flags: 'gi', desc: 'UUID format' },
            { label: 'Domain', pattern: '(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z]{2,}', flags: 'gi', desc: 'Domain names' },
            { label: 'Hashtag', pattern: '#[a-zA-Z_]\\w*', flags: 'g', desc: 'Hashtag strings' },
            { label: 'Username (@)', pattern: '@[a-zA-Z_]\\w{0,30}', flags: 'g', desc: '@mentions' },
        ]
    },
    {
        category: 'Validation',
        items: [
            { label: 'Strong Password', pattern: '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,}', flags: '', desc: '8+ chars, mixed case, digit, special' },
            { label: 'Slug', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$', flags: '', desc: 'URL-safe slug' },
            { label: 'File Extension', pattern: '\\.[a-zA-Z0-9]{1,10}$', flags: 'g', desc: 'File extensions' },
            { label: 'Whitespace', pattern: '\\s+', flags: 'g', desc: 'All whitespace' },
            { label: 'Empty Lines', pattern: '^\\s*$', flags: 'gm', desc: 'Blank lines' },
        ]
    },
];

/* ── Cheat Sheet ── */
const CHEAT_SHEET: { section: string; items: { token: string; desc: string }[] }[] = [
    { section: 'Anchors', items: [{ token: '^', desc: 'Start of line' }, { token: '$', desc: 'End of line' }, { token: '\\b', desc: 'Word boundary' }] },
    { section: 'Quantifiers', items: [{ token: '*', desc: '0 or more' }, { token: '+', desc: '1 or more' }, { token: '?', desc: '0 or 1' }, { token: '{n}', desc: 'Exactly n' }, { token: '{n,m}', desc: 'n to m' }] },
    { section: 'Groups', items: [{ token: '(abc)', desc: 'Capture group' }, { token: '(?:abc)', desc: 'Non-capture' }, { token: '(?<name>)', desc: 'Named group' }, { token: '(a|b)', desc: 'Alternation' }] },
    { section: 'Classes', items: [{ token: '.', desc: 'Any character' }, { token: '\\d', desc: 'Digit [0-9]' }, { token: '\\w', desc: 'Word [a-zA-Z0-9_]' }, { token: '\\s', desc: 'Whitespace' }, { token: '[abc]', desc: 'Character set' }, { token: '[^abc]', desc: 'Negated set' }] },
    { section: 'Lookaround', items: [{ token: '(?=abc)', desc: 'Positive lookahead' }, { token: '(?!abc)', desc: 'Negative lookahead' }, { token: '(?<=abc)', desc: 'Positive lookbehind' }, { token: '(?<!abc)', desc: 'Negative lookbehind' }] },
];

type TabMode = 'match' | 'replace';

export const RegexTester: React.FC = () => {
    const [pattern, setPattern] = useState('');
    const [testString, setTestString] = useState('');
    const [flagG, setFlagG] = useState(true);
    const [flagI, setFlagI] = useState(false);
    const [flagM, setFlagM] = useState(false);
    const [flagS, setFlagS] = useState(false);
    const [flagU, setFlagU] = useState(false);
    const [mode, setMode] = useState<TabMode>('match');
    const [replaceWith, setReplaceWith] = useState('');
    const [showCheat, setShowCheat] = useState(false);
    const [showPresets, setShowPresets] = useState(false);
    const [copied, setCopied] = useState(false);

    const flags = useMemo(() => {
        let f = ''; if (flagG) f += 'g'; if (flagI) f += 'i'; if (flagM) f += 'm'; if (flagS) f += 's'; if (flagU) f += 'u';
        return f;
    }, [flagG, flagI, flagM, flagS, flagU]);

    const { matches, error, highlightedHtml, replaced, execTime } = useMemo(() => {
        if (!pattern || !testString) return { matches: [], error: '', highlightedHtml: '', replaced: '', execTime: 0 };
        try {
            const start = performance.now();
            const regex = new RegExp(pattern, flags);
            const allMatches: { match: string; index: number; groups: Record<string, string> }[] = [];

            if (flagG) {
                let m; regex.lastIndex = 0;
                while ((m = regex.exec(testString)) !== null) {
                    allMatches.push({ match: m[0], index: m.index, groups: m.groups || {} });
                    if (!m[0]) { regex.lastIndex++; }
                }
            } else {
                const m = regex.exec(testString);
                if (m) allMatches.push({ match: m[0], index: m.index, groups: m.groups || {} });
            }

            // Highlight
            let html = '';
            let lastIdx = 0;
            const colors = ['bg-yellow-200', 'bg-cyan-200', 'bg-pink-200', 'bg-lime-200', 'bg-orange-200'];
            const escaped = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            for (let i = 0; i < allMatches.length; i++) {
                const m = allMatches[i];
                html += escaped(testString.slice(lastIdx, m.index));
                html += `<mark class="${colors[i % colors.length]} rounded px-0.5">${escaped(m.match)}</mark>`;
                lastIdx = m.index + m.match.length;
            }
            html += escaped(testString.slice(lastIdx));

            // Replace
            let rep = '';
            if (mode === 'replace' && replaceWith !== undefined) {
                try { const rx = new RegExp(pattern, flags); rep = testString.replace(rx, replaceWith); } catch { rep = ''; }
            }

            const execTime = performance.now() - start;
            return { matches: allMatches, error: '', highlightedHtml: html, replaced: rep, execTime };
        } catch (e: unknown) {
            return { matches: [], error: e instanceof Error ? e.message : 'Invalid regex', highlightedHtml: '', replaced: '', execTime: 0 };
        }
    }, [pattern, testString, flags, mode, replaceWith, flagG]);

    const loadPreset = useCallback((p: { pattern: string; flags: string }) => {
        setPattern(p.pattern);
        setFlagG(p.flags.includes('g')); setFlagI(p.flags.includes('i')); setFlagM(p.flags.includes('m'));
        setFlagS(p.flags.includes('s')); setFlagU(p.flags.includes('u'));
        setShowPresets(false);
    }, []);

    const copyResult = async () => {
        const text = mode === 'replace' ? replaced : matches.map(m => m.match).join('\n');
        await navigator.clipboard.writeText(text);
        setCopied(true); setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="p-4 max-w-5xl mx-auto space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Regex size={22} />
                </div>
                <div>
                    <h2 className="text-base font-bold text-slate-800">Regex Tester</h2>
                    <p className="text-xs text-slate-500">Live pattern matching with 30+ presets, replace mode & cheat sheet</p>
                </div>
            </div>

            {/* Pattern Input */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg text-slate-400 font-mono">/</span>
                    <input type="text" value={pattern} onChange={e => setPattern(e.target.value)}
                        placeholder="Enter regex pattern..."
                        className="flex-1 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                    <span className="text-lg text-slate-400 font-mono">/</span>
                    <span className="text-sm font-mono text-emerald-600 font-bold">{flags}</span>
                </div>

                {/* Flags */}
                <div className="flex flex-wrap items-center gap-3">
                    {[
                        { flag: 'g', label: 'Global', state: flagG, set: setFlagG },
                        { flag: 'i', label: 'Case-insensitive', state: flagI, set: setFlagI },
                        { flag: 'm', label: 'Multiline', state: flagM, set: setFlagM },
                        { flag: 's', label: 'Dotall', state: flagS, set: setFlagS },
                        { flag: 'u', label: 'Unicode', state: flagU, set: setFlagU },
                    ].map(f => (
                        <button key={f.flag} onClick={() => f.set(!f.state)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${f.state ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                            {f.flag} <span className="font-normal opacity-70">{f.label}</span>
                        </button>
                    ))}
                    <div className="ml-auto flex gap-1">
                        <button onClick={() => setShowPresets(!showPresets)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${showPresets ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                            <Play className="w-3 h-3" /> Presets
                        </button>
                        <button onClick={() => setShowCheat(!showCheat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${showCheat ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                            <BookOpen className="w-3 h-3" /> Cheat Sheet
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700 font-semibold">{error}</div>
                )}
            </div>

            {/* Presets Panel */}
            {showPresets && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm max-h-64 overflow-y-auto">
                    {PRESETS.map(cat => (
                        <div key={cat.category} className="mb-3">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{cat.category}</h4>
                            <div className="flex flex-wrap gap-1.5">
                                {cat.items.map(p => (
                                    <button key={p.label} onClick={() => loadPreset(p)}
                                        title={p.desc}
                                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 transition-colors">
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Cheat Sheet */}
            {showCheat && (
                <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 shadow-sm">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                        {CHEAT_SHEET.map(sec => (
                            <div key={sec.section}>
                                <h4 className="text-[10px] font-bold text-amber-700 uppercase mb-1.5">{sec.section}</h4>
                                {sec.items.map(it => (
                                    <div key={it.token} className="flex items-center gap-2 text-xs mb-0.5">
                                        <code className="font-mono text-amber-800 bg-amber-100 rounded px-1 py-0.5 text-[10px]">{it.token}</code>
                                        <span className="text-slate-600">{it.desc}</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Mode Toggle */}
            <div className="flex gap-1">
                {([
                    { v: 'match' as TabMode, icon: <Play size={12} />, label: 'Match' },
                    { v: 'replace' as TabMode, icon: <Replace size={12} />, label: 'Replace' },
                ]).map(tab => (
                    <button key={tab.v} onClick={() => setMode(tab.v)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${mode === tab.v ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Test String */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <label className="text-xs font-bold text-slate-700 block mb-2">Test String</label>
                <textarea value={testString} onChange={e => setTestString(e.target.value)}
                    placeholder="Paste text to test against..."
                    className="w-full h-32 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-y"
                    spellCheck={false} />
            </div>

            {/* Replace Input */}
            {mode === 'replace' && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <label className="text-xs font-bold text-slate-700 block mb-2">Replace With</label>
                    <input type="text" value={replaceWith} onChange={e => setReplaceWith(e.target.value)}
                        placeholder="Replacement string (supports $1, $2, etc.)"
                        className="w-full text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                </div>
            )}

            {/* Results */}
            {testString && pattern && !error && (
                <>
                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                        <span className="font-bold text-slate-600">{matches.length} match{matches.length !== 1 ? 'es' : ''}</span>
                        <span className="text-slate-400">{execTime.toFixed(2)}ms</span>
                        {(matches.length > 0 || replaced) && (
                            <button onClick={copyResult}
                                className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center gap-1 transition-colors ml-auto">
                                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                {copied ? 'Copied!' : mode === 'replace' ? 'Copy Result' : 'Copy Matches'}
                            </button>
                        )}
                    </div>

                    {/* Highlighted Output */}
                    {mode === 'match' && highlightedHtml && (
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                            <label className="text-xs font-bold text-slate-700 block mb-2">Highlighted Matches</label>
                            <pre className="text-sm font-mono text-slate-700 whitespace-pre-wrap break-words max-h-48 overflow-y-auto leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
                        </div>
                    )}

                    {/* Replace Output */}
                    {mode === 'replace' && replaced && (
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                            <label className="text-xs font-bold text-slate-700 block mb-2">Replaced Result</label>
                            <pre className="text-sm font-mono text-slate-700 whitespace-pre-wrap break-words max-h-48 overflow-y-auto bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                                {replaced}
                            </pre>
                        </div>
                    )}

                    {/* Match Details */}
                    {matches.length > 0 && mode === 'match' && (
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                            <label className="text-xs font-bold text-slate-700 block mb-2">Match Details</label>
                            <div className="max-h-48 overflow-y-auto space-y-1.5">
                                {matches.map((m, i) => (
                                    <div key={i} className="flex items-start gap-2 text-xs">
                                        <span className="text-slate-400 w-6 shrink-0 text-right font-bold">{i + 1}.</span>
                                        <code className="font-mono text-slate-700 bg-slate-50 rounded px-2 py-1 flex-1 break-all">{m.match}</code>
                                        <span className="text-[10px] text-slate-400 shrink-0">idx:{m.index}</span>
                                        {Object.keys(m.groups).length > 0 && (
                                            <span className="text-[10px] text-blue-500 shrink-0">
                                                {Object.entries(m.groups).map(([k, v]) => `${k}=${v}`).join(', ')}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Empty State */}
            {!testString && !pattern && (
                <div className="text-center py-8">
                    <Regex className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-xs text-slate-400">Enter a regex pattern and test string to begin</p>
                    <p className="text-[10px] text-slate-300 mt-1">Try the Presets button for 30+ ready-to-use patterns</p>
                </div>
            )}
        </div>
    );
};
