import React, { useState, useMemo, useCallback, useRef } from "react";

interface DiffLine {
  type: "add" | "remove" | "equal";
  lineA?: number;
  lineB?: number;
  text: string;
}

interface FileData {
  name: string;
  size: number;
  content: string;
  lines: string[];
  lineCount: number;
  charCount: number;
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

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const DropZone: React.FC<{
  label: string;
  file: FileData | null;
  onFile: (f: FileData) => void;
}> = ({ label, file, onFile }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    (f: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;
        const lines = content.split("\n");
        onFile({
          name: f.name,
          size: f.size,
          content,
          lines,
          lineCount: lines.length,
          charCount: content.length,
        });
      };
      reader.readAsText(f);
    },
    [onFile]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <label className="block text-xs font-bold text-slate-700 mb-2">
        {label}
      </label>
      <div
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragOver
            ? "border-blue-400 bg-blue-50"
            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        {file ? (
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-700">{file.name}</p>
            <p className="text-xs text-slate-500">
              {formatSize(file.size)} &middot; {file.lineCount} lines &middot;{" "}
              {file.charCount.toLocaleString()} chars
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-500">
              Drop file here or click to browse
            </p>
            <p className="text-xs text-slate-400">Any text file</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const FileContentComparator: React.FC = () => {
  const [fileA, setFileA] = useState<FileData | null>(null);
  const [fileB, setFileB] = useState<FileData | null>(null);
  const [copied, setCopied] = useState(false);

  const diff = useMemo(() => {
    if (!fileA || !fileB) return [];
    return computeDiff(fileA.lines, fileB.lines);
  }, [fileA, fileB]);

  const stats = useMemo(() => {
    let added = 0;
    let removed = 0;
    let unchanged = 0;
    for (const d of diff) {
      if (d.type === "add") added++;
      else if (d.type === "remove") removed++;
      else unchanged++;
    }
    const total = Math.max(
      (fileA?.lineCount ?? 0) + (fileB?.lineCount ?? 0),
      1
    );
    const similarity =
      total > 0 ? ((unchanged * 2) / total * 100).toFixed(1) : "0.0";
    return { added, removed, unchanged, similarity };
  }, [diff, fileA, fileB]);

  const handleCopy = useCallback(() => {
    const text = diff
      .map((d) => {
        const prefix =
          d.type === "add" ? "+ " : d.type === "remove" ? "- " : "  ";
        return prefix + d.text;
      })
      .join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [diff]);

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DropZone label="File A (Original)" file={fileA} onFile={setFileA} />
        <DropZone label="File B (Modified)" file={fileB} onFile={setFileB} />
      </div>

      {fileA && fileB && (
        <>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
              <div>
                <p className="text-xs text-slate-500 font-semibold">
                  Lines (A)
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {fileA.lineCount}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">
                  Lines (B)
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {fileB.lineCount}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">Added</p>
                <p className="text-sm font-bold text-green-600">
                  +{stats.added}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">Removed</p>
                <p className="text-sm font-bold text-red-600">
                  -{stats.removed}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">
                  Unchanged
                </p>
                <p className="text-sm font-bold text-slate-600">
                  {stats.unchanged}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">
                  Similarity
                </p>
                <p className="text-sm font-bold text-blue-600">
                  {stats.similarity}%
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              {copied ? "Copied!" : "Copy Diff Output"}
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm overflow-auto max-h-[500px]">
            <div className="font-mono text-xs leading-relaxed">
              {diff.map((d, idx) => {
                const bgColor =
                  d.type === "add"
                    ? "bg-green-50"
                    : d.type === "remove"
                    ? "bg-red-50"
                    : "";
                const textColor =
                  d.type === "add"
                    ? "text-green-700"
                    : d.type === "remove"
                    ? "text-red-700"
                    : "text-slate-700";
                const prefix =
                  d.type === "add"
                    ? "+"
                    : d.type === "remove"
                    ? "\u2212"
                    : " ";

                return (
                  <div
                    key={idx}
                    className={`flex ${bgColor} hover:brightness-95 transition-all`}
                  >
                    <span className="w-10 text-right pr-2 text-slate-400 select-none shrink-0 border-r border-slate-100">
                      {d.lineA ?? ""}
                    </span>
                    <span className="w-10 text-right pr-2 text-slate-400 select-none shrink-0 border-r border-slate-100">
                      {d.lineB ?? ""}
                    </span>
                    <span
                      className={`pl-2 ${textColor} font-semibold w-4 shrink-0 select-none`}
                    >
                      {prefix}
                    </span>
                    <span className={`${textColor} whitespace-pre`}>
                      {d.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
