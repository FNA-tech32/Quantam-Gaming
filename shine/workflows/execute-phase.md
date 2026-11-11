# Workflow — execute-phase

Execute a planned SHINE phase to completion with atomic commits and wave parallelism.

## Prerequisites
- A plan exists: `shine/bin/shine-tools.cjs phase <N> --raw` returns `has_context: true` and at least one `plan-*.md`.
- Working tree is clean (or changes are intentional).
- REQUIREMENTS.md exists at project root.

## Steps

1. **Load context**  
   Run: `node shine/bin/shine-tools.cjs init <N> --raw` → capture `phase_dir`, `state_path`, `plans`, `config`.

2. **Read the plan**  
   For each file in `plans`, Read the content. Parse frontmatter with `frontmatter <file> --raw` to get wave/ordering metadata.

3. **Build the wave graph**  
   Group plans by `wave: <n>`. Items in the same wave run in parallel via the Task tool (spawn `shine-executor` subagents). Items in wave N+1 wait for wave N to finish.

4. **Execute each wave**  
   For each wave:
   - Spawn one subagent per plan file via Task → `shine-executor`.
   - Pass the plan path + phase dir + CONTEXT.md.
   - Wait for all subagents to return.
   - If any fails, stop and surface the failure — do NOT proceed to the next wave.

5. **Commit after each wave**  
   `node shine/bin/shine-tools.cjs commit "phase <N> wave <w> complete" --scope exec --raw`

6. **Verify**  
   `node shine/bin/shine-tools.cjs verify <N> --check all --raw`. All checks must pass.

7. **Mark state done**  
   `node shine/bin/shine-tools.cjs state <N> --set status=done --raw`

8. **Generate SUMMARY.md**  
   Write `<phase_dir>/SUMMARY.md` with: what shipped, diffs, test evidence, open follow-ups.

## Decision gates
- Before wave 1: confirm scope with user if plan ambiguity > 20%.
- Before commit: show diff summary.
- Before marking done: show verify report.

## Output
- Code changes committed with `shine(exec): …` messages.
- `STATE.md` updated per step.
- `SUMMARY.md` at the end.

## Error handling
- Subagent fails → keep STATE.md intact, report back with 5-section format.
- Git commit fails → surface `git status`, ask user; never retry silently.
- Verify fails → do not mark done; propose fix.
