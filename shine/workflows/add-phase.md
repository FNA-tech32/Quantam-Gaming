# Workflow — add-phase

Append a new phase to the end of the active milestone's roadmap.

## Prerequisites
- ROADMAP.md exists.
- User provides: phase title and goal (or we ask for them).

## Steps

1. **Load roadmap**  
   `node shine/bin/shine-tools.cjs roadmap --raw` — find the highest phase number N.

2. **Gather input**  
   If not provided, ask user for:
   - Phase title (concise, action-oriented: "API integration", "UAT & launch")
   - Goal (one sentence: "Integrate the payment gateway and handle all edge cases")
   - Optional: estimated MD, dependencies on prior phases

3. **Generate slug**  
   `node shine/bin/shine-tools.cjs generate-slug "<title>" --raw`

4. **Append to ROADMAP.md**  
   Add under the active milestone:
   ```
   ### Phase <N+1> — <title>  [todo]
   Goal: <goal sentence>
   ```

5. **Create phase directory**  
   `.shine/phases/phase-<NN+1>-<slug>/CONTEXT.md` from `shine/templates/context.md`.  
   Pre-fill the "Obiettivi" section with the goal.

6. **Offer next step**  
   _"Phase <N+1> created. Run `/shine-discuss-phase <N+1>` to flesh out the context, or `/shine-plan-phase <N+1>` to start planning."_

7. **Commit**  
   `node shine/bin/shine-tools.cjs commit "add phase <N+1>: <slug>" --scope roadmap --raw`

## Decision gates
- Before writing: show the proposed ROADMAP.md addition for confirmation.

## Guardrails
- Never skip numbers (no phase 5 if there's no phase 4).
- Slug auto-generated via `shine-tools.cjs generate-slug`.
- If the roadmap already has > 10 phases, warn about scope creep.
