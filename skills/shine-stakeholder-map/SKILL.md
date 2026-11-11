---
name: shine-stakeholder-map
description: "Map stakeholders — interest × influence, with engagement strategy per quadrant."
argument-hint: "<project>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Ask for the list. Produce a 2x2 grid (High/Low interest × High/Low influence). Per quadrant: engagement cadence (weekly/monthly/on-demand), format (1:1 / update email / nothing). Output table + a personalized comms plan.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
