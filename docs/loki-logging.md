# IONOS logging setup

IONOS stores pipeline logs in Loki, but its HTTP ingestion endpoint expects JSON and an `APIKEY` header rather than Loki's `/loki/api/v1/push` protocol. This server therefore uses Fluent Bit.

## First server setup

Deploy the project, then connect to the server as root:

```bash
ssh ionos-server
cd /var/www/frolens
bash scripts/setup-fluent-bit.sh
```

The first run installs Fluent Bit and creates `/etc/fluent-bit/frolens.env`, then exits without starting log forwarding.

Edit the protected credentials file:

```bash
sudoedit /etc/fluent-bit/frolens.env
```

Set the endpoint host, pipeline tag, and API key:

```dotenv
IONOS_LOG_HOST=a197408c4bc3-logs.f5384d9e93ae.logging.de-txl.ionos.com
IONOS_LOG_TAG=frolens
IONOS_LOG_APIKEY=YOUR_IONOS_API_KEY
```

The API key is the `APIKEY` returned for the IONOS pipeline. The tag is the path segment used by the pipeline, so use the exact tag configured for that pipeline.

Run setup again:

```bash
cd /var/www/frolens
bash scripts/setup-fluent-bit.sh
```

Fluent Bit will start at boot and collect:

- `/root/.pm2/logs/*.log`
- `/var/log/nginx/access.log`
- `/var/log/nginx/error.log`

## Verify the agent

```bash
systemctl status fluent-bit --no-pager
journalctl -u fluent-bit -n 50 --no-pager
```

Generate a controlled application request, then check the service log:

```bash
curl -I https://frolens.com/
journalctl -u fluent-bit -n 20 --no-pager
```

Open the IONOS Grafana endpoint and query the logs using the labels or fields shown by the pipeline. IONOS's HTTP ingestion contract determines the final field mapping.

## Other servers

Copy these files to the equivalent deployed project paths:

- `config/fluent-bit/fluent-bit.conf`
- `config/fluent-bit/parsers.conf`
- `scripts/setup-fluent-bit.sh`

Adjust the input paths and tags if the server uses a different process user or web server. Run the setup script as root, populate `/etc/fluent-bit/frolens.env`, run it again, and verify `systemctl status fluent-bit`.

Subsequent application deployments automatically refresh the Fluent Bit configuration when `/etc/fluent-bit/frolens.env` exists.
