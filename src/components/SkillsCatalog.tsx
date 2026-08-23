import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  Play, 
  Layers, 
  Terminal, 
  BookOpen, 
  Cpu, 
  ShieldCheck, 
  TrendingUp, 
  Scale, 
  Users, 
  FileSpreadsheet, 
  FileText, 
  Presentation, 
  Mail, 
  Zap, 
  Server,
  ArrowRight,
  X,
  Code
} from 'lucide-react';
import { Skill } from '../types';
import { SKILLS_DATA, CATEGORIES } from '../data/skillsData';

interface SkillsCatalogProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onLaunchSkillInAgent: (skill: Skill) => void;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  legal: Scale,
  finance: TrendingUp,
  hr: Users,
  research: Search,
  document: FileSpreadsheet,
  pdf: FileText,
  presentation: Presentation,
  communication: Mail,
  automation: Zap,
  infrastructure: Server,
};

export const SkillsCatalog: React.FC<SkillsCatalogProps> = ({
  searchQuery,
  setSearchQuery,
  onLaunchSkillInAgent
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredSkills = useMemo(() => {
    return SKILLS_DATA.filter((skill) => {
      const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        skill.name.toLowerCase().includes(q) ||
        skill.displayName.toLowerCase().includes(q) ||
        skill.description.toLowerCase().includes(q) ||
        skill.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        skill.capabilities.some((cap) => cap.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopyPrompt = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Overview */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8 overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-0"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Universal Office Skill Registry • 77+ Production Capabilities
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Supercharge Claude Desktop & AI Agents with Domain Skills
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Standardized methodology packs for corporate attorneys, investment analysts, data scientists, and operations leads. Fully integrated with MCP tools, knowledge bases, and multi-agent personas.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Scale className="w-4 h-4 text-indigo-400" />
              <span><strong>5</strong> Legal & Compliance</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span><strong>10</strong> Finance & DCF</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span><strong>10</strong> PDF & OCR</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Zap className="w-4 h-4 text-amber-400" />
              <span><strong>18+</strong> Integrations & Workflows</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills & Filter Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id] || Layers;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-700/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-400">
          Showing <span className="text-indigo-300 font-semibold">{filteredSkills.length}</span> skills
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => {
          const CategoryIcon = CATEGORY_ICONS[skill.category] || Layers;
          return (
            <div
              key={skill.id}
              className="group relative flex flex-col justify-between rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all p-5"
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-lg bg-indigo-950/60 border border-indigo-800/50 flex items-center justify-center text-indigo-400 group-hover:text-indigo-300 group-hover:border-indigo-500/40 transition-colors">
                      <CategoryIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-slate-100 group-hover:text-indigo-300 transition-colors leading-tight">
                        {skill.displayName}
                      </h3>
                      <span className="font-mono text-[11px] text-slate-400">
                        {skill.name}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    v{skill.version}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                  {skill.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {skill.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/60"
                    >
                      #{tag}
                    </span>
                  ))}
                  {skill.tags.length > 4 && (
                    <span className="text-[10px] text-slate-400 py-0.5">
                      +{skill.tags.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Footer / Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedSkill(skill)}
                  className="text-xs font-medium text-slate-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Inspect Spec</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopyPrompt(skill.samplePrompt, skill.id)}
                    title="Copy sample prompt"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                  >
                    {copiedId === skill.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => onLaunchSkillInAgent(skill)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 text-xs font-medium transition-all"
                  >
                    <Play className="w-3 h-3" />
                    <span>Run</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Skill Detail Drawer / Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  {React.createElement(CATEGORY_ICONS[selectedSkill.category] || Layers, { className: 'w-5 h-5' })}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{selectedSkill.displayName}</h2>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-mono text-indigo-300">/{selectedSkill.name}/SKILL.md</span>
                    <span>•</span>
                    <span>{selectedSkill.department}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedSkill(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm">
              
              {/* Overview */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">Overview</h3>
                <p className="text-slate-200 leading-relaxed bg-slate-800/40 p-3 rounded-lg border border-slate-800">
                  {selectedSkill.description}
                </p>
              </div>

              {/* Models & MCP Integration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300 mb-2">
                    <Cpu className="w-4 h-4" />
                    <span>Compatible AI Models</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSkill.models.recommended.map((m) => (
                      <span key={m} className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-200 text-xs font-mono border border-indigo-500/30">
                        {m} (Rec)
                      </span>
                    ))}
                    {selectedSkill.models.compatible.map((m) => (
                      <span key={m} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300 mb-2">
                    <Server className="w-4 h-4" />
                    <span>MCP Server & Tools</span>
                  </div>
                  {selectedSkill.mcpTools && selectedSkill.mcpTools.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSkill.mcpTools.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-xs font-mono border border-cyan-500/20">
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">Pure prompt & reasoning skill</span>
                  )}
                </div>
              </div>

              {/* Knowledge Bases if any */}
              {selectedSkill.knowledgeBases && selectedSkill.knowledgeBases.length > 0 && (
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">Connected Knowledge Bases</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkill.knowledgeBases.map((kb) => (
                      <div key={kb} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-800/50 text-xs">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span className="font-mono">{kb}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Capabilities */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">Core Capabilities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedSkill.capabilities.map((cap) => (
                    <div key={cap} className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/30 border border-slate-800 text-xs text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Prompt */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold">Standard Invocation Prompt</h3>
                  <button
                    onClick={() => handleCopyPrompt(selectedSkill.samplePrompt, 'modal-prompt')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    {copiedId === 'modal-prompt' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'modal-prompt' ? 'Copied' : 'Copy Prompt'}</span>
                  </button>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {selectedSkill.samplePrompt}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
              <button
                onClick={() => {
                  const content = `# Skill: ${selectedSkill.displayName}\n# Name: ${selectedSkill.name}\n\n${selectedSkill.description}\n\nPrompt:\n${selectedSkill.samplePrompt}`;
                  handleCopyPrompt(content, 'export-btn');
                }}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                {copiedId === 'export-btn' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>Copy Full Skill Markdown</span>
              </button>

              <button
                onClick={() => {
                  onLaunchSkillInAgent(selectedSkill);
                  setSelectedSkill(null);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
              >
                <Play className="w-4 h-4" />
                <span>Launch in Agent Studio</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
