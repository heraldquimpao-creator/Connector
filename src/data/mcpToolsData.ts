import { MCPTool } from '../types';

export const MCP_TOOLS_DATA: MCPTool[] = [
  {
    id: 'extract_text_from_docx',
    name: 'extract_text_from_docx',
    category: 'document',
    description: 'Extract raw text, paragraphs, headers, and bullet lists from a Microsoft Word (.docx) document.',
    parameters: [
      { name: 'filePath', type: 'string', description: 'Path to the .docx document', required: true },
      { name: 'includeFootnotes', type: 'boolean', description: 'Whether to include footnotes in extraction', required: false, default: false }
    ],
    returns: 'Document structure with paragraphs, headings, and raw text',
    exampleInput: { filePath: '/docs/employment_contract.docx', includeFootnotes: true },
    exampleOutput: {
      success: true,
      paragraphsCount: 42,
      wordCount: 3840,
      headings: ['1. Position & Duties', '2. Compensation', '3. Confidentiality', '4. Termination'],
      sampleText: 'This Employment Agreement is entered into on January 15, 2025 by and between Acme Corp...'
    }
  },
  {
    id: 'extract_text_from_pdf',
    name: 'extract_text_from_pdf',
    category: 'pdf',
    description: 'Extract text, embedded tables, and metadata from PDF files using pdf-parse and layout heuristics.',
    parameters: [
      { name: 'filePath', type: 'string', description: 'Path to the .pdf file', required: true },
      { name: 'pageRange', type: 'string', description: 'Pages to extract (e.g. "1-5,8")', required: false, default: 'all' }
    ],
    returns: 'Structured text content per page, page count, and document metadata',
    exampleInput: { filePath: '/docs/q4_investor_report.pdf', pageRange: '1-3' },
    exampleOutput: {
      success: true,
      totalPages: 18,
      extractedPages: 3,
      metadata: { author: 'Finance Dept', title: 'Q4 2024 Financial Performance' },
      content: 'Page 1: Executive Summary - Revenue grew 34% YoY reaching $42.5M...'
    }
  },
  {
    id: 'analyze_document_structure',
    name: 'analyze_document_structure',
    category: 'document',
    description: 'Parse document hierarchy, heading trees, table bounding boxes, bullet lists, and callout blocks.',
    parameters: [
      { name: 'filePath', type: 'string', description: 'Path to document (.docx or .pdf)', required: true },
      { name: 'depth', type: 'number', description: 'Heading depth to analyze (1-6)', required: false, default: 3 }
    ],
    returns: 'Hierarchical tree of document sections with character counts and table positions',
    exampleInput: { filePath: '/contracts/master_services_agreement.docx', depth: 3 },
    exampleOutput: {
      success: true,
      sections: [
        { title: '1. Purpose & Scope', level: 1, wordCount: 340, tables: 0 },
        { title: '2. Commercial Terms & Pricing', level: 1, wordCount: 820, tables: 2 },
        { title: '2.1 Milestone Schedule', level: 2, wordCount: 210, tables: 1 },
        { title: '3. Intellectual Property Rights', level: 1, wordCount: 450, tables: 0 }
      ]
    }
  },
  {
    id: 'analyze_spreadsheet',
    name: 'analyze_spreadsheet',
    category: 'spreadsheet',
    description: 'Inspect spreadsheet sheets, detect column types, compute statistical summaries (mean, median, stddev, null counts), and identify trends.',
    parameters: [
      { name: 'filePath', type: 'string', description: 'Path to .xlsx or .csv file', required: true },
      { name: 'sheetName', type: 'string', description: 'Sheet name to analyze (optional)', required: false }
    ],
    returns: 'Schema metadata, row/col counts, summary statistics, and detected data types',
    exampleInput: { filePath: '/data/sales_q1_q2.csv' },
    exampleOutput: {
      success: true,
      rowCount: 6,
      columns: ['Month', 'Product_A_Sales', 'Product_B_Sales', 'Product_A_Rev', 'Product_B_Rev', 'Marketing_Spend'],
      summary: {
        totalRevenue: 643000,
        totalMarketingSpend: 119000,
        averageROI: 5.40,
        productAGrowth: '+66.7%',
        productBGrowth: '+50.0%'
      }
    }
  },
  {
    id: 'create_pivot_table',
    name: 'create_pivot_table',
    category: 'spreadsheet',
    description: 'Generate multidimensional pivot tables and aggregate metrics across grouping dimensions.',
    parameters: [
      { name: 'filePath', type: 'string', description: 'Path to spreadsheet file', required: true },
      { name: 'rows', type: 'string[]', description: 'Column names to use as row groups', required: true },
      { name: 'values', type: 'string[]', description: 'Columns to aggregate', required: true },
      { name: 'aggFunc', type: 'string', description: 'Aggregation function: sum, mean, count, min, max', required: false, default: 'sum' }
    ],
    returns: 'Aggregated pivot matrix with row/column subtotals and grand totals',
    exampleInput: { filePath: '/data/sales.csv', rows: ['Region', 'Product'], values: ['Revenue', 'Profit'], aggFunc: 'sum' },
    exampleOutput: {
      success: true,
      pivotMatrix: [
        { Region: 'North America', Enterprise: 450000, SMB: 210000, Total: 660000 },
        { Region: 'Europe', Enterprise: 320000, SMB: 180000, Total: 500000 },
        { Region: 'Asia Pacific', Enterprise: 280000, SMB: 140000, Total: 420000 }
      ]
    }
  },
  {
    id: 'apply_formulas',
    name: 'apply_formulas',
    category: 'spreadsheet',
    description: 'Programmatically inject dynamic formulas into spreadsheet cells and recalculate dependencies.',
    parameters: [
      { name: 'filePath', type: 'string', description: 'Path to spreadsheet', required: true },
      { name: 'formulaMap', type: 'object', description: 'Mapping of cell addresses to formula strings', required: true }
    ],
    returns: 'Updated spreadsheet with calculated values',
    exampleInput: {
      filePath: '/models/dcf_model.xlsx',
      formulaMap: {
        'F12': '=SUM(B12:E12)',
        'G12': '=NPV(0.095, B12:F12)',
        'H12': '=(F12*(1+0.03))/(0.095-0.03)'
      }
    },
    exampleOutput: {
      success: true,
      cellsUpdated: 3,
      evaluatedValues: { 'F12': 18450000, 'G12': 14220300, 'H12': 292361538 }
    }
  },
  {
    id: 'create_docx',
    name: 'create_docx',
    category: 'document',
    description: 'Generate professional Word (.docx) documents with typography styles, callout cards, tables, and page headers.',
    parameters: [
      { name: 'title', type: 'string', description: 'Document title', required: true },
      { name: 'content', type: 'array', description: 'Structured paragraphs, headings, and tables', required: true },
      { name: 'outputPath', type: 'string', description: 'Output destination path', required: true }
    ],
    returns: 'File path, generated size, and confirmation status',
    exampleInput: {
      title: 'Consulting Agreement 2025',
      outputPath: '/output/consulting_agreement.docx',
      content: [{ type: 'heading1', text: '1. Services & Deliverables' }]
    },
    exampleOutput: {
      success: true,
      outputPath: '/output/consulting_agreement.docx',
      fileSizeKb: 34.2,
      pagesGenerated: 4
    }
  },
  {
    id: 'docx_to_pdf',
    name: 'docx_to_pdf',
    category: 'conversion',
    description: 'Convert Microsoft Word (.docx) documents to pixel-perfect portable PDF format with vector fonts and links preserved.',
    parameters: [
      { name: 'inputPath', type: 'string', description: 'Input .docx path', required: true },
      { name: 'outputPath', type: 'string', description: 'Output .pdf path', required: true }
    ],
    returns: 'Output file path, page count, and conversion metadata',
    exampleInput: { inputPath: '/docs/nda.docx', outputPath: '/docs/nda.pdf' },
    exampleOutput: {
      success: true,
      outputPath: '/docs/nda.pdf',
      pageCount: 3,
      durationMs: 420
    }
  },
  {
    id: 'pdf_ocr',
    name: 'pdf_ocr',
    category: 'pdf',
    description: 'Run neural OCR on scanned PDF pages or image attachments to reconstruct text and tabular layouts.',
    parameters: [
      { name: 'filePath', type: 'string', description: 'Path to scanned PDF', required: true },
      { name: 'languages', type: 'string[]', description: 'Languages to recognize (e.g. ["eng", "chi_sim"])', required: false, default: ['eng'] }
    ],
    returns: 'Recognized text stream with confidence scores and detected bounding boxes',
    exampleInput: { filePath: '/scans/invoice_scan_01.pdf', languages: ['eng'] },
    exampleOutput: {
      success: true,
      confidenceScore: 0.982,
      recognizedText: 'INVOICE #98412\nDate: Jan 24, 2025\nTotal Due: $4,250.00'
    }
  }
];
