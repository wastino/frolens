import { Pool } from "pg";

let _pool: Pool | null = null;

function pool(): Pool | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;
  if (!_pool) _pool = new Pool({ connectionString });
  return _pool;
}

export interface DbShopConfig {
  photo_key: string;
  price_a4: number;
  price_a3: number;
  price_a2: number;
  price_a1: number;
  discount_pct: number;
  editions_a4: number | null;
  editions_a3: number | null;
  editions_a2: number | null;
  editions_a1: number | null;
  enabled: boolean;
}

export interface DbOrder {
  id: number;
  photo_key: string;
  size: string;
  qty: number;
  paper: string;
  customer_name: string;
  customer_email: string;
  total_eur: number;
  status: "pending" | "fulfilled" | "cancelled";
  created_at: string;
  fulfilled_at: string | null;
}

export type SoldCounts = Record<string, { A4: number; A3: number; A2: number; A1: number }>;

export async function initSchema(): Promise<void> {
  const p = pool();
  if (!p) throw new Error("DATABASE_URL is not configured");

  await p.query(`
    CREATE TABLE IF NOT EXISTS shop_config (
      photo_key   TEXT PRIMARY KEY,
      price_a4    INTEGER NOT NULL DEFAULT 29,
      price_a3    INTEGER NOT NULL DEFAULT 49,
      price_a2    INTEGER NOT NULL DEFAULT 89,
      price_a1    INTEGER NOT NULL DEFAULT 149,
      discount_pct INTEGER NOT NULL DEFAULT 0,
      editions_a4 INTEGER,
      editions_a3 INTEGER,
      editions_a2 INTEGER,
      editions_a1 INTEGER,
      enabled     BOOLEAN NOT NULL DEFAULT true,
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
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
  `);
}

export async function getShopConfigs(): Promise<DbShopConfig[]> {
  const p = pool();
  if (!p) return [];

  try {
    const { rows } = await p.query<DbShopConfig>("SELECT * FROM shop_config");
    return rows;
  } catch {
    return [];
  }
}

export async function getSoldCounts(): Promise<SoldCounts> {
  const p = pool();
  if (!p) return {};

  try {
    const { rows } = await p.query<{ photo_key: string; size: string; cnt: string }>(
      `SELECT photo_key, size, COUNT(*) as cnt
       FROM orders WHERE status != 'cancelled'
       GROUP BY photo_key, size`
    );
    const result: SoldCounts = {};
    for (const row of rows) {
      if (!result[row.photo_key]) result[row.photo_key] = { A4: 0, A3: 0, A2: 0, A1: 0 };
      result[row.photo_key][row.size as "A4" | "A3" | "A2" | "A1"] = parseInt(row.cnt, 10);
    }
    return result;
  } catch {
    return {};
  }
}

export { pool };
