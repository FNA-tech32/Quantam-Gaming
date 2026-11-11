---
name: shine-brand-voice
description: "Define or audit brand voice — tone axes, do/don't examples, voice against samples."
argument-hint: "<brand>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Ask for existing samples or audit competitors. Produce: 4 tone axes (formal/casual, serious/playful, technical/accessible, reserved/bold) with positions; 10 do / 10 don't examples; 3 sample rewrites of the same sentence in-voice.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
