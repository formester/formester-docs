# Formester API v1 Documentation

## Introduction

Formester is a powerful platform for managing and analyzing form submissions. The v1 API provides read access to your forms and submissions, allowing you to retrieve, filter, and delete submission data programmatically.

## Base URL

All API requests should be made to:

```
https://app.formester.com/api/v1
```

---

## Quick Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/forms` | List all forms |
| GET | `/submissions` | List all submissions |
| GET | `/submissions/:id` | Get a specific submission |
| DELETE | `/submissions/:id` | Delete a submission |

---

## Authentication

All API requests require authentication using the `X-FORMESTER-TOKEN` header.

### Request Header

```
X-FORMESTER-TOKEN: your-access-token
```

### Obtaining a Token

To obtain an API access token for your forms, please contact our support team at [support@formester.com](mailto:support@formester.com).

**Token Characteristics:**
- Tokens are issued per form
- Each token has specific scopes that determine what operations it can perform
- Tokens can be revoked at any time

---

## Rate Limiting

To ensure fair usage and platform stability, the API enforces rate limits:

| Limit | Value |
|-------|-------|
| Maximum requests | 10 per 60 seconds |
| Per | Token |

### Rate Limit Response

When you exceed the rate limit, you will receive:

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{
  "message": "You have exceeded api rate limit"
}
```

**Best Practices:**
- Implement exponential backoff when receiving 429 responses
- Cache responses when possible
- Batch operations where applicable

---

## Endpoints

### 1. List Forms

Retrieve a list of all forms accessible with your token.

**Endpoint**

```
GET /api/v1/forms
```

**Required Scope:** `form.view`

**Query Parameters**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number for pagination |

**cURL Example**

```bash
curl -X GET "https://app.formester.com/api/v1/forms" \
  -H "X-FORMESTER-TOKEN: your-access-token"
```

**Response**

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "count": 2,
  "total_count": 2,
  "per_page": 20,
  "page": 1,
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Contact Form",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-20T14:45:00.000Z",
      "preview_image_url": "https://cdn.formester.com/previews/form-123.png",
      "slug": "contact-form",
      "is_live": true
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Feedback Survey",
      "created_at": "2024-02-01T09:00:00.000Z",
      "updated_at": "2024-02-05T11:30:00.000Z",
      "preview_image_url": "https://cdn.formester.com/previews/form-456.png",
      "slug": "feedback-survey",
      "is_live": true
    }
  ]
}
```

**Response Fields**

| Field | Type | Description |
|-------|------|-------------|
| `count` | integer | Number of forms in current page |
| `total_count` | integer | Total number of forms |
| `per_page` | integer | Items per page (fixed at 20) |
| `page` | integer | Current page number |
| `results` | array | Array of form objects |
| `results[].id` | string | Unique form identifier (UUID) |
| `results[].name` | string | Form name |
| `results[].created_at` | string | ISO 8601 creation timestamp |
| `results[].updated_at` | string | ISO 8601 last update timestamp |
| `results[].preview_image_url` | string | URL to form preview image |
| `results[].slug` | string | URL-friendly form identifier |
| `results[].is_live` | boolean | Whether the form is published |

---

### 2. List Submissions

Retrieve a list of all submissions with optional filtering and sorting.

**Endpoint**

```
GET /api/v1/submissions
```

**Required Scope:** `submission.view`

**Query Parameters**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number for pagination |
| `sort` | string | No | - | Field name to sort by |
| `order` | string | No | `asc` | Sort order: `asc` or `desc` |
| `{field}` | string | No | - | Filter by exact match |
| `{field}__gte` | string | No | - | Filter: greater than or equal |
| `{field}__gt` | string | No | - | Filter: greater than |
| `{field}__lte` | string | No | - | Filter: less than or equal |
| `{field}__lt` | string | No | - | Filter: less than |

**cURL Example**

```bash
# Basic request
curl -X GET "https://app.formester.com/api/v1/submissions" \
  -H "X-FORMESTER-TOKEN: your-access-token"

# With pagination
curl -X GET "https://app.formester.com/api/v1/submissions?page=2" \
  -H "X-FORMESTER-TOKEN: your-access-token"

# With filtering
curl -X GET "https://app.formester.com/api/v1/submissions?Rating__gte=3&Rating__lt=5" \
  -H "X-FORMESTER-TOKEN: your-access-token"

# With sorting
curl -X GET "https://app.formester.com/api/v1/submissions?sort=created_at&order=desc" \
  -H "X-FORMESTER-TOKEN: your-access-token"
```

**Response**

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "count": 2,
  "total_count": 150,
  "per_page": 20,
  "page": 1,
  "results": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "spam": false,
      "data": {
        "email": "john@example.com",
        "name": "John Doe",
        "message": "Hello, I have a question about your product.",
        "Rating": 5
      },
      "created_at": "2024-01-20T10:00:00.000Z"
    },
    {
      "id": "880e8400-e29b-41d4-a716-446655440003",
      "spam": false,
      "data": {
        "email": "jane@example.com",
        "name": "Jane Smith",
        "message": "Great service!",
        "Rating": 4
      },
      "created_at": "2024-01-19T15:30:00.000Z"
    }
  ]
}
```

**Response Fields**

| Field | Type | Description |
|-------|------|-------------|
| `count` | integer | Number of submissions in current page |
| `total_count` | integer | Total number of submissions |
| `per_page` | integer | Items per page (fixed at 20) |
| `page` | integer | Current page number |
| `results` | array | Array of submission objects |
| `results[].id` | string | Unique submission identifier (UUID) |
| `results[].spam` | boolean | Whether submission is marked as spam |
| `results[].data` | object | Submitted form data (field names as keys) |
| `results[].created_at` | string | ISO 8601 submission timestamp |

---

### 3. Get Submission

Retrieve a specific submission by its unique identifier.

**Endpoint**

```
GET /api/v1/submissions/:id
```

**Required Scope:** `submission.view`

**Path Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Submission UUID |

**cURL Example**

```bash
curl -X GET "https://app.formester.com/api/v1/submissions/770e8400-e29b-41d4-a716-446655440002" \
  -H "X-FORMESTER-TOKEN: your-access-token"
```

**Response**

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "spam": false,
  "data": {
    "email": "john@example.com",
    "name": "John Doe",
    "message": "Hello, I have a question about your product.",
    "Rating": 5
  },
  "created_at": "2024-01-20T10:00:00.000Z"
}
```

**Response Fields**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique submission identifier (UUID) |
| `spam` | boolean | Whether submission is marked as spam |
| `data` | object | Submitted form data |
| `created_at` | string | ISO 8601 submission timestamp |

---

### 4. Delete Submission

Delete a specific submission by its unique identifier.

**Endpoint**

```
DELETE /api/v1/submissions/:id
```

**Required Scope:** `submission.view`

**Path Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Submission UUID |

**cURL Example**

```bash
curl -X DELETE "https://app.formester.com/api/v1/submissions/770e8400-e29b-41d4-a716-446655440002" \
  -H "X-FORMESTER-TOKEN: your-access-token"
```

**Response**

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "message": "Submission deleted"
}
```

---

## Filtering Submissions

The API supports powerful filtering capabilities for submissions using field-based operators.

### Filter Operators

| Operator | Syntax | Description | Example |
|----------|--------|-------------|---------|
| Equals/Like | `{field}=value` | Exact match or substring | `email=john@example.com` |
| Greater than or equal | `{field}__gte=value` | >= comparison | `Rating__gte=3` |
| Greater than | `{field}__gt=value` | > comparison | `Rating__gt=3` |
| Less than or equal | `{field}__lte=value` | <= comparison | `Rating__lte=5` |
| Less than | `{field}__lt=value` | < comparison | `Rating__lt=5` |

### Filter Examples

**Filter by rating range:**
```bash
curl -X GET "https://app.formester.com/api/v1/submissions?Rating__gte=3&Rating__lte=5" \
  -H "X-FORMESTER-TOKEN: your-access-token"
```

**Filter by email and sort by date:**
```bash
curl -X GET "https://app.formester.com/api/v1/submissions?email=example.com&sort=created_at&order=desc" \
  -H "X-FORMESTER-TOKEN: your-access-token"
```

**Combine multiple filters:**
```bash
curl -X GET "https://app.formester.com/api/v1/submissions?Rating__gte=4&email=company.com&sort=Rating&order=desc" \
  -H "X-FORMESTER-TOKEN: your-access-token"
```

---

## Pagination

All list endpoints return paginated results.

### Pagination Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `page` | 1 | Page number (1-indexed) |

### Pagination Response Fields

| Field | Description |
|-------|-------------|
| `count` | Number of items in the current page |
| `total_count` | Total number of items across all pages |
| `per_page` | Items per page (fixed at 20) |
| `page` | Current page number |

### Calculating Total Pages

```
total_pages = ceil(total_count / per_page)
```

### Example: Paginating Through Results

```bash
# First page
curl -X GET "https://app.formester.com/api/v1/submissions?page=1" \
  -H "X-FORMESTER-TOKEN: your-access-token"

# Second page
curl -X GET "https://app.formester.com/api/v1/submissions?page=2" \
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
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

### Error Response Format

All errors return a JSON object with a `message` field:

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

**Invalid Token Format:**
```http
HTTP/1.1 400 Bad Request

{
  "message": "Invalid token provided"
}
```

**Inactive or Revoked Token:**
```http
HTTP/1.1 401 Unauthorized

{
  "message": "Invalid access token"
}
```

**Missing Required Scope:**
```http
HTTP/1.1 403 Forbidden

{
  "message": "You do not have permission to view submissions"
}
```

**Submission Not Found:**
```http
HTTP/1.1 400 Bad Request

{
  "message": "Error while fetching the submission"
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

## Best Practices

1. **Store tokens securely** - Never expose your API token in client-side code or public repositories.

2. **Handle rate limits gracefully** - Implement exponential backoff when receiving 429 responses.

3. **Use pagination** - For large datasets, iterate through pages rather than attempting to fetch all data at once.

4. **Cache responses** - Cache API responses where appropriate to reduce unnecessary requests.

5. **Filter server-side** - Use the filtering parameters to reduce data transfer rather than filtering client-side.

---

## Sample Postman Collection

Import our Postman collection to quickly get started:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://www.postman.com/formester/workspace/public-apis/)

---

## Support

If you encounter any issues or have questions:
- Email: [support@formester.com](mailto:support@formester.com)
- For rate limit increases or custom requirements, contact our support team.
