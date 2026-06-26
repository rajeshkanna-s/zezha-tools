// RBI Policy Rates History (2016-2026)
// Source: Reserve Bank of India (rbi.org.in)

export interface RbiRateEntry {
    sNo: number;
    effectiveDate: string;
    repoRate: string;
    reverseRepo: string;
    crrRate: string;
    slrRate: string;
    msfRate: string;
    bankRate: string;
    action: string;
    remarks: string;
}

export const rbiRatesData: RbiRateEntry[] = [
    { sNo: 1, effectiveDate: '05-Apr-2016', repoRate: '6.50%', reverseRepo: '6.00%', crrRate: '4.00%', slrRate: '21.25%', msfRate: '7.00%', bankRate: '7.00%', action: 'Cut 25 bps', remarks: 'Raghuram Rajan era' },
    { sNo: 2, effectiveDate: '04-Oct-2016', repoRate: '6.25%', reverseRepo: '5.75%', crrRate: '4.00%', slrRate: '20.75%', msfRate: '6.75%', bankRate: '6.75%', action: 'Cut 25 bps', remarks: 'Post demonetisation' },
    { sNo: 3, effectiveDate: '02-Aug-2017', repoRate: '6.00%', reverseRepo: '5.75%', crrRate: '4.00%', slrRate: '20.00%', msfRate: '6.25%', bankRate: '6.25%', action: 'Cut 25 bps', remarks: 'Urjit Patel era' },
    { sNo: 4, effectiveDate: '06-Jun-2018', repoRate: '6.25%', reverseRepo: '6.00%', crrRate: '4.00%', slrRate: '19.50%', msfRate: '6.50%', bankRate: '6.50%', action: 'Hike 25 bps', remarks: 'Inflation concerns' },
    { sNo: 5, effectiveDate: '01-Aug-2018', repoRate: '6.50%', reverseRepo: '6.25%', crrRate: '4.00%', slrRate: '19.50%', msfRate: '6.75%', bankRate: '6.75%', action: 'Hike 25 bps', remarks: 'Oil price spike' },
    { sNo: 6, effectiveDate: '07-Feb-2019', repoRate: '6.25%', reverseRepo: '6.00%', crrRate: '4.00%', slrRate: '19.25%', msfRate: '6.50%', bankRate: '6.50%', action: 'Cut 25 bps', remarks: 'Shaktikanta Das takes over' },
    { sNo: 7, effectiveDate: '04-Apr-2019', repoRate: '6.00%', reverseRepo: '5.75%', crrRate: '4.00%', slrRate: '19.25%', msfRate: '6.25%', bankRate: '6.25%', action: 'Cut 25 bps', remarks: 'Growth support' },
    { sNo: 8, effectiveDate: '06-Jun-2019', repoRate: '5.75%', reverseRepo: '5.50%', crrRate: '4.00%', slrRate: '18.75%', msfRate: '6.00%', bankRate: '6.00%', action: 'Cut 25 bps', remarks: 'Third consecutive cut' },
    { sNo: 9, effectiveDate: '07-Aug-2019', repoRate: '5.40%', reverseRepo: '5.15%', crrRate: '4.00%', slrRate: '18.75%', msfRate: '5.65%', bankRate: '5.65%', action: 'Cut 35 bps', remarks: 'Unconventional 35 bps cut' },
    { sNo: 10, effectiveDate: '04-Oct-2019', repoRate: '5.15%', reverseRepo: '4.90%', crrRate: '4.00%', slrRate: '18.50%', msfRate: '5.40%', bankRate: '5.40%', action: 'Cut 25 bps', remarks: 'Fifth consecutive cut' },
    { sNo: 11, effectiveDate: '27-Mar-2020', repoRate: '4.40%', reverseRepo: '4.00%', crrRate: '3.00%', slrRate: '18.00%', msfRate: '4.65%', bankRate: '4.65%', action: 'Cut 75 bps', remarks: 'COVID-19 emergency cut' },
    { sNo: 12, effectiveDate: '22-May-2020', repoRate: '4.00%', reverseRepo: '3.35%', crrRate: '3.00%', slrRate: '18.00%', msfRate: '4.25%', bankRate: '4.25%', action: 'Cut 40 bps', remarks: 'COVID-19 second cut' },
    { sNo: 13, effectiveDate: '04-May-2022', repoRate: '4.40%', reverseRepo: '3.35%', crrRate: '4.00%', slrRate: '18.00%', msfRate: '4.65%', bankRate: '4.65%', action: 'Hike 40 bps', remarks: 'Off-cycle surprise hike — inflation' },
    { sNo: 14, effectiveDate: '08-Jun-2022', repoRate: '4.90%', reverseRepo: '3.35%', crrRate: '4.50%', slrRate: '18.00%', msfRate: '5.15%', bankRate: '5.15%', action: 'Hike 50 bps', remarks: 'Aggressive tightening begins' },
    { sNo: 15, effectiveDate: '05-Aug-2022', repoRate: '5.40%', reverseRepo: '3.35%', crrRate: '4.50%', slrRate: '18.00%', msfRate: '5.65%', bankRate: '5.65%', action: 'Hike 50 bps', remarks: 'Inflation above RBI range' },
    { sNo: 16, effectiveDate: '30-Sep-2022', repoRate: '5.90%', reverseRepo: '3.35%', crrRate: '4.50%', slrRate: '18.00%', msfRate: '6.15%', bankRate: '6.15%', action: 'Hike 50 bps', remarks: 'Global rate hike cycle' },
    { sNo: 17, effectiveDate: '07-Dec-2022', repoRate: '6.25%', reverseRepo: '3.35%', crrRate: '4.50%', slrRate: '18.00%', msfRate: '6.50%', bankRate: '6.50%', action: 'Hike 35 bps', remarks: 'Pace slowed' },
    { sNo: 18, effectiveDate: '08-Feb-2023', repoRate: '6.50%', reverseRepo: '3.35%', crrRate: '4.50%', slrRate: '18.00%', msfRate: '6.75%', bankRate: '6.75%', action: 'Hike 25 bps', remarks: 'Terminal rate — held for 11 meetings' },
    { sNo: 19, effectiveDate: '07-Feb-2025', repoRate: '6.25%', reverseRepo: '3.35%', crrRate: '4.00%', slrRate: '18.00%', msfRate: '6.50%', bankRate: '6.50%', action: 'Cut 25 bps', remarks: 'Sanjay Malhotra — first cut in 5 years' },
    { sNo: 20, effectiveDate: '09-Apr-2025', repoRate: '6.00%', reverseRepo: '3.35%', crrRate: '4.00%', slrRate: '18.00%', msfRate: '6.25%', bankRate: '6.25%', action: 'Cut 25 bps', remarks: 'Second consecutive cut' },
    { sNo: 21, effectiveDate: '05-Feb-2026', repoRate: '5.75%', reverseRepo: '3.35%', crrRate: '4.00%', slrRate: '18.00%', msfRate: '6.00%', bankRate: '6.00%', action: 'Cut 25 bps', remarks: 'Growth focused — inflation stable' },
];
