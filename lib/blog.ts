import fs from "fs";
import path from "path";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  image?: string;
  content: string[];
};

type BlogFrontmatter = {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  slug: string;
  image?: string;
};

const contentDir = path.join(process.cwd(), "content", "blog");

function parseMarkdownPost(filePath: string): BlogPost {
  const raw = fs.readFileSync(filePath, "utf8");
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);

  if (!match) {
    throw new Error(`Invalid blog post format: ${filePath}`);
  }

  const [, frontmatterRaw, body] = match;
  const frontmatter = Object.fromEntries(
    frontmatterRaw
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [key, ...rest] = line.split(":");
        return [key.trim(), rest.join(":").trim()];
      })
  ) as BlogFrontmatter;

  return {
    slug: frontmatter.slug,
    title: frontmatter.title,
    excerpt: frontmatter.excerpt,
    date: frontmatter.date,
    category: frontmatter.category,
    readTime: frontmatter.readTime,
    image: frontmatter.image,
    content: body
      .split(/\n\n+/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean),
  };
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  return fs
    .readdirSync(contentDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => parseMarkdownPost(path.join(contentDir, file)))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}
