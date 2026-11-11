---
name: shine-sales-call-prep
description: "Prepare for a sales call — attendee research, agenda, killer questions, likely objections."
argument-hint: "<company> | <attendees>"
allowed-tools:
  - Read
  - Write
  - Glob
  - WebFetch
  - AskUserQuestion
---

<objective>
Research attendees (LinkedIn, company blog). Produce: 1-page briefing with company facts (sourced), attendee bios (sourced), 30-min agenda, 8 killer discovery questions, 5 likely objections + responses, suggested next step.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
