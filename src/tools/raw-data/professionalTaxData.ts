// Professional Tax Rates — State-wise (FY 2025-26)
// Source: State government revenue departments

export interface PtaxEntry {
    sNo: number;
    state: string;
    monthlySlabFrom: number;
    monthlySlabTo: number | null;
    monthlyTax: number;
    maxAnnual: number;
    remarks: string;
}

export const professionalTaxData: PtaxEntry[] = [
    // Maharashtra
    { sNo: 1, state: 'Maharashtra', monthlySlabFrom: 0, monthlySlabTo: 7500, monthlyTax: 0, maxAnnual: 2500, remarks: 'Exempt below ₹7,500' },
    { sNo: 2, state: 'Maharashtra', monthlySlabFrom: 7501, monthlySlabTo: 10000, monthlyTax: 175, maxAnnual: 2500, remarks: '₹175/month' },
    { sNo: 3, state: 'Maharashtra', monthlySlabFrom: 10001, monthlySlabTo: null, monthlyTax: 200, maxAnnual: 2500, remarks: '₹200/month (₹300 in Feb)' },

    // Karnataka
    { sNo: 4, state: 'Karnataka', monthlySlabFrom: 0, monthlySlabTo: 25000, monthlyTax: 0, maxAnnual: 2500, remarks: 'Exempt below ₹25,000' },
    { sNo: 5, state: 'Karnataka', monthlySlabFrom: 25001, monthlySlabTo: null, monthlyTax: 200, maxAnnual: 2500, remarks: '₹200/month' },

    // West Bengal
    { sNo: 6, state: 'West Bengal', monthlySlabFrom: 0, monthlySlabTo: 10000, monthlyTax: 0, maxAnnual: 2500, remarks: 'Exempt below ₹10,000' },
    { sNo: 7, state: 'West Bengal', monthlySlabFrom: 10001, monthlySlabTo: 15000, monthlyTax: 110, maxAnnual: 2500, remarks: '₹110/month' },
    { sNo: 8, state: 'West Bengal', monthlySlabFrom: 15001, monthlySlabTo: 25000, monthlyTax: 130, maxAnnual: 2500, remarks: '₹130/month' },
    { sNo: 9, state: 'West Bengal', monthlySlabFrom: 25001, monthlySlabTo: 40000, monthlyTax: 150, maxAnnual: 2500, remarks: '₹150/month' },
    { sNo: 10, state: 'West Bengal', monthlySlabFrom: 40001, monthlySlabTo: null, monthlyTax: 200, maxAnnual: 2500, remarks: '₹200/month' },

    // Tamil Nadu
    { sNo: 11, state: 'Tamil Nadu', monthlySlabFrom: 0, monthlySlabTo: 21000, monthlyTax: 0, maxAnnual: 2500, remarks: 'Exempt below ₹21,000' },
    { sNo: 12, state: 'Tamil Nadu', monthlySlabFrom: 21001, monthlySlabTo: 30000, monthlyTax: 100, maxAnnual: 2500, remarks: '₹100/month (half-yearly)' },
    { sNo: 13, state: 'Tamil Nadu', monthlySlabFrom: 30001, monthlySlabTo: 45000, monthlyTax: 235, maxAnnual: 2500, remarks: '₹235/month (half-yearly)' },
    { sNo: 14, state: 'Tamil Nadu', monthlySlabFrom: 45001, monthlySlabTo: 60000, monthlyTax: 510, maxAnnual: 2500, remarks: '₹510/month (half-yearly)' },
    { sNo: 15, state: 'Tamil Nadu', monthlySlabFrom: 60001, monthlySlabTo: 75000, monthlyTax: 760, maxAnnual: 2500, remarks: '₹760/month (half-yearly)' },
    { sNo: 16, state: 'Tamil Nadu', monthlySlabFrom: 75001, monthlySlabTo: null, monthlyTax: 1095, maxAnnual: 2500, remarks: '₹1,095/month (half-yearly)' },

    // Andhra Pradesh
    { sNo: 17, state: 'Andhra Pradesh', monthlySlabFrom: 0, monthlySlabTo: 15000, monthlyTax: 0, maxAnnual: 2500, remarks: 'Exempt below ₹15,000' },
    { sNo: 18, state: 'Andhra Pradesh', monthlySlabFrom: 15001, monthlySlabTo: 20000, monthlyTax: 150, maxAnnual: 2500, remarks: '₹150/month' },
    { sNo: 19, state: 'Andhra Pradesh', monthlySlabFrom: 20001, monthlySlabTo: null, monthlyTax: 200, maxAnnual: 2500, remarks: '₹200/month' },

    // Telangana
    { sNo: 20, state: 'Telangana', monthlySlabFrom: 0, monthlySlabTo: 15000, monthlyTax: 0, maxAnnual: 2500, remarks: 'Exempt below ₹15,000' },
    { sNo: 21, state: 'Telangana', monthlySlabFrom: 15001, monthlySlabTo: 20000, monthlyTax: 150, maxAnnual: 2500, remarks: '₹150/month' },
    { sNo: 22, state: 'Telangana', monthlySlabFrom: 20001, monthlySlabTo: null, monthlyTax: 200, maxAnnual: 2500, remarks: '₹200/month' },

    // Gujarat
    { sNo: 23, state: 'Gujarat', monthlySlabFrom: 0, monthlySlabTo: 12000, monthlyTax: 0, maxAnnual: 2500, remarks: 'Exempt below ₹12,000' },
    { sNo: 24, state: 'Gujarat', monthlySlabFrom: 12001, monthlySlabTo: null, monthlyTax: 200, maxAnnual: 2500, remarks: '₹200/month' },

    // Madhya Pradesh
    { sNo: 25, state: 'Madhya Pradesh', monthlySlabFrom: 0, monthlySlabTo: 18750, monthlyTax: 0, maxAnnual: 2500, remarks: 'Exempt below ₹18,750' },
    { sNo: 26, state: 'Madhya Pradesh', monthlySlabFrom: 18751, monthlySlabTo: 25000, monthlyTax: 125, maxAnnual: 2500, remarks: '₹125/month' },
    { sNo: 27, state: 'Madhya Pradesh', monthlySlabFrom: 25001, monthlySlabTo: null, monthlyTax: 208, maxAnnual: 2500, remarks: '₹208/month (₹212 in Feb)' },

    // Bihar
    { sNo: 28, state: 'Bihar', monthlySlabFrom: 0, monthlySlabTo: 25000, monthlyTax: 0, maxAnnual: 2500, remarks: 'Exempt below ₹25,000' },
    { sNo: 29, state: 'Bihar', monthlySlabFrom: 25001, monthlySlabTo: 50000, monthlyTax: 100, maxAnnual: 2500, remarks: '₹100/month' },
    { sNo: 30, state: 'Bihar', monthlySlabFrom: 50001, monthlySlabTo: null, monthlyTax: 200, maxAnnual: 2500, remarks: '₹200/month (₹300 in Mar)' },

    // Odisha
    { sNo: 31, state: 'Odisha', monthlySlabFrom: 0, monthlySlabTo: 18001, monthlyTax: 0, maxAnnual: 2500, remarks: 'Exempt below ₹18,001' },
    { sNo: 32, state: 'Odisha', monthlySlabFrom: 18001, monthlySlabTo: null, monthlyTax: 200, maxAnnual: 2500, remarks: '₹200/month (₹300 in Feb/Mar)' },

    // Assam
    { sNo: 33, state: 'Assam', monthlySlabFrom: 0, monthlySlabTo: 10000, monthlyTax: 0, maxAnnual: 2500, remarks: 'Exempt below ₹10,000' },
    { sNo: 34, state: 'Assam', monthlySlabFrom: 10001, monthlySlabTo: 15000, monthlyTax: 150, maxAnnual: 2500, remarks: '₹150/month' },
    { sNo: 35, state: 'Assam', monthlySlabFrom: 15001, monthlySlabTo: null, monthlyTax: 208, maxAnnual: 2500, remarks: '₹208/month' },

    // Kerala
    { sNo: 36, state: 'Kerala', monthlySlabFrom: 0, monthlySlabTo: 11999, monthlyTax: 0, maxAnnual: 2500, remarks: 'Exempt below ₹12,000' },
    { sNo: 37, state: 'Kerala', monthlySlabFrom: 12000, monthlySlabTo: 17999, monthlyTax: 120, maxAnnual: 2500, remarks: '₹120/month' },
    { sNo: 38, state: 'Kerala', monthlySlabFrom: 18000, monthlySlabTo: 29999, monthlyTax: 180, maxAnnual: 2500, remarks: '₹180/month' },
    { sNo: 39, state: 'Kerala', monthlySlabFrom: 30000, monthlySlabTo: null, monthlyTax: 208, maxAnnual: 2500, remarks: '₹208/month' },

    // States with NO Professional Tax
    { sNo: 40, state: 'Delhi', monthlySlabFrom: 0, monthlySlabTo: null, monthlyTax: 0, maxAnnual: 0, remarks: 'NO Professional Tax in Delhi' },
    { sNo: 41, state: 'Rajasthan', monthlySlabFrom: 0, monthlySlabTo: null, monthlyTax: 0, maxAnnual: 0, remarks: 'NO Professional Tax in Rajasthan' },
    { sNo: 42, state: 'Uttar Pradesh', monthlySlabFrom: 0, monthlySlabTo: null, monthlyTax: 0, maxAnnual: 0, remarks: 'NO Professional Tax in UP' },
    { sNo: 43, state: 'Haryana', monthlySlabFrom: 0, monthlySlabTo: null, monthlyTax: 0, maxAnnual: 0, remarks: 'NO Professional Tax in Haryana' },
    { sNo: 44, state: 'Uttarakhand', monthlySlabFrom: 0, monthlySlabTo: null, monthlyTax: 0, maxAnnual: 0, remarks: 'NO Professional Tax in Uttarakhand' },
    { sNo: 45, state: 'Punjab', monthlySlabFrom: 0, monthlySlabTo: null, monthlyTax: 0, maxAnnual: 0, remarks: 'NO Professional Tax in Punjab' },
    { sNo: 46, state: 'Goa', monthlySlabFrom: 0, monthlySlabTo: null, monthlyTax: 0, maxAnnual: 0, remarks: 'No Professional Tax — tourism hub' },
];
