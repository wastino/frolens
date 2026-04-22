"use client";

import { useState } from "react";
import Image from "next/image";
import { photos, categoryLabels, type Category } from "@/lib/photos";

const CATEGORIES: Category[] = ["all", "portraits", "street", "lifestyle"];

// Column span per aspect ratio (out of 12 columns)
const colSpan = {
  portrait: 4,
  landscape: 6,
  square: 4,
} as const;

// Row height in px
const rowHeight = {
  portrait: 480,
  landscape: 320,
  square: 380,
} as const;

export default function Gallery() {
  const [active, setActive] = useState<Category>("all");

  const filtered =
    active === "all" ? photos : photos.filter((p) => p.category === active);

  return (
    <section
      id="work"
      style={{
        padding: "6rem 2rem 8rem",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* Section header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: "3rem",
          flexWrap: "wrap",
          gap: "1.5rem",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              fontSize: "0.65rem",
              fontWeight: 300,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#c8a96e",
              marginBottom: "0.75rem",
            }}
          >
            Selected Work
          </p>
          <h2
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 300,
              fontStyle: "italic",
              color: "#ede8e3",
              lineHeight: 1.1,
            }}
          >
            The Portfolio
          </h2>
        </div>

        {/* Category filters */}
        <div style={{ display: "flex", gap: "0.25rem" }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              style={{
                background: "none",
                border: active === cat ? "1px solid #c8a96e" : "1px solid #1c1c1c",
                cursor: "pointer",
                padding: "0.4rem 1rem",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                fontSize: "0.65rem",
                fontWeight: 300,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: active === cat ? "#c8a96e" : "#6b6460",
                transition: "all 0.2s ease",
                borderRadius: "2px",
              }}
              onMouseEnter={(e) => {
                if (active !== cat) e.currentTarget.style.color = "#ede8e3";
              }}
              onMouseLeave={(e) => {
                if (active !== cat) e.currentTarget.style.color = "#6b6460";
              }}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="gallery-grid">
        {filtered.map((photo) => {
          const span = photo.featured
            ? colSpan[photo.aspect] + 2
            : colSpan[photo.aspect];
          const height = photo.featured
            ? rowHeight[photo.aspect] + 60
            : rowHeight[photo.aspect];

          return (
            <div
              key={photo.id}
              className="photo-card"
              style={{
                gridColumn: `span ${Math.min(span, 12)}`,
                position: "relative",
                height: `${height}px`,
                overflow: "hidden",
                background: "#0f0f0f",
                cursor: "pointer",
              }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
                onError={(e) => {
                  // Hide broken images gracefully
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />

              {/* Placeholder shown when image hasn't loaded / doesn't exist */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  zIndex: 0,
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    border: "1px solid #2a2a2a",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-inter), system-ui, sans-serif",
                    fontSize: "0.6rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#2a2a2a",
                  }}
                >
                  {photo.category}
                </span>
              </div>

              {/* Hover overlay */}
              <div
                className="photo-overlay"
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 2,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: "1.25rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-inter), system-ui, sans-serif",
                    fontSize: "0.6rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#ede8e3",
                    opacity: 0.7,
                  }}
                >
                  {categoryLabels[photo.category]}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .photo-card { height: 220px !important; }
        }
      `}</style>
    </section>
  );
}
