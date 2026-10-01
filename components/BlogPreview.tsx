import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export default function BlogPreview() {
  const posts = getAllPosts().slice(0, 2);

  return (
    <section
      id="blog"
      style={{
        padding: "7rem 2rem 8rem",
        maxWidth: "1400px",
        margin: "0 auto",
        borderTop: "1px solid #1c1c1c",
      }}
    >
      <div style={{ marginBottom: "3rem", maxWidth: "760px" }}>
        <p
          style={{
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            fontSize: "0.65rem",
            fontWeight: 300,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#c8a96e",
            marginBottom: "1.2rem",
          }}
        >
          Journal
        </p>
        <h2
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(2.1rem, 3.8vw, 3.2rem)",
            fontWeight: 300,
            lineHeight: 1.1,
            color: "#ede8e3",
            marginBottom: "1rem",
          }}
        >
          Notes from the studio, the street, and the frame.
        </h2>
        <p
          style={{
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            fontSize: "0.95rem",
            fontWeight: 300,
            lineHeight: 1.8,
            color: "#6b6460",
          }}
        >
          A quieter companion to the photography work — a place for reflections, mood, and the stories behind the image.
        </p>
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            style={{
              display: "grid",
              gap: "0.75rem",
              padding: "1.5rem 0",
              borderBottom: "1px solid #1c1c1c",
              textDecoration: "none",
            }}
          >
            {post.image ? (
              <img
                src={post.image}
                alt={post.title}
                style={{ width: "100%", maxHeight: "260px", objectFit: "cover", border: "1px solid #1c1c1c", filter: "saturate(0.92)" }}
              />
            ) : null}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.9rem", alignItems: "center", marginTop: "0.2rem" }}>
              <span
                style={{
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                  fontSize: "0.62rem",
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "#c8a96e",
                }}
              >
                {post.category}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                  fontSize: "0.72rem",
                  color: "#4a4643",
                }}
              >
                {post.date} · {post.readTime}
              </span>
            </div>
            <h3
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "clamp(1.28rem, 2vw, 1.7rem)",
                fontWeight: 300,
                color: "#ede8e3",
                letterSpacing: "0.01em",
              }}
            >
              {post.title}
            </h3>
            <p
              style={{
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                fontSize: "0.92rem",
                lineHeight: 1.8,
                color: "#6b6460",
                maxWidth: "760px",
              }}
            >
              {post.excerpt}
            </p>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <Link
          href="/blog"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            fontSize: "0.72rem",
            fontWeight: 400,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "#ede8e3",
            textDecoration: "none",
            borderBottom: "1px solid #c8a96e",
            paddingBottom: "0.2rem",
          }}
        >
          Explore the full blog
        </Link>
      </div>
    </section>
  );
}
