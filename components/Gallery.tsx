"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { categoryLabels, CATEGORY_ORDER, type Category, type Photo } from "@/lib/photos";

interface Props {
  photos: Photo[];
  shuffle?: boolean;
}

const FILTERS: Category[] = [
  "all",
  "portraits",
  "corporate",
  "editorial",
  "family",
  "newborn",
  "street",
  "fashion",
];

function getPhotosForCategory(photos: Photo[], category: Category): Photo[] {
  return category === "all"
    ? CATEGORY_ORDER.flatMap((item) => photos.filter((photo) => photo.category === item))
    : photos.filter((photo) => photo.category === category);
}

function shufflePhotos(photos: Photo[], previousOrder: Photo[]): Photo[] {
  const shuffled = [...photos];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  if (
    shuffled.length > 1 &&
    shuffled.every((photo, index) => photo.id === previousOrder[index]?.id)
  ) {
    [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
  }

  return shuffled;
}

export default function Gallery({ photos, shuffle = true }: Props) {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [index, setIndex] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);
  const [photoOrder, setPhotoOrder] = useState<{ category: Category; photos: Photo[] }>({
    category: "all",
    photos,
  });
  const previousOrders = useRef(new Map<Category, Photo[]>());
  const touchX = useRef(0);

  const categoryPhotos = getPhotosForCategory(photos, activeCategory);
  const filtered = photoOrder.category === activeCategory ? photoOrder.photos : categoryPhotos;

  const total = filtered.length;
  const visibleIndex = total > 0 ? index % total : 0;

  const go = useCallback(
    (next: number) => {
      if (total === 0) return;
      setIndex(((next % total) + total) % total);
      setFadeKey((k) => k + 1);
    },
    [total]
  );

  const prev = useCallback(() => go(index - 1), [go, index]);
  const next = useCallback(() => go(index + 1), [go, index]);

  // Start each category with a fresh order while keeping server rendering stable.
  useEffect(() => {
    const sourcePhotos = getPhotosForCategory(photos, activeCategory);
    const previousOrder = previousOrders.current.get(activeCategory) ?? sourcePhotos;
    const nextOrder = shuffle ? shufflePhotos(sourcePhotos, previousOrder) : sourcePhotos;
    previousOrders.current.set(activeCategory, nextOrder);
    setPhotoOrder({
      category: activeCategory,
      photos: nextOrder,
    });
    setIndex(0);
    setFadeKey((k) => k + 1);
  }, [activeCategory, photos, shuffle]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  // Slideshow — advance every 4 seconds, pause on hover
  const paused = useRef(false);
  useEffect(() => {
    const id = setInterval(() => {
      if (!paused.current) go(index + 1);
    }, 4000);
    return () => clearInterval(id);
  }, [go, index]);

  if (total === 0) return null;

  const photo = filtered[visibleIndex];
  const counter = `${String(visibleIndex + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  return (
    <section
      id="work"
      style={{ padding: "6rem 0 8rem", maxWidth: "1400px", margin: "0 auto" }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: "2.5rem",
          flexWrap: "wrap",
          gap: "1.5rem",
          padding: "0 2rem",
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
          {FILTERS.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: "none",
                border:
                  activeCategory === cat
                    ? "1px solid #c8a96e"
                    : "1px solid #1c1c1c",
                cursor: "pointer",
                padding: "0.4rem 1rem",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                fontSize: "0.65rem",
                fontWeight: 300,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: activeCategory === cat ? "#c8a96e" : "#6b6460",
                transition: "all 0.2s ease",
                borderRadius: "2px",
              }}
              onMouseEnter={(e) => {
                if (activeCategory !== cat)
                  e.currentTarget.style.color = "#ede8e3";
              }}
              onMouseLeave={(e) => {
                if (activeCategory !== cat)
                  e.currentTarget.style.color = "#6b6460";
              }}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Carousel stage */}
      <div
        style={{
          position: "relative",
          height: "78vh",
          minHeight: "420px",
          background: "#040404",
          overflow: "hidden",
          cursor: "ew-resize",
        }}
        onMouseEnter={() => { paused.current = true; }}
        onMouseLeave={() => { paused.current = false; }}
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const diff = touchX.current - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
        }}
      >
        {/* Image — keyed to trigger CSS fade on change */}
        <div
          key={fadeKey}
          className="carousel-image"
          style={{ position: "absolute", inset: 0 }}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Counter — top right */}
        <div
          style={{
            position: "absolute",
            top: "1.5rem",
            right: "1.75rem",
            zIndex: 10,
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            fontSize: "0.65rem",
            fontWeight: 300,
            letterSpacing: "0.2em",
            color: "#6b6460",
            background: "rgba(4, 4, 4, 0.72)",
            padding: "0.45rem 0.7rem",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {counter}
        </div>

        {/* Dots */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "1.5rem",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "0.45rem",
            zIndex: 10,
          }}
        >
          {filtered.map((_, dotIndex) => (
            <button
              key={dotIndex}
              onClick={() => go(dotIndex)}
              aria-label={`Show photo ${dotIndex + 1}`}
              style={{
                width: "9px",
                height: "9px",
                borderRadius: "999px",
                border: "none",
                background: dotIndex === visibleIndex ? "#c8a96e" : "rgba(237,232,227,0.35)",
                cursor: "pointer",
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* Prev arrow */}
        <button
          onClick={prev}
          aria-label="Previous photo"
          className="carousel-arrow carousel-arrow-left"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "80px",
            zIndex: 10,
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="#ede8e3"
            strokeWidth="1"
          >
            <path d="M13 3L6 10L13 17" />
          </svg>
        </button>

        {/* Next arrow */}
        <button
          onClick={next}
          aria-label="Next photo"
          className="carousel-arrow carousel-arrow-right"
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "80px",
            zIndex: 10,
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="#ede8e3"
            strokeWidth="1"
          >
            <path d="M7 3L14 10L7 17" />
          </svg>
        </button>
      </div>

      {/* Meta bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem 2rem",
          borderBottom: "1px solid #1c1c1c",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            fontSize: "0.6rem",
            fontWeight: 300,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#c8a96e",
          }}
        >
          {categoryLabels[photo.category]}
        </span>

        {/* Progress bar */}
        <div
          style={{
            flex: 1,
            height: "1px",
            background: "#1c1c1c",
            margin: "0 2rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              background: "#c8a96e",
              width: `${((visibleIndex + 1) / total) * 100}%`,
              transition: "width 0.4s cubic-bezier(0.16,1,0.3,1)",
            }}
          />
        </div>

        {/* Keyboard hint */}
        <span
          style={{
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            fontSize: "0.6rem",
            fontWeight: 300,
            letterSpacing: "0.15em",
            color: "#6b6460",
          }}
          className="carousel-keyboard-hint"
        >
          Swipe / ← →
        </span>
      </div>

      <style>{`
        .carousel-image {
          animation: carouselFade 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes carouselFade {
          from { opacity: 0; transform: scale(1.015); }
          to   { opacity: 1; transform: scale(1); }
        }
        .carousel-arrow {
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .carousel-arrow svg {
          filter: drop-shadow(0 0 8px rgba(0,0,0,0.8));
        }
        section:hover .carousel-arrow { opacity: 1; }
        @media (hover: none) {
          .carousel-arrow { opacity: 1; }
          .carousel-keyboard-hint { display: none; }
        }
        @media (max-width: 640px) {
          .carousel-keyboard-hint { display: none; }
        }
      `}</style>
    </section>
  );
}
