---
name: shine-capacity-plan
description: "Project-team capacity for the next N weeks — commitments vs availability, conflict flags."
argument-hint: "<N weeks>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Ask for team size, standard availability per person (h/week), current commitments. Produce: stacked-bar view (Markdown table), overbooked-person flags, slack percentage, suggested reshuffles.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
