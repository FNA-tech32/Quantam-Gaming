---
name: shine-draft-email
description: "Draft a client-facing email in Kevin's style — warm opening, bullets, CLIENT | Topic subject, internal CC logic."
argument-hint: "<client> | <topic> | <what you want to say in one sentence>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
  - WebFetch
---

<objective>
Produce a ready-to-send client email that respects CLAUDE.md Rule #17:

1. **Language detection** — use the client memory's `language` field; default IT.
2. **Subject** — always `CLIENT | Specific topic` (no generic "Hi", "Follow-up").
3. **Structure**:
   - Warm opening ("Ciao Name," / "Buongiorno Name, spero tutto bene!")
   - 1-sentence context → bullet list of open items/deliverables → clear ask
   - Sign-off ("A presto, K" informal / "A presto e buon lavoro, Kevin" formal)
4. **CC logic** — read `~/.claude/memory/external-team-cc.md` for the per-client internal CC list.
5. **Thread awareness** — if the user attaches an email thread, ground the reply strictly in what was said. Do not extrapolate intent.
6. **Never auto-send** — output as a draft file, let the user copy/paste.
</objective>

<guardrails>
- Zero fabrication: dates, amounts, and promises must come from the user's input or the thread. Flag unknowns in _[brackets]_ for the user to fill.
- For cold outreach, skip the attachment — propose a call instead (diShine rule: never send docs "a freddo").
</guardrails>
