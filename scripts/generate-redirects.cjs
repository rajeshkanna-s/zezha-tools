const fs = require('fs');
const path = require('path');

const sidebarPath = path.join(__dirname, '../src/tools/ToolsSidebar.tsx');
const content = fs.readFileSync(sidebarPath, 'utf8');

const sectionRegex = /\{\s*id:\s*'([^']*)',\s*label:\s*'([^']*)'[\s\S]*?items:\s*\[([\s\S]*?)\]/g;
const itemRegex = /\{\s*id:\s*'([^']*)',\s*label:\s*'([^']*)'/g;

const toolRedirects = [];
let match;
while ((match = sectionRegex.exec(content)) !== null) {
  const sectionId = match[1];
  const itemsText = match[3];

  if (sectionId === 'home') continue;

  let itemMatch;
  while ((itemMatch = itemRegex.exec(itemsText)) !== null) {
    const itemId = itemMatch[1];
    toolRedirects.push(`/${itemId} /${sectionId}/${itemId} 301!`);
  }
}

const lines = [
  '# ── Netlify Redirects for Zezha Tools ──',
  '# 1. Legacy Query Parameters to Clean Semantic URLs',
  '/ tool=:tool section=:section /:section/:tool 301!',
  '/ section=:section tool=:tool /:section/:tool 301!',
  '/ section=:section /:section 301!',
  '/ tool=:tool /tools/:tool 301!',
  '',
  '# 2. Legacy Flat URLs to Section-based Canonical URLs (resolves duplicate canonical validation)',
  ...toolRedirects,
  '',
  '# 3. SPA Fallback',
  '/* /index.html 200',
  ''
];

const redirectsPath = path.join(__dirname, '../public/_redirects');
fs.writeFileSync(redirectsPath, lines.join('\n'));
console.log(`Generated public/_redirects with ${toolRedirects.length} legacy tool redirects and query param handlers.`);
