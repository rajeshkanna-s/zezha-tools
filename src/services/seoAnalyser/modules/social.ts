import type { ModuleResult, CheckResult } from '../../../types/seoAnalyser';

export function analyzeSocial(doc: Document): ModuleResult {
  const checks: CheckResult[] = [];
  let score = 0;

  // Open Graph completeness
  const ogTags = ['og:title', 'og:description', 'og:image', 'og:url'];
  const ogPresent = ogTags.filter(tag => {
    const el = doc.querySelector(`meta[property="${tag}"]`);
    return el && el.getAttribute('content');
  });
  if (ogPresent.length === 4) {
    score += 25;
    checks.push({ name: 'Open Graph Tags', status: 'pass', value: 'Complete', detail: 'All 4 OG tags present (title, description, image, url)' });
  } else if (ogPresent.length > 0) {
    score += 10;
    const missing = ogTags.filter(t => !ogPresent.includes(t));
    checks.push({ name: 'Open Graph Tags', status: 'warn', value: `${ogPresent.length}/4`, detail: `Missing: ${missing.join(', ')}` });
  } else {
    checks.push({ name: 'Open Graph Tags', status: 'fail', value: 'None', detail: 'Add Open Graph tags for better Facebook/LinkedIn sharing' });
  }

  // Twitter Card
  const twitterCard = doc.querySelector('meta[name="twitter:card"]')?.getAttribute('content');
  const twitterTitle = doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content');
  const twitterImage = doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content');
  const twCount = [twitterCard, twitterTitle, twitterImage].filter(Boolean).length;
  if (twCount === 3) {
    score += 20;
    checks.push({ name: 'Twitter Card', status: 'pass', value: twitterCard || 'Present', detail: 'Twitter Card tags complete' });
  } else if (twCount > 0) {
    score += 8;
    checks.push({ name: 'Twitter Card', status: 'warn', value: `${twCount}/3`, detail: 'Incomplete Twitter Card — add card, title, and image' });
  } else {
    checks.push({ name: 'Twitter Card', status: 'fail', value: 'None', detail: 'Add Twitter Card meta tags for better Twitter sharing' });
  }

  // Google site verification
  const gVerify = doc.querySelector('meta[name="google-site-verification"]');
  if (gVerify) {
    score += 10;
    checks.push({ name: 'Google Site Verification', status: 'pass', value: 'Present', detail: 'Google Search Console verification tag found' });
  } else {
    checks.push({ name: 'Google Site Verification', status: 'info', value: 'Not found', detail: 'Add Google site verification to connect Search Console' });
  }

  // Noindex check (CRITICAL)
  const robotsMeta = doc.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
  if (robotsMeta.toLowerCase().includes('noindex')) {
    score = Math.min(score, 10); // Cap score severely
    checks.push({
      name: 'Noindex Detected', status: 'fail', value: 'CRITICAL',
      detail: 'This page has noindex — it will NOT appear in Google search results',
    });
  } else {
    score += 15;
    checks.push({ name: 'Indexability', status: 'pass', value: 'Indexable', detail: 'Page is allowed to appear in search results' });
  }

  // Nofollow on internal links
  const internalLinks = doc.querySelectorAll('a[rel*="nofollow"]');
  let internalNofollowCount = 0;
  const origin = window.location.origin; // This won't match target site
  internalLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href.startsWith('/') || href.startsWith('#')) internalNofollowCount++;
  });
  if (internalNofollowCount > 0) {
    checks.push({ name: 'Internal Nofollow Links', status: 'warn', value: `${internalNofollowCount} found`, detail: 'Internal links with rel=nofollow block PageRank flow — usually a mistake' });
  } else {
    score += 10;
    checks.push({ name: 'Internal Nofollow Links', status: 'pass', value: 'None', detail: 'No internal nofollow links — PageRank flows freely' });
  }

  // RSS/Atom feed
  const feed = doc.querySelector('link[type="application/rss+xml"], link[type="application/atom+xml"]');
  if (feed) {
    score += 10;
    checks.push({ name: 'RSS/Atom Feed', status: 'pass', value: feed.getAttribute('href') || 'Present', detail: 'Content syndication feed found' });
  } else {
    checks.push({ name: 'RSS/Atom Feed', status: 'info', value: 'None', detail: 'Add RSS feed for content syndication' });
  }

  // OG Image dimensions hint
  const ogImg = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
  const ogImgWidth = doc.querySelector('meta[property="og:image:width"]')?.getAttribute('content');
  const ogImgHeight = doc.querySelector('meta[property="og:image:height"]')?.getAttribute('content');
  if (ogImg && ogImgWidth && ogImgHeight) {
    score += 10;
    checks.push({ name: 'OG Image Dimensions', status: 'pass', value: `${ogImgWidth}×${ogImgHeight}`, detail: 'Image dimensions specified — prevents layout shift on social platforms' });
  } else if (ogImg) {
    checks.push({ name: 'OG Image Dimensions', status: 'info', value: 'Not specified', detail: 'Add og:image:width and og:image:height for better social previews' });
  }

  return { module: 'Social & Indexability', score: Math.min(100, score), checks };
}
