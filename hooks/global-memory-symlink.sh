#!/usr/bin/env bash
# SHINE hook — SessionStart
# Symlinks the project-local ./memory/ directory to ~/.claude/memory/ so
# project sessions see the same typed memory the global framework manages.
# Opt-out: touch ~/.claude/.no-memory-symlink

set -euo pipefail

GLOBAL_MEM="$HOME/.claude/memory"
OPT_OUT="$HOME/.claude/.no-memory-symlink"
PROJECT_MEM="$PWD/memory"

[ -f "$OPT_OUT" ] && exit 0
[ ! -d "$GLOBAL_MEM" ] && exit 0

# Don't clobber an existing non-symlink project memory dir.
if [ -e "$PROJECT_MEM" ] && [ ! -L "$PROJECT_MEM" ]; then
  exit 0
fi

# If already correctly linked, nothing to do.
if [ -L "$PROJECT_MEM" ] && [ "$(readlink "$PROJECT_MEM")" = "$GLOBAL_MEM" ]; then
  exit 0
fi

ln -sfn "$GLOBAL_MEM" "$PROJECT_MEM" 2>/dev/null || true
exit 0
