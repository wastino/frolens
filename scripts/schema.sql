CREATE TABLE IF NOT EXISTS shop_config (
  photo_key    TEXT PRIMARY KEY,
  price_a4     INTEGER NOT NULL DEFAULT 29,
  price_a3     INTEGER NOT NULL DEFAULT 49,
  price_a2     INTEGER NOT NULL DEFAULT 89,
  price_a1     INTEGER NOT NULL DEFAULT 149,
  discount_pct INTEGER NOT NULL DEFAULT 0,
  editions_a4  INTEGER,
  editions_a3  INTEGER,
  editions_a2  INTEGER,
  editions_a1  INTEGER,
  enabled      BOOLEAN NOT NULL DEFAULT true,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id             SERIAL PRIMARY KEY,
  photo_key      TEXT NOT NULL,
  size           TEXT NOT NULL,
  qty            INTEGER NOT NULL DEFAULT 1,
  paper          TEXT NOT NULL,
  customer_name  TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  total_eur      INTEGER NOT NULL,
  status         TEXT NOT NULL DEFAULT 'pending',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fulfilled_at   TIMESTAMPTZ
);
