# Formester MCP Server

Connect AI agents directly to your Formester form submissions via the Model Context Protocol (MCP).

The Formester MCP server lets AI models — including Claude, ChatGPT, and any MCP-compatible agent — read submissions, analyze file attachments, search historical data, and write AI-generated insights back to your records. No custom API integration required.

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
   - **View Forms** — read form metadata, structure, styling, and rules
   - **Create & Edit Forms** — create forms, edit fields/pages, update styling and rules, publish/unpublish
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

Tools fall into two groups: **submission tools** (read/write/search submission data and files) and **form tools** (create and edit forms, fields, styling, rules, and publish state).

### Submission tools

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

### Form tools

Most form tools require an **organization-wide token** — one not restricted to a single form (`Forms Access` left empty when creating an API token, or any OAuth/interactive-client connection). Tools that operate on a specific form (`form_id`) also work with a single-form-restricted token, as long as that form matches.

#### `list_forms`

Lists forms in the organization with optional name search and pagination.

- **Required permission:** View Forms
- **Requires an organization-wide token**
- Returns id, uuid, name, live/published status, submission count, and timestamps
- Filters: `query` (case-insensitive substring match on name), `page`, `per_page` (max 100)

#### `create_form`

Starts AI-powered form creation from a natural-language description. Runs in the background.

- **Required permission:** Create & Edit Forms
- **Requires an organization-wide token**
- Inputs: `form_description` (required), optional `form_fields` (specific fields/questions to include), `quiz_type` (e.g. `scored`, `personality`), `name`
- Returns immediately with a `process_id` — poll `get_job_status` with `job_type: "form_creation"` (typical duration 5–30s)

#### `get_form_data`

Returns the complete structure of a form — every page and field, with IDs and properties — plus publish status.

- **Required permission:** View Forms
- Returns `pages`, `fields`, `total_pages`, `total_fields`, `published`, `has_unpublished_changes`, `preview_url`, `live_url`
- **Call this first** before using `update_form_content` — you need the field/page IDs it returns to target `move_field`, `delete_fields`, `update_fields`, `rename_page`, `move_page`, and `delete_page`

#### `update_form_content`

Applies a single field or page operation to a form per call. This is the main editing tool for form structure.

- **Required permission:** Create & Edit Forms
- All changes are saved as a **draft only** — not visible to respondents until `form_publish` is called
- One `action` per call, chosen from:

  | Action | Sync/Async | Notes |
  |--------|-----------|-------|
  | `create_fields` | Async (AI) | Adds fields to a page from a natural-language `field_description`. Poll `get_job_status` with `job_type: "field_create"`. |
  | `update_fields` | Async (AI) | Rewrites existing fields (by `selected_field_ids`) per `field_description`. Requires `confirm: true`. Poll `job_type: "field_update"`. |
  | `move_field` | Sync | Moves one field (`field_id`) to a new `position`; supports moving across pages. |
  | `delete_fields` | Sync | Permanently deletes `field_ids`. Requires `confirm: true`. Irreversible. |
  | `create_page` | Sync | Adds a new page (`page_name`). Use `position` to place it; omit to insert before the last page. |
  | `rename_page` | Sync | Renames `page_id` to `page_name`. |
  | `move_page` | Sync | Moves `page_id` to a new `position`. |
  | `delete_page` | Sync | Deletes `page_id` and all its fields. Requires `confirm: true`. Irreversible. |

- `position` shape: `{ direction: "before" | "after" | "page_start" | "page_end", reference_id: "..." }` — `before`/`after` reference a neighbouring field or page ID; `page_start`/`page_end` (fields only) reference a target page ID for cross-page moves.
- After editing, tell the user changes are saved as a draft and ask whether to publish — only call `form_publish` if they confirm.

#### `form_publish`

Publishes or unpublishes a form, controlling whether the live URL serves the current draft.

- **Required permission:** Create & Edit Forms
- `action: "publish"` snapshots the current draft as the live version (required after `update_form_content` edits to make them visible to respondents)
- `action: "unpublish"` takes the form offline
- Requires `confirm: true` — both actions change what respondents see
- Archived forms are read-only and cannot be published/unpublished

#### `get_form_styling`

Returns the current visual styling of a form — colors, typography, layout, and feature toggles — plus which plan-gated properties (e.g. `custom_css`) are available on the organization's plan.

- **Required permission:** View Forms
- Call this before `set_form_styling` to see current values and valid property names

#### `set_form_styling`

Updates a form's visual styling.

- **Required permission:** Create & Edit Forms
- `stylings` — global properties: colors (hex), typography (`font_family`, font sizes/weights), spacing/margins, `max_width`, `background_brightness`, `logo_size`, `is_rtl_language`, `custom_css`. Only the keys you provide are changed.
- `page_stylings` — per-page layout, e.g. `page_layout` (`full`, `left`, `right`) keyed by page `id`
- Provide at least one of `stylings` or `page_stylings`
- `custom_css` requires a plan that includes the Custom CSS feature — returns a `plan_feature_not_available` error otherwise

#### `get_form_rules`

Lists a form's conditional logic rules (paginated) — each with id, conditions, conjunction, actions, and visibility flag.

- **Required permission:** View Forms
- `page` / `per_page` (max 100) for pagination

#### `set_form_rules`

Starts an AI-powered update of a form's conditional logic rules from a natural-language description (e.g. *"Hide the shipping address fields unless the user selects Delivery, and make the email field required on page 2"*). Runs in the background.

- **Required permission:** Create & Edit Forms
- Validates the resulting rule set and blocks the change if it would create conflicting rules
- Returns immediately with a `process_id` — poll `get_job_status` with `job_type: "rules_update"` (typical duration 5–30s); the response includes `created_rules`, `edited_rules`, `deleted_rules`, `explanation`, and any conflict `warnings`

#### `get_job_status`

Generic poller for background jobs started by `create_form`, `update_form_content` (`create_fields`/`update_fields`), and `set_form_rules`.

- **Required permission:** View Forms
- Inputs: `process_id` (from the tool that started the job) and `job_type` — one of `form_creation`, `field_create`, `field_update`, `rules_update`
- Returns one of:
  - `in_progress` — still running
  - `success` — job-specific result (e.g. the new form's `id`/`uuid`/`edit_url` for `form_creation`, or created/edited/deleted rules for `rules_update`)
  - `failed` — with an `error` message
  - `not_found` — the `process_id` expired (jobs are retained ~15 minutes) or was never valid

---

## Choosing permissions

Select only what your agent needs:

| If your agent... | Select |
|-----------------|--------|
| Only reads submissions | View Submissions |
| Reads and writes insights back | View Submissions + Update Submissions |
| Also needs form details | Add View Forms |
| Creates or edits forms, fields, styling, or rules | Add Create & Edit Forms |
| Lists all forms in the org, or creates new forms | Also use an organization-wide token (leave Forms Access empty) |

---

## Example use cases

- **Job application screening** — read CV attachments, score candidates, save results as custom fields
- **Support triage** — classify incoming requests by category and urgency, route automatically
- **Lead qualification** — analyze contact form submissions, flag high-priority leads
- **Survey analysis** — run sentiment analysis across all responses, tag themes, export insights
- **Form generation from a brief** — turn a natural-language description into a fully built, styled form ready to publish
- **Bulk rebranding** — restyle a set of forms to match new brand colors and fonts via `set_form_styling`
- **Conditional logic authoring** — describe the desired behaviour in plain language and have `set_form_rules` generate and validate the rule set

---

## Typical workflows

**Submission processing**

```
1. Trigger (webhook / scheduled task / manual)
2. read_submission       → get all field data for a submission
3. fetch_file            → read uploaded documents, images, or CVs
4. query_submissions     → find similar past submissions for context
5. [Agent processes data and generates insights]
6. update_submission     → write results (scores, labels, summaries) back to the record
```

**Building a form from scratch**

```
1. create_form                       → start AI form creation, get a process_id
2. get_job_status (form_creation)    → poll until success, get the new form_id
3. get_form_data                     → inspect generated pages/fields
4. update_form_content (create_fields, etc.) → refine fields, as needed
5. set_form_styling                  → apply brand colors/fonts
6. set_form_rules                    → add conditional logic
7. form_publish (action: publish, confirm: true) → go live, after user confirmation
```

**Editing an existing form**

```
1. get_form_data                     → get current field/page IDs and publish status
2. update_form_content                → one action per call (move/delete/create/update fields or pages)
3. get_job_status (field_create/field_update) → poll if the action was AI-powered
4. form_publish (action: publish, confirm: true) → publish the draft, after user confirmation
```

---

## Troubleshooting

See [Troubleshooting](https://github.com/formester/mcp/blob/main/docs/troubleshooting.md) for common errors and fixes.

---

## Links

- [Formester](https://formester.com)
- [MCP GitHub Repository](https://github.com/formester/mcp)
- [REST API Documentation](./formester-api-v2.md)
