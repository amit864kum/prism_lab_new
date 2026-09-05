#!/usr/bin/env bash
set -Eeuo pipefail

fail() {
  echo "FAIL: $*" >&2
  exit 1
}

for command_name in node npm pm2 nginx mongodump mongorestore tar sha256sum curl openssl cmp stat; do
  command -v "$command_name" >/dev/null || fail "$command_name is required"
done

app_root="${PRISM_APP_DIR:?PRISM_APP_DIR is required}"
uploads_root="${UPLOADS_ROOT:?UPLOADS_ROOT is required}"
logs_root="${LOGS_ROOT:?LOGS_ROOT is required}"
backup_root="${BACKUP_ROOT:?BACKUP_ROOT is required}"
signing_private_key="${BACKUP_SIGNING_PRIVATE_KEY:-/etc/prism-lab-backup-signing.pem}"
signing_public_key="${BACKUP_SIGNING_PUBLIC_KEY:-/etc/prism-lab-backup-signing.pub.pem}"
mongodb_uri="${MONGODB_URI:?MONGODB_URI is required}"
jwt_secret="${JWT_SECRET:?JWT_SECRET is required}"
base_url="${NEXT_PUBLIC_BASE_URL:?NEXT_PUBLIC_BASE_URL is required}"
bind_address="${PRISM_BIND_ADDRESS:-127.0.0.1}"

[[ "$base_url" == https://* ]] || fail 'NEXT_PUBLIC_BASE_URL must use HTTPS'
[[ "$bind_address" == '127.0.0.1' || "$bind_address" == '::1' ]] \
  || fail 'PRISM_BIND_ADDRESS must be a loopback address'
[[ "${NEXT_PUBLIC_API_URL:-$base_url}" == "$base_url" ]] || fail 'NEXT_PUBLIC_API_URL must match NEXT_PUBLIC_BASE_URL'
[[ ${#jwt_secret} -ge 32 ]] || fail 'JWT_SECRET must contain at least 32 characters'
case "${jwt_secret,,}" in
  *replace*|*change-me*|*changeme*|*example*|*secret-key*) fail 'JWT_SECRET contains a placeholder value' ;;
esac
case "${mongodb_uri,,}" in
  *database-host*|*example*|*placeholder*) fail 'MONGODB_URI contains a placeholder value' ;;
esac

node -e "const [major,minor]=process.versions.node.split('.').map(Number); if (major < 20 || (major === 20 && minor < 9)) process.exit(1)" \
  || fail 'Node.js 20.9 or newer is required'

for directory in "$app_root" "$uploads_root" "$logs_root" "$backup_root"; do
  [[ -d "$directory" ]] || fail "directory does not exist: $directory"
  [[ -w "$directory" ]] || fail "directory is not writable: $directory"
done

[[ -f "$signing_private_key" && -r "$signing_private_key" ]] \
  || fail 'BACKUP_SIGNING_PRIVATE_KEY must be a readable file'
[[ -f "$signing_public_key" && -r "$signing_public_key" ]] \
  || fail 'BACKUP_SIGNING_PUBLIC_KEY must be a readable file'
private_key_mode="$(stat -c '%a' "$signing_private_key")"
[[ "$private_key_mode" == '400' || "$private_key_mode" == '600' ]] \
  || fail 'BACKUP_SIGNING_PRIVATE_KEY must have mode 400 or 600'
openssl pkey -in "$signing_private_key" -pubout 2>/dev/null | cmp -s - "$signing_public_key" \
  || fail 'Backup signing public key does not match the configured private key'

app_root="$(cd -- "$app_root" && pwd -P)"
uploads_root="$(cd -- "$uploads_root" && pwd -P)"
logs_root="$(cd -- "$logs_root" && pwd -P)"
backup_root="$(cd -- "$backup_root" && pwd -P)"

[[ "$(basename -- "$uploads_root")" == 'uploads' ]] || fail 'UPLOADS_ROOT must end in /uploads'
for durable_root in "$uploads_root" "$logs_root" "$backup_root"; do
  [[ "$durable_root" != '/' && "$durable_root" != "$HOME" ]] || fail "unsafe durable path: $durable_root"
  [[ "$durable_root" != "$app_root" && "$durable_root" != "$app_root"/* ]] \
    || fail "durable path must be outside the release tree: $durable_root"
done

[[ -f "$app_root/package-lock.json" ]] || fail 'package-lock.json is missing'
[[ -f "$app_root/deployment/pm2/ecosystem.config.js" ]] || fail 'PM2 configuration is missing'
[[ -f "$app_root/deployment/nginx/prism-lab.conf" ]] || fail 'Nginx configuration is missing'

node -e "const p=require('$app_root/package.json'); const major=Number(String(p.dependencies.next).match(/\d+/)?.[0]); if (major !== 16) process.exit(1)" \
  || fail 'The reviewed Next.js 16 dependency is not locked'
node -e "require('$app_root/deployment/pm2/ecosystem.config.js')" || fail 'PM2 configuration cannot be loaded'
nginx -t || fail 'Nginx configuration test failed'

echo 'PASS production host preflight'
echo "Canonical origin: $base_url"
echo "Application root: $app_root"
echo "Uploads root: $uploads_root"
echo "Logs root: $logs_root"
echo "Backup root: $backup_root"
