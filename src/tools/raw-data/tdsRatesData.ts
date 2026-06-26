// TDS (Tax Deducted at Source) Rate Chart — FY 2025-26
// Source: Income Tax Act, sections 194A through 194T

export interface TdsRateEntry {
    sNo: number;
    section: string;
    nature: string;
    thresholdPerYear: string;
    individualHUF: string;
    otherThanIndividual: string;
    noPAN: string;
    remarks: string;
}

export const tdsRatesData: TdsRateEntry[] = [
    { sNo: 1, section: '192', nature: 'Salary', thresholdPerYear: 'As per slab', individualHUF: 'Slab rate', otherThanIndividual: 'N/A', noPAN: 'Slab rate', remarks: 'Employer deducts based on tax slab' },
    { sNo: 2, section: '192A', nature: 'Premature withdrawal from EPF', thresholdPerYear: '₹50,000', individualHUF: '10%', otherThanIndividual: 'N/A', noPAN: '20%', remarks: 'Only if service < 5 years' },
    { sNo: 3, section: '193', nature: 'Interest on securities', thresholdPerYear: '₹10,000', individualHUF: '10%', otherThanIndividual: '10%', noPAN: '20%', remarks: 'Debentures, Govt securities' },
    { sNo: 4, section: '194', nature: 'Dividend', thresholdPerYear: '₹5,000', individualHUF: '10%', otherThanIndividual: '10%', noPAN: '20%', remarks: 'Dividend from Indian companies' },
    { sNo: 5, section: '194A', nature: 'Interest (other than securities)', thresholdPerYear: '₹40,000 / ₹50,000 (Sr. Citizen)', individualHUF: '10%', otherThanIndividual: '10%', noPAN: '20%', remarks: 'Bank FD, RD interest' },
    { sNo: 6, section: '194B', nature: 'Lottery / Crossword winnings', thresholdPerYear: '₹10,000', individualHUF: '30%', otherThanIndividual: '30%', noPAN: '30%', remarks: 'Includes online gaming' },
    { sNo: 7, section: '194BA', nature: 'Winnings from online games', thresholdPerYear: 'Any amount', individualHUF: '30%', otherThanIndividual: '30%', noPAN: '30%', remarks: 'Net winnings, w.e.f. 01-Apr-2023' },
    { sNo: 8, section: '194BB', nature: 'Horse race winnings', thresholdPerYear: '₹10,000', individualHUF: '30%', otherThanIndividual: '30%', noPAN: '30%', remarks: 'Aggregate during FY' },
    { sNo: 9, section: '194C', nature: 'Payment to contractor', thresholdPerYear: '₹30,000 single / ₹1,00,000 aggregate', individualHUF: '1%', otherThanIndividual: '2%', noPAN: '20%', remarks: 'Includes sub-contractors' },
    { sNo: 10, section: '194D', nature: 'Insurance commission', thresholdPerYear: '₹15,000', individualHUF: '5%', otherThanIndividual: '10%', noPAN: '20%', remarks: 'Commission to insurance agents' },
    { sNo: 11, section: '194DA', nature: 'Life insurance policy maturity', thresholdPerYear: '₹1,00,000', individualHUF: '5%', otherThanIndividual: '5%', noPAN: '20%', remarks: 'On income portion only' },
    { sNo: 12, section: '194E', nature: 'Payment to non-resident sportsperson', thresholdPerYear: 'Any amount', individualHUF: '20%', otherThanIndividual: '20%', noPAN: '20%', remarks: 'Non-resident sportsperson/entertainer' },
    { sNo: 13, section: '194EE', nature: 'Payment under NSS', thresholdPerYear: '₹2,500', individualHUF: '10%', otherThanIndividual: '10%', noPAN: '20%', remarks: 'National Savings Scheme' },
    { sNo: 14, section: '194F', nature: 'MF/UTI repurchase', thresholdPerYear: 'Any amount', individualHUF: '20%', otherThanIndividual: '20%', noPAN: '20%', remarks: 'Omitted w.e.f. 01-Oct-2024' },
    { sNo: 15, section: '194G', nature: 'Lottery commission', thresholdPerYear: '₹15,000', individualHUF: '5%', otherThanIndividual: '5%', noPAN: '20%', remarks: 'Agent selling lottery tickets' },
    { sNo: 16, section: '194H', nature: 'Commission / Brokerage', thresholdPerYear: '₹15,000', individualHUF: '5%', otherThanIndividual: '5%', noPAN: '20%', remarks: 'Excludes insurance commission' },
    { sNo: 17, section: '194-I(a)', nature: 'Rent on plant & machinery', thresholdPerYear: '₹2,40,000', individualHUF: '2%', otherThanIndividual: '2%', noPAN: '20%', remarks: 'Plant, machinery, equipment' },
    { sNo: 18, section: '194-I(b)', nature: 'Rent on land/building/furniture', thresholdPerYear: '₹2,40,000', individualHUF: '10%', otherThanIndividual: '10%', noPAN: '20%', remarks: 'Commercial / residential rent' },
    { sNo: 19, section: '194-IA', nature: 'Transfer of immovable property', thresholdPerYear: '₹50,00,000', individualHUF: '1%', otherThanIndividual: '1%', noPAN: '20%', remarks: 'Buyer deducts from consideration' },
    { sNo: 20, section: '194-IB', nature: 'Rent by individual/HUF', thresholdPerYear: '₹50,000/month', individualHUF: '5%', otherThanIndividual: 'N/A', noPAN: '20%', remarks: 'Where payer not under tax audit' },
    { sNo: 21, section: '194J', nature: 'Professional / Technical fees', thresholdPerYear: '₹30,000', individualHUF: '10%', otherThanIndividual: '10%', noPAN: '20%', remarks: '2% for technical services to call centres' },
    { sNo: 22, section: '194K', nature: 'Income from MF units', thresholdPerYear: '₹5,000', individualHUF: '10%', otherThanIndividual: '10%', noPAN: '20%', remarks: 'Dividend from mutual funds' },
    { sNo: 23, section: '194LA', nature: 'Compulsory acquisition of property', thresholdPerYear: '₹2,50,000', individualHUF: '10%', otherThanIndividual: '10%', noPAN: '20%', remarks: 'Compensation for immovable property' },
    { sNo: 24, section: '194LBA', nature: 'Income from business trust', thresholdPerYear: 'Any amount', individualHUF: '10%', otherThanIndividual: '10%', noPAN: '20%', remarks: 'REIT/InvIT distributions' },
    { sNo: 25, section: '194M', nature: 'Commission to resident person', thresholdPerYear: '₹50,00,000', individualHUF: '5%', otherThanIndividual: '5%', noPAN: '20%', remarks: 'Commission/brokerage/contractual' },
    { sNo: 26, section: '194N', nature: 'Cash withdrawal from bank', thresholdPerYear: '₹1 Cr (₹20L if no ITR)', individualHUF: '2% / 5%', otherThanIndividual: '2% / 5%', noPAN: '2% / 5%', remarks: '2% above ₹1Cr, 5% if non-filer above ₹20L' },
    { sNo: 27, section: '194O', nature: 'E-commerce operator payment', thresholdPerYear: '₹5,00,000', individualHUF: '1%', otherThanIndividual: '1%', noPAN: '5%', remarks: 'E-commerce platforms paying sellers' },
    { sNo: 28, section: '194P', nature: 'Senior citizen (75+) — no ITR', thresholdPerYear: 'As per slab', individualHUF: 'Slab rate', otherThanIndividual: 'N/A', noPAN: 'Slab rate', remarks: 'Bank deducts for super seniors' },
    { sNo: 29, section: '194Q', nature: 'Purchase of goods', thresholdPerYear: '₹50,00,000', individualHUF: '0.1%', otherThanIndividual: '0.1%', noPAN: '5%', remarks: 'Buyer with turnover > ₹10Cr' },
    { sNo: 30, section: '194R', nature: 'Benefit/perquisite in business', thresholdPerYear: '₹20,000', individualHUF: '10%', otherThanIndividual: '10%', noPAN: '20%', remarks: 'Non-cash benefits to agents/dealers' },
    { sNo: 31, section: '194S', nature: 'Payment for virtual digital asset', thresholdPerYear: '₹50,000 (₹10,000 others)', individualHUF: '1%', otherThanIndividual: '1%', noPAN: '20%', remarks: 'Crypto/NFT transactions' },
    { sNo: 32, section: '194T', nature: 'Payment to firm partner', thresholdPerYear: '₹20,000', individualHUF: '10%', otherThanIndividual: '10%', noPAN: '20%', remarks: 'Salary/bonus/commission to partners, w.e.f. 01-Apr-2025' },
    { sNo: 33, section: '195', nature: 'Payment to non-resident', thresholdPerYear: 'Any amount', individualHUF: 'Applicable rate', otherThanIndividual: 'Applicable rate', noPAN: '20%', remarks: 'Rate depends on nature + DTAA' },
    { sNo: 34, section: '206C', nature: 'TCS — Sale of goods', thresholdPerYear: '₹50,00,000', individualHUF: '0.1%', otherThanIndividual: '0.1%', noPAN: '1%', remarks: 'Seller with turnover > ₹10Cr' },
    { sNo: 35, section: '206C(1G)', nature: 'TCS — Foreign remittance/tour', thresholdPerYear: '₹7,00,000', individualHUF: '5% / 20%', otherThanIndividual: '5% / 20%', noPAN: '10% / 40%', remarks: '5% LRS general, 20% tour package' },
];
