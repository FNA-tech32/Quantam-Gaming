---
name: shine-logo-brief
description: "Write a designer brief for a logo — concept, references, constraints, deliverables."
argument-hint: "<brand>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Structure: brand essence (3 adjectives), target audience, competitors' visual territory, inspiration references (Pinterest/Dribbble/sites), constraints (colors to use/avoid, wordmark vs symbol), deliverables (formats, sizes), timeline, budget range.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
