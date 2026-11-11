---
name: shine-webinar-plan
description: "Plan a webinar — topic, audience, agenda, promotion plan, follow-up sequence."
argument-hint: "<topic> | <date>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Produce: audience definition, agenda (5 slots, 45-60 min), speaker prep doc, promotion timeline (T-4w to T-1d), landing page copy, 3-email follow-up sequence for attendees vs no-shows.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
