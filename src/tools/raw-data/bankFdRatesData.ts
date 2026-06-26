// Bank FD Interest Rates Comparison — Top 20 Indian Banks (Updated Apr 2026)
// Source: RBI & individual bank websites

export interface BankFdRateEntry {
    sNo: number;
    bankName: string;
    bankType: string;         // PSU / Private / SFB / NBFC
    tenure7to14days: number;
    tenure15to45days: number;
    tenure46to90days: number;
    tenure91to180days: number;
    tenure181daysTo1yr: number;
    tenure1yr: number;
    tenure1to2yr: number;
    tenure2to3yr: number;
    tenure3to5yr: number;
    tenure5to10yr: number;
    seniorCitizenExtra: number;  // extra % for 60+
    taxSaverFD: string;        // 5-year lock-in rate
    remarks: string;
}

export const bankFdRatesData: BankFdRateEntry[] = [
    { sNo: 1,  bankName: 'SBI', bankType: 'PSU', tenure7to14days: 3.50, tenure15to45days: 3.50, tenure46to90days: 4.50, tenure91to180days: 5.25, tenure181daysTo1yr: 6.00, tenure1yr: 6.80, tenure1to2yr: 7.00, tenure2to3yr: 6.75, tenure3to5yr: 6.50, tenure5to10yr: 6.50, seniorCitizenExtra: 0.50, taxSaverFD: '6.50%', remarks: 'Largest PSU bank' },
    { sNo: 2,  bankName: 'HDFC Bank', bankType: 'Private', tenure7to14days: 3.50, tenure15to45days: 3.50, tenure46to90days: 4.50, tenure91to180days: 5.75, tenure181daysTo1yr: 6.60, tenure1yr: 7.10, tenure1to2yr: 7.25, tenure2to3yr: 7.10, tenure3to5yr: 7.00, tenure5to10yr: 7.00, seniorCitizenExtra: 0.75, taxSaverFD: '7.00%', remarks: 'Largest private bank' },
    { sNo: 3,  bankName: 'ICICI Bank', bankType: 'Private', tenure7to14days: 3.25, tenure15to45days: 3.25, tenure46to90days: 4.25, tenure91to180days: 5.50, tenure181daysTo1yr: 6.50, tenure1yr: 7.05, tenure1to2yr: 7.20, tenure2to3yr: 7.00, tenure3to5yr: 7.00, tenure5to10yr: 6.90, seniorCitizenExtra: 0.50, taxSaverFD: '7.00%', remarks: '2nd largest private bank' },
    { sNo: 4,  bankName: 'PNB', bankType: 'PSU', tenure7to14days: 3.50, tenure15to45days: 3.50, tenure46to90days: 4.50, tenure91to180days: 5.50, tenure181daysTo1yr: 6.50, tenure1yr: 7.05, tenure1to2yr: 7.00, tenure2to3yr: 6.75, tenure3to5yr: 6.50, tenure5to10yr: 6.50, seniorCitizenExtra: 0.50, taxSaverFD: '6.50%', remarks: '2nd largest PSU bank' },
    { sNo: 5,  bankName: 'Bank of Baroda', bankType: 'PSU', tenure7to14days: 3.25, tenure15to45days: 3.50, tenure46to90days: 4.50, tenure91to180days: 5.50, tenure181daysTo1yr: 6.50, tenure1yr: 7.05, tenure1to2yr: 7.00, tenure2to3yr: 6.75, tenure3to5yr: 6.50, tenure5to10yr: 6.50, seniorCitizenExtra: 0.50, taxSaverFD: '6.50%', remarks: '' },
    { sNo: 6,  bankName: 'Axis Bank', bankType: 'Private', tenure7to14days: 3.50, tenure15to45days: 3.50, tenure46to90days: 4.50, tenure91to180days: 5.75, tenure181daysTo1yr: 6.70, tenure1yr: 7.10, tenure1to2yr: 7.20, tenure2to3yr: 7.00, tenure3to5yr: 7.00, tenure5to10yr: 7.00, seniorCitizenExtra: 0.50, taxSaverFD: '7.00%', remarks: '' },
    { sNo: 7,  bankName: 'Kotak Mahindra', bankType: 'Private', tenure7to14days: 3.50, tenure15to45days: 3.75, tenure46to90days: 4.75, tenure91to180days: 5.75, tenure181daysTo1yr: 6.75, tenure1yr: 7.15, tenure1to2yr: 7.30, tenure2to3yr: 7.20, tenure3to5yr: 7.10, tenure5to10yr: 6.50, seniorCitizenExtra: 0.50, taxSaverFD: '7.10%', remarks: 'Premium rates' },
    { sNo: 8,  bankName: 'Canara Bank', bankType: 'PSU', tenure7to14days: 3.25, tenure15to45days: 3.25, tenure46to90days: 4.50, tenure91to180days: 5.50, tenure181daysTo1yr: 6.45, tenure1yr: 7.00, tenure1to2yr: 6.85, tenure2to3yr: 6.75, tenure3to5yr: 6.50, tenure5to10yr: 6.50, seniorCitizenExtra: 0.50, taxSaverFD: '6.50%', remarks: '' },
    { sNo: 9,  bankName: 'Union Bank', bankType: 'PSU', tenure7to14days: 3.25, tenure15to45days: 3.25, tenure46to90days: 4.50, tenure91to180days: 5.50, tenure181daysTo1yr: 6.40, tenure1yr: 6.90, tenure1to2yr: 6.80, tenure2to3yr: 6.75, tenure3to5yr: 6.50, tenure5to10yr: 6.50, seniorCitizenExtra: 0.50, taxSaverFD: '6.50%', remarks: '' },
    { sNo: 10, bankName: 'IndusInd Bank', bankType: 'Private', tenure7to14days: 3.50, tenure15to45days: 4.00, tenure46to90days: 5.00, tenure91to180days: 6.00, tenure181daysTo1yr: 7.00, tenure1yr: 7.50, tenure1to2yr: 7.75, tenure2to3yr: 7.50, tenure3to5yr: 7.25, tenure5to10yr: 7.25, seniorCitizenExtra: 0.50, taxSaverFD: '7.25%', remarks: 'High-yield private bank' },
    { sNo: 11, bankName: 'Yes Bank', bankType: 'Private', tenure7to14days: 3.75, tenure15to45days: 4.00, tenure46to90days: 5.25, tenure91to180days: 6.25, tenure181daysTo1yr: 7.00, tenure1yr: 7.50, tenure1to2yr: 7.50, tenure2to3yr: 7.25, tenure3to5yr: 7.25, tenure5to10yr: 7.00, seniorCitizenExtra: 0.75, taxSaverFD: '7.25%', remarks: 'Competitive rates' },
    { sNo: 12, bankName: 'Indian Bank', bankType: 'PSU', tenure7to14days: 3.25, tenure15to45days: 3.25, tenure46to90days: 4.50, tenure91to180days: 5.50, tenure181daysTo1yr: 6.40, tenure1yr: 6.90, tenure1to2yr: 6.80, tenure2to3yr: 6.75, tenure3to5yr: 6.50, tenure5to10yr: 6.50, seniorCitizenExtra: 0.50, taxSaverFD: '6.50%', remarks: '' },
    { sNo: 13, bankName: 'IDBI Bank', bankType: 'PSU', tenure7to14days: 3.50, tenure15to45days: 3.50, tenure46to90days: 4.50, tenure91to180days: 5.75, tenure181daysTo1yr: 6.50, tenure1yr: 7.05, tenure1to2yr: 7.00, tenure2to3yr: 6.75, tenure3to5yr: 6.50, tenure5to10yr: 6.50, seniorCitizenExtra: 0.50, taxSaverFD: '6.50%', remarks: '' },
    { sNo: 14, bankName: 'Federal Bank', bankType: 'Private', tenure7to14days: 3.50, tenure15to45days: 3.75, tenure46to90days: 4.75, tenure91to180days: 5.75, tenure181daysTo1yr: 6.60, tenure1yr: 7.10, tenure1to2yr: 7.05, tenure2to3yr: 7.00, tenure3to5yr: 6.80, tenure5to10yr: 6.50, seniorCitizenExtra: 0.50, taxSaverFD: '6.80%', remarks: '' },
    { sNo: 15, bankName: 'Bandhan Bank', bankType: 'Private', tenure7to14days: 3.75, tenure15to45days: 4.25, tenure46to90days: 5.50, tenure91to180days: 6.25, tenure181daysTo1yr: 7.00, tenure1yr: 7.50, tenure1to2yr: 7.50, tenure2to3yr: 7.50, tenure3to5yr: 7.25, tenure5to10yr: 7.25, seniorCitizenExtra: 0.75, taxSaverFD: '7.25%', remarks: 'High-yield option' },
    { sNo: 16, bankName: 'AU Small Finance', bankType: 'SFB', tenure7to14days: 4.00, tenure15to45days: 4.50, tenure46to90days: 5.50, tenure91to180days: 6.50, tenure181daysTo1yr: 7.25, tenure1yr: 7.75, tenure1to2yr: 7.75, tenure2to3yr: 7.50, tenure3to5yr: 7.50, tenure5to10yr: 7.25, seniorCitizenExtra: 0.50, taxSaverFD: '7.50%', remarks: 'Best rates among SFBs' },
    { sNo: 17, bankName: 'Ujjivan SFB', bankType: 'SFB', tenure7to14days: 4.00, tenure15to45days: 4.50, tenure46to90days: 5.75, tenure91to180days: 6.75, tenure181daysTo1yr: 7.25, tenure1yr: 7.90, tenure1to2yr: 7.90, tenure2to3yr: 7.50, tenure3to5yr: 7.25, tenure5to10yr: 7.00, seniorCitizenExtra: 0.50, taxSaverFD: '7.25%', remarks: 'Highest 1-yr rate' },
    { sNo: 18, bankName: 'RBL Bank', bankType: 'Private', tenure7to14days: 3.50, tenure15to45days: 4.00, tenure46to90days: 5.25, tenure91to180days: 5.75, tenure181daysTo1yr: 7.00, tenure1yr: 7.50, tenure1to2yr: 7.50, tenure2to3yr: 7.25, tenure3to5yr: 7.00, tenure5to10yr: 7.00, seniorCitizenExtra: 0.50, taxSaverFD: '7.00%', remarks: '' },
    { sNo: 19, bankName: 'Post Office TD', bankType: 'Govt', tenure7to14days: 0, tenure15to45days: 0, tenure46to90days: 0, tenure91to180days: 0, tenure181daysTo1yr: 6.90, tenure1yr: 6.90, tenure1to2yr: 7.00, tenure2to3yr: 7.00, tenure3to5yr: 7.50, tenure5to10yr: 7.50, seniorCitizenExtra: 0, taxSaverFD: '7.50%', remarks: 'Sovereign guarantee; no short-tenure' },
    { sNo: 20, bankName: 'Shriram Finance', bankType: 'NBFC', tenure7to14days: 0, tenure15to45days: 0, tenure46to90days: 0, tenure91to180days: 7.50, tenure181daysTo1yr: 7.75, tenure1yr: 8.05, tenure1to2yr: 8.41, tenure2to3yr: 8.90, tenure3to5yr: 9.10, tenure5to10yr: 9.10, seniorCitizenExtra: 0.50, taxSaverFD: '9.10%', remarks: 'Highest FD rates (NBFC — not RBI insured)' },
];
