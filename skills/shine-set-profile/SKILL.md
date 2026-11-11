---
name: shine-set-profile
description: "Switch SHINE model profile (quality|balanced|budget|inherit) with validation."
argument-hint: "<quality|balanced|budget|inherit>"
allowed-tools:
  - Bash
---

# /shine-set-profile

Switch the active SHINE model profile. Affects which model each agent resolves to via `shine-tools.cjs resolve-model`.

## Profiles

| Profile | Model (default) | Use when |
|---------|-----------------|----------|
| `quality` | claude-opus-4-1 | Research, hard planning, deep debugging |
| `balanced` | claude-sonnet-4-5 | Day-to-day work (default) |
| `budget` | claude-haiku-4 | Quick tasks, docs updates, linting |
| `inherit` | (session default) | Don't override — use whatever Claude Code is set to |

## Usage

```
/shine-set-profile balanced
```

## Implementation

Validate the argument is one of the four valid profiles, then delegate to the runtime:

!`node "$HOME/.claude/shine/bin/shine-tools.cjs" config-set-model-profile "$ARGUMENTS" --raw`

## Output

The runtime prints a JSON object with the new profile and the path to the updated config file. Show it to the user verbatim.

## Errors

- Unknown profile → runtime exits 1 with stderr listing valid options. Do not retry; surface the error.
- Config file unwritable → surface the OS error; point the user at `~/.claude/shine/config.json`.

## See also

- `/shine-help` — overview
- `shine/bin/shine-tools.cjs config-get model_profile --raw` — check current profile
