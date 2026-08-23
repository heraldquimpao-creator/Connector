import React from "react";
import { Sparkles, Terminal, Bot, Wrench, BookOpen, FlaskConical, Github } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  skillsCount: number;
  toolsCount: number;
  agentsCount: number;
  knowledgeCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  skillsCount,
  toolsCount,
  agentsCount,
  knowledgeCount,
}) => {
  const tabs = [
    { id: "skills", label: "Skills Catalog", icon: Terminal, count: skillsCount },
    { id: "agents", label: "AI Agents", icon: Bot, count: agentsCount },
    { id: "tools", label: "MCP Tools", icon: Wrench, count: toolsCount },
    { id: "knowledge", label: "Knowledge Base", icon: BookOpen, count: knowledgeCount },
    { id: "tests", label: "Test Fixtures", icon: FlaskConical, count: 4 },
  ];

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight">Claude Office Skills</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  v2.0 MCP Studio
                </span>
              </div>
              <p className="text-xs text-slate-400">Official Office Automation, Document & Agent Toolchain</p>
            </div>
          </div>

          <nav className="flex items-center space-x-1 sm:space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.count > 0 && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? "bg-indigo-700/80 text-indigo-100"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
