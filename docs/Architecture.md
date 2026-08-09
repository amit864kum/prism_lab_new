# Prism Lab Architecture

## Scope

Prism Lab is a single-server Next.js 16.3 application using React 19, the App Router, TypeScript, Tailwind CSS, MongoDB/Mongoose, JWT cookie authentication, and locally stored uploads. The refactor preserves all current routes, UI behavior, API contracts, and database semantics.

## Implemented architecture

```text
Nginx → one PM2-managed Next.js Node process
  ├─ App Router pages and thin API route handlers
  ├─ domain services own workflows and relationship consistency
  ├─ repositories own every application Mongoose query
  ├─ models define persistence schemas and indexes only
  ├─ middleware protects admin routes and applies request controls
  ├─ controlled /uploads route serves durable server-side storage
  └─ structured JSON logs flow to stdout/stderr and PM2 files
```

The deployed topology deliberately uses one application process because rate-limit state is process-local and uploads reside on one durable filesystem. Horizontal scaling requires shared rate limiting and shared/object storage first.

## Data domains and relationships

| Domain | Collection/model | Key relationships |
| --- | --- | --- |
| Authentication | `Admin`, `ActivityLog` | Admin login produces a JWT cookie; activity events are recorded. |
| People | `Member` | Has many publication references; optional image and resume paths. |
| Publications | `Publication` | Has many member author references and optional research-area references. |
| Research | `ResearchArea`, `Project`, `Sponsor` | Research areas have publication references; projects/sponsors carry content metadata. |
| Content | `AboutSection`, `Footer`, `HeroSlide`, `NewsItem`, `GalleryImage`, `PIProfile` | Independently managed CMS content; several fields may reference upload URLs. |

Member/publication and research-area/publication links are maintained bidirectionally by services. Migration scripts remain available for controlled reconciliation.

## Current request boundary

The API surface is retained exactly. Route handlers live under `src/app/api` and expose authentication, dashboard statistics, upload, and CMS CRUD for content, gallery, members, news, PI profile, projects, publications, research areas, sponsors, about, and footer content. Public and administrative page URLs are likewise retained.

The detailed baseline route and operational inventory is in [Baseline.md](./Baseline.md).

## Source ownership

```text
src/
  app/                       # pages and thin route handlers; URL-compatible
  components/                # admin, domain/public, layout, shared, ui
  config/                    # validated application configuration
  constants/                 # stable labels, routes, roles, upload categories
  hooks/                     # client presentation hooks only
  lib/
    auth/ db/ storage/ logger/
  middleware/                # reusable middleware concerns
  models/                    # Mongoose schemas only
  repositories/              # all Mongoose access and query rules
  services/                  # business workflows and authorization decisions
  types/                     # domain, DTO, and API contracts
  utils/                     # pure shared helpers
  validators/                # Zod request validation
docs/ deployment/ logs/ uploads/ scripts/ tests/
```

The required runtime flow is:

```text
route handler → service → repository → Mongoose model → MongoDB
```

Route handlers validate input and map HTTP responses. Services own use cases and cross-entity consistency. Repositories own queries, projections, population, sorting, and database sessions. Models only define schemas and indexes.

## Accepted refactor decisions

| Decision | Direction | Compatibility requirement |
| --- | --- | --- |
| Runtime topology | Remain a Node.js single-server monolith behind Nginx/PM2. | No route or deployment-host assumption changes during refactor. |
| Source move | Move code to `src/` incrementally using TypeScript aliases and temporary re-exports. | App Router route paths must remain identical. |
| Data access | Introduce repositories and services by domain. | Preserve query order, populated fields, errors, and response shapes. |
| Storage | Store new runtime uploads outside `public/`; serve through a controlled application route. | Existing `/uploads/**` database values and URLs remain available via compatibility handling until verified migration. |
| Logging | Structured, request-correlated logs with rotation managed by deployment tooling. | Never log credentials, JWTs, authorization headers, or sensitive form data. |
| Errors | Typed application errors with centralized route mapping. | Preserve existing status codes and safe client error messages. |
| Testing | Existing tests are organized by level and enforced by CI. | Known integration/E2E gaps are explicit launch-rehearsal inputs. |

## Migration constraints

- Storage and database changes require backup, dry run, rollback procedure, and non-production verification.
- `ObjectId` versus string assumptions must be handled at repository/DTO boundaries; no broad schema rewrite is authorized by this refactor.
- Deployment artifacts are not production-ready until tested on a staging host with the actual filesystem, Nginx, PM2, and MongoDB topology.

Operational deployment and recovery procedures are in [Deployment.md](./Deployment.md) and [Backup.md](./Backup.md).
