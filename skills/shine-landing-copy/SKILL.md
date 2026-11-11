---
name: shine-landing-copy
description: "Write a conversion-focused landing page — hero, value prop, social proof, objections, CTA."
argument-hint: "<product/offer> | <target persona>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Apply the ALIGN methodology (Assess → Link → Integrate → Generate → Navigate) from diShine's align-framework. Sections: hero (headline, sub, CTA), problem, solution, 3-benefit grid, social proof, objection handling, pricing teaser, final CTA. Output copy + a wireframe comment per section.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
