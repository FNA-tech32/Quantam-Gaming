---
name: shine-naming
description: "Generate product / feature / company names — brief, 20 candidates, shortlist rationale."
argument-hint: "<what to name> | <constraints>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Ask for brief: what it is, what it evokes, dos/don'ts, language constraints, TLD/handle needs. Produce 20 candidates across 5 naming patterns (evocative, descriptive, founder, compound, coined). Shortlist 3 with rationale. Flag any obvious trademark/TLD collision to verify.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
