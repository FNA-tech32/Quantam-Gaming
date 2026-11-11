---
name: shine-design-crit
description: "Structured design critique — hierarchy, legibility, consistency, accessibility, brand fit."
argument-hint: "<design artifact>"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
---

<objective>
Use ui-ux-pro-max if available. Score on: hierarchy, legibility (contrast ratios), consistency (spacing/type/color tokens), accessibility (WCAG AA), brand fit. Output: blocking issues, improvements, praise. Non-blocking suggestions clearly separated.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
