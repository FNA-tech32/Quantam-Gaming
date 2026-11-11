# Workflow — audit-milestone

Cross-phase audit of a milestone: deliverable checklist, gap detection, readiness assessment.

## Prerequisites
- Milestone exists in ROADMAP.md with at least one phase.

## Steps

1. **Load milestone**  
   Parse ROADMAP.md for the target milestone. List all phases with statuses.

2. **Phase-level verification**  
   For each phase in the milestone:
   - `SUMMARY.md` exists? Content is non-empty?
   - `VERIFY.md` exists? All checks passed?
   - `STATE.md` shows `status=done`?
   Build a phase-health table.

3. **Deliverable traceability**  
   For each stated deliverable in the milestone header or REQUIREMENTS.md:
   - Search for evidence: file exists, commit references it, test covers it.
   - Rate: ✅ delivered (with evidence) · 🟡 partial · 🔴 missing.

4. **Gap analysis**  
   For each 🟡/🔴 deliverable:
   - Identify which phase was supposed to deliver it.
   - Check if it was planned but not executed, or never planned.
   - Propose: new phase, plan amendment, or scope reduction.

5. **Quality gate**  
   - All Must requirements covered? (cross-ref with REQUIREMENTS.md)
   - All phases verified?
   - No open blockers in any STATE.md?

6. **Write audit report**  
   ```
   ## Milestone audit — <slug>
   
   ### Phase health
   | Phase | SUMMARY | VERIFY | STATE | Status |
   |-------|---------|--------|-------|--------|
   
   ### Deliverable traceability
   | Deliverable | Priority | Evidence | Status |
   |-------------|----------|----------|--------|
   
   ### Gaps
   | Gap | Severity | Proposed action |
   
   ### Verdict
   <ready to ship | N gaps to close first>
   ```

## Guardrails
- Never mark a gap closed without traceable evidence (commit, file, test).
- Never fabricate evidence — if it's not there, it's 🔴.
