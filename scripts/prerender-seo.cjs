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
  'learn-ai',
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
    <div style="background:#f1f5f9;border-radius:12px;padding:16px 20px;margin-top:28px;">
      <div style="font-size:12px;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">Explore Tool Categories</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;">
        ${sections.map(s => `
          <a href="${s.url}" style="display:inline-block;padding:7px 14px;background:${s.id === currentSectionId ? '#4f46e5' : '#ffffff'};color:${s.id === currentSectionId ? '#ffffff' : '#334155'};border:1px solid ${s.id === currentSectionId ? '#4f46e5' : '#cbd5e1'};border-radius:8px;font-size:12.5px;font-weight:600;text-decoration:none;">
            ${escapeHtml(s.label)} (${s.tools.length})
          </a>
        `).join('')}
      </div>
    </div>
  `;
}

function renderSharedFooter() {
  return `
    <footer style="margin-top:36px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b;display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;line-height:1.6;">
      <div>
        A product of <a href="https://zezha.in" style="color:#6366f1;font-weight:600;text-decoration:none;">ZEZHA Technology Private Limited</a> • 
        <a href="https://zezhatools.com" style="color:#6366f1;text-decoration:none;">ZEZHA Tools</a> • 
        <a href="https://zezhatalent.in" style="color:#6366f1;text-decoration:none;">ZEZHA Talent</a>
      </div>
      <div>100% Private • Client-Side Processing • Zero Server Storage</div>
    </footer>
  `;
}

function renderAppShell(activeSectionId, mainContent) {
  const sidebarLinks = sections.map(s => {
    const isActive = s.id === activeSectionId;
    return `
      <div style="margin-bottom:3px;">
        <a href="${s.url}" style="display:flex;align-items:center;justify-content:space-between;padding:9px 12px;border-radius:8px;font-size:13px;font-weight:700;text-decoration:none;transition:all 0.15s;${isActive ? 'background:linear-gradient(to right, #4f46e5, #6366f1);color:#ffffff;box-shadow:0 2px 4px rgba(79,70,229,0.25);border-left:4px solid #3730a3;' : 'color:#1e293b;border-left:4px solid transparent;'}">
          <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(s.label)}</span>
          ${s.tools.length > 0 ? `<span style="font-size:10px;font-weight:700;background:${isActive ? 'rgba(255,255,255,0.2)' : '#f1f5f9'};color:${isActive ? '#ffffff' : '#64748b'};padding:2px 6px;border-radius:10px;">${s.tools.length}</span>` : ''}
        </a>
      </div>
    `;
  }).join('');

  return `
    <style>
      body, html { margin:0; padding:0; height:100%; background:#f8fafc; }
      #seo-shell { display:flex; height:100vh; overflow:hidden; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; color:#1e293b; }
      .seo-sidebar { width:256px; min-width:256px; background:#ffffff; border-right:1px solid #e2e8f0; display:flex; flex-direction:column; height:100vh; overflow-y:auto; }
      .seo-main { flex:1; height:100vh; overflow-y:auto; overflow-x:hidden; padding:24px 32px; background:#f8fafc; }
      .seo-mobile-header { display:none; }
      @media (max-width: 768px) {
        .seo-sidebar { display:none !important; }
        .seo-mobile-header { display:flex !important; align-items:center; justify-content:space-between; padding:12px 16px; background:#ffffff; border-bottom:1px solid #e2e8f0; position:sticky; top:0; z-index:20; }
        .seo-main { padding:16px 14px !important; }
      }
    </style>
    <div id="seo-shell">
      <!-- Sidebar matching ToolsSidebar -->
      <aside class="seo-sidebar">
        <div style="padding:16px 18px;border-bottom:1px solid #f1f5f9;display:flex;align-items:center;gap:10px;">
          <img src="https://my--files.s3.us-east-1.amazonaws.com/Logo/ZEZHA-only-LOGO-PNG.png" alt="Zezha Tools" style="width:28px;height:28px;object-fit:contain;border-radius:6px;" />
          <div>
            <a href="/" style="font-size:15px;font-weight:900;color:#0f172a;text-decoration:none;letter-spacing:-0.3px;display:block;line-height:1.2;">ZEZHA Tools</a>
            <span style="font-size:10px;font-weight:700;color:#6366f1;text-transform:uppercase;letter-spacing:0.5px;">100+ Free Web Apps</span>
          </div>
        </div>

        <nav style="padding:10px 8px;flex:1;">
          <div style="margin-bottom:3px;">
            <a href="/" style="display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;font-size:13px;font-weight:700;text-decoration:none;${activeSectionId === 'home' || !activeSectionId ? 'background:linear-gradient(to right, #4f46e5, #6366f1);color:#ffffff;box-shadow:0 2px 4px rgba(79,70,229,0.25);border-left:4px solid #3730a3;' : 'color:#1e293b;border-left:4px solid transparent;'}">
              <span>Home</span>
            </a>
          </div>
          <div style="margin-bottom:3px;">
            <a href="https://zezhatalent.in/" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;justify-content:space-between;padding:9px 12px;border-radius:8px;font-size:13px;font-weight:700;color:#1e293b;text-decoration:none;border-left:4px solid transparent;">
              <div style="display:flex;align-items:center;gap:8px;">
                <span>Learn AI</span>
                <span style="background:linear-gradient(to right, #7c3aed, #4f46e5);color:#fff;font-size:9px;font-weight:800;padding:1px 5px;border-radius:4px;">AI</span>
              </div>
              <span style="font-size:11px;color:#94a3b8;">↗</span>
            </a>
          </div>
          ${sidebarLinks}
        </nav>

        <div style="padding:12px 14px;border-top:1px solid #f1f5f9;font-size:11px;color:#64748b;">
          <a href="https://zezha.in" target="_blank" rel="noopener noreferrer" style="color:#475569;text-decoration:none;font-weight:600;display:flex;align-items:center;gap:6px;">
            <span style="width:6px;height:6px;background:#10b981;border-radius:50%;display:inline-block;"></span>
            <span>by ZEZHA Technology</span>
          </a>
        </div>
      </aside>

      <!-- Main Content Area -->
      <div style="flex:1;display:flex;flex-direction:column;min-width:0;height:100vh;overflow:hidden;">
        <header class="seo-mobile-header">
          <div style="font-weight:900;font-size:15px;color:#4f46e5;">ZEZHA Tools</div>
          <a href="/" style="font-size:12px;color:#4f46e5;font-weight:700;text-decoration:none;">Menu</a>
        </header>

        <main class="seo-main">
          ${mainContent}
        </main>
      </div>
    </div>
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

    const toolContent = `
      <div style="max-width:960px;margin:0 auto;">
        <nav style="font-size:12px;color:#64748b;margin-bottom:12px;">
          <a href="/" style="color:#6366f1;text-decoration:none;">ZEZHA Tools</a> &gt; 
          <a href="${section.url}" style="color:#6366f1;text-decoration:none;">${escapeHtml(section.label)}</a> &gt; 
          <span style="color:#0f172a;font-weight:600;">${escapeHtml(tool.label)}</span>
        </nav>
        <h1 style="font-size:24px;font-weight:900;color:#0f172a;margin-bottom:8px;letter-spacing:-0.5px;">${escapeHtml(h1)}</h1>
        <p style="font-size:14px;color:#475569;margin-bottom:20px;">${escapeHtml(description)}</p>
        
        <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:24px;box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <h2 style="font-size:13.5px;font-weight:800;color:#0f172a;margin:0 0 10px 0;text-transform:uppercase;letter-spacing:0.4px;">Key Capabilities</h2>
          <ul style="margin:0;padding-left:18px;font-size:13px;color:#475569;">
            ${features.map(f => `<li style="margin-bottom:4px;">${escapeHtml(f)}</li>`).join('')}
          </ul>
        </div>

        ${siblingTools.length > 0 ? `
          <div style="margin-bottom:24px;">
            <h2 style="font-size:15px;font-weight:800;color:#0f172a;margin-bottom:12px;">More ${escapeHtml(section.label)} Tools</h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(220px, 1fr));gap:10px;">
              ${siblingTools.slice(0, 6).map(st => `
                <a href="${st.url}" style="display:block;padding:12px 14px;background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;text-decoration:none;">
                  <div style="font-size:13px;font-weight:700;color:#1e293b;margin-bottom:3px;">${escapeHtml(st.label)}</div>
                  <div style="font-size:11px;color:#64748b;line-height:1.4;">${escapeHtml(st.meta?.shortTitle || st.meta?.description?.slice(0, 75) + '...')}</div>
                </a>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${renderCategoryNav(section.id)}
        ${renderSharedFooter()}
      </div>
    `;

    const preRenderContent = renderAppShell(section.id, toolContent);

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
const cardColorMap = ['#4f46e5', '#0284c7', '#059669', '#d97706', '#dc2626', '#7c3aed', '#db2777', '#0d9488'];

for (const section of sections) {
  if (section.isStandalone) continue; // already generated as tool

  const title = `${section.label} Tools & Calculators — Zezha Tools`;
  const description = `Explore all free online ${section.label} utilities, calculators, and tools on Zezha Tools. 100% private, browser-based tools with zero data uploaded.`;
  const keywords = `${section.label}, online calculators, web utilities, free tools, zezha tools`;
  const fullUrl = `https://zezhatools.com${section.url}`;

  const sectionContent = `
    <div style="max-width:1100px;margin:0 auto;">
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="font-size:24px;font-weight:900;color:#0f172a;letter-spacing:-0.5px;margin:0 0 6px 0;">${escapeHtml(section.label)}</h1>
        <p style="font-size:12.5px;color:#059669;font-weight:700;margin:0;">Fast, secure, browser-based utilities &amp; calculators</p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(230px, 1fr));gap:12px;margin-bottom:28px;">
        ${section.tools.map((t, idx) => {
          const bgCol = cardColorMap[idx % cardColorMap.length];
          return `
            <a href="${t.url}" style="display:block;padding:16px;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;text-decoration:none;box-shadow:0 1px 2px rgba(0,0,0,0.03);transition:all 0.15s;">
              <div style="width:36px;height:36px;background:${bgCol};border-radius:8px;display:flex;align-items:center;justify-content:center;margin-bottom:12px;color:#ffffff;font-weight:900;font-size:16px;">
                ⚡
              </div>
              <h2 style="font-size:13.5px;font-weight:800;color:#0f172a;margin:0 0 4px 0;">${escapeHtml(t.label)}</h2>
              <p style="font-size:11px;color:#64748b;line-height:1.45;margin:0;">${escapeHtml(t.meta?.shortTitle || t.meta?.description?.slice(0, 90) + '...' || 'Free browser-based utility.')}</p>
            </a>
          `;
        }).join('')}
      </div>

      ${renderCategoryNav(section.id)}
      ${renderSharedFooter()}
    </div>
  `;

  const preRenderContent = renderAppShell(section.id, sectionContent);

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
const homeContent = `
  <div style="max-width:1080px;margin:0 auto;">
    <header style="text-align:center;margin-bottom:32px;">
      <h1 style="font-size:28px;font-weight:900;color:#0f172a;margin-bottom:10px;letter-spacing:-0.5px;">ZEZHA Tools — 100+ Free Online Web Utilities, Calculators &amp; PDF Tools</h1>
      <p style="font-size:15px;color:#475569;max-width:720px;margin:0 auto;">Fast, private, client-side browser utilities for daily finance, loans, tax estimations, PDF manipulations, and developer tasks. Zero server data uploads.</p>
    </header>

    <div style="margin-bottom:32px;">
      <h2 style="font-size:18px;font-weight:900;color:#0f172a;margin-bottom:16px;">Browse by Tool Category</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(260px, 1fr));gap:14px;">
        ${sections.map(s => `
          <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:16px;box-shadow:0 1px 3px rgba(0,0,0,0.03);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <a href="${s.url}" style="font-size:14.5px;font-weight:800;color:#4f46e5;text-decoration:none;">${escapeHtml(s.label)}</a>
              <span style="font-size:11px;font-weight:700;background:#e0e7ff;color:#4338ca;padding:2px 8px;border-radius:10px;">${s.tools.length} Tools</span>
            </div>
            <ul style="margin:0;padding-left:16px;font-size:12px;color:#475569;">
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

const homePreRender = renderAppShell('home', homeContent);

let homeHtml = template.replace('<div id="root"></div>', `<div id="root">${homePreRender}</div>`);
fs.writeFileSync(templatePath, homeHtml, 'utf8');

console.log(`Successfully pre-rendered SEO static HTML for ${generatedCount} direct routes + homepage in dist/`);

