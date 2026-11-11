---
name: shine-okr-draft
description: "Draft quarterly OKRs — 3 objectives × 3 key results, measurable, ambitious, aligned."
argument-hint: "<team/company>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Each Objective: qualitative + inspiring. Each KR: quantitative + time-boxed + verifiable. Check: KRs are outcomes (not tasks), 70% confidence level, aligned to the level above. Flag any KR that's really a task.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
