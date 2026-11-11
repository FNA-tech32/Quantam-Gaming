# Workflow — review

Structured code review on a diff (staged, a PR, or `main..HEAD`).

## Prerequisites
- Git repo. Either staged changes, a branch ahead of main, or an explicit diff range.

## Steps
1. **Scope** — resolve diff source:
   - default: `git diff main...HEAD`
   - `--staged`: `git diff --staged`
   - `--pr <N>`: `gh pr diff <N>` (if gh available)
2. **File-level pass** — for each file, note: purpose, risk-tier (config/core/test/doc), LOC added/removed.
3. **Checklist per file** — rate ✅ / 🟡 / 🔴 against:
   - Naming — variable/function names express intent
   - Error handling — every external call has a failure path
   - Security — no hardcoded secrets, no injection surfaces
   - Tests — changes covered by new or existing tests
   - Performance — no obvious quadratic loops, no sync IO in hot path
   - Style — matches existing conventions in the file
   - Docs — public API changes have updated docstrings/README
4. **Line-level comments** — for each 🟡/🔴, produce an inline comment with the fix.
5. **Summary** — approve / request-changes / needs-discussion + top 3 items.

## Output format
```
## Review — <branch-or-PR>
### Verdict
<approve | request-changes | needs-discussion>

### Top issues
1. <file:line> — <issue> — <fix>
2. …

### Per-file
| file | risk | verdict | notes |

### Line comments
<file>:<line> — <comment>
```

## Guardrails
- Review the diff, not the author. Never attribute to a person.
- If diff > 1 000 LOC, chunk by module and report multi-part.
- Flag secrets with 🔒 and stop review until removed.
