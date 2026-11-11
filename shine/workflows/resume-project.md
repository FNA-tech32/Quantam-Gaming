# Workflow — resume-project

Context rebuild after a break, compaction, or fresh session. Synthesizes last-known state into a one-screen orientation.

## Prerequisites
- Inside a project directory (pwd contains `.shine/` or ROADMAP.md).

## Steps
1. **Roadmap scan** — `shine-tools.cjs roadmap --raw`; identify last `in-progress` phase (fallback: last `done`, then first `todo`).
2. **State scan** — `shine-tools.cjs state <N> --raw` for the current phase; extract current wave / task / status.
3. **Compact history** — `shine-tools.cjs history-digest --raw`; read last 5 precompact snapshots to recover recent decisions.
4. **Git context** — last 5 commits (`git log -5 --oneline`) + current branch + dirty-file count.
5. **Memory scan** — `Glob ~/.claude/memory/client-<slug>-*.md` if a client is active per `client.md` symlink.
6. **Synthesize** — one-paragraph orientation + next recommended action.

## Output format
```
## Where you left off
You were on **phase <N>: <title>**, wave <W>, task <T>.
Last commit: <sha> — <subject> (<when>).
Working tree: <clean | N dirty files>.

## Recent context
- <point from history-digest>
- <point from STATE.md notes>
- <point from last commits>

## Suggested next step
→ /shine-<command> — <rationale>
```

## Error handling
- No .shine/ → treat as new project; offer `/shine-new-project`.
- No commits yet → skip git context; orient from roadmap only.
- Precompact snapshots missing → continue without; note "no digest available".
