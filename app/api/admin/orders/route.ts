import { NextRequest, NextResponse } from "next/server";
import { initSchema, pool } from "@/lib/db";

function auth(req: NextRequest) {
  return req.headers.get("authorization") === `Bearer ${process.env.ADMIN_SECRET}`;
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await initSchema();
    const p = pool();
    if (!p) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
    const { rows } = await p.query(
    "SELECT * FROM orders ORDER BY created_at DESC"
  );
    return NextResponse.json({ orders: rows });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await initSchema();
    const p = pool();
    if (!p) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });

    const { id, status } = await req.json();
    if (!["pending", "fulfilled", "cancelled"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    await p.query(
      `UPDATE orders SET status = $1,
       fulfilled_at = CASE WHEN $1 = 'fulfilled' THEN NOW() ELSE NULL END
       WHERE id = $2`,
      [status, id]
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
