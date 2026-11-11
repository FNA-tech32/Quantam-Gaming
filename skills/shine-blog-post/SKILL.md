---
name: shine-blog-post
description: "Draft a long-form blog post (900–1500 words) with SEO front-matter, H-tree, FAQ, and JSON-LD."
argument-hint: "<topic> | <primary keyword>"
allowed-tools:
  - Read
  - Write
  - Glob
  - WebFetch
  - AskUserQuestion
---

<objective>
Research the primary keyword (Ahrefs MCP if available, else WebFetch top SERP). Produce an outline first, confirm with user, then write. Include: title, slug, meta description, H2/H3 tree, intro, sections, FAQ (3-5 Q/A), conclusion with CTA, JSON-LD Article schema. Output as a single Markdown file.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
