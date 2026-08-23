import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Play, 
  Check, 
  Copy, 
  RefreshCw, 
  Sliders, 
  Wrench, 
  FileText, 
  Terminal, 
  User, 
  Layers, 
  ShieldCheck, 
  Download, 
  ChevronRight, 
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Agent, Skill, ChatMessage } from '../types';
import { AGENTS_DATA } from '../data/agentsData';
import { SKILLS_DATA } from '../data/skillsData';
import { TEST_CASES_DATA } from '../data/testCasesData';

interface AgentPlaygroundProps {
  initialSkill?: Skill | null;
}

export const AgentPlayground: React.FC<AgentPlaygroundProps> = ({ initialSkill }) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>('legal-specialist');
  const [selectedSkillId, setSelectedSkillId] = useState<string>(initialSkill ? initialSkill.id : 'auto');
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const selectedAgent = AGENTS_DATA.find((a) => a.id === selectedAgentId) || AGENTS_DATA[0];

  useEffect(() => {
    if (initialSkill) {
      setSelectedSkillId(initialSkill.id);
      // Auto switch to appropriate agent
      const matchedAgent = AGENTS_DATA.find(
        (a) => a.primarySkills.includes(initialSkill.id) || a.secondarySkills.includes(initialSkill.id)
      );
      if (matchedAgent) {
        setSelectedAgentId(matchedAgent.id);
      }
      setInputPrompt(initialSkill.samplePrompt);
    }
  }, [initialSkill]);

  // Initial welcome message if empty
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-msg',
          sender: 'system',
          content: `### 👋 Welcome to the Multi-Agent Office Studio\n\nSelect an agent persona and choose a skill or preset prompt below. The agent will execute step-by-step reasoning, invoke appropriate MCP tools (Word/Excel/PDF/OCR), and produce domain-expert outputs.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [messages.length]);

  const handleLoadTestCase = (testCaseId: string) => {
    const tc = TEST_CASES_DATA.find((t) => t.id === testCaseId);
    if (tc) {
      setSelectedAgentId(tc.agentId);
      setSelectedSkillId(tc.skillId);
      setInputPrompt(tc.prompt);
    }
  };

  const handleSendMessage = () => {
    if (!inputPrompt.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: inputPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    // Determine skill
    let effectiveSkillId = selectedSkillId;
    if (effectiveSkillId === 'auto') {
      const lower = inputPrompt.toLowerCase();
      if (lower.includes('合同') || lower.includes('contract') || lower.includes('nda') || lower.includes('liability')) {
        effectiveSkillId = 'contract-review';
      } else if (lower.includes('发票') || lower.includes('invoice') || lower.includes('vat')) {
        effectiveSkillId = 'invoice-generator';
      } else if (lower.includes('dcf') || lower.includes('wacc') || lower.includes('valuation')) {
        effectiveSkillId = 'dcf-valuation';
      } else if (lower.includes('销售') || lower.includes('sales') || lower.includes('roi') || lower.includes('data')) {
        effectiveSkillId = 'data-analysis';
      } else if (lower.includes('简历') || lower.includes('resume') || lower.includes('jd')) {
        effectiveSkillId = 'resume-tailor';
      } else if (lower.includes('会议') || lower.includes('meeting') || lower.includes('transcript')) {
        effectiveSkillId = 'meeting-notes';
      } else {
        effectiveSkillId = selectedAgent.primarySkills[0] || 'contract-review';
      }
    }

    const matchedSkill = SKILLS_DATA.find((s) => s.id === effectiveSkillId);

    // Find test case or synthesize dynamic response
    const matchedTestCase = TEST_CASES_DATA.find(
      (tc) => tc.skillId === effectiveSkillId || inputPrompt.includes(tc.title.split(':')[0])
    );

    setTimeout(() => {
      let finalContent = '';
      let toolCalls: any[] = [];
      let thoughtSteps: string[] = [
        `Identified domain intent: [${matchedSkill?.displayName || effectiveSkillId}]`,
        `Loaded persona: ${selectedAgent.displayName} (${selectedAgent.department})`,
        `Assessed jurisdiction & rule constraints`
      ];

      if (matchedSkill?.mcpTools && matchedSkill.mcpTools.length > 0) {
        thoughtSteps.push(`Invoking MCP Server tool: [${matchedSkill.mcpTools[0]}]`);
        toolCalls.push({
          toolName: matchedSkill.mcpTools[0],
          input: { promptLength: inputPrompt.length, format: 'structured' },
          output: { success: true, processed: true, timestamp: new Date().toISOString() },
          status: 'success'
        });
      }

      if (matchedTestCase && inputPrompt.includes(matchedTestCase.prompt.substring(0, 20))) {
        finalContent = matchedTestCase.mockResponse;
      } else if (matchedTestCase) {
        finalContent = matchedTestCase.mockResponse;
      } else {
        finalContent = `### 🎯 ${selectedAgent.displayName} Output Analysis\n\n**Applied Skill:** \`${matchedSkill?.displayName || effectiveSkillId}\`\n\n---\n\n#### 1. Executive Assessment\nProcessed user request using **${selectedAgent.tone}** methodology.\n\n#### 2. Findings & Strategic Deliverables\n- **Primary Objective:** Addressed explicit parameters specified in your prompt.\n- **Risk & Quality Checks:** Passed standard ${selectedAgent.department} verification.\n- **Actionable Steps:** Ready for immediate implementation.`;
      }

      const agentMessage: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        agentId: selectedAgent.id,
        skillUsed: matchedSkill?.displayName || effectiveSkillId,
        content: finalContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        toolCalls,
        thoughtSteps
      };

      setMessages((prev) => [...prev, agentMessage]);
      setIsProcessing(false);
      setInputPrompt('');
    }, 900);
  };

  const handleCopyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleDownloadMarkdown = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)] min-h-[640px]">
      
      {/* Left Column: Agent Selector & Config Drawer */}
      <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between overflow-y-auto space-y-4">
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Agent Persona</span>
              <span className="text-[10px] text-indigo-400 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                5 Available
              </span>
            </div>

            <div className="space-y-1.5">
              {AGENTS_DATA.map((agent) => {
                const isSelected = selectedAgentId === agent.id;
                return (
                  <button
                    key={agent.id}
                    onClick={() => {
                      setSelectedAgentId(agent.id);
                      setSelectedSkillId(agent.primarySkills[0] || 'auto');
                    }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border border-indigo-500/40 text-white shadow-sm'
                        : 'bg-slate-800/40 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    <span className="text-xl">{agent.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-xs truncate">{agent.displayName}</div>
                      <div className="text-[11px] text-slate-400 truncate">{agent.department}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Persona Details */}
          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-800 text-xs space-y-2">
            <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Persona Attributes</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {selectedAgent.description}
            </p>
            
            <div className="pt-2 border-t border-slate-700/60 space-y-1 text-[11px]">
              <div><strong className="text-slate-300">Tone:</strong> <span className="text-slate-400">{selectedAgent.tone}</span></div>
              <div><strong className="text-slate-300">Style:</strong> <span className="text-slate-400">{selectedAgent.style}</span></div>
            </div>
          </div>

          {/* Skill Selector */}
          <div>
            <label className="text-xs uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
              Active Skill Module
            </label>
            <select
              value={selectedSkillId}
              onChange={(e) => setSelectedSkillId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="auto">✨ Auto-Detect Best Skill</option>
              {SKILLS_DATA.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.displayName} ({s.category})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Test Prompt Presets */}
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">
              Preset Quick Test Prompts
            </div>
            <div className="space-y-1.5">
              {TEST_CASES_DATA.map((tc) => (
                <button
                  key={tc.id}
                  onClick={() => handleLoadTestCase(tc.id)}
                  className="w-full text-left p-2 rounded-lg bg-slate-800/40 hover:bg-indigo-950/40 hover:border-indigo-500/40 border border-slate-800 text-[11px] text-slate-300 transition-colors flex items-center justify-between group"
                >
                  <span className="truncate">{tc.title.split(':')[0]}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Clear chat button */}
        <button
          onClick={() => setMessages([])}
          className="w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-medium border border-slate-700 transition-colors"
        >
          Clear Workspace History
        </button>

      </div>

      {/* Center & Right Column: Interactive Chat & Execution Workspace */}
      <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between overflow-hidden shadow-xl">
        
        {/* Chat Top Bar */}
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{selectedAgent.avatar}</div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">{selectedAgent.displayName}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-400">{selectedAgent.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-[11px] text-slate-300">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Skill: {selectedSkillId === 'auto' ? 'Auto-Routing' : selectedSkillId}</span>
            </div>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isSystem = msg.sender === 'system';

            if (isSystem) {
              return (
                <div key={msg.id} className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-800/30 text-xs text-slate-300 leading-relaxed">
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-base shrink-0">
                    {selectedAgent.avatar}
                  </div>
                )}

                <div className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-800/90 border border-slate-700/80 text-slate-200 rounded-tl-none space-y-3'
                }`}>
                  
                  {/* Agent Header & Tools if applicable */}
                  {!isUser && (
                    <div className="flex items-center justify-between border-b border-slate-700/60 pb-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-indigo-300">{selectedAgent.displayName}</span>
                        {msg.skillUsed && (
                          <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-300 text-[10px] font-mono">
                            Skill: {msg.skillUsed}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopyMessage(msg.content, msg.id)}
                          className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                          title="Copy Output"
                        >
                          {copiedMessageId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleDownloadMarkdown(msg.content, `${selectedAgent.id}-output`)}
                          className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                          title="Download Markdown"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Thinking steps / reasoning if agent */}
                  {!isUser && msg.thoughtSteps && msg.thoughtSteps.length > 0 && (
                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                      <div className="flex items-center gap-1 text-indigo-400 font-semibold text-[10px] uppercase">
                        <Sparkles className="w-3 h-3" />
                        <span>Execution Reasoning Steps</span>
                      </div>
                      {msg.thoughtSteps.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <span className="text-indigo-400">›</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tool Call Log Badge */}
                  {!isUser && msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {msg.toolCalls.map((tc, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/40 border border-cyan-800/50 text-cyan-300 text-[10px] font-mono">
                          <Wrench className="w-3 h-3" />
                          <span>Tool invoked: {tc.toolName}()</span>
                          <span className="text-emerald-400">✓ 200 OK</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Content Body */}
                  <div className="leading-relaxed whitespace-pre-wrap font-sans">
                    {msg.content}
                  </div>

                  <div className={`text-[10px] ${isUser ? 'text-indigo-200' : 'text-slate-500'} text-right`}>
                    {msg.timestamp}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-200 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isProcessing && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-base animate-pulse">
                {selectedAgent.avatar}
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-xs text-indigo-300 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span>{selectedAgent.displayName} is analyzing input, loading knowledge models, and generating response...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Composer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90">
          <div className="flex items-end gap-2 bg-slate-800/80 border border-slate-700/80 rounded-xl p-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
            <textarea
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleSendMessage();
                }
              }}
              placeholder={`Ask ${selectedAgent.displayName} (e.g. "Review this contract", "Value this SaaS", "Extract invoice totals")... (Press ⌘+Enter to send)`}
              rows={2}
              className="flex-1 bg-transparent border-0 text-sm text-slate-200 placeholder-slate-400 resize-none focus:outline-none px-2 py-1"
            />

            <button
              onClick={handleSendMessage}
              disabled={!inputPrompt.trim() || isProcessing}
              className="p-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-md shadow-indigo-600/30 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
            <span>Powered by <strong>Claude 3.7 Sonnet</strong> + <strong>Office MCP Tools</strong></span>
            <span>Use ⌘+Enter to submit</span>
          </div>
        </div>

      </div>

    </div>
  );
};
