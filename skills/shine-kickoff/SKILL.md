---
name: shine-kickoff
description: "Initialize a new client engagement — memory file, Asana project, kickoff agenda, welcome email draft."
argument-hint: "<client name>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Spin up a brand-new engagement in one command:

1. **Create client memory** — `~/.claude/memory/client-<slug>.md` with typed frontmatter and empty stubs for contacts, budget, language, CRM, CC list.
2. **Draft kickoff agenda** — standard 45-min template (intro / scope confirmation / constraints / next steps / Q&A).
3. **Draft welcome email** — in client's language, warm opening, propose kickoff slot, no attachments.
4. **Suggest Asana project skeleton** — phases aligned with SHINE (Strategize → Evaluate).
</objective>
