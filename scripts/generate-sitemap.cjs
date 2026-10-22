const fs = require('fs');
const path = require('path');

const sidebarPath = path.join(__dirname, '../src/tools/ToolsSidebar.tsx');
const content = fs.readFileSync(sidebarPath, 'utf8');

// Regex to extract each section block
const sectionRegex = /\{\s*id:\s*'([^']*)',\s*label:\s*'([^']*)'[\s\S]*?items:\s*\[([\s\S]*?)\]/g;
const itemRegex = /\{\s*id:\s*'([^']*)',\s*label:\s*'([^']*)'/g;

const urls = [];
const baseUrl = 'https://zezhatools.com';
const today = new Date().toISOString().split('T')[0];

// High priority tools for SEO
const HIGH_PRIORITY_TOOLS = new Set([
  'precious-metals-calculator',
  'emi-calculator',
  'income-tax-estimator',
  'old-regime-tax',
  'new-regime-tax',
  'tax-compare',
  'gst-vat-calculator',
  'tds-calculator',
  'image-to-pdf',
  'compress-pdf',
  'merge-pdf',
  'edit-pdf',
  'compress-image',
  'currency-calculator',
  'unit-converter',
  'dob-calculator',
  'percentage-calculator',
  'fd-calculator',
  'sip-calculator',
  'dev-json-formatter',
  'dev-jwt-decoder',
  'dev-base64',
  'govt-scheme-finder',
  'invitation-creator',
  'logo-creator'
]);

// Standalone pages
const STANDALONE_SECTIONS = new Set([
  'govt-scheme-finder',
  'invitation-creator',
  'event-page-creator',
  'logo-creator',
  'life-decision-simulator',
  'products'
]);

// Add homepage
urls.push({
  loc: `${baseUrl}/`,
  lastmod: today,
  changefreq: 'daily',
  priority: '1.0'
});

let match;
while ((match = sectionRegex.exec(content)) !== null) {
  const sectionId = match[1];
  const sectionLabel = match[2];
  const itemsText = match[3];

  if (sectionId === 'home') continue;

  if (STANDALONE_SECTIONS.has(sectionId)) {
    urls.push({
      loc: `${baseUrl}/${sectionId}`,
      lastmod: today,
      changefreq: 'daily',
      priority: '0.9'
    });
    continue;
  }

  // Section hub page
  urls.push({
    loc: `${baseUrl}/${sectionId}`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.8'
  });

  let itemMatch;
  while ((itemMatch = itemRegex.exec(itemsText)) !== null) {
    const itemId = itemMatch[1];
    const priority = HIGH_PRIORITY_TOOLS.has(itemId) ? '0.9' : '0.8';
    urls.push({
      loc: `${baseUrl}/${sectionId}/${itemId}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: priority
    });
  }
}

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

urls.forEach(u => {
  xml += `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>
`;
});

xml += '</urlset>\n';

const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(sitemapPath, xml);
console.log(`Generated enhanced sitemap with ${urls.length} URLs at public/sitemap.xml`);
