import React, { useState, useCallback } from 'react';
import { FileCode2, Copy, Download, Settings } from 'lucide-react';
import { LineNumberedTextarea } from './LineNumberedTextarea';

const escapeXml = (str: string): string =>
    String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

const sanitizeTag = (tag: string): string =>
    tag.replace(/[^a-zA-Z0-9_.-]/g, '_').replace(/^[^a-zA-Z_]/, '_');

function jsonToXml(value: unknown, tagName: string, itemTag: string, indent: number, level: number): string {
    const pad = ' '.repeat(indent * level);
    const tag = sanitizeTag(tagName);

    if (value === null || value === undefined) {
        return `${pad}<${tag}/>\n`;
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return `${pad}<${tag}>${escapeXml(String(value))}</${tag}>\n`;
    }

    if (Array.isArray(value)) {
        let xml = `${pad}<${tag}>\n`;
        for (const item of value) {
            xml += jsonToXml(item, itemTag, itemTag, indent, level + 1);
        }
        xml += `${pad}</${tag}>\n`;
        return xml;
    }

    if (typeof value === 'object') {
        const obj = value as Record<string, unknown>;
        const keys = Object.keys(obj);

        // Check for attribute keys (starting with @) and text content (#text)
        const attrKeys = keys.filter(k => k.startsWith('@'));
        const textKey = keys.find(k => k === '#text' || k === '_text');
        const childKeys = keys.filter(k => !k.startsWith('@') && k !== '#text' && k !== '_text');

        let attrs = '';
        for (const ak of attrKeys) {
            const attrName = sanitizeTag(ak.slice(1));
            attrs += ` ${attrName}="${escapeXml(String(obj[ak]))}"`;
        }

        if (textKey && childKeys.length === 0) {
            return `${pad}<${tag}${attrs}>${escapeXml(String(obj[textKey]))}</${tag}>\n`;
        }

        let xml = `${pad}<${tag}${attrs}>\n`;
        for (const key of childKeys) {
            xml += jsonToXml(obj[key], key, itemTag, indent, level + 1);
        }
        xml += `${pad}</${tag}>\n`;
        return xml;
    }

    return `${pad}<${tag}>${escapeXml(String(value))}</${tag}>\n`;
}

export const JsonToXml: React.FC = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [rootTag, setRootTag] = useState('root');
    const [itemTag, setItemTag] = useState('item');
    const [indent, setIndent] = useState(2);
    const [xmlDecl, setXmlDecl] = useState(true);
    const [showSettings, setShowSettings] = useState(false);

    const convert = useCallback((value: string, root: string, item: string, ind: number, decl: boolean) => {
        if (!value.trim()) {
            setOutput('');
            setError('');
            return;
        }
        try {
            const parsed = JSON.parse(value);
            const rootName = root.trim() || 'root';
            const itemName = item.trim() || 'item';
            let xml = '';
            if (decl) {
                xml += '<?xml version="1.0" encoding="UTF-8"?>\n';
            }

            // If parsed is a primitive, wrap it
            if (typeof parsed !== 'object' || parsed === null) {
                xml += `<${sanitizeTag(rootName)}>${escapeXml(String(parsed))}</${sanitizeTag(rootName)}>\n`;
            } else if (Array.isArray(parsed)) {
                xml += `<${sanitizeTag(rootName)}>\n`;
                for (const el of parsed) {
                    xml += jsonToXml(el, itemName, itemName, ind, 1);
                }
                xml += `</${sanitizeTag(rootName)}>\n`;
            } else {
                // Object — render children inside root
                xml += `<${sanitizeTag(rootName)}>\n`;
                const keys = Object.keys(parsed);
                for (const key of keys) {
                    xml += jsonToXml(parsed[key], key, itemName, ind, 1);
                }
                xml += `</${sanitizeTag(rootName)}>\n`;
            }

            setOutput(xml);
            setError('');
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Invalid JSON';
            setError(msg);
            setOutput('');
        }
    }, []);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setInput(val);
        convert(val, rootTag, itemTag, indent, xmlDecl);
    }, [convert, rootTag, itemTag, indent, xmlDecl]);

    const updateRootTag = useCallback((v: string) => {
        setRootTag(v);
        convert(input, v, itemTag, indent, xmlDecl);
    }, [convert, input, itemTag, indent, xmlDecl]);

    const updateItemTag = useCallback((v: string) => {
        setItemTag(v);
        convert(input, rootTag, v, indent, xmlDecl);
    }, [convert, input, rootTag, indent, xmlDecl]);

    const updateIndent = useCallback((v: number) => {
        setIndent(v);
        convert(input, rootTag, itemTag, v, xmlDecl);
    }, [convert, input, rootTag, itemTag, xmlDecl]);

    const toggleDecl = useCallback(() => {
        const next = !xmlDecl;
        setXmlDecl(next);
        convert(input, rootTag, itemTag, indent, next);
    }, [convert, input, rootTag, itemTag, indent, xmlDecl]);

    const handleCopy = useCallback(async () => {
        if (!output) return;
        await navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [output]);

    const handleDownload = useCallback(() => {
        if (!output) return;
        const blob = new Blob([output], { type: 'application/xml;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'output.xml';
        a.click();
        URL.revokeObjectURL(url);
    }, [output]);

    const handleMinify = useCallback(() => {
        if (!output) return;
        const minified = output.replace(/>\s+</g, '><').replace(/\n\s*/g, '');
        setOutput(minified);
    }, [output]);

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                    <FileCode2 size={22} />
                </div>
                <div>
                    <h2 className="text-base font-bold text-slate-800">JSON to XML</h2>
                    <p className="text-xs text-slate-500">Convert JSON to well-formed XML with custom root & item tags</p>
                </div>
            </div>

            {/* Settings & Actions */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${showSettings ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                    <Settings size={12} />
                    Settings
                </button>
                <button
                    onClick={handleMinify}
                    disabled={!output}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 disabled:opacity-40 transition-colors"
                >
                    Minify
                </button>

                <div className="ml-auto flex items-center gap-2">
                    <button
                        onClick={handleCopy}
                        disabled={!output}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-40 flex items-center gap-1 transition-colors"
                    >
                        <Copy size={12} />
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                        onClick={handleDownload}
                        disabled={!output}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-40 flex items-center gap-1 transition-colors"
                    >
                        <Download size={12} />
                        Download .xml
                    </button>
                </div>
            </div>

            {/* Settings panel */}
            {showSettings && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm mb-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-slate-600 mb-1 block">Root Element</label>
                            <input
                                value={rootTag}
                                onChange={e => updateRootTag(e.target.value)}
                                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 font-mono"
                                placeholder="root"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-600 mb-1 block">Array Item Tag</label>
                            <input
                                value={itemTag}
                                onChange={e => updateItemTag(e.target.value)}
                                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 font-mono"
                                placeholder="item"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-600 mb-1 block">Indent</label>
                            <div className="flex gap-1">
                                {[2, 4].map(n => (
                                    <button
                                        key={n}
                                        onClick={() => updateIndent(n)}
                                        className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-bold transition-colors ${indent === n ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                    >
                                        {n} sp
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-600 mb-1 block">XML Declaration</label>
                            <button
                                onClick={toggleDecl}
                                className={`w-full px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${xmlDecl ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                {xmlDecl ? '✓ Enabled' : 'Disabled'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Input / Output */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col">
                    <label className="text-xs font-semibold text-slate-600 mb-2 block">Input JSON</label>
                    <LineNumberedTextarea
                        value={input}
                        onChange={handleInputChange}
                        placeholder={'{\n  "person": {\n    "name": "Alice",\n    "age": 28,\n    "skills": ["JS","Python"]\n  }\n}'}
                        className="w-full h-80 border-none rounded-none focus:ring-0 resize-none"
                        containerClassName="flex-1 focus-within:ring-orange-500/20"
                        spellCheck={false}
                    />
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <label className="text-xs font-semibold text-slate-600 mb-2 block">XML Output</label>
                    {error ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
                            <span className="font-bold">Error: </span>{error}
                        </div>
                    ) : output ? (
                        <textarea
                            value={output}
                            readOnly
                            className="w-full h-80 font-mono text-xs border border-slate-200 rounded-lg p-3 bg-slate-50 resize-none focus:outline-none"
                        />
                    ) : (
                        <div className="h-80 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400 text-xs">
                            XML output will appear here
                        </div>
                    )}
                </div>
            </div>

            {/* Stats */}
            {output && !error && (
                <div className="mt-3 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-slate-50 rounded-lg p-3 text-center">
                            <div className="text-xs text-slate-500 mb-1">JSON Size</div>
                            <div className="text-sm font-bold text-slate-800">{new Blob([input]).size.toLocaleString()} B</div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3 text-center">
                            <div className="text-xs text-slate-500 mb-1">XML Size</div>
                            <div className="text-sm font-bold text-slate-800">{new Blob([output]).size.toLocaleString()} B</div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3 text-center">
                            <div className="text-xs text-slate-500 mb-1">Root Element</div>
                            <div className="text-sm font-bold text-orange-600 font-mono">&lt;{sanitizeTag(rootTag || 'root')}&gt;</div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3 text-center">
                            <div className="text-xs text-slate-500 mb-1">XML Lines</div>
                            <div className="text-sm font-bold text-slate-800">{output.split('\n').filter(Boolean).length}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
