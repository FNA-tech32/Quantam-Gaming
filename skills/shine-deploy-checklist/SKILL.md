---
name: shine-deploy-checklist
description: "Pre-deploy checklist — tests, migrations, feature flags, rollback, monitoring, comms."
argument-hint: "<service/release>"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
---

<objective>
Produce a staged checklist: pre-flight (tests, migrations dry-run, dependency freeze), deploy (feature flag off, canary %, observability dashboards up), post-deploy (smoke tests, error rate, latency p95, rollback trigger criteria), comms (status page, user email if needed).
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
