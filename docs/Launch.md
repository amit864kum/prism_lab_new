# Launch gate and staging rehearsal

## Automated evidence completed locally

- `[x]` `npm run release:verify`: typecheck, zero-warning lint, 11 tests, Next.js 16 production build, storage dry run, and zero-vulnerability production audit.
- `[x]` `npm run migrate:storage:dry-run`: 20 legacy files reported with no writes.
- `[x]` Isolated MongoDB 8 staging rehearsal: staging-only admin, every CMS domain, bidirectional relationships, image/PDF upload-replace-delete, and immediate public visibility.
- `[x]` MongoDB archive restore: five retained documents restored with zero failures and identical collection counts.
- `[x]` Upload archive restore: restored fixture matched its original SHA-256 hash.
- `[x]` Production-server browser smoke: public content, canonical-origin login, dashboard, and Hero Slides admin page with no console errors.
- `[x]` Deployment, proxy, backup, restore, monitoring, incident, and rollback assets added.

## Required staging rehearsal

Use a production-like host and restored non-production snapshot. Record operator, release commit, backup identifier, timestamps, and evidence for every item.

- `[x]` Install locked dependencies and run `npm run release:verify` successfully in the isolated production-like rehearsal.
- `[ ]` Validate PM2 single-process startup/restart and log rotation.
- `[ ]` Validate Nginx TLS, request headers, upload-size behavior, and configuration test.
- `[x]` Restore MongoDB and uploads from isolated backups; verify document counts and upload checksum.
- `[x]` Sign in using a staging-only admin account.
- `[x]` Create, edit, and delete representative CMS content in every domain.
- `[x]` Upload, retrieve, replace, and delete an image and PDF.
- `[x]` Verify member/publication and research-area/publication synchronization.
- `[x]` Verify public pages immediately reflect changes and legacy upload URLs still work.
- `[ ]` Run desktop/mobile visual and accessibility smoke checks with production-like data.
- `[x]` Rehearse coordinated database and file-storage restore; use the documented application rollback procedure on the real deployment host.
- `[ ]` Confirm monitoring, alert delivery, backup schedule, RPO/RTO, and operational owners.

## Open launch blockers

1. Validate the supplied PM2 and Nginx configuration, TLS certificates, request-size behavior, restart/log rotation, and rollback on the actual production-like Linux host.
2. Complete the final desktop/mobile accessibility pass using the approved production dataset and domain.
3. RPO/RTO, monitoring destinations, alert recipients, backup schedule, deployment owner, incident owner, and production secrets require institutional approval.

The repository is a verified launch candidate. Production go-live must not be approved until the remaining real-host checks and institutional ownership items above are signed off.
