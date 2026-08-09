#!/usr/bin/env bash
set -Eeuo pipefail

script_directory="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
default_app_root="$(cd -- "$script_directory/../.." && pwd -P)"
app_root="${PRISM_APP_DIR:-$default_app_root}"
backup_root="${BACKUP_ROOT:?BACKUP_ROOT must point to durable backup storage}"
mongodb_uri="${MONGODB_URI:?MONGODB_URI is required}"
uploads_root="${UPLOADS_ROOT:-$app_root/uploads}"

command -v mongodump >/dev/null || { echo 'mongodump is required' >&2; exit 1; }
command -v tar >/dev/null || { echo 'tar is required' >&2; exit 1; }
command -v sha256sum >/dev/null || { echo 'sha256sum is required' >&2; exit 1; }

mkdir -p -- "$backup_root"
backup_root="$(cd -- "$backup_root" && pwd -P)"
app_root="$(cd -- "$app_root" && pwd -P)"
uploads_root="$(cd -- "$uploads_root" && pwd -P)"

if [[ "$backup_root" == '/' || "$backup_root" == "$app_root" || "$backup_root" == "$app_root"/* ]]; then
  echo 'BACKUP_ROOT must be outside the application release tree' >&2
  exit 1
fi

timestamp="$(date -u +'%Y%m%dT%H%M%SZ')"
staging_directory="$backup_root/.prism-$timestamp.incomplete"
final_directory="$backup_root/prism-$timestamp"

if [[ -e "$staging_directory" || -e "$final_directory" ]]; then
  echo "Backup target already exists for timestamp $timestamp" >&2
  exit 1
fi

mkdir -- "$staging_directory"
cleanup() {
  if [[ -d "$staging_directory" ]]; then
    rm -rf -- "$staging_directory"
  fi
}
trap cleanup EXIT

mongodump --uri="$mongodb_uri" --archive="$staging_directory/mongodb.archive.gz" --gzip

if [[ ! -d "$uploads_root" ]]; then
  echo "Upload directory is missing: $uploads_root" >&2
  exit 1
fi
if [[ "$(basename -- "$uploads_root")" != 'uploads' ]]; then
  echo 'UPLOADS_ROOT must end in /uploads so backup and restore archives remain portable' >&2
  exit 1
fi
tar -czf "$staging_directory/uploads.tar.gz" -C "$(dirname -- "$uploads_root")" uploads

{
  echo "created_at_utc=$timestamp"
  echo "application_root=$app_root"
  echo "uploads_root=$uploads_root"
  echo "hostname=$(hostname)"
} > "$staging_directory/metadata.txt"

(
  cd -- "$staging_directory"
  sha256sum mongodb.archive.gz uploads.tar.gz metadata.txt > SHA256SUMS
)

mv -- "$staging_directory" "$final_directory"
trap - EXIT
echo "Backup completed: $final_directory"
