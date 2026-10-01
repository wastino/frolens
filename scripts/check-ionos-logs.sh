#!/bin/bash
set -euo pipefail

ENV_FILE="/etc/fluent-bit/frolens.env"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing Fluent Bit env file: $ENV_FILE" >&2
  exit 1
fi

# shellcheck disable=SC1090
source "$ENV_FILE"

if [[ -z "${IONOS_LOG_HOST:-}" || -z "${IONOS_LOG_TAG:-}" || -z "${IONOS_LOG_APIKEY:-}" ]]; then
  echo "Fluent Bit env file is incomplete. Set IONOS_LOG_HOST, IONOS_LOG_TAG, and IONOS_LOG_APIKEY." >&2
  exit 1
fi

url="https://${IONOS_LOG_HOST}/${IONOS_LOG_TAG}"
response=$(curl -sS -o /tmp/ionos_healthcheck_body.txt -w '%{http_code}' \
  -X POST "$url" \
  -H 'Content-Type: application/json' \
  -H "APIKEY: ${IONOS_LOG_APIKEY}" \
  --data '{"status":"deploy-check","msg":"healthcheck","ts":'"$(date -u +%s)"'}')

if [[ "$response" != "201" && "$response" != "202" && "$response" != "200" ]]; then
  echo "IONOS log pipeline health check failed: HTTP $response" >&2
  echo "Target URL: $url" >&2
  cat /tmp/ionos_healthcheck_body.txt 2>/dev/null || true
  exit 1
fi

echo "IONOS log pipeline OK: HTTP $response ($url)"
