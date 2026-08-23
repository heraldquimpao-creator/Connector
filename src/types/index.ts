export interface Skill {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: 'legal' | 'finance' | 'hr' | 'sales-marketing' | 'research' | 'visualization' | 'communication' | 'pdf' | 'document' | 'presentation' | 'automation' | 'infrastructure' | string;
  department: string;
  version: string;
  author: string;
  license: string;
  tags: string[];
  models: {
    recommended: string[];
    compatible: string[];
  };
  mcpServer?: string;
  mcpTools?: string[];
  knowledgeBases?: string[];
  capabilities: string[];
  inputSpec?: {
    required: { name: string; type: string; description: string }[];
    optional?: { name: string; type: string; description: string }[];
  };
  samplePrompt: string;
  sampleOutput?: string;
  fullMarkdown?: string;
}

export interface Agent {
  id: string;
  name: string;
  displayName: string;
  avatar: string;
  role: string;
  description: string;
  category: string;
  department: string;
  tone: string;
  style: string;
  language: string;
  tags: string[];
  primarySkills: string[];
  secondarySkills: string[];
  mcpTools: string[];
  knowledgeBases: string[];
  capabilities: string[];
  systemPrompt: string;
  sampleWorkflows: {
    title: string;
    description: string;
    prompt: string;
  }[];
}

export interface MCPTool {
  id: string;
  name: string;
  category: 'document' | 'pdf' | 'spreadsheet' | 'presentation' | 'conversion';
  description: string;
  parameters: {
    name: string;
    type: string;
    description: string;
    required: boolean;
    default?: any;
  }[];
  returns: string;
  exampleInput: Record<string, any>;
  exampleOutput: Record<string, any>;
}

export interface RiskPattern {
  id: string;
  name: string;
  nameZh: string;
  severity: 'high' | 'medium' | 'low';
  category: string;
  keywords: string[];
  keywordsZh: string[];
  description: string;
  descriptionZh: string;
  recommendation: string;
  recommendationZh: string;
}

export interface CompletenessItem {
  id: string;
  name: string;
  nameZh: string;
  required: boolean;
  category: string;
  description: string;
  descriptionZh: string;
}

export interface JurisdictionGuide {
  id: string;
  region: string;
  country: string;
  flag: string;
  keyTopics: string[];
  laws: { name: string; summary: string }[];
  pitfalls: string[];
}

export interface TestCase {
  id: string;
  title?: string;
  name?: string;
  filename?: string;
  skillId?: string;
  agentId?: string;
  category: string;
  description: string;
  prompt?: string;
  sampleInput?: string;
  sampleContent?: string;
  recommendedSkills?: string[];
  expectedOutputSummary?: string;
  mockResponse?: string;
  sizeBytes?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  agentId?: string;
  skillUsed?: string;
  content: string;
  timestamp: string;
  toolCalls?: {
    toolName: string;
    input: any;
    output: any;
    status: 'success' | 'running' | 'failed';
  }[];
  thoughtSteps?: string[];
}

export interface SkillMeta {
  id: string;
  name: string;
  description: string;
  version?: string;
  category: string;
  tags: string[];
  department?: string;
  author?: string;
  license?: string;
  mcpTools: string[];
  knowledgeFiles: string[];
  path: string;
  rawContent?: string;
}

export interface AgentMeta {
  id: string;
  name: string;
  displayName: string;
  description: string;
  avatar: string;
  category: string;
  department: string;
  tags: string[];
  primarySkills: string[];
  secondarySkills: string[];
  mcpTools: string[];
  knowledgeFiles: string[];
  platforms: string[];
  systemPrompt?: string;
  rawContent?: string;
}

export interface ToolDef {
  name: string;
  category: 'pdf' | 'spreadsheet' | 'document' | 'presentation' | 'conversion' | 'knowledge';
  description: string;
  parameters: {
    name: string;
    type: string;
    description: string;
    required: boolean;
    default?: any;
    options?: string[];
  }[];
}

export interface KnowledgeFile {
  id: string;
  name: string;
  category: string;
  path: string;
  content: any;
}

export interface ToolExecutionResult {
  success: boolean;
  tool: string;
  result?: any;
  error?: string;
  durationMs: number;
  outputDownloadUrl?: string;
  outputFilename?: string;
}

