---
name: shine-pii-safe
description: "Anonymize PII in a dataset before LLM ingestion via dishine-data-safe-usb."
argument-hint: "<path to CSV or data file>"
allowed-tools:
  - Read
  - Bash
  - Write
---

<objective>
1. Detect columns containing phone numbers, IBANs, emails, tax codes, addresses.
2. Ask the user for confirmation of the detection.
3. Apply [dishine-data-safe-usb](https://github.com/diShine-digital-agency/dishine-data-safe-usb) anonymization — preserves grouping/trend signals, removes raw PII.
4. Output: anonymized file + a mapping file (kept locally, never uploaded).
</objective>

<guardrails>
- If the tool is not installed, print the install command and stop. Never attempt manual anonymization in-prompt.
</guardrails>
