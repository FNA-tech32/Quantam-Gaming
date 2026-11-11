# Workflow — stats

Project velocity and health metrics over a window.

## Prerequisites
- Git repo with commit history.
- `.shine/` state if available for phase-level metrics.

## Steps
1. **Window** — default last 14 days; accept `--since <date>` override.
2. **Commit stats** — `git log --since=<date> --pretty="%h|%s|%an"` grouped by `shine(<scope>)` prefix.
3. **LOC delta** — `git log --since=<date> --numstat` aggregated by file type.
4. **Phase velocity** — count phases moved todo→in-progress and in-progress→done in window (from roadmap history if tracked).
5. **Verify-pass rate** — scan `.shine/phases/*/VERIFY.md` completed-in-window; pass/fail ratio.
6. **Subagent usage** — if agent logs exist in `~/.claude/debug/`, count invocations by agent.
7. **Render** — table + sparkline (ascii) + top-5 scopes by commit count.

## Output format
```
## Stats — last <N> days
| Metric | Value | Trend |
|---|---:|---|
| Commits | 42 | ▁▃▅▇ |
| LOC +/- | +1 240 / -380 | |
| Phases done | 3 | |
| Verify pass-rate | 92% | |
| Top scope | exec (18) | |
```

## Guardrails
- No PII in output (strip author emails).
- Never invent trends — if history too short for trend, show "—".
