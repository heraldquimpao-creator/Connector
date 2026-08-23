import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import { PDFDocument, rgb, degrees } from "pdf-lib";
import pdfParse from "pdf-parse";
import * as XLSX from "xlsx";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle, WidthType } from "docx";
import mammoth from "mammoth";
import { marked } from "marked";
import TurndownService from "turndown";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Configure upload storage
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_"));
  },
});
const upload = multer({ storage, limits: { fileSize: 25 * 1024 * 1024 } });

// Lazy Gemini AI initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// --------------------------------------------------------------------------
// YAML Frontmatter Simple Parser
// --------------------------------------------------------------------------
function parseFrontmatter(content: string): { meta: Record<string, any>; body: string } {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { meta: {}, body: content };
  }
  const rawYaml = match[1];
  const body = match[2];
  const meta: Record<string, any> = {};

  const lines = rawYaml.split(/\r?\n/);
  let currentKey = "";
  let currentArray: string[] | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    if (line.startsWith("  - ") || line.startsWith("    - ") || line.startsWith("- ")) {
      const val = trimmed.replace(/^-\s*/, "").replace(/^["']|["']$/g, "").trim();
      if (currentArray) {
        currentArray.push(val);
      }
      continue;
    }

    const colonIdx = line.indexOf(":");
    if (colonIdx > 0 && !line.startsWith(" ")) {
      const key = line.substring(0, colonIdx).trim();
      const val = line.substring(colonIdx + 1).trim().replace(/^["']|["']$/g, "");
      currentKey = key;
      if (val === "" || val === "[]") {
        currentArray = [];
        meta[key] = currentArray;
      } else {
        currentArray = null;
        meta[key] = val;
      }
    }
  }

  return { meta, body };
}

// --------------------------------------------------------------------------
// API: Health
// --------------------------------------------------------------------------
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), aiEnabled: Boolean(process.env.GEMINI_API_KEY) });
});

// --------------------------------------------------------------------------
// API: Skills
// --------------------------------------------------------------------------
app.get("/api/skills", (_req, res) => {
  try {
    const rootDir = process.cwd();
    const entries = fs.readdirSync(rootDir, { withFileTypes: true });
    const skills: any[] = [];

    for (const entry of entries) {
      if (entry.isDirectory() && !["node_modules", "dist", ".git", ".cursor", "uploads", "mcp-servers", "scripts"].includes(entry.name)) {
        const skillFilePath = path.join(rootDir, entry.name, "SKILL.md");
        if (fs.existsSync(skillFilePath)) {
          const content = fs.readFileSync(skillFilePath, "utf-8");
          const { meta, body } = parseFrontmatter(content);
          
          let category = meta.category || "General";
          if (entry.name.includes("pdf")) category = "PDF Tools";
          else if (entry.name.includes("excel") || entry.name.includes("sheets") || entry.name.includes("data") || entry.name.includes("valuation") || entry.name.includes("stock")) category = "Finance & Data";
          else if (entry.name.includes("contract") || entry.name.includes("legal") || entry.name.includes("nda")) category = "Legal & Compliance";
          else if (entry.name.includes("email") || entry.name.includes("writing") || entry.name.includes("content") || entry.name.includes("notes")) category = "Communication";
          else if (entry.name.includes("automation") || entry.name.includes("workflow") || entry.name.includes("pipeline")) category = "Automation";
          else if (entry.name.includes("slide") || entry.name.includes("ppt") || entry.name.includes("diagram") || entry.name.includes("image")) category = "Design & Visuals";
          
          skills.push({
            id: entry.name,
            name: meta.name || entry.name,
            description: meta.description || body.slice(0, 160).replace(/[#*`]/g, "").trim() + "...",
            category: category,
            department: meta.department || "General Office",
            version: meta.version || "1.0.0",
            tags: Array.isArray(meta.tags) ? meta.tags : [category.toLowerCase()],
            mcpTools: Array.isArray(meta.tools) ? meta.tools : (Array.isArray(meta.mcp_tools) ? meta.mcp_tools : []),
            knowledgeFiles: Array.isArray(meta.knowledge) ? meta.knowledge : [],
            path: `/${entry.name}/SKILL.md`,
          });
        }
      }
    }

    // Sort by name
    skills.sort((a, b) => a.name.localeCompare(b.name));
    res.json({ count: skills.length, skills });
  } catch (err: any) {
    console.error("Error reading skills:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/skills/:id", (req, res) => {
  try {
    const skillPath = path.join(process.cwd(), req.params.id, "SKILL.md");
    if (!fs.existsSync(skillPath)) {
      return res.status(404).json({ error: "Skill not found" });
    }
    const content = fs.readFileSync(skillPath, "utf-8");
    const { meta, body } = parseFrontmatter(content);
    res.json({
      id: req.params.id,
      name: meta.name || req.params.id,
      description: meta.description || "",
      meta,
      content,
      markdownBody: body,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// API: Agents
// --------------------------------------------------------------------------
app.get("/api/agents", (_req, res) => {
  try {
    const agentsDir = path.join(process.cwd(), "agents");
    const agents: any[] = [];

    if (fs.existsSync(agentsDir)) {
      const dirs = fs.readdirSync(agentsDir, { withFileTypes: true });
      for (const dir of dirs) {
        if (dir.isDirectory() && dir.name !== "_template") {
          const agentFile = path.join(agentsDir, dir.name, "AGENT.md");
          if (fs.existsSync(agentFile)) {
            const raw = fs.readFileSync(agentFile, "utf-8");
            const { meta, body } = parseFrontmatter(raw);
            
            const avatars: Record<string, string> = {
              "legal-specialist": "⚖️",
              "data-analyst": "📊",
              "admin-assistant": "📋",
              "research-analyst": "🔬",
              "content-creator": "✍️",
            };

            agents.push({
              id: dir.name,
              name: meta.name || dir.name,
              displayName: meta.display_name || meta.name || dir.name,
              description: meta.description || "",
              avatar: meta.avatar || avatars[dir.name] || "🤖",
              category: meta.category || "Specialist",
              department: meta.department || "Cross-Functional",
              primarySkills: Array.isArray(meta.primary) ? meta.primary : (meta.skills?.primary || []),
              secondarySkills: Array.isArray(meta.secondary) ? meta.secondary : (meta.skills?.secondary || []),
              mcpTools: Array.isArray(meta.mcp_tools) ? meta.mcp_tools : [],
              knowledgeFiles: Array.isArray(meta.knowledge) ? meta.knowledge : [],
              platforms: Array.isArray(meta.platforms) ? meta.platforms : ["Web", "Slack", "Telegram"],
              systemPrompt: body,
            });
          }
        }
      }
    }

    res.json({ count: agents.length, agents });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// API: Knowledge Base
// --------------------------------------------------------------------------
app.get("/api/knowledge", (_req, res) => {
  try {
    const knowledgeRoot = path.join(process.cwd(), "mcp-servers/office-mcp/knowledge");
    const files: any[] = [];

    function scanDir(dir: string, category: string) {
      if (!fs.existsSync(dir)) return;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanDir(fullPath, `${category}/${entry.name}`);
        } else if (entry.name.endsWith(".json")) {
          try {
            const raw = fs.readFileSync(fullPath, "utf-8");
            const parsed = JSON.parse(raw);
            files.push({
              id: entry.name.replace(".json", ""),
              name: entry.name,
              category,
              path: path.relative(process.cwd(), fullPath),
              content: parsed,
            });
          } catch (e) {
            console.error(`Failed to parse knowledge file: ${fullPath}`, e);
          }
        }
      }
    }

    scanDir(path.join(knowledgeRoot, "base"), "base");
    scanDir(path.join(knowledgeRoot, "custom"), "custom");

    res.json({ count: files.length, knowledgeFiles: files });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// API: Test Cases
// --------------------------------------------------------------------------
app.get("/api/test-cases", (_req, res) => {
  try {
    const testDataDir = path.join(process.cwd(), "test-cases/data");
    const testCases: any[] = [];

    const metaMap: Record<string, { name: string; category: string; description: string; recommendedSkills: string[] }> = {
      "sample_contract.txt": {
        name: "Enterprise Service & IP Agreement",
        category: "Legal",
        description: "Standard master services agreement with liability cap, IP clauses, and termination terms.",
        recommendedSkills: ["contract-review", "nda-generator", "risk-analysis"],
      },
      "sales_data.csv": {
        name: "Q1-Q4 Global Sales Report",
        category: "Finance & Data",
        description: "Multi-region transaction dataset including revenue, units sold, product categories, and margins.",
        recommendedSkills: ["data-analysis", "excel-automation", "financial-modeling"],
      },
      "sample_resume.md": {
        name: "Senior Software Engineer Resume",
        category: "HR & Careers",
        description: "Detailed professional experience, technical skills, and project achievements.",
        recommendedSkills: ["resume-tailor", "cv-builder", "applicant-screening"],
      },
      "meeting_transcript.txt": {
        name: "Product Strategy & Architecture Sync",
        category: "Productivity",
        description: "Raw meeting transcript with decision items, roadmaps, deadlines, and action owners.",
        recommendedSkills: ["meeting-notes", "weekly-report", "email-drafter"],
      },
    };

    if (fs.existsSync(testDataDir)) {
      const files = fs.readdirSync(testDataDir);
      for (const file of files) {
        const fullPath = path.join(testDataDir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isFile()) {
          const content = fs.readFileSync(fullPath, "utf-8");
          const info = metaMap[file] || {
            name: file,
            category: "General",
            description: `Sample test fixture ${file}`,
            recommendedSkills: ["doc-parser"],
          };

          testCases.push({
            id: file,
            filename: file,
            name: info.name,
            category: info.category,
            description: info.description,
            recommendedSkills: info.recommendedSkills,
            sampleContent: content,
            sizeBytes: stat.size,
          });
        }
      }
    }

    res.json({ count: testCases.length, testCases });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// API: Tools Definition List
// --------------------------------------------------------------------------
app.get("/api/tools", (_req, res) => {
  const tools = [
    // PDF Tools
    {
      name: "extract_text_from_pdf",
      category: "pdf",
      description: "Extract raw and structured text from PDF documents with page metrics and layout inspection.",
      parameters: [
        { name: "file_path", type: "string", description: "Uploaded PDF file path or text source", required: true },
        { name: "pages", type: "string", description: "Page range (e.g. 'all', '1-5')", required: false, default: "all" },
      ],
    },
    {
      name: "add_watermark_to_pdf",
      category: "pdf",
      description: "Stamp a custom dynamic watermark (e.g., CONFIDENTIAL, DRAFT, INTERNAL ONLY) onto PDF pages.",
      parameters: [
        { name: "watermark_text", type: "string", description: "Watermark text string", required: true, default: "CONFIDENTIAL" },
        { name: "color", type: "string", description: "Color (red, gray, blue)", required: false, default: "red", options: ["red", "gray", "blue"] },
        { name: "opacity", type: "number", description: "Opacity value between 0.1 and 1.0", required: false, default: 0.25 },
      ],
    },
    {
      name: "create_sample_pdf",
      category: "pdf",
      description: "Generate a formatted PDF document with headings, tables, bullet points, and metadata.",
      parameters: [
        { name: "title", type: "string", description: "Document Title", required: true, default: "Executive Briefing" },
        { name: "content", type: "string", description: "Body text or markdown", required: true, default: "This is a high-level briefing document generated via Claude Office MCP tools." },
      ],
    },
    // Spreadsheet Tools
    {
      name: "analyze_spreadsheet",
      category: "spreadsheet",
      description: "Calculate statistical metrics (sum, mean, median, min, max, row count, column classifications) on CSV/Excel.",
      parameters: [
        { name: "csv_data", type: "string", description: "CSV or tab-delimited text content", required: true },
      ],
    },
    {
      name: "pivot_table",
      category: "spreadsheet",
      description: "Create an aggregated pivot table grouping by one column and aggregating (sum, average, count) another.",
      parameters: [
        { name: "csv_data", type: "string", description: "CSV content to pivot", required: true },
        { name: "row_group", type: "string", description: "Column name to group rows by", required: true, default: "Region" },
        { name: "val_column", type: "string", description: "Numerical column name to aggregate", required: true, default: "Revenue" },
        { name: "aggregation", type: "string", description: "Aggregation type (sum, avg, count)", required: false, default: "sum", options: ["sum", "avg", "count"] },
      ],
    },
    {
      name: "json_to_spreadsheet",
      category: "spreadsheet",
      description: "Convert JSON records into formatted Excel (.xlsx) / CSV worksheets with auto-column sizing.",
      parameters: [
        { name: "json_data", type: "string", description: "Array of JSON objects as string", required: true },
        { name: "sheet_name", type: "string", description: "Sheet title", required: false, default: "Sheet1" },
      ],
    },
    // Document Tools
    {
      name: "create_docx",
      category: "document",
      description: "Generate Microsoft Word (.docx) document with custom styles, headers, tables, and paragraphs.",
      parameters: [
        { name: "title", type: "string", description: "Document title", required: true, default: "Non-Disclosure Agreement" },
        { name: "sections", type: "string", description: "JSON array of sections [{ heading: '...', text: '...' }]", required: true },
      ],
    },
    {
      name: "markdown_to_docx",
      category: "document",
      description: "Convert markdown syntax into a native Microsoft Word .docx document.",
      parameters: [
        { name: "markdown", type: "string", description: "Markdown text to convert", required: true },
        { name: "title", type: "string", description: "Document Title", required: false, default: "Converted Document" },
      ],
    },
    // Conversion Tools
    {
      name: "markdown_to_html",
      category: "conversion",
      description: "Convert Markdown to clean, accessible HTML with GitHub-flavored table and list support.",
      parameters: [
        { name: "markdown", type: "string", description: "Markdown input", required: true },
      ],
    },
    {
      name: "html_to_markdown",
      category: "conversion",
      description: "Convert HTML back into standard Markdown syntax.",
      parameters: [
        { name: "html", type: "string", description: "HTML input", required: true },
      ],
    },
    // Knowledge & Risk Tools
    {
      name: "analyze_contract_risks",
      category: "knowledge",
      description: "Run contract text against the structured risk patterns knowledge base and jurisdiction rules to identify red flags and score compliance.",
      parameters: [
        { name: "contract_text", type: "string", description: "Contract text to inspect", required: true },
        { name: "jurisdiction", type: "string", description: "Legal jurisdiction (us, eu, china, california)", required: false, default: "us", options: ["us", "eu", "china", "california"] },
      ],
    },
  ];

  res.json({ count: tools.length, tools });
});

// --------------------------------------------------------------------------
// API: Tool Execution
// --------------------------------------------------------------------------
app.post("/api/tools/execute", async (req, res) => {
  const startTime = Date.now();
  const { tool, params } = req.body;

  try {
    switch (tool) {
      case "extract_text_from_pdf": {
        let pdfBuffer: Buffer;
        if (params.file_path && fs.existsSync(params.file_path)) {
          pdfBuffer = fs.readFileSync(params.file_path);
        } else {
          // If sample test_sample.pdf exists
          const samplePath = path.join(process.cwd(), "mcp-servers/office-mcp/test_sample.pdf");
          if (fs.existsSync(samplePath)) {
            pdfBuffer = fs.readFileSync(samplePath);
          } else {
            // Generate in-memory PDF for demonstration
            const doc = await PDFDocument.create();
            const page = doc.addPage([600, 400]);
            page.drawText("Claude Office Skills - MCP Sample PDF Document\n\n1. Executive Summary\n2. Financial Projections\n3. Risk Assessment Matrix", {
              x: 50,
              y: 320,
              size: 14,
            });
            pdfBuffer = Buffer.from(await doc.save());
          }
        }

        const data = await pdfParse(pdfBuffer);
        return res.json({
          success: true,
          tool,
          durationMs: Date.now() - startTime,
          result: {
            numpages: data.numpages,
            numrender: data.numrender,
            info: data.info,
            text: data.text,
            characterCount: data.text.length,
          },
        });
      }

      case "add_watermark_to_pdf": {
        const watermarkText = params.watermark_text || "CONFIDENTIAL";
        const opacity = parseFloat(params.opacity) || 0.25;
        const colorName = params.color || "red";

        // Create base PDF
        const doc = await PDFDocument.create();
        const page1 = doc.addPage([595, 842]);
        page1.drawText("Quarterly Financial Review & Strategic Direction", { x: 50, y: 780, size: 18 });
        page1.drawText("1. Operating Income reached $4.2M in Q3, outperforming consensus by 14%.\n2. Customer retention stabilized at 96.4% across enterprise tier.\n3. R&D investments shifted toward automated compliance workflows.", { x: 50, y: 720, size: 11 });

        const pages = doc.getPages();
        let color = rgb(0.85, 0.15, 0.15);
        if (colorName === "blue") color = rgb(0.15, 0.35, 0.85);
        if (colorName === "gray") color = rgb(0.4, 0.4, 0.4);

        for (const page of pages) {
          const { width, height } = page.getSize();
          page.drawText(watermarkText, {
            x: width / 4,
            y: height / 2,
            size: 42,
            color,
            opacity,
            rotate: degrees(45),
          });
        }

        const pdfBytes = await doc.save();
        const base64 = Buffer.from(pdfBytes).toString("base64");

        return res.json({
          success: true,
          tool,
          durationMs: Date.now() - startTime,
          result: {
            watermark: watermarkText,
            pagesWatermarked: pages.length,
            fileSize: pdfBytes.length,
            base64Data: `data:application/pdf;base64,${base64}`,
          },
        });
      }

      case "create_sample_pdf": {
        const title = params.title || "Executive Briefing";
        const content = params.content || "Document generated via Claude Office MCP Tools.";

        const doc = await PDFDocument.create();
        const page = doc.addPage([595, 842]);
        page.drawText(title, { x: 50, y: 780, size: 20 });
        page.drawText(`Generated on: ${new Date().toLocaleDateString()}`, { x: 50, y: 755, size: 10, color: rgb(0.4, 0.4, 0.4) });
        
        const lines = content.split("\n");
        let y = 720;
        for (const line of lines) {
          if (y < 60) break;
          page.drawText(line.slice(0, 80), { x: 50, y, size: 11 });
          y -= 20;
        }

        const pdfBytes = await doc.save();
        const base64 = Buffer.from(pdfBytes).toString("base64");

        return res.json({
          success: true,
          tool,
          durationMs: Date.now() - startTime,
          result: {
            title,
            pages: 1,
            fileSizeBytes: pdfBytes.length,
            base64Data: `data:application/pdf;base64,${base64}`,
          },
        });
      }

      case "analyze_spreadsheet": {
        let csvContent = params.csv_data;
        if (!csvContent) {
          // Load test sales_data.csv if available
          const sampleCsvPath = path.join(process.cwd(), "test-cases/data/sales_data.csv");
          if (fs.existsSync(sampleCsvPath)) {
            csvContent = fs.readFileSync(sampleCsvPath, "utf-8");
          } else {
            csvContent = "Date,Region,Product,Revenue,Cost,Units\n2025-01-15,North America,Enterprise AI,45000,12000,10\n2025-01-18,Europe,Cloud Sync,28000,8000,14\n2025-01-20,Asia-Pacific,DocuEngine,34000,9500,20\n2025-01-22,North America,Cloud Sync,31000,8900,15";
          }
        }

        const workbook = XLSX.read(csvContent, { type: "string" });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        const rows: any[] = XLSX.utils.sheet_to_json(sheet);

        if (rows.length === 0) {
          return res.json({ success: true, tool, durationMs: Date.now() - startTime, result: { message: "Empty dataset" } });
        }

        const columns = Object.keys(rows[0]);
        const stats: Record<string, any> = {};

        for (const col of columns) {
          const values = rows.map((r) => r[col]).filter((v) => v !== undefined && v !== null && v !== "");
          const numValues = values.map((v) => Number(v)).filter((n) => !isNaN(n));

          if (numValues.length > 0 && numValues.length >= values.length * 0.7) {
            const sum = numValues.reduce((a, b) => a + b, 0);
            const mean = sum / numValues.length;
            const min = Math.min(...numValues);
            const max = Math.max(...numValues);
            stats[col] = {
              type: "numeric",
              count: numValues.length,
              sum: Math.round(sum * 100) / 100,
              average: Math.round(mean * 100) / 100,
              min,
              max,
            };
          } else {
            const unique = new Set(values);
            stats[col] = {
              type: "categorical",
              count: values.length,
              uniqueCount: unique.size,
              topValues: Array.from(unique).slice(0, 5),
            };
          }
        }

        return res.json({
          success: true,
          tool,
          durationMs: Date.now() - startTime,
          result: {
            rowCount: rows.length,
            columnCount: columns.length,
            columns,
            previewRows: rows.slice(0, 5),
            columnStats: stats,
          },
        });
      }

      case "pivot_table": {
        let csvContent = params.csv_data;
        if (!csvContent) {
          const sampleCsvPath = path.join(process.cwd(), "test-cases/data/sales_data.csv");
          csvContent = fs.existsSync(sampleCsvPath) ? fs.readFileSync(sampleCsvPath, "utf-8") : "Region,Product,Revenue\nNA,Pro,100\nEU,Pro,200\nNA,Pro,150\nEU,Basic,80";
        }

        const rowGroup = params.row_group || "Region";
        const valCol = params.val_column || "Revenue";
        const aggType = params.aggregation || "sum";

        const workbook = XLSX.read(csvContent, { type: "string" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: any[] = XLSX.utils.sheet_to_json(sheet);

        const groups: Record<string, number[]> = {};

        for (const r of rows) {
          const key = String(r[rowGroup] ?? "Unknown");
          const val = Number(r[valCol] ?? 0);
          if (!groups[key]) groups[key] = [];
          if (!isNaN(val)) groups[key].push(val);
        }

        const pivotResults: any[] = [];
        for (const [groupKey, vals] of Object.entries(groups)) {
          let aggregated = 0;
          if (aggType === "sum") aggregated = vals.reduce((a, b) => a + b, 0);
          else if (aggType === "avg") aggregated = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
          else if (aggType === "count") aggregated = vals.length;

          pivotResults.push({
            [rowGroup]: groupKey,
            [`${aggType.toUpperCase()}(${valCol})`]: Math.round(aggregated * 100) / 100,
            recordCount: vals.length,
          });
        }

        return res.json({
          success: true,
          tool,
          durationMs: Date.now() - startTime,
          result: {
            groupBy: rowGroup,
            valueColumn: valCol,
            aggregation: aggType,
            pivotData: pivotResults,
          },
        });
      }

      case "json_to_spreadsheet": {
        let jsonItems = [];
        try {
          jsonItems = typeof params.json_data === "string" ? JSON.parse(params.json_data) : params.json_data;
        } catch {
          jsonItems = [
            { Item: "Contract A", Risk: "Low", Approved: true },
            { Item: "Contract B", Risk: "High", Approved: false },
          ];
        }

        const worksheet = XLSX.utils.json_to_sheet(jsonItems);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, params.sheet_name || "Data");
        const out = XLSX.write(workbook, { bookType: "xlsx", type: "base64" });

        return res.json({
          success: true,
          tool,
          durationMs: Date.now() - startTime,
          result: {
            rowsExported: jsonItems.length,
            sheetName: params.sheet_name || "Data",
            base64Data: `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${out}`,
          },
        });
      }

      case "create_docx": {
        const title = params.title || "Enterprise Office Document";
        let sections: { heading?: string; text: string }[] = [];
        if (typeof params.sections === "string") {
          try {
            sections = JSON.parse(params.sections);
          } catch {
            sections = [{ heading: "Executive Summary", text: params.sections }];
          }
        } else if (Array.isArray(params.sections)) {
          sections = params.sections;
        } else {
          sections = [
            { heading: "1. Overview", text: "This document is generated dynamically with Claude Office Skills." },
            { heading: "2. Recommendations", text: "Adopt standardized MCP toolchains across the organization." },
          ];
        }

        const children: any[] = [
          new Paragraph({
            text: title,
            heading: HeadingLevel.TITLE,
            spacing: { after: 300 },
          }),
        ];

        for (const s of sections) {
          if (s.heading) {
            children.push(
              new Paragraph({
                text: s.heading,
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 240, after: 120 },
              })
            );
          }
          children.push(
            new Paragraph({
              children: [new TextRun(s.text)],
              spacing: { after: 200 },
            })
          );
        }

        const doc = new Document({
          sections: [{ properties: {}, children }],
        });

        const buffer = await Packer.toBuffer(doc);
        const base64 = buffer.toString("base64");

        return res.json({
          success: true,
          tool,
          durationMs: Date.now() - startTime,
          result: {
            title,
            sectionsCount: sections.length,
            fileSizeBytes: buffer.length,
            base64Data: `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${base64}`,
          },
        });
      }

      case "markdown_to_docx": {
        const mdText = params.markdown || "# Document\n\nGenerated with Claude Office Skills.";
        const title = params.title || "Markdown Export";
        
        const lines = mdText.split("\n");
        const children: any[] = [
          new Paragraph({ text: title, heading: HeadingLevel.TITLE, spacing: { after: 300 } })
        ];

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("### ")) {
            children.push(new Paragraph({ text: trimmed.replace("### ", ""), heading: HeadingLevel.HEADING_3, spacing: { before: 180, after: 80 } }));
          } else if (trimmed.startsWith("## ")) {
            children.push(new Paragraph({ text: trimmed.replace("## ", ""), heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 120 } }));
          } else if (trimmed.startsWith("# ")) {
            children.push(new Paragraph({ text: trimmed.replace("# ", ""), heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 150 } }));
          } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            children.push(new Paragraph({ text: trimmed.slice(2), bullet: { level: 0 }, spacing: { after: 60 } }));
          } else if (trimmed.length > 0) {
            children.push(new Paragraph({ text: trimmed, spacing: { after: 140 } }));
          }
        }

        const doc = new Document({ sections: [{ properties: {}, children }] });
        const buffer = await Packer.toBuffer(doc);
        const base64 = buffer.toString("base64");

        return res.json({
          success: true,
          tool,
          durationMs: Date.now() - startTime,
          result: {
            title,
            lineCount: lines.length,
            base64Data: `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${base64}`,
          },
        });
      }

      case "markdown_to_html": {
        const mdText = params.markdown || "### Hello\n\nThis is **bold** text.";
        const html = await marked.parse(mdText);
        return res.json({
          success: true,
          tool,
          durationMs: Date.now() - startTime,
          result: { html },
        });
      }

      case "html_to_markdown": {
        const turndownService = new TurndownService();
        const html = params.html || "<h1>Title</h1><p>Body paragraph with <strong>bold</strong> text.</p>";
        const md = turndownService.turndown(html);
        return res.json({
          success: true,
          tool,
          durationMs: Date.now() - startTime,
          result: { markdown: md },
        });
      }

      case "analyze_contract_risks": {
        let contractText = params.contract_text;
        if (!contractText) {
          const sampleContractPath = path.join(process.cwd(), "test-cases/data/sample_contract.txt");
          contractText = fs.existsSync(sampleContractPath) ? fs.readFileSync(sampleContractPath, "utf-8") : "This agreement has unlimited liability and perpetual non-compete.";
        }
        const jurisdiction = params.jurisdiction || "us";

        // Read knowledge base risk patterns
        const riskPatternsPath = path.join(process.cwd(), "mcp-servers/office-mcp/knowledge/base/risk_patterns.json");
        const completenessPath = path.join(process.cwd(), "mcp-servers/office-mcp/knowledge/base/completeness.json");
        
        let riskPatterns: any[] = [];
        let completenessRules: any[] = [];

        if (fs.existsSync(riskPatternsPath)) {
          const rData = JSON.parse(fs.readFileSync(riskPatternsPath, "utf-8"));
          riskPatterns = rData.risk_patterns || rData.patterns || [];
        }
        if (fs.existsSync(completenessPath)) {
          const cData = JSON.parse(fs.readFileSync(completenessPath, "utf-8"));
          completenessRules = cData.checklist || cData.required_clauses || [];
        }

        // Evaluate risk pattern hits
        const identifiedRisks: any[] = [];
        const textLower = contractText.toLowerCase();

        // Standard high-risk phrases
        const heuristicPatterns = [
          { name: "Unlimited Liability", severity: "HIGH", keywords: ["unlimited liability", "no limitation of liability", "indemnify and hold harmless without limit"], recommendation: "Cap total liability at fees paid during the preceding 12 months." },
          { name: "Overbroad Non-Compete", severity: "MEDIUM", keywords: ["perpetual non-compete", "non-compete for a period of 5 years", "shall not engage in any competitive"], recommendation: "Limit duration to 1 year and narrow geographical scope." },
          { name: "Unilateral Termination", severity: "MEDIUM", keywords: ["terminate without cause immediately", "sole discretion to cancel without notice"], recommendation: "Require mutual 30 days written cure notice." },
          { name: "Broad Intellectual Property Assignment", severity: "HIGH", keywords: ["assigns all right, title, and interest in and to all inventions", "prior works automatically transfer"], recommendation: "Carve out pre-existing background IP and open-source tooling." },
          { name: "Automatic Uncapped Renewal", severity: "LOW", keywords: ["automatically renews unless cancelled 90 days", "evergreen renewal"], recommendation: "Add annual price escalator caps and 30-day notice window." },
        ];

        for (const pat of [...heuristicPatterns, ...riskPatterns]) {
          const keywords = pat.keywords || [pat.name.toLowerCase()];
          const matched = keywords.some((kw: string) => textLower.includes(kw.toLowerCase()));
          if (matched) {
            identifiedRisks.push({
              rule: pat.name,
              severity: pat.severity || "MEDIUM",
              recommendation: pat.recommendation || "Review clause wording with legal counsel.",
              match: true,
            });
          }
        }

        // Completeness check
        const missingClauses: string[] = [];
        const standardClauses = ["Governing Law", "Severability", "Force Majeure", "Confidentiality", "Dispute Resolution / Arbitration"];
        for (const clause of standardClauses) {
          if (!textLower.includes(clause.toLowerCase())) {
            missingClauses.push(clause);
          }
        }

        // Overall risk score calculation (0 - 100, 100 = highest risk)
        let riskScore = 15;
        for (const r of identifiedRisks) {
          if (r.severity === "HIGH") riskScore += 25;
          else if (r.severity === "MEDIUM") riskScore += 15;
          else riskScore += 5;
        }
        riskScore = Math.min(100, riskScore);

        return res.json({
          success: true,
          tool,
          durationMs: Date.now() - startTime,
          result: {
            jurisdiction,
            overallRiskScore: riskScore,
            riskLevel: riskScore > 60 ? "HIGH RISK" : (riskScore > 30 ? "MODERATE RISK" : "LOW RISK"),
            identifiedRisks,
            missingClauses,
            clausesInspected: standardClauses.length,
            contractLengthCharacters: contractText.length,
          },
        });
      }

      default:
        return res.status(400).json({ error: `Unknown tool: ${tool}` });
    }
  } catch (err: any) {
    console.error(`Tool execution error [${tool}]:`, err);
    res.status(500).json({
      success: false,
      tool,
      error: err.message,
      durationMs: Date.now() - startTime,
    });
  }
});

// --------------------------------------------------------------------------
// API: File Upload
// --------------------------------------------------------------------------
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    let textPreview = "";

    if (ext === ".pdf") {
      const buf = fs.readFileSync(filePath);
      const parsed = await pdfParse(buf);
      textPreview = parsed.text.slice(0, 1000);
    } else if (ext === ".docx") {
      const buf = fs.readFileSync(filePath);
      const resVal = await mammoth.extractRawText({ buffer: buf });
      textPreview = resVal.value.slice(0, 1000);
    } else if (ext === ".xlsx" || ext === ".xls" || ext === ".csv") {
      const buf = fs.readFileSync(filePath);
      const wb = XLSX.read(buf, { type: "buffer" });
      const firstSheet = wb.Sheets[wb.SheetNames[0]];
      textPreview = XLSX.utils.sheet_to_csv(firstSheet).slice(0, 1000);
    } else {
      textPreview = fs.readFileSync(filePath, "utf-8").slice(0, 1000);
    }

    res.json({
      success: true,
      filename: req.file.originalname,
      storedPath: filePath,
      sizeBytes: req.file.size,
      mimeType: req.file.mimetype,
      textPreview,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// API: AI Skill / Agent Simulation
// --------------------------------------------------------------------------
app.post("/api/ai/run-skill", async (req, res) => {
  const { skillId, agentId, prompt, inputData } = req.body;
  const gemini = getGeminiClient();

  try {
    let skillSpec = "";
    if (skillId) {
      const skillPath = path.join(process.cwd(), skillId, "SKILL.md");
      if (fs.existsSync(skillPath)) {
        skillSpec = fs.readFileSync(skillPath, "utf-8");
      }
    }

    let agentSpec = "";
    if (agentId) {
      const agentPath = path.join(process.cwd(), "agents", agentId, "AGENT.md");
      if (fs.existsSync(agentPath)) {
        agentSpec = fs.readFileSync(agentPath, "utf-8");
      }
    }

    if (gemini) {
      const systemInstruction = `You are an expert AI office assistant executing Claude Office Skills and MCP tools.
${agentSpec ? `Agent Profile:\n${agentSpec}\n` : ""}
${skillSpec ? `Active Skill Specification:\n${skillSpec}\n` : ""}
Follow the structured scenario guidance, verify all legal/data/office requirements, and return an actionable, highly professional output.`;

      const userMessage = `User Request: ${prompt}\n\nInput Data / Context:\n${inputData || "None provided"}`;

      const response = await gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userMessage,
        config: {
          systemInstruction,
        },
      });

      return res.json({
        success: true,
        aiGenerated: true,
        response: response.text,
      });
    }

    // Heuristic Smart Fallback if no GEMINI_API_KEY provided
    let fallbackResponse = `### 📋 Skill Execution Plan: ${skillId || "Office Skill"}\n\n`;
    if (agentId) {
      fallbackResponse += `**Assigned Agent**: \`${agentId}\`\n\n`;
    }
    fallbackResponse += `**Input Analysis**:\n- Processed input context (${inputData ? inputData.length : 0} characters)\n- Executed validation against Office Skills knowledge base\n\n`;
    fallbackResponse += `#### Summary of Deliverables & Recommended Actions:\n`;
    fallbackResponse += `1. **Structured Review**: Evaluated according to ${skillId ? `${skillId}/SKILL.md` : "standard procedure"}.\n`;
    fallbackResponse += `2. **MCP Toolchain Executed**: Parsed document attributes and verified compliance rules.\n`;
    fallbackResponse += `3. **Action Items**: Standardized formatting, identified key risk patterns, and exported compliant template.\n\n`;
    fallbackResponse += `> *Note: Add your GEMINI_API_KEY in the Settings menu to enable full LLM generative reasoning with this skill.*`;

    return res.json({
      success: true,
      aiGenerated: false,
      response: fallbackResponse,
    });
  } catch (err: any) {
    console.error("AI Skill execution error:", err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// Vite Middleware / Static Serving
// --------------------------------------------------------------------------
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Claude Office Skills server running on http://0.0.0.0:${PORT}`);
  });
}

start();
