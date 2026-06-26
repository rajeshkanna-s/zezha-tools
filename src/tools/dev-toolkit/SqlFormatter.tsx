import React, { useState, useMemo, useCallback } from "react";
import { LineNumberedTextarea } from "./LineNumberedTextarea";

const SQL_KEYWORDS = [
  "WITH",
  "SELECT",
  "DISTINCT",
  "FROM",
  "LEFT JOIN",
  "RIGHT JOIN",
  "INNER JOIN",
  "JOIN",
  "ON",
  "WHERE",
  "AND",
  "OR",
  "GROUP BY",
  "ORDER BY",
  "HAVING",
  "LIMIT",
  "INSERT",
  "INTO",
  "VALUES",
  "UPDATE",
  "SET",
  "DELETE",
  "CREATE",
  "ALTER",
  "DROP",
  "UNION",
  "CASE",
  "WHEN",
  "THEN",
  "ELSE",
  "END",
  "AS",
  "IN",
  "NOT",
  "NULL",
  "IS",
  "BETWEEN",
  "LIKE",
  "EXISTS",
];

const MAJOR_KEYWORDS = new Set([
  "SELECT",
  "FROM",
  "WHERE",
  "LEFT JOIN",
  "RIGHT JOIN",
  "INNER JOIN",
  "JOIN",
  "GROUP BY",
  "ORDER BY",
  "HAVING",
  "LIMIT",
  "INSERT",
  "INTO",
  "VALUES",
  "UPDATE",
  "SET",
  "DELETE",
  "CREATE",
  "ALTER",
  "DROP",
  "UNION",
  "WITH",
]);

const INDENT_AFTER = new Set(["SELECT", "WHERE", "SET", "VALUES"]);
const SUB_INDENT = new Set(["AND", "OR", "ON"]);

interface Token {
  type: "keyword" | "text";
  value: string;
}

function tokenizeSql(sql: string): Token[] {
  const tokens: Token[] = [];
  let remaining = sql.replace(/\s+/g, " ").trim();

  while (remaining.length > 0) {
    let matched = false;
    const upper = remaining.toUpperCase();

    for (const kw of SQL_KEYWORDS) {
      if (upper.startsWith(kw)) {
        const nextChar = remaining[kw.length];
        if (!nextChar || /[\s,();]/.test(nextChar)) {
          tokens.push({ type: "keyword", value: kw });
          remaining = remaining.slice(kw.length).trimStart();
          matched = true;
          break;
        }
      }
    }

    if (!matched) {
      let end = remaining.length;
      const upperRem = remaining.toUpperCase();
      for (const kw of SQL_KEYWORDS) {
        const spaced = " " + kw;
        const idx = upperRem.indexOf(spaced);
        if (idx !== -1 && idx < end) {
          end = idx;
        }
      }
      tokens.push({ type: "text", value: remaining.slice(0, end).trim() });
      remaining = remaining.slice(end).trimStart();
    }
  }

  return tokens.filter((t) => t.value.length > 0);
}

function formatSql(sql: string): string {
  const tokens = tokenizeSql(sql);
  const lines: string[] = [];
  let currentLine = "";
  let indentLevel = 0;
  const indent = "    ";
  let lastKeyword = "";

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === "keyword") {
      const kw = token.value;

      if (MAJOR_KEYWORDS.has(kw)) {
        if (currentLine.trim()) {
          lines.push(indent.repeat(indentLevel) + currentLine.trim());
        }
        indentLevel = 0;
        currentLine = kw;
        lastKeyword = kw;

        if (INDENT_AFTER.has(kw)) {
          lines.push(currentLine);
          currentLine = "";
          indentLevel = 1;
        }
      } else if (SUB_INDENT.has(kw)) {
        if (currentLine.trim()) {
          lines.push(indent.repeat(indentLevel) + currentLine.trim());
        }
        currentLine = kw;
        indentLevel = 1;
      } else if (kw === "CASE") {
        if (currentLine.trim()) {
          currentLine += " " + kw;
        } else {
          currentLine = kw;
        }
      } else if (kw === "WHEN" || kw === "THEN" || kw === "ELSE") {
        if (currentLine.trim()) {
          lines.push(indent.repeat(indentLevel) + currentLine.trim());
        }
        currentLine = kw;
        indentLevel = 2;
      } else if (kw === "END") {
        if (currentLine.trim()) {
          lines.push(indent.repeat(indentLevel) + currentLine.trim());
        }
        currentLine = kw;
        indentLevel = 1;
      } else {
        currentLine += " " + kw;
      }
    } else {
      const text = token.value;
      if (
        indentLevel === 1 &&
        (lastKeyword === "SELECT" || lastKeyword === "SET")
      ) {
        const parts = text.split(",").map((p) => p.trim());
        for (let pi = 0; pi < parts.length; pi++) {
          if (pi === 0) {
            currentLine += (currentLine ? " " : "") + parts[pi];
          } else {
            lines.push(indent.repeat(indentLevel) + currentLine.trim());
            currentLine = parts[pi];
          }
          if (pi < parts.length - 1) {
            currentLine += ",";
          }
        }
      } else {
        currentLine += (currentLine ? " " : "") + text;
      }
    }
  }

  if (currentLine.trim()) {
    lines.push(indent.repeat(indentLevel) + currentLine.trim());
  }

  return lines.join("\n");
}

function minifySql(sql: string): string {
  return sql.replace(/\s+/g, " ").replace(/\s*;\s*/g, ";").trim();
}

interface QueryAnalysis {
  tables: string[];
  columnCount: number;
  conditionCount: number;
}

function analyzeSql(sql: string): QueryAnalysis {
  const upper = sql.toUpperCase();
  const tables: string[] = [];

  const fromRegex =
    /(?:FROM|JOIN|LEFT\s+JOIN|RIGHT\s+JOIN|INNER\s+JOIN)\s+([a-zA-Z_][a-zA-Z0-9_.]*)/gi;
  let match: RegExpExecArray | null;
  while ((match = fromRegex.exec(sql)) !== null) {
    const name = match[1].trim();
    if (!SQL_KEYWORDS.includes(name.toUpperCase()) && !tables.includes(name)) {
      tables.push(name);
    }
  }

  const selectMatch = upper.match(/SELECT\s+(.*?)(?:\sFROM\s)/s);
  let columnCount = 0;
  if (selectMatch) {
    const cols = selectMatch[1];
    if (cols.trim() === "*") {
      columnCount = 1;
    } else {
      let depth = 0;
      let count = 1;
      for (const ch of cols) {
        if (ch === "(") depth++;
        else if (ch === ")") depth--;
        else if (ch === "," && depth === 0) count++;
      }
      columnCount = count;
    }
  }

  const conditionCount = (
    upper.match(/\b(WHERE|AND|OR|HAVING)\b/g) || []
  ).length;

  return { tables, columnCount, conditionCount };
}

export const SqlFormatter: React.FC = () => {
  const [input, setInput] = useState("");
  const [minifyMode, setMinifyMode] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState("");

  const formatted = useMemo(() => {
    if (!input.trim()) return "";
    return minifyMode ? minifySql(input) : formatSql(input);
  }, [input, minifyMode]);

  const outputLines = useMemo(() => {
    if (!formatted) return [];
    return formatted.split("\n");
  }, [formatted]);

  const analysis = useMemo(() => {
    if (!input.trim()) return null;
    return analyzeSql(input);
  }, [input]);

  const handleCopy = useCallback(async () => {
    if (!formatted) return;
    try {
      await navigator.clipboard.writeText(formatted);
      setCopyFeedback("Copied!");
      setTimeout(() => setCopyFeedback(""), 2000);
    } catch {
      setCopyFeedback("Failed to copy");
      setTimeout(() => setCopyFeedback(""), 2000);
    }
  }, [formatted]);

  const handleDownload = useCallback(() => {
    if (!formatted) return;
    const blob = new Blob([formatted], { type: "application/sql" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted_query.sql";
    a.click();
    URL.revokeObjectURL(url);
  }, [formatted]);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={minifyMode}
            onChange={(e) => setMinifyMode(e.target.checked)}
            className="accent-blue-600"
          />
          <span className="text-xs font-semibold text-slate-600">
            Minify Mode
          </span>
        </label>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={handleCopy}
            disabled={!formatted}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {copyFeedback || "Copy SQL"}
          </button>
          <button
            onClick={handleDownload}
            disabled={!formatted}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-700 text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Download .sql
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Input SQL
          </label>
          <LineNumberedTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your SQL query here..."
            className="w-full h-64 border-none rounded-none focus:ring-0 resize-y"
            containerClassName="flex-1 focus-within:ring-blue-500"
            spellCheck={false}
          />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Formatted Output
          </label>
          <div className="w-full h-64 font-mono text-xs border border-slate-200 rounded-lg p-3 overflow-auto bg-slate-50">
            {outputLines.length > 0 ? (
              <table className="w-full border-collapse">
                <tbody>
                  {outputLines.map((line, idx) => (
                    <tr key={idx}>
                      <td className="pr-3 text-right text-slate-400 select-none align-top w-8 border-r border-slate-200">
                        {idx + 1}
                      </td>
                      <td className="pl-3 whitespace-pre">{line}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <span className="text-slate-400">
                Formatted SQL will appear here...
              </span>
            )}
          </div>
        </div>
      </div>

      {analysis && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <label className="block text-xs font-bold text-slate-700 mb-3">
            Query Analysis
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-xs font-semibold text-blue-700 mb-1">
                Tables
              </div>
              <div className="text-sm font-bold text-blue-900">
                {analysis.tables.length > 0
                  ? analysis.tables.join(", ")
                  : "None detected"}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-xs font-semibold text-green-700 mb-1">
                Column Count
              </div>
              <div className="text-sm font-bold text-green-900">
                {analysis.columnCount}
              </div>
            </div>
            <div className="bg-amber-50 rounded-lg p-3">
              <div className="text-xs font-semibold text-amber-700 mb-1">
                Conditions
              </div>
              <div className="text-sm font-bold text-amber-900">
                {analysis.conditionCount}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
