# Workflow — discuss-phase-assumptions

Focused discussion variant: surface, classify, and stress-test assumptions before planning.

## Prerequisites
- Phase exists in ROADMAP.md.
- CONTEXT.md exists for the phase (run `/shine-discuss-phase` first if not).

## Steps

1. **Load existing context**  
   `node shine/bin/shine-tools.cjs init <N> --raw`. Read `<phase_dir>/CONTEXT.md`.  
   Extract the "Cosa assumiamo" section.

2. **Assumption inventory**  
   If the section is empty, seed it by scanning:
   - REQUIREMENTS.md for implicit assumptions ("the client will provide…", "we assume…")
   - Prior phase SUMMARY.md for carry-forward assumptions
   - Plan files for technical assumptions ("API supports…", "DB schema has…")

3. **Classification loop** — for each assumption, ask the user:
   - **Impact**: if wrong, what breaks? (scope / timeline / budget / quality)
   - **Confidence**: 🟢 verified (cite evidence) · 🟡 likely (no hard evidence) · 🔴 risky (contradictory signals or no data)
   - **Validation method**: how could we verify this before it bites? (spike, prototype, client call, data check)

4. **Risk matrix**  
   Build and display:
   ```
   | # | Assumption | Impact | Confidence | Validation | Owner |
   |---|------------|--------|------------|------------|-------|
   ```
   Sort: 🔴 high-impact first.

5. **Action items**  
   For each 🔴 assumption:
   - Propose a concrete validation action (spike task, client question, data query).
   - Offer to create a plan file or TODO for it.
   For each 🟡:
   - Note it as a risk in CONTEXT.md; monitor during execution.

6. **Update CONTEXT.md**  
   Rewrite the "Cosa assumiamo" section with the classified table.  
   Add any new items to "NON sappiamo" if they surfaced during discussion.

7. **Commit**  
   `node shine/bin/shine-tools.cjs commit "assumptions: phase <N>" --scope discuss --raw`

## Decision gates
- After classification: show the full risk matrix before writing.
- For 🔴 items: require explicit user decision (validate / accept risk / descope).

## Output
- Updated `<phase_dir>/CONTEXT.md` with classified assumptions.
- Optional: new TODO items or spike plan files for 🔴 assumptions.

## Error handling
- No CONTEXT.md → route to `/shine-discuss-phase <N>` first.
- User refuses to classify → record as 🟡 with note "unclassified by user".
