---
name: shine-roi-estimate
description: "Estimate ROI of an automation / process change — baseline hours, saved hours, break-even, payback period."
argument-hint: "<describe the process + current time cost>"
allowed-tools:
  - Read
  - AskUserQuestion
---

<objective>
Produce a transparent ROI estimate (FlowAudit-style):

1. Ask for baseline: hours/week spent, fully-loaded hourly cost.
2. Ask for automation candidate: tool stack, implementation effort (MD), recurring cost.
3. Compute: annual hours saved, annual € saved, break-even month, 3-year NPV.
4. Output a short markdown table + 2-sentence recommendation.

Every assumption is labeled `[assumption]`. The user must confirm before you finalize.
</objective>

<guardrails>
- No made-up benchmark numbers ("industry average X"). If the user has no baseline, say so and stop.
</guardrails>
