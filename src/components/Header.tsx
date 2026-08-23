import React from 'react';
import { 
  Sparkles, 
  Layers, 
  Bot, 
  Wrench, 
  ShieldCheck, 
  PlusCircle, 
  DownloadCloud, 
  Search, 
  Command,
  BookOpen
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'skills' | 'agents' | 'mcp' | 'analyzer' | 'builder' | 'config';
  setActiveTab: (tab: 'skills' | 'agents' | 'mcp' | 'analyzer' | 'builder' | 'config') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery
}) => {
  const tabs = [
    { id: 'skills', label: 'Skills Catalog', icon: Layers, badge: '77+' },
    { id: 'agents', label: 'Multi-Agent Studio', icon: Bot, badge: '5 Personas' },
    { id: 'mcp', label: 'MCP Tools Lab', icon: Wrench, badge: '18 Tools' },
    { id: 'analyzer', label: 'Contract & Risk Studio', icon: ShieldCheck, badge: 'Knowledge-Grounded' },
    { id: 'builder', label: 'Skill Builder', icon: PlusCircle, badge: 'New' },
    { id: 'config', label: 'Export & Setup', icon: DownloadCloud }
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('skills')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-lg">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">Claude Office Skills</span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  v2.0 Pro
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">77+ Production AI Skills, 5 Agents & MCP Server</p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 77+ skills, tools, agents, risk patterns (e.g. DCF, NDA, OCR)..."
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-lg pl-9 pr-12 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-slate-700/60 text-slate-400 px-1.5 py-0.5 rounded border border-slate-600">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Stats & Quick Actions */}
          <div className="flex items-center gap-2 text-xs">
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono text-emerald-400 font-semibold">Ready</span>
              <span className="text-slate-500">•</span>
              <span>Claude 3.7 & MCP Live</span>
            </div>

            <button
              onClick={() => setActiveTab('config')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-sm transition-colors text-xs"
            >
              <DownloadCloud className="w-3.5 h-3.5" />
              <span>Connect Claude / Cursor</span>
            </button>
          </div>

        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-t border-slate-800/80 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {'badge' in tab && tab.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                        isActive
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
