---
name: shine-tech-spec
description: "Write a technical spec — problem, goals, non-goals, design, alternatives, rollout, risks."
argument-hint: "<feature or system>"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
---

<objective>
Standard SHINE tech spec structure: Problem, Goals, Non-goals, Proposed design (with sequence/ER diagrams if relevant), Alternatives considered, Rollout plan (migration, feature flags, monitoring), Risks + mitigations, Open questions. Use Serena + Context7 for grounded technical choices.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
