import type { AnalysisResult, FixItem, CheckResult } from '../../types/seoAnalyser';

let fixId = 0;
function makeId() { return `fix-${++fixId}`; }

function checkFailed(checks: CheckResult[], name: string): boolean {
  return checks.some(c => c.name === name && (c.status === 'fail' || c.status === 'warn'));
}

export function generateFixPlan(result: AnalysisResult): FixItem[] {
  fixId = 0;
  const plan: FixItem[] = [];

  // Security criticals — Week 1 Day 1
  if (result.security) {
    const sc = result.security.checks;
    if (checkFailed(sc, 'HTTPS Enforced')) {
      plan.push({
        id: makeId(), title: 'Enable HTTPS', week: 1, urgency: 'day1', impact: 'high', timeEst: '2–8 hrs', scoreImpact: 20, done: false,
        description: 'Your site uses HTTP — all data is transmitted in plaintext.',
        steps: ['Get an SSL certificate (free from Let\'s Encrypt)', 'Install on your hosting server', 'Redirect all HTTP traffic to HTTPS', 'Update all internal links to https://'],
      });
    }
    if (result.security.exposedFiles.length > 0) {
      plan.push({
        id: makeId(), title: 'Block Exposed Sensitive Files', week: 1, urgency: 'day1', impact: 'high', timeEst: '1–2 hrs', scoreImpact: 15, done: false,
        description: `${result.security.exposedFiles.length} sensitive files are publicly accessible.`,
        steps: ['Block files via .htaccess or nginx config', 'Move sensitive files outside web root', 'Test that files return 403 or 404'],
        codeSnippet: '# Nginx: Block sensitive files\nlocation ~ /\\.(env|git) { deny all; return 404; }\nlocation ~ /(wp-config|phpinfo|config)\\.php { deny all; }',
      });
    }
    if (checkFailed(sc, 'HSTS') || checkFailed(sc, 'Content-Security-Policy') || checkFailed(sc, 'X-Frame-Options')) {
      plan.push({
        id: makeId(), title: 'Add Security Headers', week: 1, urgency: 'week1', impact: 'high', timeEst: '2 hrs', scoreImpact: 10, done: false,
        description: 'Missing security headers leave your site vulnerable to XSS and clickjacking.',
        steps: ['Add headers in your server config (nginx/Apache)', 'Test with securityheaders.com', 'Verify no functionality breaks'],
        codeSnippet: "# Nginx security headers\nadd_header Strict-Transport-Security 'max-age=31536000; includeSubDomains' always;\nadd_header X-Frame-Options 'DENY' always;\nadd_header X-Content-Type-Options 'nosniff' always;\nadd_header Content-Security-Policy \"default-src 'self';\" always;",
      });
    }
  }

  // SEO criticals — Week 1
  if (result.seo) {
    const sc = result.seo.checks;
    if (checkFailed(sc, 'Title Tag')) {
      plan.push({
        id: makeId(), title: 'Add Title Tag', week: 1, urgency: 'week1', impact: 'high', timeEst: '1 hr', scoreImpact: 12, done: false,
        description: 'Missing or poorly optimised title tag.',
        steps: ['Add <title> with primary keyword', 'Keep between 50–60 characters', 'Make it unique and descriptive'],
      });
    }
    if (checkFailed(sc, 'Meta Description')) {
      plan.push({
        id: makeId(), title: 'Add Meta Description', week: 1, urgency: 'week1', impact: 'high', timeEst: '1 hr', scoreImpact: 10, done: false,
        description: 'Missing meta description — Google will auto-generate one.',
        steps: ['Write a compelling 150–160 character description', 'Include primary keyword', 'Add a call to action'],
      });
    }
    if (checkFailed(sc, 'H1 Tag')) {
      plan.push({
        id: makeId(), title: 'Fix H1 Tag', week: 1, urgency: 'week1', impact: 'medium', timeEst: '30 min', scoreImpact: 8, done: false,
        description: 'H1 tag is missing or there are multiple H1s.',
        steps: ['Ensure exactly one H1 per page', 'Include primary keyword in H1', 'Make it descriptive of page content'],
      });
    }
  }

  // Social — noindex
  if (result.social?.checks?.some(c => c.name === 'Noindex Detected' && c.status === 'fail')) {
    plan.push({
      id: makeId(), title: 'Remove noindex Meta Tag', week: 1, urgency: 'day1', impact: 'high', timeEst: '30 min', scoreImpact: 40, done: false,
      description: 'CRITICAL: noindex tag prevents this page from appearing in Google.',
      steps: ['Remove <meta name="robots" content="noindex">', 'Or change to content="index, follow"', 'Request reindexing in Google Search Console'],
    });
  }

  // Technical — Week 1–2
  if (result.technical) {
    const tc = result.technical.checks;
    if (checkFailed(tc, 'Sitemap.xml')) {
      plan.push({
        id: makeId(), title: 'Create Sitemap.xml', week: 1, urgency: 'week1', impact: 'medium', timeEst: '1 hr', scoreImpact: 8, done: false,
        description: 'No sitemap found — search engines can\'t discover all your pages.',
        steps: ['Generate XML sitemap', 'Upload to root directory', 'Submit in Google Search Console'],
      });
    }
    if (checkFailed(tc, 'Structured Data (JSON-LD)')) {
      plan.push({
        id: makeId(), title: 'Add Structured Data', week: 2, urgency: 'week2', impact: 'medium', timeEst: '4 hrs', scoreImpact: 8, done: false,
        description: 'No JSON-LD structured data — missing rich result opportunities.',
        steps: ['Choose appropriate schema type (WebSite, Organization, Product, etc.)', 'Add JSON-LD script to page head', 'Validate with Google Rich Results Test'],
        codeSnippet: '<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "WebSite",\n  "name": "Your Site Name",\n  "url": "https://yoursite.com"\n}\n</script>',
      });
    }
  }

  // Performance — Week 2
  if (result.performance && result.performance.score < 70) {
    plan.push({
      id: makeId(), title: 'Improve Page Speed', week: 2, urgency: 'week2', impact: 'high', timeEst: '1–2 days', scoreImpact: 10, done: false,
      description: `Performance score is ${result.performance.score}/100.`,
      steps: ['Compress images (use WebP/AVIF)', 'Enable text compression (gzip/Brotli)', 'Remove unused JavaScript', 'Defer non-critical CSS/JS'],
    });
  }

  // UX — Week 2
  if (result.ux) {
    const uc = result.ux.checks;
    if (checkFailed(uc, 'Image Alt Text')) {
      plan.push({
        id: makeId(), title: 'Add Image Alt Text', week: 2, urgency: 'week2', impact: 'medium', timeEst: '2 hrs', scoreImpact: 5, done: false,
        description: 'Images missing alt text — hurts accessibility and image SEO.',
        steps: ['Add descriptive alt text to all images', 'Include keywords naturally', 'Keep alt text under 125 characters'],
      });
    }
    if (checkFailed(uc, 'Word Count')) {
      plan.push({
        id: makeId(), title: 'Expand Content', week: 3, urgency: 'week3', impact: 'medium', timeEst: 'Ongoing', scoreImpact: 5, done: false,
        description: 'Thin content — pages with more comprehensive content rank better.',
        steps: ['Aim for 600+ words per page', 'Cover the topic thoroughly', 'Add FAQ sections, examples, and details'],
      });
    }
  }

  // Social — Week 2–3
  if (result.social) {
    if (checkFailed(result.social.checks, 'Open Graph Tags')) {
      plan.push({
        id: makeId(), title: 'Add Open Graph Tags', week: 2, urgency: 'week2', impact: 'medium', timeEst: '1 hr', scoreImpact: 5, done: false,
        description: 'Missing OG tags — links shared on social media look plain.',
        steps: ['Add og:title, og:description, og:image, og:url', 'Use an eye-catching 1200×630 image', 'Test with Facebook Sharing Debugger'],
      });
    }
    if (checkFailed(result.social.checks, 'Twitter Card')) {
      plan.push({
        id: makeId(), title: 'Add Twitter Card Tags', week: 3, urgency: 'week3', impact: 'low', timeEst: '30 min', scoreImpact: 3, done: false,
        description: 'No Twitter Card tags — tweets won\'t show rich previews.',
        steps: ['Add twitter:card, twitter:title, twitter:image meta tags', 'Validate with Twitter Card Validator'],
      });
    }
  }

  // Mobile — Week 2
  if (result.mobile) {
    if (checkFailed(result.mobile.checks, 'Viewport Meta Tag')) {
      plan.push({
        id: makeId(), title: 'Add Viewport Meta Tag', week: 1, urgency: 'week1', impact: 'high', timeEst: '10 min', scoreImpact: 8, done: false,
        description: 'Missing viewport tag — page won\'t render properly on mobile devices.',
        steps: ['Add <meta name="viewport" content="width=device-width, initial-scale=1"> to <head>'],
      });
    }
  }

  // Canonical — Week 2
  if (result.seo?.checks?.some(c => c.name === 'Canonical Tag' && c.status === 'warn')) {
    plan.push({
      id: makeId(), title: 'Add Canonical Tags', week: 2, urgency: 'week2', impact: 'medium', timeEst: '2 hrs', scoreImpact: 4, done: false,
      description: 'Missing canonical tag — risk of duplicate content issues.',
      steps: ['Add <link rel="canonical" href="..."> to each page', 'Set to the preferred version of the URL'],
    });
  }

  // Sort by urgency then impact
  const urgencyOrder = { day1: 0, week1: 1, week2: 2, week3: 3 };
  const impactOrder = { high: 0, medium: 1, low: 2 };
  plan.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency] || impactOrder[a.impact] - impactOrder[b.impact]);

  return plan;
}
