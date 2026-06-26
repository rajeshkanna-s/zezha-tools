import React, { useState } from 'react';
import { ExternalLink, Search, Sparkles, FolderGit2, Briefcase, LayoutTemplate } from 'lucide-react';

interface Project {
  url: string;
}

const SELF_PROJECTS: Project[] = [
  { url: 'https://rajeshkanna.in' },
  { url: 'https://zezha.in' },
  { url: 'https://reportsiq.in' },
  { url: 'https://zezhatalent.in' },
  { url: 'https://healthyplates.in' },
  { url: 'https://zezhatools.com' },
  { url: 'https://fitness-advisor.netlify.app' },
  { url: 'https://ai-fin-advisor.netlify.app' },
  { url: 'https://fits5.netlify.app' },
  { url: 'https://restobills.netlify.app' },
  { url: 'https://ragsupportsuite.netlify.app' },
  { url: 'https://aiengineerrdmap.netlify.app' },
  { url: 'https://tamilnadudev.netlify.app' },
  { url: 'https://fintechautomative.netlify.app' },
  { url: 'https://aimarketingengine.netlify.app' },
  { url: 'https://mybiofolio.netlify.app' },
  { url: 'https://parkingmate.netlify.app' },
  { url: 'https://exptkr.netlify.app' },
  { url: 'https://dfits.netlify.app' },
  { url: 'https://aiapiss.netlify.app' }
];

const CLIENT_PROJECTS: Project[] = [
  { url: 'https://natarajanwoodcarvings.in' },
  { url: 'https://woodcalc.netlify.app' },
  { url: 'https://flexfitclub.netlify.app' },
  { url: 'https://norapixel.netlify.app' },
  { url: 'https://elshaddaiwoods.netlify.app' }
];

const CLIENT_TEMPLATES: Project[] = [
  { url: 'https://homeeserv.netlify.app' },
  { url: 'https://brightsmilo.netlify.app' },
  { url: 'https://designerpage.netlify.app' },
  { url: 'https://loves-connect.netlify.app' },
  { url: 'https://the-empire.netlify.app' },
  { url: 'https://tastetable.netlify.app' },
  { url: 'https://lex-co.netlify.app' },
  { url: 'https://pulse-fits.netlify.app' },
  { url: 'https://devcoder.netlify.app' },
  { url: 'https://frame-photographer.netlify.app' },
  { url: 'https://contwriter.netlify.app' },
  { url: 'https://frontee-developer.netlify.app' },
  { url: 'https://labellacasa.netlify.app' },
  { url: 'https://realestatepj.netlify.app' },
  { url: 'https://musebeauty.netlify.app' },
  { url: 'https://energetic-canvas.netlify.app' },
  { url: 'https://arjunprof.netlify.app' },
  { url: 'https://priya-designer.netlify.app' },
  { url: 'https://enscraft-stu.netlify.app' },
  { url: 'https://growth-engine-studio.netlify.app' }
];

export const ProductsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filterProjects = (list: Project[]) => {
    return list.filter(p => {
      const displayUrl = p.url.replace(/^https?:\/\/(www\.)?/, '');
      return displayUrl.toLowerCase().includes(searchQuery.toLowerCase());
    });
  };

  const getCleanDomain = (url: string) => {
    let domain = url.replace(/^https?:\/\/(www\.)?/, '');
    if (domain.endsWith('.netlify.app')) {
      domain = domain.substring(0, domain.length - 12);
    }
    return domain;
  };

  const filteredSelf = filterProjects(SELF_PROJECTS);
  const filteredClients = filterProjects(CLIENT_PROJECTS);
  const filteredTemplates = filterProjects(CLIENT_TEMPLATES);

  const hasResults = filteredSelf.length > 0 || filteredClients.length > 0 || filteredTemplates.length > 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Premium Slim Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 rounded-3xl p-5 md:p-6 shadow-xl shadow-teal-100/50 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>PORTFOLIO & PROJECTS</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black font-display tracking-tight leading-none">
            Product Showcase <span className="text-teal-200">& Portfolio</span>
          </h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search projects by domain name..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all placeholder:text-slate-400"
        />
      </div>

      {!hasResults ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100/50 shadow-sm">
          <Search size={32} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500 text-sm font-medium">No projects matching your search.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Self Projects */}
          {filteredSelf.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-base border-b border-slate-100 pb-2">
                <FolderGit2 className="w-5 h-5 text-indigo-600" />
                <h2>Self Projects ({filteredSelf.length})</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredSelf.map(proj => (
                  <a
                    key={proj.url}
                    href={proj.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-indigo-500/30 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors truncate pr-2">
                      {getCleanDomain(proj.url)}
                    </span>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Client Projects */}
          {filteredClients.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-base border-b border-slate-100 pb-2">
                <Briefcase className="w-5 h-5 text-teal-600" />
                <h2>Client Projects ({filteredClients.length})</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredClients.map(proj => (
                  <a
                    key={proj.url}
                    href={proj.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-teal-500/30 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-teal-600 transition-colors truncate pr-2">
                      {getCleanDomain(proj.url)}
                    </span>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-teal-500 transition-colors shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio Templates */}
          {filteredTemplates.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-base border-b border-slate-100 pb-2">
                <LayoutTemplate className="w-5 h-5 text-emerald-600" />
                <h2>Client Portfolio Templates ({filteredTemplates.length})</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredTemplates.map(proj => (
                  <a
                    key={proj.url}
                    href={proj.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-emerald-500/30 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors truncate pr-2">
                      {getCleanDomain(proj.url)}
                    </span>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
