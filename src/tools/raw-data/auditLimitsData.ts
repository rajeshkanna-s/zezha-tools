// Audit Threshold Limits — Tax Audit, GST Audit, Company Audit, Cost Audit
// FY 2025-26 reference

export interface AuditLimitEntry {
    sNo: number;
    auditType: string;
    section: string;
    act: string;
    applicableTo: string;
    threshold: string;
    dueDate: string;
    auditForm: string;
    penaltyForNonCompliance: string;
    remarks: string;
}

export const auditLimitsData: AuditLimitEntry[] = [
{sNo:1,auditType:'Tax Audit (Business)',section:'44AB(a)',act:'Income Tax',applicableTo:'Business',threshold:'Turnover >₹1 Crore (₹3 Crore if digital receipts ≥95% & digital payments ≥95%)',dueDate:'30-Sep-2026',auditForm:'Form 3CA/3CB + 3CD',penaltyForNonCompliance:'₹1,50,000 or 0.5% of turnover (lower) u/s 271B',remarks:'₹3Cr limit if cash receipts/payments ≤5% of total'},
{sNo:2,auditType:'Tax Audit (Profession)',section:'44AB(b)',act:'Income Tax',applicableTo:'Profession',threshold:'Gross receipts >₹50 Lakhs (₹75L if digital ≥95%)',dueDate:'30-Sep-2026',auditForm:'Form 3CA/3CB + 3CD',penaltyForNonCompliance:'₹1,50,000 or 0.5% of receipts (lower) u/s 271B',remarks:'Doctors, CAs, Lawyers, Engineers, Architects etc.'},
{sNo:3,auditType:'Tax Audit (Presumptive - 44AD opt out)',section:'44AB(a) + 44AD',act:'Income Tax',applicableTo:'Business declaring lower than presumptive income',threshold:'If total income exceeds basic exemption limit & not claiming presumptive',dueDate:'30-Sep-2026',auditForm:'Form 3CA/3CB + 3CD',penaltyForNonCompliance:'₹1,50,000 or 0.5% of turnover (lower)',remarks:'Mandatory if profit <8%/6% of turnover & income > exemption limit'},
{sNo:4,auditType:'Tax Audit (Presumptive - 44ADA opt out)',section:'44AB(b) + 44ADA',act:'Income Tax',applicableTo:'Profession declaring lower than presumptive income',threshold:'If claiming less than 50% of gross receipts as profit & income > exemption',dueDate:'30-Sep-2026',auditForm:'Form 3CA/3CB + 3CD',penaltyForNonCompliance:'₹1,50,000 or 0.5% of receipts (lower)',remarks:'Specified professions under 44ADA'},
{sNo:5,auditType:'GST Audit (Reconciliation)',section:'Sec 35(5) / Rule 80',act:'CGST',applicableTo:'All registered persons',threshold:'Aggregate turnover >₹5 Crore',dueDate:'31-Dec-2026',auditForm:'GSTR-9C (Self-certified)',penaltyForNonCompliance:'₹100/day (CGST+SGST); max 0.25% of turnover',remarks:'Self-certification replaced CA certification from FY 2020-21'},
{sNo:6,auditType:'Company Audit (Statutory)',section:'Sec 139',act:'Companies Act 2013',applicableTo:'All Companies (Public & Private)',threshold:'All companies must be audited — No threshold',dueDate:'30 days before AGM (latest by Sep 30)',auditForm:'Audit Report under SA',penaltyForNonCompliance:'Company: ₹25K-₹5L; Officers: ₹10K-₹1L u/s 147',remarks:'Auditor appointed for 5 consecutive years (individual) / 2 terms of 5 years (firm)'},
{sNo:7,auditType:'Internal Audit',section:'Sec 138',act:'Companies Act 2013',applicableTo:'Listed companies / Unlisted meeting criteria',threshold:'Unlisted: Turnover ≥₹200Cr OR Loans ≥₹100Cr OR Paid-up capital ≥₹50Cr OR Borrowings ≥₹25Cr from banks/FIs',dueDate:'Continuous / Concurrent',auditForm:'Internal Audit Report',penaltyForNonCompliance:'Penalty under Sec 450: ₹10K + ₹1K/day; max ₹2L',remarks:'Can be done by CA, CMA, or qualified professional'},
{sNo:8,auditType:'Cost Audit',section:'Sec 148',act:'Companies Act 2013',applicableTo:'Companies in specified industries',threshold:'Companies in specified sectors (pharma, telecom, mining, petroleum, etc.) with turnover ≥₹35Cr or cost ≥₹25Cr',dueDate:'Within 180 days from end of FY',auditForm:'CRA-3 (Cost Audit Report)',penaltyForNonCompliance:'Company: ₹25K-₹5L; Officers: ₹10K-₹1L',remarks:'Audited by Cost & Management Accountant (CMA)'},
{sNo:9,auditType:'Secretarial Audit',section:'Sec 204',act:'Companies Act 2013',applicableTo:'Listed companies / Specified companies',threshold:'All listed companies; unlisted with paid-up capital ≥₹50Cr or turnover ≥₹250Cr',dueDate:'Along with Board Report (before AGM)',auditForm:'MR-3 (Secretarial Audit Report)',penaltyForNonCompliance:'Penalty under Sec 450',remarks:'Conducted by Company Secretary in Practice'},
{sNo:10,auditType:'CARO Reporting',section:'Sec 143(11)',act:'Companies Act 2013',applicableTo:'Companies (except exempt)',threshold:'Applicable to all companies except: OPCs, small companies, banking/insurance/Sec 8 companies (with conditions)',dueDate:'Along with statutory audit report',auditForm:'CARO 2020',penaltyForNonCompliance:'Part of statutory audit — auditor responsibility',remarks:'21 clauses covering loans, fixed assets, inventory, statutory dues, fraud, etc.'},
{sNo:11,auditType:'LLP Audit',section:'Sec 34(4)',act:'LLP Act 2008',applicableTo:'LLPs meeting threshold',threshold:'Contribution ≥₹25 Lakhs OR Turnover ≥₹40 Lakhs',dueDate:'Within 6 months from end of FY (Sep 30)',auditForm:'Audit Report',penaltyForNonCompliance:'₹100/day; no maximum',remarks:'LLPs below threshold can maintain accounts on cash basis'},
{sNo:12,auditType:'Transfer Pricing Audit',section:'Sec 92E',act:'Income Tax',applicableTo:'Persons with International Transactions / Specified Domestic Transactions',threshold:'Any value of international transaction; SDT >₹20Cr',dueDate:'31-Oct-2026',auditForm:'Form 3CEB',penaltyForNonCompliance:'₹1,00,000 u/s 271BA',remarks:'Must be filed before ITR; ITR due by 30-Nov'},
{sNo:13,auditType:'Co-operative Society Audit',section:'Sec 63',act:'Co-operative Societies Act',applicableTo:'All Co-operative Societies',threshold:'All societies must be audited — no threshold',dueDate:'Within 6 months from end of FY',auditForm:'Audit Report',penaltyForNonCompliance:'As per State Act provisions',remarks:'Auditor appointed by Registrar of Co-op Societies'},
{sNo:14,auditType:'Trust / NGO Audit',section:'Sec 12A',act:'Income Tax',applicableTo:'Charitable / Religious Trusts claiming Sec 11/12 exemption',threshold:'All registered trusts/NGOs with income >₹5L must file audit report',dueDate:'30-Sep-2026',auditForm:'Form 10B / 10BB',penaltyForNonCompliance:'Loss of exemption u/s 11-12',remarks:'Form 10B: Sec 12A/12AA; Form 10BB: Sec 10(23C)'},
];
