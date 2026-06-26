import React, { useState, useCallback } from 'react';
import { ShieldCheck, CheckCircle, XCircle } from 'lucide-react';
import { LineNumberedTextarea } from './LineNumberedTextarea';

interface StructureSummary {
    keyCount: number;
    depth: number;
    dataTypes: string[];
    arrayLengths: { path: string; length: number }[];
}

interface SchemaEntry {
    key: string;
    type: string;
}

export const JsonValidator: React.FC = () => {
    const [input, setInput] = useState('');
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [errorLine, setErrorLine] = useState<number | null>(null);
    const [errorColumn, setErrorColumn] = useState<number | null>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [summary, setSummary] = useState<StructureSummary | null>(null);
    const [schema, setSchema] = useState<SchemaEntry[]>([]);

    const getLineAndCol = useCallback((text: string, position: number) => {
        const lines = text.substring(0, position).split('\n');
        return { line: lines.length, column: lines[lines.length - 1].length + 1 };
    }, []);

    const analyzeError = useCallback((errorMessage: string, text: string) => {
        const tips: string[] = [];
        const posMatch = errorMessage.match(/position\s+(\d+)/i);
        let line: number | null = null;
        let column: number | null = null;

        if (posMatch) {
            const pos = parseInt(posMatch[1]);
            const lc = getLineAndCol(text, pos);
            line = lc.line;
            column = lc.column;
        }

        const lineMatch = errorMessage.match(/line\s+(\d+)/i);
        const colMatch = errorMessage.match(/column\s+(\d+)/i);
        if (lineMatch) line = parseInt(lineMatch[1]);
        if (colMatch) column = parseInt(colMatch[1]);

        if (/trailing comma/i.test(errorMessage) || /after.*,/i.test(errorMessage)) {
            tips.push('Remove trailing commas before closing braces or brackets.');
        }
        if (text.includes("'")) {
            tips.push('JSON requires double quotes (""), not single quotes (\'\').');
        }
        if (/Unexpected token\s/.test(errorMessage)) {
            tips.push('Check for unquoted keys -- JSON keys must be wrapped in double quotes.');
            tips.push('Ensure all string values use double quotes.');
        }
        if (/Unexpected end/i.test(errorMessage)) {
            tips.push('Check for missing closing braces } or brackets ].');
        }
        if (tips.length === 0) {
            tips.push('Check the JSON structure near the reported position.');
        }

        return { line, column, tips };
    }, [getLineAndCol]);

    const analyzeStructure = useCallback((obj: unknown, path = '', depth = 0): StructureSummary => {
        const result: StructureSummary = { keyCount: 0, depth, dataTypes: [], arrayLengths: [] };

        const addType = (t: string) => {
            if (!result.dataTypes.includes(t)) result.dataTypes.push(t);
        };

        if (obj === null) {
            addType('null');
            return result;
        }

        if (Array.isArray(obj)) {
            addType('array');
            result.arrayLengths.push({ path: path || '(root)', length: obj.length });
            for (let i = 0; i < obj.length; i++) {
                const child = analyzeStructure(obj[i], `${path}[${i}]`, depth + 1);
                result.keyCount += child.keyCount;
                if (child.depth > result.depth) result.depth = child.depth;
                child.dataTypes.forEach(addType);
                result.arrayLengths.push(...child.arrayLengths);
            }
            return result;
        }

        if (typeof obj === 'object') {
            addType('object');
            const keys = Object.keys(obj as Record<string, unknown>);
            result.keyCount += keys.length;
            for (const key of keys) {
                const val = (obj as Record<string, unknown>)[key];
                const childPath = path ? `${path}.${key}` : key;
                const child = analyzeStructure(val, childPath, depth + 1);
                result.keyCount += child.keyCount;
                if (child.depth > result.depth) result.depth = child.depth;
                child.dataTypes.forEach(addType);
                result.arrayLengths.push(...child.arrayLengths);
            }
            return result;
        }

        addType(typeof obj);
        return result;
    }, []);

    const buildSchema = useCallback((obj: unknown, prefix = ''): SchemaEntry[] => {
        const entries: SchemaEntry[] = [];
        if (obj === null || typeof obj !== 'object') return entries;

        if (Array.isArray(obj)) {
            const types = new Set<string>();
            for (const item of obj) {
                if (item === null) types.add('null');
                else if (Array.isArray(item)) types.add('array');
                else types.add(typeof item);
            }
            entries.push({ key: prefix || '(root)', type: `array<${[...types].join(' | ')}>` });
            if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null && !Array.isArray(obj[0])) {
                entries.push(...buildSchema(obj[0], `${prefix}[]`));
            }
            return entries;
        }

        const record = obj as Record<string, unknown>;
        for (const key of Object.keys(record)) {
            const val = record[key];
            const fullKey = prefix ? `${prefix}.${key}` : key;
            if (val === null) {
                entries.push({ key: fullKey, type: 'null' });
            } else if (Array.isArray(val)) {
                entries.push(...buildSchema(val, fullKey));
            } else if (typeof val === 'object') {
                entries.push({ key: fullKey, type: 'object' });
                entries.push(...buildSchema(val, fullKey));
            } else {
                entries.push({ key: fullKey, type: typeof val });
            }
        }
        return entries;
    }, []);

    const validate = useCallback((value: string) => {
        if (!value.trim()) {
            setIsValid(null);
            setErrorMsg('');
            setErrorLine(null);
            setErrorColumn(null);
            setSuggestions([]);
            setSummary(null);
            setSchema([]);
            return;
        }
        try {
            const parsed = JSON.parse(value);
            setIsValid(true);
            setErrorMsg('');
            setErrorLine(null);
            setErrorColumn(null);
            setSuggestions([]);

            const struct = analyzeStructure(parsed);
            setSummary(struct);
            setSchema(buildSchema(parsed));
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Invalid JSON';
            setIsValid(false);
            setErrorMsg(msg);
            setSummary(null);
            setSchema([]);

            const analysis = analyzeError(msg, value);
            setErrorLine(analysis.line);
            setErrorColumn(analysis.column);
            setSuggestions(analysis.tips);
        }
    }, [analyzeStructure, buildSchema, analyzeError]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setInput(val);
        validate(val);
    }, [validate]);

    return (
        <div className="p-4 max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <ShieldCheck size={22} />
                </div>
                <div>
                    <h2 className="text-base font-bold text-slate-800">JSON Validator</h2>
                    <p className="text-xs text-slate-500">Real-time JSON validation with detailed error info</p>
                </div>
            </div>

            {isValid !== null && (
                <div className={`mb-3 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${isValid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {isValid ? <CheckCircle size={18} /> : <XCircle size={18} />}
                    {isValid ? 'VALID JSON' : 'INVALID JSON'}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col">
                    <label className="text-xs font-semibold text-slate-600 mb-2 block">Input JSON</label>
                    <LineNumberedTextarea
                        value={input}
                        onChange={handleInputChange}
                        placeholder='Paste JSON to validate...'
                        className="w-full h-96 border-none rounded-none focus:ring-0 resize-none"
                        containerClassName="flex-1 focus-within:ring-blue-500/20"
                        spellCheck={false}
                    />
                </div>

                <div className="space-y-3">
                    {isValid === false && (
                        <div className="bg-white rounded-xl border border-red-200 p-4 shadow-sm">
                            <h4 className="text-xs font-bold text-red-700 mb-2">Error Details</h4>
                            <div className="bg-red-50 rounded-lg p-3 text-xs text-red-700 mb-2 font-mono">
                                {errorMsg}
                            </div>
                            {(errorLine || errorColumn) && (
                                <div className="flex gap-4 mb-2 text-xs">
                                    {errorLine && <span className="text-slate-600">Line: <span className="font-bold text-red-600">{errorLine}</span></span>}
                                    {errorColumn && <span className="text-slate-600">Column: <span className="font-bold text-red-600">{errorColumn}</span></span>}
                                </div>
                            )}
                            {suggestions.length > 0 && (
                                <div>
                                    <h5 className="text-xs font-semibold text-slate-600 mb-1">Suggestions:</h5>
                                    <ul className="space-y-1">
                                        {suggestions.map((s, i) => (
                                            <li key={i} className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-1.5">{s}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {isValid === true && summary && (
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                            <h4 className="text-xs font-bold text-slate-700 mb-3">Structure Summary</h4>
                            <div className="grid grid-cols-2 gap-2 mb-3">
                                <div className="bg-slate-50 rounded-lg p-2 text-center">
                                    <div className="text-xs text-slate-500">Total Keys</div>
                                    <div className="text-sm font-bold text-slate-800">{summary.keyCount}</div>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-2 text-center">
                                    <div className="text-xs text-slate-500">Max Depth</div>
                                    <div className="text-sm font-bold text-slate-800">{summary.depth}</div>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="text-xs font-semibold text-slate-600 mb-1">Data Types Found</div>
                                <div className="flex flex-wrap gap-1">
                                    {summary.dataTypes.map(t => (
                                        <span key={t} className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700">{t}</span>
                                    ))}
                                </div>
                            </div>
                            {summary.arrayLengths.length > 0 && (
                                <div>
                                    <div className="text-xs font-semibold text-slate-600 mb-1">Array Lengths</div>
                                    <div className="space-y-1 max-h-24 overflow-auto">
                                        {summary.arrayLengths.slice(0, 20).map((a, i) => (
                                            <div key={i} className="flex justify-between text-xs bg-slate-50 rounded px-2 py-1">
                                                <span className="font-mono text-slate-600 truncate">{a.path}</span>
                                                <span className="font-bold text-slate-700">{a.length}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {isValid === true && schema.length > 0 && (
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                            <h4 className="text-xs font-bold text-slate-700 mb-3">Schema Summary</h4>
                            <div className="space-y-1 max-h-56 overflow-auto">
                                {schema.map((entry, i) => (
                                    <div key={i} className="flex justify-between text-xs bg-slate-50 rounded px-2 py-1">
                                        <span className="font-mono text-violet-700 truncate mr-2">{entry.key}</span>
                                        <span className="font-bold text-slate-600 whitespace-nowrap">{entry.type}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {isValid === null && (
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm h-96 flex items-center justify-center text-xs text-slate-400">
                            Validation results will appear here
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
