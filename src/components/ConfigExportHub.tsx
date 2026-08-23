import React, { useState } from 'react';
import { 
  DownloadCloud, 
  Terminal, 
  Copy, 
  Check, 
  Laptop, 
  Code, 
  Server, 
  BookOpen, 
  FolderPlus, 
  FileText,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const ConfigExportHub: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const claudeDesktopConfigJson = `{
  "mcpServers": {
    "office-mcp": {
      "command": "node",
      "args": [
        "/path/to/claude-office-skills/mcp-servers/office-mcp/dist/index.js"
      ],
      "env": {
        "OFFICE_MCP_KNOWLEDGE_DIR": "/path/to/claude-office-skills/mcp-servers/office-mcp/knowledge"
      }
    }
  }
}`;

  const customInstructions = `I have access to Claude Office Skills, a collection of 77+ professional skills for enterprise office workflows.
When I mention tasks or skills (such as "stock-analysis", "contract-review", "dcf-valuation", "invoice-generator", "resume-tailor", or "meeting-notes"):
1. Always apply the corresponding domain methodology and knowledge patterns (e.g. risk_patterns.json, completeness.json).
2. Proactively leverage the office-mcp tools (Word, Excel, PDF, and OCR) when handling file documents.
3. Structure outputs with clean executive summaries, tables, and quantified actionable next steps.`;

  const cursorRules = `# Project Rules for Claude Office Skills

## Skill Directory Structure
- Each skill lives in its own directory with a \`SKILL.md\` file.
- SKILL.md contains YAML frontmatter defining name, version, models, mcp tools, and capabilities.

## MCP Server Architecture
- \`office-mcp\` exposes tools for Word (.docx), Excel (.xlsx), PowerPoint (.pptx), and PDF extraction.
- Universal legal risk patterns are maintained under \`mcp-servers/office-mcp/knowledge/base/\`.

## Development Guidelines
- Always validate input schemas and return structured JSON or pristine Markdown tables.`;

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <DownloadCloud className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Integration & Configuration Hub</h2>
            <p className="text-xs text-slate-300">
              One-click setup configs for Claude Desktop Projects, Cursor IDE, MCP Servers, and Custom Instructions
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Claude Desktop MCP Config */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">Claude Desktop MCP Setup</h3>
              </div>
              <button
                onClick={() => handleCopy(claudeDesktopConfigJson, 'claude-desktop')}
                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
              >
                {copiedSection === 'claude-desktop' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'claude-desktop' ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Add this to your <code>claude_desktop_config.json</code> in <code>~/Library/Application Support/Claude/</code> (macOS) or <code>%APPDATA%/Claude/</code> (Windows).
            </p>

            <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto leading-relaxed">
              {claudeDesktopConfigJson}
            </pre>
          </div>

          <div className="p-3 bg-slate-800/40 rounded-xl text-xs text-slate-300 border border-slate-800">
            <strong>Quick Test:</strong> Restart Claude Desktop and verify the hammer 🔨 icon shows <code>office-mcp</code> with 18 tools active.
          </div>
        </div>

        {/* Card 2: Custom Instructions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Claude Custom Instructions</h3>
              </div>
              <button
                onClick={() => handleCopy(customInstructions, 'custom-inst')}
                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
              >
                {copiedSection === 'custom-inst' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'custom-inst' ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Paste this into your Claude Desktop or Web <strong>Settings &gt; Custom Instructions</strong>.
            </p>

            <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-amber-300 overflow-x-auto max-h-[160px] leading-relaxed whitespace-pre-wrap">
              {customInstructions}
            </pre>
          </div>

          <div className="p-3 bg-slate-800/40 rounded-xl text-xs text-slate-300 border border-slate-800">
            Enables automatic skill recognition whenever you mention financial, legal, or document tasks.
          </div>
        </div>

        {/* Card 3: Cursor IDE Rules */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Cursor IDE Rules (.mdc)</h3>
              </div>
              <button
                onClick={() => handleCopy(cursorRules, 'cursor-rules')}
                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
              >
                {copiedSection === 'cursor-rules' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'cursor-rules' ? 'Copied' : 'Copy Rules'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Add to <code>.cursor/rules/project-rules.mdc</code> for seamless Cursor Agent skill execution.
            </p>

            <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto max-h-[160px] leading-relaxed whitespace-pre-wrap">
              {cursorRules}
            </pre>
          </div>

          <div className="p-3 bg-slate-800/40 rounded-xl text-xs text-slate-300 border border-slate-800">
            Enforces strict formatting, risk pattern citations, and schema validation across Cursor sessions.
          </div>
        </div>

      </div>

      {/* Method 1: Claude Desktop Project Knowledge Setup Guide */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <FolderPlus className="w-5 h-5 text-indigo-400" />
          <span>Recommended Setup: Claude Desktop Project Knowledge (Step-by-Step)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2">
            <div className="font-bold text-indigo-300 text-sm">Step 1: Create Project</div>
            <p className="text-slate-400 leading-relaxed">
              Open Claude Desktop, click <strong>Projects</strong> in the sidebar, create a new Project named <code>Office Skills</code> or <code>工作技能</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2">
            <div className="font-bold text-indigo-300 text-sm">Step 2: Add Files to Knowledge</div>
            <p className="text-slate-400 leading-relaxed">
              Click <strong>Add Content</strong> and add <code>SKILLS_INDEX.md</code>, <code>KNOWLEDGE_INDEX.md</code>, or the specific skill folders you use regularly.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2">
            <div className="font-bold text-indigo-300 text-sm">Step 3: Ask in Chat</div>
            <p className="text-slate-400 leading-relaxed">
              Simply prompt: <em>"Use the stock-analysis skill to evaluate Apple (AAPL)"</em> or <em>"Review this contract for risks"</em>.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
