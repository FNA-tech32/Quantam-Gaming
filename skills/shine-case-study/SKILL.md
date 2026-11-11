---
name: shine-case-study
description: "Assemble a client case study — challenge, approach, solution, results, quote, visual brief."
argument-hint: "<client name> | <engagement>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Retrieve engagement context from memory + retrospective notes. Structure: 1-line TL;DR, Challenge, Approach, Solution, Results (metrics only if sourced), Client quote (to collect), Tech stack, Team. Flag every unsourced metric as `[to verify with client]`.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
