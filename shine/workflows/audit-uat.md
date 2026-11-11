# Workflow — audit-uat

Review UAT.md: reconcile test-case status with actual deliverables, detect stale items, assess sign-off readiness.

## Prerequisites
- Project has a `UAT.md` (or we create one from `shine/templates/UAT.md`).

## Steps

1. **Load or create UAT.md**  
   Read `.shine/UAT.md` or `./UAT.md`.  
   If missing: copy from `shine/templates/UAT.md` and populate from REQUIREMENTS.md Must items.

2. **Parse test-case table**  
   Extract: ID · test case description · expected result · actual status · owner · last-updated date.

3. **Verify "pass" claims**  
   For each test case marked `pass`:
   - Search for evidence: commit ref, test file, screenshot, or manual note.
   - If no evidence found → downgrade to 🟡 `unverified`.

4. **Detect stale items**  
   For each `pending` item:
   - If last-updated > 14 days ago → flag 🟡 stale.
   - If last-updated > 30 days ago → flag 🔴 abandoned.

5. **Route failures**  
   For each `fail` item:
   - Check if a fix commit exists since the failure was recorded.
   - If fixed → suggest re-test.
   - If not fixed → route to `/shine-debug` with the failure details and owner.

6. **Coverage check**  
   Cross-reference UAT test cases against REQUIREMENTS.md Must items:
   - Every Must should have at least one test case.
   - Flag uncovered Must items as 🔴.

7. **Sign-off readiness**  
   Calculate: `pass_rate = verified_pass / total_cases`.  
   Ready if: pass_rate = 100% AND zero `fail` AND zero 🔴 uncovered.

8. **Update and commit**  
   Update status column in UAT.md with verification results.  
   `node shine/bin/shine-tools.cjs commit "uat audit" --scope uat --raw`

## Output
```
## UAT audit — <date>

### Readiness: <ready | not ready — N items to resolve>

### Summary
| Status | Count |
|--------|------:|
| ✅ Verified pass | X |
| 🟡 Unverified pass | Y |
| ⏳ Pending | Z |
| 🔴 Fail | W |

### Issues
| ID | Issue | Action |
|----|-------|--------|

### Requirement coverage
| Must requirement | Test case(s) | Status |
```

## Guardrails
- Never mark a test case as "pass" without evidence.
- Never remove a test case — only update its status.
- Sign-off requires explicit user confirmation, not just metrics.
