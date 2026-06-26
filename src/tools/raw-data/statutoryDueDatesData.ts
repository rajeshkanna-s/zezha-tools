// Statutory Payment Due Dates — HR & Finance (Monthly/Quarterly/Annual)
// Source: EPFO, ESIC, Income Tax, GST, Labour Dept, Companies Act, ROC

export interface StatutoryDueDateEntry {
    sNo: number;
    obligation: string;
    dueDate: string;
    frequency: string;
    applicableLaw: string;
    lateFee: string;
    department: string;  // HR or Finance or Both
    remarks: string;
}

export const statutoryDueDatesData: StatutoryDueDateEntry[] = [
    // PF Related — HR
    { sNo: 1,  obligation: 'EPF Contribution', dueDate: '15th of following month', frequency: 'Monthly', applicableLaw: 'EPF Act 1952', lateFee: '12% p.a. interest + damages up to 100%', department: 'HR', remarks: 'Both employer & employee share' },
    { sNo: 2,  obligation: 'EPF ECR Filing', dueDate: '15th of following month', frequency: 'Monthly', applicableLaw: 'EPF Act 1952', lateFee: 'Damages under Sec 14B', department: 'HR', remarks: 'Electronic Challan cum Return' },
    { sNo: 3,  obligation: 'EPF Annual Return', dueDate: '25th April', frequency: 'Annual', applicableLaw: 'EPF Act 1952', lateFee: '₹25,000 penalty possible', department: 'HR', remarks: 'Form 6A — annual statement' },

    // ESI Related — HR
    { sNo: 4,  obligation: 'ESI Contribution', dueDate: '15th of following month', frequency: 'Monthly', applicableLaw: 'ESI Act 1948', lateFee: '12% p.a. simple interest', department: 'HR', remarks: 'Employee ≤₹21,000 salary' },
    { sNo: 5,  obligation: 'ESI Half-Yearly Return', dueDate: '11 May / 11 Nov', frequency: 'Half-Yearly', applicableLaw: 'ESI Act 1948', lateFee: 'Prosecution under Sec 85', department: 'HR', remarks: 'Apr-Sep: by 11 Nov | Oct-Mar: by 11 May' },

    // Professional Tax — HR
    { sNo: 6,  obligation: 'Professional Tax Deduction', dueDate: 'Last date varies by state', frequency: 'Monthly', applicableLaw: 'State PT Acts', lateFee: '1.25% per month (most states)', department: 'HR', remarks: 'Karnataka: 20th; Maharashtra: last day' },
    { sNo: 7,  obligation: 'PT Annual Return', dueDate: '30th April (most states)', frequency: 'Annual', applicableLaw: 'State PT Acts', lateFee: '₹1,000-₹5,000 penalty', department: 'HR', remarks: 'Annual enrollment certificate renewal' },

    // TDS Related — Finance
    { sNo: 8,  obligation: 'TDS Deposit (Salary Sec 192)', dueDate: '7th of following month', frequency: 'Monthly', applicableLaw: 'Income Tax Act', lateFee: '1.5% per month interest', department: 'Both', remarks: 'March TDS: by 30 April' },
    { sNo: 9,  obligation: 'TDS Deposit (Non-salary)', dueDate: '7th of following month', frequency: 'Monthly', applicableLaw: 'Income Tax Act', lateFee: '1.5% per month interest', department: 'Finance', remarks: 'Sec 194A/194C/194J/194H etc.' },
    { sNo: 10, obligation: 'TDS Return — Form 24Q', dueDate: '31 Jul/Oct/Jan/May', frequency: 'Quarterly', applicableLaw: 'Income Tax Act', lateFee: '₹200/day under Sec 234E', department: 'Both', remarks: 'Salary TDS return' },
    { sNo: 11, obligation: 'TDS Return — Form 26Q', dueDate: '31 Jul/Oct/Jan/May', frequency: 'Quarterly', applicableLaw: 'Income Tax Act', lateFee: '₹200/day under Sec 234E', department: 'Finance', remarks: 'Non-salary TDS return' },
    { sNo: 12, obligation: 'Form 16 / 16A Issue', dueDate: '15 Jun / within 15 days of TDS return', frequency: 'Annual/Quarterly', applicableLaw: 'Income Tax Act', lateFee: '₹100/day Sec 272A(2)(g)', department: 'Both', remarks: 'Form 16 by 15 Jun; 16A within 15 days' },

    // GST Related — Finance
    { sNo: 13, obligation: 'GSTR-1 (Outward supplies)', dueDate: '11th of following month', frequency: 'Monthly', applicableLaw: 'CGST Act 2017', lateFee: '₹50/day (max ₹5,000)', department: 'Finance', remarks: 'Quarterly for QRMP: 13th after quarter' },
    { sNo: 14, obligation: 'GSTR-3B (Summary return)', dueDate: '20th of following month', frequency: 'Monthly', applicableLaw: 'CGST Act 2017', lateFee: '₹50/day + 18% interest', department: 'Finance', remarks: 'Quarterly for QRMP: 22nd/24th' },
    { sNo: 15, obligation: 'GSTR-9 (Annual return)', dueDate: '31st December', frequency: 'Annual', applicableLaw: 'CGST Act 2017', lateFee: '₹200/day (max 0.5% of turnover)', department: 'Finance', remarks: 'Mandatory if turnover > ₹2 Cr' },

    // Income Tax — Finance
    { sNo: 16, obligation: 'Advance Tax — Q1', dueDate: '15th June', frequency: 'Quarterly', applicableLaw: 'Income Tax Act', lateFee: '1% per month Sec 234C', department: 'Finance', remarks: '15% of total estimated tax' },
    { sNo: 17, obligation: 'Advance Tax — Q2', dueDate: '15th September', frequency: 'Quarterly', applicableLaw: 'Income Tax Act', lateFee: '1% per month Sec 234C', department: 'Finance', remarks: '45% cumulative' },
    { sNo: 18, obligation: 'Advance Tax — Q3', dueDate: '15th December', frequency: 'Quarterly', applicableLaw: 'Income Tax Act', lateFee: '1% per month Sec 234C', department: 'Finance', remarks: '75% cumulative' },
    { sNo: 19, obligation: 'Advance Tax — Q4', dueDate: '15th March', frequency: 'Quarterly', applicableLaw: 'Income Tax Act', lateFee: '1% per month Sec 234B/C', department: 'Finance', remarks: '100% of total tax' },
    { sNo: 20, obligation: 'Income Tax Return (Non-audit)', dueDate: '31st July', frequency: 'Annual', applicableLaw: 'Income Tax Act', lateFee: '₹5,000 Sec 234F', department: 'Finance', remarks: 'Individuals, HUF (no audit)' },
    { sNo: 21, obligation: 'Income Tax Return (Audit cases)', dueDate: '31st October', frequency: 'Annual', applicableLaw: 'Income Tax Act', lateFee: '₹5,000 Sec 234F + interest', department: 'Finance', remarks: 'Companies, 44AB audit, TP' },
    { sNo: 22, obligation: 'Tax Audit Report (44AB)', dueDate: '30th September', frequency: 'Annual', applicableLaw: 'Income Tax Act', lateFee: '₹1.5 Lakh Sec 271B', department: 'Finance', remarks: 'Turnover > ₹1 Cr (business) / ₹75L (profession)' },

    // Labour Compliance — HR
    { sNo: 23, obligation: 'Shops & Est. Licence Renewal', dueDate: 'Before expiry (state-wise)', frequency: 'Annual', applicableLaw: 'S&E Acts (State)', lateFee: '₹500-₹5,000 + prosecution', department: 'HR', remarks: 'Annual or one-time depending on state' },
    { sNo: 24, obligation: 'LWF Contribution', dueDate: '15th Jan / 15th Jul', frequency: 'Half-Yearly', applicableLaw: 'Labour Welfare Fund Act', lateFee: 'Simple interest and penalty', department: 'HR', remarks: 'Maharashtra: ₹12 employee + ₹36 employer' },
    { sNo: 25, obligation: 'Bonus Payment', dueDate: 'Within 8 months of FY close', frequency: 'Annual', applicableLaw: 'Payment of Bonus Act', lateFee: '6 months imprisonment + fine', department: 'HR', remarks: 'Min 8.33%, max 20% (salary ≤₹21K)' },
    { sNo: 26, obligation: 'Gratuity Payment', dueDate: '30 days from due date', frequency: 'Event-based', applicableLaw: 'Payment of Gratuity Act', lateFee: 'Interest @ 10% p.a.', department: 'HR', remarks: 'On resignation/retirement/death after 5 yrs' },

    // ROC — Finance
    { sNo: 27, obligation: 'ROC Annual Return (AOC-4)', dueDate: '30 Oct (within 30 days of AGM)', frequency: 'Annual', applicableLaw: 'Companies Act 2013', lateFee: '₹100/day additional filing fee', department: 'Finance', remarks: 'Financial statements' },
    { sNo: 28, obligation: 'ROC Annual Return (MGT-7)', dueDate: '28 Nov (within 60 days of AGM)', frequency: 'Annual', applicableLaw: 'Companies Act 2013', lateFee: '₹100/day additional filing fee', department: 'Finance', remarks: 'Annual return with shareholder details' },
    { sNo: 29, obligation: 'DPT-3 (Deposits/Loans)', dueDate: '30th June', frequency: 'Annual', applicableLaw: 'Companies Act 2013', lateFee: 'Penalty per Companies Act', department: 'Finance', remarks: 'Borrowed money not classified as deposit' },
    { sNo: 30, obligation: 'AGM (Annual General Meeting)', dueDate: 'Within 6 months of FY close (30 Sep)', frequency: 'Annual', applicableLaw: 'Companies Act 2013', lateFee: '₹1 Lakh company + ₹5K/officer', department: 'Finance', remarks: 'Must be held every year' },
];
