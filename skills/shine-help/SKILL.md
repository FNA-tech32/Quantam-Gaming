---
name: shine-help
description: "Show available SHINE commands and usage guide"
allowed-tools:
  - Read
---

<objective>
Display the complete SHINE command reference.

Output ONLY the reference content below. Do NOT add:
- Project-specific analysis
- Git status or file context
- Next-step suggestions
- Any commentary beyond the reference
</objective>

<execution_context>
@~/.claude/shine/workflows/help.md
</execution_context>

<process>
Output the complete SHINE command reference from @~/.claude/shine/workflows/help.md.
Display the reference content directly — no additions or modifications.
</process>
