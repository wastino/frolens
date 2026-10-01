"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const hashLinks = [
  { label: "Work", href: "#work" },
  { label: "Corporate", href: "#corporate" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const navLinkStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontFamily: "var(--font-inter), system-ui, sans-serif",
  fontSize: "0.75rem",
  fontWeight: 300,
  letterSpacing: "0.18em",
  textTransform: "uppercase" as const,
  color: "#6b6460",
  transition: "color 0.2s ease",
  padding: 0,
  textDecoration: "none",
  display: "inline-block",
};

const resolveHref = (href: string) => (href.startsWith("#") ? `/${href}` : href);

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (href: string) => {
    setMenuOpen(false);
    const sectionId = href.startsWith("#") ? href.slice(1) : href;
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const fallback = document.querySelector(href);
    if (fallback) {
      (fallback as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 2rem",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "background 0.4s ease, border-color 0.4s ease",
          background: scrolled ? "rgba(8,8,8,0.92)" : "transparent",
          borderBottom: scrolled ? "1px solid #1c1c1c" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        {/* Logo */}
        {isHome ? (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            <LogoInner />
          </button>
        ) : (
          <Link href="/" style={{ textDecoration: "none" }}>
            <LogoInner />
          </Link>
        )}

        {/* Desktop links */}
        <ul style={{ display: "flex", gap: "2.5rem", listStyle: "none", alignItems: "center" }} className="hidden-mobile">
          {hashLinks.map((link) => {
            const resolvedHref = resolveHref(link.href);
            return (
              <li key={link.href}>
                {isHome && link.href.startsWith("#") ? (
                  <button
                    onClick={() => scrollToSection(link.href)}
                    style={navLinkStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#ede8e3")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#6b6460")}
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    href={resolvedHref}
                    style={{
                      ...navLinkStyle,
                      color: pathname === resolvedHref ? "#c8a96e" : "#6b6460",
                    }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = "#ede8e3"}
                    onMouseLeave={(e) => {
                      if (pathname !== resolvedHref) {
                        (e.currentTarget as HTMLElement).style.color = "#6b6460";
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            );
          })}
          <li>
            <Link
              href="/pricing"
              style={{
                ...navLinkStyle,
                color: pathname === "/pricing" ? "#c8a96e" : "#6b6460",
                border: "1px solid",
                borderColor: pathname === "/pricing" ? "#c8a96e" : "#2a2a2a",
                padding: "0.35rem 0.9rem",
                borderRadius: "2px",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#c8a96e";
                (e.currentTarget as HTMLElement).style.borderColor = "#c8a96e";
              }}
              onMouseLeave={(e) => {
                if (pathname !== "/pricing") {
                  (e.currentTarget as HTMLElement).style.color = "#6b6460";
                  (e.currentTarget as HTMLElement).style.borderColor = "#2a2a2a";
                }
              }}
            >
              Pricing
            </Link>
          </li>
          <li>
            <Link
              href="/shop"
              style={{
                ...navLinkStyle,
                color: pathname === "/shop" ? "#c8a96e" : "#6b6460",
                border: "1px solid",
                borderColor: pathname === "/shop" ? "#c8a96e" : "#2a2a2a",
                padding: "0.35rem 0.9rem",
                borderRadius: "2px",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#c8a96e";
                (e.currentTarget as HTMLElement).style.borderColor = "#c8a96e";
              }}
              onMouseLeave={(e) => {
                if (pathname !== "/shop") {
                  (e.currentTarget as HTMLElement).style.color = "#6b6460";
                  (e.currentTarget as HTMLElement).style.borderColor = "#2a2a2a";
                }
              }}
            >
              Shop
            </Link>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="show-mobile"
          style={{ background: "none", border: "none", cursor: "pointer", display: "none", flexDirection: "column", gap: "5px", padding: "4px" }}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: "block",
                width: "22px",
                height: "1px",
                background: "#ede8e3",
                transition: "all 0.3s ease",
                transformOrigin: "center",
                transform:
                  menuOpen && i === 0 ? "rotate(45deg) translate(4px, 4px)" :
                  menuOpen && i === 2 ? "rotate(-45deg) translate(4px, -4px)" :
                  menuOpen && i === 1 ? "scaleX(0)" : "none",
              }}
            />
          ))}
        </button>
      </nav>

      {/* Mobile overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99,
          background: "rgba(8,8,8,0.97)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2.5rem",
          transition: "opacity 0.3s ease, visibility 0.3s ease",
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? "visible" : "hidden",
        }}
      >
        {hashLinks.map((link) => {
          const resolvedHref = resolveHref(link.href);
          return isHome && link.href.startsWith("#") ? (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "2.5rem", fontWeight: 300, fontStyle: "italic", color: "#ede8e3", letterSpacing: "0.05em" }}
            >
              {link.label}
            </button>
          ) : (
            <Link
              key={link.href}
              href={resolvedHref}
              onClick={() => setMenuOpen(false)}
              style={{ textDecoration: "none", fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "2.5rem", fontWeight: 300, fontStyle: "italic", color: pathname === resolvedHref ? "#c8a96e" : "#ede8e3", letterSpacing: "0.05em" }}
            >
              {link.label}
            </Link>
          );
        })}
        <Link
          href="/pricing"
          onClick={() => setMenuOpen(false)}
          style={{ textDecoration: "none", fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "2.5rem", fontWeight: 300, fontStyle: "italic", color: pathname === "/pricing" ? "#c8a96e" : "#ede8e3", letterSpacing: "0.05em" }}
        >
          Pricing
        </Link>
        <Link
          href="/shop"
          onClick={() => setMenuOpen(false)}
          style={{ textDecoration: "none", fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "2.5rem", fontWeight: 300, fontStyle: "italic", color: "#c8a96e", letterSpacing: "0.05em" }}
        >
          Shop
        </Link>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </>
  );
}

function LogoInner() {
  return (
    <>
      <span style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1.25rem", fontWeight: 400, color: "#ede8e3", letterSpacing: "0.08em", fontStyle: "italic" }}>
        frolens
      </span>
      <span style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "0.65rem", fontWeight: 300, color: "#6b6460", letterSpacing: "0.2em", marginLeft: "0.5rem", textTransform: "uppercase" }}>
        by Winston
      </span>
    </>
  );
}
