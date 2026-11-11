---
name: shine-test-strategy
description: "Design a test strategy — pyramid, coverage targets, fixtures, CI gates."
argument-hint: "<project>"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
---

<objective>
Produce: test pyramid (unit/integration/e2e split with %), coverage targets per layer, fixture strategy, flaky-test policy, CI gates (what blocks merge vs warn), tooling choices with rationale.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
