// Interest & Penalty Rates — IT Act, GST Act, Companies Act
// FY 2025-26 reference

export interface InterestPenaltyEntry {
    sNo: number;
    section: string;
    act: string;
    nature: string;
    rate: string;
    triggerCondition: string;
    period: string;
    maxPenalty: string;
    remarks: string;
}

export const interestPenaltyData: InterestPenaltyEntry[] = [
// === Income Tax Act ===
{sNo:1,section:'234A',act:'Income Tax',nature:'Interest — Late filing of return',rate:'1% per month (simple)',triggerCondition:'ITR filed after due date',period:'From due date to date of filing',maxPenalty:'No maximum',remarks:'Even 1 day delay = 1 month interest; on tax payable minus TDS/Advance Tax'},
{sNo:2,section:'234B',act:'Income Tax',nature:'Interest — Default in Advance Tax',rate:'1% per month (simple)',triggerCondition:'Advance tax paid < 90% of assessed tax',period:'Apr 1 of AY to date of assessment',maxPenalty:'No maximum',remarks:'Not applicable if tax liability ≤₹10,000'},
{sNo:3,section:'234C',act:'Income Tax',nature:'Interest — Deferment of Advance Tax',rate:'1% per month (simple)',triggerCondition:'Instalment shortfall (15%/45%/75%/100%)',period:'3 months per instalment',maxPenalty:'No maximum',remarks:'On shortfall amount; quarterly instalment-wise'},
{sNo:4,section:'234F',act:'Income Tax',nature:'Late Filing Fee',rate:'Flat ₹5,000 / ₹1,000',triggerCondition:'Return filed after due date',period:'Per return',maxPenalty:'₹5,000 (₹1,000 if income ≤₹5L)',remarks:'Mandatory fee; in addition to 234A interest'},
{sNo:5,section:'271(1)(c)',act:'Income Tax',nature:'Penalty — Concealment / Inaccurate Particulars',rate:'100% to 300% of tax sought to be evaded',triggerCondition:'Concealment of income or furnishing inaccurate particulars',period:'Per AY',maxPenalty:'300% of tax',remarks:'Now replaced by 270A for years from AY 2017-18'},
{sNo:6,section:'270A',act:'Income Tax',nature:'Penalty — Under-reporting / Misreporting',rate:'50% (under-reporting) / 200% (misreporting)',triggerCondition:'Under-reported or misreported income',period:'Per AY',maxPenalty:'200% of tax on misreported income',remarks:'Replaces 271(1)(c) from AY 2017-18'},
{sNo:7,section:'271B',act:'Income Tax',nature:'Penalty — Non-filing of Tax Audit Report',rate:'0.5% of turnover or ₹1,50,000 (whichever is less)',triggerCondition:'Failure to get accounts audited u/s 44AB',period:'Per FY',maxPenalty:'₹1,50,000',remarks:'Tax audit not filed by Sep 30'},
{sNo:8,section:'271BA',act:'Income Tax',nature:'Penalty — Non-filing of TP Report',rate:'₹1,00,000',triggerCondition:'Failure to file Form 3CEB for transfer pricing',period:'Per FY',maxPenalty:'₹1,00,000',remarks:'Transfer pricing audit report'},
{sNo:9,section:'271DA',act:'Income Tax',nature:'Penalty — Cash transactions >₹2L',rate:'Equal to cash received (100%)',triggerCondition:'Receiving ≥₹2L in cash in single transaction/day/event',period:'Per transaction',maxPenalty:'Amount equal to cash received',remarks:'Exemption for govt, banking, post office, co-op bank'},
{sNo:10,section:'206CCA/206AB',act:'Income Tax',nature:'Higher TDS/TCS — Non-filer',rate:'5% or 2× applicable rate (whichever higher)',triggerCondition:'Non-filing of ITR for 2 preceding years & TDS/TCS >₹50K each year',period:'Until ITR filed',maxPenalty:'No maximum',remarks:'Higher TDS for specified non-filers'},
{sNo:11,section:'273B',act:'Income Tax',nature:'Immunity — Reasonable Cause',rate:'N/A',triggerCondition:'If assessee proves reasonable cause for failure',period:'N/A',maxPenalty:'Penalty can be waived',remarks:'Applies to many penalty sections; burden on assessee'},
// === GST Act ===
{sNo:12,section:'50(1)',act:'GST',nature:'Interest — Late Payment of Tax',rate:'18% p.a.',triggerCondition:'GST paid after due date',period:'From due date to date of payment',maxPenalty:'No maximum',remarks:'On net cash tax liability; not on ITC portion'},
{sNo:13,section:'50(3)',act:'GST',nature:'Interest — Undue ITC / Excess Reduction',rate:'24% p.a.',triggerCondition:'Undue/excess claim of ITC or excess reduction in output tax',period:'From date of claim to reversal',maxPenalty:'No maximum',remarks:'Higher rate for wrongful ITC claims'},
{sNo:14,section:'47',act:'GST',nature:'Late Fee — GSTR-3B',rate:'₹50/day (₹20 if Nil)',triggerCondition:'GSTR-3B filed after due date',period:'Per day of delay',maxPenalty:'Max ₹5,000',remarks:'CGST + SGST combined ₹100/day'},
{sNo:15,section:'47',act:'GST',nature:'Late Fee — GSTR-1',rate:'₹50/day (₹20 if Nil)',triggerCondition:'GSTR-1 filed after due date',period:'Per day of delay',maxPenalty:'Max ₹5,000',remarks:'CGST + SGST each ₹25/day'},
{sNo:16,section:'47',act:'GST',nature:'Late Fee — GSTR-9 (Annual Return)',rate:'₹100/day (CGST+SGST)',triggerCondition:'GSTR-9 filed after 31-Dec',period:'Per day of delay',maxPenalty:'0.25% of turnover in state',remarks:'Significant penalty for large businesses'},
{sNo:17,section:'122',act:'GST',nature:'Penalty — Tax evasion',rate:'Tax amount or ₹10,000 (whichever higher)',triggerCondition:'Supplies without invoice, fake invoices, wrong ITC, fraud',period:'Per offence',maxPenalty:'Tax amount or ₹10,000',remarks:'Serious offence; prosecution possible u/s 132'},
{sNo:18,section:'73',act:'GST',nature:'Demand — Non-fraud cases',rate:'Tax + Interest (18%)',triggerCondition:'Tax not paid / short paid / wrong refund (no fraud)',period:'Within 3 years from due date of annual return',maxPenalty:'10% penalty if not paid within 30 days of order',remarks:'Show cause notice required'},
{sNo:19,section:'74',act:'GST',nature:'Demand — Fraud cases',rate:'Tax + Interest (24%) + 100% Penalty',triggerCondition:'Fraud, wilful misstatement, suppression of facts',period:'Within 5 years from due date of annual return',maxPenalty:'100% of tax + 24% interest',remarks:'Serious consequences; prosecution possible'},
// === Companies Act 2013 ===
{sNo:20,section:'92(5)',act:'Companies Act',nature:'Penalty — Non-filing of Annual Return',rate:'₹100/day per defaulting officer',triggerCondition:'Failure to file MGT-7',period:'Per day of default',maxPenalty:'No maximum specified',remarks:'Company: ₹50K-₹5L; Officers: ₹50K-₹5L'},
{sNo:21,section:'137(3)',act:'Companies Act',nature:'Penalty — Non-filing of Financial Statements',rate:'₹100/day',triggerCondition:'Failure to file AOC-4',period:'Per day of default',maxPenalty:'₹10L (Company)',remarks:'MD/CFO/Directors personal liability'},
{sNo:22,section:'159',act:'Companies Act',nature:'Penalty — Late filing of DIN KYC',rate:'₹5,000 late fee',triggerCondition:'DIR-3 KYC not filed by Sep 30',period:'One-time',maxPenalty:'₹5,000 + DIN deactivation',remarks:'DIN gets deactivated if KYC not done'},
{sNo:23,section:'450',act:'Companies Act',nature:'Default Penalty — General',rate:'₹10,000 + ₹1,000/day',triggerCondition:'No specific penalty prescribed for a contravention',period:'Per day of continuing default',maxPenalty:'₹2,00,000',remarks:'Residual penalty provision'},
];
