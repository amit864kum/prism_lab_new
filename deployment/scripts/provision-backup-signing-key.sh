#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

app_user="${PRISM_APP_USER:-prism}"
signing_private_key="${BACKUP_SIGNING_PRIVATE_KEY:-/etc/prism-lab-backup-signing.pem}"
signing_public_key="${BACKUP_SIGNING_PUBLIC_KEY:-/etc/prism-lab-backup-signing.pub.pem}"

command -v openssl >/dev/null || { echo 'openssl is required' >&2; exit 1; }
command -v install >/dev/null || { echo 'install is required' >&2; exit 1; }
id "$app_user" >/dev/null 2>&1 || { echo "Application user does not exist: $app_user" >&2; exit 1; }
app_group="$(id -gn "$app_user")"

case "$signing_private_key" in /*) ;; *) echo 'BACKUP_SIGNING_PRIVATE_KEY must be an absolute path' >&2; exit 1 ;; esac
case "$signing_public_key" in /*) ;; *) echo 'BACKUP_SIGNING_PUBLIC_KEY must be an absolute path' >&2; exit 1 ;; esac
[[ "$signing_private_key" != "$signing_public_key" ]] \
  || { echo 'Backup signing key paths must be different' >&2; exit 1; }

private_key_directory="$(dirname -- "$signing_private_key")"
public_key_directory="$(dirname -- "$signing_public_key")"
for key_directory in "$private_key_directory" "$public_key_directory"; do
  if [[ ! -d "$key_directory" ]]; then
    install -d -o "$app_user" -g "$app_group" -m 0750 -- "$key_directory"
  fi
done

if [[ -f "$signing_public_key" && ! -f "$signing_private_key" ]]; then
  echo 'Backup signing public key exists but its private key is missing; refusing to replace the key pair' >&2
  exit 1
fi

temporary_private_key=''
temporary_public_key=''
cleanup() {
  [[ -z "$temporary_private_key" ]] || rm -f -- "$temporary_private_key"
  [[ -z "$temporary_public_key" ]] || rm -f -- "$temporary_public_key"
}
trap cleanup EXIT

if [[ ! -f "$signing_private_key" ]]; then
  temporary_private_key="$(mktemp "$private_key_directory/.prism-backup-private.XXXXXX")"
  temporary_public_key="$(mktemp "$public_key_directory/.prism-backup-public.XXXXXX")"
  openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:3072 -out "$temporary_private_key"
  openssl pkey -in "$temporary_private_key" -pubout -out "$temporary_public_key"
  chown "$app_user:$app_group" "$temporary_private_key" "$temporary_public_key"
  chmod 600 "$temporary_private_key"
  chmod 644 "$temporary_public_key"
  mv -- "$temporary_private_key" "$signing_private_key"
  temporary_private_key=''
  mv -- "$temporary_public_key" "$signing_public_key"
  temporary_public_key=''
elif [[ ! -f "$signing_public_key" ]]; then
  temporary_public_key="$(mktemp "$public_key_directory/.prism-backup-public.XXXXXX")"
  openssl pkey -in "$signing_private_key" -pubout -out "$temporary_public_key"
  chown "$app_user:$app_group" "$temporary_public_key"
  chmod 644 "$temporary_public_key"
  mv -- "$temporary_public_key" "$signing_public_key"
  temporary_public_key=''
fi

chown "$app_user:$app_group" "$signing_private_key" "$signing_public_key"
chmod 600 "$signing_private_key"
chmod 644 "$signing_public_key"

echo "Backup signing key is ready: $signing_public_key"
