import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import BackToJournalButton from "@/components/BackToJournalButton";
import { getPostBySlug } from "@/lib/blog";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Nav />
      <main style={{ paddingTop: "6rem", minHeight: "100vh", background: "#080808" }}>
        <section style={{ maxWidth: "920px", margin: "0 auto", padding: "3rem 2rem 6rem" }}>
          <BackToJournalButton />

          <div style={{ marginBottom: "2rem" }}>
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
              {post.category}
            </p>
            {post.image ? (
              <img
                src={post.image}
                alt={post.title}
                style={{ width: "100%", maxHeight: "460px", objectFit: "cover", marginBottom: "1.5rem", border: "1px solid #1c1c1c", filter: "saturate(0.9)" }}
              />
            ) : null}
            <h1
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 300,
                lineHeight: 1.15,
                color: "#ede8e3",
                marginBottom: "0.8rem",
              }}
            >
              {post.title}
            </h1>
            <p
              style={{
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                fontSize: "0.82rem",
                color: "#4a4643",
              }}
            >
              {post.date} · {post.readTime}
            </p>
          </div>

          <div style={{ display: "grid", gap: "1.2rem" }}>
            {post.content.map((paragraph, index) => (
              <p
                key={`${post.slug}-${index}`}
                style={{
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                  fontSize: "1rem",
                  lineHeight: 1.9,
                  color: "#6b6460",
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
