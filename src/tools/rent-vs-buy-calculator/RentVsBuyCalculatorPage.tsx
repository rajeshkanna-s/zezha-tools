import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Home, LineChart, Building2, DollarSign, AlertTriangle, Info } from 'lucide-react';
import {
    LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';

export const RentVsBuyCalculatorPage: React.FC = () => {

    const [city, setCity] = useState('Bangalore');
    const [propertyPrice, setPropertyPrice] = useState(10000000); // 1 Cr
    const [downPaymentPct, setDownPaymentPct] = useState(20);
    const [loanInterestRate, setLoanInterestRate] = useState(8.5);
    const [loanTenure, setLoanTenure] = useState(20);
    const [appreciationRate, setAppreciationRate] = useState(7);
    const [maintenancePct, setMaintenancePct] = useState(1);
    const [propertyTax, setPropertyTax] = useState(10000);
    const [homeInsurance, setHomeInsurance] = useState(10000);

    const [monthlyRent, setMonthlyRent] = useState(30000);
    const [rentIncrease, setRentIncrease] = useState(6);
    const [securityDeposit, setSecurityDeposit] = useState(100000);
    const [brokeragePct, setBrokeragePct] = useState(50); // 50% of 1 month rent per year (equivalent to 1 month every 2 years)

    const [investmentReturn, setInvestmentReturn] = useState(10);
    const [savingsAmt, setSavingsAmt] = useState(2000000);
    const [taxBracket, setTaxBracket] = useState(30);
    const [yearsToStay, setYearsToStay] = useState(20);

    // Constants
    const stampDutyRate = 0.06; // Approx 6% average

    const handleCityChange = (newCity: string) => {
        setCity(newCity);
        // Adjust defaults based on city
        const rates: Record<string, number> = {
            'Mumbai': 5.5,
            'Bangalore': 7.5,
            'Hyderabad': 8,
            'Delhi NCR': 5.5,
            'Chennai': 6,
            'Pune': 7,
            'Other': 5
        };
        setAppreciationRate(rates[newCity] || 5);
    };

    const simulationData = useMemo(() => {
        const data = [];

        // Initial Setup
        const downPayment = propertyPrice * (downPaymentPct / 100);
        const loanAmount = propertyPrice - downPayment;
        const stampDutyAuth = propertyPrice * stampDutyRate;
        const initialBuyingOutflow = downPayment + stampDutyAuth;

        // EMI Calculation
        const monthlyRate = loanInterestRate / 12 / 100;
        const tenureMonths = loanTenure * 12;
        const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
        const annualEmi = emi * 12;

        // State trackers
        let currentPropValue = propertyPrice;
        let outstandingLoan = loanAmount;
        let currentRent = monthlyRent;

        // Initial invested amount for renter
        // Assume they have 'initialBuyingOutflow' saved up. They pay security deposit, invest the rest
        let currentPortfolioValue = Math.max(0, initialBuyingOutflow - securityDeposit);

        let totalRentPaid = 0;
        let totalPropCostPaid = initialBuyingOutflow;
        let totalTaxBenefit = 0;

        let crossoverYear = -1;

        for (let year = 1; year <= 30; year++) {

            // BUYING CALCULATIONS
            currentPropValue *= (1 + appreciationRate / 100);

            let interestPaidThisYear = 0;
            let principalPaidThisYear = 0;

            if (year <= loanTenure) {
                // Approximate interest for the year (simplified)
                for (let m = 0; m < 12; m++) {
                    const interest = outstandingLoan * monthlyRate;
                    const principal = emi - interest;
                    interestPaidThisYear += interest;
                    principalPaidThisYear += principal;
                    outstandingLoan -= principal;
                }
            }

            // Tax Benefit (Sec 24 + 80C)
            const sec24Benefit = Math.min(200000, interestPaidThisYear) * (taxBracket / 100);
            const sec80CBenefit = Math.min(150000, principalPaidThisYear) * (taxBracket / 100);
            const yearTaxBenefit = sec24Benefit + sec80CBenefit;
            totalTaxBenefit += yearTaxBenefit;

            const annualMaintenance = currentPropValue * (maintenancePct / 100);
            const totalBuyingOutflowThisYear = (year <= loanTenure ? annualEmi : 0) + annualMaintenance + propertyTax + homeInsurance;
            totalPropCostPaid += totalBuyingOutflowThisYear;

            const buyingNetWealth = currentPropValue - outstandingLoan - initialBuyingOutflow;

            // RENTING CALCULATIONS
            const annualRent = currentRent * 12;
            const annualBrokerage = currentRent * (brokeragePct / 100); // spread out
            const totalRentingOutflowThisYear = annualRent + annualBrokerage;

            totalRentPaid += annualRent;

            // Monthly Investment Top-up (Diff between owning outflow and renting outflow)
            // Including tax benefit in owning outflow to make it a fair comparison
            const owningEffectiveOutflow = totalBuyingOutflowThisYear - yearTaxBenefit;

            // If owning is more expensive, renter invests the difference. 
            // If renting is more expensive, renter must withdraw from portfolio to make up difference.
            const monthlyDiffToInvest = (owningEffectiveOutflow - totalRentingOutflowThisYear) / 12;

            for (let m = 0; m < 12; m++) {
                currentPortfolioValue *= (1 + (investmentReturn / 100) / 12); // compound monthly
                currentPortfolioValue += monthlyDiffToInvest;
            }

            currentRent *= (1 + rentIncrease / 100);

            const rentingNetWealth = currentPortfolioValue + securityDeposit;

            if (crossoverYear === -1 && buyingNetWealth > rentingNetWealth && year > 1) {
                crossoverYear = year;
            }

            data.push({
                year,
                buyingNetWealth: Math.round(buyingNetWealth),
                rentingNetWealth: Math.round(rentingNetWealth),
                totalPropCostPaid: Math.round(totalPropCostPaid),
                totalRentPaid: Math.round(totalRentPaid),
                propValue: Math.round(currentPropValue),
                portfolioValue: Math.round(currentPortfolioValue),
                emiOutflow: Math.round(annualEmi)
            });
        }

        return {
            data,
            crossoverYear,
            summaryAtSelectedYear: data[yearsToStay - 1]
        };
    }, [
        propertyPrice, downPaymentPct, loanInterestRate, loanTenure, appreciationRate,
        maintenancePct, propertyTax, homeInsurance, monthlyRent, rentIncrease,
        securityDeposit, brokeragePct, investmentReturn, taxBracket, yearsToStay
    ]);

    const { data, crossoverYear, summaryAtSelectedYear } = simulationData;
    const isBuyingBetter = summaryAtSelectedYear.buyingNetWealth > summaryAtSelectedYear.rentingNetWealth;
    const diff = Math.abs(summaryAtSelectedYear.buyingNetWealth - summaryAtSelectedYear.rentingNetWealth);
    const diffPct = diff / Math.max(summaryAtSelectedYear.buyingNetWealth, summaryAtSelectedYear.rentingNetWealth);

    let verdictTitle = '';
    let verdictColor = '';
    let verdictDesc = '';

    if (diffPct < 0.1) {
        verdictTitle = 'ROUGHLY EQUAL';
        verdictColor = 'bg-yellow-50 border-yellow-200 text-yellow-800';
        verdictDesc = 'The financial difference over this period is under 10%. Choose based on lifestyle factors: stability vs flexibility.';
    } else if (isBuyingBetter) {
        verdictTitle = 'BUYING IS BETTER';
        verdictColor = 'bg-blue-50 border-blue-200 text-blue-800';
        verdictDesc = `For your situation, buying builds ₹${(diff / 100000).toFixed(1)}L more wealth over ${yearsToStay} years. The math strongly supports buying.`;
    } else {
        verdictTitle = 'RENTING IS BETTER';
        verdictColor = 'bg-emerald-50 border-emerald-200 text-emerald-800';
        verdictDesc = `For your situation, renting and investing the difference builds ₹${(diff / 100000).toFixed(1)}L more wealth over ${yearsToStay} years.`;
    }

    const formatLakhs = (val: number) => {
        return `₹${(val / 100000).toFixed(1)}L`;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in pb-24">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                    <Home className="text-indigo-600" size={32} />
                    Renting vs Buying a Home Calculator
                </h1>
                <p className="mt-2 text-slate-600">
                    The 20-year financial simulation that ends every dinner table argument. Find out your exact cross-over year.
                </p>
            </div>

            {/* Verdict Card */}
            <div className={`rounded-2xl shadow-sm border p-6 mb-8 text-center ${verdictColor}`}>
                <h2 className="text-2xl font-bold uppercase tracking-wide mb-2">{verdictTitle}</h2>
                <p className="text-lg">{verdictDesc}</p>
                {crossoverYear !== -1 && !isBuyingBetter && crossoverYear <= 30 && (
                    <p className="text-sm mt-3 opacity-90">Note: Buying becomes mathematically better after Year {crossoverYear}, but you only plan to stay {yearsToStay} years.</p>
                )}
                {crossoverYear !== -1 && isBuyingBetter && (
                    <p className="text-sm mt-3 opacity-90">Buying crossed renting in profitability at Year {crossoverYear}.</p>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Input Panel - 4 columns */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Property Inputs */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2"><Building2 size={18} /> Buying Assumptions</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">City</label>
                                <select value={city} onChange={e => handleCityChange(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm">
                                    {['Mumbai', 'Bangalore', 'Hyderabad', 'Delhi NCR', 'Chennai', 'Pune', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Property Price (Rs.)</label>
                                <input type="number" value={propertyPrice} onChange={e => setPropertyPrice(Number(e.target.value))} className="w-full px-3 py-2 border rounded-md text-sm" />
                                <p className="text-xs text-slate-400 mt-1">{formatLakhs(propertyPrice)}</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Down Pmt %</label>
                                    <input type="number" value={downPaymentPct} onChange={e => setDownPaymentPct(Number(e.target.value))} className="w-full px-3 py-2 border rounded-md text-sm" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Tenure (Yrs)</label>
                                    <input type="number" value={loanTenure} onChange={e => setLoanTenure(Number(e.target.value))} className="w-full px-3 py-2 border rounded-md text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="flex justify-between text-xs font-medium text-slate-500 mb-1"><span>Appreciation Rate</span> <span>{appreciationRate}%</span></label>
                                <input type="range" min="2" max="15" step="0.5" value={appreciationRate} onChange={e => setAppreciationRate(Number(e.target.value))} className="w-full" />
                            </div>
                        </div>
                    </div>

                    {/* Renting Inputs */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2"><DollarSign size={18} /> Renting Assumptions</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Equivalent Monthly Rent</label>
                                <input type="number" value={monthlyRent} onChange={e => setMonthlyRent(Number(e.target.value))} className="w-full px-3 py-2 border rounded-md text-sm" />
                            </div>
                            <div>
                                <label className="flex justify-between text-xs font-medium text-slate-500 mb-1"><span>Annual Rent Increase</span> <span>{rentIncrease}%</span></label>
                                <input type="range" min="2" max="12" step="0.5" value={rentIncrease} onChange={e => setRentIncrease(Number(e.target.value))} className="w-full" />
                            </div>
                            <div>
                                <label className="flex justify-between text-xs font-medium text-slate-500 mb-1"><span>Investment Return (If Renting)</span> <span>{investmentReturn}%</span></label>
                                <input type="range" min="6" max="18" step="0.5" value={investmentReturn} onChange={e => setInvestmentReturn(Number(e.target.value))} className="w-full" />
                            </div>
                        </div>
                    </div>

                    {/* Timeline Input */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 bg-indigo-50/30">
                        <label className="flex justify-between text-sm font-semibold text-slate-800 mb-2"><span>Years Planning to Stay</span> <span className="text-indigo-600">{yearsToStay} Years</span></label>
                        <input type="range" min="3" max="30" step="1" value={yearsToStay} onChange={e => setYearsToStay(Number(e.target.value))} className="w-full accent-indigo-600" />
                        <p className="text-xs text-slate-500 mt-2 text-center">Drag to see how timeline changes the verdict.</p>
                    </div>

                </div>

                {/* Charts & Stats Panel - 8 columns */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Main Chart */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <LineChart size={20} className="text-indigo-600" />
                            20-Year Wealth Comparison
                        </h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsLineChart data={data.slice(0, Math.max(20, yearsToStay))} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748B' }} tickLine={false} axisLine={{ stroke: '#CBD5E1' }} />
                                    <YAxis
                                        tick={{ fontSize: 12, fill: '#64748B' }}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
                                    />
                                    <Tooltip
                                        formatter={(value: number) => `₹${(value / 100000).toFixed(1)}L`}
                                        labelFormatter={(label) => `Year ${label}`}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend />
                                    {crossoverYear !== -1 && crossoverYear <= Math.max(20, yearsToStay) && (
                                        <ReferenceLine x={crossoverYear} stroke="#F59E0B" strokeDasharray="3 3">
                                            {/* <Label value="Crossover" position="top" fill="#F59E0B" fontSize={12} /> */}
                                        </ReferenceLine>
                                    )}
                                    <ReferenceLine x={yearsToStay} stroke="#6366F1" strokeOpacity={0.5} strokeDasharray="5 5" />

                                    <Line type="monotone" name="Buying Wealth" dataKey="buyingNetWealth" stroke="#3B82F6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                                    <Line type="monotone" name="Renting Wealth" dataKey="rentingNetWealth" stroke="#10B981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                                </RechartsLineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Comparison Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="py-3 px-6 text-xs font-semibold text-slate-600 uppercase">Metric (At Year {yearsToStay})</th>
                                    <th className="py-3 px-6 text-xs font-semibold text-blue-700 uppercase">Buying Path</th>
                                    <th className="py-3 px-6 text-xs font-semibold text-emerald-700 uppercase">Renting Path</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                <tr className="border-b border-slate-100">
                                    <td className="py-4 px-6 font-medium text-slate-800">Net Wealth Generated</td>
                                    <td className="py-4 px-6 font-bold text-blue-600">{formatLakhs(summaryAtSelectedYear.buyingNetWealth)}</td>
                                    <td className="py-4 px-6 font-bold text-emerald-600">{formatLakhs(summaryAtSelectedYear.rentingNetWealth)}</td>
                                </tr>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <td className="py-4 px-6 text-slate-600">Total Outflow Paid</td>
                                    <td className="py-4 px-6 text-slate-700">{formatLakhs(summaryAtSelectedYear.totalPropCostPaid)} <span className="text-xs text-slate-400 block">EMI, Tax, Maint.</span></td>
                                    <td className="py-4 px-6 text-slate-700">{formatLakhs(summaryAtSelectedYear.totalRentPaid)} <span className="text-xs text-slate-400 block">All Rent</span></td>
                                </tr>
                                <tr className="border-b border-slate-100">
                                    <td className="py-4 px-6 text-slate-600">Asset Value</td>
                                    <td className="py-4 px-6 text-slate-700">{formatLakhs(summaryAtSelectedYear.propValue)} <span className="text-xs text-slate-400 block">Property Value</span></td>
                                    <td className="py-4 px-6 text-slate-700">{formatLakhs(summaryAtSelectedYear.portfolioValue)} <span className="text-xs text-slate-400 block">Investments</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Hidden Costs Grid */}
                    <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <AlertTriangle size={18} className="text-amber-500" />
                            Hidden Costs Factored Into the Buy Math
                        </h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div className="bg-white p-3 rounded-xl border border-slate-200">
                                <p className="text-xs text-slate-500 mb-1">Stamp Duty (6%)</p>
                                <p className="font-semibold text-slate-800">{formatLakhs(propertyPrice * stampDutyRate)}</p>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-slate-200">
                                <p className="text-xs text-slate-500 mb-1">Annual Maintenance</p>
                                <p className="font-semibold text-slate-800">{formatLakhs(propertyPrice * (maintenancePct / 100))} <span className="text-xs font-normal text-slate-400">/yr</span></p>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-slate-200">
                                <p className="text-xs text-slate-500 mb-1">Property Tax</p>
                                <p className="font-semibold text-slate-800">₹{(propertyTax / 1000).toFixed(0)}K <span className="text-xs font-normal text-slate-400">/yr</span></p>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-slate-200">
                                <p className="text-xs text-slate-500 mb-1">Total Loan Interest</p>
                                <p className="font-semibold text-slate-800">{formatLakhs((summaryAtSelectedYear.emiOutflow * loanTenure) - (propertyPrice - (propertyPrice * downPaymentPct / 100)))}</p>
                            </div>
                        </div>

                        {/* Insights Panel */}
                        <div className="bg-indigo-50 rounded-2xl shadow-sm border border-indigo-200 p-6 mt-6">
                            <h3 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                                <Info size={18} /> Financial Rules of Thumb
                            </h3>
                            <ul className="space-y-3 text-sm text-indigo-800 list-disc pl-5">
                                <li><strong className="font-semibold">The 5% Rule:</strong> Renting is generally mathematically better if your annual rent is less than 5% of the property's buying value.</li>
                                <li><strong className="font-semibold">The 7-Year Rule:</strong> Buying rarely makes sense if you plan to move or sell within 7 years due to huge sunk costs like ~6% stamp duty and entry/exit brokerages.</li>
                                <li><strong className="font-semibold">The Hidden Cost Reality:</strong> Your EMI is the *minimum* you pay when buying. Rent is the *maximum* you pay when renting. Maintenance, property taxes, and home insurance add roughly ~1% to ~1.5% to property carrying costs yearly.</li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
