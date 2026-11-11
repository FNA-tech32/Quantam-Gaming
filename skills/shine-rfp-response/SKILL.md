---
name: shine-rfp-response
description: "Draft a response to an RFP — requirements matrix, tailored narrative, pricing, timeline."
argument-hint: "<path to RFP>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Parse the RFP. Produce: requirements-vs-capability matrix, tailored executive summary, per-section answers (referencing past case studies from memory), pricing with 15% discount option, realistic timeline, team CVs placeholders, compliance section.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
