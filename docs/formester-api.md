# Welcome to Formester API

## Introduction

Formester is a powerful platform for managing and analyzing form submissions. Our public API allows you to interact with Formester programmatically, giving you access to various features and data. This documentation will guide you through the available endpoints and how to use them effectively.

## Authentication

To access Formester's API, you must include an `X-FORMESTER-TOKEN` header in your requests. To obtain your access token for a specific form, please contact our support team at [support@formester.com](mailto:support@formester.com).

## API Endpoints

### 1. Get List of Submissions

- **HTTP Method:** GET
- **Endpoint:** `/api/v1/submissions`

Use this endpoint to retrieve a list of all submissions in your Formester account.

#### Example Request:

```http
GET /api/v1/submissions
Host: app.formester.com
X-FORMESTER-TOKEN: your-access-token
```

### 2. Get a Specific Submission

- **HTTP Method:** GET
- **Endpoint:** `/api/v1/submissions/:id`

Use this endpoint to retrieve a specific submission by providing its unique identifier (`:id`).

#### Example Request:

```http
GET /api/v1/submissions/123456
Host: app.formester.com
X-FORMESTER-TOKEN: your-access-token
```

### 3. Delete a Submission

- **HTTP Method:** DELETE
- **Endpoint:** `/api/v1/submissions/:id`

Use this endpoint to delete a specific submission by providing its unique identifier (`:id`).

#### Example Request:

```http
DELETE /api/v1/submissions/789012
Host: app.formester.com
X-FORMESTER-TOKEN: your-access-token
```

### 4. Filtering Submissions

- **HTTP Method:** GET
- **Endpoint:** `/api/v1/submissions`

Use this endpoint to filter submissions based on specific criteria.

#### Query Parameters:
- `Rating=` (Equal/Like): Filter submissions with same/similar values.
- `Rating__gte=` (Greater Than or Equal To): Filter submissions with a rating greater than or equal to the specified value.
- `Rating__gt=` (Greater Than): Filter submissions with a rating greater than the specified value.
- `Rating__lte=` (Less Than or Equal To): Filter submissions with a rating less than or equal to the specified value.
- `Rating__lt=` (Less Than): Filter submissions with a rating less than the specified value.

#### Example Request to Filter Submissions with Rating Greater Than or Equal To 3:

```http
GET /api/v1/submissions/filter?Rating__gte=3
Host: app.formester.com
X-FORMESTER-TOKEN: your-access-token
```

## Rate Limiting Policy

To ensure the stability and fair usage of Formester's API, we have implemented a rate limiting policy. This policy restricts the number of requests that can be made to our API within a specified time period.

- **Maximum Requests:** You are allowed to make a maximum of 10 requests to our API every 60 seconds.

If you exceed the specified rate limit, your additional requests may be denied within the throttling window. To prevent being throttled, please ensure that your application adheres to the rate limiting policy.

We appreciate your understanding and cooperation in maintaining the performance and availability of Formester's API. If you consistently encounter rate-limiting issues or have specific needs that require a higher rate limit, please contact our support team at [support@formester.com](mailto:support@formester.com) to discuss your requirements.


## Sample Postman Collection

You can import our Postman collection to quickly get started with Formester's API. Click the link below to download and import the collection into Postman:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://www.postman.com/formester/workspace/public-apis/)

Make sure you have Postman installed on your system. If you encounter any issues or have questions about using the collection, please don't hesitate to contact our support team at [support@formester.com](mailto:support@formester.com).
