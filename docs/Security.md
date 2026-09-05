# Security and reliability controls

## Authentication

- Admin sessions use signed HS256 JWTs with a seven-day expiry, fixed issuer/audience, and a database-checked session version.
- `JWT_SECRET` must contain at least 32 characters. Production rejects obvious placeholder values.
- The authentication cookie is HTTP-only, `SameSite=Lax`, path-scoped to `/`, marked secure in production, and assigned high priority.
- Tokens missing issuer, audience, expiry, or session-version claims are rejected. Logout increments the admin session version and revokes all outstanding tokens.
- `/admin/**` remains protected by the root Next.js middleware; API write routes continue to perform their existing server-side user check.

Generate a production secret with a cryptographically secure password generator and store it in the deployment secret manager. Rotating the secret invalidates every active admin session.

## Request controls

- Every `/admin`, `/api`, and `/uploads` middleware response carries an `X-Request-ID`. A valid incoming ID is propagated; otherwise one is generated.
- Unsafe API requests must provide a canonical `Origin` or `Referer`; cross-site Fetch Metadata is rejected. Production requires `NEXT_PUBLIC_BASE_URL`.
- General API traffic is limited to 60 requests per minute per normalized client address. Login attempts are additionally limited to five per 15 minutes.
- The accepted client address is `X-Real-IP`, then the first `X-Forwarded-For` entry. The production reverse proxy must overwrite both headers and must not pass client-supplied values through unchanged.
- Rate-limit state is process-local, matching the accepted single-server topology. A multi-process or horizontally scaled deployment requires a shared rate-limit store before launch.
- JSON request bodies are capped at 1 MB and uploads at 10 MB. Images are decoded, dimension-limited, re-encoded, and stripped of metadata. PDFs are parsed, copied into clean documents, stripped of annotations/actions, and served as attachments.
- Temporary uploads are private to authenticated admins, expire after 24 hours, and share a 100 MB staging quota.

## Response security

All application responses disable MIME sniffing and framing, restrict referrer information and browser permissions, and apply a restrictive CSP with SRI-protected production bundles and explicit resource origins. Next.js inline bootstrap script elements are allowed for static-rendering compatibility, while inline event-handler attributes remain blocked with `script-src-attr 'none'`. Inter is self-hosted through `next/font`; browsers do not load Google Fonts. Production responses also emit HSTS. The `X-Powered-By` header is disabled.

## Errors and logs

- API failures pass through one error mapper. Unknown errors return the existing `{ "error": "Internal server error" }` body and a correlation header; stack traces and database details are never sent to clients.
- Logs are JSON records written to standard output/error with `app`, `api`, `upload`, or `error` channels. The process manager is responsible for channel routing, rotation, retention, and shipping.
- Passwords, password hashes, tokens, authorization values, cookies, secrets, credentials, email addresses, and phone fields are redacted recursively.
- Request logging records method, path, status, and request ID only. Query strings, request bodies, cookies, credentials, and uploaded file contents are excluded.

No health/readiness endpoint was added because exposing a new operational endpoint requires deployment-owner approval and a defined readiness contract.

## Dependency audit status

The controlled framework migration is complete on Next.js 16.3.0 and React 19. It includes async route parameters, the Next.js 16 `proxy` convention, ESLint 9 flat configuration, updated Node.js requirements, and full regression verification.

`npm run release:verify` is fail-closed: it runs TypeScript, zero-warning lint, automated tests, the production build, the storage migration dry run, and `npm audit --omit=dev`. As of 2026-09-05, both complete and production-only audits report zero vulnerabilities.

Do not use `npm audit fix --force` on a production branch. Future major dependency changes still require a controlled migration, regression pass, and rollback plan.
