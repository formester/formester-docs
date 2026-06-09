# Formester API v2 Documentation

## Introduction

Formester API v2 is a powerful REST API that provides access to your forms and submissions. V2 introduces organization-level access and improved response formats.

## What's New in V2

| Feature | V1 | V2 |
|---------|----|----|
| Token scope | Form-level | Organization-level |
| Pagination | Fixed 20/page | Fixed 20/page |
| Response format | `results` array | Named arrays + `meta` |

---

## Base URL

All API requests should be made to:

```
https://app.formester.com/api/v2
```

---

## Quick Reference

| Method | Endpoint | Scope Required | Description |
|--------|----------|----------------|-------------|
| GET | `/forms` | `form.view` | List all forms |
| GET | `/forms/:id` | `form.view` | Get a specific form, including its element IDs |
| GET | `/submissions` | `submission.view` | List all submissions |
| GET | `/submissions/:id` | `submission.view` | Get a specific submission |
| DELETE | `/submissions/:id` | `submission.delete` | Delete a submission |
| GET | `/forms/:form_uuid/prefills` | `prefill.read` | List prefills for a form |
| GET | `/forms/:form_uuid/prefills/:id` | `prefill.read` | Get a specific prefill |
| POST | `/forms/:form_uuid/prefills` | `prefill.write` | Bulk create prefills |
| DELETE | `/forms/:form_uuid/prefills` | `prefill.write` | Bulk delete prefills |
| GET | `/forms/:form_uuid/unique_links` | `unique_link.read` | List unique links for a form |
| GET | `/forms/:form_uuid/unique_links/:id` | `unique_link.read` | Get a specific unique link |
| PATCH | `/forms/:form_uuid/unique_links/:id` | `unique_link.write` | Update a unique link |
| POST | `/forms/:form_uuid/unique_links` | `unique_link.write` | Bulk create unique links |
| DELETE | `/forms/:form_uuid/unique_links` | `unique_link.write` | Bulk delete unique links |

---

## Authentication

All API requests require authentication using the `X-FORMESTER-TOKEN` header.

### Request Header

```
X-FORMESTER-TOKEN: your-access-token
```

### Obtaining a Token

To obtain an API v2 access token, visit [app.formester.com/api](https://app.formester.com/api) in your Formester dashboard.

### Token Characteristics

- **Organization-level access**: V2 tokens provide access to all forms within your organization, or can be restricted to specific forms.
- **Scoped permissions**: Each token has specific scopes that determine what operations it can perform.
- **Usage tracking**: Token usage is tracked to help you monitor API consumption.
- **Revocable**: Tokens can be revoked at any time for security purposes.

---

## Scopes

V2 tokens use scopes to control access to API operations.

| Scope | Description | Endpoints |
|-------|-------------|-----------|
| `form.view` | Read access to forms | GET /forms, GET /forms/:id |
| `submission.view` | Read access to submissions | GET /submissions, GET /submissions/:id |
| `submission.delete` | Delete submissions | DELETE /submissions/:id |
| `prefill.read` | Read access to prefills | GET /forms/:form_uuid/prefills, GET /forms/:form_uuid/prefills/:id |
| `prefill.write` | Create and delete prefills | POST /forms/:form_uuid/prefills, DELETE /forms/:form_uuid/prefills |
| `unique_link.read` | Read access to unique links | GET /forms/:form_uuid/unique_links, GET /forms/:form_uuid/unique_links/:id |
| `unique_link.write` | Create, update and delete unique links | POST /forms/:form_uuid/unique_links, PATCH /forms/:form_uuid/unique_links/:id, DELETE /forms/:form_uuid/unique_links |

### Scope Error Response

If your token lacks the required scope for an operation:

```http
HTTP/1.1 403 Forbidden

{
  "message": "You do not have permission to perform this action. Required scope: submission.delete"
}
```

---

## Rate Limiting

To ensure fair usage and platform stability, the API enforces rate limits:

| Limit | Value |
|-------|-------|
| Maximum requests | 10 per 60 seconds |
| Per | Token |

### Rate Limit Response

When you exceed the rate limit:

```http
HTTP/1.1 429 Too Many Requests

{
  "message": "You have exceeded api rate limit"
}
```

---

## Endpoints

### Forms

#### List Forms

Retrieve a list of all forms accessible with your token.

**Endpoint**

```
GET /api/v2/forms
```

**Required Scope:** `form.view`

**Query Parameters**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number |

**cURL Example**

```bash
curl -X GET "https://app.formester.com/api/v2/forms" \
  -H "X-FORMESTER-TOKEN: your-access-token"

# With pagination
curl -X GET "https://app.formester.com/api/v2/forms?page=2" \
  -H "X-FORMESTER-TOKEN: your-access-token"
```

**Response**

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "forms": [
    {
      "id": 123,
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Contact Form",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-20T14:45:00.000Z",
      "submissionsCount": 42
    },
    {
      "id": 456,
      "uuid": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Feedback Survey",
      "createdAt": "2024-02-01T09:00:00.000Z",
      "updatedAt": "2024-02-05T11:30:00.000Z",
      "submissionsCount": 128
    }
  ],
  "meta": {
    "totalCount": 5,
    "page": 1,
    "perPage": 20
  }
}
```

**Response Fields**

| Field | Type | Description |
|-------|------|-------------|
| `forms` | array | Array of form objects |
| `forms[].id` | integer | Numeric form identifier |
| `forms[].uuid` | string | Unique form identifier (UUID) |
| `forms[].name` | string | Form name |
| `forms[].createdAt` | string | ISO 8601 creation timestamp |
| `forms[].updatedAt` | string | ISO 8601 last update timestamp |
| `forms[].submissionsCount` | integer | Total number of submissions |
| `meta.totalCount` | integer | Total number of forms |
| `meta.page` | integer | Current page number |
| `meta.perPage` | integer | Items per page |

---

#### Get Form

Retrieve a single form's metadata along with its element tree. This is the primary way to discover a form's **element IDs**, which are required when building `prefill_data` for [Prefills](#prefills) and [Unique Links](#unique-links) (each `prefill_data` entry maps an element `id` to a value: `{"id": "el_email_1", "value": "..."}`)

**Endpoint**

```
GET /api/v2/forms/:id
```

**Required Scope:** `form.view`

**Path Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Form UUID (numeric form ID also accepted) |

**cURL Example**

```bash
curl -X GET "https://app.formester.com/api/v2/forms/550e8400-e29b-41d4-a716-446655440000" \
  -H "X-FORMESTER-TOKEN: your-access-token"
```

**Response**

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "id": 123,
  "name": "Contact Form",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-20T14:45:00.000Z",
  "submissionsCount": 42,
  "elements": [
    {"id": "el_name_1", "label": "Full Name", "type": "short-text"},
    {"id": "el_email_1", "label": "Email", "type": "email"},
    {
      "id": "el_choice_1",
      "label": "Favourite Colour",
      "type": "dropdown",
      "options": [
        {"label": "Red", "value": "red"},
        {"label": "Blue", "value": "blue"}
      ]
    }
  ]
}
```

**Response Fields**

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Numeric form identifier |
| `name` | string | Form name |
| `createdAt` | string | ISO 8601 creation timestamp |
| `updatedAt` | string | ISO 8601 last update timestamp |
| `submissionsCount` | integer | Total number of submissions |
| `elements` | array | Form's element tree (flattened to the fields below) |
| `elements[].id` | string | Element ID — use this as `prefill_data[].id` when prefilling this field |
| `elements[].label` | string | Element label |
| `elements[].type` | string | Element type (e.g. `short-text`, `email`, `dropdown`, `matrix`, `repeat-field`, `name`, `address`, `phone`) |
| `elements[].options` | array | `{label, value}` choices, present for choice-based types (`radio`, `multiple-checkbox`, `dropdown`, `picture-checkbox`, `ranking`) |
| `elements[].rows` / `elements[].columns` | array | Row/column definitions, present for `matrix` elements |
| `elements[].components` | array | Nested element list, present for `repeat-field` elements |
| `elements[].children` | array | Nested `{fixedname, label, required}` sub-fields, present for `name`/`address` elements |

If the form cannot be found:

```http
HTTP/1.1 404 Not Found

{
  "message": "Form not found or not authorized"
}
```

---

### Submissions

#### List Submissions

Retrieve a list of all submissions with optional filtering and sorting.

**Endpoint**

```
GET /api/v2/submissions
```

**Required Scope:** `submission.view`

**Query Parameters**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number |
| `form_id` | integer | **Yes*** | - | Form numeric ID |
| `form_uuid` | string | **Yes*** | - | Form UUID |
| `sort` | string | No | - | Field name to sort by |
| `order` | string | No | `asc` | Sort order: `asc` or `desc` |
| `{field}` | string | No | - | Filter by exact match |
| `{field}__gte` | string | No | - | Filter: greater than or equal |
| `{field}__gt` | string | No | - | Filter: greater than |
| `{field}__lte` | string | No | - | Filter: less than or equal |
| `{field}__lt` | string | No | - | Filter: less than |

*Either `form_id` or `form_uuid` is required. Use `form_id` for numeric ID or `form_uuid` for UUID.

**cURL Examples**

```bash
# Using form_uuid (recommended)
curl -X GET "https://app.formester.com/api/v2/submissions?form_uuid=550e8400-e29b-41d4-a716-446655440000" \
  -H "X-FORMESTER-TOKEN: your-access-token"

# Using form_id (numeric)
curl -X GET "https://app.formester.com/api/v2/submissions?form_id=123" \
  -H "X-FORMESTER-TOKEN: your-access-token"

# With pagination
curl -X GET "https://app.formester.com/api/v2/submissions?form_uuid=550e8400-e29b-41d4-a716-446655440000&page=2" \
  -H "X-FORMESTER-TOKEN: your-access-token"

# With filtering
curl -X GET "https://app.formester.com/api/v2/submissions?form_uuid=550e8400-e29b-41d4-a716-446655440000&Rating__gte=3" \
  -H "X-FORMESTER-TOKEN: your-access-token"

# With sorting
curl -X GET "https://app.formester.com/api/v2/submissions?form_uuid=550e8400-e29b-41d4-a716-446655440000&sort=created_at&order=desc" \
  -H "X-FORMESTER-TOKEN: your-access-token"
```

**Response**

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "submissions": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "formId": "550e8400-e29b-41d4-a716-446655440000",
      "data": {
        "email": "john@example.com",
        "name": "John Doe",
        "message": "Hello, I have a question."
      },
      "createdAt": "2024-01-20T10:00:00.000Z",
      "updatedAt": "2024-01-20T10:00:00.000Z"
    },
    {
      "id": "880e8400-e29b-41d4-a716-446655440003",
      "formId": "550e8400-e29b-41d4-a716-446655440000",
      "data": {
        "email": "jane@example.com",
        "name": "Jane Smith",
        "message": "Great service!"
      },
      "createdAt": "2024-01-19T15:30:00.000Z",
      "updatedAt": "2024-01-19T15:30:00.000Z"
    }
  ],
  "meta": {
    "formId": 123,
    "formUuid": "550e8400-e29b-41d4-a716-446655440000",
    "totalCount": 150,
    "page": 1,
    "perPage": 20
  }
}
```

**Response Fields**

| Field | Type | Description |
|-------|------|-------------|
| `submissions` | array | Array of submission objects |
| `submissions[].id` | string | Unique submission identifier (UUID) |
| `submissions[].formId` | string | UUID of the form this submission belongs to |
| `submissions[].data` | object | Submitted form data |
| `submissions[].createdAt` | string | ISO 8601 creation timestamp |
| `submissions[].updatedAt` | string | ISO 8601 last update timestamp |
| `meta.formId` | integer | Numeric ID of the form |
| `meta.formUuid` | string | UUID of the form |
| `meta.totalCount` | integer | Total number of submissions |
| `meta.page` | integer | Current page number |
| `meta.perPage` | integer | Items per page |

---

#### Get Submission

Retrieve a specific submission by its UUID.

**Endpoint**

```
GET /api/v2/submissions/:id
```

**Required Scope:** `submission.view`

**Path Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Submission UUID |

**cURL Example**

```bash
curl -X GET "https://app.formester.com/api/v2/submissions/770e8400-e29b-41d4-a716-446655440002" \
  -H "X-FORMESTER-TOKEN: your-access-token"
```

**Response**

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "submission": {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "formId": "550e8400-e29b-41d4-a716-446655440000",
    "data": {
      "email": "john@example.com",
      "name": "John Doe",
      "message": "Hello, I have a question."
    },
    "createdAt": "2024-01-20T10:00:00.000Z",
    "updatedAt": "2024-01-20T10:00:00.000Z"
  }
}
```

---

#### Delete Submission

Delete a specific submission.

**Endpoint**

```
DELETE /api/v2/submissions/:id
```

**Required Scope:** `submission.delete`

**Path Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Submission UUID |

**cURL Example**

```bash
curl -X DELETE "https://app.formester.com/api/v2/submissions/770e8400-e29b-41d4-a716-446655440002" \
  -H "X-FORMESTER-TOKEN: your-access-token"
```

**Response**

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "message": "Submission deleted successfully"
}
```

---

### Prefills

Prefills let you pre-populate a form's fields for a recipient by passing a `_prefill` UUID in the form's survey URL. They are scoped to a specific form, addressed via `:form_uuid` in the path.

> Each prefill's `data` is an array of `{id, value}` pairs, where `id` is a form element's ID. Use [Get Form](#get-form) (`GET /api/v2/forms/:id`) to look up a form's `elements[].id` values before constructing `data`.

#### List Prefills

Retrieve a paginated list of prefills for a form.

**Endpoint**

```
GET /api/v2/forms/:form_uuid/prefills
```

**Required Scope:** `prefill.read`

**Path Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `form_uuid` | string | Yes | Form UUID (numeric form ID also accepted) |

**Query Parameters**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number |
| `name` | string | No | - | Filter by prefill name (partial match) |
| `include_unique_link_prefills` | boolean | No | `false` | Include prefills generated for unique links |

**cURL Example**

```bash
curl -X GET "https://app.formester.com/api/v2/forms/550e8400-e29b-41d4-a716-446655440000/prefills" \
  -H "X-FORMESTER-TOKEN: your-access-token"
```

**Response**

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "prefills": [
    {
      "id": "990e8400-e29b-41d4-a716-446655440004",
      "name": "John Doe",
      "url": "https://app.formester.com/f/550e8400-e29b-41d4-a716-446655440000?_prefill=990e8400-e29b-41d4-a716-446655440004",
      "createdAt": "2024-01-20T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 1
  }
}
```

**Response Fields**

| Field | Type | Description |
|-------|------|-------------|
| `prefills` | array | Array of prefill objects |
| `prefills[].id` | string | Unique prefill identifier (UUID) |
| `prefills[].name` | string | Prefill name |
| `prefills[].url` | string | Survey URL with the `_prefill` query parameter applied |
| `prefills[].createdAt` | string | ISO 8601 creation timestamp |
| `meta.page` | integer | Current page number |
| `meta.perPage` | integer | Items per page |
| `meta.total` | integer | Total number of prefills |

---

#### Get Prefill

Retrieve a specific prefill by its UUID, including its prefill data.

**Endpoint**

```
GET /api/v2/forms/:form_uuid/prefills/:id
```

**Required Scope:** `prefill.read`

**Path Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `form_uuid` | string | Yes | Form UUID (numeric form ID also accepted) |
| `id` | string | Yes | Prefill UUID |

**cURL Example**

```bash
curl -X GET "https://app.formester.com/api/v2/forms/550e8400-e29b-41d4-a716-446655440000/prefills/990e8400-e29b-41d4-a716-446655440004" \
  -H "X-FORMESTER-TOKEN: your-access-token"
```

**Response**

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "id": "990e8400-e29b-41d4-a716-446655440004",
  "name": "John Doe",
  "url": "https://app.formester.com/f/550e8400-e29b-41d4-a716-446655440000?_prefill=990e8400-e29b-41d4-a716-446655440004",
  "createdAt": "2024-01-20T10:00:00.000Z",
  "data": [
    {"id": "el_name_1", "value": "John Doe"},
    {"id": "el_email_1", "value": "john@example.com"}
  ]
}
```

**Response Fields**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique prefill identifier (UUID) |
| `name` | string | Prefill name |
| `url` | string | Survey URL with the `_prefill` query parameter applied |
| `createdAt` | string | ISO 8601 creation timestamp |
| `data` | array | Array of `{id, value}` pairs mapping form element IDs to prefill values |

If the prefill cannot be found:

```http
HTTP/1.1 404 Not Found

{
  "message": "Prefill not found"
}
```

---

#### Bulk Create Prefills

Create one or more prefills for a form in a single request.

**Endpoint**

```
POST /api/v2/forms/:form_uuid/prefills
```

**Required Scope:** `prefill.write`

**Path Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `form_uuid` | string | Yes | Form UUID (numeric form ID also accepted) |

**Body Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prefills` | array | Yes | Array of prefill objects to create |
| `prefills[].name` | string | Yes | Prefill name |
| `prefills[].prefill_data` | array | Yes | Array of `{id, value}` pairs mapping form element IDs to prefill values |

**cURL Example**

```bash
curl -X POST "https://app.formester.com/api/v2/forms/550e8400-e29b-41d4-a716-446655440000/prefills" \
  -H "X-FORMESTER-TOKEN: your-access-token" \
  -H "Content-Type: application/json" \
  -d '{
    "prefills": [
      {
        "name": "John Doe",
        "prefill_data": [
          {"id": "el_name_1", "value": "John Doe"},
          {"id": "el_email_1", "value": "john@example.com"}
        ]
      }
    ]
  }'
```

**Response**

```http
HTTP/1.1 201 Created
Content-Type: application/json
```

```json
{
  "prefills": [
    {
      "prefillId": "990e8400-e29b-41d4-a716-446655440004",
      "url": "https://app.formester.com/f/550e8400-e29b-41d4-a716-446655440000?_prefill=990e8400-e29b-41d4-a716-446655440004",
      "name": "John Doe"
    }
  ]
}
```

**Response Fields**

| Field | Type | Description |
|-------|------|-------------|
| `prefills` | array | Array of created prefill objects |
| `prefills[].prefillId` | string | Unique prefill identifier (UUID) |
| `prefills[].url` | string | Survey URL with the `_prefill` query parameter applied |
| `prefills[].name` | string | Prefill name |

**Validation Errors**

| Status | Error message | Notes |
|--------|---------------|-------|
| 400 | `prefills is required and must be an array` | Body missing or not an array |
| 400 | `too many prefills (max 100)` | Batch exceeds limit |
| 400 | `prefills[0].name is required` | `name` is mandatory for every item |
| 400 | `prefills[0].prefill_data is required and must be an array` | `prefill_data` is mandatory and must be an array |

For `prefill_data` structure errors (invalid element IDs, wrong value types) see [Prefill Data Errors](#prefill-data-errors).

---

#### Bulk Delete Prefills

Delete one or more prefills by UUID.

**Endpoint**

```
DELETE /api/v2/forms/:form_uuid/prefills
```

**Required Scope:** `prefill.write`

**Path Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `form_uuid` | string | Yes | Form UUID (numeric form ID also accepted) |

**Body Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ids` | array | Yes | Array of prefill UUIDs to delete (max 100) |

**cURL Example**

```bash
curl -X DELETE "https://app.formester.com/api/v2/forms/550e8400-e29b-41d4-a716-446655440000/prefills" \
  -H "X-FORMESTER-TOKEN: your-access-token" \
  -H "Content-Type: application/json" \
  -d '{"ids": ["990e8400-e29b-41d4-a716-446655440004", "aa0e8400-e29b-41d4-a716-446655440005"]}'
```

**Response**

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "deleted": 2
}
```

**Validation Errors**

| Status | Error message | Notes |
|--------|---------------|-------|
| 400 | `ids is required` | Body missing `ids` key |
| 400 | `ids must be an array` | `ids` is not an array |
| 400 | `too many ids (max 100)` | Batch exceeds limit |
| 422 | `{ "error": "Prefill IDs not found", "notFoundIds": [...] }` | One or more UUIDs not found |

---

### Unique Links

Unique links are per-recipient survey links that can carry their own prefill data, expiry, and submission status. They are scoped to a specific form, addressed via `:form_uuid` in the path.

> When supplying `prefill_data` on create/update, each entry is `{id, value}` where `id` is a form element's ID. Use [Get Form](#get-form) (`GET /api/v2/forms/:id`) to look up a form's `elements[].id` values beforehand.

#### List Unique Links

Retrieve a paginated list of unique links for a form.

**Endpoint**

```
GET /api/v2/forms/:form_uuid/unique_links
```

**Required Scope:** `unique_link.read`

**Path Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `form_uuid` | string | Yes | Form UUID (numeric form ID also accepted) |

**Query Parameters**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number |
| `entry_name` | string | No | - | Filter by entry name (partial match) |
| `include_prefill_data` | boolean | No | `false` | Include the linked prefill's `prefill_data` in the response |

**cURL Example**

```bash
curl -X GET "https://app.formester.com/api/v2/forms/550e8400-e29b-41d4-a716-446655440000/unique_links?include_prefill_data=true" \
  -H "X-FORMESTER-TOKEN: your-access-token"
```

**Response**

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "uniqueLinks": [
    {
      "id": "bb0e8400-e29b-41d4-a716-446655440006",
      "entryName": "Onboarding Link",
      "status": "pending",
      "active": true,
      "expiresAt": "2024-03-01T00:00:00.000Z",
      "url": "https://app.formester.com/u/bb0e8400-e29b-41d4-a716-446655440006",
      "prefillId": "990e8400-e29b-41d4-a716-446655440004",
      "createdAt": "2024-01-20T10:00:00.000Z",
      "prefillData": [
        {"id": "el_email_1", "value": "a@x.com"}
      ]
    }
  ],
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 1
  }
}
```

**Response Fields**

| Field | Type | Description |
|-------|------|-------------|
| `uniqueLinks` | array | Array of unique link objects |
| `uniqueLinks[].id` | string | Unique link identifier (UUID) |
| `uniqueLinks[].entryName` | string | Recipient/entry name |
| `uniqueLinks[].status` | string | Submission status: `pending`, `in_progress`, or `completed` |
| `uniqueLinks[].active` | boolean | Whether the link is active |
| `uniqueLinks[].expiresAt` | string | ISO 8601 expiration timestamp, or `null` |
| `uniqueLinks[].url` | string | Survey URL for this unique link |
| `uniqueLinks[].prefillId` | string | UUID of the linked prefill, or `null` |
| `uniqueLinks[].createdAt` | string | ISO 8601 creation timestamp |
| `uniqueLinks[].prefillData` | array | Linked prefill's `{id, value}` data (only when `include_prefill_data=true`) |
| `meta.page` | integer | Current page number |
| `meta.perPage` | integer | Items per page |
| `meta.total` | integer | Total number of unique links |

---

#### Get Unique Link

Retrieve a specific unique link by its UUID.

**Endpoint**

```
GET /api/v2/forms/:form_uuid/unique_links/:id
```

**Required Scope:** `unique_link.read`

**Path Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `form_uuid` | string | Yes | Form UUID (numeric form ID also accepted) |
| `id` | string | Yes | Unique link UUID |

**Query Parameters**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `include_prefill_data` | boolean | No | `false` | Include the linked prefill's `prefill_data` in the response |

**cURL Example**

```bash
curl -X GET "https://app.formester.com/api/v2/forms/550e8400-e29b-41d4-a716-446655440000/unique_links/bb0e8400-e29b-41d4-a716-446655440006?include_prefill_data=true" \
  -H "X-FORMESTER-TOKEN: your-access-token"
```

**Response**

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "id": "bb0e8400-e29b-41d4-a716-446655440006",
  "entryName": "Onboarding Link",
  "status": "pending",
  "active": true,
  "expiresAt": "2024-03-01T00:00:00.000Z",
  "url": "https://app.formester.com/u/bb0e8400-e29b-41d4-a716-446655440006",
  "prefillId": "990e8400-e29b-41d4-a716-446655440004",
  "createdAt": "2024-01-20T10:00:00.000Z",
  "prefillData": [
    {"id": "el_email_1", "value": "a@x.com"}
  ]
}
```

**Response Fields**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique link identifier (UUID) |
| `entryName` | string | Recipient/entry name |
| `status` | string | Submission status: `pending`, `in_progress`, or `completed` |
| `active` | boolean | Whether the link is active |
| `expiresAt` | string | ISO 8601 expiration timestamp, or `null` |
| `url` | string | Survey URL for this unique link |
| `prefillId` | string | UUID of the linked prefill, or `null` |
| `createdAt` | string | ISO 8601 creation timestamp |
| `prefillData` | array | Linked prefill's `{id, value}` data (only when `include_prefill_data=true`) |

If the unique link cannot be found:

```http
HTTP/1.1 404 Not Found

{
  "message": "Unique link not found"
}
```

---

#### Bulk Create Unique Links

Create one or more unique links for a form in a single request, optionally attaching prefill data to each.

**Endpoint**

```
POST /api/v2/forms/:form_uuid/unique_links
```

**Required Scope:** `unique_link.write`

**Path Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `form_uuid` | string | Yes | Form UUID (numeric form ID also accepted) |

**Body Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `unique_links` | array | Yes | Array of unique link objects to create (max 100) |
| `unique_links[].entry_name` | string | No | Recipient/entry name (must be unique per form; defaults to a generated ID) |
| `unique_links[].expires_at` | string | No | ISO 8601 expiration timestamp |
| `unique_links[].prefill_data` | array | No | Array of `{id, value}` pairs; when present, a prefill is created and attached to the link |

**cURL Example**

```bash
curl -X POST "https://app.formester.com/api/v2/forms/550e8400-e29b-41d4-a716-446655440000/unique_links" \
  -H "X-FORMESTER-TOKEN: your-access-token" \
  -H "Content-Type: application/json" \
  -d '{
    "unique_links": [
      {
        "entry_name": "Jane Smith",
        "expires_at": "2024-03-01T00:00:00.000Z",
        "prefill_data": [
          {"id": "el_email_1", "value": "jane@example.com"}
        ]
      }
    ]
  }'
```

**Response**

```http
HTTP/1.1 201 Created
Content-Type: application/json
```

```json
{
  "uniqueLinks": [
    {
      "id": "bb0e8400-e29b-41d4-a716-446655440006",
      "entryName": "Jane Smith",
      "url": "https://app.formester.com/u/bb0e8400-e29b-41d4-a716-446655440006",
      "expiresAt": "2024-03-01T00:00:00.000Z",
      "prefillId": "990e8400-e29b-41d4-a716-446655440004"
    }
  ]
}
```

**Response Fields**

| Field | Type | Description |
|-------|------|-------------|
| `uniqueLinks` | array | Array of created unique link objects |
| `uniqueLinks[].id` | string | Unique link identifier (UUID) |
| `uniqueLinks[].entryName` | string | Recipient/entry name |
| `uniqueLinks[].url` | string | Survey URL for this unique link |
| `uniqueLinks[].expiresAt` | string | ISO 8601 expiration timestamp, or `null` |
| `uniqueLinks[].prefillId` | string | UUID of the created prefill, or `null` if no `prefill_data` was supplied |

**Validation Errors**

| Status | Error message | Notes |
|--------|---------------|-------|
| 400 | `unique_links is required and must be an array` | Body missing or not an array |
| 400 | `too many unique_links (max 100)` | Batch exceeds limit |
| 400 | `unique_links[0].prefill_data must be an array` | See [Prefill Data Errors](#prefill-data-errors) for structure errors |
| 400 | `unique_links[0].expires_at is not a valid date` | See [expires_at Errors](#expiresat-errors) |
| 400 | `unique_links[0].expires_at must be in the future` | See [expires_at Errors](#expiresat-errors) |
| 422 | `Duplicate entry_name for this form` | `entry_name` must be unique per form |

---

#### Update Unique Link

Update a unique link's entry name, expiry, active state, and/or attached prefill data.

**Endpoint**

```
PATCH /api/v2/forms/:form_uuid/unique_links/:id
```

**Required Scope:** `unique_link.write`

**Path Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `form_uuid` | string | Yes | Form UUID (numeric form ID also accepted) |
| `id` | string | Yes | Unique link UUID |

**Body Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `entry_name` | string | No | New recipient/entry name (must be unique per form; cannot be blank) |
| `expires_at` | string\|null | No | New ISO 8601 expiration timestamp; pass `null` or empty string to remove expiry |
| `active` | boolean | No | Whether the link is active |
| `prefill_data` | array | No | Array of `{id, value}` pairs; replaces (or creates) the linked prefill's data |

**cURL Example**

```bash
curl -X PATCH "https://app.formester.com/api/v2/forms/550e8400-e29b-41d4-a716-446655440000/unique_links/bb0e8400-e29b-41d4-a716-446655440006" \
  -H "X-FORMESTER-TOKEN: your-access-token" \
  -H "Content-Type: application/json" \
  -d '{
    "entry_name": "Jane S.",
    "active": false,
    "prefill_data": [{"id": "el_email_1", "value": "new@example.com"}]
  }'
```

**Response**

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "id": "bb0e8400-e29b-41d4-a716-446655440006",
  "entryName": "Jane S.",
  "status": "pending",
  "active": false,
  "expiresAt": "2024-03-01T00:00:00.000Z",
  "url": "https://app.formester.com/u/bb0e8400-e29b-41d4-a716-446655440006",
  "prefillId": "990e8400-e29b-41d4-a716-446655440004",
  "createdAt": "2024-01-20T10:00:00.000Z"
}
```

**Response Fields**

Same shape as a [list response](#list-unique-links) item (without `prefill_data`, unless requested separately via the list endpoint).

**Validation Errors**

| Status | Error message | Notes |
|--------|---------------|-------|
| 400 | `entry_name cannot be blank` | `entry_name` key present but empty |
| 400 | `prefill_data must be an array` | See [Prefill Data Errors](#prefill-data-errors) for structure errors |
| 400 | `expires_at is not a valid date` | See [expires_at Errors](#expiresat-errors) |
| 400 | `expires_at must be in the future` | See [expires_at Errors](#expiresat-errors) |
| 422 | `Duplicate entry_name for this form` | `entry_name` must be unique per form |
| 404 | `Unique link not found` | UUID not found or not accessible |

---

#### Bulk Delete Unique Links

Delete one or more unique links by UUID. Linked prefills are destroyed along with their unique link.

**Endpoint**

```
DELETE /api/v2/forms/:form_uuid/unique_links
```

**Required Scope:** `unique_link.write`

**Path Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `form_uuid` | string | Yes | Form UUID (numeric form ID also accepted) |

**Body Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ids` | array | Yes | Array of unique link UUIDs to delete (max 100) |

**cURL Example**

```bash
curl -X DELETE "https://app.formester.com/api/v2/forms/550e8400-e29b-41d4-a716-446655440000/unique_links" \
  -H "X-FORMESTER-TOKEN: your-access-token" \
  -H "Content-Type: application/json" \
  -d '{"ids": ["bb0e8400-e29b-41d4-a716-446655440006"]}'
```

**Response**

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "deleted": 1
}
```

**Validation Errors**

| Status | Error message | Notes |
|--------|---------------|-------|
| 400 | `ids is required` | Body missing `ids` key |
| 400 | `ids must be an array` | `ids` is not an array |
| 400 | `too many ids (max 100)` | Batch exceeds limit |
| 422 | `{ "error": "Unique link IDs not found", "notFoundIds": [...] }` | One or more UUIDs not found |

---

## Filtering & Sorting

### Filtering Submissions

The API supports powerful filtering capabilities using field-based operators.

**Note:** Field-based filtering (using operators like `__gte`, `__lt`, etc.) requires `form_id` or `form_uuid` to be specified.

#### Filter Operators

| Operator | Syntax | Description | Example |
|----------|--------|-------------|---------|
| Equals/Like | `{field}=value` | Exact match or substring | `email=john@example.com` |
| Greater than or equal | `{field}__gte=value` | >= comparison | `Rating__gte=3` |
| Greater than | `{field}__gt=value` | > comparison | `Rating__gt=3` |
| Less than or equal | `{field}__lte=value` | <= comparison | `Rating__lte=5` |
| Less than | `{field}__lt=value` | < comparison | `Rating__lt=5` |

#### Filter Examples

```bash
# Filter by form using UUID
curl -X GET "https://app.formester.com/api/v2/submissions?form_uuid=550e8400-e29b-41d4-a716-446655440000" \
  -H "X-FORMESTER-TOKEN: your-access-token"

# Filter by rating range
curl -X GET "https://app.formester.com/api/v2/submissions?form_uuid=550e8400-e29b-41d4-a716-446655440000&Rating__gte=3&Rating__lte=5" \
  -H "X-FORMESTER-TOKEN: your-access-token"

# Combine with sorting
curl -X GET "https://app.formester.com/api/v2/submissions?form_uuid=550e8400-e29b-41d4-a716-446655440000&Rating__gte=4&sort=created_at&order=desc" \
  -H "X-FORMESTER-TOKEN: your-access-token"
```

### Sorting

Use the `sort` and `order` parameters to control result ordering.

| Parameter | Values | Description |
|-----------|--------|-------------|
| `sort` | Any field name | Field to sort by |
| `order` | `asc`, `desc` | Sort direction (default: `asc`) |

```bash
# Sort by creation date, newest first
curl -X GET "https://app.formester.com/api/v2/submissions?form_uuid=550e8400-e29b-41d4-a716-446655440000&sort=created_at&order=desc" \
  -H "X-FORMESTER-TOKEN: your-access-token"
```

---

## Pagination

All list endpoints return paginated results with 20 items per page.

### Pagination Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `page` | 1 | Page number (1-indexed) |

### Response Meta Object

Every paginated response includes a `meta` object:

```json
{
  "meta": {
    "totalCount": 150,
    "page": 1,
    "perPage": 20
  }
}
```

| Field | Description |
|-------|-------------|
| `totalCount` | Total number of items |
| `page` | Current page number |
| `perPage` | Items per page |

### Calculating Total Pages

```
total_pages = ceil(total_count / per_page)
```

### Pagination Examples

```bash
# First page
curl -X GET "https://app.formester.com/api/v2/submissions?form_uuid=550e8400-e29b-41d4-a716-446655440000&page=1" \
  -H "X-FORMESTER-TOKEN: your-access-token"

# Second page
curl -X GET "https://app.formester.com/api/v2/submissions?form_uuid=550e8400-e29b-41d4-a716-446655440000&page=2" \
  -H "X-FORMESTER-TOKEN: your-access-token"
```

---

## Error Codes

### Prefill Data Errors

These errors can occur on any endpoint that accepts a `prefill_data` array (Bulk Create Prefills, Bulk Create Unique Links, Update Unique Link).

| Status | Error message | Cause |
|--------|---------------|-------|
| 400 | `prefill_data[0].id is required` | An entry in `prefill_data` is missing the `id` field |
| 400 | `prefill_data[0].id 'el_unknown' does not exist in this form` | The element ID does not exist in the form |
| 400 | `prefill_data[0].value must be a scalar for 'short-text' field` | Value type does not match the field type |
| 400 | `prefill_data[0].value must be an array for 'multiple-checkbox' field` | Multi-select fields require an array value |
| 400 | `prefill_data[0].value must be a hash for 'matrix' field` | Matrix fields require an object value |
| 400 | `prefill_data[0].value must be an array for 'repeat-field'` | Repeat fields require an array value |

#### Phone field values

For `phone` elements, pass the value as a string. The accepted formats are:

| Format | Example | When to use |
|--------|---------|-------------|
| `{dialCode}-{localNumber}` | `"+91-9876543210"` | Field has country selector enabled — dial code prefix is stripped and the country is resolved automatically |
| `{dialCode}{localNumber}` | `"+919876543210"` | Same as above; the hyphen separator is optional |
| Local digits only | `"9876543210"` | Field has country selector disabled — value is stored as-is |

When the country selector is enabled, the dial code is matched longest-prefix-first against the E.164 dial code list. `+1` always resolves to the United States. Whitespace is stripped before matching; non-digit characters other than a leading `+` are removed from the local number.

Use [Get Form](#get-form) (`GET /api/v2/forms/:id`) to look up valid element IDs and their types before constructing `prefill_data`.

---

### expires_at Errors

These errors can occur on any endpoint that accepts an `expires_at` value (Bulk Create Unique Links, Update Unique Link).

| Status | Error message | Cause |
|--------|---------------|-------|
| 400 | `expires_at is not a valid date` (or `unique_links[0].expires_at is not a valid date`) | Value cannot be parsed as an ISO 8601 timestamp |
| 400 | `expires_at must be in the future` (or `unique_links[0].expires_at must be in the future`) | Parsed date is in the past |

To **remove** an existing expiry on a unique link, pass `"expires_at": null` (or an empty string) in the Update request.

---

### HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid token format or missing header |
| 401 | Unauthorized - Invalid or inactive token |
| 403 | Forbidden - Token lacks required scope |
| 404 | Not Found - Resource not found or not authorized |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

### Error Response Format

```json
{
  "message": "Error description"
}
```

### Common Error Responses

**Missing Token:**
```http
HTTP/1.1 400 Bad Request

{
  "message": "Access Token not found"
}
```

**Invalid Token:**
```http
HTTP/1.1 400 Bad Request

{
  "message": "Invalid token provided"
}
```

**Inactive Token:**
```http
HTTP/1.1 401 Unauthorized

{
  "message": "Invalid access token"
}
```

**Missing Scope:**
```http
HTTP/1.1 403 Forbidden

{
  "message": "You do not have permission to perform this action. Required scope: submission.delete"
}
```

**Resource Not Found:**
```http
HTTP/1.1 404 Not Found

{
  "message": "Submission not found"
}
```

**Form Not Authorized:**
```http
HTTP/1.1 404 Not Found

{
  "message": "Form not found or not authorized"
}
```

**Rate Limit Exceeded:**
```http
HTTP/1.1 429 Too Many Requests

{
  "message": "You have exceeded api rate limit"
}
```

---

## Migration Guide from V1

### Key Changes

1. **Token Type**: V2 tokens are organization-scoped, not form-scoped.
2. **Response Format**: V2 uses named arrays (`forms`, `submissions`) with a `meta` object.
3. **Pagination**: Both V1 and V2 use fixed 20 items per page.

### Response Format Comparison

**V1 Response:**
```json
{
  "count": 2,
  "total_count": 100,
  "per_page": 20,
  "page": 1,
  "results": [...]
}
```

**V2 Response:**
```json
{
  "submissions": [...],
  "meta": {
    "totalCount": 100,
    "page": 1,
    "perPage": 20
  }
}
```

### Migration Steps

1. **Obtain a V2 token** - Contact support to get an organization-level V2 token.
2. **Update endpoints** - Change `/api/v1/` to `/api/v2/` in your API calls.
3. **Update response parsing** - Access data via named arrays (`forms`, `submissions`) instead of `results`.
4. **Update pagination** - Access pagination info from the `meta` object.

---

## Best Practices

1. **Store tokens securely** - Never expose your API token in client-side code.

2. **Use appropriate scopes** - Request only the scopes you need.

3. **Handle rate limits** - Implement exponential backoff for 429 responses.

4. **Use pagination** - For large datasets, iterate through pages using the `page` parameter.

5. **Filter server-side** - Use query parameters to filter data on the server.

6. **Cache responses** - Cache API responses where appropriate.

7. **Handle errors gracefully** - Check for error responses and handle them appropriately.

---

## Support

If you encounter any issues or have questions:
- Email: [support@formester.com](mailto:support@formester.com)
- For rate limit increases or custom requirements, contact our support team.
