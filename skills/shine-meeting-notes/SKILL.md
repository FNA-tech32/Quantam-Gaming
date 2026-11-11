---
name: shine-meeting-notes
description: "Structure meeting notes — attendees, decisions, action items, open questions."
argument-hint: "<paste notes or transcript>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
From raw input, extract: Date, Attendees, Agenda, Decisions (with rationale), Action items (owner + due date + acceptance criteria), Open questions, Next meeting. Output as Markdown. Never invent owners or dates — ask.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
