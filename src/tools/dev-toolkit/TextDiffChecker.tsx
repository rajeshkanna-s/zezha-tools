import React, { useState, useMemo, useCallback } from "react";
import { LineNumberedTextarea } from "./LineNumberedTextarea";

interface DiffLine {
  type: "add" | "remove" | "equal";
  lineA?: number;
  lineB?: number;
  text: string;
}

function buildLCSTable(a: string[], b: string[]): number[][] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp;
}

function computeDiff(linesA: string[], linesB: string[]): DiffLine[] {
  const dp = buildLCSTable(linesA, linesB);
  const result: DiffLine[] = [];
  let i = linesA.length;
  let j = linesB.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
      result.push({ type: "equal", lineA: i, lineB: j, text: linesA[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.push({ type: "add", lineB: j, text: linesB[j - 1] });
      j--;
    } else {
      result.push({ type: "remove", lineA: i, text: linesA[i - 1] });
      i--;
    }
  }

  return result.reverse();
}

function normalizeLines(
  text: string,
  ignoreWhitespace: boolean,
  ignoreCase: boolean
): string[] {
  let lines = text.split("\n");
  if (ignoreWhitespace) {
    lines = lines.map((l) => l.trim().replace(/\s+/g, " "));
  }
  if (ignoreCase) {
    lines = lines.map((l) => l.toLowerCase());
  }
  return lines;
}

export const TextDiffChecker: React.FC = () => {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [showOnlyDiffs, setShowOnlyDiffs] = useState(false);
  const [copied, setCopied] = useState(false);

  const diff = useMemo(() => {
    const normA = normalizeLines(textA, ignoreWhitespace, ignoreCase);
    const normB = normalizeLines(textB, ignoreWhitespace, ignoreCase);
    return computeDiff(normA, normB);
  }, [textA, textB, ignoreWhitespace, ignoreCase]);

  const stats = useMemo(() => {
    let added = 0;
    let removed = 0;
    let unchanged = 0;
    for (const d of diff) {
      if (d.type === "add") added++;
      else if (d.type === "remove") removed++;
      else unchanged++;
    }
    return { added, removed, unchanged };
  }, [diff]);

  const displayDiff = useMemo(() => {
    if (showOnlyDiffs) return diff.filter((d) => d.type !== "equal");
    return diff;
  }, [diff, showOnlyDiffs]);

  const diffText = useMemo(() => {
    return displayDiff
      .map((d) => {
        const prefix =
          d.type === "add" ? "+ " : d.type === "remove" ? "- " : "  ";
        return prefix + d.text;
      })
      .join("\n");
  }, [displayDiff]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(diffText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [diffText]);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={ignoreWhitespace}
            onChange={(e) => setIgnoreWhitespace(e.target.checked)}
            className="rounded"
          />
          Ignore whitespace
        </label>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={ignoreCase}
            onChange={(e) => setIgnoreCase(e.target.checked)}
            className="rounded"
          />
          Ignore case
        </label>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showOnlyDiffs}
            onChange={(e) => setShowOnlyDiffs(e.target.checked)}
            className="rounded"
          />
          Show only differences
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Text A (Original)
          </label>
          <LineNumberedTextarea
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            placeholder="Paste original text here..."
            className="w-full min-h-[200px] border-none rounded-none focus:ring-0 resize-y"
            containerClassName="flex-1 focus-within:ring-blue-300"
            spellCheck={false}
          />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Text B (Modified)
          </label>
          <LineNumberedTextarea
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            placeholder="Paste modified text here..."
            className="w-full min-h-[200px] border-none rounded-none focus:ring-0 resize-y"
            containerClassName="flex-1 focus-within:ring-blue-300"
            spellCheck={false}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-semibold text-green-600">
          +{stats.added} added
        </span>
        <span className="text-xs font-semibold text-red-600">
          -{stats.removed} removed
        </span>
        <span className="text-xs font-semibold text-slate-500">
          {stats.unchanged} unchanged
        </span>
        <div className="flex-1" />
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          {copied ? "Copied!" : "Copy Diff Output"}
        </button>
      </div>

      {(textA || textB) && displayDiff.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="flex bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500">
            <div className="flex-1 p-2 border-r border-slate-200 text-center">Original (Text A)</div>
            <div className="flex-1 p-2 text-center">Modified (Text B)</div>
          </div>
          <div className="overflow-auto max-h-[500px] flex w-full font-mono text-xs leading-relaxed bg-white">
            {/* Left Column (Original) */}
            <div className="flex-1 border-r border-slate-200">
              {displayDiff.map((d, idx) => {
                if (d.type === 'add') {
                  return <div key={idx} className="flex h-6 bg-slate-50/50 text-transparent select-none"><div className="w-10 border-r border-slate-100 shrink-0"></div></div>;
                }
                const isRemove = d.type === 'remove';
                return (
                  <div key={idx} className={`flex h-6 items-center ${isRemove ? 'bg-red-50 text-red-700 hover:brightness-95' : 'text-slate-700 hover:bg-slate-50'} transition-all`}>
                    <div className="w-10 text-right pr-2 text-slate-400 select-none shrink-0 border-r border-slate-100">
                      {d.lineA ?? ""}
                    </div>
                    <div className="px-2 font-semibold w-4 shrink-0 select-none">{isRemove ? '-' : ' '}</div>
                    <div className="whitespace-pre overflow-hidden text-ellipsis">{d.text}</div>
                  </div>
                );
              })}
            </div>
            {/* Right Column (Modified) */}
            <div className="flex-1">
              {displayDiff.map((d, idx) => {
                if (d.type === 'remove') {
                  return <div key={idx} className="flex h-6 bg-slate-50/50 text-transparent select-none"><div className="w-10 border-r border-slate-100 shrink-0"></div></div>;
                }
                const isAdd = d.type === 'add';
                return (
                  <div key={idx} className={`flex h-6 items-center ${isAdd ? 'bg-green-50 text-green-700 hover:brightness-95' : 'text-slate-700 hover:bg-slate-50'} transition-all`}>
                    <div className="w-10 text-right pr-2 text-slate-400 select-none shrink-0 border-r border-slate-100">
                      {d.lineB ?? ""}
                    </div>
                    <div className="px-2 font-semibold w-4 shrink-0 select-none">{isAdd ? '+' : ' '}</div>
                    <div className="whitespace-pre overflow-hidden text-ellipsis">{d.text}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
