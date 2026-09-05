# Production deployment and operations

## Supported topology

The supported initial topology is Nginx → one PM2-managed Next.js process → MongoDB, with durable local `uploads/` and `logs/` directories. Multiple PM2 instances or hosts are unsupported until rate limiting and storage become shared services.

The Next.js process must bind only to `127.0.0.1` (or `::1`) through `PRISM_BIND_ADDRESS`; host and cloud firewalls must deny external ingress to port 3000. Only Nginx ports 80/443 are public.

## Host prerequisites

- A supported Node.js LTS release compatible with the locked framework version.
- npm, PM2, Nginx, MongoDB Database Tools, `tar`, and `sha256sum`.
- TLS certificate for the canonical hostname.
- Durable application, upload, log, and backup volumes with monitoring.
- Outbound database connectivity restricted to the required MongoDB endpoint.

## First deployment

1. Create a versioned release directory and deploy the exact reviewed commit.
2. Supply environment values from the secret manager using `deployment/production.env.example` as a names-only reference, create the durable upload/log/backup directories, install the candidate Nginx configuration and TLS paths, provision the backup signing key with `sudo -E bash deployment/scripts/provision-backup-signing-key.sh`, then run `bash deployment/scripts/preflight.sh`. The automated EC2 workflow performs the provisioning step itself.
3. Run `npm ci` and `npm run release:verify`. Do not continue if any command fails.
4. Restore or migrate database/uploads according to [Backup.md](./Backup.md) and [Storage.md](./Storage.md).
5. Ensure `uploads/` and `logs/` are persistent and writable by only the application account.
6. Start one process:

```bash
export PRISM_APP_DIR=/srv/prism-lab/current
pm2 start deployment/pm2/ecosystem.config.js --update-env
pm2 save
```

7. Re-run `nginx -t`, then reload Nginx.
8. Run `BASE_URL=https://staging.example.org bash deployment/scripts/smoke-test.sh` and complete the authenticated staging checklist in [Launch.md](./Launch.md).
9. Record every production check and the final decision in [GoLiveEvidence.md](./GoLiveEvidence.md).

## Release updates

Build in a new release directory, run all gates, back up current data, switch the `current` symlink atomically, and use `pm2 reload prism-lab --update-env`. Keep the prior release and backup until acceptance.

## Monitoring and alerts

- Monitor external HTTPS availability, latency, 5xx rate, certificate expiry, disk/inode use, memory, process restarts, MongoDB connectivity, and backup age.
- Alert immediately on repeated authentication failures, upload validation spikes, restore/migration activity, error-log surges, disk use above 80%, or a missing daily backup.
- PM2 writes JSON application output to `$LOGS_ROOT/application.log` and errors to `$LOGS_ROOT/error.log` (falling back to the release-local `logs/` directory outside production). Install/configure `pm2-logrotate` or ship logs to the institutional collector; verify retention and redaction.
- Nginx access/error logs live under `/var/log/nginx/`. Restrict access and apply system rotation.
- There is no public health endpoint. Use `/` for external liveness, PM2 process state for local liveness, and an authenticated database-backed page during readiness checks.

## Incident response

1. Record start time, symptoms, current release, request IDs, and operator.
2. Protect evidence; do not publish logs containing personal or security data.
3. Remove traffic or stop PM2 if continued writes risk corruption.
4. Choose rollback for release regressions or restore for confirmed data loss/corruption.
5. Verify public pages, admin authentication, representative CRUD, uploads, and logs before restoring traffic.
6. Rotate credentials if compromise is suspected and document follow-up actions.

## Rollback

Stop writes, switch `current` to the prior release, run `npm ci --omit=dev` only if its locked dependencies are not already present, then reload PM2. Do not roll database or uploads back unless the release changed their semantics or data was corrupted. If data rollback is required, use the coordinated restore runbook and retain the displaced state.
