#!/usr/bin/env bash
# SHINE Claude Code Framework — uninstaller
# Usage: ./uninstall.sh [--purge] [--dry-run] [--help]
#
# Default: restore the most recent ~/.claude-backup-<timestamp>/ snapshot.
# --purge: remove ~/.claude/ entirely (destructive — asks for confirmation).

set -euo pipefail

PURGE=0
DRY_RUN=0

print_help() {
  cat <<EOF
SHINE Claude Code Framework — uninstaller

Usage: ./uninstall.sh [flags]

Flags:
  --purge     Remove ~/.claude/ entirely. Destructive. Prompts for confirmation.
  --dry-run   Show every action, change nothing.
  --help      Show this help and exit.

Default behaviour: restore the most recent ~/.claude-backup-<timestamp>/.
EOF
}

for arg in "$@"; do
  case "$arg" in
    --purge)   PURGE=1 ;;
    --dry-run) DRY_RUN=1 ;;
    -h|--help) print_help; exit 0 ;;
    *) echo "Unknown flag: $arg" >&2; print_help; exit 2 ;;
  esac
done

if [ -t 1 ]; then
  GREEN=$'\033[0;32m'; YELLOW=$'\033[1;33m'; RED=$'\033[0;31m'; NC=$'\033[0m'
else
  GREEN=''; YELLOW=''; RED=''; NC=''
fi

log() { printf "%s\n" "$*"; }
info(){ printf "${GREEN}%s${NC}\n" "$*"; }
warn(){ printf "${YELLOW}%s${NC}\n" "$*"; }
err() { printf "${RED}%s${NC}\n" "$*" >&2; }

run() { [ "$DRY_RUN" -eq 1 ] && log "  [dry-run] $*" || eval "$@"; }

CLAUDE_DIR="$HOME/.claude"

if [ "$PURGE" -eq 1 ]; then
  warn "--purge will remove ~/.claude/ entirely."
  read -r -p "Type 'PURGE' to confirm: " reply || reply=""
  if [ "$reply" != "PURGE" ]; then err "Aborted."; exit 1; fi
  run "rm -rf \"$CLAUDE_DIR\""
  info "~/.claude/ removed."
  exit 0
fi

# Find latest backup
LATEST="$(ls -1dt "$HOME"/.claude-backup-* 2>/dev/null | head -n1 || true)"
if [ -z "$LATEST" ]; then
  err "No backup found (expected ~/.claude-backup-<timestamp>/)."
  err "Use --purge to remove ~/.claude/ without restoring."
  exit 1
fi

warn "Restoring from: $LATEST"
read -r -p "This will replace ~/.claude/. Proceed? [y/N] " reply || reply=""
case "$reply" in y|Y|yes|YES) ;; *) err "Aborted."; exit 1 ;; esac

run "rm -rf \"$CLAUDE_DIR\""
run "cp -R \"$LATEST\" \"$CLAUDE_DIR\""
info "Restore complete."
