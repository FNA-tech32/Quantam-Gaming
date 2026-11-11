# Workflow — discuss-phase-power

Deep-dive discussion variant: comprehensive requirements elicitation for complex or high-stakes phases. Uses the full questioning framework including stakeholder mapping and constraint analysis.

## Prerequisites
- Phase exists in ROADMAP.md.
- User has ≥ 30 minutes for an in-depth session.
- Ideally: client brief or project brief available.

## Steps

1. **Load context**  
   `node shine/bin/shine-tools.cjs init <N> --raw`. Read existing CONTEXT.md if any.  
   Load `shine/references/questioning.md` — use the full framework, not the abbreviated version.

2. **Discovery call format**  
   Follow `questioning.md §6 — Discovery call template` (30-min structure):
   ```
   00:00  Intro & goals for the call                    (3 min)
   00:03  Business context — why now, what's changing   (7 min)
   00:10  Current state — what exists today             (5 min)
   00:15  Desired outcome — 5-Why                       (7 min)
   00:22  Constraints & guardrails                      (5 min)
   00:27  Recap + next step + sign-off                  (3 min)
   ```

3. **5-Why deep ladder**  
   Apply the full 5-Why from `questioning.md §2` on the stated outcome.  
   Go until the answer becomes a strategic decision, not a tactical one.  
   Record each level in CONTEXT.md.

4. **MoSCoW elicitation**  
   Use the exact prompts from `questioning.md §3`:
   - Must: _"If we only ship one thing and the project is a success, what is it?"_
   - Should: _"What would be disappointing to miss, but we could live without for v1?"_
   - Could: _"What's a nice-to-have that would delight but isn't expected?"_
   - Won't: _"What are we explicitly NOT doing this round, and why?"_

5. **Assumption stress-test**  
   Run the full checklist from `questioning.md §4`:
   - [ ] Data availability confirmed?
   - [ ] Third-party APIs have docs + sandbox?
   - [ ] Legal/GDPR reviewed?
   - [ ] Budget envelope confirmed by decision-maker?
   - [ ] Timeline validated against team capacity?
   - [ ] Definition of Done agreed?

6. **Red-flag check**  
   Apply `questioning.md §7 — Red flags`. If any fire:
   - 🔴 No measurable outcome → do NOT proceed to planning.
   - 🔴 Scope exceeds budget by > 2x → escalate to stakeholder.
   - 🔴 Key assumption unverifiable → flag as project risk.

7. **Stakeholder map**  
   Build a stakeholder table in CONTEXT.md:
   ```
   | Role | Name | Influence | Interest | Communication |
   |------|------|-----------|----------|---------------|
   | Decision maker | | High | High | Weekly sync |
   | Technical lead | | High | Medium | PR reviews |
   | End user rep | | Low | High | UAT sessions |
   ```

8. **Write comprehensive CONTEXT.md**  
   Fill all sections including "Vincoli", "Dipendenze", and the stakeholder map.  
   This should be the single source of truth for the phase.

9. **Commit**  
   `node shine/bin/shine-tools.cjs commit "deep discuss: phase <N>" --scope discuss --raw`

## Decision gates
- After 5-Why: confirm root cause before proceeding to MoSCoW.
- After MoSCoW: show prioritized scope for sign-off.
- After red-flag check: if any 🔴, require explicit user decision before continuing.
- Before commit: read back the full CONTEXT.md for final approval.

## Output
- Comprehensive `<phase_dir>/CONTEXT.md` with all sections filled.
- Stakeholder map.
- Risk register (from assumption stress-test).

## Error handling
- User can't answer a question → record as "NON sappiamo" with impact note.
- Contradictions between stakeholders → flag explicitly, do not resolve silently.
- Session interrupted → commit partial CONTEXT.md with `[INCOMPLETE]` marker.
