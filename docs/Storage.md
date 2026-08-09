# Storage subsystem

Runtime uploads are stored under the server-side `uploads/` directory and are served through the controlled `GET /uploads/[...path]` route. The browser-facing URL remains `/uploads/<category>/<filename>`, so existing database values and links remain compatible.

## Upload lifecycle

1. `POST /api/upload` requires an authenticated administrator.
2. The server validates the requested category, size, MIME type, extension, and binary file signature.
3. A UUID-based file is written atomically to `uploads/temp/`.
4. The relevant domain service promotes the staged file into its final category immediately before persistence.
5. A failed database write removes the promoted file. Successful replacement or deletion removes the superseded managed file.
6. Abandoned temporary files and unreferenced files are reported for operational review; they are never automatically deleted.

Supported final categories are `hero`, `members`, `principal-investigator`, `research`, `gallery`, `news`, `sponsors`, `publications`, `resumes`, `projects`, and `logos`.

Image transformation is intentionally disabled until dimensions and visual output can be regression-tested. Uploaded images are currently stored byte-for-byte after validation.

## Legacy migration

Back up both the database and upload directories before migration. Preview the non-destructive copy:

```bash
npm run migrate:storage
```

Copy legacy `public/uploads/` files into server storage without overwriting or deleting the originals:

```bash
npm run migrate:storage -- --apply
```

When production uploads use a durable directory outside the release tree, set
`UPLOADS_ROOT` before both the preview and apply commands. The migration uses
this same value as the running application:

```bash
export UPLOADS_ROOT=/srv/prism-lab/shared/uploads
npm run migrate:storage
npm run migrate:storage -- --apply
```

With database access configured, include a read-only orphan-candidate report:

```bash
npm run migrate:storage -- --check-orphans
```

Rollback is immediate while legacy files remain in place: stop the application, deploy the previous release, and retain the unchanged `/uploads/...` database values. Delete legacy copies only after staging verification, backup validation, and a separately approved cleanup window.

## Production requirements

- Persist `uploads/` on durable storage shared across application restarts.
- Back up `uploads/` together with MongoDB so file and record recovery points match.
- Deny direct web-server access to the filesystem directory; requests must pass through the application route or an equivalent authenticated storage proxy.
- Run the migration in dry-run mode first and review every conflict/orphan candidate.
