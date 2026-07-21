import React, { useState, useMemo } from 'react';
import {
  Database,
  Building2,
  GraduationCap,
  MapPin,
  Map,
  Landmark,
  Calendar,
  Building,
  Receipt,
  Scale,
  TrendingUp,
  Car,
  Briefcase,
  FileText,
  Sparkles,
  Search,
  ChevronRight,
  BarChart3,
  PieChart as PieIcon
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import { RAW_DATA_TOOLS } from '../dashboardData';
import { indianStatesCitiesData } from './indianStatesData';
import { indianCitiesData } from './indianCitiesData';
import { indianHolidaysData } from './indianHolidaysData';
import { indianCollegesData } from './indianCollegesData';
import { indianDistrictsData } from './indianDistrictsData';
import { indianBanksData } from './indianBanksData';

interface RawDataDashboardProps {
  onSelectTool: (toolId: string) => void;
}

const TIER_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899'];
const HOLIDAY_COLORS = ['#ef4444', '#f59e0b', '#3b82f6'];

export const RawDataDashboard: React.FC<RawDataDashboardProps> = ({ onSelectTool }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Calculations for Cities by State (Bar Chart)
  const citiesByState = useMemo(() => {
    const counts: Record<string, number> = {};
    indianCitiesData.forEach(c => {
      counts[c.stateOrUt] = (counts[c.stateOrUt] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // top 8 states
  }, []);

  // 2. Calculations for Cities by Tier (Pie Chart)
  const citiesByTier = useMemo(() => {
    const counts: Record<string, number> = {};
    indianCitiesData.forEach(c => {
      const tier = c.tier || 'Other';
      counts[tier] = (counts[tier] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, []);

  // 3. Calculations for Holidays by Type (Pie Chart)
  const holidaysByType = useMemo(() => {
    const counts: Record<string, number> = {};
    indianHolidaysData.forEach(h => {
      counts[h.type] = (counts[h.type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, []);

  // Filter tools based on search query
  const filteredTools = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return RAW_DATA_TOOLS;
    return RAW_DATA_TOOLS.filter(
      tool =>
        tool.title.toLowerCase().includes(query) ||
        tool.desc.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const stateCount = indianStatesCitiesData.filter(s => s.type === 'State').length;
  const utCount = indianStatesCitiesData.filter(s => s.type === 'Union Territory').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in bg-slate-50 min-h-screen">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm tracking-wider uppercase">
            <Sparkles size={16} />
            <span>Interactive Database</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Raw Data & Reference Lists Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-2xl">
            Explore verified datasets covering Indian geography, institutions, public finance, compliance limits, tax slabs, and interest rates.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-72">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search datasets..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm"
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">States & UTs</span>
          <span className="text-2xl font-black text-slate-900 mt-1">{indianStatesCitiesData.length}</span>
          <span className="text-[9px] text-slate-500 mt-1 font-semibold">{stateCount} States | {utCount} UTs</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Major Cities</span>
          <span className="text-2xl font-black text-slate-900 mt-1">{indianCitiesData.length}</span>
          <span className="text-[9px] text-slate-500 mt-1 font-semibold">Tiers 1, 2, and 3</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Districts</span>
          <span className="text-2xl font-black text-slate-900 mt-1">{indianDistrictsData.length}</span>
          <span className="text-[9px] text-slate-500 mt-1 font-semibold">With demographics</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Colleges / Univ</span>
          <span className="text-2xl font-black text-slate-900 mt-1">1,000+</span>
          <span className="text-[9px] text-slate-500 mt-1 font-semibold">Active institutions</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Govt Holidays</span>
          <span className="text-2xl font-black text-slate-900 mt-1">{indianHolidaysData.length}</span>
          <span className="text-[9px] text-slate-500 mt-1 font-semibold">2026 Calendar Year</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scheduled Banks</span>
          <span className="text-2xl font-black text-slate-900 mt-1">{indianBanksData.length}</span>
          <span className="text-[9px] text-slate-500 mt-1 font-semibold">Public & Private</span>
        </div>
      </div>

      {/* Visual Analytics / Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* State-wise City Counts (Bar Chart) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3">
            <BarChart3 size={16} className="text-indigo-600" />
            <span>Top States by Major Cities</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={citiesByState} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(value: any) => [`${value} Major Cities`, 'Count']}
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown side-cards */}
        <div className="space-y-6">
          {/* Cities by Tier Pie Chart */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <PieIcon size={16} className="text-indigo-600" />
              <span>Cities by Tier Distribution</span>
            </h3>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={citiesByTier}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={45}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {citiesByTier.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={TIER_COLORS[index % TIER_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value} Cities`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[9px] font-bold text-slate-500">
              {citiesByTier.map((c, index) => (
                <div key={c.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: TIER_COLORS[index % TIER_COLORS.length] }} />
                  <span>{c.name}: {c.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Holidays by Type Pie Chart */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Calendar size={16} className="text-indigo-600" />
              <span>Govt Holidays by Type</span>
            </h3>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={holidaysByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={45}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {holidaysByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={HOLIDAY_COLORS[index % HOLIDAY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value} Holidays`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-1 text-[9px] font-bold text-slate-500">
              {holidaysByType.map((c, index) => (
                <div key={c.name} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: HOLIDAY_COLORS[index % HOLIDAY_COLORS.length] }} />
                  <span className="truncate">{c.name}: {c.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Data Lists */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Available Datasets ({filteredTools.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredTools.map(tool => (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className="bg-white rounded-2xl border border-slate-200 p-5 text-left hover:shadow-lg hover:border-indigo-500/20 hover:-translate-y-1 transition-all group flex flex-col justify-between min-h-[140px]"
            >
              <div>
                <div className={`w-10 h-10 ${tool.color} text-white rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <tool.icon size={20} />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">{tool.title}</h3>
                <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">{tool.desc}</p>
              </div>
              <div className="flex items-center justify-end text-xs font-bold text-indigo-600 mt-4 self-end group-hover:translate-x-1 transition-transform">
                <span>View Database</span>
                <ChevronRight size={14} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
