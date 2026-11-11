#!/usr/bin/env bash
# SHINE statusline — pure-bash fallback (no Node, no jq required).
# Set statusLine.command in settings.json to this file if you prefer it.
#
# Shows: ✨ SHINE · $(basename $PWD) · ⎇ branch · ◆ client

set -u

if [ -t 1 ]; then
  DIM=$'\033[2m'; CYAN=$'\033[36m'; GREEN=$'\033[32m'; YLW=$'\033[33m'; MAG=$'\033[35m'; NC=$'\033[0m'
else
  DIM=''; CYAN=''; GREEN=''; YLW=''; MAG=''; NC=''
fi

# Drain stdin (Claude Code may pipe JSON), but we don't parse it here.
cat >/dev/null 2>&1 || true

dir="$(basename "$PWD")"
branch=""
if command -v git >/dev/null 2>&1; then
  branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || true)"
fi

client=""
if [ -n "${CLAUDE_ACTIVE_CLIENT:-}" ]; then
  client="$CLAUDE_ACTIVE_CLIENT"
elif [ -f "$HOME/.claude/sessions/active-client" ]; then
  client="$(head -n1 "$HOME/.claude/sessions/active-client" 2>/dev/null | tr -d '[:space:]')"
fi

out="${MAG}✨ SHINE${NC}${DIM} · ${NC}${GREEN}${dir}${NC}"
[ -n "$branch" ] && out="${out}${DIM} · ${NC}${YLW}⎇ ${branch}${NC}"
[ -n "$client" ] && out="${out}${DIM} · ${NC}${MAG}◆ ${client}${NC}"

printf "%s\n" "$out"
