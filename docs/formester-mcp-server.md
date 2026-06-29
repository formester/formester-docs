# Formester MCP Server

Connect AI agents directly to your Formester forms and submissions via the Model Context Protocol (MCP).

The Formester MCP server lets AI models — including Claude, ChatGPT, and any MCP-compatible agent — read and write submissions, analyze file attachments, search historical data, build and edit forms, apply styling, and manage conditional logic. No custom API integration required.

**Endpoint:** `https://app.formester.com/mcp`

---

## Authentication

The Formester MCP server supports two authentication methods:

| Method | Best for |
|--------|---------|
| **OAuth** | Interactive clients (Claude, ChatGPT, Cursor, VS Code) — authorize via browser, no token setup |
| **API Token** | Scripts, automation, or clients without OAuth support — create once in Formester |

### OAuth (Recommended)

Most modern MCP clients handle OAuth automatically — just add the server URL and your browser will open a Formester authorization page.

1. Add `https://app.formester.com/mcp` to your MCP client
2. Your browser opens the Formester authorization page
3. You approve the requested permissions
4. The client connects — no token needed

### API Tokens

For scripts, automation, or clients that don't support OAuth:

1. Log in to [Formester](https://app.formester.com)
2. Click **API** in the left sidebar
3. Click **Create Token**
4. Enter a name (e.g. "My Script")
5. **Forms Access** — leave empty to access all forms in your organization, or select specific forms to restrict access
6. **Permissions** — select what the token is allowed to do:
   - **View Submissions** — read submission data and attachment metadata
   - **Update Submissions** — write custom fields back to submissions
   - **View Forms** — read form structure, list forms, inspect styling and rules
   - **Edit Forms** — create, edit, publish forms and manage styling and conditional rules
7. Click **Create** and copy the token — it won't be shown again

To revoke a token, click **Revoke** next to it on the same page.

---

## Connect your AI client

### Claude

**Via OAuth (recommended)**

Settings → Connectors → Add custom connector → enter a name and `https://app.formester.com/mcp` as the URL. Claude will prompt you to authorize on first connection.

**Via API Token**

```json
{
  "mcpServers": {
    "formester": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://app.formester.com/mcp",
        "--header",
        "Authorization: Bearer YOUR_TOKEN_HERE"
      ]
    }
  }
}
```

Fully quit and restart Claude Desktop.

---

### ChatGPT

ChatGPT → Apps → Search for "Formester" → Connect. ChatGPT handles OAuth automatically.

---

### VS Code (GitHub Copilot)

**Via OAuth**

Create or edit `.vscode/mcp.json`:

```json
{
  "servers": {
    "formester": {
      "type": "http",
      "url": "https://app.formester.com/mcp"
    }
  }
}
```

VS Code will handle the OAuth flow automatically. Switch Copilot Chat to **Agent mode** to use the tools.

**Via API Token**

```json
{
  "servers": {
    "formester": {
      "type": "http",
      "url": "https://app.formester.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_TOKEN_HERE"
      }
    }
  }
}
```

---

### Cursor

**Via OAuth**

Settings → MCP → Add new MCP server:

```json
{
  "mcpServers": {
    "formester": {
      "url": "https://app.formester.com/mcp"
    }
  }
}
```

Cursor will prompt you to authorize via browser on first use.

**Via API Token**

```json
{
  "mcpServers": {
    "formester": {
      "url": "https://app.formester.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_TOKEN_HERE"
      }
    }
  }
}
```

---

### Claude Code

**Via OAuth**

```bash
claude mcp add --transport http formester https://app.formester.com/mcp
```

**Via API Token**

```bash
claude mcp add --transport http formester https://app.formester.com/mcp \
  --header "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### Windsurf

**Via OAuth**

Edit `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "formester": {
      "type": "streamable-http",
      "url": "https://app.formester.com/mcp"
    }
  }
}
```

**Via API Token**

```json
{
  "mcpServers": {
    "formester": {
      "type": "streamable-http",
      "url": "https://app.formester.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_TOKEN_HERE"
      }
    }
  }
}
```

Restart Windsurf after saving.

---

## Tools

### Submission Tools

#### `read_submission`

Read a single form submission by UUID.

- **Required permission:** View Submissions
- **Returns:** All field values, custom fields, status, spam flag, timestamps
- Set `include_files: true` to include file attachment metadata (IDs, filenames, URLs)
- File *content* is not returned here — use `fetch_file` for that

#### `query_submissions`

Search and filter multiple submissions from a form.

- **Required permission:** View Submissions
- **Filters:** date range (`created_after`, `created_before`), `starred`, `spam`, custom field value
- Paginated: `limit` (max 100) + `offset`, returns `total_count` and `has_more`
- Dates must be ISO8601 with timezone, e.g. `2024-01-01T00:00:00Z`

#### `update_submission`

Write AI-generated data back to a submission as custom fields.

- **Required permission:** Update Submissions
- **Supported types:** `shorttext`, `longtext`, `number`, `date`, `time`, `radio`, `checkbox`, `multiple-checkbox`
- Auto-creates new custom columns if they don't exist
- Cannot overwrite original form submission fields — only custom fields

#### `fetch_file`

Download and return the contents of a file attachment.

- **Required permission:** View Submissions
- **Images** (PNG, JPG, GIF, WebP) → base64 for vision-capable AI models
- **PDFs** → extracted text (or base64 if `extract_text: false`)
- **Text files** (TXT, MD, CSV, JSON) → raw text
- **Max file size:** 10 MB
- Call `read_submission` with `include_files: true` first to get attachment IDs

---

### Form Management Tools

#### `list_forms`

List all forms in your organization.

- **Required permission:** View Forms
- **Note:** Requires an organization-wide token (not a form-restricted token)
- **Filters:** `query` — case-insensitive substring match on form name
- Paginated: `page` + `per_page` (max 100)
- **Returns:** Form ID, name, publish status, submission count, timestamps

#### `create_form`

Create a new form using a natural language description.

- **Required permission:** Edit Forms
- **Note:** Requires an organization-wide token
- Provide `form_description` (e.g. `"Contact form with name, email, phone, and a message field"`)
- Optionally pass explicit `form_fields`, a `quiz_type`, or a `name`
- **Returns:** `process_id` — poll with `get_job_status` (job type: `form_creation`). Typically completes in 5–30 seconds.

#### `get_form_data`

Get the full structure of a form: pages, fields, and their IDs.

- **Required permission:** View Forms
- **Returns:** Pages with IDs, all fields with IDs, types, labels, validation rules, preview and live URLs
- **Always call this before** `update_form_content` — field and page IDs are required for all edit operations

#### `update_form_content`

Add, edit, move, or delete fields and pages on a form. One action per call.

- **Required permission:** Edit Forms
- **Always call `get_form_data` first** to get valid field and page IDs
- All changes are saved as a **draft** — call `form_publish` to make them live

**Available actions:**

| Action | What it does | Sync/Async |
|--------|-------------|-----------|
| `create_fields` | Add new fields using a natural language description | Async (poll `get_job_status`, type `field_create`) |
| `update_fields` | Modify existing fields using a natural language description | Async (poll `get_job_status`, type `field_update`) |
| `move_field` | Reposition a field (supports cross-page moves) | Sync |
| `delete_fields` | Permanently delete fields (requires `confirm: true`) | Sync |
| `create_page` | Add a new page | Sync |
| `rename_page` | Rename an existing page | Sync |
| `move_page` | Reorder pages | Sync |
| `delete_page` | Permanently delete a page and all its fields (requires `confirm: true`) | Sync |

#### `form_publish`

Publish or unpublish a form.

- **Required permission:** Edit Forms
- `action`: `"publish"` or `"unpublish"`
- Requires `confirm: true` as a safety gate
- **Returns:** Updated publish status and the live URL

---

### Form Styling Tools

#### `get_form_styling`

Read the current styling of a form.

- **Required permission:** View Forms
- **Returns:** All style properties (colors, fonts, spacing, layout), per-page layout settings, and which properties are plan-gated (e.g. custom CSS)
- **Always call this before** `set_form_styling` to see current values

#### `set_form_styling`

Update the visual appearance of a form.

- **Required permission:** Edit Forms
- Pass a `stylings` object with any combination of the properties below, and/or `page_stylings` for per-page layout

**Colors:** `background_color`, `form_color`, `font_color`, `button_color`, `button_text_color`, `border_color`, `placeholder_color`, `progress_color`, `link_color`, `answer_text_color`

**Typography:** `font_family`, `font_size` (8–72 px), `answer_font_size`, `label_font_weight`, `description_font_weight`

**Spacing:** `margin_top`, `margin_bottom`, `form_vertical_padding`, `form_horizontal_padding`, `max_width`

**Page layout:** pass `page_stylings: [{id: "page_uuid", page_layout: "full|left|right"}]`

**Other:** `background_brightness` (10–200 %), `logo_size` (20–200 px), `is_rtl_language`, `custom_css` (plan-gated)

---

### Conditional Rules Tools

#### `get_form_rules`

Read the conditional logic rules on a form.

- **Required permission:** View Forms
- Paginated: `page` + `per_page` (max 100)
- **Returns:** All rules with their conditions and actions

#### `set_form_rules`

Create or replace conditional logic rules using a natural language description.

- **Required permission:** Edit Forms
- Provide `rules_description` (e.g. `"Hide the shipping address field unless the user selects Delivery, and make the phone field required on page 2"`)
- **Returns:** `process_id` — poll with `get_job_status` (job type: `rules_update`). Typically completes in 5–30 seconds.
- The AI validates the resulting rules and will block conflicting rule sets

---

### Async Job Polling

#### `get_job_status`

Check the status of an async job started by `create_form`, `update_form_content`, or `set_form_rules`.

- **Required permission:** View Forms
- Provide the `process_id` and `job_type` returned by the async tool
- **Statuses:**
  - `in_progress` — still running, poll again
  - `success` — completed; response includes job-specific results (e.g. form creation returns the new form's ID and edit URL)
  - `failed` — job failed; response includes an error message
  - `not_found` — invalid or expired `process_id` (process IDs expire after 15 minutes)

---

## Choosing permissions

Select only what your agent needs:

| If your agent... | Select |
|-----------------|--------|
| Only reads submissions | View Submissions |
| Reads and writes insights back | View Submissions + Update Submissions |
| Reads form structure or lists forms | Add View Forms |
| Builds, edits, or publishes forms | Add Edit Forms |

---

## Example use cases

- **Job application screening** — read CV attachments, score candidates, save results as custom fields
- **Support triage** — classify incoming requests by category and urgency, route automatically
- **Lead qualification** — analyze contact form submissions, flag high-priority leads
- **Survey analysis** — run sentiment analysis across all responses, tag themes, export insights
- **Form generation** — describe what you need in plain English, let the AI build the form for you
- **Brand-consistent styling** — apply a color palette and typography to a form programmatically
- **Conditional logic** — describe your show/hide and required-field rules in plain language and let the AI wire them up

---

## Typical workflows

**Submission processing workflow**

```
1. Trigger (webhook / scheduled task / manual)
2. read_submission       → get all field data for a submission
3. fetch_file            → read uploaded documents, images, or CVs
4. query_submissions     → find similar past submissions for context
5. [Agent processes data and generates insights]
6. update_submission     → write results (scores, labels, summaries) back to the record
```

**Form creation workflow**

```
1. create_form           → describe the form in plain English; receive process_id
2. get_job_status        → poll until status = "success"; receive form UUID
3. get_form_data         → inspect generated fields and page IDs
4. update_form_content   → add, edit, or reorder fields as needed
5. get_form_styling      → inspect current styling
6. set_form_styling      → apply brand colors and typography
7. set_form_rules        → describe conditional logic in plain language
8. get_job_status        → poll until rules job completes
9. form_publish          → make the form live
```

---

## Troubleshooting

See [Troubleshooting](https://github.com/formester/mcp/blob/main/docs/troubleshooting.md) for common errors and fixes.

---

## Links

- [Formester](https://formester.com)
- [MCP GitHub Repository](https://github.com/formester/mcp)
- [REST API Documentation](./formester-api-v2.md)
