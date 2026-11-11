---
name: shine-discovery-call
description: "Run a 45-min discovery call structure — context, pain, impact, capacity, next step."
argument-hint: "<client name>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Produce a discovery script: 5-min intro, 15-min context/pain mapping, 10-min impact quantification, 5-min capacity/budget screen, 5-min next-step alignment, 5-min buffer. Include 12 open questions, not 12 yes/no.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
