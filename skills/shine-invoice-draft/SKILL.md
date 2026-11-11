---
name: shine-invoice-draft
description: "Draft a freelance / agency invoice — line items from MD log, VAT, payment terms."
argument-hint: "<client> | <period>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Pull MDs logged for the client in the period. Produce: invoice number (sequential), date, line items (description, MDs, rate, total), subtotal, VAT (22% IT default), grand total, IBAN, payment terms (30d net default). Italian by default for IT clients.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
