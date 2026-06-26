import React, { useState, useMemo, useCallback } from "react";
import { LineNumberedTextarea } from "./LineNumberedTextarea";

interface DiffLine {
  type: "add" | "remove" | "equal" | "change";
  lineA?: number;
  lineB?: number;
  textA: string;
  textB: string;
}

interface CharDiff {
  type: "equal" | "add" | "remove";
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

function traceLCS(
  dp: number[][],
  a: string[],
  b: string[]
): { type: "equal" | "add" | "remove"; indexA?: number; indexB?: number }[] {
  const result: {
    type: "equal" | "add" | "remove";
    indexA?: number;
    indexB?: number;
  }[] = [];
  let i = a.length;
  let j = b.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      result.push({ type: "equal", indexA: i - 1, indexB: j - 1 });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.push({ type: "add", indexB: j - 1 });
      j--;
    } else {
      result.push({ type: "remove", indexA: i - 1 });
      i--;
    }
  }

  return result.reverse();
}

function computeCharDiff(a: string, b: string): CharDiff[] {
  const charsA = a.split("");
  const charsB = b.split("");
  const dp = buildLCSTable(charsA, charsB);
  const raw = traceLCS(dp, charsA, charsB);
  const result: CharDiff[] = [];

  for (const op of raw) {
    if (op.type === "equal") {
      result.push({ type: "equal", text: charsA[op.indexA!] });
    } else if (op.type === "remove") {
      result.push({ type: "remove", text: charsA[op.indexA!] });
    } else {
      result.push({ type: "add", text: charsB[op.indexB!] });
    }
  }

  // Merge consecutive same-type
  const merged: CharDiff[] = [];
  for (const cd of result) {
    if (merged.length > 0 && merged[merged.length - 1].type === cd.type) {
      merged[merged.length - 1].text += cd.text;
    } else {
      merged.push({ ...cd });
    }
  }
  return merged;
}

function computeSideBySideDiff(
  linesA: string[],
  linesB: string[],
  origA: string[],
  origB: string[]
): DiffLine[] {
  const dp = buildLCSTable(linesA, linesB);
  const raw = traceLCS(dp, linesA, linesB);

  // Group consecutive remove+add pairs as "change"
  const result: DiffLine[] = [];
  const ops = raw;
  let i = 0;

  while (i < ops.length) {
    if (ops[i].type === "equal") {
      const idx = ops[i].indexA!;
      const idxB = ops[i].indexB!;
      result.push({
        type: "equal",
        lineA: idx + 1,
        lineB: idxB + 1,
        textA: origA[idx],
        textB: origB[idxB],
      });
      i++;
    } else {
      // Collect consecutive removes and adds
      const removes: number[] = [];
      const adds: number[] = [];
      while (i < ops.length && ops[i].type === "remove") {
        removes.push(ops[i].indexA!);
        i++;
      }
      while (i < ops.length && ops[i].type === "add") {
        adds.push(ops[i].indexB!);
        i++;
      }
      // Pair them as changes
      const pairCount = Math.min(removes.length, adds.length);
      for (let p = 0; p < pairCount; p++) {
        result.push({
          type: "change",
          lineA: removes[p] + 1,
          lineB: adds[p] + 1,
          textA: origA[removes[p]],
          textB: origB[adds[p]],
        });
      }
      for (let p = pairCount; p < removes.length; p++) {
        result.push({
          type: "remove",
          lineA: removes[p] + 1,
          textA: origA[removes[p]],
          textB: "",
        });
      }
      for (let p = pairCount; p < adds.length; p++) {
        result.push({
          type: "add",
          lineB: adds[p] + 1,
          textA: "",
          textB: origB[adds[p]],
        });
      }
    }
  }

  return result;
}

const CharDiffSpan: React.FC<{ diffs: CharDiff[]; side: "a" | "b" }> = ({
  diffs,
  side,
}) => {
  return (
    <span className="whitespace-pre">
      {diffs.map((cd, i) => {
        if (cd.type === "equal") {
          return <span key={i}>{cd.text}</span>;
        }
        if (side === "a" && cd.type === "remove") {
          return (
            <span key={i} className="bg-red-200 rounded-sm">
              {cd.text}
            </span>
          );
        }
        if (side === "b" && cd.type === "add") {
          return (
            <span key={i} className="bg-green-200 rounded-sm">
              {cd.text}
            </span>
          );
        }
        return null;
      })}
    </span>
  );
};

export const CodeDiffChecker: React.FC = () => {
  const [codeA, setCodeA] = useState("");
  const [codeB, setCodeB] = useState("");
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [copied, setCopied] = useState(false);

  const diff = useMemo(() => {
    const origA = codeA.split("\n");
    const origB = codeB.split("\n");
    let normA = origA;
    let normB = origB;
    if (ignoreWhitespace) {
      normA = origA.map((l) => l.trim().replace(/\s+/g, " "));
      normB = origB.map((l) => l.trim().replace(/\s+/g, " "));
    }
    return computeSideBySideDiff(normA, normB, origA, origB);
  }, [codeA, codeB, ignoreWhitespace]);

  const charDiffs = useMemo(() => {
    const map = new Map<number, CharDiff[]>();
    diff.forEach((d, idx) => {
      if (d.type === "change") {
        map.set(idx, computeCharDiff(d.textA, d.textB));
      }
    });
    return map;
  }, [diff]);

  const stats = useMemo(() => {
    let added = 0;
    let removed = 0;
    let changed = 0;
    for (const d of diff) {
      if (d.type === "add") added++;
      else if (d.type === "remove") removed++;
      else if (d.type === "change") changed++;
    }
    return { added, removed, changed };
  }, [diff]);

  const handleCopy = useCallback(() => {
    const text = diff
      .map((d) => {
        if (d.type === "equal") return `  ${d.textA}`;
        if (d.type === "remove") return `- ${d.textA}`;
        if (d.type === "add") return `+ ${d.textB}`;
        return `- ${d.textA}\n+ ${d.textB}`;
      })
      .join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [diff]);

  const rowBgA = (type: string) => {
    if (type === "remove") return "bg-red-50";
    if (type === "change") return "bg-yellow-50";
    return "";
  };

  const rowBgB = (type: string) => {
    if (type === "add") return "bg-green-50";
    if (type === "change") return "bg-yellow-50";
    return "";
  };

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
        <div className="flex-1" />
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          {copied ? "Copied!" : "Copy Diff"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Code A (Original)
          </label>
          <LineNumberedTextarea
            value={codeA}
            onChange={(e) => setCodeA(e.target.value)}
            placeholder="Paste original code here..."
            className="w-full min-h-[200px] border-none rounded-none focus:ring-0 resize-y"
            containerClassName="flex-1 focus-within:ring-blue-300"
            spellCheck={false}
          />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Code B (Modified)
          </label>
          <LineNumberedTextarea
            value={codeB}
            onChange={(e) => setCodeB(e.target.value)}
            placeholder="Paste modified code here..."
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
        <span className="text-xs font-semibold text-yellow-600">
          ~{stats.changed} changed
        </span>
      </div>

      {(codeA || codeB) && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-auto max-h-[500px]">
          <div className="grid grid-cols-2 min-w-[600px]">
            {/* Left panel */}
            <div className="border-r border-slate-200">
              <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600">
                Original
              </div>
              <div className="font-mono text-xs leading-relaxed">
                {diff.map((d, idx) => {
                  const bg = rowBgA(d.type);
                  const cd = charDiffs.get(idx);
                  return (
                    <div
                      key={idx}
                      className={`flex ${bg} min-h-[1.5em] hover:brightness-95 transition-all`}
                    >
                      <span className="w-10 text-right pr-2 text-slate-400 select-none shrink-0 border-r border-slate-100">
                        {d.lineA ?? ""}
                      </span>
                      <span className="pl-2 whitespace-pre text-slate-700">
                        {d.type === "change" && cd ? (
                          <CharDiffSpan diffs={cd} side="a" />
                        ) : d.type === "add" ? (
                          ""
                        ) : (
                          d.textA
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Right panel */}
            <div>
              <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600">
                Modified
              </div>
              <div className="font-mono text-xs leading-relaxed">
                {diff.map((d, idx) => {
                  const bg = rowBgB(d.type);
                  const cd = charDiffs.get(idx);
                  return (
                    <div
                      key={idx}
                      className={`flex ${bg} min-h-[1.5em] hover:brightness-95 transition-all`}
                    >
                      <span className="w-10 text-right pr-2 text-slate-400 select-none shrink-0 border-r border-slate-100">
                        {d.lineB ?? ""}
                      </span>
                      <span className="pl-2 whitespace-pre text-slate-700">
                        {d.type === "change" && cd ? (
                          <CharDiffSpan diffs={cd} side="b" />
                        ) : d.type === "remove" ? (
                          ""
                        ) : (
                          d.textB
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
