---
name: shine-dashboard-spec
description: "Specify a BI dashboard — audience, KPIs, filters, cadence, data sources."
argument-hint: "<audience or use case>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Produce a dashboard spec: Audience, Decision the dashboard supports, KPIs (leading + lagging), Dimensions/filters, Refresh cadence, Data sources, Metric definitions, Known caveats. Tool-agnostic (Looker / Metabase / Tableau).
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
