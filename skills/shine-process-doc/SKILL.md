---
name: shine-process-doc
description: "Document a repeatable process — trigger, steps, tools, owner, SLA, exit criteria."
argument-hint: "<process name>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Produce a 1-page SOP: Trigger, Preconditions, Steps (numbered, with tool per step), Decision points, Owner(s), SLA, Exit criteria, Failure modes. Link to relevant SHINE skills that automate steps.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
