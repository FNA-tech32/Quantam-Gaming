---
name: shine-translate
description: "Translate content between IT / EN / FR / ES — preserving voice, terminology, CTAs."
argument-hint: "<path or paste> | <target lang>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Read the source. Translate preserving: brand voice (check memory), terminology consistency (glossary-aware), CTA impact, cultural nuances. Flag idioms that don't translate cleanly — offer alternatives. Output side-by-side Markdown.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
