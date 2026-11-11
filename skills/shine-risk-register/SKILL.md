---
name: shine-risk-register
description: "Build a risk register — probability × impact, mitigations, owners, review cadence."
argument-hint: "<project>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Ask for the top 10 risks. Per risk: likelihood (1-5), impact (1-5), score, mitigation plan, contingency, owner, review date. Output as sortable Markdown table. Flag any score ≥ 15 for escalation.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
