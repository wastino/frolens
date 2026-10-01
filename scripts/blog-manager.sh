#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CONTENT_DIR="$ROOT/content/blog"

case "${1:-help}" in
  new)
    if [ -z "${2:-}" ]; then
      echo "Usage: ./scripts/blog-manager.sh new <slug>"
      exit 1
    fi
    slug="$2"
    file="$CONTENT_DIR/$slug.md"
    if [ -f "$file" ]; then
      echo "Post already exists: $file"
      exit 1
    fi
    cat > "$file" <<EOF
---
title: New post title
excerpt: Add a short summary here.
date: $(date +%F)
category: Journal
readTime: 3 min read
slug: $slug
image: https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1400&q=80
---

Write your article here. Each paragraph will appear as a new paragraph on the post page.
EOF
    echo "Created $file"
    ;;
  delete)
    if [ -z "${2:-}" ]; then
      echo "Usage: ./scripts/blog-manager.sh delete <slug>"
      exit 1
    fi
    file="$CONTENT_DIR/$2.md"
    if [ -f "$file" ]; then
      rm "$file"
      echo "Deleted $file"
    else
      echo "Post not found: $file"
      exit 1
    fi
    ;;
  help|--help|-h)
    echo "Usage:"
    echo "  ./scripts/blog-manager.sh new <slug>"
    echo "  ./scripts/blog-manager.sh delete <slug>"
    echo ""
    echo "Example:"
    echo "  ./scripts/blog-manager.sh new spring-portraits"
    ;;
  *)
    echo "Unknown command: $1"
    exit 1
    ;;
esac
