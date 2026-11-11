---
name: shine-incident-report
description: "Write a blameless post-mortem — timeline, impact, root cause, action items."
argument-hint: "<incident>"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
---

<objective>
Structure: Summary (1 paragraph), Impact (users, revenue, SLOs), Timeline (UTC, minute precision), Root cause (5-whys), Contributing factors, What went well, What didn't, Action items (owner + due date). Tone: blameless, systemic.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
