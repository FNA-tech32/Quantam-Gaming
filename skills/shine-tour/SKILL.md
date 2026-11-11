---
name: shine-tour
description: "Interactive walkthrough of SHINE — verifies install, teaches core concepts, troubleshoots issues"
argument-hint: "[--section <name>] [--check-only] [--fix]"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
---

<objective>
Run a guided, interactive walkthrough of SHINE for a first-time user. The tour:

1. **Verifies** the install is healthy (doctor-style checks with clear pass/fail).
2. **Teaches** the 5 pillars: decision rules · memory · skills · agents · hooks.
3. **Demonstrates** one real workflow end-to-end (lightweight, read-only).
4. **Troubleshoots** every known failure mode with copy-paste fixes.

The tour is **idempotent and read-mostly**: it never modifies user data without explicit confirmation, and every write is reversible.
</objective>

<execution_context>
@~/.claude/shine/references/ui-brand.md
</execution_context>

<context>
Flags:
- `--section <name>` — jump directly to one section. Valid names: `install`, `rules`, `memory`, `skills`, `agents`, `hooks`, `workflow`, `troubleshoot`.
- `--check-only` — run all health checks, skip the teaching/interactive parts. Good for CI or a quick status sweep.
- `--fix` — after a failed check, offer a concrete fix (create missing file, re-run installer step, set env var) instead of just reporting. Every fix asks for confirmation before writing.

**Audience assumption.** The user may be a complete newbie who just ran `./install.sh` and typed `claude`. Assume they don't know what MCP is, don't have memory files yet, and may have mistyped a path. Every explanation must be plain-English first, technical after.

**Read-mostly contract.** The only files the tour is allowed to create are:
- `~/.claude/memory/preference-*.md` via `/shine onboard` (only with confirmation).
- A one-off tour-report at `~/.claude/sessions/tour-<timestamp>.md`.

Anything else is **read-only**.
</context>

<execution_flow>

## Phase 0 — Greeting and scope

Print a warm one-liner and show what the tour covers:

```
👋 Welcome to SHINE — 6-minute guided tour.

We'll walk through:
  1. Install health      (30s)
  2. The 20 decision rules  (1 min)
  3. Memory system       (1 min)
  4. Skills              (1 min)
  5. Agents              (1 min)
  6. Hooks & guardrails  (1 min)
  7. A real mini-workflow (1 min)

You can exit at any point with Ctrl-C. Every step is read-mostly —
nothing changes on disk unless you confirm.

Ready? (Y/n)
```

If the user says no, exit 0 with a pointer to `/shine-help`.

---

## Phase 1 — Install health (always runs unless `--section` skips it)

Run every check. Print each as `✓ PASS …` / `✗ FAIL …` / `⚠ WARN …`. **Never fabricate a result** — every check must hit the real filesystem.

| Check | Command | Pass criteria | Fix if failing |
|-------|---------|---------------|----------------|
| `claude` CLI present | `command -v claude` | exit 0 | "Install Claude Code: https://docs.claude.com/claude-code" |
| `node` ≥ 18 | `node --version` | major ≥ 18 | "Install Node 18+: https://nodejs.org" |
| `~/.claude/` exists | `test -d ~/.claude` | exists | "Re-run `./install.sh` from the repo" |
| `~/.claude/CLAUDE.md` | `test -f ~/.claude/CLAUDE.md` | exists, non-empty | "Re-run `./install.sh`" |
| `~/.claude/settings.json` | `test -f ~/.claude/settings.json` | valid JSON | `node -e "JSON.parse(require('fs').readFileSync('$HOME/.claude/settings.json'))"` — if throws, re-run installer |
| `~/.claude/agents/` | count `*.md` | ≥ 39 | "Re-run `./install.sh`" |
| `~/.claude/skills/` | count dirs with `SKILL.md` | ≥ 140 | "Re-run `./install.sh`" |
| `~/.claude/hooks/` | list `*.js` + `*.sh` | ≥ 8 | "Re-run `./install.sh`" |
| `~/.claude/shine/bin/shine-tools.cjs --version` | exec | JSON with `version` ≥ `1.0.3` | "Re-run `./install.sh` — your version is outdated" |
| `~/.claude/memory/` | `test -d` | exists | Offer to run `onboard` |
| `MEMORY.md` | `test -f ~/.claude/memory/MEMORY.md` | exists | Offer to run `onboard` |
| Hook syntax | `node --check` each `hooks/*.js` | no syntax error | "Re-run installer; if it persists, file a bug" |
| `settings.json` hook paths resolve | parse JSON, check each `command` path | all files exist | "Paths must use `$HOME/.claude/hooks/<name>`. Re-run installer" |
| PATH/perm sanity | `ls -la ~/.claude/hooks/` exec bits | readable | `chmod +r ~/.claude/hooks/*` |

**Aggregate verdict.** Print a summary bar:

```
Install health: 12 / 14 checks passed
✗ memory/ missing
✗ MEMORY.md missing
```

If `--fix` is set and failures are fixable, prompt per-failure:
> "Create `~/.claude/memory/` and seed starter files via `shine-tools.cjs onboard`? (y/N)"

If `--check-only`, exit now with status = number of failures.

---

## Phase 2 — The 20 decision rules (short)

Explain **in 5 sentences**:

> SHINE's core idea: instead of telling Claude which tool to use every time, a global `CLAUDE.md` maps prompt patterns to tool chains. Example: if you ask "enrich these leads", rule #8 routes you to Apollo / Hunter / the local extractor script. If you ask "draft an email to <client>", rule #12 routes you to Gmail MCP + Kevin's style guide. You don't memorize rules — you just ask, and SHINE routes. Open `~/.claude/CLAUDE.md` anytime to see the full table.

Offer: _"Want to see the full rule table now? (y/N)"_ — if yes, print the `CLAUDE.md` section headers only (not the whole file). Never dump >50 lines into the chat.

---

## Phase 3 — Memory system

Explain:

> Memory is **global** across projects — stored in `~/.claude/memory/` as markdown files with typed frontmatter. Five types: `preference` (how you work), `client` (client context), `project` (active project state), `style` (writing style), `external` (dumps from other systems). SHINE loads the right ones automatically based on what you ask.

Then **list** what's already there:
```bash
ls ~/.claude/memory/*.md 2>/dev/null | head -20
```

If empty, offer: _"Seed 4 starter memory files now? (y/N)"_ → runs `shine-tools.cjs onboard`.

Mini-demo (read-only): show the frontmatter of one memory file so the user sees the schema.

---

## Phase 4 — Skills (slash commands)

Explain:

> A skill is a reusable recipe invokable as a slash command. Example: `/shine-help` prints the command reference; `/shine-retro` proposes memory updates. You have **140 skills** across 10 categories. Run `/shine-tools index-skills` to regenerate a browsable index.

Show top 5 categories with counts:
```bash
head -30 ~/.claude/skills/INDEX.md 2>/dev/null
```

Ask: _"Which category sounds most useful for you today? [core / agency / marketing / sales / consulting / tech / ops / data / brand]"_ — then show that category's top 5 skills from `INDEX.md`.

---

## Phase 5 — Agents

Explain:

> Agents are specialized sub-Claudes spawned for a single job — researching a topic, auditing code, drafting a proposal. 39 total: 21 engineering + 18 agency. You never call them directly; workflows spawn them.

Show:
```bash
ls ~/.claude/agents/ | head -10
```

Don't dump all 39 — offer: _"Want the full roster? See README.md → Agent Roster section."_

---

## Phase 6 — Hooks & guardrails

Explain:

> Hooks are small scripts that fire on lifecycle events (session start, before a tool call, after a compact). SHINE ships 8: context-size warnings, secret-write blocking, noisy-path warnings, update checks, learning log, etc. They fail **open** (session continues) except `shine-prompt-guard.js` which fails **closed** to block secret leaks.

Quick demo — show the guard actually works:
```bash
echo '{"tool_name":"Write","tool_input":{"file_path":".env","content":"OPENAI_API_KEY=sk-abcd1234567890abcd1234567890"}}' \
  | node ~/.claude/hooks/shine-prompt-guard.js; echo "exit=$?"
```

Expected: exit=2 and a block message. This is the safety net in action.

---

## Phase 7 — Mini-workflow demo (read-only)

Run one real thing the user can copy:

```
# What phase am I in? (for any project)
node ~/.claude/shine/bin/shine-tools.cjs doctor

# Regenerate the skill index
node ~/.claude/shine/bin/shine-tools.cjs index-skills

# See what memory you have
ls ~/.claude/memory/
```

Explain what each output means, line by line.

---

## Phase 8 — Final summary + tour report

Print:
```
🎉 Tour complete.

Pass: 14 / 14 checks    Duration: 5m 42s
Memory files: 5         Skills: 140         Agents: 39

Next steps:
  • /shine-help         → full command reference
  • /shine-retro        → weekly memory review (after a few sessions)
  • /shine-pipeline a b → compose skills ad-hoc
  • Edit ~/.claude/memory/*.md to personalize further

Tour report saved: ~/.claude/sessions/tour-<TS>.md
```

Write the tour report: a markdown transcript of every check + user answer + any fix applied. This is the audit trail.

</execution_flow>

<troubleshooting>

Every known failure mode, with a copy-paste fix. Surface the relevant row when a check fails.

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `command not found: claude` | Claude Code not installed | `curl -fsSL https://claude.ai/install.sh \| sh` or see https://docs.claude.com/claude-code |
| `node: command not found` | Node missing | macOS: `brew install node`. Ubuntu: `sudo apt install nodejs`. Or https://nodejs.org |
| `~/.claude/` doesn't exist | Installer never ran or ran under wrong user | Clone the repo, `cd` into it, run `./install.sh`. Do **not** run as root |
| `settings.json` invalid JSON | Hand-edit broke it | `cp ~/.claude-backup-*/settings.json ~/.claude/settings.json` (latest backup), or re-run installer — it preserves customization |
| Hook fires but nothing happens | Hook path wrong in `settings.json` | Paths must be `$HOME/.claude/hooks/<name>`. Check with `cat ~/.claude/settings.json \| grep command`. Re-run installer if broken |
| `shine-prompt-guard` exits 2 on every write | False positive on your content | Set `SHINE_DISABLE_PROMPT_GUARD=1` for that session only. Don't commit this to your shell rc — defeats the safety net |
| Transcripts feel slow / warning spam | Context-monitor soft threshold too low for your usage | Raise: `export SHINE_CONTEXT_SOFT_KB=1200 SHINE_CONTEXT_SOFT_TOKENS=180000` |
| `/shine-retro` says "No learning-log yet" | Stop hook hasn't fired enough times | Work normally for a day. The log appends one line per Claude turn |
| Memory not loading | `~/.claude/memory/MEMORY.md` missing or wrong frontmatter | Run `node ~/.claude/shine/bin/shine-tools.cjs onboard` |
| Plugin install errors during `./install.sh` | Network issue or `claude` not logged in | Run `claude` once manually to authenticate, then re-run `./install.sh --no-backup` |
| `MCP server disconnected` | MCP credentials missing or expired | Run `claude mcp list`, check which is red, re-authenticate per that server's docs |
| Skill slash command not found | Skill installed but Claude Code cached old list | Restart Claude Code. Skills are read from `~/.claude/skills/` at session start |
| `shine-tools.cjs` errors on `index-skills` | Frontmatter in one skill is malformed | Error message names the bad file. Fix the YAML (usually an unquoted colon) |
| `learning-log.jsonl` grows too fast | Very long sessions or very many turns | Lower cap: `export SHINE_LEARNING_LOG_MAX=2000`. Or disable: `SHINE_DISABLE_LEARNING_LOG=1` |
| Hooks double-fire | Old install + new install both present | Check for `~/.claude/hooks/` duplicates. Re-run installer — it overwrites, doesn't stack |
| `git` conflict in `CLAUDE.md` after a pull | You hand-edited the `<!-- shine:plugins:begin -->` block | That block is auto-managed by `integration-sync.js`. Revert just that block; keep your other edits |
| Backups piling up | `~/.claude-backup-*/` from every install | Safe to delete old ones: `ls -dt ~/.claude-backup-* \| tail -n +3 \| xargs rm -rf` (keeps 2 most recent) |
| On Windows / WSL | Hook paths use `$HOME` which works in WSL but not pure Windows | SHINE is POSIX-only. Use WSL2 |
| Permission denied on hook files | `chmod` lost during copy | `chmod -R u+rX ~/.claude/hooks/ ~/.claude/shine/bin/` |
| `doctor` reports `ok: false` but install looks fine | You're running it from inside the repo, not against installed `~/.claude/` | That's expected — `doctor` checks the **installed** `~/.claude/`, not the repo. Run it after `./install.sh` |

</troubleshooting>

<guardrails>
- **Never modify existing memory / agent / skill / hook files** during the tour. Only `onboard` may write, and only with explicit y/N confirmation.
- **Never print more than ~30 lines** of any file inline. Always offer the path for the user to open separately.
- **Never skip a failed check silently.** Every `✗ FAIL` must be surfaced in the final summary, even if the user moved on.
- **Never auto-apply a fix** without explicit `y` from the user — `--fix` changes the default prompt wording but does not remove the confirmation step.
- **Tour is PII-free.** The tour-report logs checks and user yes/no answers — never the content of their memory files or prompts.
- **Fail open for the tour itself.** If a check errors (e.g., `node --check` throws for some obscure reason), log it as `⚠ WARN` and keep going — don't halt the tour on a meta-failure.
</guardrails>

<error_handling>
- **`claude` CLI missing** → skip the interactive Q&A, print install instructions, exit 0.
- **`~/.claude/` missing entirely** → print "Run `./install.sh` from the repo first", exit 0. Don't try to fix.
- **`settings.json` unparseable** → flag as FAIL with path to latest backup; don't attempt auto-repair.
- **User answers "n" to "Ready?"** → exit 0 cleanly with pointer to `/shine-help`.
- **User Ctrl-Cs mid-tour** → no cleanup needed (read-mostly). Any partial tour-report file is still useful.
- **Section name unknown with `--section foo`** → list valid sections, exit 1.
</error_handling>

<output_format>
Tour report structure (written at end):
```
# SHINE Tour — <YYYY-MM-DD HH:MM:SS>

**User:** <whoami> · **Host:** <hostname> · **Duration:** <M:SS>

## Install health
| Check | Status | Notes |
|-------|--------|-------|
| … | ✓ PASS | — |

## Sections completed
- [x] Install
- [x] Rules
- [ ] Memory  (user skipped)
…

## Fixes applied
- Ran `shine-tools.cjs onboard` — created 5 memory files.

## Open issues
- None.
```
</output_format>

<structured_returns>
Exit 0 on successful tour (all sections visited or skipped cleanly).
Exit = (number of unfixed failed checks) when `--check-only` is passed.
Exit 1 on unknown `--section` value.
</structured_returns>
