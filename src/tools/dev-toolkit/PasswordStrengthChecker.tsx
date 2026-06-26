import React, { useState, useMemo, useCallback } from 'react';
import { Eye, EyeOff, ShieldCheck, Check, X, Copy, RefreshCw, Download } from 'lucide-react';

/* ── Common passwords & patterns ── */
const COMMON_PASSWORDS = [
    'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', 'master',
    'dragon', '111111', 'baseball', 'iloveyou', 'trustno1', 'sunshine', 'ashley',
    'football', 'shadow', '123123', '654321', 'superman', 'qazwsx', 'michael',
    'password1', 'password123', 'batman', 'login', 'starwars', 'admin', 'welcome',
    'hello', 'charlie', 'donald', 'letmein', 'mustang', 'access', 'flower',
    'hottie', 'loveme', 'zaq1zaq1', 'passw0rd', '000000', 'qwerty123', 'hunter',
    'hunter2', 'princess', 'rockyou', 'rosebud', 'summer', 'freedom', 'whatever',
    'soccer', 'jordan', 'liverpool', 'ranger', 'buster', 'pepper', 'harley',
    'george', 'hammer', 'silver', 'ginger', 'joshua', 'bailey', 'maggie',
    'jessica', 'jennifer', 'amanda', 'nicole', 'samantha', 'thomas', 'andrew',
    'cookie', 'banana', 'killer', 'guitar', 'angel', 'computer', 'internet',
    'cheese', 'tigger', 'gandalf', 'robert', 'soccer1', 'pokemon', 'matrix',
    'chocolate', 'arsenal', 'jackson', 'diamond', 'forever', 'orange', 'yankees',
    'dallas', 'trustme', 'thunder', 'taylor', 'sparky', 'secret', 'snoopy',
    'merlin', 'phoenix',
];
const COMMON_PATTERNS = ['123', '234', '345', '456', '567', '678', '789', '890',
    'abc', 'bcd', 'cde', 'def', 'qwerty', 'asdf', 'zxcv', 'password', 'pass',
    '111', '222', '333', '444', '555', '666', '777', '888', '999', '000', 'aaa', 'bbb'];

/* ── Passphrase word list (200 common easy words) ── */
const WORD_LIST = [
    'apple','arrow','beach','bloom','brave','brick','cabin','candy','charm','chess',
    'cliff','cloud','coral','crane','crown','dance','dawn','delta','dream','drift',
    'eagle','ember','fable','fern','flame','flash','forge','frost','ghost','glade',
    'globe','grace','grain','grove','guard','haven','heart','honey','ivory','jewel',
    'karma','knot','lemon','light','lotus','maple','marsh','metal','mirth','moose',
    'noble','north','oasis','ocean','olive','orbit','otter','pearl','penny','piano',
    'pixel','plume','prism','pulse','quartz','quest','raven','ridge','river','robin',
    'royal','sage','cedar','shore','silk','slate','solar','spark','spice','spine',
    'steam','stone','storm','sugar','swift','table','thorn','tiger','titan','torch',
    'tower','trail','tulip','ultra','unity','valor','vault','venus','vigor','viola',
    'vivid','waltz','wheat','wind','witch','wolf','world','xenon','yacht','yield',
    'zeal','amber','aspen','atlas','blade','blaze','blink','bliss','bluff','brush',
    'burst','canal','cider','cipher','climb','comet','coral','crest','crisp','curly',
    'dew','disco','dove','drift','dune','echo','elect','elite','epoch','fairy',
    'feast','finch','flint','flora','focus','frame','frost','gamma','geyser','gleam',
    'glow','grand','grape','haven','haze','helix','honey','hyper','inlet','ivory',
    'jasper','jade','kite','koala','lance','lunar','magic','manor','mango','meson',
    'night','nimble','nova','opal','panda','peach','plum','polar','pumice','quill',
    'radar','range','rapid','rebel','relay','ripple','roost','rover','ruby','rumba',
    'sable','salsa','satin','scale','scout','shade','shine','sigma','sleek','slice',
];

/* ── Analysis ── */
interface CriterionResult { label: string; passed: boolean; points: number; }

function analyzePassword(pw: string) {
    const criteria: CriterionResult[] = [];
    let score = 0;
    if (pw.length >= 8) { criteria.push({ label: 'At least 8 characters', passed: true, points: 10 }); score += 10; }
    else criteria.push({ label: 'At least 8 characters', passed: false, points: 0 });
    if (pw.length >= 12) { criteria.push({ label: '12+ characters', passed: true, points: 15 }); score += 15; }
    else criteria.push({ label: '12+ characters', passed: false, points: 0 });
    if (pw.length >= 16) { criteria.push({ label: '16+ characters', passed: true, points: 10 }); score += 10; }
    else criteria.push({ label: '16+ characters', passed: false, points: 0 });

    const hasUpper = /[A-Z]/.test(pw);
    const hasLower = /[a-z]/.test(pw);
    const hasDigit = /[0-9]/.test(pw);
    const hasSpecial = /[^A-Za-z0-9]/.test(pw);

    if (hasUpper) { criteria.push({ label: 'Contains uppercase letter', passed: true, points: 10 }); score += 10; }
    else criteria.push({ label: 'Contains uppercase letter', passed: false, points: 0 });
    if (hasLower) { criteria.push({ label: 'Contains lowercase letter', passed: true, points: 10 }); score += 10; }
    else criteria.push({ label: 'Contains lowercase letter', passed: false, points: 0 });
    if (hasDigit) { criteria.push({ label: 'Contains number', passed: true, points: 10 }); score += 10; }
    else criteria.push({ label: 'Contains number', passed: false, points: 0 });
    if (hasSpecial) { criteria.push({ label: 'Contains special character', passed: true, points: 15 }); score += 15; }
    else criteria.push({ label: 'Contains special character', passed: false, points: 0 });

    const lower = pw.toLowerCase();
    const hasCommonPattern = COMMON_PATTERNS.some(p => lower.includes(p));
    if (!hasCommonPattern && pw.length > 0) { criteria.push({ label: 'No common patterns', passed: true, points: 10 }); score += 10; }
    else criteria.push({ label: 'No common patterns', passed: !hasCommonPattern, points: 0 });
    const isCommonPw = COMMON_PASSWORDS.includes(lower);
    if (!isCommonPw && pw.length > 0) { criteria.push({ label: 'Not a common password', passed: true, points: 10 }); score += 10; }
    else criteria.push({ label: 'Not a common password', passed: !isCommonPw, points: 0 });

    score = Math.min(100, score);
    let label: string;
    if (score <= 20) label = 'Very Weak'; else if (score <= 40) label = 'Weak';
    else if (score <= 60) label = 'Fair'; else if (score <= 80) label = 'Strong';
    else label = 'Very Strong';

    let charsetSize = 0;
    if (hasLower) charsetSize += 26; if (hasUpper) charsetSize += 26;
    if (hasDigit) charsetSize += 10; if (hasSpecial) charsetSize += 33;
    if (charsetSize === 0) charsetSize = 26;

    const entropyBits = pw.length > 0 ? Math.round(pw.length * Math.log2(charsetSize)) : 0;
    const combinations = Math.pow(charsetSize, pw.length);
    const guessesPerSecond = 1e10;
    const secondsToCrack = combinations / guessesPerSecond;

    let timeToCrack: string;
    if (secondsToCrack < 1) timeToCrack = 'Instant';
    else if (secondsToCrack < 60) timeToCrack = `${Math.round(secondsToCrack)} seconds`;
    else if (secondsToCrack < 3600) timeToCrack = `${Math.round(secondsToCrack / 60)} minutes`;
    else if (secondsToCrack < 86400) timeToCrack = `${Math.round(secondsToCrack / 3600)} hours`;
    else if (secondsToCrack < 86400 * 365) timeToCrack = `${Math.round(secondsToCrack / 86400)} days`;
    else if (secondsToCrack < 86400 * 365 * 1e6) timeToCrack = `${Math.round(secondsToCrack / (86400 * 365))} years`;
    else timeToCrack = 'Millions of years+';

    let bcryptCost: string;
    if (entropyBits < 40) bcryptCost = '12+ (compensate for weak password)';
    else if (entropyBits < 60) bcryptCost = '10-12 (standard)';
    else if (entropyBits < 80) bcryptCost = '10 (good password)';
    else bcryptCost = '8-10 (very strong password)';

    const suggestions: string[] = [];
    if (pw.length < 12) suggestions.push('Use at least 12 characters');
    if (!hasUpper) suggestions.push('Add uppercase letters');
    if (!hasLower) suggestions.push('Add lowercase letters');
    if (!hasDigit) suggestions.push('Add numbers');
    if (!hasSpecial) suggestions.push('Add special characters (!@#$%^&*)');
    if (hasCommonPattern) suggestions.push('Avoid common patterns like 123, abc, qwerty');
    if (isCommonPw) suggestions.push('Avoid common passwords');

    const uppercaseCount = (pw.match(/[A-Z]/g) || []).length;
    const lowercaseCount = (pw.match(/[a-z]/g) || []).length;
    const digitCount = (pw.match(/[0-9]/g) || []).length;
    const specialCount = pw.length - uppercaseCount - lowercaseCount - digitCount;

    return { score, label, criteria, timeToCrack, suggestions, uppercaseCount, lowercaseCount, digitCount, specialCount, entropyBits, bcryptCost };
}

function getBarColor(score: number): string {
    if (score <= 20) return 'bg-red-500'; if (score <= 40) return 'bg-orange-500';
    if (score <= 60) return 'bg-yellow-500'; if (score <= 80) return 'bg-lime-500';
    return 'bg-green-500';
}
function getLabelColor(score: number): string {
    if (score <= 20) return 'text-red-600'; if (score <= 40) return 'text-orange-600';
    if (score <= 60) return 'text-yellow-600'; if (score <= 80) return 'text-lime-600';
    return 'text-green-600';
}

/* ── Password/Passphrase/PIN Generator ── */
type GenMode = 'password' | 'passphrase' | 'pin';

function generatePassword(length: number, upper: boolean, lower: boolean, digits: boolean, symbols: boolean): string {
    let chars = '';
    if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (digits) chars += '0123456789';
    if (symbols) chars += '!@#$%^&*()-_=+[]{}|;:,.<>?';
    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return Array.from(bytes).map(b => chars[b % chars.length]).join('');
}

function generatePassphrase(wordCount: number, separator: string, capitalize: boolean): string {
    const bytes = new Uint8Array(wordCount * 2);
    crypto.getRandomValues(bytes);
    const words: string[] = [];
    for (let i = 0; i < wordCount; i++) {
        const idx = (bytes[i * 2] * 256 + bytes[i * 2 + 1]) % WORD_LIST.length;
        let word = WORD_LIST[idx];
        if (capitalize) word = word.charAt(0).toUpperCase() + word.slice(1);
        words.push(word);
    }
    return words.join(separator);
}

function generatePIN(length: number): string {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return Array.from(bytes).map(b => (b % 10).toString()).join('');
}

export const PasswordStrengthChecker: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'check' | 'generate'>('check');

    // Checker state
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);

    // Generator state
    const [genMode, setGenMode] = useState<GenMode>('password');
    const [genLength, setGenLength] = useState(16);
    const [genUpper, setGenUpper] = useState(true);
    const [genLower, setGenLower] = useState(true);
    const [genDigits, setGenDigits] = useState(true);
    const [genSymbols, setGenSymbols] = useState(true);
    const [genWordCount, setGenWordCount] = useState(4);
    const [genSeparator, setGenSeparator] = useState('-');
    const [genCapitalize, setGenCapitalize] = useState(true);
    const [genPinLength, setGenPinLength] = useState(6);
    const [genQuantity, setGenQuantity] = useState(5);
    const [generated, setGenerated] = useState<string[]>([]);
    const [copiedGen, setCopiedGen] = useState<number | null>(null);
    const [copiedAllGen, setCopiedAllGen] = useState(false);

    const analysis = useMemo(() => analyzePassword(password), [password]);

    const doGenerate = useCallback(() => {
        const q = Math.max(1, Math.min(50, genQuantity));
        const list: string[] = [];
        for (let i = 0; i < q; i++) {
            if (genMode === 'password') list.push(generatePassword(genLength, genUpper, genLower, genDigits, genSymbols));
            else if (genMode === 'passphrase') list.push(generatePassphrase(genWordCount, genSeparator, genCapitalize));
            else list.push(generatePIN(genPinLength));
        }
        setGenerated(list);
        setCopiedGen(null);
        setCopiedAllGen(false);
    }, [genMode, genLength, genUpper, genLower, genDigits, genSymbols, genWordCount, genSeparator, genCapitalize, genPinLength, genQuantity]);

    const copySingleGen = async (idx: number) => {
        await navigator.clipboard.writeText(generated[idx]);
        setCopiedGen(idx);
        setTimeout(() => setCopiedGen(null), 1500);
    };
    const copyAllGen = async () => {
        await navigator.clipboard.writeText(generated.join('\n'));
        setCopiedAllGen(true);
        setTimeout(() => setCopiedAllGen(false), 1500);
    };
    const downloadGen = () => {
        const blob = new Blob([generated.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'passwords.txt'; a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-4 max-w-4xl mx-auto space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <ShieldCheck size={22} />
                </div>
                <div>
                    <h2 className="text-base font-bold text-slate-800">Password Toolkit</h2>
                    <p className="text-xs text-slate-500">Check strength or generate secure passwords, passphrases & PINs</p>
                </div>
            </div>

            {/* Tab Toggle */}
            <div className="flex rounded-xl border border-slate-200 overflow-hidden w-fit">
                {(['check', 'generate'] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2 text-xs font-bold transition-colors ${activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
                        {tab === 'check' ? '🔍 Strength Checker' : '🔑 Generator'}
                    </button>
                ))}
            </div>

            {activeTab === 'check' ? (
                <>
                    {/* Password Input */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
                        <label className="text-xs font-semibold text-slate-600">Password</label>
                        <div className="relative">
                            <input type={showPw ? 'text' : 'password'} value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Type a password here to check its strength..."
                                autoComplete="new-password" data-1p-ignore data-lpignore="true" data-form-type="other"
                                id="dev-pw-strength-input" name="dev-pw-strength-check"
                                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 pr-10 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                            <button onClick={() => setShowPw(!showPw)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" type="button">
                                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-400">🔒 Analyzed 100% in your browser. Nothing is sent to any server.</p>

                        {password.length > 0 && (
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <span className={`text-xs font-bold ${getLabelColor(analysis.score)}`}>{analysis.label}</span>
                                    <span className="text-xs text-slate-400">{analysis.score}%</span>
                                </div>
                                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full transition-all duration-300 ${getBarColor(analysis.score)}`}
                                        style={{ width: `${analysis.score}%` }} />
                                </div>
                            </div>
                        )}
                    </div>

                    {password.length > 0 && (
                        <>
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                                    <p className="text-[10px] text-slate-400 font-semibold mb-1">TIME TO CRACK</p>
                                    <p className="text-sm font-bold text-slate-800">{analysis.timeToCrack}</p>
                                    <p className="text-[10px] text-slate-400 mt-1">at 10B guesses/sec</p>
                                </div>
                                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                                    <p className="text-[10px] text-slate-400 font-semibold mb-1">ENTROPY</p>
                                    <p className="text-sm font-bold text-slate-800">{analysis.entropyBits} bits</p>
                                    <p className="text-[10px] text-slate-400 mt-1">{analysis.entropyBits < 40 ? 'Low' : analysis.entropyBits < 60 ? 'Moderate' : analysis.entropyBits < 80 ? 'Good' : 'Excellent'} entropy</p>
                                </div>
                                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                                    <p className="text-[10px] text-slate-400 font-semibold mb-1">BCRYPT COST</p>
                                    <p className="text-sm font-bold text-slate-800">{analysis.bcryptCost.split(' ')[0]}</p>
                                    <p className="text-[10px] text-slate-400 mt-1">{analysis.bcryptCost.split('(')[1]?.replace(')', '') || ''}</p>
                                </div>
                            </div>

                            {/* Criteria + Breakdown */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-2">
                                    <h3 className="text-xs font-bold text-slate-700 mb-2">Criteria</h3>
                                    {analysis.criteria.map((c, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            {c.passed ? <Check className="w-3.5 h-3.5 text-green-500 shrink-0" /> : <X className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                                            <span className={`text-xs ${c.passed ? 'text-slate-700' : 'text-slate-400'}`}>{c.label}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
                                    <h3 className="text-xs font-bold text-slate-700">Character Breakdown</h3>
                                    <div className="space-y-2">
                                        {[
                                            { label: 'Uppercase', count: analysis.uppercaseCount, color: 'bg-blue-500' },
                                            { label: 'Lowercase', count: analysis.lowercaseCount, color: 'bg-emerald-500' },
                                            { label: 'Digits', count: analysis.digitCount, color: 'bg-amber-500' },
                                            { label: 'Special', count: analysis.specialCount, color: 'bg-purple-500' },
                                        ].map(item => (
                                            <div key={item.label} className="flex items-center gap-2">
                                                <span className="text-xs text-slate-600 w-20">{item.label}</span>
                                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${item.color} transition-all duration-300`}
                                                        style={{ width: password.length > 0 ? `${(item.count / password.length) * 100}%` : '0%' }} />
                                                </div>
                                                <span className="text-xs font-bold text-slate-700 w-6 text-right">{item.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
                                        Total: <span className="font-bold text-slate-700">{password.length}</span> characters
                                    </div>
                                </div>
                            </div>

                            {/* Suggestions */}
                            {analysis.suggestions.length > 0 && (
                                <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 shadow-sm space-y-1.5">
                                    <h3 className="text-xs font-bold text-amber-800 mb-1">💡 Suggestions</h3>
                                    {analysis.suggestions.map((s, i) => (
                                        <p key={i} className="text-xs text-amber-700 flex items-start gap-1.5">
                                            <span className="mt-0.5 shrink-0">•</span> {s}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </>
            ) : (
                <>
                    {/* Generator Mode Selector */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <label className="text-xs font-bold text-slate-700 block mb-3">Generator Mode</label>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {([
                                { value: 'password' as GenMode, icon: '🔑', label: 'Password', desc: 'Random characters' },
                                { value: 'passphrase' as GenMode, icon: '📖', label: 'Passphrase', desc: 'Random words' },
                                { value: 'pin' as GenMode, icon: '🔢', label: 'PIN', desc: 'Numeric only' },
                            ]).map(m => (
                                <button key={m.value} onClick={() => { setGenMode(m.value); setGenerated([]); }}
                                    className={`rounded-xl border-2 px-3 py-3 text-left transition-all ${genMode === m.value
                                        ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                                    <p className="text-sm mb-0.5">{m.icon} <span className={`text-xs font-bold ${genMode === m.value ? 'text-indigo-700' : 'text-slate-700'}`}>{m.label}</span></p>
                                    <p className="text-[10px] text-slate-400">{m.desc}</p>
                                </button>
                            ))}
                        </div>

                        {/* Password Options */}
                        {genMode === 'password' && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <label className="text-xs font-semibold text-slate-600 w-20">Length</label>
                                    <input type="range" min={8} max={128} value={genLength} onChange={e => setGenLength(Number(e.target.value))}
                                        className="flex-1 accent-indigo-600" />
                                    <input type="number" min={8} max={128} value={genLength} onChange={e => setGenLength(Math.max(8, Math.min(128, Number(e.target.value) || 8)))}
                                        className="w-16 text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-center focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {[
                                        { label: 'A-Z', state: genUpper, set: setGenUpper },
                                        { label: 'a-z', state: genLower, set: setGenLower },
                                        { label: '0-9', state: genDigits, set: setGenDigits },
                                        { label: '!@#$%', state: genSymbols, set: setGenSymbols },
                                    ].map(opt => (
                                        <label key={opt.label} className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={opt.state} onChange={e => opt.set(e.target.checked)} className="accent-indigo-600 w-3.5 h-3.5" />
                                            <span className="text-xs font-semibold text-slate-600">{opt.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Passphrase Options */}
                        {genMode === 'passphrase' && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <label className="text-xs font-semibold text-slate-600 w-20">Words</label>
                                    <input type="range" min={3} max={10} value={genWordCount} onChange={e => setGenWordCount(Number(e.target.value))}
                                        className="flex-1 accent-indigo-600" />
                                    <span className="text-xs font-bold text-slate-700 w-8 text-center">{genWordCount}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <label className="text-xs font-semibold text-slate-600 w-20">Separator</label>
                                    <div className="flex gap-1.5">
                                        {[{ v: '-', l: 'Hyphen' }, { v: '.', l: 'Dot' }, { v: '_', l: 'Underscore' }, { v: ' ', l: 'Space' }].map(s => (
                                            <button key={s.v} onClick={() => setGenSeparator(s.v)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${genSeparator === s.v ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                                {s.l}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={genCapitalize} onChange={e => setGenCapitalize(e.target.checked)} className="accent-indigo-600 w-3.5 h-3.5" />
                                    <span className="text-xs font-semibold text-slate-600">Capitalize first letter</span>
                                </label>
                            </div>
                        )}

                        {/* PIN Options */}
                        {genMode === 'pin' && (
                            <div className="flex items-center gap-3">
                                <label className="text-xs font-semibold text-slate-600 w-20">Digits</label>
                                <div className="flex gap-1.5">
                                    {[4, 6, 8].map(n => (
                                        <button key={n} onClick={() => setGenPinLength(n)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${genPinLength === n ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                            {n}-digit
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity + Generate */}
                        <div className="flex items-end gap-3 mt-4 pt-3 border-t border-slate-100">
                            <div>
                                <label className="text-xs font-semibold text-slate-600 block mb-1">Quantity (1-50)</label>
                                <input type="number" min={1} max={50} value={genQuantity}
                                    onChange={e => setGenQuantity(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
                                    className="w-20 text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                            </div>
                            <button onClick={doGenerate}
                                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5 transition-colors shadow-sm">
                                <RefreshCw className="w-3.5 h-3.5" /> Generate
                            </button>
                        </div>
                    </div>

                    {/* Generated Results */}
                    {generated.length > 0 && (
                        <>
                            <div className="flex gap-2">
                                <button onClick={copyAllGen}
                                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center gap-1.5 transition-colors">
                                    {copiedAllGen ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    {copiedAllGen ? 'Copied!' : 'Copy All'}
                                </button>
                                <button onClick={downloadGen}
                                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center gap-1.5 transition-colors">
                                    <Download className="w-3.5 h-3.5" /> Download .txt
                                </button>
                            </div>
                            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                                <div className="max-h-72 overflow-y-auto space-y-1.5">
                                    {generated.map((pw, idx) => {
                                        const pwAnalysis = analyzePassword(pw);
                                        return (
                                            <div key={idx} className="flex items-center gap-2 group">
                                                <span className="text-xs text-slate-400 w-6 shrink-0 text-right">{idx + 1}.</span>
                                                <code className="text-xs font-mono text-slate-700 flex-1 bg-slate-50 rounded px-2 py-1.5 select-all">{pw}</code>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                                    pwAnalysis.score >= 80 ? 'bg-green-100 text-green-700' :
                                                    pwAnalysis.score >= 60 ? 'bg-lime-100 text-lime-700' :
                                                    pwAnalysis.score >= 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                }`}>{pwAnalysis.entropyBits}b</span>
                                                <button onClick={() => copySingleGen(idx)}
                                                    className="opacity-0 group-hover:opacity-100 px-2 py-1 rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-50 shrink-0 transition-opacity">
                                                    {copiedGen === idx ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};
