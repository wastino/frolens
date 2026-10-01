import { NextRequest, NextResponse } from "next/server";
import { initSchema, pool } from "@/lib/db";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { photo_key, size, qty, paper, customer_name, customer_email, total_eur } =
      await req.json();

    if (!photo_key || !size || !qty || !paper || !customer_name || !customer_email || !total_eur) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await initSchema();
    const p = pool();
    if (!p) return NextResponse.json({ error: "Order storage is not configured" }, { status: 503 });

    const sizeCol = `editions_${size.toLowerCase()}`;
    const { rows: [cfg] } = await p.query(
      `SELECT ${sizeCol} as limit FROM shop_config WHERE photo_key = $1`,
      [photo_key]
    );

    if (cfg?.limit !== null && cfg?.limit !== undefined) {
      const { rows: [{ count }] } = await p.query(
        `SELECT COUNT(*) as count FROM orders
         WHERE photo_key = $1 AND size = $2 AND status != 'cancelled'`,
        [photo_key, size]
      );
      if (parseInt(count, 10) + qty > cfg.limit) {
        return NextResponse.json({ error: "Not enough editions remaining" }, { status: 409 });
      }
    }

    const { rows: [order] } = await p.query(
      `INSERT INTO orders (photo_key, size, qty, paper, customer_name, customer_email, total_eur)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
      [photo_key, size, qty, paper, customer_name, customer_email, total_eur]
    );

    const emailSent = await sendOrderConfirmationEmail({
      customerEmail: customer_email,
      customerName: customer_name,
      orderId: order.id,
      photoKey: photo_key,
      size,
      paper,
      qty,
      total: total_eur,
    });

    return NextResponse.json({ ok: true, orderId: order.id, emailSent });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
