---
name: shine-cold-email
description: "Draft a compliant cold email — personalized hook, value line, soft CTA, P.S. — never auto-send."
argument-hint: "<target company/person> | <angle>"
allowed-tools:
  - Read
  - Write
  - Glob
  - WebFetch
  - AskUserQuestion
---

<objective>
Research the target (WebFetch LinkedIn / website). Produce 3 subject line variants (<40 char), 1-line hook grounded in a real public fact, 2-line value proposition, soft-CTA, P.S. with social proof. Follow CAN-SPAM + GDPR: include physical address + unsubscribe. Output as .eml template.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
