---
name: shine-api-design
description: "Design a REST/GraphQL API surface — resources, operations, errors, pagination, auth."
argument-hint: "<domain>"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
---

<objective>
Produce OpenAPI 3.1 skeleton (or GraphQL SDL) for the domain: resources, operations, request/response schemas, error envelope (RFC 7807), pagination strategy, auth model (OAuth 2.1 / API key), rate limits, versioning policy.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
