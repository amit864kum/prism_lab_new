#!/usr/bin/env bash
set -Eeuo pipefail

script_directory="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
default_app_root="$(cd -- "$script_directory/../.." && pwd -P)"
app_root="${PRISM_APP_DIR:-$default_app_root}"
restore_source="${RESTORE_SOURCE:?RESTORE_SOURCE must identify a completed backup directory}"
mongodb_uri="${MONGODB_URI:?MONGODB_URI is required}"
uploads_root="${UPLOADS_ROOT:-$app_root/uploads}"

if [[ "${RESTORE_CONFIRM:-}" != 'restore-prism-lab' ]]; then
  echo 'Set RESTORE_CONFIRM=restore-prism-lab after approving downtime and the restore point' >&2
  exit 1
fi
if [[ "${PRE_RESTORE_BACKUP_CONFIRMED:-}" != 'yes' ]]; then
  echo 'Set PRE_RESTORE_BACKUP_CONFIRMED=yes after completing a pre-restore backup' >&2
  exit 1
fi

command -v mongorestore >/dev/null || { echo 'mongorestore is required' >&2; exit 1; }
command -v tar >/dev/null || { echo 'tar is required' >&2; exit 1; }
command -v sha256sum >/dev/null || { echo 'sha256sum is required' >&2; exit 1; }

app_root="$(cd -- "$app_root" && pwd -P)"
restore_source="$(cd -- "$restore_source" && pwd -P)"
uploads_parent="$(cd -- "$(dirname -- "$uploads_root")" && pwd -P)"
uploads_root="$uploads_parent/$(basename -- "$uploads_root")"

if [[ "$app_root" == '/' || "$app_root" == "$HOME" ]]; then
  echo 'Refusing to restore into a broad application root' >&2
  exit 1
fi
if [[ "$uploads_root" == '/' || "$uploads_root" == "$HOME" || "$(basename -- "$uploads_root")" != 'uploads' ]]; then
  echo 'Refusing to restore into an unsafe UPLOADS_ROOT; it must end in /uploads' >&2
  exit 1
fi

for required_file in mongodb.archive.gz uploads.tar.gz metadata.txt SHA256SUMS; do
  [[ -f "$restore_source/$required_file" ]] || { echo "Missing $required_file" >&2; exit 1; }
done

(
  cd -- "$restore_source"
  sha256sum --check SHA256SUMS
)

while IFS= read -r archive_path; do
  case "$archive_path" in
    /*|../*|*/../*|*/..) echo "Unsafe upload archive path: $archive_path" >&2; exit 1 ;;
    uploads|uploads/*) ;;
    *) echo "Unexpected upload archive path: $archive_path" >&2; exit 1 ;;
  esac
done < <(tar -tzf "$restore_source/uploads.tar.gz")

restore_staging="$(mktemp -d "$uploads_parent/.prism-restore-stage.XXXXXX")"
cleanup() {
  if [[ -d "$restore_staging" ]]; then
    rm -rf -- "$restore_staging"
  fi
}
trap cleanup EXIT

tar -xzf "$restore_source/uploads.tar.gz" -C "$restore_staging"
[[ -d "$restore_staging/uploads" ]] || { echo 'Upload archive has no uploads directory' >&2; exit 1; }

mongorestore --uri="$mongodb_uri" --archive="$restore_source/mongodb.archive.gz" --gzip --drop

timestamp="$(date -u +'%Y%m%dT%H%M%SZ')"
previous_uploads="$uploads_root.pre-restore-$timestamp"
if [[ -d "$uploads_root" ]]; then
  mv -- "$uploads_root" "$previous_uploads"
fi
mv -- "$restore_staging/uploads" "$uploads_root"

trap - EXIT
rmdir -- "$restore_staging"
echo "Restore completed. Previous uploads, if present, are retained at: $previous_uploads"
