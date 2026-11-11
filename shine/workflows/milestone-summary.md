# Workflow — milestone-summary

Aggregate all phase SUMMARY.md files into a single milestone-level summary. Useful for stakeholder reporting and retrospectives.

## Prerequisites
- Milestone has at least one phase with a SUMMARY.md.

## Steps

1. **Collect phase summaries**  
   `node shine/bin/shine-tools.cjs roadmap --raw` → list phases in the milestone.  
   For each phase: read `<phase_dir>/SUMMARY.md`.

2. **Extract key data per phase**  
   From each SUMMARY.md, pull:
   - What shipped (deliverables)
   - Key metrics (LOC, commits, duration)
   - Lessons learned
   - Open follow-ups

3. **Aggregate metrics**  
   ```
   | Metric | Total |
   |--------|------:|
   | Phases completed | X/Y |
   | Total commits | N |
   | LOC added | +X |
   | LOC removed | -Y |
   | Duration | Z days |
   | Verify pass rate | N% |
   ```

4. **Deduplicate lessons**  
   Merge similar lessons across phases. Group by theme:
   - Process lessons (planning, estimation, communication)
   - Technical lessons (architecture, tooling, testing)
   - Client lessons (requirements, feedback, expectations)

5. **Synthesize narrative**  
   Write a one-paragraph executive summary:
   _"Milestone <slug> delivered <key outcomes> across <N> phases in <duration>. Key wins: <top 3>. Key lessons: <top 3>."_

6. **Render consolidated summary**  
   ```
   # Milestone summary — <slug>
   
   ## Executive summary
   <one paragraph>
   
   ## Deliverables
   | Phase | What shipped |
   |-------|-------------|
   
   ## Metrics
   <aggregate table>
   
   ## Lessons learned
   ### Process
   - <lesson>
   ### Technical
   - <lesson>
   ### Client
   - <lesson>
   
   ## Open follow-ups
   <items carried forward to next milestone>
   ```

7. **Optional: export**  
   Offer to generate a client-facing version (strip internal notes, format for presentation).

## Guardrails
- Never fabricate metrics — only aggregate what's in the SUMMARY.md files.
- If a phase lacks SUMMARY.md, note it as "[no summary available]" — don't skip silently.
