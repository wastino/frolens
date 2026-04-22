const links = [
  {
    label: "Email",
    display: "frolensphotography@gmail.com",
    href: "mailto:frolensphotography@gmail.com",
  },
  {
    label: "Instagram",
    display: "@frolensphotography",
    href: "https://instagram.com/frolensphotography",
  },
  {
    label: "WhatsApp",
    display: "Message on WhatsApp",
    href: "https://wa.me/49XXXXXXXXXX", // ← replace with your number
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      style={{
        padding: "8rem 2rem 10rem",
        maxWidth: "1400px",
        margin: "0 auto",
        borderTop: "1px solid #1c1c1c",
      }}
    >
      {/* Heading */}
      <div style={{ marginBottom: "5rem" }}>
        <p
          style={{
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            fontSize: "0.65rem",
            fontWeight: 300,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#c8a96e",
            marginBottom: "1.5rem",
          }}
        >
          Get in touch
        </p>
        <h2
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(2.2rem, 5vw, 4rem)",
            fontWeight: 300,
            lineHeight: 1.1,
            color: "#ede8e3",
          }}
        >
          Let's make
          <br />
          <em style={{ color: "#6b6460" }}>something together</em>
        </h2>
      </div>

      {/* Contact links */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "0",
          borderTop: "1px solid #1c1c1c",
        }}
        className="contact-links"
      >
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("mailto") ? undefined : "_blank"}
            rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
            style={{
              display: "block",
              padding: "2.5rem 0",
              borderRight: "1px solid #1c1c1c",
              textDecoration: "none",
              transition: "background 0.2s ease",
            }}
            className="contact-link-item"
          >
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                fontSize: "0.6rem",
                fontWeight: 300,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#c8a96e",
                marginBottom: "0.75rem",
              }}
            >
              {link.label}
            </span>
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "clamp(1rem, 1.8vw, 1.4rem)",
                fontWeight: 300,
                fontStyle: "italic",
                color: "#6b6460",
                transition: "color 0.2s ease",
              }}
              className="contact-link-text"
            >
              {link.display}
            </span>
          </a>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "6rem",
          paddingTop: "2rem",
          borderTop: "1px solid #1c1c1c",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.9rem",
            fontStyle: "italic",
            color: "#3a3735",
          }}
        >
          © {new Date().getFullYear()} frolens by Winston
        </span>
        <span
          style={{
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#2a2a2a",
          }}
        >
          Mannheim · Germany
        </span>
      </div>

      <style>{`
        .contact-link-item:last-child { border-right: none; }
        .contact-link-item:hover .contact-link-text { color: #ede8e3; }
        @media (max-width: 640px) {
          .contact-links { grid-template-columns: 1fr !important; }
          .contact-link-item { border-right: none !important; border-bottom: 1px solid #1c1c1c; }
          .contact-link-item:last-child { border-bottom: none; }
        }
      `}</style>
    </section>
  );
}
