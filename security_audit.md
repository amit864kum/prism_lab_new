# Security Audit

**Audit date:** 2026-09-05  
**Scope:** All application source, 25 route handlers, authentication and middleware, validation, MongoDB access, upload/storage handling, public rendering, dependencies, CI/CD, Nginx, PM2, backup/restore scripts, and limited unauthenticated checks against the local development server.

## Executive summary

No critical vulnerability was found. The audit identified **1 high**, **5 moderate**, and **8 low** findings. The remediation pass fixed the source/configuration issues in **SEC-01 through SEC-03 and SEC-05 through SEC-14**. `npm audit --omit=dev` now reports zero vulnerabilities, and the full type-check, lint, 56-test suite, and production build pass. **SEC-04 remains open by explicit owner decision.**

This is a source/configuration audit, not proof that every deployed host is secure. Production firewall rules, file permissions, MongoDB authorization/TLS, secret-manager policy, DNS, and authenticated browser penetration testing were not available for verification.

## Remediation status

The 2026-09-05 remediation pass addressed SEC-01 through SEC-03 and SEC-05 through SEC-14 in source/configuration. **SEC-04 remains intentionally unchanged at the owner's request.** For SEC-12, personal assets were removed from the current tracked tree and copied into ignored durable storage; purging copies already present in remote Git history still requires a coordinated history rewrite and clone rotation.

## Findings

### SEC-01 — High — Backend may be reachable outside the Nginx trust boundary

**Evidence:** `deployment/pm2/ecosystem.config.js:13` starts `next start -p ...` without `--hostname`; Next.js 16.3 defaults to `0.0.0.0`. Nginx connects through `127.0.0.1` and overwrites trusted client-IP headers (`deployment/nginx/prism-lab.conf:10,49-50`), but neither the PM2 configuration nor deployment documentation enforces a loopback-only backend or closed port 3000.

**Impact:** If port 3000 is allowed by the host firewall or cloud security group, requests can bypass TLS and Nginx. Attackers can spoof `X-Real-IP`/`X-Forwarded-For`, evade login/API rate limits, weaken origin assumptions, and access authentication endpoints over plaintext.

**Fix:** Start Next.js with `--hostname 127.0.0.1`; deny external ingress to port 3000; add this condition to preflight and deployment verification.

### SEC-02 — Moderate — Vulnerable Tiptap dependency

**Evidence:** `package-lock.json:2428-2438` resolves `@tiptap/core` 3.25.0. On the audit date, both `npm audit` and `npm audit --omit=dev` reported GHSA-cp6q-959q-f8rh: `mergeAttributes()` can turn an own `__proto__` key into inherited executable DOM attributes (CWE-79/CWE-1321). NPM reports 27 affected Tiptap packages, but they trace to this one advisory. A fix is available in 3.30.4 or later.

**Impact:** Crafted editor attributes may create executable DOM attributes and XSS in affected editor flows.

**Fix:** Upgrade all Tiptap packages together to at least 3.30.4, regenerate the lockfile, and rerun the full test/build and production audit gates.

### SEC-03 — Moderate — Seven-day JWT sessions cannot be centrally revoked

**Evidence:** Tokens expire after seven days (`src/lib/auth.ts:24-30`). `getCurrentUser()` only verifies the JWT (`src/lib/auth.ts:81-84`); mutation routes do not confirm that the referenced admin still exists or is enabled. The fallback verifier also accepts signed legacy tokens with no issuer/audience (`src/lib/auth.ts:45-52`). Only `/api/auth/me` performs a database lookup.

**Impact:** A stolen token remains authorized after logout on another device, admin deletion, or a credential change until expiry or global JWT-secret rotation. A correctly signed legacy token without `exp` would also be accepted indefinitely.

**Fix:** Add a server-side session/version or revocation check to the authorization path, require `exp`, remove the legacy fallback after a fixed migration deadline, and shorten/rotate sessions for sensitive admin access.

### SEC-04 — Moderate — Admin authentication is single-factor

**Evidence:** The only login factors are email and password; no MFA/WebAuthn, recovery controls, or per-account lockout exist. The five-attempt/15-minute limiter is process-local and keyed only by client IP (`src/lib/rate-limit.ts`, `src/middleware/rate-limit.ts`). The bootstrap password minimum is 12 characters, which is a positive control.

**Impact:** Password compromise immediately grants full CMS CRUD and upload access. Distributed attempts, process restarts, or direct-backend access reduce the effectiveness of the IP limiter.

**Fix:** Add MFA/WebAuthn for administrators, shared rate-limit state, per-account throttling with safe alerting, and session/device management.

### SEC-05 — Moderate — Backup operations can expose database credentials and sensitive archives

**Evidence:** The MongoDB URI is passed on the command line to `mongodump` and `mongorestore` (`deployment/scripts/backup.sh:42`, `deployment/scripts/restore.sh:66`), where credentials may be visible to local process inspection. Backup directories/files are created without explicit restrictive modes or `umask` (`deployment/scripts/backup.sh:15,34`). Integrity uses a co-located, unsigned `SHA256SUMS` file (`backup.sh:63`, `restore.sh:38-44`), so anyone able to alter the backup can replace both data and checksums.

**Impact:** A lower-privileged local user or compromised backup account could obtain database credentials/read backups or tamper with a restore set.

**Fix:** Use a protected MongoDB tools config/password mechanism, set `umask 077` and explicit `0700`/`0600` modes, encrypt backups, restrict ownership, and authenticate manifests with a key stored outside the backup location.

### SEC-06 — Moderate — URL validation does not restrict protocols or embed origins

**Evidence:** Multiple public-link fields use only `z.string().url()` (`src/validators/content.ts:63,76,85,100,106,151`; `src/validators/publication.ts:21-30`; `src/app/api/footer/route.ts:12,17`). Zod accepts schemes such as `javascript:`, `data:`, and `ftp:`. React 19 currently blocks direct `javascript:` rendering, but other schemes remain accepted. `googleMapsEmbedUrl` is rendered in an unsandboxed iframe and has no host allowlist (`src/components/layout/Footer.tsx:132-136`). Several image/PDF fields accept arbitrary strings.

**Impact:** Malicious or compromised CMS data can create deceptive links, load attacker-controlled iframe content, track visitors through remote media, or become executable if framework behavior changes or a non-React renderer is added.

**Fix:** Centralize URL validation: allow only `https:` (and explicitly required relative `/uploads/...` paths), allowlist Google Maps embed hosts, add iframe `sandbox`/`referrerPolicy`, and reject credentials/control characters in URLs.

### SEC-07 — Low — Staged uploads have no automatic expiry or quota

**Evidence:** Uploads are written into `uploads/temp` (`src/lib/storage/upload.ts:27-35`) and are moved only when a content record is persisted (`src/services/storage.service.ts:34-40`). The migration script merely reports stale candidates (`scripts/migrate-storage.ts:140`). The audit found two current temporary files totaling 496,550 bytes.

**Impact:** Repeated abandoned uploads can consume disk and are publicly retrievable if their UUID URL is known. Exploitation requires a valid admin session.

**Fix:** Add scheduled age-based cleanup, per-admin/global quotas, storage monitoring, and authenticated or non-public staging reads.

### SEC-08 — Low — File inspection is limited to magic bytes and preserves metadata

**Evidence:** PDFs are accepted when they start with `%PDF-` (`src/lib/storage/pdf.ts:1-2`); image checks inspect only header signatures (`src/lib/storage/image.ts`). `prepareImageForStorage()` returns the original buffer unchanged (`src/lib/storage/compress.ts:7`). There is no full decoder validation, metadata stripping, malware scan, or PDF active-content policy.

**Impact:** Uploaded files may retain EXIF/GPS/device metadata, contain malformed/polyglot content, or distribute malicious PDF payloads. Generated filenames, `nosniff`, and sandbox CSP on durable upload responses reduce browser execution risk.

**Fix:** Decode and re-encode images with pixel/dimension limits and metadata removal; structurally validate PDFs, consider serving PDFs as attachments, and scan uploads where operationally feasible.

### SEC-09 — Low — Unsafe API requests without `Origin` are accepted

**Evidence:** Same-origin enforcement returns success when the `Origin` header is absent (`src/middleware/security.ts:3-11`). No CSRF token or Fetch Metadata check is used.

**Impact:** `SameSite=Lax` cookies and normal browser `Origin` behavior substantially mitigate conventional CSRF, but unusual clients, extensions, legacy behavior, or future cookie changes could bypass this check.

**Fix:** For cookie-authenticated mutations, require a canonical `Origin`/`Referer` or a CSRF token; validate `Sec-Fetch-Site`; keep non-browser API authentication separate if needed.

### SEC-10 — Low — Content Security Policy is only partial

**Evidence:** `next.config.js:28-29` sets only `base-uri`, `form-action`, `frame-ancestors`, and `object-src`. It omits `default-src`, `script-src`, `style-src`, `img-src`, `connect-src`, and `frame-src`.

**Impact:** CSP does not act as an effective fallback against script injection or unauthorized resource loading if DOMPurify, React URL filtering, editor code, or another control fails.

**Fix:** Deploy a tested nonce/hash-based policy or a compatible strict static policy; begin with report-only telemetry and explicitly allow required image, connection, and iframe origins.

### SEC-11 — Low — Request and schema complexity limits are too broad

**Evidence:** Nginx allows 11 MB bodies for every route (`deployment/nginx/prism-lab.conf:40`); Next.js proxy buffering uses its 10 MB default. Most Zod strings and arrays have no maximum length/count. Public list APIs default to 250 records and permit 500 (`src/lib/pagination.ts:1-2,20-21`).

**Impact:** Large or deeply structured requests and responses can cause avoidable memory, CPU, database, and bandwidth pressure, including on login and public endpoints.

**Fix:** Apply small route-specific JSON limits, retain a separate upload limit, add schema maxima/depth constraints, lower public pagination defaults/caps, and enforce proxy timeouts/concurrency controls.

### SEC-12 — Low — Public personal assets are committed to Git history

**Evidence:** Git tracks 23 files under `public/uploads`, including a resume PDF and member photographs. `.gitignore:17` excludes only the root `/uploads/*`, not legacy `public/uploads/*`. The resume is present in repository history.

**Impact:** Even if removed from the website, personal data remains distributed in clones and Git history, complicating retention, consent, and deletion obligations.

**Fix:** Move legacy assets to managed storage, stop tracking them, add a `public/uploads/*` ignore rule, document consent/retention, and use history rewriting only after coordinating clone rotation and backups.

### SEC-13 — Low — CI/CD actions are pinned to mutable major tags

**Evidence:** Workflows use `actions/checkout@v4` and `actions/setup-node@v4` (`.github/workflows/quality-gates.yml:21,24`; `.github/workflows/deploy-production.yml:27,30,49`).

**Impact:** A compromised or unexpectedly moved upstream tag could execute code in CI; the production workflow has access to deployment credentials.

**Fix:** Pin third-party actions to reviewed full commit SHAs and use an update bot/process to advance them deliberately.

### SEC-14 — Low — Core security controls lack dedicated regression tests

**Evidence:** Existing tests cover rate-limit mechanics and upload metadata validation, but no dedicated tests were found for route authorization, cookie flags, JWT claim/expiry rejection, same-origin behavior, path traversal, sanitizer payloads, CSP/header coverage, or stale upload cleanup.

**Impact:** Security controls can regress without failing CI, especially because authorization checks are repeated manually across route handlers.

**Fix:** Add table-driven route authorization tests and focused adversarial tests; centralize authorization/URL validation to reduce repetition.

## Verified positive controls

- All discovered data-changing route handlers perform a server-side session check; public GET routes were intentionally separated.
- Authentication uses bcrypt, signed HS256 JWTs with an algorithm allowlist, secure/httpOnly/SameSite cookie settings in production, issuer/audience claims, and generic invalid-credential messages.
- Upload paths use generated UUID filenames, category checks, path-containment checks, size/type/extension/signature checks, atomic staging writes, and `nosniff` headers.
- Rich HTML is sanitized with DOMPurify at every discovered `dangerouslySetInnerHTML` sink.
- Nginx overwrites forwarded client-IP headers, redirects HTTP to HTTPS, permits TLS 1.2/1.3, and disables TLS session tickets.
- API errors are generic and logs recursively redact secret-shaped fields; no tracked private keys, `.env` files, obvious JWTs, GitHub tokens, or AWS access keys were found.

## Remaining operator actions

- Keep SEC-04 (administrator MFA and shared/per-account throttling) on the accepted-risk register until it is approved for implementation.
- Deny external ingress to port 3000 and run the production preflight on the deployed host.
- Store backups only on encrypted durable storage and keep signing keys in the deployment secret store.
- Coordinate a Git history rewrite and clone/credential rotation to purge the personal assets already distributed in repository history. They are removed from the current tracked tree.
- Perform authenticated browser penetration testing and verify production firewall, MongoDB TLS/authorization, secret-store policy, and filesystem ownership on the deployed host.
