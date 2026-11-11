<!-- Partial of shine-planner — loaded on demand to drive the step-by-step planning execution flow. -->

<execution_flow>

<step name="load_project_state" priority="first">
Load planning context:

```bash
INIT=$(node "$HOME/.claude/shine/bin/shine-tools.cjs" init plan-phase "${PHASE}")
if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi
```

Extract from init JSON: `planner_model`, `researcher_model`, `checker_model`, `commit_docs`, `research_enabled`, `phase_dir`, `phase_number`, `has_research`, `has_context`.

Also read STATE.md for position, decisions, blockers:
```bash
cat .planning/STATE.md 2>/dev/null
```

If STATE.md missing but .planning/ exists, offer to reconstruct or continue without.
</step>

<step name="load_mode_context">
Check the invocation mode and load the relevant reference file:

- If `--gaps` flag or gap_closure context present: Read `shine/references/planner-gap-closure.md`
- If `<revision_context>` provided by orchestrator: Read `shine/references/planner-revision.md`
- If `--reviews` flag present or reviews mode active: Read `shine/references/planner-reviews.md`
- Standard planning mode: no additional file to read

Load the file before proceeding to planning steps. The reference file contains the full
instructions for operating in that mode.
</step>

<step name="load_codebase_context">
Check for codebase map:

```bash
ls .planning/codebase/*.md 2>/dev/null
```

If exists, load relevant documents by phase type:

| Phase Keywords | Load These |
|----------------|------------|
| UI, frontend, components | CONVENTIONS.md, STRUCTURE.md |
| API, backend, endpoints | ARCHITECTURE.md, CONVENTIONS.md |
| database, schema, models | ARCHITECTURE.md, STACK.md |
| testing, tests | TESTING.md, CONVENTIONS.md |
| integration, external API | INTEGRATIONS.md, STACK.md |
| refactor, cleanup | CONCERNS.md, ARCHITECTURE.md |
| setup, config | STACK.md, STRUCTURE.md |
| (default) | STACK.md, ARCHITECTURE.md |
</step>

<step name="identify_phase">
```bash
cat .planning/ROADMAP.md
ls .planning/phases/
```

If multiple phases available, ask which to plan. If obvious (first incomplete), proceed.

Read existing PLAN.md or DISCOVERY.md in phase directory.

**If `--gaps` flag:** Switch to gap_closure_mode.
</step>

<step name="mandatory_discovery">
Apply discovery level protocol (see discovery_levels section).
</step>

<step name="read_project_history">
**Two-step context assembly: digest for selection, full read for understanding.**

**Step 1 — Generate digest index:**
```bash
node "$HOME/.claude/shine/bin/shine-tools.cjs" history-digest
```

**Step 2 — Select relevant phases (typically 2-4):**

Score each phase by relevance to current work:
- `affects` overlap: Does it touch same subsystems?
- `provides` dependency: Does current phase need what it created?
- `patterns`: Are its patterns applicable?
- Roadmap: Marked as explicit dependency?

Select top 2-4 phases. Skip phases with no relevance signal.

**Step 3 — Read full SUMMARYs for selected phases:**
```bash
cat .planning/phases/{selected-phase}/*-SUMMARY.md
```

From full SUMMARYs extract:
- How things were implemented (file patterns, code structure)
- Why decisions were made (context, tradeoffs)
- What problems were solved (avoid repeating)
- Actual artifacts created (realistic expectations)

**Step 4 — Keep digest-level context for unselected phases:**

For phases not selected, retain from digest:
- `tech_stack`: Available libraries
- `decisions`: Constraints on approach
- `patterns`: Conventions to follow

**From STATE.md:** Decisions → constrain approach. Pending todos → candidates.

**From RETROSPECTIVE.md (if exists):**
```bash
cat .planning/RETROSPECTIVE.md 2>/dev/null | tail -100
```

Read the most recent milestone retrospective and cross-milestone trends. Extract:
- **Patterns to follow** from "What Worked" and "Patterns Established"
- **Patterns to avoid** from "What Was Inefficient" and "Key Lessons"
- **Cost patterns** to inform model selection and agent strategy
</step>

<step name="gather_phase_context">
Use `phase_dir` from init context (already loaded in load_project_state).

```bash
cat "$phase_dir"/*-CONTEXT.md 2>/dev/null   # From /shine-discuss-phase
cat "$phase_dir"/*-RESEARCH.md 2>/dev/null   # From /shine-research-phase
cat "$phase_dir"/*-DISCOVERY.md 2>/dev/null  # From mandatory discovery
```

**If CONTEXT.md exists (has_context=true from init):** Honor user's vision, prioritize essential features, respect boundaries. Locked decisions — do not revisit.

**If RESEARCH.md exists (has_research=true from init):** Use standard_stack, architecture_patterns, dont_hand_roll, common_pitfalls.
</step>

<step name="break_into_tasks">
Decompose phase into tasks. **Think dependencies first, not sequence.**

For each task:
1. What does it NEED? (files, types, APIs that must exist)
2. What does it CREATE? (files, types, APIs others might need)
3. Can it run independently? (no dependencies = Wave 1 candidate)

Apply TDD detection heuristic. Apply user setup detection.
</step>

<step name="build_dependency_graph">
Map dependencies explicitly before grouping into plans. Record needs/creates/has_checkpoint for each task.

Identify parallelization: No deps = Wave 1, depends only on Wave 1 = Wave 2, shared file conflict = sequential.

Prefer vertical slices over horizontal layers.
</step>

<step name="assign_waves">
```
waves = {}
for each plan in plan_order:
  if plan.depends_on is empty:
    plan.wave = 1
  else:
    plan.wave = max(waves[dep] for dep in plan.depends_on) + 1
  waves[plan.id] = plan.wave

# Implicit dependency: files_modified overlap forces a later wave.
for each plan B in plan_order:
  for each earlier plan A where A != B:
    if any file in B.files_modified is also in A.files_modified:
      B.wave = max(B.wave, A.wave + 1)
      waves[B.id] = B.wave
```

**Rule:** Same-wave plans must have zero `files_modified` overlap. After assigning waves, scan each wave; if any file appears in 2+ plans, bump the later plan to the next wave and repeat.
</step>

<step name="group_into_plans">
Rules:
1. Same-wave tasks with no file conflicts → parallel plans
2. Shared files → same plan or sequential plans (shared file = implicit dependency → later wave)
3. Checkpoint tasks → `autonomous: false`
4. Each plan: 2-3 tasks, single concern, ~50% context target
</step>

<step name="derive_must_haves">
Apply goal-backward methodology (see goal_backward section):
1. State the goal (outcome, not task)
2. Derive observable truths (3-7, user perspective)
3. Derive required artifacts (specific files)
4. Derive required wiring (connections)
5. Identify key links (critical connections)
</step>

<step name="reachability_check">
For each must-have artifact, verify a concrete path exists:
- Entity → in-phase or existing creation path
- Workflow → user action or API call triggers it
- Config flag → default value + consumer
- UI → route or nav link
UNREACHABLE (no path) → revise plan.
</step>

<step name="estimate_scope">
Verify each plan fits context budget: 2-3 tasks, ~50% target. Split if necessary. Check granularity setting.
</step>

<step name="confirm_breakdown">
Present breakdown with wave structure. Wait for confirmation in interactive mode. Auto-approve in yolo mode.
</step>

<step name="write_phase_prompt">
Use template structure for each PLAN.md.

**ALWAYS use the Write tool to create files** — never use `Bash(cat << 'EOF')` or heredoc commands for file creation.

**CRITICAL — File naming convention (enforced):**

The filename MUST follow the exact pattern: `{padded_phase}-{NN}-PLAN.md`

- `{padded_phase}` = zero-padded phase number received from the orchestrator (e.g. `01`, `02`, `03`, `02.1`)
- `{NN}` = zero-padded sequential plan number within the phase (e.g. `01`, `02`, `03`)
- The suffix is always `-PLAN.md` — NEVER `PLAN-NN.md`, `NN-PLAN.md`, or any other variation

**Correct examples:**
- Phase 1, Plan 1 → `01-01-PLAN.md`
- Phase 3, Plan 2 → `03-02-PLAN.md`
- Phase 2.1, Plan 1 → `02.1-01-PLAN.md`

**Incorrect (will break shine-tools detection):**
- ❌ `PLAN-01-auth.md`
- ❌ `01-PLAN-01.md`
- ❌ `plan-01.md`
- ❌ `01-01-plan.md` (lowercase)

Full write path: `.planning/phases/{padded_phase}-{slug}/{padded_phase}-{NN}-PLAN.md`

Include all frontmatter fields.
</step>

<step name="validate_plan">
Validate each created PLAN.md using shine-tools:

```bash
VALID=$(node "$HOME/.claude/shine/bin/shine-tools.cjs" frontmatter validate "$PLAN_PATH" --schema plan)
```

Returns JSON: `{ valid, missing, present, schema }`

**If `valid=false`:** Fix missing required fields before proceeding.

Required plan frontmatter fields:
- `phase`, `plan`, `type`, `wave`, `depends_on`, `files_modified`, `autonomous`, `must_haves`

Also validate plan structure:

```bash
STRUCTURE=$(node "$HOME/.claude/shine/bin/shine-tools.cjs" verify plan-structure "$PLAN_PATH")
```

Returns JSON: `{ valid, errors, warnings, task_count, tasks }`

**If errors exist:** Fix before committing:
- Missing `<name>` in task → add name element
- Missing `<action>` → add action element
- Checkpoint/autonomous mismatch → update `autonomous: false`
</step>

<step name="update_roadmap">
Update ROADMAP.md to finalize phase placeholders:

1. Read `.planning/ROADMAP.md`
2. Find phase entry (`### Phase {N}:`)
3. Update placeholders:

**Goal** (only if placeholder):
- `[To be planned]` → derive from CONTEXT.md > RESEARCH.md > phase description
- If Goal already has real content → leave it

**Plans** (always update):
- Update count: `**Plans:** {N} plans`

**Plan list** (always update):
```
Plans:
- [ ] {phase}-01-PLAN.md — {brief objective}
- [ ] {phase}-02-PLAN.md — {brief objective}
```

4. Write updated ROADMAP.md
</step>

<step name="git_commit">
```bash
node "$HOME/.claude/shine/bin/shine-tools.cjs" commit "docs($PHASE): create phase plan" --files .planning/phases/$PHASE-*/$PHASE-*-PLAN.md .planning/ROADMAP.md
```
</step>

<step name="offer_next">
Return structured planning outcome to orchestrator.
</step>

</execution_flow>
