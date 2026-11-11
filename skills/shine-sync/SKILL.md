---
name: shine-sync
description: "Re-run SHINE SessionStart hooks (memory symlink, plugin sync, update check)."
allowed-tools:
  - Bash
---

# /shine-sync

Manually re-trigger the SessionStart hooks without restarting Claude Code. Useful after:

- Editing `~/.claude/settings.json`
- Installing or uninstalling a plugin
- Moving projects between devices
- Suspecting memory symlinks are broken

## What it does

1. Re-creates the `./memory → ~/.claude/memory/` symlink (unless opted out).
2. Re-runs the integration-sync hook to refresh the plugin list in CLAUDE.md.
3. Runs the update check (cached 24h — pass `--force` env to bust the cache).
4. Prints a one-line status per hook.

## Implementation

```bash
bash  "$HOME/.claude/hooks/global-memory-symlink.sh"
node "$HOME/.claude/hooks/integration-sync.js"
node "$HOME/.claude/hooks/shine-check-update.js"
```

Invoked as:

!`bash "$HOME/.claude/hooks/global-memory-symlink.sh" 2>&1 && node "$HOME/.claude/hooks/integration-sync.js" 2>&1 && node "$HOME/.claude/hooks/shine-check-update.js" 2>&1`

## Output

One line per hook, prefixed with ✓ or ⚠.

## Errors

- Any hook fails → surface its stderr; the others still run (fail-open semantics, exit 0).
- Hook file missing → instruct the user to re-run `./install.sh`.
