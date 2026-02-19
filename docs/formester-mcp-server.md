# Formester MCP Server

Connect AI agents directly to your Formester form submissions via the Model Context Protocol (MCP).

The Formester MCP server lets AI models — including Claude, GPT-4, and any MCP-compatible agent — read submissions, analyze file attachments, search historical data, and write AI-generated insights back to your records. No custom API integration required.

---

## Overview

| Property | Value |
|---|---|
| Name | `formester` |
| Version | `1.0.0` |
| Endpoint | `/mcp` |
| Transport | HTTP/SSE (streaming) or STDIO |
| Auth | Bearer token (per-user, per-scope) |

---

## Quickstart

### 1. Generate a token

In your Formester account, go to **API** (from the home page) and click **Generate API Token**. You can scope it to your full account or restrict it to a single form.

### 2. Connect your AI agent

**Claude Desktop** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "formester": {
      "command": "npx",
      "args": ["mcp-remote", "https://app.formester.com/mcp"],
      "env": {
        "BEARER_TOKEN": "your_token_here"
      }
    }
  }
}
```

**STDIO transport:**
```
BEARER_TOKEN=your_token_here npx mcp-remote https://app.formester.com/mcp
```

---

## Tools

### `read_submission`

Read a single form submission by ID.

- **Scope:** `submission.read`
- **Returns:** All field values, custom fields, status, spam flag, timestamps
- Set `include_files: true` to include file attachment metadata (IDs, filenames, URLs)
- File *content* is not returned here — use `fetch_file` for that

### `update_submission`

Write AI-generated data back to a submission as custom fields.

- **Scope:** `submission.write`
- **Supported types:** `shorttext`, `longtext`, `number`, `date`, `time`, `radio`, `checkbox`, `multiple-checkbox`
- Auto-creates new custom columns if they don't exist
- Cannot overwrite original form submission fields — only custom fields

### `query_submissions`

Search and filter multiple submissions from a form.

- **Scope:** `submission.read`
- **Filters:** date range, starred, spam, custom field value
- Paginated: `limit` (max 100) + `offset`, returns `total_count` and `has_more`
- Use to find similar past submissions, analyze trends, or build context before processing a new one

### `fetch_file`

Download and return the contents of a file attachment.

- **Scope:** `submission.read`
- **Images** (PNG, JPG, GIF, WebP, SVG) → base64 for vision-capable AI models
- **PDFs** → extracted text, page by page (or base64 if `extract_text: false`)
- **Text files** (TXT, MD, CSV, JSON, XML, HTML) → raw text
- **Audio/Video** → base64
- **Max file size:** 10 MB
- Also returns metadata: image dimensions, PDF page count, author, etc.

---

## Auth & Security

- Bearer token passed via `Authorization: Bearer <token>` header
- Tokens are scoped per user and optionally restricted to a single form
- Scopes: `submission.read` and/or `submission.write`
- `last_used` timestamp tracked per token

---

## Typical Workflow

```
1. Trigger (webhook / scheduled task / manual)
2. read_submission       → get all field data for a submission
3. fetch_file            → read uploaded documents, images, or CVs
4. query_submissions     → find similar past submissions for context
5. [Agent processes data and generates insights]
6. update_submission     → write results (scores, labels, summaries) back to the record
```

### Example use cases

- **Job application screening** — read CV attachments, score candidates, save results as custom fields
- **Lead qualification** — analyze contact form submissions, enrich with company data, flag high-priority leads
- **Support triage** — classify incoming requests by category and urgency, route automatically
- **Survey analysis** — run sentiment analysis across all responses, tag themes, export insights

---

## Links

- [Formester](https://formester.com)
- [REST API Documentation](./formester-api-v2.md)
