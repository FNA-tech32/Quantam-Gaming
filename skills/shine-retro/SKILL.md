---
name: shine-retro
description: "Cross-session retrospective — review learning-log.jsonl and propose memory updates"
argument-hint: "[--days N] [--apply]"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
---

<objective>
Review recent activity captured by the `shine-learning-log` hook (`~/.claude/memory/learning-log.jsonl`) and propose concrete updates to the user's typed memory (`~/.claude/memory/*.md`) so Claude gets steadily more useful across sessions.

This is a **read + propose** skill. It never overwrites memory without explicit user approval — unless `--apply` is passed, in which case it writes a single `~/.claude/memory/external-retro-<date>.md` summary (never touches existing files).
</objective>

<execution_context>
@~/.claude/shine/references/ui-brand.md
</execution_context>

<context>
Flags:
- `--days N` — only consider entries from the last N days (default: 7).
- `--apply` — write a new `external-retro-<YYYY-MM-DD>.md` memory file with the approved findings. Does **not** modify any other memory file.

Data sources (both metadata-only, PII-free):
- `~/.claude/memory/learning-log.jsonl` — one JSONL entry per Claude turn (per-turn analytics).
- `~/.claude/memory/learning-log.md` — one human-readable block per session (written by the `shine-session-summary` hook at SessionEnd). Contains **placeholders** the user and Claude fill in during this retro: `Task`, `Outcome`, `Preference observed`.

If both logs are missing or empty, exit politely: nothing to review.
</context>

<execution_flow>
1. **Locate and read the logs.**
   ```bash
   JSONL="$HOME/.claude/memory/learning-log.jsonl"
   MD="$HOME/.claude/memory/learning-log.md"
   test -s "$JSONL" || test -s "$MD" || { echo "No learning-log yet — run a few sessions first."; exit 0; }
   ```

   Read the **last N days of JSONL** (turn-level metadata) and the **session blocks in learning-log.md** (including any unfilled `Task / Outcome / Preference observed` placeholders — those become the first questions for the user).

2. **Filter by window.** Use `--days N` (default 7). Parse `ts` (ISO-8601) and keep entries where `ts >= now - N days`.

3. **Aggregate patterns.** Compute:
   - Total turns, unique `cwd` roots, busiest day.
   - `last_tool` frequency (top 10).
   - Average/median transcript size; count of turns crossing the soft token threshold (proxy for long sessions).
   - Repeated `cwd` paths that don't have a matching `project-*.md` in memory.

4. **Read current memory index.** `ls ~/.claude/memory/*.md` and categorize by prefix (`preference-`, `client-`, `project-`, `style-`, `external-`).

5. **Generate a retrospective report** — markdown, concise, 4 sections:
   - **Activity snapshot** (counts, top tools, top cwds).
   - **Gaps detected** (cwds with no matching project memory; overused tools that could be templated into a skill; long sessions suggesting a missing `/compact` habit).
   - **Proposed memory updates** — concrete diffs: "Add `project-<slug>.md` with … " / "Extend `preference-stack.md` with `tool X used 42× this week`".
   - **Open questions** — things that need the user's input before any change lands.

6. **Present the report to the user** and ask: _"Apply these as a new `external-retro-<date>.md` memory file? (y/N)"_

7. **If `--apply` or user confirms:** write `~/.claude/memory/external-retro-<YYYY-MM-DD>.md` with today's findings. Never edit existing memory files — propose, don't overwrite.

8. **Log outcome.** Print a 1-line summary and stop.
</execution_flow>

<guardrails>
- **Never** modify any existing `~/.claude/memory/*.md` file. Only create `external-retro-<date>.md` (and only on confirmation or `--apply`).
- **Never** read conversation transcripts directly — the log is the only source. The log captures metadata only (no prompts, no content).
- If the log is absent, malformed, or smaller than 10 entries, say so and stop — don't extrapolate from thin data.
- Treat every proposal as tentative — label them _"suggested, pending approval"_ in the report.
- PII discipline: the log is already PII-free. Don't enrich proposals with anything pulled from the user's file system beyond memory file names.
</guardrails>

<error_handling>
- **Log missing**: print "No learning-log yet — run a few sessions first." and exit 0.
- **Log malformed**: skip bad lines, continue with the rest, note the count of skipped lines in the report.
- **Memory dir missing**: print "No ~/.claude/memory/ directory found. Run `shine-tools.cjs onboard` first." and exit 0.
- **--apply but no log entries in window**: refuse to write an empty retro file.
</error_handling>

<output_format>
Report markdown structure (always):
```
## SHINE Retro — <YYYY-MM-DD>

**Window:** last N days · **Turns:** X · **Unique projects:** Y

### Activity snapshot
- …

### Gaps detected
- …

### Proposed memory updates
- [ ] …

### Open questions
- …
```
</output_format>

<structured_returns>
On success: prints the report and (if applied) the path to the new external-retro file.
On no-op: single line "No learning-log yet — run a few sessions first."
</structured_returns>
