# SHINE UI & Brand Reference

Formatting conventions used across every SHINE output — proposals, reports, diffs, status messages. Keep output consistent, scannable, and on-brand.

---

## 1. Voice

- **Tone**: warm, direct, professional. No hype. No filler.
- **Language**: client-facing Italian by default for IT-market work. English for international / diShine. French when the client side writes in French.
- **Point of view**: "we" for agency deliverables; "I" for assistant status messages.
- **Never**: fabricate numbers, invent KPIs, cite sources not actually fetched.

---

## 2. Headings & sections

```
# Top-level (file title)
## Section
### Subsection
#### Minor divider
```

- Exactly one `#` per file (the title).
- Use `---` horizontal rules between large, distinct sections.
- Bold `**labels**` inline for small inline callouts; don't replace real headings with bolded text.

---

## 3. Lists

- Prefer `-` for unordered lists (not `*` or `+`).
- Numbered lists only when order matters (procedures, rankings).
- Two-level nesting max. If you need three, promote children to a subsection.

---

## 4. Tables

- Left-align text columns, right-align numeric columns.
- Keep columns under ~6. If wider, split into two tables.
- Always include a header row.

```
| Item       | MD | €/MD | Total |
|------------|---:|-----:|------:|
| Audit tech |  5 |  800 | 4 000 |
| Reporting  |  3 |  800 | 2 400 |
```

---

## 5. Status markers

| Marker | Meaning |
|--------|---------|
| ✅ | Done, verified, shipped |
| 🟢 | Healthy / on-track |
| 🟡 | Attention / in progress |
| 🔴 | Blocked / failing |
| ⏳ | Waiting on external input |
| 🧪 | Experimental / draft |
| ⚠️ | Risk / guardrail callout |
| 🔒 | Secret / PII / GDPR-sensitive |

Use sparingly. Never more than one emoji per heading.

---

## 6. Code blocks & paths

- Use fenced code blocks with a language tag (```` ```bash ````, ```` ```json ````, ```` ```ts ````).
- File paths in `backticks`: `skills/shine-plan-phase/SKILL.md`.
- Commands users should run prefixed with `$` when shown interactively, bare otherwise in scripts.

---

## 7. Report structure (5-section canonical)

Every debug, verify, or research deliverable follows this shape:

```
## Summary
One-paragraph bottom line.

## Details
Specifics: files, line numbers, numbers, dates. Link back to sources.

## Sources
Bulleted list of every URL/file/MCP query fetched this session. Nothing else.

## Open questions
What we don't know yet, what we'd need to verify.

## Next step
One concrete, proposed next action (with user-gate language).
```

---

## 8. Proposal structure (MoSCoW + MD)

```
## Contesto
## Obiettivi
## Scope — MoSCoW
  ### Must
  ### Should
  ### Could
  ### Won't (this time)
## Stima (MD)
## Investimento
## Timeline
## Prossimi passi
```

- MD = Man-Day = 8 hours.
- Show a ~15% discount option on total investment.
- Never send "a freddo" — always propose a call first.

---

## 9. Commit messages

Format: `shine(<scope>): <imperative summary>`

Examples:

- `shine(plan): add phase 3 research plan`
- `shine(exec): implement cookie-consent form`
- `shine(doc): update ACME client memory`

Keep the summary ≤ 72 chars. Body (optional) explains *why*, not *what*.

---

## 10. Progress & status lines

For long operations, emit a single compact line per milestone:

```
→ Loaded phase 2 context (3 plans, 847 lines)
→ Spawning shine-phase-researcher …
✓ Research complete: 4 sources, 2 open questions
```

Use `→` for in-progress, `✓` for success, `✗` for failure, `…` for pending.

---

## 10b. Verified-source watermark (client-facing deliverables)

Mixed deliverables (facts + drafted language) must distinguish the two:

- Inline labels: `_[verified — <source>, <date>]_`, `_[unverified — pattern inferred]_`, `_[drafted — no source]_`.
- Sources footer at the bottom with a small table of URL + fetch date per verified claim.
- Zero-fact deliverable → add one-line disclaimer: _"No facts retrieved this session — drafted language only."_

Full template: `shine/templates/watermark.md`. Rule source: `CLAUDE.md §16`.

---

## 11. Do-nots

- No ALL-CAPS screaming.
- No marketing adjectives ("amazing", "powerful", "cutting-edge") in deliverables.
- No emoji bursts ("🚀🚀🔥✨").
- No trailing whitespace, no tabs (spaces only), no CRLF line endings.
- No PII in commit messages or filenames.
