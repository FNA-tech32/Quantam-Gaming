---
name: shine-competitor-analysis
description: "Produce a competitor map — positioning, pricing, differentiation, weakness, how we win."
argument-hint: "<market or product category>"
allowed-tools:
  - Read
  - Write
  - Glob
  - WebFetch
  - AskUserQuestion
---

<objective>
Research 3-5 competitors via WebFetch + Ahrefs (if available). Per competitor: tagline, pricing tier(s), core differentiator, perceived weakness, our angle to beat them. Output a comparison table + a 3-sentence "how we win" summary. All claims sourced from fetched pages only.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
