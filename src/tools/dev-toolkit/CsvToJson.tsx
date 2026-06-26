import React, { useState, useMemo, useCallback, useRef } from "react";
import { LineNumberedTextarea } from "./LineNumberedTextarea";


function detectDelimiter(firstLine: string): string {
  const tab = (firstLine.match(/\t/g) || []).length;
  const semi = (firstLine.match(/;/g) || []).length;
  const comma = (firstLine.match(/,/g) || []).length;

  if (tab >= semi && tab >= comma && tab > 0) return "\t";
  if (semi >= comma && semi > 0) return ";";
  return ",";
}

function smartCast(value: string): string | number | boolean | null {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  if (trimmed.toLowerCase() === "true") return true;
  if (trimmed.toLowerCase() === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(trimmed) && trimmed !== "") {
    const num = Number(trimmed);
    if (!isNaN(num) && isFinite(num)) return num;
  }
  return trimmed;
}

function parseCsvLine(line: string, delimiter: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === delimiter) {
        fields.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
  }
  fields.push(current);
  return fields;
}

function parseCsv(
  text: string,
  delimiter: string
): { headers: string[]; rows: Record<string, string | number | boolean | null>[] } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };

  const headers = parseCsvLine(lines[0], delimiter).map((h) => h.trim());
  const rows: Record<string, string | number | boolean | null>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCsvLine(lines[i], delimiter);
    const row: Record<string, string | number | boolean | null> = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = smartCast(fields[j] ?? "");
    }
    rows.push(row);
  }

  return { headers, rows };
}

const delimiterLabel: Record<string, string> = {
  ",": "Comma",
  ";": "Semicolon",
  "\t": "Tab",
};

export const CsvToJson: React.FC = () => {
  const [csvText, setCsvText] = useState("");
  const [copyFeedback, setCopyFeedback] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const delimiter = useMemo(() => {
    if (!csvText.trim()) return ",";
    const firstLine = csvText.split(/\r?\n/)[0];
    return detectDelimiter(firstLine);
  }, [csvText]);

  const { headers, rows } = useMemo(() => {
    if (!csvText.trim()) return { headers: [] as string[], rows: [] };
    return parseCsv(csvText, delimiter);
  }, [csvText, delimiter]);

  const jsonOutput = useMemo(() => {
    if (rows.length === 0) return "";
    return JSON.stringify(rows, null, 2);
  }, [rows]);

  const previewRows = useMemo(() => rows.slice(0, 10), [rows]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        setCsvText(text);
      };
      reader.readAsText(file);
    },
    []
  );

  const handleCopy = useCallback(async () => {
    if (!jsonOutput) return;
    try {
      await navigator.clipboard.writeText(jsonOutput);
      setCopyFeedback("Copied!");
      setTimeout(() => setCopyFeedback(""), 2000);
    } catch {
      setCopyFeedback("Failed to copy");
      setTimeout(() => setCopyFeedback(""), 2000);
    }
  }, [jsonOutput]);

  const handleDownload = useCallback(() => {
    if (!jsonOutput) return;
    const blob = new Blob([jsonOutput], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [jsonOutput]);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-700 text-white hover:bg-slate-800 transition-colors"
        >
          Upload .csv
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.tsv,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />
        {csvText.trim() && (
          <span className="text-xs text-slate-500">
            Delimiter:{" "}
            <span className="font-semibold text-slate-700">
              {delimiterLabel[delimiter] || delimiter}
            </span>
          </span>
        )}
        <div className="flex gap-2 ml-auto">
          <button
            onClick={handleCopy}
            disabled={!jsonOutput}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {copyFeedback || "Copy JSON"}
          </button>
          <button
            onClick={handleDownload}
            disabled={!jsonOutput}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-700 text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Download .json
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col">
        <label className="block text-xs font-bold text-slate-700 mb-2">
          CSV Input
        </label>
        <LineNumberedTextarea
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          placeholder="Paste CSV data here or upload a file..."
          className="w-full h-40 border-none rounded-none focus:ring-0 resize-y"
          containerClassName="focus-within:ring-blue-500"
          spellCheck={false}
        />
      </div>

      {rows.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xs font-semibold text-blue-700">Rows</div>
            <div className="text-sm font-bold text-blue-900">{rows.length}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-xs font-semibold text-green-700">Columns</div>
            <div className="text-sm font-bold text-green-900">
              {headers.length}
            </div>
          </div>
        </div>
      )}

      {previewRows.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Preview (first {Math.min(10, rows.length)} rows)
          </label>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  {headers.map((h, i) => (
                    <th
                      key={i}
                      className="text-left px-3 py-2 bg-slate-100 border border-slate-200 font-semibold text-slate-700"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, ri) => (
                  <tr key={ri} className="hover:bg-slate-50">
                    {headers.map((h, ci) => (
                      <td
                        key={ci}
                        className="px-3 py-1.5 border border-slate-200 text-slate-600"
                      >
                        {row[h] === null ? (
                          <span className="text-slate-400 italic">null</span>
                        ) : typeof row[h] === "boolean" ? (
                          <span className="text-purple-600 font-semibold">
                            {String(row[h])}
                          </span>
                        ) : typeof row[h] === "number" ? (
                          <span className="text-blue-600">{String(row[h])}</span>
                        ) : (
                          String(row[h])
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <label className="block text-xs font-bold text-slate-700 mb-2">
          JSON Output
        </label>
        <pre className="w-full h-64 font-mono text-xs border border-slate-200 rounded-lg p-3 overflow-auto bg-slate-50 whitespace-pre-wrap">
          {jsonOutput || (
            <span className="text-slate-400">
              JSON output will appear here...
            </span>
          )}
        </pre>
      </div>
    </div>
  );
};
