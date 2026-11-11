---
name: shine-change-plan
description: "Draft a change management plan — Kotter 8-step or ADKAR, tailored to the change scope."
argument-hint: "<change description>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Choose framework based on scope: ADKAR for individual/team, Kotter 8 for org-wide. Produce: stakeholder impact analysis, communication plan, training needs, resistance management, success metrics, 90-day cadence.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
