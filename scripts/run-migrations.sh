#!/bin/sh
# Production / Railway Pre-deploy migration runner.
# Uses Payload CLI already present in node_modules — no network install.
set -eu

if [ -z "${DATABASE_URL:-}" ]; then
  echo "[migrate] ERROR: DATABASE_URL is required" >&2
  exit 1
fi

if [ -z "${PAYLOAD_SECRET:-}" ]; then
  echo "[migrate] ERROR: PAYLOAD_SECRET is required" >&2
  exit 1
fi

if [ ! -f ./node_modules/payload/bin.js ]; then
  echo "[migrate] ERROR: Payload CLI not found at ./node_modules/payload/bin.js" >&2
  echo "[migrate] The Docker image must include production node_modules + src/migrations." >&2
  exit 1
fi

if [ ! -d ./src/migrations ]; then
  echo "[migrate] ERROR: Migration directory ./src/migrations is missing" >&2
  exit 1
fi

export PAYLOAD_MIGRATING=true
export NODE_ENV="${NODE_ENV:-production}"

echo "[migrate] Starting Payload migrations (PAYLOAD_MIGRATING=true, NODE_ENV=$NODE_ENV)"
exec node ./node_modules/payload/bin.js migrate
