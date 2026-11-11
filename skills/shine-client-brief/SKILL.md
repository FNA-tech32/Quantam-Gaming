---
name: shine-client-brief
description: "Produce a 1-page briefing on a client before a meeting — pulls context from memory + last emails + Asana."
argument-hint: "<client name>"
allowed-tools:
  - Read
  - Glob
  - WebFetch
  - Bash
---

<objective>
Generate a meeting-prep briefing in under 1 page:

1. **Context from memory** — `~/.claude/memory/client-<slug>.md`: contacts, budget, CRM, open items.
2. **Recent email thread** — last 5 messages on the client label (via Gmail connector if available).
3. **Asana status** — active tasks, blockers, last update.
4. **Talking points** — 3–5 bullets prioritised by urgency.
5. **Risk flags** — historical tensions (if noted in memory), open escalations, overdue items.

Output: a concise Markdown cheatsheet with headings Contact / Budget / Open items / Talking points / Risks.
</objective>

<guardrails>
- Only include facts that come from the retrieved sources. Any gap → write `_unknown — ask client_`.
- If no client memory exists, prompt to create one and abort.
</guardrails>
