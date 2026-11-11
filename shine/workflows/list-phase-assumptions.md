# Workflow — list-phase-assumptions

Extract, classify, and display all assumptions from a phase's CONTEXT.md with confidence ratings.

## Prerequisites
- Phase exists with a CONTEXT.md file.

## Steps

1. **Load CONTEXT.md**  
   `node shine/bin/shine-tools.cjs init <N> --raw` → `phase_dir`.  
   Read `<phase_dir>/CONTEXT.md`.

2. **Parse assumption blocks**  
   Extract content from:
   - "Cosa assumiamo" section → explicit assumptions
   - "Cosa NON sappiamo" section → implicit assumptions (unknowns that imply assumptions)
   - "Vincoli" section → constraint-based assumptions
   - "Dipendenze & assumptions" section → dependency assumptions

3. **Classify each assumption**  
   For each extracted assumption:
   - **Type**: technical · business · data · legal · resource · timeline
   - **Confidence**: 🟢 verified (evidence exists) · 🟡 likely (reasonable but unverified) · 🔴 risky (no evidence or contradictory signals)
   - **Impact if wrong**: scope change · timeline slip · budget overrun · quality degradation · project failure
   - **Evidence**: cite the source if confidence is 🟢 (commit, doc, client confirmation)

4. **Cross-reference with execution**  
   If the phase has been (partially) executed:
   - Check if any assumption was invalidated by what was built.
   - Check if any assumption was validated by test results or deliverables.
   Update confidence accordingly.

5. **Route high-risk assumptions**  
   For each 🔴 assumption:
   - If an `assumptions-analyzer` agent exists → route for deeper analysis.
   - Otherwise: propose a validation action (spike, client call, data check).

6. **Display**  
   ```
   ## Assumptions — Phase <N>: <title>
   
   ### Risk summary
   🟢 Verified: X · 🟡 Likely: Y · 🔴 Risky: Z
   
   ### Full matrix
   | # | Assumption | Type | Confidence | Impact if wrong | Validation |
   |---|------------|------|------------|-----------------|------------|
   | 1 | Client API supports batch | technical | 🟡 | scope change | Spike: test batch endpoint |
   | 2 | Budget approved for Q3 | business | 🟢 | project halt | Email from CFO (2026-04-10) |
   | 3 | GDPR consent flow exists | legal | 🔴 | launch block | Check with DPO |
   
   ### Recommended actions
   1. [🔴] Verify GDPR consent flow → schedule DPO call
   2. [🟡] Test batch API → create spike task
   ```

## Guardrails
- Never fabricate confidence levels — if there's no evidence, it's 🟡 or 🔴.
- Never remove an assumption from the list — only update its status.
