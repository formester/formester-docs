<template><div><h1 id="welcome-to-formester-api" tabindex="-1"><a class="header-anchor" href="#welcome-to-formester-api" aria-hidden="true">#</a> Welcome to Formester API</h1>
<h2 id="introduction" tabindex="-1"><a class="header-anchor" href="#introduction" aria-hidden="true">#</a> Introduction</h2>
<p>Formester is a powerful platform for managing and analyzing form submissions. Our public API allows you to interact with Formester programmatically, giving you access to various features and data. This documentation will guide you through the available endpoints and how to use them effectively.</p>
<h2 id="authentication" tabindex="-1"><a class="header-anchor" href="#authentication" aria-hidden="true">#</a> Authentication</h2>
<p>To access Formester's API, you must include an <code v-pre>X-FORMESTER-TOKEN</code> header in your requests. To obtain your access token for a specific form, please contact our support team at <a href="mailto:support@formester.com">support@formester.com</a>.</p>
<h2 id="api-endpoints" tabindex="-1"><a class="header-anchor" href="#api-endpoints" aria-hidden="true">#</a> API Endpoints</h2>
<h3 id="_1-get-list-of-submissions" tabindex="-1"><a class="header-anchor" href="#_1-get-list-of-submissions" aria-hidden="true">#</a> 1. Get List of Submissions</h3>
<ul>
<li><strong>HTTP Method:</strong> GET</li>
<li><strong>Endpoint:</strong> <code v-pre>/api/v1/submissions</code></li>
</ul>
<p>Use this endpoint to retrieve a list of all submissions in your Formester account.</p>
<h4 id="example-request" tabindex="-1"><a class="header-anchor" href="#example-request" aria-hidden="true">#</a> Example Request:</h4>
<div class="language-http line-numbers-mode" data-ext="http"><pre v-pre class="language-http"><code>GET /api/v1/submissions
<span class="token header"><span class="token header-name keyword">Host</span><span class="token punctuation">:</span> <span class="token header-value">app.formester.com</span></span>
<span class="token header"><span class="token header-name keyword">X-FORMESTER-TOKEN</span><span class="token punctuation">:</span> <span class="token header-value">your-access-token</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-get-a-specific-submission" tabindex="-1"><a class="header-anchor" href="#_2-get-a-specific-submission" aria-hidden="true">#</a> 2. Get a Specific Submission</h3>
<ul>
<li><strong>HTTP Method:</strong> GET</li>
<li><strong>Endpoint:</strong> <code v-pre>/api/v1/submissions/:id</code></li>
</ul>
<p>Use this endpoint to retrieve a specific submission by providing its unique identifier (<code v-pre>:id</code>).</p>
<h4 id="example-request-1" tabindex="-1"><a class="header-anchor" href="#example-request-1" aria-hidden="true">#</a> Example Request:</h4>
<div class="language-http line-numbers-mode" data-ext="http"><pre v-pre class="language-http"><code>GET /api/v1/submissions/123456
<span class="token header"><span class="token header-name keyword">Host</span><span class="token punctuation">:</span> <span class="token header-value">app.formester.com</span></span>
<span class="token header"><span class="token header-name keyword">X-FORMESTER-TOKEN</span><span class="token punctuation">:</span> <span class="token header-value">your-access-token</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-delete-a-submission" tabindex="-1"><a class="header-anchor" href="#_3-delete-a-submission" aria-hidden="true">#</a> 3. Delete a Submission</h3>
<ul>
<li><strong>HTTP Method:</strong> DELETE</li>
<li><strong>Endpoint:</strong> <code v-pre>/api/v1/submissions/:id</code></li>
</ul>
<p>Use this endpoint to delete a specific submission by providing its unique identifier (<code v-pre>:id</code>).</p>
<h4 id="example-request-2" tabindex="-1"><a class="header-anchor" href="#example-request-2" aria-hidden="true">#</a> Example Request:</h4>
<div class="language-http line-numbers-mode" data-ext="http"><pre v-pre class="language-http"><code>DELETE /api/v1/submissions/789012
<span class="token header"><span class="token header-name keyword">Host</span><span class="token punctuation">:</span> <span class="token header-value">app.formester.com</span></span>
<span class="token header"><span class="token header-name keyword">X-FORMESTER-TOKEN</span><span class="token punctuation">:</span> <span class="token header-value">your-access-token</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-filtering-submissions" tabindex="-1"><a class="header-anchor" href="#_4-filtering-submissions" aria-hidden="true">#</a> 4. Filtering Submissions</h3>
<ul>
<li><strong>HTTP Method:</strong> GET</li>
<li><strong>Endpoint:</strong> <code v-pre>/api/v1/submissions</code></li>
</ul>
<p>Use this endpoint to filter submissions based on specific criteria.</p>
<h4 id="query-parameters" tabindex="-1"><a class="header-anchor" href="#query-parameters" aria-hidden="true">#</a> Query Parameters:</h4>
<ul>
<li><code v-pre>Rating=</code> (Equal/Like): Filter submissions with same/similar values.</li>
<li><code v-pre>Rating__gte=</code> (Greater Than or Equal To): Filter submissions with a rating greater than or equal to the specified value.</li>
<li><code v-pre>Rating__gt=</code> (Greater Than): Filter submissions with a rating greater than the specified value.</li>
<li><code v-pre>Rating__lte=</code> (Less Than or Equal To): Filter submissions with a rating less than or equal to the specified value.</li>
<li><code v-pre>Rating__lt=</code> (Less Than): Filter submissions with a rating less than the specified value.</li>
</ul>
<h4 id="example-request-to-filter-submissions-with-rating-greater-than-or-equal-to-3" tabindex="-1"><a class="header-anchor" href="#example-request-to-filter-submissions-with-rating-greater-than-or-equal-to-3" aria-hidden="true">#</a> Example Request to Filter Submissions with Rating Greater Than or Equal To 3:</h4>
<div class="language-http line-numbers-mode" data-ext="http"><pre v-pre class="language-http"><code>GET /api/v1/submissions/filter?Rating__gte=3
<span class="token header"><span class="token header-name keyword">Host</span><span class="token punctuation">:</span> <span class="token header-value">app.formester.com</span></span>
<span class="token header"><span class="token header-name keyword">X-FORMESTER-TOKEN</span><span class="token punctuation">:</span> <span class="token header-value">your-access-token</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="rate-limiting-policy" tabindex="-1"><a class="header-anchor" href="#rate-limiting-policy" aria-hidden="true">#</a> Rate Limiting Policy</h2>
<p>To ensure the stability and fair usage of Formester's API, we have implemented a rate limiting policy. This policy restricts the number of requests that can be made to our API within a specified time period.</p>
<ul>
<li><strong>Maximum Requests:</strong> You are allowed to make a maximum of 10 requests to our API every 60 seconds.</li>
</ul>
<p>If you exceed the specified rate limit, your additional requests may be denied within the throttling window. To prevent being throttled, please ensure that your application adheres to the rate limiting policy.</p>
<p>We appreciate your understanding and cooperation in maintaining the performance and availability of Formester's API. If you consistently encounter rate-limiting issues or have specific needs that require a higher rate limit, please contact our support team at <a href="mailto:support@formester.com">support@formester.com</a> to discuss your requirements.</p>
<h2 id="sample-postman-collection" tabindex="-1"><a class="header-anchor" href="#sample-postman-collection" aria-hidden="true">#</a> Sample Postman Collection</h2>
<p>You can import our Postman collection to quickly get started with Formester's API. Click the link below to download and import the collection into Postman:</p>
<p><a href="https://www.postman.com/formester/workspace/public-apis/" target="_blank" rel="noopener noreferrer"><img src="https://run.pstmn.io/button.svg" alt="Run in Postman"><ExternalLinkIcon/></a></p>
<p>Make sure you have Postman installed on your system. If you encounter any issues or have questions about using the collection, please don't hesitate to contact our support team at <a href="mailto:support@formester.com">support@formester.com</a>.</p>
</div></template>


