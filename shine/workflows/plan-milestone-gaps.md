# Workflow — plan-milestone-gaps

Detect gaps between milestone requirements and existing phase plans. Ensure every Must/Should requirement has coverage.

## Prerequisites
- ROADMAP.md and REQUIREMENTS.md exist.
- At least one phase has been planned.

## Steps

1. **Load requirements**  
   `node shine/bin/shine-tools.cjs requirements --raw` → structured sections.  
   Extract all Must and Should items with their descriptions.

2. **Load phase plans**  
   For each phase in the milestone:
   - `node shine/bin/shine-tools.cjs phase <N> --raw` → list of plan files.
   - Read each plan file's title and scope description.

3. **Build coverage matrix**  
   For each requirement, search across all plan files for keyword/feature coverage:
   ```
   | Requirement | Priority | Phase 1 | Phase 2 | Phase 3 | Covered? |
   |-------------|----------|---------|---------|---------|----------|
   | Payment gateway | Must | — | plan-payment.md | — | ✅ |
   | Email notifications | Must | — | — | — | 🔴 |
   | Dark mode | Should | — | — | plan-ui-theme.md | ✅ |
   | Multi-language | Could | — | — | — | ⬜ (ok) |
   ```

4. **Gap classification**  
   - 🔴 Must without coverage → **blocker** — must add a phase or plan.
   - 🟡 Should without coverage → **risk** — should plan or explicitly descope.
   - ⬜ Could without coverage → acceptable — note for future milestone.

5. **Propose remediation**  
   For each gap:
   - If it fits in an existing phase → propose a new plan file for that phase.
   - If it needs its own phase → propose `/shine-add-phase` with title and goal.
   - If it should be descoped → propose moving to "Won't" in REQUIREMENTS.md.

6. **Report**  
   ```
   ## Gap analysis — Milestone <slug>
   
   ### Coverage summary
   | Priority | Total | Covered | Gaps |
   |----------|------:|--------:|-----:|
   | Must | X | Y | Z |
   | Should | X | Y | Z |
   
   ### Gaps requiring action
   | # | Requirement | Priority | Proposed action |
   |---|-------------|----------|-----------------|
   | 1 | Email notifications | Must | Add plan to Phase 3 |
   | 2 | Analytics dashboard | Should | New Phase 5 or descope |
   
   ### Full coverage matrix
   <the matrix from step 3>
   ```

## Guardrails
- Never mark a requirement as "covered" without a specific plan file reference.
- Must gaps are non-negotiable — they must be planned before the milestone can ship.
