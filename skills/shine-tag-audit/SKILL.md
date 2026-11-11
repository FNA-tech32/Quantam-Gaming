---
name: shine-tag-audit
description: "Analyze a GTM container export via tag-auditor — 14 governance/consent/security checks."
argument-hint: "<path to GTM JSON export>"
allowed-tools:
  - Read
  - Bash
---

<objective>
Dispatch to [tag-auditor](https://github.com/diShine-digital-agency/tag-auditor):

1. Validate the JSON export.
2. Run all 14 checks (unused tags, naming violations, missing consent, security risks, performance).
3. Produce a Markdown report with: overall score, critical issues, remediation steps, effort estimate.
4. Offer to draft a client-facing summary email (fires `/shine-draft-email`).
</objective>
