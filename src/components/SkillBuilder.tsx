import React, { useState } from 'react';
import { 
  PlusCircle, 
  Code, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Cpu, 
  Server,
  Play,
  FileCode
} from 'lucide-react';

export const SkillBuilder: React.FC = () => {
  const [skillName, setSkillName] = useState<string>('custom-tax-analyzer');
  const [displayName, setDisplayName] = useState<string>('Corporate Tax & Deduction Auditor');
  const [description, setDescription] = useState<string>('Audit corporate balance sheets for eligible R&D tax credits, depreciation allowances, and jurisdictional tax rate differences.');
  const [category, setCategory] = useState<string>('finance');
  const [department, setDepartment] = useState<string>('Finance & Tax');
  const [tags, setTags] = useState<string>('tax, audit, corporate-finance, deductions, compliance');
  const [models, setModels] = useState<string>('claude-3-7-sonnet, gpt-4o');
  const [mcpTools, setMcpTools] = useState<string>('read_spreadsheet, analyze_spreadsheet, apply_formulas');
  const [knowledgeBases, setKnowledgeBases] = useState<string>('risk_patterns.json, us.json');
  const [capabilities, setCapabilities] = useState<string>('tax_deduction_audit, r_and_d_credit_calculation, compliance_reporting');
  const [samplePrompt, setSamplePrompt] = useState<string>('Audit our Q4 corporate expenditure ledger for eligible Section 174 R&D capitalization credits.');

  const [copied, setCopied] = useState<boolean>(false);

  // Generate standardized SKILL.md markdown
  const generatedMarkdown = React.useMemo(() => {
    const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean);
    const modelList = models.split(',').map((m) => m.trim()).filter(Boolean);
    const toolList = mcpTools.split(',').map((t) => t.trim()).filter(Boolean);
    const kbList = knowledgeBases.split(',').map((k) => k.trim()).filter(Boolean);
    const capList = capabilities.split(',').map((c) => c.trim()).filter(Boolean);

    return `---
# ═══════════════════════════════════════════════════════════════════════════════
# CLAUDE OFFICE SKILL - Enhanced Metadata v2.0
# ═══════════════════════════════════════════════════════════════════════════════

# Basic Information
name: ${skillName}
display_name: "${displayName}"
description: "${description}"
version: "1.0.0"
author: "custom-author"
license: MIT

# Categorization
category: ${category}
department: ${department}
tags:
${tagList.map((t) => `  - ${t}`).join('\n')}

# AI Model Compatibility
models:
  recommended:
${modelList.map((m) => `    - ${m}`).join('\n')}

# MCP Tools Integration
mcp:
  server: office-mcp
  tools:
${toolList.map((t) => `    - ${t}`).join('\n')}

# Knowledge Base Integration
knowledge:
  base:
${kbList.map((k) => `    - mcp-servers/office-mcp/knowledge/base/${k}`).join('\n')}

# Skill Capabilities
capabilities:
${capList.map((c) => `  - ${c}`).join('\n')}

---

# ${displayName}

## Description
${description}

## Usage & Prompt Template
\`\`\`
${samplePrompt}
\`\`\`

## Methodology
1. Ingest document/spreadsheet using MCP tools
2. Apply statutory tax and deduction guidelines
3. Generate structured audit findings and summary tables
`;
  }, [skillName, displayName, description, category, department, tags, models, mcpTools, knowledgeBases, capabilities, samplePrompt]);

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generatedMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([generatedMarkdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SKILL.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Interactive AI Skill Builder & Schema Validator</h2>
            <p className="text-xs text-slate-300">
              Create production-ready <code>SKILL.md</code> files compatible with Claude Desktop Projects, ClawdHub, and Cursor Agent rules.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Input Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs uppercase font-bold tracking-wider text-slate-300 flex items-center gap-2">
            <FileCode className="w-4 h-4 text-indigo-400" />
            <span>Skill Metadata Configuration</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Unique Slug (ID)</label>
                <input
                  type="text"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Display Title</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Detailed Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="legal">Legal & Compliance</option>
                  <option value="finance">Finance & Investment</option>
                  <option value="hr">HR & Talent</option>
                  <option value="research">Research & Strategy</option>
                  <option value="document">Document & Office</option>
                  <option value="pdf">PDF Tools</option>
                  <option value="automation">Automation & Workflows</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Tags (Comma-separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">MCP Tools (Comma-separated)</label>
              <input
                type="text"
                value={mcpTools}
                onChange={(e) => setMcpTools(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Sample Invocation Prompt</label>
              <textarea
                value={samplePrompt}
                onChange={(e) => setSamplePrompt(e.target.value)}
                rows={2}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right: Live Markdown Preview & Export */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-2 flex-1 flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-emerald-400" />
                <span className="text-xs uppercase font-bold tracking-wider text-slate-300">
                  Live Generated SKILL.md
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopyMarkdown}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleDownloadFile}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            <pre className="flex-1 w-full bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 overflow-y-auto max-h-[460px] leading-relaxed whitespace-pre-wrap">
              {generatedMarkdown}
            </pre>
          </div>

          <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Schema validation passed! Ready to drop into your Claude Desktop or Cursor project.</span>
          </div>
        </div>

      </div>

    </div>
  );
};
