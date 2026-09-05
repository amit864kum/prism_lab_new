# Backup and restore runbook

## Requirements

Install MongoDB Database Tools (`mongodump` and `mongorestore`), `tar`, `sha256sum`, and OpenSSL on the application host. Backups must be written to encrypted durable storage outside the active release tree and copied off-host.

Set `PRISM_APP_DIR`, `BACKUP_ROOT`, and `MONGODB_URI` through the operator environment. Do not place secrets in shell history or repository files.

The automated EC2 deployment provisions a 3072-bit RSA signing key on first use. It uses `/etc/prism-lab-backup-signing.pem` and `/etc/prism-lab-backup-signing.pub.pem` unless `BACKUP_SIGNING_PRIVATE_KEY` and `BACKUP_SIGNING_PUBLIC_KEY` override the paths. Existing installations can provision the pair explicitly before preflight:

```bash
sudo -E bash deployment/scripts/provision-backup-signing-key.sh
```

Back up the private signing key separately in the deployment secret store. Losing it prevents creation of manifests that existing restore policy will trust; replacing it requires an explicitly coordinated key rotation.

## Create a coordinated backup

```bash
bash deployment/scripts/backup.sh
```

The script creates an owner-only atomic `prism-<UTC timestamp>/` directory containing a compressed MongoDB archive, compressed uploads, metadata, SHA-256 checksums, and a signed checksum manifest. Database credentials are supplied through a temporary owner-only tools configuration rather than process arguments. An incomplete backup is removed and never promoted to a completed name.

Record the backup identifier in the release log. Copy it off-host and periodically perform a restore rehearsal; an untested backup is not a recovery guarantee. Retention/deletion is deliberately external to the script and must follow institutional policy.

## Restore

1. Declare an incident/change window and stop PM2 traffic.
2. Create and verify a fresh pre-restore backup.
3. Select the completed restore directory and verify its recorded timestamp.
4. Export the required confirmations and run the restore:

```bash
export RESTORE_SOURCE=/srv/backups/prism-lab/prism-YYYYMMDDTHHMMSSZ
export PRE_RESTORE_BACKUP_CONFIRMED=yes
export RESTORE_CONFIRM=restore-prism-lab
bash deployment/scripts/restore.sh
```

The script verifies the manifest signature, checksums, and archive paths; restores MongoDB with `--drop`; and moves the previous uploads directory to a timestamped recovery location before installing restored uploads.

5. Start the application, run the smoke test, sign in, and verify representative records/files.
6. Retain the pre-restore backup and prior uploads until the recovery is accepted.

## Recovery objectives

The deployment owner must approve RPO/RTO values based on backup frequency and hosting capabilities. Until approved, the launch gate remains open. Database and upload backup schedules must be synchronized closely enough to avoid broken file references after restore.
