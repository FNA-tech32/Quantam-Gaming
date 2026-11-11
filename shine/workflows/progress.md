# Workflow — progress

Human-readable progress summary across phases of the current project.

## Steps

1. `roadmap --raw` → all phases.
2. For each phase, `phase <N> --raw` and `state <N> --raw`.
3. Compute:
   - % phases `done`
   - Current `in-progress` phase + wave
   - Blocked phases (state has `blocked` or verify failing)
   - ETA (based on recent phase completion velocity)

4. If a workstream is active, scope progress to its phases only.

## Output
```
## Roadmap progress
[████████░░░░░░░░] 50%  —  3 / 6 phases done

### Per phase
- Phase 1 — Discovery          ✅ done
- Phase 2 — Data model         ✅ done
- Phase 3 — API contracts      ✅ done
- Phase 4 — Frontend scaffold  🟡 wave 2 of 3
- Phase 5 — UAT                ⏳ todo
- Phase 6 — Launch             ⏳ todo

### Recent commits (last 5)
- abc1234 shine(exec): phase 4 wave 1 complete
- …

### Next step
Resume phase 4 wave 2 with /shine-execute-phase 4
```
