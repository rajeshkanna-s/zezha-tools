const fs = require('fs');
const path = require('path');

const sidebarPath = path.join(__dirname, '../src/tools/ToolsSidebar.tsx');
const content = fs.readFileSync(sidebarPath, 'utf8');

// We want to parse MENU_SECTIONS.
// Regex to extract each section block
const sectionRegex = /\{\s*id:\s*'([^']*)',\s*label:\s*'([^']*)'[\s\S]*?items:\s*\[([\s\S]*?)\]/g;
const itemRegex = /\{\s*id:\s*'([^']*)',\s*label:\s*'([^']*)'/g;

const urls = [];
const baseUrl = 'https://zezhatools.com';

// Add homepage
urls.push({ loc: baseUrl, changefreq: 'daily', priority: '1.0' });

let match;
while ((match = sectionRegex.exec(content)) !== null) {
  const sectionId = match[1];
  const sectionLabel = match[2];
  const itemsText = match[3];

  if (sectionId !== 'home') {
    urls.push({
      loc: `${baseUrl}/?section=${sectionId}`,
      changefreq: 'weekly',
      priority: '0.8'
    });
  }

  let itemMatch;
  while ((itemMatch = itemRegex.exec(itemsText)) !== null) {
    const itemId = itemMatch[1];
    urls.push({
      loc: `${baseUrl}/?tool=${itemId}&amp;section=${sectionId}`,
      changefreq: 'weekly',
      priority: '0.7'
    });
  }
}

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

urls.forEach(u => {
  xml += `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>
`;
});

xml += '</urlset>';

const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(sitemapPath, xml);
console.log(`Generated sitemap with ${urls.length} URLs at public/sitemap.xml`);
