---
name: shine-readme-generator
description: "Generate a README following diShine house style — badges, ToC, install, usage, contrib, license."
argument-hint: "<project path>"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
---

<objective>
Scan the project. Produce: logo + badges header (Website, LinkedIn, License, Location), ToC, What/Why, Install, Quick start, Configuration, Architecture, Contributing, License, Contact. Match diShine open-source hub style.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
