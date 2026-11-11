# Workflow — note

Quick note persistence with intelligent routing to the correct memory file. Designed to be fast and non-disruptive.

## Prerequisites
- None — this should work from any context.

## Steps

1. **Accept input**  
   Accept free-form text + optional tag(s).  
   Tags can be explicit (`#client-acme`, `#preference`, `#style`) or inferred from content.

2. **Auto-detect routing**  
   If no tag provided, infer the destination:
   | Content pattern | Route to |
   |----------------|----------|
   | Mentions a client name/slug | `memory/client-<slug>.md` |
   | "I prefer…", "always use…", "default to…" | `memory/preference-*.md` |
   | "The project should…", "architecture decision…" | `memory/project-<slug>.md` |
   | Code style, naming convention | `memory/style-*.md` |
   | None of the above | `memory/scratch.md` |

3. **Format the entry**  
   ```
   ### <date> <time>
   <note text>
   ```
   Append to the target file (create if it doesn't exist).

4. **Scratch triage reminder**  
   If routed to `scratch.md` and it has > 10 entries:  
   _"💡 You have <N> untagged notes in scratch. Run `/shine-note --triage` to sort them."_

5. **Triage mode** (if `--triage` flag)  
   Read `scratch.md`. For each entry:
   - Show the note.
   - Ask: route to which memory file? Or delete?
   - Move accordingly.

6. **Confirm silently**  
   `📝 Noted → <target file>` — one line, don't interrupt the current task.

## Guardrails
- Never overwrite existing notes — always append.
- Never route client-sensitive notes to a shared/global file.
- Scratch notes are never auto-deleted — only user-initiated triage.
