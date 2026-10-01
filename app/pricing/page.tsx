import Link from "next/link";
import Nav from "@/components/Nav";

const graduationPackages = [
  {
    name: "Essentials",
    details: "6 edited photos · 1 outfit · outdoor location of your choice",
    price: "€200",
  },
  {
    name: "Signature",
    details: "5 edited photos · 2 outfits · 1 lifestyle video",
    price: "€280",
    featured: true,
  },
  {
    name: "Premium",
    details: "10 edited photos · 2 outfits · multiple poses · 1 lifestyle video · behind-the-scenes content",
    price: "€380",
  },
];

const otherPackages = [
  { name: "Corporate Headshots package", price: "€200 – €800", description: "Price range from 200 euros - 800 eur" },
  { name: "Corporate branding package", price: "Contact for pricing", description: "Corporate branding package" },
  { name: "Fashion Shoots", price: "Contact for pricing", description: "Fashion Shoots" },
  { name: "Street/Lifestyle Package", price: "From €200", description: "Street/Livestyle Package: from 200 eur" },
  { name: "Custom", price: "Custom", description: "Custom" },
];

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main style={{ minHeight: "100vh", background: "#080808", paddingTop: "6rem" }}>
        <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 2rem 6rem" }}>
          <div style={{ marginBottom: "2.5rem" }}>
            <p
              style={{
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                fontSize: "0.65rem",
                fontWeight: 300,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#c8a96e",
                marginBottom: "1rem",
              }}
            >
              Packages & Pricing
            </p>
            <h1
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "clamp(2.8rem, 5vw, 4.2rem)",
                fontWeight: 300,
                color: "#ede8e3",
                margin: 0,
              }}
            >
              Graduation Package
            </h1>
          </div>

          <div style={{ display: "grid", gap: "1rem", marginBottom: "4rem" }}>
            {graduationPackages.map((pkg) => (
              <article
                key={pkg.name}
                style={{
                  borderTop: pkg.featured ? "1px solid rgba(200,169,110,0.7)" : "1px solid #1c1c1c",
                  borderBottom: "1px solid #1c1c1c",
                  padding: "1.5rem 0",
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr) auto",
                  gap: "1.5rem",
                  alignItems: "center",
                  background: pkg.featured ? "rgba(200,169,110,0.04)" : "transparent",
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-inter), system-ui, sans-serif",
                      fontSize: "0.7rem",
                      fontWeight: 300,
                      letterSpacing: "0.24em",
                      textTransform: "uppercase",
                      color: pkg.featured ? "#c8a96e" : "#6b6460",
                      marginBottom: "0.55rem",
                    }}
                  >
                    {pkg.name}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-inter), system-ui, sans-serif",
                      fontSize: "0.9rem",
                      lineHeight: 1.8,
                      color: "#6b6460",
                      margin: 0,
                    }}
                  >
                    {pkg.details}
                  </p>
                </div>

                <div
                  style={{
                    fontFamily: "var(--font-inter), system-ui, sans-serif",
                    fontSize: "0.9rem",
                    lineHeight: 1.8,
                    color: "#6b6460",
                  }}
                >
                  {pkg.featured ? "MOST BOOKED" : ""}
                </div>

                <div
                  style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontSize: "clamp(2rem, 3vw, 2.6rem)",
                    fontWeight: 300,
                    color: "#c8a96e",
                    textAlign: "right",
                    whiteSpace: "nowrap",
                  }}
                >
                  {pkg.price}
                </div>
              </article>
            ))}
          </div>

          <div style={{ marginTop: "1rem" }}>
            <h2
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "clamp(2.2rem, 4vw, 3rem)",
                fontWeight: 300,
                color: "#ede8e3",
                marginBottom: "1.5rem",
              }}
            >
              Other services
            </h2>

            <div style={{ display: "grid", gap: "1rem" }}>
              {otherPackages.map((pkg) => (
                <article
                  key={pkg.name}
                  style={{
                    borderTop: "1px solid #1c1c1c",
                    borderBottom: "1px solid #1c1c1c",
                    padding: "1.2rem 0",
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 2fr) auto",
                    gap: "1rem",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-inter), system-ui, sans-serif",
                        fontSize: "0.68rem",
                        fontWeight: 300,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: "#c8a96e",
                        marginBottom: "0.45rem",
                      }}
                    >
                      {pkg.name}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-inter), system-ui, sans-serif",
                        fontSize: "0.9rem",
                        lineHeight: 1.8,
                        color: "#6b6460",
                        margin: 0,
                      }}
                    >
                      {pkg.description}
                    </p>
                  </div>

                  <div
                    style={{
                      fontFamily: "var(--font-cormorant), Georgia, serif",
                      fontSize: "clamp(1.6rem, 2vw, 2.2rem)",
                      fontWeight: 300,
                      color: "#c8a96e",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {pkg.price}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "3rem", textAlign: "left" }}>
            <Link
              href="/#contact"
              style={{
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                fontSize: "0.72rem",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "#ede8e3",
                textDecoration: "none",
                borderBottom: "1px solid #c8a96e",
                paddingBottom: "0.2rem",
              }}
            >
              Book a session
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
