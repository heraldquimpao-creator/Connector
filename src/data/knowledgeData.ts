import { RiskPattern, CompletenessItem, JurisdictionGuide } from '../types';

export const RISK_PATTERNS: RiskPattern[] = [
  {
    id: 'unlimited_liability',
    name: 'Unlimited Liability',
    nameZh: '无限责任',
    severity: 'high',
    category: 'liability',
    keywords: ['unlimited liability', 'full responsibility', 'all damages', 'any and all losses', 'no limitation of liability'],
    keywordsZh: ['无限责任', '全部责任', '一切损失', '全部损害', '不作责任限制'],
    description: 'The contract exposes your organization to open-ended financial and consequential damages without an aggregate cap.',
    descriptionZh: '合同可能使一方承担无限的经济责任及间接损失，缺乏合理的累计赔偿责任上限。',
    recommendation: 'Negotiate a mutual liability ceiling capped at 100% of fees paid under the agreement in the preceding 12 months, and disclaim indirect/consequential damages.',
    recommendationZh: '添加互惠的赔偿责任上限（如过去12个月内已收取的合同服务费总额），并明确排除间接损失和附带损失。'
  },
  {
    id: 'unfair_termination',
    name: 'Unfair Termination & Lock-in',
    nameZh: '不公平终止条款 / 锁定期',
    severity: 'medium',
    category: 'termination',
    keywords: ['terminate at will', 'immediate termination', 'without cause', 'sole discretion', 'no right to terminate'],
    keywordsZh: ['随时终止', '立即终止', '无需理由', '单方决定', '不得提前终止'],
    description: 'Termination rights are unilateral, allow arbitrary cancellation without cause, or lock you into recurring obligations with no exit path.',
    descriptionZh: '终止条款为单方面拥有，允许对方无理由立即解除合同，或对己方设置严苛的不可撤销锁定义务。',
    recommendation: 'Ensure bilateral termination rights for convenience with 30-60 days written notice, plus immediate termination for material uncured breach.',
    recommendationZh: '确保双方均享有附带30-60天书面通知期的提前终止权，并在一方发生实质性违约且逾期未纠正时享有立即解除权。'
  },
  {
    id: 'broad_ip_assignment',
    name: 'Overbroad IP Assignment & Work for Hire',
    nameZh: '宽泛的知识产权全部转让',
    severity: 'high',
    category: 'intellectual_property',
    keywords: ['work for hire', 'assign all rights', 'intellectual property transfer', 'all inventions', 'irrevocable assignment of pre-existing'],
    keywordsZh: ['职务作品', '转让全部权利', '知识产权转让', '所有发明', '不可撤销转让已有技术'],
    description: 'Contract requires transferring all background technology, pre-existing tools, generic libraries, or future unrelated inventions.',
    descriptionZh: '合同要求转让供应商的底层核心工具库、已有预置资产或未来不相关的发明专利，未做背景知识产权保留。',
    recommendation: 'Explicitly carve out Pre-Existing IP, Background Technology, and Developer Tools. Grant only a non-exclusive license to background IP embedded in deliverables.',
    recommendationZh: '明确排除已有背景知识产权（Pre-Existing IP），仅针对定制交付物转让版权，并向客户授予背景技术的非排他性使用许可。'
  },
  {
    id: 'perpetual_confidentiality',
    name: 'Perpetual Confidentiality Obligations',
    nameZh: '无期限永久保密义务',
    severity: 'medium',
    category: 'confidentiality',
    keywords: ['perpetual confidentiality', 'indefinitely', 'all information', 'unlimited duration', 'survive indefinitely'],
    keywordsZh: ['永久保密', '无限期', '所有信息', '无限制期限', '永久有效'],
    description: 'Extends strict non-disclosure obligations indefinitely for standard commercial/business discussions rather than trade secrets.',
    descriptionZh: '将普通商业信息与技术交流设定为永久保密，增加长期的合规审计与举证负担。',
    recommendation: 'Limit confidentiality term to 2 to 3 years post-termination, reserving perpetual protection solely for verified trade secrets under applicable statutory law.',
    recommendationZh: '将普通保密期限限定为合同终止后2至3年，仅对符合法定标准的商业秘密（Trade Secrets）适用存续保护。'
  },
  {
    id: 'one_sided_indemnification',
    name: 'One-Sided Indemnification',
    nameZh: '单方面全额赔偿条款',
    severity: 'high',
    category: 'indemnification',
    keywords: ['indemnify and hold harmless', 'defend at own expense', 'all claims', 'attorney fees', 'sole indemnitor'],
    keywordsZh: ['赔偿并使免受损害', '自费辩护', '所有索赔', '律师费', '承担全部赔偿责任'],
    description: 'Requires you to defend, hold harmless, and indemnify the counterparty against any third-party claims regardless of actual fault.',
    descriptionZh: '要求己方在无论过错程度如何的情况下，为对方提供单方全额赔偿、律师费兜底及独立诉讼辩护。',
    recommendation: 'Require mutual indemnification strictly limited to direct third-party IP infringement claims resulting directly from gross negligence or willful misconduct.',
    recommendationZh: '改为双方对等赔偿条款，赔偿范围严格限于由故意或重大过失直接导致的第三方知识产权侵权索赔。'
  },
  {
    id: 'excessive_delay_penalty',
    name: 'Excessive Daily Delay Liquidated Damages',
    nameZh: '过高日违约金 / 惩罚性扣款',
    severity: 'high',
    category: 'penalty',
    keywords: ['daily penalty', '0.5%', '1% per day', 'liquidated damages', 'delay penalty'],
    keywordsZh: ['按日扣除', '每天0.5%', '日万分之', '违约金', '延期赔偿'],
    description: 'Daily penalty rates exceeding 0.05% - 0.1% per day can rapidly consume the entire contract margin and lead to catastrophic financial penalties.',
    descriptionZh: '每日0.5%的逾期违约金在20天内即可扣减合同总额的10%，属于严重过高且显失公平的惩罚性条款。',
    recommendation: 'Cap daily delay penalties at 0.05% per day with an absolute cumulative cap of 5% - 10% of the contract value, with grace periods for force majeure.',
    recommendationZh: '将每日逾期违约金调整为每日0.05%，设定最高累计不超过合同总额5%-10%的封顶线，并增加不可抗力免责缓冲期。'
  }
];

export const COMPLETENESS_CHECKLIST: CompletenessItem[] = [
  { id: 'parties', name: 'Legal Parties & Registered Names', nameZh: '合同双方全称与主体资格', required: true, category: 'core', description: 'Accurate legal entity names, addresses, and authorized signatory titles.', descriptionZh: '明确的企业法定全称、注册地址、统一社会信用代码/税号及法定代表人。' },
  { id: 'scope', name: 'Scope of Services & Deliverables', nameZh: '服务范围与交付标准', required: true, category: 'operational', description: 'Explicit milestones, acceptance criteria, and change request procedures.', descriptionZh: '清晰的工作范围（SOW）、阶段交付里程碑与客观验收标准。' },
  { id: 'consideration', name: 'Payment Terms & Milestone Schedule', nameZh: '价款、结算方式与支付期限', required: true, category: 'commercial', description: 'Clear fee amounts, currency, milestone billing triggers, and invoicing timelines.', descriptionZh: '金额、币种、税率、付款节点（如预付款/验收款）及发票开具时限。' },
  { id: 'ip_rights', name: 'Intellectual Property Ownership', nameZh: '知识产权归属与授权', required: true, category: 'ip', description: 'Ownership of deliverables, carve-outs for background tools, and license grants.', descriptionZh: '交付物版权归属、背景知识产权保留以及第三方开源组件许可声明。' },
  { id: 'confidentiality', name: 'Confidentiality & Trade Secret Protections', nameZh: '保密义务与除外情形', required: true, category: 'legal', description: 'Scope of confidential information, duration, and standard statutory carve-outs.', descriptionZh: '保密范围、期限（如2-3年）、除外情形（公开信息/法令要求）。' },
  { id: 'liability_cap', name: 'Limitation of Liability & Cap', nameZh: '责任限制与赔偿上限', required: true, category: 'legal', description: 'Mutual aggregate liability ceiling and exclusion of consequential damages.', descriptionZh: '明确的双方总责任上限（如12个月服务费）及排除间接/附带损失。' },
  { id: 'termination', name: 'Termination & Default Remedies', nameZh: '合同解除与违约救济', required: true, category: 'legal', description: 'Bilateral rights to terminate for cause and for convenience, plus wind-down.', descriptionZh: '违约纠正期（如30天）、提前解除通知期与交付物交接机制。' },
  { id: 'dispute_resolution', name: 'Governing Law & Dispute Resolution Venue', nameZh: '适用法律与争议解决管辖', required: true, category: 'legal', description: 'Governing jurisdiction law and designated court or arbitration forum (e.g. CIETAC/AAA).', descriptionZh: '明确适用的准据法及管辖法院或仲裁机构（仲裁地与仲裁规则）。' }
];

export const JURISDICTIONS: JurisdictionGuide[] = [
  {
    id: 'us_federal',
    region: 'United States (Federal & Delaware)',
    country: 'United States',
    flag: '🇺🇸',
    keyTopics: ['At-will employment doctrine', 'FLSA overtime exemptions', 'UCC commercial sales', 'Delaware Chancery precedent'],
    laws: [
      { name: 'Fair Labor Standards Act (FLSA)', summary: 'Mandates minimum wage, overtime rules, and classification standards between exempt vs non-exempt employees.' },
      { name: 'Defend Trade Secrets Act (DTSA)', summary: 'Federal statutory protections and ex parte seizure mechanisms for trade secret misappropriation.' }
    ],
    pitfalls: ['Failure to include mandatory DTSA whistleblower notice in employee NDAs renders punitive damages unavailable.']
  },
  {
    id: 'california',
    region: 'California, United States',
    country: 'United States',
    flag: '🇺🇸',
    keyTopics: ['AB 5 ABC Worker Classification Test', 'Non-compete ban (B&P §16600)', 'California Consumer Privacy Act (CCPA)'],
    laws: [
      { name: 'Cal. Bus. & Prof. Code §16600', summary: 'Virtually all employee non-compete agreements are void as a matter of public policy and actionable.' },
      { name: 'California Labor Code AB 5', summary: 'Strict 3-prong ABC test for classifying workers as independent contractors vs statutory employees.' }
    ],
    pitfalls: ['Including standard employee non-compete covenants in California contracts is illegal and exposes employers to liability under SB 699.']
  },
  {
    id: 'china_prc',
    region: 'China (PRC)',
    country: 'China',
    flag: '🇨🇳',
    keyTopics: ['PRC Labor Contract Law', 'Statutory severance (N or N+1)', 'Non-compete monthly compensation rules', 'Civil Code Contract Part'],
    laws: [
      { name: 'PRC Labor Contract Law (中华人民共和国劳动合同法)', summary: 'Requires written employment contract within 30 days or double salary penalties; statutory severance on termination.' },
      { name: 'PRC Civil Code - Contract Book (民法典合同编)', summary: 'Governs formation, validity, liquidated damages reduction for excessiveness (Art. 585), and dispute settlement.' }
    ],
    pitfalls: ['Non-competes in China must include mandatory monthly economic compensation (at least 30% of average wage) during the restriction period, or they become invalid.']
  },
  {
    id: 'eu_gdpr',
    region: 'European Union',
    country: 'European Union',
    flag: '🇪🇺',
    keyTopics: ['GDPR Article 28 Data Processing Agreements (DPA)', 'Standard Contractual Clauses (SCCs)', 'Working Time Directive'],
    laws: [
      { name: 'General Data Protection Regulation (GDPR)', summary: 'Imposes strict liability, mandatory 72-hour breach reporting, and data subject rights for EU personal data.' },
      { name: 'EU AI Act', summary: 'Risk-based regulatory framework classifying AI systems with strict transparency and compliance mandates.' }
    ],
    pitfalls: ['Processing personal data of EU residents without a compliant Article 28 Data Processing Addendum (DPA) risks fines up to €20M or 4% of global turnover.']
  }
];
