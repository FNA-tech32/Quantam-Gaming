# Workflow — do

Freeform execution with scope-detection guardrails. Use for single-file or tightly-scoped changes; escalate to `plan-phase` when scope creeps.

## Prerequisites
- Clean or nearly-clean working tree (uncommitted tracked files < 5).
- Project root detected (`shine-tools.cjs init 0 --raw` returns cwd).

## Steps
1. **Scope detection** — Count files matched by the user's request pattern. Use Glob/Grep.
   - 1 file → proceed directly.
   - 2–5 files, same subsystem → proceed with a note.
   - > 5 files OR cross-subsystem → STOP; suggest `/shine-plan-phase`.
2. **Confirm scope** — Echo the file list back to the user: _"Touching N files: …. Proceed?"_
3. **Execute** — Make edits with Edit/Write. Never touch files outside the confirmed set.
4. **Inline verify** — If tests exist (`package.json` scripts, `pytest`, etc.), run the narrowest suite that covers the change.
5. **Commit** — `node shine/bin/shine-tools.cjs commit "<imperative summary>" --scope do`
6. **Report** — 5-section canonical. Summary = what shipped + test result.

## Decision gates
- Before write: show file list + diff preview.
- Before commit: show final diff summary.
- If verify fails: do NOT commit, surface failure, propose fix.

## Error handling
- Dirty tree → offer `git stash` or abort.
- Scope explodes mid-edit → stop, commit what's safe, escalate.
- Tests fail → revert uncommitted edits on request.

## Guardrails
- Respect `~/.claude/shine/references/ui-brand.md`.
- Never write to `.env*`, `*.pem`, `credentials.json`.
- Never auto-run destructive shell (rm -rf, drop table, force push).
