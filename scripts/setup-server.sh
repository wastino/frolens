#!/bin/bash
# One-time server setup. Run with:
#   ssh ionos-server "bash -s" < scripts/setup-server.sh
set -e

echo "→ Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

echo "→ Installing PM2..."
npm install -g pm2
pm2 startup systemd -u root --hp /root | tail -1 | bash

echo "→ Installing PostgreSQL..."
apt-get install -y postgresql postgresql-contrib

echo "→ Creating database and user..."
sudo -u postgres psql <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'frolens') THEN
    CREATE USER frolens WITH PASSWORD '0cb059b467dbd435a69c67f2d1093fb254348e27';
  END IF;
END
\$\$;
CREATE DATABASE frolens OWNER frolens;
GRANT ALL PRIVILEGES ON DATABASE frolens TO frolens;
SQL

echo "→ Configuring nginx..."
cat > /etc/nginx/sites-available/frolens <<'NGINX'
server {
    listen 80;
    server_name frolens.com www.frolens.com;

    location / {
        proxy_pass         http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/frolens /etc/nginx/sites-enabled/frolens
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo ""
echo "✓ Server setup complete"
echo ""
echo "Next steps:"
echo "  1. Create /var/www/frolens/.env.local (see .env.local.example in the repo)"
echo "  2. Run: ./deploy.sh"
echo "  3. Enable HTTPS: certbot --nginx -d frolens.com -d www.frolens.com"
