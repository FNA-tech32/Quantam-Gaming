---
name: shine-changelog-draft
description: "Draft a changelog entry from recent commits — Keep-a-Changelog format."
argument-hint: "[--since <ref>]"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
---

<objective>
Run `git log --pretty` from the given ref (default: last tag). Classify commits into Added / Changed / Deprecated / Removed / Fixed / Security. Produce a new section in CHANGELOG.md with version + date. Respect SemVer: flag breaking changes.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
