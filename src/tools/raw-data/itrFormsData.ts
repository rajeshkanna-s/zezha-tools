// ITR Forms Guide — Which ITR form for which entity (AY 2026-27)

export interface ItrFormEntry {
    sNo: number;
    form: string;
    applicableTo: string;
    incomeTypes: string;
    notApplicableIf: string;
    dueDate: string;
    auditRequired: string;
    remarks: string;
}

export const itrFormsData: ItrFormEntry[] = [
{sNo:1,form:'ITR-1 (Sahaj)',applicableTo:'Resident Individual',incomeTypes:'Salary ≤₹50L, 1 House Property, Other Sources (Interest, Family Pension), Agricultural Income ≤₹5000',notApplicableIf:'Income >₹50L, More than 1 house property, Capital gains, Business income, Foreign income/assets, Director, Unlisted shares, Crypto income',dueDate:'31-Jul-2026',auditRequired:'No',remarks:'Simplest form; most common for salaried individuals'},
{sNo:2,form:'ITR-2',applicableTo:'Individual / HUF',incomeTypes:'Salary, House Property (multiple), Capital Gains (STCG/LTCG), Other Sources, Foreign Income/Assets, Agricultural Income >₹5K, Crypto/VDA, Director in company, Unlisted equity',notApplicableIf:'Any Business/Profession income under Sec 44AD/44ADA/44AE',dueDate:'31-Jul-2026',auditRequired:'No',remarks:'For individuals with capital gains, foreign assets, or multiple house properties'},
{sNo:3,form:'ITR-3',applicableTo:'Individual / HUF',incomeTypes:'Business/Profession income (not under presumptive), Salary, House Property, Capital Gains, Other Sources, Partner in a firm',notApplicableIf:'N/A — covers all income types for individuals',dueDate:'31-Jul-2026 (no audit) / 31-Oct-2026 (if audit)',auditRequired:'If applicable (44AB)',remarks:'For professionals, proprietors, freelancers, partners'},
{sNo:4,form:'ITR-4 (Sugam)',applicableTo:'Individual / HUF / Firm (not LLP)',incomeTypes:'Presumptive income (44AD: Business ≤₹3Cr, 44ADA: Profession ≤₹75L, 44AE: Transport), Salary, 1 House Property, Other Sources',notApplicableIf:'Income >₹50L, Capital gains, Multiple house properties, Foreign income/assets, Director, Agriculture >₹5K, Crypto',dueDate:'31-Jul-2026',auditRequired:'No',remarks:'Simplified presumptive taxation; no books of accounts needed'},
{sNo:5,form:'ITR-5',applicableTo:'Firms, LLPs, AOPs, BOIs, Co-op Societies, Local Authorities',incomeTypes:'All income types applicable to the entity — business, property, capital gains, other sources',notApplicableIf:'Companies, Individuals, HUFs, Trusts (use ITR-7)',dueDate:'31-Oct-2026 (if audit) / 31-Jul-2026 (no audit)',auditRequired:'If applicable (44AB)',remarks:'For partnership firms, LLPs, AOPs, BOIs'},
{sNo:6,form:'ITR-6',applicableTo:'Companies (other than those claiming Sec 11 exemption)',incomeTypes:'All income types — business income, capital gains, property, other sources, dividends',notApplicableIf:'Companies claiming exemption under Section 11 (Charitable trusts)',dueDate:'31-Oct-2026 (if audit) / 30-Nov-2026 (TP cases)',auditRequired:'Most companies require audit',remarks:'Mandatory e-filing for all companies; digital signature required'},
{sNo:7,form:'ITR-7',applicableTo:'Persons (incl. companies) making returns under Sec 139(4A/4B/4C/4D/4E/4F)',incomeTypes:'Income of trusts, political parties, scientific research assn, educational institutions, hospitals, trade unions, news agencies, universities',notApplicableIf:'N/A — specific to entities claiming exemptions',dueDate:'31-Oct-2026',auditRequired:'If applicable',remarks:'For charitable/religious trusts, political parties, Sec 11 claimants'},
{sNo:8,form:'ITR-U (Updated Return)',applicableTo:'Any person who has filed or not filed return',incomeTypes:'Can be filed to report additional income missed in original return',notApplicableIf:'Additional tax + 25% penalty (within 12 months), +50% (12-24 months)',dueDate:'Within 24 months from end of AY (31-Mar-2029 for AY 2026-27)',auditRequired:'No',remarks:'Cannot be filed to claim refund or increase loss'},
];
