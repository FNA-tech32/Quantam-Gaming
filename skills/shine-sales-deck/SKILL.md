---
name: shine-sales-deck
description: "Structure a sales deck — problem, solution, differentiation, proof, pricing, close."
argument-hint: "<product/offer> | <audience>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Produce a 10-slide outline with speaker notes per slide. Order: Cover, Problem, Cost of inaction, Solution, How it works, Differentiation, Proof (clients/metrics), Pricing options (incl. 15% discount), Process, Next step. Output as Markdown — user can paste into Keynote/Slides/Gamma.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
