---
name: shine-icp-define
description: "Define an Ideal Customer Profile — firmographics, triggers, no-go list, scoring rubric."
argument-hint: "<product>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Ask 8 questions. Produce: firmographic filters (industry, size, geo, tech stack), trigger signals (hiring, funding, regulation), disqualifiers, scoring rubric (0-100), 3 example accounts that fit perfectly.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
