import type { ModuleResult, CheckResult } from '../../../types/seoAnalyser';

export function analyzeSEOFundamentals(doc: Document): ModuleResult {
  const checks: CheckResult[] = [];
  let score = 0;

  // Title tag
  const title = doc.querySelector('title')?.textContent?.trim() || '';
  const titleLen = title.length;
  if (title) {
    score += 20;
    if (titleLen >= 50 && titleLen <= 60) score += 10;
    else if (titleLen >= 40 && titleLen <= 70) score += 7;
    else if (titleLen >= 30 && titleLen <= 79) score += 4;
    checks.push({
      name: 'Title Tag', status: 'pass', value: title,
      detail: `${titleLen} characters found`,
    });
    checks.push({
      name: 'Title Length',
      status: titleLen >= 50 && titleLen <= 60 ? 'pass' : 'warn',
      value: `${titleLen} chars`,
      detail: 'Optimal: 50–60 characters',
    });
  } else {
    checks.push({ name: 'Title Tag', status: 'fail', value: 'Missing', detail: 'Add a <title> tag immediately' });
  }

  // Meta description
  const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || '';
  const descLen = metaDesc.length;
  if (metaDesc) {
    score += 15;
    if (descLen >= 150 && descLen <= 160) score += 10;
    else if (descLen >= 120 && descLen <= 170) score += 7;
    else if (descLen >= 100 && descLen <= 180) score += 4;
    checks.push({
      name: 'Meta Description',
      status: descLen >= 150 && descLen <= 160 ? 'pass' : 'warn',
      value: metaDesc.substring(0, 60) + (metaDesc.length > 60 ? '...' : ''),
      detail: `${descLen} chars. Optimal: 150–160`,
    });
  } else {
    checks.push({
      name: 'Meta Description', status: 'fail', value: 'Missing',
      detail: 'Missing meta description — Google will auto-generate one',
    });
  }

  // H1 count
  const h1s = doc.querySelectorAll('h1');
  if (h1s.length === 1) {
    score += 15;
    checks.push({ name: 'H1 Tag', status: 'pass', value: h1s[0].textContent?.trim() || '', detail: 'Exactly 1 H1 found — correct' });
  } else if (h1s.length === 0) {
    score += 8;
    checks.push({ name: 'H1 Tag', status: 'fail', value: 'Missing H1', detail: 'No H1 tag found — add one with your primary keyword' });
  } else {
    score += 5;
    checks.push({ name: 'H1 Tag', status: 'warn', value: `${h1s.length} H1 tags`, detail: 'Multiple H1 tags found — keep exactly 1' });
  }

  // H2 tags
  const h2s = doc.querySelectorAll('h2');
  if (h2s.length >= 2) {
    score += 5;
    checks.push({ name: 'H2 Tags', status: 'pass', value: `${h2s.length} found`, detail: 'Good content structure with subheadings' });
  } else {
    checks.push({ name: 'H2 Tags', status: 'warn', value: `${h2s.length} found`, detail: 'Add more H2 subheadings for better structure' });
  }

  // H3–H6
  const h3plus = doc.querySelectorAll('h3, h4, h5, h6');
  if (h3plus.length >= 1) {
    score += 3;
    checks.push({ name: 'H3–H6 Tags', status: 'pass', value: `${h3plus.length} found`, detail: 'Good content hierarchy' });
  }

  // Canonical tag
  const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href');
  if (canonical) {
    score += 10;
    checks.push({ name: 'Canonical Tag', status: 'pass', value: canonical, detail: 'Canonical URL properly set' });
  } else {
    score += 5;
    checks.push({ name: 'Canonical Tag', status: 'warn', value: 'Missing', detail: 'Add canonical tag to prevent duplicate content issues' });
  }

  // Robots meta
  const robotsMeta = doc.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
  if (robotsMeta.includes('noindex')) {
    checks.push({ name: 'Robots Meta', status: 'fail', value: robotsMeta, detail: 'CRITICAL: noindex detected — page will NOT appear in Google' });
  } else {
    score += 5;
    checks.push({ name: 'Robots Meta', status: 'pass', value: robotsMeta || 'Default (index, follow)', detail: 'Page is indexable' });
  }

  // Open Graph
  const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content');
  const ogDesc = doc.querySelector('meta[property="og:description"]')?.getAttribute('content');
  const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
  const ogCount = [ogTitle, ogDesc, ogImage].filter(Boolean).length;
  if (ogCount === 3) {
    score += 7;
    checks.push({ name: 'Open Graph', status: 'pass', value: 'Complete', detail: 'og:title, og:description, og:image all present' });
  } else if (ogCount > 0) {
    score += 4;
    const missing = [!ogTitle && 'og:title', !ogDesc && 'og:description', !ogImage && 'og:image'].filter(Boolean).join(', ');
    checks.push({ name: 'Open Graph', status: 'warn', value: `${ogCount}/3 tags`, detail: `Missing: ${missing}` });
  } else {
    checks.push({ name: 'Open Graph', status: 'fail', value: 'None found', detail: 'Add Open Graph tags for better social sharing' });
  }

  return { module: 'SEO Fundamentals', score: Math.min(100, score), checks };
}
