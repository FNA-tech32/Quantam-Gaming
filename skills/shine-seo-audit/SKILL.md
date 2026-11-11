---
name: shine-seo-audit
description: "Run a lightweight SEO audit on a URL — routes to meta-inspector + lighthouse-dashboard + SERP check."
argument-hint: "<URL>"
allowed-tools:
  - Read
  - Bash
  - WebFetch
---

<objective>
1. Run `meta-inspector` on the URL (grade meta tags, OG, Twitter cards, JSON-LD).
2. Run a Lighthouse audit (via `lighthouse-dashboard` if installed, else raw `lighthouse` CLI).
3. Optional: fetch the SERP via Ahrefs MCP (if connected) for top 3 competing URLs.
4. Output a 1-page markdown report: current score, 5 prioritized fixes, effort estimate in MD.
</objective>
