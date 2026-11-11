---
name: shine-digital-maturity
description: "Run the diShine digital maturity scorecard — 5 dimensions, personalized roadmap."
argument-hint: "<client>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Dispatch to diShine's [digital-maturity-scorecard](https://github.com/diShine-digital-agency/digital-maturity-scorecard). Walk the user through 5 dimensions (strategy, data, tools, culture, customer). Output the radar chart data + a personalized 3-phase roadmap (S/H/I/N/E-aligned).
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
