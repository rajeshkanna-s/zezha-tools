import React, { useState, useMemo } from 'react';
import { Search, Sparkles, ArrowRight, Star, Zap, CreditCard, PiggyBank, Calendar, Percent, FileSpreadsheet, BarChart3, Receipt, Image } from 'lucide-react';
import { MENU_SECTIONS } from './ToolsSidebar';
import { useCustomTools } from '@/hooks/useCustomTools';
import { useFavouriteTools } from '@/hooks/useFavouriteTools';

interface ToolsHomeProps {
  onSelectTool: (tool: string) => void;
  onSelectSection: (section: string) => void;
}

export const ToolsHome: React.FC<ToolsHomeProps> = ({ onSelectTool, onSelectSection }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { hiddenIds } = useCustomTools();
  const { favouriteIds, toggleFavourite } = useFavouriteTools();

  // Filter out hidden sections/items
  const visibleSections = useMemo(() => {
    return MENU_SECTIONS.map(section => {
      if (section.id === 'home') return null; // skip Home itself
      if (hiddenIds.includes(section.id)) return null;
      const visibleItems = section.items.filter(item => !hiddenIds.includes(item.id));
      return { ...section, items: visibleItems };
    }).filter(Boolean) as typeof MENU_SECTIONS;
  }, [hiddenIds]);

  // Flattened list of all visible tools for searching
  const allVisibleTools = useMemo(() => {
    const list: { id: string; label: string; icon: React.FC<any>; sectionId: string; sectionLabel: string }[] = [];
    visibleSections.forEach(section => {
      if (section.items.length > 0) {
        section.items.forEach(item => {
          list.push({
            id: item.id,
            label: item.label,
            icon: item.icon,
            sectionId: section.id,
            sectionLabel: section.label
          });
        });
      } else {
        // Standalone section
        list.push({
          id: section.id,
          label: section.label,
          icon: section.icon,
          sectionId: section.id,
          sectionLabel: section.label
        });
      }
    });
    return list;
  }, [visibleSections]);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allVisibleTools.filter(t => t.label.toLowerCase().includes(q));
  }, [searchQuery, allVisibleTools]);

  const quickAccessTools = useMemo(() => [
    { id: 'emi-calculator', sectionId: 'loans-emi', label: 'EMI Calculator', icon: CreditCard, color: 'text-emerald-600 bg-emerald-50' },
    { id: 'fd-calculator', sectionId: 'investments', label: 'FD Calculator', icon: PiggyBank, color: 'text-amber-600 bg-amber-50' },
    { id: 'dob-calculator', sectionId: 'utilities', label: 'DOB Calculator', icon: Calendar, color: 'text-blue-600 bg-blue-50' },
    { id: 'percentage-calculator', sectionId: 'utilities', label: 'Percentage', icon: Percent, color: 'text-indigo-600 bg-indigo-50' },
    { id: 'old-regime-tax', sectionId: 'business-tax', label: 'Old Regime Tax', icon: FileSpreadsheet, color: 'text-rose-600 bg-rose-50' },
    { id: 'new-regime-tax', sectionId: 'business-tax', label: 'New Regime Tax', icon: FileSpreadsheet, color: 'text-cyan-600 bg-cyan-50' },
    { id: 'tax-compare', sectionId: 'business-tax', label: 'Tax Compare', icon: BarChart3, color: 'text-purple-600 bg-purple-50' },
    { id: 'tds-calculator', sectionId: 'business-tax', label: 'TDS Calculator', icon: Receipt, color: 'text-teal-600 bg-teal-50' },
    { id: 'image-to-pdf', sectionId: 'convertors', label: 'Image to PDF', icon: Image, color: 'text-violet-600 bg-violet-50' }
  ], []);

  const handleNavigate = (sectionId: string, toolId: string) => {
    onSelectSection(sectionId);
    onSelectTool(toolId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      {/* Premium Hero Banner */}
      <div className="bg-gradient-to-r from-primary via-indigo-600 to-violet-600 rounded-3xl p-6 md:p-10 shadow-xl shadow-indigo-100/50 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative z-10 space-y-4 max-w-3xl">

          <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight leading-none">
            Zezha Tools
          </h1>
          {/* Search Box in Hero */}
          <div className="relative max-w-md pt-2">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search across all tools and utilities..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 border border-transparent rounded-2xl text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-white transition-all placeholder:text-slate-400 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Conditional Rendering: Search Results vs Standard Sections Grid */}
      {searchQuery.trim() ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="text-slate-800 font-bold text-lg">Search Results ({searchResults.length})</h2>
            <button onClick={() => setSearchQuery('')} className="text-xs text-primary font-semibold hover:underline">Clear Search</button>
          </div>

          {searchResults.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <Search size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium text-sm">No tools found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {searchResults.map(tool => {
                const Icon = tool.icon;
                const isFav = favouriteIds.includes(tool.id);
                return (
                  <div
                    key={tool.id}
                    className="group bg-white rounded-2xl border border-slate-200/60 p-4 shadow-sm hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 bg-primary/8 rounded-xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform shrink-0">
                          <Icon size={20} />
                        </div>
                        <button
                          onClick={() => toggleFavourite(tool.id)}
                          className="text-slate-300 hover:text-amber-400 transition-colors p-1"
                          title={isFav ? "Remove from Favourites" : "Add to Favourites"}
                        >
                          <Star size={16} className={isFav ? "fill-amber-400 text-amber-400" : ""} />
                        </button>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors">{tool.label}</h3>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{tool.sectionLabel}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleNavigate(tool.sectionId, tool.id)}
                      className="mt-4 flex items-center justify-between w-full text-xs font-semibold text-primary hover:text-primary-dark pt-2 border-t border-slate-50"
                    >
                      <span>Open Tool</span>
                      <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-10">
          {/* Quick Access Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-extrabold text-lg border-b border-slate-100 pb-2">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200/50 flex items-center justify-center text-slate-600">
                <Zap size={16} className="text-amber-500 fill-amber-500" />
              </div>
              <h2>Quick Access</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
              {quickAccessTools.map(tool => {
                const Icon = tool.icon;
                return (
                  <div
                    key={tool.id}
                    onClick={() => handleNavigate(tool.sectionId, tool.id)}
                    className="group bg-white rounded-2xl border border-slate-200/60 p-3 shadow-sm hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center space-y-2"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tool.color} group-hover:scale-105 transition-transform shrink-0`}>
                      <Icon size={20} />
                    </div>
                    <span className="font-bold text-slate-700 text-xs group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                      {tool.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Grid: Grouped Sections */}
          {visibleSections.map(section => {
            const SectionIcon = section.icon;
            return (
              <div key={section.id} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2 text-slate-800 font-extrabold text-lg">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200/50 flex items-center justify-center text-slate-600">
                      <SectionIcon size={16} />
                    </div>
                    <h2>{section.label}</h2>
                  </div>
                  {section.items.length > 0 && (
                    <span className="text-xs text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                      {section.items.length} {section.items.length === 1 ? 'tool' : 'tools'}
                    </span>
                  )}
                </div>

                {section.items.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {section.items.map(item => {
                      const ToolIcon = item.icon;
                      const isFav = favouriteIds.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          className="group bg-white rounded-2xl border border-slate-200/60 p-4 shadow-sm hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="w-10 h-10 bg-primary/8 rounded-xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform shrink-0">
                                <ToolIcon size={20} />
                              </div>
                              <button
                                onClick={() => toggleFavourite(item.id)}
                                className="text-slate-300 hover:text-amber-400 transition-colors p-1"
                                title={isFav ? "Remove from Favourites" : "Add to Favourites"}
                              >
                                <Star size={16} className={isFav ? "fill-amber-400 text-amber-400" : ""} />
                              </button>
                            </div>
                            <h3 className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors leading-tight">
                              {item.label}
                            </h3>
                          </div>
                          <button
                            onClick={() => handleNavigate(section.id, item.id)}
                            className="mt-4 flex items-center justify-between w-full text-xs font-semibold text-primary hover:text-primary-dark pt-2 border-t border-slate-50"
                          >
                            <span>Open Tool</span>
                            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Standalone tool card e.g. govt-scheme-finder */
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div
                      className="group bg-white rounded-2xl border border-slate-200/60 p-4 shadow-sm hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 bg-primary/8 rounded-xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform shrink-0">
                            <SectionIcon size={20} />
                          </div>
                          <button
                            onClick={() => toggleFavourite(section.id)}
                            className="text-slate-300 hover:text-amber-400 transition-colors p-1"
                            title={favouriteIds.includes(section.id) ? "Remove from Favourites" : "Add to Favourites"}
                          >
                            <Star size={16} className={favouriteIds.includes(section.id) ? "fill-amber-400 text-amber-400" : ""} />
                          </button>
                        </div>
                        <h3 className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors leading-tight">
                          Launch {section.label}
                        </h3>
                      </div>
                      <button
                        onClick={() => handleNavigate(section.id, section.id)}
                        className="mt-4 flex items-center justify-between w-full text-xs font-semibold text-primary hover:text-primary-dark pt-2 border-t border-slate-50"
                      >
                        <span>Open Page</span>
                        <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
