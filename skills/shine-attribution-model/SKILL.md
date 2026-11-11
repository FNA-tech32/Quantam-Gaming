---
name: shine-attribution-model
description: "Choose and configure an attribution model — goals, channels, tooling, limitations."
argument-hint: "<business model>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Recommend a model (last-click / linear / data-driven / MMM) based on business type, sales cycle, channel mix. Document limitations, data requirements, tooling (GA4 / Triple Whale / custom). Include post-iOS14 and cookieless considerations.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
