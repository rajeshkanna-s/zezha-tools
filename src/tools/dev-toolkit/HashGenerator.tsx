import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Hash, Copy, Check, Upload, ArrowLeftRight, Key, ShieldCheck } from 'lucide-react';
import { LineNumberedTextarea } from './LineNumberedTextarea';

/* ──────────────── MD5 (public-domain JS implementation) ──────────────── */
function md5(input: string): string {
    function safeAdd(x: number, y: number) { const lsw = (x & 0xffff) + (y & 0xffff); return ((((x >> 16) + (y >> 16) + (lsw >> 16)) << 16) | (lsw & 0xffff)); }
    function bitRotateLeft(num: number, cnt: number) { return (num << cnt) | (num >>> (32 - cnt)); }
    function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number) { return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b); }
    function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn((b & c) | (~b & d), a, b, x, s, t); }
    function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn((b & d) | (c & ~d), a, b, x, s, t); }
    function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn(b ^ c ^ d, a, b, x, s, t); }
    function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn(c ^ (b | ~d), a, b, x, s, t); }
    function binlMD5(x: number[], len: number) {
        x[len >> 5] |= 0x80 << (len % 32); x[(((len + 64) >>> 9) << 4) + 14] = len;
        let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
        for (let i = 0; i < x.length; i += 16) {
            const oa = a, ob = b, oc = c, od = d;
            a=md5ff(a,b,c,d,x[i]||0,7,-680876936);d=md5ff(d,a,b,c,x[i+1]||0,12,-389564586);c=md5ff(c,d,a,b,x[i+2]||0,17,606105819);b=md5ff(b,c,d,a,x[i+3]||0,22,-1044525330);
            a=md5ff(a,b,c,d,x[i+4]||0,7,-176418897);d=md5ff(d,a,b,c,x[i+5]||0,12,1200080426);c=md5ff(c,d,a,b,x[i+6]||0,17,-1473231341);b=md5ff(b,c,d,a,x[i+7]||0,22,-45705983);
            a=md5ff(a,b,c,d,x[i+8]||0,7,1770035416);d=md5ff(d,a,b,c,x[i+9]||0,12,-1958414417);c=md5ff(c,d,a,b,x[i+10]||0,17,-42063);b=md5ff(b,c,d,a,x[i+11]||0,22,-1990404162);
            a=md5ff(a,b,c,d,x[i+12]||0,7,1804603682);d=md5ff(d,a,b,c,x[i+13]||0,12,-40341101);c=md5ff(c,d,a,b,x[i+14]||0,17,-1502002290);b=md5ff(b,c,d,a,x[i+15]||0,22,1236535329);
            a=md5gg(a,b,c,d,x[i+1]||0,5,-165796510);d=md5gg(d,a,b,c,x[i+6]||0,9,-1069501632);c=md5gg(c,d,a,b,x[i+11]||0,14,643717713);b=md5gg(b,c,d,a,x[i]||0,20,-373897302);
            a=md5gg(a,b,c,d,x[i+5]||0,5,-701558691);d=md5gg(d,a,b,c,x[i+10]||0,9,38016083);c=md5gg(c,d,a,b,x[i+15]||0,14,-660478335);b=md5gg(b,c,d,a,x[i+4]||0,20,-405537848);
            a=md5gg(a,b,c,d,x[i+9]||0,5,568446438);d=md5gg(d,a,b,c,x[i+14]||0,9,-1019803690);c=md5gg(c,d,a,b,x[i+3]||0,14,-187363961);b=md5gg(b,c,d,a,x[i+8]||0,20,1163531501);
            a=md5gg(a,b,c,d,x[i+13]||0,5,-1444681467);d=md5gg(d,a,b,c,x[i+2]||0,9,-51403784);c=md5gg(c,d,a,b,x[i+7]||0,14,1735328473);b=md5gg(b,c,d,a,x[i+12]||0,20,-1926607734);
            a=md5hh(a,b,c,d,x[i+5]||0,4,-378558);d=md5hh(d,a,b,c,x[i+8]||0,11,-2022574463);c=md5hh(c,d,a,b,x[i+11]||0,16,1839030562);b=md5hh(b,c,d,a,x[i+14]||0,23,-35309556);
            a=md5hh(a,b,c,d,x[i+1]||0,4,-1530992060);d=md5hh(d,a,b,c,x[i+4]||0,11,1272893353);c=md5hh(c,d,a,b,x[i+7]||0,16,-155497632);b=md5hh(b,c,d,a,x[i+10]||0,23,-1094730640);
            a=md5hh(a,b,c,d,x[i+13]||0,4,681279174);d=md5hh(d,a,b,c,x[i]||0,11,-358537222);c=md5hh(c,d,a,b,x[i+3]||0,16,-722521979);b=md5hh(b,c,d,a,x[i+6]||0,23,76029189);
            a=md5hh(a,b,c,d,x[i+9]||0,4,-640364487);d=md5hh(d,a,b,c,x[i+12]||0,11,-421815835);c=md5hh(c,d,a,b,x[i+15]||0,16,530742520);b=md5hh(b,c,d,a,x[i+2]||0,23,-995338651);
            a=md5ii(a,b,c,d,x[i]||0,6,-198630844);d=md5ii(d,a,b,c,x[i+7]||0,10,1126891415);c=md5ii(c,d,a,b,x[i+14]||0,15,-1416354905);b=md5ii(b,c,d,a,x[i+5]||0,21,-57434055);
            a=md5ii(a,b,c,d,x[i+12]||0,6,1700485571);d=md5ii(d,a,b,c,x[i+3]||0,10,-1894986606);c=md5ii(c,d,a,b,x[i+10]||0,15,-1051523);b=md5ii(b,c,d,a,x[i+1]||0,21,-2054922799);
            a=md5ii(a,b,c,d,x[i+8]||0,6,1873313359);d=md5ii(d,a,b,c,x[i+15]||0,10,-30611744);c=md5ii(c,d,a,b,x[i+6]||0,15,-1560198380);b=md5ii(b,c,d,a,x[i+13]||0,21,1309151649);
            a=md5ii(a,b,c,d,x[i+4]||0,6,-145523070);d=md5ii(d,a,b,c,x[i+11]||0,10,-1120210379);c=md5ii(c,d,a,b,x[i+2]||0,15,718787259);b=md5ii(b,c,d,a,x[i+9]||0,21,-343485551);
            a=safeAdd(a,oa);b=safeAdd(b,ob);c=safeAdd(c,oc);d=safeAdd(d,od);
        }
        return [a,b,c,d];
    }
    function binl2hex(ba: number[]) { const h='0123456789abcdef'; let s=''; for(let i=0;i<ba.length*32;i+=8) s+=h.charAt((ba[i>>5]>>>(i%32))&0xf)+h.charAt((ba[i>>5]>>>(i%32+4))&0xf); return s; }
    function str2binl(s: string) { const b: number[]=[]; for(let i=0;i<s.length*8;i+=8) b[i>>5]|=(s.charCodeAt(i/8)&0xff)<<(i%32); return b; }
    const u = unescape(encodeURIComponent(input));
    return binl2hex(binlMD5(str2binl(u), u.length*8));
}

function md5Buffer(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer); let str=''; for(let i=0;i<bytes.length;i++) str+=String.fromCharCode(bytes[i]); return md5(str);
}

/* ── Helpers ── */
function bufToHex(buf: ArrayBuffer): string { return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join(''); }

async function hashText(text: string): Promise<Record<string, string>> {
    const data = new TextEncoder().encode(text);
    const algos = [{ name: 'SHA-1', algo: 'SHA-1' },{ name: 'SHA-256', algo: 'SHA-256' },{ name: 'SHA-384', algo: 'SHA-384' },{ name: 'SHA-512', algo: 'SHA-512' }];
    const results: Record<string,string> = { 'MD5': md5(text) };
    await Promise.all(algos.map(async ({name,algo}) => { results[name] = bufToHex(await crypto.subtle.digest(algo, data)); }));
    return results;
}

async function hashBuffer(buffer: ArrayBuffer): Promise<Record<string, string>> {
    const algos = [{ name: 'SHA-1', algo: 'SHA-1' },{ name: 'SHA-256', algo: 'SHA-256' },{ name: 'SHA-384', algo: 'SHA-384' },{ name: 'SHA-512', algo: 'SHA-512' }];
    const results: Record<string,string> = { 'MD5': md5Buffer(buffer) };
    await Promise.all(algos.map(async ({name,algo}) => { results[name] = bufToHex(await crypto.subtle.digest(algo, buffer)); }));
    return results;
}

async function hmacHash(text: string, secret: string, algo: string): Promise<string> {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: algo }, false, ['sign']);
    const sig = await crypto.subtle.sign('HMAC', key, enc.encode(text));
    return bufToHex(sig);
}

const HASH_ORDER = ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

type ActiveTab = 'text' | 'file' | 'hmac' | 'compare' | 'verify';

export const HashGenerator: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('text');
    const [text, setText] = useState('');
    const [hashes, setHashes] = useState<Record<string, string>>({});
    const [uppercase, setUppercase] = useState(false);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    // File
    const [fileName, setFileName] = useState('');
    const [fileSize, setFileSize] = useState(0);
    const [fileHashes, setFileHashes] = useState<Record<string, string>>({});
    const [fileHashing, setFileHashing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);

    // HMAC
    const [hmacText, setHmacText] = useState('');
    const [hmacSecret, setHmacSecret] = useState('');
    const [hmacAlgo, setHmacAlgo] = useState('SHA-256');
    const [hmacResult, setHmacResult] = useState('');

    // Compare
    const [compareA, setCompareA] = useState('');
    const [compareB, setCompareB] = useState('');

    // Verify
    const [verifyInput, setVerifyInput] = useState('');
    const [verifyExpected, setVerifyExpected] = useState('');
    const [verifyAlgo, setVerifyAlgo] = useState('SHA-256');
    const [verifyResult, setVerifyResult] = useState<boolean | null>(null);

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const computeHashes = useCallback(async (value: string) => {
        if (!value) { setHashes({}); return; }
        const result = await hashText(value);
        setHashes(result);
    }, []);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => computeHashes(text), 300);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [text, computeHashes]);

    const formatHash = (h: string) => uppercase ? h.toUpperCase() : h.toLowerCase();

    const copyHash = async (key: string, value: string) => {
        await navigator.clipboard.writeText(formatHash(value));
        setCopiedKey(key); setTimeout(() => setCopiedKey(null), 1500);
    };

    const processFile = async (file: File) => {
        setFileName(file.name); setFileSize(file.size); setFileHashing(true); setFileHashes({});
        try { const buffer = await file.arrayBuffer(); setFileHashes(await hashBuffer(buffer)); }
        catch { setFileHashes({}); }
        setFileHashing(false);
    };

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; if (file) await processFile(file);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault(); setDragOver(false);
        const file = e.dataTransfer.files?.[0]; if (file) { setActiveTab('file'); await processFile(file); }
    };

    const computeHmac = useCallback(async () => {
        if (!hmacText || !hmacSecret) { setHmacResult(''); return; }
        try { setHmacResult(await hmacHash(hmacText, hmacSecret, hmacAlgo)); }
        catch { setHmacResult('Error computing HMAC'); }
    }, [hmacText, hmacSecret, hmacAlgo]);

    useEffect(() => { computeHmac(); }, [computeHmac]);

    const doVerify = useCallback(async () => {
        if (!verifyInput || !verifyExpected) { setVerifyResult(null); return; }
        try {
            const result = await hashText(verifyInput);
            const algoKey = verifyAlgo === 'MD5' ? 'MD5' : verifyAlgo;
            const computed = result[algoKey]?.toLowerCase() || '';
            setVerifyResult(computed === verifyExpected.trim().toLowerCase());
        } catch { setVerifyResult(false); }
    }, [verifyInput, verifyExpected, verifyAlgo]);

    useEffect(() => { doVerify(); }, [doVerify]);

    const compareResult = (() => {
        const a = compareA.trim().toLowerCase(), b = compareB.trim().toLowerCase();
        if (!a || !b) return null; return a === b;
    })();

    const TABS: { value: ActiveTab; label: string; icon: React.ReactNode }[] = [
        { value: 'text', label: 'Text Hash', icon: <Hash className="w-3.5 h-3.5" /> },
        { value: 'file', label: 'File Hash', icon: <Upload className="w-3.5 h-3.5" /> },
        { value: 'hmac', label: 'HMAC', icon: <Key className="w-3.5 h-3.5" /> },
        { value: 'compare', label: 'Compare', icon: <ArrowLeftRight className="w-3.5 h-3.5" /> },
        { value: 'verify', label: 'Verify', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    ];

    const HashRow = ({ name, value, keyPrefix }: { name: string; value: string; keyPrefix: string }) => (
        <div className="flex items-start gap-2 group">
            <span className="text-xs font-bold text-slate-500 w-16 shrink-0 pt-1">{name}</span>
            <code className="text-xs font-mono text-slate-700 break-all flex-1 bg-slate-50 rounded-lg px-2.5 py-1.5 select-all border border-slate-100">{formatHash(value)}</code>
            <button onClick={() => copyHash(`${keyPrefix}-${name}`, value)}
                className="opacity-0 group-hover:opacity-100 px-2 py-1.5 rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-50 shrink-0 transition-opacity">
                {copiedKey === `${keyPrefix}-${name}` ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
        </div>
    );

    return (
        <div className="p-4 max-w-4xl mx-auto space-y-4"
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}>

            {/* Drag overlay */}
            {dragOver && (
                <div className="fixed inset-0 z-50 bg-indigo-600/10 backdrop-blur-sm flex items-center justify-center pointer-events-none">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-dashed border-indigo-400">
                        <p className="text-lg font-bold text-indigo-600">Drop file to hash</p>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Hash size={22} />
                </div>
                <div>
                    <h2 className="text-base font-bold text-slate-800">Hash Generator</h2>
                    <p className="text-xs text-slate-500">MD5, SHA-1/256/384/512, HMAC, file hashing & verification</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 flex-wrap">
                {TABS.map(tab => (
                    <button key={tab.value} onClick={() => setActiveTab(tab.value)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${activeTab === tab.value ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Case toggle */}
            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input type="checkbox" checked={uppercase} onChange={e => setUppercase(e.target.checked)} className="accent-indigo-600 w-3.5 h-3.5" />
                <span className="font-semibold">Uppercase output</span>
            </label>

            {/* ── TEXT TAB ── */}
            {activeTab === 'text' && (
                <>
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <label className="text-xs font-bold text-slate-700 block mb-2">Input Text</label>
                        <LineNumberedTextarea value={text} onChange={e => setText(e.target.value)}
                            placeholder="Type or paste text to hash..."
                            className="w-full h-28 border-none rounded-none focus:ring-0 resize-y bg-slate-50"
                            containerClassName="focus-within:ring-indigo-300" />
                        {text && <p className="text-[10px] text-slate-400 mt-2">{new Blob([text]).size.toLocaleString()} bytes · {text.length.toLocaleString()} characters</p>}
                    </div>
                    {Object.keys(hashes).length > 0 && (
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-2">
                            <h3 className="text-xs font-bold text-slate-700 mb-2">Hash Results</h3>
                            {HASH_ORDER.map(name => hashes[name] ? <HashRow key={name} name={name} value={hashes[name]} keyPrefix="text" /> : null)}
                        </div>
                    )}
                </>
            )}

            {/* ── FILE TAB ── */}
            {activeTab === 'file' && (
                <>
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <input ref={fileInputRef} type="file" onChange={handleFile} className="hidden" />
                        <div onClick={() => fileInputRef.current?.click()}
                            className="w-full border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all">
                            <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm text-slate-500 font-semibold">Click or drag & drop a file</p>
                            <p className="text-xs text-slate-400 mt-1">Any file up to 100MB</p>
                        </div>
                        {fileName && (
                            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                                <span>File: <span className="font-bold text-slate-700">{fileName}</span></span>
                                <span>({(fileSize / 1024).toFixed(1)} KB)</span>
                                {fileHashing && <span className="text-indigo-500 animate-pulse">Hashing...</span>}
                            </div>
                        )}
                    </div>
                    {Object.keys(fileHashes).length > 0 && (
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-2">
                            <h3 className="text-xs font-bold text-slate-700 mb-2">File Hashes</h3>
                            {HASH_ORDER.map(name => fileHashes[name] ? <HashRow key={name} name={name} value={fileHashes[name]} keyPrefix="file" /> : null)}
                        </div>
                    )}
                </>
            )}

            {/* ── HMAC TAB ── */}
            {activeTab === 'hmac' && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
                    <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-amber-500" /> HMAC Generator
                    </h3>
                    <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Message</label>
                        <LineNumberedTextarea value={hmacText} onChange={e => setHmacText(e.target.value)}
                            placeholder="Enter message..."
                            className="w-full h-20 border-none rounded-none focus:ring-0 resize-y bg-slate-50"
                            containerClassName="focus-within:ring-amber-300" />
                    </div>
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="text-xs font-semibold text-slate-600 block mb-1">Secret Key</label>
                            <input type="text" value={hmacSecret} onChange={e => setHmacSecret(e.target.value)}
                                placeholder="Enter secret key..."
                                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-600 block mb-1">Algorithm</label>
                            <select value={hmacAlgo} onChange={e => setHmacAlgo(e.target.value)}
                                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300">
                                <option value="SHA-1">HMAC-SHA1</option>
                                <option value="SHA-256">HMAC-SHA256</option>
                                <option value="SHA-384">HMAC-SHA384</option>
                                <option value="SHA-512">HMAC-SHA512</option>
                            </select>
                        </div>
                    </div>
                    {hmacResult && (
                        <div className="flex items-start gap-2 group">
                            <span className="text-xs font-bold text-amber-600 w-24 shrink-0 pt-1">HMAC Result</span>
                            <code className="text-xs font-mono text-slate-700 break-all flex-1 bg-amber-50 rounded-lg px-2.5 py-1.5 select-all border border-amber-100">{formatHash(hmacResult)}</code>
                            <button onClick={() => copyHash('hmac', hmacResult)}
                                className="px-2 py-1.5 rounded-lg text-xs font-bold text-amber-600 hover:bg-amber-50 shrink-0">
                                {copiedKey === 'hmac' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ── COMPARE TAB ── */}
            {activeTab === 'compare' && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
                    <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <ArrowLeftRight className="w-3.5 h-3.5 text-blue-500" /> Compare Hashes
                    </h3>
                    <input value={compareA} onChange={e => setCompareA(e.target.value)} placeholder="Paste first hash..."
                        className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300" />
                    <input value={compareB} onChange={e => setCompareB(e.target.value)} placeholder="Paste second hash..."
                        className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300" />
                    {compareResult !== null && (
                        <div className={`text-sm font-bold px-4 py-3 rounded-xl text-center ${compareResult ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            {compareResult ? '✅ MATCH — Hashes are identical' : '❌ NO MATCH — Hashes differ'}
                        </div>
                    )}
                </div>
            )}

            {/* ── VERIFY TAB ── */}
            {activeTab === 'verify' && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
                    <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Checksum Verification
                    </h3>
                    <p className="text-[10px] text-slate-400">Paste your content and expected hash to verify integrity.</p>
                    <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Content</label>
                        <LineNumberedTextarea value={verifyInput} onChange={e => setVerifyInput(e.target.value)}
                            placeholder="Enter content to verify..."
                            className="w-full h-20 border-none rounded-none focus:ring-0 resize-y bg-slate-50"
                            containerClassName="focus-within:ring-emerald-300" />
                    </div>
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="text-xs font-semibold text-slate-600 block mb-1">Expected Hash</label>
                            <input type="text" value={verifyExpected} onChange={e => setVerifyExpected(e.target.value)}
                                placeholder="Paste expected hash..."
                                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-600 block mb-1">Algorithm</label>
                            <select value={verifyAlgo} onChange={e => setVerifyAlgo(e.target.value)}
                                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300">
                                {HASH_ORDER.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                        </div>
                    </div>
                    {verifyResult !== null && (
                        <div className={`text-sm font-bold px-4 py-3 rounded-xl text-center ${verifyResult ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            {verifyResult ? '✅ VERIFIED — Hash matches content' : '❌ FAILED — Hash does not match content'}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
