---
name: shine-press-release
description: "Draft a press release following AP style — headline, dateline, lead, body, boilerplate, contact."
argument-hint: "<announcement>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Structure: headline (≤10 words), subhead, dateline (City, Country — Date), lead paragraph answering who/what/when/where/why, 2 body paragraphs with quotes, boilerplate, media contact block. Ask for all facts; never invent quotes or figures.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
