---
name: shine-data-contract
description: "Draft a data contract between producer and consumer — schema, SLA, breaking changes."
argument-hint: "<domain / event>"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
---

<objective>
Structure: data owner, schema (Avro/Protobuf-style), semantics per field, SLA (freshness, completeness, accuracy), breaking change policy, versioning, on-call contact. Useful for event streams and BI marts.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
