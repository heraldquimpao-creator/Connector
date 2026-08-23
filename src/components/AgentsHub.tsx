import React, { useState } from "react";
import { AgentMeta } from "../types";
import { Bot, Sparkles, Send, CheckCircle2, Shield, Wrench, MessageSquare, Terminal, ChevronRight, Copy } from "lucide-react";

interface AgentsHubProps {
  agents: AgentMeta[];
  loading: boolean;
}

export const AgentsHub: React.FC<AgentsHubProps> = ({ agents, loading }) => {
  const [selectedAgent, setSelectedAgent] = useState<AgentMeta | null>(null);
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "agent"; text: string; time: string }[]>([]);
  const [sending, setSending] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Initialize selected agent
  React.useEffect(() => {
    if (agents.length > 0 && !selectedAgent) {
      setSelectedAgent(agents[0]);
    }
  }, [agents, selectedAgent]);

  const handleSelectAgent = (agent: AgentMeta) => {
    setSelectedAgent(agent);
    setMessages([
      {
        role: "agent",
        text: `Hello! I am your ${agent.displayName}. I specialize in ${agent.description}. How can I assist you with your office workflow today?`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim() || !selectedAgent || sending) return;

    const currentMsg = userMessage;
    setUserMessage("");
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setMessages((prev) => [...prev, { role: "user", text: currentMsg, time: now }]);
    setSending(true);

    try {
      const res = await fetch("/api/ai/run-skill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: selectedAgent.id,
          prompt: currentMsg,
          inputData: `Agent: ${selectedAgent.displayName}\nCapabilities: ${selectedAgent.primarySkills.join(", ")}`,
        }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          text: data.response,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          text: `Encountered an error: ${err.message}`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleCopySystemPrompt = () => {
    if (!selectedAgent?.systemPrompt) return;
    navigator.clipboard.writeText(selectedAgent.systemPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading AI Agent Personas...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900/60 to-purple-950/40 p-6 rounded-2xl border border-indigo-900/40">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-3 border border-indigo-500/20">
            <Bot className="w-3.5 h-3.5" />
            <span>Autonomous Domain Specialists</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Pre-built Claude Office Agents</h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Ready-to-deploy AI personas pre-configured with curated skills, MCP document manipulation tools, and jurisdiction legal/financial knowledge bases.
          </p>
        </div>
      </div>

      {/* Agents Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {agents.map((agent) => {
          const isSelected = selectedAgent?.id === agent.id;
          return (
            <div
              key={agent.id}
              id={`agent-card-${agent.id}`}
              onClick={() => handleSelectAgent(agent)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? "bg-indigo-950/50 border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg shadow-indigo-950/50"
                  : "bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
              }`}
            >
              <div className="text-3xl mb-2">{agent.avatar}</div>
              <h3 className="text-sm font-bold text-white">{agent.displayName}</h3>
              <p className="text-xs text-indigo-400 font-medium">{agent.department}</p>
              <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">{agent.description}</p>

              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>{agent.primarySkills.length} Core Skills</span>
                <span className="font-mono text-emerald-400">Ready</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Agent Workbench */}
      {selectedAgent && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Agent Profile & Capabilities */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="text-4xl p-2 bg-slate-800/60 rounded-xl border border-slate-700">
                  {selectedAgent.avatar}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedAgent.displayName}</h3>
                  <p className="text-xs text-slate-400">{selectedAgent.department} • {selectedAgent.category}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-300">Curated Primary Skills:</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAgent.primarySkills.map((sk, idx) => (
                    <span key={idx} className="text-xs px-2.5 py-1 rounded-md bg-indigo-950/60 text-indigo-300 border border-indigo-800/40">
                      ⚡ {sk}
                    </span>
                  ))}
                </div>
              </div>

              {selectedAgent.secondarySkills?.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-400">Secondary Skills:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAgent.secondarySkills.map((sk, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedAgent.mcpTools?.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-emerald-400 flex items-center space-x-1">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Active MCP Tools:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedAgent.mcpTools.map((t, idx) => (
                      <span key={idx} className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-800/40">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedAgent.platforms?.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <div className="text-xs text-slate-400">Deployment Platforms:</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedAgent.platforms.map((p, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleCopySystemPrompt}
                className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors border border-slate-700"
              >
                {copiedPrompt ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPrompt ? "Agent Prompt Copied!" : "Export System Prompt"}</span>
              </button>
            </div>
          </div>

          {/* Right: Live Interactive Simulation Chat */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl flex flex-col h-[580px]">
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-semibold text-white">Live Consultation with {selectedAgent.displayName}</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">Agent ID: {selectedAgent.id}</span>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center space-x-1 text-[10px] text-slate-500 mb-1 px-1">
                      <span>{msg.role === "user" ? "You" : selectedAgent.displayName}</span>
                      <span>•</span>
                      <span>{msg.time}</span>
                    </div>
                    <div
                      className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-indigo-600 text-white rounded-br-none"
                          : "bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none font-mono whitespace-pre-wrap"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {sending && (
                  <div className="flex items-center space-x-2 text-xs text-slate-400 p-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                    <span>{selectedAgent.displayName} is analyzing documents & invoking tools...</span>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t border-slate-800 bg-slate-950/60 rounded-b-xl">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    id="agent-chat-input"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder={`Ask ${selectedAgent.displayName} to review a contract, analyze data, or draft...`}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    id="agent-send-btn"
                    onClick={handleSendMessage}
                    disabled={sending || !userMessage.trim()}
                    className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg transition-colors shadow-md shadow-indigo-600/30"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
