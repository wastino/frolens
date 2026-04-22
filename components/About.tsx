export default function About() {
  return (
    <section
      id="about"
      style={{
        padding: "8rem 2rem",
        maxWidth: "1400px",
        margin: "0 auto",
        borderTop: "1px solid #1c1c1c",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "6rem",
          alignItems: "center",
        }}
        className="about-grid"
      >
        {/* Left — text */}
        <div>
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
            About
          </p>

          <h2
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
              fontWeight: 300,
              lineHeight: 1.15,
              color: "#ede8e3",
              marginBottom: "2rem",
            }}
          >
            Seeing the world
            <br />
            <em style={{ color: "#6b6460" }}>one frame at a time</em>
          </h2>

          <div
            style={{
              width: "32px",
              height: "1px",
              background: "#c8a96e",
              marginBottom: "2rem",
            }}
          />

          <p
            style={{
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              fontSize: "0.9rem",
              fontWeight: 300,
              lineHeight: 1.9,
              color: "#6b6460",
              marginBottom: "1.5rem",
              maxWidth: "460px",
            }}
          >
            I'm Winston — a photographer based in Mannheim, Germany, drawn to
            the quiet drama of everyday moments. My work moves between editorial
            portraiture, street photography, and lifestyle — wherever the light
            and the story align.
          </p>

          <p
            style={{
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              fontSize: "0.9rem",
              fontWeight: 300,
              lineHeight: 1.9,
              color: "#4a4643",
              maxWidth: "460px",
            }}
          >
            Available for portrait sessions, editorial work, and brand
            collaborations.
          </p>
        </div>

        {/* Right — large quote */}
        <div style={{ position: "relative" }}>
          <span
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(5rem, 12vw, 10rem)",
              fontWeight: 300,
              fontStyle: "italic",
              color: "#1a1a1a",
              lineHeight: 1,
              position: "absolute",
              top: "-2rem",
              left: "-1rem",
              userSelect: "none",
            }}
          >
            "
          </span>
          <blockquote
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 1.5,
              color: "#6b6460",
              paddingLeft: "3rem",
              paddingTop: "3rem",
              borderLeft: "1px solid #1c1c1c",
            }}
          >
            Light doesn't wait. Neither do I.
          </blockquote>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
      `}</style>
    </section>
  );
}
