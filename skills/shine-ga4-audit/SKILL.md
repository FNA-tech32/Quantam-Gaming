---
name: shine-ga4-audit
description: "Audit a GA4 property — events, conversions, data retention, PII, consent, filters."
argument-hint: "<GA4 property access>"
allowed-tools:
  - Read
  - Write
  - Glob
  - WebFetch
  - AskUserQuestion
---

<objective>
Checklist-driven audit: event naming convention, recommended vs custom events, conversion setup, consent mode v2, IP anonymization, PII in parameters, data retention (14m+), filters (internal traffic, dev), cross-domain, referral exclusions, BigQuery export. Score + remediation plan.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
