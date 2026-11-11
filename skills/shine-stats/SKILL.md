---
name: shine-stats
description: "Show SHINE project stats: phase counts, commit velocity, workstream status."
allowed-tools:
  - Bash
  - Read
---

# /shine-stats

Compact statistics dashboard for the current SHINE project.

## What it reports

- Total phases in ROADMAP.md and breakdown by status (done / in-progress / todo / blocked)
- Current in-progress phase + wave (from STATE.md)
- Commit velocity over the last 7 days (git log)
- Active workstream (if any) and its progress
- Installed runtime version (from `shine/VERSION`)

## Implementation

1. Runtime data:

   !`node "$HOME/.claude/shine/bin/shine-tools.cjs" roadmap --raw`
   !`node "$HOME/.claude/shine/bin/shine-tools.cjs" workstream progress --raw`

2. Commit velocity (last 7 days, shine-scoped commits only):

   !`git log --since="7 days ago" --oneline --grep="^shine(" 2>/dev/null | wc -l`

3. Installed version:

   !`cat "$HOME/.claude/shine/VERSION" 2>/dev/null || echo "unknown"`

## Output

Render a 5-line summary in the UI-brand format (see `shine/references/ui-brand.md`):

```
## SHINE stats — <project slug>
✓ Phases:  X/Y done · Z in progress · W todo
✓ Velocity: N commits in last 7 days (shine-scoped)
✓ Workstream: <name> (<status>)
✓ Runtime: vX.Y.Z
```

## Errors

- Not in a git repo → omit velocity line, print note.
- No ROADMAP.md → suggest `/shine-new-project`.
