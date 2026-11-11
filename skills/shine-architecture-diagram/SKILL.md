---
name: shine-architecture-diagram
description: "Sketch an architecture diagram in Mermaid or draw.io from a description."
argument-hint: "<system description>"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
---

<objective>
Produce a Mermaid `graph` or `sequenceDiagram` block. For drawio, output XML. Include: services, databases, external APIs, queues, auth layer, observability. Keep under 15 nodes; nest sub-systems in clusters.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
