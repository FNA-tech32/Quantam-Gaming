---
name: shine-pricing-page
description: "Draft pricing page copy — tiers, inclusions, feature table, FAQ, call-to-action."
argument-hint: "<product>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Produce 3 tiers by default (Starter / Growth / Scale) with clear differentiation. Feature table with ✓ / — / tier-only cells. FAQ of 5 objection-handling Q/A. Anchor price on value, not cost. Include 15%-off annual option.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
