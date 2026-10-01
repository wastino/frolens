import Link from "next/link";
import { readdirSync, readFileSync } from "fs";
import path from "path";
import { createPost, deletePost } from "./actions";

export const dynamic = "force-dynamic";

const contentDir = path.join(process.cwd(), "content", "blog");

function parsePost(filePath: string) {
  const raw = readFileSync(filePath, "utf8");
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) return null;

  const [, frontmatterRaw] = match;
  const frontmatter = Object.fromEntries(
    frontmatterRaw
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [key, ...rest] = line.split(":");
        return [key.trim(), rest.join(":").trim()];
      })
  );

  return {
    slug: frontmatter.slug,
    title: frontmatter.title,
    excerpt: frontmatter.excerpt,
    date: frontmatter.date,
    category: frontmatter.category,
    readTime: frontmatter.readTime,
    image: frontmatter.image || "",
  };
}

export default function AdminBlogPage() {
  const files = readdirSync(contentDir).filter((file) => file.endsWith(".md"));
  const posts = files
    .map((file) => parsePost(path.join(contentDir, file)))
    .filter((post): post is NonNullable<typeof post> => Boolean(post));

  return (
    <main style={{ minHeight: "100vh", background: "#080808", color: "#ede8e3", padding: "3rem 2rem 6rem" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#c8a96e", marginBottom: "1rem" }}>
            Admin
          </p>
          <h1 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(2rem, 3.2vw, 2.8rem)", fontWeight: 300, marginBottom: "0.75rem" }}>
            Blog manager
          </h1>
          <p style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "0.95rem", color: "#6b6460", lineHeight: 1.8, maxWidth: "700px" }}>
            Create a new article or remove one from the public blog. Each post is stored as a markdown file in the project.
          </p>
        </div>

        <form action={createPost} style={{ border: "1px solid #1c1c1c", padding: "1.25rem", marginBottom: "2rem", background: "rgba(255,255,255,0.02)" }}>
          <label style={{ display: "block", fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c8a96e", marginBottom: "0.6rem" }}>
            Create a new article
          </label>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <input name="slug" placeholder="slug-name" style={{ flex: "1 1 220px", padding: "0.7rem 0.8rem", background: "#080808", border: "1px solid #1c1c1c", color: "#ede8e3", fontFamily: "var(--font-inter), system-ui, sans-serif" }} />
            <button type="submit" style={{ padding: "0.7rem 1rem", border: "1px solid #c8a96e", background: "#c8a96e", color: "#080808", fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}>
              Create post
            </button>
          </div>
        </form>

        <div style={{ display: "grid", gap: "1rem" }}>
          {posts.map((post) => (
            <div key={post.slug} style={{ border: "1px solid #1c1c1c", padding: "1rem 1.2rem", background: "rgba(255,255,255,0.02)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "0.62rem", letterSpacing: "0.24em", textTransform: "uppercase", color: "#c8a96e", marginBottom: "0.35rem" }}>
                    {post.category}
                  </p>
                  <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1.25rem", fontWeight: 300, color: "#ede8e3" }}>
                    {post.title}
                  </h2>
                </div>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <Link href={`/blog/${post.slug}`} style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#ede8e3", textDecoration: "none", borderBottom: "1px solid #c8a96e", paddingBottom: "0.15rem" }}>
                    View
                  </Link>
                  <form action={deletePost}>
                    <input type="hidden" name="slug" value={post.slug} />
                    <button type="submit" style={{ padding: "0.55rem 0.8rem", border: "1px solid #3a1a1a", color: "#c05050", background: "transparent", fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}>
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
