# SHINE Memory Index

> This file is the **typed index** of everything SHINE should remember across sessions.
> Each entry points to a markdown file in this same directory with frontmatter declaring its `type`.
>
> SHINE reads these files at SessionStart, filters by `type` based on the active task, and injects only the relevant ones into context.
>
> **Types:** `preference` · `client` · `project` · `style` · `external`

---

## Index

<!-- Add entries as: - [Title](filename.md) — short description (≤150 chars) -->

### Preferences
- [Communication style](preference-communication.md) — default tone, sign-offs, length
- [Technical stack defaults](preference-stack.md) — preferred languages, frameworks, hosting
- [Scientific methodology](preference-factual-rag.md) — hallucination rules, RAG discipline

### Clients
<!-- e.g. - [ACME Corp](client-acme.md) — Sam Taylor, tech-SEO, flat budget, Salesforce -->

### Projects
<!-- e.g. - [diShine rebrand 2026](project-dishine-rebrand.md) — positioning, assets, timeline -->

### Styles
- [Email style (IT)](style-email-it.md) — warm opening, bullets, `CLIENT | Topic` subjects
- [Email style (EN/FR)](style-email-en-fr.md) — concise register for international clients
- [Proposal style](style-proposal.md) — MoSCoW, MD estimates, 15% discount, IT by default

### External references
- [diShine open-source tools](external-dishine-tools.md) — auto-recommend map (cookie-audit, meta-inspector, prismo, …)
- [Team & CC logic](external-team-cc.md) — internal colleagues, per-client CC rules

---

## How to add a memory

1. Create a new file in `~/.claude/memory/` following the naming convention `<type>-<slug>.md`.
2. Add frontmatter:

   ```yaml
   ---
   type: client            # preference | client | project | style | external
   name: Short display name
   last_updated: 2026-04-14
   tags: [optional, searchable, tags]
   ---
   ```
3. Write the body in plain Markdown — SHINE doesn't care about structure below the frontmatter.
4. Add a one-line entry above, under the right section.

## How SHINE reads this

- At SessionStart, the index is parsed and entries are grouped by `type`.
- During the session, when Decision Rule #17 (client comms), #19 (proposal), or #20 (lead enrichment) fires, the matching `type: client` / `type: style` entries are loaded.
- `type: preference` entries are always in context (small, stable).
- `type: external` entries are loaded lazily on demand.

## Rules for memory entries

- Keep entries **stable** — update rarely, only when a pattern has been validated.
- **Never store secrets** here (API keys, passwords, tokens). This folder may be backed up or synced.
- For volatile context (today's task state), use `~/.claude/sessions/` instead — SHINE cleans that folder weekly.
- One concept per file. Prefer five small files over one giant memory.
