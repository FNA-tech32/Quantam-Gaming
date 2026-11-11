---
name: shine-weekly-plan
description: "Plan the week from open commitments — priorities, time blocks, risks."
argument-hint: ""
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Pull open tasks from Asana + sessions memory. Produce: Monday 1-pager with Top 3 priorities, time blocks per day, meetings, risks/blockers, deferred items. Align to SHINE cadence.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
