# Prism Lab Launch-Readiness Refactor Plan

## Purpose and guardrails

Refactor the existing single-server Next.js monolith into a maintainable layered architecture **without changing UI, URLs, API contracts, authentication behavior, CMS behavior, or database data semantics**. Every phase is to be completed, verified, and committed independently before the next phase begins.

### Non-negotiable compatibility rules

- Keep all public and API routes unchanged, including `/admin/*`, `/api/*`, and existing public URLs.
- Preserve request/response shapes, form behavior, visual output, animations, data order, and authorization behavior unless an explicitly approved security fix requires a compatible extension.
- Use adapters/re-exports during moves; remove compatibility layers only after repository-wide usage has migrated and verification passes.
- Treat the current `public/uploads/**` files and database URL values as production data. Storage migration must preserve access to every existing file.
- Do not run data migrations, delete files, or alter production data without a backup, dry run, and an approved rollback plan.
- A phase is complete only after its listed validation passes with no new regression.

## Status legend

- `[ ]` Not started
- `[~]` In progress
- `[x]` Complete
- `[!]` Blocked (record owner, reason, and decision needed)

## Current baseline (2026-08-05)

- `[x]` Production build currently passes (`npm run build`).
- `[ ]` ESLint must be made warning-free; known `next/image` warnings remain in the public footer and navbar.
- `[ ]` Architecture inventory and dependency map have not yet been documented.
- `[ ]` No `src/`, `repositories/`, `services/`, `config/`, `constants/`, `types/`, or centralized storage/logger modules exist yet.
- `[ ]` Existing upload assets are currently under `public/uploads/**`; migration requires backwards-compatible serving.

---

## Phase 0 — Baseline, safety, and architecture inventory

**Status:** `[x]`

### Work

1. Record the current route manifest, API response contracts, environment-variable inventory (names only), database collections, model relationships, and upload URL patterns.
2. Add an architecture decision record for: single-server deployment, storage location, secure-file access policy, logging destination, and rate-limiting strategy.
3. Capture baseline commands and results for `npm run build`, lint, tests, and TypeScript checking.
4. Identify duplicate helpers, direct model access in API routes, and dead/unreachable code without changing behavior.
5. Define a release rollback procedure before any storage or data work starts.

### Exit criteria

- `docs/Architecture.md` includes the as-is system map and approved target architecture.
- A route/contract inventory exists and can be used for regression checks.
- Baseline build, lint, and test results are recorded.
- No application behavior changes.

---

## Phase 1 — Establish target structure and configuration foundation

**Status:** `[x]`

### Work

1. Create the target folders: `src/{config,constants,hooks,lib,models,repositories,services,types,utils,validators}`, `docs/`, `deployment/`, `logs/`, and organized test folders.
2. Move source roots to `src/` incrementally, beginning with low-risk shared modules; update TypeScript aliases and Next.js resolution without changing route URLs.
3. Split infrastructure configuration into `src/config/database.ts`, `auth.ts`, `storage.ts`, `site.ts`, and `theme.ts`.
4. Create environment validation at application startup using Zod, with safe production defaults and clear startup errors for missing secrets.
5. Add `.gitkeep` and ignore rules for runtime-only directories (`uploads/`, `logs/`, temporary files) while preserving tracked fixtures/assets deliberately.

### Exit criteria

- Existing app starts and builds with source imports resolved from `src/`.
- No secrets are committed; `.env.example` accurately describes required values.
- Directory ownership and import conventions are documented.

---

## Phase 2 — Shared contracts, validators, constants, and utilities

**Status:** `[x]`

### Work

1. Move domain contracts into `src/types/` (`member`, `publication`, `research`, `gallery`, `hero`, `project`, `news`, `api`) and separate persistence types from UI/API DTOs where needed.
2. Move and normalize Zod schemas into `src/validators/`, including members, research areas, projects, gallery, hero, publications, news, authentication, and shared content.
3. Consolidate current hard-coded values into `src/constants/roles.ts`, `memberStatus.ts`, `publicationTypes.ts`, `upload.ts`, `routes.ts`, and `theme.ts`.
4. Consolidate pure reusable helpers into `src/utils/{date,slug,search,sort,pagination,format}.ts`; retain compatibility exports until all callers move.
5. Remove duplicated normalization, sorting, slug, and input-validation logic only when equivalent test coverage/contract checks exist.

### Exit criteria

- Validators are the single source of truth for each API input.
- No behavior-changing validation tightening without an explicit compatibility decision.
- TypeScript has no errors and the production build passes.

---

## Phase 3 — Data-access layer: repositories and model boundaries

**Status:** `[x]`

### Work

1. Keep Mongoose schemas in `src/models/` only; remove business logic from model modules.
2. Introduce repositories for each bounded domain: admin/auth, members, publications, research areas, projects, gallery, news, sponsors, hero/content, footer, PI profile, and activity logs.
3. Move all model queries, population rules, sort rules, pagination primitives, and transaction/session handling into repositories.
4. Standardize repository return types and not-found behavior without leaking Mongoose documents outside the data layer.
5. Retain a compatibility strategy for legacy publication types and existing `ObjectId`/string boundary behavior; do not silently alter stored data.

### Exit criteria

- API routes and services no longer import Mongoose models directly.
- Model operations occur only in repositories, scripts, and tightly scoped migration code.
- Relevant repository unit tests or contract tests pass.

---

## Phase 4 — Service layer and thin API routes

**Status:** `[x]`

### Work

1. Create domain services over repositories for all read/write workflows.
2. Move authorization decisions, ordering behavior, relationship synchronization, slug uniqueness handling, and upload orchestration into services.
3. Reduce each route handler to: parse request → authorize → validate → call service → map response.
4. Preserve every existing route path, HTTP verb, status code, response property, and client-facing error shape.
5. Extract reusable controller/response helpers only where they do not obscure route-specific behavior.

### Exit criteria

- No route handler contains direct database queries.
- Services are independently testable using repository interfaces/mocks.
- API contract regression checks pass for every existing endpoint.

---

## Phase 5 — Unified, secure storage subsystem

**Status:** `[x]`

### Work

1. Create `src/lib/storage/{upload,delete,image,pdf,validator,compress}.ts` plus storage configuration and typed file metadata.
2. Route all member, hero, gallery, research, sponsor, PI, publication PDF, and resume operations through one storage service.
3. Use server-side `uploads/{hero,members,principal-investigator,research,gallery,news,sponsors,publications,resumes,temp}` directories with UUID-based, category-prefixed names and strict MIME/content validation.
4. Add image normalization/compression only when output dimensions and visual quality are explicitly verified against existing UI expectations.
5. Implement secure file serving and authorization rules; preserve current public-file URLs through a compatibility route or managed migration mapping.
6. Add file lifecycle handling (atomic write, cleanup on failed DB write, safe delete, orphan detection) and a dry-run migration script.

### Exit criteria

- No new uploads are written inside `public/`.
- Every existing upload remains reachable at its prior URL or an approved compatible mapping.
- Upload failures do not leave untracked files; deletion is authorization-protected.
- Backup, dry run, rollback, and live migration procedures are documented and tested on non-production data.

---

## Phase 6 — Cross-cutting reliability: errors, logging, middleware, and security

**Status:** `[x]`

### Work

1. Add typed application errors and centralized API error-to-response mapping that preserves existing client-facing responses.
2. Add structured logger modules under `src/lib/logger/` with request IDs and separate app/API/upload/error outputs. Ensure no credentials, JWTs, or sensitive PII are logged.
3. Extract composable middleware concerns into `src/middleware/{auth,rate-limit,logger,upload}.ts`; keep Next’s root middleware entry as the required adapter.
4. Review JWT secret validation, cookie settings, upload limits, path traversal protection, rate-limit keys, security headers, CORS policy, and admin route protection.
5. Add health/readiness endpoints only if approved, ensuring they do not expose sensitive internals.

### Exit criteria

- Operational errors include useful context and correlation IDs without leaking internals to clients.
- Authentication and authorization behavior is unchanged and verified.
- Rate limits and upload defenses are configured, tested, and documented.

**Resolved launch blocker (2026-08-06):** The controlled Next.js 16.3.0 and React 19 migration passed the complete regression and release-verification suite. `npm audit --omit=dev` now reports zero vulnerabilities.

---

## Phase 7 — Component and route organization without visual change

**Status:** `[x]`

### Work

1. Organize components under `src/components/{admin,home,members,publications,research,gallery,layout,shared,ui}` according to ownership.
2. Move public pages into `(public)`, administrative pages into `(admin)`, and login into `(auth)` route groups where this does not alter URLs.
3. Introduce colocated feature-level hooks/view models only for presentation concerns; keep data writes in API/services.
4. Use temporary re-export modules during moves to keep imports incremental and reviewable.
5. Remove obsolete re-exports and unused components only after import scans and visual regression checks pass.

### Exit criteria

- URLs, layouts, styles, accessibility behavior, and animations are unchanged.
- Components have clear domain ownership and no unrelated cross-domain placement.
- Build and visual smoke tests pass.

---

## Phase 8 — Performance and production hardening

**Status:** `[x]`

### Work

1. Audit client/server component boundaries, eliminate unnecessary client bundles, and add dynamic imports only for non-critical interactive/admin-heavy modules.
2. Replace or explicitly justify raw `<img>` usage with the project’s safe image strategy without changing rendered layout or existing storage compatibility.
3. Add safe caching/revalidation policies only after verifying content-update visibility and admin CMS expectations.
4. Add pagination/query limits for list endpoints while preserving existing client behavior and response contracts.
5. Review indexes against repository query patterns; propose schema/index changes separately and apply only with migration/rollback approval.

### Exit criteria

- `npm run build` is clean with no TypeScript or ESLint errors/warnings.
- Performance changes are measured and do not delay CMS content updates unexpectedly.
- No UI regression is observed in public or admin workflows.

---

## Phase 9 — Test organization and quality gates

**Status:** `[x]`

### Work

1. Organize existing tests under `tests/unit/`, `tests/integration/`, and `tests/e2e/` without changing or expanding the test suite.
2. Preserve existing regression coverage while refactoring; record gaps for a separately approved testing initiative.
3. Add scripts for type checking, linting, test runs, migration dry runs, and CI verification.
4. Configure CI to run deterministic checks on every change; keep secrets and production databases out of CI.

### Exit criteria

- Test locations and commands are documented.
- Build, lint, type check, and test gates are automated.
- Existing critical-workflow coverage remains runnable and any gaps are documented for separate approval.

---

## Phase 10 — Operations, deployment, documentation, and launch gate

**Status:** `[x]` — Repository implementation and isolated production-like rehearsal are complete. Real-host deployment and institutional go-live approval remain deployment gates outside the refactor.

**Progress:** deployment assets `[x]`; operational documentation `[x]`; full release verification `[x]`; isolated staging CRUD/upload/browser rehearsal `[x]`; MongoDB and upload backup/restore rehearsal `[x]`; dependency security gate `[x]`.

### Work

1. Add `deployment/pm2/ecosystem.config.js`, a sample Nginx configuration, and backup/restore scripts configured by environment variables rather than hard-coded paths.
2. Document deployment, environment setup, database backup/restore, file-storage backup/restore, monitoring, log rotation, incident response, and rollback in `docs/`.
3. Add/update `docs/{Architecture,API,Database,Deployment,Backup}.md` with actual implementation details.
4. Perform a staging launch rehearsal: fresh deploy, environment validation, database restore, file-storage restore, admin login, content CRUD, upload/delete, public-page smoke test, and rollback rehearsal.
5. Perform final dependency/security review and record accepted risks.

### Exit criteria

- A new operator can deploy and restore the application using only repository documentation and approved secrets.
- Staging rehearsal and rollback are successful.
- All prior phases are `[x]`; no launch-blocking issue remains.

---

## Phase 11 — Production deployment and go-live

**Status:** `[!]` — Host-independent preparation is complete and all repository gates pass. Real-host execution is blocked pending production access, the canonical domain/TLS certificate, approved secrets, monitoring destinations, and named operational owners.

### Work

1. Run the fail-closed production host preflight and exact-release verification.
2. Create and verify a coordinated MongoDB/uploads backup before storage migration or deployment writes.
3. Deploy the reviewed release behind one PM2 process and Nginx/TLS at the canonical origin.
4. Complete authenticated CRUD/upload, desktop/mobile accessibility, monitoring, alert, and rollback checks.
5. Record RPO/RTO, owners, evidence, and the formal `GO`/`NO-GO` decision.

### Exit criteria

- Every checkbox in `docs/GoLiveEvidence.md` is complete on the real host.
- Production smoke, monitoring, backup, and rollback checks pass.
- The authorized decision owner records `GO`; otherwise Phase 11 remains blocked.

---

## Final launch checklist

- `[x]` All repository phases are marked complete with verification evidence in this tracker.
- `[x]` `npm run build` passes.
- `[x]` Lint and TypeScript checks pass with zero errors/warnings.
- `[x]` Automated tests pass.
- `[x]` Existing route and API contract inventories match the verified production build and staging rehearsal.
- `[x]` Legacy uploads pass the non-destructive migration preview and compatibility serving checks; isolated staging records and managed-file lifecycles pass.
- `[x]` MongoDB and file-storage backup/restore rehearsals pass against the isolated staging environment.
- `[!]` Production secrets, Nginx/TLS validation, monitoring recipients, RPO/RTO, and operational ownership require the deployment operator/institution to approve on the real host.
- `[x]` Documentation reflects the current repository, deployment, recovery procedures, and unresolved launch gates.

## Phase update log

| Date | Phase | Status | Summary | Verification / commit |
| --- | --- | --- | --- | --- |
| 2026-08-05 | Plan creation | `[x]` | Initial phased refactor plan created; no application code changed. | `temp_plan.md` |
| 2026-08-05 | Phase 0 | `[x]` | Baseline architecture, route contracts, operational decisions, and verification results documented; example credentials sanitized. | `docs/Architecture.md`, `docs/Baseline.md`, `npm run build`, `npm run lint`, `npm test` |
| 2026-08-05 | Phase 1 | `[x]` | Moved application source roots to `src/`, added typed configuration modules, runtime directory hygiene, and updated Tailwind, TypeScript, test, and script resolution. | `npm test`, `npm run build` |
| 2026-08-05 | Phase 2 | `[x]` | Centralized domain contracts, constants, validators, and pure utilities; retained compatibility exports and removed repeated project formatting helpers. | `npx tsc --noEmit`, `npm test`, `npm run build` |
| 2026-08-05 | Phase 3 | `[x]` | Added domain repositories, moved all application Mongoose access behind repository boundaries, and preserved ordering, population, singleton, and bidirectional-reference behavior. | `npx tsc --noEmit`, `npm test`, `npm run build` |
| 2026-08-05 | Phase 4 | `[x]` | Added domain and public-content services, moved workflow logic out of route handlers and pages, and restricted repository access to the service layer. | `npm test` (8/8), `npx tsc --noEmit`, `npm run build` |
| 2026-08-06 | Phase 5 | `[x]` | Added staged UUID-based server storage, signature/category validation, controlled compatibility serving, service-level promotion/rollback/cleanup, and a non-destructive migration/orphan audit workflow. | `npm test` (8/8), `npx tsc --noEmit`, `npm run build`, `npm run migrate:storage` (dry run: 22 files) |
| 2026-08-06 | Phase 6 | `[x]` | Centralized API error mapping, added correlated/redacted JSON logging, activated composable auth/rate-limit/upload/security middleware, hardened JWT/cookies and response headers, and applied compatible dependency security fixes. | `npm test` (8/8), `npx tsc --noEmit`, `npm run lint`, `npm run build`, production smoke (307/401/403 + request IDs), `npm audit --omit=dev` (Next.js 16 migration required) |
| 2026-08-06 | Phase 7 | `[x]` | Reorganized components by layout/home/members/gallery/publications ownership, moved admin and login pages into URL-neutral route groups, removed verified obsolete compatibility components, and colocated the shared member-list view model. | `npm test` (8/8), `npx tsc --noEmit`, `npm run lint`, `npm run build` (route table unchanged), browser smoke: home/collaborators/login/admin redirect |
| 2026-08-06 | Phase 8 | `[x]` | Lazy-loaded the TipTap editor, standardized persisted images on `SafeImage`, bounded public list queries with compatible pagination, preserved immediate CMS visibility with no-store API responses, documented index proposals, and removed exposed default login credentials. | `npx tsc --noEmit`, `npm run lint` (zero warnings), `npm test` (11/11), `npm run build`, browser smoke at 1440×900 and 390×844, admin redirect/login disclosure check |
| 2026-08-06 | Phase 9 | `[x]` | Reorganized the unchanged Vitest suite under `tests/unit`, reserved documented integration/E2E locations, added explicit test/typecheck/verify/migration-dry-run commands, and added a read-only GitHub Actions quality-gate workflow with inert CI configuration. | `npm run test:unit` (11/11), integration/E2E commands (explicit no-tests pass), `npm run migrate:storage:dry-run` (22 files, no writes), `npm run verify` |
| 2026-08-06 | Phase 10 | `[x]` | Completed deployment/operations assets, migrated to Next.js 16.3.0 and React 19, restored Hero Slides CRUD, hardened admin initialization, and completed an isolated production-like staging rehearsal with backup/restore. | `npm run release:verify`; lint/typecheck; 11/11 tests; clean production build; `npm audit --omit=dev` (0 vulnerabilities); all-domain CRUD and relationship rehearsal; image/PDF lifecycle; MongoDB restore (5 documents, 0 failures); upload restore SHA-256 match; browser home/login/dashboard/Hero Slides with no console errors. |
| 2026-08-07 | Phase 11 | `[!]` | Completed host-independent go-live preparation; added a fail-closed host preflight/evidence record and corrected backup/restore plus PM2 logging to use durable shared roots. Real-host execution awaits authorized production inputs. | Shell syntax and fail-closed guard checks pass; PM2 configuration loads as one process; `npm run release:verify` passes (11/11 tests, clean build, 0 vulnerabilities). |
