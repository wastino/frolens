import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Frolens by Winston",
  description: "Read journal entries, field notes, and reflections from the studio and the street.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <Nav />
      <main style={{ paddingTop: "6rem", minHeight: "100vh", background: "#080808" }}>
        <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 2rem 6rem" }}>
          <div style={{ marginBottom: "3.2rem", maxWidth: "780px" }}>
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
              Journal
            </p>
            <h1
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
                fontWeight: 300,
                lineHeight: 1.05,
                color: "#ede8e3",
                marginBottom: "1rem",
              }}
            >
              Essays, notes, and stories behind the work.
            </h1>
            <p
              style={{
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                fontSize: "0.95rem",
                lineHeight: 1.8,
                color: "#6b6460",
              }}
            >
              This space is for longer reflections, project notes, and the small moments that shape the photography.
            </p>
          </div>

          <div style={{ display: "grid", gap: "1.2rem" }}>
            {posts.map((post) => (
              <article
                key={post.slug}
                style={{
                  border: "1px solid #1c1c1c",
                  padding: "1.7rem",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.015) 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
                }}
              >
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    style={{ width: "100%", maxHeight: "300px", objectFit: "cover", marginBottom: "1rem", border: "1px solid #1c1c1c", filter: "saturate(0.9)" }}
                  />
                ) : null}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.9rem", marginBottom: "0.8rem" }}>
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

                <h2
                  style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontSize: "clamp(1.4rem, 2.4vw, 1.9rem)",
                    fontWeight: 300,
                    color: "#ede8e3",
                    marginBottom: "0.75rem",
                  }}
                >
                  {post.title}
                </h2>

                <p
                  style={{
                    fontFamily: "var(--font-inter), system-ui, sans-serif",
                    fontSize: "0.95rem",
                    lineHeight: 1.8,
                    color: "#6b6460",
                    marginBottom: "1rem",
                  }}
                >
                  {post.excerpt}
                </p>

                <Link
                  href={`/blog/${post.slug}`}
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
                  Read article
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
