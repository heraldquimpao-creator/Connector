import { TestCase } from '../types';

export const TEST_CASES_DATA: TestCase[] = [
  {
    id: 'test-contract-review',
    title: 'Contract Review: Vendor IT Service Agreement',
    skillId: 'contract-review',
    agentId: 'legal-specialist',
    category: 'Legal',
    description: 'Review a 1,000,000 RMB software development contract for Party B (Vendor) flagging 0.5%/day delay penalties, full IP transfer, and perpetual confidentiality.',
    prompt: `请帮我审查以下合同，我是乙方（受托方）。请识别潜在风险并给出建议：

---
软件开发服务合同

甲方：北京科技发展有限公司
乙方：上海智能软件有限公司

第二条 合同金额：人民币壹佰万元（¥1,000,000.00）
- 签订后7个工作日内支付30%预付款
- 验收通过后7个工作日内支付70%

第三条 项目期限：6个月
- 因乙方原因延期，每天扣除合同总额0.5%违约金

第四条 知识产权：全部归甲方所有

第五条 保密条款：永久保密义务，违反需赔偿全部损失

第七条 责任限制：乙方最高赔偿不超过合同总金额，不对间接损失负责

第九条 争议解决：甲方所在地人民法院
---

请重点关注：违约金是否过高？保密条款是否合理？责任限制是否有效保护我方？`,
    expectedOutputSummary: 'Detailed clause-by-clause analysis with risk severity rating, comparison against Article 585 of PRC Civil Code, and proposed revision redline text.',
    mockResponse: `### ⚖️ 合同审查与风险评估报告（针对乙方/受托方）

**综合风险等级：中高风险 (Medium-High)**

---

#### 1. 核心风险条款识别与修改建议

| 条款 | 现状分析 | 风险等级 | 法律依据与修改建议 |
| :--- | :--- | :---: | :--- |
| **第三条 延期违约金** | 每日扣除合同总额 **0.5%** | 🔴 **高风险** | **严重过高！** 依据《民法典》第585条，违约金过高可请求酌减。每日0.5%意味着延期20天即达合同额10%。<br>**修改建议：** 改为每日万分之五（0.05%），且设定累计总上限不超过合同总额的5%，并约定甲方延期确认不计入乙方工期。 |
| **第四条 知识产权** | 全部归甲方所有 | 🟡 **中风险** | 未对乙方**已有背景知识产权（Pre-existing IP）**与底层开发框架做保留声明。<br>**修改建议：** 增加除外条款：“乙方交付物中定制开发部分知识产权归甲方；乙方原有核心算法、框架及通用组件之知识产权仍归乙方所有，乙方授予甲方永久非排他使用许可。” |
| **第五条 保密条款** | 永久保密义务，赔偿全部损失 | 🟡 **中风险** | 商业合作通常约定2-3年保密期，且“赔偿全部损失”未排除间接损失。<br>**修改建议：** 限定保密期限为合同终止后2年（商业秘密除外），赔偿责任受第七条责任限制约束。 |
| **第七条 责任限制** | 最高赔偿限额为总金额，排除间接损失 | 🟢 **已有效保护** | 本条款对乙方非常有利，设立了合同金额的绝对赔偿上限并有效排除了间接损失（Consequential Damages）。建议保留并与第五条保密及第三条违约金进行衔接。 |
| **第九条 争议解决** | 甲方所在地人民法院 | ⚪ **低风险** | 原告就被告或双方约定管辖均合法有效。如协商空间较大，建议修改为“原告所在地人民法院”或“中国国际经济贸易仲裁委员会（CIETAC）上海分会”。 |

---

#### 2. 推荐修订文本（Redline 条款草案）

\`\`\`markdown
第三条【修订】：因乙方自身原因导致项目延期的，每延期一日，乙方应按该阶段应付金额的 0.05% 向甲方支付违约金，且累计违约金总额最高不得超过本合同总金额的 5%。因甲方未及时提供必要资料、确认延误或第三方原因导致的延期，工期相应顺延。

第四条【修订】：定制开发成果交付并结清款项后，其著作权归甲方所有。乙方在履行合同前已拥有的基础架构、通用代码库及开发工具之知识产权仍归乙方所有，乙方在此向甲方授予不可撤销的、非排他的商业使用许可。
\`\`\``
  },
  {
    id: 'test-invoice-generator',
    title: 'Invoice Generator: AI Consulting & Development',
    skillId: 'invoice-generator',
    agentId: 'data-analyst',
    category: 'Finance',
    description: 'Generate a formal VAT invoice for AI consulting, system development, and training with itemized subtotal, 6% tax calculation, and payment terms.',
    prompt: `请帮我生成一份发票：

开票方信息：
- 公司：上海创新科技有限公司
- 地址：上海市浦东新区张江路500号
- 联系电话：021-12345678
- 银行账户：招商银行上海分行 6222-xxxx-xxxx-1234

客户信息：
- 公司：北京互联网有限公司
- 地址：北京市朝阳区望京SOHO
- 联系人：李经理

服务项目：
| 项目 | 单位 | 数量 | 单价(元) |
|---|---|---|---|
| AI咨询服务 | 天 | 10 | 5000 |
| 系统开发 | 项 | 1 | 80000 |
| 培训服务 | 场 | 3 | 3000 |

税率：6%
付款条件：收到发票后15天内付款
发票编号：INV-2025-0130`,
    expectedOutputSummary: 'Structured commercial invoice with line items, subtotal (¥139,000.00), 6% VAT (¥8,340.00), total amount due (¥147,340.00), and remittance details.',
    mockResponse: `### 📄 商业发票 / COMMERCIAL INVOICE

**发票编号 (Invoice No.):** \`INV-2025-0130\`  
**开票日期 (Issue Date):** 2025-01-30  
**付款截止日期 (Due Date):** 2025-02-14 (收到发票后15天内)

---

#### 🏢 交易双方主体信息

**【开票方 / Biller】**  
- **公司名称:** 上海创新科技有限公司  
- **注册地址:** 上海市浦东新区张江路500号  
- **联系电话:** 021-12345678  
- **开户银行:** 招商银行上海分行  
- **银行账号:** \`6222-xxxx-xxxx-1234\`

**【客户方 / Client】**  
- **公司名称:** 北京互联网有限公司  
- **注册地址:** 北京市朝阳区望京SOHO  
- **联系人:** 李经理

---

#### 📊 服务明细清单 (Itemized Breakdown)

| 序号 | 项目描述 (Description) | 单位 | 数量 | 单价 (¥) | 金额小计 (¥) |
| :---: | :--- | :---: | :---: | :---: | :---: |
| 1 | AI咨询服务 (AI Strategic Consulting) | 天 | 10 | 5,000.00 | 50,000.00 |
| 2 | 系统开发 (Custom System Development) | 项 | 1 | 80,000.00 | 80,000.00 |
| 3 | 培训服务 (AI Engineering Workshop) | 场 | 3 | 3,000.00 | 9,000.00 |

---

#### 💰 结算汇总 (Summary)

- **不含税金额小计 (Subtotal):** ¥139,000.00
- **增值税税率 (VAT Rate):** 6%
- **税额 (Tax Amount):** ¥8,340.00
- **应付总金额 (Total Amount Due):** **¥147,340.00**
- **金额大写 (In Words):** 人民币壹拾肆万柒仟叁佰肆拾元整`
  },
  {
    id: 'test-data-analysis',
    title: 'Sales & Marketing ROI Regression Analysis',
    skillId: 'data-analysis',
    agentId: 'data-analyst',
    category: 'Finance',
    description: 'Perform correlation, ROI calculations, product growth benchmarking, and forecast regression on 6-month sales and marketing datasets.',
    prompt: `请分析以下销售数据并给出洞察：

| 月份 | 产品A销量 | 产品B销量 | 产品A收入 | 产品B收入 | 营销费用 |
|---|---|---|---|---|---|
| 1月 | 150 | 200 | 45000 | 40000 | 15000 |
| 2月 | 180 | 190 | 54000 | 38000 | 18000 |
| 3月 | 220 | 210 | 66000 | 42000 | 20000 |
| 4月 | 200 | 250 | 60000 | 50000 | 22000 |
| 5月 | 190 | 280 | 57000 | 56000 | 19000 |
| 6月 | 250 | 300 | 75000 | 60000 | 25000 |

请分析：
1. 两个产品的销售趋势对比
2. 营销费用与收入的相关性
3. ROI分析（收入/营销费用）
4. 下半年的销售预测`,
    expectedOutputSummary: 'Complete trend comparison, Pearson correlation coefficient, ROI ratio table (3.8x - 5.9x), and linear regression projections for Q3/Q4.',
    mockResponse: `### 📈 销售与营销多维深度分析报告

#### 1. 核心指标汇总表

| 月份 | 总收入 (¥) | 营销费用 (¥) | 营销ROI (收入/费用) | 产品A单价 | 产品B单价 |
| :---: | :---: | :---: | :---: | :---: | :---: |
| 1月 | 85,000 | 15,000 | **5.67x** | ¥300 | ¥200 |
| 2月 | 92,000 | 18,000 | **5.11x** | ¥300 | ¥200 |
| 3月 | 108,000 | 20,000 | **5.40x** | ¥300 | ¥200 |
| 4月 | 110,000 | 22,000 | **5.00x** | ¥300 | ¥200 |
| 5月 | 113,000 | 19,000 | **5.95x** *(最高)* | ¥300 | ¥200 |
| 6月 | 135,000 | 25,000 | **5.40x** | ¥300 | ¥200 |
| **合计/均值** | **¥643,000** | **¥119,000** | **5.40x 综合ROI** | - | - |

---

#### 2. 深度商业洞察

1. **产品趋势对比:**
   - **产品A (高客单价 ¥300):** 销量从150件增至250件 (+66.7%)，贡献了总收入的 55.5%。
   - **产品B (走量型 ¥200):** 销量从200件稳步攀升至300件 (+50.0%)，增长稳定性极高（自2月起月月正增长）。
2. **营销与收入相关性分析:**
   - 营销费用与总收入的皮尔逊相关系数 **r = 0.942**（极强正相关），说明当前市场投放尚未进入边际收益递减的饱和期。
3. **下半年（Q3/Q4）销售预测模型:**
   - 采用线性回归拟合公式：\`月总收入 = 10,200 * 月份 + 71,500\`
   - **7月预测:** ¥142,900（推荐营销预算：¥26,000）
   - **8月预测:** ¥153,100（推荐营销预算：¥28,000）
   - **9月预测:** ¥163,300（推荐营销预算：¥30,000）`
  },
  {
    id: 'test-resume-tailor',
    title: 'Resume Tailor: Senior AI Product Manager at ByteDance',
    skillId: 'resume-tailor',
    agentId: 'admin-assistant',
    category: 'HR',
    description: 'Optimize a product manager resume against ByteDance Senior AI PM job requirements using STAR-framework quantified achievements.',
    prompt: `请帮我针对以下职位优化简历重点：

目标职位：高级AI产品经理 - 字节跳动

JD关键要求：
- 3年以上AI产品经验
- 熟悉大模型(LLM)应用落地
- ToB/ToC产品经验
- 数据驱动决策能力

我的背景：
- 5年产品经验（腾讯2年+字节3年）
- 主导过企业协作工具（DAU 50万）
- 做过智能客服系统（AI相关）
- 熟悉Python和SQL做数据分析

请给出：
1. 关键词匹配分析
2. 简历优化建议
3. 需要强调的经历重写`,
    expectedOutputSummary: 'Keyword coverage matrix (92% match score), strategic positioning suggestions, and 3 STAR-formatted high-impact bullet points.',
    mockResponse: `### 🎯 字节跳动高级AI产品经理简历定向优化方案

#### 1. JD 关键词覆盖与匹配度诊断 (Match Score: 92%)

| 核心维度 | JD 核心需求 | 候选人匹配度 | 诊断建议 |
| :--- | :--- | :---: | :--- |
| **大模型/AI落地** | LLM应用落地、提示词工程/Agent架构 | ⚠️ 需强化 | 原背景“智能客服”需升级为“基于LLM/RAG的下一代企业级Agent解决方案” |
| **产品量级与经验** | 3年以上AI产品、ToB/ToC经验 | 🟢 高度匹配 | 突出5年大厂协作平台 (DAU 50万) 的高并发与企业级交付经验 |
| **数据与量化驱动** | 数据驱动决策、指标体系搭建 | 🟢 高度匹配 | 将Python/SQL转化为具体的业务量化产出（如AB实验、流失率降低、ROI提升） |

---

#### 2. 简历经历重写 (采用 STAR 黄金法则 + 强动词)

##### 🛠️ 经历 1：企业智能客服与大模型 Agent 升级（重点突出 AI 落地能力）
> **原表述：** 负责智能客服系统设计与迭代，应用AI技术提升客服效率。  
> **✨ 推荐重写：**  
> 主导企业级**大语言模型（LLM）+ RAG 智能工单 Agent** 架构重构，设计多轮意图识别与动态知识库召回机制；上线后实现**用户自助解决率从 42% 跃升至 78%**，人工转接量下降 35%，平均响应延迟缩短至 1.2 秒，年度为业务节省逾 320 万元运营成本。

##### 🚀 经历 2：高并发企业协作平台（突出大用户量级 ToB/ToC 交付）
> **原表述：** 主导企业协作工具，DAU 达到 50 万。  
> **✨ 推荐重写：**  
> 统筹负责千万级企业协作套件的端到端产品生命周期，主导协同文档与权限引擎架构；通过搭建精细化数据漏斗与 A/B 测试体系，驱动核心功能渗透率提升 28%，推动 **DAU 突破 50 万大关，次月留存率达 64%**。`
  },
  {
    id: 'test-meeting-notes',
    title: 'Meeting Notes: Q2 AI Product Roadmap Discussion',
    skillId: 'meeting-notes',
    agentId: 'admin-assistant',
    category: 'Communication',
    description: 'Transform an unstructured executive meeting transcript into executive minutes, approved decisions, and a RACI action matrix.',
    prompt: `请帮我整理以下会议记录：

会议：Q2产品规划讨论
时间：2025年1月30日 14:00-15:30
参会人：张总(CEO)、李经理(产品)、王工程师(技术)、刘设计(设计)

讨论内容原文：
张总说Q2要重点做AI功能，预算500万。
李经理说用户反馈最多的是文档协作卡顿问题，建议先优化性能。
王工程师说性能优化需要2个月，但可以和AI功能并行开发。性能优化是后端为主，AI功能前端和算法可以先启动。
刘设计说AI功能的界面原型已经有初稿，下周可以评审。
最后决定：2月启动性能优化，3月开始AI功能开发，下周三评审设计稿。
李经理担心开发资源紧张，王工程师建议暂停低优先级需求。张总同意，让李经理列需求优先级清单下次评审。

---
请输出：
1. 结构化会议纪要
2. 关键决议
3. 行动项（含负责人、截止日期）`,
    expectedOutputSummary: 'Formal structured executive meeting minutes with one-paragraph executive summary, 3 core decisions, and RACI action table.',
    mockResponse: `### 📋 会议纪要：Q2 产品规划与技术路线决策会

- **会议主题:** Q2 产品规划与 AI 功能路线讨论  
- **会议时间:** 2025年1月30日 14:00 - 15:30  
- **参会人员:** 张总 (CEO)、李经理 (产品)、王工程师 (技术)、刘设计 (设计)  
- **记录整理:** Executive Admin Assistant  

---

#### 1. 执行摘要 (Executive Summary)
会议围绕 Q2 核心战略方向进行了充分论证。张总明确 Q2 重点发力 **AI 功能（专项预算 500 万元）**。针对李经理反馈的文档协作性能瓶颈，技术团队王工程师确认性能优化与 AI 功能可分阶段并行推进。管理层最终敲定了性能与 AI 双轨并行的开发节奏，并通过暂停低优先级需求以保障核心研发资源。

---

#### 2. 关键决议 (Key Decisions)
1. **双轨并行开发节奏:** 
   - **2月:** 集中后端资源启动文档协作性能优化（周期约2个月）；
   - **3月:** 正式启动 AI 功能的前端工程与算法联调开发。
2. **设计评审节点:** 定于下周三（2月5日）组织 AI 功能界面原型专项评审。
3. **资源倾斜策略:** 暂停当前非核心及低优先级需求迭代，全量保障性能与 AI 重点战役。

---

#### 3. 待办行动清单 (Action Items & RACI)

| 序号 | 待办任务 (Action Item) | 责任人 (Owner) | 截止日期 (Deadline) | 交付物 / 状态 |
| :---: | :--- | :---: | :---: | :--- |
| **1** | 提交 AI 功能界面原型初稿并组织评审会 | **刘设计** | 2025-02-05 (下周三) | 原型稿与设计评审会邀约 |
| **2** | 梳理需求优先级清单（明确暂停需求列表） | **李经理** | 2025-02-05 (下周三) | Q2 需求优先级 P0-P3 矩阵 |
| **3** | 输出协作性能优化技术方案并于2月正式启动 | **王工程师** | 2025-02-01 | 后端重构方案与排期表 |
| **4** | 审批 500 万 AI 专项预算与阶段采购配额 | **张总** | 2025-02-10 | 财务预算批复函 |`
  }
];
