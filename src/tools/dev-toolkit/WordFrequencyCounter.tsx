import React, { useState, useMemo, useCallback } from "react";
import { LineNumberedTextarea } from "./LineNumberedTextarea";

const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
  "any", "are", "aren't", "as", "at", "be", "because", "been", "before",
  "being", "below", "between", "both", "but", "by", "can", "can't", "cannot",
  "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing",
  "don't", "down", "during", "each", "few", "for", "from", "further", "get",
  "got", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he",
  "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him",
  "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if",
  "in", "into", "is", "isn't", "it", "it's", "its", "itself", "just", "let's",
  "me", "might", "more", "most", "mustn't", "my", "myself", "no", "nor", "not",
  "now", "of", "off", "on", "once", "only", "or", "other", "ought", "our",
  "ours", "ourselves", "out", "over", "own", "per", "same", "shall", "shan't",
  "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some",
  "such", "than", "that", "that's", "the", "their", "theirs", "them",
  "themselves", "then", "there", "there's", "these", "they", "they'd",
  "they'll", "they're", "they've", "this", "those", "through", "to", "too",
  "under", "until", "up", "upon", "us", "very", "was", "wasn't", "we", "we'd",
  "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when",
  "when's", "where", "where's", "which", "while", "who", "who's", "whom",
  "why", "why's", "will", "with", "won't", "would", "wouldn't", "you",
  "you'd", "you'll", "you're", "you've", "your", "yours", "yourself",
  "yourselves",
]);

interface WordEntry {
  word: string;
  count: number;
}

export const WordFrequencyCounter: React.FC = () => {
  const [input, setInput] = useState("");
  const [excludeStopWords, setExcludeStopWords] = useState(false);
  const [caseInsensitive, setCaseInsensitive] = useState(true);
  const [minWordLength, setMinWordLength] = useState(1);
  const [copied, setCopied] = useState(false);

  const allWords = useMemo(() => {
    if (!input.trim()) return [];
    return input.match(/[a-zA-Z'-]+/g) || [];
  }, [input]);

  const wordFrequencies = useMemo((): WordEntry[] => {
    const map = new Map<string, number>();
    for (const raw of allWords) {
      let word = raw;
      if (caseInsensitive) word = word.toLowerCase();
      if (word.length < minWordLength) continue;
      if (excludeStopWords && STOP_WORDS.has(word.toLowerCase())) continue;
      map.set(word, (map.get(word) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));
  }, [allWords, caseInsensitive, minWordLength, excludeStopWords]);

  const top20 = useMemo(
    () => wordFrequencies.slice(0, 20),
    [wordFrequencies]
  );

  const maxCount = useMemo(
    () => (top20.length > 0 ? top20[0].count : 1),
    [top20]
  );

  const textStats = useMemo(() => {
    const totalWords = allWords.length;
    const uniqueWords = new Set(
      allWords.map((w) => (caseInsensitive ? w.toLowerCase() : w))
    ).size;
    const charCount = input.length;
    const sentences = input.split(/[.!?]+/).filter((s) => s.trim()).length;
    const paragraphs = input.split(/\n\s*\n/).filter((p) => p.trim()).length;
    const avgWordLength =
      totalWords > 0
        ? (allWords.reduce((s, w) => s + w.length, 0) / totalWords).toFixed(1)
        : "0";
    const readingTime = Math.max(1, Math.ceil(totalWords / 200));
    return {
      totalWords,
      uniqueWords,
      charCount,
      sentences,
      paragraphs,
      avgWordLength,
      readingTime,
    };
  }, [input, allWords, caseInsensitive]);

  const handleCopy = useCallback(() => {
    const text = wordFrequencies
      .map((w) => `${w.word}\t${w.count}`)
      .join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [wordFrequencies]);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={excludeStopWords}
            onChange={(e) => setExcludeStopWords(e.target.checked)}
            className="rounded"
          />
          Exclude stop words
        </label>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={caseInsensitive}
            onChange={(e) => setCaseInsensitive(e.target.checked)}
            className="rounded"
          />
          Case insensitive
        </label>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 select-none">
          Min word length:
          <input
            type="number"
            min={1}
            max={50}
            value={minWordLength}
            onChange={(e) =>
              setMinWordLength(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-14 text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </label>
        <div className="flex-1" />
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          {copied ? "Copied!" : "Copy Frequency Table"}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <label className="block text-xs font-bold text-slate-700 mb-2">
          Input Text
        </label>
        <LineNumberedTextarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your text here..."
          className="w-full min-h-[180px] border-none rounded-none focus:ring-0 resize-y"
          containerClassName="focus-within:ring-blue-300"
        />
      </div>

      {input.trim() && (
        <>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 text-center">
              <div>
                <p className="text-xs text-slate-500 font-semibold">
                  Total Words
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {textStats.totalWords.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">
                  Unique Words
                </p>
                <p className="text-sm font-bold text-blue-600">
                  {textStats.uniqueWords.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">
                  Characters
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {textStats.charCount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">
                  Sentences
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {textStats.sentences}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">
                  Paragraphs
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {textStats.paragraphs}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">
                  Avg Length
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {textStats.avgWordLength}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">
                  Read Time
                </p>
                <p className="text-sm font-bold text-slate-700">
                  ~{textStats.readingTime} min
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Bar chart */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-700 mb-3">
                Top 20 Words
              </h3>
              {top20.length === 0 ? (
                <p className="text-xs text-slate-400">No words found.</p>
              ) : (
                <div className="space-y-1.5">
                  {top20.map((w, idx) => {
                    const pct = (w.count / maxCount) * 100;
                    return (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-600 w-24 truncate text-right shrink-0">
                          {w.word}
                        </span>
                        <div className="flex-1 h-5 bg-slate-100 rounded overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-600 w-8 text-right shrink-0">
                          {w.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Frequency table */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-700 mb-3">
                Frequency Table ({wordFrequencies.length} words)
              </h3>
              <div className="max-h-[400px] overflow-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-1.5 px-2 font-bold text-slate-600">
                        #
                      </th>
                      <th className="text-left py-1.5 px-2 font-bold text-slate-600">
                        Word
                      </th>
                      <th className="text-right py-1.5 px-2 font-bold text-slate-600">
                        Count
                      </th>
                      <th className="text-right py-1.5 px-2 font-bold text-slate-600">
                        %
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {wordFrequencies.map((w, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-1 px-2 text-slate-400">{idx + 1}</td>
                        <td className="py-1 px-2 font-mono font-semibold text-slate-700">
                          {w.word}
                        </td>
                        <td className="py-1 px-2 text-right font-bold text-slate-700">
                          {w.count}
                        </td>
                        <td className="py-1 px-2 text-right text-slate-500">
                          {textStats.totalWords > 0
                            ? ((w.count / textStats.totalWords) * 100).toFixed(
                              1
                            )
                            : "0"}
                          %
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
