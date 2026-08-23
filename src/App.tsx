import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SkillsCatalog } from './components/SkillsCatalog';
import { AgentPlayground } from './components/AgentPlayground';
import { MCPToolsLab } from './components/MCPToolsLab';
import { DocumentAnalyzer } from './components/DocumentAnalyzer';
import { SkillBuilder } from './components/SkillBuilder';
import { ConfigExportHub } from './components/ConfigExportHub';
import { Skill } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<'skills' | 'agents' | 'mcp' | 'analyzer' | 'builder' | 'config'>('skills');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSkillForAgent, setActiveSkillForAgent] = useState<Skill | null>(null);

  // Keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLaunchSkillInAgent = (skill: Skill) => {
    setActiveSkillForAgent(skill);
    setActiveTab('agents');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'skills' && (
          <SkillsCatalog
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onLaunchSkillInAgent={handleLaunchSkillInAgent}
          />
        )}

        {activeTab === 'agents' && (
          <AgentPlayground initialSkill={activeSkillForAgent} />
        )}

        {activeTab === 'mcp' && (
          <MCPToolsLab />
        )}

        {activeTab === 'analyzer' && (
          <DocumentAnalyzer />
        )}

        {activeTab === 'builder' && (
          <SkillBuilder />
        )}

        {activeTab === 'config' && (
          <ConfigExportHub />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Claude Office Skills Studio</span>
            <span>•</span>
            <span>77+ AI Skills & MCP Server Architecture</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="text-[11px]">Grounded in standard Risk Patterns & Jurisdictions</span>
            <span>•</span>
            <span className="text-indigo-400 font-mono">MIT License</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
