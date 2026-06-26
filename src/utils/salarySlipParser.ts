import * as XLSX from 'xlsx';
import {
    type SalarySlipData, type CompanyInfo,
    DEFAULT_EARNINGS, DEFAULT_DEDUCTIONS, DEFAULT_WORKING_DAYS,
    DEFAULT_SLIP_SETTINGS,
    calcHRA, calcPF, calcESI, calcGross, calcSlip,
} from '../tools/salaryslip/salarySlipTypes';

export interface ParsedRow {
    data: SalarySlipData;
    errors: string[];
    rowIndex: number;
    email?: string;
}

export interface ParseResult {
    rows: ParsedRow[];
    totalErrors: number;
}

/**
 * Parses uploaded Excel into typed salary slip data.
 * Auto-fills PF/ESI/PT where values missing. Reports errors per row.
 */
export function parseSalarySlipExcel(file: File, company: CompanyInfo, state: string, isMetro: boolean): Promise<ParseResult> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const wb = XLSX.read(data, { type: 'array' });
                const ws = wb.Sheets[wb.SheetNames[0]];
                if (!ws) { reject(new Error('No sheet found')); return; }

                const json = XLSX.utils.sheet_to_json<Record<string, any>>(ws, { defval: '' });
                if (json.length === 0) { reject(new Error('No data rows found')); return; }

                const rows: ParsedRow[] = [];
                let totalErrors = 0;

                for (let i = 0; i < json.length; i++) {
                    const r = json[i];
                    const errors: string[] = [];

                    // Required
                    const employeeId = String(r['Employee ID'] || '').trim();
                    const employeeName = String(r['Employee Name'] || '').trim();
                    const basic = parseNum(r['Basic']);

                    if (!employeeId) errors.push('Missing Employee ID');
                    if (!employeeName) errors.push('Missing Employee Name');
                    if (!basic || basic <= 0) errors.push('Basic salary must be > 0');

                    const month = String(r['Month'] || 'January').trim();
                    const year = String(r['Year'] || new Date().getFullYear()).trim();

                    // Earnings
                    const hra = parseNum(r['HRA']) || (basic > 0 ? calcHRA(basic, isMetro) : 0);
                    const da = parseNum(r['DA']);
                    const specialAllowance = parseNum(r['Special Allowance']);
                    const conveyance = r['Conveyance'] !== undefined && r['Conveyance'] !== '' ? parseNum(r['Conveyance']) : 1600;
                    const medical = r['Medical'] !== undefined && r['Medical'] !== '' ? parseNum(r['Medical']) : 1250;
                    const lta = parseNum(r['LTA']);
                    const bonus = parseNum(r['Bonus']);
                    const overtime = parseNum(r['Overtime']);
                    const otherEarnings = parseNum(r['Other Earnings']);

                    const earnings = {
                        ...DEFAULT_EARNINGS,
                        basic, hra, da, specialAllowance,
                        conveyanceAllowance: conveyance, medicalAllowance: medical,
                        lta, bonus, overtimePay: overtime, otherEarnings,
                    };

                    const gross = calcGross(earnings);

                    // Deductions
                    const pfEmployee = r['PF Employee'] !== undefined && r['PF Employee'] !== '' ? parseNum(r['PF Employee']) : calcPF(basic);
                    const esi = r['ESI'] !== undefined && r['ESI'] !== '' ? parseNum(r['ESI']) : calcESI(gross);
                    const pt = r['Professional Tax'] !== undefined && r['Professional Tax'] !== '' ? parseNum(r['Professional Tax']) : 200;
                    const tds = parseNum(r['TDS']);
                    const loanRecovery = parseNum(r['Loan Recovery']);
                    const advance = parseNum(r['Advance']);
                    const otherDed = parseNum(r['Other Deductions']);

                    const deductions = {
                        ...DEFAULT_DEDUCTIONS,
                        pfEmployee, pfEmployer: pfEmployee, esi,
                        professionalTax: pt, tds,
                        loanRecovery, advanceDeduction: advance, otherDeductions: otherDed,
                    };

                    // Working days
                    const totalDays = r['Total Working Days'] !== undefined && r['Total Working Days'] !== '' ? parseNum(r['Total Working Days']) : 30;
                    const daysWorked = r['Days Worked'] !== undefined && r['Days Worked'] !== '' ? parseNum(r['Days Worked']) : totalDays;
                    const workingDays = { totalDays, daysWorked, lopDays: Math.max(0, totalDays - daysWorked) };

                    const calculations = calcSlip(earnings, deductions, workingDays);

                    const slipData: SalarySlipData = {
                        company,
                        employee: {
                            employeeName,
                            employeeId,
                            designation: String(r['Designation'] || '').trim(),
                            department: String(r['Department'] || '').trim(),
                            dateOfJoining: '',
                            bankAccount: String(r['Bank Account'] || '').trim(),
                            panNumber: String(r['PAN'] || '').trim(),
                            pfAccountNumber: String(r['PF Account Number'] || '').trim(),
                            salaryMonth: month,
                            salaryYear: year,
                        },
                        earnings,
                        deductions,
                        workingDays,
                        calculations,
                        isMetroCity: isMetro,
                        state,
                        settings: DEFAULT_SLIP_SETTINGS,
                    };

                    totalErrors += errors.length;
                    rows.push({
                        data: slipData,
                        errors,
                        rowIndex: i + 2, // Excel row (1-indexed header + 1)
                        email: String(r['Employee Email'] || '').trim() || undefined,
                    });
                }

                resolve({ rows, totalErrors });
            } catch (err) {
                reject(err);
            }
        };
        reader.readAsArrayBuffer(file);
    });
}

function parseNum(v: any): number {
    if (v === undefined || v === null || v === '') return 0;
    const n = typeof v === 'number' ? v : parseFloat(String(v).replace(/,/g, ''));
    return isNaN(n) ? 0 : n;
}
