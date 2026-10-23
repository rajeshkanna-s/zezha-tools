import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Sparkles, RefreshCw, Calendar, TrendingUp, TrendingDown, Info,
  Calculator, Scale, ShieldCheck, Check, Copy, ExternalLink,
  Layers, Award, Percent, ChevronDown, PieChart as PieChartIcon,
  Coins, Clock, AlertCircle, ShoppingBag, Gem, CheckCircle2,
  History, ArrowUpRight, ArrowDownRight, Minus, RotateCcw
} from 'lucide-react';
import './calculators.css';

// ═══ Types & Interfaces for Snapdata IBJA API ═══

export interface IbjaObservation {
  date: string;
  instrument: string;
  instrument_id: string;
  value: number | null;
  close: number | null;
  prev_close: number | null;
  change_pct: number | null;
  status: string;
  is_trading_day: boolean;
  filled_from: string | null;
  source: string;
  revision: number;
}

export interface SnapdataResponse {
  schema_version: string;
  generated_at: string;
  dataset: 'gold' | 'silver';
  scope: string;
  resolution: string;
  calendar: string;
  unit: {
    quantity: string;
    currency: string;
  };
  coverage: {
    from: string;
    to: string;
  };
  sources: Array<{
    id: string;
    name: string;
    url: string;
    licence?: string;
    retrieved_at?: string;
  }>;
  observations: IbjaObservation[];
}

export interface DailyRateRow {
  date: string;
  // Gold values
  rate24k: number;
  rate22k: number;
  rate18k: number;
  rate22k_8g: number;
  rate24k_8g: number;
  // Silver values
  rateSilver1g: number;
  rateSilver8g: number;
  rateSilver10g: number;
  rateSilverKg: number;
  // Fluctuation
  diff1g: number;
  diff8g: number;
  pctChange: number;
  prevRate1g: number;
  isFirst: boolean;
}

// Weight Units conversion to Grams
const WEIGHT_UNITS = [
  { id: 'g', label: 'Grams (g)', factor: 1 },
  { id: 'sovereign', label: 'Sovereign / Pavan (8g)', factor: 8.0 },
  { id: 'tola', label: 'Tola (11.6638g)', factor: 11.6638038 },
  { id: '10g', label: '10 Grams Bar', factor: 10.0 },
  { id: 'oz', label: 'Troy Ounce (31.1035g)', factor: 31.1034768 },
  { id: 'kg', label: 'Kilogram (1000g)', factor: 1000 },
];

// ═══ Robust Fallback Seed Benchmarks (Official IBJA Standard Market Rates) ═══
// Used as guaranteed default baseline if device has no previous cache and network is offline
const DEFAULT_FALLBACK_GOLD: SnapdataResponse = {
  schema_version: '1.0',
  generated_at: '2026-10-19T06:30:00Z',
  dataset: 'gold',
  scope: 'in',
  resolution: 'daily',
  calendar: 'IN-BULLION',
  unit: { quantity: 'gram', currency: 'INR' },
  coverage: { from: '2026-10-19', to: '2026-10-19' },
  sources: [{ id: 'ibja', name: 'India Bullion and Jewellers Association (IBJA)', url: 'https://ibja.co/' }],
  observations: [
    {
      date: '2026-10-19',
      instrument: 'XAU.24K',
      instrument_id: 'XAU.24K.INR.G',
      value: 14804,
      close: 14804,
      prev_close: 14766,
      change_pct: 0.2573,
      status: 'provisional',
      is_trading_day: true,
      filled_from: null,
      source: 'ibja',
      revision: 0,
    },
    {
      date: '2026-10-19',
      instrument: 'XAU.22K',
      instrument_id: 'XAU.22K.INR.G',
      value: 13570,
      close: 13570,
      prev_close: 13535,
      change_pct: 0.2586,
      status: 'provisional',
      is_trading_day: true,
      filled_from: null,
      source: 'ibja',
      revision: 0,
    },
    {
      date: '2026-10-19',
      instrument: 'XAU.18K',
      instrument_id: 'XAU.18K.INR.G',
      value: 11103,
      close: 11103,
      prev_close: 11074,
      change_pct: 0.2619,
      status: 'provisional',
      is_trading_day: true,
      filled_from: null,
      source: 'ibja',
      revision: 0,
    },
  ],
};

const DEFAULT_FALLBACK_SILVER: SnapdataResponse = {
  schema_version: '1.0',
  generated_at: '2026-10-19T06:30:00Z',
  dataset: 'silver',
  scope: 'in',
  resolution: 'daily',
  calendar: 'IN-BULLION',
  unit: { quantity: 'kilogram', currency: 'INR' },
  coverage: { from: '2026-10-19', to: '2026-10-19' },
  sources: [{ id: 'ibja', name: 'India Bullion and Jewellers Association (IBJA)', url: 'https://ibja.co/' }],
  observations: [
    {
      date: '2026-10-19',
      instrument: 'XAG',
      instrument_id: 'XAG.INR.KG',
      value: 230000,
      close: 230000,
      prev_close: 230000,
      change_pct: 0,
      status: 'provisional',
      is_trading_day: true,
      filled_from: null,
      source: 'ibja',
      revision: 0,
    },
  ],
};

// Safe cache access helpers for instant initial state hydration
const getInitialGoldData = (): SnapdataResponse => {
  try {
    const raw = localStorage.getItem('ibja_gold_latest');
    if (raw) {
      const parsed = JSON.parse(raw);
      const data = parsed.data || parsed;
      if (data && Array.isArray(data.observations) && data.observations.length > 0) {
        return data;
      }
    }
  } catch (_) {}
  return DEFAULT_FALLBACK_GOLD;
};

const getInitialSilverData = (): SnapdataResponse => {
  try {
    const raw = localStorage.getItem('ibja_silver_latest');
    if (raw) {
      const parsed = JSON.parse(raw);
      const data = parsed.data || parsed;
      if (data && Array.isArray(data.observations) && data.observations.length > 0) {
        return data;
      }
    }
  } catch (_) {}
  return DEFAULT_FALLBACK_SILVER;
};

const getInitialGoldSeries = (): IbjaObservation[] => {
  try {
    const raw = localStorage.getItem('ibja_gold_series');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (_) {}
  return [];
};

const getInitialSilverSeries = (): IbjaObservation[] => {
  try {
    const raw = localStorage.getItem('ibja_silver_series');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (_) {}
  return [];
};

const getLastCachedTimestamp = (): string => {
  try {
    const raw = localStorage.getItem('ibja_gold_latest');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.time) {
        const d = new Date(parsed.time);
        if (!isNaN(d.getTime())) {
          return `${d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} at ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
        }
      }
    }
  } catch (_) {}
  return '';
};

export const PreciousMetalsCalculator: React.FC = () => {
  // Category State — Only Gold and Silver (as requested)
  const [metal, setMetal] = useState<'XAU' | 'XAG'>('XAU');

  // API Data State — Synchronously initialized with last cached rates or benchmark seed
  const [goldData, setGoldData] = useState<SnapdataResponse>(getInitialGoldData);
  const [silverData, setSilverData] = useState<SnapdataResponse>(getInitialSilverData);
  const [goldSeries, setGoldSeries] = useState<IbjaObservation[]>(getInitialGoldSeries);
  const [silverSeries, setSilverSeries] = useState<IbjaObservation[]>(getInitialSilverSeries);
  const [loading, setLoading] = useState<boolean>(false);
  const [isUsingCachedRate, setIsUsingCachedRate] = useState<boolean>(false);
  const [cachedNoticeTimestamp, setCachedNoticeTimestamp] = useState<string>(getLastCachedTimestamp);
  const [copied, setCopied] = useState<boolean>(false);

  // Real-time live clock and today's date (ticks every second)
  const [currentDateTime, setCurrentDateTime] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Active Tool Tab State
  const [activeTab, setActiveTab] = useState<'purchase' | 'purity_rates' | 'investment_roi' | 'gold_sip'>('purchase');

  // ═══ Indian Jewellery & Purchase Calculator State ═══
  const [calcPurity, setCalcPurity] = useState<string>('24k'); // Default 24K Pure Gold
  const [calcWeight, setCalcWeight] = useState<string>('8'); // Default 1 Sovereign / 8g
  const [calcUnit, setCalcUnit] = useState<string>('g');
  const [ratePerGram, setRatePerGram] = useState<string>(''); // Pre-populated & editable
  const [isRateEdited, setIsRateEdited] = useState<boolean>(false);

  // Indian Shop Specific Charges:
  const [makingChargePercent, setMakingChargePercent] = useState<string>('10'); // 10% Making charges
  const [wastagePercent, setWastagePercent] = useState<string>('0'); // Optional Wastage / VA %
  const [gstOnGoldPercent, setGstOnGoldPercent] = useState<string>('3'); // 3% GST on Gold/Silver value
  const [gstOnMakingPercent, setGstOnMakingPercent] = useState<string>('5'); // 5% GST on Making & Wastage
  const [includeHallmarkFee, setIncludeHallmarkFee] = useState<boolean>(true);
  const [hallmarkFeeAmount, setHallmarkFeeAmount] = useState<string>('45'); // ₹45 BIS Hallmark fee

  // Investment ROI Calculator State
  const [invBoughtWeight, setInvBoughtWeight] = useState<string>('8'); // 1 Sovereign
  const [invBoughtUnit, setInvBoughtUnit] = useState<string>('g');
  const [invBoughtRate, setInvBoughtRate] = useState<string>('7200');
  const [invBoughtPurity, setInvBoughtPurity] = useState<string>('24k');
  const [invHoldingYears, setInvHoldingYears] = useState<string>('3');

  // Digital Gold SIP State
  const [sipMonthlyAmount, setSipMonthlyAmount] = useState<string>('5000');
  const [sipYears, setSipYears] = useState<string>('5');
  const [sipExpectedGrowth, setSipExpectedGrowth] = useState<string>('11'); // 11% historical gold CAGR

  // ═══ Rate Changes History State ═══
  const [historySelectedUnit, setHistorySelectedUnit] = useState<'24k_1g' | '22k_1g' | '22k_8g' | '18k_1g' | 'silver_1g' | 'silver_10g' | 'silver_1kg'>('24k_1g');
  const [historyHoveredIdx, setHistoryHoveredIdx] = useState<number | null>(null);

  // Fetch Live Rates from snapdata.dev with seamless fallback to last saved rates
  const fetchAllRates = useCallback(async () => {
    setLoading(true);

    try {
      const results = await Promise.allSettled([
        fetch('https://snapdata.dev/api/v1/gold/in/latest.json'),
        fetch('https://snapdata.dev/api/v1/silver/in/latest.json'),
        fetch('https://snapdata.dev/api/v1/gold/in/series/30d.json'),
        fetch('https://snapdata.dev/api/v1/silver/in/series/30d.json'),
      ]);

      const [goldRes, silverRes, goldSeriesRes, silverSeriesRes] = results;

      let goldSuccess = false;
      let silverSuccess = false;

      // 1. Gold Latest
      if (goldRes.status === 'fulfilled' && goldRes.value.ok) {
        try {
          const goldJson: SnapdataResponse = await goldRes.value.json();
          if (goldJson && Array.isArray(goldJson.observations) && goldJson.observations.length > 0) {
            setGoldData(goldJson);
            localStorage.setItem(
              'ibja_gold_latest',
              JSON.stringify({ data: goldJson, time: new Date().toISOString() })
            );
            goldSuccess = true;
          }
        } catch (e) {
          console.warn('Failed parsing gold latest:', e);
        }
      }

      // 2. Silver Latest
      if (silverRes.status === 'fulfilled' && silverRes.value.ok) {
        try {
          const silverJson: SnapdataResponse = await silverRes.value.json();
          if (silverJson && Array.isArray(silverJson.observations) && silverJson.observations.length > 0) {
            setSilverData(silverJson);
            localStorage.setItem(
              'ibja_silver_latest',
              JSON.stringify({ data: silverJson, time: new Date().toISOString() })
            );
            silverSuccess = true;
          }
        } catch (e) {
          console.warn('Failed parsing silver latest:', e);
        }
      }

      // 3. Gold Series (30 Days)
      if (goldSeriesRes.status === 'fulfilled' && goldSeriesRes.value.ok) {
        try {
          const gSeriesJson: SnapdataResponse = await goldSeriesRes.value.json();
          if (gSeriesJson && Array.isArray(gSeriesJson.observations) && gSeriesJson.observations.length > 0) {
            setGoldSeries(gSeriesJson.observations);
            localStorage.setItem('ibja_gold_series', JSON.stringify(gSeriesJson.observations));
          }
        } catch (e) {
          console.warn('Failed parsing gold series:', e);
        }
      }

      // 4. Silver Series (30 Days)
      if (silverSeriesRes.status === 'fulfilled' && silverSeriesRes.value.ok) {
        try {
          const sSeriesJson: SnapdataResponse = await silverSeriesRes.value.json();
          if (sSeriesJson && Array.isArray(sSeriesJson.observations) && sSeriesJson.observations.length > 0) {
            setSilverSeries(sSeriesJson.observations);
            localStorage.setItem('ibja_silver_series', JSON.stringify(sSeriesJson.observations));
          }
        } catch (e) {
          console.warn('Failed parsing silver series:', e);
        }
      }

      const now = new Date();
      const formattedTimestamp = `${now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} at ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

      if (goldSuccess || silverSuccess) {
        // Successfully updated from API
        setIsUsingCachedRate(false);
        setCachedNoticeTimestamp(formattedTimestamp);
      } else {
        // Neither latest endpoint responded successfully -> smoothly maintain last cached data
        setIsUsingCachedRate(true);
        const lastSaved = getLastCachedTimestamp();
        if (lastSaved) {
          setCachedNoticeTimestamp(lastSaved);
        }
      }
    } catch (err: any) {
      console.warn('Snapdata IBJA fetch issue, maintaining last fetched rate fallback:', err);
      setIsUsingCachedRate(true);
      const lastSaved = getLastCachedTimestamp();
      if (lastSaved) {
        setCachedNoticeTimestamp(lastSaved);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchAllRates();
  }, [fetchAllRates]);

  // Extract Live Gold Rates from IBJA observations
  const liveRates = useMemo(() => {
    let rate24k = 0;
    let rate22k = 0;
    let rate18k = 0;
    let goldDate = '';
    let goldChangePct24k = 0;
    let goldChangePct22k = 0;
    let goldPrevClose22k = 0;
    let goldPrevClose24k = 0;

    if (goldData?.observations) {
      for (const obs of goldData.observations) {
        if (obs.value !== null) {
          if (obs.instrument_id === 'XAU.24K.INR.G' || obs.instrument === 'XAU.24K') {
            rate24k = obs.value;
            goldChangePct24k = obs.change_pct ?? 0;
            goldPrevClose24k = obs.prev_close ?? obs.value;
            goldDate = obs.date;
          } else if (obs.instrument_id === 'XAU.22K.INR.G' || obs.instrument === 'XAU.22K') {
            rate22k = obs.value;
            goldChangePct22k = obs.change_pct ?? 0;
            goldPrevClose22k = obs.prev_close ?? obs.value;
            goldDate = obs.date;
          } else if (obs.instrument_id === 'XAU.18K.INR.G' || obs.instrument === 'XAU.18K') {
            rate18k = obs.value;
          }
        }
      }
    }

    // Fallbacks if one is missing but another is present
    if (rate24k > 0 && rate22k === 0) rate22k = Math.round(rate24k * (22 / 24));
    if (rate22k > 0 && rate24k === 0) rate24k = Math.round(rate22k * (24 / 22));
    if (rate24k > 0 && rate18k === 0) rate18k = Math.round(rate24k * (18 / 24));

    // Guaranteed fallback rates if API returned 0 or observations empty
    if (rate24k <= 0) {
      rate24k = 14804;
      rate22k = 13570;
      rate18k = 11103;
    }

    // Silver rates
    let silverKg = 0;
    let silverDate = '';
    let silverChangePct = 0;
    let silverPrevCloseKg = 0;

    if (silverData?.observations) {
      for (const obs of silverData.observations) {
        if (obs.value !== null) {
          silverKg = obs.value;
          silverChangePct = obs.change_pct ?? 0;
          silverPrevCloseKg = obs.prev_close ?? obs.value;
          silverDate = obs.date;
        }
      }
    }

    // Guaranteed fallback for silver if 0
    if (silverKg <= 0) {
      silverKg = 230000;
    }

    const silver1g = silverKg > 0 ? silverKg / 1000 : 0;
    const silver8g = silver1g * 8;
    const silver10g = silver1g * 10;

    return {
      goldDate,
      rate24k,
      rate24k_8g: rate24k * 8,
      rate22k,
      rate22k_8g: rate22k * 8,
      rate18k,
      goldChangePct24k,
      goldChangePct22k,
      goldPrevClose22k,
      goldPrevClose24k,
      silverDate,
      silverKg,
      silver1g,
      silver8g,
      silver10g,
      silverChangePct,
      silverPrevCloseKg,
      silverPrevClose1g: silverPrevCloseKg / 1000,
    };
  }, [goldData, silverData]);

  // Helper to get gram rate for chosen purity
  const getPurityGramRate = useCallback((purity: string): number => {
    if (metal === 'XAU') {
      const p = purity.toLowerCase();
      if (p === '24k') return liveRates.rate24k;
      if (p === '22k') return liveRates.rate22k;
      if (p === '18k') return liveRates.rate18k;
      if (p === '20k') return Math.round(liveRates.rate24k * (20 / 24));
      if (p === '14k') return Math.round(liveRates.rate24k * (14 / 24));
      if (p === '9k') return Math.round(liveRates.rate24k * (9 / 24));
      return liveRates.rate24k;
    } else {
      if (purity === '999') return liveRates.silver1g;
      if (purity === '925') return liveRates.silver1g * 0.925;
      if (purity === '900') return liveRates.silver1g * 0.900;
      if (purity === '800') return liveRates.silver1g * 0.800;
      return liveRates.silver1g;
    }
  }, [metal, liveRates]);

  // Update default purity and reset chart unit when metal category changes
  useEffect(() => {
    if (metal === 'XAU') {
      setCalcPurity('24k');
      setHistorySelectedUnit('24k_1g');
    } else {
      setCalcPurity('999');
      setHistorySelectedUnit('silver_1g');
    }
    setIsRateEdited(false);
  }, [metal]);

  // Pre-populate editable rate field with live rate whenever live data or purity changes (unless user explicitly edited it)
  useEffect(() => {
    if (!isRateEdited) {
      const liveRate = getPurityGramRate(calcPurity);
      if (liveRate > 0) {
        setRatePerGram(liveRate.toFixed(2));
      }
    }
  }, [getPurityGramRate, calcPurity, isRateEdited]);

  // ═══ Indian Jewellery & Purchase Calculator Logic ═══
  const purchaseCalculations = useMemo(() => {
    const unitFactor = WEIGHT_UNITS.find(u => u.id === calcUnit)?.factor || 1;
    const weightInGrams = (parseFloat(calcWeight) || 0) * unitFactor;

    // Gram rate: editable field pre-populated with live rate
    const liveGramRate = getPurityGramRate(calcPurity);
    const effectiveGramRate = ratePerGram.trim() ? (parseFloat(ratePerGram) || 0) : liveGramRate;

    // 1. Metal Value = Weight × Rate
    const metalValue = weightInGrams * effectiveGramRate;

    // 2. Wastage (Value Addition / VA) in % of metal value
    const wastePct = parseFloat(wastagePercent) || 0;
    const wastageValue = (metalValue * wastePct) / 100;

    // 3. Making Charges in % of metal value
    const makingPct = parseFloat(makingChargePercent) || 0;
    const makingChargesValue = (metalValue * makingPct) / 100;

    // Total Making & Wastage charges
    const totalMakingAndWastage = wastageValue + makingChargesValue;

    // 4. GST on Metal (3% on Net Metal Value)
    const metalGstRate = parseFloat(gstOnGoldPercent) || 3;
    const gstOnMetal = (metalValue * metalGstRate) / 100;

    // 5. GST on Making Charges & Wastage (5%)
    const makingGstRate = parseFloat(gstOnMakingPercent) || 5;
    const gstOnMaking = (totalMakingAndWastage * makingGstRate) / 100;

    // 6. BIS Hallmarking fee
    const hallmarkFee = includeHallmarkFee ? (parseFloat(hallmarkFeeAmount) || 0) : 0;

    // 7. Total Payable Amount = Metal Value + Making Charges + Wastage + GST on Metal + GST on Making + Hallmark
    const totalPayable = metalValue + totalMakingAndWastage + gstOnMetal + gstOnMaking + hallmarkFee;
    const effectiveCostPerGram = weightInGrams > 0 ? totalPayable / weightInGrams : 0;

    return {
      weightInGrams,
      liveGramRate,
      effectiveGramRate,
      metalValue,
      wastageValue,
      makingChargesValue,
      totalMakingAndWastage,
      gstOnMetal,
      gstOnMaking,
      totalGst: gstOnMetal + gstOnMaking,
      hallmarkFee,
      totalPayable,
      effectiveCostPerGram,
    };
  }, [
    calcPurity, calcWeight, calcUnit, ratePerGram,
    makingChargePercent, wastagePercent, gstOnGoldPercent, gstOnMakingPercent,
    includeHallmarkFee, hallmarkFeeAmount, getPurityGramRate
  ]);

  // ═══ 30-Day Historical Series Data Processing ═══
  const historyRows = useMemo(() => {
    if (metal === 'XAU') {
      if (!goldSeries || goldSeries.length === 0) return [];

      // Filter only trading days with valid values
      const validObs = goldSeries.filter(o => o.value !== null && o.is_trading_day);

      // Group by date
      const dateMap = new Map<string, { r18k: number; r22k: number; r24k: number; pct22k: number }>();
      for (const obs of validObs) {
        const d = obs.date;
        if (!dateMap.has(d)) {
          dateMap.set(d, { r18k: 0, r22k: 0, r24k: 0, pct22k: 0 });
        }
        const entry = dateMap.get(d)!;
        if (obs.instrument === 'XAU.24K' || obs.instrument_id === 'XAU.24K.INR.G') {
          entry.r24k = obs.value || 0;
        } else if (obs.instrument === 'XAU.22K' || obs.instrument_id === 'XAU.22K.INR.G') {
          entry.r22k = obs.value || 0;
          entry.pct22k = obs.change_pct || 0;
        } else if (obs.instrument === 'XAU.18K' || obs.instrument_id === 'XAU.18K.INR.G') {
          entry.r18k = obs.value || 0;
        }
      }

      // Sort chronological (oldest to newest)
      const sortedDates = Array.from(dateMap.keys()).sort();
      const rows: DailyRateRow[] = [];

      for (let i = 0; i < sortedDates.length; i++) {
        const d = sortedDates[i];
        const current = dateMap.get(d)!;
        const prev = i > 0 ? dateMap.get(sortedDates[i - 1]) : null;

        const r24k = current.r24k || Math.round(current.r22k * (24 / 22));
        const r22k = current.r22k || Math.round(current.r24k * (22 / 24));
        const r18k = current.r18k || Math.round(r24k * (18 / 24));

        const prev22k = prev ? (prev.r22k || Math.round(prev.r24k * (22 / 24))) : r22k;
        const diff1g = r22k - prev22k;
        const diff8g = diff1g * 8;
        const pctChange = prev && prev22k > 0 ? (diff1g / prev22k) * 100 : (current.pct22k || 0);

        rows.push({
          date: d,
          rate24k: r24k,
          rate22k: r22k,
          rate18k: r18k,
          rate22k_8g: r22k * 8,
          rate24k_8g: r24k * 8,
          rateSilver1g: 0,
          rateSilver8g: 0,
          rateSilver10g: 0,
          rateSilverKg: 0,
          diff1g,
          diff8g,
          pctChange,
          prevRate1g: prev22k,
          isFirst: i === 0,
        });
      }

      return rows;
    } else {
      // Silver Series
      if (!silverSeries || silverSeries.length === 0) return [];

      const validObs = silverSeries.filter(o => o.value !== null && o.is_trading_day);
      const sorted = [...validObs].sort((a, b) => a.date.localeCompare(b.date));
      const rows: DailyRateRow[] = [];

      for (let i = 0; i < sorted.length; i++) {
        const item = sorted[i];
        const prev = i > 0 ? sorted[i - 1] : null;

        const kgPrice = item.value || 0;
        const prevKg = prev ? (prev.value || kgPrice) : kgPrice;

        const silver1g = kgPrice / 1000;
        const prev1g = prevKg / 1000;
        const diff1g = silver1g - prev1g;
        const diff8g = diff1g * 8;
        const pctChange = prev && prev1g > 0 ? (diff1g / prev1g) * 100 : (item.change_pct || 0);

        rows.push({
          date: item.date,
          rate24k: 0,
          rate22k: 0,
          rate18k: 0,
          rate22k_8g: 0,
          rate24k_8g: 0,
          rateSilver1g: silver1g,
          rateSilver8g: silver1g * 8,
          rateSilver10g: silver1g * 10,
          rateSilverKg: kgPrice,
          diff1g,
          diff8g,
          pctChange,
          prevRate1g: prev1g,
          isFirst: i === 0,
        });
      }

      return rows;
    }
  }, [metal, goldSeries, silverSeries]);

  // ═══ Investment ROI Logic ═══
  const investmentRoiCalculations = useMemo(() => {
    const unitFactor = WEIGHT_UNITS.find(u => u.id === invBoughtUnit)?.factor || 1;
    const weightInGrams = (parseFloat(invBoughtWeight) || 0) * unitFactor;
    const purchaseRatePerGram = parseFloat(invBoughtRate) || 0;
    const holdingYears = parseFloat(invHoldingYears) || 1;

    const initialInvestment = weightInGrams * purchaseRatePerGram;
    const currentRatePerGram = getPurityGramRate(invBoughtPurity);
    const currentValuation = weightInGrams * currentRatePerGram;

    const netProfit = currentValuation - initialInvestment;
    const totalReturnPercent = initialInvestment > 0 ? (netProfit / initialInvestment) * 100 : 0;

    let cagr = 0;
    if (initialInvestment > 0 && currentValuation > 0 && holdingYears > 0) {
      cagr = (Math.pow(currentValuation / initialInvestment, 1 / holdingYears) - 1) * 100;
    }

    return {
      weightInGrams,
      initialInvestment,
      currentRatePerGram,
      currentValuation,
      netProfit,
      totalReturnPercent,
      cagr,
    };
  }, [invBoughtWeight, invBoughtUnit, invBoughtRate, invBoughtPurity, invHoldingYears, getPurityGramRate]);

  // ═══ Gold SIP Logic ═══
  const goldSipCalculations = useMemo(() => {
    const monthlyAmt = parseFloat(sipMonthlyAmount) || 0;
    const years = parseFloat(sipYears) || 1;
    const annualGrowth = parseFloat(sipExpectedGrowth) || 0;

    const currentRate = metal === 'XAU' ? (liveRates.rate24k || 14800) : (liveRates.silver1g || 230);
    const totalMonths = years * 12;
    const totalInvested = monthlyAmt * totalMonths;

    const monthlyRate = annualGrowth / 100 / 12;
    let projectedFutureVal = 0;
    if (monthlyRate > 0) {
      projectedFutureVal = monthlyAmt * (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate));
    } else {
      projectedFutureVal = totalInvested;
    }

    const approxGramsAccumulated = currentRate > 0 ? (totalInvested / currentRate) : 0;
    const projectedGains = projectedFutureVal - totalInvested;

    return {
      totalInvested,
      projectedFutureVal,
      approxGramsAccumulated,
      projectedGains,
      currentRate,
    };
  }, [sipMonthlyAmount, sipYears, sipExpectedGrowth, metal, liveRates]);

  // Current Today's Date and Live Time for Display (Mandatory real-time today)
  const effectiveDate = useMemo(() => {
    return currentDateTime.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }, [currentDateTime]);

  const effectiveTime = useMemo(() => {
    return currentDateTime.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }, [currentDateTime]);

  // IBJA Benchmark Market Session Date (date of latest published market rate)
  const benchmarkDate = useMemo(() => {
    const rawDate = metal === 'XAU' ? liveRates.goldDate : liveRates.silverDate;
    if (rawDate) {
      try {
        const d = new Date(rawDate);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        }
      } catch (_) {}
      return rawDate;
    }
    return '';
  }, [metal, liveRates.goldDate, liveRates.silverDate]);

  // Copy rate summary
  const handleCopySummary = () => {
    let summary = '';
    if (metal === 'XAU') {
      summary = `Official IBJA Gold Rates (India / Tamil Nadu Benchmark)
24K Pure Gold (1 Gram): ₹${liveRates.rate24k.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
24K Pure Gold (8 Grams Sovereign): ₹${liveRates.rate24k_8g.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
22K Hallmark 916 (1 Gram): ₹${liveRates.rate22k.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
22K Hallmark 916 (8 Grams Pavan): ₹${liveRates.rate22k_8g.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
18K Gold (1 Gram): ₹${liveRates.rate18k.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
Date: ${effectiveDate} (${effectiveTime})${benchmarkDate ? ` [IBJA Market Session: ${benchmarkDate}]` : ''}
Source: India Bullion and Jewellers Association (IBJA)`;
    } else {
      summary = `Official IBJA Silver Rates (India / Tamil Nadu Benchmark)
Silver 1 Gram: ₹${liveRates.silver1g.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
Silver 8 Grams: ₹${liveRates.silver8g.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
Silver 10 Grams Bar: ₹${liveRates.silver10g.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
Silver 1 Kilogram (1000g): ₹${liveRates.silverKg.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
Date: ${effectiveDate} (${effectiveTime})${benchmarkDate ? ` [IBJA Market Session: ${benchmarkDate}]` : ''}
Source: India Bullion and Jewellers Association (IBJA)`;
    }

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="precious-metals-container">
      {/* Scoped CSS for Perfect Mobile Responsiveness */}
      <style>{`
        .precious-metals-container {
          max-width: 1060px;
          margin: 0 auto;
          padding: 16px 14px 48px;
          box-sizing: border-box;
          font-family: inherit;
          width: 100%;
          min-width: 0;
        }
        .pm-hero-header {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: 14px;
          padding: 10px 16px;
          color: #ffffff;
          box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.2);
          margin-bottom: 14px;
          box-sizing: border-box;
          width: 100%;
        }
        .pm-hero-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .pm-four-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 22px;
        }
        .pm-tabs-nav {
          display: flex;
          gap: 8px;
          background: #f1f5f9;
          padding: 6px;
          border-radius: 12px;
          margin-bottom: 20px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }
        .pm-tabs-nav::-webkit-scrollbar {
          display: none;
        }
        .pm-tab-btn {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }
        .pm-calculator-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
          gap: 20px;
          width: 100%;
          box-sizing: border-box;
        }
        .pm-card-white {
          background: #ffffff;
          border-radius: 16px;
          border: 1.5px solid #e2e8f0;
          padding: 22px 24px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
          box-sizing: border-box;
          width: 100%;
          min-width: 0;
        }
        .pm-card-dark {
          background: linear-gradient(180deg, #0b0f19 0%, #030712 100%);
          border-radius: 18px;
          border: 2px solid #eab308;
          padding: 24px 22px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
          color: #ffffff;
          box-sizing: border-box;
          width: 100%;
          min-width: 0;
        }
        .pm-form-row-2col {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 12px;
        }
        .pm-rule-cards-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 10px;
          margin-bottom: 16px;
        }
        .pm-total-payable-card {
          border: 2px solid #eab308;
          border-radius: 14px;
          padding: 14px 16px;
          background: rgba(234, 179, 8, 0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          box-sizing: border-box;
          width: 100%;
        }
        .pm-total-payable-pill {
          background: #facc15;
          color: #000000;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 22px;
          font-weight: 900;
          letter-spacing: -0.5px;
          white-space: nowrap;
          text-align: center;
          flex-shrink: 0;
        }

        @media (max-width: 860px) {
          .pm-four-cards-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
          }
          .pm-calculator-layout {
            grid-template-columns: minmax(0, 1fr);
          }
        }
        @media (max-width: 640px) {
          .precious-metals-container {
            padding: 8px 4px 36px;
          }
          .pm-card-white {
            padding: 16px 12px;
            border-radius: 12px;
          }
          .pm-card-dark {
            padding: 16px 12px;
            border-radius: 14px;
          }
          .pm-form-row-2col {
            grid-template-columns: minmax(0, 1fr);
            gap: 10px;
          }
          .pm-rule-cards-grid {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
            gap: 8px;
          }
          .pm-total-payable-card {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
            padding: 12px;
          }
          .pm-total-payable-pill {
            font-size: 22px;
            padding: 10px 14px;
            width: 100%;
            box-sizing: border-box;
          }
        }
        @media (max-width: 480px) {
          .pm-hero-header {
            padding: 8px 10px;
          }
          .pm-four-cards-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 10px;
          }
          .pm-tab-btn {
            font-size: 11.5px;
            padding: 8px 10px;
          }
          .pm-rule-cards-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 8px;
          }
        }
      `}</style>

      {/* ═══ SLIM HERO HEADER BANNER (Mandatory Date & Time) ═══ */}
      <div className="pm-hero-header">
        <div className="pm-hero-top">
          {/* Left: Compact Icon + Title + Mandatory Date & Time */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: metal === 'XAU'
                  ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                  : 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: metal === 'XAU'
                  ? '0 3px 8px rgba(245, 158, 11, 0.35)'
                  : '0 3px 8px rgba(148, 163, 184, 0.35)',
                flexShrink: 0,
              }}
            >
              {metal === 'XAU' ? <Gem size={17} color="#ffffff" /> : <Coins size={17} color="#ffffff" />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <h1 style={{ margin: 0, fontSize: 16, fontWeight: 900, letterSpacing: '-0.2px', color: '#ffffff', lineHeight: 1.2 }}>
                  {metal === 'XAU' ? 'Gold Rates & GST Calculator' : 'Silver Rates & GST Calculator'}
                </h1>
                <span
                  style={{
                    background: 'rgba(245, 158, 11, 0.18)',
                    color: '#fbbf24',
                    border: '1px solid rgba(245, 158, 11, 0.35)',
                    fontSize: 9,
                    fontWeight: 800,
                    padding: '1px 5px',
                    borderRadius: 4,
                    letterSpacing: '0.3px',
                    textTransform: 'uppercase',
                  }}
                >
                  IBJA
                </span>
                {isUsingCachedRate && (
                  <span
                    style={{
                      background: 'rgba(245, 158, 11, 0.12)',
                      color: '#fef3c7',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      fontSize: 9,
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: 4,
                      letterSpacing: '0.2px',
                    }}
                    title="Using last recorded rate saved on device"
                  >
                    Offline / Cached
                  </span>
                )}
              </div>

              {/* MANDATORY DATE & TIME ROW */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#cbd5e1', marginTop: 2, flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3.5, color: '#f8fafc', fontWeight: 700 }}>
                  <Calendar size={11} color="#f59e0b" />
                  {effectiveDate}
                </span>
                <span style={{ color: '#64748b', fontSize: 10 }}>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3.5, color: '#f8fafc', fontWeight: 700 }}>
                  <Clock size={11} color="#f59e0b" />
                  {effectiveTime}
                </span>
                <span style={{ color: '#64748b', fontSize: 10 }}>•</span>
                <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: 10.5 }}>₹ INR</span>
              </div>
            </div>
          </div>

          {/* Right: Actions (Share + Live Check) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={handleCopySummary}
              title="Copy Rate Summary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '5px 10px',
                fontSize: 11,
                fontWeight: 600,
                color: '#cbd5e1',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              {copied ? <Check size={11} color="#10b981" /> : <Copy size={11} />}
              {copied ? 'Copied' : 'Share'}
            </button>
            <button
              onClick={fetchAllRates}
              disabled={loading}
              title="Refresh Live Price from IBJA"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '5px 12px',
                fontSize: 11.5,
                fontWeight: 800,
                color: '#0f172a',
                background: '#f59e0b',
                border: 'none',
                borderRadius: 6,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 2px 6px rgba(245, 158, 11, 0.35)',
              }}
            >
              <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Checking...' : 'Live Check'}
            </button>
          </div>
        </div>
      </div>

      {/* ═══ CATEGORY SELECTOR STRIP (Gold & Silver Only) ═══ */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 14,
          border: '1.5px solid #e2e8f0',
          padding: '12px 16px',
          marginBottom: 18,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Select Metal Category:
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setMetal('XAU')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '8px 18px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 800,
                cursor: 'pointer',
                border: metal === 'XAU' ? '2px solid #d97706' : '1px solid #cbd5e1',
                background: metal === 'XAU' ? '#fef3c7' : '#f8fafc',
                color: metal === 'XAU' ? '#92400e' : '#475569',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#d97706' }} />
              Gold (XAU)
            </button>
            <button
              onClick={() => setMetal('XAG')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '8px 18px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 800,
                cursor: 'pointer',
                border: metal === 'XAG' ? '2px solid #475569' : '1px solid #cbd5e1',
                background: metal === 'XAG' ? '#f1f5f9' : '#f8fafc',
                color: metal === 'XAG' ? '#1e293b' : '#475569',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#94a3b8' }} />
              Silver (XAG)
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
          <Award size={14} color="#d97706" />
          <span>Rates benchmarked by IBJA for Indian retail jewellery{benchmarkDate ? ` (Market Session: ${benchmarkDate})` : ''}</span>
        </div>
      </div>

      {/* Fallback cached rate notice (zero disruption to user experience) */}
      {isUsingCachedRate && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 10,
            background: '#fffbeb',
            border: '1px solid #fde68a',
            color: '#92400e',
            fontSize: 12.5,
            marginBottom: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={16} color="#d97706" style={{ flexShrink: 0 }} />
            <span>
              <strong>Using Last Saved IBJA Rates{cachedNoticeTimestamp ? ` (${cachedNoticeTimestamp})` : ''}:</strong> Live rate server was temporarily unreachable. The calculator is smoothly using the last saved benchmark rates so you face no interruptions.
            </span>
          </div>
          <button
            onClick={fetchAllRates}
            disabled={loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 10px',
              borderRadius: 6,
              background: '#fef3c7',
              border: '1px solid #fcd34d',
              color: '#78350f',
              fontSize: 11,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Checking...' : 'Retry Live Sync'}
          </button>
        </div>
      )}

      {/* ═══ FOUR PRIMARY RATE CARDS (Requested by User) ═══ */}
      {metal === 'XAU' ? (
        /* GOLD RATE CARDS: 24K 1g, 24K 8g, 22K 1g, 22K 8g */
        <div className="pm-four-cards-grid">
          {/* Card 1: 24K — 1 Gram */}
          <div
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #fffbeb 100%)',
              borderRadius: 14,
              border: '2px solid #fde68a',
              padding: '16px',
              boxShadow: '0 2px 8px rgba(245, 158, 11, 0.08)',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                24K Gold — 1 Gram
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#fef3c7', color: '#b45309' }}>
                99.9% Pure
              </span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>
              ₹{liveRates.rate24k > 0 ? liveRates.rate24k.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, fontSize: 11, color: '#64748b' }}>
              <span>Standard Pure Bullion</span>
              {liveRates.goldChangePct24k !== 0 && (
                <span style={{ fontWeight: 700, color: liveRates.goldChangePct24k >= 0 ? '#15803d' : '#b91c1c' }}>
                  {liveRates.goldChangePct24k >= 0 ? '+' : ''}{liveRates.goldChangePct24k.toFixed(2)}%
                </span>
              )}
            </div>
          </div>

          {/* Card 2: 24K — 8 Grams (Sovereign) */}
          <div
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #fffbeb 100%)',
              borderRadius: 14,
              border: '2px solid #fde68a',
              padding: '16px',
              boxShadow: '0 2px 8px rgba(245, 158, 11, 0.08)',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                24K Gold — 8 Grams
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#fef3c7', color: '#b45309' }}>
                1 Sovereign
              </span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>
              ₹{liveRates.rate24k_8g > 0 ? liveRates.rate24k_8g.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, fontWeight: 500 }}>
              8g Pure Sovereign / Coin
            </div>
          </div>

          {/* Card 3: 22K — 1 Gram (Hallmark 916) */}
          <div
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
              borderRadius: 14,
              border: '2px solid #bfdbfe',
              padding: '16px',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.08)',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                22K Gold — 1 Gram
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#dbeafe', color: '#1d4ed8' }}>
                916 Hallmark
              </span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>
              ₹{liveRates.rate22k > 0 ? liveRates.rate22k.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, fontSize: 11, color: '#64748b' }}>
              <span>Jewellery Board Rate</span>
              {liveRates.goldChangePct22k !== 0 && (
                <span style={{ fontWeight: 700, color: liveRates.goldChangePct22k >= 0 ? '#15803d' : '#b91c1c' }}>
                  {liveRates.goldChangePct22k >= 0 ? '+' : ''}{liveRates.goldChangePct22k.toFixed(2)}%
                </span>
              )}
            </div>
          </div>

          {/* Card 4: 22K — 8 Grams (1 Sovereign / Pavan) */}
          <div
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
              borderRadius: 14,
              border: '2px solid #bfdbfe',
              padding: '16px',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.08)',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                22K Gold — 8 Grams
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#dbeafe', color: '#1d4ed8' }}>
                1 Pavan (Jewellery)
              </span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>
              ₹{liveRates.rate22k_8g > 0 ? liveRates.rate22k_8g.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, fontWeight: 500 }}>
              Tamil Nadu Wedding Standard
            </div>
          </div>
        </div>
      ) : (
        /* SILVER RATE CARDS: 1g, 8g, 10g Bar, 1kg */
        <div className="pm-four-cards-grid">
          {/* Card 1: Silver 1 Gram */}
          <div
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: 14,
              border: '2px solid #cbd5e1',
              padding: '16px',
              boxShadow: '0 2px 8px rgba(100, 116, 139, 0.08)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                Silver — 1 Gram
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#f1f5f9', color: '#475569' }}>
                Fine Silver
              </span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>
              ₹{liveRates.silver1g > 0 ? liveRates.silver1g.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, fontWeight: 500 }}>
              Per Gram Retail Silver
            </div>
          </div>

          {/* Card 2: Silver 8 Grams */}
          <div
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: 14,
              border: '2px solid #cbd5e1',
              padding: '16px',
              boxShadow: '0 2px 8px rgba(100, 116, 139, 0.08)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                Silver — 8 Grams
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#f1f5f9', color: '#475569' }}>
                Coin / Article
              </span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>
              ₹{liveRates.silver8g > 0 ? liveRates.silver8g.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, fontWeight: 500 }}>
              Pooja Article / Coin
            </div>
          </div>

          {/* Card 3: Silver 10 Grams Bar */}
          <div
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: 14,
              border: '2px solid #cbd5e1',
              padding: '16px',
              boxShadow: '0 2px 8px rgba(100, 116, 139, 0.08)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                Silver — 10 Grams Bar
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#f1f5f9', color: '#475569' }}>
                10g Bar
              </span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>
              ₹{liveRates.silver10g > 0 ? liveRates.silver10g.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, fontWeight: 500 }}>
              Investment Bar Standard
            </div>
          </div>

          {/* Card 4: Silver 1 Kilogram (1000g) */}
          <div
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
              borderRadius: 14,
              border: '2px solid #94a3b8',
              padding: '16px',
              boxShadow: '0 2px 8px rgba(100, 116, 139, 0.12)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                Silver — 1 Kilogram
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#e2e8f0', color: '#0f172a' }}>
                1000g Bullion
              </span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>
              ₹{liveRates.silverKg > 0 ? liveRates.silverKg.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, fontWeight: 500 }}>
              Official IBJA 1 Kg Domestic Bar
            </div>
          </div>
        </div>
      )}

      {/* ═══ TABS NAVIGATION ═══ */}
      <div className="pm-tabs-nav">
        {[
          { id: 'purchase', label: 'Jewellery GST Breakup', icon: ShoppingBag },
          { id: 'purity_rates', label: 'Purity & Karat Rates Matrix', icon: Layers },
          { id: 'investment_roi', label: 'Investment ROI Calculator', icon: TrendingUp },
          { id: 'gold_sip', label: 'Gold SIP Accumulator', icon: Coins },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="pm-tab-btn"
              style={{
                background: isActive ? '#ffffff' : 'transparent',
                color: isActive ? '#0f172a' : '#64748b',
                boxShadow: isActive ? '0 2px 6px rgba(0, 0, 0, 0.08)' : 'none',
              }}
            >
              <Icon size={15} color={isActive ? '#f59e0b' : 'currentColor'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* TAB 1: INDIAN JEWELLERY & PURCHASE CALCULATOR (Exact Indian Shop GST Breakup) */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {activeTab === 'purchase' && (
        <div className="pm-calculator-layout">
          {/* Left Panel: Inputs */}
          <div className="pm-card-white">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b45309', flexShrink: 0, marginTop: 2 }}>
                <Calculator size={18} />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#1e293b', lineHeight: 1.3, wordBreak: 'break-word' }}>
                  Indian Jewellery Quotation / Bill Estimator
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: 11.5, color: '#64748b', lineHeight: 1.4 }}>
                  Standard Indian retail breakup: Metal Value + Wastage (VA%) + Making Charges + 3% GST on Metal + 5% GST on Making
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Row 1: Purity Selection & Weight */}
              <div className="pm-form-row-2col">
                <div style={{ minWidth: 0 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 5, textTransform: 'uppercase' }}>
                    Purity / Karat
                  </label>
                  <select
                    value={calcPurity}
                    onChange={e => {
                      setCalcPurity(e.target.value);
                      setIsRateEdited(false);
                    }}
                    style={{
                      width: '100%',
                      maxWidth: '100%',
                      boxSizing: 'border-box',
                      padding: '9px 12px',
                      borderRadius: 8,
                      border: '1.5px solid #cbd5e1',
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#1e293b',
                      background: '#ffffff',
                      outline: 'none',
                    }}
                  >
                    {metal === 'XAU' ? (
                      <>
                        <option value="24k">24K Gold (999 Pure Bullion) — Default</option>
                        <option value="22k">22K Gold (916 Hallmark)</option>
                        <option value="18k">18K Gold (750 Hallmark)</option>
                        <option value="14k">14K Gold (585 Hallmark)</option>
                      </>
                    ) : (
                      <>
                        <option value="999">999 Fine Silver (99.9%) — Default</option>
                        <option value="925">925 Sterling Silver (92.5%)</option>
                        <option value="900">900 Coin Silver (90.0%)</option>
                        <option value="800">800 Silver (80.0%)</option>
                      </>
                    )}
                  </select>
                </div>

                <div style={{ minWidth: 0 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 5, textTransform: 'uppercase' }}>
                    Weight
                  </label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input
                      type="number"
                      min="0.1"
                      step="any"
                      value={calcWeight}
                      onChange={e => setCalcWeight(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        borderRadius: 8,
                        border: '1.5px solid #cbd5e1',
                        fontSize: 14,
                        fontWeight: 700,
                        color: '#0f172a',
                        outline: 'none',
                        minWidth: 0,
                      }}
                    />
                    <select
                      value={calcUnit}
                      onChange={e => setCalcUnit(e.target.value)}
                      style={{
                        padding: '9px 8px',
                        borderRadius: 8,
                        border: '1.5px solid #cbd5e1',
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#475569',
                        background: '#f8fafc',
                        outline: 'none',
                      }}
                    >
                      {WEIGHT_UNITS.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Quick Weight Pills */}
                  <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                    {[
                      { val: '1', label: '1g' },
                      { val: '2', label: '2g' },
                      { val: '4', label: '4g' },
                      { val: '8', label: '8g (1 Pavan)' },
                      { val: '10', label: '10g' },
                      { val: '16', label: '16g (2 Pavans)' },
                      { val: '24', label: '24g' },
                      { val: '50', label: '50g' },
                    ].map(w => {
                      const isSel = calcWeight === w.val && calcUnit === 'g';
                      return (
                        <button
                          key={w.val}
                          type="button"
                          onClick={() => {
                            setCalcWeight(w.val);
                            setCalcUnit('g');
                          }}
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: 4,
                            background: isSel ? '#fef3c7' : '#f1f5f9',
                            color: isSel ? '#b45309' : '#475569',
                            border: isSel ? '1px solid #d97706' : '1px solid #e2e8f0',
                            cursor: 'pointer',
                          }}
                        >
                          {w.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Row 2: Live Rate per Gram (Populated from API & Fully Editable) */}
              <div
                style={{
                  background: isRateEdited ? '#fffbeb' : '#f8fafc',
                  border: isRateEdited ? '1.5px solid #f59e0b' : '1.5px solid #e2e8f0',
                  borderRadius: 10,
                  padding: '12px 14px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5, flexWrap: 'wrap', gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>
                    {metal === 'XAU' ? 'Gold Rate per Gram (₹)' : 'Silver Rate per Gram (₹)'}
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 9.5, fontWeight: 700, color: isRateEdited ? '#b45309' : '#15803d', background: isRateEdited ? '#fef3c7' : '#dcfce7', padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap' }}>
                      {isRateEdited ? 'Custom Rate' : `Live IBJA ${calcPurity.toUpperCase()}`}
                    </span>
                    {isRateEdited && (
                      <button
                        onClick={() => {
                          const live = getPurityGramRate(calcPurity);
                          setRatePerGram(live.toFixed(2));
                          setIsRateEdited(false);
                        }}
                        title="Reset to Live IBJA Rate"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 3,
                          padding: '2px 6px',
                          fontSize: 10,
                          fontWeight: 700,
                          color: '#475569',
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: 4,
                          cursor: 'pointer',
                        }}
                      >
                        <RotateCcw size={10} />
                        Reset Live
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: '#64748b', fontSize: 15 }}>
                    ₹
                  </span>
                  <input
                    type="number"
                    step="any"
                    value={ratePerGram}
                    onChange={e => {
                      setRatePerGram(e.target.value);
                      setIsRateEdited(true);
                    }}
                    placeholder={purchaseCalculations.liveGramRate.toFixed(2)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '10px 12px 10px 28px',
                      borderRadius: 8,
                      border: '1.5px solid #cbd5e1',
                      fontSize: 15,
                      fontWeight: 800,
                      color: '#0f172a',
                      outline: 'none',
                      background: '#ffffff',
                    }}
                  />
                </div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                  Net metal value: <strong>₹{Math.round(purchaseCalculations.metalValue).toLocaleString('en-IN')}</strong> ({purchaseCalculations.weightInGrams.toFixed(2)} grams)
                </div>
              </div>

              {/* Row 3: Making Charges (%) and Wastage (%) */}
              <div className="pm-form-row-2col">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                      Making Charges (%)
                    </label>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#b45309' }}>
                      ₹{Math.round(purchaseCalculations.makingChargesValue).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={makingChargePercent}
                    onChange={e => setMakingChargePercent(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '9px 12px',
                      borderRadius: 8,
                      border: '1.5px solid #cbd5e1',
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#0f172a',
                      outline: 'none',
                    }}
                  />
                  {/* Quick pills */}
                  <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                    {['6', '8', '10', '12', '14'].map(pct => (
                      <button
                        key={pct}
                        onClick={() => setMakingChargePercent(pct)}
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '1px 5px',
                          borderRadius: 4,
                          background: makingChargePercent === pct ? '#fef3c7' : '#f1f5f9',
                          color: makingChargePercent === pct ? '#b45309' : '#64748b',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                      Wastage / VA (%)
                    </label>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#b45309' }}>
                      ₹{Math.round(purchaseCalculations.wastageValue).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={wastagePercent}
                    onChange={e => setWastagePercent(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '9px 12px',
                      borderRadius: 8,
                      border: '1.5px solid #cbd5e1',
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#0f172a',
                      outline: 'none',
                    }}
                  />
                  {/* Quick pills */}
                  <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                    {['0', '2', '5', '8', '10'].map(pct => (
                      <button
                        key={pct}
                        onClick={() => setWastagePercent(pct)}
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '1px 5px',
                          borderRadius: 4,
                          background: wastagePercent === pct ? '#fef3c7' : '#f1f5f9',
                          color: wastagePercent === pct ? '#b45309' : '#64748b',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 4: Indian GST Rates (3% Metal, 5% Making) */}
              <div style={{ background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0', padding: '12px 14px' }}>
                <span style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#475569', marginBottom: 8, textTransform: 'uppercase' }}>
                  GST Tax Slabs (Standard Indian Jewellery Rules)
                </span>
                <div className="pm-form-row-2col">
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: '#64748b', marginBottom: 3 }}>
                      GST on Gold/Silver Value
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input
                        type="number"
                        step="0.5"
                        value={gstOnGoldPercent}
                        onChange={e => setGstOnGoldPercent(e.target.value)}
                        style={{
                          width: 60,
                          padding: '6px 8px',
                          borderRadius: 6,
                          border: '1px solid #cbd5e1',
                          fontSize: 12,
                          fontWeight: 700,
                          outline: 'none',
                        }}
                      />
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#334155' }}>% (Std: 3%)</span>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: '#64748b', marginBottom: 3 }}>
                      GST on Making Charges
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input
                        type="number"
                        step="0.5"
                        value={gstOnMakingPercent}
                        onChange={e => setGstOnMakingPercent(e.target.value)}
                        style={{
                          width: 60,
                          padding: '6px 8px',
                          borderRadius: 6,
                          border: '1px solid #cbd5e1',
                          fontSize: 12,
                          fontWeight: 700,
                          outline: 'none',
                        }}
                      />
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#334155' }}>% (Std: 5%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 5: BIS Hallmark Toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Award size={16} color="#1d4ed8" />
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#1e40af' }}>
                      BIS Hallmarking Charges (₹45)
                    </span>
                    <span style={{ display: 'block', fontSize: 10, color: '#60a5fa' }}>
                      Government certified hallmark laser stamping fee
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={includeHallmarkFee}
                  onChange={e => setIncludeHallmarkFee(e.target.checked)}
                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#2563eb' }}
                />
              </div>
            </div>
          </div>

          {/* Right Panel: Official Dark Gold GST on Jewellery Bill Card (Previous Design) */}
          <div className="pm-card-dark">
            <div>
              {/* Card Title */}
              <div style={{ textAlign: 'center', marginBottom: 14 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, letterSpacing: '0.4px', color: '#ffffff', wordBreak: 'break-word' }}>
                  GST ON <span style={{ color: '#facc15' }}>{metal === 'XAU' ? 'GOLD JEWELLERY' : 'SILVER JEWELLERY'}</span>
                </h3>
              </div>

              {/* Two Rule Cards Side-by-Side */}
              <div className="pm-rule-cards-grid">
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 10,
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    minWidth: 0,
                  }}
                >
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#facc15', flexShrink: 0 }}>
                    <Coins size={14} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 900, color: '#facc15', whiteSpace: 'nowrap' }}>{gstOnGoldPercent}% GST</div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', lineHeight: 1.2 }}>ON {metal === 'XAU' ? 'GOLD' : 'SILVER'} VALUE</div>
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 10,
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    minWidth: 0,
                  }}
                >
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#facc15', flexShrink: 0 }}>
                    <Gem size={14} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 900, color: '#facc15', whiteSpace: 'nowrap' }}>{gstOnMakingPercent}% GST</div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', lineHeight: 1.2 }}>ON MAKING CHARGES</div>
                  </div>
                </div>
              </div>

              {/* Central Golden Pill: CALCULATION BREAKUP */}
              <div style={{ textAlign: 'center', margin: '12px 0 14px' }}>
                <span
                  style={{
                    background: '#facc15',
                    color: '#000000',
                    fontSize: 10.5,
                    fontWeight: 900,
                    padding: '3px 14px',
                    borderRadius: 4,
                    letterSpacing: '0.8px',
                    textTransform: 'uppercase',
                    display: 'inline-block',
                  }}
                >
                  CALCULATION BREAKUP
                </span>
              </div>

              {/* Line Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11, fontSize: 13 }}>
                {/* 1. Metal Value */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', flexShrink: 0 }}>
                      <Coins size={13} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 800, color: '#ffffff', fontSize: 12.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {metal === 'XAU' ? 'GOLD VALUE' : 'SILVER VALUE'}
                      </div>
                      <div style={{ fontSize: 10.5, color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {purchaseCalculations.weightInGrams.toFixed(2)}g × ₹{purchaseCalculations.effectiveGramRate.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: 15, color: '#ffffff', flexShrink: 0, textAlign: 'right' }}>
                    ₹{Math.round(purchaseCalculations.metalValue).toLocaleString('en-IN')}
                  </div>
                </div>

                {/* 2. Making Charges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', flexShrink: 0 }}>
                      <Percent size={13} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 800, color: '#ffffff', fontSize: 12.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        MAKING CHARGES ({makingChargePercent}%)
                      </div>
                      <div style={{ fontSize: 10.5, color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        of ₹{Math.round(purchaseCalculations.metalValue).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: 15, color: '#ffffff', flexShrink: 0, textAlign: 'right' }}>
                    ₹{Math.round(purchaseCalculations.makingChargesValue).toLocaleString('en-IN')}
                  </div>
                </div>

                {/* 3. Wastage if any */}
                {purchaseCalculations.wastageValue > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', flexShrink: 0 }}>
                        <Scale size={13} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 800, color: '#ffffff', fontSize: 12.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          WASTAGE / VA ({wastagePercent}%)
                        </div>
                        <div style={{ fontSize: 10.5, color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          of ₹{Math.round(purchaseCalculations.metalValue).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 900, fontSize: 15, color: '#ffffff', flexShrink: 0, textAlign: 'right' }}>
                      ₹{Math.round(purchaseCalculations.wastageValue).toLocaleString('en-IN')}
                    </div>
                  </div>
                )}

                {/* 4. GST on Metal */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 5, background: 'rgba(234, 179, 8, 0.25)', color: '#facc15', fontSize: 10, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {gstOnGoldPercent}%
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 800, color: '#ffffff', fontSize: 12.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        GST ON {metal === 'XAU' ? 'GOLD' : 'SILVER'} ({gstOnGoldPercent}%)
                      </div>
                      <div style={{ fontSize: 10.5, color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        of ₹{Math.round(purchaseCalculations.metalValue).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: 15, color: '#facc15', flexShrink: 0, textAlign: 'right' }}>
                    ₹{Math.round(purchaseCalculations.gstOnMetal).toLocaleString('en-IN')}
                  </div>
                </div>

                {/* 5. GST on Making */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 5, background: 'rgba(234, 179, 8, 0.25)', color: '#facc15', fontSize: 10, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {gstOnMakingPercent}%
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 800, color: '#ffffff', fontSize: 12.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        GST ON MAKING ({gstOnMakingPercent}%)
                      </div>
                      <div style={{ fontSize: 10.5, color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        of ₹{Math.round(purchaseCalculations.totalMakingAndWastage).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: 15, color: '#facc15', flexShrink: 0, textAlign: 'right' }}>
                    ₹{Math.round(purchaseCalculations.gstOnMaking).toLocaleString('en-IN')}
                  </div>
                </div>

                {/* 6. BIS Hallmark Fee */}
                {includeHallmarkFee && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(59, 130, 246, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', flexShrink: 0 }}>
                        <Award size={13} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 800, color: '#ffffff', fontSize: 12.5 }}>
                          BIS Hallmark Fee
                        </div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 900, fontSize: 15, color: '#ffffff', flexShrink: 0, textAlign: 'right' }}>
                      ₹{purchaseCalculations.hallmarkFee.toFixed(0)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Total Box at Bottom */}
            <div style={{ marginTop: 16 }}>
              <div className="pm-total-payable-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', flexShrink: 0 }}>
                    <ShoppingBag size={18} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 900, color: '#ffffff', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
                      TOTAL PAYABLE AMOUNT
                    </div>
                    <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2, wordBreak: 'break-word', lineHeight: 1.3 }}>
                      ₹{Math.round(purchaseCalculations.metalValue).toLocaleString('en-IN')} + ₹{Math.round(purchaseCalculations.totalMakingAndWastage).toLocaleString('en-IN')} + ₹{Math.round(purchaseCalculations.totalGst).toLocaleString('en-IN')}
                      {purchaseCalculations.hallmarkFee > 0 ? ` + ₹${purchaseCalculations.hallmarkFee}` : ''}
                    </div>
                  </div>
                </div>

                <div className="pm-total-payable-pill">
                  ₹{Math.round(purchaseCalculations.totalPayable).toLocaleString('en-IN')}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, fontSize: 11, color: '#94a3b8', padding: '0 4px', flexWrap: 'wrap', gap: 6 }}>
                <span>Effective Cost: <strong style={{ color: '#38bdf8' }}>₹{purchaseCalculations.effectiveCostPerGram.toFixed(2)}/g</strong></span>
                <span>Purity: <strong style={{ color: '#facc15' }}>{calcPurity.toUpperCase()}</strong></span>
              </div>

              <button
                onClick={() => {
                  const billText = `--- GST ON ${metal === 'XAU' ? 'GOLD' : 'SILVER'} JEWELLERY BREAKUP ---
Item: ${purchaseCalculations.weightInGrams.toFixed(2)}g (${calcPurity.toUpperCase()} ${metal === 'XAU' ? 'Gold' : 'Silver'})
Rate: ₹{purchaseCalculations.effectiveGramRate.toFixed(2)}/g
Net Metal Value: ₹${purchaseCalculations.metalValue.toFixed(2)}
Making Charges (${makingChargePercent}%): ₹${purchaseCalculations.makingChargesValue.toFixed(2)}
Wastage / VA (${wastagePercent}%): ₹${purchaseCalculations.wastageValue.toFixed(2)}
GST on Metal (${gstOnGoldPercent}%): ₹${purchaseCalculations.gstOnMetal.toFixed(2)}
GST on Making (${gstOnMakingPercent}%): ₹${purchaseCalculations.gstOnMaking.toFixed(2)}
BIS Hallmarking: ₹${purchaseCalculations.hallmarkFee.toFixed(2)}
--------------------------------------
TOTAL PAYABLE: ₹${purchaseCalculations.totalPayable.toFixed(2)}
Effective Cost: ₹${purchaseCalculations.effectiveCostPerGram.toFixed(2)}/g
Benchmark: Official IBJA (Zezha Tools)`;
                  navigator.clipboard.writeText(billText);
                  alert('Quotation copied to clipboard!');
                }}
                style={{
                  width: '100%',
                  marginTop: 12,
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#facc15',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <Copy size={13} />
                Copy Full Quotation Breakup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* TAB 2: PURITY & KARAT RATES MATRIX */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {activeTab === 'purity_rates' && (
        <div className="pm-card-white">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#1e293b' }}>
                {metal === 'XAU' ? 'Gold Purity & Karat Rates Matrix' : 'Silver Purity Rates Matrix'}
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>
                Official IBJA benchmark domestic rates across all standard weights and hallmarks
              </p>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#b45309', background: '#fef3c7', padding: '3px 8px', borderRadius: 6 }}>
              All Prices in INR (₹)
            </span>
          </div>

          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', borderRadius: 10, border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13, minWidth: 640 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: 11, textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 14px' }}>Purity / Hallmark</th>
                  <th style={{ padding: '12px 14px' }}>Fineness %</th>
                  <th style={{ padding: '12px 14px' }}>1 Gram (₹)</th>
                  <th style={{ padding: '12px 14px' }}>8 Grams (Pavan) (₹)</th>
                  <th style={{ padding: '12px 14px' }}>10 Grams Bar (₹)</th>
                  <th style={{ padding: '12px 14px' }}>1 Tola (11.66g) (₹)</th>
                  <th style={{ padding: '12px 14px' }}>100 Grams (₹)</th>
                </tr>
              </thead>
              <tbody>
                {metal === 'XAU' ? (
                  [
                    { name: '24K Gold', tag: 'Pure Bullion (999)', pct: '99.9%', gram: liveRates.rate24k, highlight: true },
                    { name: '22K Gold', tag: 'Jewellery (916 Hallmark)', pct: '91.6%', gram: liveRates.rate22k, highlight: true },
                    { name: '20K Gold', tag: 'Traditional Hallmark', pct: '83.3%', gram: Math.round(liveRates.rate24k * (20 / 24)) },
                    { name: '18K Gold', tag: 'Diamond Jewellery (750)', pct: '75.0%', gram: liveRates.rate18k },
                    { name: '14K Gold', tag: 'Export Grade (585)', pct: '58.3%', gram: Math.round(liveRates.rate24k * (14 / 24)) },
                    { name: '9K Gold', tag: 'Affordable Grade (375)', pct: '37.5%', gram: Math.round(liveRates.rate24k * (9 / 24)) },
                  ].map(row => (
                    <tr
                      key={row.name}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        background: row.highlight ? '#fffbeb' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 800, color: '#0f172a' }}>{row.name}</div>
                        <div style={{ fontSize: 10, color: '#64748b' }}>{row.tag}</div>
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: '#475569' }}>{row.pct}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: '#0f172a' }}>
                        ₹{row.gram.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#b45309' }}>
                        ₹{(row.gram * 8).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: '#334155' }}>
                        ₹{(row.gram * 10).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: '#334155' }}>
                        ₹{(row.gram * 11.6638).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>
                        ₹{(row.gram * 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                ) : (
                  [
                    { name: '999 Fine Silver', tag: 'Pure Bullion Bar', pct: '99.9%', gram: liveRates.silver1g, highlight: true },
                    { name: '925 Sterling Silver', tag: 'Jewellery & Flatware', pct: '92.5%', gram: liveRates.silver1g * 0.925 },
                    { name: '900 Coin Silver', tag: 'Vintage Coins & Articles', pct: '90.0%', gram: liveRates.silver1g * 0.900 },
                    { name: '800 Silver', tag: 'Pooja Utensils', pct: '80.0%', gram: liveRates.silver1g * 0.800 },
                  ].map(row => (
                    <tr
                      key={row.name}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        background: row.highlight ? '#f8fafc' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 800, color: '#0f172a' }}>{row.name}</div>
                        <div style={{ fontSize: 10, color: '#64748b' }}>{row.tag}</div>
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: '#475569' }}>{row.pct}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: '#0f172a' }}>
                        ₹{row.gram.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>
                        ₹{(row.gram * 8).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: '#334155' }}>
                        ₹{(row.gram * 10).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: '#334155' }}>
                        ₹{(row.gram * 11.6638).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>
                        ₹{(row.gram * 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* TAB 3: INVESTMENT ROI CALCULATOR */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {activeTab === 'investment_roi' && (
        <div className="pm-calculator-layout">
          <div className="pm-card-white">
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 800, color: '#1e293b' }}>
              Historical Purchase vs. Live Valuation
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 5 }}>
                  Bought Weight
                </label>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    type="number"
                    value={invBoughtWeight}
                    onChange={e => setInvBoughtWeight(e.target.value)}
                    style={{ flex: 1, padding: '9px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: 14, fontWeight: 700 }}
                  />
                  <select
                    value={invBoughtUnit}
                    onChange={e => setInvBoughtUnit(e.target.value)}
                    style={{ padding: '9px 8px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: 12, background: '#f8fafc' }}
                  >
                    {WEIGHT_UNITS.map(u => (
                      <option key={u.id} value={u.id}>{u.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 5 }}>
                  Purchase Rate per Gram (₹)
                </label>
                <input
                  type="number"
                  value={invBoughtRate}
                  onChange={e => setInvBoughtRate(e.target.value)}
                  placeholder="e.g. 5000"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: 14, fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 5 }}>
                  Holding Period (Years)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={invHoldingYears}
                  onChange={e => setInvHoldingYears(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: 14, fontWeight: 700 }}
                />
              </div>
            </div>
          </div>

          <div
            className="pm-card-white"
            style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 800, color: '#1e293b' }}>
                Return Performance
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Total Invested Capital:</span>
                  <strong style={{ color: '#0f172a' }}>₹{investmentRoiCalculations.initialInvestment.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Today's IBJA Valuation:</span>
                  <strong style={{ color: '#0f172a' }}>₹{Math.round(investmentRoiCalculations.currentValuation).toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Absolute Net Profit:</span>
                  <strong style={{ color: investmentRoiCalculations.netProfit >= 0 ? '#15803d' : '#b91c1c' }}>
                    {investmentRoiCalculations.netProfit >= 0 ? '+ ' : ''}₹{Math.round(investmentRoiCalculations.netProfit).toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '12px' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block' }}>
                  Total Return
                </span>
                <div style={{ fontSize: 20, fontWeight: 900, color: investmentRoiCalculations.totalReturnPercent >= 0 ? '#15803d' : '#b91c1c', marginTop: 2 }}>
                  {investmentRoiCalculations.totalReturnPercent >= 0 ? '+' : ''}{investmentRoiCalculations.totalReturnPercent.toFixed(1)}%
                </div>
              </div>
              <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '12px' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block' }}>
                  Annualized CAGR
                </span>
                <div style={{ fontSize: 20, fontWeight: 900, color: investmentRoiCalculations.cagr >= 0 ? '#15803d' : '#b91c1c', marginTop: 2 }}>
                  {investmentRoiCalculations.cagr >= 0 ? '+' : ''}{investmentRoiCalculations.cagr.toFixed(1)}% / yr
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* TAB 4: GOLD SIP ACCUMULATOR */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {activeTab === 'gold_sip' && (
        <div className="pm-calculator-layout">
          <div className="pm-card-white">
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 800, color: '#1e293b' }}>
              Digital Gold & Bullion SIP
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 5 }}>
                  Monthly Savings (₹)
                </label>
                <input
                  type="number"
                  step="500"
                  value={sipMonthlyAmount}
                  onChange={e => setSipMonthlyAmount(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: 14, fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 5 }}>
                  Investment Duration (Years)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={sipYears}
                  onChange={e => setSipYears(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: 14, fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 5 }}>
                  Expected Annual Gold Growth Rate (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={sipExpectedGrowth}
                  onChange={e => setSipExpectedGrowth(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: 14, fontWeight: 700 }}
                />
                <span style={{ fontSize: 11, color: '#64748b', marginTop: 3, display: 'block' }}>
                  Historical 20-year gold CAGR in India is ~10-12% p.a.
                </span>
              </div>
            </div>
          </div>

          <div
            className="pm-card-white"
            style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 800, color: '#1e293b' }}>
                Accumulated Wealth
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Total Investment:</span>
                  <strong style={{ color: '#0f172a' }}>₹{goldSipCalculations.totalInvested.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Gold Accumulated:</span>
                  <strong style={{ color: '#b45309' }}>
                    {goldSipCalculations.approxGramsAccumulated.toFixed(2)} grams ({ (goldSipCalculations.approxGramsAccumulated / 8).toFixed(2) } Pavans)
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Estimated Gains:</span>
                  <strong style={{ color: '#15803d' }}>+ ₹{Math.round(goldSipCalculations.projectedGains).toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 20,
                background: '#ffffff',
                border: '2px solid #10b981',
                borderRadius: 12,
                padding: '16px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: '#047857', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                Projected Maturity Value ({sipYears} Years)
              </span>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a' }}>
                ₹{Math.round(goldSipCalculations.projectedFutureVal).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* ═══ RATE CHANGES HISTORY (AT THE LAST BOTTOM) ═══ */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          marginTop: 28,
          background: '#ffffff',
          borderRadius: 18,
          border: '1.5px solid #e2e8f0',
          padding: '24px 22px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
        }}
      >
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b45309' }}>
              <History size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#0f172a' }}>
                Rate Changes History ({metal === 'XAU' ? 'IBJA Gold 30-Day Trend' : 'IBJA Silver 30-Day Trend'})
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>
                Daily official IBJA domestic closing benchmark, fluctuations, and day-by-day ledger
              </p>
            </div>
          </div>

          {/* Unit Toggle for Chart */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
              Chart Unit:
            </span>
            {metal === 'XAU' ? (
              [
                { id: '22k_1g', label: '22K (1g)' },
                { id: '22k_8g', label: '22K (8g Pavan)' },
                { id: '24k_1g', label: '24K (1g)' },
                { id: '18k_1g', label: '18K (1g)' },
              ].map(u => (
                <button
                  key={u.id}
                  onClick={() => setHistorySelectedUnit(u.id as any)}
                  style={{
                    padding: '5px 9px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 700,
                    border: historySelectedUnit === u.id ? '1.5px solid #d97706' : '1px solid #cbd5e1',
                    background: historySelectedUnit === u.id ? '#fef3c7' : '#ffffff',
                    color: historySelectedUnit === u.id ? '#92400e' : '#475569',
                    cursor: 'pointer',
                  }}
                >
                  {u.label}
                </button>
              ))
            ) : (
              [
                { id: 'silver_1g', label: 'Silver 1g' },
                { id: 'silver_10g', label: 'Silver 10g Bar' },
                { id: 'silver_1kg', label: 'Silver 1kg' },
              ].map(u => (
                <button
                  key={u.id}
                  onClick={() => setHistorySelectedUnit(u.id as any)}
                  style={{
                    padding: '5px 9px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 700,
                    border: historySelectedUnit === u.id ? '1.5px solid #475569' : '1px solid #cbd5e1',
                    background: historySelectedUnit === u.id ? '#f1f5f9' : '#ffffff',
                    color: historySelectedUnit === u.id ? '#0f172a' : '#475569',
                    cursor: 'pointer',
                  }}
                >
                  {u.label}
                </button>
              ))
            )}
          </div>
        </div>

        {/* History Summary Stats Cards */}
        {(() => {
          if (!historyRows || historyRows.length === 0) return null;
          const rows = historyRows;

          const getRowVal = (r: DailyRateRow) => {
            if (metal === 'XAU') {
              if (historySelectedUnit === '22k_8g') return r.rate22k_8g;
              if (historySelectedUnit === '24k_1g') return r.rate24k;
              if (historySelectedUnit === '18k_1g') return r.rate18k;
              return r.rate22k;
            } else {
              if (historySelectedUnit === 'silver_10g') return r.rateSilver10g;
              if (historySelectedUnit === 'silver_1kg') return r.rateSilverKg;
              return r.rateSilver1g;
            }
          };

          const firstVal = getRowVal(rows[0]);
          const lastVal = getRowVal(rows[rows.length - 1]);
          const netChange = lastVal - firstVal;
          const netChangePct = firstVal > 0 ? (netChange / firstVal) * 100 : 0;

          const allVals = rows.map(getRowVal);
          const maxVal = Math.max(...allVals);
          const minVal = Math.min(...allVals);
          const maxRow = rows.find(r => getRowVal(r) === maxVal);
          const minRow = rows.find(r => getRowVal(r) === minVal);

          return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 18 }}>
              {/* Period Net Change */}
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  30D Period Return
                </span>
                <div style={{ fontSize: 20, fontWeight: 900, color: netChange >= 0 ? '#15803d' : '#b91c1c', marginTop: 4 }}>
                  {netChange >= 0 ? '+' : ''}₹{Math.abs(netChange).toFixed(2)}
                </div>
                <div style={{ fontSize: 11, color: netChange >= 0 ? '#15803d' : '#b91c1c', fontWeight: 600 }}>
                  {netChange >= 0 ? '▲' : '▼'} {netChange >= 0 ? '+' : ''}{netChangePct.toFixed(2)}% over 30 days
                </div>
              </div>

              {/* Period High */}
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Period High
                </span>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', marginTop: 4 }}>
                  ₹{maxVal.toFixed(2)}
                </div>
                <div style={{ fontSize: 11, color: '#64748b' }}>
                  On {maxRow ? maxRow.date : '—'}
                </div>
              </div>

              {/* Period Low */}
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Period Low
                </span>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', marginTop: 4 }}>
                  ₹{minVal.toFixed(2)}
                </div>
                <div style={{ fontSize: 11, color: '#64748b' }}>
                  On {minRow ? minRow.date : '—'}
                </div>
              </div>

              {/* Recorded Trading Days */}
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Trading Days
                </span>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', marginTop: 4 }}>
                  {rows.length} Sessions
                </div>
                <div style={{ fontSize: 11, color: '#64748b' }}>
                  {rows[0].date} to {rows[rows.length - 1].date}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ═══ Visual Interactive Area Chart ═══ */}
        {(() => {
          if (!historyRows || historyRows.length < 2) return null;
          const rows = historyRows;

          const getRowVal = (r: DailyRateRow) => {
            if (metal === 'XAU') {
              if (historySelectedUnit === '22k_8g') return r.rate22k_8g;
              if (historySelectedUnit === '24k_1g') return r.rate24k;
              if (historySelectedUnit === '18k_1g') return r.rate18k;
              return r.rate22k;
            } else {
              if (historySelectedUnit === 'silver_10g') return r.rateSilver10g;
              if (historySelectedUnit === 'silver_1kg') return r.rateSilverKg;
              return r.rateSilver1g;
            }
          };

          const vals = rows.map(getRowVal);
          const min = Math.min(...vals);
          const max = Math.max(...vals);
          const range = (max - min) || 1;
          const chartMin = min - range * 0.08;
          const chartMax = max + range * 0.08;
          const chartRange = chartMax - chartMin;

          const padLeft = 45;
          const padRight = 35;
          const padTop = 20;
          const padBottom = 25;
          const plotW = 800 - padLeft - padRight;
          const plotH = 180 - padTop - padBottom;

          const pts = rows.map((item, idx) => {
            const v = getRowVal(item);
            const x = padLeft + (idx / (rows.length - 1)) * plotW;
            const y = padTop + plotH * (1 - (v - chartMin) / chartRange);
            return { x, y, val: v, date: item.date };
          });

          const lineD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
          const areaD = `${lineD} L ${pts[pts.length - 1].x.toFixed(1)},${(padTop + plotH).toFixed(1)} L ${pts[0].x.toFixed(1)},${(padTop + plotH).toFixed(1)} Z`;

          const hoveredPoint = historyHoveredIdx !== null && pts[historyHoveredIdx] ? pts[historyHoveredIdx] : null;

          return (
            <div style={{ marginBottom: 20, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, fontSize: 12, flexWrap: 'wrap', gap: 6 }}>
                <span style={{ fontWeight: 700, color: '#334155' }}>
                  {metal === 'XAU' ? 'Gold' : 'Silver'} Daily Rate Trend ({
                    historySelectedUnit === '22k_1g' ? '22K 1g' :
                    historySelectedUnit === '22k_8g' ? '22K 8g Sovereign' :
                    historySelectedUnit === '24k_1g' ? '24K 1g' :
                    historySelectedUnit === '18k_1g' ? '18K 1g' :
                    historySelectedUnit === 'silver_1g' ? 'Silver 1g' :
                    historySelectedUnit === 'silver_10g' ? 'Silver 10g Bar' : 'Silver 1kg'
                  })
                </span>
                {hoveredPoint ? (
                  <span style={{ fontWeight: 800, color: '#b45309', background: '#fef3c7', padding: '2px 8px', borderRadius: 4 }}>
                    {hoveredPoint.date}: ₹{hoveredPoint.val.toFixed(2)}
                  </span>
                ) : (
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>Hover or tap points to inspect daily rates</span>
                )}
              </div>

              <div style={{ width: '100%', overflowX: 'auto' }}>
                <svg
                  viewBox="0 0 800 180"
                  style={{ width: '100%', height: 'auto', display: 'block', maxHeight: 220 }}
                  onMouseLeave={() => setHistoryHoveredIdx(null)}
                >
                  <defs>
                    <linearGradient id="ibjaAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={metal === 'XAU' ? '#f59e0b' : '#94a3b8'} stopOpacity="0.4" />
                      <stop offset="100%" stopColor={metal === 'XAU' ? '#f59e0b' : '#94a3b8'} stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                    const y = padTop + plotH * (1 - pct);
                    const gridVal = chartMin + chartRange * pct;
                    return (
                      <g key={i}>
                        <line x1={padLeft} y1={y} x2={padLeft + plotW} y2={y} stroke="#f1f5f9" strokeDasharray="3 3" />
                        <text x={padLeft - 6} y={y + 3} textAnchor="end" fontSize="9" fill="#94a3b8" fontWeight="600">
                          {Math.round(gridVal)}
                        </text>
                      </g>
                    );
                  })}

                  {/* Shaded Area */}
                  <path d={areaD} fill="url(#ibjaAreaGrad)" />

                  {/* Smooth Line */}
                  <path d={lineD} stroke={metal === 'XAU' ? '#d97706' : '#475569'} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

                  {/* Data Points */}
                  {pts.map((p, i) => (
                    <circle
                      key={i}
                      cx={p.x}
                      cy={p.y}
                      r={historyHoveredIdx === i ? 6 : (i === 0 || i === pts.length - 1) ? 4 : 2.5}
                      fill={historyHoveredIdx === i ? (metal === 'XAU' ? '#92400e' : '#0f172a') : (metal === 'XAU' ? '#f59e0b' : '#64748b')}
                      stroke="#ffffff"
                      strokeWidth={1.5}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHistoryHoveredIdx(i)}
                      onTouchStart={() => setHistoryHoveredIdx(i)}
                    />
                  ))}

                  {/* X Axis Labels */}
                  <text x={pts[0].x} y={174} textAnchor="start" fontSize="10" fill="#64748b" fontWeight="600">
                    {pts[0].date}
                  </text>
                  <text x={pts[Math.floor(pts.length / 2)].x} y={174} textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="600">
                    {pts[Math.floor(pts.length / 2)].date}
                  </text>
                  <text x={pts[pts.length - 1].x} y={174} textAnchor="end" fontSize="10" fill="#64748b" fontWeight="600">
                    {pts[pts.length - 1].date}
                  </text>
                </svg>
              </div>
            </div>
          );
        })()}

        {/* ═══ Detailed Daily Rate Changes Table ═══ */}
        {(() => {
          if (!historyRows || historyRows.length === 0) return null;
          // Reverse rows so latest date is on top
          const displayRows = [...historyRows].reverse();

          return (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#1e293b' }}>
                  Daily IBJA Benchmark Rate Ledger ({displayRows.length} Days)
                </span>
                <span style={{ fontSize: 11, color: '#64748b' }}>
                  Latest date first · Changes compared to previous trading day
                </span>
              </div>

              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13, minWidth: 620 }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: 11, textTransform: 'uppercase' }}>
                      <th style={{ padding: '10px 12px' }}>Date</th>
                      {metal === 'XAU' ? (
                        <>
                          <th style={{ padding: '10px 12px' }}>22K Rate / 1g (₹)</th>
                          <th style={{ padding: '10px 12px' }}>22K Sovereign / 8g (₹)</th>
                          <th style={{ padding: '10px 12px' }}>24K Pure Rate / 1g (₹)</th>
                          <th style={{ padding: '10px 12px' }}>Daily Change (22K)</th>
                        </>
                      ) : (
                        <>
                          <th style={{ padding: '10px 12px' }}>Silver Rate / 1g (₹)</th>
                          <th style={{ padding: '10px 12px' }}>Silver 10g Bar (₹)</th>
                          <th style={{ padding: '10px 12px' }}>Silver 1kg (₹)</th>
                          <th style={{ padding: '10px 12px' }}>Daily Change (1g)</th>
                        </>
                      )}
                      <th style={{ padding: '10px 12px' }}>Day % Change</th>
                      <th style={{ padding: '10px 12px' }}>Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayRows.map(row => {
                      const isUp = row.diff1g > 0.05;
                      const isDown = row.diff1g < -0.05;

                      return (
                        <tr key={row.date} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '9px 12px', fontWeight: 700, color: '#0f172a' }}>
                            {row.date}
                          </td>

                          {metal === 'XAU' ? (
                            <>
                              <td style={{ padding: '9px 12px', fontWeight: 800, color: '#1e40af' }}>
                                ₹{row.rate22k.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                              <td style={{ padding: '9px 12px', color: '#334155', fontWeight: 600 }}>
                                ₹{row.rate22k_8g.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                              <td style={{ padding: '9px 12px', color: '#92400e', fontWeight: 600 }}>
                                ₹{row.rate24k.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                              <td style={{ padding: '9px 12px', fontWeight: 700, color: isUp ? '#15803d' : isDown ? '#b91c1c' : '#64748b' }}>
                                {row.isFirst ? (
                                  <span style={{ color: '#94a3b8' }}>Base</span>
                                ) : (
                                  <span>
                                    {isUp ? '+' : ''}₹{row.diff1g.toFixed(2)}
                                  </span>
                                )}
                              </td>
                            </>
                          ) : (
                            <>
                              <td style={{ padding: '9px 12px', fontWeight: 800, color: '#0f172a' }}>
                                ₹{row.rateSilver1g.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                              <td style={{ padding: '9px 12px', color: '#334155', fontWeight: 600 }}>
                                ₹{row.rateSilver10g.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                              <td style={{ padding: '9px 12px', color: '#475569', fontWeight: 600 }}>
                                ₹{row.rateSilverKg.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                              <td style={{ padding: '9px 12px', fontWeight: 700, color: isUp ? '#15803d' : isDown ? '#b91c1c' : '#64748b' }}>
                                {row.isFirst ? (
                                  <span style={{ color: '#94a3b8' }}>Base</span>
                                ) : (
                                  <span>
                                    {isUp ? '+' : ''}₹{row.diff1g.toFixed(2)}
                                  </span>
                                )}
                              </td>
                            </>
                          )}

                          <td style={{ padding: '9px 12px' }}>
                            {row.isFirst ? (
                              <span style={{ color: '#94a3b8', fontSize: 11 }}>—</span>
                            ) : (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 2,
                                  fontSize: 10,
                                  fontWeight: 800,
                                  padding: '2px 6px',
                                  borderRadius: 4,
                                  background: isUp ? '#dcfce7' : isDown ? '#fee2e2' : '#f1f5f9',
                                  color: isUp ? '#15803d' : isDown ? '#b91c1c' : '#64748b',
                                }}
                              >
                                {isUp ? '+' : ''}{row.pctChange.toFixed(2)}%
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '9px 12px', fontSize: 11, fontWeight: 700 }}>
                            {row.isFirst ? (
                              <span style={{ color: '#94a3b8' }}>—</span>
                            ) : isUp ? (
                              <span style={{ color: '#15803d', display: 'flex', alignItems: 'center', gap: 3 }}>
                                <ArrowUpRight size={13} /> Higher
                              </span>
                            ) : isDown ? (
                              <span style={{ color: '#b91c1c', display: 'flex', alignItems: 'center', gap: 3 }}>
                                <ArrowDownRight size={13} /> Lower
                              </span>
                            ) : (
                              <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 3 }}>
                                <Minus size={13} /> Steady
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
