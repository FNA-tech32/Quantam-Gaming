---
name: shine-learning-loop
description: "Capture a learning into a reusable memory entry — preference, style, or external reference."
argument-hint: "<what you just learned>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Classify the learning: preference / client-specific / project-specific / style / external. Write a new `~/.claude/memory/<type>-<slug>.md` with proper frontmatter. Append an entry to MEMORY.md index. Confirm before writing.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
