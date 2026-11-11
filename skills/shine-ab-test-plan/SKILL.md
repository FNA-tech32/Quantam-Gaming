---
name: shine-ab-test-plan
description: "Design an A/B test — hypothesis, metric, MDE, sample size, duration, guardrails."
argument-hint: "<test idea>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Produce: Hypothesis (IF change THEN metric BECAUSE mechanism), primary metric + guardrails, baseline, MDE, sample size (frequentist power calc), duration, decision rule, rollout plan. Include a segment analysis plan.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
