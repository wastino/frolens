import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        position: "relative",
        height: "100svh",
        minHeight: "600px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "#080808",
      }}
    >
      {/* Hero background image — drop your strongest photo at /public/hero.jpg */}
      <Image
        src="/hero.jpg"
        alt="frolens by Winston"
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center 30%" }}
      />

      {/* Dark overlay — keeps text legible over any photo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.7) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Vignette edges */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 50%, rgba(0,0,0,0.5) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Subtle gradient behind text block for legibility */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(0,0,0,0.3) 0%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Main content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          padding: "0 2rem",
        }}
      >
        {/* Eyebrow */}
        <p
          className="animate-fade-up opacity-0 delay-0"
          style={{
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            fontSize: "0.65rem",
            fontWeight: 300,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "#c8a96e",
            marginBottom: "1.5rem",
          }}
        >
          Photography
        </p>

        {/* Brand name */}
        <h1
          className="animate-fade-up opacity-0 delay-100"
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(4rem, 12vw, 9rem)",
            fontWeight: 300,
            lineHeight: 0.9,
            letterSpacing: "-0.01em",
            color: "#ede8e3",
            marginBottom: "0.1em",
          }}
        >
          frolens
        </h1>

        {/* By line */}
        <p
          className="animate-fade-up opacity-0 delay-200"
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(1rem, 3vw, 1.6rem)",
            fontWeight: 300,
            fontStyle: "italic",
            color: "#6b6460",
            letterSpacing: "0.25em",
            marginBottom: "3rem",
          }}
        >
          by Winston
        </p>

        {/* Tagline */}
        <p
          className="animate-fade-up opacity-0 delay-300"
          style={{
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            fontSize: "0.72rem",
            fontWeight: 300,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#4a4643",
            maxWidth: "320px",
            margin: "0 auto",
          }}
        >
          Portraits · Street Photography · Fashion Photography
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        className="animate-fade-in opacity-0 delay-800"
        style={{
          position: "absolute",
          zIndex: 2,
          bottom: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            fontSize: "0.6rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#3a3735",
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: "1px",
            height: "40px",
            background: "linear-gradient(to bottom, #3a3735, transparent)",
            position: "relative",
          }}
        >
          <div
            className="animate-scroll-dot"
            style={{
              position: "absolute",
              top: 0,
              left: "-2px",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "#c8a96e",
            }}
          />
        </div>
      </div>
    </section>
  );
}
