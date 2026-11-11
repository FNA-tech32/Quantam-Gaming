---
name: shine-value-prop
description: "Crystallize a value proposition — job-to-be-done, pains, gains, unique mechanism, proof."
argument-hint: "<product or service>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Walk the user through a Value Proposition Canvas. Ask 6 questions. Produce a one-page VPC + a 1-sentence elevator statement + a social-post hook version.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
