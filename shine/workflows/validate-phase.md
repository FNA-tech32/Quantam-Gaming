# Workflow — validate-phase

Phase completeness check: verify all artifacts exist and all gates pass before marking a phase done.

## Prerequisites
- Phase has been executed (at least partially).

## Steps

1. **Load phase state**  
   `node shine/bin/shine-tools.cjs init <N> --raw` → `phase_dir`, `plans`.  
   `node shine/bin/shine-tools.cjs state <N> --raw` → current status.

2. **Artifact checklist**  
   Check each required artifact exists and is non-empty:
   
   | Artifact | Required | Check |
   |----------|----------|-------|
   | `CONTEXT.md` | ✅ | Exists, "Obiettivi" section non-empty |
   | `plan-*.md` files | ✅ | At least one plan file exists |
   | Matching commits | ✅ | Each plan has a corresponding `shine(exec):` commit |
   | `VERIFY.md` | ✅ | Exists, all checks show ✅ |
   | `SUMMARY.md` | ✅ | Exists, has Summary + Lessons sections |
   | `STATE.md` | ✅ | All tasks marked `done` |
   | `TODO.md` | Optional | If exists, no open P1 items |

3. **Open questions check**  
   Read CONTEXT.md "NON sappiamo" section:
   - All items should be resolved (checked off) or explicitly accepted as risks.
   - Any unchecked item → 🔴 blocker.

4. **Plan-commit traceability**  
   For each `plan-*.md` in the phase dir:
   - Search git log for a commit referencing this plan or its scope.
   - If no matching commit → 🔴 plan was never executed.

5. **Test gate**  
   If the project has tests:
   - Run the test suite.
   - All tests must pass.
   - If coverage tracking exists: coverage must not have decreased.

6. **TODO gate**  
   If `TODO.md` exists in the phase dir:
   - No open P1 items allowed.
   - Open P2/P3 items: warn but don't block.

7. **Report**  
   ```
   ## Phase <N> validation
   
   ### Gate results
   | Gate | Status | Details |
   |------|--------|---------|
   | CONTEXT.md complete | ✅/🔴 | |
   | All plans executed | ✅/🔴 | X/Y plans have commits |
   | VERIFY.md passes | ✅/🔴 | |
   | SUMMARY.md written | ✅/🔴 | |
   | Open questions resolved | ✅/🔴 | N unresolved |
   | Tests pass | ✅/🔴 | X/Y pass |
   | No P1 TODOs | ✅/🔴 | |
   
   ### Verdict: <pass | fail — N gates failing>
   
   ### Remediation (if failing)
   1. <specific action for each failing gate>
   ```

## Guardrails
- Never mark a phase as "validated" if any 🔴 gate is failing.
- Never fabricate evidence — if an artifact is missing, it's missing.
