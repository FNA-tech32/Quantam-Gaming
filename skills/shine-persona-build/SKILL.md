---
name: shine-persona-build
description: "Build a buyer persona — role, jobs-to-be-done, pains, gains, objections, where they hang out."
argument-hint: "<persona role/title>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Ask the user or retrieve from research. Structure: role + seniority, 3 JTBD, top 3 pains, top 3 gains, top 3 objections, buying committee relationships, where they consume content (publications, podcasts, communities), preferred outreach channel. Output 1-pager.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
