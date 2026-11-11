---
name: shine-lead-enrich
description: "Run the @lead-enrichment pattern — local scripts first, Apollo/Hunter/Apify supplement, inferred emails labeled."
argument-hint: "<company or list of companies>"
allowed-tools:
  - Read
  - Write
  - Bash
  - WebFetch
  - Glob
---

<objective>
Apply CLAUDE.md Rule #20:

1. **Try local scripts first** — e.g. `your-contact-extractor/contact_extractor.py`. These are cheapest and most deterministic.
2. **Supplement** with Apollo.io (via MCP if connected), Hunter.io, or Apify LinkedIn scraper.
3. **Output a structured table** (CSV or Markdown) with columns: `company, name, role, email, source, confidence`.
4. **Label inferred emails explicitly** — any `{first}.{last}@domain` guess must carry `inferred pattern — not verified` in the `source` field.
5. **GDPR guard** — if the target list contains EU personal data, confirm legal basis before scraping.
</objective>

<guardrails>
- Never merge verified + inferred contacts in the same column without the label.
- If a connector returns zero results, say so. Do not pad with memory-based guesses.
- Output path: `~/Downloads/leads-<slug>-<date>.csv`.
</guardrails>
