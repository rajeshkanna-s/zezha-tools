export interface TaxSlabEntry { sNo: number; assessmentYear: string; regime: 'Old' | 'New'; slabFrom: number; slabTo: number | null; rate: string; surcharge: string; cess: string; }

export const indiaTaxSlabsData: TaxSlabEntry[] = [
    // AY 2026-27 (FY 2025-26) — New Regime (Default)
    { sNo: 1, assessmentYear: '2026-27', regime: 'New', slabFrom: 0, slabTo: 300000, rate: 'Nil', surcharge: 'Nil', cess: 'Nil' },
    { sNo: 2, assessmentYear: '2026-27', regime: 'New', slabFrom: 300001, slabTo: 700000, rate: '5%', surcharge: 'Nil', cess: '4%' },
    { sNo: 3, assessmentYear: '2026-27', regime: 'New', slabFrom: 700001, slabTo: 1000000, rate: '10%', surcharge: 'Nil', cess: '4%' },
    { sNo: 4, assessmentYear: '2026-27', regime: 'New', slabFrom: 1000001, slabTo: 1200000, rate: '15%', surcharge: 'Nil', cess: '4%' },
    { sNo: 5, assessmentYear: '2026-27', regime: 'New', slabFrom: 1200001, slabTo: 1500000, rate: '20%', surcharge: 'Nil', cess: '4%' },
    { sNo: 6, assessmentYear: '2026-27', regime: 'New', slabFrom: 1500001, slabTo: null, rate: '30%', surcharge: '10-37%*', cess: '4%' },
    // AY 2026-27 (FY 2025-26) — Old Regime
    { sNo: 7, assessmentYear: '2026-27', regime: 'Old', slabFrom: 0, slabTo: 250000, rate: 'Nil', surcharge: 'Nil', cess: 'Nil' },
    { sNo: 8, assessmentYear: '2026-27', regime: 'Old', slabFrom: 250001, slabTo: 500000, rate: '5%', surcharge: 'Nil', cess: '4%' },
    { sNo: 9, assessmentYear: '2026-27', regime: 'Old', slabFrom: 500001, slabTo: 1000000, rate: '20%', surcharge: 'Nil', cess: '4%' },
    { sNo: 10, assessmentYear: '2026-27', regime: 'Old', slabFrom: 1000001, slabTo: null, rate: '30%', surcharge: '10-37%*', cess: '4%' },
    // AY 2025-26 (FY 2024-25) — New Regime
    { sNo: 11, assessmentYear: '2025-26', regime: 'New', slabFrom: 0, slabTo: 300000, rate: 'Nil', surcharge: 'Nil', cess: 'Nil' },
    { sNo: 12, assessmentYear: '2025-26', regime: 'New', slabFrom: 300001, slabTo: 700000, rate: '5%', surcharge: 'Nil', cess: '4%' },
    { sNo: 13, assessmentYear: '2025-26', regime: 'New', slabFrom: 700001, slabTo: 1000000, rate: '10%', surcharge: 'Nil', cess: '4%' },
    { sNo: 14, assessmentYear: '2025-26', regime: 'New', slabFrom: 1000001, slabTo: 1200000, rate: '15%', surcharge: 'Nil', cess: '4%' },
    { sNo: 15, assessmentYear: '2025-26', regime: 'New', slabFrom: 1200001, slabTo: 1500000, rate: '20%', surcharge: 'Nil', cess: '4%' },
    { sNo: 16, assessmentYear: '2025-26', regime: 'New', slabFrom: 1500001, slabTo: null, rate: '30%', surcharge: '10-37%*', cess: '4%' },
    // AY 2025-26 (FY 2024-25) — Old Regime
    { sNo: 17, assessmentYear: '2025-26', regime: 'Old', slabFrom: 0, slabTo: 250000, rate: 'Nil', surcharge: 'Nil', cess: 'Nil' },
    { sNo: 18, assessmentYear: '2025-26', regime: 'Old', slabFrom: 250001, slabTo: 500000, rate: '5%', surcharge: 'Nil', cess: '4%' },
    { sNo: 19, assessmentYear: '2025-26', regime: 'Old', slabFrom: 500001, slabTo: 1000000, rate: '20%', surcharge: 'Nil', cess: '4%' },
    { sNo: 20, assessmentYear: '2025-26', regime: 'Old', slabFrom: 1000001, slabTo: null, rate: '30%', surcharge: '10-37%*', cess: '4%' },
    // AY 2024-25 (FY 2023-24) — New Regime
    { sNo: 21, assessmentYear: '2024-25', regime: 'New', slabFrom: 0, slabTo: 300000, rate: 'Nil', surcharge: 'Nil', cess: 'Nil' },
    { sNo: 22, assessmentYear: '2024-25', regime: 'New', slabFrom: 300001, slabTo: 600000, rate: '5%', surcharge: 'Nil', cess: '4%' },
    { sNo: 23, assessmentYear: '2024-25', regime: 'New', slabFrom: 600001, slabTo: 900000, rate: '10%', surcharge: 'Nil', cess: '4%' },
    { sNo: 24, assessmentYear: '2024-25', regime: 'New', slabFrom: 900001, slabTo: 1200000, rate: '15%', surcharge: 'Nil', cess: '4%' },
    { sNo: 25, assessmentYear: '2024-25', regime: 'New', slabFrom: 1200001, slabTo: 1500000, rate: '20%', surcharge: 'Nil', cess: '4%' },
    { sNo: 26, assessmentYear: '2024-25', regime: 'New', slabFrom: 1500001, slabTo: null, rate: '30%', surcharge: '10-37%*', cess: '4%' },
    // AY 2024-25 — Old Regime
    { sNo: 27, assessmentYear: '2024-25', regime: 'Old', slabFrom: 0, slabTo: 250000, rate: 'Nil', surcharge: 'Nil', cess: 'Nil' },
    { sNo: 28, assessmentYear: '2024-25', regime: 'Old', slabFrom: 250001, slabTo: 500000, rate: '5%', surcharge: 'Nil', cess: '4%' },
    { sNo: 29, assessmentYear: '2024-25', regime: 'Old', slabFrom: 500001, slabTo: 1000000, rate: '20%', surcharge: 'Nil', cess: '4%' },
    { sNo: 30, assessmentYear: '2024-25', regime: 'Old', slabFrom: 1000001, slabTo: null, rate: '30%', surcharge: '10-37%*', cess: '4%' },
    // AY 2023-24 (FY 2022-23) — Old Regime
    { sNo: 31, assessmentYear: '2023-24', regime: 'Old', slabFrom: 0, slabTo: 250000, rate: 'Nil', surcharge: 'Nil', cess: 'Nil' },
    { sNo: 32, assessmentYear: '2023-24', regime: 'Old', slabFrom: 250001, slabTo: 500000, rate: '5%', surcharge: 'Nil', cess: '4%' },
    { sNo: 33, assessmentYear: '2023-24', regime: 'Old', slabFrom: 500001, slabTo: 1000000, rate: '20%', surcharge: 'Nil', cess: '4%' },
    { sNo: 34, assessmentYear: '2023-24', regime: 'Old', slabFrom: 1000001, slabTo: null, rate: '30%', surcharge: '10-37%*', cess: '4%' },
    // AY 2023-24 — New Regime
    { sNo: 35, assessmentYear: '2023-24', regime: 'New', slabFrom: 0, slabTo: 250000, rate: 'Nil', surcharge: 'Nil', cess: 'Nil' },
    { sNo: 36, assessmentYear: '2023-24', regime: 'New', slabFrom: 250001, slabTo: 500000, rate: '5%', surcharge: 'Nil', cess: '4%' },
    { sNo: 37, assessmentYear: '2023-24', regime: 'New', slabFrom: 500001, slabTo: 750000, rate: '10%', surcharge: 'Nil', cess: '4%' },
    { sNo: 38, assessmentYear: '2023-24', regime: 'New', slabFrom: 750001, slabTo: 1000000, rate: '15%', surcharge: 'Nil', cess: '4%' },
    { sNo: 39, assessmentYear: '2023-24', regime: 'New', slabFrom: 1000001, slabTo: 1250000, rate: '20%', surcharge: 'Nil', cess: '4%' },
    { sNo: 40, assessmentYear: '2023-24', regime: 'New', slabFrom: 1250001, slabTo: 1500000, rate: '25%', surcharge: 'Nil', cess: '4%' },
    { sNo: 41, assessmentYear: '2023-24', regime: 'New', slabFrom: 1500001, slabTo: null, rate: '30%', surcharge: '10-37%*', cess: '4%' },
    // AY 2022-23 (FY 2021-22) — Old Regime
    { sNo: 42, assessmentYear: '2022-23', regime: 'Old', slabFrom: 0, slabTo: 250000, rate: 'Nil', surcharge: 'Nil', cess: 'Nil' },
    { sNo: 43, assessmentYear: '2022-23', regime: 'Old', slabFrom: 250001, slabTo: 500000, rate: '5%', surcharge: 'Nil', cess: '4%' },
    { sNo: 44, assessmentYear: '2022-23', regime: 'Old', slabFrom: 500001, slabTo: 1000000, rate: '20%', surcharge: 'Nil', cess: '4%' },
    { sNo: 45, assessmentYear: '2022-23', regime: 'Old', slabFrom: 1000001, slabTo: null, rate: '30%', surcharge: '10-37%*', cess: '4%' },
    // AY 2022-23 — New Regime
    { sNo: 46, assessmentYear: '2022-23', regime: 'New', slabFrom: 0, slabTo: 250000, rate: 'Nil', surcharge: 'Nil', cess: 'Nil' },
    { sNo: 47, assessmentYear: '2022-23', regime: 'New', slabFrom: 250001, slabTo: 500000, rate: '5%', surcharge: 'Nil', cess: '4%' },
    { sNo: 48, assessmentYear: '2022-23', regime: 'New', slabFrom: 500001, slabTo: 750000, rate: '10%', surcharge: 'Nil', cess: '4%' },
    { sNo: 49, assessmentYear: '2022-23', regime: 'New', slabFrom: 750001, slabTo: 1000000, rate: '15%', surcharge: 'Nil', cess: '4%' },
    { sNo: 50, assessmentYear: '2022-23', regime: 'New', slabFrom: 1000001, slabTo: 1250000, rate: '20%', surcharge: 'Nil', cess: '4%' },
    { sNo: 51, assessmentYear: '2022-23', regime: 'New', slabFrom: 1250001, slabTo: 1500000, rate: '25%', surcharge: 'Nil', cess: '4%' },
    { sNo: 52, assessmentYear: '2022-23', regime: 'New', slabFrom: 1500001, slabTo: null, rate: '30%', surcharge: '10-37%*', cess: '4%' },
    // AY 2021-22 (FY 2020-21) — Old Regime
    { sNo: 53, assessmentYear: '2021-22', regime: 'Old', slabFrom: 0, slabTo: 250000, rate: 'Nil', surcharge: 'Nil', cess: 'Nil' },
    { sNo: 54, assessmentYear: '2021-22', regime: 'Old', slabFrom: 250001, slabTo: 500000, rate: '5%', surcharge: 'Nil', cess: '4%' },
    { sNo: 55, assessmentYear: '2021-22', regime: 'Old', slabFrom: 500001, slabTo: 1000000, rate: '20%', surcharge: 'Nil', cess: '4%' },
    { sNo: 56, assessmentYear: '2021-22', regime: 'Old', slabFrom: 1000001, slabTo: null, rate: '30%', surcharge: '10-37%*', cess: '4%' },
    // AY 2021-22 — New Regime
    { sNo: 57, assessmentYear: '2021-22', regime: 'New', slabFrom: 0, slabTo: 250000, rate: 'Nil', surcharge: 'Nil', cess: 'Nil' },
    { sNo: 58, assessmentYear: '2021-22', regime: 'New', slabFrom: 250001, slabTo: 500000, rate: '5%', surcharge: 'Nil', cess: '4%' },
    { sNo: 59, assessmentYear: '2021-22', regime: 'New', slabFrom: 500001, slabTo: 750000, rate: '10%', surcharge: 'Nil', cess: '4%' },
    { sNo: 60, assessmentYear: '2021-22', regime: 'New', slabFrom: 750001, slabTo: 1000000, rate: '15%', surcharge: 'Nil', cess: '4%' },
    { sNo: 61, assessmentYear: '2021-22', regime: 'New', slabFrom: 1000001, slabTo: 1250000, rate: '20%', surcharge: 'Nil', cess: '4%' },
    { sNo: 62, assessmentYear: '2021-22', regime: 'New', slabFrom: 1250001, slabTo: 1500000, rate: '25%', surcharge: 'Nil', cess: '4%' },
    { sNo: 63, assessmentYear: '2021-22', regime: 'New', slabFrom: 1500001, slabTo: null, rate: '30%', surcharge: '10-37%*', cess: '4%' },
    // AY 2020-21 (FY 2019-20) — Old Regime (before New Regime introduction)
    { sNo: 64, assessmentYear: '2020-21', regime: 'Old', slabFrom: 0, slabTo: 250000, rate: 'Nil', surcharge: 'Nil', cess: '4%' },
    { sNo: 65, assessmentYear: '2020-21', regime: 'Old', slabFrom: 250001, slabTo: 500000, rate: '5%', surcharge: 'Nil', cess: '4%' },
    { sNo: 66, assessmentYear: '2020-21', regime: 'Old', slabFrom: 500001, slabTo: 1000000, rate: '20%', surcharge: 'Nil', cess: '4%' },
    { sNo: 67, assessmentYear: '2020-21', regime: 'Old', slabFrom: 1000001, slabTo: null, rate: '30%', surcharge: '10-37%*', cess: '4%' },
    // AY 2019-20 (FY 2018-19) — Old Regime
    { sNo: 68, assessmentYear: '2019-20', regime: 'Old', slabFrom: 0, slabTo: 250000, rate: 'Nil', surcharge: 'Nil', cess: '4%' },
    { sNo: 69, assessmentYear: '2019-20', regime: 'Old', slabFrom: 250001, slabTo: 500000, rate: '5%', surcharge: 'Nil', cess: '4%' },
    { sNo: 70, assessmentYear: '2019-20', regime: 'Old', slabFrom: 500001, slabTo: 1000000, rate: '20%', surcharge: 'Nil', cess: '4%' },
    { sNo: 71, assessmentYear: '2019-20', regime: 'Old', slabFrom: 1000001, slabTo: null, rate: '30%', surcharge: '10-15%*', cess: '4%' },
];
