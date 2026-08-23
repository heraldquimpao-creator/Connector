import React, { useState } from 'react';
import { 
  Wrench, 
  Play, 
  Terminal, 
  Check, 
  Copy, 
  FileText, 
  FileSpreadsheet, 
  Presentation, 
  RefreshCw, 
  Code,
  Zap,
  ArrowRight
} from 'lucide-react';
import { MCP_TOOLS_DATA } from '../data/mcpToolsData';
import { MCPTool } from '../types';

export const MCPToolsLab: React.FC = () => {
  const [selectedToolId, setSelectedToolId] = useState<string>(MCP_TOOLS_DATA[0].id);
  const selectedTool = MCP_TOOLS_DATA.find((t) => t.id === selectedToolId) || MCP_TOOLS_DATA[0];

  const [inputJson, setInputJson] = useState<string>(
    JSON.stringify(selectedTool.exampleInput, null, 2)
  );
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleSelectTool = (tool: MCPTool) => {
    setSelectedToolId(tool.id);
    setInputJson(JSON.stringify(tool.exampleInput, null, 2));
    setExecutionOutput(null);
  };

  const handleRunTool = () => {
    setIsRunning(true);
    setTimeout(() => {
      setExecutionOutput(JSON.stringify(selectedTool.exampleOutput, null, 2));
      setIsRunning(false);
    }, 600);
  };

  const handleCopyOutput = () => {
    if (executionOutput) {
      navigator.clipboard.writeText(executionOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border border-slate-800 p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Office MCP Server Tool Interactive Lab</h2>
            <p className="text-xs text-slate-300">
              Direct testing workbench for the <code>office-mcp</code> Model Context Protocol tools (Word, Excel, PowerPoint, PDF & OCR)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Tools List */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Available MCP Tools</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
              {MCP_TOOLS_DATA.length} Registered
            </span>
          </div>

          <div className="space-y-1.5 overflow-y-auto max-h-[560px] pr-1">
            {MCP_TOOLS_DATA.map((tool) => {
              const isSelected = selectedToolId === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => handleSelectTool(tool)}
                  className={`w-full text-left p-3 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-cyan-600/20 border border-cyan-500/40 text-white shadow-sm'
                      : 'bg-slate-800/40 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold truncate text-cyan-300">
                      {tool.name}()
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      {tool.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-snug">
                    {tool.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Parameter Runner & Output Viewer */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Tool Metadata Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  <span>{selectedTool.name}</span>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {selectedTool.category}
                  </span>
                </h3>
                <p className="text-xs text-slate-300 mt-1">{selectedTool.description}</p>
              </div>

              <button
                onClick={handleRunTool}
                disabled={isRunning}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 transition-all shrink-0"
              >
                {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                <span>Execute Tool</span>
              </button>
            </div>

            {/* Parameter Definitions */}
            <div>
              <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">
                Input Parameters
              </h4>
              <div className="space-y-1.5">
                {selectedTool.parameters.map((param) => (
                  <div
                    key={param.name}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-cyan-300 font-semibold">{param.name}</code>
                      <span className="text-[10px] text-slate-400">({param.type})</span>
                      {param.required && (
                        <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          required
                        </span>
                      )}
                    </div>
                    <span className="text-slate-400 text-[11px] truncate max-w-xs">{param.description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Input JSON Editor */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  JSON Arguments Payload
                </h4>
                <button
                  onClick={() => setInputJson(JSON.stringify(selectedTool.exampleInput, null, 2))}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300"
                >
                  Reset to Default
                </button>
              </div>
              <textarea
                value={inputJson}
                onChange={(e) => setInputJson(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 font-mono text-xs text-slate-200 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Execution Result */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs uppercase font-bold tracking-wider text-slate-300">
                  MCP Tool Return Response (JSON)
                </h4>
              </div>

              {executionOutput && (
                <button
                  onClick={handleCopyOutput}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              )}
            </div>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-300 min-h-[140px] max-h-[300px] overflow-y-auto">
              {executionOutput ? (
                <pre className="text-emerald-400 leading-relaxed whitespace-pre-wrap">{executionOutput}</pre>
              ) : (
                <div className="text-slate-500 italic flex items-center justify-center h-28">
                  Click "Execute Tool" to simulate runtime output from the MCP server...
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
