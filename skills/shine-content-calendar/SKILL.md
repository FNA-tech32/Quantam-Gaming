---
name: shine-content-calendar
description: "Build a monthly content calendar — themes, channels, owners, publish dates, CTA per post."
argument-hint: "<client or brand> | <month>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Produce a 4-week calendar balancing awareness / consideration / conversion content across the client's active channels (LinkedIn, IG, newsletter, blog). Pull voice rules from `~/.claude/memory/client-<slug>.md`. Output: Markdown table + ICS file ready for GCal import.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
