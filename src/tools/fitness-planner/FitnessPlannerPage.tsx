import React, { useState, useMemo } from 'react';
import { Apple, Plus, Trash2, ShieldAlert, Sparkles, Scale, Info, ChevronRight, Utensils, CalendarDays, Award, Heart } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
}

interface MacroSplitPreset {
  name: string;
  protein: number; // percentage
  carbs: number; // percentage
  fat: number; // percentage
}

const MACRO_PRESETS: Record<string, MacroSplitPreset> = {
  balanced: { name: 'Balanced (40/30/30)', carbs: 40, protein: 30, fat: 30 },
  lowCarb: { name: 'Low Carb / High Protein (30/40/30)', carbs: 30, protein: 40, fat: 30 },
  keto: { name: 'Ketogenic (5/25/70)', carbs: 5, protein: 25, fat: 70 },
  custom: { name: 'Custom Split', carbs: 35, protein: 35, fat: 30 }
};

// Preset Foods for Quick-Log
const FOOD_PRESETS = [
  { name: 'Oatmeal (50g)', calories: 190, protein: 7, carbs: 32, fat: 3 },
  { name: 'Boiled Egg (1 pc)', calories: 70, protein: 6, carbs: 0.6, fat: 5 },
  { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Cooked Rice (100g)', calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { name: 'Whey Protein (1 scoop)', calories: 120, protein: 24, carbs: 3, fat: 1.5 },
  { name: 'Apple (1 medium)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { name: 'Whole Milk (250ml)', calories: 150, protein: 8, carbs: 12, fat: 8 },
  { name: 'Peanut Butter (1 tbsp)', calories: 95, protein: 3.5, carbs: 3, fat: 8 }
];

const DEFAULT_LOGGED_FOODS: FoodItem[] = [
  { id: '1', name: 'Oatmeal with Whole Milk', calories: 340, protein: 15, carbs: 44, fat: 11 },
  { id: '2', name: 'Boiled Eggs (2 pcs)', calories: 140, protein: 12, carbs: 1.2, fat: 10 }
];

export const FitnessPlannerPage: React.FC = () => {
  // Metric settings states
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number | ''>(28);
  
  const [heightUnit, setHeightUnit] = useState<'cm' | 'in'>('cm');
  const [heightCm, setHeightCm] = useState<number | ''>(175);
  const [heightFt, setHeightFt] = useState<number | ''>(5);
  const [heightIn, setHeightIn] = useState<number | ''>(9);

  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [weight, setWeight] = useState<number | ''>(76);

  const [activity, setActivity] = useState<number>(1.375); // Lightly Active
  const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain'>('lose');
  const [rate, setRate] = useState<number>(0.20); // Deficit / surplus percentage (e.g. 20%)

  // Macro preference state
  const [macroPresetKey, setMacroPresetKey] = useState<string>('balanced');
  const [customCarbs, setCustomCarbs] = useState(40);
  const [customProtein, setCustomProtein] = useState(30);
  const [customFat, setCustomFat] = useState(30);

  // Daily logged food state
  const [loggedFoods, setLoggedFoods] = useState<FoodItem[]>(DEFAULT_LOGGED_FOODS);
  
  // Custom Food Form State
  const [foodName, setFoodName] = useState('');
  const [foodCalStr, setFoodCalStr] = useState('');
  const [foodProtStr, setFoodProtStr] = useState('');
  const [foodCarbStr, setFoodCarbStr] = useState('');
  const [foodFatStr, setFoodFatStr] = useState('');

  // 1. Calculations: Height & Weight conversions to Metric (handling empty inputs safely)
  const metricHeight = useMemo(() => {
    const valHeightCm = heightCm === '' ? 175 : heightCm;
    const valHeightFt = heightFt === '' ? 5 : heightFt;
    const valHeightIn = heightIn === '' ? 9 : heightIn;

    if (heightUnit === 'cm') return valHeightCm;
    // convert feet & inches to cm
    const totalInches = (valHeightFt * 12) + valHeightIn;
    return Math.round(totalInches * 2.54);
  }, [heightUnit, heightCm, heightFt, heightIn]);

  const metricWeight = useMemo(() => {
    const valWeight = weight === '' ? 76 : weight;
    if (weightUnit === 'kg') return valWeight;
    // convert lbs to kg
    return Math.round(valWeight * 0.453592);
  }, [weightUnit, weight]);

  // 2. Calculations: BMI & BMR & TDEE
  const bmi = useMemo(() => {
    const heightInMeters = metricHeight / 100;
    if (heightInMeters <= 0) return 0;
    return parseFloat((metricWeight / (heightInMeters * heightInMeters)).toFixed(1));
  }, [metricHeight, metricWeight]);

  const bmiStatus = useMemo(() => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-sky-500 bg-sky-50 border-sky-200', pct: 20 };
    if (bmi >= 18.5 && bmi < 25) return { label: 'Normal weight', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', pct: 45 };
    if (bmi >= 25 && bmi < 30) return { label: 'Overweight', color: 'text-amber-600 bg-amber-50 border-amber-200', pct: 70 };
    return { label: 'Obese', color: 'text-rose-600 bg-rose-50 border-rose-200', pct: 90 };
  }, [bmi]);

  const bmr = useMemo(() => {
    const ageVal = age === '' ? 28 : age;
    // Mifflin-St Jeor Equation
    if (gender === 'male') {
      return Math.round((10 * metricWeight) + (6.25 * metricHeight) - (5 * ageVal) + 5);
    } else {
      return Math.round((10 * metricWeight) + (6.25 * metricHeight) - (5 * ageVal) - 161);
    }
  }, [gender, metricWeight, metricHeight, age]);

  const tdee = useMemo(() => {
    return Math.round(bmr * activity);
  }, [bmr, activity]);

  const calorieTarget = useMemo(() => {
    if (goal === 'maintain') return tdee;
    if (goal === 'lose') {
      return Math.round(tdee * (1 - rate));
    } else {
      return Math.round(tdee * (1 + rate));
    }
  }, [tdee, goal, rate]);

  // Daily target calorie ceiling check (Safety Check)
  const safetyStatus = useMemo(() => {
    const minCalories = gender === 'male' ? 1200 : 1000;
    const weeklyRate = (Math.abs(tdee - calorieTarget) * 7) / 7700; // kg per week

    if (calorieTarget < minCalories) {
      return {
        level: 'danger',
        label: '🚨 Unsafe Deficit Rate',
        desc: `Calories are too low (${calorieTarget} kcal). Restrictive eating below ${minCalories} kcal is not recommended.`
      };
    }
    if (weeklyRate > 1.0 && goal === 'lose') {
      return {
        level: 'warning',
        label: '⚠️ Aggressive Weight Loss',
        desc: `Targeting a loss of ${(weeklyRate * 2.2).toFixed(1)} lbs (${weeklyRate.toFixed(2)} kg) per week can cause muscle fatigue and slow metabolism.`
      };
    }
    return {
      level: 'safe',
      label: '✅ Healthy Diet Plan',
      desc: `Calorie targets are within a safe, sustainable boundary for steady progress.`
    };
  }, [calorieTarget, tdee, gender, goal]);

  // 3. Macronutrient Targets
  const activeMacroPreset = useMemo(() => {
    if (macroPresetKey !== 'custom') {
      return MACRO_PRESETS[macroPresetKey];
    }
    return {
      name: 'Custom Split',
      carbs: customCarbs,
      protein: customProtein,
      fat: customFat
    };
  }, [macroPresetKey, customCarbs, customProtein, customFat]);

  const macroGramTargets = useMemo(() => {
    const proteinKcal = calorieTarget * (activeMacroPreset.protein / 100);
    const carbsKcal = calorieTarget * (activeMacroPreset.carbs / 100);
    const fatKcal = calorieTarget * (activeMacroPreset.fat / 100);

    return {
      protein: Math.round(proteinKcal / 4),
      carbs: Math.round(carbsKcal / 4),
      fat: Math.round(fatKcal / 9)
    };
  }, [calorieTarget, activeMacroPreset]);

  const pieChartData = useMemo(() => {
    return [
      { name: 'Carbs', value: activeMacroPreset.carbs, color: '#6366f1' }, // Indigo
      { name: 'Protein', value: activeMacroPreset.protein, color: '#10b981' }, // Emerald
      { name: 'Fat', value: activeMacroPreset.fat, color: '#f59e0b' } // Amber
    ];
  }, [activeMacroPreset]);

  // 4. Weight timeline projections (12 Weeks)
  const projectionChartData = useMemo(() => {
    const data = [];
    const dailyDelta = calorieTarget - tdee;
    const weeklyDelta = dailyDelta * 7;
    const weeklyWeightDelta = weeklyDelta / 7700; // in kg
    const scaleFactor = weightUnit === 'kg' ? 1 : 2.20462;

    let currentWeight = weight;
    for (let wk = 0; wk <= 12; wk++) {
      data.push({
        name: `Wk ${wk}`,
        Weight: parseFloat((currentWeight * scaleFactor).toFixed(1))
      });
      currentWeight += weeklyWeightDelta;
    }
    return data;
  }, [weight, calorieTarget, tdee, weightUnit]);

  // 5. Daily Log Food Totals
  const logTotals = useMemo(() => {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    loggedFoods.forEach(food => {
      calories += food.calories;
      protein += food.protein;
      carbs += food.carbs;
      fat += food.fat;
    });

    return {
      calories,
      protein,
      carbs,
      fat
    };
  }, [loggedFoods]);

  // Food Log Actions
  const handleQuickAddFood = (preset: typeof FOOD_PRESETS[0]) => {
    const newFood: FoodItem = {
      id: Date.now().toString() + Math.random().toString(),
      name: preset.name,
      calories: preset.calories,
      protein: preset.protein,
      carbs: preset.carbs,
      fat: preset.fat
    };
    setLoggedFoods(prev => [...prev, newFood]);
  };

  const handleAddCustomFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) return;

    const calories = parseInt(foodCalStr) || 0;
    const protein = parseInt(foodProtStr) || 0;
    const carbs = parseInt(foodCarbStr) || 0;
    const fat = parseInt(foodFatStr) || 0;

    const newFood: FoodItem = {
      id: Date.now().toString(),
      name: foodName.trim(),
      calories,
      protein,
      carbs,
      fat
    };

    setLoggedFoods(prev => [...prev, newFood]);

    setFoodName('');
    setFoodCalStr('');
    setFoodProtStr('');
    setFoodCarbStr('');
    setFoodFatStr('');
  };

  const handleDeleteFood = (id: string) => {
    setLoggedFoods(prev => prev.filter(f => f.id !== id));
  };

  const handleResetLog = () => {
    if (window.confirm("Clear today's logged food list?")) {
      setLoggedFoods([]);
    }
  };

  const formatPercentage = (consumed: number, target: number) => {
    if (target <= 0) return '0%';
    const pct = Math.min(100, Math.round((consumed / target) * 100));
    return `${pct}%`;
  };

  const getProgressBarWidth = (consumed: number, target: number) => {
    if (target <= 0) return '0%';
    const pct = Math.min(100, Math.round((consumed / target) * 100));
    return `${pct}%`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in bg-slate-50 min-h-screen">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-rose-500 font-bold text-sm tracking-wider uppercase">
            <Apple size={16} />
            <span>Health & Nutrition</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            BMI, Macro & TDEE Nutrition Planner
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-2xl">
            Take command of your metabolism. Calculate your exact caloric needs, set macronutrient targets, and track your daily meals to fuel your fitness goals.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <span className="text-xs font-bold text-slate-400 uppercase">BMI (Body Mass Index)</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-slate-900">{bmi}</span>
            <span className={`px-2 py-0.5 rounded-md border text-[10px] font-black uppercase tracking-wider ${bmiStatus.color}`}>
              {bmiStatus.label}
            </span>
          </div>
          {/* Custom gauge meter bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 relative overflow-hidden">
            <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-sky-400 via-emerald-400 to-rose-400 w-full" />
            <span className="absolute top-0 bottom-0 w-1.5 bg-slate-800 border border-white" style={{ left: `${bmiStatus.pct}%` }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <span className="text-xs font-bold text-slate-400 uppercase">Daily Calorie Target</span>
          <span className="text-3xl font-black text-rose-600 mt-2">{calorieTarget.toLocaleString()} kcal</span>
          <span className="text-[10px] text-slate-500 font-semibold mt-1">
            {goal === 'lose' ? 'Calorie Deficit' : goal === 'gain' ? 'Calorie Surplus' : 'Maintenance Plan'} (TDEE: {tdee})
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <span className="text-xs font-bold text-slate-400 uppercase">TDEE (Daily Burn)</span>
          <span className="text-3xl font-black text-slate-900 mt-2">{tdee.toLocaleString()} kcal</span>
          <span className="text-[10px] text-slate-500 font-semibold mt-1">Total Daily Energy Expenditure</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <span className="text-xs font-bold text-slate-400 uppercase">BMR (Metabolic Floor)</span>
          <span className="text-3xl font-black text-slate-900 mt-2">{bmr.toLocaleString()} kcal</span>
          <span className="text-[10px] text-slate-500 font-semibold mt-1">Calories burned at absolute rest</span>
        </div>
      </div>

      {/* Safety / Diet Status Alert */}
      {safetyStatus.level !== 'safe' && (
        <div className={`p-4 rounded-2xl border flex items-start gap-3 animate-fade-in ${
          safetyStatus.level === 'danger' 
            ? 'bg-rose-50 border-rose-200 text-rose-800' 
            : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          <ShieldAlert size={18} className="shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider">{safetyStatus.label}</h4>
            <p className="text-xs mt-0.5 leading-relaxed">{safetyStatus.desc}</p>
          </div>
        </div>
      )}

      {/* Main Grid: Forms and visual calculations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Metric Inputs */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Scale size={18} className="text-rose-500" />
            <span>Body & Goal Metrics</span>
          </h3>

          <div className="space-y-4">
            {/* Gender Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Gender</label>
              <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/50">
                <button
                  onClick={() => setGender('male')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    gender === 'male' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  Male
                </button>
                <button
                  onClick={() => setGender('female')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    gender === 'female' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            {/* Age & Unit selectors */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Age</label>
                <input
                  type="number"
                  min="12"
                  max="100"
                  value={age}
                  onChange={e => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-bold text-slate-700"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Height Unit</label>
                <select
                  value={heightUnit}
                  onChange={e => setHeightUnit(e.target.value as 'cm' | 'in')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-bold text-slate-700"
                >
                  <option value="cm">cm</option>
                  <option value="in">ft / in</option>
                </select>
              </div>

              <div className="col-span-1">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Weight Unit</label>
                <select
                  value={weightUnit}
                  onChange={e => setWeightUnit(e.target.value as 'kg' | 'lbs')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-bold text-slate-700"
                >
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
            </div>

            {/* Height input boxes */}
            {heightUnit === 'cm' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Height (cm)</label>
                <input
                  type="number"
                  min="100"
                  max="250"
                  value={heightCm}
                  onChange={e => setHeightCm(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-bold text-slate-700"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Feet</label>
                  <input
                    type="number"
                    min="3"
                    max="8"
                    value={heightFt}
                    onChange={e => setHeightFt(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-bold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Inches</label>
                  <input
                    type="number"
                    min="0"
                    max="11"
                    value={heightIn}
                    onChange={e => setHeightIn(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-bold text-slate-700"
                  />
                </div>
              </div>
            )}

            {/* Weight Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Weight ({weightUnit})</label>
              <input
                type="number"
                min="30"
                max="250"
                value={weight}
                onChange={e => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-bold text-slate-700"
              />
            </div>

            {/* Activity Level Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Daily Activity</label>
              <select
                value={activity}
                onChange={e => setActivity(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-semibold text-slate-700"
              >
                <option value="1.2">Sedentary (Little/no exercise)</option>
                <option value="1.375">Lightly Active (Exercise 1-3 days/wk)</option>
                <option value="1.55">Moderately Active (Exercise 3-5 days/wk)</option>
                <option value="1.725">Very Active (Hard exercise 6-7 days/wk)</option>
                <option value="1.9">Extra Active (Heavy physical job/training)</option>
              </select>
            </div>

            {/* Goal Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Fitness Goal</label>
              <select
                value={goal}
                onChange={e => setGoal(e.target.value as 'lose' | 'maintain' | 'gain')}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-semibold text-slate-700"
              >
                <option value="lose">Lose Weight (Fat Loss)</option>
                <option value="maintain">Maintain Weight (Balance)</option>
                <option value="gain">Gain Weight (Muscle Mass)</option>
              </select>
            </div>

            {/* Deficit / Surplus Rate Selector */}
            {goal !== 'maintain' && (
              <div className="animate-fade-in">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Plan Intensity ({goal === 'lose' ? 'Deficit' : 'Surplus'})
                </label>
                <select
                  value={rate}
                  onChange={e => setRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-semibold text-slate-700"
                >
                  <option value="0.10">Mild (10% {goal === 'lose' ? 'deficit' : 'surplus'})</option>
                  <option value="0.20">Moderate (20% {goal === 'lose' ? 'deficit' : 'surplus'})</option>
                  <option value="0.30">Aggressive (30% {goal === 'lose' ? 'deficit' : 'surplus'})</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Middle Column: Macro Splits and Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Utensils size={18} className="text-rose-500" />
              <span>Macronutrient Targets</span>
            </h3>

            {/* Preset Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Diet Protocol</label>
              <select
                value={macroPresetKey}
                onChange={e => setMacroPresetKey(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-semibold text-slate-700"
              >
                <option value="balanced">Balanced Split (40/30/30)</option>
                <option value="lowCarb">Low Carb / High Protein (30/40/30)</option>
                <option value="keto">Ketogenic Protocol (5/25/70)</option>
                <option value="custom">Custom Percentage Split</option>
              </select>
            </div>

            {/* Custom inputs */}
            {macroPresetKey === 'custom' && (
              <div className="grid grid-cols-3 gap-3.5 pt-1.5 animate-fade-in text-xs font-bold text-slate-600">
                <div>
                  <label className="block mb-1">Carbs (%)</label>
                  <input
                    type="number"
                    value={customCarbs}
                    onChange={e => setCustomCarbs(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 text-center"
                  />
                </div>
                <div>
                  <label className="block mb-1">Protein (%)</label>
                  <input
                    type="number"
                    value={customProtein}
                    onChange={e => setCustomProtein(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 text-center"
                  />
                </div>
                <div>
                  <label className="block mb-1">Fat (%)</label>
                  <input
                    type="number"
                    value={customFat}
                    onChange={e => setCustomFat(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 text-center"
                  />
                </div>
              </div>
            )}

            {/* Pie Chart display */}
            <div className="h-44 mt-4 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value}%`, 'Ratio']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Macro Breakdown Cards */}
          <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-slate-100">
            <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-center flex flex-col justify-between">
              <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-wide">Carbs</span>
              <span className="text-base font-black text-indigo-950 mt-1">{macroGramTargets.carbs}g</span>
              <span className="text-[9px] text-indigo-500 font-semibold mt-0.5">{activeMacroPreset.carbs}% ratio</span>
            </div>

            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-center flex flex-col justify-between">
              <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wide">Protein</span>
              <span className="text-base font-black text-emerald-950 mt-1">{macroGramTargets.protein}g</span>
              <span className="text-[9px] text-emerald-500 font-semibold mt-0.5">{activeMacroPreset.protein}% ratio</span>
            </div>

            <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-center flex flex-col justify-between">
              <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wide">Fat</span>
              <span className="text-base font-black text-amber-950 mt-1">{macroGramTargets.fat}g</span>
              <span className="text-[9px] text-amber-500 font-semibold mt-0.5">{activeMacroPreset.fat}% ratio</span>
            </div>
          </div>
        </div>

        {/* Right Column: 12-Week Weight Projection */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <CalendarDays size={18} className="text-rose-500" />
            <span>12-Week Weight Forecast</span>
          </h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
             composes your expected weight path based on target daily calories. A safe rate is losing 0.5 - 1.0 kg (1 - 2 lbs) per week.
          </p>

          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="weightProjectionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  domain={['dataMin - 3', 'dataMax + 3']}
                />
                <Tooltip
                  formatter={(value: any) => [`${value} ${weightUnit}`, 'Weight']}
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                />
                <Area type="monotone" dataKey="Weight" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#weightProjectionGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Interactive Food Log & Intake Progress Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-t border-slate-200 pt-8">
        {/* Left Column: Add Food Intake forms */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Plus size={18} className="text-rose-500" />
              <span>Log Food Intake</span>
            </h3>

            <form onSubmit={handleAddCustomFood} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Food Name</label>
                <input
                  type="text"
                  placeholder="e.g. Scrambled Eggs, Protein Shake"
                  value={foodName}
                  onChange={e => setFoodName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Calories (kcal)</label>
                  <input
                    type="number"
                    placeholder="e.g. 140"
                    value={foodCalStr}
                    onChange={e => setFoodCalStr(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Protein (g)</label>
                  <input
                    type="number"
                    placeholder="e.g. 12"
                    value={foodProtStr}
                    onChange={e => setFoodProtStr(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Carbs (g)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1"
                    value={foodCarbStr}
                    onChange={e => setFoodCarbStr(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Fat (g)</label>
                  <input
                    type="number"
                    placeholder="e.g. 10"
                    value={foodFatStr}
                    onChange={e => setFoodFatStr(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-100"
              >
                Log Custom Food
              </button>
            </form>
          </div>

          {/* Quick-Log Presets Panel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Plus size={16} className="text-rose-500" />
              <span>⚡ Quick Log Presets</span>
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {FOOD_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleQuickAddFood(preset)}
                  className="p-2.5 text-[11px] font-bold bg-slate-50 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-xl transition-all text-left flex flex-col gap-1 truncate group"
                  title={`Add ${preset.name}`}
                >
                  <span className="truncate text-slate-700 group-hover:text-rose-700">{preset.name}</span>
                  <span className="text-[9px] text-slate-400 font-semibold">{preset.calories} kcal | P: {preset.protein}g</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Middle/Right Columns: Food Log Table & Live Macro Progress Bars */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Progress Tracker */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>Today's Daily Target Tracker</span>
              <button
                onClick={handleResetLog}
                className="text-[10px] text-slate-400 hover:text-rose-600 font-bold uppercase transition-colors"
              >
                Reset Log
              </button>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Calories Progress Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                  <span>Calories</span>
                  <span className="text-rose-600 font-black">{formatPercentage(logTotals.calories, calorieTarget)}</span>
                </div>
                <div className="mt-2">
                  <span className="text-xl font-black text-slate-800">{logTotals.calories}</span>
                  <span className="text-xs text-slate-400 font-medium"> / {calorieTarget} kcal</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-rose-600 h-full transition-all duration-300"
                    style={{ width: getProgressBarWidth(logTotals.calories, calorieTarget) }}
                  />
                </div>
              </div>

              {/* Protein Progress Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                  <span>Protein</span>
                  <span className="text-emerald-600 font-black">{formatPercentage(logTotals.protein, macroGramTargets.protein)}</span>
                </div>
                <div className="mt-2">
                  <span className="text-xl font-black text-slate-800">{logTotals.protein}g</span>
                  <span className="text-xs text-slate-400 font-medium"> / {macroGramTargets.protein}g</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: getProgressBarWidth(logTotals.protein, macroGramTargets.protein) }}
                  />
                </div>
              </div>

              {/* Carbs Progress Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                  <span>Carbs</span>
                  <span className="text-indigo-600 font-black">{formatPercentage(logTotals.carbs, macroGramTargets.carbs)}</span>
                </div>
                <div className="mt-2">
                  <span className="text-xl font-black text-slate-800">{logTotals.carbs}g</span>
                  <span className="text-xs text-slate-400 font-medium"> / {macroGramTargets.carbs}g</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full transition-all duration-300"
                    style={{ width: getProgressBarWidth(logTotals.carbs, macroGramTargets.carbs) }}
                  />
                </div>
              </div>

              {/* Fat Progress Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                  <span>Fat</span>
                  <span className="text-amber-600 font-black">{formatPercentage(logTotals.fat, macroGramTargets.fat)}</span>
                </div>
                <div className="mt-2">
                  <span className="text-xl font-black text-slate-800">{logTotals.fat}g</span>
                  <span className="text-xs text-slate-400 font-medium"> / {macroGramTargets.fat}g</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full transition-all duration-300"
                    style={{ width: getProgressBarWidth(logTotals.fat, macroGramTargets.fat) }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Daily Food Log List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800">Logged Foods ({loggedFoods.length})</h2>
              <span className="text-xs text-slate-400">Review today's logged meals</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-5 py-3">Food Name</th>
                    <th className="px-4 py-3 text-right">Calories</th>
                    <th className="px-4 py-3 text-right">Protein</th>
                    <th className="px-4 py-3 text-right">Carbs</th>
                    <th className="px-4 py-3 text-right">Fat</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {loggedFoods.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                        No food logged today yet. Type custom foods or use Quick-Log presets.
                      </td>
                    </tr>
                  ) : (
                    loggedFoods.map(food => (
                      <tr key={food.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3 font-bold text-slate-800">{food.name}</td>
                        <td className="px-4 py-3 text-right text-rose-600 font-bold">{food.calories} kcal</td>
                        <td className="px-4 py-3 text-right text-emerald-600">{food.protein}g</td>
                        <td className="px-4 py-3 text-right text-indigo-600">{food.carbs}g</td>
                        <td className="px-4 py-3 text-right text-amber-600">{food.fat}g</td>
                        <td className="px-5 py-3 text-right">
                          <button
                            onClick={() => handleDeleteFood(food.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Helpful educational tips footer card */}
      <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200/60 flex items-start gap-4">
        <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-200/50 flex items-center justify-center shrink-0 text-slate-500">
          <Info size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Understanding BMI, TDEE, & Macros</h4>
          <ul className="text-xs text-slate-500 space-y-1.5 list-disc pl-4 pt-1">
            <li><strong>BMI (Body Mass Index):</strong> A quick general gauge of body composition based on height and weight. Note: BMI does not differentiate between muscle mass and fat, so athletes may score as "overweight" while carrying very low body fat.</li>
            <li><strong>BMR vs. TDEE:</strong> BMR is what you burn doing absolutely nothing (metabolic base). TDEE represents your actual daily expenditure factoring in your movements and exercise.</li>
            <li><strong>Macronutrient splits:</strong> *Protein* is critical for muscle tissue repair (4 kcal/g), *Carbohydrates* represent your main glycogen/energy source (4 kcal/g), and *Fats* support hormone regulation and joint health (9 kcal/g).</li>
            <li><strong>Sustainability:</strong> The healthiest deficits for long-term fat loss are 10% to 20% below your TDEE, corresponding to a steady loss of 0.25 to 0.75 kg (0.5 to 1.5 lbs) per week.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
