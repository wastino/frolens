import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { initSchema, pool, getShopConfigs } from "@/lib/db";

function auth(req: NextRequest) {
  return req.headers.get("authorization") === `Bearer ${process.env.ADMIN_SECRET}`;
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const configs = await getShopConfigs();
  return NextResponse.json({ configs });
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await initSchema();
    const p = pool();
    if (!p) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });

    const {
      photo_key, price_a4, price_a3, price_a2, price_a1,
      discount_pct, editions_a4, editions_a3, editions_a2, editions_a1, enabled,
    } = await req.json();

    await p.query(
      `INSERT INTO shop_config
         (photo_key, price_a4, price_a3, price_a2, price_a1,
          discount_pct, editions_a4, editions_a3, editions_a2, editions_a1, enabled, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW())
       ON CONFLICT (photo_key) DO UPDATE SET
         price_a4     = EXCLUDED.price_a4,
         price_a3     = EXCLUDED.price_a3,
         price_a2     = EXCLUDED.price_a2,
         price_a1     = EXCLUDED.price_a1,
         discount_pct = EXCLUDED.discount_pct,
         editions_a4  = EXCLUDED.editions_a4,
         editions_a3  = EXCLUDED.editions_a3,
         editions_a2  = EXCLUDED.editions_a2,
         editions_a1  = EXCLUDED.editions_a1,
         enabled      = EXCLUDED.enabled,
         updated_at   = NOW()`,
      [photo_key, price_a4 ?? 29, price_a3 ?? 49, price_a2 ?? 89, price_a1 ?? 149,
       discount_pct ?? 0, editions_a4 ?? null, editions_a3 ?? null,
       editions_a2 ?? null, editions_a1 ?? null, enabled ?? true]
    );

    revalidatePath("/");
    revalidatePath("/shop");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
