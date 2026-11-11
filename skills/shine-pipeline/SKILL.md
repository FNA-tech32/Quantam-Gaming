---
name: shine-pipeline
description: "Compose skills into a sequential pipeline — skill-a → skill-b → skill-c"
argument-hint: "<skill-a> <skill-b> [skill-c ...]"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
  - Task
---

<objective>
Run multiple SHINE skills back-to-back, piping the output of each into the next via a shared scratchpad. Lets the user build ad-hoc workflows without hard-coding a new skill for every combination.

**Example:**
```
/shine-pipeline shine-lead-enrich shine-cold-email shine-followup-draft
```
→ enrich leads → draft cold emails → draft follow-ups, all in one command, all sharing context.
</objective>

<execution_context>
@~/.claude/shine/references/ui-brand.md
</execution_context>

<context>
Arguments: an ordered list of skill names (2 or more). Each must exist at `~/.claude/skills/<name>/SKILL.md`.

Shared scratchpad: `.planning/pipeline-<timestamp>.md` in the current working directory. Each step appends its summary + any structured output to this file, and the next step reads it before starting.

**No magic data transform** — skills that naturally produce markdown/tables compose best. Skills that only mutate the filesystem still work (they just contribute a brief summary to the scratchpad).
</context>

<execution_flow>
1. **Validate arguments.** Require at least 2 skill names. Check each has a `SKILL.md`. If any is missing, list them and stop.

2. **Initialize scratchpad.**
   ```bash
   TS=$(date +%Y%m%d-%H%M%S)
   SCRATCH=".planning/pipeline-$TS.md"
   mkdir -p .planning
   printf "# SHINE Pipeline — %s\n\n**Steps:** %s\n\n" "$TS" "$*" > "$SCRATCH"
   ```

3. **Run each skill in order.** For step `i` (skill `S_i`):
   - Append `## Step i: S_i` header to scratchpad.
   - Invoke the skill via `Skill(S_i)` with the scratchpad path passed as context.
   - After it returns, append its result summary (last structured output block) to the scratchpad under `### Output`.
   - If the skill fails or returns empty, **pause** and ask the user: _"Step i (`S_i`) returned no output. Continue with next step, retry, or abort?"_

4. **Final summary.** After the last step, print:
   - Pipeline duration.
   - List of steps with ✅ / ⚠️ per step.
   - Path to the scratchpad.

5. **Cleanup.** Leave the scratchpad in place — it's a reviewable artifact, not a temp file.
</execution_flow>

<guardrails>
- **Max 8 steps** per pipeline — more than that and you're building a skill, not a pipeline. Hard-stop with a clear message.
- **No silent skill substitution.** If a skill name is misspelled, stop; don't fuzzy-match.
- **Never chain destructive skills without confirmation.** If any step's `allowed-tools` includes `Bash` or a skill name contains `send`, `publish`, `deploy`, `commit`, or `push`, ask for explicit approval before running that step.
- **Context budget awareness.** Before each step, estimate scratchpad size; if >50 KB, warn the user and offer to summarize before continuing.
- **Never auto-apply memory changes** mid-pipeline. Even if a step proposes memory updates, defer to `/shine-retro` or manual edits.
</guardrails>

<error_handling>
- **Missing skill**: list all missing skills at once, exit without starting. Don't run partially.
- **Step failure**: pause, show last 20 lines of output, offer retry/skip/abort.
- **Scratchpad unwritable**: fall back to `$TMPDIR/shine-pipeline-<ts>.md` and warn.
- **User abort mid-pipeline**: leave scratchpad with `**ABORTED at step i**` marker so the run is debuggable.
</error_handling>

<output_format>
Final summary block:
```
## Pipeline complete — <TS>

| # | Skill | Status | Notes |
|---|-------|--------|-------|
| 1 | shine-lead-enrich | ✅ | 42 leads enriched |
| 2 | shine-cold-email | ✅ | 42 drafts ready |
| 3 | shine-followup-draft | ⚠️ | paused — needs review |

**Scratchpad:** .planning/pipeline-<TS>.md
**Duration:** 3m 12s
```
</output_format>

<structured_returns>
Exit 0 if all steps completed or were user-skipped. Exit 1 if any step was aborted or failed without user resolution.
</structured_returns>
