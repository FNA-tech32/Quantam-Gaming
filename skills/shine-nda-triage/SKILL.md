---
name: shine-nda-triage
description: "Triage an NDA — flag one-sided clauses, term length, jurisdiction, scope issues."
argument-hint: "<path to NDA>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Read the NDA. Flag: mutual vs one-way, term length (>5y is unusual), jurisdiction, non-solicit / non-compete hidden clauses, IP assignment, residuals, scope of confidential info. Output: green-light / redline / escalate-to-legal + suggested edits.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
