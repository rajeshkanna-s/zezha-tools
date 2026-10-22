import React from 'react';
import type { DashboardTool } from './dashboardData';
import { useCustomTools } from '@/hooks/useCustomTools';

interface SectionDashboardProps {
    sectionId?: string;
    title: string;
    subtitle?: string;
    tools: DashboardTool[];
    onSelectTool: (tool: string) => void;
}

export const SectionDashboard: React.FC<SectionDashboardProps> = ({ sectionId, title, subtitle, tools, onSelectTool }) => {
    const { hiddenIds } = useCustomTools();
    const visibleTools = tools.filter(t => !hiddenIds.includes(t.id));

    if (visibleTools.length === 0) return null;

    return (
        <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="text-center mb-4">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-1">{title}</h1>
                {subtitle && <p className="text-emerald-600 text-xs max-w-lg mx-auto font-semibold animate-pulse">{subtitle}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {visibleTools.map(tool => (
                    <a
                        key={tool.id}
                        href={sectionId ? `/${sectionId}/${tool.id}` : `/${tool.id}`}
                        onClick={(e) => {
                            e.preventDefault();
                            onSelectTool(tool.id);
                        }}
                        className="bg-white rounded-xl border border-slate-200 p-4 text-left hover:shadow-lg hover:border-primary/20 hover:-translate-y-1 transition-all group block no-underline"
                    >
                        <div className={`w-9 h-9 ${tool.color} text-white rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                            <tool.icon size={18} />
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm mb-0.5">{tool.title}</h3>
                        <p className="text-[11px] text-slate-500 leading-snug">{tool.desc}</p>
                    </a>
                ))}
            </div>
        </div>
    );
};