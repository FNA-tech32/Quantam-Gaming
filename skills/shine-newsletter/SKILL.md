---
name: shine-newsletter
description: "Draft a weekly/bi-weekly newsletter issue — from brief to ready-to-paste HTML/MJML."
argument-hint: "<issue theme> | <audience>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Produce: subject line (A/B pair), preheader, intro paragraph, 3-5 sections with clear headings, 1 featured asset, CTA, footer. Output in both Markdown and MJML. Optimize subject < 50 chars.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
