"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { categoryLabels, type ShopPhoto, type PrintSize } from "@/lib/photos";

const SIZES: { label: PrintSize; dims: string }[] = [
  { label: "A4", dims: "21 × 30 cm" },
  { label: "A3", dims: "30 × 42 cm" },
  { label: "A2", dims: "42 × 60 cm" },
  { label: "A1", dims: "60 × 84 cm" },
];

const PAPERS = [
  { label: "Matte Fine Art", surcharge: 0 },
  { label: "Glossy Premium", surcharge: 10 },
];

const WHATSAPP = "49XXXXXXXXXX";
const EMAIL = "frolensphotography@gmail.com";

interface OrderState {
  photo: ShopPhoto;
  sizeIdx: number;
  paperIdx: number;
  qty: number;
  name: string;
  email: string;
  submitting: boolean;
  submitted: boolean;
  orderId: number | null;
  confirmationSent: boolean | null;
  error: string | null;
}

function discounted(base: number, pct: number) {
  return pct > 0 ? Math.round(base * (1 - pct / 100)) : base;
}

function remaining(photo: ShopPhoto, size: PrintSize): number | null {
  const edition = photo.editions?.[size];
  if (edition === null || edition === undefined) return null;
  return Math.max(0, edition - photo.sold[size]);
}

function isSoldOut(photo: ShopPhoto, size: PrintSize) {
  const r = remaining(photo, size);
  return r !== null && r === 0;
}

function allSoldOut(photo: ShopPhoto) {
  return SIZES.every((s) => isSoldOut(photo, s.label));
}

export default function ShopClient({ photos }: { photos: ShopPhoto[] }) {
  const [order, setOrder] = useState<OrderState | null>(null);

  useEffect(() => {
    document.body.style.overflow = order ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [order]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !order?.submitting) setOrder(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [order]);

  const open = (photo: ShopPhoto) => {
    const sizeIdx = Math.max(0, SIZES.findIndex((s) => !isSoldOut(photo, s.label)));
    setOrder({ photo, sizeIdx, paperIdx: 0, qty: 1, name: "", email: "", submitting: false, submitted: false, orderId: null, confirmationSent: null, error: null });
  };

  const close = () => { if (!order?.submitting) setOrder(null); };

  const sizeKey = order ? SIZES[order.sizeIdx].label : "A4";
  const basePrice = order ? order.photo.prices[sizeKey] : 0;
  const unitPrice = order
    ? discounted(basePrice, order.photo.discountPct) + PAPERS[order.paperIdx].surcharge
    : 0;
  const total = order ? unitPrice * order.qty : 0;

  const submitOrder = async () => {
    if (!order) return;
    if (!order.name.trim() || !order.email.trim()) {
      setOrder({ ...order, error: "Please enter your name and email." });
      return;
    }
    setOrder({ ...order, submitting: true, error: null });
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photo_key: order.photo.s3Key || order.photo.id,
          size: SIZES[order.sizeIdx].label,
          qty: order.qty,
          paper: PAPERS[order.paperIdx].label,
          customer_name: order.name.trim(),
          customer_email: order.email.trim(),
          total_eur: total,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");
      setOrder({ ...order, submitting: false, submitted: true, orderId: data.orderId, confirmationSent: data.emailSent ?? false });
    } catch (e) {
      setOrder({ ...order, submitting: false, error: (e as Error).message });
    }
  };

  const waText = order
    ? encodeURIComponent(
        `Hi! I placed print order #${order.orderId} on frolens.com.\n\n` +
        `Photo: ${categoryLabels[order.photo.category]}\n` +
        `Size: ${SIZES[order.sizeIdx].label} (${SIZES[order.sizeIdx].dims})\n` +
        `Paper: ${PAPERS[order.paperIdx].label}\n` +
        `Qty: ${order.qty}  ·  Total: €${total}\n\nLooking forward to hearing from you!`
      )
    : "";

  const mailSubject = order
    ? encodeURIComponent(`Print order #${order.orderId ?? ""} — ${SIZES[order.sizeIdx].label} ${categoryLabels[order.photo.category]}`)
    : "";

  const mailBody = order
    ? encodeURIComponent(
        `Hi Winston,\n\nI placed print order #${order.orderId} on frolens.com.\n\n` +
        `Photo: ${categoryLabels[order.photo.category]}\n` +
        `Size: ${SIZES[order.sizeIdx].label} (${SIZES[order.sizeIdx].dims})\n` +
        `Paper: ${PAPERS[order.paperIdx].label}\n` +
        `Qty: ${order.qty}  ·  Total: €${total}\n\nThank you!`
      )
    : "";

  return (
    <>
      {/* Page header */}
      <div style={{ padding: "9rem 2rem 3.5rem", maxWidth: "1400px", margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "0.65rem", fontWeight: 300, letterSpacing: "0.3em", textTransform: "uppercase", color: "#c8a96e", marginBottom: "1rem" }}>
          Fine Art Prints
        </p>
        <h1 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(2.2rem, 5vw, 4rem)", fontWeight: 300, lineHeight: 1.1, color: "#ede8e3", marginBottom: "1.5rem" }}>
          Order a print
        </h1>
        <p style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "0.85rem", fontWeight: 300, lineHeight: 1.8, color: "#6b6460", maxWidth: "460px" }}>
          Archival prints on museum-grade paper, signed by Winston. Free shipping within the EU. Delivered in 7–10 days.
        </p>
      </div>

      {/* Price legend */}
      <div style={{ padding: "0 2rem 3rem", maxWidth: "1400px", margin: "0 auto", display: "flex", gap: "2rem", flexWrap: "wrap", borderBottom: "1px solid #1c1c1c" }}>
        {SIZES.map((s) => (
          <span key={s.label} style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "0.65rem", fontWeight: 300, letterSpacing: "0.15em", color: "#3a3735" }}>
            {s.label} {s.dims}
          </span>
        ))}
      </div>

      {/* Photo grid */}
      <div style={{ padding: "3rem 2rem 8rem", maxWidth: "1400px", margin: "0 auto" }}>
        <div className="shop-grid">
          {photos.map((photo) => {
            const soldOut = allSoldOut(photo);
            const hasDiscount = photo.discountPct > 0;
            const hasEditions = photo.editions && SIZES.some((s) => photo.editions![s.label] !== null);
            const minPrice = Math.min(...SIZES.map((s) => discounted(photo.prices[s.label], photo.discountPct)));

            return (
              <button
                key={photo.id}
                onClick={() => !soldOut && open(photo)}
                style={{ background: "none", border: "none", cursor: soldOut ? "default" : "pointer", padding: 0, textAlign: "left" }}
              >
                <div style={{ position: "relative", paddingBottom: "100%", background: "#0f0f0f", overflow: "hidden" }}>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    style={{ objectFit: "cover", opacity: soldOut ? 0.3 : 1, transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1), opacity 0.3s" }}
                    className="shop-thumb"
                  />
                  {hasDiscount && !soldOut && (
                    <div style={{ position: "absolute", top: "10px", left: "10px", background: "#c8a96e", color: "#080808", fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "0.6rem", fontWeight: 400, letterSpacing: "0.1em", padding: "3px 7px", borderRadius: "2px" }}>
                      −{photo.discountPct}%
                    </div>
                  )}
                  {soldOut ? (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "0.6rem", fontWeight: 300, letterSpacing: "0.25em", textTransform: "uppercase", color: "#6b6460" }}>
                        Sold out
                      </span>
                    </div>
                  ) : (
                    <div className="shop-overlay">
                      <span style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "0.6rem", fontWeight: 300, letterSpacing: "0.25em", textTransform: "uppercase", color: "#ede8e3" }}>
                        Order Print
                      </span>
                    </div>
                  )}
                </div>
                <div style={{ paddingTop: "0.65rem", paddingBottom: "0.25rem", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "0.6rem", fontWeight: 300, letterSpacing: "0.2em", textTransform: "uppercase", color: "#3a3735" }}>
                    {categoryLabels[photo.category]}
                    {hasEditions && !soldOut && (
                      <span style={{ color: "#2a2a2a", marginLeft: "0.5rem" }}>· limited</span>
                    )}
                  </span>
                  <span style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "0.6rem", fontWeight: 300, color: hasDiscount ? "#c8a96e" : "#2a2a2a" }}>
                    from €{minPrice}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Order modal */}
      {order && (
        <div
          onClick={close}
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="shop-modal"
            style={{ background: "#080808", border: "1px solid #1c1c1c", display: "flex", width: "100%", maxWidth: "900px", maxHeight: "88vh", overflow: "hidden" }}
          >
            {/* Photo panel */}
            <div style={{ flex: "0 0 52%", position: "relative", background: "#040404" }} className="shop-modal-photo">
              <Image src={order.photo.src} alt={order.photo.alt} fill sizes="50vw" style={{ objectFit: "contain" }} />
            </div>

            {/* Form panel */}
            <div style={{ flex: 1, overflowY: "auto", padding: "2.5rem 2rem", position: "relative", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Close */}
              <button
                onClick={close}
                style={{ position: "absolute", top: "1.25rem", right: "1.25rem", background: "none", border: "none", cursor: "pointer", color: "#3a3735", fontSize: "1rem", lineHeight: 1, padding: "4px" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#ede8e3")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#3a3735")}
                aria-label="Close"
              >✕</button>

              {order.submitted ? (
                /* ── Confirmation ── */
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", paddingTop: "1rem" }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "0.6rem", fontWeight: 300, letterSpacing: "0.25em", textTransform: "uppercase", color: "#c8a96e", marginBottom: "0.6rem" }}>
                      Order confirmed
                    </p>
                    <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1.6rem", fontWeight: 300, color: "#ede8e3", lineHeight: 1.1 }}>
                      Thank you, {order.name.split(" ")[0]}
                    </h2>
                    <p style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "0.75rem", fontWeight: 300, color: "#6b6460", marginTop: "0.75rem", lineHeight: 1.7 }}>
                      Reference #{order.orderId}. {order.confirmationSent ? "A confirmation email is on its way to your inbox." : "We will follow up shortly to arrange payment and shipping."}
                    </p>
                  </div>

                  <div style={{ background: "#0f0f0f", padding: "1rem", fontSize: "0.7rem", fontFamily: "var(--font-inter), system-ui, sans-serif", fontWeight: 300, color: "#6b6460", lineHeight: 1.8 }}>
                    {categoryLabels[order.photo.category]} · {SIZES[order.sizeIdx].label} ({SIZES[order.sizeIdx].dims})<br />
                    {PAPERS[order.paperIdx].label} · Qty {order.qty} · <span style={{ color: "#ede8e3" }}>€{total}</span>
                  </div>

                  <a
                    href={`https://wa.me/${WHATSAPP}?text=${waText}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: "block", padding: "0.9rem 1.5rem", background: "#c8a96e", color: "#080808", fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "0.7rem", fontWeight: 400, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", textAlign: "center", borderRadius: "2px" }}
                  >
                    Continue on WhatsApp
                  </a>
                  <a
                    href={`mailto:${EMAIL}?subject=${mailSubject}&body=${mailBody}`}
                    style={{ display: "block", padding: "0.9rem 1.5rem", background: "none", border: "1px solid #1c1c1c", color: "#6b6460", fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "0.7rem", fontWeight: 300, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", textAlign: "center", borderRadius: "2px" }}
                  >
                    Continue via Email
                  </a>
                </div>
              ) : (
                /* ── Order form ── */
                <>
                  <div>
                    <p style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "0.6rem", fontWeight: 300, letterSpacing: "0.25em", textTransform: "uppercase", color: "#c8a96e", marginBottom: "0.6rem" }}>
                      {categoryLabels[order.photo.category]}
                    </p>
                    <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1.6rem", fontWeight: 300, color: "#ede8e3", lineHeight: 1.1 }}>
                      Order a print
                    </h2>
                  </div>

                  {/* Size */}
                  <div>
                    <p style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "0.6rem", fontWeight: 300, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6b6460", marginBottom: "0.75rem" }}>Size</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                      {SIZES.map((s, i) => {
                        const soldOut = isSoldOut(order.photo, s.label);
                        const rem = remaining(order.photo, s.label);
                        const base = order.photo.prices[s.label];
                        const final = discounted(base, order.photo.discountPct);
                        const active = order.sizeIdx === i;
                        return (
                          <button
                            key={s.label}
                            onClick={() => !soldOut && setOrder({ ...order, sizeIdx: i })}
                            disabled={soldOut}
                            style={{
                              background: "none",
                              border: `1px solid ${active ? "#c8a96e" : "#1c1c1c"}`,
                              cursor: soldOut ? "not-allowed" : "pointer",
                              padding: "0.65rem 1rem",
                              display: "flex", justifyContent: "space-between", alignItems: "center",
                              fontFamily: "var(--font-inter), system-ui, sans-serif",
                              fontSize: "0.75rem", fontWeight: 300,
                              color: soldOut ? "#2a2a2a" : active ? "#ede8e3" : "#6b6460",
                              letterSpacing: "0.05em", borderRadius: "2px",
                              opacity: soldOut ? 0.5 : 1,
                            }}
                          >
                            <span>
                              {s.label} <span style={{ color: "#3a3735", fontSize: "0.7rem" }}>{s.dims}</span>
                              {rem !== null && (
                                <span style={{ color: rem <= 3 ? "#c05050" : "#3a3735", fontSize: "0.65rem", marginLeft: "0.5rem" }}>
                                  {soldOut ? "sold out" : `${rem} left`}
                                </span>
                              )}
                            </span>
                            <span style={{ color: active ? "#c8a96e" : "#3a3735" }}>
                              {order.photo.discountPct > 0 && (
                                <span style={{ textDecoration: "line-through", color: "#2a2a2a", marginRight: "0.4rem", fontSize: "0.65rem" }}>€{base}</span>
                              )}
                              €{final}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Paper */}
                  <div>
                    <p style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "0.6rem", fontWeight: 300, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6b6460", marginBottom: "0.75rem" }}>Paper</p>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      {PAPERS.map((p, i) => (
                        <button
                          key={p.label}
                          onClick={() => setOrder({ ...order, paperIdx: i })}
                          style={{
                            flex: 1, background: "none",
                            border: `1px solid ${order.paperIdx === i ? "#c8a96e" : "#1c1c1c"}`,
                            cursor: "pointer", padding: "0.65rem 0.5rem",
                            fontFamily: "var(--font-inter), system-ui, sans-serif",
                            fontSize: "0.7rem", fontWeight: 300,
                            color: order.paperIdx === i ? "#ede8e3" : "#6b6460",
                            letterSpacing: "0.05em", borderRadius: "2px", textAlign: "center",
                          }}
                        >
                          {p.label}
                          {p.surcharge > 0 && <span style={{ display: "block", fontSize: "0.65rem", color: "#3a3735", marginTop: "2px" }}>+€{p.surcharge}</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <p style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "0.6rem", fontWeight: 300, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6b6460", marginBottom: "0.75rem" }}>Quantity</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      {([-1, 1] as const).map((delta) => (
                        <button
                          key={delta}
                          onClick={() => setOrder({ ...order, qty: Math.max(1, order.qty + delta) })}
                          style={{ width: "32px", height: "32px", background: "none", border: "1px solid #1c1c1c", cursor: "pointer", color: "#6b6460", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "2px" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#c8a96e"; (e.currentTarget as HTMLElement).style.color = "#ede8e3"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#1c1c1c"; (e.currentTarget as HTMLElement).style.color = "#6b6460"; }}
                        >{delta === -1 ? "−" : "+"}</button>
                      ))}
                      <span style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "0.85rem", fontWeight: 300, color: "#ede8e3", minWidth: "1.5rem", textAlign: "center" }}>{order.qty}</span>
                    </div>
                  </div>

                  {/* Contact details */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <p style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "0.6rem", fontWeight: 300, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6b6460" }}>Your details</p>
                    {[
                      { key: "name", placeholder: "Full name", type: "text", value: order.name },
                      { key: "email", placeholder: "Email address", type: "email", value: order.email },
                    ].map(({ key, placeholder, type, value }) => (
                      <input
                        key={key}
                        type={type}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => setOrder({ ...order, [key]: e.target.value })}
                        style={{
                          background: "#0f0f0f", border: "1px solid #1c1c1c", borderRadius: "2px",
                          padding: "0.65rem 1rem", color: "#ede8e3",
                          fontFamily: "var(--font-inter), system-ui, sans-serif",
                          fontSize: "0.75rem", fontWeight: 300, width: "100%", outline: "none",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#c8a96e")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#1c1c1c")}
                      />
                    ))}
                  </div>

                  {/* Total + submit */}
                  <div style={{ borderTop: "1px solid #1c1c1c", paddingTop: "1.25rem", marginTop: "auto", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "0.65rem", fontWeight: 300, letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6460" }}>Total</span>
                      <span style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1.6rem", fontWeight: 300, color: "#ede8e3" }}>€{total}</span>
                    </div>
                    <span style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "0.65rem", fontWeight: 300, color: "#2a2a2a", letterSpacing: "0.1em" }}>
                      Free shipping · EU delivery 7–10 days
                    </span>
                    {order.error && (
                      <p style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "0.7rem", color: "#c05050", fontWeight: 300 }}>{order.error}</p>
                    )}
                    <button
                      onClick={submitOrder}
                      disabled={order.submitting}
                      style={{
                        padding: "0.9rem 1.5rem", background: order.submitting ? "#6b6460" : "#c8a96e",
                        color: "#080808", border: "none", cursor: order.submitting ? "not-allowed" : "pointer",
                        fontFamily: "var(--font-inter), system-ui, sans-serif",
                        fontSize: "0.7rem", fontWeight: 400, letterSpacing: "0.2em",
                        textTransform: "uppercase", borderRadius: "2px", transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => { if (!order.submitting) (e.currentTarget as HTMLElement).style.background = "#d4b87a"; }}
                      onMouseLeave={(e) => { if (!order.submitting) (e.currentTarget as HTMLElement).style.background = "#c8a96e"; }}
                    >
                      {order.submitting ? "Placing order…" : "Place Order"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .shop-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
        }
        @media (max-width: 1024px) { .shop-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 640px)  { .shop-grid { grid-template-columns: repeat(2, 1fr); } }
        .shop-thumb { transition: transform 0.6s cubic-bezier(0.16,1,0.3,1); }
        button:hover .shop-thumb { transform: scale(1.04); }
        .shop-overlay {
          position: absolute; inset: 0;
          background: rgba(0,0,0,0.55);
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity 0.3s ease;
        }
        button:hover .shop-overlay { opacity: 1; }
        @media (max-width: 640px) {
          .shop-modal { flex-direction: column !important; max-height: 95vh !important; }
          .shop-modal-photo { flex: 0 0 40% !important; min-height: 220px; }
        }
        input::placeholder { color: #3a3735; }
      `}</style>
    </>
  );
}
