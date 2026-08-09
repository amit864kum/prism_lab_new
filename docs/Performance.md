# Performance and production-hardening record

## Phase 8 verification (2026-08-06)

### Client/server boundary audit

- Public server-rendered pages remain server components where they read database-backed content.
- Interactive carousels, filters, navigation, lightboxes, and admin forms remain client components because they require browser state or event handlers.
- The footer remains client-rendered because administrators expect saved footer changes to appear immediately without a route revalidation workflow.
- TipTap is now behind a client-only dynamic boundary. The editor and its extensions are fetched only when an admin form that uses the editor is opened; the form retains a fixed-height loading skeleton to avoid layout shift.

### Bundle measurements

Measurements are from `next build` route output before and after the TipTap boundary. Shared public JavaScript remained effectively unchanged at about 87 kB.

| Route | Before first load | After first load | Reduction |
| --- | ---: | ---: | ---: |
| `/admin/about` | 214 kB | 90.7 kB | 57.6% |
| `/admin/members` | 218 kB | 95.6 kB | 56.1% |
| `/admin/news` | 216 kB | 93.8 kB | 56.6% |
| `/admin/pi-profile` | 220 kB | 97.1 kB | 55.9% |
| `/admin/projects` | 218 kB | 95.5 kB | 56.2% |

The homepage remained 138 kB first-load JavaScript, so the admin optimization did not move editor code into public bundles.

### Image strategy

- Persisted public and admin images use `SafeImage`, which preserves legacy `/uploads/**` compatibility and supplies retry, lazy-loading, asynchronous decoding, and fallback behavior.
- Above-the-fold navigation logos opt into eager loading; the primary PRISM logo also uses high fetch priority.
- `SafeImage` intentionally owns the single raw `<img>` implementation because retry URLs and unknown legacy dimensions are incompatible with reliable build-time optimization.
- `FileUpload` intentionally uses a raw `<img>` for its local, ephemeral preview. Blob/data URLs are admin-only, are not LCP content, and should not pass through the Next image optimizer.

### Caching and query bounds

- All `/api/**` responses explicitly send `Cache-Control: no-store, max-age=0`. This preserves the existing CMS expectation that saved content is immediately visible.
- Existing UUID-based file responses under `/uploads/**` retain their immutable, one-year cache policy.
- Public collection endpoints accept optional positive `page` and `limit` parameters. The default page size is 250 and the maximum is 500.
- Existing primary response arrays are unchanged. An additive `pagination` object reports `page`, `limit`, and `hasMore`; no extra count query is issued.
- Repository queries use `skip` and `limit + 1`, preventing unbounded reads while detecting a next page efficiently.

### Index review

Existing indexes cover the primary member, publication-type, publication-year, research-area, gallery, news, sponsor, hero-slide, and activity-log ordering/filter patterns.

The following indexes are proposals only and were not applied because production index builds require a database backup, query-plan evidence, deployment scheduling, and a rollback procedure:

- `Publication.authors` for author-filtered publication lists.
- `Project.createdAt` for the unfiltered project list; the existing `{ status, createdAt }` index cannot serve a sort by `createdAt` alone efficiently.

Before approval, capture `explain('executionStats')` results against production-like data and confirm index storage/write overhead is justified.

### Visual and security verification

- Browser smoke checks passed at 1440×900 and 390×844 for the homepage/navigation and at 390×844 for admin login.
- Persisted logos rendered correctly through `SafeImage`, and no responsive overflow or layout regression was observed.
- The admin login page no longer exposes example/default credentials.
- A later Phase 10 isolated staging rehearsal used MongoDB 8 with staging-only content. It verified database-filled public content, canonical-origin admin login, dashboard navigation, and Hero Slides administration on the Next.js 16 production server with no browser console errors.
