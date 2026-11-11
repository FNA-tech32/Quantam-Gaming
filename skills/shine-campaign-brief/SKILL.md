---
name: shine-campaign-brief
description: "Write a campaign brief — objective, audience, message, channels, KPIs, budget, timeline."
argument-hint: "<campaign name>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
One-page brief aligned to your agency's conventions: Objective (measurable), Audience (persona + ICP), Message (value prop + CTA), Channels (with rationale), KPIs (leading + lagging), Budget (range), Timeline (Gantt-ready list), Dependencies, Risks.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
