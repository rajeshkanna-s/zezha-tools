// Minimum Wages — State-wise (FY 2025-26)
// Source: Ministry of Labour & Employment, State Notifications

export interface MinWageEntry {
    sNo: number;
    state: string;
    category: string;
    monthlyMin: number;
    dailyMin: number;
    effectiveFrom: string;
    zone: string;
    remarks: string;
}

export const minimumWagesData: MinWageEntry[] = [
    // Delhi
    { sNo: 1, state: 'Delhi', category: 'Unskilled', monthlyMin: 17494, dailyMin: 673, effectiveFrom: 'Oct 2024', zone: 'A (Metro)', remarks: 'Highest min wage in India — revised biannually' },
    { sNo: 2, state: 'Delhi', category: 'Semi-skilled', monthlyMin: 19279, dailyMin: 741, effectiveFrom: 'Oct 2024', zone: 'A (Metro)', remarks: 'VDA linked to CPI' },
    { sNo: 3, state: 'Delhi', category: 'Skilled', monthlyMin: 21215, dailyMin: 816, effectiveFrom: 'Oct 2024', zone: 'A (Metro)', remarks: 'Skilled workers — trade certified' },
    { sNo: 4, state: 'Delhi', category: 'Clerical/Supervisory', monthlyMin: 23094, dailyMin: 888, effectiveFrom: 'Oct 2024', zone: 'A (Metro)', remarks: 'Office/supervisory staff' },

    // Maharashtra
    { sNo: 5, state: 'Maharashtra', category: 'Unskilled — Zone I', monthlyMin: 13682, dailyMin: 526, effectiveFrom: 'Jul 2024', zone: 'A (Mumbai/Pune)', remarks: 'Mumbai, Thane, Pune, Nagpur' },
    { sNo: 6, state: 'Maharashtra', category: 'Semi-skilled — Zone I', monthlyMin: 14760, dailyMin: 568, effectiveFrom: 'Jul 2024', zone: 'A (Mumbai/Pune)', remarks: 'Zone I — industrial cities' },
    { sNo: 7, state: 'Maharashtra', category: 'Skilled — Zone I', monthlyMin: 15960, dailyMin: 614, effectiveFrom: 'Jul 2024', zone: 'A (Mumbai/Pune)', remarks: 'Zone I cities' },
    { sNo: 8, state: 'Maharashtra', category: 'Unskilled — Zone III', monthlyMin: 11200, dailyMin: 431, effectiveFrom: 'Jul 2024', zone: 'C (Rural)', remarks: 'Rural areas' },

    // Karnataka
    { sNo: 9, state: 'Karnataka', category: 'Unskilled — Zone I', monthlyMin: 13600, dailyMin: 523, effectiveFrom: 'Apr 2024', zone: 'A (Bangalore)', remarks: 'Bengaluru Urban' },
    { sNo: 10, state: 'Karnataka', category: 'Skilled — Zone I', monthlyMin: 16100, dailyMin: 619, effectiveFrom: 'Apr 2024', zone: 'A (Bangalore)', remarks: 'Bengaluru Urban' },
    { sNo: 11, state: 'Karnataka', category: 'Unskilled — Zone III', monthlyMin: 11050, dailyMin: 425, effectiveFrom: 'Apr 2024', zone: 'C (Rural)', remarks: 'Rural areas' },

    // Tamil Nadu
    { sNo: 12, state: 'Tamil Nadu', category: 'Unskilled', monthlyMin: 12480, dailyMin: 480, effectiveFrom: 'Apr 2024', zone: 'A (Chennai)', remarks: 'Chennai zone — shop & establishment' },
    { sNo: 13, state: 'Tamil Nadu', category: 'Semi-skilled', monthlyMin: 13520, dailyMin: 520, effectiveFrom: 'Apr 2024', zone: 'A (Chennai)', remarks: 'Chennai zone' },
    { sNo: 14, state: 'Tamil Nadu', category: 'Skilled', monthlyMin: 14560, dailyMin: 560, effectiveFrom: 'Apr 2024', zone: 'A (Chennai)', remarks: 'Chennai zone' },

    // Gujarat
    { sNo: 15, state: 'Gujarat', category: 'Unskilled — Zone I', monthlyMin: 12116, dailyMin: 466, effectiveFrom: 'Oct 2024', zone: 'A (Ahmedabad/Surat)', remarks: 'Major cities' },
    { sNo: 16, state: 'Gujarat', category: 'Skilled — Zone I', monthlyMin: 13364, dailyMin: 514, effectiveFrom: 'Oct 2024', zone: 'A (Ahmedabad/Surat)', remarks: 'Major cities' },

    // Uttar Pradesh
    { sNo: 17, state: 'Uttar Pradesh', category: 'Unskilled', monthlyMin: 10692, dailyMin: 411, effectiveFrom: 'Apr 2024', zone: 'A (Noida/Lucknow)', remarks: 'Schedule employment' },
    { sNo: 18, state: 'Uttar Pradesh', category: 'Skilled', monthlyMin: 12974, dailyMin: 499, effectiveFrom: 'Apr 2024', zone: 'A (Noida/Lucknow)', remarks: 'Schedule employment' },

    // West Bengal
    { sNo: 19, state: 'West Bengal', category: 'Unskilled', monthlyMin: 11392, dailyMin: 438, effectiveFrom: 'Apr 2024', zone: 'A (Kolkata)', remarks: 'Shop & establishment' },
    { sNo: 20, state: 'West Bengal', category: 'Skilled', monthlyMin: 13338, dailyMin: 513, effectiveFrom: 'Apr 2024', zone: 'A (Kolkata)', remarks: 'Shop & establishment' },

    // Rajasthan
    { sNo: 21, state: 'Rajasthan', category: 'Unskilled', monthlyMin: 10428, dailyMin: 401, effectiveFrom: 'Jul 2024', zone: 'A (Jaipur)', remarks: 'State-wide for commercial' },
    { sNo: 22, state: 'Rajasthan', category: 'Skilled', monthlyMin: 12636, dailyMin: 486, effectiveFrom: 'Jul 2024', zone: 'A (Jaipur)', remarks: 'State-wide for commercial' },

    // Telangana
    { sNo: 23, state: 'Telangana', category: 'Unskilled — Zone I', monthlyMin: 13520, dailyMin: 520, effectiveFrom: 'Apr 2024', zone: 'A (Hyderabad)', remarks: 'Hyderabad, Secunderabad' },
    { sNo: 24, state: 'Telangana', category: 'Skilled — Zone I', monthlyMin: 15704, dailyMin: 604, effectiveFrom: 'Apr 2024', zone: 'A (Hyderabad)', remarks: 'Hyderabad, Secunderabad' },

    // Andhra Pradesh
    { sNo: 25, state: 'Andhra Pradesh', category: 'Unskilled', monthlyMin: 12675, dailyMin: 488, effectiveFrom: 'Apr 2024', zone: 'A (Visakhapatnam)', remarks: 'Shop & commercial est.' },
    { sNo: 26, state: 'Andhra Pradesh', category: 'Skilled', monthlyMin: 14625, dailyMin: 563, effectiveFrom: 'Apr 2024', zone: 'A (Visakhapatnam)', remarks: 'Shop & commercial est.' },

    // Kerala
    { sNo: 27, state: 'Kerala', category: 'Unskilled', monthlyMin: 13750, dailyMin: 529, effectiveFrom: 'Apr 2024', zone: 'State-wide', remarks: 'No zone classification' },
    { sNo: 28, state: 'Kerala', category: 'Skilled', monthlyMin: 16250, dailyMin: 625, effectiveFrom: 'Apr 2024', zone: 'State-wide', remarks: 'Trade-wise schedules apply' },

    // Central Government
    { sNo: 29, state: 'Central Govt', category: 'Unskilled — Zone A', monthlyMin: 11622, dailyMin: 447, effectiveFrom: 'Oct 2024', zone: 'A (Metro)', remarks: 'Delhi, Mumbai, Chennai, Kolkata, Bangalore' },
    { sNo: 30, state: 'Central Govt', category: 'Semi-skilled — Zone A', monthlyMin: 12688, dailyMin: 488, effectiveFrom: 'Oct 2024', zone: 'A (Metro)', remarks: 'Metro cities' },
    { sNo: 31, state: 'Central Govt', category: 'Skilled — Zone A', monthlyMin: 13854, dailyMin: 533, effectiveFrom: 'Oct 2024', zone: 'A (Metro)', remarks: 'Metro cities' },
    { sNo: 32, state: 'Central Govt', category: 'Unskilled — Zone C', monthlyMin: 9412, dailyMin: 362, effectiveFrom: 'Oct 2024', zone: 'C (Rural)', remarks: 'Non-notified areas' },

    // Haryana
    { sNo: 33, state: 'Haryana', category: 'Unskilled', monthlyMin: 12460, dailyMin: 479, effectiveFrom: 'Jul 2024', zone: 'A (Gurugram/Faridabad)', remarks: 'NCR zone' },
    { sNo: 34, state: 'Haryana', category: 'Skilled', monthlyMin: 15340, dailyMin: 590, effectiveFrom: 'Jul 2024', zone: 'A (Gurugram/Faridabad)', remarks: 'NCR zone' },

    // Punjab
    { sNo: 35, state: 'Punjab', category: 'Unskilled', monthlyMin: 11400, dailyMin: 438, effectiveFrom: 'Apr 2024', zone: 'A (Ludhiana/Mohali)', remarks: 'Industrial zone' },
    { sNo: 36, state: 'Punjab', category: 'Skilled', monthlyMin: 13260, dailyMin: 510, effectiveFrom: 'Apr 2024', zone: 'A (Ludhiana/Mohali)', remarks: 'Industrial zone' },
];
