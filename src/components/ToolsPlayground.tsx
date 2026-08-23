import React, { useState, useRef } from "react";
import { ToolDef, ToolExecutionResult } from "../types";
import { Wrench, Play, Upload, Download, CheckCircle2, AlertCircle, FileSpreadsheet, FileText, Sparkles, RefreshCw } from "lucide-react";

interface ToolsPlaygroundProps {
  tools: ToolDef[];
  loading: boolean;
}

export const ToolsPlayground: React.FC<ToolsPlaygroundProps> = ({ tools, loading }) => {
  const [selectedTool, setSelectedTool] = useState<ToolDef | null>(null);
  const [params, setParams] = useState<Record<string, any>>({});
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<ToolExecutionResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (tools.length > 0 && !selectedTool) {
      handleSelectTool(tools[0]);
    }
  }, [tools, selectedTool]);

  const handleSelectTool = (tool: ToolDef) => {
    setSelectedTool(tool);
    setResult(null);
    const initialParams: Record<string, any> = {};
    for (const p of tool.parameters) {
      initialParams[p.name] = p.default !== undefined ? p.default : "";
    }
    setParams(initialParams);
  };

  const handleParamChange = (name: string, value: any) => {
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setUploadedFile(data);
        // Automatically populate relevant params
        if (params.file_path !== undefined) {
          handleParamChange("file_path", data.storedPath);
        }
        if (params.csv_data !== undefined && data.textPreview) {
          handleParamChange("csv_data", data.textPreview);
        }
        if (params.contract_text !== undefined && data.textPreview) {
          handleParamChange("contract_text", data.textPreview);
        }
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleExecute = async () => {
    if (!selectedTool) return;
    setExecuting(true);
    setResult(null);

    try {
      const res = await fetch("/api/tools/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: selectedTool.name,
          params,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setResult({
        success: false,
        tool: selectedTool.name,
        error: err.message,
        durationMs: 0,
      });
    } finally {
      setExecuting(false);
    }
  };

  const downloadBase64File = (base64Data: string, filename: string) => {
    const link = document.createElement("a");
    link.href = base64Data;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading MCP Tools Playground...</div>;
  }

  const categoryColor: Record<string, string> = {
    pdf: "text-rose-400 border-rose-900/50 bg-rose-950/40",
    spreadsheet: "text-emerald-400 border-emerald-900/50 bg-emerald-950/40",
    document: "text-blue-400 border-blue-900/50 bg-blue-950/40",
    conversion: "text-purple-400 border-purple-900/50 bg-purple-950/40",
    knowledge: "text-amber-400 border-amber-900/50 bg-amber-950/40",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-2 border border-emerald-500/20">
            <Wrench className="w-3.5 h-3.5" />
            <span>39 Document & Data Tools</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">MCP Tool Execution Playground</h2>
          <p className="text-xs text-slate-400 mt-1">
            Test and run high-performance document tools (PDF manipulation, Excel formulas & pivots, Word generation, and Legal Risk checks) live.
          </p>
        </div>

        {/* Upload Button */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.docx,.xlsx,.xls,.csv,.txt,.md,.json"
          />
          <button
            id="btn-upload-file"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition-colors"
          >
            <Upload className="w-4 h-4 text-indigo-400" />
            <span>{uploading ? "Uploading..." : uploadedFile ? `Loaded: ${uploadedFile.filename}` : "Upload Test File"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Tools List */}
        <div className="lg:col-span-4 space-y-2 max-h-[750px] overflow-y-auto pr-1">
          {tools.map((t) => {
            const isSelected = selectedTool?.name === t.name;
            return (
              <div
                key={t.name}
                id={`tool-item-${t.name}`}
                onClick={() => handleSelectTool(t)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-indigo-950/60 border-indigo-500 shadow-md shadow-indigo-950/50"
                    : "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white">{t.name}</span>
                  <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded border ${categoryColor[t.category] || "text-slate-400"}`}>
                    {t.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">{t.description}</p>
              </div>
            );
          })}
        </div>

        {/* Right: Parameter Form & Live Execution Output */}
        <div className="lg:col-span-8 space-y-6">
          {selectedTool && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
              {/* Tool Header */}
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-white font-mono">{selectedTool.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded border ${categoryColor[selectedTool.category]}`}>
                      {selectedTool.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{selectedTool.description}</p>
                </div>
              </div>

              {/* Dynamic Form Parameters */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Tool Parameters</h4>
                <div className="space-y-3">
                  {selectedTool.parameters.map((param) => {
                    const isLongText = param.name.includes("text") || param.name.includes("data") || param.name.includes("markdown") || param.name.includes("html") || param.name.includes("sections");
                    return (
                      <div key={param.name} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-mono font-medium text-indigo-300">
                            {param.name} {param.required && <span className="text-rose-400">*</span>}
                          </label>
                          <span className="text-[10px] text-slate-500">{param.description}</span>
                        </div>

                        {param.options ? (
                          <select
                            value={params[param.name] ?? ""}
                            onChange={(e) => handleParamChange(param.name, e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                          >
                            {param.options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : isLongText ? (
                          <textarea
                            rows={4}
                            value={params[param.name] ?? ""}
                            onChange={(e) => handleParamChange(param.name, e.target.value)}
                            placeholder={`Enter ${param.name}...`}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                          />
                        ) : (
                          <input
                            type={param.type === "number" ? "number" : "text"}
                            value={params[param.name] ?? ""}
                            onChange={(e) => handleParamChange(param.name, e.target.value)}
                            placeholder={`Enter ${param.name}...`}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                <button
                  id="btn-run-mcp-tool"
                  onClick={handleExecute}
                  disabled={executing}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
                >
                  {executing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  <span>{executing ? "Executing Tool..." : `Run ${selectedTool.name}`}</span>
                </button>
              </div>

              {/* Execution Result Box */}
              {result && (
                <div className="border-t border-slate-800 pt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {result.success ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                      )}
                      <span className="text-xs font-semibold text-white">
                        {result.success ? "Execution Succeeded" : "Execution Failed"}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      Duration: {result.durationMs}ms
                    </span>
                  </div>

                  {/* Special Renderers based on Tool Result */}
                  {result.result?.base64Data && (
                    <div className="p-4 bg-indigo-950/40 rounded-xl border border-indigo-800/60 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white">Generated Document Ready</div>
                        <div className="text-[11px] text-slate-300 mt-0.5">
                          Base64 payload ({Math.round(result.result.base64Data.length / 1024)} KB)
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const ext = result.result.base64Data.includes("pdf") ? "pdf" : result.result.base64Data.includes("sheet") ? "xlsx" : "docx";
                          downloadBase64File(result.result.base64Data, `mcp_output.${ext}`);
                        }}
                        className="flex items-center space-x-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Output File</span>
                      </button>
                    </div>
                  )}

                  {result.result?.overallRiskScore !== undefined && (
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-300">Contract Compliance Score:</span>
                        <span className={`text-xs px-2.5 py-1 rounded font-bold ${
                          result.result.overallRiskScore > 60 ? "bg-rose-950 text-rose-400 border border-rose-800" :
                          result.result.overallRiskScore > 30 ? "bg-amber-950 text-amber-400 border border-amber-800" :
                          "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        }`}>
                          {result.result.riskLevel} ({result.result.overallRiskScore}/100)
                        </span>
                      </div>

                      {result.result.identifiedRisks?.length > 0 && (
                        <div className="space-y-1.5">
                          <div className="text-xs font-medium text-rose-400">Identified Risk Patterns:</div>
                          {result.result.identifiedRisks.map((r: any, idx: number) => (
                            <div key={idx} className="p-2 bg-rose-950/20 border border-rose-900/30 rounded text-xs text-rose-300">
                              <span className="font-semibold font-mono">[{r.severity}] {r.rule}:</span> {r.recommendation}
                            </div>
                          ))}
                        </div>
                      )}

                      {result.result.missingClauses?.length > 0 && (
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-amber-400">Missing Standard Clauses:</div>
                          <div className="flex flex-wrap gap-1">
                            {result.result.missingClauses.map((c: string, idx: number) => (
                              <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-800/40">
                                ⚠ {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Raw JSON viewer */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-72 overflow-y-auto">
                    <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {JSON.stringify(result.result || result.error, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
