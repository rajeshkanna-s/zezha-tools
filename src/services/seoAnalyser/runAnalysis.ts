import type { AnalysisResult } from '../../types/seoAnalyser';
import { fetchSiteHTML, parseHTML, normalizeUrl } from './fetchService';
import { analyzeSEOFundamentals } from './modules/seoFundamentals';
import { analyzePerformance } from './modules/performance';
import { analyzeUXContent } from './modules/uxContent';
import { analyzeKeywords } from './modules/keywords';
import { analyzeSecurity } from './modules/security';
import { analyzeTechnical } from './modules/technical';
import { analyzeMobile } from './modules/mobile';
import { analyzeSocial } from './modules/social';
import { calculateOverallScore } from './scoringEngine';
import { generateFixPlan } from './fixPlanGenerator';

export type AnalysisStep =
  | 'fetching' | 'seo' | 'performance' | 'ux' | 'keywords'
  | 'security' | 'technical' | 'mobile' | 'social' | 'scoring' | 'done';

export const ANALYSIS_STEPS: { key: AnalysisStep; label: string }[] = [
  { key: 'fetching', label: 'Fetching page...' },
  { key: 'seo', label: 'Checking SEO fundamentals...' },
  { key: 'performance', label: 'Measuring performance...' },
  { key: 'ux', label: 'Analysing content & UX...' },
  { key: 'keywords', label: 'Extracting keywords...' },
  { key: 'security', label: 'Scanning vulnerabilities...' },
  { key: 'technical', label: 'Checking technical health...' },
  { key: 'mobile', label: 'Testing mobile readiness...' },
  { key: 'social', label: 'Checking social & indexability...' },
  { key: 'scoring', label: 'Calculating scores...' },
];

export async function runFullAnalysis(
  inputUrl: string,
  onStep: (step: AnalysisStep, pct: number) => void,
  signal?: AbortSignal,
): Promise<AnalysisResult> {
  const url = normalizeUrl(inputUrl);
  const result: Partial<AnalysisResult> = { url, timestamp: new Date() };

  // Step 1: Fetch HTML
  onStep('fetching', 5);
  let doc: Document | null = null;
  try {
    if (signal?.aborted) throw new Error('Cancelled');
    const { html } = await fetchSiteHTML(url);
    doc = parseHTML(html);
  } catch (e) {
    if (signal?.aborted) throw e;
    // Continue without HTML — performance and security can still run
  }

  // Step 2: SEO Fundamentals (DOM-based)
  onStep('seo', 15);
  if (doc) {
    try { result.seo = analyzeSEOFundamentals(doc); } catch { result.seo = null; }
  }

  // Step 3: Performance (API call — runs in parallel with security)
  onStep('performance', 25);
  const perfPromise = analyzePerformance(url).catch(() => null);

  // Step 4: UX & Content
  onStep('ux', 35);
  if (doc) {
    try { result.ux = analyzeUXContent(doc); } catch { result.ux = null; }
  }

  // Step 5: Keywords
  onStep('keywords', 45);
  if (doc) {
    try { result.keywords = analyzeKeywords(doc); } catch { result.keywords = null; }
  }

  if (signal?.aborted) throw new Error('Cancelled');

  // Step 6: Security (API + checks)
  onStep('security', 55);
  try { result.security = await analyzeSecurity(url, doc); } catch { result.security = null; }

  // Step 7: Technical
  onStep('technical', 65);
  try { result.technical = await analyzeTechnical(url, doc); } catch { result.technical = null; }

  // Wait for performance
  result.performance = await perfPromise;

  // Step 8: Mobile
  onStep('mobile', 80);
  if (doc) {
    try { result.mobile = analyzeMobile(doc, result.performance?.raw); } catch { result.mobile = null; }
  }

  // Step 9: Social
  onStep('social', 90);
  if (doc) {
    try { result.social = analyzeSocial(doc); } catch { result.social = null; }
  }

  if (signal?.aborted) throw new Error('Cancelled');

  // Step 10: Calculate overall score and fix plan
  onStep('scoring', 95);
  const overall = calculateOverallScore(result);
  const fullResult: AnalysisResult = {
    url,
    timestamp: new Date(),
    overall,
    seo: result.seo || null,
    performance: result.performance || null,
    ux: result.ux || null,
    keywords: result.keywords || null,
    security: result.security || null,
    technical: result.technical || null,
    mobile: result.mobile || null,
    social: result.social || null,
    fixPlan: [],
  };

  fullResult.fixPlan = generateFixPlan(fullResult);

  onStep('done', 100);
  return fullResult;
}
