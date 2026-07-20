import React from 'react';
import {
    DollarSign, PiggyBank, TrendingUp, BarChart3, FileSpreadsheet,
    Receipt, CreditCard, Landmark, Percent, Calendar, Search,
    Coins, Building2, Briefcase, BookOpen,
    ArrowDownRight,
    Scale, Award,
    FileText, CalendarDays, Home,
    Users,
    Braces, Minimize2, CheckCircle2, ArrowLeftRight, FileDown, FileCode2,
    MousePointer, Layers3, Code2, Copy,
    Binary, Link, Image,
    Database, Table2, Type, Timer,
    Hash, ShieldAlert, Fingerprint, Shuffle, Globe, Palette,
    MapPin, Map, Building, Car,
    Gift, Clock, Heart, CalendarCheck, GraduationCap,
    Calculator, KeyRound, ClipboardCheck, GitCompare,
    Wallet, Flame
} from 'lucide-react';

export interface DashboardTool {
    id: string;
    icon: React.FC<{ size?: number }>;
    title: string;
    desc: string;
    color: string;
}

export const BUSINESS_TAX_TOOLS: DashboardTool[] = [
    { id: 'profit-loss-calculator', icon: TrendingUp, title: 'Profit & Loss Calculator', desc: 'Analyze revenue, expenses & net profit/loss', color: 'bg-green-500' },
    { id: 'roi-calculator', icon: BarChart3, title: 'ROI Calculator', desc: 'Calculate return on investment percentage', color: 'bg-cyan-500' },
    { id: 'break-even-calculator', icon: TrendingUp, title: 'Break-Even Calculator', desc: 'Find the break-even point for your business', color: 'bg-orange-500' },
    { id: 'income-tax-estimator', icon: FileSpreadsheet, title: 'Income Tax Estimator', desc: 'Estimate your annual income tax liability', color: 'bg-indigo-500' },
    { id: 'old-regime-tax', icon: FileSpreadsheet, title: 'Old Regime Tax', desc: 'Calculate tax under the old tax regime', color: 'bg-purple-500' },
    { id: 'new-regime-tax', icon: FileSpreadsheet, title: 'New Regime Tax', desc: 'Calculate tax under the new tax regime', color: 'bg-violet-500' },
    { id: 'tax-compare', icon: BarChart3, title: 'Tax Compare', desc: 'Compare old vs new regime side by side', color: 'bg-rose-500' },
    { id: 'gst-vat-calculator', icon: Receipt, title: 'GST / VAT Calculator', desc: 'Calculate GST or VAT on goods & services', color: 'bg-teal-500' },
    { id: 'tds-calculator', icon: Receipt, title: 'TDS Calculator', desc: 'Calculate Tax Deducted at Source amounts', color: 'bg-amber-500' },
    { id: 'business-valuation', icon: Building2, title: 'Business Valuation', desc: 'Estimate the financial value of a business', color: 'bg-indigo-600' },
];

export const LOANS_EMI_TOOLS: DashboardTool[] = [
    { id: 'loan-calculator', icon: Landmark, title: 'Loan Calculator', desc: 'Calculate EMI, interest & view payment breakdown', color: 'bg-blue-600' },
    { id: 'emi-calculator', icon: CreditCard, title: 'EMI Calculator', desc: 'Calculate monthly loan EMI, interest & total payment', color: 'bg-emerald-600' },
    { id: 'loan-compare', icon: GitCompare, title: 'Loan Compare Calculator', desc: 'Compare two loan offers side-by-side', color: 'bg-indigo-600' },
    { id: 'dti-calculator', icon: Percent, title: 'DTI Calculator', desc: 'Calculate your Debt-to-Income Ratio', color: 'bg-orange-500' },
    { id: 'ltv-calculator', icon: Landmark, title: 'LTV Calculator', desc: 'Calculate Loan-to-Value ratio for property', color: 'bg-purple-500' },
    { id: 'standard-calculator', icon: Calculator, title: 'Standard Calculator', desc: 'Standard mathematical calculations & history', color: 'bg-blue-500' },
];

export const INVESTMENTS_TOOLS: DashboardTool[] = [
    { id: 'fd-calculator', icon: PiggyBank, title: 'FD Calculator', desc: 'Calculate Fixed Deposit maturity & returns', color: 'bg-emerald-500' },
    { id: 'rd-calculator', icon: PiggyBank, title: 'RD Calculator', desc: 'Calculate Recurring Deposit maturity amount', color: 'bg-blue-500' },
    { id: 'sip-calculator', icon: TrendingUp, title: 'SIP Calculator', desc: 'Estimate returns on systematic investment plans', color: 'bg-violet-500' },
];

export const UTILITIES_TOOLS: DashboardTool[] = [
    { id: 'unit-converter', icon: Calculator, title: 'Universal Unit Converter', desc: 'Convert length, area, weight, temp & more instantly', color: 'bg-emerald-600' },
    { id: 'currency-calculator', icon: DollarSign, title: 'Currency Calculator', desc: 'Convert between currencies with live rates', color: 'bg-blue-500' },
    { id: 'percentage-calculator', icon: Percent, title: 'Percentage Calculator', desc: 'Calculate what percentage one number is of another', color: 'bg-indigo-500' },
    { id: 'value-of-percentage', icon: Percent, title: 'Value of Percentage', desc: 'Find the value of a given percentage of a number', color: 'bg-teal-500' },
    { id: 'dob-calculator', icon: Calendar, title: 'DOB Calculator', desc: 'Calculate your exact age in years, months & days', color: 'bg-rose-500' },
    { id: 'find-day-calculator', icon: Search, title: 'Find Day Calculator', desc: 'Find the day of the week for any date', color: 'bg-amber-500' },
    { id: 'startup-name-checker', icon: Search, title: 'Startup Name Checker', desc: 'Check trademark, domain, social & language availability', color: 'bg-indigo-600' },
    { id: 'festival-gift-planner', icon: Gift, title: 'Festival Gift Planner', desc: 'Budget allocation & gift tracking for families', color: 'bg-rose-500' },
    { id: 'rent-vs-buy-calculator', icon: Home, title: 'Rent vs Buy Calculator', desc: 'Compare cost of renting vs buying over 30 years', color: 'bg-blue-600' },
    { id: 'marriage-budget-planner', icon: Heart, title: 'Marriage Budget Planner', desc: 'Categorize & track typical 18-expense Indian wedding', color: 'bg-pink-500' },
    { id: 'subscription-optimizer', icon: Wallet, title: 'Subscription Optimizer', desc: 'Prune unused plans & switch monthly plans to annual', color: 'bg-indigo-600' },
    { id: 'decision-matrix', icon: Scale, title: 'Weighted Decision Matrix', desc: 'Structure choices by rating & weighting key factors', color: 'bg-teal-600' },
    { id: 'time-boxer', icon: Clock, title: 'Time-Boxer Planner', desc: 'Brain dump, select priorities & schedule day hour-by-hour', color: 'bg-violet-600' },
    { id: 'fire-calculator', icon: Flame, title: 'FIRE Calculator', desc: 'Determine early retirement age & safe withdrawal target', color: 'bg-rose-600' },
];

export const DEV_TOOLKIT_TOOLS: DashboardTool[] = [
    { id: 'dev-json-formatter', icon: Braces, title: 'JSON Formatter', desc: 'Beautify & format JSON with syntax highlighting', color: 'bg-amber-500' },
    { id: 'dev-json-minifier', icon: Minimize2, title: 'JSON Minifier', desc: 'Compress JSON by removing whitespace', color: 'bg-blue-500' },
    { id: 'dev-json-validator', icon: CheckCircle2, title: 'JSON Validator', desc: 'Validate JSON with error location & fix suggestions', color: 'bg-emerald-500' },
    { id: 'dev-json-comparator', icon: ArrowLeftRight, title: 'JSON Comparator', desc: 'Deep-diff two JSON objects with path tracking', color: 'bg-violet-500' },
    { id: 'dev-json-to-csv', icon: FileDown, title: 'JSON to CSV', desc: 'Convert JSON arrays to CSV with nested flattening', color: 'bg-teal-500' },
    { id: 'dev-json-to-xml', icon: FileCode2, title: 'JSON to XML', desc: 'Convert JSON to well-formed XML', color: 'bg-orange-500' },
    { id: 'dev-json-path', icon: MousePointer, title: 'JSON Path Finder', desc: 'Click any value to get its dot/bracket/JSONPath', color: 'bg-pink-500' },
    { id: 'dev-json-flattener', icon: Layers3, title: 'JSON Flattener', desc: 'Flatten nested JSON to single-level key-value', color: 'bg-indigo-500' },
    { id: 'dev-text-diff', icon: FileText, title: 'Text Diff Checker', desc: 'Compare two texts line by line with highlighting', color: 'bg-rose-500' },
    { id: 'dev-code-diff', icon: Code2, title: 'Code Diff', desc: 'Side-by-side code comparison with syntax highlight', color: 'bg-slate-600' },
    { id: 'dev-file-compare', icon: FileSpreadsheet, title: 'File Comparator', desc: 'Upload two files & compare their content', color: 'bg-cyan-500' },
    { id: 'dev-duplicate-finder', icon: Copy, title: 'Duplicate Line Finder', desc: 'Find & remove duplicate lines from text', color: 'bg-amber-600' },
    { id: 'dev-word-frequency', icon: BarChart3, title: 'Word Frequency Counter', desc: 'Analyze text — count words, find top terms', color: 'bg-purple-500' },
    { id: 'dev-base64', icon: Binary, title: 'Base64 Encode/Decode', desc: 'Encode text/files to Base64 and back', color: 'bg-blue-600' },
    { id: 'dev-jwt-decoder', icon: KeyRound, title: 'JWT Decoder', desc: 'Decode JWT tokens — header, payload, expiry', color: 'bg-orange-600' },
    { id: 'dev-url-encoder', icon: Link, title: 'URL Encoder/Decoder', desc: 'Encode/decode URLs & parse query strings', color: 'bg-green-600' },
    { id: 'dev-image-base64', icon: Image, title: 'Image to Base64', desc: 'Convert images to Base64 data URIs', color: 'bg-pink-600' },
    { id: 'dev-sql-formatter', icon: Database, title: 'SQL Formatter', desc: 'Beautify SQL with keyword capitalization', color: 'bg-sky-600' },
    { id: 'dev-csv-to-json', icon: Table2, title: 'CSV to JSON', desc: 'Convert CSV to JSON with type detection', color: 'bg-emerald-600' },
    { id: 'dev-string-case', icon: Type, title: 'String Case Converter', desc: 'Convert between camelCase, snake_case & more', color: 'bg-violet-600' },
    { id: 'dev-unix-timestamp', icon: Timer, title: 'Unix Timestamp', desc: 'Convert Unix timestamps to dates & back', color: 'bg-amber-700' },
    { id: 'dev-hash-generator', icon: Hash, title: 'Hash Generator', desc: 'Generate MD5, SHA1, SHA256, SHA512 hashes', color: 'bg-red-600' },
    { id: 'dev-password-checker', icon: ShieldAlert, title: 'Password Checker', desc: 'Check password strength & get suggestions', color: 'bg-rose-600' },
    { id: 'dev-uuid-generator', icon: Fingerprint, title: 'UUID Generator', desc: 'Generate v4 UUIDs in bulk', color: 'bg-indigo-600' },
    { id: 'dev-token-generator', icon: Shuffle, title: 'Token Generator', desc: 'Generate random tokens & API keys', color: 'bg-teal-600' },
    { id: 'dev-ssl-checker', icon: Globe, title: 'SSL Certificate Checker', desc: 'Check SSL cert details for any domain', color: 'bg-green-700' },
    { id: 'dev-color-converter', icon: Palette, title: 'Color Converter', desc: 'Convert between HEX, RGB, HSL color codes', color: 'bg-fuchsia-500' },
];

export const RAW_DATA_TOOLS: DashboardTool[] = [
    { id: 'indian-states-cities', icon: Database, title: 'Indian States', desc: 'Downloadable raw data with 36 States/UTs', color: 'bg-indigo-600' },
    { id: 'indian-cities', icon: Building2, title: 'Indian Cities', desc: 'Downloadable raw data with 130+ Major Cities', color: 'bg-fuchsia-600' },
    { id: 'indian-colleges', icon: GraduationCap, title: 'Indian Colleges', desc: 'Database of 1000+ Colleges and Universities', color: 'bg-blue-600' },
    { id: 'indian-pin-codes', icon: MapPin, title: 'PIN Codes', desc: '150+ PIN codes across major Indian cities', color: 'bg-orange-600' },
    { id: 'indian-districts', icon: Map, title: 'Indian Districts', desc: '80+ districts with population, area, literacy', color: 'bg-emerald-600' },
    { id: 'indian-parliament', icon: Landmark, title: 'Parliament', desc: '110 Lok Sabha & Rajya Sabha constituencies', color: 'bg-red-600' },
    { id: 'indian-holidays', icon: Calendar, title: 'Govt Holidays', desc: '45 national, restricted & state holidays', color: 'bg-amber-600' },
    { id: 'indian-banks', icon: Building, title: 'Banks & IFSC', desc: '50 banks with IFSC prefix & branch details', color: 'bg-blue-700' },
    { id: 'gst-state-codes', icon: Receipt, title: 'GST Codes', desc: '39 GST state codes for GSTIN filing', color: 'bg-purple-600' },
    { id: 'india-tax-slabs', icon: Scale, title: 'Tax Slabs', desc: 'Old vs New regime slabs across 5 years', color: 'bg-orange-700' },
    { id: 'indian-stock-market', icon: TrendingUp, title: 'Stock Market', desc: 'Nifty 50 & Sensex with sector & weight', color: 'bg-emerald-700' },
    { id: 'indian-cars', icon: Car, title: 'Indian Cars Prices', desc: '500+ variants, 28 brands — ex-showroom & on-road for 8 metros', color: 'bg-indigo-700' },
    { id: 'tds-rate-chart', icon: Receipt, title: 'TDS Rate Chart', desc: '35 sections — FY 2025-26 thresholds, rates & no-PAN penalties', color: 'bg-red-600' },
    { id: 'professional-tax', icon: Landmark, title: 'Professional Tax', desc: 'State-wise monthly slabs for 15+ states', color: 'bg-purple-700' },
    { id: 'minimum-wages', icon: Briefcase, title: 'Minimum Wages', desc: 'State-wise unskilled/semi/skilled rates across 14 states', color: 'bg-orange-700' },
    { id: 'depreciation-rates', icon: ArrowDownRight, title: 'Depreciation Rates', desc: 'IT Act Schedule II — 25 asset categories, WDV & SLM', color: 'bg-emerald-600' },
    { id: 'rbi-rates-history', icon: TrendingUp, title: 'RBI Rates History', desc: '21 policy rate changes (2016-2026) — Repo, CRR, SLR, MSF', color: 'bg-blue-700' },
    { id: 'gst-rate-finder', icon: Receipt, title: 'GST Rate Finder', desc: '60 HSN/SAC codes — 0% to 40% rates, IGST/CGST/SGST split', color: 'bg-orange-600' },
    { id: 'section-80-deductions', icon: BookOpen, title: 'Section 80 Deductions', desc: '80C to 80U — 26 deductions with limits & New Regime eligibility', color: 'bg-violet-600' },
    { id: 'cost-inflation-index', icon: TrendingUp, title: 'Cost Inflation Index', desc: 'CII 2001-02 (100) to 2025-26 (376) — for LTCG indexation', color: 'bg-cyan-600' },
    { id: 'itr-forms-guide', icon: FileText, title: 'ITR Forms Guide', desc: 'ITR-1 to ITR-7 + ITR-U — applicability, due dates, audit rules', color: 'bg-rose-600' },
    { id: 'compliance-due-dates', icon: CalendarDays, title: 'Compliance Calendar', desc: '40 due dates — GST, TDS, IT, ROC, PF/ESI with penalties', color: 'bg-blue-600' },
    { id: 'interest-penalty-rates', icon: AlertTriangle, title: 'Interest & Penalties', desc: '234A/B/C, 270A (IT), Sec 50/73/74 (GST), Companies Act rates', color: 'bg-red-700' },
    { id: 'audit-threshold-limits', icon: ClipboardCheck, title: 'Audit Limits', desc: 'Tax, GST, Company, Cost, Secretarial, TP, LLP audit thresholds', color: 'bg-teal-600' },
    { id: 'epf-interest-rates', icon: Landmark, title: 'EPF Interest Rates', desc: '25-year EPF rate history (2001-2026) with wage ceiling & contribution split', color: 'bg-blue-600' },
    { id: 'hr-leave-rules', icon: CalendarDays, title: 'Leave Entitlement Rules', desc: 'EL, CL, SL, Maternity, Paternity, CCL — laws, carry forward & encashment', color: 'bg-emerald-700' },
    { id: 'gratuity-rules', icon: Award, title: 'Gratuity Rules & Limits', desc: 'Eligibility, formula, ₹25L tax exemption, forfeiture & penalty rules', color: 'bg-amber-700' },
    { id: 'bank-fd-rates', icon: Building, title: 'Bank FD Rates', desc: '20 banks — PSU, Private, SFB, NBFC rates by tenure with Sr. Citizen extra', color: 'bg-indigo-700' },
    { id: 'statutory-due-dates', icon: Clock, title: 'Statutory Due Dates', desc: '30 HR & Finance obligations — PF, ESI, TDS, GST, IT, ROC deadlines & penalties', color: 'bg-red-700' },
];
