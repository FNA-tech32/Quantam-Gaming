---
name: shine-discovery-doc
description: "Post-discovery synthesis — context, pains, options, recommended path, MD estimate."
argument-hint: "<client>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
After discovery, produce: 1-page summary of what we heard, identified pains (ranked), 2-3 solution options with tradeoffs, recommended path, rough MD estimate, open questions needing client confirmation. Tone: advisory, not salesy.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
