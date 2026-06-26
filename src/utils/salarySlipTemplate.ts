import * as XLSX from 'xlsx';

/**
 * Downloads a pre-formatted Excel template for bulk salary slip generation.
 * Includes 10 sample employee records.
 */
export const downloadSalarySlipTemplate = () => {
    const headers = [
        'Employee ID', 'Employee Name', 'Designation', 'Department',
        'Basic', 'HRA', 'DA', 'Special Allowance', 'Conveyance', 'Medical',
        'LTA', 'Bonus', 'Overtime', 'Other Earnings',
        'PF Employee', 'ESI', 'Professional Tax', 'TDS', 'Loan Recovery', 'Advance', 'Other Deductions',
        'Bank Account', 'PAN', 'PF Account Number', 'Days Worked', 'Total Working Days', 'Month', 'Year',
        'Employee Email',
    ];

    const month = new Date().toLocaleString('en', { month: 'long' });
    const year = String(new Date().getFullYear());

    const samples = [
        ['EMP001', 'Rajesh Kumar', 'Software Engineer', 'Engineering',
            30000, 15000, 3000, 5000, 1600, 1250, 2000, 0, 0, 0,
            1800, 0, 200, 2500, 0, 0, 0,
            '123456789012', 'ABCPK1234A', 'TN00012345678', 30, 30, month, year, 'rajesh@company.com'],

        ['EMP002', 'Priya Sharma', 'Marketing Manager', 'Marketing',
            40000, 20000, 4000, 8000, 1600, 1250, 5000, 2000, 0, 0,
            1800, 0, 200, 4000, 5000, 0, 0,
            '987654321098', 'DEFPS5678B', 'TN00056789012', 28, 30, month, year, 'priya@company.com'],

        ['EMP003', 'Arun Patel', 'Senior Developer', 'Engineering',
            45000, 22500, 4500, 10000, 1600, 1250, 3000, 0, 0, 0,
            1800, 0, 0, 5000, 0, 0, 0,
            '112233445566', 'GHIAP9012C', 'KA00034567890', 30, 30, month, year, 'arun@company.com'],

        ['EMP004', 'Sneha Reddy', 'HR Executive', 'Human Resources',
            25000, 12500, 2500, 4000, 1600, 1250, 1500, 0, 0, 0,
            1800, 0, 200, 1500, 0, 0, 0,
            '998877665544', 'JKLSR3456D', 'TN00078901234', 30, 30, month, year, 'sneha@company.com'],

        ['EMP005', 'Vikram Singh', 'Data Analyst', 'Analytics',
            35000, 17500, 3500, 6000, 1600, 1250, 2500, 1000, 0, 0,
            1800, 0, 200, 3000, 0, 0, 0,
            '556677889900', 'MNOVS7890E', 'MH00045678901', 29, 30, month, year, 'vikram@company.com'],

        ['EMP006', 'Divya Nair', 'UX Designer', 'Design',
            32000, 16000, 3200, 5500, 1600, 1250, 2000, 0, 0, 500,
            1800, 0, 200, 2800, 0, 0, 0,
            '334455667788', 'PQRDN2345F', 'KL00023456789', 30, 30, month, year, 'divya@company.com'],

        ['EMP007', 'Mohammed Irfan', 'Accountant', 'Finance',
            28000, 14000, 2800, 4500, 1600, 1250, 1800, 0, 0, 0,
            1800, 0, 200, 2000, 3000, 0, 0,
            '778899001122', 'STUMI6789G', 'AP00067890123', 30, 30, month, year, 'irfan@company.com'],

        ['EMP008', 'Kavitha Sundaram', 'Project Manager', 'Engineering',
            50000, 25000, 5000, 12000, 1600, 1250, 4000, 3000, 0, 0,
            1800, 0, 0, 6000, 0, 2000, 0,
            '445566778899', 'VWXKS0123H', 'TN00090123456', 30, 30, month, year, 'kavitha@company.com'],

        ['EMP009', 'Ravi Teja', 'Sales Executive', 'Sales',
            22000, 11000, 2200, 3500, 1600, 1250, 1000, 5000, 0, 0,
            1800, 0, 200, 1000, 0, 0, 0,
            '667788990011', 'YZART4567I', 'TS00012345678', 27, 30, month, year, 'ravi@company.com'],

        ['EMP010', 'Lakshmi Menon', 'Content Writer', 'Marketing',
            20000, 10000, 2000, 3000, 1600, 1250, 800, 0, 0, 0,
            1800, 0, 200, 800, 0, 0, 0,
            '889900112233', 'BCDLM8901J', 'KL00056789012', 30, 30, month, year, 'lakshmi@company.com'],
    ];

    const wsData = [headers, ...samples];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    ws['!cols'] = [
        { wch: 14 }, { wch: 22 }, { wch: 22 }, { wch: 18 },
        { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 16 }, { wch: 12 }, { wch: 12 },
        { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 14 },
        { wch: 12 }, { wch: 10 }, { wch: 16 }, { wch: 10 }, { wch: 14 }, { wch: 10 }, { wch: 16 },
        { wch: 18 }, { wch: 14 }, { wch: 16 }, { wch: 14 }, { wch: 18 }, { wch: 12 }, { wch: 10 },
        { wch: 24 },
    ];

    const instructions = [
        ['ReportsIQ — Salary Slip Bulk Upload Template'],
        [''],
        ['INSTRUCTIONS:'],
        ['1. Fill the "Salary Data" sheet from row 2 onwards (row 1 = headers, do NOT edit headers)'],
        ['2. Each row = one employee salary slip'],
        ['3. Required fields: Employee ID, Employee Name, Basic, Month, Year'],
        ['4. If PF Employee is blank and Basic > 0, PF will be auto-calculated at 12% of Basic (max ₹15,000)'],
        ['5. If ESI is blank and gross salary < ₹21,000, ESI will be auto-calculated at 0.75%'],
        ['6. If Professional Tax is blank, it will be set to ₹200 (default)'],
        ['7. Days Worked defaults to Total Working Days if blank'],
        ['8. Total Working Days defaults to 30 if blank'],
        ['9. Month: January, February, ..., December'],
        ['10. Year: 4-digit year e.g. 2026'],
        ['11. Employee Email: required only if you plan to send slips via email'],
        ['12. The template includes 10 sample employees for reference — replace with your data'],
        [''],
        ['EARNINGS COLUMNS:'],
        ['Basic — Monthly basic salary (required)'],
        ['HRA — House Rent Allowance (auto-calc: 40% of Basic if blank)'],
        ['DA — Dearness Allowance'],
        ['Special Allowance — Any special or flexible allowance'],
        ['Conveyance — Standard ₹1,600 if blank'],
        ['Medical — Standard ₹1,250 if blank'],
        ['LTA, Bonus, Overtime, Other Earnings — Enter as applicable'],
        [''],
        ['DEDUCTIONS COLUMNS:'],
        ['PF Employee — Employee PF contribution (auto: 12% of Basic, max on ₹15,000)'],
        ['ESI — Auto if gross < ₹21,000 (0.75% of gross)'],
        ['Professional Tax — Auto ₹200 if blank'],
        ['TDS — Monthly income tax deduction'],
        ['Loan Recovery, Advance, Other Deductions — Enter as applicable'],
    ];

    const wsInfo = XLSX.utils.aoa_to_sheet(instructions);
    wsInfo['!cols'] = [{ wch: 80 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Salary Data');
    XLSX.utils.book_append_sheet(wb, wsInfo, 'Instructions');

    XLSX.writeFile(wb, 'salary_slip_template.xlsx');
};
