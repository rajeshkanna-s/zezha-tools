import React, { useState, useMemo } from 'react';
import {
  Activity, User, Ruler, Target, TrendingDown, TrendingUp,
  Info, ChevronRight, Award, Heart, ShieldAlert, Sparkles, Scale
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';

/* ─── Body-fat category ranges (ACE fitness) ─────────────────── */
const BF_CATEGORIES_MALE = [
  { label: 'Essential Fat', min: 2, max: 5, color: '#ef4444', bg: 'bg-red-50 border-red-200 text-red-700' },
  { label: 'Athletes', min: 6, max: 13, color: '#3b82f6', bg: 'bg-blue-50 border-blue-200 text-blue-700' },
  { label: 'Fitness', min: 14, max: 17, color: '#10b981', bg: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
  { label: 'Acceptable', min: 18, max: 24, color: '#f59e0b', bg: 'bg-amber-50 border-amber-200 text-amber-700' },
  { label: 'Obese', min: 25, max: 50, color: '#dc2626', bg: 'bg-rose-50 border-rose-200 text-rose-700' },
];
const BF_CATEGORIES_FEMALE = [
  { label: 'Essential Fat', min: 10, max: 13, color: '#ef4444', bg: 'bg-red-50 border-red-200 text-red-700' },
  { label: 'Athletes', min: 14, max: 20, color: '#3b82f6', bg: 'bg-blue-50 border-blue-200 text-blue-700' },
  { label: 'Fitness', min: 21, max: 24, color: '#10b981', bg: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
  { label: 'Acceptable', min: 25, max: 31, color: '#f59e0b', bg: 'bg-amber-50 border-amber-200 text-amber-700' },
  { label: 'Obese', min: 32, max: 50, color: '#dc2626', bg: 'bg-rose-50 border-rose-200 text-rose-700' },
];

/* ─── Ideal BF% ranges by age-group (ACSM guidelines) ─────────── */
const IDEAL_BF_TABLE_MALE = [
  { ageRange: '18–25', ideal: '8–15%', mid: 11.5 },
  { ageRange: '26–35', ideal: '10–18%', mid: 14 },
  { ageRange: '36–45', ideal: '12–21%', mid: 16.5 },
  { ageRange: '46–55', ideal: '14–23%', mid: 18.5 },
  { ageRange: '56–65', ideal: '16–25%', mid: 20.5 },
  { ageRange: '65+', ideal: '18–26%', mid: 22 },
];
const IDEAL_BF_TABLE_FEMALE = [
  { ageRange: '18–25', ideal: '18–24%', mid: 21 },
  { ageRange: '26–35', ideal: '20–26%', mid: 23 },
  { ageRange: '36–45', ideal: '22–28%', mid: 25 },
  { ageRange: '46–55', ideal: '24–30%', mid: 27 },
  { ageRange: '56–65', ideal: '26–32%', mid: 29 },
  { ageRange: '65+', ideal: '28–34%', mid: 31 },
];

export const BodyFatCalculatorPage: React.FC = () => {
  /* ─── State ─────────────────────────────────────────────────── */
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [age, setAge] = useState<number | ''>(28);

  const [heightCm, setHeightCm] = useState<number | ''>(175);
  const [weightKg, setWeightKg] = useState<number | ''>(76);
  const [neckCm, setNeckCm] = useState<number | ''>(38);
  const [waistCm, setWaistCm] = useState<number | ''>(85);
  const [hipCm, setHipCm] = useState<number | ''>(95); // only for female

  /* ─── Helpers to fall back on sane defaults when inputs are empty ─ */
  const safeAge = age === '' ? 28 : age;
  const safeHeight = (() => {
    const v = heightCm === '' ? 175 : heightCm;
    return unit === 'in' ? v * 2.54 : v;
  })();
  const safeWeight = weightKg === '' ? 76 : weightKg;
  const safeNeck = (() => {
    const v = neckCm === '' ? 38 : neckCm;
    return unit === 'in' ? v * 2.54 : v;
  })();
  const safeWaist = (() => {
    const v = waistCm === '' ? 85 : waistCm;
    return unit === 'in' ? v * 2.54 : v;
  })();
  const safeHip = (() => {
    const v = hipCm === '' ? 95 : hipCm;
    return unit === 'in' ? v * 2.54 : v;
  })();

  /* ─── US Navy Body Fat Formula ───────────────────────────────── */
  const bodyFatPct = useMemo(() => {
    if (safeHeight <= 0) return 0;
    if (gender === 'male') {
      // 86.010 × log10(waist − neck) − 70.041 × log10(height) + 36.76
      const diff = safeWaist - safeNeck;
      if (diff <= 0) return 0;
      return parseFloat(
        (86.01 * Math.log10(diff) - 70.041 * Math.log10(safeHeight) + 36.76).toFixed(1)
      );
    } else {
      // 163.205 × log10(waist + hip − neck) − 97.684 × log10(height) − 78.387
      const diff = safeWaist + safeHip - safeNeck;
      if (diff <= 0) return 0;
      return parseFloat(
        (163.205 * Math.log10(diff) - 97.684 * Math.log10(safeHeight) - 78.387).toFixed(1)
      );
    }
  }, [gender, safeHeight, safeWaist, safeNeck, safeHip]);

  /* ─── BMI-based body fat estimate (Deurenberg formula) ──────── */
  const bmi = useMemo(() => {
    const hm = safeHeight / 100;
    if (hm <= 0) return 0;
    return parseFloat((safeWeight / (hm * hm)).toFixed(1));
  }, [safeWeight, safeHeight]);

  const bodyFatBmi = useMemo(() => {
    // BF% = 1.20 × BMI + 0.23 × Age − 10.8 × sex − 5.4   (sex: male=1, female=0)
    const sex = gender === 'male' ? 1 : 0;
    return parseFloat((1.2 * bmi + 0.23 * safeAge - 10.8 * sex - 5.4).toFixed(1));
  }, [bmi, safeAge, gender]);

  /* ─── Derived metrics ──────────────────────────────────────── */
  const fatMass = useMemo(() => parseFloat(((bodyFatPct / 100) * safeWeight).toFixed(1)), [bodyFatPct, safeWeight]);
  const leanMass = useMemo(() => parseFloat((safeWeight - fatMass).toFixed(1)), [safeWeight, fatMass]);

  /* ─── Category classification ──────────────────────────────── */
  const categories = gender === 'male' ? BF_CATEGORIES_MALE : BF_CATEGORIES_FEMALE;
  const category = useMemo(() => {
    const bf = bodyFatPct;
    for (const cat of categories) {
      if (bf >= cat.min && bf <= cat.max) return cat;
    }
    if (bf < categories[0].min) return categories[0];
    return categories[categories.length - 1];
  }, [bodyFatPct, categories]);

  /* ─── Ideal BF table for reference ─────────────────────────── */
  const idealTable = gender === 'male' ? IDEAL_BF_TABLE_MALE : IDEAL_BF_TABLE_FEMALE;
  const idealForAge = useMemo(() => {
    if (safeAge <= 25) return idealTable[0];
    if (safeAge <= 35) return idealTable[1];
    if (safeAge <= 45) return idealTable[2];
    if (safeAge <= 55) return idealTable[3];
    if (safeAge <= 65) return idealTable[4];
    return idealTable[5];
  }, [safeAge, idealTable]);

  /* ─── Chart Data: Composition Donut ────────────────────────── */
  const compositionData = useMemo(() => [
    { name: 'Fat Mass', value: fatMass, color: '#f43f5e' },
    { name: 'Lean Mass', value: leanMass, color: '#06b6d4' },
  ], [fatMass, leanMass]);

  /* ─── Chart Data: Category range bar ──────────────────────── */
  const categoryBarData = useMemo(() =>
    categories.map(c => ({
      name: c.label,
      range: c.max - c.min,
      min: c.min,
      fill: c.color,
    }))
  , [categories]);

  /* ─── Gauge position (0-100%) for the linear gauge ──────── */
  const gaugePosition = useMemo(() => {
    const minBf = categories[0].min;
    const maxBf = categories[categories.length - 1].max;
    return Math.max(0, Math.min(100, ((bodyFatPct - minBf) / (maxBf - minBf)) * 100));
  }, [bodyFatPct, categories]);

  /* ─── UI helper for number inputs ──────────────────────────── */
  const numInput = (
    label: string,
    value: number | '',
    setter: (v: number | '') => void,
    min: number,
    max: number,
    suffix?: string
  ) => (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
        {label} {suffix && <span className="text-slate-400 font-normal">({suffix})</span>}
      </label>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={e => setter(e.target.value === '' ? '' : Number(e.target.value))}
        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-bold text-slate-700 transition-all"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-cyan-50/20 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Activity size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Body Fat % Calculator
            <span className="text-[10px] font-bold bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full">Navy Method</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">US Navy formula + BMI cross-check · ACE fitness categories</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ═══════════════ LEFT COLUMN: Inputs ═══════════════ */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <User size={18} className="text-cyan-500" />
            <span>Your Measurements</span>
          </h3>

          {/* Gender Toggle */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Gender</label>
            <div className="flex gap-2">
              <button
                onClick={() => setGender('male')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border ${
                  gender === 'male'
                    ? 'bg-cyan-500 text-white border-cyan-500 shadow-md shadow-cyan-500/25'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                ♂ Male
              </button>
              <button
                onClick={() => setGender('female')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border ${
                  gender === 'female'
                    ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/25'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                ♀ Female
              </button>
            </div>
          </div>

          {/* Unit Toggle */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Unit System</label>
            <div className="flex gap-2">
              <button
                onClick={() => setUnit('cm')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-200 border ${
                  unit === 'cm'
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Metric (cm / kg)
              </button>
              <button
                onClick={() => setUnit('in')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-200 border ${
                  unit === 'in'
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Imperial (in / lbs)
              </button>
            </div>
          </div>

          {/* Age */}
          {numInput('Age', age, setAge, 14, 80, 'years')}

          {/* Height & Weight */}
          <div className="grid grid-cols-2 gap-3">
            {numInput('Height', heightCm, setHeightCm, unit === 'cm' ? 120 : 48, unit === 'cm' ? 230 : 90, unit)}
            {numInput('Weight', weightKg, setWeightKg, unit === 'cm' ? 30 : 66, unit === 'cm' ? 200 : 440, unit === 'cm' ? 'kg' : 'lbs')}
          </div>

          {/* Body measurements */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Ruler size={13} /> Circumference Measurements
            </h4>
            {numInput('Neck', neckCm, setNeckCm, unit === 'cm' ? 25 : 10, unit === 'cm' ? 60 : 24, unit)}
            {numInput('Waist', waistCm, setWaistCm, unit === 'cm' ? 50 : 20, unit === 'cm' ? 160 : 63, unit)}
            {gender === 'female' && numInput('Hip', hipCm, setHipCm, unit === 'cm' ? 60 : 24, unit === 'cm' ? 170 : 67, unit)}
          </div>

          {/* Measurement guide */}
          <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-3.5 space-y-1.5">
            <p className="text-[10px] font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1">
              <Info size={12} /> How to Measure
            </p>
            <ul className="text-[11px] text-sky-800 space-y-1 leading-relaxed">
              <li className="flex gap-1.5"><ChevronRight size={11} className="text-sky-400 mt-0.5 shrink-0" /> <b>Neck:</b> Below the larynx, tape sloping slightly downward</li>
              <li className="flex gap-1.5"><ChevronRight size={11} className="text-sky-400 mt-0.5 shrink-0" /> <b>Waist:</b> At navel level, relaxed (don't suck in!)</li>
              {gender === 'female' && (
                <li className="flex gap-1.5"><ChevronRight size={11} className="text-sky-400 mt-0.5 shrink-0" /> <b>Hip:</b> At the widest point of the buttocks</li>
              )}
            </ul>
          </div>
        </div>

        {/* ═══════════════ MIDDLE COLUMN: Results ═══════════════ */}
        <div className="space-y-5">
          {/* Hero Result Card */}
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 p-6 rounded-2xl shadow-xl text-white overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-rose-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-300/80">Navy Method</p>
                  <p className="text-5xl font-black mt-1 tabular-nums tracking-tight">
                    {bodyFatPct < 0 ? '—' : bodyFatPct}
                    <span className="text-xl font-bold text-cyan-300 ml-1">%</span>
                  </p>
                </div>
                <div className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${category.bg}`}>
                  {category.label}
                </div>
              </div>

              {/* Mini gauge */}
              <div className="space-y-1.5">
                <div className="h-2.5 bg-white/10 rounded-full relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${gaugePosition}%`,
                      background: `linear-gradient(90deg, ${categories[0].color}, ${categories[1].color}, ${categories[2].color}, ${categories[3].color}, ${categories[4].color})`,
                    }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg border-2 border-cyan-400 transition-all duration-700"
                    style={{ left: `calc(${gaugePosition}% - 7px)` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 font-semibold px-0.5">
                  {categories.map(c => <span key={c.label}>{c.label}</span>)}
                </div>
              </div>

              {/* Fat vs Lean pills */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-rose-300">Fat Mass</p>
                  <p className="text-lg font-black mt-0.5">{fatMass} <span className="text-xs font-semibold text-slate-300">kg</span></p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-cyan-300">Lean Mass</p>
                  <p className="text-lg font-black mt-0.5">{leanMass} <span className="text-xs font-semibold text-slate-300">kg</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* BMI cross-check */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Scale size={16} className="text-indigo-500" />
              BMI Cross-Check (Deurenberg)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-indigo-50/60 rounded-xl p-3 border border-indigo-100 text-center">
                <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-wide">Your BMI</p>
                <p className="text-xl font-black text-indigo-950 mt-1">{bmi}</p>
              </div>
              <div className="bg-violet-50/60 rounded-xl p-3 border border-violet-100 text-center">
                <p className="text-[9px] font-bold text-violet-600 uppercase tracking-wide">BF% (BMI Est.)</p>
                <p className="text-xl font-black text-violet-950 mt-1">{bodyFatBmi}%</p>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-3 leading-relaxed">
              {Math.abs(bodyFatPct - bodyFatBmi) <= 3
                ? '✅ Navy & BMI estimates are within 3% — high confidence in your result.'
                : '⚠️ Navy & BMI estimates differ by >3%. Re-check measurements or consult a professional.'}
            </p>
          </div>

          {/* Composition Donut */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Target size={16} className="text-rose-500" />
              Body Composition
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={compositionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={72}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {compositionData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${value} kg`, '']}
                    contentStyle={{ borderRadius: 12, fontSize: 11, border: '1px solid #e2e8f0' }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 11, fontWeight: 700 }}
                    formatter={(value) => <span style={{ color: '#334155' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ═══════════════ RIGHT COLUMN: Reference ═══════════════ */}
        <div className="space-y-5">
          {/* Category Range Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Award size={16} className="text-amber-500" />
              {gender === 'male' ? 'Male' : 'Female'} Body Fat Categories (ACE)
            </h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryBarData}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" domain={[0, 50]} tick={{ fontSize: 10 }} unit="%" />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fontWeight: 700 }} width={75} />
                  <Tooltip
                    formatter={(value: any, name: any, props: any) => [`${props.payload.min}% – ${props.payload.min + value}%`, 'Range']}
                    contentStyle={{ borderRadius: 12, fontSize: 11, border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="range" radius={[0, 6, 6, 0]} barSize={18}>
                    {categoryBarData.map((entry, i) => (
                      <Cell key={`bar-${i}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Your position indicator */}
            <div className={`mt-3 flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold ${category.bg}`}>
              <Sparkles size={14} />
              <span>Your {bodyFatPct}% falls in the <b>{category.label}</b> range</span>
            </div>
          </div>

          {/* Ideal BF by Age table */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Heart size={16} className="text-rose-500" />
              Ideal Body Fat % by Age ({gender === 'male' ? '♂' : '♀'})
            </h3>
            <div className="overflow-hidden rounded-xl border border-slate-100">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 text-left">
                    <th className="px-3 py-2 font-bold">Age Group</th>
                    <th className="px-3 py-2 font-bold">Ideal Range</th>
                  </tr>
                </thead>
                <tbody>
                  {idealTable.map((row, i) => (
                    <tr
                      key={i}
                      className={`border-t border-slate-50 transition-colors ${
                        row.ageRange === idealForAge.ageRange
                          ? 'bg-cyan-50/70 font-bold text-cyan-800'
                          : 'text-slate-600 hover:bg-slate-50/50'
                      }`}
                    >
                      <td className="px-3 py-2 flex items-center gap-1.5">
                        {row.ageRange === idealForAge.ageRange && <ChevronRight size={12} className="text-cyan-500" />}
                        {row.ageRange}
                      </td>
                      <td className="px-3 py-2">{row.ideal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-slate-500 mt-3 leading-relaxed">
              Your age group ({idealForAge.ageRange}) ideal range is <b>{idealForAge.ideal}</b>.
              {bodyFatPct >= 0 && bodyFatPct <= idealForAge.mid + 5 && bodyFatPct >= idealForAge.mid - 8
                ? ' ✅ You are within a healthy range!'
                : bodyFatPct > idealForAge.mid + 5
                ? ' ⬇ Consider reducing body fat through diet and exercise.'
                : ' ⬆ You may want to increase caloric intake for a healthy level.'}
            </p>
          </div>

          {/* Recommendations */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-2xl border border-emerald-200 shadow-sm">
            <h3 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">
              <ShieldAlert size={16} className="text-emerald-600" />
              Quick Tips
            </h3>
            <ul className="text-[11px] text-emerald-900 space-y-2 leading-relaxed">
              <li className="flex gap-2">
                <TrendingDown size={13} className="text-emerald-500 mt-0.5 shrink-0" />
                <span><b>To reduce BF%:</b> Maintain a 300–500 kcal daily deficit + resistance training 3–4× per week</span>
              </li>
              <li className="flex gap-2">
                <TrendingUp size={13} className="text-emerald-500 mt-0.5 shrink-0" />
                <span><b>To build lean mass:</b> Eat 1.6–2.2g protein per kg bodyweight + progressive overload</span>
              </li>
              <li className="flex gap-2">
                <Activity size={13} className="text-emerald-500 mt-0.5 shrink-0" />
                <span><b>Re-measure every 2–4 weeks</b> at the same time of day for accurate tracking</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
