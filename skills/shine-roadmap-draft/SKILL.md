---
name: shine-roadmap-draft
description: "Sketch a product or engagement roadmap — Now / Next / Later, with assumptions."
argument-hint: "<product or engagement>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Produce: Now (next 6 weeks, high confidence), Next (6-12 weeks, medium confidence), Later (quarter+, exploratory). Per item: problem it solves, success metric, open questions, dependencies. Tag every speculative item `[assumption]`.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
