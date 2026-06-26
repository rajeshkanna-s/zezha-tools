// Depreciation Rates under Income Tax Act — Schedule II (WDV & SLM Methods)
// Source: Income Tax Act, 1961 — Appendix I/IA

export interface DepreciationRateEntry {
    sNo: number;
    block: string;
    assetType: string;
    description: string;
    wdvRate: string;
    slmRate: string;
    remarks: string;
}

export const depreciationRatesData: DepreciationRateEntry[] = [
    // TANGIBLE ASSETS — BUILDING
    { sNo: 1, block: 'I', assetType: 'Building', description: 'Residential building (not used for business)', wdvRate: '5%', slmRate: '1.63%', remarks: 'Non-commercial buildings' },
    { sNo: 2, block: 'I', assetType: 'Building', description: 'Commercial / Office building', wdvRate: '10%', slmRate: '3.17%', remarks: 'Used wholly for business' },
    { sNo: 3, block: 'I', assetType: 'Building', description: 'Temporary wooden structure', wdvRate: '40%', slmRate: '16.21%', remarks: 'Purely temporary erections' },
    { sNo: 4, block: 'I', assetType: 'Building', description: 'Factory building', wdvRate: '10%', slmRate: '3.17%', remarks: 'Manufacturing premises' },

    // FURNITURE & FITTINGS
    { sNo: 5, block: 'II', assetType: 'Furniture & Fittings', description: 'Office furniture (desks, chairs, cabinets)', wdvRate: '10%', slmRate: '6.33%', remarks: 'Wooden/steel office furniture' },
    { sNo: 6, block: 'II', assetType: 'Furniture & Fittings', description: 'Electrical fittings (fans, lights, ACs)', wdvRate: '10%', slmRate: '6.33%', remarks: 'All types of electrical installations' },

    // PLANT & MACHINERY — General
    { sNo: 7, block: 'III', assetType: 'Plant & Machinery', description: 'General P&M (not specified elsewhere)', wdvRate: '15%', slmRate: '4.75%', remarks: 'Residual category for all P&M' },
    { sNo: 8, block: 'III', assetType: 'Plant & Machinery', description: 'Motor cars (not for hire business)', wdvRate: '15%', slmRate: '4.75%', remarks: 'Passenger vehicles' },
    { sNo: 9, block: 'III', assetType: 'Plant & Machinery', description: 'Motor buses/lorries/taxis (hire)', wdvRate: '30%', slmRate: '10.34%', remarks: 'Commercial transport vehicles' },
    { sNo: 10, block: 'III', assetType: 'Plant & Machinery', description: 'Air conditioners & air cooling machines', wdvRate: '15%', slmRate: '4.75%', remarks: 'Central/split/window AC' },
    { sNo: 11, block: 'III', assetType: 'Plant & Machinery', description: 'Office equipment (printers, copiers)', wdvRate: '15%', slmRate: '4.75%', remarks: 'General office machines' },

    // PLANT & MACHINERY — Higher Rates
    { sNo: 12, block: 'IV', assetType: 'Plant & Machinery', description: 'Computers & computer software', wdvRate: '40%', slmRate: '16.21%', remarks: 'Includes peripherals & laptops' },
    { sNo: 13, block: 'IV', assetType: 'Plant & Machinery', description: 'Data processing equipment', wdvRate: '40%', slmRate: '16.21%', remarks: 'Servers, networking equipment' },
    { sNo: 14, block: 'IV', assetType: 'Plant & Machinery', description: 'Books (annual publications)', wdvRate: '40%', slmRate: '16.21%', remarks: 'Professional library — annual' },
    { sNo: 15, block: 'V', assetType: 'Plant & Machinery', description: 'Books (other than annual publications)', wdvRate: '40%', slmRate: '16.21%', remarks: 'Professional reference books' },

    // PLANT & MACHINERY — Special Rates
    { sNo: 16, block: 'VI', assetType: 'Plant & Machinery', description: 'Moulds used in rubber/plastic goods mfg', wdvRate: '30%', slmRate: '10.34%', remarks: 'Rubber & plastic industry' },
    { sNo: 17, block: 'VI', assetType: 'Plant & Machinery', description: 'Air pollution control equipment', wdvRate: '40%', slmRate: '16.21%', remarks: 'Environment compliance' },
    { sNo: 18, block: 'VI', assetType: 'Plant & Machinery', description: 'Water pollution control equipment', wdvRate: '40%', slmRate: '16.21%', remarks: 'Effluent treatment plant' },
    { sNo: 19, block: 'VI', assetType: 'Plant & Machinery', description: 'Energy saving devices (solar, wind)', wdvRate: '40%', slmRate: '16.21%', remarks: 'Renewable energy assets' },
    { sNo: 20, block: 'VI', assetType: 'Plant & Machinery', description: 'Gas cylinders (excluding commercial)', wdvRate: '45%', slmRate: '18.10%', remarks: 'Industrial gas cylinders' },

    // INTANGIBLE ASSETS
    { sNo: 21, block: 'VII', assetType: 'Intangible Assets', description: 'Know-how, patents, copyrights', wdvRate: '25%', slmRate: '8.08%', remarks: 'Section 32(1)(ii)' },
    { sNo: 22, block: 'VII', assetType: 'Intangible Assets', description: 'Trademarks, licences', wdvRate: '25%', slmRate: '8.08%', remarks: 'Business rights' },
    { sNo: 23, block: 'VII', assetType: 'Intangible Assets', description: 'Franchises, business commercial rights', wdvRate: '25%', slmRate: '8.08%', remarks: 'Any other business / commercial rights of similar nature' },

    // ADDITIONAL DEPRECIATION
    { sNo: 24, block: 'Special', assetType: 'New P&M', description: 'Additional depreciation on new P&M (manufacturing)', wdvRate: '+20%', slmRate: 'N/A', remarks: 'Sec 32(1)(iia) — first year only, MFG sector' },
    { sNo: 25, block: 'Special', assetType: 'New P&M', description: 'Additional depreciation — notified backward area', wdvRate: '+35%', slmRate: 'N/A', remarks: 'Andhra Pradesh, Bihar, Telangana, WB' },
];
