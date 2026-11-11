---
name: shine-gdpr-audit
description: "Route a GDPR / consent / PII task through the right diShine tool BEFORE drafting. Fires CLAUDE.md Rule #18."
argument-hint: "<URL or description of what needs auditing>"
allowed-tools:
  - Read
  - Bash
  - WebFetch
  - Glob
---

<objective>
When the user mentions cookies, consent, tracking, PII, GDPR, AI Act, DPIA, or vendor due diligence, this skill:

1. **Classifies the request** into one of: `cookies` / `tags` / `ai-policy` / `pii` / `audio-confidential`.
2. **Recommends the right diShine tool**:
   - `cookies` → [cookie-audit](https://github.com/diShine-digital-agency/cookie-audit)
   - `tags` → [tag-auditor](https://github.com/diShine-digital-agency/tag-auditor)
   - `ai-policy` → [ai-compliance-framework](https://github.com/diShine-digital-agency/ai-compliance-framework)
   - `pii` → [dishine-data-safe-usb](https://github.com/diShine-digital-agency/dishine-data-safe-usb)
   - `audio-confidential` → [dishine-boardroom-ear](https://github.com/diShine-digital-agency/dishine-boardroom-ear)
3. **Offers to run the tool** (if installed locally) or to generate the exact install + run commands.
4. **Never drafts compliance text** until the audit has produced findings.
</objective>

<guardrails>
- No legal advice is generated. Output is operational: what to scan, how to interpret, what to escalate.
- If the target is an EU domain, default recommendations align with GDPR + the EU AI Act.
</guardrails>
