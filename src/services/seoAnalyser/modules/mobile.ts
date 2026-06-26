import type { ModuleResult, CheckResult } from '../../../types/seoAnalyser';

export function analyzeMobile(doc: Document, performanceRaw?: any): ModuleResult {
  const checks: CheckResult[] = [];
  let score = 0;

  // Viewport meta tag
  const viewport = doc.querySelector('meta[name="viewport"]');
  if (viewport) {
    const content = viewport.getAttribute('content') || '';
    const hasWidth = content.includes('width=device-width');
    const hasScale = content.includes('initial-scale=1');
    if (hasWidth && hasScale) {
      score += 30;
      checks.push({ name: 'Viewport Meta Tag', status: 'pass', value: 'Properly configured', detail: 'width=device-width, initial-scale=1' });
    } else {
      score += 15;
      checks.push({
        name: 'Viewport Meta Tag', status: 'warn', value: content,
        detail: `Missing: ${[!hasWidth && 'width=device-width', !hasScale && 'initial-scale=1'].filter(Boolean).join(', ')}`,
      });
    }
  } else {
    checks.push({ name: 'Viewport Meta Tag', status: 'fail', value: 'Missing', detail: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">' });
  }

  // Responsive images
  const images = doc.querySelectorAll('img');
  let responsiveCount = 0;
  images.forEach(img => {
    if (img.hasAttribute('srcset') || img.getAttribute('style')?.includes('max-width')) responsiveCount++;
  });
  if (images.length === 0) {
    score += 15;
    checks.push({ name: 'Responsive Images', status: 'info', value: 'No images', detail: 'No images to check' });
  } else {
    const pct = Math.round((responsiveCount / images.length) * 100);
    if (pct >= 50) {
      score += 15;
      checks.push({ name: 'Responsive Images', status: 'pass', value: `${responsiveCount}/${images.length}`, detail: 'Good use of responsive image attributes' });
    } else {
      score += 5;
      checks.push({ name: 'Responsive Images', status: 'warn', value: `${responsiveCount}/${images.length}`, detail: 'Add srcset attribute to images for responsive loading' });
    }
  }

  // No deprecated tech
  const deprecated = doc.querySelectorAll('object, embed, applet');
  if (deprecated.length === 0) {
    score += 20;
    checks.push({ name: 'No Deprecated Tech', status: 'pass', value: 'Clean', detail: 'No Flash, Java applets, or embed tags found' });
  } else {
    checks.push({ name: 'No Deprecated Tech', status: 'fail', value: `${deprecated.length} found`, detail: 'Remove <object>, <embed>, <applet> tags — not mobile-friendly' });
  }

  // Touch-friendly font size check
  const smallFonts = doc.querySelectorAll('[style*="font-size"]');
  let tinyFontCount = 0;
  smallFonts.forEach(el => {
    const style = el.getAttribute('style') || '';
    const match = style.match(/font-size:\s*(\d+)px/);
    if (match && parseInt(match[1]) < 14) tinyFontCount++;
  });
  if (tinyFontCount === 0) {
    score += 15;
    checks.push({ name: 'Font Legibility', status: 'pass', value: 'Good', detail: 'No extremely small inline font sizes detected' });
  } else {
    score += 5;
    checks.push({ name: 'Font Legibility', status: 'warn', value: `${tinyFontCount} elements`, detail: 'Some elements have font-size < 14px — may be hard to read on mobile' });
  }

  // Mobile PageSpeed score (from performance module raw data)
  if (performanceRaw?.['interactive']) {
    const tti = performanceRaw['interactive'].numericValue;
    if (tti < 5000) {
      score += 20;
      checks.push({ name: 'Mobile Load Speed', status: 'pass', value: `${(tti / 1000).toFixed(1)}s`, detail: 'Fast time to interactive on mobile' });
    } else if (tti < 10000) {
      score += 10;
      checks.push({ name: 'Mobile Load Speed', status: 'warn', value: `${(tti / 1000).toFixed(1)}s`, detail: 'Moderate mobile load time — aim for under 5s' });
    } else {
      checks.push({ name: 'Mobile Load Speed', status: 'fail', value: `${(tti / 1000).toFixed(1)}s`, detail: 'Very slow on mobile — optimise for faster loading' });
    }
  }

  return { module: 'Mobile Readiness', score: Math.min(100, score), checks };
}
