---
name: shine-list-workspaces
description: "List all SHINE workspaces/workstreams with status and active marker."
allowed-tools:
  - Bash
---

# /shine-list-workspaces

List every workstream registered in the current project's `.shine/workstreams/` directory, with status, phase count, and active marker.

## Implementation

!`node "$HOME/.claude/shine/bin/shine-tools.cjs" workstream list --raw`

Then merge with the active-workstream pointer:

!`node "$HOME/.claude/shine/bin/shine-tools.cjs" workstream progress --raw`

## Output

Table following `shine/references/ui-brand.md`:

```
| Name        | Status   | Phases | Active |
|-------------|----------|-------:|:------:|
| client-a    | active   |   7/10 |   ★    |
| client-b    | active   |   3/5  |        |
| q1-refactor | archived |   6/6  |        |
```

Below the table: "active workstream: `<name>`" or "(no active workstream — use `/shine-workstreams set <name>` to set one)".

## Errors

- No `.shine/workstreams/` dir → print "No workstreams yet. Create one with `/shine-workstreams create <name>`."
- Corrupt workstream JSON → list anyway, mark entry as 🔴 and include parse error line.

## See also

- `/shine-workstreams` — create/set/archive
- `shine/workflows/list-workspaces.md`
