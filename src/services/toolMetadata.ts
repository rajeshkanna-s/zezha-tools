export interface ToolMetadata {
  id: string;
  title: string;
  shortTitle: string;
  sectionId: string;
  sectionLabel: string;
  url: string;
  description: string;
  keywords: string[];
  category: string;
  features?: string[];
}

export const TOOL_METADATA_MAP: Record<string, ToolMetadata> = {
  // ═══════════════════════════════════════════════════════════════
  // INVESTMENTS
  // ═══════════════════════════════════════════════════════════════
  'precious-metals-calculator': {
    id: 'precious-metals-calculator',
    title: 'Gold & Silver Live Rates, GST Jewellery & Investment Calculator (IBJA)',
    shortTitle: 'Gold & Silver Rates (IBJA)',
    sectionId: 'investments',
    sectionLabel: 'Investments',
    url: '/investments/precious-metals-calculator',
    description: 'Check official live IBJA 24K pure gold, 22K 916 hallmark gold, and silver rates in INR. Calculate 3% GST on jewellery, making charges, 1 pavan (8g sovereign) price & gold SIP returns.',
    keywords: [
      'gold rate today', 'today gold rate in tamil nadu', '22k gold rate today', '24k gold rate',
      'today gold rate in chennai', '1 pavan gold rate today', '8 gram sovereign gold price',
      '916 hallmark gold rate', 'gold gst calculator', 'jewellery gst calculator',
      'jewellery estimation bill', 'jewellery making charge calculator', 'wastage va calculator',
      'live ibja gold rate', 'india bullion and jewellers association', 'silver rate today',
      'silver 1kg price', 'silver 1 gram price', 'gold sip calculator', 'gold return on investment'
    ],
    category: 'FinanceApplication',
    features: ['Live IBJA rates', '24K & 22K per gram & 8g sovereign', 'Jewellery GST & making charge bill estimator', '30-day historical chart & ledger', 'Gold SIP accumulation calculator']
  },
  'fd-calculator': {
    id: 'fd-calculator',
    title: 'Fixed Deposit (FD) Calculator — Maturity Value & Interest Returns',
    shortTitle: 'FD Calculator',
    sectionId: 'investments',
    sectionLabel: 'Investments',
    url: '/investments/fd-calculator',
    description: 'Calculate Fixed Deposit (FD) maturity amount, total interest earned, compound frequency (quarterly, monthly, annual) for SBI, HDFC, ICICI and Indian banks.',
    keywords: [
      'fd calculator', 'fixed deposit calculator', 'fd interest calculator', 'fd maturity calculator',
      'bank fd returns', 'sbi fd calculator', 'hdfc fd calculator', 'compound interest fd',
      'senior citizen fd rates', 'term deposit calculator'
    ],
    category: 'FinanceApplication'
  },
  'rd-calculator': {
    id: 'rd-calculator',
    title: 'Recurring Deposit (RD) Calculator — Monthly Deposit Maturity',
    shortTitle: 'RD Calculator',
    sectionId: 'investments',
    sectionLabel: 'Investments',
    url: '/investments/rd-calculator',
    description: 'Calculate Recurring Deposit (RD) maturity amount and interest earned on your monthly savings across Indian banks and post offices.',
    keywords: [
      'rd calculator', 'recurring deposit calculator', 'rd interest calculator', 'post office rd calculator',
      'monthly rd maturity', 'bank rd returns', 'sbi rd calculator'
    ],
    category: 'FinanceApplication'
  },
  'sip-calculator': {
    id: 'sip-calculator',
    title: 'Mutual Fund SIP Calculator — Systematic Investment Plan Returns',
    shortTitle: 'SIP Calculator',
    sectionId: 'investments',
    sectionLabel: 'Investments',
    url: '/investments/sip-calculator',
    description: 'Calculate expected future wealth and returns on monthly Mutual Fund SIP investments with compounding interest charts and growth projections.',
    keywords: [
      'sip calculator', 'mutual fund sip calculator', 'systematic investment plan', 'sip returns calculator',
      'sip wealth generator', 'equity sip calculator', 'lumpsum vs sip', 'monthly investment calculator'
    ],
    category: 'FinanceApplication'
  },

  // ═══════════════════════════════════════════════════════════════
  // LOANS & EMI
  // ═══════════════════════════════════════════════════════════════
  'emi-calculator': {
    id: 'emi-calculator',
    title: 'EMI Calculator — Home Loan, Car Loan & Personal Loan Monthly Installment',
    shortTitle: 'EMI Calculator',
    sectionId: 'loans-emi',
    sectionLabel: 'Loans & EMI',
    url: '/loans-emi/emi-calculator',
    description: 'Free online EMI calculator to compute monthly loan installments, total interest payable, and complete year-by-year amortization schedule for home, car, and personal loans.',
    keywords: [
      'emi calculator', 'home loan emi calculator', 'car loan emi calculator', 'personal loan emi',
      'loan installment calculator', 'sbi home loan emi', 'hdfc loan emi', 'amortization schedule',
      'loan interest breakdown', 'monthly loan payment'
    ],
    category: 'FinanceApplication'
  },
  'loan-calculator': {
    id: 'loan-calculator',
    title: 'Comprehensive Loan Calculator — Principal, Total Interest & Repayment',
    shortTitle: 'Loan Calculator',
    sectionId: 'loans-emi',
    sectionLabel: 'Loans & EMI',
    url: '/loans-emi/loan-calculator',
    description: 'Calculate loan repayment schedules, interest rate impact, total loan cost, and prepayment benefits with full interactive amortization tables.',
    keywords: [
      'loan calculator', 'loan repayment calculator', 'bank loan calculator', 'prepayment calculator',
      'loan tenure calculator', 'interest payout'
    ],
    category: 'FinanceApplication'
  },
  'loan-compare': {
    id: 'loan-compare',
    title: 'Loan Compare Calculator — Compare Two Loan Offers Side-by-Side',
    shortTitle: 'Loan Compare',
    sectionId: 'loans-emi',
    sectionLabel: 'Loans & EMI',
    url: '/loans-emi/loan-compare',
    description: 'Compare two loan options by interest rates, tenure, processing fees, and total interest to find the most cost-effective borrowing deal.',
    keywords: [
      'loan compare calculator', 'compare loans', 'compare home loans', 'loan interest comparison',
      'bank loan comparison', 'cheaper loan finder'
    ],
    category: 'FinanceApplication'
  },
  'dti-calculator': {
    id: 'dti-calculator',
    title: 'Debt-to-Income (DTI) Calculator — Loan Eligibility & Financial Health',
    shortTitle: 'DTI Calculator',
    sectionId: 'loans-emi',
    sectionLabel: 'Loans & EMI',
    url: '/loans-emi/dti-calculator',
    description: 'Calculate your Debt-to-Income (DTI) ratio to check home loan approval odds, financial debt burden, and lender eligibility thresholds.',
    keywords: [
      'dti calculator', 'debt to income ratio', 'loan eligibility calculator', 'mortgage dti ratio',
      'debt ratio check', 'credit health'
    ],
    category: 'FinanceApplication'
  },
  'ltv-calculator': {
    id: 'ltv-calculator',
    title: 'Loan-to-Value (LTV) Ratio Calculator for Real Estate & Property Loans',
    shortTitle: 'LTV Calculator',
    sectionId: 'loans-emi',
    sectionLabel: 'Loans & EMI',
    url: '/loans-emi/ltv-calculator',
    description: 'Calculate Loan-to-Value (LTV) ratio for property purchases, mortgage refinancing, down payments, and RBI loan sanction limits.',
    keywords: [
      'ltv calculator', 'loan to value ratio', 'property loan ratio', 'down payment calculator',
      'home loan ltv ratio', 'mortgage loan to value'
    ],
    category: 'FinanceApplication'
  },
  'standard-calculator': {
    id: 'standard-calculator',
    title: 'Standard Online Calculator with Calculation History',
    shortTitle: 'Standard Calculator',
    sectionId: 'loans-emi',
    sectionLabel: 'Loans & EMI',
    url: '/loans-emi/standard-calculator',
    description: 'Simple, fast, and free online calculator for quick arithmetic operations, percentage calculations, memory recall, and full calculation history log.',
    keywords: [
      'calculator', 'online calculator', 'standard calculator', 'basic calculator',
      'math calculator', 'browser calculator'
    ],
    category: 'UtilityApplication'
  },

  // ═══════════════════════════════════════════════════════════════
  // BUSINESS & TAX
  // ═══════════════════════════════════════════════════════════════
  'income-tax-estimator': {
    id: 'income-tax-estimator',
    title: 'Income Tax Estimator FY 2026-27 (AY 2027-28) — Salary Tax Calculator',
    shortTitle: 'Income Tax Estimator',
    sectionId: 'business-tax',
    sectionLabel: 'Business & Tax',
    url: '/business-tax/income-tax-estimator',
    description: 'Estimate your annual income tax liability under latest Indian tax slabs, standard deduction, 80C, 80D, HRA, cess, and rebate under section 87A.',
    keywords: [
      'income tax estimator', 'income tax calculator', 'salary tax calculator', 'tax calculator india',
      'fy 2026-27 tax slabs', 'ay 2027-28 tax', 'section 87a rebate', 'standard deduction 75000'
    ],
    category: 'FinanceApplication'
  },
  'old-regime-tax': {
    id: 'old-regime-tax',
    title: 'Old Tax Regime Calculator — 80C, 80D, HRA & Home Loan Deductions',
    shortTitle: 'Old Regime Tax',
    sectionId: 'business-tax',
    sectionLabel: 'Business & Tax',
    url: '/business-tax/old-regime-tax',
    description: 'Calculate personal income tax under India Old Tax Regime with all Chapter VI-A deductions including 80C, 80D, HRA exemption, and Section 24 home loan interest.',
    keywords: [
      'old tax regime calculator', 'old regime vs new regime', 'section 80c deduction', 'hra exemption calculator',
      'section 24 deduction', 'old slab rates'
    ],
    category: 'FinanceApplication'
  },
  'new-regime-tax': {
    id: 'new-regime-tax',
    title: 'New Tax Regime Calculator — Revised Slabs, Rebates & Standard Deduction',
    shortTitle: 'New Regime Tax',
    sectionId: 'business-tax',
    sectionLabel: 'Business & Tax',
    url: '/business-tax/new-regime-tax',
    description: 'Calculate income tax liability under the Default New Tax Regime with revised budget slabs, ₹75,000 standard deduction, and zero tax up to ₹7.75 Lakhs.',
    keywords: [
      'new tax regime calculator', 'new regime tax slabs', 'new tax slab budget', 'standard deduction new regime',
      'section 87a new regime', 'tax free income limit'
    ],
    category: 'FinanceApplication'
  },
  'tax-compare': {
    id: 'tax-compare',
    title: 'Old vs New Tax Regime Comparison Calculator — Find Maximum Savings',
    shortTitle: 'Tax Compare',
    sectionId: 'business-tax',
    sectionLabel: 'Business & Tax',
    url: '/business-tax/tax-compare',
    description: 'Side-by-side comparison of Old vs New Tax Regime for salaried employees and professionals. Instantly see which regime saves you more money.',
    keywords: [
      'tax compare calculator', 'old vs new tax regime', 'which tax regime is better', 'tax regime comparison',
      'tax saving calculator', 'best tax regime for me'
    ],
    category: 'FinanceApplication'
  },
  'gst-vat-calculator': {
    id: 'gst-vat-calculator',
    title: 'GST & VAT Calculator — Inclusive & Exclusive GST Calculation',
    shortTitle: 'GST / VAT Calculator',
    sectionId: 'business-tax',
    sectionLabel: 'Business & Tax',
    url: '/business-tax/gst-vat-calculator',
    description: 'Calculate GST amounts easily with 5%, 12%, 18%, and 28% GST rate slabs. Split CGST, SGST, IGST, and compute pre-tax or post-tax invoice totals.',
    keywords: [
      'gst calculator', 'vat calculator', 'gst inclusive exclusive', 'cgst sgst igst calculator',
      '18 percent gst calculator', 'reverse gst calculation', 'tax invoice calculator'
    ],
    category: 'FinanceApplication'
  },
  'tds-calculator': {
    id: 'tds-calculator',
    title: 'TDS Calculator — Tax Deducted at Source for Salary, Rent, Contractor & Professional Fees',
    shortTitle: 'TDS Calculator',
    sectionId: 'business-tax',
    sectionLabel: 'Business & Tax',
    url: '/business-tax/tds-calculator',
    description: 'Calculate Tax Deducted at Source (TDS) under sections 194C, 194J, 194I, 194H, 192, and 194Q with applicable threshold limits and PAN deduction rates.',
    keywords: [
      'tds calculator', 'tax deducted at source', 'section 194j professional fees', 'section 194c contractor',
      'section 194i rent', 'tds rate chart', 'tds deduction formula'
    ],
    category: 'FinanceApplication'
  },
  'profit-loss-calculator': {
    id: 'profit-loss-calculator',
    title: 'Profit & Loss Calculator — Net Profit Margin & Operating Income',
    shortTitle: 'Profit & Loss',
    sectionId: 'business-tax',
    sectionLabel: 'Business & Tax',
    url: '/business-tax/profit-loss-calculator',
    description: 'Calculate gross profit, net profit margin, operating expenses, and business profitability percentage with visual financial breakdowns.',
    keywords: [
      'profit and loss calculator', 'net profit margin', 'gross profit calculator', 'p&l calculator',
      'business margin calculator', 'operating profit formula'
    ],
    category: 'FinanceApplication'
  },
  'roi-calculator': {
    id: 'roi-calculator',
    title: 'ROI Calculator — Return on Investment Percentage & Annualized Gain',
    shortTitle: 'ROI Calculator',
    sectionId: 'business-tax',
    sectionLabel: 'Business & Tax',
    url: '/business-tax/roi-calculator',
    description: 'Calculate Return on Investment (ROI) percentage, annualized ROI, total profit/gain on stocks, real estate, campaigns, or business ventures.',
    keywords: [
      'roi calculator', 'return on investment calculator', 'calculate roi', 'annualized roi calculator',
      'investment return formula', 'profit percentage calculator'
    ],
    category: 'FinanceApplication'
  },
  'break-even-calculator': {
    id: 'break-even-calculator',
    title: 'Break-Even Point Calculator — Units, Revenue & Margin of Safety',
    shortTitle: 'Break-Even',
    sectionId: 'business-tax',
    sectionLabel: 'Business & Tax',
    url: '/business-tax/break-even-calculator',
    description: 'Find the exact break-even point in units and sales volume based on fixed costs, variable costs per unit, and selling price.',
    keywords: [
      'break even calculator', 'bep calculator', 'break even point formula', 'contribution margin calculator',
      'fixed cost variable cost', 'margin of safety'
    ],
    category: 'FinanceApplication'
  },
  'business-valuation': {
    id: 'business-valuation',
    title: 'Business Valuation Calculator — Multiple of Earnings & DCF Valuation',
    shortTitle: 'Business Valuation',
    sectionId: 'business-tax',
    sectionLabel: 'Business & Tax',
    url: '/business-tax/business-valuation',
    description: 'Estimate company valuation using revenue multiples, SDE (Seller’s Discretionary Earnings), EBITDA, and discounted cash flow approaches.',
    keywords: [
      'business valuation calculator', 'company valuation', 'ebitda multiple calculator',
      'startup valuation', 'small business valuation', 'worth of my business'
    ],
    category: 'FinanceApplication'
  },

  // ═══════════════════════════════════════════════════════════════
  // CONVERTORS (PDF & MEDIA)
  // ═══════════════════════════════════════════════════════════════
  'image-to-pdf': {
    id: 'image-to-pdf',
    title: 'Image to PDF Converter — Convert JPG, PNG & WebP to PDF Online Free',
    shortTitle: 'Image to PDF',
    sectionId: 'convertors',
    sectionLabel: 'Convertors',
    url: '/convertors/image-to-pdf',
    description: 'Convert JPG, PNG, WebP images to high-quality PDF documents online. 100% private, browser-based processing with custom page sizes and margins.',
    keywords: [
      'image to pdf', 'jpg to pdf', 'png to pdf', 'convert photo to pdf', 'picture to pdf converter',
      'multiple images to one pdf', 'free online jpg to pdf', 'browser pdf generator'
    ],
    category: 'UtilityApplication'
  },
  'compress-pdf': {
    id: 'compress-pdf',
    title: 'Compress PDF Online — Reduce PDF File Size Without Losing Quality',
    shortTitle: 'Compress PDF',
    sectionId: 'convertors',
    sectionLabel: 'Convertors',
    url: '/convertors/compress-pdf',
    description: 'Compress large PDF files online for free. Reduce file size to under 100KB, 200KB, or 1MB for email attachments and government job portal uploads.',
    keywords: [
      'compress pdf', 'reduce pdf size', 'shrink pdf', 'pdf size reducer', 'compress pdf to 100kb',
      'compress pdf to 200kb', 'pdf compressor online free', 'reduce mb to kb pdf'
    ],
    category: 'UtilityApplication'
  },
  'compress-image': {
    id: 'compress-image',
    title: 'Image Compressor — Compress JPG, PNG, WebP to Exact Target KB',
    shortTitle: 'Compress Image',
    sectionId: 'convertors',
    sectionLabel: 'Convertors',
    url: '/convertors/compress-image',
    description: 'Compress JPG, PNG, and WebP images to smaller file sizes with custom quality slider and target KB limits for faster web loading and application uploads.',
    keywords: [
      'compress image', 'reduce image size', 'jpg compressor', 'png compressor', 'compress photo to 50kb',
      'image size reducer online', 'webp compressor', 'optimize image'
    ],
    category: 'UtilityApplication'
  },
  'merge-pdf': {
    id: 'merge-pdf',
    title: 'Merge PDF Online — Combine Multiple PDF Files Into One Free',
    shortTitle: 'Merge PDF',
    sectionId: 'convertors',
    sectionLabel: 'Convertors',
    url: '/convertors/merge-pdf',
    description: 'Combine multiple PDF documents into a single organized PDF file. Drag-and-drop to reorder pages and merge files securely in your browser.',
    keywords: [
      'merge pdf', 'combine pdf', 'join pdf files', 'merge multiple pdf into one', 'pdf joiner online',
      'free pdf merger', 'bundle pdfs'
    ],
    category: 'UtilityApplication'
  },
  'pdf-to-image': {
    id: 'pdf-to-image',
    title: 'PDF to Image Converter — Convert PDF Pages to High-Res JPG or PNG',
    shortTitle: 'PDF to Image',
    sectionId: 'convertors',
    sectionLabel: 'Convertors',
    url: '/convertors/pdf-to-image',
    description: 'Extract every page of a PDF file as crisp high-resolution PNG or JPG images. No file upload required — 100% processed locally in your browser.',
    keywords: [
      'pdf to image', 'pdf to jpg', 'pdf to png', 'extract images from pdf', 'save pdf as pictures',
      'convert pdf page to jpg'
    ],
    category: 'UtilityApplication'
  },
  'word-to-pdf': {
    id: 'word-to-pdf',
    title: 'Word to PDF Converter — Convert DOCX Documents to PDF',
    shortTitle: 'Word to PDF',
    sectionId: 'convertors',
    sectionLabel: 'Convertors',
    url: '/convertors/word-to-pdf',
    description: 'Convert Microsoft Word DOCX files directly to clean, formatted PDF documents with preserved fonts, tables, and page layouts.',
    keywords: [
      'word to pdf', 'docx to pdf', 'convert doc to pdf', 'word document to pdf converter',
      'ms word to pdf online'
    ],
    category: 'UtilityApplication'
  },
  'image-to-text': {
    id: 'image-to-text',
    title: 'Image to Text OCR Converter — Extract Text from Images & Scanned Docs',
    shortTitle: 'Image to Text',
    sectionId: 'convertors',
    sectionLabel: 'Convertors',
    url: '/convertors/image-to-text',
    description: 'Extract editable text from images, screenshots, scanned receipts, and book pages using client-side OCR technology.',
    keywords: [
      'image to text', 'ocr online', 'extract text from image', 'picture to text', 'photo text extractor',
      'screenshot to text', 'scanned document to word'
    ],
    category: 'UtilityApplication'
  },
  'split-pdf': {
    id: 'split-pdf',
    title: 'Split PDF Online — Extract Selected Pages or Split by Page Range',
    shortTitle: 'Split PDF',
    sectionId: 'convertors',
    sectionLabel: 'Convertors',
    url: '/convertors/split-pdf',
    description: 'Separate one PDF file into multiple individual pages or extract custom page ranges (e.g. pages 1-5, 8, 11-14) instantly.',
    keywords: [
      'split pdf', 'separate pdf pages', 'extract pages from pdf', 'divide pdf', 'pdf page splitter online'
    ],
    category: 'UtilityApplication'
  },
  'organize-pdf': {
    id: 'organize-pdf',
    title: 'Organize PDF Pages — Reorder, Rotate & Delete Pages in PDF',
    shortTitle: 'Organize PDF',
    sectionId: 'convertors',
    sectionLabel: 'Convertors',
    url: '/convertors/organize-pdf',
    description: 'Rearrange PDF page sequence, rotate upside-down pages 90 or 180 degrees, and organize document structure visually.',
    keywords: [
      'organize pdf', 'reorder pdf pages', 'rotate pdf pages', 'rearrange pdf pages', 'sort pdf pages'
    ],
    category: 'UtilityApplication'
  },
  'html-to-pdf': {
    id: 'html-to-pdf',
    title: 'HTML to PDF Converter — Convert Web Code & HTML to Printable PDF',
    shortTitle: 'HTML to PDF',
    sectionId: 'convertors',
    sectionLabel: 'Convertors',
    url: '/convertors/html-to-pdf',
    description: 'Convert raw HTML code, CSS stylesheets, or web snippet templates into beautifully rendered PDF documents.',
    keywords: [
      'html to pdf', 'convert html to pdf', 'webpage to pdf', 'code to pdf', 'render html as pdf'
    ],
    category: 'UtilityApplication'
  },
  'crop-pdf': {
    id: 'crop-pdf',
    title: 'Crop PDF Online — Trim Margins & Crop PDF Page Dimensions',
    shortTitle: 'Crop PDF',
    sectionId: 'convertors',
    sectionLabel: 'Convertors',
    url: '/convertors/crop-pdf',
    description: 'Crop PDF margins, cut white borders, and adjust document dimensions visually for printing or reading on ereaders.',
    keywords: [
      'crop pdf', 'trim pdf margins', 'crop pdf pages online', 'cut pdf borders', 'resize pdf document'
    ],
    category: 'UtilityApplication'
  },
  'delete-pdf-pages': {
    id: 'delete-pdf-pages',
    title: 'Delete PDF Pages Online — Remove Unwanted Pages from PDF',
    shortTitle: 'Delete PDF Pages',
    sectionId: 'convertors',
    sectionLabel: 'Convertors',
    url: '/convertors/delete-pdf-pages',
    description: 'Delete specific unwanted pages from any PDF document in one click. Clean up confidential, blank, or duplicate pages safely.',
    keywords: [
      'delete pdf pages', 'remove pages from pdf', 'erase pdf page', 'delete page in pdf online'
    ],
    category: 'UtilityApplication'
  },
  'edit-pdf': {
    id: 'edit-pdf',
    title: 'Edit PDF Online — Add Text, Signatures & Annotations to PDF',
    shortTitle: 'Edit PDF',
    sectionId: 'convertors',
    sectionLabel: 'Convertors',
    url: '/convertors/edit-pdf',
    description: 'Free online PDF editor to add text notes, sign agreements, highlight sections, and insert shapes directly in your browser without Adobe Acrobat.',
    keywords: [
      'edit pdf', 'online pdf editor', 'sign pdf', 'annotate pdf', 'add text to pdf', 'free pdf editor'
    ],
    category: 'UtilityApplication'
  },

  // ═══════════════════════════════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════════════════════════════
  'unit-converter': {
    id: 'unit-converter',
    title: 'Universal Unit Converter — Length, Weight, Area, Temp, Speed & Volume',
    shortTitle: 'Universal Unit Converter',
    sectionId: 'utilities',
    sectionLabel: 'Utilities',
    url: '/utilities/unit-converter',
    description: 'Convert between metric and imperial units across length, weight, area (sq ft, acre, cent, ground), temperature, speed, data storage, and volume.',
    keywords: [
      'unit converter', 'metric to imperial', 'length converter', 'weight converter', 'sq ft to acres',
      'celsius to fahrenheit', 'kg to lbs', 'cent to sq ft tamil nadu'
    ],
    category: 'UtilityApplication'
  },
  'currency-calculator': {
    id: 'currency-calculator',
    title: 'Live Currency Converter — Real-Time Exchange Rates for 150+ Currencies',
    shortTitle: 'Currency Calculator',
    sectionId: 'utilities',
    sectionLabel: 'Utilities',
    url: '/utilities/currency-calculator',
    description: 'Convert USD, EUR, INR, GBP, AED, SGD, and over 150 global currencies with live forex exchange rates and conversion tables.',
    keywords: [
      'currency converter', 'currency calculator', 'usd to inr', 'aed to inr', 'eur to inr',
      'live exchange rates', 'forex converter'
    ],
    category: 'FinanceApplication'
  },
  'percentage-calculator': {
    id: 'percentage-calculator',
    title: 'Percentage Calculator — Find Percent, Increase & Decrease',
    shortTitle: 'Percentage Calculator',
    sectionId: 'utilities',
    sectionLabel: 'Utilities',
    url: '/utilities/percentage-calculator',
    description: 'Calculate what percentage X is of Y, percentage increase, percentage decrease, discounts, and markup amounts instantly.',
    keywords: [
      'percentage calculator', 'calculate percentage', 'percent increase calculator', 'percent decrease',
      'discount calculator', 'percentage formula'
    ],
    category: 'UtilityApplication'
  },
  'value-of-percentage': {
    id: 'value-of-percentage',
    title: 'Value of Percentage Calculator — Calculate X% of Any Amount',
    shortTitle: 'Value of %',
    sectionId: 'utilities',
    sectionLabel: 'Utilities',
    url: '/utilities/value-of-percentage',
    description: 'Find the exact value of any percentage of a number (e.g. what is 18% of 54,000) for GST, commission, gratuity, and discounts.',
    keywords: [
      'value of percentage', 'percent of number', 'calculate percentage value', 'percent of amount',
      'commission percentage'
    ],
    category: 'UtilityApplication'
  },
  'dob-calculator': {
    id: 'dob-calculator',
    title: 'DOB & Age Calculator — Calculate Exact Age in Years, Months & Days',
    shortTitle: 'DOB Calculator',
    sectionId: 'utilities',
    sectionLabel: 'Utilities',
    url: '/utilities/dob-calculator',
    description: 'Calculate your exact age from Date of Birth (DOB) in years, months, weeks, days, hours, and minutes with upcoming birthday countdown.',
    keywords: [
      'dob calculator', 'age calculator', 'calculate age from date of birth', 'birth date calculator',
      'how old am i', 'exact age finder', 'next birthday countdown'
    ],
    category: 'UtilityApplication'
  },
  'find-day-calculator': {
    id: 'find-day-calculator',
    title: 'Find Day of Week Calculator — Day for Any Date Past or Future',
    shortTitle: 'Find Day',
    sectionId: 'utilities',
    sectionLabel: 'Utilities',
    url: '/utilities/find-day-calculator',
    description: 'Find out which day of the week (Monday, Tuesday, etc.) any date falls on, whether in the historical past or centuries into the future.',
    keywords: [
      'find day calculator', 'day of week for date', 'what day was it on date', 'calendar day finder',
      'historical day of week'
    ],
    category: 'UtilityApplication'
  },
  'startup-name-checker': {
    id: 'startup-name-checker',
    title: 'Startup Name Checker — Trademark, Domain & Social Handle Availability',
    shortTitle: 'Startup Name Checker',
    sectionId: 'utilities',
    sectionLabel: 'Utilities',
    url: '/utilities/startup-name-checker',
    description: 'Validate startup brand names across Indian trademarks (IP India), .com domains, GitHub, Twitter, Instagram handles, and linguistic meanings.',
    keywords: [
      'startup name checker', 'trademark check india', 'domain availability', 'brand name search',
      'social handle checker', 'business name generator'
    ],
    category: 'BusinessApplication'
  },
  'festival-gift-planner': {
    id: 'festival-gift-planner',
    title: 'Festival & Wedding Gift Budget Planner — Gift List & Expense Tracker',
    shortTitle: 'Festival Gift Planner',
    sectionId: 'utilities',
    sectionLabel: 'Utilities',
    url: '/utilities/festival-gift-planner',
    description: 'Plan and track gift budgets for Diwali, Pongal, Eid, Christmas, and family weddings with recipient lists and cost breakdowns.',
    keywords: [
      'gift budget planner', 'festival gift tracker', 'wedding gift list', 'diwali gift budget',
      'family gift planner'
    ],
    category: 'LifestyleApplication'
  },
  'rent-vs-buy-calculator': {
    id: 'rent-vs-buy-calculator',
    title: 'Rent vs Buy Home Calculator — 30-Year Financial Comparison',
    shortTitle: 'Rent vs Buy Calculator',
    sectionId: 'utilities',
    sectionLabel: 'Utilities',
    url: '/utilities/rent-vs-buy-calculator',
    description: 'Comprehensive financial comparison of renting a home vs buying a house in India taking into account home loan EMI, appreciation, rent inflation, and opportunity cost.',
    keywords: [
      'rent vs buy calculator', 'should i buy or rent home', 'renting vs buying house india',
      'real estate buy vs rent', 'home buying decision'
    ],
    category: 'FinanceApplication'
  },
  'marriage-budget-planner': {
    id: 'marriage-budget-planner',
    title: 'Indian Marriage Budget Planner — 18-Category Wedding Expense Tracker',
    shortTitle: 'Marriage Budget Planner',
    sectionId: 'utilities',
    sectionLabel: 'Utilities',
    url: '/utilities/marriage-budget-planner',
    description: 'Plan Indian wedding expenses across Mandapam / Hall, gold jewellery, catering, photography, invitations, and reception with realistic budget benchmarks.',
    keywords: [
      'marriage budget planner', 'indian wedding budget calculator', 'wedding cost estimator india',
      'kalyanam budget plan', 'wedding expense tracker'
    ],
    category: 'LifestyleApplication'
  },
  'subscription-optimizer': {
    id: 'subscription-optimizer',
    title: 'Subscription Optimizer — Prune Unused SaaS & Streaming Services',
    shortTitle: 'Subscription Optimizer',
    sectionId: 'utilities',
    sectionLabel: 'Utilities',
    url: '/utilities/subscription-optimizer',
    description: 'Audit monthly OTT, software, and SaaS subscriptions, identify zombie recurring expenses, and calculate annual savings from annual billing switches.',
    keywords: [
      'subscription optimizer', 'subscription tracker', 'saas cost cutter', 'recurring expense manager',
      'prune streaming subscriptions'
    ],
    category: 'FinanceApplication'
  },
  'decision-matrix': {
    id: 'decision-matrix',
    title: 'Weighted Decision Matrix Tool — Make Objective Life & Business Choices',
    shortTitle: 'Weighted Decision Matrix',
    sectionId: 'utilities',
    sectionLabel: 'Utilities',
    url: '/utilities/decision-matrix',
    description: 'Compare competing options with weighted scoring criteria (Pugh Matrix) to choose between job offers, tech stacks, car purchases, or business moves.',
    keywords: [
      'decision matrix', 'weighted decision matrix', 'pugh matrix online', 'prioritization matrix',
      'objective decision maker'
    ],
    category: 'BusinessApplication'
  },
  'time-boxer': {
    id: 'time-boxer',
    title: 'Time-Boxer Daily Schedule Planner — Elon Musk Time Blocking Method',
    shortTitle: 'Time-Boxer Planner',
    sectionId: 'utilities',
    sectionLabel: 'Utilities',
    url: '/utilities/time-boxer',
    description: 'Daily productivity planner using the Harvard / Elon Musk time-boxing method: brain dump, top 3 priorities, and hour-by-hour calendar time blocking.',
    keywords: [
      'time boxer', 'time blocking planner', 'daily schedule planner', 'elon musk timeboxing',
      'productivity calendar', 'task prioritizer'
    ],
    category: 'ProductivityApplication'
  },
  'fire-calculator': {
    id: 'fire-calculator',
    title: 'FIRE Calculator — Financial Independence & Early Retirement Target',
    shortTitle: 'FIRE Calculator',
    sectionId: 'utilities',
    sectionLabel: 'Utilities',
    url: '/utilities/fire-calculator',
    description: 'Calculate your FIRE retirement number, target retirement age, lean FIRE, fat FIRE, and safe withdrawal rate (SWR) under Indian inflation benchmarks.',
    keywords: [
      'fire calculator', 'financial independence retire early', 'early retirement calculator india',
      'fire number calculator', 'lean fire fat fire', '4 percent rule calculator'
    ],
    category: 'FinanceApplication'
  },
  'fitness-nutrition-planner': {
    id: 'fitness-nutrition-planner',
    title: 'BMI & Nutrition Planner — TDEE, Calorie Deficit & Macro Breakdown',
    shortTitle: 'BMI & Nutrition Planner',
    sectionId: 'utilities',
    sectionLabel: 'Utilities',
    url: '/utilities/fitness-nutrition-planner',
    description: 'Calculate your Body Mass Index (BMI), Basal Metabolic Rate (BMR), Total Daily Energy Expenditure (TDEE), and macro split (protein, carbs, fats) for fat loss or muscle gain.',
    keywords: [
      'bmi calculator', 'tdee calculator', 'calorie deficit calculator', 'macro calculator',
      'daily calorie intake', 'bmr calculator'
    ],
    category: 'HealthApplication'
  },
  'body-fat-calculator': {
    id: 'body-fat-calculator',
    title: 'US Navy Body Fat % Calculator — Fat Mass, Lean Mass & Health Category',
    shortTitle: 'Body Fat % Calculator',
    sectionId: 'utilities',
    sectionLabel: 'Utilities',
    url: '/utilities/body-fat-calculator',
    description: 'Calculate your body fat percentage using the US Navy tape measure circumference formula for men and women without expensive DEXA scans.',
    keywords: [
      'body fat calculator', 'us navy body fat formula', 'calculate body fat percentage',
      'lean body mass calculator', 'fat mass calculator'
    ],
    category: 'HealthApplication'
  },

  // ═══════════════════════════════════════════════════════════════
  // DEVELOPER TOOLKIT
  // ═══════════════════════════════════════════════════════════════
  'dev-json-formatter': {
    id: 'dev-json-formatter',
    title: 'Online JSON Formatter & Beautifier with Syntax Highlighting',
    shortTitle: 'JSON Formatter',
    sectionId: 'dev-toolkit',
    sectionLabel: 'Developer Toolkit',
    url: '/dev-toolkit/dev-json-formatter',
    description: 'Format, beautify, and indent raw JSON payloads with syntax highlighting, tree view, copy button, and error detection.',
    keywords: [
      'json formatter', 'beautify json', 'json pretty print', 'json viewer', 'format json online',
      'json syntax highlighter'
    ],
    category: 'DeveloperApplication'
  },
  'dev-json-minifier': {
    id: 'dev-json-minifier',
    title: 'JSON Minifier & Compressor — Remove Whitespace & Reduce Payload Size',
    shortTitle: 'JSON Minifier',
    sectionId: 'dev-toolkit',
    sectionLabel: 'Developer Toolkit',
    url: '/dev-toolkit/dev-json-minifier',
    description: 'Minify and compress JSON data by stripping whitespace and newlines for high-performance API payloads and database storage.',
    keywords: [
      'json minifier', 'compress json', 'minify json online', 'shrink json payload', 'remove json whitespace'
    ],
    category: 'DeveloperApplication'
  },
  'dev-json-validator': {
    id: 'dev-json-validator',
    title: 'JSON Validator & Linter — Detect Syntax Errors & Fix Issues',
    shortTitle: 'JSON Validator',
    sectionId: 'dev-toolkit',
    sectionLabel: 'Developer Toolkit',
    url: '/dev-toolkit/dev-json-validator',
    description: 'Validate JSON syntax in real time with line numbers, error descriptions, and automatic fix suggestions for malformed quotes or trailing commas.',
    keywords: [
      'json validator', 'validate json online', 'json linter', 'check json syntax', 'fix json errors'
    ],
    category: 'DeveloperApplication'
  },
  'dev-json-comparator': {
    id: 'dev-json-comparator',
    title: 'JSON Diff & Comparator — Compare Two JSON Objects Side-by-Side',
    shortTitle: 'JSON Comparator',
    sectionId: 'dev-toolkit',
    sectionLabel: 'Developer Toolkit',
    url: '/dev-toolkit/dev-json-comparator',
    description: 'Deep-diff two JSON objects or files. Spot added, removed, or modified keys with exact JSONPath tracking and colored highlighting.',
    keywords: [
      'json diff', 'json comparator', 'compare two json files', 'diff json online', 'json difference checker'
    ],
    category: 'DeveloperApplication'
  },
  'dev-json-to-csv': {
    id: 'dev-json-to-csv',
    title: 'JSON to CSV Converter — Export JSON Arrays to Excel Spreadsheet',
    shortTitle: 'JSON to CSV',
    sectionId: 'dev-toolkit',
    sectionLabel: 'Developer Toolkit',
    url: '/dev-toolkit/dev-json-to-csv',
    description: 'Convert JSON arrays and nested API responses into clean CSV format ready for Excel and Google Sheets download.',
    keywords: [
      'json to csv', 'convert json to csv online', 'json to excel', 'export json to spreadsheet'
    ],
    category: 'DeveloperApplication'
  },
  'dev-json-to-xml': {
    id: 'dev-json-to-xml',
    title: 'JSON to XML Converter — Transform JSON Data into Valid XML',
    shortTitle: 'JSON to XML',
    sectionId: 'dev-toolkit',
    sectionLabel: 'Developer Toolkit',
    url: '/dev-toolkit/dev-json-to-xml',
    description: 'Convert JSON data structures into well-formed XML documents with customizable root elements and attribute mappings.',
    keywords: [
      'json to xml', 'convert json to xml', 'json xml transformer', 'json to soap xml'
    ],
    category: 'DeveloperApplication'
  },
  'dev-json-path': {
    id: 'dev-json-path',
    title: 'JSONPath Evaluator & Finder — Query Complex JSON Objects',
    shortTitle: 'JSON Path Finder',
    sectionId: 'dev-toolkit',
    sectionLabel: 'Developer Toolkit',
    url: '/dev-toolkit/dev-json-path',
    description: 'Test and evaluate JSONPath expressions (e.g. $.store.book[*].author) against large JSON trees with instant live result matching.',
    keywords: [
      'jsonpath evaluator', 'json path finder', 'query json online', 'jsonpath online tester'
    ],
    category: 'DeveloperApplication'
  },
  'dev-json-flattener': {
    id: 'dev-json-flattener',
    title: 'JSON Flattener & Unflattener — Flatten Deeply Nested JSON Objects',
    shortTitle: 'JSON Flattener',
    sectionId: 'dev-toolkit',
    sectionLabel: 'Developer Toolkit',
    url: '/dev-toolkit/dev-json-flattener',
    description: 'Flatten deeply nested JSON structures into dot-notation keys (e.g. user.address.city) or unflatten flattened key-value pairs back to hierarchy.',
    keywords: [
      'json flattener', 'flatten json online', 'unflatten json', 'nested json to flat'
    ],
    category: 'DeveloperApplication'
  },
  'dev-text-diff': {
    id: 'dev-text-diff',
    title: 'Text Diff Checker — Compare Text Differences Side-by-Side',
    shortTitle: 'Text Diff Checker',
    sectionId: 'dev-toolkit',
    sectionLabel: 'Developer Toolkit',
    url: '/dev-toolkit/dev-text-diff',
    description: 'Compare two text snippets, articles, or notes side by side with character and word level diff highlights.',
    keywords: [
      'text diff', 'compare text online', 'text comparison tool', 'diff checker', 'find text differences'
    ],
    category: 'DeveloperApplication'
  },
  'dev-code-diff': {
    id: 'dev-code-diff',
    title: 'Code Diff Checker — Compare Source Code Changes with Syntax Highlighting',
    shortTitle: 'Code Diff',
    sectionId: 'dev-toolkit',
    sectionLabel: 'Developer Toolkit',
    url: '/dev-toolkit/dev-code-diff',
    description: 'Compare code revisions side by side for JavaScript, TypeScript, Python, HTML, CSS, SQL, and more with Git-style unified and split diff views.',
    keywords: [
      'code diff', 'compare code online', 'git diff tool', 'source code diff checker', 'diff viewer'
    ],
    category: 'DeveloperApplication'
  },
  'dev-file-compare': {
    id: 'dev-file-compare',
    title: 'File Content Comparator — Compare Two Local Files Directly in Browser',
    shortTitle: 'File Comparator',
    sectionId: 'dev-toolkit',
    sectionLabel: 'Developer Toolkit',
    url: '/dev-toolkit/dev-file-compare',
    description: 'Compare two text, log, or code files securely in your browser without uploading your files to any external server.',
    keywords: [
      'file comparator', 'compare two files', 'file diff online', 'browser file comparison', 'diff two files'
    ],
    category: 'DeveloperApplication'
  },
  'dev-duplicate-finder': {
    id: 'dev-duplicate-finder',
    title: 'Duplicate Line Remover & Finder — Clean Lists & Deduplicate Lines',
    shortTitle: 'Duplicate Finder',
    sectionId: 'dev-toolkit',
    sectionLabel: 'Developer Toolkit',
    url: '/dev-toolkit/dev-duplicate-finder',
    description: 'Find and remove duplicate lines from text files, email lists, keywords, or CSV exports with case sensitivity options and line count stats.',
    keywords: [
      'duplicate line remover', 'remove duplicate lines', 'deduplicate list', 'find duplicate lines online',
      'clean text duplicates'
    ],
    category: 'DeveloperApplication'
  },
  'dev-word-frequency': {
    id: 'dev-word-frequency',
    title: 'Word & Character Frequency Counter — Text Density Analyzer',
    shortTitle: 'Word Frequency',
    sectionId: 'dev-toolkit',
    sectionLabel: 'Developer Toolkit',
    url: '/dev-toolkit/dev-word-frequency',
    description: 'Analyze word count, character count, sentence count, reading time, and top repeated words for SEO copy and essays.',
    keywords: [
      'word frequency counter', 'keyword density checker', 'word count online', 'character counter',
      'text analyzer'
    ],
    category: 'DeveloperApplication'
  },
  'dev-base64': {
    id: 'dev-base64',
    title: 'Base64 Encoder & Decoder — Encode and Decode Text or Binary Data',
    shortTitle: 'Base64 Tool',
    sectionId: 'dev-toolkit',
    sectionLabel: 'Developer Toolkit',
    url: '/dev-toolkit/dev-base64',
    description: 'Encode plain text or binary strings into Base64 format and decode Base64 strings back to readable UTF-8 text with one click.',
    keywords: [
      'base64 encode', 'base64 decode', 'base64 converter online', 'utf8 to base64', 'decode base64 string'
    ],
    category: 'DeveloperApplication'
  },
  'dev-jwt-decoder': {
    id: 'dev-jwt-decoder',
    title: 'JWT Decoder — Inspect JSON Web Token Header, Payload & Expiry',
    shortTitle: 'JWT Decoder',
    sectionId: 'dev-toolkit',
    sectionLabel: 'Developer Toolkit',
    url: '/dev-toolkit/dev-jwt-decoder',
    description: 'Decode and inspect JSON Web Tokens (JWT). View claims, issuer, audience, roles, issued-at, and expiration date without leaking secrets.',
    keywords: [
      'jwt decoder', 'decode jwt online', 'json web token inspector', 'jwt payload viewer',
      'jwt expiry check', 'bearer token decoder'
    ],
    category: 'DeveloperApplication'
  },
  'dev-url-encoder': {
    id: 'dev-url-encoder',
    title: 'URL Encoder & Decoder — Encode URI Components & Query Strings',
    shortTitle: 'URL Encoder/Decoder',
    sectionId: 'dev-toolkit',
    sectionLabel: 'Developer Toolkit',
    url: '/dev-toolkit/dev-url-encoder',
    description: 'URL-encode special characters into %20 hex escape sequences or decode URL-encoded query strings back to human-readable text.',
    keywords: [
      'url encoder', 'url decoder', 'encode url online', 'decode uri component', 'percent encoding calculator'
    ],
    category: 'DeveloperApplication'
  },
  'dev-image-base64': {
    id: 'dev-image-base64',
    title: 'Image to Base64 Converter — Data URI Generator for HTML & CSS',
    shortTitle: 'Image to Base64',
    sectionId: 'dev-toolkit',
    sectionLabel: 'Developer Toolkit',
    url: '/dev-toolkit/dev-image-base64',
    description: 'Convert PNG, JPG, SVG, and WebP images into Base64 Data URI strings for direct embedding into HTML img tags and CSS stylesheets.',
    keywords: [
      'image to base64', 'png to base64', 'data uri generator', 'base64 image converter',
      'embed image in html css'
    ],
    category: 'DeveloperApplication'
  },
  'dev-sql-formatter': {
    id: 'dev-sql-formatter',
    title: 'SQL Formatter & Beautifier — Format SQL Queries Cleanly',
    shortTitle: 'SQL Formatter',
    sectionId: 'dev-toolkit',
    sectionLabel: 'Developer Toolkit',
    url: '/dev-toolkit/dev-sql-formatter',
    description: 'Format, indent, and prettify SQL queries for PostgreSQL, MySQL, SQLite, Oracle, and MS SQL Server with standard keyword casing.',
    keywords: [
      'sql formatter', 'beautify sql', 'sql pretty print', 'format sql query online', 'sql indentation'
    ],
    category: 'DeveloperApplication'
  },
  'dev-csv-to-json': {
    id: 'dev-csv-to-json',
    title: 'CSV to JSON Converter — Convert Spreadsheets into JSON Array',
    shortTitle: 'CSV to JSON',
    sectionId: 'dev-toolkit',
    sectionLabel: 'Developer Toolkit',
    url: '/dev-toolkit/dev-csv-to-json',
    description: 'Convert CSV files or comma-separated raw text into cleanly structured JSON object arrays with automatic data type detection.',
    keywords: [
      'csv to json', 'convert csv to json online', 'excel to json converter', 'csv parser'
    ],
    category: 'DeveloperApplication'
  },
  'dev-string-case': {
    id: 'dev-string-case',
    title: 'String Case Converter — camelCase, snake_case, kebab-case, PascalCase',
    shortTitle: 'String Case Convert',
    sectionId: 'dev-toolkit',
    sectionLabel: 'Developer Toolkit',
    url: '/dev-toolkit/dev-string-case',
    description: 'Convert text between camelCase, snake_case, kebab-case, PascalCase, UPPERCASE, lowercase, Title Case, and CONSTANT_CASE instantly.',
    keywords: [
      'string case converter', 'camelcase converter', 'snake case', 'kebab case converter',
      'title case online', 'convert text case'
    ],
    category: 'DeveloperApplication'
  },
  'dev-unix-timestamp': {
    id: 'dev-unix-timestamp',
    title: 'Unix Timestamp Converter — Epoch Timestamp to Human Date',
    shortTitle: 'Unix Timestamp',
    sectionId: 'dev-toolkit',
    sectionLabel: 'Developer Toolkit',
    url: '/dev-toolkit/dev-unix-timestamp',
    description: 'Convert Unix epoch timestamps (seconds & milliseconds) into human-readable UTC and local date-time strings, and convert dates to timestamps.',
    keywords: [
      'unix timestamp converter', 'epoch to date', 'date to epoch', 'epoch converter online',
      'convert timestamp to datetime'
    ],
    category: 'DeveloperApplication'
  },
  'dev-hash-generator': {
    id: 'dev-hash-generator',
    title: 'Online Hash Generator — MD5, SHA-1, SHA-256, SHA-512 Checksums',
    shortTitle: 'Hash Generator',
    sectionId: 'dev-toolkit',
    sectionLabel: 'Developer Toolkit',
    url: '/dev-toolkit/dev-hash-generator',
    description: 'Generate cryptographic cryptographic hashes (MD5, SHA-1, SHA-256, SHA-384, SHA-512) for text strings and verify file integrity hashes.',
    keywords: [
      'hash generator', 'sha256 generator', 'md5 hash online', 'sha512 calculator', 'generate checksum'
    ],
    category: 'DeveloperApplication'
  },
  'dev-password-checker': {
    id: 'dev-password-checker',
    title: 'Password Strength & Entropy Checker — Test Password Security',
    shortTitle: 'Password Checker',
    sectionId: 'dev-toolkit',
    sectionLabel: 'Developer Toolkit',
    url: '/dev-toolkit/dev-password-checker',
    description: 'Test password security with real-time entropy calculation, crack time estimations, brute-force resistance, and complexity checklists.',
    keywords: [
      'password strength checker', 'test password security', 'password entropy calculator',
      'how secure is my password', 'password tester'
    ],
    category: 'SecurityApplication'
  },
  'dev-uuid-generator': {
    id: 'dev-uuid-generator',
    title: 'UUID / GUID v4 Generator — Generate Bulk Unique Identifiers',
    shortTitle: 'UUID Generator',
    sectionId: 'dev-toolkit',
    sectionLabel: 'Developer Toolkit',
    url: '/dev-toolkit/dev-uuid-generator',
    description: 'Generate random Version-4 UUIDs (Universally Unique Identifiers) and GUIDs in lowercase, uppercase, with or without hyphens.',
    keywords: [
      'uuid generator', 'guid generator', 'generate uuid v4', 'random uuid online', 'bulk uuid generator'
    ],
    category: 'DeveloperApplication'
  },
  'dev-token-generator': {
    id: 'dev-token-generator',
    title: 'Cryptographic Secure Token Generator — API Keys & Hex Tokens',
    shortTitle: 'Token Generator',
    sectionId: 'dev-toolkit',
    sectionLabel: 'Developer Toolkit',
    url: '/dev-toolkit/dev-token-generator',
    description: 'Generate cryptographically random API keys, secret tokens, bearer auth tokens, and hex strings with custom length and character sets.',
    keywords: [
      'token generator', 'api key generator', 'random secret token', 'generate auth token',
      'hex token generator'
    ],
    category: 'SecurityApplication'
  },
  'dev-ssl-checker': {
    id: 'dev-ssl-checker',
    title: 'SSL / TLS Certificate Checker — Verify Expiration & HTTPS Security',
    shortTitle: 'SSL Cert Checker',
    sectionId: 'dev-toolkit',
    sectionLabel: 'Developer Toolkit',
    url: '/dev-toolkit/dev-ssl-checker',
    description: 'Inspect domain SSL/TLS certificates, issuer CA, expiration date countdown, SAN domains, and cipher compatibility.',
    keywords: [
      'ssl checker', 'tls certificate checker', 'ssl expiry check', 'check https certificate online',
      'verify ssl cert'
    ],
    category: 'SecurityApplication'
  },
  'dev-color-converter': {
    id: 'dev-color-converter',
    title: 'Color Converter — HEX, RGB, HSL, CMYK & Color Palette Tool',
    shortTitle: 'Color Converter',
    sectionId: 'dev-toolkit',
    sectionLabel: 'Developer Toolkit',
    url: '/dev-toolkit/dev-color-converter',
    description: 'Convert colors between HEX, RGB, HSL, HSV, and CMYK formats with visual color picker, shades, tints, and contrast ratio preview.',
    keywords: [
      'color converter', 'hex to rgb', 'rgb to hex', 'hex to hsl', 'color picker online',
      'cmyk to rgb'
    ],
    category: 'DesignApplication'
  },
  'dev-regex-tester': {
    id: 'dev-regex-tester',
    title: 'Online Regex Tester & Debugger with Match Highlighting',
    shortTitle: 'Regex Tester',
    sectionId: 'dev-toolkit',
    sectionLabel: 'Developer Toolkit',
    url: '/dev-toolkit/dev-regex-tester',
    description: 'Test, validate, and debug regular expressions (RegEx) with real-time match highlighting, capture groups, and regex cheat sheet.',
    keywords: [
      'regex tester', 'regular expression tester online', 'test regex', 'regex debugger', 'javascript regex tester'
    ],
    category: 'DeveloperApplication'
  },
  'dev-cron-builder': {
    id: 'dev-cron-builder',
    title: 'Cron Expression Builder & Schedule Generator',
    shortTitle: 'Cron Builder',
    sectionId: 'dev-toolkit',
    sectionLabel: 'Developer Toolkit',
    url: '/dev-toolkit/dev-cron-builder',
    description: 'Build standard 5-part cron schedule expressions visually or enter a cron string to get plain English schedule descriptions and next run dates.',
    keywords: [
      'cron builder', 'cron expression generator', 'cron schedule explainer', 'crontab generator online',
      'cron format helper'
    ],
    category: 'DeveloperApplication'
  },
  'dev-code-checker': {
    id: 'dev-code-checker',
    title: 'Online Code Syntax Checker & Linter',
    shortTitle: 'Code Syntax Checker',
    sectionId: 'dev-toolkit',
    sectionLabel: 'Developer Toolkit',
    url: '/dev-toolkit/dev-code-checker',
    description: 'Check syntax errors and linting issues for JavaScript, TypeScript, Python, HTML, and JSON directly in your browser.',
    keywords: [
      'code syntax checker', 'online code linter', 'javascript syntax checker', 'check code errors online'
    ],
    category: 'DeveloperApplication'
  },

  // ═══════════════════════════════════════════════════════════════
  // STANDALONE SUITES & TOOLS
  // ═══════════════════════════════════════════════════════════════
  'govt-scheme-finder': {
    id: 'govt-scheme-finder',
    title: 'Indian Government Scheme Finder — Central & State Welfare Schemes',
    shortTitle: 'Govt Scheme Finder',
    sectionId: 'govt-scheme-finder',
    sectionLabel: 'Tax & Compliance',
    url: '/govt-scheme-finder',
    description: 'Discover central and state government schemes in India across agriculture, education, women empowerment, business subsidies, and health insurance.',
    keywords: [
      'govt scheme finder', 'government schemes india', 'pradhan mantri scheme', 'tamil nadu govt schemes',
      'subsidy schemes india', 'find welfare schemes'
    ],
    category: 'GovernmentApplication'
  },
  'invitation-creator': {
    id: 'invitation-creator',
    title: 'Digital Invitation Card Creator — Wedding, Birthday & Event Invites',
    shortTitle: 'Invitation Creator',
    sectionId: 'invitation-creator',
    sectionLabel: 'Creative & Career',
    url: '/invitation-creator',
    description: 'Design beautiful, mobile-friendly digital invitations for Indian weddings, birthday parties, housewarmings, and baby showers with instant RSVP sharing.',
    keywords: [
      'invitation creator', 'digital wedding invitation maker', 'birthday invite creator',
      'online invitation card', 'kalyanam invitation card maker'
    ],
    category: 'DesignApplication'
  },
  'event-page-creator': {
    id: 'event-page-creator',
    title: 'Event Landing Page Creator — Instant Event Website & RSVP Portal',
    shortTitle: 'Event Landing Page',
    sectionId: 'event-page-creator',
    sectionLabel: 'Creative & Career',
    url: '/event-page-creator',
    description: 'Create an interactive event landing page in seconds with venue maps, countdown timer, agenda schedule, and guest RSVP registration.',
    keywords: [
      'event page creator', 'event website builder', 'rsvp page creator', 'free event landing page maker'
    ],
    category: 'DesignApplication'
  },
  'logo-creator': {
    id: 'logo-creator',
    title: 'Free Instant Logo Creator & Brand Icon Generator',
    shortTitle: 'Logo Creator',
    sectionId: 'logo-creator',
    sectionLabel: 'Creative & Career',
    url: '/logo-creator',
    description: 'Generate clean, modern, vector logos for your startup, YouTube channel, agency, or app with customizable typography and download in SVG/PNG.',
    keywords: [
      'logo creator', 'free logo maker online', 'startup logo generator', 'business logo creator',
      'svg logo generator'
    ],
    category: 'DesignApplication'
  },
  'life-decision-simulator': {
    id: 'life-decision-simulator',
    title: 'Life Decision & Career Simulator — Model Long-Term Trajectories',
    shortTitle: 'Life Decision Simulator',
    sectionId: 'life-decision-simulator',
    sectionLabel: 'Creative & Career',
    url: '/life-decision-simulator',
    description: 'Simulate long-term financial, career, and lifestyle outcomes of major life choices: job switch vs startup, higher studies, or moving abroad.',
    keywords: [
      'life decision simulator', 'career simulator', 'job vs startup calculator', 'simulate life choices',
      'career path comparison'
    ],
    category: 'LifestyleApplication'
  },
  'products': {
    id: 'products',
    title: 'Zezha Tools Products & Solutions Showcase',
    shortTitle: 'Products',
    sectionId: 'products',
    sectionLabel: 'Productivity & Utilities',
    url: '/products',
    description: 'Explore the full portfolio of modern browser-based web applications, business intelligence dashboards, and developer toolkits crafted by Zezha.',
    keywords: [
      'zezha products', 'web utilities portal', 'business tools showcase', 'free software suite'
    ],
    category: 'WebApplication'
  },
  'image-downloader': {
    id: 'image-downloader',
    title: 'Free Stock Image Search & Downloader (High Resolution)',
    shortTitle: 'Image Downloader',
    sectionId: 'get-img-video',
    sectionLabel: 'Get Img/Video',
    url: '/get-img-video/image-downloader',
    description: 'Search and download royalty-free, high-resolution stock photos and wallpapers directly without watermarks.',
    keywords: [
      'image downloader', 'free stock photos download', 'high res image search', 'pexels photo download'
    ],
    category: 'UtilityApplication'
  },
  'video-downloader': {
    id: 'video-downloader',
    title: 'Free Stock Video Search & Downloader (HD & 4K Clips)',
    shortTitle: 'Video Downloader',
    sectionId: 'get-img-video',
    sectionLabel: 'Get Img/Video',
    url: '/get-img-video/video-downloader',
    description: 'Search and download free HD and 4K stock video footage for social media, YouTube backgrounds, and presentations.',
    keywords: [
      'video downloader', 'free stock footage', '4k stock video download', 'royalty free b-roll'
    ],
    category: 'UtilityApplication'
  },

  // ═══════════════════════════════════════════════════════════════
  // RAW DATA & REFERENCE
  // ═══════════════════════════════════════════════════════════════
  'indian-states-cities': {
    id: 'indian-states-cities',
    title: 'Indian States, Union Territories & Capitals Directory',
    shortTitle: 'Indian States',
    sectionId: 'raw-data',
    sectionLabel: 'Raw Data',
    url: '/raw-data/indian-states-cities',
    description: 'Complete verified dataset of all 28 Indian States and 8 Union Territories with capitals, official languages, population, and state codes.',
    keywords: ['indian states list', 'union territories of india', 'state capitals india', 'indian state codes'],
    category: 'DataApplication'
  },
  'indian-cities': {
    id: 'indian-cities',
    title: 'Indian Cities Directory — Tier 1, Tier 2 & Tier 3 Classification',
    shortTitle: 'Indian Cities',
    sectionId: 'raw-data',
    sectionLabel: 'Raw Data',
    url: '/raw-data/indian-cities',
    description: 'Verified directory of major Indian cities categorized by Tier 1, Tier 2, and Tier 3 status with state mapping and population statistics.',
    keywords: ['indian cities list', 'tier 1 cities india', 'tier 2 cities in india', 'list of cities by state'],
    category: 'DataApplication'
  },
  'indian-colleges': {
    id: 'indian-colleges',
    title: 'Top Indian Colleges & Universities Directory (NIRF Ranked)',
    shortTitle: 'Indian Colleges',
    sectionId: 'raw-data',
    sectionLabel: 'Raw Data',
    url: '/raw-data/indian-colleges',
    description: 'Directory of top colleges, IITs, IIMs, NITs, and universities across India with NIRF ranking categories and state distribution.',
    keywords: ['top colleges in india', 'nirf ranking list', 'engineering colleges india', 'iit nit list'],
    category: 'DataApplication'
  },
  'indian-pin-codes': {
    id: 'indian-pin-codes',
    title: 'Indian Postal PIN Codes Directory — Search Postal Codes by District',
    shortTitle: 'PIN Codes',
    sectionId: 'raw-data',
    sectionLabel: 'Raw Data',
    url: '/raw-data/indian-pin-codes',
    description: 'Lookup Indian postal PIN codes by state, district, and post office division across all Indian postal circles.',
    keywords: ['pin code search', 'postal codes india', 'pincode directory', 'find pincode by district'],
    category: 'DataApplication'
  },
  'indian-districts': {
    id: 'indian-districts',
    title: 'Districts of India by State & Union Territory Directory',
    shortTitle: 'Districts',
    sectionId: 'raw-data',
    sectionLabel: 'Raw Data',
    url: '/raw-data/indian-districts',
    description: 'Exhaustive directory of all 780+ districts across India mapped to their respective states and administrative headquarters.',
    keywords: ['districts of india', 'list of districts in india', 'all districts by state', 'india district map'],
    category: 'DataApplication'
  },
  'indian-parliament': {
    id: 'indian-parliament',
    title: 'Indian Parliament Directory — Lok Sabha & Rajya Sabha Constituencies',
    shortTitle: 'Parliament',
    sectionId: 'raw-data',
    sectionLabel: 'Raw Data',
    url: '/raw-data/indian-parliament',
    description: 'Directory of parliamentary constituencies for Lok Sabha and Rajya Sabha representation by state across India.',
    keywords: ['lok sabha constituencies', 'rajya sabha seats by state', 'parliament of india seats'],
    category: 'DataApplication'
  },
  'indian-holidays': {
    id: 'indian-holidays',
    title: 'Indian Public & Gazetted Holidays 2026 Calendar',
    shortTitle: 'Holidays',
    sectionId: 'raw-data',
    sectionLabel: 'Raw Data',
    url: '/raw-data/indian-holidays',
    description: 'Official 2026 calendar of central government gazetted holidays, restricted holidays, and major religious festivals in India.',
    keywords: ['indian holidays 2026', 'gazetted holidays 2026', 'bank holidays 2026', 'public holidays india'],
    category: 'DataApplication'
  },
  'indian-banks': {
    id: 'indian-banks',
    title: 'Indian Banks, IFSC Codes & Branch Locator Directory',
    shortTitle: 'Banks & IFSC',
    sectionId: 'raw-data',
    sectionLabel: 'Raw Data',
    url: '/raw-data/indian-banks',
    description: 'Search IFSC codes, MICR codes, branch addresses, and RTGS/NEFT details for public, private, and cooperative banks across India.',
    keywords: ['ifsc code search', 'bank branch finder', 'sbi ifsc code', 'hdfc ifsc code', 'micr code lookup'],
    category: 'DataApplication'
  },
  'gst-state-codes': {
    id: 'gst-state-codes',
    title: 'GST State Codes Directory — 2-Digit GSTIN State Code Lookup',
    shortTitle: 'GST Codes',
    sectionId: 'raw-data',
    sectionLabel: 'Raw Data',
    url: '/raw-data/gst-state-codes',
    description: 'Complete 2-digit GST state code reference table (e.g., 33 for Tamil Nadu, 27 for Maharashtra) for invoice and GSTIN verification.',
    keywords: ['gst state code', 'gstin 2 digit state code', 'state code for gst', 'tamil nadu gst code 33'],
    category: 'DataApplication'
  },
  'india-tax-slabs': {
    id: 'india-tax-slabs',
    title: 'Income Tax Slabs History — Historical & Current Indian Tax Rates',
    shortTitle: 'Tax Slabs',
    sectionId: 'raw-data',
    sectionLabel: 'Raw Data',
    url: '/raw-data/india-tax-slabs',
    description: 'Comprehensive historical and current income tax slab rates for individuals, senior citizens, and corporations in India.',
    keywords: ['tax slabs india', 'income tax slab rates history', 'new regime tax slabs chart'],
    category: 'DataApplication'
  },
  'indian-stock-market': {
    id: 'indian-stock-market',
    title: 'Indian Stock Market Indices Reference — Nifty 50 & Sensex Benchmark',
    shortTitle: 'Stock Market',
    sectionId: 'raw-data',
    sectionLabel: 'Raw Data',
    url: '/raw-data/indian-stock-market',
    description: 'Reference data for major Indian stock market benchmark indices including Nifty 50, BSE Sensex, Nifty Bank, and sectoral indices.',
    keywords: ['nifty 50 list', 'bse sensex indices', 'indian stock market benchmarks', 'sectoral indices nse'],
    category: 'DataApplication'
  },
  'indian-cars': {
    id: 'indian-cars',
    title: 'Indian Car Prices & Models Directory — Ex-Showroom Benchmarks',
    shortTitle: 'Indian Cars Prices',
    sectionId: 'raw-data',
    sectionLabel: 'Raw Data',
    url: '/raw-data/indian-cars',
    description: 'Benchmark ex-showroom prices and technical specifications for popular passenger cars and SUVs sold in India.',
    keywords: ['car prices in india', 'ex showroom price list', 'suv prices india', 'car models 2026'],
    category: 'DataApplication'
  },
  'tds-rate-chart': {
    id: 'tds-rate-chart',
    title: 'TDS Rate Chart FY 2026-27 — Section-wise Thresholds & Deductions',
    shortTitle: 'TDS Rate Chart',
    sectionId: 'raw-data',
    sectionLabel: 'Raw Data',
    url: '/raw-data/tds-rate-chart',
    description: 'Section-wise TDS rate chart FY 2026-27 (AY 2027-28) with threshold limits under 194C, 194J, 194I, 194A, 194H, and 192.',
    keywords: ['tds rate chart 2026-27', 'section wise tds rates', 'tds threshold limits', 'tds on salary and rent'],
    category: 'DataApplication'
  },
  'professional-tax': {
    id: 'professional-tax',
    title: 'Professional Tax Slabs by Indian States (Tamil Nadu, Karnataka, MH)',
    shortTitle: 'Professional Tax',
    sectionId: 'raw-data',
    sectionLabel: 'Raw Data',
    url: '/raw-data/professional-tax',
    description: 'State-wise Professional Tax (PT) slab rates and deduction limits across Tamil Nadu, Karnataka, Maharashtra, Telangana, and other states.',
    keywords: ['professional tax slabs', 'pt rate in tamil nadu', 'professional tax karnataka', 'pt deduction salary'],
    category: 'DataApplication'
  },
  'minimum-wages': {
    id: 'minimum-wages',
    title: 'Minimum Wages in India by State & Skill Category Reference',
    shortTitle: 'Minimum Wages',
    sectionId: 'raw-data',
    sectionLabel: 'Raw Data',
    url: '/raw-data/minimum-wages',
    description: 'Reference guide to minimum wages in India categorized by state, scheduled employment, and skill level (unskilled, semi-skilled, skilled).',
    keywords: ['minimum wages in india', 'minimum wage act', 'state wise minimum wage rates'],
    category: 'DataApplication'
  },
  'depreciation-rates': {
    id: 'depreciation-rates',
    title: 'Income Tax vs Companies Act Depreciation Rates Chart',
    shortTitle: 'Depreciation Rates',
    sectionId: 'raw-data',
    sectionLabel: 'Raw Data',
    url: '/raw-data/depreciation-rates',
    description: 'Side-by-side comparison of depreciation rates under Section 32 of Income Tax Act 1961 vs Schedule II of Companies Act 2013.',
    keywords: ['depreciation rates income tax act', 'schedule ii companies act depreciation', 'asset depreciation rates'],
    category: 'DataApplication'
  },
  'rbi-rates-history': {
    id: 'rbi-rates-history',
    title: 'RBI Policy Rates History — Repo Rate, Reverse Repo & CRR',
    shortTitle: 'RBI Rates History',
    sectionId: 'raw-data',
    sectionLabel: 'Raw Data',
    url: '/raw-data/rbi-rates-history',
    description: 'Historical track of Reserve Bank of India (RBI) policy rates: Repo Rate, Reverse Repo Rate, Cash Reserve Ratio (CRR), and SLR over time.',
    keywords: ['rbi repo rate history', 'reverse repo rate rbi', 'crr history india', 'rbi policy rates'],
    category: 'DataApplication'
  },
  'gst-rate-finder': {
    id: 'gst-rate-finder',
    title: 'GST Rate Finder — HSN & SAC Code Tax Rates Directory',
    shortTitle: 'GST Rate Finder',
    sectionId: 'raw-data',
    sectionLabel: 'Raw Data',
    url: '/raw-data/gst-rate-finder',
    description: 'Find applicable GST rates (0%, 5%, 12%, 18%, 28%) by searching product HSN codes and service SAC codes.',
    keywords: ['gst rate finder', 'hsn code gst rate', 'sac code tax rate', 'search gst by hsn'],
    category: 'DataApplication'
  },
  'section-80-deductions': {
    id: 'section-80-deductions',
    title: 'Section 80 Deductions Guide — Chapter VI-A Tax Exemption Limits',
    shortTitle: 'Section 80 Deductions',
    sectionId: 'raw-data',
    sectionLabel: 'Raw Data',
    url: '/raw-data/section-80-deductions',
    description: 'Complete guide to income tax deductions under Chapter VI-A: 80C (PPF, ELSS), 80D (Health Insurance), 80CCD(1B) (NPS), 80E, 80G, and 80TTA.',
    keywords: ['section 80 deductions', '80c tax exemption', '80d medical insurance', 'chapter vi-a deductions guide'],
    category: 'DataApplication'
  },
  'cost-inflation-index': {
    id: 'cost-inflation-index',
    title: 'Cost Inflation Index (CII) Table for Long-Term Capital Gains (LTCG)',
    shortTitle: 'Cost Inflation Index',
    sectionId: 'raw-data',
    sectionLabel: 'Raw Data',
    url: '/raw-data/cost-inflation-index',
    description: 'Official Cost Inflation Index (CII) table notified by CBDT from FY 2001-02 to present for calculating indexed cost of acquisition in LTCG.',
    keywords: ['cost inflation index table', 'cii for capital gains', 'indexed cost of acquisition', 'cbdt cii chart'],
    category: 'DataApplication'
  },
  'itr-forms-guide': {
    id: 'itr-forms-guide',
    title: 'ITR Forms Selection Guide — Which ITR (1, 2, 3, 4) Should You File?',
    shortTitle: 'ITR Forms Guide',
    sectionId: 'raw-data',
    sectionLabel: 'Raw Data',
    url: '/raw-data/itr-forms-guide',
    description: 'Selection guide for Income Tax Return forms: ITR-1 Sahaj, ITR-2 for capital gains, ITR-3 for business/profession, and ITR-4 Sugam presumptive tax.',
    keywords: ['itr forms guide', 'which itr to file', 'itr 1 vs itr 2 vs itr 3', 'itr 4 eligibility'],
    category: 'DataApplication'
  },
  'compliance-due-dates': {
    id: 'compliance-due-dates',
    title: 'Monthly Compliance Calendar — GST, TDS, PF & Income Tax Due Dates',
    shortTitle: 'Compliance Calendar',
    sectionId: 'raw-data',
    sectionLabel: 'Raw Data',
    url: '/raw-data/compliance-due-dates',
    description: 'Comprehensive statutory compliance calendar with due dates for GSTR-1, GSTR-3B, TDS payments, PF/ESI challans, and Advance Tax.',
    keywords: ['statutory compliance calendar', 'gst due dates', 'tds return due date', 'advance tax dates'],
    category: 'DataApplication'
  },
  'interest-penalty-rates': {
    id: 'interest-penalty-rates',
    title: 'Interest & Penalty Rates Under Income Tax & GST Acts',
    shortTitle: 'Interest & Penalties',
    sectionId: 'raw-data',
    sectionLabel: 'Raw Data',
    url: '/raw-data/interest-penalty-rates',
    description: 'Reference of statutory interest rates and late fee penalties under Sections 234A, 234B, 234C of Income Tax Act and Section 50 of GST Act.',
    keywords: ['interest under 234a 234b 234c', 'gst late fee rates', 'tax penalty chart'],
    category: 'DataApplication'
  },
  'audit-threshold-limits': {
    id: 'audit-threshold-limits',
    title: 'Audit Threshold Limits — Tax Audit (44AB) & Company Audit Limits',
    shortTitle: 'Audit Limits',
    sectionId: 'raw-data',
    sectionLabel: 'Raw Data',
    url: '/raw-data/audit-threshold-limits',
    description: 'Turnover limits for Tax Audit under Section 44AB (₹1 Crore / ₹10 Crore digital transactions), presumptive taxation 44AD/44ADA limits, and statutory audit thresholds.',
    keywords: ['tax audit limit 44ab', 'presumptive taxation 44ad limits', 'audit turnover threshold'],
    category: 'DataApplication'
  },
  'epf-interest-rates': {
    id: 'epf-interest-rates',
    title: 'EPF Historical Interest Rates Chart (1952 to Present)',
    shortTitle: 'EPF Interest Rates',
    sectionId: 'raw-data',
    sectionLabel: 'Raw Data',
    url: '/raw-data/epf-interest-rates',
    description: 'Historical chart of Employee Provident Fund (EPF) interest rates declared by EPFO for salaried employees in India.',
    keywords: ['epf interest rates history', 'current epfo interest rate', 'pf interest rates chart'],
    category: 'DataApplication'
  },
  'hr-leave-rules': {
    id: 'hr-leave-rules',
    title: 'Indian HR Leave Rules — Casual Leave, Sick Leave & Earned Leave Policy',
    shortTitle: 'Leave Entitlement',
    sectionId: 'raw-data',
    sectionLabel: 'Raw Data',
    url: '/raw-data/hr-leave-rules',
    description: 'Overview of statutory leave entitlements under Indian Shops & Establishments Acts, Factories Act, and Maternity Benefit Act.',
    keywords: ['leave rules in india', 'earned leave policy', 'casual leave sick leave rules', 'maternity benefit leave'],
    category: 'DataApplication'
  },
  'gratuity-rules': {
    id: 'gratuity-rules',
    title: 'Payment of Gratuity Act Rules, Formula & Tax-Free Limits',
    shortTitle: 'Gratuity Rules',
    sectionId: 'raw-data',
    sectionLabel: 'Raw Data',
    url: '/raw-data/gratuity-rules',
    description: 'Complete guide to gratuity calculation formula (15 * last drawn salary * tenure / 26), 5-year eligibility rule, and ₹20 Lakhs tax exemption limit.',
    keywords: ['gratuity calculation formula', 'gratuity eligibility rules', 'gratuity act limits india'],
    category: 'DataApplication'
  },
  'bank-fd-rates': {
    id: 'bank-fd-rates',
    title: 'Bank FD Interest Rates Comparison — SBI, HDFC, ICICI, Post Office',
    shortTitle: 'Bank FD Rates',
    sectionId: 'raw-data',
    sectionLabel: 'Raw Data',
    url: '/raw-data/bank-fd-rates',
    description: 'Current fixed deposit interest rates comparison across major public and private sector banks in India for general citizens and senior citizens.',
    keywords: ['bank fd interest rates', 'sbi fd rates', 'best fd rates in india', 'senior citizen fd interest'],
    category: 'DataApplication'
  },
  'statutory-due-dates': {
    id: 'statutory-due-dates',
    title: 'Statutory Due Dates Directory — PF, ESI, TDS, GST Monthly Schedule',
    shortTitle: 'Statutory Due Dates',
    sectionId: 'raw-data',
    sectionLabel: 'Raw Data',
    url: '/raw-data/statutory-due-dates',
    description: 'Quick reference guide to monthly statutory payment and return filing due dates for PF (15th), ESI (15th), TDS deposit (7th), and GST (20th).',
    keywords: ['statutory due dates', 'pf payment due date 15th', 'tds deposit due date 7th', 'gst return due date'],
    category: 'DataApplication'
  }
};

/** Helper to retrieve metadata for any tool by id */
export function getToolMetadata(toolId: string): ToolMetadata | undefined {
  return TOOL_METADATA_MAP[toolId];
}

/** Helper to retrieve all tools matching a search query across title, shortTitle, keywords, and description */
export function searchToolsMetadata(query: string): ToolMetadata[] {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  return Object.values(TOOL_METADATA_MAP).filter(tool => {
    if (tool.shortTitle.toLowerCase().includes(q)) return true;
    if (tool.title.toLowerCase().includes(q)) return true;
    if (tool.id.toLowerCase().includes(q)) return true;
    if (tool.sectionLabel.toLowerCase().includes(q)) return true;
    if (tool.description.toLowerCase().includes(q)) return true;
    if (tool.keywords.some(k => k.toLowerCase().includes(q))) return true;
    return false;
  });
}
