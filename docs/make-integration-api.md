# Formester Make Integration API

Public API reference for Formester's Make.com integration. These endpoints are consumed by the
Formester Make app (custom app on Make's platform). All are served under `https://app.formester.com`.

## Authentication

OAuth 2.0 (authorization code + refresh token). The Make app obtains an access token via the
standard flow and sends it as a Bearer token on every request.

| Purpose | Endpoint |
| ------- | -------- |
| Authorize (user consent) | `GET https://app.formester.com/oauth/authorize` |
| Token / refresh | `POST https://app.formester.com/oauth/token` |

- **Grant type:** `authorization_code`; access tokens expire in 1 hour and are renewed with the `refresh_token` grant.
- **Scopes:** `profile:read`, `forms:read`, `submission:read`.
- Every API call below requires the header `Authorization: Bearer <access_token>` and returns JSON.
- Calling with a missing/invalid/expired token returns **401 Unauthorized**; a token lacking the
  required scope returns **403 Forbidden**.

## Endpoints

### GET /make/user

Returns the connected user's profile. Used to validate and label a connection.

**Scope:** `profile:read`

**Response `200`**
```json
{ "email": "jane@acme.com", "name": "Jane Doe" }
```

### GET /make/forms

Lists the forms the connected user can access (excludes trashed forms), most recently updated first.

**Scope:** `forms:read`

**Response `200`**
```json
[
  { "id": 123, "uuid": "abc123", "name": "Contact form", "created_at": "2026-07-01T10:00:00Z" }
]
```

### POST /make/webhooks

Subscribes to new submissions for a form (the Make trigger calls this when a scenario turns on).
Formester then POSTs each new submission to `target_url`.

**Scope:** `submission:read`

**Request**
```json
{ "webhook": { "form_id": 123, "target_url": "https://hook.make.com/…", "events": ["submission.created"] } }
```

**Response `201`**
```json
{ "id": 456, "organization_id": 789, "form_id": 123, "target_url": "https://hook.make.com/…", "events": ["submission.created"], "source": "make", "created_at": "2026-07-01T10:00:00Z" }
```

**Delivered payload** (POSTed to `target_url` on each new submission)
```json
{
  "event_type": "submission.created",
  "data": {
    "id": "sub_uuid",
    "form_id": "abc123",
    "spam": false,
    "created_at": "Jul 01, 2026, 10:00",
    "submission": { "Email": "jane@acme.com", "Message": "Hello" }
  },
  "event_id": "evt_uuid",
  "retries_done": 0
}
```
Field values under `submission` are keyed by the form's field labels. Only non-spam submissions are delivered.

### DELETE /make/webhooks/:id

Unsubscribes (the trigger calls this when a scenario turns off). Only removes Make-created webhooks
the user owns.

**Scope:** `submission:read`

**Response `204 No Content`**

## Errors

Errors return the appropriate HTTP status with a JSON body:
```json
{ "error": "Not found" }
```
| Status | Meaning |
| ------ | ------- |
| 401 | Missing, invalid, or expired token |
| 403 | Token lacks the required scope |
| 404 | Resource not found, or form not owned by the connected user |
| 422 | Invalid request body |
