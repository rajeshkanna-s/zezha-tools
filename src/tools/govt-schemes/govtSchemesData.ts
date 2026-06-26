export interface UserProfile {
  age: number;
  gender: string;
  state: string;
  area: string;
  income: string;
  category: string;
  employment: string;
  bankAccount: string;
  lifeStage: string[];
  needs: string[];
  ownHouse: string;
  ownLand: string;
  healthIns: string;
  toilet: string;
  bizType: string;
  education: string;
  special: string[];
}

export interface GovtScheme {
  id: string;
  name: string;
  category: string;
  tag: string;
  tagline: string;
  ministry: string;
  launchedDate: string;
  currentStatus: string;
  benefitAmount: string;
  amount: number;
  officialWebsite: string;
  applyPortal: string;
  helpline: string;
  about: string;
  keyBenefits: string[];
  eligibility: string[];
  documentsRequired: string[];
  howToApply: string[];
  whoShouldApply: string;
  match: (p: UserProfile) => boolean;
}

export const GOVT_SCHEMES: GovtScheme[] = [
  {
    id: 'pmjay',
    name: 'Ayushman Bharat — PM Jan Arogya Yojana (PMJAY)',
    category: 'health',
    tag: 'Healthcare',
    tagline: "World's largest health insurance scheme",
    ministry: 'Ministry of Health & Family Welfare',
    launchedDate: '23 September 2018',
    currentStatus: 'Active — Expanded in Oct 2024 to cover all seniors 70+',
    benefitAmount: '₹5,00,000 per family per year (₹10,00,000 for seniors 70+)',
    amount: 500000,
    officialWebsite: 'https://pmjay.gov.in/',
    applyPortal: 'https://beneficiary.nha.gov.in/',
    helpline: '14555 / 1800-111-565',
    about: 'Provides cashless and paperless hospitalisation coverage to economically vulnerable families. Covers 1,961+ treatment packages across 27 specialities including oncology, cardiology, orthopaedics, neurosurgery. Over 36.9 crore Ayushman cards created and 11.69 crore+ hospital admissions processed as of March 2025.',
    keyBenefits: [
      'Cashless hospitalisation up to ₹5 lakh/year/family',
      '1,961+ treatment packages across 27 specialities',
      'Pre & post hospitalisation expenses covered (3 days pre, 15 days post)',
      'No restriction on family size, age, or gender',
      '28,000+ empanelled hospitals across India',
      'Portable — use at any empanelled hospital in any state',
      'All citizens aged 70+ get separate ₹5L cover regardless of income',
      'ASHA, Anganwadi workers and families covered from March 2024',
    ],
    eligibility: [
      'Families identified in SECC 2011 database',
      'Rural: Kutcha house, landless, manual scavengers, destitute, SC/ST households',
      'Urban: Ragpickers, domestic workers, street vendors, construction workers',
      'All senior citizens aged 70+ — no income limit',
      'NOT eligible: Families owning motorised vehicle, refrigerator, 2+ hectare irrigated land',
    ],
    documentsRequired: ['Aadhaar Card (mandatory)', 'Ration Card / BPL Card', 'SECC inclusion letter', 'Any government-issued photo ID', 'Age proof for senior citizen category'],
    howToApply: [
      'Visit beneficiary.nha.gov.in or download Ayushman App',
      'Check eligibility using mobile number or Aadhaar',
      'If eligible, complete Aadhaar eKYC (OTP or biometric)',
      'Download your Ayushman Card as PDF',
      'Visit any empanelled hospital, present card + Aadhaar',
      'Hospital verifies via QR code scan — treatment begins',
    ],
    whoShouldApply: 'Every low-income family, every person above 70, every ASHA/Anganwadi worker. If unsure, check at beneficiary.nha.gov.in — it takes 30 seconds.',
    match: (p) => ['below1', '1to2.5', '2.5to5'].includes(p.income) && (p.healthIns === 'no' || !p.healthIns),
  },
  {
    id: 'jsy',
    name: 'Janani Suraksha Yojana (JSY)',
    category: 'health',
    tag: 'Healthcare',
    tagline: 'Cash incentive for institutional delivery',
    ministry: 'Ministry of Health & Family Welfare',
    launchedDate: '12 April 2005',
    currentStatus: 'Active — Ongoing under National Health Mission',
    benefitAmount: '₹700–₹1,400 per delivery',
    amount: 1400,
    officialWebsite: 'https://nhm.gov.in/',
    applyPortal: 'https://nhm.gov.in/',
    helpline: 'State NHM helplines (varies by state)',
    about: 'Cash incentive to promote institutional deliveries among pregnant women from BPL families. Aims to reduce maternal and neonatal mortality by encouraging hospital births over home deliveries.',
    keyBenefits: [
      'Cash incentive: ₹1,400 (rural) / ₹1,000 (urban) in LPS states',
      'Free transport from home to facility and back',
      'ASHA worker incentive: ₹600 (rural) / ₹200 (urban)',
      'Free delivery at government hospitals',
      'Post-delivery care and follow-up',
    ],
    eligibility: ['All pregnant women delivering at government facilities', 'Priority to BPL, SC, ST families', 'Age 19+ years', 'Valid for first 2 live births'],
    documentsRequired: ['Aadhaar Card', 'BPL Card / Income Certificate', 'MCH Card', 'JSY registration card', 'Bank account passbook'],
    howToApply: ['Register pregnancy at nearest PHC/Sub-Centre/ANM', 'Receive MCH card and JSY registration', 'Attend at least 3 ante-natal checkups', 'Deliver at government or empanelled hospital', 'Cash incentive transferred to bank account within 7 days'],
    whoShouldApply: 'Every pregnant woman from a low-income family. Register early in pregnancy through your local ASHA worker.',
    match: (p) => p.gender === 'female' && p.lifeStage.includes('pregnant'),
  },
  {
    id: 'pmmvy',
    name: 'PM Matru Vandana Yojana (PMMVY)',
    category: 'women',
    tag: 'Women',
    tagline: 'Maternity benefit for working women',
    ministry: 'Ministry of Women and Child Development',
    launchedDate: '1 January 2017',
    currentStatus: 'Active — Enhanced in 2023 to cover 2nd child (girl)',
    benefitAmount: '₹11,000 for 1st child | ₹6,000 for 2nd child if girl',
    amount: 11000,
    officialWebsite: 'https://pmmvy.wcd.gov.in/',
    applyPortal: 'https://pmmvy.wcd.gov.in/',
    helpline: '181 (Women Helpline)',
    about: 'Provides partial wage compensation to pregnant and lactating women for first live birth, and for second birth if the child is a girl. Benefits transferred directly via DBT in installments.',
    keyBenefits: ['₹5,000 in 3 installments for 1st pregnancy', 'Additional ₹6,000 under JSY for institutional delivery', '₹6,000 for 2nd child if girl (single installment)', 'Direct Bank Transfer — no intermediaries'],
    eligibility: ['Pregnant women and lactating mothers', 'For 1st live birth: All women (except government employees)', 'For 2nd child: Only if girl', 'Age 19+ years'],
    documentsRequired: ['Aadhaar Card of beneficiary and husband', 'Bank account passbook', 'MCP card', 'LMP date certificate', 'Vaccination record of child'],
    howToApply: ['Register at nearest Anganwadi Centre or health facility', 'Fill Form 1-A for registration and 1st installment', 'After 6 months, fill Form 1-B for 2nd installment', 'After child birth and vaccination, fill Form 1-C for 3rd installment', 'Money credited via DBT within 30 days'],
    whoShouldApply: 'Every pregnant woman — especially first-time mothers. If your 2nd child is a girl, you are eligible for additional ₹6,000.',
    match: (p) => p.gender === 'female' && p.lifeStage.includes('pregnant'),
  },
  {
    id: 'apy',
    name: 'Atal Pension Yojana (APY)',
    category: 'pension',
    tag: 'Pension',
    tagline: 'Guaranteed pension for unorganized sector workers',
    ministry: 'Ministry of Finance',
    launchedDate: '9 May 2015',
    currentStatus: 'Active — 5.86 crore+ subscribers as of 2026',
    benefitAmount: '₹1,000–₹5,000 guaranteed monthly pension after age 60',
    amount: 60000,
    officialWebsite: 'https://www.npscra.nsdl.co.in/scheme-details.php',
    applyPortal: 'https://enps.nsdl.com/eNPS/NationalPensionSystem.html',
    helpline: '1800-889-1030 (NSDL toll-free)',
    about: 'Government-guaranteed pension scheme primarily for unorganized sector workers. Based on contribution amount and age of joining, subscribers receive ₹1,000 to ₹5,000 fixed monthly pension after turning 60.',
    keyBenefits: ['Guaranteed monthly pension: ₹1,000 to ₹5,000 (you choose)', 'Government co-contribution of 50% for eligible subscribers', 'Spouse continues pension after subscriber death', 'Tax benefit under Section 80CCD(1B) up to ₹50,000', 'Minimum contribution as low as ₹42/month'],
    eligibility: ['Indian citizen aged 18–40 years', 'Must have a savings bank account', 'Not an income taxpayer (for co-contribution)', 'Not a member of any statutory social security scheme'],
    documentsRequired: ['Aadhaar Card', 'Bank account with Aadhaar seeding', 'Mobile number linked to bank account', 'Nominee details'],
    howToApply: ['Visit your bank branch where you have a savings account', 'Fill APY registration form', 'Choose pension amount (₹1K–5K) and frequency', 'Provide Aadhaar and mobile number', 'Sign auto-debit mandate', 'Bank opens APY account and provides PRAN'],
    whoShouldApply: 'Every worker aged 18–40 without EPF coverage: daily wage workers, domestic help, auto drivers, street vendors, farmers, small shopkeepers.',
    match: (p) => p.age >= 18 && p.age <= 40 && p.bankAccount === 'yes' && !['above25', '10to25'].includes(p.income),
  },
  {
    id: 'ssy',
    name: 'Sukanya Samriddhi Yojana (SSY)',
    category: 'education',
    tag: 'Education',
    tagline: 'Highest government-guaranteed interest for girl child savings',
    ministry: 'Ministry of Finance',
    launchedDate: '22 January 2015',
    currentStatus: 'Active — Interest rate 8.2% p.a. (Jan–Jun 2026)',
    benefitAmount: '8.2% interest (highest among small savings) + EEE tax benefit',
    amount: 150000,
    officialWebsite: 'https://www.india.gov.in/sukanya-samriddhi-yojana',
    applyPortal: 'https://www.indiapost.gov.in/',
    helpline: '1800-266-6868 (India Post)',
    about: 'Small savings scheme for the girl child offering highest interest rate among all government small savings instruments. Triple tax benefit (EEE). Account matures when the girl turns 21.',
    keyBenefits: ['Interest rate: 8.2% p.a. (compounded annually)', 'Tax benefit under Section 80C', 'Interest and maturity amount completely tax-free', 'Minimum deposit: just ₹250/year', 'Partial withdrawal: 50% for higher education after age 18'],
    eligibility: ['Girl child below 10 years of age', 'Only guardian can open account', 'Maximum 2 accounts per family', 'Indian resident girl child only'],
    documentsRequired: ['Birth certificate of girl child', 'Aadhaar Card of guardian', 'Address proof of guardian', 'Passport-size photographs'],
    howToApply: ['Visit nearest Post Office or authorized bank', 'Fill SSY Account Opening Form', 'Submit birth certificate and KYC documents', 'Make initial deposit (minimum ₹250)', 'Receive SSY passbook'],
    whoShouldApply: 'Every parent or guardian of a girl child under 10 years. Start with even ₹250/month — compound interest at 8.2% builds significant wealth by age 21.',
    match: (p) => p.lifeStage.includes('girl-child'),
  },
  {
    id: 'pmjdy',
    name: 'PM Jan Dhan Yojana (PMJDY)',
    category: 'money',
    tag: 'Banking',
    tagline: 'Zero-balance bank account with insurance for every Indian',
    ministry: 'Ministry of Finance',
    launchedDate: '28 August 2014',
    currentStatus: 'Active — 53+ crore accounts opened',
    benefitAmount: '₹2,00,000 accident insurance + ₹30,000 life cover + RuPay card',
    amount: 230000,
    officialWebsite: 'https://pmjdy.gov.in/',
    applyPortal: 'https://pmjdy.gov.in/account',
    helpline: '1800-11-0001 / 1800-180-1111',
    about: 'Financial inclusion scheme providing zero-minimum-balance bank accounts. Foundation for all DBT payments. Accounts include RuPay debit card, accident insurance, life cover, and overdraft facility.',
    keyBenefits: ['Zero minimum balance bank account', 'RuPay debit card with ₹2 lakh accident insurance', 'Life insurance cover of ₹30,000', 'Overdraft facility up to ₹10,000', 'Direct Benefit Transfer for all government subsidies'],
    eligibility: ['Any Indian citizen aged 10+ years', 'No existing bank account', 'Both urban and rural residents'],
    documentsRequired: ['Aadhaar Card (sufficient as single KYC document)', 'OR any two of: Voter ID + PAN Card + Driving Licence', 'Passport-size photograph'],
    howToApply: ['Visit nearest bank branch', 'Request PMJDY account opening form', 'Submit Aadhaar card and photograph', 'Account opened immediately', 'Receive RuPay debit card within 2 weeks'],
    whoShouldApply: 'Every Indian who does not have a bank account. This is the FOUNDATION for receiving benefits from PM-KISAN, LPG subsidy, MGNREGA wages, and virtually every other government scheme.',
    match: (p) => p.bankAccount === 'no',
  },
  {
    id: 'pmkisan',
    name: 'PM-KISAN Samman Nidhi',
    category: 'agriculture',
    tag: 'Agriculture',
    tagline: '₹6,000/year direct income support to farmers',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    launchedDate: '1 December 2018',
    currentStatus: 'Active — 22nd installment released March 2026',
    benefitAmount: '₹6,000 per year in 3 installments of ₹2,000',
    amount: 6000,
    officialWebsite: 'https://pmkisan.gov.in/',
    applyPortal: 'https://pmkisan.gov.in/beneficiarystatus.aspx',
    helpline: '155261 / 011-24300606',
    about: 'Direct income support providing ₹6,000 per year to all landholding farmer families. Over ₹4.27 lakh crore disbursed to 9.32+ crore farmers across 22 installments.',
    keyBenefits: ['₹6,000/year (₹2,000 × 3 installments) directly to bank account', '100% central government funded', 'Both rural and urban farmers eligible', 'Can be used for any purpose', 'e-KYC through face authentication app'],
    eligibility: ['All landholding farmer families with cultivable land', 'NOT eligible: Institutional landholders, MPs, MLAs', 'NOT eligible: Income taxpayers, professionals', 'NOT eligible: Pension recipients receiving ₹10,000+/month'],
    documentsRequired: ['Aadhaar Card (mandatory)', 'Land ownership records', 'Bank account passbook (Aadhaar-seeded)', 'Mobile number linked to Aadhaar'],
    howToApply: ['Visit pmkisan.gov.in → New Farmer Registration', 'Enter Aadhaar number and complete OTP verification', 'Fill personal and land details', 'Upload land ownership documents', 'Enter bank account details', 'Submit — state officer verifies and approves'],
    whoShouldApply: 'Every farmer in India who owns cultivable land. Even if you have 0.5 acre, you are eligible.',
    match: (p) => p.employment === 'farmer' || (p.ownLand !== '' && p.ownLand !== 'no'),
  },
  {
    id: 'pmfby',
    name: 'PM Fasal Bima Yojana (PMFBY)',
    category: 'agriculture',
    tag: 'Agriculture',
    tagline: 'Crop insurance at just 1.5–5% premium',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    launchedDate: '13 January 2016',
    currentStatus: 'Active — Voluntary for all farmers since Kharif 2020',
    benefitAmount: 'Full sum insured at just 1.5–5% farmer premium',
    amount: 200000,
    officialWebsite: 'https://pmfby.gov.in/',
    applyPortal: 'https://pmfby.gov.in/farmerRegistrationForm',
    helpline: '1800-200-7710 (toll-free)',
    about: 'Highly subsidized crop insurance covering natural calamities, pests, and diseases. Government pays 90%+ of actual premium. Claims settled using satellite imagery and drones.',
    keyBenefits: ['Farmer premium: 2% Kharif, 1.5% Rabi, 5% horticulture', 'Government pays remaining premium (often 90%+)', 'Covers natural fire, storm, cyclone, drought, flood, pest attacks', 'Post-harvest loss coverage for up to 14 days', '25% advance claim within 3 weeks of crop loss'],
    eligibility: ['All farmers growing notified crops', 'Landowners AND tenant/sharecropper farmers', 'Both loanee and non-loanee farmers', 'Voluntary enrollment'],
    documentsRequired: ['Aadhaar Card', 'Land records or tenancy agreement', 'Bank account details', 'Sowing certificate', 'KCC loan details (for loanee farmers)'],
    howToApply: ['Visit pmfby.gov.in → Farmer Corner', 'Login with mobile number OTP', 'Select season, state, district, crop details', 'Pay farmer share of premium online', 'In case of crop loss: Intimate within 72 hours'],
    whoShouldApply: 'Every farmer growing any crop. Even small farmers benefit — the government pays 95%+ of the actual premium.',
    match: (p) => p.employment === 'farmer' || (p.ownLand !== '' && p.ownLand !== 'no'),
  },
  {
    id: 'kcc',
    name: 'Kisan Credit Card (KCC)',
    category: 'agriculture',
    tag: 'Agriculture',
    tagline: '₹3 lakh crop loan at just 4% interest',
    ministry: 'Ministry of Agriculture / Ministry of Finance',
    launchedDate: '1998 (revamped 2019)',
    currentStatus: 'Active — Linked with PM-KISAN for saturation drive',
    benefitAmount: 'Crop loan up to ₹3,00,000 at 4% effective interest',
    amount: 300000,
    officialWebsite: 'https://www.pmkisan.gov.in/KCC.aspx',
    applyPortal: 'https://pmkisan.gov.in/',
    helpline: '155261 (PM-KISAN helpline)',
    about: 'Provides farmers with affordable credit for crop production and allied activities. Interest rate is 7% with 3% subvention for timely repayment, making effective rate just 4%.',
    keyBenefits: ['Crop loan up to ₹3 lakh at 4% effective interest', 'Flexible withdrawal using RuPay KCC card at any ATM', 'No collateral required up to ₹1.6 lakh', 'Extended to fisheries and animal husbandry', '5-year validity with annual review'],
    eligibility: ['Any farmer — individual or group', 'PM-KISAN beneficiaries (priority)', 'Fishermen and animal husbandry farmers', 'Age: 18–75 years'],
    documentsRequired: ['Aadhaar Card', 'Land ownership documents', 'Passport-size photograph', 'PM-KISAN registration number (if applicable)'],
    howToApply: ['Visit nearest bank branch', 'Request KCC application form', 'Submit land records, Aadhaar, and photograph', 'Bank processes within 14 days', 'Receive KCC (RuPay card) with credit limit', 'Repay within crop season to get 4% rate'],
    whoShouldApply: 'Every farmer, fisherman, and animal husbandry practitioner.',
    match: (p) => p.employment === 'farmer',
  },
  {
    id: 'mudra',
    name: 'PM Mudra Yojana (PMMY)',
    category: 'business',
    tag: 'Business',
    tagline: 'Collateral-free business loans up to ₹20 lakh',
    ministry: 'Ministry of Finance',
    launchedDate: '8 April 2015',
    currentStatus: 'Active — Tarun Plus category (up to ₹20L) launched 2024',
    benefitAmount: 'Shishu: ₹50K | Kishore: ₹5L | Tarun: ₹10L | Tarun Plus: ₹20L',
    amount: 1000000,
    officialWebsite: 'https://www.mudra.org.in/',
    applyPortal: 'https://www.mudra.org.in/offerings',
    helpline: '1800-11-0001 / 1800-180-1111',
    about: 'Flagship scheme to fund the unfunded — provides collateral-free business loans to micro and small enterprises. Over 52 crore loan accounts sanctioned with total disbursement exceeding ₹30 lakh crore.',
    keyBenefits: ['Zero collateral required', 'No processing fee for Shishu loans', 'Interest rates: 8.5%–12% p.a.', 'Repayment tenure: Up to 7 years', 'Mudra Card for flexible working capital', '0.25% interest concession for women entrepreneurs'],
    eligibility: ['Any Indian citizen with a viable business plan', 'Non-farm micro/small enterprise', 'No defaulter status', 'Women and SC/ST/OBC get priority'],
    documentsRequired: ['Aadhaar / PAN / Voter ID', 'Address Proof', 'Business Proof (Udyam/GST/Trade License)', 'Bank statements (6 months)', 'Business Plan (for Kishore and above)'],
    howToApply: ['Visit mudra.org.in for application form', 'Prepare business plan / project report', 'Visit nearest bank branch with documents', 'Submit filled application', 'Loan sanctioned within 7–14 days', 'Receive Mudra Card or direct disbursement'],
    whoShouldApply: 'Every aspiring or existing small business owner: shop owners, food vendors, auto drivers, salon owners, tailors, traders, manufacturers.',
    match: (p) => ['self-employed', 'business'].includes(p.employment) || p.bizType !== 'none',
  },
  {
    id: 'udyam',
    name: 'Udyam Registration (Free MSME Registration)',
    category: 'business',
    tag: 'Business',
    tagline: 'Free online MSME registration unlocking 50+ benefits',
    ministry: 'Ministry of MSME',
    launchedDate: '1 July 2020',
    currentStatus: 'Active — Fully digital, Aadhaar-based, instant',
    benefitAmount: 'Free registration + access to 50+ government benefits',
    amount: 0,
    officialWebsite: 'https://udyamregistration.gov.in/',
    applyPortal: 'https://udyamregistration.gov.in/Udyam_Registration.aspx',
    helpline: '011-23061176',
    about: 'Free, fully online, Aadhaar-based MSME registration providing lifetime validity and unlocking priority sector lending, government tender preference, subsidy schemes, and more.',
    keyBenefits: ['100% free — no fees', 'Instant registration in 10 minutes', 'Lifetime validity — no renewal', 'Priority sector lending at lower rates', 'Collateral-free loans under CGTMSE up to ₹5 crore', '50% subsidy on patent registration'],
    eligibility: ['Micro: Investment up to ₹1 crore + Turnover up to ₹5 crore', 'Small: Investment up to ₹10 crore + Turnover up to ₹50 crore', 'Medium: Investment up to ₹50 crore + Turnover up to ₹250 crore', 'Both manufacturing and service enterprises'],
    documentsRequired: ['Aadhaar Card (ONLY document needed)', 'PAN Card (auto-verified)', 'GST Number (if applicable)'],
    howToApply: ['Visit udyamregistration.gov.in', 'Enter Aadhaar number and validate with OTP', 'PAN is auto-verified', 'Fill enterprise details', 'Submit — receive URN instantly', 'Download e-certificate with QR code'],
    whoShouldApply: 'EVERY business owner in India. Even a small chai shop or tailoring unit qualifies. Free and gives access to subsidized loans, tenders, and 50+ benefits.',
    match: (p) => ['self-employed', 'business'].includes(p.employment) || ['micro', 'small', 'medium', 'startup'].includes(p.bizType),
  },
  {
    id: 'standup',
    name: 'Stand-Up India',
    category: 'business',
    tag: 'Business',
    tagline: '₹10 lakh–₹1 crore for SC/ST/Women entrepreneurs',
    ministry: 'Ministry of Finance',
    launchedDate: '5 April 2016',
    currentStatus: 'Active — Extended till 2025 and expected to continue',
    benefitAmount: 'Bank loans from ₹10 lakh to ₹1 crore',
    amount: 10000000,
    officialWebsite: 'https://www.standupmitra.in/',
    applyPortal: 'https://www.standupmitra.in/Home/SUISchemes',
    helpline: '1800-180-1111',
    about: 'Facilitates bank loans between ₹10 lakh and ₹1 crore to at least one SC/ST and one Woman entrepreneur per bank branch for setting up new enterprises.',
    keyBenefits: ['Loan amount: ₹10 lakh to ₹1 crore', 'Covers up to 75% of project cost', 'Repayment tenure: up to 7 years', 'Moratorium period: up to 18 months', 'Available at every bank branch'],
    eligibility: ['SC, ST, or Woman entrepreneur (18+ years)', 'Greenfield (new) enterprise only', 'Not a defaulter', 'Manufacturing, services, or trading sector'],
    documentsRequired: ['Aadhaar + PAN Card', 'Caste certificate (for SC/ST)', 'Business plan / Project report', 'Business premises proof', 'Quotation for machinery'],
    howToApply: ['Visit standupmitra.in', 'Register as aspiring entrepreneur', 'Select district and industry type', 'Connect with a bank through the portal', 'Submit business plan and documents', 'Bank processes within 30 days'],
    whoShouldApply: 'Every SC/ST/Woman who wants to start a new business — manufacturing, service, or trading. Get up to ₹1 crore from your nearest bank.',
    match: (p) => (['sc', 'st'].includes(p.category) || p.gender === 'female') && ['self-employed', 'business'].includes(p.employment),
  },
  {
    id: 'pmay-u',
    name: 'PM Awas Yojana — Urban (PMAY-U)',
    category: 'housing',
    tag: 'Housing',
    tagline: 'Interest subsidy up to ₹2.67 lakh for first home',
    ministry: 'Ministry of Housing and Urban Affairs',
    launchedDate: '25 June 2015',
    currentStatus: 'Active — PMAY-U 2.0 launched Sep 2024',
    benefitAmount: 'Interest subsidy: ₹2.67 lakh (EWS/LIG)',
    amount: 267000,
    officialWebsite: 'https://pmaymis.gov.in/',
    applyPortal: 'https://pmaymis.gov.in/Open/Aborting_Link/Online_Application.aspx',
    helpline: '1800-11-6163 (toll-free)',
    about: 'Provides affordable housing for urban poor through interest subsidy on home loans and central assistance for construction. PMAY-U 2.0 targets 1 crore additional urban homes.',
    keyBenefits: ['6.5% interest subsidy on home loans for EWS/LIG', 'NPV of subsidy: up to ₹2,67,280', 'Preference for women ownership', 'PMAY-U 2.0: Additional ₹2.5 lakh for EWS'],
    eligibility: ['EWS: Income up to ₹3,00,000', 'LIG: Income ₹3,00,001–₹6,00,000', 'No pucca house in any family member name', 'First-time home buyer'],
    documentsRequired: ['Aadhaar Card of all family members', 'Income certificate', 'No-pucca-house affidavit', 'Bank account details', 'Property documents'],
    howToApply: ['Visit pmaymis.gov.in', 'Click Citizen Assessment → Select category', 'Enter Aadhaar for verification', 'Fill application form', 'Submit — ULB verifies and approves'],
    whoShouldApply: 'Every urban resident who does not own a pucca house with family income under ₹6 lakh.',
    match: (p) => ['urban', 'semi-urban'].includes(p.area) && p.ownHouse !== 'yes' && ['below1', '1to2.5', '2.5to5'].includes(p.income),
  },
  {
    id: 'pmay-g',
    name: 'PM Awas Yojana — Gramin (PMAY-G)',
    category: 'housing',
    tag: 'Housing',
    tagline: '₹1.20–₹1.30 lakh for pucca house in rural areas',
    ministry: 'Ministry of Rural Development',
    launchedDate: '20 November 2016',
    currentStatus: 'Active — 3.21 crore houses sanctioned',
    benefitAmount: '₹1,20,000 (plains) / ₹1,30,000 (hilly areas) + MGNREGA wages',
    amount: 130000,
    officialWebsite: 'https://pmayg.nic.in/',
    applyPortal: 'https://pmayg.nic.in/netiayHome/home.aspx',
    helpline: '1800-11-6446 (toll-free)',
    about: 'Financial assistance for construction of pucca houses for rural poor. Additional ₹12,000 for toilet under SBM. 90 days MGNREGA wages for construction labour.',
    keyBenefits: ['₹1,20,000 (plains) / ₹1,30,000 (hilly areas)', 'Additional ₹12,000 for toilet under SBM', '90 days MGNREGA wages (₹25,000–30,000 additional)', 'Minimum 25 sq.m. carpet area', 'House in joint name of husband and wife'],
    eligibility: ['Rural household in SECC-2011 list', 'Houseless or living in kutcha house', 'No motorized vehicle, no government employee', 'SC/ST households get priority'],
    documentsRequired: ['Aadhaar Card of beneficiary and spouse', 'Bank account details (for DBT)', 'Land ownership document or Gram Panchayat certificate', 'Job card (MGNREGA)'],
    howToApply: ['Beneficiaries identified from SECC-2011 list', 'List approved by Gram Sabha', 'Block/District office issues sanction order', '1st installment (₹40,000) after foundation', '2nd installment after lintel level', '3rd installment after completion + toilet'],
    whoShouldApply: 'Every rural family living in a kutcha house or without a house.',
    match: (p) => p.area === 'rural' && (p.ownHouse === 'no' || p.ownHouse === 'kutcha') && ['below1', '1to2.5'].includes(p.income),
  },
  {
    id: 'pmjjby',
    name: 'PM Jeevan Jyoti Bima Yojana (PMJJBY)',
    category: 'insurance',
    tag: 'Insurance',
    tagline: '₹2 lakh life insurance at just ₹436/year',
    ministry: 'Ministry of Finance',
    launchedDate: '9 May 2015',
    currentStatus: 'Active — Premium ₹436/year from June 2022',
    benefitAmount: '₹2,00,000 life insurance cover',
    amount: 200000,
    officialWebsite: 'https://jansuraksha.gov.in/',
    applyPortal: 'https://jansuraksha.gov.in/',
    helpline: '1800-180-1111 / 1800-11-0001',
    about: "World's cheapest life insurance. ₹2 lakh life cover for ₹436 per year (₹1.19/day). Covers death due to any reason. Auto-renewed annually.",
    keyBenefits: ['₹2,00,000 life cover for death due to any cause', 'Premium: Just ₹436/year (auto-debited)', 'No medical examination required', 'Auto-renewal — no need to re-apply', 'Coverage continues even if you change job or bank'],
    eligibility: ['Indian citizen aged 18–50 years', 'Must have a savings bank account', 'One policy per person'],
    documentsRequired: ['Bank account passbook', 'Aadhaar Card', 'Consent form for auto-debit', 'Nominee declaration form'],
    howToApply: ['Visit your bank branch', 'Fill 1-page PMJJBY enrollment form', 'Declare nominee details', 'Sign auto-debit consent for ₹436/year', 'Premium auto-debited on 31 May each year'],
    whoShouldApply: 'Every Indian aged 18–50 with a bank account. For just ₹36/month, your family gets ₹2 lakh if anything happens to you.',
    match: (p) => p.age >= 18 && p.age <= 50 && p.bankAccount === 'yes',
  },
  {
    id: 'pmsby',
    name: 'PM Suraksha Bima Yojana (PMSBY)',
    category: 'insurance',
    tag: 'Insurance',
    tagline: '₹2 lakh accident insurance at just ₹20/year',
    ministry: 'Ministry of Finance',
    launchedDate: '9 May 2015',
    currentStatus: 'Active — Premium ₹20/year from June 2022',
    benefitAmount: '₹2,00,000 (death/total disability) | ₹1,00,000 (partial disability)',
    amount: 200000,
    officialWebsite: 'https://jansuraksha.gov.in/',
    applyPortal: 'https://jansuraksha.gov.in/',
    helpline: '1800-180-1111 / 1800-11-0001',
    about: 'Accidental death and disability insurance at just ₹20 per year. Covers death or disability due to accidents of all types.',
    keyBenefits: ['₹2 lakh for accidental death', '₹2 lakh for total permanent disability', '₹1 lakh for partial permanent disability', 'Premium: Just ₹20/year', 'No medical exam required'],
    eligibility: ['Indian citizen aged 18–70 years', 'Must have a savings bank account', 'One policy per person'],
    documentsRequired: ['Bank account passbook', 'Aadhaar Card', 'Enrollment form with nominee details'],
    howToApply: ['Visit bank branch with savings account', 'Fill 1-page PMSBY enrollment form', 'Sign auto-debit consent', 'Premium of ₹20 debited on 1 June each year'],
    whoShouldApply: 'Every Indian aged 18–70. At ₹20/year, there is absolutely no reason not to have this.',
    match: (p) => p.age >= 18 && p.age <= 70 && p.bankAccount === 'yes',
  },
  {
    id: 'mgnrega',
    name: 'MGNREGA (100 Days Employment Guarantee)',
    category: 'money',
    tag: 'Employment',
    tagline: '100 days guaranteed employment for every rural household',
    ministry: 'Ministry of Rural Development',
    launchedDate: '2 February 2006',
    currentStatus: 'Active — Wage rates ₹267–₹374/day (2025-26)',
    benefitAmount: '100 days guaranteed employment at ₹267–₹374/day',
    amount: 37400,
    officialWebsite: 'https://nrega.nic.in/',
    applyPortal: 'https://nrega.nic.in/Netnrega/stHome.aspx',
    helpline: '1800-111-555 (toll-free)',
    about: 'Legal guarantee of 100 days of wage employment per year to every rural household. If work not provided within 15 days, unemployment allowance must be paid. Covers ~7 crore active workers annually.',
    keyBenefits: ['100 days guaranteed employment per household per year', 'Wage rate: ₹267–₹374/day (state-wise)', 'Work must be provided within 15 days', 'Work within 5 km radius of village', 'At least 33% of workers must be women', 'Compensation for delay in wage payment'],
    eligibility: ['Any adult member of a rural household', 'Must be willing to do unskilled manual work', 'No education, income, or caste restriction', 'Age: 18+ years'],
    documentsRequired: ['Application for Job Card at Gram Panchayat', 'Photograph of household members', 'Aadhaar Card linked to bank account', 'Bank account passbook'],
    howToApply: ['Visit Gram Panchayat and apply for Job Card', 'Job Card issued within 15 days', 'Submit written application demanding work', 'Dated receipt must be given', 'Work allotted within 15 days', 'Wages deposited in bank account within 15 days of work'],
    whoShouldApply: 'Every rural adult who needs employment. It is your LEGAL RIGHT — not a favour.',
    match: (p) => p.area === 'rural' && p.age >= 18 && ['below1', '1to2.5', '2.5to5'].includes(p.income),
  },
  {
    id: 'pmkvy',
    name: 'PM Kaushal Vikas Yojana (PMKVY 4.0)',
    category: 'education',
    tag: 'Skill Training',
    tagline: 'Free skill training + ₹8,000 reward + placement support',
    ministry: 'Ministry of Skill Development & Entrepreneurship',
    launchedDate: '2015 (PMKVY 4.0: 2024–2026)',
    currentStatus: 'Active — PMKVY 4.0 with industry partnership model',
    benefitAmount: 'Free training + ₹8,000 completion reward + certification',
    amount: 8000,
    officialWebsite: 'https://www.pmkvyofficial.org/',
    applyPortal: 'https://skillindia.nsdcindia.org/',
    helpline: '1800-123-9626 (NSDC toll-free)',
    about: "India's largest skill development programme providing free short-term training in 40+ sectors with NSQF certification, ₹8,000 cash reward, and placement support.",
    keyBenefits: ['Completely free skill training', 'Training duration: 150–300 hours (2–6 months)', '40+ sectors: IT, healthcare, beauty, auto, construction, retail', 'NSQF certification', '₹8,000 reward on completion', 'Placement assistance'],
    eligibility: ['Any Indian citizen aged 15–59 years', 'No minimum education for most courses', 'Aadhaar card mandatory', 'Women, SC/ST, PwD get priority'],
    documentsRequired: ['Aadhaar Card', 'Any photo ID', 'Bank account details', 'Passport-size photographs'],
    howToApply: ['Visit skillindia.gov.in or pmkvyofficial.org', 'Find a training centre near you', 'Visit and register with Aadhaar', 'Attend training (150–300 hours)', 'Pass assessment exam', 'Receive certification and ₹8,000 reward'],
    whoShouldApply: 'Every unemployed or underemployed youth aged 15–59. Whether school dropout or graduate, free skill training can change your career.',
    match: (p) => p.age >= 15 && p.age <= 59 && (p.employment === 'unemployed' || p.needs.includes('skill') || p.needs.includes('employment')),
  },
  {
    id: 'ujjwala',
    name: 'Ujjwala 2.0 (PM Ujjwala Yojana)',
    category: 'women',
    tag: 'Women',
    tagline: 'Free LPG connection for women from poor households',
    ministry: 'Ministry of Petroleum & Natural Gas',
    launchedDate: '1 May 2016',
    currentStatus: 'Active — 10.35 crore connections released',
    benefitAmount: 'Free LPG connection + 1st refill + hot plate (~₹3,200 value)',
    amount: 3200,
    officialWebsite: 'https://www.pmuy.gov.in/',
    applyPortal: 'https://www.pmuy.gov.in/ujjwala2.html',
    helpline: '1800-233-3555 (Bharat Gas) / 1800-2333-555 (Indane)',
    about: 'Provides free LPG connections to adult women of poor households. Ujjwala 2.0 simplified the process: no address proof needed, first refill and hot plate provided free.',
    keyBenefits: ['Free deposit-free LPG connection', 'Free first LPG refill (₹900+ value)', 'Free hot plate (improved stove)', 'No address proof needed — self-declaration accepted', 'Subsequent refill subsidy via DBT'],
    eligibility: ['Adult woman of the household (18+ years)', 'No existing LPG connection', 'BPL / Low-income household', 'Aadhaar and bank account required'],
    documentsRequired: ['Aadhaar Card', 'Bank account passbook', 'Ration Card (if available)', 'Passport-size photograph', 'Self-declaration of address'],
    howToApply: ['Visit nearest LPG distributor (HP, Bharat, Indane)', 'Request Ujjwala 2.0 application form', 'Fill form with Aadhaar and bank details', 'Submit — connection issued within 7–14 days', 'Receive free connection + 1st refill + hot plate'],
    whoShouldApply: 'Every woman from a poor household who still cooks on chulha. Apply at your nearest gas agency — completely free.',
    match: (p) => p.gender === 'female' && p.special.includes('no-gas') && ['below1', '1to2.5'].includes(p.income),
  },
  {
    id: 'pmgkay',
    name: 'PM Garib Kalyan Anna Yojana (PMGKAY/NFSA)',
    category: 'money',
    tag: 'Food Security',
    tagline: '5 kg free food grains per person per month',
    ministry: 'Ministry of Consumer Affairs, Food & Public Distribution',
    launchedDate: 'NFSA: 2013 | PMGKAY: 2020 | Extended 2024',
    currentStatus: 'Active — Free food grains extended till Dec 2028',
    benefitAmount: '5 kg free rice/wheat/coarse grains per person per month',
    amount: 12000,
    officialWebsite: 'https://nfsa.gov.in/',
    applyPortal: 'https://nfsa.gov.in/public/FPS',
    helpline: '1800-112-000',
    about: 'Provides free food grains to 81.35 crore beneficiaries. 5 kg/person/month permanently free. Antyodaya families get 35 kg per household per month.',
    keyBenefits: ['5 kg free rice/wheat per person per month', '35 kg per household for Antyodaya families', 'Completely FREE — ₹0 cost', '5.4 lakh+ Fair Price Shops', 'Portability: Use ration card at any FPS in India'],
    eligibility: ['Families identified under NFSA by state governments', 'Existing PHH/AAY ration card holders', 'New cards: Apply to state Food department'],
    documentsRequired: ['Ration Card (PHH or AAY category)', 'Aadhaar Card (for biometric authentication)', 'If no ration card: Apply with address and income proof'],
    howToApply: ['Visit nearest Fair Price Shop (ration shop)', 'Authenticate with Aadhaar biometric', 'Receive monthly food grains — FREE', 'If no ration card: Apply at state Food & Civil Supplies office'],
    whoShouldApply: 'Every low-income family. If you do not have a ration card, apply immediately.',
    match: (p) => ['below1', '1to2.5'].includes(p.income),
  },
  {
    id: 'nsp',
    name: 'National Scholarship Portal (NSP)',
    category: 'education',
    tag: 'Education',
    tagline: '100+ scholarships from one portal — ₹12,000 to ₹3 lakh/year',
    ministry: 'Ministry of Electronics & IT / Multiple ministries',
    launchedDate: '2015',
    currentStatus: 'Active — 2025-26 applications open',
    benefitAmount: '₹12,000 to ₹3,00,000+ per year depending on scheme',
    amount: 300000,
    officialWebsite: 'https://scholarships.gov.in/',
    applyPortal: 'https://scholarships.gov.in/',
    helpline: '0120-6619540 / helpdesk@nsp.gov.in',
    about: 'One-stop portal hosting 100+ central and state scholarship schemes. Covers pre-matric, post-matric, merit-cum-means, minority, disability scholarships. Over 2.5 crore students benefit annually.',
    keyBenefits: ['100+ scholarship schemes on one portal', 'Covers SC, ST, OBC, Minority, EWS, PwD, merit students', 'Tuition fee reimbursement + maintenance allowance', 'Direct bank transfer', 'Can apply for multiple scholarships'],
    eligibility: ['Student of recognized institution', 'Family income below threshold (varies: ₹2L to ₹8L)', 'Minimum marks in previous exam (usually 50–60%)', 'Category-specific criteria'],
    documentsRequired: ['Aadhaar Card', 'Income certificate', 'Caste/Minority certificate (if applicable)', 'Previous year marksheet', 'Bonafide certificate from institution', 'Bank account in student name'],
    howToApply: ['Visit scholarships.gov.in', 'Register with name, DOB, mobile, email', 'Login and click Fresh Application', 'Select applicable scholarship scheme', 'Fill personal, academic, and income details', 'Upload documents and submit', 'Institute and district verify and approve'],
    whoShouldApply: 'Every student from SC/ST/OBC/Minority/EWS/PwD background. Apply annually — deadlines are usually August–November.',
    match: (p) => (p.employment === 'student' || p.needs.includes('education')) && !['above25', '10to25'].includes(p.income),
  },
  {
    id: 'vishwakarma',
    name: 'PM Vishwakarma Yojana',
    category: 'business',
    tag: 'Artisans',
    tagline: 'Skill training + ₹3 lakh loan at 5% for traditional artisans',
    ministry: 'Ministry of Micro, Small and Medium Enterprises',
    launchedDate: '17 September 2023',
    currentStatus: 'Active — ₹13,000 crore scheme for 5 years (2023–2028)',
    benefitAmount: '₹1L + ₹2L loan at 5% + free training + ₹500/day stipend + ₹15,000 toolkit',
    amount: 315000,
    officialWebsite: 'https://pmvishwakarma.gov.in/',
    applyPortal: 'https://pmvishwakarma.gov.in/',
    helpline: '18002677777 / 17923',
    about: 'Comprehensive scheme for traditional artisans and craftspeople covering 18 trades. Provides skill training, toolkit incentive, collateral-free credit at 5%, digital payments incentive, and marketing support.',
    keyBenefits: ['PM Vishwakarma Certificate and ID Card', 'Skill Training: Basic (5 days) + Advanced (15 days)', 'Training Stipend: ₹500/day', 'Toolkit Incentive: ₹15,000', 'Credit: ₹1L + ₹2L at 5% interest', 'No collateral required', 'Digital Payments Incentive: ₹1 per transaction'],
    eligibility: [
      'Artisan/craftsperson in one of 18 trades',
      '18 Trades: Carpenter, Blacksmith, Goldsmith, Potter, Sculptor, Cobbler, Mason, Tailor, Barber, Washerman, Basket Maker, Doll Maker, Boat Maker, Locksmith, Fishing Net Maker, Garland Maker, Armourer, Hammer & Tool Kit Maker',
      'Age: 18+ years',
      'Not in government employment',
      'One member per family',
    ],
    documentsRequired: ['Aadhaar Card', 'Mobile number linked to Aadhaar', 'Bank account details', 'Self-declaration of trade', 'Verification by Gram Panchayat / ULB'],
    howToApply: ['Visit pmvishwakarma.gov.in', 'Register with Aadhaar and verify via OTP', 'Fill personal, trade, and bank details', 'Application forwarded to Gram Panchayat/ULB', 'Once verified, receive Certificate & ID Card', 'Enroll in skill training', 'Receive ₹15,000 toolkit incentive', 'Apply for ₹1 lakh loan at 5%'],
    whoShouldApply: 'Every traditional artisan — carpenters, blacksmiths, potters, tailors, cobblers, goldsmiths, barbers, masons, etc. This is NOT caste-based — anyone in these 18 trades qualifies.',
    match: (p) => ['self-employed'].includes(p.employment) && !['above25', '10to25'].includes(p.income),
  },
];

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry',
];

export const CATEGORY_META: Record<string, { icon: string; label: string; tagClass: string; cardClass: string }> = {
  money: { icon: '💰', label: 'Financial', tagClass: 'bg-amber-100 text-amber-700', cardClass: 'border-l-amber-500' },
  health: { icon: '🏥', label: 'Healthcare', tagClass: 'bg-red-100 text-red-700', cardClass: 'border-l-red-500' },
  housing: { icon: '🏠', label: 'Housing', tagClass: 'bg-indigo-100 text-indigo-700', cardClass: 'border-l-indigo-500' },
  education: { icon: '📚', label: 'Education', tagClass: 'bg-blue-100 text-blue-700', cardClass: 'border-l-blue-500' },
  business: { icon: '🚀', label: 'Business', tagClass: 'bg-emerald-100 text-emerald-700', cardClass: 'border-l-emerald-500' },
  insurance: { icon: '🛡️', label: 'Insurance', tagClass: 'bg-pink-100 text-pink-700', cardClass: 'border-l-pink-500' },
  agriculture: { icon: '🌾', label: 'Agriculture', tagClass: 'bg-green-100 text-green-700', cardClass: 'border-l-green-500' },
  women: { icon: '👩', label: 'Women', tagClass: 'bg-fuchsia-100 text-fuchsia-700', cardClass: 'border-l-fuchsia-500' },
  senior: { icon: '👴', label: 'Senior', tagClass: 'bg-purple-100 text-purple-700', cardClass: 'border-l-purple-500' },
  pension: { icon: '📅', label: 'Pension', tagClass: 'bg-orange-100 text-orange-700', cardClass: 'border-l-orange-500' },
  digital: { icon: '💻', label: 'Digital', tagClass: 'bg-cyan-100 text-cyan-700', cardClass: 'border-l-cyan-500' },
  sports: { icon: '🏅', label: 'Sports', tagClass: 'bg-yellow-100 text-yellow-700', cardClass: 'border-l-yellow-500' },
  youth: { icon: '🧑‍🎓', label: 'Youth', tagClass: 'bg-violet-100 text-violet-700', cardClass: 'border-l-violet-500' },
  environment: { icon: '🌿', label: 'Environment', tagClass: 'bg-lime-100 text-lime-700', cardClass: 'border-l-lime-500' },
  minority: { icon: '🤝', label: 'Minority', tagClass: 'bg-teal-100 text-teal-700', cardClass: 'border-l-teal-500' },
  water: { icon: '💧', label: 'Water', tagClass: 'bg-sky-100 text-sky-700', cardClass: 'border-l-sky-500' },
  sanitation: { icon: '🧹', label: 'Sanitation', tagClass: 'bg-stone-100 text-stone-700', cardClass: 'border-l-stone-500' },
  tourism: { icon: '✈️', label: 'Tourism', tagClass: 'bg-rose-100 text-rose-700', cardClass: 'border-l-rose-500' },
  tribal: { icon: '🏔️', label: 'Tribal', tagClass: 'bg-amber-100 text-amber-800', cardClass: 'border-l-amber-600' },
};

/* ─── Extra scheme data (compact JS files) ─── */
// @ts-ignore — JS data file, no .d.ts needed
import { CENTRAL_SCHEMES_1 } from './Central_Schemes_Part1.js';
// @ts-ignore — JS data file, no .d.ts needed
import { CENTRAL_SCHEMES_2 } from './Central_Schemes_Part2.js';
// @ts-ignore — JS data file, no .d.ts needed
import { CENTRAL_SCHEMES_3 } from './Central_Schemes_Part3.js';
// @ts-ignore — JS data file, no .d.ts needed
import { CENTRAL_SCHEMES_4 } from './Central_Schemes_Part4.js';
// @ts-ignore — JS data file, no .d.ts needed
import { CENTRAL_SCHEMES_5 } from './Central_Schemes_Part5.js';
// @ts-ignore — JS data file, no .d.ts needed
import { TN_SCHEMES } from './TN_Schemes_Database.js';
// @ts-ignore — JS data file, no .d.ts needed
import { STATE_SCHEMES_1 } from './State_Schemes_Part1.js';
// @ts-ignore — JS data file, no .d.ts needed
import { STATE_SCHEMES_2 } from './State_Schemes_Part2.js';
// @ts-ignore — JS data file, no .d.ts needed
import { STATE_SCHEMES_3 } from './State_Schemes_Part3.js';
// @ts-ignore — JS data file, no .d.ts needed
import { STATE_SCHEMES_4 } from './State_Schemes_Part4.js';
// @ts-ignore — JS data file, no .d.ts needed
import { STATE_SCHEMES_5 } from './State_Schemes_Part5.js';

/** Map a compact central-scheme object → GovtScheme */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCentralScheme(s: any, idx: number): GovtScheme {
  return {
    id: `ext-c-${idx}`,
    name: s.name,
    category: s.cat ?? s.category ?? 'money',
    tag: s.tag ?? 'General',
    tagline: (s.benefit ?? '').slice(0, 80),
    ministry: 'Government of India',
    launchedDate: '-',
    currentStatus: 'Active',
    benefitAmount: s.benefit ?? '-',
    amount: s.amt ?? s.amount ?? 0,
    officialWebsite: s.link ?? s.officialLink ?? '#',
    applyPortal: s.link ?? s.officialLink ?? '#',
    helpline: s.helpline ?? '-',
    about: s.desc ?? '',
    keyBenefits: [s.benefit ?? ''],
    eligibility: s.elig ?? s.eligibility ?? [],
    documentsRequired: s.docs ?? s.docsRequired ?? [],
    howToApply: s.apply ?? s.howToApply ?? [],
    whoShouldApply: (s.elig ?? s.eligibility ?? []).join('. '),
    match: s.match,
  };
}

/** Map a state-scheme object → GovtScheme (derives state from name) */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapStateScheme(s: any, idx: number): GovtScheme {
  // Try to guess state from the scheme name prefix
  const n = (s.name ?? '') as string;
  let ministry = 'State Government';
  const stateMap: Record<string, string> = {
    'Karnataka': 'Government of Karnataka', 'Maharashtra': 'Government of Maharashtra',
    'Gujarat': 'Government of Gujarat', 'Rajasthan': 'Government of Rajasthan',
    'UP ': 'Government of Uttar Pradesh', 'Bihar': 'Government of Bihar',
    'MP ': 'Government of Madhya Pradesh', 'West Bengal': 'Government of West Bengal',
    'WB ': 'Government of West Bengal', 'Kerala': 'Government of Kerala',
    'AP ': 'Government of Andhra Pradesh', 'Telangana': 'Government of Telangana',
    'Odisha': 'Government of Odisha', 'Haryana': 'Government of Haryana',
    'Punjab': 'Government of Punjab', 'Jharkhand': 'Government of Jharkhand',
    'Chhattisgarh': 'Government of Chhattisgarh', 'Assam': 'Government of Assam',
    'Himachal': 'Government of Himachal Pradesh', 'Uttarakhand': 'Government of Uttarakhand',
    'Goa': 'Government of Goa', 'TN ': 'Government of Tamil Nadu',
    'Tamil Nadu': 'Government of Tamil Nadu', 'Delhi': 'Government of Delhi',
    'J&K': 'Government of J&K', 'Manipur': 'Government of Manipur',
    'Nagaland': 'Government of Nagaland', 'Mizoram': 'Government of Mizoram',
    'Sikkim': 'Government of Sikkim', 'Arunachal': 'Government of Arunachal Pradesh',
    'Tripura': 'Government of Tripura', 'Meghalaya': 'Government of Meghalaya',
    'Mukhyamantri': 'State Government', 'Ladli': 'State Government',
  };
  for (const [key, val] of Object.entries(stateMap)) {
    if (n.includes(key) || n.startsWith(key)) { ministry = val; break; }
  }
  return {
    id: `ext-st-${idx}`,
    name: s.name,
    category: s.cat ?? s.category ?? 'social',
    tag: s.tag ?? 'State',
    tagline: (s.benefit ?? '').slice(0, 80),
    ministry,
    launchedDate: '-',
    currentStatus: 'Active',
    benefitAmount: s.benefit ?? '-',
    amount: s.amt ?? s.amount ?? 0,
    officialWebsite: s.link ?? '#',
    applyPortal: s.link ?? '#',
    helpline: s.helpline ?? '-',
    about: s.desc ?? '',
    keyBenefits: [s.benefit ?? ''],
    eligibility: s.elig ?? [],
    documentsRequired: s.docs ?? [],
    howToApply: s.apply ?? [],
    whoShouldApply: (s.elig ?? []).join('. '),
    match: s.match,
  };
}

/** Map a TN state-scheme object → GovtScheme */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTNScheme(s: any, idx: number): GovtScheme {
  return {
    id: `ext-tn-${idx}`,
    name: s.name,
    category: s.category ?? 'money',
    tag: s.tag ?? 'General',
    tagline: (s.benefit ?? '').slice(0, 80),
    ministry: `Tamil Nadu — ${s.state ?? 'State Government'}`,
    launchedDate: '-',
    currentStatus: 'Active',
    benefitAmount: s.benefit ?? '-',
    amount: s.amount ?? 0,
    officialWebsite: s.officialLink ?? '#',
    applyPortal: s.officialLink ?? '#',
    helpline: s.helpline ?? '-',
    about: s.desc ?? '',
    keyBenefits: [s.benefit ?? ''],
    eligibility: s.eligibility ?? [],
    documentsRequired: s.docsRequired ?? [],
    howToApply: s.howToApply ?? [],
    whoShouldApply: (s.eligibility ?? []).join('. '),
    match: s.match,
  };
}

/* Merge: deduplicate by normalised name */
const _existingNames = new Set(GOVT_SCHEMES.map((s) => s.name.toLowerCase().trim()));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _allCentralExtras: any[] = [...(CENTRAL_SCHEMES_1 ?? []), ...(CENTRAL_SCHEMES_2 ?? []), ...(CENTRAL_SCHEMES_3 ?? []), ...(CENTRAL_SCHEMES_4 ?? []), ...(CENTRAL_SCHEMES_5 ?? []), ...(TN_SCHEMES ?? [])];
_allCentralExtras.forEach((raw, i) => {
  const n = (raw.name ?? '').toLowerCase().trim();
  if (n && !_existingNames.has(n)) {
    _existingNames.add(n);
    const mapped = raw.state ? mapTNScheme(raw, i) : mapCentralScheme(raw, i);
    GOVT_SCHEMES.push(mapped);
  }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _allStateExtras: any[] = [...(STATE_SCHEMES_1 ?? []), ...(STATE_SCHEMES_2 ?? []), ...(STATE_SCHEMES_3 ?? []), ...(STATE_SCHEMES_4 ?? []), ...(STATE_SCHEMES_5 ?? [])];
_allStateExtras.forEach((raw, i) => {
  const n = (raw.name ?? '').toLowerCase().trim();
  if (n && !_existingNames.has(n)) {
    _existingNames.add(n);
    GOVT_SCHEMES.push(mapStateScheme(raw, 1000 + i));
  }
});
