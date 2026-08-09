# Production go-live evidence

Complete this record on the production-like host. Do not include passwords, tokens, database URIs, private keys, or other secrets.

## Release identity

- Date/time (UTC):
- Release commit:
- Deployment operator:
- Approval/change ticket:
- Canonical hostname:
- Previous release:
- Coordinated backup identifier:

## Required evidence

- `[ ]` `bash deployment/scripts/preflight.sh` passed.
- `[ ]` `npm ci` and `npm run release:verify` passed for the exact release commit.
- `[ ]` MongoDB and uploads backup completed; checksums verified.
- `[ ]` Storage migration dry run reviewed; approved apply completed if required.
- `[ ]` PM2 started exactly one process; restart and log rotation verified.
- `[ ]` `nginx -t` passed; TLS, HTTP redirect, request headers, and upload-size handling verified.
- `[ ]` `deployment/scripts/smoke-test.sh` passed at the canonical HTTPS origin.
- `[ ]` Staging-only/production admin login and representative authorized CRUD/upload checks passed.
- `[ ]` Desktop/mobile accessibility and visual checks passed using approved data.
- `[ ]` Monitoring, alerts, certificate expiry, disk, process, database, and backup-age checks are active.
- `[ ]` Rollback release and restore point are available; rollback command/path was rehearsed.
- `[ ]` RPO/RTO, deployment owner, incident owner, and final go-live approval are recorded.

## Result

- Decision: `GO` / `NO-GO`
- Decision owner:
- Decision timestamp (UTC):
- Outstanding risks and accepted-risk references:
- Post-deployment verification notes:
