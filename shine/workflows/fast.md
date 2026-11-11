# Workflow — fast

Rapid execution mode — skip discussion phase, minimal verification, explicit scope ceiling. For trivial or highly-repeatable changes only.

## Prerequisites
- Change is < 50 LOC across ≤ 2 files.
- User has explicitly invoked `/shine-fast` (opts out of safety nets).

## Steps
1. Confirm the ceiling: _"Fast mode: ≤ 50 LOC, ≤ 2 files, no discussion, smoke-test only. Continue?"_
2. Execute edit directly.
3. Run smoke test only (syntax check, import/compile, one unit test if trivial).
4. Commit with `--scope fast`.
5. One-line report: `✓ <summary> · <LOC> · <file>`.

## What fast mode SKIPS
- Discussion / 5-Why / MoSCoW
- Full test suite (run smoke only)
- Roadmap/phase updates
- Memory persistence

## Escalation (auto-exit fast mode)
If during execution any of these occurs, STOP and escalate to `/shine-do`:
- Scope exceeds 50 LOC or 2 files
- Touches config, secrets, CI, infra
- Smoke test fails
- Cross-subsystem edit detected

## Guardrails
- Still blocks secret-shaped content (inherits `shine-prompt-guard`).
- Still refuses `--no-verify` git flags.
