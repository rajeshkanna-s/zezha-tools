import type { ModuleResult, CheckResult } from '../../../types/seoAnalyser';

const STOP_WORDS = new Set([
  'the','a','an','and','or','but','in','on','at','to','for','of','with','by','from',
  'is','are','was','were','be','been','it','its','this','that','these','those',
  'has','have','had','do','does','did','will','would','could','should','may',
  'might','shall','can','need','not','no','nor','so','if','then','than','too',
  'very','just','about','above','after','again','all','also','am','any','as',
  'back','because','before','being','between','both','came','come','each',
  'even','every','get','got','he','her','here','him','his','how','into',
  'its','let','like','made','make','many','me','more','most','much','must',
  'my','new','now','off','old','one','only','other','our','out','over','own',
  'said','same','see','she','some','still','such','take','tell','their',
  'them','there','they','through','two','under','up','us','use','want','way',
  'we','well','what','when','where','which','while','who','why','you','your',
]);

export function extractPrimaryKeyword(title: string, h1: string, h2s: string[]): string {
  const allText = [title, h1, ...h2s].join(' ').toLowerCase();
  const words = allText.match(/\b[a-z]{3,}\b/g) || [];
  const meaningful = words.filter(w => !STOP_WORDS.has(w));

  const freq: Record<string, number> = {};
  meaningful.forEach(w => { freq[w] = (freq[w] || 0) + 1; });

  // 2-word phrases
  for (let i = 0; i < meaningful.length - 1; i++) {
    const phrase = `${meaningful[i]} ${meaningful[i + 1]}`;
    freq[phrase] = (freq[phrase] || 0) + 1.5;
  }

  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
}

export function analyzeKeywords(doc: Document): ModuleResult {
  const checks: CheckResult[] = [];
  let score = 0;

  const title = doc.querySelector('title')?.textContent?.trim() || '';
  const h1 = doc.querySelector('h1')?.textContent?.trim() || '';
  const h2s = Array.from(doc.querySelectorAll('h2')).map(el => el.textContent?.trim() || '');
  const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  const bodyText = doc.body?.textContent?.replace(/\s+/g, ' ').trim().toLowerCase() || '';
  const bodyWords = bodyText.split(/\s+/).filter(w => w.length > 0);
  const totalWords = bodyWords.length;

  const keyword = extractPrimaryKeyword(title, h1, h2s);

  if (!keyword) {
    checks.push({ name: 'Primary Keyword', status: 'fail', value: 'Could not identify', detail: 'No clear keyword theme in title, H1, or headings' });
    return { module: 'Keywords', score: 0, checks };
  }

  checks.push({ name: 'Primary Keyword', status: 'info', value: keyword, detail: 'Identified from title, H1, and heading analysis' });

  // Keyword in title
  if (title.toLowerCase().includes(keyword)) {
    score += 25;
    checks.push({ name: 'Keyword in Title', status: 'pass', value: 'Found', detail: `"${keyword}" appears in the title tag` });
  } else {
    checks.push({ name: 'Keyword in Title', status: 'fail', value: 'Missing', detail: `Add "${keyword}" to your title tag` });
  }

  // Keyword in H1
  if (h1.toLowerCase().includes(keyword)) {
    score += 20;
    checks.push({ name: 'Keyword in H1', status: 'pass', value: 'Found', detail: `"${keyword}" appears in the H1 tag` });
  } else {
    checks.push({ name: 'Keyword in H1', status: 'warn', value: 'Missing', detail: `Include "${keyword}" in your H1 heading` });
  }

  // Keyword in meta description
  if (metaDesc.toLowerCase().includes(keyword)) {
    score += 15;
    checks.push({ name: 'Keyword in Meta Description', status: 'pass', value: 'Found', detail: 'Keyword present in meta description' });
  } else {
    checks.push({ name: 'Keyword in Meta Description', status: 'warn', value: 'Missing', detail: `Add "${keyword}" to your meta description` });
  }

  // Keyword density
  const keywordCount = bodyText.split(keyword).length - 1;
  const density = totalWords > 0 ? (keywordCount / totalWords) * 100 : 0;
  const densityRounded = Math.round(density * 100) / 100;

  if (density >= 0.5 && density <= 2.5) {
    score += 20;
    checks.push({ name: 'Keyword Density', status: 'pass', value: `${densityRounded}% (${keywordCount} times)`, detail: 'Ideal range: 0.5–2.5%' });
  } else if (density < 0.5) {
    score += 10;
    checks.push({ name: 'Keyword Density', status: 'warn', value: `${densityRounded}% (${keywordCount} times)`, detail: 'Low density — use the keyword more naturally in your content' });
  } else {
    score += 5;
    checks.push({ name: 'Keyword Density', status: 'warn', value: `${densityRounded}% (${keywordCount} times)`, detail: 'Over-optimised — reduce keyword stuffing to avoid penalties' });
  }

  // Keyword in first 100 words
  const first100 = bodyWords.slice(0, 100).join(' ');
  if (first100.includes(keyword)) {
    score += 10;
    checks.push({ name: 'Keyword in First 100 Words', status: 'pass', value: 'Found', detail: 'Keyword appears early — helps search engines understand topic quickly' });
  } else {
    checks.push({ name: 'Keyword in First 100 Words', status: 'warn', value: 'Missing', detail: 'Place your keyword in the first paragraph' });
  }

  // LSI keyword variety
  const uniqueWords = new Set(bodyWords.filter(w => w.length >= 3 && !STOP_WORDS.has(w)));
  if (uniqueWords.size >= 200) {
    score += 10;
    checks.push({ name: 'Content Variety (LSI)', status: 'pass', value: `${uniqueWords.size} unique terms`, detail: 'Rich, diverse vocabulary — great for topical relevance' });
  } else if (uniqueWords.size >= 100) {
    score += 6;
    checks.push({ name: 'Content Variety (LSI)', status: 'warn', value: `${uniqueWords.size} unique terms`, detail: 'Add more topic-related terms for richer content' });
  } else {
    checks.push({ name: 'Content Variety (LSI)', status: 'fail', value: `${uniqueWords.size} unique terms`, detail: 'Very limited vocabulary — expand content with related terms' });
  }

  return { module: 'Keywords', score: Math.min(100, score), checks };
}
