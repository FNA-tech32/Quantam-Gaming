# Workflow — complete-milestone

Archive a completed milestone: verify, summarize, move, update roadmap.

## Prerequisites
- All phases in the milestone are `done`.
- `shine/templates/milestone-archive.md` exists.

## Steps
1. **Completeness gate** — `shine-tools.cjs roadmap --raw`; assert every phase in milestone M has `status=done`. Else abort.
2. **Gather metrics** — per phase: commit count (`git log --grep "shine(.*): " --since <start>`), LOC delta, wave count, verify result.
3. **Synthesize lessons** — scan every `phase-*/SUMMARY.md` for "Lessons learned" block; dedupe and aggregate.
4. **Render archive** — use `shine/templates/milestone-archive.md`:
   - outcome (what shipped)
   - metrics (phases, commits, LOC, duration)
   - wins / misses / surprises
   - lessons learned → promote to `~/.claude/memory/preference-*.md` or `style-*.md` as appropriate
5. **Move artifacts** — `.shine/milestones/m-<slug>-<YYYYMMDD>/` with all phase dirs + `ARCHIVE.md`.
6. **Update ROADMAP.md** — mark milestone section `[archived]`; next milestone promoted to active.
7. **Commit** — `shine-tools.cjs commit "milestone <slug>: archive" --scope milestone`.

## Output
- `.shine/milestones/m-<slug>-<date>/ARCHIVE.md` (the deliverable)
- Optional: client-facing PDF via `/shine-exec-summary`

## Guardrails
- Never delete phase dirs — only move.
- Lessons promoted to memory require user review (show diff before writing).
- If any phase lacks SUMMARY.md, run `/shine-verify-work <N>` first.

## Error handling
- Phase still in-progress → abort with phase name.
- Template missing → copy from `shine/templates/milestone-archive.md`; if still missing, abort.
