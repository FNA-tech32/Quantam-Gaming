---
name: shine-sales-call-debrief
description: "Turn a sales call into structured notes — BANT, next steps, objections, CRM-ready."
argument-hint: "<paste transcript or notes>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Extract and structure: attendees, Budget / Authority / Need / Timeline (BANT), pain points, competitors mentioned, objections, commitments made, clear next steps with owners + dates. Output in a format copy-pasteable into Apollo/HubSpot/Close.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
