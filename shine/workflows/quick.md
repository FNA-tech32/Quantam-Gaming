# Workflow — quick

Single-shot execution for small, well-defined tasks that don't need a full phase.

## When to use
- One-file change, one-component fix, copy edit, config tweak.
- Estimated ≤ 1h of work.
- No dependency chain.

## Steps

1. **Frame the ask**  
   Restate in one sentence: "I will <do X> to achieve <Y>." Confirm with user.

2. **Execute**  
   Apply the change directly via Read → Edit → Write. No subagents, no planner.

3. **Verify inline**  
   Run the relevant test/lint/check. Paste output.

4. **Commit**  
   `commit "<imperative summary>" --scope quick --raw`

## Decision gates
- Before executing: user says "go" or the ask is unambiguous.
- If scope grows: STOP, escalate to `/shine-plan-phase`.

## Output
- One atomic commit.

## Error handling
- Change touches more than expected → abort, propose plan-phase flow.
