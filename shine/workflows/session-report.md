# Workflow — session-report

End-of-session artifact collection: commits, agent invocations, files touched, unresolved items.

## Prerequisites
- A session worth reporting (at least one commit or one agent invocation).

## Steps
1. **Session boundary** — default: since last session-report, or since session start from `~/.claude/sessions/` timestamp.
2. **Commits** — `git log --since=<boundary> --pretty="%h %s"`.
3. **Files touched** — `git diff --stat <boundary>..HEAD`.
4. **Agent invocations** — scan `~/.claude/debug/agent-*.log` in window; count by agent name.
5. **Tool calls** — if `~/.claude/debug/tool-*.log` exists, top-5 tools by count.
6. **Unresolved** — `Glob .shine/phases/*/STATE.md` with `status in [blocked, in-progress]`; surface as open threads.
7. **Decisions made** — scan commit messages for `decide:` prefix; list.
8. **Session score** — self-assessment ✅ shipped / 🟢 progressed / 🟡 stuck / 🔴 regressed.

## Output — `~/.claude/sessions/session-<YYYYMMDD-HHMM>.md`
```
# Session — <date>
## Summary
<one-paragraph>
## Commits
<list>
## Files
<stat table>
## Agents used
<count table>
## Unresolved
<list with phase refs>
## Decisions
<list>
## Next session
<suggested slash command>
```

## Guardrails
- Never include diff bodies (only stats) to avoid leaking sensitive content.
- Strip authored-by emails from commit list.
- Never auto-email the report — this is local only unless user invokes a send skill.
