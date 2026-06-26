import type { ModuleResult, CheckResult } from '../../../types/seoAnalyser';

export function analyzeUXContent(doc: Document): ModuleResult {
  const checks: CheckResult[] = [];
  let score = 0;
  const maxScore = 100;

  // Word count
  const bodyText = doc.body?.textContent?.replace(/\s+/g, ' ').trim() || '';
  const words = bodyText.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  if (wordCount >= 1500) { score += 25; checks.push({ name: 'Word Count', status: 'pass', value: `${wordCount} words`, detail: 'Excellent content length for SEO' }); }
  else if (wordCount >= 600) { score += 20; checks.push({ name: 'Word Count', status: 'pass', value: `${wordCount} words`, detail: 'Good content length' }); }
  else if (wordCount >= 300) { score += 12; checks.push({ name: 'Word Count', status: 'warn', value: `${wordCount} words`, detail: 'Consider adding more content (aim for 600+ words)' }); }
  else { score += 5; checks.push({ name: 'Word Count', status: 'fail', value: `${wordCount} words`, detail: 'Very thin content — add at least 300 words' }); }

  // Reading time
  const readingTime = Math.ceil(wordCount / 200);
  checks.push({ name: 'Reading Time', status: 'info', value: `${readingTime} min read`, detail: `Based on ${wordCount} words at 200 wpm` });

  // Image alt text
  const images = doc.querySelectorAll('img');
  const imgTotal = images.length;
  let imgWithAlt = 0;
  images.forEach(img => {
    const alt = img.getAttribute('alt');
    if (alt && alt.trim().length > 0) imgWithAlt++;
  });

  if (imgTotal === 0) {
    score += 10;
    checks.push({ name: 'Image Alt Text', status: 'info', value: 'No images', detail: 'No images found on page' });
  } else {
    const altPct = Math.round((imgWithAlt / imgTotal) * 100);
    if (altPct >= 90) { score += 20; }
    else if (altPct >= 60) { score += 12; }
    else { score += 5; }
    checks.push({
      name: 'Image Alt Text',
      status: altPct >= 90 ? 'pass' : altPct >= 60 ? 'warn' : 'fail',
      value: `${imgWithAlt}/${imgTotal} (${altPct}%)`,
      detail: altPct >= 90 ? 'Good alt text coverage' : `${imgTotal - imgWithAlt} images missing alt text — fix for accessibility & SEO`,
    });
  }

  // Readability (avg words per sentence)
  const sentences = bodyText.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const avgWordsPerSentence = sentences.length > 0 ? Math.round(wordCount / sentences.length) : 0;
  if (avgWordsPerSentence > 0 && avgWordsPerSentence <= 15) {
    score += 15;
    checks.push({ name: 'Readability', status: 'pass', value: `${avgWordsPerSentence} words/sentence`, detail: 'Excellent readability — easy to understand' });
  } else if (avgWordsPerSentence <= 20) {
    score += 10;
    checks.push({ name: 'Readability', status: 'pass', value: `${avgWordsPerSentence} words/sentence`, detail: 'Good readability' });
  } else if (avgWordsPerSentence <= 25) {
    score += 6;
    checks.push({ name: 'Readability', status: 'warn', value: `${avgWordsPerSentence} words/sentence`, detail: 'Sentences are a bit long — aim for under 20 words' });
  } else if (avgWordsPerSentence > 25) {
    score += 3;
    checks.push({ name: 'Readability', status: 'fail', value: `${avgWordsPerSentence} words/sentence`, detail: 'Sentences too long — break into shorter, clearer sentences' });
  }

  // CTA detection
  const ctaPatterns = /sign\s*up|get\s*started|try\s*free|download|subscribe|buy\s*now|contact\s*us|learn\s*more|start\s*now|join\s*now/i;
  const buttons = doc.querySelectorAll('button, a.btn, a.button, [role="button"], input[type="submit"]');
  let ctaFound = false;
  buttons.forEach(btn => {
    if (ctaPatterns.test(btn.textContent || '')) ctaFound = true;
  });
  if (ctaPatterns.test(bodyText)) ctaFound = true;
  if (ctaFound) {
    score += 10;
    checks.push({ name: 'Call to Action', status: 'pass', value: 'Detected', detail: 'CTA elements found on page' });
  } else {
    checks.push({ name: 'Call to Action', status: 'warn', value: 'Not found', detail: 'Add a clear CTA (Sign Up, Get Started, etc.)' });
  }

  // Contact info
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(bodyText);
  const hasPhone = /[\+]?\d[\d\s-]{7,}/.test(bodyText);
  const hasContactLink = !!doc.querySelector('a[href*="contact"]');
  if (hasEmail || hasPhone || hasContactLink) {
    score += 10;
    checks.push({ name: 'Contact Info', status: 'pass', value: [hasEmail && 'Email', hasPhone && 'Phone', hasContactLink && 'Contact page'].filter(Boolean).join(', '), detail: 'Contact information is accessible' });
  } else {
    checks.push({ name: 'Contact Info', status: 'warn', value: 'Not found', detail: 'Add visible contact information for trust & SEO' });
  }

  // Content freshness
  const lastModified = doc.querySelector('meta[name="last-modified"]')?.getAttribute('content')
    || doc.querySelector('meta[property="article:modified_time"]')?.getAttribute('content');
  if (lastModified) {
    score += 10;
    checks.push({ name: 'Content Freshness', status: 'pass', value: lastModified, detail: 'Last modified date signals fresh content' });
  } else {
    checks.push({ name: 'Content Freshness', status: 'info', value: 'No date found', detail: 'Add a last-modified or dateModified tag for freshness signals' });
  }

  return { module: 'UX & Content', score: Math.min(maxScore, Math.round((score / 90) * 100)), checks };
}
