---
name: shine-linkedin-dm
description: "Draft a LinkedIn connection + follow-up DM sequence — human, short, non-salesy."
argument-hint: "<target profile URL or description>"
allowed-tools:
  - Read
  - Write
  - Glob
  - WebFetch
  - AskUserQuestion
---

<objective>
Produce: (1) connection note ≤300 chars with a real, researched reason to connect; (2) follow-up 1 (day 3): light value share, no ask; (3) follow-up 2 (day 10): soft ask for 15-min call. No templated phrases. Every sentence must be genuinely personalized or removed.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
