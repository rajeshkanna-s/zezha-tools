import React, { useState, useCallback, useMemo } from 'react';
import { MousePointer, Copy, Search, ChevronRight, ChevronDown } from 'lucide-react';
import { LineNumberedTextarea } from './LineNumberedTextarea';

interface PathResult {
    dot: string;
    bracket: string;
    jsonPath: string;
    jsAccessor: string;
    value: unknown;
    type: string;
}

interface TreeNodeProps {
    keyName: string | number;
    value: unknown;
    path: string;
    depth: number;
    onSelect: (path: string, value: unknown) => void;
    selectedPath: string | null;
    searchTerm: string;
}

const getType = (v: unknown): string => {
    if (v === null) return 'null';
    if (Array.isArray(v)) return 'array';
    return typeof v;
};

const formatPreview = (v: unknown): string => {
    if (v === null) return 'null';
    if (typeof v === 'string') return v.length > 60 ? `"${v.slice(0, 57)}..."` : `"${v}"`;
    if (typeof v === 'boolean' || typeof v === 'number') return String(v);
    if (Array.isArray(v)) return `Array(${v.length})`;
    if (typeof v === 'object') return `{${Object.keys(v as object).length} keys}`;
    return String(v);
};

const typeColor: Record<string, string> = {
    string: 'text-green-600',
    number: 'text-blue-600',
    boolean: 'text-orange-600',
    null: 'text-slate-400',
    array: 'text-purple-600',
    object: 'text-slate-700',
};

const buildDotPath = (path: string): string => path || '(root)';

const buildBracketPath = (path: string): string => {
    if (!path) return '(root)';
    return path.replace(/\.([^.[]+)/g, '["$1"]').replace(/^([^[]+)/, '["$1"]').replace(/\[(\d+)\]/g, '[$1]');
};

const buildJsonPath = (path: string): string => {
    if (!path) return '$';
    return '$.' + path;
};

const buildJsAccessor = (path: string): string => {
    if (!path) return 'obj';
    return 'obj.' + path;
};

const TreeNode: React.FC<TreeNodeProps> = ({ keyName, value, path, depth, onSelect, selectedPath, searchTerm }) => {
    const [expanded, setExpanded] = useState(depth < 3);
    const isObject = typeof value === 'object' && value !== null;
    const isArray = Array.isArray(value);
    const type = getType(value);
    const isSelected = selectedPath === path;
    const keyStr = String(keyName);
    const matchesSearch = searchTerm && keyStr.toLowerCase().includes(searchTerm.toLowerCase());

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(path, value);
    }, [path, value, onSelect]);

    const handleToggle = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setExpanded(!expanded);
    }, [expanded]);

    if (!isObject) {
        return (
            <div
                className={`flex items-center gap-1 py-0.5 px-1 rounded cursor-pointer hover:bg-blue-50 transition-colors text-xs font-mono ${isSelected ? 'bg-blue-100 ring-1 ring-blue-400' : ''}`}
                style={{ paddingLeft: depth * 16 + 4 }}
                onClick={handleClick}
            >
                <span className={`font-semibold ${matchesSearch ? 'bg-yellow-200 px-0.5 rounded' : 'text-slate-700'}`}>{keyStr}</span>
                <span className="text-slate-400">:</span>
                <span className={typeColor[type] || 'text-slate-600'}>{formatPreview(value)}</span>
                <span className="text-[10px] text-slate-400 ml-1">({type})</span>
            </div>
        );
    }

    const children = isArray
        ? (value as unknown[]).map((item, i) => ({ key: i, val: item, childPath: `${path}[${i}]` }))
        : Object.keys(value as object).map(k => ({ key: k, val: (value as Record<string, unknown>)[k], childPath: path ? `${path}.${k}` : k }));

    return (
        <div>
            <div
                className={`flex items-center gap-1 py-0.5 px-1 rounded cursor-pointer hover:bg-blue-50 transition-colors text-xs font-mono ${isSelected ? 'bg-blue-100 ring-1 ring-blue-400' : ''}`}
                style={{ paddingLeft: depth * 16 + 4 }}
                onClick={handleClick}
            >
                <button onClick={handleToggle} className="p-0 text-slate-400 hover:text-slate-600 flex-shrink-0">
                    {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                </button>
                <span className={`font-semibold ${matchesSearch ? 'bg-yellow-200 px-0.5 rounded' : 'text-slate-700'}`}>{keyStr}</span>
                <span className="text-slate-400">:</span>
                <span className={typeColor[type]}>
                    {isArray ? `Array(${(value as unknown[]).length})` : `{${Object.keys(value as object).length} keys}`}
                </span>
            </div>
            {expanded && children.map(({ key, val, childPath }) => (
                <TreeNode
                    key={String(key)}
                    keyName={key}
                    value={val}
                    path={childPath}
                    depth={depth + 1}
                    onSelect={onSelect}
                    selectedPath={selectedPath}
                    searchTerm={searchTerm}
                />
            ))}
        </div>
    );
};

export const JsonPathFinder: React.FC = () => {
    const [input, setInput] = useState('');
    const [parsedJson, setParsedJson] = useState<unknown>(null);
    const [error, setError] = useState('');
    const [selectedPath, setSelectedPath] = useState<PathResult | null>(null);
    const [selectedPathStr, setSelectedPathStr] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setInput(val);
        if (!val.trim()) {
            setParsedJson(null);
            setError('');
            setSelectedPath(null);
            setSelectedPathStr(null);
            return;
        }
        try {
            const parsed = JSON.parse(val);
            setParsedJson(parsed);
            setError('');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Invalid JSON';
            setError(msg);
            setParsedJson(null);
            setSelectedPath(null);
            setSelectedPathStr(null);
        }
    }, []);

    const handleNodeSelect = useCallback((path: string, value: unknown) => {
        const result: PathResult = {
            dot: buildDotPath(path),
            bracket: buildBracketPath(path),
            jsonPath: buildJsonPath(path),
            jsAccessor: buildJsAccessor(path),
            value,
            type: getType(value),
        };
        setSelectedPath(result);
        setSelectedPathStr(path);
    }, []);

    const copyField = useCallback(async (label: string, text: string) => {
        await navigator.clipboard.writeText(text);
        setCopiedField(label);
        setTimeout(() => setCopiedField(null), 1500);
    }, []);

    // Collect all matching key paths for the search
    const searchResults = useMemo(() => {
        if (!searchTerm || !parsedJson) return [];
        const results: string[] = [];

        const walk = (val: unknown, path: string) => {
            if (typeof val !== 'object' || val === null) return;
            const keys = Array.isArray(val) ? (val as unknown[]).map((_, i) => String(i)) : Object.keys(val as object);
            for (const k of keys) {
                const childPath = Array.isArray(val) ? `${path}[${k}]` : (path ? `${path}.${k}` : k);
                if (k.toLowerCase().includes(searchTerm.toLowerCase())) {
                    results.push(childPath);
                }
                const child = Array.isArray(val) ? (val as unknown[])[Number(k)] : (val as Record<string, unknown>)[k];
                walk(child, childPath);
            }
        };
        walk(parsedJson, '');
        return results;
    }, [searchTerm, parsedJson]);

    const pathFields = selectedPath ? [
        { label: 'Dot Notation', value: selectedPath.dot },
        { label: 'Bracket Notation', value: selectedPath.bracket },
        { label: 'JSONPath', value: selectedPath.jsonPath },
        { label: 'JS Accessor', value: selectedPath.jsAccessor },
    ] : [];

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600">
                    <MousePointer size={22} />
                </div>
                <div>
                    <h2 className="text-base font-bold text-slate-800">JSON Path Finder</h2>
                    <p className="text-xs text-slate-500">Click any value in the tree to get its path in multiple formats</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                {/* Left: Input */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col">
                    <label className="text-xs font-semibold text-slate-600 mb-2 block">Paste JSON</label>
                    <LineNumberedTextarea
                        value={input}
                        onChange={handleInputChange}
                        placeholder={'{\n  "store": {\n    "books": [\n      {"title": "Clean Code", "price": 450}\n    ]\n  }\n}'}
                        className="w-full h-80 border-none rounded-none focus:ring-0 resize-none"
                        containerClassName="flex-1 focus-within:ring-pink-500/20"
                        spellCheck={false}
                    />
                    {error && (
                        <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
                            <span className="font-bold">Error: </span>{error}
                        </div>
                    )}
                </div>

                {/* Right: Tree */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                        <label className="text-xs font-semibold text-slate-600">Interactive Tree</label>
                        <div className="ml-auto relative flex-1 max-w-48">
                            <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Search keys..."
                                className="w-full pl-7 pr-2 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                            />
                        </div>
                    </div>

                    {searchTerm && searchResults.length > 0 && (
                        <div className="mb-2 text-[10px] text-pink-600 font-semibold">
                            {searchResults.length} match{searchResults.length > 1 ? 'es' : ''} found
                        </div>
                    )}

                    <div className="flex-1 overflow-auto border border-slate-200 rounded-lg p-2 bg-slate-50 min-h-[300px] max-h-[360px]">
                        {parsedJson !== null ? (
                            <TreeNode
                                keyName="(root)"
                                value={parsedJson}
                                path=""
                                depth={0}
                                onSelect={handleNodeSelect}
                                selectedPath={selectedPathStr}
                                searchTerm={searchTerm}
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                                Paste valid JSON to see the tree
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Path Results Panel */}
            {selectedPath && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <h4 className="text-xs font-bold text-slate-700">Path to Selected Value</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedPath.type === 'string' ? 'bg-green-100 text-green-700' :
                            selectedPath.type === 'number' ? 'bg-blue-100 text-blue-700' :
                                selectedPath.type === 'boolean' ? 'bg-orange-100 text-orange-700' :
                                    selectedPath.type === 'null' ? 'bg-slate-100 text-slate-500' :
                                        selectedPath.type === 'array' ? 'bg-purple-100 text-purple-700' :
                                            'bg-slate-100 text-slate-700'
                            }`}>
                            {selectedPath.type}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                        {pathFields.map(f => (
                            <div key={f.label} className="bg-slate-50 rounded-lg p-2.5 flex items-center gap-2">
                                <div className="flex-1 min-w-0">
                                    <div className="text-[10px] font-semibold text-slate-500 mb-0.5">{f.label}</div>
                                    <div className="font-mono text-xs text-slate-800 truncate">{f.value}</div>
                                </div>
                                <button
                                    onClick={() => copyField(f.label, f.value)}
                                    className="p-1.5 rounded-md hover:bg-slate-200 transition-colors flex-shrink-0"
                                    title={`Copy ${f.label}`}
                                >
                                    <Copy size={12} className={copiedField === f.label ? 'text-emerald-600' : 'text-slate-400'} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="bg-slate-50 rounded-lg p-2.5">
                        <div className="text-[10px] font-semibold text-slate-500 mb-0.5">Value Preview</div>
                        <div className={`font-mono text-xs break-all ${typeColor[selectedPath.type] || 'text-slate-700'}`}>
                            {typeof selectedPath.value === 'object'
                                ? JSON.stringify(selectedPath.value, null, 2).slice(0, 500)
                                : formatPreview(selectedPath.value)
                            }
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
