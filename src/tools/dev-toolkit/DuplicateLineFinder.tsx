import React, { useState, useMemo, useCallback } from "react";
import { LineNumberedTextarea } from "./LineNumberedTextarea";

type OutputMode = "remove" | "keep-only" | "show-groups";
type SplitBy = "newline" | "word" | "comma";

interface DuplicateGroup {
  text: string;
  count: number;
  positions: number[];
}

export const DuplicateLineFinder: React.FC = () => {
  const [input, setInput] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [ignoreBlank, setIgnoreBlank] = useState(true);
  const [splitBy, setSplitBy] = useState<SplitBy>("newline");
  const [outputMode, setOutputMode] = useState<OutputMode>("remove");
  const [copied, setCopied] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  const parsedItems = useMemo(() => {
    const lines = input.split("\n");
    const result: { value: string; lineNum: number }[] = [];

    lines.forEach((lineText, lineIdx) => {
      const lineNum = lineIdx + 1;
      if (splitBy === "newline") {
        result.push({ value: lineText, lineNum });
      } else if (splitBy === "word") {
        const words = lineText.split(/\s+/).filter(Boolean);
        words.forEach(w => result.push({ value: w, lineNum }));
      } else if (splitBy === "comma") {
        const parts = lineText.split(",");
        parts.forEach(p => result.push({ value: p, lineNum }));
      }
    });
    return result;
  }, [input, splitBy]);

  const normalize = useCallback(
    (item: string) => {
      const trimmed = item.trim();
      return caseSensitive ? trimmed : trimmed.toLowerCase();
    },
    [caseSensitive]
  );

  const duplicateGroups = useMemo((): DuplicateGroup[] => {
    const map = new Map<string, { original: string; positions: Set<number>; count: number }>();

    parsedItems.forEach(({ value, lineNum }) => {
      if (ignoreBlank && value.trim() === "") return;
      if (!value) return;
      const key = normalize(value);
      const existing = map.get(key);
      if (existing) {
        existing.positions.add(lineNum);
        existing.count += 1;
      } else {
        map.set(key, { original: value, positions: new Set([lineNum]), count: 1 });
      }
    });

    return Array.from(map.values())
      .filter((g) => g.count > 1)
      .map((g) => ({
        text: g.original,
        count: g.count,
        positions: Array.from(g.positions).sort((a, b) => a - b),
      }))
      .sort((a, b) => b.count - a.count);
  }, [parsedItems, normalize, ignoreBlank]);

  const outputText = useMemo(() => {
    const lines = input.split("\n");

    if (outputMode === "remove") {
      const seen = new Set<string>();

      return lines.map((line) => {
        if (splitBy === "newline") {
          if (ignoreBlank && line.trim() === "") return line;
          const key = normalize(line);
          if (!seen.has(key)) { seen.add(key); return line; }
          return null; // remove line
        }
        else if (splitBy === "word") {
          const parts = line.split(/(\s+)/); // preserve whitespace
          return parts.map((part) => {
            if (part.trim() === "") return part; // keep whitespace
            const key = normalize(part);
            if (!seen.has(key)) { seen.add(key); return part; }
            return ""; // remove word
          }).join("");
        }
        else if (splitBy === "comma") {
          const parts = line.split(",");
          return parts.map((part) => {
            if (ignoreBlank && part.trim() === "") return part;
            const key = normalize(part);
            if (!seen.has(key)) { seen.add(key); return part; }
            return null;
          }).filter((p) => p !== null).join(",");
        }
        return "";
      }).filter((l) => l !== null).join("\n");
    }

    if (outputMode === "keep-only") {
      const counts = new Map<string, number>();
      parsedItems.forEach(({ value }) => {
        if (ignoreBlank && value.trim() === "") return;
        const key = normalize(value);
        counts.set(key, (counts.get(key) ?? 0) + 1);
      });

      const dupKeys = new Set<string>();
      for (const [k, v] of counts) {
        if (v > 1) dupKeys.add(k);
      }

      const seen = new Set<string>();

      return lines.map((line) => {
        if (splitBy === "newline") {
          if (ignoreBlank && line.trim() === "") return null;
          const key = normalize(line);
          if (dupKeys.has(key) && !seen.has(key)) { seen.add(key); return line; }
          return null;
        }
        else if (splitBy === "word") {
          const parts = line.split(/(\s+)/);
          const newParts = parts.map((part) => {
            if (part.trim() === "") return part;
            const key = normalize(part);
            if (dupKeys.has(key) && !seen.has(key)) { seen.add(key); return part; }
            return "";
          }).join("");
          return newParts.trim() === "" ? null : newParts; // omit line if empty
        }
        else if (splitBy === "comma") {
          const parts = line.split(",");
          const newParts = parts.map((part) => {
            if (ignoreBlank && part.trim() === "") return null;
            const key = normalize(part);
            if (dupKeys.has(key) && !seen.has(key)) { seen.add(key); return part; }
            return null;
          }).filter((p) => p !== null);
          return newParts.length > 0 ? newParts.join(",") : null;
        }
        return null;
      }).filter((l) => l !== null).join("\n");
    }

    // show-groups
    return duplicateGroups
      .map((g) => `"${g.text}" (${g.count}x, appears on lines: ${g.positions.join(", ")})`)
      .join("\n");
  }, [input, parsedItems, outputMode, normalize, ignoreBlank, duplicateGroups, splitBy]);

  const stats = useMemo(() => {
    const total = parsedItems.length;
    const nonBlankItems = parsedItems.filter(({ value }) => !ignoreBlank || value.trim() !== "");
    const nonBlank = nonBlankItems.length;
    const uniqueSet = new Set(nonBlankItems.map(({ value }) => normalize(value)));
    const unique = uniqueSet.size;
    const duplicatesRemoved = nonBlank - unique;
    return { total, unique, duplicatesRemoved };
  }, [parsedItems, normalize, ignoreBlank]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(outputText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [outputText]);

  const lineCount = useMemo(() => input.split("\n").length, [input]);
  const linesArr = useMemo(() => Array.from({ length: Math.max(1, lineCount) }, (_, i) => i + 1), [lineCount]);

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-1">Duplicate Finder</h2>
        <p className="text-xs text-slate-500 mb-4">Find and remove duplicate lines, words, or comma-separated items.</p>

        <div className="flex items-center gap-6 flex-wrap mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
            <span>Find duplicates in:</span>
            <select
              value={splitBy}
              onChange={(e) => setSplitBy(e.target.value as SplitBy)}
              className="rounded border-slate-200 text-xs py-1 px-2 focus:ring-2 focus:ring-blue-300 outline-none"
            >
              <option value="newline">Lines (Enter)</option>
              <option value="word">Words (Space)</option>
              <option value="comma">CSV Items (Comma)</option>
            </select>
          </label>
          <div className="w-px h-6 bg-slate-200 hidden md:block"></div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="rounded w-3.5 h-3.5 text-blue-600 accent-blue-600"
            />
            Case sensitive
          </label>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={ignoreBlank}
              onChange={(e) => setIgnoreBlank(e.target.checked)}
              className="rounded w-3.5 h-3.5 text-blue-600 accent-blue-600"
            />
            Ignore blank {splitBy === "newline" ? "lines" : "items"}
          </label>
        </div>

        <label className="block text-xs font-bold text-slate-700 mb-2">
          Input Text
        </label>
        <div className="flex bg-slate-50 border border-slate-200 rounded-lg overflow-hidden relative min-h-[160px] focus-within:ring-2 focus-within:ring-blue-300">
          <div className="w-12 bg-slate-100 border-r border-slate-200 text-right pr-2 py-3 font-mono text-xs text-slate-400 select-none overflow-hidden relative">
            <div style={{ transform: `translateY(-${scrollTop}px)`, position: 'absolute', right: '0.5rem', top: '0.75rem', width: '100%' }}>
              {linesArr.map(n => <div key={n} className="leading-relaxed h-[1.5rem] flex items-center justify-end">{n}</div>)}
            </div>
          </div>
          <LineNumberedTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
            wrap="off"
            placeholder={splitBy === 'newline' ? "Paste multiple lines of text here..." : "Paste text here to extract duplicates..."}
            className="flex-1 w-full border-none rounded-none focus:ring-0 resize-y bg-transparent"
            containerClassName="flex-1 focus-within:ring-0 w-full"
            spellCheck={false}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-600">Output mode:</span>
          {(
            [
              ["remove", "Remove duplicates"],
              ["keep-only", "Keep only duplicates"],
              ["show-groups", "Show duplicate groups"],
            ] as [OutputMode, string][]
          ).map(([value, label]) => (
            <label
              key={value}
              className={`flex items-center gap-1.5 text-xs font-semibold cursor-pointer select-none transition-colors ${outputMode === value ? 'text-blue-700' : 'text-slate-600 hover:text-slate-800'}`}
            >
              <input
                type="radio"
                name="outputMode"
                value={value}
                checked={outputMode === value}
                onChange={() => setOutputMode(value)}
                className="accent-blue-600"
              />
              {label}
            </label>
          ))}
        </div>

        <button
          onClick={handleCopy}
          disabled={!outputText}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm ${outputText ? copied ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'}`}
        >
          {copied ? "Copied!" : "Copy Output"}
        </button>
      </div>

      <div className="flex items-center gap-4 flex-wrap px-1">
        <span className="text-xs font-semibold text-slate-600">
          Total: {stats.total} {splitBy === "newline" ? "lines" : "items"}
        </span>
        <span className="text-xs font-semibold text-blue-600">
          Unique: {stats.unique}
        </span>
        <span className="text-xs font-semibold text-orange-600">
          Duplicates removed: {stats.duplicatesRemoved}
        </span>
      </div>

      {input && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col">
            <h3 className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
              <span>Processed Output</span>
              {splitBy !== 'newline' && outputMode !== 'show-groups' && (
                <span className="text-[10px] font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Structure preserved</span>
              )}
            </h3>
            <pre className="font-mono text-xs text-slate-700 whitespace-pre overflow-auto bg-slate-50 rounded-lg p-3 border border-slate-100" style={{ lineHeight: '1.5rem', minHeight: '200px', maxHeight: '400px' }}>
              {outputText}
            </pre>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col">
            <h3 className="text-xs font-bold text-slate-700 mb-2">
              Duplicate Report ({duplicateGroups.length} groups)
            </h3>
            {duplicateGroups.length === 0 ? (
              <div className="flex-grow min-h-[200px] flex items-center justify-center bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-400 font-semibold">No duplicates found.</p>
              </div>
            ) : (
              <div className="space-y-2 flex-grow max-h-[400px] overflow-auto pr-1">
                {duplicateGroups.map((g, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-200 bg-slate-50 rounded-lg p-2.5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <code className="text-xs font-mono font-semibold text-slate-800 break-all bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {g.text || <span className="text-slate-400 font-normal italic">(empty {splitBy === "newline" ? "line" : "item"})</span>}
                      </code>
                      <span className="shrink-0 px-2.5 py-0.5 bg-orange-100 text-orange-700 text-[10px] uppercase font-black tracking-wider rounded-full shadow-sm border border-orange-200">
                        {g.count}x
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-500 mt-2">
                      Appears on lines: <span className="text-slate-700 tabular-nums">{g.positions.join(", ")}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
