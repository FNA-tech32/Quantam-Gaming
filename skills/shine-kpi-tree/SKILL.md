---
name: shine-kpi-tree
description: "Build a KPI tree — north star, driver metrics, input metrics, ownership."
argument-hint: "<business or product>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Produce a hierarchical tree: North Star metric at top, 3-5 driver metrics below, input metrics under each driver, owner + cadence per node. Mermaid diagram + narrative explaining the causal logic.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
