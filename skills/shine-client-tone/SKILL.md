---
name: shine-client-tone
description: "Review a draft against the client's language / tone / CC conventions before sending."
argument-hint: "<paste the draft, optionally with the target client>"
allowed-tools:
  - Read
  - Glob
---

<objective>
Act as a tone QA layer:

1. Detect the target client from the draft or ask.
2. Load `~/.claude/memory/client-<slug>.md` + `style-email-*.md`.
3. Check: language match, warmth of opening, bullet structure, `CLIENT | Topic` subject, sign-off, CC list.
4. Return a red/amber/green rating per check + rewrite suggestions.
5. Never rewrite unilaterally — propose diffs, let the user accept.
</objective>
