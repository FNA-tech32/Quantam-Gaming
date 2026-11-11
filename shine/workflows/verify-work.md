# Workflow — verify-work

Goal-backward verification: does what was built actually satisfy the phase goals and REQUIREMENTS?

## Prerequisites
- Phase has been executed (at least one `shine(exec):` commit exists).
- `shine/templates/UAT.md` is available for test-case tracking.

## Steps

1. **Load context**  
   `node shine/bin/shine-tools.cjs init <N> --raw` → `phase_dir`, `plans`.  
   Read `<phase_dir>/CONTEXT.md` — extract stated goals from "Obiettivi" section.  
   Read `REQUIREMENTS.md` — extract Must/Should items relevant to this phase.

2. **Goal-backward check**  
   For each goal in CONTEXT.md:
   - Search codebase for evidence (file, test, commit) that the goal is met.
   - Rate: ✅ met (with evidence) · 🟡 partially met · 🔴 not met.
   - For 🔴: identify the specific gap and which plan was supposed to cover it.

3. **Requirement coverage**  
   For each Must/Should in REQUIREMENTS.md scoped to this phase:
   - Grep for implementation evidence.
   - Cross-reference with plan files: was it planned? Was the plan executed?

4. **Code quality gate**  
   `node shine/bin/shine-tools.cjs verify <N> --check all --raw` — runs:
   - `goal-backward`: plan files exist and match goals
   - `task-completion`: STATE.md shows all tasks done
   - `code-quality`: lint/test pass (if configured)

5. **Test evidence**  
   - If test suite exists: run it, capture pass/fail count.
   - If no tests: flag as 🟡 and recommend `/shine-add-tests`.

6. **Write VERIFY.md**  
   Write `<phase_dir>/VERIFY.md` in 5-section canonical format:
   ```
   ## Summary
   Phase <N> verification: <pass | partial | fail>. X/Y goals met, Z/W requirements covered.
   
   ## Goal verification
   | # | Goal | Evidence | Status |
   |---|------|----------|--------|
   | 1 | <goal text> | <file/commit/test> | ✅/🟡/🔴 |
   
   ## Requirement coverage
   | Req | Priority | Covered | Evidence |
   |-----|----------|---------|----------|
   
   ## Test results
   <test output or "no tests — recommend /shine-add-tests">
   
   ## Open items
   - <any gaps, follow-ups, or risks>
   
   ## Next step
   <pass → mark done | fail → specific fix action>
   ```

7. **State update (only on full pass)**  
   If all goals ✅ and all Must requirements covered:  
   `node shine/bin/shine-tools.cjs state <N> --set status=done --raw`  
   Else: leave state as-is, surface the gaps.

## Decision gates
- Before marking done: show full VERIFY.md to user for confirmation.
- On partial pass: user decides whether to accept or fix.

## Error handling
- Cannot access source files → abort, never fabricate a pass.
- Tests fail → report failure, do NOT mark phase done.
- CONTEXT.md missing goals → refuse to verify; route to `/shine-discuss-phase <N>`.
