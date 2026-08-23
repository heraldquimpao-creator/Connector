import React, { useState } from "react";
import { TestCase } from "../types";
import { FlaskConical, Play, FileText, CheckCircle2, Copy, Sparkles, Database, FileSpreadsheet, RefreshCw } from "lucide-react";
import { formatBytes } from "../lib/utils";

interface TestCasesViewProps {
  testCases: TestCase[];
  loading: boolean;
}

export const TestCasesView: React.FC<TestCasesViewProps> = ({ testCases, loading }) => {
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null);
  const [copied, setCopied] = useState(false);
  const [running, setRunning] = useState(false);
  const [benchmarkResult, setBenchmarkResult] = useState<any>(null);

  React.useEffect(() => {
    if (testCases.length > 0 && !selectedTestCase) {
      setSelectedTestCase(testCases[0]);
    }
  }, [testCases, selectedTestCase]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunBenchmark = async () => {
    if (!selectedTestCase) return;
    setRunning(true);
    setBenchmarkResult(null);

    try {
      if (selectedTestCase.filename.includes("contract")) {
        const res = await fetch("/api/tools/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tool: "analyze_contract_risks",
            params: { contract_text: selectedTestCase.sampleContent, jurisdiction: "us" },
          }),
        });
        const data = await res.json();
        setBenchmarkResult(data);
      } else if (selectedTestCase.filename.includes("sales")) {
        const res = await fetch("/api/tools/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tool: "analyze_spreadsheet",
            params: { csv_data: selectedTestCase.sampleContent },
          }),
        });
        const data = await res.json();
        setBenchmarkResult(data);
      } else {
        const res = await fetch("/api/ai/run-skill", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            skillId: selectedTestCase.recommendedSkills[0] || "doc-parser",
            prompt: `Process and extract structured insights from ${selectedTestCase.name}`,
            inputData: selectedTestCase.sampleContent,
          }),
        });
        const data = await res.json();
        setBenchmarkResult({
          success: true,
          tool: selectedTestCase.recommendedSkills[0],
          result: { aiOutput: data.response },
        });
      }
    } catch (err: any) {
      setBenchmarkResult({ success: false, error: err.message });
    } finally {
      setRunning(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading test fixtures...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold mb-2 border border-purple-500/20">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Real-World Benchmark Datasets</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Test Fixtures & Quick Evaluation</h2>
        <p className="text-xs text-slate-400 mt-1">
          Verify skill accuracy, risk detection algorithms, spreadsheet parsing, and resume optimization with sample enterprise datasets.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Test Fixture List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            Available Fixtures ({testCases.length})
          </div>

          <div className="space-y-2">
            {testCases.map((tc) => {
              const isSelected = selectedTestCase?.id === tc.id;
              const isCsv = tc.filename.endsWith(".csv");
              const isMd = tc.filename.endsWith(".md");

              return (
                <div
                  key={tc.id}
                  id={`fixture-card-${tc.id.replace(/[^a-z0-9]/g, "-")}`}
                  onClick={() => {
                    setSelectedTestCase(tc);
                    setBenchmarkResult(null);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-purple-950/40 border-purple-500/80 shadow-md shadow-purple-950/50"
                      : "bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {isCsv ? (
                        <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                      ) : isMd ? (
                        <FileText className="w-4 h-4 text-blue-400" />
                      ) : (
                        <Database className="w-4 h-4 text-purple-400" />
                      )}
                      <div>
                        <h4 className="text-xs font-bold text-white">{tc.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">{tc.filename}</span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {tc.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{tc.description}</p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {tc.recommendedSkills.map((sk, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-purple-300 font-mono">
                        ⚡ {sk}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fixture Detail & Runner */}
        <div className="lg:col-span-8 space-y-6">
          {selectedTestCase && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedTestCase.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs font-mono text-purple-400">{selectedTestCase.filename}</span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-400">{selectedTestCase.sampleContent.length} characters</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopy(selectedTestCase.sampleContent)}
                    className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy Content"}</span>
                  </button>

                  <button
                    id="btn-run-benchmark"
                    onClick={handleRunBenchmark}
                    disabled={running}
                    className="flex items-center space-x-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
                  >
                    {running ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{running ? "Analyzing Fixture..." : "Run Test Benchmark"}</span>
                  </button>
                </div>
              </div>

              {/* Benchmark Result */}
              {benchmarkResult && (
                <div className="p-4 bg-slate-950 rounded-xl border border-purple-900/60 space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400">
                    <Sparkles className="w-4 h-4" />
                    <span>Benchmark Evaluation Completed:</span>
                  </div>
                  <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed">
                    {benchmarkResult.result?.aiOutput || JSON.stringify(benchmarkResult.result || benchmarkResult.error, null, 2)}
                  </pre>
                </div>
              )}

              {/* Sample Data Viewer */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-400">Fixture Raw Content:</div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-[420px] overflow-y-auto">
                  <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {selectedTestCase.sampleContent}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
