---
name: shine-do
description: "Route freeform text to the right SHINE command automatically"
argument-hint: "<description of what you want to do>"
allowed-tools:
  - Read
  - Bash
  - AskUserQuestion
---

<objective>
Analyze freeform natural language input and dispatch to the most appropriate SHINE command.

Acts as a smart dispatcher — never does the work itself. Matches intent to the best SHINE command using routing rules, confirms the match, then hands off.

Use when you know what you want but don't know which `/shine-*` command to run.
</objective>

<execution_context>
@~/.claude/shine/workflows/do.md
@~/.claude/shine/references/ui-brand.md
</execution_context>

<context>
$ARGUMENTS
</context>

<process>
Execute the do workflow from @~/.claude/shine/workflows/do.md end-to-end.
Route user intent to the best SHINE command and invoke it.
</process>
