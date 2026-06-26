import React, { useState, useEffect, useMemo, useCallback } from "react";

interface TimezoneInfo {
  label: string;
  zone: string;
}

const TIMEZONES: TimezoneInfo[] = [
  { label: "UTC", zone: "UTC" },
  { label: "IST (+5:30)", zone: "Asia/Kolkata" },
  { label: "EST (-5)", zone: "America/New_York" },
  { label: "PST (-8)", zone: "America/Los_Angeles" },
  { label: "Local", zone: Intl.DateTimeFormat().resolvedOptions().timeZone },
];

function formatInTimezone(date: Date, timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);
  } catch {
    return "Invalid timezone";
  }
}

function getRelativeTime(timestampMs: number): string {
  const now = Date.now();
  const diffMs = timestampMs - now;
  const absDiff = Math.abs(diffMs);
  const isPast = diffMs < 0;

  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  let text: string;
  if (years > 0) text = `${years} year${years > 1 ? "s" : ""}`;
  else if (months > 0) text = `${months} month${months > 1 ? "s" : ""}`;
  else if (days > 0) text = `${days} day${days > 1 ? "s" : ""}`;
  else if (hours > 0) text = `${hours} hour${hours > 1 ? "s" : ""}`;
  else if (minutes > 0) text = `${minutes} minute${minutes > 1 ? "s" : ""}`;
  else text = `${seconds} second${seconds !== 1 ? "s" : ""}`;

  return isPast ? `${text} ago` : `in ${text}`;
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // silently fail
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="px-2 py-1 rounded text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors shrink-0"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export const UnixTimestampConverter: React.FC = () => {
  const [mode, setMode] = useState<"unix-to-human" | "human-to-unix">(
    "unix-to-human"
  );
  const [unixInput, setUnixInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("");
  const [nowTimestamp, setNowTimestamp] = useState<number | null>(null);
  const [liveNow, setLiveNow] = useState(false);
  const [arithDays, setArithDays] = useState("0");
  const [arithHours, setArithHours] = useState("0");
  const [arithOperation, setArithOperation] = useState<"add" | "subtract">(
    "add"
  );

  useEffect(() => {
    if (!liveNow) return;
    setNowTimestamp(Math.floor(Date.now() / 1000));
    const interval = setInterval(() => {
      setNowTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [liveNow]);

  const parsedDate = useMemo(() => {
    if (mode === "unix-to-human") {
      const val = unixInput.trim();
      if (!val || isNaN(Number(val))) return null;
      const num = Number(val);
      const ms = val.length >= 13 ? num : num * 1000;
      const d = new Date(ms);
      if (isNaN(d.getTime())) return null;
      return { date: d, ms, isMilliseconds: val.length >= 13 };
    } else {
      if (!dateInput) return null;
      const dtStr = timeInput
        ? `${dateInput}T${timeInput}`
        : `${dateInput}T00:00:00`;
      const d = new Date(dtStr);
      if (isNaN(d.getTime())) return null;
      return { date: d, ms: d.getTime(), isMilliseconds: false };
    }
  }, [mode, unixInput, dateInput, timeInput]);

  const arithmeticResult = useMemo(() => {
    if (!parsedDate) return null;
    const days = parseInt(arithDays) || 0;
    const hours = parseInt(arithHours) || 0;
    const totalMs = (days * 86400 + hours * 3600) * 1000;
    const sign = arithOperation === "add" ? 1 : -1;
    const newMs = parsedDate.ms + sign * totalMs;
    const newDate = new Date(newMs);
    if (isNaN(newDate.getTime())) return null;
    return { date: newDate, ms: newMs };
  }, [parsedDate, arithDays, arithHours, arithOperation]);

  const handleNow = useCallback(() => {
    setLiveNow(true);
    const ts = Math.floor(Date.now() / 1000);
    setNowTimestamp(ts);
    if (mode === "unix-to-human") {
      setUnixInput(String(ts));
    }
  }, [mode]);

  const stopNow = useCallback(() => {
    setLiveNow(false);
    setNowTimestamp(null);
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex rounded-lg overflow-hidden border border-slate-200">
          <button
            onClick={() => setMode("unix-to-human")}
            className={`px-3 py-1.5 text-xs font-bold transition-colors ${
              mode === "unix-to-human"
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Unix to Human
          </button>
          <button
            onClick={() => setMode("human-to-unix")}
            className={`px-3 py-1.5 text-xs font-bold transition-colors ${
              mode === "human-to-unix"
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Human to Unix
          </button>
        </div>

        <div className="flex gap-2 ml-auto">
          {liveNow ? (
            <button
              onClick={stopNow}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Stop
            </button>
          ) : (
            <button
              onClick={handleNow}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Now
            </button>
          )}
        </div>
      </div>

      {liveNow && nowTimestamp !== null && (
        <div className="bg-green-50 rounded-xl border border-green-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-green-700">
                Current Unix Timestamp (live)
              </div>
              <div className="text-lg font-bold text-green-900 font-mono">
                {nowTimestamp}
              </div>
            </div>
            <CopyBtn text={String(nowTimestamp)} />
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <label className="block text-xs font-bold text-slate-700 mb-2">
          {mode === "unix-to-human"
            ? "Unix Timestamp"
            : "Date & Time"}
        </label>
        {mode === "unix-to-human" ? (
          <input
            type="text"
            value={unixInput}
            onChange={(e) => setUnixInput(e.target.value)}
            placeholder="e.g. 1700000000 or 1700000000000"
            className="w-full font-mono text-xs border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        ) : (
          <div className="flex gap-3">
            <input
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="flex-1 font-mono text-xs border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="time"
              step="1"
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
              className="flex-1 font-mono text-xs border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}
        {mode === "unix-to-human" && unixInput.trim() && (
          <div className="mt-1 text-xs text-slate-400">
            {unixInput.trim().length >= 13
              ? "Detected: milliseconds"
              : "Detected: seconds"}
          </div>
        )}
      </div>

      {parsedDate && (
        <>
          {mode === "human-to-unix" && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <label className="block text-xs font-bold text-slate-700 mb-3">
                Unix Timestamp
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-500">
                        Seconds
                      </div>
                      <div className="text-sm font-bold text-slate-900 font-mono">
                        {Math.floor(parsedDate.ms / 1000)}
                      </div>
                    </div>
                    <CopyBtn text={String(Math.floor(parsedDate.ms / 1000))} />
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-500">
                        Milliseconds
                      </div>
                      <div className="text-sm font-bold text-slate-900 font-mono">
                        {parsedDate.ms}
                      </div>
                    </div>
                    <CopyBtn text={String(parsedDate.ms)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <label className="block text-xs font-bold text-slate-700 mb-3">
              Timezones
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {TIMEZONES.map((tz) => {
                const formatted = formatInTimezone(parsedDate.date, tz.zone);
                return (
                  <div key={tz.label} className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-500">
                          {tz.label}
                        </div>
                        <div className="text-sm font-bold text-slate-900 font-mono">
                          {formatted}
                        </div>
                      </div>
                      <CopyBtn text={formatted} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                ISO 8601
              </label>
              <div className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
                <span className="text-sm font-mono text-slate-900">
                  {parsedDate.date.toISOString()}
                </span>
                <CopyBtn text={parsedDate.date.toISOString()} />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Relative Time
              </label>
              <div className="bg-slate-50 rounded-lg p-3">
                <span className="text-sm font-bold text-slate-900">
                  {getRelativeTime(parsedDate.ms)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <label className="block text-xs font-bold text-slate-700 mb-3">
              Date Arithmetic
            </label>
            <div className="flex items-end gap-3 flex-wrap">
              <div className="flex rounded-lg overflow-hidden border border-slate-200">
                <button
                  onClick={() => setArithOperation("add")}
                  className={`px-3 py-1.5 text-xs font-bold transition-colors ${
                    arithOperation === "add"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Add
                </button>
                <button
                  onClick={() => setArithOperation("subtract")}
                  className={`px-3 py-1.5 text-xs font-bold transition-colors ${
                    arithOperation === "subtract"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Subtract
                </button>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Days
                </label>
                <input
                  type="number"
                  value={arithDays}
                  onChange={(e) => setArithDays(e.target.value)}
                  min="0"
                  className="w-20 font-mono text-xs border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Hours
                </label>
                <input
                  type="number"
                  value={arithHours}
                  onChange={(e) => setArithHours(e.target.value)}
                  min="0"
                  className="w-20 font-mono text-xs border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {arithmeticResult &&
              (parseInt(arithDays) > 0 || parseInt(arithHours) > 0) && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-blue-700">
                          Result (Unix)
                        </div>
                        <div className="text-sm font-bold text-blue-900 font-mono">
                          {Math.floor(arithmeticResult.ms / 1000)}
                        </div>
                      </div>
                      <CopyBtn
                        text={String(Math.floor(arithmeticResult.ms / 1000))}
                      />
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-blue-700">
                          Result (ISO)
                        </div>
                        <div className="text-sm font-bold text-blue-900 font-mono">
                          {arithmeticResult.date.toISOString()}
                        </div>
                      </div>
                      <CopyBtn text={arithmeticResult.date.toISOString()} />
                    </div>
                  </div>
                </div>
              )}
          </div>
        </>
      )}

      {!parsedDate && !liveNow && (
        <div className="text-center text-xs text-slate-400 py-8">
          Enter a timestamp or date above to convert
        </div>
      )}
    </div>
  );
};
