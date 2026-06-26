// Compliance Due Dates Calendar — FY 2025-26 (AY 2026-27)
// GST, TDS, IT Returns, ROC, PF/ESI, PT — monthly/quarterly/annual

export interface ComplianceDateEntry {
    sNo: number;
    compliance: string;
    category: string;
    frequency: string;
    dueDate: string;
    form: string;
    applicableTo: string;
    penalty: string;
    remarks: string;
}

export const complianceDatesData: ComplianceDateEntry[] = [
// === GST Monthly ===
{sNo:1,compliance:'GSTR-1 (Outward Supplies)',category:'GST',frequency:'Monthly',dueDate:'11th of next month',form:'GSTR-1',applicableTo:'Turnover >₹5Cr or opted monthly',penalty:'₹50/day (₹20 if Nil); max ₹5000',remarks:'Details of outward supplies of goods/services'},
{sNo:2,compliance:'GSTR-3B (Summary Return)',category:'GST',frequency:'Monthly',dueDate:'20th of next month',form:'GSTR-3B',applicableTo:'Turnover >₹5Cr or opted monthly',penalty:'₹50/day (₹20 if Nil) + 18% interest',remarks:'Self-assessed summary with tax payment'},
{sNo:3,compliance:'GSTR-5 (Non-Resident)',category:'GST',frequency:'Monthly',dueDate:'13th of next month',form:'GSTR-5',applicableTo:'Non-Resident Taxable Persons',penalty:'₹50/day',remarks:'Within 7 days after last day of validity'},
{sNo:4,compliance:'GSTR-6 (ISD)',category:'GST',frequency:'Monthly',dueDate:'13th of next month',form:'GSTR-6',applicableTo:'Input Service Distributors',penalty:'₹50/day',remarks:'Distribution of ITC to branches'},
{sNo:5,compliance:'GSTR-7 (TDS under GST)',category:'GST',frequency:'Monthly',dueDate:'10th of next month',form:'GSTR-7',applicableTo:'Persons deducting TDS under GST',penalty:'₹100/day (CGST+SGST); max amt of TDS',remarks:'Government bodies, PSUs, etc.'},
{sNo:6,compliance:'GSTR-8 (TCS by e-Commerce)',category:'GST',frequency:'Monthly',dueDate:'10th of next month',form:'GSTR-8',applicableTo:'E-commerce operators',penalty:'₹100/day; max amt of TCS',remarks:'Tax collected at source by operators'},
// === GST Quarterly ===
{sNo:7,compliance:'GSTR-1 (Quarterly/QRMP)',category:'GST',frequency:'Quarterly',dueDate:'13th of month after quarter',form:'GSTR-1',applicableTo:'Turnover ≤₹5Cr under QRMP',penalty:'₹50/day (₹20 if Nil); max ₹5000',remarks:'IFF for middle months by 13th'},
{sNo:8,compliance:'GSTR-3B (Quarterly/QRMP)',category:'GST',frequency:'Quarterly',dueDate:'22nd/24th of month after quarter',form:'GSTR-3B',applicableTo:'Turnover ≤₹5Cr under QRMP',penalty:'₹50/day + 18% interest',remarks:'22nd: Cat-I states; 24th: Cat-II states'},
{sNo:9,compliance:'CMP-08 (Composition Payment)',category:'GST',frequency:'Quarterly',dueDate:'18th of month after quarter',form:'CMP-08',applicableTo:'Composition Scheme taxpayers',penalty:'₹50/day + interest',remarks:'Payment-cum-statement for composition dealers'},
// === GST Annual ===
{sNo:10,compliance:'GSTR-4 (Composition Annual)',category:'GST',frequency:'Annual',dueDate:'30-Apr-2026',form:'GSTR-4',applicableTo:'Composition taxpayers',penalty:'₹100/day; max 0.25% of turnover',remarks:'Annual return for composition dealers'},
{sNo:11,compliance:'GSTR-9 (Annual Return)',category:'GST',frequency:'Annual',dueDate:'31-Dec-2026',form:'GSTR-9',applicableTo:'All regular GST registered',penalty:'₹100/day (CGST+SGST); max 0.25%',remarks:'Mandatory if turnover >₹2Cr'},
{sNo:12,compliance:'GSTR-9C (Reconciliation)',category:'GST',frequency:'Annual',dueDate:'31-Dec-2026',form:'GSTR-9C',applicableTo:'Turnover >₹5Cr',penalty:'Same as GSTR-9',remarks:'Self-certified reconciliation statement'},
// === TDS ===
{sNo:13,compliance:'TDS Payment (Non-Govt)',category:'TDS',frequency:'Monthly',dueDate:'7th of next month',form:'Challan 281',applicableTo:'All deductors',penalty:'1.5% per month interest u/s 201',remarks:'March deductions: due by 30-Apr'},
{sNo:14,compliance:'TDS Payment (Govt)',category:'TDS',frequency:'Monthly',dueDate:'Same day (book entry)',form:'Challan 281',applicableTo:'Government deductors',penalty:'1.5% per month',remarks:'March: by 7-Apr'},
{sNo:15,compliance:'TDS Return - Q1 (Apr-Jun)',category:'TDS',frequency:'Quarterly',dueDate:'31-Jul-2025',form:'24Q/26Q/27Q/27EQ',applicableTo:'All deductors',penalty:'₹200/day u/s 234E; max TDS amount',remarks:'Salary: 24Q, Non-salary: 26Q'},
{sNo:16,compliance:'TDS Return - Q2 (Jul-Sep)',category:'TDS',frequency:'Quarterly',dueDate:'31-Oct-2025',form:'24Q/26Q/27Q/27EQ',applicableTo:'All deductors',penalty:'₹200/day u/s 234E',remarks:'Salary: 24Q, Non-salary: 26Q'},
{sNo:17,compliance:'TDS Return - Q3 (Oct-Dec)',category:'TDS',frequency:'Quarterly',dueDate:'31-Jan-2026',form:'24Q/26Q/27Q/27EQ',applicableTo:'All deductors',penalty:'₹200/day u/s 234E',remarks:'Salary: 24Q, Non-salary: 26Q'},
{sNo:18,compliance:'TDS Return - Q4 (Jan-Mar)',category:'TDS',frequency:'Quarterly',dueDate:'31-May-2026',form:'24Q/26Q/27Q/27EQ',applicableTo:'All deductors',penalty:'₹200/day u/s 234E',remarks:'Salary: 24Q, Non-salary: 26Q'},
{sNo:19,compliance:'TDS Certificate (16/16A)',category:'TDS',frequency:'Quarterly',dueDate:'15 days after TDS return due date',form:'Form 16 / 16A',applicableTo:'All deductors',penalty:'₹100/day u/s 272A; max TDS amount',remarks:'Form 16: Salary (by 15-Jun); 16A: Non-salary'},
// === Income Tax Returns ===
{sNo:20,compliance:'ITR (Individual/HUF - No Audit)',category:'IT Return',frequency:'Annual',dueDate:'31-Jul-2026',form:'ITR-1/2/3/4',applicableTo:'Individuals, HUFs without audit',penalty:'₹5000 (₹1000 if income ≤₹5L) u/s 234F',remarks:'For FY 2025-26 (AY 2026-27)'},
{sNo:21,compliance:'ITR (Business - Audit Required)',category:'IT Return',frequency:'Annual',dueDate:'31-Oct-2026',form:'ITR-3/5/6',applicableTo:'All assessees requiring audit',penalty:'₹5000 u/s 234F + audit penalty',remarks:'Tax audit report by 30-Sep-2026'},
{sNo:22,compliance:'ITR (Transfer Pricing Cases)',category:'IT Return',frequency:'Annual',dueDate:'30-Nov-2026',form:'ITR-6',applicableTo:'Cos with intl transactions / specified domestic transactions',penalty:'₹5000 u/s 234F',remarks:'TP report (Form 3CEB) by 31-Oct'},
{sNo:23,compliance:'Belated / Revised Return',category:'IT Return',frequency:'Annual',dueDate:'31-Dec-2026',form:'Same as original',applicableTo:'All assessees',penalty:'₹5000 u/s 234F + interest 234A/B/C',remarks:'For AY 2026-27'},
{sNo:24,compliance:'Updated Return (ITR-U)',category:'IT Return',frequency:'One-time',dueDate:'31-Mar-2029',form:'ITR-U',applicableTo:'Any person',penalty:'25% extra tax (within 12m); 50% (12-24m)',remarks:'Cannot be used to claim refund or increase loss'},
{sNo:25,compliance:'Tax Audit Report',category:'IT Return',frequency:'Annual',dueDate:'30-Sep-2026',form:'Form 3CD',applicableTo:'Business >₹1Cr / Profession >₹50L',penalty:'0.5% of turnover; max ₹1.5L u/s 271B',remarks:'₹3Cr limit if digital receipts >95%'},
// === Advance Tax ===
{sNo:26,compliance:'Advance Tax - 1st Instalment',category:'Advance Tax',frequency:'Quarterly',dueDate:'15-Jun-2025',form:'Challan 280',applicableTo:'Tax liability >₹10,000',penalty:'Interest u/s 234C',remarks:'Min 15% of estimated tax'},
{sNo:27,compliance:'Advance Tax - 2nd Instalment',category:'Advance Tax',frequency:'Quarterly',dueDate:'15-Sep-2025',form:'Challan 280',applicableTo:'Tax liability >₹10,000',penalty:'Interest u/s 234C',remarks:'Min 45% of estimated tax (cumulative)'},
{sNo:28,compliance:'Advance Tax - 3rd Instalment',category:'Advance Tax',frequency:'Quarterly',dueDate:'15-Dec-2025',form:'Challan 280',applicableTo:'Tax liability >₹10,000',penalty:'Interest u/s 234C',remarks:'Min 75% of estimated tax (cumulative)'},
{sNo:29,compliance:'Advance Tax - 4th Instalment',category:'Advance Tax',frequency:'Quarterly',dueDate:'15-Mar-2026',form:'Challan 280',applicableTo:'Tax liability >₹10,000',penalty:'Interest u/s 234C',remarks:'100% of estimated tax (cumulative)'},
// === ROC / MCA ===
{sNo:30,compliance:'DIR-3 KYC (Director KYC)',category:'ROC/MCA',frequency:'Annual',dueDate:'30-Sep-2026',form:'DIR-3 KYC',applicableTo:'All DIN holders',penalty:'₹5000 for delayed filing',remarks:'For DIN allocated as of 31-Mar-2026'},
{sNo:31,compliance:'DPT-3 (Return of Deposits)',category:'ROC/MCA',frequency:'Annual',dueDate:'30-Jun-2026',form:'DPT-3',applicableTo:'Companies with deposits / outstanding loans',penalty:'Penalty under Companies Act',remarks:'Deposits as of 31-Mar-2026'},
{sNo:32,compliance:'MSME-1 (MSME Disclosure)',category:'ROC/MCA',frequency:'Half-yearly',dueDate:'30-Apr & 31-Oct-2026',form:'MSME-1',applicableTo:'Companies with MSME payments >45 days',penalty:'Penalty under MSMED Act',remarks:'Details of delayed MSME payments'},
{sNo:33,compliance:'AOC-4 (Financial Statements)',category:'ROC/MCA',frequency:'Annual',dueDate:'30-Oct-2026',form:'AOC-4 / AOC-4 XBRL',applicableTo:'All companies',penalty:'₹100/day; no maximum',remarks:'Within 30 days of AGM'},
{sNo:34,compliance:'MGT-7 / MGT-7A (Annual Return)',category:'ROC/MCA',frequency:'Annual',dueDate:'29-Nov-2026',form:'MGT-7 / MGT-7A',applicableTo:'All companies',penalty:'₹100/day; no maximum',remarks:'Within 60 days of AGM. OPC/Small Co: MGT-7A'},
{sNo:35,compliance:'ADT-1 (Auditor Appointment)',category:'ROC/MCA',frequency:'Event-based',dueDate:'Within 15 days of AGM',form:'ADT-1',applicableTo:'All companies',penalty:'₹5000-₹25000 on company',remarks:'Appointment of statutory auditor'},
{sNo:36,compliance:'LLP Form 11 (Annual Return)',category:'ROC/MCA',frequency:'Annual',dueDate:'30-May-2026',form:'Form 11',applicableTo:'All LLPs',penalty:'₹100/day',remarks:'Within 60 days from 31-Mar'},
{sNo:37,compliance:'LLP Form 8 (Statement of A/c)',category:'ROC/MCA',frequency:'Annual',dueDate:'30-Oct-2026',form:'Form 8',applicableTo:'All LLPs',penalty:'₹100/day',remarks:'Within 30 days from 30-Sep'},
// === PF / ESI ===
{sNo:38,compliance:'PF Payment',category:'PF/ESI',frequency:'Monthly',dueDate:'15th of next month',form:'ECR',applicableTo:'Employers with ≥20 employees',penalty:'12% to 100% damages + interest',remarks:'Employer + Employee contribution'},
{sNo:39,compliance:'ESI Payment',category:'PF/ESI',frequency:'Monthly',dueDate:'15th of next month',form:'Online (ESIC portal)',applicableTo:'Establishments with ≥10 employees',penalty:'12% p.a. simple interest',remarks:'Employee gross ≤₹21,000/month'},
{sNo:40,compliance:'PF Annual Return',category:'PF/ESI',frequency:'Annual',dueDate:'25-Apr-2026',form:'Form 3A/6A',applicableTo:'All PF employers',penalty:'Penalty under EPF Act',remarks:'Details of contributions for FY'},
];
