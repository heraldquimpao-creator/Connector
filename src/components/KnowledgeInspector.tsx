import React, { useState } from "react";
import { KnowledgeFile } from "../types";
import { BookOpen, ShieldAlert, CheckSquare, Globe, FileCode, Search, Copy, CheckCircle2 } from "lucide-react";

interface KnowledgeInspectorProps {
  knowledgeFiles: KnowledgeFile[];
  loading: boolean;
}

export const KnowledgeInspector: React.FC<KnowledgeInspectorProps> = ({ knowledgeFiles, loading }) => {
  const [selectedFile, setSelectedFile] = useState<KnowledgeFile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (knowledgeFiles.length > 0 && !selectedFile) {
      setSelectedFile(knowledgeFiles[0]);
    }
  }, [knowledgeFiles, selectedFile]);

  const handleCopy = (content: any) => {
    navigator.clipboard.writeText(JSON.stringify(content, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading structured knowledge base...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-2 border border-cyan-500/20">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Extensible Legal & Business Knowledge Base</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Structured Knowledge Rules & Patterns</h2>
        <p className="text-xs text-slate-400 mt-1">
          Machine-readable risk schemas, completeness checklists, and jurisdictional legal rules consumed by Claude Skills & Agents.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Files selection */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            Knowledge Modules ({knowledgeFiles.length})
          </div>

          <div className="space-y-2">
            {knowledgeFiles.map((kf) => {
              const isSelected = selectedFile?.id === kf.id;
              const isJurisdiction = kf.category.includes("jurisdictions");
              const isRisk = kf.id.includes("risk");

              return (
                <div
                  key={kf.id}
                  id={`kf-item-${kf.id}`}
                  onClick={() => setSelectedFile(kf)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-cyan-950/40 border-cyan-500/80 shadow-md shadow-cyan-950/50"
                      : "bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {isJurisdiction ? (
                        <Globe className="w-4 h-4 text-cyan-400" />
                      ) : isRisk ? (
                        <ShieldAlert className="w-4 h-4 text-rose-400" />
                      ) : (
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                      )}
                      <span className="text-xs font-bold text-white font-mono">{kf.name}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase font-mono">
                      {kf.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono truncate">{kf.path}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Knowledge Detail View */}
        <div className="lg:col-span-8">
          {selectedFile && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-mono">{selectedFile.name}</h3>
                  <p className="text-xs text-cyan-400 font-mono mt-0.5">{selectedFile.path}</p>
                </div>

                <button
                  onClick={() => handleCopy(selectedFile.content)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "JSON Copied" : "Copy JSON"}</span>
                </button>
              </div>

              {/* JSON Viewer */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-[550px] overflow-y-auto">
                <pre className="text-xs font-mono text-cyan-300/90 whitespace-pre-wrap leading-relaxed">
                  {JSON.stringify(selectedFile.content, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
