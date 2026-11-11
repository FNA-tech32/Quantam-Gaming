---
name: shine-next
description: "Automatically advance to the next logical step in the SHINE workflow"
allowed-tools:
  - Read
  - Bash
  - Grep
  - Glob
  - SlashCommand
---

<objective>
Detect the current project state and automatically invoke the next logical SHINE workflow step.
No arguments needed — reads STATE.md, ROADMAP.md, and phase directories to determine what comes next.

Designed for rapid multi-project workflows where remembering which phase/step you're on is overhead.
</objective>

<execution_context>
@~/.claude/shine/workflows/next.md
</execution_context>

<process>
Execute the next workflow from @~/.claude/shine/workflows/next.md end-to-end.
</process>
