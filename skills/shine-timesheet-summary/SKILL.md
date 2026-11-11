---
name: shine-timesheet-summary
description: "Aggregate a week of work logs into a timesheet — by client, by phase, billable %."
argument-hint: "[--week <iso-week>]"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Scan sessions memory + Asana time logs for the week. Group by client → phase → task. Compute: total hours, billable %, overrun vs plan. Output: Markdown + CSV ready for export.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
