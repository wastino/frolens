"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Photo } from "@/lib/photos";

interface CorporatePhotosProps {
  photos: Photo[];
}

export default function CorporatePhotos({ photos }: CorporatePhotosProps) {
  const [index, setIndex] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    if (photos.length < 2) return;
    const timer = window.setInterval(() => {
      if (!paused.current) setIndex((current) => (current + 1) % photos.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [photos.length]);

  const services = [
    {
      title: "Brand Portraits",
      description:
        "Refined headshots and personal brand imagery for founders, creatives, and leadership teams.",
    },
    {
      title: "Team Sessions",
      description:
        "Candid, polished team photography that captures culture, collaboration, and confidence.",
    },
    {
      title: "Campaign Content",
      description:
        "Editorial-style visual storytelling designed for launch campaigns, digital launches, and social media.",
    },
  ];

  return (
    <section
      id="corporate"
      style={{
        padding: "7rem 2rem",
        background: "linear-gradient(180deg, rgba(17,17,17,0.95), rgba(8,8,8,1))",
        borderTop: "1px solid #1c1c1c",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "3rem", maxWidth: "740px" }}>
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
            Corporate Photography
          </p>
          <h2
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(2.4rem, 4vw, 3.5rem)",
              fontWeight: 300,
              lineHeight: 1.1,
              color: "#ede8e3",
              marginBottom: "1rem",
            }}
          >
            Content that feels premium, human, and unmistakably brand-led.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              fontSize: "0.95rem",
              lineHeight: 1.8,
              color: "#6b6460",
            }}
          >
            I create visual assets for businesses, agencies, and founders who want their company story told with depth, clarity, and a distinctive point of view.
          </p>
        </div>

        {photos.length > 0 ? (
          <div
            style={{
              position: "relative",
              aspectRatio: "16 / 8",
              minHeight: "300px",
              overflow: "hidden",
              background: "#040404",
              marginBottom: "3rem",
            }}
            onMouseEnter={() => { paused.current = true; }}
            onMouseLeave={() => { paused.current = false; }}
          >
            {photos.map((photo, photoIndex) => (
              <div
                key={photo.id}
                aria-hidden={photoIndex !== index}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: photoIndex === index ? 1 : 0,
                  transition: "opacity 700ms ease",
                }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 1200px"
                  priority={photoIndex === 0}
                  style={{ objectFit: "cover" }}
                />
              </div>
            ))}
            <div
              style={{
                position: "absolute",
                inset: "55% 0 0",
                background: "linear-gradient(transparent, rgba(0,0,0,0.55))",
                pointerEvents: "none",
              }}
            />
            {photos.length > 1 ? (
              <div
                style={{
                  position: "absolute",
                  right: "1.25rem",
                  bottom: "1.25rem",
                  display: "flex",
                  gap: "0.45rem",
                }}
              >
                {photos.map((photo, photoIndex) => (
                  <button
                    key={photo.id}
                    type="button"
                    aria-label={`Show corporate photo ${photoIndex + 1}`}
                    aria-current={photoIndex === index}
                    onClick={() => setIndex(photoIndex)}
                    style={{
                      width: "9px",
                      height: "9px",
                      border: 0,
                      borderRadius: "50%",
                      padding: 0,
                      cursor: "pointer",
                      background: photoIndex === index ? "#c8a96e" : "rgba(237,232,227,0.55)",
                    }}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "1.5rem",
          }}
          className="corporate-grid"
        >
          {services.map((service) => (
            <article
              key={service.title}
              style={{
                border: "1px solid #1c1c1c",
                background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
                padding: "2rem 1.6rem",
                minHeight: "220px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "1px",
                  background: "#c8a96e",
                  marginBottom: "1.5rem",
                }}
              />
              <h3
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize: "2rem",
                  fontWeight: 300,
                  color: "#ede8e3",
                  marginBottom: "0.9rem",
                }}
              >
                {service.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                  fontSize: "0.9rem",
                  lineHeight: 1.8,
                  color: "#6b6460",
                  margin: 0,
                }}
              >
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .corporate-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
