# Zezha Tools

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF.svg)](https://vite.dev/)

**Zezha Tools** is an open-source, privacy-first web suite of **100+ browser-based utilities**—including PDF/document converters, Indian & global financial calculators, a developer toolkit, life/budget planners, and downloadable reference datasets.

Live site: **[zezhatools.com](https://zezhatools.com)**

---

## Highlights

- **Client-side & privacy-first:** Document conversions, OCR, image compression, JSON/JWT/regex utilities, and calculators run directly in the browser.
- **100+ tools across 10+ categories:** Organized into dedicated toolboxes with instant search, favorites, and lazy-loaded code splitting.
- **SEO & static pre-rendering pipeline:** Automatic sitemap generation (`scripts/generate-sitemap.cjs`), redirect rules (`scripts/generate-redirects.cjs`), and static shell pre-rendering (`scripts/prerender-seo.cjs`).

---

## Tool Categories

| Category | Count | Examples |
| --- | ---: | --- |
| **Developer Toolkit** | 30 | JSON Formatter/Comparator/Path Finder, JWT Decoder, SQL Formatter, Regex Tester, Cron Builder, Code Syntax Checker, Hash/UUID/Token Generators, SSL Cert Checker |
| **Raw Reference Datasets** | 29 | Indian States/Cities/PIN Codes, Banks & IFSC, GST State Codes & HSN/SAC Rate Finder, Income Tax Slabs, TDS/EPF/RBI Rates, Compliance Calendar |
| **Utilities & Life Planners** | 16 | Universal Unit Converter, Currency Calculator, FIRE Calculator, Rent vs Buy, Weighted Decision Matrix, Time-Boxer Planner, BMI & Body Fat % |
| **Convertors & PDF Tools** | 13 | Image to PDF, Merge/Split/Compress/Crop/Edit PDF, Word to PDF, HTML to PDF, OCR (Image to Text), Image Compressor |
| **Business & Tax** | 10 | Income Tax Estimator (Old vs New Regime), GST/VAT & TDS Calculators, Profit & Loss, ROI, Break-Even, Business Valuation |
| **Loans & EMI** | 6 | Loan & EMI Calculators, Loan Compare, DTI & LTV Ratios, Standard Calculator |
| **Investments** | 4 | FD, RD, SIP Calculators, IBJA Gold & Silver Rates (INR) |
| **Creative & Discovery** | 6 | Govt Scheme Finder, Invitation Creator, Event Landing Page Creator, Logo Creator, Image & Video Search Downloaders |

---

## Tech Stack

- **Frontend:** React 19, TypeScript, React Router, Tailwind CSS v4, Lucide Icons
- **Build & Tooling:** Vite 6, ESLint 9, custom Node build scripts (`sitemap`, `_redirects`, SEO pre-rendering)
- **Document & Media Processing:** `pdf-lib`, `pdfjs-dist`, `jspdf`, `html2pdf.js`, `mammoth`, `tesseract.js`, `browser-image-compression`, `jszip`
- **Data & Visualization:** `@duckdb/duckdb-wasm`, `@tanstack/react-table`, `echarts`, `recharts`, `papaparse`, `xlsx`
- **Cloud & Auth (optional):** `@supabase/supabase-js`

---

## Getting Started

### Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm** 10+

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/rajeshkanna-s/zezha-tools.git
cd zezha-tools

# 2. Install dependencies
npm install

# 3. Start the Vite dev server (runs on http://localhost:8083)
npm run dev
```

### Production Build & Preview

```bash
# Generates sitemap + redirects, builds Vite bundle, and runs SEO prerendering
npm run build

# Preview the production build locally
npm run serve
```

### Linting

```bash
npm run lint
```

---

## Project Structure

```text
zezha-tools/
├── public/                 # Static assets
├── scripts/                # Build-time SEO & deployment scripts
│   ├── generate-sitemap.cjs
│   ├── generate-redirects.cjs
│   └── prerender-seo.cjs
├── src/
│   ├── APIs/               # Media search/download tools
│   ├── auth/               # User menu & auth UI
│   ├── contexts/           # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # Supabase client & types
│   ├── services/           # Data, chart, DuckDB, SEO, backup services
│   ├── tools/              # Tool modules & dashboards
│   │   ├── calculators/
│   │   ├── dev-toolkit/
│   │   ├── raw-data/
│   │   └── ...
│   ├── types/              # Shared TypeScript definitions
│   └── utils/              # PDF, Excel, date, and helper utilities
├── netlify.toml            # Netlify build & header configuration
├── vercel.json             # Vercel redirects & SPA rewrites
└── vite.config.ts          # Vite configuration & manual chunk splitting
```

---

## Contributing

Contributions, bug reports, and new tool ideas are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## Security

If you discover a security vulnerability, please follow the responsible disclosure guidelines in [SECURITY.md](SECURITY.md).

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
