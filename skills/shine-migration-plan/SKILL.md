---
name: shine-migration-plan
description: "Plan a technical migration — inventory, target, strategy, phases, cutover, rollback."
argument-hint: "<from> -> <to>"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
---

<objective>
Produce: inventory of current state (via Serena + scanning), target state, migration strategy (strangler / big-bang / parallel-run), phased plan with validation gates, cutover checklist, rollback procedure, communication plan.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
