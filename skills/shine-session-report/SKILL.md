---
name: shine-session-report
description: "Generate a report of what this Claude Code session accomplished (commits, files, phases, tools)."
allowed-tools:
  - Bash
  - Read
---

# /shine-session-report

Summarize everything this session has produced: commits, files created/modified, phases touched, agents spawned, tools invoked.

## Implementation

1. **Recent commits in this session**:

   !`git log --since="3 hours ago" --pretty=format:"%h %s" --grep="^shine(" 2>/dev/null || echo "(no recent shine-scoped commits)"`

2. **Files changed since last precompact**:

   !`git log --since="3 hours ago" --name-only --pretty=format: 2>/dev/null | sort -u | grep -v '^$' || true`

3. **History digest**:

   !`node "$HOME/.claude/shine/bin/shine-tools.cjs" history-digest --raw`

4. **Active phase state** (if in a project):

   !`node "$HOME/.claude/shine/bin/shine-tools.cjs" roadmap --raw 2>/dev/null || true`

## Output

5-section report (per `shine/references/ui-brand.md`):

```
## Summary
One sentence: "Shipped X, decided Y, open Z."

## Details
- Commits: N  (list shas + subjects)
- Files:   M  (list paths)
- Phases:  …
- Agents spawned: …

## Sources
Git log, precompact snapshots.

## Open questions
Anything unresolved that should carry to next session.

## Next step
Proposed follow-up for the next session.
```

## Errors

- Not in a git repo → still report history-digest; note "(no git context)".
- `history-digest` empty → print "(no precompact snapshots this session)".

## See also

- `shine/workflows/session-report.md`
- `hooks/shine-precompact.js`
