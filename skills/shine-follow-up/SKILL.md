---
name: shine-follow-up
description: "Craft the right follow-up on a dormant thread — context-aware, not annoying, with a clear out."
argument-hint: "<paste the last message in the thread>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Read the prior thread verbatim. Produce a follow-up that: acknowledges the silence without guilt, restates value in one line, adds one new reason to re-engage, offers a clear out ("tell me if not a priority"). Subject: `Re: CLIENT | Topic` or `Quick follow-up: CLIENT | Topic`.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
