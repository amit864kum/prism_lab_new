# Testing and quality gates

## Test organization

| Location | Purpose | Current coverage |
| --- | --- | --- |
| `tests/unit/` | Pure helpers and isolated model-dependent behavior with mocks | Existing 11 regression tests |
| `tests/integration/` | Service, repository, and API-boundary tests with isolated infrastructure | No tests yet |
| `tests/e2e/` | Browser-level public and admin workflows against disposable data | No tests yet |

Phase 9 only reorganizes and preserves the existing suite. Expanding coverage requires a separately approved testing initiative so new fixtures, infrastructure, and behavior assumptions can be reviewed independently.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run typecheck` | Run TypeScript without emitting files. |
| `npm run lint` | Run the Next.js ESLint configuration. |
| `npm test` | Run every existing Vitest test under `tests/`. |
| `npm run test:unit` | Run unit tests only. |
| `npm run test:integration` | Run integration tests; succeeds with an explicit no-tests result until coverage is added. |
| `npm run test:e2e` | Run end-to-end tests; succeeds with an explicit no-tests result until coverage is added. |
| `npm run build` | Compile and validate the production Next.js application. |
| `npm run verify` | Run type checking, lint, all existing tests, and the production build in sequence. |
| `npm run migrate:storage:dry-run` | Report legacy files that would be copied without mutating storage or accessing the database. |

`npm run migrate:storage -- --apply` is a mutating operator command and is deliberately excluded from CI.

## Continuous integration

`.github/workflows/quality-gates.yml` runs on pushes and pull requests with Node.js 20 and `npm ci`. It provides only inert CI configuration values, does not start MongoDB, and does not receive production secrets. The build, current tests, and default storage dry run do not require a live database.

The workflow has read-only repository permissions and a 20-minute timeout. A pull request must pass this workflow before merge.

## Recorded coverage gaps

- Repository behavior is not exercised against MongoDB.
- API status codes and response contracts are not covered by automated integration tests.
- Authentication, admin CRUD, relationship synchronization, file upload/delete, and public content propagation are not covered end-to-end.
- Accessibility and browser performance budgets are not automated.
- Migration apply/rollback behavior requires an isolated storage and database fixture.

These are launch-risk inputs for the Phase 10 staging rehearsal. They do not represent silently assumed coverage.
