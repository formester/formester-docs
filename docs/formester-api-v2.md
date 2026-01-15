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
| GET | `/submissions` | `submission.view` | List all submissions |
| GET | `/submissions/:id` | `submission.view` | Get a specific submission |
| DELETE | `/submissions/:id` | `submission.delete` | Delete a submission |

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
| `form.view` | Read access to forms | GET /forms |
| `submission.view` | Read access to submissions | GET /submissions, GET /submissions/:id |
| `submission.delete` | Delete submissions | DELETE /submissions/:id |

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
