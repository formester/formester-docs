# Formester MCP Server

Connect AI agents directly to your Formester form submissions via the Model Context Protocol (MCP).

The Formester MCP server lets AI models — including Claude, GPT-4, and any MCP-compatible agent — read submissions, analyze file attachments, search historical data, and write AI-generated insights back to your records. No custom API integration required.

**Endpoint:** `https://app.formester.com/mcp/sse`

---

## Quickstart

### 1. Create a token

1. Log in to [Formester](https://app.formester.com)
2. Click **API** in the left sidebar
3. Click **Create Token**
4. Enter a name (e.g. "Claude Desktop")
5. **Forms Access** — leave empty to access all forms, or select specific forms to restrict access
6. **Permissions** — select what the agent is allowed to do:
   - **View Submissions** — read submission data and attachment metadata
   - **Update Submissions** — write custom fields back to submissions
   - **View Forms** — read form metadata
7. Click **Create** and copy the token — it won't be shown again

### 2. Connect your AI client

#### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "formester": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://app.formester.com/mcp/sse",
        "--header",
        "Authorization: Bearer YOUR_TOKEN_HERE"
      ]
    }
  }
}
```

Fully quit and restart Claude Desktop.

#### VS Code (GitHub Copilot)

Create or edit `.vscode/mcp.json`:

```json
{
  "servers": {
    "formester": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://app.formester.com/mcp/sse",
        "--header",
        "Authorization: Bearer YOUR_TOKEN_HERE"
      ]
    }
  }
}
```

Switch Copilot Chat to **Agent mode** to use the tools.

#### Cursor

**Settings → MCP → Add new MCP server:**

```json
{
  "formester": {
    "command": "npx",
    "args": [
      "mcp-remote",
      "https://app.formester.com/mcp/sse",
      "--header",
      "Authorization: Bearer YOUR_TOKEN_HERE"
    ]
  }
}
```

#### Claude Code

Run once in your terminal:

```bash
claude mcp add --transport sse formester https://app.formester.com/mcp/sse --header "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Windsurf

Edit `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "formester": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://app.formester.com/mcp/sse",
        "--header",
        "Authorization: Bearer YOUR_TOKEN_HERE"
      ]
    }
  }
}
```

Restart Windsurf after saving.

---

## Tools

### `read_submission`

Read a single form submission by UUID.

- **Required permission:** View Submissions
- **Returns:** All field values, custom fields, status, spam flag, timestamps
- Set `include_files: true` to include file attachment metadata (IDs, filenames, URLs)
- File *content* is not returned here — use `fetch_file` for that

### `query_submissions`

Search and filter multiple submissions from a form.

- **Required permission:** View Submissions
- **Filters:** date range (`created_after`, `created_before`), `starred`, `spam`, custom field value
- Paginated: `limit` (max 100) + `offset`, returns `total_count` and `has_more`
- Dates must be ISO8601 with timezone, e.g. `2024-01-01T00:00:00Z`

### `update_submission`

Write AI-generated data back to a submission as custom fields.

- **Required permission:** Update Submissions
- **Supported types:** `shorttext`, `longtext`, `number`, `date`, `time`, `radio`, `checkbox`, `multiple-checkbox`
- Auto-creates new custom columns if they don't exist
- Cannot overwrite original form submission fields — only custom fields

### `fetch_file`

Download and return the contents of a file attachment.

- **Required permission:** View Submissions
- **Images** (PNG, JPG, GIF, WebP) → base64 for vision-capable AI models
- **PDFs** → extracted text (or base64 if `extract_text: false`)
- **Text files** (TXT, MD, CSV, JSON) → raw text
- **Max file size:** 10 MB
- Call `read_submission` with `include_files: true` first to get attachment IDs

---

## Choosing permissions

Select only what your agent needs:

| If your agent... | Select |
|-----------------|--------|
| Only reads submissions | View Submissions |
| Reads and writes insights back | View Submissions + Update Submissions |
| Also needs form details | Add View Forms |

---

## Example use cases

- **Job application screening** — read CV attachments, score candidates, save results as custom fields
- **Support triage** — classify incoming requests by category and urgency, route automatically
- **Lead qualification** — analyze contact form submissions, flag high-priority leads
- **Survey analysis** — run sentiment analysis across all responses, tag themes, export insights

---

## Typical workflow

```
1. Trigger (webhook / scheduled task / manual)
2. read_submission       → get all field data for a submission
3. fetch_file            → read uploaded documents, images, or CVs
4. query_submissions     → find similar past submissions for context
5. [Agent processes data and generates insights]
6. update_submission     → write results (scores, labels, summaries) back to the record
```

---

## Troubleshooting

See [Troubleshooting](https://github.com/formester/mcp/blob/main/docs/troubleshooting.md) for common errors and fixes.

---

## Links

- [Formester](https://formester.com)
- [MCP GitHub Repository](https://github.com/formester/mcp)
- [REST API Documentation](./formester-api-v2.md)
