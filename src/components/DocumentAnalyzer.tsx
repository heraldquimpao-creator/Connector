import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Scale, 
  FileText, 
  Copy, 
  Check, 
  Sparkles, 
  RefreshCw, 
  HelpCircle,
  ExternalLink,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { RISK_PATTERNS, COMPLETENESS_CHECKLIST, JURISDICTIONS } from '../data/knowledgeData';
import { RiskPattern } from '../types';

export const DocumentAnalyzer: React.FC = () => {
  const [contractText, setContractText] = useState<string>(`软件开发服务合同

甲方：北京科技发展有限公司
乙方：上海智能软件有限公司

第二条 合同金额：人民币壹佰万元（¥1,000,000.00）
- 签订后7个工作日内支付30%预付款
- 验收通过后7个工作日内支付70%

第三条 项目期限：6个月
- 因乙方原因延期，每天扣除合同总额0.5%违约金

第四条 知识产权：全部归甲方所有，包括乙方履行合同前所持有的技术架构

第五条 保密条款：永久保密义务，违反需赔偿全部损失及商誉贬损

第七条 责任限制：乙方最高赔偿不超过合同总金额，不对间接损失负责

第九条 争议解决：甲方所在地人民法院`);

  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>('china_prc');
  const [userRole, setUserRole] = useState<'contractor' | 'client'>('contractor');
  const [analyzed, setAnalyzed] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'risks' | 'completeness' | 'jurisdictions' | 'redline'>('risks');
  const [copied, setCopied] = useState<boolean>(false);

  // Risk detection logic matching against keywords
  const detectedRisks = React.useMemo(() => {
    const textLower = contractText.toLowerCase();
    const matches: { pattern: RiskPattern; matchedKeyword: string }[] = [];

    RISK_PATTERNS.forEach((pattern) => {
      const allKeywords = [...pattern.keywords, ...pattern.keywordsZh];
      const matched = allKeywords.find((kw) => textLower.includes(kw.toLowerCase()));
      if (matched) {
        matches.push({ pattern, matchedKeyword: matched });
      }
    });

    return matches;
  }, [contractText]);

  // Completeness items check
  const completenessStatus = React.useMemo(() => {
    const textLower = contractText.toLowerCase();
    return COMPLETENESS_CHECKLIST.map((item) => {
      let isPresent = false;
      if (item.id === 'parties' && (textLower.includes('甲方') || textLower.includes('party a') || textLower.includes('company'))) isPresent = true;
      if (item.id === 'consideration' && (textLower.includes('金额') || textLower.includes('元') || textLower.includes('fee') || textLower.includes('$'))) isPresent = true;
      if (item.id === 'scope' && (textLower.includes('期限') || textLower.includes('服务') || textLower.includes('scope') || textLower.includes('months'))) isPresent = true;
      if (item.id === 'ip_rights' && (textLower.includes('知识产权') || textLower.includes('intellectual property') || textLower.includes('ip'))) isPresent = true;
      if (item.id === 'confidentiality' && (textLower.includes('保密') || textLower.includes('confidential'))) isPresent = true;
      if (item.id === 'liability_cap' && (textLower.includes('责任限制') || textLower.includes('最高赔偿') || textLower.includes('liability'))) isPresent = true;
      if (item.id === 'termination' && (textLower.includes('解除') || textLower.includes('终止') || textLower.includes('termination'))) isPresent = true;
      if (item.id === 'dispute_resolution' && (textLower.includes('法院') || textLower.includes('仲裁') || textLower.includes('争议') || textLower.includes('jurisdiction'))) isPresent = true;

      return {
        ...item,
        present: isPresent
      };
    });
  }, [contractText]);

  const activeJurisdiction = JURISDICTIONS.find((j) => j.id === selectedJurisdiction) || JURISDICTIONS[0];

  const handleCopyRedline = () => {
    const redline = `### 建议修改之修正条款（针对受托方/乙方）：

1. 第三条【延期违约金修正】：
   "因乙方自身原因导致项目延期的，每延期一日，乙方应按该阶段应付金额的 0.05% 向甲方支付违约金，且累计违约金总额最高不得超过本合同总金额的 5%。因甲方未及时提供必要资料、确认延误或第三方原因导致的延期，工期相应顺延。"

2. 第四条【知识产权归属保留】：
   "定制开发成果交付并结清款项后，其著作权归甲方所有。乙方在履行合同前已拥有的基础架构、通用代码库及开发工具之知识产权仍归乙方所有，乙方在此向甲方授予不可撤销的、非排他的商业使用许可。"

3. 第五条【保密义务期限限定】：
   "双方在合同履行过程中知悉的商业秘密及技术资料负有保密义务，保密期限为合同终止之日起三年。依法公开之信息或依司法指令披露之情形除外。"`;

    navigator.clipboard.writeText(redline);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Contract Risk & Completeness Studio</h2>
              <p className="text-xs text-slate-300">
                Grounded in <code>risk_patterns.json</code>, <code>completeness.json</code>, and US / California / China / EU legal jurisdiction rules
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedJurisdiction}
              onChange={(e) => setSelectedJurisdiction(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {JURISDICTIONS.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.flag} {j.region}
                </option>
              ))}
            </select>

            <div className="flex bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
              <button
                onClick={() => setUserRole('contractor')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  userRole === 'contractor' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Party B (Vendor)
              </button>
              <button
                onClick={() => setUserRole('client')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  userRole === 'client' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Party A (Buyer)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Analyzer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Box: Contract Document Input */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-2 flex-1 flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span className="text-xs uppercase font-bold tracking-wider text-slate-300">
                  Contract Document Text
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                {contractText.length} characters
              </span>
            </div>

            <textarea
              value={contractText}
              onChange={(e) => setContractText(e.target.value)}
              rows={16}
              placeholder="Paste contract clauses, NDA, or service agreement here..."
              className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Live scanning: <strong className="text-emerald-400">Active</strong>
            </span>
            <button
              onClick={() => setContractText(`软件开发服务合同\n\n甲方：北京科技发展有限公司\n乙方：上海智能软件有限公司\n\n第二条 合同金额：人民币壹佰万元（¥1,000,000.00）\n- 签订后7个工作日内支付30%预付款\n- 验收通过后7个工作日内支付70%\n\n第三条 项目期限：6个月\n- 因乙方原因延期，每天扣除合同总额0.5%违约金\n\n第四条 知识产权：全部归甲方所有，包括乙方履行合同前所持有的技术架构\n\n第五条 保密条款：永久保密义务，违反需赔偿全部损失及商誉贬损\n\n第七条 责任限制：乙方最高赔偿不超过合同总金额，不对间接损失负责\n\n第九条 争议解决：甲方所在地人民法院`)}
              className="text-indigo-400 hover:text-indigo-300"
            >
              Reset Sample Contract
            </button>
          </div>
        </div>

        {/* Right Box: Risk Patterns & Completeness Inspection */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col space-y-4">
          
          {/* Sub Navigation */}
          <div className="flex space-x-1 border-b border-slate-800 pb-2">
            {[
              { id: 'risks', label: `Flagged Risks (${detectedRisks.length})`, icon: AlertTriangle },
              { id: 'completeness', label: `Checklist (${completenessStatus.filter(c => c.present).length}/${completenessStatus.length})`, icon: CheckCircle2 },
              { id: 'jurisdictions', label: 'Jurisdiction Law', icon: Scale },
              { id: 'redline', label: 'Redline Patch', icon: Sparkles }
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto max-h-[460px] space-y-3 pr-1 text-xs">
            
            {/* 1. Flagged Risks */}
            {activeTab === 'risks' && (
              <div className="space-y-3">
                {detectedRisks.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <p className="font-semibold text-slate-200">No major standard risk patterns detected</p>
                    <p className="text-xs text-slate-500 mt-1">Review completeness checklist to confirm essential clauses.</p>
                  </div>
                ) : (
                  detectedRisks.map(({ pattern, matchedKeyword }, index) => {
                    const isHigh = pattern.severity === 'high';
                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-xl border transition-all ${
                          isHigh
                            ? 'bg-rose-950/20 border-rose-800/40 text-slate-200'
                            : 'bg-amber-950/20 border-amber-800/40 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                              isHigh ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}>
                              {pattern.severity} RISK
                            </span>
                            <span className="font-bold text-sm text-white">
                              {pattern.name} ({pattern.nameZh})
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                            Keyword: "{matchedKeyword}"
                          </span>
                        </div>

                        <p className="text-slate-300 text-xs mb-2 leading-relaxed">
                          {pattern.descriptionZh || pattern.description}
                        </p>

                        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-indigo-300">
                          <strong>💡 谈判建议:</strong> {pattern.recommendationZh || pattern.recommendation}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* 2. Completeness Checklist */}
            {activeTab === 'completeness' && (
              <div className="space-y-2">
                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-slate-300 text-xs">
                  A standard commercial contract requires 8 foundational clause groups to ensure full enforceability.
                </div>

                {completenessStatus.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-start justify-between p-3 rounded-xl border transition-colors ${
                      item.present
                        ? 'bg-slate-800/40 border-slate-700/60'
                        : 'bg-rose-950/10 border-rose-800/30'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {item.present ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <div className="font-semibold text-xs text-white">
                          {item.name} ({item.nameZh})
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {item.descriptionZh}
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded shrink-0 ${
                      item.present
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                    }`}>
                      {item.present ? 'Present' : 'Missing'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* 3. Jurisdictions Law */}
            {activeTab === 'jurisdictions' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{activeJurisdiction.flag}</span>
                    <h3 className="font-bold text-sm text-white">{activeJurisdiction.region}</h3>
                  </div>

                  <div>
                    <h4 className="font-semibold text-xs text-indigo-300 mb-1">Key Legal Concepts & Statutes</h4>
                    <div className="space-y-2">
                      {activeJurisdiction.laws.map((law, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                          <div className="font-bold text-xs text-slate-200">{law.name}</div>
                          <div className="text-[11px] text-slate-400 mt-1">{law.summary}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-xs text-rose-300 mb-1">Common Pitfalls & Traps</h4>
                    <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1">
                      {activeJurisdiction.pitfalls.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Redline Patch */}
            {activeTab === 'redline' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">
                    Pro Se Counsel Redline Revisions:
                  </span>
                  <button
                    onClick={handleCopyRedline}
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Revised Clauses'}</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-3 leading-relaxed">
                  <div>
                    <span className="text-rose-400 block">- 第三条：每天扣除合同总额0.5%违约金 (原条款)</span>
                    <span className="text-emerald-400 block">+ 第三条【修订】：因乙方自身原因导致项目延期的，每延期一日，按该阶段应付金额的 0.05% 支付违约金，最高累计不超过 5%。</span>
                  </div>

                  <div>
                    <span className="text-rose-400 block">- 第四条：知识产权全部归甲方所有 (原条款)</span>
                    <span className="text-emerald-400 block">+ 第四条【修订】：定制成果归甲方；乙方原有底层框架及通用组件知识产权仍归乙方所有，并授予甲方非排他使用许可。</span>
                  </div>

                  <div>
                    <span className="text-rose-400 block">- 第五条：永久保密义务 (原条款)</span>
                    <span className="text-emerald-400 block">+ 第五条【修订】：保密期限限定为合同终止后 3 年；法定公开信息除外。</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
