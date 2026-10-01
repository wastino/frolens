"use server";

import { readdirSync, writeFileSync, unlinkSync, existsSync } from "fs";
import path from "path";
import { redirect } from "next/navigation";

const contentDir = path.join(process.cwd(), "content", "blog");

export async function createPost(formData: FormData) {
  const slug = String(formData.get("slug") || "").trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-");
  if (!slug) throw new Error("Slug is required");
  const filePath = path.join(contentDir, `${slug}.md`);
  if (existsSync(filePath)) throw new Error("That slug already exists");

  const content = `---
title: New post title
excerpt: Add a short summary here.
date: ${new Date().toISOString().slice(0, 10)}
category: Journal
readTime: 3 min read
slug: ${slug}
image: https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1400&q=80
---

Write your article here. Each paragraph will appear as its own paragraph on the post page.
`;

  writeFileSync(filePath, content, "utf8");
  redirect("/admin/blog");
}

export async function deletePost(formData: FormData) {
  const slug = String(formData.get("slug") || "").trim();
  const filePath = path.join(contentDir, `${slug}.md`);
  if (existsSync(filePath)) unlinkSync(filePath);
  redirect("/admin/blog");
}
