// ═══════════════════════════════════════════════════════════════
// MERA HAQ — TAMIL NADU STATE SCHEMES DATABASE
// Last Updated: March 2026 | Source: tn.gov.in, myscheme.gov.in
// ═══════════════════════════════════════════════════════════════
// USAGE: Import this file and merge with your existing SCHEMES array
// Each scheme has: name, category, tag, benefit, desc, eligibility[],
// docsRequired[], howToApply[], officialLink, helpline, amount (₹ value for sorting),
// match(profile) function for eligibility matching
// ═══════════════════════════════════════════════════════════════

export const TN_SCHEMES = [

// ─── WOMEN EMPOWERMENT ───
{
  name: "Kalaignar Magalir Urimai Thogai Scheme",
  state: "Tamil Nadu",
  category: "women",
  tag: "Women",
  benefit: "₹1,000/month (₹12,000/year) direct cash transfer to women",
  desc: "Landmark women empowerment scheme providing ₹1,000 monthly to women heads of households. Over 1.15 crore women enrolled. Amount credited via DBT. One of the largest state-level women welfare programmes in India. ₹7,000 crore annual budget.",
  eligibility: [
    "Woman resident of Tamil Nadu aged 21+ years",
    "Head of household (one woman per ration card)",
    "Annual family income below ₹2.5 lakh",
    "Family land: max 5 acres wet / 10 acres dry",
    "Household electricity consumption below 3,600 units/year",
    "NOT eligible: Government employees, income tax payers, four-wheeler owners, professional tax payers above ₹2.5L"
  ],
  docsRequired: ["Aadhaar Card", "Ration Card (family head name)", "Bank Account Passbook", "Income Certificate", "Mobile number linked to Aadhaar", "Widow: Husband's death certificate"],
  howToApply: [
    "Visit kmut.tn.gov.in",
    "Login or create account with mobile number",
    "Fill application with personal and ration card details",
    "Upload documents",
    "Submit — verification by local officials",
    "OR visit nearest Ration Shop for offline application",
    "Status check: kmut.tnega.org",
    "Grievance portal: kmut.tnega.org/kmut-grievance"
  ],
  officialLink: "https://kmut.tn.gov.in/",
  helpline: "044-25619208",
  amount: 12000,
  match: p => p.state === "Tamil Nadu" && p.gender === "female" && p.age >= 21 && !["above25", "10to25"].includes(p.income)
},
{
  name: "Pudhumai Penn Scheme (Moovalur Ramamirtham Ammaiyar)",
  state: "Tamil Nadu",
  category: "education",
  tag: "Education",
  benefit: "₹1,000/month to girl students of government schools pursuing higher education",
  desc: "Monthly financial assistance of ₹1,000 to girl students who studied Class 6-12 in government schools and are now pursuing higher education (degree, diploma, professional courses). Aims to prevent girls from dropping out after school. Credited directly to student's bank account.",
  eligibility: [
    "Girl student who studied Class 6-12 entirely in Tamil Nadu government schools",
    "Currently pursuing UG degree, diploma, or professional course",
    "Enrolled in recognized college/institution in Tamil Nadu",
    "No income limit — available to all eligible girl students",
    "Must maintain minimum attendance"
  ],
  docsRequired: ["Aadhaar Card", "School Transfer Certificate (TC) from govt school", "College admission letter / bonafide certificate", "Bank account passbook (in student's name)", "Community certificate", "Passport-size photograph"],
  howToApply: [
    "Apply through the college — institution submits applications collectively",
    "OR visit tnesevai.tn.gov.in for online application",
    "Submit TC, admission proof, and bank details",
    "Verification by District Education Office",
    "Amount credited monthly to bank account"
  ],
  officialLink: "https://penkalvi.tn.gov.in/",
  helpline: "044-25672790",
  amount: 12000,
  match: p => p.state === "Tamil Nadu" && p.gender === "female" && p.employment === "student"
},
{
  name: "TN Free Bus Travel for Women (Vidiyal Payanam)",
  state: "Tamil Nadu",
  category: "women",
  tag: "Women",
  benefit: "100% free bus travel for all women in TN government buses",
  desc: "All women can travel free of cost in ordinary and express government buses operated by TNSTC, MTC, SETC, and other state transport corporations. No ticket required — just board and travel. Covers intra-city and inter-city state transport buses.",
  eligibility: [
    "All women residents and visitors in Tamil Nadu",
    "No age limit, no income limit",
    "Valid on ordinary, express, and town buses",
    "NOT valid on deluxe, AC, or ultra-deluxe buses"
  ],
  docsRequired: ["No documents needed — just board the bus"],
  howToApply: ["No application required", "Simply board any TN government ordinary/express bus", "Conductor will not issue ticket for women passengers"],
  officialLink: "https://www.tnstc.in/",
  helpline: "044-25361925",
  amount: 0,
  match: p => p.state === "Tamil Nadu" && p.gender === "female"
},

// ─── EDUCATION ───
{
  name: "TN Free Laptop Scheme for College Students",
  state: "Tamil Nadu",
  category: "education",
  tag: "Education",
  benefit: "Free laptop/tablet to government college students",
  desc: "Free laptops distributed to students joining government arts, science, engineering, and polytechnic colleges. 20 lakh students to receive laptops/tablets by 2026. Helps bridge the digital divide for students from economically weaker backgrounds.",
  eligibility: [
    "Students admitted to Tamil Nadu government/government-aided colleges",
    "Arts, Science, Engineering, Polytechnic, Law, Medical streams",
    "First-year UG and diploma students (primary beneficiaries)",
    "Must have passed qualifying exam from TN state board or equivalent"
  ],
  docsRequired: ["College admission letter", "Aadhaar Card", "Community certificate", "Income certificate", "10th/12th marksheet", "College bonafide certificate"],
  howToApply: ["Laptops distributed through colleges — no separate application needed", "College administration coordinates distribution", "Students may need to sign receipt and acknowledgement", "Distribution usually happens during academic year beginning"],
  officialLink: "https://www.tn.gov.in/",
  helpline: "044-28272047 (Higher Education Dept)",
  amount: 25000,
  match: p => p.state === "Tamil Nadu" && p.employment === "student"
},
{
  name: "TN Free Tablet Scheme for School Students",
  state: "Tamil Nadu",
  category: "education",
  tag: "Education",
  benefit: "Free tablets to government school students (Class 6-8)",
  desc: "Free tablet computers distributed to students in Classes 6-8 studying in Tamil Nadu government schools. Pre-loaded with educational content, textbooks, and learning apps. Aims to introduce digital learning at middle school level.",
  eligibility: ["Students studying in Class 6, 7, or 8 in TN government schools", "All government school students — no income restriction"],
  docsRequired: ["School ID card", "Parent/Guardian's Aadhaar", "No separate application — distributed through schools"],
  howToApply: ["Distributed directly through schools", "School headmaster coordinates distribution", "Students sign acknowledgement receipt"],
  officialLink: "https://www.tn.gov.in/",
  helpline: "044-28272047",
  amount: 15000,
  match: p => p.state === "Tamil Nadu" && p.employment === "student"
},
{
  name: "CM's Breakfast Scheme for Primary School Students",
  state: "Tamil Nadu",
  category: "education",
  tag: "Education",
  benefit: "Free nutritious breakfast for government primary school students",
  desc: "Free nutritious breakfast provided to all students in Classes 1-5 in government schools across Tamil Nadu. Each breakfast provides energy (500 kcal), protein (20g), fat, iron, and calcium. Covers 17 lakh+ students in 31,000+ schools. Uses locally sourced millets and seasonal ingredients.",
  eligibility: ["All students studying in Class 1-5 in TN government schools", "No income or caste restriction", "Provided on all working school days"],
  docsRequired: ["No documents needed — automatic for all enrolled students"],
  howToApply: ["No application required", "Automatically provided at government primary schools", "Parents should ensure child's enrollment in government school"],
  officialLink: "https://middaymealtamilnadu.tn.gov.in/",
  helpline: "044-28524894",
  amount: 0,
  match: p => p.state === "Tamil Nadu" && p.lifeStage.includes("children")
},
{
  name: "TN Post-Matric Scholarship for SC/ST/OBC/BC/MBC",
  state: "Tamil Nadu",
  category: "education",
  tag: "Education",
  benefit: "Full tuition fee + maintenance allowance for post-matric students",
  desc: "Scholarships for SC, ST, OBC, BC, MBC, and DNC students pursuing post-matric education (Class 11 and above) in Tamil Nadu. Covers tuition fees, exam fees, and maintenance allowance. Different rates for different courses and categories.",
  eligibility: [
    "SC/ST/OBC/BC/MBC/DNC student in TN",
    "Studying in Class 11 or above (UG, PG, Professional courses)",
    "Family income limits: SC/ST — no limit for tuition waiver; OBC/BC/MBC — below ₹2 lakh",
    "Must be studying in recognized institution in TN"
  ],
  docsRequired: ["Community certificate", "Income certificate", "Aadhaar Card", "Previous year marksheet", "College bonafide certificate", "Bank account passbook", "Passport-size photograph"],
  howToApply: [
    "Apply through tnesevai.tn.gov.in OR scholarships.gov.in (NSP)",
    "OR submit application through college",
    "College forwards verified application to department",
    "Scholarship amount credited to bank via DBT"
  ],
  officialLink: "https://scholarships.gov.in/",
  helpline: "044-25673333 (Adi Dravidar Welfare)",
  amount: 200000,
  match: p => p.state === "Tamil Nadu" && (p.employment === "student" || p.needs.includes("education")) && ["sc", "st", "obc"].includes(p.category)
},

// ─── HEALTHCARE ───
{
  name: "Chief Minister's Comprehensive Health Insurance Scheme (CMCHIS)",
  state: "Tamil Nadu",
  category: "health",
  tag: "Health",
  benefit: "₹5 lakh/year health coverage (now merged with Ayushman Bharat)",
  desc: "Tamil Nadu's flagship health insurance scheme now integrated with Ayushman Bharat (AB-PMJAY). Provides cashless treatment at 1,000+ empanelled hospitals across TN. Covers 1,027 medical procedures including surgeries, diagnostics, and follow-up. Automatically covers all NFSA ration card holder families.",
  eligibility: [
    "All families holding rice ration cards in Tamil Nadu",
    "Annual family income below ₹1.2 lakh (state criteria)",
    "All SECC-2011 identified families (AB-PMJAY criteria)",
    "No age restriction — all family members covered"
  ],
  docsRequired: ["Ration Card", "Aadhaar Card", "Hospital referral (from PHC/GH for empanelled private hospitals)", "Ayushman Bharat card (if available)"],
  howToApply: [
    "Visit nearest government hospital or empanelled private hospital",
    "Present Ration Card and Aadhaar for verification",
    "Hospital checks eligibility through CMCHIS/AB-PMJAY portal",
    "If eligible, cashless treatment initiated immediately",
    "For private hospitals: Get referral from government hospital first",
    "Card: Apply at any CSC or through beneficiary.nha.gov.in"
  ],
  officialLink: "https://www.cmchistn.com/",
  helpline: "104 (Health helpline) / 14555 (Ayushman)",
  amount: 500000,
  match: p => p.state === "Tamil Nadu" && !["above25", "10to25"].includes(p.income)
},
{
  name: "Muthulakshmi Maternity Benefit Scheme",
  state: "Tamil Nadu",
  category: "women",
  tag: "Women",
  benefit: "₹18,000 maternity benefit in 3 installments",
  desc: "Financial assistance of ₹18,000 to pregnant women for first two deliveries. Paid in 3 installments: ₹6,000 at 7th month, ₹6,000 after delivery, ₹6,000 when child reaches 1 year. One of the oldest and most generous state maternity benefit schemes in India.",
  eligibility: [
    "Pregnant women in Tamil Nadu",
    "Valid for first two live births",
    "Must register pregnancy at government hospital/PHC",
    "No income limit for SC/ST women",
    "Other communities: family income below ₹72,000/year"
  ],
  docsRequired: ["Pregnancy registration certificate", "Aadhaar Card", "Bank passbook", "Community certificate", "Income certificate", "Hospital discharge summary (for 2nd installment)", "Child's birth certificate (for 3rd installment)"],
  howToApply: [
    "Register pregnancy at nearest Government Hospital / PHC",
    "Fill Muthulakshmi Maternity Benefit application at hospital",
    "Submit documents to hospital social worker",
    "1st installment: At 7th month of pregnancy",
    "2nd installment: After institutional delivery",
    "3rd installment: When child completes 1 year (with vaccination proof)"
  ],
  officialLink: "https://www.tn.gov.in/scheme/data_view/68",
  helpline: "044-25672790",
  amount: 18000,
  match: p => p.state === "Tamil Nadu" && p.gender === "female" && p.lifeStage.includes("pregnant")
},

// ─── AGRICULTURE ───
{
  name: "TN Free Electricity for Farmers",
  state: "Tamil Nadu",
  category: "agriculture",
  tag: "Agriculture",
  benefit: "100% free electricity for agricultural pump sets",
  desc: "Tamil Nadu provides free electricity for agricultural pump sets used for irrigation. No meter, no bill for agricultural connections. One of the most significant agricultural subsidies in India. Covers over 21 lakh agricultural service connections across the state.",
  eligibility: ["Any farmer in Tamil Nadu with agricultural land", "Must have agricultural pump set connection from TANGEDCO", "Both owned and leased agricultural land", "No restriction on land size"],
  docsRequired: ["Patta (land ownership document)", "Chitta & Adangal (land records)", "Aadhaar Card", "Application for new agricultural connection (if not existing)"],
  howToApply: [
    "If you already have an agricultural connection — electricity is automatically free",
    "For new connection: Apply at nearest TANGEDCO section office",
    "Submit land documents and application form",
    "TANGEDCO provides free connection for agricultural pump sets",
    "No bills issued for agricultural consumption"
  ],
  officialLink: "https://www.tangedco.gov.in/",
  helpline: "1912 (TANGEDCO helpline)",
  amount: 50000,
  match: p => p.state === "Tamil Nadu" && (p.employment === "farmer" || (p.ownLand && p.ownLand !== "no"))
},
{
  name: "TN Crop Insurance (State + PMFBY)",
  state: "Tamil Nadu",
  category: "agriculture",
  tag: "Agriculture",
  benefit: "Crop insurance at subsidized premium + state top-up",
  desc: "Tamil Nadu implements PM Fasal Bima Yojana with additional state-level top-up. Farmer pays only 1.5-5% premium, state and centre pay the rest. Additional state scheme provides compensation for crop loss due to natural calamities not covered under PMFBY.",
  eligibility: ["All farmers in Tamil Nadu growing notified crops", "Both loanee and non-loanee farmers", "Tenant and sharecropper farmers with proper documentation"],
  docsRequired: ["Land documents (Patta/Chitta)", "Aadhaar Card", "Bank account details", "Sowing certificate from Village Administrative Officer", "KCC loan details (for loanee farmers)"],
  howToApply: [
    "Through bank: KCC loanee farmers auto-enrolled",
    "Non-loanee: Visit bank or CSC and apply before cut-off date",
    "Online: pmfby.gov.in farmer corner",
    "Report crop loss within 72 hours via Crop Insurance App or 1800-200-7710"
  ],
  officialLink: "https://pmfby.gov.in/",
  helpline: "1800-200-7710",
  amount: 200000,
  match: p => p.state === "Tamil Nadu" && (p.employment === "farmer" || (p.ownLand && p.ownLand !== "no"))
},

// ─── HOUSING ───
{
  name: "Tamil Nadu Slum Clearance Board (TNSCB) Housing",
  state: "Tamil Nadu",
  category: "housing",
  tag: "Housing",
  benefit: "Free / subsidized housing for slum dwellers and EWS families",
  desc: "Tamil Nadu Slum Clearance Board provides tenements and houses to slum dwellers and economically weaker section families at heavily subsidized rates or free of cost. Multi-storey tenement blocks constructed across Chennai and other cities.",
  eligibility: [
    "Families living in notified slums in Tamil Nadu",
    "Economically Weaker Section (EWS) families",
    "No pucca house ownership in any family member's name",
    "Priority: Female-headed households, disabled, SC/ST, widows"
  ],
  docsRequired: ["Ration Card", "Aadhaar Card", "Income certificate", "Slum identity card (if available)", "Residence proof in slum area", "Community certificate"],
  howToApply: [
    "TNSCB conducts surveys and identifies beneficiaries",
    "OR apply at nearest TNSCB office with documents",
    "Applications processed on priority basis",
    "Allotment through lottery / priority scoring"
  ],
  officialLink: "https://www.tnscb.tn.gov.in/",
  helpline: "044-25360852",
  amount: 300000,
  match: p => p.state === "Tamil Nadu" && p.ownHouse !== "yes" && ["below1", "1to2.5"].includes(p.income) && ["urban", "semi-urban"].includes(p.area)
},

// ─── SOCIAL WELFARE ───
{
  name: "TN Old Age Pension (IGNOAPS + State Top-up)",
  state: "Tamil Nadu",
  category: "senior",
  tag: "Senior",
  benefit: "₹1,000/month pension for senior citizens (60+)",
  desc: "Combined central (IGNOAPS) and state pension for senior citizens. Tamil Nadu provides ₹1,000/month (one of the highest state pensions in India). Paid monthly through bank account or post office. Automatic inclusion for BPL elderly.",
  eligibility: [
    "Tamil Nadu resident aged 60+ years",
    "BPL family / low-income household",
    "Not receiving any other government pension",
    "Annual family income below ₹72,000 (state norms)"
  ],
  docsRequired: ["Aadhaar Card", "Age proof (birth certificate, voter ID, school certificate)", "Ration Card", "Income certificate", "Bank/Post Office account passbook", "Passport-size photograph", "Community certificate"],
  howToApply: [
    "Apply online: tnesevai.tn.gov.in",
    "OR visit nearest Revenue Divisional Office / Taluk Office",
    "OR apply through Village Administrative Officer (rural areas)",
    "Submit application with all documents",
    "Verification by Revenue Inspector",
    "Pension starts from month of approval"
  ],
  officialLink: "https://tnesevai.tn.gov.in/",
  helpline: "1100 (TN Government helpline)",
  amount: 12000,
  match: p => p.state === "Tamil Nadu" && p.age >= 60 && !["above25", "10to25"].includes(p.income)
},
{
  name: "TN Widow Pension",
  state: "Tamil Nadu",
  category: "women",
  tag: "Women",
  benefit: "₹1,000/month pension for destitute widows",
  desc: "Monthly pension of ₹1,000 for destitute widows in Tamil Nadu. Also covers deserted wives and women whose husbands are missing for 7+ years. One of the most important social safety net schemes for vulnerable women.",
  eligibility: [
    "Widow / deserted wife / wife of missing husband (7+ years)",
    "Tamil Nadu resident",
    "Annual family income below ₹72,000",
    "Not receiving any other government pension",
    "Age: 18+ years"
  ],
  docsRequired: ["Aadhaar Card", "Husband's death certificate (for widows)", "FIR/Court order (for deserted wives)", "Missing person report (for missing husband)", "Ration Card", "Income certificate", "Bank passbook"],
  howToApply: [
    "Apply online: tnesevai.tn.gov.in",
    "OR visit Taluk Office / Revenue Divisional Office",
    "Submit application with supporting documents",
    "Verification by Revenue Inspector",
    "Pension credited monthly to bank account"
  ],
  officialLink: "https://tnesevai.tn.gov.in/",
  helpline: "1100",
  amount: 12000,
  match: p => p.state === "Tamil Nadu" && p.gender === "female" && p.lifeStage.includes("widow")
},
{
  name: "TN Disability Pension",
  state: "Tamil Nadu",
  category: "money",
  tag: "Money",
  benefit: "₹1,000/month pension for persons with disabilities",
  desc: "Monthly pension of ₹1,000 for persons with 40%+ disability in Tamil Nadu. Covers physical, visual, hearing, intellectual, and multiple disabilities. Additional benefits include free bus pass and priority in government schemes.",
  eligibility: [
    "Person with 40%+ disability (certified by medical board)",
    "Tamil Nadu resident",
    "Annual income below ₹72,000",
    "Not receiving any other government pension"
  ],
  docsRequired: ["Aadhaar Card", "Disability certificate (40%+ from government medical board)", "Income certificate", "Ration Card", "Bank passbook", "Photograph"],
  howToApply: ["Apply online: tnesevai.tn.gov.in", "OR visit Taluk Office with disability certificate", "Pension starts from month of approval"],
  officialLink: "https://tnesevai.tn.gov.in/",
  helpline: "1100",
  amount: 12000,
  match: p => p.state === "Tamil Nadu" && p.lifeStage.includes("disabled")
},
{
  name: "TN Marriage Assistance Scheme",
  state: "Tamil Nadu",
  category: "women",
  tag: "Women",
  benefit: "₹25,000–₹50,000 marriage assistance + 1 sovereign gold",
  desc: "Financial assistance for marriage of girls from SC/ST/BC/MBC/Minority communities. ₹25,000-₹50,000 cash + 8 grams (1 sovereign) of gold. Different amounts for different educational qualifications of the bride. Administered through respective welfare boards.",
  eligibility: [
    "Bride must be from SC/ST/BC/MBC/DNC/Minority community in TN",
    "Family annual income below ₹72,000",
    "Bride must have completed minimum 10th standard (for higher amount)",
    "First two marriages in the family",
    "Bride must be 18+ years"
  ],
  docsRequired: ["Community certificate", "Income certificate", "Educational certificates of bride", "Aadhaar Card", "Ration Card", "Marriage invitation / registration", "Bank passbook", "Passport-size photographs of bride and groom"],
  howToApply: [
    "Apply 40 days before marriage to respective welfare board",
    "SC: Adi Dravidar Welfare Department",
    "BC/MBC: BC/MBC Welfare Department",
    "Minority: Minorities Welfare Department",
    "Submit application with all documents",
    "Cash + gold coin provided before marriage date"
  ],
  officialLink: "https://www.tn.gov.in/scheme/data_view/69",
  helpline: "044-25673333",
  amount: 50000,
  match: p => p.state === "Tamil Nadu" && p.gender === "female" && ["sc", "st", "obc", "minority"].includes(p.category)
},

// ─── MSME & BUSINESS ───
{
  name: "TN New Entrepreneur-cum-Enterprise Development Scheme (NEEDS)",
  state: "Tamil Nadu",
  category: "business",
  tag: "Business",
  benefit: "25% capital subsidy (max ₹30 lakh) for first-gen entrepreneurs",
  desc: "Provides 25% capital subsidy (up to ₹30 lakh on project cost of ₹5 crore) to first-generation entrepreneurs in Tamil Nadu. Covers manufacturing and service sector enterprises. 3% additional subsidy for women, SC/ST, and differently-abled entrepreneurs.",
  eligibility: [
    "First-generation entrepreneur (parents not in business)",
    "Age: 21-45 years",
    "Minimum education: 8th standard (for manufacturing projects > ₹10L)",
    "Project cost: Up to ₹5 crore",
    "Must be a resident of Tamil Nadu",
    "Enterprise must be registered in Tamil Nadu"
  ],
  docsRequired: ["Educational certificates", "Aadhaar Card + PAN Card", "Project report / Business plan", "First-generation entrepreneur certificate from Tahsildar", "Bank loan sanction letter", "Udyam Registration certificate", "Land/premises proof", "Community certificate (for additional subsidy)"],
  howToApply: [
    "Visit msmeonline.tn.gov.in",
    "Register and submit online application",
    "Upload project report and documents",
    "Application reviewed by District Industries Centre (DIC)",
    "Bank loan sanctioned and subsidy released",
    "OR visit nearest DIC office for assisted application"
  ],
  officialLink: "https://msmeonline.tn.gov.in/",
  helpline: "044-28520605 (MSME Department)",
  amount: 3000000,
  match: p => p.state === "Tamil Nadu" && ["self-employed", "business"].includes(p.employment) && p.age >= 21 && p.age <= 45 && p.special.includes("first-gen-entrepreneur")
},
{
  name: "Tamil Nadu Industrial Investment Corporation (TIIC) Loans",
  state: "Tamil Nadu",
  category: "business",
  tag: "Business",
  benefit: "Term loans for MSMEs at competitive rates",
  desc: "TIIC provides term loans to MSMEs in Tamil Nadu for setting up new units, expansion, modernization, and diversification. Special schemes for women entrepreneurs, SC/ST entrepreneurs, and young entrepreneurs with reduced interest rates.",
  eligibility: [
    "MSME registered in Tamil Nadu",
    "Manufacturing, service, or trading enterprise",
    "Viable project with proper business plan",
    "No default with any financial institution"
  ],
  docsRequired: ["Udyam Registration", "PAN Card", "Project report", "Land/premises documents", "Promoter KYC", "Financial statements (for existing businesses)", "Quotations for machinery"],
  howToApply: ["Visit tiic.org or nearest TIIC branch", "Submit loan application with project report", "TIIC evaluates and sanctions loan"],
  officialLink: "https://www.tiic.org/",
  helpline: "044-28278620",
  amount: 5000000,
  match: p => p.state === "Tamil Nadu" && ["self-employed", "business"].includes(p.employment)
},

// ─── SUBSIDIES & UTILITIES ───
{
  name: "TN Free Rice Scheme (1 kg Free Rice per ₹1)",
  state: "Tamil Nadu",
  category: "money",
  tag: "Money",
  benefit: "Free rice through PDS (effectively ₹0 after NFSA merger)",
  desc: "Tamil Nadu provides rice free of cost through its Public Distribution System to all ration card holders. Combined with central NFSA scheme, effectively 20 kg of free rice per family per month. TN has one of the most efficient PDS systems in India with 34,000+ fair price shops.",
  eligibility: ["All ration card holders in Tamil Nadu", "Rice card / Priority Household card holders", "No income restriction for basic rice allocation"],
  docsRequired: ["Ration Card", "Aadhaar Card linked to ration card"],
  howToApply: ["Visit your designated Fair Price Shop (Ration Shop)", "Present Ration Card", "Biometric verification via Aadhaar", "Collect free rice allocation"],
  officialLink: "https://www.tnpds.gov.in/",
  helpline: "1967 (TN PDS helpline)",
  amount: 10000,
  match: p => p.state === "Tamil Nadu"
},
{
  name: "TN Amma Unavagam (Amma Canteen)",
  state: "Tamil Nadu",
  category: "money",
  tag: "Money",
  benefit: "Subsidized meals: Idli ₹1, Variety Rice ₹5, Meals ₹10",
  desc: "Ultra-cheap canteens run by Greater Chennai Corporation and municipalities across Tamil Nadu. Idli at ₹1, sambar rice/variety rice at ₹5, full meals at ₹10. Over 400+ canteens across TN serving 5 lakh+ meals daily. No eligibility criteria — open to all.",
  eligibility: ["Open to all — no restrictions", "Anyone in Tamil Nadu can eat at Amma Canteens", "No documents required"],
  docsRequired: ["None — just walk in and eat"],
  howToApply: ["No application needed", "Visit any Amma Canteen / Unavagam", "Pay ₹1-₹10 and eat", "Locations: Major bus stands, railway stations, market areas in all districts"],
  officialLink: "https://chennaicorporation.gov.in/",
  helpline: "044-25619206",
  amount: 0,
  match: p => p.state === "Tamil Nadu"
},
{
  name: "TN Free Dhoti and Saree Scheme",
  state: "Tamil Nadu",
  category: "money",
  tag: "Money",
  benefit: "Free dhoti (men) and saree (women) during Pongal and Deepavali",
  desc: "Free distribution of dhoti for men and saree for women during Pongal (January) and Deepavali (October/November) festivals. Distributed through Fair Price Shops. One of Tamil Nadu's most popular welfare schemes with 1.85 crore+ beneficiaries.",
  eligibility: ["All ration card holders in Tamil Nadu", "One dhoti per male member and one saree per female member", "No income restriction"],
  docsRequired: ["Ration Card", "Aadhaar Card"],
  howToApply: ["Distributed through Ration Shops before Pongal and Deepavali", "Present Ration Card at Fair Price Shop", "Collect free dhoti/saree"],
  officialLink: "https://www.tnpds.gov.in/",
  helpline: "1967",
  amount: 1000,
  match: p => p.state === "Tamil Nadu"
},
{
  name: "TN Pongal Gift Hamper (Cash + Groceries)",
  state: "Tamil Nadu",
  category: "money",
  tag: "Money",
  benefit: "₹2,500 cash + grocery hamper during Pongal festival",
  desc: "Every Pongal (January), Tamil Nadu distributes a festival gift hamper to all rice ration card holders: ₹2,500 cash + 1 kg sugar + special grocery items. Combined with free dhoti/saree and rice, this makes Pongal a significant welfare event.",
  eligibility: ["Rice ration card holders in Tamil Nadu", "One hamper per ration card"],
  docsRequired: ["Ration Card", "Aadhaar Card"],
  howToApply: ["Distributed through Ration Shops in January each year", "Present Ration Card and collect hamper", "Cash transferred via DBT or given at ration shop"],
  officialLink: "https://www.tnpds.gov.in/",
  helpline: "1967",
  amount: 2500,
  match: p => p.state === "Tamil Nadu" && !["above25", "10to25"].includes(p.income)
},

// ─── EMPLOYMENT & SKILL ───
{
  name: "Vetri Nichayam Scheme (Skill Training for Youth)",
  state: "Tamil Nadu",
  category: "education",
  tag: "Education",
  benefit: "Free skill training + placement assistance for unemployed youth",
  desc: "Free skill training programme for unemployed youth in Tamil Nadu aged 18-35. Industry-aligned courses in IT, manufacturing, healthcare, retail, and services. Training at government ITIs, polytechnics, and empanelled private centres. Placement assistance after completion.",
  eligibility: [
    "Tamil Nadu resident aged 18-35 years",
    "Unemployed or underemployed",
    "Minimum: 8th standard pass (varies by course)",
    "No income restriction"
  ],
  docsRequired: ["Aadhaar Card", "Educational certificates", "Community certificate", "Income certificate", "Passport-size photographs"],
  howToApply: ["Register at nearest Employment Exchange", "OR apply online through tnvelaivaaippu.gov.in", "Select preferred course and training centre", "Attend training and assessment", "Receive certification and placement support"],
  officialLink: "https://tnvelaivaaippu.gov.in/",
  helpline: "044-28520605",
  amount: 0,
  match: p => p.state === "Tamil Nadu" && (p.employment === "unemployed" || p.needs.includes("skill") || p.needs.includes("employment")) && p.age >= 18 && p.age <= 35
},
{
  name: "TN Unemployment Assistance",
  state: "Tamil Nadu",
  category: "money",
  tag: "Money",
  benefit: "Monthly unemployment assistance for registered unemployed youth",
  desc: "Monthly financial assistance to educated unemployed youth registered at Tamil Nadu Employment Exchanges. Amount varies by educational qualification. Must renew registration regularly at Employment Exchange.",
  eligibility: [
    "Tamil Nadu resident registered at Employment Exchange",
    "Unemployed graduate or diploma holder",
    "Age: 18-40 years",
    "Family income below ₹72,000/year",
    "Must renew registration every 3 years"
  ],
  docsRequired: ["Employment Exchange registration card", "Educational certificates", "Income certificate", "Aadhaar Card", "Bank passbook"],
  howToApply: ["Register at nearest Employment Exchange with educational certificates", "Maintain active registration (renew every 3 years)", "Apply for unemployment assistance at the same office", "Amount credited monthly to bank account"],
  officialLink: "https://tnvelaivaaippu.gov.in/",
  helpline: "044-28520605",
  amount: 3600,
  match: p => p.state === "Tamil Nadu" && p.employment === "unemployed" && ["secondary", "higher-secondary", "graduate", "post-graduate"].includes(p.education)
},

// ─── SPECIAL SCHEMES ───
{
  name: "Makkaludan Mudhalvar (CM Direct Grievance Redressal)",
  state: "Tamil Nadu",
  category: "money",
  tag: "Money",
  benefit: "Direct grievance resolution + on-the-spot assistance from CM's team",
  desc: "Special camps conducted across Tamil Nadu where citizens can directly submit grievances and receive on-the-spot resolution. Government officials from all departments attend. Covers: housing allotment, pension approval, educational assistance, medical aid, livelihood support, and more.",
  eligibility: ["Any resident of Tamil Nadu", "Any grievance related to government services", "No documents restriction — officials help gather required papers"],
  docsRequired: ["Aadhaar Card", "Any supporting documents related to your grievance", "Previous application copies (if any)"],
  howToApply: [
    "Attend Makkaludan Mudhalvar camp in your district",
    "Submit petition/grievance at the camp",
    "Officials process on the spot or within defined timeline",
    "Status tracking through TN e-Sevai portal"
  ],
  officialLink: "https://tnesevai.tn.gov.in/",
  helpline: "1100",
  amount: 0,
  match: p => p.state === "Tamil Nadu"
},
{
  name: "Naan Mudhalvan (I Am First) — Career Development Platform",
  state: "Tamil Nadu",
  category: "education",
  tag: "Education",
  benefit: "Free career guidance, skill development, internships, and placement",
  desc: "Comprehensive career development platform for Tamil Nadu students and youth. Provides free online courses from top companies (Google, Microsoft, Infosys), internship matching, career counselling, competitive exam preparation, and placement drives. Over 30 lakh students enrolled.",
  eligibility: [
    "Students and youth in Tamil Nadu",
    "College students (UG/PG/Diploma) and recent graduates",
    "No income restriction — free for all",
    "Available in Tamil and English"
  ],
  docsRequired: ["College ID or educational certificate", "Aadhaar Card", "Mobile number and email"],
  howToApply: [
    "Register at naanmudhalvan.tn.gov.in",
    "Create profile with educational and career details",
    "Browse available courses, internships, and jobs",
    "Enroll in courses — completely free",
    "Attend placement drives organized through the platform"
  ],
  officialLink: "https://naanmudhalvan.tn.gov.in/",
  helpline: "044-28272047",
  amount: 0,
  match: p => p.state === "Tamil Nadu" && (p.employment === "student" || p.employment === "unemployed" || p.needs.includes("skill"))
},
];

// Export for use in main app
if (typeof module !== 'undefined') module.exports = { TN_SCHEMES };
