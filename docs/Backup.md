# Backup and restore runbook

## Requirements

Install MongoDB Database Tools (`mongodump` and `mongorestore`), `tar`, `sha256sum`, and OpenSSL on the application host. Backups must be written to encrypted durable storage outside the active release tree and copied off-host.

Set `PRISM_APP_DIR`, `BACKUP_ROOT`, and `MONGODB_URI` through the operator environment. Do not place secrets in shell history or repository files.

Create a signing key outside the backup directory and configure `BACKUP_SIGNING_PRIVATE_KEY` and `BACKUP_SIGNING_PUBLIC_KEY` with these paths:

```bash
sudo openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:3072 -out /etc/prism-lab-backup-signing.pem
sudo openssl pkey -in /etc/prism-lab-backup-signing.pem -pubout -out /etc/prism-lab-backup-signing.pub.pem
sudo chown prism:prism /etc/prism-lab-backup-signing*.pem
sudo chmod 600 /etc/prism-lab-backup-signing.pem
sudo chmod 644 /etc/prism-lab-backup-signing.pub.pem
```

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
