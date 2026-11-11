---
name: shine-swot
description: "Facilitate a SWOT — strengths, weaknesses, opportunities, threats — with prioritization."
argument-hint: "<company/project>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Ask 3 questions per quadrant. Produce a 2x2 grid + a "so what" section linking each S/W/O/T to one concrete action. Rank actions by impact × feasibility.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
