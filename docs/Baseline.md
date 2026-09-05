# Prism Lab Baseline Inventory

Captured on 2026-08-05 before the architectural refactor. This file records observed behavior to protect against accidental functional changes.

## Verification baseline

| Command | Result | Notes |
| --- | --- | --- |
| `npm run build` | Pass | Next.js production build completes successfully. |
| `npm test` | Pass | 1 test file, 8 tests passed. |
| `npm run lint` | Pass with warnings | `next/image` warnings in `components/public/Footer.tsx:101` and `components/public/SiteNavbar.tsx:91`. |

## Route inventory

### Public pages

`/`, `/gallery`, `/members`, `/members/[slug]`, `/people/alumni`, `/people/collaborators`, `/people/principal-investigator`, `/projects`, `/projects/[slug]`, `/publications`, `/research/areas`, `/research/areas/[slug]`, `/research/projects`, `/research/sponsors`, `/robots.txt`, and `/sitemap.xml`.

### Administrative pages

`/admin/login`, `/admin/dashboard`, `/admin/about`, `/admin/developer`, `/admin/footer`, `/admin/gallery`, `/admin/members`, `/admin/news`, `/admin/pi-profile`, `/admin/projects`, `/admin/publications`, `/admin/research-areas`, and `/admin/sponsors`.

### API routes

| Route | Methods | Existing access model |
| --- | --- | --- |
| `/api/auth/login` | POST | Public, rate limited. |
| `/api/auth/logout` | POST | Authenticated. |
| `/api/auth/me` | GET | Cookie-based current-user lookup. |
| `/api/dashboard/stats` | GET | Authenticated. |
| `/api/upload` | POST | Authenticated. |
| `/api/about`, `/api/footer`, `/api/pi-profile` | GET, write operations | Public reads; writes authenticated. |
| `/api/gallery`, `/api/news`, `/api/projects`, `/api/publications`, `/api/research-areas`, `/api/sponsors` | GET, POST | Public reads; creates authenticated. |
| `/api/gallery/[id]`, `/api/news/[id]`, `/api/projects/[id]`, `/api/publications/[id]`, `/api/research-areas/[id]`, `/api/sponsors/[id]` | GET, PUT, DELETE | Public reads; writes authenticated. |
| `/api/members` | GET, POST | Public reads; creates authenticated. |
| `/api/members/[id]` | GET, PUT, DELETE | Public reads; writes authenticated. |
| `/api/members/autocomplete` | GET | Authenticated. |

## Middleware and authentication

- The root `middleware.ts` protects `/admin/:path*`, excluding `/admin/login`.
- JWT verification is performed with `jose`; the `auth-token` cookie is HTTP-only and marked secure in production.
- API routes independently check `getCurrentUser()` for authenticated operations.

## Storage inventory

- Current write location: `public/uploads`.
- Current URL contract: values start with `/uploads/`.
- Observed categories: `gallery`, `logos`, `members`, `pi`, `resumes`, and `sponsors`.
- Current upload implementation validates file MIME type, extension, and a 10 MiB size limit, then returns a relative URL.
- Security constraint: the storage refactor must retain access to all existing `/uploads/**` URLs until the migration is verified and approved.

## Environment-variable inventory

| Name | Purpose | Required in production |
| --- | --- | --- |
| `MONGODB_URI` | MongoDB connection string. | Yes |
| `JWT_SECRET` | JWT signing/verifying secret. | Yes |
| `ADMIN_EMAIL` | Initial administrator creation script. | Only for initialization |
| `ADMIN_PASSWORD` | Initial administrator creation script. | Only for initialization |
| `NEXT_PUBLIC_API_URL` | Public application/API base URL configuration. | Deployment-dependent |
| `NEXT_PUBLIC_BASE_URL` | Robots/sitemap canonical base URL. | Recommended |
| `NODE_ENV` | Runtime mode/cookie security behavior. | Yes |

## Refactor hotspots

1. API route handlers import Mongoose models directly and combine HTTP, authorization, business rules, relationship synchronization, and persistence.
2. Public server pages also query models directly, so read services/repositories must support server component use without altering rendered data.
3. `lib/` currently mixes authentication, database, storage, validation, domain constants, pure helpers, and rate limiting.
4. User files are publicly written below `public/uploads`, with database records storing public relative paths.
5. Mongoose interfaces use a mixture of string `_id` declarations and `Types.ObjectId` relations; this needs boundary normalization rather than a schema-wide alteration.
6. The two lint warnings must be resolved or explicitly justified before the final launch gate.

## Rollback principles

1. Deploy refactor changes behind a release artifact that can be rolled back atomically.
2. Do not change stored upload URLs before a database and filesystem backup exists.
3. Every migration must support dry-run reporting, idempotent execution where feasible, and a documented reversal path.
4. Retain the compatibility storage reader until staging and production validation demonstrate all legacy references are served correctly.
