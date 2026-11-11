---
name: shine-vendor-onboarding
description: "Vendor due-diligence checklist — security, privacy, SLA, pricing, exit clause."
argument-hint: "<vendor>"
allowed-tools:
  - Read
  - Write
  - Glob
  - WebFetch
  - AskUserQuestion
---

<objective>
Research the vendor (website, G2, trust center). Produce: security posture (SOC2/ISO), data residency, GDPR DPA availability, sub-processors, SLA terms, pricing tiers, cancellation/exit terms, integration fit. Flag gaps needing follow-up.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
