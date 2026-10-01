#!/bin/bash
# Install and configure Fluent Bit for the IONOS Logging Service HTTP endpoint.
# Run as root from the deployed project directory:
#   sudo bash scripts/setup-fluent-bit.sh
set -euo pipefail

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run this script as root." >&2
  exit 1
fi

PROJECT_DIR="${PROJECT_DIR:-/var/www/frolens}"
CONFIG_SOURCE="$PROJECT_DIR/config/fluent-bit/fluent-bit.conf"
PARSERS_SOURCE="$PROJECT_DIR/config/fluent-bit/parsers.conf"
CONFIG_DIR="/etc/fluent-bit"
ENV_FILE="$CONFIG_DIR/frolens.env"
DROPIN_DIR="/etc/systemd/system/fluent-bit.service.d"
FLUENT_BIN="${FLUENT_BIN:-}"

if [[ -z "$FLUENT_BIN" ]]; then
  for candidate in /opt/fluent-bit/bin/fluent-bit /usr/bin/fluent-bit /usr/local/bin/fluent-bit; do
    if [[ -x "$candidate" ]]; then
      FLUENT_BIN="$candidate"
      break
    fi
  done
fi

if [[ ! -f "$CONFIG_SOURCE" || ! -f "$PARSERS_SOURCE" ]]; then
  echo "Fluent Bit configuration is missing from $PROJECT_DIR/config/fluent-bit" >&2
  exit 1
fi

if [[ -z "$FLUENT_BIN" ]]; then
  echo "Installing Fluent Bit..."
  apt-get update
  apt-get install -y curl gpg
  install -d -m 0755 /etc/apt/keyrings
  curl -fsSL https://packages.fluentbit.io/fluentbit.key \
    | gpg --dearmor --yes -o /etc/apt/keyrings/fluentbit.gpg
  chmod 0644 /etc/apt/keyrings/fluentbit.gpg
  printf '%s\n' \
    'deb [signed-by=/etc/apt/keyrings/fluentbit.gpg] https://packages.fluentbit.io/ubuntu/noble noble main' \
    > /etc/apt/sources.list.d/fluent-bit.list
  apt-get update
  apt-get install -y fluent-bit
  for candidate in /opt/fluent-bit/bin/fluent-bit /usr/bin/fluent-bit /usr/local/bin/fluent-bit; do
    if [[ -x "$candidate" ]]; then
      FLUENT_BIN="$candidate"
      break
    fi
  done
fi

if [[ -z "$FLUENT_BIN" ]]; then
  echo "Unable to locate Fluent Bit binary after installation." >&2
  exit 1
fi

install -d -m 0750 "$CONFIG_DIR" "$DROPIN_DIR" /var/lib/fluent-bit/storage
install -m 0640 "$CONFIG_SOURCE" "$CONFIG_DIR/fluent-bit.conf"
install -m 0640 "$PARSERS_SOURCE" "$CONFIG_DIR/parsers.conf"

if [[ ! -f "$ENV_FILE" ]]; then
  cat > "$ENV_FILE" <<'ENV'
# IONOS HTTP endpoint host, without https:// or a path.
IONOS_LOG_HOST=a197408c4bc3-logs.f5384d9e93ae.logging.de-txl.ionos.com
# IONOS pipeline tag used in the HTTP path, for example frolens.
IONOS_LOG_TAG=frolens
# API key returned by the IONOS pipeline.
IONOS_LOG_APIKEY=
ENV
  chmod 0600 "$ENV_FILE"
  echo "Created $ENV_FILE. Add the IONOS API key, then rerun this script."
  exit 0
fi

chmod 0600 "$ENV_FILE"

if ! grep -q '^IONOS_LOG_HOST=.' "$ENV_FILE" || \
   ! grep -q '^IONOS_LOG_TAG=.' "$ENV_FILE" || \
   ! grep -q '^IONOS_LOG_APIKEY=.' "$ENV_FILE"; then
  echo "$ENV_FILE must contain non-empty IONOS_LOG_HOST, IONOS_LOG_TAG, and IONOS_LOG_APIKEY values." >&2
  exit 1
fi

cat > "$DROPIN_DIR/frolens.conf" <<EOF
[Service]
EnvironmentFile=$ENV_FILE
EOF

systemctl daemon-reload
"$FLUENT_BIN" --dry-run -c "$CONFIG_DIR/fluent-bit.conf"
systemctl enable --now fluent-bit
systemctl restart fluent-bit
systemctl --no-pager --full status fluent-bit

printf '\nFluent Bit is forwarding PM2 and nginx logs to IONOS.\n'