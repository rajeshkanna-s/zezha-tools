// Leave Entitlement Rules — India (Key Labour Laws)
// Source: Factories Act, Shops & Establishments Acts, Central Civil Service Rules

export interface LeaveRuleEntry {
    sNo: number;
    leaveType: string;
    entitlement: string;
    applicableLaw: string;
    carryForward: string;
    encashment: string;
    category: string;
    remarks: string;
}

export const leaveRulesData: LeaveRuleEntry[] = [
    // Earned Leave / Privilege Leave
    { sNo: 1,  leaveType: 'Earned Leave (EL)', entitlement: '1 day per 20 working days', applicableLaw: 'Factories Act, 1948', carryForward: 'Up to 30 days', encashment: 'Yes — at retirement/resignation', category: 'Factory Workers', remarks: 'Called Privilege Leave in some states' },
    { sNo: 2,  leaveType: 'Earned Leave (EL)', entitlement: '1 day per 11 working days', applicableLaw: 'Factories Act, 1948 (Child)', carryForward: 'Up to 40 days', encashment: 'Yes', category: 'Child Workers (<15 yr)', remarks: 'Higher accrual for minors' },
    { sNo: 3,  leaveType: 'Earned Leave (EL)', entitlement: '15–21 days/year', applicableLaw: 'Shops & Establishments Act', carryForward: 'Up to 30–45 days (state-wise)', encashment: 'Yes — varies by state', category: 'Shop Employees', remarks: 'Maharashtra: 21 days; Karnataka: 18 days' },
    { sNo: 4,  leaveType: 'Earned Leave (EL)', entitlement: '30 days/year', applicableLaw: 'Central Civil Services (Leave) Rules', carryForward: 'Up to 300 days', encashment: 'Yes — max 300 days on superannuation', category: 'Central Govt', remarks: 'Section 10(10AA) tax exemption' },

    // Casual Leave
    { sNo: 5,  leaveType: 'Casual Leave (CL)', entitlement: '7–12 days/year', applicableLaw: 'Shops & Establishments Act', carryForward: 'No', encashment: 'No', category: 'Private Sector', remarks: 'Cannot be combined with other leave' },
    { sNo: 6,  leaveType: 'Casual Leave (CL)', entitlement: '8 days/year', applicableLaw: 'Central Civil Services Rules', carryForward: 'No', encashment: 'No', category: 'Central Govt', remarks: 'Half day CL permitted' },

    // Sick Leave
    { sNo: 7,  leaveType: 'Sick Leave (SL)', entitlement: '7–12 days/year', applicableLaw: 'Shops & Establishments Act', carryForward: 'Yes (varies by state)', encashment: 'Rarely', category: 'Private Sector', remarks: 'Medical certificate if > 2 consecutive days' },
    { sNo: 8,  leaveType: 'Sick Leave (SL)', entitlement: '20 days/year (half pay)', applicableLaw: 'Central Civil Services Rules', carryForward: 'Unlimited accumulation', encashment: 'No (but can be commuted to EL)', category: 'Central Govt', remarks: 'Half-pay leave that can be commuted' },

    // Maternity Leave
    { sNo: 9,  leaveType: 'Maternity Leave (ML)', entitlement: '26 weeks (1st & 2nd child)', applicableLaw: 'Maternity Benefit Act, 1961', carryForward: 'N/A', encashment: 'Full pay during leave', category: 'All Women', remarks: 'Applies to establishments with 10+ employees' },
    { sNo: 10, leaveType: 'Maternity Leave (ML)', entitlement: '12 weeks (3rd child onwards)', applicableLaw: 'Maternity Benefit Act, 1961', carryForward: 'N/A', encashment: 'Full pay during leave', category: 'All Women', remarks: '6 weeks pre-natal + 6 weeks post-natal' },
    { sNo: 11, leaveType: 'Maternity Leave — Adoption', entitlement: '12 weeks', applicableLaw: 'Maternity Benefit Act, 2017 Amend.', carryForward: 'N/A', encashment: 'Full pay during leave', category: 'Adoptive/Commissioning Mothers', remarks: 'Child < 3 months old at adoption' },

    // Paternity Leave
    { sNo: 12, leaveType: 'Paternity Leave', entitlement: '15 days', applicableLaw: 'Central Civil Services Rules', carryForward: 'No', encashment: 'No', category: 'Central Govt Only', remarks: 'No statutory paternity leave for private sector' },
    { sNo: 13, leaveType: 'Paternity Leave', entitlement: '0 (No law)', applicableLaw: 'No Central Act for Private', carryForward: 'N/A', encashment: 'N/A', category: 'Private Sector', remarks: 'Company policy — many offer 5–15 days' },

    // Child Care Leave
    { sNo: 14, leaveType: 'Child Care Leave (CCL)', entitlement: '730 days in service', applicableLaw: 'Central Civil Services Rules', carryForward: 'Cumulative up to 730 days', encashment: 'No', category: 'Central Govt Women', remarks: 'For children < 18 years old' },

    // Compensatory Off
    { sNo: 15, leaveType: 'Compensatory Off (CO)', entitlement: 'Equal to holidays worked', applicableLaw: 'Factories Act / S&E Act', carryForward: 'Within 1–3 months', encashment: 'Varies by company', category: 'All Employees', remarks: 'Must be availed within notice period' },

    // Study Leave
    { sNo: 16, leaveType: 'Study Leave', entitlement: 'Up to 24 months', applicableLaw: 'Central Civil Services Rules', carryForward: 'N/A', encashment: 'No', category: 'Central Govt', remarks: 'Higher education related to job' },

    // Special Disability Leave
    { sNo: 17, leaveType: 'Special Disability Leave', entitlement: 'Up to 24 months', applicableLaw: 'Central Civil Services Rules', carryForward: 'N/A', encashment: 'No', category: 'Central Govt', remarks: 'For injuries in line of duty' },

    // ESI Sickness Benefit
    { sNo: 18, leaveType: 'ESI Sickness Benefit', entitlement: '91 days in 2 consecutive IPs', applicableLaw: 'ESI Act, 1948', carryForward: 'N/A', encashment: '70% of average daily wages', category: 'ESI-covered (≤₹21K)', remarks: 'Min 78 days contribution required' },

    // National & Festival Holidays
    { sNo: 19, leaveType: 'National Holidays', entitlement: '3 compulsory (26 Jan, 15 Aug, 2 Oct)', applicableLaw: 'Negotiable Instruments Act', carryForward: 'N/A', encashment: 'Double wages if worked', category: 'All Employees', remarks: 'Must give paid off' },
    { sNo: 20, leaveType: 'Festival Holidays', entitlement: '6–15 days (state-wise)', applicableLaw: 'Shops & Establishments Act', carryForward: 'N/A', encashment: 'Substitute holiday if worked', category: 'All Employees', remarks: 'Diwali, Holi, Eid, Christmas etc.' },

    // Weekly Off
    { sNo: 21, leaveType: 'Weekly Off', entitlement: '1 day per week (min)', applicableLaw: 'Factories Act / S&E Act', carryForward: 'N/A', encashment: 'Overtime rates if worked', category: 'All Employees', remarks: '48 hrs/week max for factories' },
];
