import type { ModuleResult, CheckResult } from '../../../types/seoAnalyser';

export async function analyzeTechnical(url: string, doc: Document | null): Promise<ModuleResult> {
  const checks: CheckResult[] = [];
  let score = 0;
  const origin = new URL(url).origin;

  // Sitemap check
  try {
    const sitemapRes = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(origin + '/sitemap.xml')}`, { signal: AbortSignal.timeout(8000) });
    const sitemapData = await sitemapRes.json();
    if (sitemapData.contents && sitemapData.contents.includes('<urlset') || sitemapData.contents?.includes('<sitemapindex')) {
      score += 15;
      checks.push({ name: 'Sitemap.xml', status: 'pass', value: 'Found', detail: 'XML sitemap exists — helps search engines discover pages' });
    } else {
      checks.push({ name: 'Sitemap.xml', status: 'fail', value: 'Not found', detail: 'Create sitemap.xml and submit to Google Search Console' });
    }
  } catch {
    checks.push({ name: 'Sitemap.xml', status: 'warn', value: 'Could not check', detail: 'Unable to verify sitemap — check manually' });
  }

  // Robots.txt
  try {
    const robotsRes = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(origin + '/robots.txt')}`, { signal: AbortSignal.timeout(8000) });
    const robotsData = await robotsRes.json();
    if (robotsData.contents && (robotsData.contents.includes('User-agent') || robotsData.contents.includes('user-agent'))) {
      score += 15;
      checks.push({ name: 'Robots.txt', status: 'pass', value: 'Found', detail: 'robots.txt file exists' });

      // Check for important disallows
      if (robotsData.contents.includes('Disallow: /')) {
        const lines = robotsData.contents.split('\n').filter((l: string) => l.trim().startsWith('Disallow'));
        checks.push({ name: 'Robots Disallow Rules', status: 'info', value: `${lines.length} rules`, detail: lines.slice(0, 5).join('; ') });
      }
    } else {
      checks.push({ name: 'Robots.txt', status: 'fail', value: 'Not found', detail: 'Create robots.txt to control crawler access' });
    }
  } catch {
    checks.push({ name: 'Robots.txt', status: 'warn', value: 'Could not check', detail: 'Unable to verify — check manually' });
  }

  if (doc) {
    // Structured data (JSON-LD)
    const jsonLdScripts = doc.querySelectorAll('script[type="application/ld+json"]');
    if (jsonLdScripts.length > 0) {
      score += 20;
      let schemaTypes: string[] = [];
      jsonLdScripts.forEach(s => {
        try {
          const data = JSON.parse(s.textContent || '');
          const types = Array.isArray(data) ? data.map(d => d['@type']) : [data['@type']];
          schemaTypes.push(...types.filter(Boolean));
        } catch { /* invalid JSON-LD */ }
      });
      checks.push({
        name: 'Structured Data (JSON-LD)', status: 'pass',
        value: schemaTypes.length > 0 ? schemaTypes.join(', ') : 'Present',
        detail: `${jsonLdScripts.length} JSON-LD blocks found`,
      });
    } else {
      checks.push({ name: 'Structured Data (JSON-LD)', status: 'fail', value: 'None found', detail: 'Add JSON-LD structured data (WebSite, Organization, etc.)' });
    }

    // Hreflang
    const hreflangs = doc.querySelectorAll('link[rel="alternate"][hreflang]');
    if (hreflangs.length > 0) {
      score += 10;
      const langs = Array.from(hreflangs).map(el => el.getAttribute('hreflang')).filter(Boolean);
      checks.push({ name: 'Hreflang Tags', status: 'pass', value: langs.join(', '), detail: 'Multilingual tags found' });
    } else {
      checks.push({ name: 'Hreflang Tags', status: 'info', value: 'None', detail: 'Add hreflang tags if your site serves multiple languages' });
    }

    // Favicon
    const favicon = doc.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
    if (favicon) {
      score += 10;
      checks.push({ name: 'Favicon', status: 'pass', value: favicon.getAttribute('href') || 'Present', detail: 'Favicon found' });
    } else {
      checks.push({ name: 'Favicon', status: 'warn', value: 'Missing', detail: 'Add a favicon for branding in browser tabs' });
    }

    // Charset
    const charset = doc.querySelector('meta[charset]') || doc.querySelector('meta[http-equiv="Content-Type"]');
    if (charset) {
      score += 10;
      checks.push({ name: 'Character Encoding', status: 'pass', value: charset.getAttribute('charset') || 'UTF-8', detail: 'Charset properly declared' });
    } else {
      checks.push({ name: 'Character Encoding', status: 'warn', value: 'Missing', detail: 'Add <meta charset="UTF-8">' });
    }

    // Language attribute
    const lang = doc.documentElement.getAttribute('lang');
    if (lang) {
      score += 5;
      checks.push({ name: 'HTML Language', status: 'pass', value: lang, detail: 'Language attribute helps accessibility and SEO' });
    } else {
      checks.push({ name: 'HTML Language', status: 'warn', value: 'Missing', detail: 'Add lang attribute to <html> tag' });
    }
  }

  // 404 handling
  try {
    const fake404Url = `${origin}/this-page-definitely-does-not-exist-${Date.now()}`;
    const res404 = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(fake404Url)}`, { signal: AbortSignal.timeout(8000) });
    const data404 = await res404.json();
    const status = data404.status?.http_code;
    if (status === 404) {
      score += 10;
      checks.push({ name: '404 Page Handling', status: 'pass', value: 'Proper 404', detail: 'Non-existent pages return 404 — correct behaviour' });
    } else if (status === 200) {
      checks.push({ name: '404 Page Handling', status: 'warn', value: 'Soft 404', detail: 'Non-existent pages return 200 — configure proper 404 responses' });
    }
  } catch {
    checks.push({ name: '404 Page Handling', status: 'info', value: 'Could not check', detail: 'Unable to verify 404 handling' });
  }

  return { module: 'Technical Health', score: Math.min(100, Math.round((score / 95) * 100)), checks };
}
