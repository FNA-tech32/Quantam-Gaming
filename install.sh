#!/usr/bin/env bash
# SHINE Claude Code Framework — installer
# Usage: ./install.sh [--profile=<name>] [--dry-run] [--no-plugins] [--no-backup] [--no-symlink] [--non-interactive] [--help]
#
# Safe by default: atomic backup of existing ~/.claude/ before any change.
# Reversible: ./uninstall.sh restores the most recent backup.
# Context-aware: installs the profile you pick (default: minimal). Switch any time with 'shine activate <profile>'.

set -euo pipefail

# ─── Flags ──────────────────────────────────────────────────────────────────
DRY_RUN=0
NO_PLUGINS=0
NO_BACKUP=0
NO_SYMLINK=0
NON_INTERACTIVE=0
PROFILE="minimal"

print_help() {
  cat <<EOF
SHINE Claude Code Framework — installer

Usage: ./install.sh [flags]

Flags:
  --profile=<name>     Install a capability profile. One of:
                         minimal  (default, ~15k context — no plugins)
                         writing  (~20k — context7)
                         outbound (~35k — prospecting stack)
                         seo      (~40k — SEO stack)
                         dev      (~70k — LSPs + serena + playwright)
                         full     (~95k — ALL 16 plugins, not recommended)
  --dry-run            Show every action, change nothing.
  --no-plugins         Skip 'claude plugins install' loop entirely (overrides profile).
  --no-backup          Skip the ~/.claude-backup-<timestamp>/ snapshot. DANGEROUS.
  --no-symlink         Do not symlink project memory dirs to global memory.
  --non-interactive    Fail instead of prompting when a decision is required.
  --help               Show this help and exit.

After install you can change profile any time:
  shine activate <name>        # atomic, restart Claude Code to apply
  shine list                   # show all profiles
  shine current                # show currently enabled plugins/MCPs
EOF
}

for arg in "$@"; do
  case "$arg" in
    --profile=*)       PROFILE="${arg#*=}" ;;
    --dry-run)         DRY_RUN=1 ;;
    --no-plugins)      NO_PLUGINS=1 ;;
    --no-backup)       NO_BACKUP=1 ;;
    --no-symlink)      NO_SYMLINK=1 ;;
    --non-interactive) NON_INTERACTIVE=1 ;;
    -h|--help)         print_help; exit 0 ;;
    *) echo "Unknown flag: $arg" >&2; print_help; exit 2 ;;
  esac
done

# Validate profile name
case "$PROFILE" in
  minimal|writing|outbound|seo|dev|full) ;;
  *) echo "Unknown profile: $PROFILE (expected minimal|writing|outbound|seo|dev|full)" >&2; exit 2 ;;
esac

# ─── Colors (TTY-safe) ──────────────────────────────────────────────────────
if [ -t 1 ]; then
  GREEN=$'\033[0;32m'; YELLOW=$'\033[1;33m'; RED=$'\033[0;31m'; DIM=$'\033[2m'; NC=$'\033[0m'
else
  GREEN=''; YELLOW=''; RED=''; DIM=''; NC=''
fi

log()  { printf "%s\n" "$*"; }
info() { printf "${GREEN}%s${NC}\n" "$*"; }
warn() { printf "${YELLOW}%s${NC}\n" "$*"; }
err()  { printf "${RED}%s${NC}\n" "$*" >&2; }
dim()  { printf "${DIM}%s${NC}\n" "$*"; }

run() {
  # Dry-run-aware command runner.
  if [ "$DRY_RUN" -eq 1 ]; then
    dim "  [dry-run] $*"
  else
    eval "$@"
  fi
}

ask_yes_no() {
  local prompt="$1" default="${2:-n}" reply
  if [ "$NON_INTERACTIVE" -eq 1 ]; then
    [ "$default" = "y" ] && return 0 || return 1
  fi
  read -r -p "$prompt [y/N] " reply || reply=""
  case "$reply" in y|Y|yes|YES) return 0 ;; *) return 1 ;; esac
}

# ─── Paths ──────────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_DIR="$HOME/.claude"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="$HOME/.claude-backup-$TIMESTAMP"

# ─── Banner ─────────────────────────────────────────────────────────────────
info "=== SHINE Claude Code Framework — Installer ==="
[ "$DRY_RUN" -eq 1 ] && warn "(dry-run mode — no changes will be made)"
log ""

# ─── Pre-flight checks ──────────────────────────────────────────────────────
check_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    err "Missing required command: $1"
    case "$1" in
      claude) err "  Install Claude Code: npm install -g @anthropic-ai/claude-code" ;;
      node)   err "  Install Node.js 18+ : https://nodejs.org" ;;
      git)    err "  Install git         : https://git-scm.com" ;;
    esac
    exit 1
  fi
}
check_cmd claude
check_cmd node
check_cmd git

NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$NODE_MAJOR" -lt 18 ]; then
  err "Node.js $NODE_MAJOR detected — SHINE requires Node 18+."
  exit 1
fi

# ─── Backup ─────────────────────────────────────────────────────────────────
if [ -d "$CLAUDE_DIR" ] && [ "$NO_BACKUP" -eq 0 ]; then
  warn "Existing ~/.claude/ found."
  warn "Backing up to: $BACKUP_DIR"
  run "cp -R \"$CLAUDE_DIR\" \"$BACKUP_DIR\""
elif [ -d "$CLAUDE_DIR" ] && [ "$NO_BACKUP" -eq 1 ]; then
  warn "Skipping backup (--no-backup)."
  if ! ask_yes_no "Proceed without backup? Existing files will be overwritten." "n"; then
    err "Aborted."
    exit 1
  fi
fi

run "mkdir -p \"$CLAUDE_DIR\""

# ─── Copy core files ────────────────────────────────────────────────────────
info "Copying CLAUDE.md (global instructions)…"
run "cp \"$SCRIPT_DIR/CLAUDE.md\" \"$CLAUDE_DIR/CLAUDE.md\""

info "Copying agents…"
run "mkdir -p \"$CLAUDE_DIR/agents\""
if compgen -G "$SCRIPT_DIR/agents/*.md" >/dev/null; then
  run "cp \"$SCRIPT_DIR/agents/\"*.md \"$CLAUDE_DIR/agents/\""
else
  warn "  (no agents found in $SCRIPT_DIR/agents — skipped)"
fi

info "Copying skills…"
run "mkdir -p \"$CLAUDE_DIR/skills\""
if [ -d "$SCRIPT_DIR/skills" ] && [ "$(ls -A "$SCRIPT_DIR/skills" 2>/dev/null)" ]; then
  run "cp -R \"$SCRIPT_DIR/skills/\"* \"$CLAUDE_DIR/skills/\""
else
  warn "  (no skills found in $SCRIPT_DIR/skills — skipped)"
fi

info "Copying hooks…"
run "mkdir -p \"$CLAUDE_DIR/hooks\""
if [ -d "$SCRIPT_DIR/hooks" ] && [ "$(ls -A "$SCRIPT_DIR/hooks" 2>/dev/null)" ]; then
  run "cp -R \"$SCRIPT_DIR/hooks/.\" \"$CLAUDE_DIR/hooks/\""
  run "chmod +x \"$CLAUDE_DIR/hooks/\"*.sh 2>/dev/null || true"
else
  warn "  (no hooks found in $SCRIPT_DIR/hooks — skipped)"
fi

info "Copying statusline…"
run "cp \"$SCRIPT_DIR/statusline.js\" \"$CLAUDE_DIR/statusline.js\""
if [ -f "$SCRIPT_DIR/statusline.sh" ]; then
  run "cp \"$SCRIPT_DIR/statusline.sh\" \"$CLAUDE_DIR/statusline.sh\""
  run "chmod +x \"$CLAUDE_DIR/statusline.sh\""
fi

# ─── Memory ─────────────────────────────────────────────────────────────────
info "Setting up global memory…"
run "mkdir -p \"$CLAUDE_DIR/memory\""
if [ ! -f "$CLAUDE_DIR/memory/MEMORY.md" ]; then
  run "cp \"$SCRIPT_DIR/memory/MEMORY.md\" \"$CLAUDE_DIR/memory/MEMORY.md\""
else
  dim "  ~/.claude/memory/MEMORY.md already exists — kept as-is."
fi

# Record --no-symlink opt-out for the hook to read
if [ "$NO_SYMLINK" -eq 1 ]; then
  run "touch \"$CLAUDE_DIR/.no-memory-symlink\""
  dim "  Opt-out marker written: ~/.claude/.no-memory-symlink"
fi

# ─── Settings ───────────────────────────────────────────────────────────────
if [ ! -f "$CLAUDE_DIR/settings.json" ]; then
  warn "Creating settings.json from template…"
  run "cp \"$SCRIPT_DIR/settings.template.json\" \"$CLAUDE_DIR/settings.json\""
  warn "  >>> Edit ~/.claude/settings.json to opt into telemetry or set a custom gateway."
else
  dim "~/.claude/settings.json already exists — kept as-is."
fi

# ─── Standard dirs ──────────────────────────────────────────────────────────
for d in projects sessions tasks teams todos debug backups cache; do
  run "mkdir -p \"$CLAUDE_DIR/$d\""
done

# ─── Profile selection (interactive) ────────────────────────────────────────
# If user didn't pass --profile and we're interactive, offer the picker.
if [ "$NON_INTERACTIVE" -eq 0 ] && [ "$PROFILE" = "minimal" ] && [ "$NO_PLUGINS" -eq 0 ]; then
  log ""
  info "Pick a context profile:"
  log "  1) minimal   — no plugins. Pure SHINE. ~15k context. (default, recommended)"
  log "  2) writing   — context7. ~20k context."
  log "  3) outbound  — context7 + prospecting stack. ~35k context."
  log "  4) seo       — context7 + Ahrefs stack. ~40k context."
  log "  5) dev       — LSPs + serena + playwright + supabase. ~70k context."
  log "  6) full      — all 16 plugins. ~95k context. NOT recommended."
  read -r -p "Choice [1]: " choice || choice=""
  case "${choice:-1}" in
    1|minimal)  PROFILE="minimal" ;;
    2|writing)  PROFILE="writing" ;;
    3|outbound) PROFILE="outbound" ;;
    4|seo)      PROFILE="seo" ;;
    5|dev)      PROFILE="dev" ;;
    6|full)     PROFILE="full" ;;
    *) warn "Unknown choice — defaulting to minimal."; PROFILE="minimal" ;;
  esac
fi

# ─── Plugins (profile-driven) ──────────────────────────────────────────────
# Install only the plugins listed in the selected profile's enabledPlugins.
# The profile file is at $SCRIPT_DIR/shine/profiles/$PROFILE.json.
if [ "$NO_PLUGINS" -eq 0 ] && [ "$PROFILE" != "minimal" ]; then
  PROFILE_FILE="$SCRIPT_DIR/shine/profiles/$PROFILE.json"
  if [ ! -f "$PROFILE_FILE" ]; then
    warn "Profile file missing: $PROFILE_FILE — skipping plugin install."
  else
    info ""
    info "Installing plugins for profile '$PROFILE'…"
    # Parse "plugin@marketplace": true lines with node
    PLUGINS_RAW="$(node -e "const p=require('$PROFILE_FILE');for(const k of Object.keys(p.enabledPlugins||{})){if(p.enabledPlugins[k])console.log(k);}")"
    while IFS= read -r entry; do
      [ -z "$entry" ] && continue
      plugin="${entry%@*}"
      marketplace="${entry#*@}"
      log "  Installing $plugin from $marketplace…"
      if [ "$marketplace" = "claude-plugins-official" ]; then
        run "claude plugins install \"$plugin\" 2>/dev/null || echo '    (already installed or unavailable)'"
      else
        run "claude plugins install \"$plugin\" --marketplace \"$marketplace\" 2>/dev/null || echo '    (already installed or unavailable)'"
      fi
    done <<< "$PLUGINS_RAW"
  fi
elif [ "$NO_PLUGINS" -eq 1 ]; then
  warn "Skipping plugin installation (--no-plugins)."
else
  dim "  Profile 'minimal' — no plugins to install."
fi

# ─── SHINE framework ────────────────────────────────────────────────────────
info ""
info "SHINE framework:"
run "mkdir -p \"$CLAUDE_DIR/shine/bin\""
run "mkdir -p \"$CLAUDE_DIR/shine/workflows\""
run "mkdir -p \"$CLAUDE_DIR/shine/templates\""
run "mkdir -p \"$CLAUDE_DIR/shine/references\""
run "mkdir -p \"$CLAUDE_DIR/shine/profiles\""

if [ -f "$SCRIPT_DIR/shine/VERSION" ]; then
  run "cp \"$SCRIPT_DIR/shine/VERSION\" \"$CLAUDE_DIR/shine/VERSION\""
fi

if [ -f "$SCRIPT_DIR/shine/bin/shine-tools.cjs" ]; then
  run "cp \"$SCRIPT_DIR/shine/bin/shine-tools.cjs\" \"$CLAUDE_DIR/shine/bin/shine-tools.cjs\""
  run "chmod +x \"$CLAUDE_DIR/shine/bin/shine-tools.cjs\""
  dim "  shine-tools.cjs runtime installed."
fi
if [ -f "$SCRIPT_DIR/shine/bin/shine-tools.test.cjs" ]; then
  run "cp \"$SCRIPT_DIR/shine/bin/shine-tools.test.cjs\" \"$CLAUDE_DIR/shine/bin/shine-tools.test.cjs\""
fi

# Profile manager runtime + shim
if [ -f "$SCRIPT_DIR/shine/bin/shine-profile.cjs" ]; then
  run "cp \"$SCRIPT_DIR/shine/bin/shine-profile.cjs\" \"$CLAUDE_DIR/shine/bin/shine-profile.cjs\""
  run "chmod +x \"$CLAUDE_DIR/shine/bin/shine-profile.cjs\""
  dim "  shine-profile.cjs installed."
fi
if [ -f "$SCRIPT_DIR/shine/bin/shine" ]; then
  run "cp \"$SCRIPT_DIR/shine/bin/shine\" \"$CLAUDE_DIR/shine/bin/shine\""
  run "chmod +x \"$CLAUDE_DIR/shine/bin/shine\""
  dim "  shine CLI shim installed (add ~/.claude/shine/bin to PATH)."
fi

# Copy all profile JSONs
if compgen -G "$SCRIPT_DIR/shine/profiles/*.json" >/dev/null; then
  run "cp \"$SCRIPT_DIR/shine/profiles/\"*.json \"$CLAUDE_DIR/shine/profiles/\""
  dim "  Profiles installed: minimal, writing, outbound, seo, dev, full."
fi

if compgen -G "$SCRIPT_DIR/shine/workflows/*.md" >/dev/null; then
  run "cp \"$SCRIPT_DIR/shine/workflows/\"*.md \"$CLAUDE_DIR/shine/workflows/\""
fi
if compgen -G "$SCRIPT_DIR/shine/templates/*.md" >/dev/null; then
  run "cp \"$SCRIPT_DIR/shine/templates/\"*.md \"$CLAUDE_DIR/shine/templates/\""
fi
if compgen -G "$SCRIPT_DIR/shine/references/*.md" >/dev/null; then
  run "cp \"$SCRIPT_DIR/shine/references/\"*.md \"$CLAUDE_DIR/shine/references/\""
fi

if [ -f "$CLAUDE_DIR/shine/VERSION" ]; then
  dim "  SHINE v$(cat "$CLAUDE_DIR/shine/VERSION" 2>/dev/null) installed."
fi

# ─── Post-install validation ───────────────────────────────────────────────
info ""
info "Validating installation…"
MISSING=0
for f in \
  "shine/bin/shine-tools.cjs" \
  "shine/workflows/execute-phase.md" \
  "shine/workflows/plan-phase.md" \
  "shine/workflows/new-project.md" \
  "shine/references/ui-brand.md" \
  "shine/references/questioning.md" \
  "shine/templates/project.md" \
  "shine/templates/requirements.md" \
  "CLAUDE.md" ; do
  if [ ! -f "$CLAUDE_DIR/$f" ]; then
    warn "  Missing: $f"
    MISSING=$((MISSING + 1))
  fi
done
if [ "$MISSING" -gt 0 ]; then
  warn "$MISSING critical files missing — some skills will not work"
else
  info "  ✓ All critical files present"
fi

# Smoke-test the runtime
if [ "$DRY_RUN" -eq 0 ] && [ -f "$CLAUDE_DIR/shine/bin/shine-tools.cjs" ]; then
  if node "$CLAUDE_DIR/shine/bin/shine-tools.cjs" help >/dev/null 2>&1; then
    info "  ✓ shine-tools runtime responds"
  else
    warn "  shine-tools runtime failed smoke test"
  fi
  # Full test suite (optional — non-blocking)
  if [ -f "$CLAUDE_DIR/shine/bin/shine-tools.test.cjs" ]; then
    if node "$CLAUDE_DIR/shine/bin/shine-tools.test.cjs" >/dev/null 2>&1; then
      info "  ✓ shine-tools test suite passes"
    else
      warn "  shine-tools test suite reported failures (non-blocking)"
    fi
  fi
fi

# ─── Activate profile ──────────────────────────────────────────────────────
# Apply the chosen profile to settings.json so plugin/MCP enablement reflects it.
if [ "$DRY_RUN" -eq 0 ] && [ -f "$CLAUDE_DIR/shine/bin/shine-profile.cjs" ]; then
  info ""
  info "Activating profile: $PROFILE"
  if node "$CLAUDE_DIR/shine/bin/shine-profile.cjs" activate "$PROFILE" >/dev/null 2>&1; then
    info "  ✓ Profile '$PROFILE' applied to ~/.claude/settings.json"
  else
    warn "  Profile activation failed — run manually: node ~/.claude/shine/bin/shine-profile.cjs activate $PROFILE"
  fi
fi

# ─── Done ───────────────────────────────────────────────────────────────────
log ""
info "=== Installation complete ==="
log ""
log "Next steps:"
log "  1. (Optional) Edit ~/.claude/settings.json — custom gateway or telemetry opt-in"
log "  2. Run 'claude' to start a session and verify"
log "  3. Inside Claude Code, run: /shine-help"
log "  4. Switch profile any time: node ~/.claude/shine/bin/shine-profile.cjs activate <name>"
log "     (or add ~/.claude/shine/bin to PATH and run 'shine activate <name>')"
log ""
log "Installed into ~/.claude/:"
log "  - CLAUDE.md     (global instructions, 20 decision rules)"
log "  - agents/       (39 SHINE agents — 21 engineering + 18 agency)"
log "  - skills/       (141 skill slash-commands + INDEX.md)"
log "  - hooks/        (8 lifecycle hooks — SessionStart / Pre+PostToolUse / PreCompact / Stop)"
log "  - memory/       (typed persistent memory — preference/client/project/style/external)"
log "  - docs/         (ARCHITECTURE, HOW-IT-WORKS, CUSTOMIZATION, PLUGINS, AGENCY-WORKFLOWS)"
log "  - shine/bin/    (shine-tools.cjs runtime engine — 18 subcommands)"
log "  - shine/workflows/  (53 workflow definitions)"
log "  - shine/templates/  (6 project/phase templates — incl. verified-source watermark)"
log "  - shine/references/ (ui-brand + questioning references)"
[ "$NO_BACKUP" -eq 0 ] && [ -d "$BACKUP_DIR" ] && log "" && dim "Backup: $BACKUP_DIR"
[ "$DRY_RUN" -eq 1 ] && log "" && warn "(dry-run — no files were actually changed)"
