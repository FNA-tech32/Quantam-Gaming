# Workflow — check-todos

Scan code, plans, and docs for TODO/FIXME/HACK markers. Rank by staleness and impact; propose actions.

## Prerequisites
- Git repo (for blame/age data).

## Steps

1. **Scan source code**  
   `Grep -rn "TODO\|FIXME\|HACK\|XXX\|BUG" --include="*.{ts,js,py,go,rs,java,rb,php}"` across source dirs.  
   Exclude: `node_modules`, `.venv`, `dist`, `build`, `vendor`.

2. **Scan SHINE artifacts**  
   `Grep -rn "TODO\|\[ \]" .shine/phases/` — unchecked items in plans, context, summaries.

3. **Scan documentation**  
   `Grep -rn "TODO\|TBD\|FIXME" *.md` — incomplete doc sections.

4. **Age analysis**  
   For each hit, run `git blame -L <line>,<line> <file>` → extract commit date.  
   Calculate age in days.

5. **Classification**  
   | Keyword | Default priority | Escalation |
   |---------|-----------------|------------|
   | BUG | P1 | Immediate |
   | FIXME | P1 | This sprint |
   | HACK | P2 | Next cleanup |
   | TODO | P2 | Backlog |
   | XXX | P2 | Review |
   
   Adjust priority up if: age > 90 days, in critical path, or in security-sensitive file.

6. **De-duplicate**  
   Combine entries with identical message on the same file (different lines = same TODO).

7. **Rank and present**  
   Sort: P1 first, then by age (oldest first).  
   Output top-20 with proposed action per item.

## Output
```
## TODO audit — <date>
Found <N> items across <M> files.

### Top 20 — ready to tackle
| # | File:line | Age | Priority | Note | Proposed action |
|---|-----------|----:|----------|------|-----------------|
| 1 | src/api.ts:42 | 120d | P1 | FIXME: error handling | /shine-do "add error handling to api.ts:42" |
| 2 | … | | | | |

### Summary by priority
| Priority | Count | Oldest |
|----------|------:|--------|
| P1 | 5 | 120 days |
| P2 | 18 | 340 days |
```

## Guardrails
- Never auto-resolve a TODO — only propose actions.
- Never remove a TODO marker without implementing the fix.
