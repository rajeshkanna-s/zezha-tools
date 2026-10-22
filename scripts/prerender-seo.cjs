const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');
const templatePath = path.join(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('dist/index.html not found. Run vite build first.');
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');

// Parse tool metadata from src/services/toolMetadata.ts
const metadataPath = path.join(__dirname, '../src/services/toolMetadata.ts');
const metaContent = fs.readFileSync(metadataPath, 'utf8');

// Also parse all items from ToolsSidebar
const sidebarPath = path.join(__dirname, '../src/tools/ToolsSidebar.tsx');
const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');

const sectionRegex = /\{\s*id:\s*'([^']*)',\s*label:\s*'([^']*)'[\s\S]*?items:\s*\[([\s\S]*?)\]/g;
const itemRegex = /\{\s*id:\s*'([^']*)',\s*label:\s*'([^']*)'/g;

const routes = [];
const baseUrl = 'https://zezhatools.com';

const STANDALONE = new Set([
  'govt-scheme-finder',
  'invitation-creator',
  'event-page-creator',
  'logo-creator',
  'life-decision-simulator',
  'products'
]);

let sMatch;
while ((sMatch = sectionRegex.exec(sidebarContent)) !== null) {
  const sectionId = sMatch[1];
  const sectionLabel = sMatch[2];
  const itemsText = sMatch[3];

  if (sectionId === 'home') continue;

  if (STANDALONE.has(sectionId)) {
    routes.push({
      toolId: sectionId,
      sectionId: sectionId,
      sectionLabel: sectionLabel,
      url: `/${sectionId}`
    });
    continue;
  }

  // Section hub
  routes.push({
    isSection: true,
    sectionId: sectionId,
    sectionLabel: sectionLabel,
    url: `/${sectionId}`
  });

  let iMatch;
  while ((iMatch = itemRegex.exec(itemsText)) !== null) {
    const itemId = iMatch[1];
    const itemLabel = iMatch[2];
    routes.push({
      toolId: itemId,
      toolLabel: itemLabel,
      sectionId: sectionId,
      sectionLabel: sectionLabel,
      url: `/${sectionId}/${itemId}`
    });
  }
}

// Regex to extract tool definitions from toolMetadata.ts
function extractToolMeta(toolId) {
  const blockRegex = new RegExp(`'${toolId}':\\s*\\{([\\s\\S]*?)\\},\\s*(?:'|\\/\\/|\\};)`, 'm');
  const m = blockRegex.exec(metaContent);
  if (!m) return null;
  const block = m[1];

  const titleMatch = /title:\s*'([^']*)'/.exec(block);
  const shortTitleMatch = /shortTitle:\s*'([^']*)'/.exec(block);
  const descMatch = /description:\s*'([^']*)'/.exec(block);
  const catMatch = /category:\s*'([^']*)'/.exec(block);
  const keywordsMatch = /keywords:\s*\[([\s\S]*?)\]/.exec(block);

  let keywords = [];
  if (keywordsMatch) {
    const kwStr = keywordsMatch[1];
    const kwRegex = /'([^']*)'/g;
    let km;
    while ((km = kwRegex.exec(kwStr)) !== null) {
      keywords.push(km[1]);
    }
  }

  return {
    title: titleMatch ? titleMatch[1] : null,
    shortTitle: shortTitleMatch ? shortTitleMatch[1] : null,
    description: descMatch ? descMatch[1] : null,
    category: catMatch ? catMatch[1] : 'UtilityApplication',
    keywords: keywords
  };
}

let generatedCount = 0;

for (const route of routes) {
  let title = '';
  let description = '';
  let keywords = '';
  let category = 'WebApplication';
  let h1 = '';
  let features = [];

  if (route.isSection) {
    title = `${route.sectionLabel} Tools & Calculators — Zezha Tools`;
    description = `Explore free online ${route.sectionLabel} utilities, calculators, and tools on Zezha Tools. 100% private, browser-based tools with zero data uploaded.`;
    keywords = `${route.sectionLabel}, online calculators, web utilities, free tools, zezha tools`;
    h1 = `${route.sectionLabel} Utilities & Calculators`;
    features = [`Free browser-based tools`, `Instant calculations`, `Zero server data uploads`, `100% private & secure`];
  } else {
    const meta = extractToolMeta(route.toolId);
    if (meta && meta.title) {
      title = `${meta.title} — Zezha Tools`;
      description = meta.description;
      keywords = meta.keywords.join(', ');
      category = meta.category;
      h1 = meta.title;
      features = meta.keywords.slice(0, 6);
    } else {
      title = `${route.toolLabel || route.toolId} — Zezha Tools`;
      description = `Use the free online ${route.toolLabel || route.toolId} on Zezha Tools. 100% browser-based, secure, and client-side processing with zero server uploads.`;
      keywords = `${route.toolLabel || route.toolId}, online calculator, free tool, zezha tools`;
      h1 = route.toolLabel || route.toolId;
      features = ['Free online browser tool', 'No registration required', 'Fast and privacy-first'];
    }
  }

  const fullUrl = `https://zezhatools.com${route.url}`;

  // Replace Title
  let html = template.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

  // Replace Meta Description
  html = html.replace(/<meta name="description" content=".*?" \/>/i, `<meta name="description" content="${escapeHtml(description)}" />`);

  // Replace Meta Keywords
  html = html.replace(/<meta name="keywords" content=".*?" \/>/i, `<meta name="keywords" content="${escapeHtml(keywords)}" />`);

  // Replace Canonical Link
  html = html.replace(/<link rel="canonical" href=".*?" \/>/i, `<link rel="canonical" href="${fullUrl}" />`);

  // Replace Open Graph Tags
  html = html.replace(/<meta property="og:title" content=".*?" \/>/i, `<meta property="og:title" content="${escapeHtml(title)}" />`);
  html = html.replace(/<meta property="og:description" content=".*?" \/>/i, `<meta property="og:description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<meta property="og:url" content=".*?" \/>/i, `<meta property="og:url" content="${fullUrl}" />`);

  // Replace Twitter Tags
  html = html.replace(/<meta name="twitter:title" content=".*?" \/>/i, `<meta name="twitter:title" content="${escapeHtml(title)}" />`);
  html = html.replace(/<meta name="twitter:description" content=".*?" \/>/i, `<meta name="twitter:description" content="${escapeHtml(description)}" />`);

  // Replace JSON-LD Schema
  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": h1,
    "url": fullUrl,
    "description": description,
    "applicationCategory": category,
    "operatingSystem": "All",
    "browserRequirements": "Requires Modern Web Browser with HTML5 and JavaScript",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "keywords": keywords,
    "featureList": features
  };

  html = html.replace(
    /<script type="application\/ld\+json" id="global-website-schema">[\s\S]*?<\/script>/i,
    `<script type="application/ld+json" id="tool-structured-data">\n${JSON.stringify(toolSchema, null, 2)}\n</script>`
  );

  // Inject Semantic Pre-Rendered SEO Content into <div id="root">
  const preRenderContent = `
    <div id="seo-static-container" style="max-width:960px;margin:32px auto;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1e293b;line-height:1.6;">
      <nav style="font-size:12px;color:#64748b;margin-bottom:12px;">
        <a href="/" style="color:#6366f1;text-decoration:none;">Zezha Tools</a> &gt; 
        <a href="/${route.sectionId}" style="color:#6366f1;text-decoration:none;">${route.sectionLabel}</a> &gt; 
        <span style="color:#0f172a;font-weight:600;">${h1}</span>
      </nav>
      <h1 style="font-size:26px;font-weight:900;color:#0f172a;margin-bottom:8px;letter-spacing:-0.5px;">${escapeHtml(h1)}</h1>
      <p style="font-size:15px;color:#334155;margin-bottom:20px;">${escapeHtml(description)}</p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px 20px;margin-bottom:20px;">
        <h2 style="font-size:14px;font-weight:800;color:#0f172a;margin:0 0 10px 0;text-transform:uppercase;letter-spacing:0.4px;">Key Highlights &amp; Capabilities</h2>
        <ul style="margin:0;padding-left:20px;font-size:13.5px;color:#475569;">
          ${features.map(f => `<li style="margin-bottom:4px;">${escapeHtml(f)}</li>`).join('')}
        </ul>
      </div>
      <p style="font-size:12px;color:#64748b;">Loading interactive client application... 100% private, client-side execution on Zezha Tools.</p>
    </div>
  `;

  html = html.replace('<div id="root"></div>', `<div id="root">${preRenderContent}</div>`);

  // Target directory
  const targetDir = path.join(distDir, route.url.replace(/^\//, ''));
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
  generatedCount++;
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

console.log(`Successfully pre-rendered SEO static HTML for ${generatedCount} direct routes in dist/`);
