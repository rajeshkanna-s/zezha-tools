import React, { useState, useMemo } from 'react';
import { Receipt, AlertTriangle, CheckCircle2, Info, Copy, Check, ChevronDown, ChevronRight, Search, Calculator, IndianRupee } from 'lucide-react';

// ═══ TDS Sections Data — FY 2025-26 / 2026-27 (Updated March 2026) ═══
// Sources: ClearTax, TaxGuru, Income Tax Act 2025, Union Budget 2025-26 & 2026-27

interface TDSSection {
  section: string;
  name: string;
  description: string;
  threshold: number;
  thresholdNote?: string;
  rate: number;
  rateHUF?: number;        // rate for HUF/Individual if different
  rateOthers?: number;     // rate for Companies/Firms
  noPanRate: number;       // rate when PAN not available
  category: string;
  effectiveFrom: string;
  notes?: string[];
}

const TDS_SECTIONS: TDSSection[] = [
  // ── Salary & Employment ──
  {
    section: '192', name: 'Salary', description: 'TDS on salary income by employer',
    threshold: 0, thresholdNote: 'As per income tax slab rates — no fixed threshold',
    rate: 0, noPanRate: 0.30, category: 'Salary & Employment', effectiveFrom: 'FY 2025-26',
    notes: ['Rate = as per applicable income tax slab', 'Employer must consider declarations (80C, 80D, HRA)', 'New tax regime is default from FY 2023-24'],
  },
  {
    section: '192A', name: 'Premature EPF Withdrawal', description: 'TDS on premature withdrawal from EPF',
    threshold: 50000, rate: 0.10, noPanRate: 0.20, category: 'Salary & Employment', effectiveFrom: 'FY 2025-26',
    notes: ['Applicable only if service < 5 years', 'No TDS if Form 15G/15H submitted', 'Maximum rate without PAN is 20%'],
  },

  // ── Interest Income ──
  {
    section: '193', name: 'Interest on Securities', description: 'TDS on interest on government/corporate bonds, debentures',
    threshold: 10000, rate: 0.10, noPanRate: 0.20, category: 'Interest Income', effectiveFrom: 'FY 2025-26',
    notes: ['Includes government securities, debentures, bonds', 'Exemption for certain listed securities held in demat form'],
  },
  {
    section: '194A (Banks/PO - Senior)', name: 'Interest — Senior Citizens (Bank/PO)', description: 'Interest from banks/post office for senior citizens (60+ years)',
    threshold: 100000, rate: 0.10, noPanRate: 0.20, category: 'Interest Income', effectiveFrom: 'FY 2025-26',
    notes: ['Threshold increased from ₹50,000 to ₹1,00,000 in Budget 2025', 'Applicable to savings, FD, RD interest from banks/cooperative/PO', 'Form 15H can be submitted for nil deduction'],
  },
  {
    section: '194A (Banks/PO - Others)', name: 'Interest — Others (Bank/PO)', description: 'Interest from banks/post office for non-senior citizens',
    threshold: 50000, rate: 0.10, noPanRate: 0.20, category: 'Interest Income', effectiveFrom: 'FY 2025-26',
    notes: ['Threshold increased from ₹40,000 to ₹50,000 in Budget 2025', 'Includes savings account, FD, RD interest', 'Form 15G can be submitted if total income below taxable limit'],
  },
  {
    section: '194A (Others)', name: 'Interest — Other Payers', description: 'Interest from non-banking sources (companies, individuals in business)',
    threshold: 10000, rate: 0.10, noPanRate: 0.20, category: 'Interest Income', effectiveFrom: 'FY 2025-26',
    notes: ['Threshold increased from ₹5,000 to ₹10,000 in Budget 2025', 'Applicable when payer is not a bank/cooperative/post office'],
  },

  // ── Dividends & Mutual Funds ──
  {
    section: '194', name: 'Dividend', description: 'TDS on dividend from Indian companies',
    threshold: 10000, rate: 0.10, noPanRate: 0.20, category: 'Dividends & MF', effectiveFrom: 'FY 2025-26',
    notes: ['Threshold increased from ₹5,000 to ₹10,000 in Budget 2025', 'Company deducts TDS before paying dividend', 'Applicable to equity dividends declared by Indian companies'],
  },
  {
    section: '194K', name: 'Mutual Fund Income', description: 'TDS on income from mutual fund units',
    threshold: 10000, rate: 0.10, noPanRate: 0.20, category: 'Dividends & MF', effectiveFrom: 'FY 2025-26',
    notes: ['Threshold increased from ₹5,000 to ₹10,000 in Budget 2025', 'Applicable to dividend/income distribution from MF', 'Capital gains on MF units not covered here'],
  },

  // ── Winnings ──
  {
    section: '194B', name: 'Lottery / Crossword / Game Show', description: 'TDS on winnings from lottery, crossword puzzle, card game, game show',
    threshold: 10000, rate: 0.30, noPanRate: 0.30, category: 'Winnings', effectiveFrom: 'FY 2025-26',
    notes: ['Flat 30% — no slab benefit available', 'Threshold is per transaction (not aggregate)', 'Surcharge and cess apply additionally'],
  },
  {
    section: '194BA', name: 'Online Gaming', description: 'TDS on net winnings from online gaming',
    threshold: 0, thresholdNote: 'TDS on net winnings at withdrawal/year-end, no threshold',
    rate: 0.30, noPanRate: 0.30, category: 'Winnings', effectiveFrom: 'FY 2025-26',
    notes: ['Introduced in Budget 2023 — effective 1 Apr 2023', 'Calculated on net winnings (deposits - withdrawals)', 'Deducted at time of withdrawal or end of FY', 'Applicable to online gaming platforms (Dream11, MPL, etc.)'],
  },
  {
    section: '194BB', name: 'Horse Race Winnings', description: 'TDS on winnings from horse races',
    threshold: 10000, rate: 0.30, noPanRate: 0.30, category: 'Winnings', effectiveFrom: 'FY 2025-26',
    notes: ['Flat 30% rate', 'Threshold is per race meeting'],
  },

  // ── Commission & Brokerage ──
  {
    section: '194D (Ind/HUF)', name: 'Insurance Commission — Individual/HUF', description: 'Commission paid to insurance agents (Individual/HUF)',
    threshold: 20000, rate: 0.02, noPanRate: 0.20, category: 'Commission', effectiveFrom: 'FY 2025-26',
    notes: ['Threshold increased from ₹15,000 to ₹20,000 in Budget 2025', 'Rate is 2% for Individual/HUF (reduced from 5%)'],
  },
  {
    section: '194D (Others)', name: 'Insurance Commission — Companies', description: 'Commission paid to insurance agents (Companies/Firms)',
    threshold: 20000, rate: 0.10, noPanRate: 0.20, category: 'Commission', effectiveFrom: 'FY 2025-26',
    notes: ['Rate is 10% for companies and firms'],
  },
  {
    section: '194G', name: 'Lottery Ticket Commission', description: 'Commission on sale of lottery tickets',
    threshold: 20000, rate: 0.02, noPanRate: 0.20, category: 'Commission', effectiveFrom: 'FY 2025-26',
    notes: ['Applicable to commission/remuneration for lottery ticket sales', 'Rate reduced from 5% to 2% in Budget 2024'],
  },
  {
    section: '194H', name: 'Commission or Brokerage', description: 'TDS on commission or brokerage payments',
    threshold: 20000, rate: 0.02, noPanRate: 0.20, category: 'Commission', effectiveFrom: 'FY 2025-26',
    notes: ['Threshold increased from ₹15,000 to ₹20,000 in Budget 2025', 'Rate reduced from 5% to 2%', 'Covers: advertising agency commission, stock broker commission, real estate brokerage'],
  },

  // ── Rent ──
  {
    section: '194I (Plant/Machinery)', name: 'Rent — Plant & Machinery', description: 'TDS on rent for plant, machinery, equipment',
    threshold: 50000, thresholdNote: '₹50,000 per month (₹6,00,000 per year)',
    rate: 0.02, noPanRate: 0.20, category: 'Rent', effectiveFrom: 'FY 2025-26',
    notes: ['Rate is 2% for plant and machinery', 'Threshold changed from ₹2,40,000/year to ₹50,000/month'],
  },
  {
    section: '194I (Land/Building)', name: 'Rent — Land, Building, Furniture', description: 'TDS on rent for land, building, or furniture',
    threshold: 50000, thresholdNote: '₹50,000 per month (₹6,00,000 per year)',
    rate: 0.10, noPanRate: 0.20, category: 'Rent', effectiveFrom: 'FY 2025-26',
    notes: ['Rate is 10% for land, building, and furniture', 'Threshold changed from ₹2,40,000/year to ₹50,000/month', 'Tenants paying rent > ₹50K/month must deduct TDS'],
  },
  {
    section: '194IB', name: 'Rent by Individual/HUF', description: 'TDS on rent paid by individual/HUF (not liable for audit)',
    threshold: 50000, thresholdNote: '₹50,000 per month',
    rate: 0.02, noPanRate: 0.20, category: 'Rent', effectiveFrom: 'FY 2025-26',
    notes: ['For individual/HUF tenants not covered under 194I', 'Rate: 2% (reduced from 5%)', 'Deduct TDS in last month of FY or last month of tenancy'],
  },

  // ── Contractors & Professionals ──
  {
    section: '194C (Ind/HUF)', name: 'Contractors — Individual/HUF', description: 'Payment to contractors/sub-contractors (Individual/HUF)',
    threshold: 30000, thresholdNote: '₹30,000 per transaction OR ₹1,00,000 aggregate in FY',
    rate: 0.01, noPanRate: 0.20, category: 'Contractors & Professionals', effectiveFrom: 'FY 2025-26',
    notes: ['Rate: 1% for Individual/HUF', 'Manpower services now classified as "work" under 194C (Budget 2026-27)', 'Transport contractors with own 10+ trucks: Nil TDS (with PAN + declaration)'],
  },
  {
    section: '194C (Others)', name: 'Contractors — Companies/Firms', description: 'Payment to contractors/sub-contractors (Companies/Firms)',
    threshold: 30000, thresholdNote: '₹30,000 per transaction OR ₹1,00,000 aggregate in FY',
    rate: 0.02, noPanRate: 0.20, category: 'Contractors & Professionals', effectiveFrom: 'FY 2025-26',
    notes: ['Rate: 2% for companies, firms, LLPs', 'Threshold: either ₹30K single payment OR ₹1L aggregate in FY'],
  },
  {
    section: '194J (Technical)', name: 'Technical Fees / Royalty / Call Center', description: 'Fees for technical services, royalty, call center payments',
    threshold: 50000, rate: 0.02, noPanRate: 0.20, category: 'Contractors & Professionals', effectiveFrom: 'FY 2025-26',
    notes: ['Rate: 2% for technical services, royalty for cine films, call center', 'Threshold increased from ₹30,000 to ₹50,000 in Budget 2025'],
  },
  {
    section: '194J (Professional)', name: 'Professional Fees', description: 'Fees for professional services (CA, lawyer, doctor, architect, etc.)',
    threshold: 50000, rate: 0.10, noPanRate: 0.20, category: 'Contractors & Professionals', effectiveFrom: 'FY 2025-26',
    notes: ['Rate: 10% for professional fees', 'Covers: CA, lawyer, doctor, architect, interior designer, consultant', 'Threshold increased from ₹30,000 to ₹50,000 in Budget 2025'],
  },
  {
    section: '194M', name: 'Payment by Individual/HUF to Contractors/Professionals', description: 'TDS by individual/HUF (not liable for audit) to resident contractors/professionals',
    threshold: 5000000, rate: 0.02, noPanRate: 0.20, category: 'Contractors & Professionals', effectiveFrom: 'FY 2025-26',
    notes: ['For individuals/HUFs without tax audit requirement', 'Rate: 2% (reduced from 5%)', 'Threshold: ₹50 lakh aggregate in FY'],
  },

  // ── Property & Land ──
  {
    section: '194IA', name: 'Purchase of Immovable Property', description: 'TDS on sale of immovable property (buyer deducts)',
    threshold: 5000000, rate: 0.01, noPanRate: 0.20, category: 'Property & Land', effectiveFrom: 'FY 2025-26',
    notes: ['Buyer deducts 1% TDS if consideration > ₹50 lakh', 'Rural agricultural land is exempt', 'TDS on stamp duty value if stamp value > consideration by 10%+'],
  },
  {
    section: '194LA', name: 'Compensation on Land Acquisition', description: 'TDS on compensation for compulsory acquisition of immovable property',
    threshold: 250000, rate: 0.10, noPanRate: 0.20, category: 'Property & Land', effectiveFrom: 'FY 2025-26',
    notes: ['Rate: 10%', 'Agricultural land acquired under certain Acts is exempt', 'Threshold: ₹2,50,000 in a financial year'],
  },

  // ── Business Transactions ──
  {
    section: '194Q', name: 'Purchase of Goods', description: 'TDS on purchase of goods from resident seller (buyer deducts)',
    threshold: 5000000, rate: 0.001, noPanRate: 0.05, category: 'Business', effectiveFrom: 'FY 2025-26',
    notes: ['Rate: 0.1% on amount exceeding ₹50 lakh', 'Applicable only if buyer turnover > ₹10 crore in previous FY', '206C(1H) on sale of goods removed from Apr 2025 — only 194Q applies'],
  },
  {
    section: '194R', name: 'Benefits or Perquisites (Business)', description: 'TDS on benefits/perquisites of business/profession (not salary)',
    threshold: 20000, rate: 0.10, noPanRate: 0.20, category: 'Business', effectiveFrom: 'FY 2025-26',
    notes: ['Covers: free trips, gifts, incentives given in business context', 'Not applicable for salary perquisites (covered under 192)', 'Threshold: ₹20,000 in aggregate per FY'],
  },
  {
    section: '194O', name: 'E-Commerce Transactions', description: 'TDS by e-commerce operator on payments to e-commerce participants',
    threshold: 500000, rate: 0.001, noPanRate: 0.05, category: 'Business', effectiveFrom: 'FY 2025-26',
    notes: ['Rate: 0.1% (reduced from 1%)', 'Threshold: ₹5,00,000 in a FY', 'E-commerce platform deducts TDS before paying the seller'],
  },

  // ── Cash & Digital Assets ──
  {
    section: '194N (ITR Filed)', name: 'Cash Withdrawal — ITR Filed', description: 'TDS on cash withdrawal exceeding ₹1 crore (ITR filed)',
    threshold: 10000000, rate: 0.02, noPanRate: 0.20, category: 'Cash & Digital Assets', effectiveFrom: 'FY 2025-26',
    notes: ['Rate: 2% on amount exceeding ₹1 crore', 'Applicable if person has filed ITR for last 3 years', 'Cooperative society threshold: ₹3 crore'],
  },
  {
    section: '194N (No ITR)', name: 'Cash Withdrawal — ITR Not Filed', description: 'TDS on cash withdrawal for non-ITR filers',
    threshold: 2000000, thresholdNote: '2% on ₹20L-1Cr, then 5% above ₹1 crore',
    rate: 0.02, noPanRate: 0.20, category: 'Cash & Digital Assets', effectiveFrom: 'FY 2025-26',
    notes: ['If ITR not filed for last 3 years:', '• 2% on withdrawal between ₹20 lakh to ₹1 crore', '• 5% on withdrawal exceeding ₹1 crore', 'Encourages digital transactions and ITR filing'],
  },
  {
    section: '194S', name: 'Virtual Digital Assets (Crypto)', description: 'TDS on transfer of virtual digital assets (cryptocurrency, NFTs)',
    threshold: 50000, thresholdNote: '₹50,000 for specified persons; ₹10,000 for others',
    rate: 0.01, noPanRate: 0.20, category: 'Cash & Digital Assets', effectiveFrom: 'FY 2025-26',
    notes: ['VDA = cryptocurrency, NFTs, tokens', 'Rate: 1% on consideration', 'Crypto exchanges deduct TDS automatically', '30% income tax on crypto gains (Section 115BBH) is separate'],
  },

  // ── Partnership ──
  {
    section: '194T', name: 'Partner Remuneration/Interest', description: 'TDS on salary, commission, bonus, or interest paid to firm partners',
    threshold: 20000, rate: 0.10, noPanRate: 0.20, category: 'Partnership', effectiveFrom: 'FY 2025-26',
    notes: ['NEW — Introduced in Budget 2025 (effective 1 Apr 2025)', 'Covers: salary, remuneration, commission, bonus, interest to partners', 'Threshold: ₹20,000 aggregate in a FY', 'Firm deducts TDS before paying the partner'],
  },

  // ── Insurance ──
  {
    section: '194DA', name: 'Life Insurance Maturity', description: 'TDS on life insurance maturity proceeds',
    threshold: 100000, rate: 0.02, noPanRate: 0.20, category: 'Insurance', effectiveFrom: 'FY 2025-26',
    notes: ['Rate: 2% (reduced from 5%)', 'Threshold: ₹1,00,000', 'Exempt under Section 10(10D) if premium < 10% of sum assured', 'TDS on income component only (maturity - premiums paid)'],
  },

  // ── Senior Citizens ──
  {
    section: '194P', name: 'Senior Citizens (75+) — Bank TDS', description: 'TDS for senior citizens 75+ having only pension + interest income',
    threshold: 0, thresholdNote: 'Bank calculates TDS based on slab rates — no ITR required',
    rate: 0, noPanRate: 0.20, category: 'Senior Citizens', effectiveFrom: 'FY 2025-26',
    notes: ['For senior citizens aged 75+ with ONLY pension + bank interest income', 'Bank acts as authorized entity to deduct TDS at slab rates', 'No ITR filing required — bank covers tax liability', 'Declaration to be given to specified bank'],
  },

  // ── LBC ──
  {
    section: '194LBC', name: 'Securitization Trust Income', description: 'TDS on income from investment in securitization trust',
    threshold: 0, rate: 0.10, noPanRate: 0.20, category: 'Business', effectiveFrom: 'FY 2025-26',
    notes: ['Rate: 10% (reduced from 25%/30% in Budget 2025)', '25% for Individual/HUF, 30% for others was the old rate'],
  },
];

const CATEGORIES = Array.from(new Set(TDS_SECTIONS.map(s => s.category)));



export const TdsCalculator: React.FC = () => {
  const [tab, setTab] = useState<'calculator' | 'reference'>('calculator');
  const [pan, setPan] = useState('yes');
  const [section, setSection] = useState(TDS_SECTIONS[2].section); // 193
  const [amount, setAmount] = useState('');

  const [result, setResult] = useState<{ tds: number; rate: number; threshold: number; applicable: boolean; sectionData: TDSSection } | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [refSearch, setRefSearch] = useState('');
  const [refCategory, setRefCategory] = useState('');
  const [expandedRef, setExpandedRef] = useState<string | null>(null);

  const sectionData = TDS_SECTIONS.find(s => s.section === section);

  const calculate = () => {
    const amt = parseFloat(amount.replace(/,/g, ''));
    setError(''); setResult(null);
    if (isNaN(amt) || amt <= 0) { setError('Please enter a valid amount.'); return; }
    const data = TDS_SECTIONS.find(s => s.section === section);
    if (!data) { setError('Invalid section'); return; }

    // Determine rate
    let rate = data.rate;
    if (data.section.includes('194C') || data.section.includes('194D')) {
      // Already split into separate entries
    }
    if (pan === 'no') rate = data.noPanRate;

    // Check threshold
    const threshold = data.threshold;
    if (data.section === '192' || data.section === '194P') {
      setResult({ tds: 0, rate: 0, threshold: 0, applicable: true, sectionData: data });
      return;
    }

    if (threshold > 0 && amt <= threshold) {
      setResult({ tds: 0, rate, threshold, applicable: false, sectionData: data });
      return;
    }

    // Calculate TDS
    let taxableAmount = amt;
    // For some sections, TDS is on amount exceeding threshold
    if (['194Q', '194N (ITR Filed)', '194N (No ITR)'].includes(data.section)) {
      taxableAmount = amt - threshold;
    }

    const tds = Math.round(taxableAmount * rate * 100) / 100;
    setResult({ tds, rate, threshold, applicable: true, sectionData: data });
  };

  const copyResult = () => {
    if (!result || !result.applicable) return;
    const text = `TDS Calculation — Section ${result.sectionData.section}\nAmount: ₹${parseFloat(amount).toLocaleString('en-IN')}\nRate: ${(result.rate * 100).toFixed(1)}%${pan === 'no' ? ' (No PAN — higher rate)' : ''}\nTDS: ₹${result.tds.toLocaleString('en-IN', { minimumFractionDigits: 2 })}\nThreshold: ₹${result.threshold.toLocaleString('en-IN')}\nFY: 2025-26 / 2026-27`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const filteredRef = useMemo(() => {
    let list = TDS_SECTIONS;
    if (refCategory) list = list.filter(s => s.category === refCategory);
    if (refSearch.trim()) {
      const q = refSearch.toLowerCase();
      list = list.filter(s => s.section.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
    }
    return list;
  }, [refCategory, refSearch]);

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '16px' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #d97706, #ea580c, #dc2626)', borderRadius: 16, padding: '20px 24px', color: 'white', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Receipt size={22} />
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>TDS Calculator</h2>
            <p style={{ margin: 0, fontSize: 11, opacity: 0.85 }}>FY 2025-26 / 2026-27 · {TDS_SECTIONS.length} Sections · Updated March 2026</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: 'rgba(255,255,255,0.2)' }}>Budget 2025-26 Rates</span>
          <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: 'rgba(255,255,255,0.2)' }}>New Section 194T</span>
          <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: 'rgba(255,255,255,0.2)' }}>Crypto TDS (194S)</span>
          <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: 'rgba(255,255,255,0.2)' }}>Online Gaming (194BA)</span>
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 4, borderRadius: 12, marginBottom: 16 }}>
        {([['calculator', '🧮 Calculator'], ['reference', '📋 All Sections']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            style={{ flex: 1, padding: '8px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              background: tab === key ? 'white' : 'transparent', color: tab === key ? '#4338ca' : '#64748b', boxShadow: tab === key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
            {label}
          </button>
        ))}
      </div>

      {/* ═══ Calculator Tab ═══ */}
      {tab === 'calculator' && (
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20 }}>
          {/* Section selector */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>TDS Section</label>
            <select value={section} onChange={e => { setSection(e.target.value); setResult(null); }}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 12, background: 'white', outline: 'none' }}>
              {TDS_SECTIONS.map(s => (
                <option key={s.section} value={s.section}>{s.section} — {s.name} ({(s.rate * 100).toFixed(1)}%)</option>
              ))}
            </select>
          </div>

          {/* Section info badge */}
          {sectionData && (
            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 12, padding: '10px 14px', marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#0369a1', marginBottom: 4 }}>📖 {sectionData.name}</div>
              <div style={{ fontSize: 10, color: '#0c4a6e' }}>{sectionData.description}</div>
              <div style={{ fontSize: 10, color: '#0284c7', marginTop: 4 }}>
                Threshold: {sectionData.thresholdNote || (sectionData.threshold > 0 ? `₹${sectionData.threshold.toLocaleString('en-IN')}` : 'No threshold')}
                {' · '}Rate: {sectionData.rate > 0 ? `${(sectionData.rate * 100).toFixed(1)}%` : 'Slab rates'}
                {' · '}No PAN: {(sectionData.noPanRate * 100).toFixed(0)}%
              </div>
            </div>
          )}

          {/* Inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>PAN Available?</label>
              <select value={pan} onChange={e => { setPan(e.target.value); setResult(null); }}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 12, background: 'white', outline: 'none' }}>
                <option value="yes">✅ Yes</option>
                <option value="no">❌ No (Higher Rate)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>Enter Amount (₹)</label>
              <input type="text" value={amount} onChange={e => { setAmount(e.target.value); setResult(null); }} placeholder="e.g. 5,00,000"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 12, background: 'white', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '8px 12px', marginBottom: 12, fontSize: 11, color: '#b91c1c', display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertTriangle size={13} /> {error}
            </div>
          )}

          <button onClick={calculate}
            style={{ width: '100%', padding: '12px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #d97706, #ea580c)', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            <Calculator size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            Calculate TDS
          </button>

          {/* Result */}
          {result && (
            <div style={{ marginTop: 16, borderRadius: 16, border: result.applicable ? '1px solid #bbf7d0' : '1px solid #fde68a', background: result.applicable ? '#f0fdf4' : '#fffbeb', padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {result.applicable && result.tds > 0 ? <IndianRupee size={16} style={{ color: '#16a34a' }} /> : <CheckCircle2 size={16} style={{ color: '#d97706' }} />}
                  <span style={{ fontSize: 13, fontWeight: 700, color: result.applicable ? '#166534' : '#92400e' }}>
                    {result.sectionData.section === '192' || result.sectionData.section === '194P'
                      ? 'TDS as per Income Tax Slab Rates'
                      : result.applicable && result.tds > 0
                        ? 'TDS Applicable'
                        : 'No TDS Applicable'}
                  </span>
                </div>
                {result.applicable && result.tds > 0 && (
                  <button onClick={copyResult} style={{ fontSize: 10, color: '#16a34a', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
                    {copied ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
                  </button>
                )}
              </div>

              {result.applicable && result.tds > 0 && (
                <>
                  <div style={{ textAlign: 'center', marginBottom: 14 }}>
                    <div style={{ fontSize: 32, fontWeight: 800, color: '#166534' }}>₹{result.tds.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>TDS Amount</div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    <div style={{ background: 'white', borderRadius: 10, padding: 10, textAlign: 'center', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: 9, color: '#94a3b8' }}>Rate Applied</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#4338ca' }}>{(result.rate * 100).toFixed(1)}%</div>
                    </div>
                    <div style={{ background: 'white', borderRadius: 10, padding: 10, textAlign: 'center', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: 9, color: '#94a3b8' }}>Amount After TDS</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#059669' }}>₹{(parseFloat(amount.replace(/,/g, '')) - result.tds).toLocaleString('en-IN', { minimumFractionDigits: 0 })}</div>
                    </div>
                    <div style={{ background: 'white', borderRadius: 10, padding: 10, textAlign: 'center', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: 9, color: '#94a3b8' }}>Threshold</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#d97706' }}>₹{result.threshold.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                </>
              )}

              {pan === 'no' && result.applicable && (
                <div style={{ marginTop: 10, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '8px 12px', fontSize: 10, color: '#b91c1c', display: 'flex', alignItems: 'start', gap: 6 }}>
                  <AlertTriangle size={12} style={{ marginTop: 1, flexShrink: 0 }} />
                  <span><strong>Higher Rate Applied:</strong> Since PAN is not available, TDS is deducted at {(result.sectionData.noPanRate * 100)}% (Section 206AA). Submit PAN to restore normal rate of {(result.sectionData.rate * 100).toFixed(1)}%.</span>
                </div>
              )}

              {/* Section notes */}
              {result.sectionData.notes && result.sectionData.notes.length > 0 && (
                <div style={{ marginTop: 10, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Info size={10} /> Important Notes
                  </div>
                  {result.sectionData.notes.map((n, i) => (
                    <div key={i} style={{ fontSize: 10, color: '#475569', marginTop: 2, paddingLeft: n.startsWith('•') ? 10 : 0 }}>
                      {n.startsWith('•') ? n : `• ${n}`}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ═══ All Sections Reference Tab ═══ */}
      {tab === 'reference' && (
        <div>
          {/* Search & filter */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input value={refSearch} onChange={e => setRefSearch(e.target.value)} placeholder="Search sections..."
                style={{ width: '100%', paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 11, outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
            <button onClick={() => setRefCategory('')}
              style={{ fontSize: 9, fontWeight: 700, padding: '4px 10px', borderRadius: 99, border: 'none', cursor: 'pointer',
                background: !refCategory ? '#1e293b' : '#f1f5f9', color: !refCategory ? 'white' : '#64748b' }}>
              All ({TDS_SECTIONS.length})
            </button>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setRefCategory(refCategory === cat ? '' : cat)}
                style={{ fontSize: 9, fontWeight: 700, padding: '4px 10px', borderRadius: 99, border: '1px solid #e2e8f0', cursor: 'pointer',
                  background: refCategory === cat ? '#e0e7ff' : '#f8fafc', color: refCategory === cat ? '#4338ca' : '#64748b' }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Source badge */}
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '6px 10px', marginBottom: 12, fontSize: 10, color: '#1d4ed8', display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle2 size={11} /> Sources: <strong>ClearTax</strong>, <strong>TaxGuru</strong>, <strong>Income Tax Act</strong>, Union Budget 2025-26 & 2026-27
          </div>

          {/* Sections list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {filteredRef.map(s => {
              const isOpen = expandedRef === s.section;

              return (
                <div key={s.section} style={{ border: '1px solid #e2e8f0', borderRadius: 12, background: 'white', overflow: 'hidden', transition: 'all 0.2s' }}>
                  <button onClick={() => setExpandedRef(isOpen ? null : s.section)}
                    style={{ width: '100%', textAlign: 'left', padding: '10px 14px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'start', gap: 10 }}>
                    <div style={{ minWidth: 52, fontSize: 10, fontWeight: 800, color: '#4338ca', marginTop: 2 }}>{s.section.split(' ')[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>{s.name}</div>
                      <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{s.description}</div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#dbeafe', color: '#1d4ed8' }}>
                          {s.rate > 0 ? `${(s.rate * 100).toFixed(1)}%` : 'Slab'}
                        </span>
                        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#fef3c7', color: '#92400e' }}>
                          {s.threshold > 0 ? `≥₹${s.threshold.toLocaleString('en-IN')}` : 'No threshold'}
                        </span>
                        <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 4, background: '#f1f5f9', color: '#64748b' }}>
                          {s.category}
                        </span>
                      </div>
                    </div>
                    {isOpen ? <ChevronDown size={14} style={{ color: '#94a3b8', marginTop: 2 }} /> : <ChevronRight size={14} style={{ color: '#94a3b8', marginTop: 2 }} />}
                  </button>
                  {isOpen && s.notes && (
                    <div style={{ padding: '0 14px 12px 76px' }}>
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px' }}>
                        {s.notes.map((n, i) => (
                          <div key={i} style={{ fontSize: 10, color: '#475569', marginTop: i > 0 ? 3 : 0, paddingLeft: n.startsWith('•') ? 8 : 0 }}>
                            {n.startsWith('•') ? n : `• ${n}`}
                          </div>
                        ))}
                        <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 6 }}>No PAN rate: {(s.noPanRate * 100)}% · {s.effectiveFrom}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
