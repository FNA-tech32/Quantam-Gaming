---
name: shine-exec-summary
description: "Compress a long document into a 1-page executive summary — decision-ready."
argument-hint: "<path to document>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Read the source. Produce: TL;DR (3 sentences), Context (2 sentences), Options (bullets), Recommendation + rationale (2 sentences), Decisions needed, Risks, Next steps. Total: under 1 page. Cite page/section numbers for every claim.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
