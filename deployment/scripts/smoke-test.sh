#!/usr/bin/env bash
set -Eeuo pipefail

base_url="${BASE_URL:?BASE_URL is required, for example https://staging.example.org}"
base_url="${base_url%/}"

assert_status() {
  local path="$1"
  local expected="$2"
  local actual
  actual="$(curl --silent --show-error --output /dev/null --write-out '%{http_code}' "$base_url$path")"
  if [[ "$actual" != "$expected" ]]; then
    echo "FAIL $path: expected $expected, received $actual" >&2
    return 1
  fi
  echo "PASS $path ($actual)"
}

assert_header() {
  local path="$1"
  local header="$2"
  if ! curl --silent --show-error --head "$base_url$path" | tr -d '\r' | grep -qi "^$header:"; then
    echo "FAIL $path: missing $header" >&2
    return 1
  fi
  echo "PASS $path ($header present)"
}

assert_status '/' '200'
assert_status '/admin/login' '200'
assert_status '/admin/dashboard' '307'
assert_status '/api/auth/me' '401'
assert_header '/' 'x-content-type-options'
assert_header '/admin/login' 'x-request-id'

echo 'Unauthenticated smoke checks passed. Complete authenticated CRUD/upload checks manually.'
