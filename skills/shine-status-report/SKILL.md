---
name: shine-status-report
description: "Produce a weekly client-facing status report — done / in progress / next / risks / asks."
argument-hint: "<client name> [--internal]"
allowed-tools:
  - Read
  - Glob
  - WebFetch
  - Write
---

<objective>
Build a weekly update the account manager can forward with zero edits:

1. Pull from Asana (tasks closed this week, active, blocked).
2. Pull from recent emails on the client label.
3. Pull from session memory (decisions, delivered assets).
4. Structure: **Done** / **In progress** / **Next week** / **Risks** / **Asks**.
5. Tone: client language, warm but concise. With `--internal` flag, produce a terser version for Slack/Asana internal consumption.
</objective>

<guardrails>
- Facts only. If Asana or email aren't accessible, say so in the output — don't synthesize.
- Never include financial numbers unless they're in the retrieved sources.
</guardrails>
