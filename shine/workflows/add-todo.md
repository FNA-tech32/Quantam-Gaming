# Workflow — add-todo

Append a structured TODO item to the active phase's tracking file.

## Prerequisites
- Active phase exists (or user specifies a phase number).

## Steps

1. **Detect active phase**  
   `node shine/bin/shine-tools.cjs roadmap --raw` → find first `in-progress` phase.  
   If user specifies a phase number, use that instead.

2. **Gather TODO details**  
   Accept from user (inline or via prompts):
   - **Text**: what needs to be done (imperative: "Add error handling to payment endpoint")
   - **Priority**: P1 (blocker) · P2 (important) · P3 (nice-to-have). Default: P2.
   - **Owner**: who should do it (optional, default: unassigned).
   - **Link**: related file, issue, or plan reference (optional).
   - **Tags**: comma-separated labels (optional).

3. **Format the entry**  
   ```
   - [ ] [P2] Add error handling to payment endpoint @kevin #api #error-handling
     Link: src/api/payments.ts:42
     Added: 2026-04-15
   ```

4. **Append to TODO.md**  
   Write to `.shine/phases/phase-<NN>-<slug>/TODO.md`.  
   If the file doesn't exist, create it with a header:
   ```
   # TODOs — Phase <N>: <title>
   
   ## P1 — Blockers
   
   ## P2 — Important
   
   ## P3 — Nice-to-have
   ```
   Append under the correct priority section.

5. **Commit**  
   `node shine/bin/shine-tools.cjs commit "todo: <summary>" --scope todo --raw`

6. **Confirm**  
   Show the added item and current TODO count per priority.

## Guardrails
- Never create duplicate TODOs (check for similar text before appending).
- Always include the date added for staleness tracking.
