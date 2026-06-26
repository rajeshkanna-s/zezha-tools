// EPF Interest Rates — Historical (FY 2001-02 to 2025-26)
// Source: EPFO India (Employees' Provident Fund Organisation)

export interface EpfRateEntry {
    sNo: number;
    financialYear: string;
    epfRate: number;       // % p.a.
    epsContribution: number; // employer %
    employeeShare: number;  // employee %
    employerEpfShare: number; // employer EPF %
    wageLimit: number;      // wage ceiling for PF
    remarks: string;
}

export const epfInterestRatesData: EpfRateEntry[] = [
    { sNo: 1,  financialYear: '2025-26', epfRate: 8.25, epsContribution: 8.33, employeeShare: 12, employerEpfShare: 3.67, wageLimit: 15000, remarks: 'Current rate' },
    { sNo: 2,  financialYear: '2024-25', epfRate: 8.25, epsContribution: 8.33, employeeShare: 12, employerEpfShare: 3.67, wageLimit: 15000, remarks: 'Maintained at 8.25%' },
    { sNo: 3,  financialYear: '2023-24', epfRate: 8.25, epsContribution: 8.33, employeeShare: 12, employerEpfShare: 3.67, wageLimit: 15000, remarks: 'Steady rate' },
    { sNo: 4,  financialYear: '2022-23', epfRate: 8.15, epsContribution: 8.33, employeeShare: 12, employerEpfShare: 3.67, wageLimit: 15000, remarks: 'Slight increase from 8.10%' },
    { sNo: 5,  financialYear: '2021-22', epfRate: 8.10, epsContribution: 8.33, employeeShare: 12, employerEpfShare: 3.67, wageLimit: 15000, remarks: '40-year low' },
    { sNo: 6,  financialYear: '2020-21', epfRate: 8.50, epsContribution: 8.33, employeeShare: 12, employerEpfShare: 3.67, wageLimit: 15000, remarks: 'COVID year' },
    { sNo: 7,  financialYear: '2019-20', epfRate: 8.50, epsContribution: 8.33, employeeShare: 12, employerEpfShare: 3.67, wageLimit: 15000, remarks: 'Maintained' },
    { sNo: 8,  financialYear: '2018-19', epfRate: 8.65, epsContribution: 8.33, employeeShare: 12, employerEpfShare: 3.67, wageLimit: 15000, remarks: 'Raised from 8.55%' },
    { sNo: 9,  financialYear: '2017-18', epfRate: 8.55, epsContribution: 8.33, employeeShare: 12, employerEpfShare: 3.67, wageLimit: 15000, remarks: 'Post-demonetization' },
    { sNo: 10, financialYear: '2016-17', epfRate: 8.65, epsContribution: 8.33, employeeShare: 12, employerEpfShare: 3.67, wageLimit: 15000, remarks: 'Wage ceiling revised to ₹15K' },
    { sNo: 11, financialYear: '2015-16', epfRate: 8.80, epsContribution: 8.33, employeeShare: 12, employerEpfShare: 3.67, wageLimit: 15000, remarks: 'Wage ceiling revision year' },
    { sNo: 12, financialYear: '2014-15', epfRate: 8.75, epsContribution: 8.33, employeeShare: 12, employerEpfShare: 3.67, wageLimit: 6500, remarks: 'Old wage ceiling ₹6,500' },
    { sNo: 13, financialYear: '2013-14', epfRate: 8.75, epsContribution: 8.33, employeeShare: 12, employerEpfShare: 3.67, wageLimit: 6500, remarks: 'Stable rate' },
    { sNo: 14, financialYear: '2012-13', epfRate: 8.50, epsContribution: 8.33, employeeShare: 12, employerEpfShare: 3.67, wageLimit: 6500, remarks: 'Reduced from 8.25%' },
    { sNo: 15, financialYear: '2011-12', epfRate: 8.25, epsContribution: 8.33, employeeShare: 12, employerEpfShare: 3.67, wageLimit: 6500, remarks: '' },
    { sNo: 16, financialYear: '2010-11', epfRate: 9.50, epsContribution: 8.33, employeeShare: 12, employerEpfShare: 3.67, wageLimit: 6500, remarks: 'High return era' },
    { sNo: 17, financialYear: '2009-10', epfRate: 8.50, epsContribution: 8.33, employeeShare: 12, employerEpfShare: 3.67, wageLimit: 6500, remarks: 'Financial crisis recovery' },
    { sNo: 18, financialYear: '2008-09', epfRate: 8.50, epsContribution: 8.33, employeeShare: 12, employerEpfShare: 3.67, wageLimit: 6500, remarks: 'Global financial crisis' },
    { sNo: 19, financialYear: '2007-08', epfRate: 8.50, epsContribution: 8.33, employeeShare: 12, employerEpfShare: 3.67, wageLimit: 6500, remarks: '' },
    { sNo: 20, financialYear: '2006-07', epfRate: 8.50, epsContribution: 8.33, employeeShare: 12, employerEpfShare: 3.67, wageLimit: 6500, remarks: '' },
    { sNo: 21, financialYear: '2005-06', epfRate: 8.50, epsContribution: 8.33, employeeShare: 12, employerEpfShare: 3.67, wageLimit: 6500, remarks: '' },
    { sNo: 22, financialYear: '2004-05', epfRate: 9.50, epsContribution: 8.33, employeeShare: 12, employerEpfShare: 3.67, wageLimit: 6500, remarks: '' },
    { sNo: 23, financialYear: '2003-04', epfRate: 9.50, epsContribution: 8.33, employeeShare: 12, employerEpfShare: 3.67, wageLimit: 6500, remarks: '' },
    { sNo: 24, financialYear: '2002-03', epfRate: 9.50, epsContribution: 8.33, employeeShare: 12, employerEpfShare: 3.67, wageLimit: 6500, remarks: '' },
    { sNo: 25, financialYear: '2001-02', epfRate: 9.50, epsContribution: 8.33, employeeShare: 12, employerEpfShare: 3.67, wageLimit: 6500, remarks: '' },
];
