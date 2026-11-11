---
name: shine-compliance-ai
description: "Generate AI-use policy + DPIA skeleton for a client, based on ai-compliance-framework templates."
argument-hint: "<client name + usage scope>"
allowed-tools:
  - Read
  - Write
  - Glob
---

<objective>
Pull templates from [ai-compliance-framework](https://github.com/diShine-digital-agency/ai-compliance-framework) and produce:

1. **AUP** (Acceptable Use Policy) tailored to the client's sector.
2. **DPIA** skeleton (Data Protection Impact Assessment) pre-filled with generic risks, flagged for legal review.
3. **Vendor audit checklist** for any LLM provider the client considers.
4. **Decision matrix** (EU AI Act tiering: minimal / limited / high / unacceptable).

Output: 4 markdown files in `~/Downloads/compliance-<client>-<date>/`.
</objective>

<guardrails>
- Every generated document ends with: _"This draft is not legal advice. Validate with counsel before publication."_
</guardrails>
