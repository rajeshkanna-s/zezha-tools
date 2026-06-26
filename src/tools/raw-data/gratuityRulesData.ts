// Gratuity Rules & Tax Limits — India
// Source: Payment of Gratuity Act, 1972 (as amended) & Income Tax Act Sec 10(10)

export interface GratuityRuleEntry {
    sNo: number;
    category: string;
    parameter: string;
    value: string;
    section: string;
    remarks: string;
}

export const gratuityRulesData: GratuityRuleEntry[] = [
    // Eligibility
    { sNo: 1,  category: 'Eligibility', parameter: 'Minimum Service', value: '5 years continuous service', section: 'Sec 4(1)', remarks: 'Waived in case of death or disability' },
    { sNo: 2,  category: 'Eligibility', parameter: 'Employee Coverage', value: 'Establishments with 10+ employees', section: 'Sec 1(3)', remarks: 'Once covered, always covered even if headcount drops' },
    { sNo: 3,  category: 'Eligibility', parameter: 'Applicable To', value: 'Factories, Mines, Oil Fields, Ports, Railways, Shops', section: 'Sec 1(3)', remarks: 'Covers most organized sector' },
    { sNo: 4,  category: 'Eligibility', parameter: 'Contract/Temp Workers', value: 'Eligible if 5 years completed', section: 'Sec 2(e)', remarks: 'Fixed-term employees also covered under Code on Wages 2019' },

    // Calculation Formula
    { sNo: 5,  category: 'Formula', parameter: 'Covered Employees', value: '15 × Last Drawn Salary × Years / 26', section: 'Sec 4(2)', remarks: '26 working days per month' },
    { sNo: 6,  category: 'Formula', parameter: 'Non-covered (private)', value: '15 × Last Drawn Salary × Years / 30', section: 'IT Act', remarks: '30 calendar days per month' },
    { sNo: 7,  category: 'Formula', parameter: 'Salary Components', value: 'Basic + DA (Dearness Allowance)', section: 'Sec 2(s)', remarks: 'Commission on turnover basis also included' },
    { sNo: 8,  category: 'Formula', parameter: 'Rounding of Years', value: 'Months > 6 rounded up as 1 year', section: 'Sec 4(2)', remarks: 'E.g., 4 yr 7 months = 5 years' },

    // Tax Exemption Limits
    { sNo: 9,  category: 'Tax Exemption', parameter: 'Govt Employees', value: 'Fully exempt', section: 'Sec 10(10)(i)', remarks: 'Central/State/Local body employees' },
    { sNo: 10, category: 'Tax Exemption', parameter: 'Covered Private (max limit)', value: '₹25,00,000', section: 'Sec 10(10)(ii)', remarks: 'Increased from ₹20L (w.e.f. 29 Mar 2018)' },
    { sNo: 11, category: 'Tax Exemption', parameter: 'Exempt: Least of 3', value: '(a) Actual gratuity received', section: 'Sec 10(10)(ii)', remarks: 'Whichever is least is tax-free' },
    { sNo: 12, category: 'Tax Exemption', parameter: 'Exempt: Least of 3', value: '(b) 15 days salary × years (÷26)', section: 'Sec 10(10)(ii)', remarks: 'Formula-based ceiling' },
    { sNo: 13, category: 'Tax Exemption', parameter: 'Exempt: Least of 3', value: '(c) ₹25,00,000', section: 'Sec 10(10)(ii)', remarks: 'Absolute ceiling — aggregate across employers' },
    { sNo: 14, category: 'Tax Exemption', parameter: 'Non-covered Private (max limit)', value: '₹25,00,000', section: 'Sec 10(10)(iii)', remarks: 'Half-month salary × years ceiling also applies' },

    // Maximum Gratuity
    { sNo: 15, category: 'Limits', parameter: 'Maximum Payable', value: '₹25,00,000', section: 'Sec 4(3)', remarks: 'Increased from ₹20L via notification 2019' },
    { sNo: 16, category: 'Limits', parameter: 'Overpayment by employer', value: 'Voluntary — no upper limit', section: 'Employer discretion', remarks: 'Excess over ₹25L is taxable for employee' },

    // Forfeiture
    { sNo: 17, category: 'Forfeiture', parameter: 'Misconduct — damage/loss', value: 'Can forfeit to extent of damage', section: 'Sec 4(6)(a)', remarks: 'Only if damage is attributable to employee' },
    { sNo: 18, category: 'Forfeiture', parameter: 'Moral turpitude', value: 'Full forfeiture allowed', section: 'Sec 4(6)(b)', remarks: 'Termination for riotous or disorderly conduct' },

    // Payment Timeline
    { sNo: 19, category: 'Payment', parameter: 'Application Deadline', value: '30 days from due date', section: 'Sec 7(1)', remarks: 'Employee or nominee must apply' },
    { sNo: 20, category: 'Payment', parameter: 'Payment by Employer', value: '30 days from date it becomes payable', section: 'Sec 7(3)', remarks: 'Interest payable on delay @ 10% p.a.' },
    { sNo: 21, category: 'Payment', parameter: 'Nominee Payment (Death)', value: 'To nominee or legal heir', section: 'Sec 4(1)', remarks: 'No 5-year service requirement on death' },

    // Penalties
    { sNo: 22, category: 'Penalty', parameter: 'Non-payment', value: '6 months to 2 years imprisonment', section: 'Sec 9', remarks: 'Plus fine up to ₹20,000' },
    { sNo: 23, category: 'Penalty', parameter: 'False statement to avoid', value: '6 months to 1 year imprisonment', section: 'Sec 9', remarks: 'Plus fine up to ₹10,000' },

    // Recent Changes
    { sNo: 24, category: 'Updates', parameter: 'Code on Wages 2019', value: 'Proposed: Gratuity on basic (50% of CTC)', section: 'COW 2019', remarks: 'Not yet notified — will impact calculation significantly' },
    { sNo: 25, category: 'Updates', parameter: 'Fixed-Term Employees', value: 'Pro-rata gratuity (no 5-year rule)', section: 'COW 2019', remarks: 'Gratuity from Day 1 for fixed-term contracts' },
];
