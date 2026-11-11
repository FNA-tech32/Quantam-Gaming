---
name: shine-web-research
description: "Deep web research using tiered search — SearXNG (free) → Brave/Tavily (ask) → Perplexity (approve). Every claim grounded in a cited, fetched source."
argument-hint: "<topic, question, or URL>"
allowed-tools:
  - Read
  - Write
  - Bash
  - WebFetch
---

<objective>
Perform multi-source web research on the given topic using the tiered fallback strategy (CLAUDE.md §21):

1. **Check available search MCPs** — inventory what's connected.
2. **Tier 1 (free, use immediately):** `searxng` → `fetch` → `puppeteer` → Playwright.
3. **Tier 2 (freemium, ASK first):** `brave-search`, `tavily`, `rag-web-browser`.
4. **Tier 3 (paid, REQUIRE approval):** Perplexity, Exa, Firecrawl.
5. **No MCPs?** Ask user to paste content or install: `claude mcp add searxng --command "npx -y @ihor-sokoliuk/mcp-searxng"`

Decompose the question into 3–5 sub-queries, execute, cross-reference across 2+ sources, and produce a structured research brief.

Output: 5-section report — Summary (with confidence tiers: 🟢 multi-source / 🟡 single / 🔴 unverified), Details (cited), Sources (URL + timestamp), Open questions, Next step.
</objective>

<guardrails>
- Every claim must have a [Source: URL, date] tag (CLAUDE.md §16).
- Never silently call a paid API (CLAUDE.md §21).
- Label unverified claims as _"inferred — not verified"_.
- If search returns nothing, say so — never fabricate.
</guardrails>
