import React, { useState, useMemo } from 'react';
import { Flame, Landmark, TrendingUp, PiggyBank, Sparkles, ArrowRight, ShieldCheck, BadgeInfo, BarChart3, Download, RefreshCw, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export const FireCalculatorPage: React.FC = () => {
  // Inputs
  const [currentAgeStr, setCurrentAgeStr] = useState('28');
  const [targetAgeStr, setTargetAgeStr] = useState('50');
  const [lifeExpectancyStr, setLifeExpectancyStr] = useState('85');
  const [currentSavingsStr, setCurrentSavingsStr] = useState('10,00,000');
  const [monthlyIncomeStr, setMonthlyIncomeStr] = useState('1,20,000');
  const [monthlyExpensesStr, setMonthlyExpensesStr] = useState('50,000');
  const [investmentReturnStr, setInvestmentReturnStr] = useState('12');
  const [inflationStr, setInflationStr] = useState('6');
  const [retirementWithdrawalRateStr, setRetirementWithdrawalRateStr] = useState('4'); // 4% rule
  const [postRetireReturnStr, setPostRetireReturnStr] = useState('8'); // Post-retirement investment returns

  // Detailed Table Visibility State
  const [showYearlyTable, setShowYearlyTable] = useState(false);

  const parseNum = (v: string) => {
    const n = parseFloat(v.replace(/,/g, ''));
    return isNaN(n) || n < 0 ? 0 : n;
  };

  const fmt = (n: number) => {
    return n.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const fmtInput = (v: string) => {
    let d = v.replace(/[^0-9]/g, '');
    if (!d) return '';
    d = d.replace(/^0+/, '') || '0';
    return Number(d).toLocaleString('en-IN');
  };

  // Calculations
  const fireResults = useMemo(() => {
    const currentAge = parseInt(currentAgeStr) || 25;
    const targetAge = parseInt(targetAgeStr) || 60;
    const lifeExpectancy = parseInt(lifeExpectancyStr) || 85;
    const currentSavings = parseNum(currentSavingsStr);
    const monthlyIncome = parseNum(monthlyIncomeStr);
    const monthlyExpenses = parseNum(monthlyExpensesStr);
    const expectedReturn = parseFloat(investmentReturnStr) || 12;
    const inflation = parseFloat(inflationStr) || 6;
    const withdrawalRate = parseFloat(retirementWithdrawalRateStr) || 4;
    const postRetireReturn = parseFloat(postRetireReturnStr) || 8;

    const yearsToProject = lifeExpectancy - currentAge;
    const yearsToRetire = targetAge - currentAge;
    
    const annualExpensesToday = monthlyExpenses * 12;
    const annualSavingsToday = Math.max(0, (monthlyIncome - monthlyExpenses) * 12);
    
    // Real return rate (Fisher equation approximation)
    const realReturn = (expectedReturn - inflation) / 100;
    const returnRateDec = expectedReturn / 100;
    const inflationDec = inflation / 100;
    const postRetireDec = postRetireReturn / 100;

    let portfolioCurrent = currentSavings;
    let portfolioP5 = currentSavings; // +5% savings rate
    let portfolioP10 = currentSavings; // +10% savings rate

    const chartData = [];
    const yearlyProjections = []; // For detailed table
    
    let fireAge = -1;
    let fireAgeP5 = -1;
    let fireAgeP10 = -1;

    let fireNumberAtTarget = 0;
    let balanceAtTarget = 0;

    // Additional savings rates
    const currentSavingsRate = monthlyIncome > 0 ? (monthlyIncome - monthlyExpenses) / monthlyIncome : 0;
    const savingsRateP5 = currentSavingsRate + 0.05;
    const savingsRateP10 = currentSavingsRate + 0.10;

    const annualSavingsP5 = Math.max(0, monthlyIncome * savingsRateP5 * 12);
    const annualSavingsP10 = Math.max(0, monthlyIncome * savingsRateP10 * 12);

    let finalPortfolioBalance = currentSavings;
    let isBroke = false;
    let ageWentBroke = -1;

    for (let year = 1; year <= yearsToProject; year++) {
      const age = currentAge + year;
      const inflationFactor = Math.pow(1 + inflationDec, year);
      const yearExpenses = annualExpensesToday * inflationFactor;
      const yearFireNumber = yearExpenses * (100 / withdrawalRate);

      if (age === targetAge) {
        fireNumberAtTarget = yearFireNumber;
      }

      // Portfolio Growth calculations
      let contribution = 0;
      let interestEarned = 0;
      let withdrawal = 0;
      const startBalance = finalPortfolioBalance;

      if (age <= targetAge) {
        // Accumulation phase
        contribution = annualSavingsToday * inflationFactor;
        interestEarned = finalPortfolioBalance * returnRateDec;
        finalPortfolioBalance = finalPortfolioBalance + interestEarned + contribution;
        
        portfolioCurrent = (portfolioCurrent * (1 + returnRateDec)) + annualSavingsToday * inflationFactor;
        portfolioP5 = (portfolioP5 * (1 + returnRateDec)) + annualSavingsP5 * inflationFactor;
        portfolioP10 = (portfolioP10 * (1 + returnRateDec)) + annualSavingsP10 * inflationFactor;
      } else {
        // Withdrawal phase
        withdrawal = yearExpenses;
        interestEarned = finalPortfolioBalance * postRetireDec;
        finalPortfolioBalance = finalPortfolioBalance + interestEarned - withdrawal;
        
        if (finalPortfolioBalance < 0) {
          finalPortfolioBalance = 0;
          if (!isBroke) {
            isBroke = true;
            ageWentBroke = age;
          }
        }

        portfolioCurrent = finalPortfolioBalance;
        // P5 and P10 follow basic accumulation checks, simplified in chart
        portfolioP5 = Math.max(0, portfolioP5 * (1 + postRetireDec) - yearExpenses);
        portfolioP10 = Math.max(0, portfolioP10 * (1 + postRetireDec) - yearExpenses);
      }

      if (age === targetAge) {
        balanceAtTarget = finalPortfolioBalance;
      }

      // Check if FIRE hit
      if (portfolioCurrent >= yearFireNumber && fireAge === -1) {
        fireAge = age;
      }
      if (portfolioP5 >= yearFireNumber && fireAgeP5 === -1) {
        fireAgeP5 = age;
      }
      if (portfolioP10 >= yearFireNumber && fireAgeP10 === -1) {
        fireAgeP10 = age;
      }

      chartData.push({
        year: `Yr ${year}`,
        age,
        'Your Portfolio': Math.round(portfolioCurrent),
        'FIRE Number': Math.round(yearFireNumber),
      });

      yearlyProjections.push({
        year,
        age,
        startBalance: Math.round(startBalance),
        interestEarned: Math.round(interestEarned),
        contribution: Math.round(contribution),
        withdrawal: Math.round(withdrawal),
        endBalance: Math.round(finalPortfolioBalance)
      });
    }

    // Savings rates impact comparison data
    const impactData = [
      { name: 'Current Savings Rate', age: fireAge === -1 ? '40+ yrs' : fireAge, value: fireAge === -1 ? 65 : fireAge },
      { name: '+5% Savings Rate', age: fireAgeP5 === -1 ? '40+ yrs' : fireAgeP5, value: fireAgeP5 === -1 ? 65 : fireAgeP5 },
      { name: '+10% Savings Rate', age: fireAgeP10 === -1 ? '40+ yrs' : fireAgeP10, value: fireAgeP10 === -1 ? 65 : fireAgeP10 }
    ];

    // Compute FIRE Target numbers today
    const fireNumberToday = annualExpensesToday * (100 / withdrawalRate);
    
    // Coast FIRE calculation: Coast Number = FIRE Number Today / (1 + RealReturn)^YearsToRetire
    const realReturnRate = (expectedReturn - inflation) / 100;
    const coastFireNumberToday = yearsToRetire > 0 ? (fireNumberToday / Math.pow(1 + realReturnRate, yearsToRetire)) : fireNumberToday;

    // Barista FIRE: covering 50% of expenses from portfolio
    const baristaFireNumberToday = fireNumberToday * 0.5;

    // Lean FIRE: covering 75% of expenses
    const leanFireNumberToday = fireNumberToday * 0.75;

    // Fat FIRE: covering 150% of expenses
    const fatFireNumberToday = fireNumberToday * 1.5;

    // Rule of 72 calculation: doubling current nest egg at expected return
    const ruleOf72Years = expectedReturn > 0 ? parseFloat((72 / expectedReturn).toFixed(1)) : 99;

    return {
      fireNumberToday,
      fireNumberAtTarget: fireNumberAtTarget || fireNumberToday * Math.pow(1 + inflationDec, targetAge - currentAge),
      coastFireNumberToday,
      baristaFireNumberToday,
      leanFireNumberToday,
      fatFireNumberToday,
      fireAge,
      fireAgeP5,
      fireAgeP10,
      annualSavingsToday,
      currentSavingsRate: Math.round(currentSavingsRate * 100),
      chartData,
      impactData,
      ruleOf72Years,
      isBroke,
      ageWentBroke,
      finalPortfolioBalance,
      balanceAtTarget,
      yearlyProjections
    };
  }, [currentAgeStr, targetAgeStr, lifeExpectancyStr, currentSavingsStr, monthlyIncomeStr, monthlyExpensesStr, investmentReturnStr, inflationStr, retirementWithdrawalRateStr, postRetireReturnStr]);

  // Compute progress percentages for the milestone progress bar
  const milestones = useMemo(() => {
    const currentSavings = parseNum(currentSavingsStr);
    
    const coastPct = Math.min(100, Math.round((currentSavings / fireResults.coastFireNumberToday) * 100)) || 0;
    const baristaPct = Math.min(100, Math.round((currentSavings / fireResults.baristaFireNumberToday) * 100)) || 0;
    const leanPct = Math.min(100, Math.round((currentSavings / fireResults.leanFireNumberToday) * 100)) || 0;
    const standardPct = Math.min(100, Math.round((currentSavings / fireResults.fireNumberToday) * 100)) || 0;

    return {
      coastPct,
      baristaPct,
      leanPct,
      standardPct
    };
  }, [currentSavingsStr, fireResults]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in bg-slate-50 min-h-screen">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-rose-500 font-bold text-sm tracking-wider uppercase">
            <Flame size={16} />
            <span>Financial Independence</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            FIRE (Financial Independence, Retire Early) Calculator
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-2xl">
            Map out your pathway to financial freedom. Project your portfolio growth, define your target withdrawal rate, and discover the exact age you can retire.
          </p>
        </div>
      </div>

      {/* FIRE Progress & Milestones Tracker */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span>FIRE Milestone Tracker (Based on Current Savings)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
              <span>1. Coast FIRE</span>
              <span className="text-indigo-600 font-extrabold">{milestones.coastPct}%</span>
            </div>
            <span className="text-sm font-extrabold text-slate-800 mt-1">{fmt(fireResults.coastFireNumberToday)}</span>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${milestones.coastPct}%` }} />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
              <span>2. Barista FIRE</span>
              <span className="text-pink-600 font-extrabold">{milestones.baristaPct}%</span>
            </div>
            <span className="text-sm font-extrabold text-slate-800 mt-1">{fmt(fireResults.baristaFireNumberToday)}</span>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-pink-500 h-full transition-all duration-300" style={{ width: `${milestones.baristaPct}%` }} />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
              <span>3. Lean FIRE</span>
              <span className="text-amber-600 font-extrabold">{milestones.leanPct}%</span>
            </div>
            <span className="text-sm font-extrabold text-slate-800 mt-1">{fmt(fireResults.leanFireNumberToday)}</span>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${milestones.leanPct}%` }} />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
              <span>4. Full FIRE</span>
              <span className="text-emerald-600 font-extrabold">{milestones.standardPct}%</span>
            </div>
            <span className="text-sm font-extrabold text-slate-800 mt-1">{fmt(fireResults.fireNumberToday)}</span>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${milestones.standardPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase">FIRE Number (Today's Money)</span>
          <span className="text-2xl font-black text-slate-900 mt-2">{fmt(fireResults.fireNumberToday)}</span>
          <span className="text-[11px] text-slate-500 mt-1">Based on {retirementWithdrawalRateStr}% safe withdrawal rate</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between border-l-4 border-l-rose-500">
          <span className="text-xs font-bold text-rose-600 uppercase">Inflation-Adjusted FIRE Target</span>
          <span className="text-2xl font-black text-rose-600 mt-2">{fmt(fireResults.fireNumberAtTarget)}</span>
          <span className="text-[11px] text-slate-500 mt-1">At target retirement age ({targetAgeStr} yrs)</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between border-l-4 border-l-emerald-500">
          <span className="text-xs font-bold text-emerald-600 uppercase">Projected FIRE Age</span>
          <span className="text-2xl font-black text-emerald-600 mt-2">
            {fireResults.fireAge === -1 ? '40+ Years' : `${fireResults.fireAge} Years Old`}
          </span>
          <span className="text-[11px] text-slate-500 mt-1">
            {fireResults.fireAge === -1 ? 'Increase savings to hit FIRE sooner' : `In ${fireResults.fireAge - parseInt(currentAgeStr)} years from now!`}
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between bg-gradient-to-br from-indigo-50 to-indigo-100/30">
          <span className="text-xs font-bold text-indigo-700 uppercase">Current Savings Rate</span>
          <span className="text-3xl font-black text-indigo-800 mt-2">{fireResults.currentSavingsRate}%</span>
          <span className="text-[11px] text-indigo-600 font-semibold mt-1">
            Annual Savings: {fmt(fireResults.annualSavingsToday)}
          </span>
        </div>
      </div>

      {/* Inputs Form and Projection Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input parameters panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <PiggyBank size={18} className="text-rose-500" />
            <span>Retirement Parameters</span>
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Current Age</label>
                <input
                  type="number"
                  value={currentAgeStr}
                  onChange={e => setCurrentAgeStr(e.target.value)}
                  className="w-full px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Target Age</label>
                <input
                  type="number"
                  value={targetAgeStr}
                  onChange={e => setTargetAgeStr(e.target.value)}
                  className="w-full px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Life Expect.</label>
                <input
                  type="number"
                  value={lifeExpectancyStr}
                  onChange={e => setLifeExpectancyStr(e.target.value)}
                  className="w-full px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Current Savings / Portfolio (₹)</label>
              <input
                type="text"
                value={currentSavingsStr}
                onChange={e => setCurrentSavingsStr(fmtInput(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Monthly Income (₹)</label>
                <input
                  type="text"
                  value={monthlyIncomeStr}
                  onChange={e => setMonthlyIncomeStr(fmtInput(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Monthly Expenses (₹)</label>
                <input
                  type="text"
                  value={monthlyExpensesStr}
                  onChange={e => setMonthlyExpensesStr(fmtInput(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700"
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Advanced Assumptions</h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Exp. Return Rate (%)</label>
                  <input
                    type="number"
                    value={investmentReturnStr}
                    onChange={e => setInvestmentReturnStr(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Inflation Rate (%)</label>
                  <input
                    type="number"
                    value={inflationStr}
                    onChange={e => setInflationStr(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">SWR (%)</label>
                  <input
                    type="number"
                    value={retirementWithdrawalRateStr}
                    onChange={e => setRetirementWithdrawalRateStr(e.target.value)}
                    placeholder="e.g. 4"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Post-Retire Return (%)</label>
                  <input
                    type="number"
                    value={postRetireReturnStr}
                    onChange={e => setPostRetireReturnStr(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projections Area Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">40-Year Portfolio Growth Projection</h3>
              <p className="text-[10px] text-slate-400 font-medium">Visualizing compounding nest egg and future FIRE targets</p>
            </div>
            
            {/* Survival alert */}
            {fireResults.isBroke ? (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-200 text-red-600 text-[10px] font-extrabold rounded-full">
                <AlertTriangle size={12} />
                Warning: Runs out at age {fireResults.ageWentBroke}!
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-600 text-[10px] font-extrabold rounded-full">
                <ShieldCheck size={12} />
                Portfolio survives past age {lifeExpectancyStr}!
              </span>
            )}
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fireResults.chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="fireNetWorth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="fireNumber" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.08}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="age" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${(value / 10000000).toFixed(1)} Cr`}
                />
                <Tooltip
                  formatter={(value: any) => [fmt(Number(value)), 'Value']}
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 11, fontWeight: 600 }} />
                <Area type="monotone" dataKey="Your Portfolio" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#fireNetWorth)" />
                <Area type="monotone" dataKey="FIRE Number" stroke="#f43f5e" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#fireNumber)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Savings Rate Impact Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-t border-slate-200 pt-8">
        {/* Visual Bar Chart: Savings Rate Impact */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-800 font-display">Impact of Increasing Your Savings Rate</h3>
          <p className="text-[11px] text-slate-400">See how saving just a tiny bit more each month drastically reduces the time it takes to retire early.</p>
          
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fireResults.impactData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[20, 70]} />
                <Tooltip
                  formatter={(value: any) => [`${value} years old`, 'FIRE Age']}
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                />
                <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Milestone checklist & Rule of 72 card */}
        <div className="space-y-6">
          {/* Rule of 72 Card */}
          <div className="bg-indigo-900 text-white p-6 rounded-3xl border border-indigo-950 shadow-md flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300">Rule of 72 Hack</span>
              <h4 className="text-sm font-extrabold">Nest Egg Double Time</h4>
              <p className="text-[11px] text-indigo-200/80 leading-relaxed pt-1">
                Your current nest egg will double **without any future contributions** in just:
              </p>
            </div>
            <div className="flex flex-col items-center justify-center bg-white/10 px-4 py-3 rounded-2xl border border-white/10 shrink-0">
              <span className="text-3xl font-black text-white">{fireResults.ruleOf72Years}</span>
              <span className="text-[9px] font-bold text-indigo-200 uppercase mt-0.5">Years</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 font-display">
              <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
              <span>FIRE Milestones</span>
            </h3>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 text-xs font-semibold text-slate-700">
                <div className="w-5 h-5 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold">1</div>
                <div>
                  <div className="font-bold">Barista FIRE (50% expenses)</div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Cover remainder with low-stress/part-time job. Target: ~{fmt(fireResults.baristaFireNumberToday)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs font-semibold text-slate-700">
                <div className="w-5 h-5 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold">2</div>
                <div>
                  <div className="font-bold">Lean FIRE (75% expenses)</div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Retire early on a minimalistic budget. Target: ~{fmt(fireResults.leanFireNumberToday)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs font-semibold text-slate-700">
                <div className="w-5 h-5 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold">3</div>
                <div>
                  <div className="font-bold">Standard FIRE (100% expenses)</div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Retire fully, matching current expenditures. Target: {fmt(fireResults.fireNumberToday)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs font-semibold text-slate-700">
                <div className="w-5 h-5 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold">4</div>
                <div>
                  <div className="font-bold">Fat FIRE (150% expenses)</div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Retire early on an abundant, luxury budget. Target: ~{fmt(fireResults.fatFireNumberToday)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Yearly Projection Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <button
          onClick={() => setShowYearlyTable(!showYearlyTable)}
          className="w-full p-6 text-left flex items-center justify-between border-b border-slate-100 focus:outline-none"
        >
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 size={18} className="text-rose-500" />
              <span>Detailed Year-by-Year Financial Ledger</span>
            </h3>
            <p className="text-[11px] text-slate-400">Click to expand detailed ledger of starting balances, contributions, gains, and withdrawals.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Export CSV
                const csvHeader = 'Year,Age,Starting Balance,Contributions,compounding Interest,Withdrawals,Ending Balance\n';
                const csvRows = fireResults.yearlyProjections.map(row => 
                  `${row.year},${row.age},${row.startBalance},${row.contribution},${row.interestEarned},${row.withdrawal},${row.endBalance}`
                ).join('\n');
                
                const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'fire_yearly_projections.csv';
                link.click();
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 transition-colors flex items-center gap-1"
            >
              <Download size={12} />
              CSV
            </button>
            <span className="text-xs font-extrabold text-indigo-600">
              {showYearlyTable ? 'Collapse [-]' : 'Expand [+]'}
            </span>
          </div>
        </button>

        {showYearlyTable && (
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-5 py-3">Year</th>
                  <th className="px-5 py-3">Age</th>
                  <th className="px-5 py-3 text-right">Start Net Worth</th>
                  <th className="px-5 py-3 text-right">Contributions</th>
                  <th className="px-5 py-3 text-right">Compounding Gains</th>
                  <th className="px-5 py-3 text-right">Yearly Expenses</th>
                  <th className="px-5 py-3 text-right">End Net Worth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px] font-semibold text-slate-600">
                {fireResults.yearlyProjections.map((row) => (
                  <tr key={row.year} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-2.5">{row.year}</td>
                    <td className="px-5 py-2.5">{row.age}</td>
                    <td className="px-5 py-2.5 text-right">{fmt(row.startBalance)}</td>
                    <td className="px-5 py-2.5 text-right text-emerald-600">{row.contribution > 0 ? `+${fmt(row.contribution)}` : '—'}</td>
                    <td className="px-5 py-2.5 text-right text-indigo-600">+{fmt(row.interestEarned)}</td>
                    <td className="px-5 py-2.5 text-right text-rose-600">{row.withdrawal > 0 ? `-${fmt(row.withdrawal)}` : '—'}</td>
                    <td className="px-5 py-2.5 text-right font-bold text-slate-800">{fmt(row.endBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Helpful educational footer card */}
      <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200/60 flex items-start gap-4">
        <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-200/50 flex items-center justify-center shrink-0 text-slate-500">
          <BadgeInfo size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Understanding FIRE Calculations</h4>
          <ul className="text-xs text-slate-500 space-y-1.5 list-disc pl-4 pt-1">
            <li><strong>Safe Withdrawal Rate (SWR):</strong> The rate of annual withdrawals that should theoretically sustain a portfolio for 30+ years. The standard rule of thumb is 4%, derived from the Trinity Study, which corresponds to saving 25 times your annual expenses.</li>
            <li><strong>Inflation impact:</strong> An annual inflation rate of 6% means that prices double approximately every 12 years. This is why your absolute retirement target number compounds to a much higher value in the future.</li>
            <li><strong>The "Early Retiree" edge:</strong> Because early retirees will spend more than 30 years in retirement, some experts recommend a more conservative withdrawal rate of 3% to 3.5%, meaning you should aim for 30-33x annual expenses.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
