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

const baseUrl = 'https://zezhatools.com';

const STANDALONE = new Set([
  'govt-scheme-finder',
  'invitation-creator',
  'event-page-creator',
  'logo-creator',
  'create-invoice',
  'life-decision-simulator',
  'products'
]);

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

// 1. Build structured catalog of all sections and tools
const sections = [];
let sMatch;
while ((sMatch = sectionRegex.exec(sidebarContent)) !== null) {
  const sectionId = sMatch[1];
  const sectionLabel = sMatch[2];
  const itemsText = sMatch[3];

  if (sectionId === 'home') continue;

  const isStandalone = STANDALONE.has(sectionId);
  const tools = [];

  if (isStandalone) {
    const meta = extractToolMeta(sectionId);
    tools.push({
      id: sectionId,
      label: sectionLabel,
      url: `/${sectionId}`,
      meta: meta || {
        title: `${sectionLabel} — Zezha Tools`,
        shortTitle: sectionLabel,
        description: `Use the free online ${sectionLabel} on Zezha Tools. 100% private, client-side browser tool.`,
        category: 'WebApplication',
        keywords: [sectionLabel, 'free tool', 'zezha tools']
      }
    });
  } else {
    let iMatch;
    while ((iMatch = itemRegex.exec(itemsText)) !== null) {
      const itemId = iMatch[1];
      const itemLabel = iMatch[2];
      const meta = extractToolMeta(itemId);
      tools.push({
        id: itemId,
        label: itemLabel,
        url: `/${sectionId}/${itemId}`,
        meta: meta || {
          title: `${itemLabel} — Zezha Tools`,
          shortTitle: itemLabel,
          description: `Use the free online ${itemLabel} on Zezha Tools. 100% browser-based utility.`,
          category: 'WebApplication',
          keywords: [itemLabel, 'online calculator', 'free tool', 'zezha tools']
        }
      });
    }
  }

  sections.push({
    id: sectionId,
    label: sectionLabel,
    isStandalone: isStandalone,
    url: `/${sectionId}`,
    tools: tools
  });
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

function renderCategoryNav(currentSectionId = '') {
  return `
    <div style="background:#f1f5f9;border-radius:10px;padding:14px 18px;margin-top:28px;">
      <div style="font-size:12px;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;">Explore Tool Categories</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;">
        ${sections.map(s => `
          <a href="${s.url}" style="display:inline-block;padding:6px 12px;background:${s.id === currentSectionId ? '#4f46e5' : '#ffffff'};color:${s.id === currentSectionId ? '#ffffff' : '#334155'};border:1px solid #cbd5e1;border-radius:6px;font-size:12px;font-weight:600;text-decoration:none;">
            ${escapeHtml(s.label)} (${s.tools.length})
          </a>
        `).join('')}
      </div>
    </div>
  `;
}

function renderSharedFooter() {
  return `
    <footer style="margin-top:32px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b;display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;">
      <div>
        A product of <a href="https://zezha.in" style="color:#6366f1;font-weight:600;text-decoration:none;">ZEZHA Technology Private Limited</a> • 
        <a href="https://zezhatools.com" style="color:#6366f1;text-decoration:none;">ZEZHA Tools</a> • 
        <a href="https://zezhatalent.in" style="color:#6366f1;text-decoration:none;">ZEZHA Talent</a>
      </div>
      <div>100% Private • Client-Side Processing • Zero Server Storage</div>
    </footer>
  `;
}

let generatedCount = 0;

// 2. Pre-render Individual Tool Pages
for (const section of sections) {
  for (const tool of section.tools) {
    const meta = tool.meta;
    const title = meta.title ? `${meta.title} — Zezha Tools` : `${tool.label} — Zezha Tools`;
    const description = meta.description;
    const keywords = meta.keywords.join(', ');
    const category = meta.category || 'WebApplication';
    const h1 = meta.title || tool.label;
    const features = meta.keywords && meta.keywords.length > 0 ? meta.keywords.slice(0, 6) : ['Free online tool', '100% client-side privacy', 'No sign-up required'];
    const fullUrl = `https://zezhatools.com${tool.url}`;

    // Sibling tools in the same category for internal linking
    const siblingTools = section.tools.filter(t => t.id !== tool.id);

    const preRenderContent = `
      <div id="seo-static-container" style="max-width:960px;margin:32px auto;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1e293b;line-height:1.6;">
        <nav style="font-size:12px;color:#64748b;margin-bottom:12px;">
          <a href="/" style="color:#6366f1;text-decoration:none;">ZEZHA Tools</a> &gt; 
          <a href="${section.url}" style="color:#6366f1;text-decoration:none;">${escapeHtml(section.label)}</a> &gt; 
          <span style="color:#0f172a;font-weight:600;">${escapeHtml(tool.label)}</span>
        </nav>
        <h1 style="font-size:26px;font-weight:900;color:#0f172a;margin-bottom:8px;letter-spacing:-0.5px;">${escapeHtml(h1)}</h1>
        <p style="font-size:15px;color:#334155;margin-bottom:20px;">${escapeHtml(description)}</p>
        
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
          <h2 style="font-size:14px;font-weight:800;color:#0f172a;margin:0 0 10px 0;text-transform:uppercase;letter-spacing:0.4px;">Key Highlights &amp; Capabilities</h2>
          <ul style="margin:0;padding-left:20px;font-size:13.5px;color:#475569;">
            ${features.map(f => `<li style="margin-bottom:4px;">${escapeHtml(f)}</li>`).join('')}
          </ul>
        </div>

        ${siblingTools.length > 0 ? `
          <div style="margin-bottom:24px;">
            <h2 style="font-size:16px;font-weight:800;color:#0f172a;margin-bottom:12px;">Related Tools in ${escapeHtml(section.label)}</h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(240px, 1fr));gap:12px;">
              ${siblingTools.slice(0, 6).map(st => `
                <a href="${st.url}" style="display:block;padding:12px 14px;background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;text-decoration:none;transition:border-color 0.2s;">
                  <div style="font-size:13.5px;font-weight:700;color:#1e293b;margin-bottom:4px;">${escapeHtml(st.label)}</div>
                  <div style="font-size:11.5px;color:#64748b;line-height:1.4;">${escapeHtml(st.meta?.shortTitle || st.meta?.description?.slice(0, 80) + '...')}</div>
                </a>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${renderCategoryNav(section.id)}
        <p style="font-size:12px;color:#64748b;margin-top:16px;">Loading interactive client application... 100% private, client-side execution on ZEZHA Tools.</p>
        ${renderSharedFooter()}
      </div>
    `;

    let html = template
      .replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`)
      .replace(/<meta name="description" content=".*?" \/>/i, `<meta name="description" content="${escapeHtml(description)}" />`)
      .replace(/<meta name="keywords" content=".*?" \/>/i, `<meta name="keywords" content="${escapeHtml(keywords)}" />`)
      .replace(/<link rel="canonical" href=".*?" \/>/i, `<link rel="canonical" href="${fullUrl}" />`)
      .replace(/<meta property="og:title" content=".*?" \/>/i, `<meta property="og:title" content="${escapeHtml(title)}" />`)
      .replace(/<meta property="og:description" content=".*?" \/>/i, `<meta property="og:description" content="${escapeHtml(description)}" />`)
      .replace(/<meta property="og:url" content=".*?" \/>/i, `<meta property="og:url" content="${fullUrl}" />`)
      .replace(/<meta name="twitter:title" content=".*?" \/>/i, `<meta name="twitter:title" content="${escapeHtml(title)}" />`)
      .replace(/<meta name="twitter:description" content=".*?" \/>/i, `<meta name="twitter:description" content="${escapeHtml(description)}" />`);

    const toolSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": h1,
      "alternateName": `${h1} — ZEZHA Tools`,
      "url": fullUrl,
      "description": description,
      "applicationCategory": category,
      "operatingSystem": "All",
      "browserRequirements": "Requires Modern Web Browser with HTML5 and JavaScript",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" },
      "provider": {
        "@type": "Organization",
        "@id": "https://zezha.in/#organization",
        "name": "ZEZHA Technology Private Limited",
        "url": "https://zezha.in"
      },
      "keywords": keywords,
      "featureList": features
    };

    html = html.replace(
      /<script type="application\/ld\+json" id="global-website-schema">[\s\S]*?<\/script>/i,
      `<script type="application/ld+json" id="tool-structured-data">\n${JSON.stringify(toolSchema, null, 2)}\n</script>`
    );

    html = html.replace('<div id="root"></div>', `<div id="root">${preRenderContent}</div>`);

    const targetDir = path.join(distDir, tool.url.replace(/^\//, ''));
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
    generatedCount++;
  }
}

// 3. Pre-render Section Hub Pages
for (const section of sections) {
  if (section.isStandalone) continue; // already generated as tool

  const title = `${section.label} Tools & Calculators — Zezha Tools`;
  const description = `Explore all free online ${section.label} utilities, calculators, and tools on Zezha Tools. 100% private, browser-based tools with zero data uploaded.`;
  const keywords = `${section.label}, online calculators, web utilities, free tools, zezha tools`;
  const fullUrl = `https://zezhatools.com${section.url}`;

  const preRenderContent = `
    <div id="seo-static-container" style="max-width:960px;margin:32px auto;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1e293b;line-height:1.6;">
      <nav style="font-size:12px;color:#64748b;margin-bottom:12px;">
        <a href="/" style="color:#6366f1;text-decoration:none;">ZEZHA Tools</a> &gt; 
        <span style="color:#0f172a;font-weight:600;">${escapeHtml(section.label)}</span>
      </nav>
      <h1 style="font-size:26px;font-weight:900;color:#0f172a;margin-bottom:8px;letter-spacing:-0.5px;">${escapeHtml(section.label)} Utilities &amp; Calculators</h1>
      <p style="font-size:15px;color:#334155;margin-bottom:24px;">${escapeHtml(description)}</p>

      <div style="margin-bottom:28px;">
        <h2 style="font-size:16px;font-weight:800;color:#0f172a;margin-bottom:14px;">All ${escapeHtml(section.label)} Tools (${section.tools.length})</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));gap:14px;">
          ${section.tools.map(t => `
            <a href="${t.url}" style="display:block;padding:14px 16px;background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;text-decoration:none;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
              <div style="font-size:14px;font-weight:800;color:#4f46e5;margin-bottom:4px;">${escapeHtml(t.label)}</div>
              <div style="font-size:12px;color:#64748b;line-height:1.45;">${escapeHtml(t.meta?.description || 'Free browser-based utility on ZEZHA Tools.')}</div>
            </a>
          `).join('')}
        </div>
      </div>

      ${renderCategoryNav(section.id)}
      <p style="font-size:12px;color:#64748b;margin-top:16px;">Loading interactive client application... 100% private, client-side execution on ZEZHA Tools.</p>
      ${renderSharedFooter()}
    </div>
  `;

  let html = template
    .replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/i, `<meta name="description" content="${escapeHtml(description)}" />`)
    .replace(/<meta name="keywords" content=".*?" \/>/i, `<meta name="keywords" content="${escapeHtml(keywords)}" />`)
    .replace(/<link rel="canonical" href=".*?" \/>/i, `<link rel="canonical" href="${fullUrl}" />`)
    .replace(/<meta property="og:title" content=".*?" \/>/i, `<meta property="og:title" content="${escapeHtml(title)}" />`)
    .replace(/<meta property="og:description" content=".*?" \/>/i, `<meta property="og:description" content="${escapeHtml(description)}" />`)
    .replace(/<meta property="og:url" content=".*?" \/>/i, `<meta property="og:url" content="${fullUrl}" />`)
    .replace(/<meta name="twitter:title" content=".*?" \/>/i, `<meta name="twitter:title" content="${escapeHtml(title)}" />`)
    .replace(/<meta name="twitter:description" content=".*?" \/>/i, `<meta name="twitter:description" content="${escapeHtml(description)}" />`);

  html = html.replace('<div id="root"></div>', `<div id="root">${preRenderContent}</div>`);

  const targetDir = path.join(distDir, section.id);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
  generatedCount++;
}

// 4. Pre-render Homepage (dist/index.html) with full directory link graph
const homePreRender = `
  <div id="seo-static-container" style="max-width:1080px;margin:32px auto;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1e293b;line-height:1.6;">
    <header style="text-align:center;margin-bottom:36px;">
      <h1 style="font-size:32px;font-weight:900;color:#0f172a;margin-bottom:12px;letter-spacing:-0.5px;">ZEZHA Tools — 100+ Free Online Web Utilities, Calculators &amp; PDF Tools</h1>
      <p style="font-size:16px;color:#475569;max-width:720px;margin:0 auto 16px;">Fast, private, client-side browser utilities for daily finance, loans, tax estimations, PDF manipulations, and developer tasks. Zero server data uploads.</p>
    </header>

    <div style="margin-bottom:32px;">
      <h2 style="font-size:20px;font-weight:900;color:#0f172a;margin-bottom:16px;">Browse by Tool Category</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));gap:14px;">
        ${sections.map(s => `
          <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:16px;box-shadow:0 1px 3px rgba(0,0,0,0.03);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <a href="${s.url}" style="font-size:15px;font-weight:800;color:#4f46e5;text-decoration:none;">${escapeHtml(s.label)}</a>
              <span style="font-size:11px;font-weight:700;background:#e0e7ff;color:#4338ca;padding:2px 8px;border-radius:10px;">${s.tools.length} Tools</span>
            </div>
            <ul style="margin:0;padding-left:16px;font-size:12.5px;color:#475569;">
              ${s.tools.slice(0, 4).map(t => `
                <li style="margin-bottom:3px;"><a href="${t.url}" style="color:#334155;text-decoration:none;">${escapeHtml(t.label)}</a></li>
              `).join('')}
              ${s.tools.length > 4 ? `<li><a href="${s.url}" style="color:#6366f1;font-weight:600;text-decoration:none;">+${s.tools.length - 4} more ${escapeHtml(s.label)} tools &rarr;</a></li>` : ''}
            </ul>
          </div>
        `).join('')}
      </div>
    </div>

    ${renderSharedFooter()}
  </div>
`;

let homeHtml = template.replace('<div id="root"></div>', `<div id="root">${homePreRender}</div>`);
fs.writeFileSync(templatePath, homeHtml, 'utf8');

console.log(`Successfully pre-rendered SEO static HTML for ${generatedCount} direct routes + homepage in dist/`);
