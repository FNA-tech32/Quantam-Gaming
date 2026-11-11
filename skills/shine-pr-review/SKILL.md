---
name: shine-pr-review
description: "Review a pull request — correctness, security, readability, test coverage, blast radius."
argument-hint: "<PR URL or local branch>"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
---

<objective>
Use code-review-graph `detect_changes` + `get_impact_radius` if available, else Serena `find_referencing_symbols`. Produce structured feedback: Blocking, Non-blocking, Nitpick, Praise. End with a merge recommendation.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
