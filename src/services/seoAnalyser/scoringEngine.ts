import type { AnalysisResult } from '../../types/seoAnalyser';

const WEIGHTS: Record<string, number> = {
  seo: 0.25,
  performance: 0.20,
  ux: 0.15,
  keywords: 0.10,
  security: 0.15,
  technical: 0.10,
  mobile: 0.05,
  social: 0.05,
};

export function calculateOverallScore(result: Partial<AnalysisResult>): number {
  const modules: Record<string, number | null> = {
    seo: result.seo?.score ?? null,
    performance: result.performance?.score ?? null,
    ux: result.ux?.score ?? null,
    keywords: result.keywords?.score ?? null,
    security: result.security?.score ?? null,
    technical: result.technical?.score ?? null,
    mobile: result.mobile?.score ?? null,
    social: result.social?.score ?? null,
  };

  let weightedSum = 0;
  let totalWeight = 0;

  for (const [key, weight] of Object.entries(WEIGHTS)) {
    const score = modules[key];
    if (score !== null && score !== undefined) {
      weightedSum += score * weight;
      totalWeight += weight;
    }
  }

  let score = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;

  // Critical penalties
  const noindex = result.social?.checks?.some(c => c.name === 'Noindex Detected' && c.status === 'fail');
  if (noindex) score = Math.min(score, 30);

  const noHttps = result.security?.checks?.some(c => c.name === 'HTTPS Enforced' && c.status === 'fail');
  if (noHttps) score = Math.min(score, 50);

  return Math.min(100, Math.max(0, score));
}
