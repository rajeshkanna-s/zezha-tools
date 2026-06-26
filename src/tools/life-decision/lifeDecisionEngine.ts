// ── Types ──────────────────────────────────────────────────────

export interface BaselineData {
    // Income
    primaryIncome: number;
    secondaryIncome: number;
    spouseIncome: number;
    // Expenses
    essentialExpenses: number;
    discretionaryExpenses: number;
    currentEMIs: number;
    monthlyInvestments: number;
    // Assets
    cashBank: number;
    mfStocksFD: number;
    epfPpfNps: number;
    propertyValue: number;
    goldOther: number;
    // Debts
    homeLoan: number;
    carLoan: number;
    personalLoan: number;
    creditCardDebt: number;
    // Life
    currentAge: number;
    spouseAge: number;
    numChildren: number;
    childrenAges: number[];
    employmentType: 'salaried' | 'business' | 'freelance';
    // Goals
    retirementAge: number;
    retirementMonthlyNeed: number;
    emergencyFundTarget: 3 | 6 | 12;
    // Assumptions
    expectedReturn: number;
    expectedInflation: number;
    salaryGrowth: number;
    lifeExpectancy: number;
}

export interface SnapshotMetric {
    label: string;
    value: string;
    status: 'green' | 'yellow' | 'red';
    detail: string;
}

export interface BaselineSnapshot {
    monthlySurplus: number;
    netWorth: number;
    emiToIncome: number;
    savingsRate: number;
    emergencyFundMonths: number;
    projectedRetirementAge: number;
    insuranceGap: number;
    fiNumberGap: number;
    metrics: SnapshotMetric[];
}

export interface RippleRow {
    label: string;
    before: string;
    after: string;
    change: string;
    status: 'green' | 'yellow' | 'red' | 'neutral';
}

export interface FixSuggestion {
    title: string;
    description: string;
    scenarioOverrides?: Record<string, number>;
}

export interface ScenarioResult {
    scenarioName: string;
    scenarioIcon: string;
    immediateImpact: { label: string; value: string; status: 'green' | 'yellow' | 'red' }[];
    cashFlowRows: RippleRow[];
    emergencyFundImpact: string;
    emergencyFundStatus: 'green' | 'yellow' | 'red';
    retirementImpact: string;
    retirementStatus: 'green' | 'yellow' | 'red';
    taxImpact: string;
    taxStatus: 'green' | 'yellow' | 'red';
    longTermWealth: { label: string; withoutScenario: number; withScenario: number }[];
    summary: string;
    fixes: FixSuggestion[];
    overallScore: number;
    riskLevel: 'Low' | 'Medium' | 'High' | 'Very High';
    newRetirementAge: number;
    newMonthlySurplus: number;
    newNetWorthAt10Yr: number;
}

export interface ComparisonResult {
    scenarios: { name: string; result: ScenarioResult }[];
    winner: number;
}

// ── Helpers ────────────────────────────────────────────────────

const fmt = (n: number): string => {
    if (Math.abs(n) >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)}Cr`;
    if (Math.abs(n) >= 1_00_000) return `₹${(n / 1_00_000).toFixed(1)}L`;
    return `₹${n.toLocaleString('en-IN')}`;
};

const fmtPct = (n: number) => `${n.toFixed(1)}%`;

const futureValue = (pv: number, rate: number, years: number) => pv * Math.pow(1 + rate / 100, years);

const sipFV = (monthly: number, rate: number, years: number) => {
    const r = rate / 100 / 12;
    const n = years * 12;
    if (r === 0) return monthly * n;
    return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
};

const emi = (principal: number, annualRate: number, tenureYears: number) => {
    const r = annualRate / 100 / 12;
    const n = tenureYears * 12;
    if (r === 0) return principal / n;
    return principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
};

// ── Baseline Snapshot ──────────────────────────────────────────

export function getDefaultBaseline(): BaselineData {
    return {
        primaryIncome: 0, secondaryIncome: 0, spouseIncome: 0,
        essentialExpenses: 0, discretionaryExpenses: 0, currentEMIs: 0, monthlyInvestments: 0,
        cashBank: 0, mfStocksFD: 0, epfPpfNps: 0, propertyValue: 0, goldOther: 0,
        homeLoan: 0, carLoan: 0, personalLoan: 0, creditCardDebt: 0,
        currentAge: 30, spouseAge: 0, numChildren: 0, childrenAges: [],
        employmentType: 'salaried',
        retirementAge: 60, retirementMonthlyNeed: 50000, emergencyFundTarget: 6,
        expectedReturn: 12, expectedInflation: 6, salaryGrowth: 8, lifeExpectancy: 85,
    };
}

export function totalMonthlyIncome(b: BaselineData) {
    return b.primaryIncome + b.secondaryIncome + b.spouseIncome;
}

export function totalMonthlyExpenses(b: BaselineData) {
    return b.essentialExpenses + b.discretionaryExpenses + b.currentEMIs + b.monthlyInvestments;
}

export function totalAssets(b: BaselineData) {
    return b.cashBank + b.mfStocksFD + b.epfPpfNps + b.propertyValue + b.goldOther;
}

export function totalDebts(b: BaselineData) {
    return b.homeLoan + b.carLoan + b.personalLoan + b.creditCardDebt;
}

export function computeBaselineSnapshot(b: BaselineData): BaselineSnapshot {
    const income = totalMonthlyIncome(b);
    const expenses = totalMonthlyExpenses(b);
    const surplus = income - expenses;
    const nw = totalAssets(b) - totalDebts(b);
    const emiRatio = income > 0 ? (b.currentEMIs / income) * 100 : 0;
    const savingsRate = income > 0 ? (surplus / income) * 100 : 0;
    const monthlyExp = b.essentialExpenses + b.discretionaryExpenses + b.currentEMIs;
    const emergencyMonths = monthlyExp > 0 ? b.cashBank / monthlyExp : 0;

    // Retirement projection
    const yearsToRetire = Math.max(0, b.retirementAge - b.currentAge);
    const retirementYears = Math.max(0, b.lifeExpectancy - b.retirementAge);
    const inflatedMonthlyNeed = b.retirementMonthlyNeed * Math.pow(1 + b.expectedInflation / 100, yearsToRetire);
    const corpusNeeded = inflatedMonthlyNeed * 12 * retirementYears;
    const currentInvestments = b.mfStocksFD + b.epfPpfNps;
    const projectedCorpus = futureValue(currentInvestments, b.expectedReturn, yearsToRetire) + sipFV(b.monthlyInvestments, b.expectedReturn, yearsToRetire);
    const fiGap = Math.max(0, corpusNeeded - projectedCorpus);

    // Projected retirement age (when corpus meets need)
    let projRetAge = b.retirementAge;
    if (projectedCorpus < corpusNeeded && b.monthlyInvestments > 0) {
        for (let y = yearsToRetire + 1; y <= 50; y++) {
            const proj = futureValue(currentInvestments, b.expectedReturn, y) + sipFV(b.monthlyInvestments, b.expectedReturn, y);
            const retYrs = Math.max(0, b.lifeExpectancy - (b.currentAge + y));
            const needAtY = b.retirementMonthlyNeed * Math.pow(1 + b.expectedInflation / 100, y) * 12 * retYrs;
            if (proj >= needAtY) { projRetAge = b.currentAge + y; break; }
        }
        if (projRetAge === b.retirementAge && projectedCorpus < corpusNeeded) projRetAge = b.retirementAge + 10;
    }

    // Insurance gap (simple: 10x annual income - assumed 0 cover if not entered)
    const insuranceGap = income * 12 * 10;

    const metrics: SnapshotMetric[] = [
        { label: 'Monthly Surplus', value: fmt(surplus), status: surplus > 0 ? (surplus > income * 0.2 ? 'green' : 'yellow') : 'red', detail: surplus > 0 ? 'Positive' : 'Negative cash flow' },
        { label: 'Net Worth', value: fmt(nw), status: nw > b.currentAge * 100000 ? 'green' : nw > 0 ? 'yellow' : 'red', detail: nw > b.currentAge * 100000 ? 'Above age benchmark' : 'Below age benchmark' },
        { label: 'EMI-to-Income', value: fmtPct(emiRatio), status: emiRatio <= 30 ? 'green' : emiRatio <= 50 ? 'yellow' : 'red', detail: emiRatio <= 30 ? 'Safe' : emiRatio <= 50 ? 'Moderate' : 'Danger zone' },
        { label: 'Savings Rate', value: fmtPct(savingsRate), status: savingsRate >= 20 ? 'green' : savingsRate >= 10 ? 'yellow' : 'red', detail: savingsRate >= 20 ? 'Good' : `Below 20% target` },
        { label: 'Emergency Fund', value: `${emergencyMonths.toFixed(1)} months`, status: emergencyMonths >= b.emergencyFundTarget ? 'green' : emergencyMonths >= 3 ? 'yellow' : 'red', detail: `Target is ${b.emergencyFundTarget} months` },
        { label: 'Retirement Track', value: projRetAge <= b.retirementAge ? `On track (${b.retirementAge})` : `Age ${projRetAge}`, status: projRetAge <= b.retirementAge ? 'green' : projRetAge <= b.retirementAge + 5 ? 'yellow' : 'red', detail: projRetAge > b.retirementAge ? `${projRetAge - b.retirementAge}yr delay` : 'On target' },
        { label: 'Insurance Gap', value: fmt(insuranceGap), status: 'red', detail: 'Based on 10× annual income' },
        { label: 'FI Number Gap', value: fmt(fiGap), status: fiGap === 0 ? 'green' : fiGap < corpusNeeded * 0.5 ? 'yellow' : 'red', detail: fiGap === 0 ? 'On track' : 'Needs more investment' },
    ];

    return { monthlySurplus: surplus, netWorth: nw, emiToIncome: emiRatio, savingsRate, emergencyFundMonths: emergencyMonths, projectedRetirementAge: projRetAge, insuranceGap, fiNumberGap: fiGap, metrics };
}

// ── Scenario Engines ───────────────────────────────────────────

export interface HomeBuyingInputs {
    propertyValue: number;
    downPaymentPct: number;
    loanTenure: number;
    startDelay: number; // months
    propertyGrowth: number;
    spouseStopsWorking: boolean;
    currentRent: number;
}

export function computeHomeBuying(b: BaselineData, inp: HomeBuyingInputs): ScenarioResult {
    const income = totalMonthlyIncome(b);
    const downPayment = inp.propertyValue * inp.downPaymentPct / 100;
    const loanAmount = inp.propertyValue - downPayment;
    const monthlyEMI = emi(loanAmount, 8.5, inp.loanTenure);
    const incomeAfter = inp.spouseStopsWorking ? income - b.spouseIncome : income;
    const newTotalEMIs = b.currentEMIs + monthlyEMI;
    const newEmiRatio = incomeAfter > 0 ? (newTotalEMIs / incomeAfter) * 100 : 100;

    const rentSaving = inp.currentRent;
    const maintenanceCost = inp.propertyValue * 0.01 / 12;
    const newExpenses = b.essentialExpenses - rentSaving + maintenanceCost + b.discretionaryExpenses + newTotalEMIs;
    const newSurplus = incomeAfter - newExpenses - b.monthlyInvestments;
    const canInvest = newSurplus >= 0;
    const newInvestments = canInvest ? b.monthlyInvestments : 0;
    const actualSurplus = incomeAfter - (b.essentialExpenses - rentSaving + maintenanceCost + b.discretionaryExpenses + newTotalEMIs + newInvestments);

    const savingsAfterDP = b.cashBank - downPayment;
    const monthlyExp = b.essentialExpenses + b.discretionaryExpenses + newTotalEMIs;
    const emergencyAfter = savingsAfterDP > 0 ? savingsAfterDP / monthlyExp : 0;

    // Long term (10 years)
    const propValueAt10 = futureValue(inp.propertyValue, inp.propertyGrowth, 10);
    const rentPlusInvestCorpus = sipFV(b.monthlyInvestments + rentSaving, b.expectedReturn, 10) + futureValue(b.mfStocksFD, b.expectedReturn, 10);
    const buyCorpus = propValueAt10 + (canInvest ? sipFV(newInvestments, b.expectedReturn, 10) : 0);

    // Tax savings
    const annualPrincipal = Math.min(150000, loanAmount / inp.loanTenure);
    const annualInterest = Math.min(200000, loanAmount * 0.085);
    const taxSaving = (annualPrincipal + annualInterest) * 0.3;
    const monthlyTaxSave = taxSaving / 12;

    // Retirement impact
    const snapshot = computeBaselineSnapshot(b);
    const investmentLoss = !canInvest ? b.monthlyInvestments : 0;
    let newRetAge = snapshot.projectedRetirementAge;
    if (investmentLoss > 0) {
        const lostYears = Math.ceil(investmentLoss * 12 * 5 / (b.monthlyInvestments * 12)); // rough
        newRetAge = Math.min(snapshot.projectedRetirementAge + lostYears, 75);
    }

    const dpShortfall = downPayment - b.cashBank;

    const immediateImpact = [
        { label: 'Down Payment Required', value: fmt(downPayment), status: dpShortfall > 0 ? 'red' as const : 'green' as const },
        { label: 'Your Savings Available', value: fmt(b.cashBank), status: b.cashBank >= downPayment ? 'green' as const : 'red' as const },
        ...(dpShortfall > 0 ? [{ label: 'Shortfall', value: fmt(dpShortfall), status: 'red' as const }] : []),
        { label: 'Monthly EMI', value: fmt(Math.round(monthlyEMI)), status: newEmiRatio > 50 ? 'red' as const : 'yellow' as const },
    ];

    const cashFlowRows: RippleRow[] = [
        { label: 'Monthly Income', before: fmt(income), after: fmt(incomeAfter), change: income === incomeAfter ? '—' : fmt(incomeAfter - income), status: 'neutral' },
        { label: 'Total EMIs', before: fmt(b.currentEMIs), after: fmt(Math.round(newTotalEMIs)), change: `+${fmt(Math.round(monthlyEMI))}`, status: newEmiRatio > 50 ? 'red' : 'yellow' },
        { label: 'EMI-to-Income Ratio', before: fmtPct(snapshot.emiToIncome), after: fmtPct(newEmiRatio), change: newEmiRatio > 50 ? '🔴 Danger' : '🟡', status: newEmiRatio > 50 ? 'red' : 'yellow' },
        { label: 'Rent Saving', before: fmt(0), after: fmt(-rentSaving), change: fmt(-rentSaving), status: 'green' },
        { label: 'Maintenance Added', before: '—', after: fmt(Math.round(maintenanceCost)), change: `+${fmt(Math.round(maintenanceCost))}`, status: 'yellow' },
        { label: 'Monthly Investments', before: fmt(b.monthlyInvestments), after: fmt(newInvestments), change: canInvest ? '—' : '🔴 Stops', status: canInvest ? 'green' : 'red' },
        { label: 'Monthly Surplus', before: fmt(snapshot.monthlySurplus), after: fmt(Math.round(actualSurplus)), change: fmt(Math.round(actualSurplus - snapshot.monthlySurplus)), status: actualSurplus >= 0 ? 'green' : 'red' },
    ];

    const summary = actualSurplus < 0
        ? `At your current income, this home purchase creates serious financial stress. Your EMI ratio hits ${fmtPct(newEmiRatio)} — well above the safe 40% limit — and your monthly savings turn ${actualSurplus < 0 ? 'negative' : 'very thin'}. ${!canInvest ? 'Your SIPs will stop completely.' : ''} The tax saving of ${fmt(Math.round(taxSaving))}/year helps but doesn't solve the problem.`
        : `This home purchase is feasible at your current income. Your EMI ratio will be ${fmtPct(newEmiRatio)} which is ${newEmiRatio <= 40 ? 'within safe limits' : 'borderline'}. ${canInvest ? 'You can continue your SIPs.' : 'However, your SIPs will need to stop.'} The property appreciation and tax savings work in your favour long term.`;

    const fixes: FixSuggestion[] = [];
    if (actualSurplus < 0) {
        const smallerProp = inp.propertyValue * 0.75;
        fixes.push({ title: `Choose a smaller property (${fmt(smallerProp)})`, description: `EMI drops to ${fmt(Math.round(emi(smallerProp * (1 - inp.downPaymentPct / 100), 8.5, inp.loanTenure)))} → more manageable` });
        fixes.push({ title: 'Wait and save for larger down payment', description: `Save ${fmt(Math.round(Math.abs(actualSurplus) + 15000))}/month for 18-24 months to increase down payment and reduce EMI` });
        fixes.push({ title: 'Increase income first', description: `Need ${fmt(Math.round(Math.abs(actualSurplus) + 10000))} more/month to make this safe` });
    }

    return {
        scenarioName: 'Buying a Home', scenarioIcon: '🏠',
        immediateImpact, cashFlowRows,
        emergencyFundImpact: savingsAfterDP <= 0 ? 'Emergency fund completely drained' : `Reduced to ${emergencyAfter.toFixed(1)} months`,
        emergencyFundStatus: savingsAfterDP <= 0 ? 'red' : emergencyAfter < 3 ? 'red' : 'yellow',
        retirementImpact: newRetAge > snapshot.projectedRetirementAge ? `Retirement pushed to age ${newRetAge} (+${newRetAge - snapshot.projectedRetirementAge} years)` : 'No change',
        retirementStatus: newRetAge > snapshot.projectedRetirementAge + 5 ? 'red' : newRetAge > snapshot.projectedRetirementAge ? 'yellow' : 'green',
        taxImpact: `Annual tax saving: ${fmt(Math.round(taxSaving))} (Sec 80C + 24b)`,
        taxStatus: 'green',
        longTermWealth: [
            { label: 'Property Value (10yr)', withoutScenario: 0, withScenario: Math.round(propValueAt10) },
            { label: 'Investment Corpus (10yr)', withoutScenario: Math.round(rentPlusInvestCorpus), withScenario: Math.round(canInvest ? sipFV(newInvestments, b.expectedReturn, 10) : 0) },
            { label: 'Total Net Worth (10yr)', withoutScenario: Math.round(rentPlusInvestCorpus), withScenario: Math.round(buyCorpus) },
        ],
        summary, fixes,
        overallScore: actualSurplus >= 0 ? (newEmiRatio <= 40 ? 78 : 55) : (actualSurplus > -10000 ? 40 : 25),
        riskLevel: newEmiRatio > 60 ? 'Very High' : newEmiRatio > 50 ? 'High' : newEmiRatio > 40 ? 'Medium' : 'Low',
        newRetirementAge: newRetAge, newMonthlySurplus: Math.round(actualSurplus), newNetWorthAt10Yr: Math.round(buyCorpus),
    };
}

export interface JobChangeInputs {
    newSalary: number;
    joiningBonus: number;
    careerGrowthRate: number;
    noticePeriodMonths: number;
    gapMonths: number;
    esopLoss: number;
    relocationCost: number;
    pfWithdraw: boolean;
}

export function computeJobChange(b: BaselineData, inp: JobChangeInputs): ScenarioResult {
    const oldIncome = totalMonthlyIncome(b);
    const newIncome = inp.newSalary + b.secondaryIncome + b.spouseIncome;
    const salaryIncrease = inp.newSalary - b.primaryIncome;
    const gapLoss = oldIncome * inp.gapMonths;
    const netYear1 = salaryIncrease * (12 - inp.gapMonths) + inp.joiningBonus - gapLoss - inp.relocationCost - inp.esopLoss;
    const breakEvenMonths = netYear1 < 0 ? Math.ceil(Math.abs(netYear1) / salaryIncrease) + (12 - inp.gapMonths) : 0;

    const snapshot = computeBaselineSnapshot(b);
    const newSurplus = newIncome - totalMonthlyExpenses(b) + (newIncome - oldIncome);
    const taxOnIncrease = salaryIncrease > 0 ? salaryIncrease * 0.3 : 0;
    const effectiveTakeHome = salaryIncrease - taxOnIncrease;

    // 5 year trajectory
    const stayTotal = Array.from({ length: 5 }, (_, i) => b.primaryIncome * 12 * Math.pow(1 + b.salaryGrowth / 100, i + 1)).reduce((a, b) => a + b, 0);
    const leaveTotal = Array.from({ length: 5 }, (_, i) => {
        if (i === 0) return inp.newSalary * (12 - inp.gapMonths);
        return inp.newSalary * 12 * Math.pow(1 + inp.careerGrowthRate / 100, i);
    }).reduce((a, b) => a + b, 0);

    const pfLoss = inp.pfWithdraw ? b.epfPpfNps * 0.3 : 0;
    const pfRetirementImpact = inp.pfWithdraw ? futureValue(b.epfPpfNps * 0.3, b.expectedReturn, b.retirementAge - b.currentAge) : 0;

    const immediateImpact = [
        { label: 'Salary Increase', value: `+${fmt(salaryIncrease)}/month`, status: 'green' as const },
        { label: `Loss during gap (${inp.gapMonths}mo)`, value: fmt(-gapLoss), status: gapLoss > 0 ? 'red' as const : 'green' as const },
        { label: 'Joining Bonus', value: fmt(inp.joiningBonus), status: 'green' as const },
        { label: 'ESOP Forfeiture', value: fmt(-inp.esopLoss), status: inp.esopLoss > 0 ? 'red' as const : 'green' as const },
        { label: 'Net Year 1', value: fmt(Math.round(netYear1)), status: netYear1 >= 0 ? 'green' as const : 'red' as const },
    ];

    const cashFlowRows: RippleRow[] = [
        { label: 'Monthly Income', before: fmt(oldIncome), after: fmt(newIncome), change: `+${fmt(salaryIncrease)}`, status: 'green' },
        { label: 'Tax on Increase (30%)', before: '—', after: fmt(Math.round(taxOnIncrease)), change: `−${fmt(Math.round(taxOnIncrease))}`, status: 'yellow' },
        { label: 'Effective Take-Home Rise', before: '—', after: fmt(Math.round(effectiveTakeHome)), change: `+${fmt(Math.round(effectiveTakeHome))}`, status: 'green' },
        { label: 'Monthly Surplus', before: fmt(snapshot.monthlySurplus), after: fmt(Math.round(snapshot.monthlySurplus + effectiveTakeHome)), change: `+${fmt(Math.round(effectiveTakeHome))}`, status: 'green' },
    ];

    const summary = netYear1 >= 0
        ? `This job change is financially positive from Year 1 itself. Your salary increases by ${fmt(salaryIncrease)}/month, and even after tax, gap period, and relocation costs, you come out ahead. ${breakEvenMonths > 0 ? `Break-even point is Month ${breakEvenMonths}.` : ''} Over 5 years, leaving earns ${fmt(Math.round(leaveTotal - stayTotal))} more.`
        : `Year 1 shows a net loss of ${fmt(Math.round(Math.abs(netYear1)))} due to gap period, ESOP forfeiture, and relocation costs. You'll break even at Month ${breakEvenMonths}. However, over 5 years, leaving earns ${fmt(Math.round(leaveTotal - stayTotal))} more — making it worthwhile IF you stay 2+ years.`;

    return {
        scenarioName: 'Changing Jobs', scenarioIcon: '💼',
        immediateImpact, cashFlowRows,
        emergencyFundImpact: `${inp.gapMonths} months without income — need ${fmt(Math.round(oldIncome * inp.gapMonths))} buffer`,
        emergencyFundStatus: b.cashBank >= oldIncome * inp.gapMonths ? 'green' : 'red',
        retirementImpact: inp.pfWithdraw ? `PF withdrawal loses ${fmt(Math.round(pfRetirementImpact))} at retirement` : 'PF transferred — no impact',
        retirementStatus: inp.pfWithdraw ? 'red' : 'green',
        taxImpact: `Move to 30% slab on incremental ₹${salaryIncrease.toLocaleString('en-IN')}. Effective increase: ${fmt(Math.round(effectiveTakeHome))}/month`,
        taxStatus: 'yellow',
        longTermWealth: [
            { label: '5-Year Total (Stay)', withoutScenario: Math.round(stayTotal), withScenario: 0 },
            { label: '5-Year Total (Leave)', withoutScenario: 0, withScenario: Math.round(leaveTotal) },
            { label: '5-Year Net Gain', withoutScenario: 0, withScenario: Math.round(leaveTotal - stayTotal) },
        ],
        summary,
        fixes: breakEvenMonths > 12 ? [{ title: 'Negotiate higher joining bonus', description: `A bonus of ${fmt(Math.round(inp.joiningBonus + Math.abs(netYear1)))} would make Year 1 positive` }] : [],
        overallScore: netYear1 >= 0 ? 82 : breakEvenMonths <= 18 ? 65 : 45,
        riskLevel: breakEvenMonths > 18 ? 'High' : breakEvenMonths > 6 ? 'Medium' : 'Low',
        newRetirementAge: snapshot.projectedRetirementAge - (effectiveTakeHome > 0 ? 1 : 0),
        newMonthlySurplus: Math.round(snapshot.monthlySurplus + effectiveTakeHome),
        newNetWorthAt10Yr: Math.round(futureValue(totalAssets(b) - totalDebts(b), b.expectedReturn, 10) + sipFV(b.monthlyInvestments + effectiveTakeHome, b.expectedReturn, 10)),
    };
}

export interface ChildInputs {
    birthDelay: number; // months
    spouseBreakMonths: number;
    educationPlan: 'government' | 'mid-private' | 'premium-private' | 'iit-target' | 'abroad';
    city: 'metro' | 'tier2' | 'tier3';
    secondChild: boolean;
}

export function computeHavingChild(b: BaselineData, inp: ChildInputs): ScenarioResult {
    const income = totalMonthlyIncome(b);
    const snapshot = computeBaselineSnapshot(b);
    const deliveryCost = inp.city === 'metro' ? 150000 : inp.city === 'tier2' ? 80000 : 50000;
    const year1Essentials = inp.city === 'metro' ? 100000 : 60000;
    const spouseIncomeLoss = b.spouseIncome * inp.spouseBreakMonths;
    const totalYear1 = deliveryCost + year1Essentials + spouseIncomeLoss;

    const eduCostMap = { 'government': 6800000, 'mid-private': 13000000, 'premium-private': 22000000, 'iit-target': 18000000, 'abroad': 38000000 };
    const totalChildCost = eduCostMap[inp.educationPlan] * (inp.secondChild ? 1.8 : 1);
    const monthlyChildCost = inp.city === 'metro' ? 15000 : inp.city === 'tier2' ? 10000 : 7000;

    const monthlySIPForEdu = Math.round(totalChildCost * 0.3 / (18 * 12)); // rough SIP for 18 years
    const newSurplus = snapshot.monthlySurplus - monthlyChildCost - monthlySIPForEdu;

    const immediateImpact = [
        { label: 'Delivery & Hospital', value: fmt(deliveryCost), status: 'yellow' as const },
        { label: 'Year 1 Essentials', value: fmt(year1Essentials), status: 'yellow' as const },
        { label: 'Spouse Career Break', value: fmt(-spouseIncomeLoss), status: spouseIncomeLoss > 0 ? 'red' as const : 'green' as const },
        { label: 'Total Year 1 Impact', value: fmt(totalYear1), status: totalYear1 > b.cashBank ? 'red' as const : 'yellow' as const },
    ];

    const cashFlowRows: RippleRow[] = [
        { label: 'Monthly Child Expenses', before: '₹0', after: fmt(monthlyChildCost), change: `+${fmt(monthlyChildCost)}`, status: 'yellow' },
        { label: 'Education SIP Needed', before: '₹0', after: fmt(monthlySIPForEdu), change: `+${fmt(monthlySIPForEdu)}`, status: 'yellow' },
        { label: 'Monthly Surplus', before: fmt(snapshot.monthlySurplus), after: fmt(newSurplus), change: fmt(newSurplus - snapshot.monthlySurplus), status: newSurplus >= 0 ? 'yellow' : 'red' },
    ];

    const totalCostFormatted = fmt(Math.round(totalChildCost));
    const summary = `Raising ${inp.secondChild ? 'two children' : 'one child'} with ${inp.educationPlan.replace('-', ' ')} education in a ${inp.city} city costs approximately ${totalCostFormatted} to age 22. Your monthly surplus drops by ${fmt(monthlyChildCost + monthlySIPForEdu)}. ${newSurplus < 0 ? 'This puts your finances under pressure.' : 'This is manageable at your current income.'}`;

    return {
        scenarioName: 'Having a Child', scenarioIcon: '👶',
        immediateImpact, cashFlowRows,
        emergencyFundImpact: totalYear1 > b.cashBank ? `Shortfall of ${fmt(totalYear1 - b.cashBank)}` : `Fund reduced to ${fmt(b.cashBank - totalYear1)}`,
        emergencyFundStatus: totalYear1 > b.cashBank ? 'red' : 'yellow',
        retirementImpact: `Retirement delayed by ~${Math.ceil(monthlyChildCost * 12 * 5 / (b.monthlyInvestments * 12 || 1))} years due to reduced investments`,
        retirementStatus: 'yellow',
        taxImpact: 'Child education deduction (Sec 80C) up to ₹1.5L/yr for tuition fees',
        taxStatus: 'green',
        longTermWealth: [
            { label: 'Total Child Cost (22yr)', withoutScenario: 0, withScenario: Math.round(totalChildCost) },
            { label: 'Monthly equivalent', withoutScenario: 0, withScenario: Math.round(totalChildCost / (22 * 12)) },
        ],
        summary, fixes: [
            { title: `Start Education SIP of ${fmt(monthlySIPForEdu)}/month now`, description: 'Covers college costs at age 18 through compounding' },
            { title: 'Increase life cover by ₹75L', description: 'Child dependency changes insurance needs' },
            { title: `Build emergency fund to ${fmt(Math.round(totalYear1 * 1.2))} before delivery`, description: 'Current fund may be insufficient' },
        ],
        overallScore: newSurplus >= 0 ? 72 : 45,
        riskLevel: newSurplus < 0 ? 'High' : 'Medium',
        newRetirementAge: snapshot.projectedRetirementAge + Math.ceil((monthlyChildCost + monthlySIPForEdu) * 12 * 5 / (b.monthlyInvestments * 12 || 1)),
        newMonthlySurplus: newSurplus,
        newNetWorthAt10Yr: Math.round(futureValue(totalAssets(b) - totalDebts(b), b.expectedReturn, 10) + sipFV(Math.max(0, b.monthlyInvestments - monthlySIPForEdu), b.expectedReturn, 10)),
    };
}

export interface BusinessInputs {
    businessType: 'service' | 'product' | 'online' | 'consulting';
    startupCapital: number;
    capitalSource: 'savings' | 'loan' | 'both';
    revenueMonth6: number;
    revenueMonth12: number;
    quitImmediately: boolean;
    runwayMonths: number;
    spouseSupport: boolean;
}

export function computeStartingBusiness(b: BaselineData, inp: BusinessInputs): ScenarioResult {
    const income = totalMonthlyIncome(b);
    const snapshot = computeBaselineSnapshot(b);
    const monthlyBurn = b.essentialExpenses + b.discretionaryExpenses + b.currentEMIs;
    const liquidSavings = b.cashBank + (inp.capitalSource === 'savings' ? 0 : b.cashBank);
    const availableForRunway = Math.max(0, b.cashBank - (inp.capitalSource === 'savings' ? inp.startupCapital : inp.startupCapital / 2));
    const maxRunway = monthlyBurn > 0 ? availableForRunway / monthlyBurn : 0;
    const spouseBuffer = inp.spouseSupport ? b.spouseIncome : 0;
    const effectiveBurn = monthlyBurn - spouseBuffer;
    const effectiveRunway = effectiveBurn > 0 ? availableForRunway / effectiveBurn : 999;

    const emiSafetyMonths = b.currentEMIs > 0 ? availableForRunway / b.currentEMIs : 999;

    const immediateImpact = [
        { label: 'Startup Capital Needed', value: fmt(inp.startupCapital), status: 'yellow' as const },
        { label: 'Monthly Burn (no income)', value: fmt(Math.round(effectiveBurn)), status: 'red' as const },
        { label: 'Maximum Runway', value: `${effectiveRunway.toFixed(1)} months`, status: effectiveRunway >= inp.runwayMonths ? 'green' as const : 'red' as const },
        { label: 'EMI Safety', value: `${emiSafetyMonths.toFixed(0)} months`, status: emiSafetyMonths >= 12 ? 'green' as const : 'red' as const },
    ];

    const cashFlowRows: RippleRow[] = [
        { label: 'Monthly Income', before: fmt(income), after: inp.quitImmediately ? fmt(spouseBuffer) : fmt(income), change: inp.quitImmediately ? fmt(-income + spouseBuffer) : '—', status: inp.quitImmediately ? 'red' : 'neutral' },
        { label: 'Monthly Expenses', before: fmt(monthlyBurn), after: fmt(monthlyBurn), change: '—', status: 'neutral' },
        { label: 'Expected Revenue (Mo 12)', before: '—', after: fmt(inp.revenueMonth12), change: `+${fmt(inp.revenueMonth12)}`, status: 'green' },
    ];

    const summary = effectiveRunway >= inp.runwayMonths
        ? `Your runway of ${effectiveRunway.toFixed(1)} months exceeds your target breakeven of Month ${inp.runwayMonths}. ${inp.spouseSupport ? "Spouse income provides a safety net." : ""} EMI payments are safe for ${emiSafetyMonths.toFixed(0)} months.${!inp.quitImmediately ? " Building alongside your job greatly reduces risk." : ""}`
        : `Your runway of ${effectiveRunway.toFixed(1)} months is shorter than your target breakeven of Month ${inp.runwayMonths}. You need ${fmt(Math.round((inp.runwayMonths - effectiveRunway) * effectiveBurn))} more savings before starting.`;

    return {
        scenarioName: 'Starting a Business', scenarioIcon: '🚀',
        immediateImpact, cashFlowRows,
        emergencyFundImpact: `Fund drops to ${fmt(Math.max(0, Math.round(availableForRunway)))}`,
        emergencyFundStatus: availableForRunway < monthlyBurn * 3 ? 'red' : 'yellow',
        retirementImpact: 'No EPF contribution during business years — consider NPS for tax benefits',
        retirementStatus: 'yellow',
        taxImpact: 'Business income taxed under Section 44AD/44ADA — potential for lower tax',
        taxStatus: 'green',
        longTermWealth: [
            { label: 'Stay in Job (5yr Net Worth)', withoutScenario: Math.round(futureValue(totalAssets(b) - totalDebts(b), b.expectedReturn, 5) + sipFV(b.monthlyInvestments, b.expectedReturn, 5)), withScenario: 0 },
            { label: 'Business (5yr, if successful)', withoutScenario: 0, withScenario: Math.round(inp.revenueMonth12 * 12 * 5 * 0.3) },
        ],
        summary,
        fixes: effectiveRunway < inp.runwayMonths ? [
            { title: "Don't quit yet", description: `Build to ${fmt(Math.round(b.primaryIncome * 0.5))}/month revenue alongside job, then quit` },
            { title: 'Save more runway', description: `Need ${fmt(Math.round((inp.runwayMonths - effectiveRunway) * effectiveBurn))} more before starting` },
        ] : [],
        overallScore: effectiveRunway >= inp.runwayMonths ? 70 : 35,
        riskLevel: effectiveRunway < inp.runwayMonths ? 'Very High' : inp.quitImmediately ? 'High' : 'Medium',
        newRetirementAge: snapshot.projectedRetirementAge + (inp.quitImmediately ? 5 : 2),
        newMonthlySurplus: inp.quitImmediately ? Math.round(spouseBuffer - monthlyBurn) : snapshot.monthlySurplus,
        newNetWorthAt10Yr: Math.round(inp.revenueMonth12 * 12 * 10 * 0.2),
    };
}

export interface SabbaticalInputs {
    durationMonths: number;
    purpose: 'travel' | 'health' | 'study' | 'personal' | 'startup-prep';
    continuedIncome: number;
    withdrawPF: boolean;
}

export function computeSabbatical(b: BaselineData, inp: SabbaticalInputs): ScenarioResult {
    const income = totalMonthlyIncome(b);
    const snapshot = computeBaselineSnapshot(b);
    const lostSalary = (income - inp.continuedIncome) * inp.durationMonths;
    const monthlyExp = b.essentialExpenses + b.discretionaryExpenses + b.currentEMIs;
    const expensesDuringBreak = monthlyExp * inp.durationMonths;
    const directCost = lostSalary + expensesDuringBreak;
    const pfLoss = inp.withdrawPF ? b.epfPpfNps * 0.15 : 0;
    const lostCompounding = b.monthlyInvestments * inp.durationMonths;
    const futureCompoundLoss = futureValue(lostCompounding, b.expectedReturn, b.retirementAge - b.currentAge);
    const hiddenCost = pfLoss + lostCompounding;
    const totalCost = directCost + hiddenCost;
    const affordable = b.cashBank >= expensesDuringBreak;
    const affordableMonths = monthlyExp > 0 ? b.cashBank / monthlyExp : 0;

    const immediateImpact = [
        { label: `Lost Salary (${inp.durationMonths}mo)`, value: fmt(Math.round(lostSalary)), status: 'red' as const },
        { label: 'Expenses During Break', value: fmt(Math.round(expensesDuringBreak)), status: 'yellow' as const },
        { label: 'Hidden Cost (PF + compounding)', value: fmt(Math.round(hiddenCost)), status: 'red' as const },
        { label: 'Total True Cost', value: fmt(Math.round(totalCost)), status: 'red' as const },
    ];

    const cashFlowRows: RippleRow[] = [
        { label: 'Monthly Income', before: fmt(income), after: fmt(inp.continuedIncome), change: fmt(inp.continuedIncome - income), status: 'red' },
        { label: 'Monthly Expenses', before: fmt(monthlyExp), after: fmt(monthlyExp), change: 'Continue', status: 'neutral' },
        { label: 'Months Affordable', before: '—', after: `${affordableMonths.toFixed(1)} months`, change: affordable ? '✅' : '🔴 Short', status: affordable ? 'green' : 'red' },
    ];

    const summary = affordable
        ? `You can afford ${affordableMonths.toFixed(1)} months off. Your ${inp.durationMonths}-month sabbatical costs ${fmt(Math.round(totalCost))} when you include hidden costs. The ${fmt(Math.round(lostCompounding))} of missed SIPs becomes ${fmt(Math.round(futureCompoundLoss))} at retirement — that's the real price of this break. Is it worth it? Only you can answer.`
        : `You can afford ${affordableMonths.toFixed(1)} months, not ${inp.durationMonths}. Shortfall: ${fmt(Math.round(expensesDuringBreak - b.cashBank))}. You need to save more before taking this break.`;

    return {
        scenarioName: 'Taking a Sabbatical', scenarioIcon: '🏖️',
        immediateImpact, cashFlowRows,
        emergencyFundImpact: affordable ? `Fund drained to ${fmt(Math.round(b.cashBank - expensesDuringBreak))}` : 'Cannot sustain — fund runs out',
        emergencyFundStatus: affordable ? 'yellow' : 'red',
        retirementImpact: `${inp.durationMonths}mo of missed SIPs = ${fmt(Math.round(futureCompoundLoss))} less at retirement`,
        retirementStatus: 'yellow',
        taxImpact: 'No tax liability during break (no income)',
        taxStatus: 'green',
        longTermWealth: [
            { label: 'Direct Cost', withoutScenario: 0, withScenario: Math.round(directCost) },
            { label: 'Retirement Impact', withoutScenario: 0, withScenario: Math.round(futureCompoundLoss) },
        ],
        summary, fixes: !affordable ? [
            { title: `Shorten to ${Math.floor(affordableMonths)} months`, description: 'Maximum duration your savings can support' },
            { title: 'Save more first', description: `Need ${fmt(Math.round(expensesDuringBreak - b.cashBank))} more before starting` },
        ] : [],
        overallScore: affordable ? 65 : 30,
        riskLevel: affordable ? 'Medium' : 'High',
        newRetirementAge: snapshot.projectedRetirementAge + Math.ceil(inp.durationMonths / 6),
        newMonthlySurplus: Math.round(inp.continuedIncome - monthlyExp),
        newNetWorthAt10Yr: Math.round(futureValue(totalAssets(b) - totalDebts(b), b.expectedReturn, 10) + sipFV(b.monthlyInvestments, b.expectedReturn, 10) - futureCompoundLoss),
    };
}

// ── Generic Scenario (for remaining scenarios) ─────────────────

export interface GenericScenarioInputs {
    name: string;
    icon: string;
    oneTimeCost: number;
    monthlyExpenseChange: number;
    monthlyIncomeChange: number;
    durationMonths: number;
    description: string;
}

export function computeGenericScenario(b: BaselineData, inp: GenericScenarioInputs): ScenarioResult {
    const income = totalMonthlyIncome(b);
    const snapshot = computeBaselineSnapshot(b);
    const newIncome = income + inp.monthlyIncomeChange;
    const newMonthlyExp = totalMonthlyExpenses(b) + inp.monthlyExpenseChange;
    const newSurplus = newIncome - newMonthlyExp;
    const directCostTotal = inp.oneTimeCost + inp.monthlyExpenseChange * inp.durationMonths;

    const immediateImpact = [
        ...(inp.oneTimeCost > 0 ? [{ label: 'One-Time Cost', value: fmt(inp.oneTimeCost), status: inp.oneTimeCost > b.cashBank ? 'red' as const : 'yellow' as const }] : []),
        ...(inp.monthlyExpenseChange !== 0 ? [{ label: 'Monthly Expense Change', value: `${inp.monthlyExpenseChange > 0 ? '+' : ''}${fmt(inp.monthlyExpenseChange)}`, status: inp.monthlyExpenseChange > 0 ? 'yellow' as const : 'green' as const }] : []),
        ...(inp.monthlyIncomeChange !== 0 ? [{ label: 'Monthly Income Change', value: `${inp.monthlyIncomeChange > 0 ? '+' : ''}${fmt(inp.monthlyIncomeChange)}`, status: inp.monthlyIncomeChange > 0 ? 'green' as const : 'red' as const }] : []),
        { label: 'Total Financial Impact', value: fmt(Math.round(directCostTotal)), status: directCostTotal > b.cashBank * 0.5 ? 'red' as const : 'yellow' as const },
    ];

    const cashFlowRows: RippleRow[] = [
        { label: 'Monthly Income', before: fmt(income), after: fmt(newIncome), change: inp.monthlyIncomeChange !== 0 ? fmt(inp.monthlyIncomeChange) : '—', status: inp.monthlyIncomeChange >= 0 ? 'green' : 'red' },
        { label: 'Monthly Expenses', before: fmt(Math.round(totalMonthlyExpenses(b))), after: fmt(Math.round(newMonthlyExp)), change: inp.monthlyExpenseChange !== 0 ? `+${fmt(inp.monthlyExpenseChange)}` : '—', status: inp.monthlyExpenseChange > 0 ? 'yellow' : 'green' },
        { label: 'Monthly Surplus', before: fmt(snapshot.monthlySurplus), after: fmt(Math.round(newSurplus)), change: fmt(Math.round(newSurplus - snapshot.monthlySurplus)), status: newSurplus >= 0 ? 'green' : 'red' },
    ];

    const summary = `${inp.description} Total financial impact: ${fmt(Math.round(directCostTotal))} over ${inp.durationMonths} months. Your monthly surplus ${newSurplus >= snapshot.monthlySurplus ? 'improves' : 'decreases'} to ${fmt(Math.round(newSurplus))}.`;

    return {
        scenarioName: inp.name, scenarioIcon: inp.icon,
        immediateImpact, cashFlowRows,
        emergencyFundImpact: inp.oneTimeCost > b.cashBank * 0.5 ? 'Significantly reduced' : 'Minimal impact',
        emergencyFundStatus: inp.oneTimeCost > b.cashBank * 0.5 ? 'red' : 'green',
        retirementImpact: newSurplus < snapshot.monthlySurplus ? 'May delay retirement by 1-3 years' : 'No significant impact',
        retirementStatus: newSurplus < 0 ? 'red' : 'green',
        taxImpact: 'Depends on specific scenario details',
        taxStatus: 'yellow',
        longTermWealth: [{ label: 'Total Cost/Benefit', withoutScenario: 0, withScenario: Math.round(directCostTotal) }],
        summary, fixes: newSurplus < 0 ? [{ title: 'Reduce scope or delay', description: 'Consider a phased approach to reduce monthly burden' }] : [],
        overallScore: newSurplus >= 0 ? 70 : 40,
        riskLevel: newSurplus < -10000 ? 'High' : newSurplus < 0 ? 'Medium' : 'Low',
        newRetirementAge: snapshot.projectedRetirementAge + (newSurplus < 0 ? 3 : 0),
        newMonthlySurplus: Math.round(newSurplus),
        newNetWorthAt10Yr: Math.round(futureValue(totalAssets(b) - totalDebts(b) - inp.oneTimeCost, b.expectedReturn, 10) + sipFV(Math.max(0, b.monthlyInvestments + (newSurplus - snapshot.monthlySurplus)), b.expectedReturn, 10)),
    };
}

// ── Comparison Engine ──────────────────────────────────────────

export function compareScenarios(results: { name: string; result: ScenarioResult }[]): ComparisonResult {
    let bestScore = -1;
    let winnerIdx = 0;
    results.forEach((r, i) => { if (r.result.overallScore > bestScore) { bestScore = r.result.overallScore; winnerIdx = i; } });
    return { scenarios: results, winner: winnerIdx };
}

// ── LocalStorage ───────────────────────────────────────────────

const LS_KEY = 'riq-lds-baseline';

export function saveBaseline(data: BaselineData) {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
}

export function loadBaseline(): BaselineData | null {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
}
