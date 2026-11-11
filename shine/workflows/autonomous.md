# Workflow — autonomous

Run execute-phase in autonomous mode: proceed wave-by-wave without per-wave user checkpoints, until blocked or done.

## Prerequisites
- All of execute-phase prerequisites.
- User has explicitly authorized autonomous mode for this session.
- Guardrails are active (secret-guard hook, read-guard hook).

## Steps

1. **Init**  
   `node shine/bin/shine-tools.cjs init <N> --raw`.  
   `roadmap --raw` → all remaining phases for this session.

2. **Confirm autonomy scope**  
   Show phase list + guardrails (never auto-send email, never commit secrets, stop on verify-fail). Require one final "go".

3. **Loop**  
   For each phase in order:
   - Run plan-phase if no plans yet.
   - Run execute-phase wave by wave.
   - Run verify-work.
   - On failure: STOP, surface the 5-section report, ask for input.
   - On success: proceed to next phase.

4. **Heartbeat**  
   Every 10 min (or between phases), emit a single-line status to stdout.

5. **Termination**  
   - All phases done → final summary + exit.
   - Blocked → pause, keep state, report.
   - User interrupts → commit current work with `shine(auto): interrupted at phase <N> wave <w>`.

## Guardrails
- Never auto-send any email (even if a skill proposes it).
- Never bypass the PreToolUse secret-guard.
- Any destructive action (git reset, force push, rm -rf) requires a prompt regardless of autonomy.

## Output
- All phase artifacts.
- Final `./AUTONOMOUS-RUN.md` with heartbeat log.
