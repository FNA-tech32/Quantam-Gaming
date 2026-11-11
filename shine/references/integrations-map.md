---
name: SHINE Integrations Map
description: Full routing map of plugins, MCP servers, skills, and agents grouped by task category. Load when choosing which integration to invoke.
type: reference
---

# SHINE Integrations Map

This file is the extended routing table for SHINE. The slim `CLAUDE.md` keeps only the core identity + rules; **load this file when you need to pick the right tool for a task** and the short hints in `CLAUDE.md` are not enough.

Read on demand — do NOT parse at session start.

---

## 1. Code Understanding & Navigation

### Serena (MCP — semantic code tools)
USE WHEN: understanding code structure, finding definitions, tracing references, navigating architecture.
- `get_symbols_overview` — scan a file's classes/functions/methods without reading the whole file
- `find_symbol` — locate a symbol by name, with optional body
- `find_referencing_symbols` — find all callers/usages (ALWAYS do this before refactoring)
- `search_for_pattern` — fast regex across the codebase
- `replace_symbol_body`, `insert_before_symbol`, `insert_after_symbol` — precise symbolic edits
- PREFER symbolic tools over reading entire files. Overview first, drill into specifics.

### code-review-graph (MCP — optional)
USE WHEN: available AND the task is code review, impact analysis, or architecture understanding.
- `detect_changes` · `get_impact_radius` · `get_affected_flows` · `query_graph` · `semantic_search_nodes` · `get_architecture_overview`
- IF code-review-graph is installed → prefer it for structural questions. IF NOT → use Serena + Grep.

### Greptile (plugin — disabled by default)
USE WHEN: high-level "how does X work in this codebase" questions and it's enabled.

### LSPs — Pyright / BasedPyright / TypeScript LSP
USE WHEN: type checking, go-to-definition, completions, diagnostics for Python / TS.

### claude-mem Smart Explore (`claude-mem:smart-explore`)
USE WHEN: token-efficient structural exploration via AST parsing.

---

## 2. Library & Framework Documentation

### Context7 (MCP — live docs)
USE WHEN: working with ANY external library, framework, or package.
1. `resolve-library-id` → find the library
2. `query-docs` → current API docs and examples

Do this PROACTIVELY on unfamiliar imports. Always prefer Context7 over guessing from training data.

---

## 3. Browser & Web

### Playwright (MCP)
USE WHEN: the user shares a URL, testing web UIs, taking screenshots, web research, form filling.
- `browser_navigate`, `browser_snapshot` (a11y tree), `browser_take_screenshot`, `browser_click`, `browser_fill_form`, `browser_type`.
- Trigger automatically on a pasted URL.

---

## 4. Debugging & Problem Solving

- **Systematic Debugging** (`superpowers:systematic-debugging`) — any bug or test failure, BEFORE proposing fixes.
- **SHINE Debug** (`shine:debug`) — complex bugs that need persistent debug state across context resets.

---

## 5. Planning & Design

- **Brainstorming** (`superpowers:brainstorming`) — creative work, MUST run before implementation.
- **Writing Plans** (`superpowers:writing-plans`) — spec → multi-step plan.
- **claude-mem Make Plan** (`claude-mem:make-plan`) — phased plans with doc discovery.
- **SHINE Planning** (`shine:discuss-phase`, `shine:plan-phase`, `shine:research-phase`).

---

## 6. Implementation & Execution

- **TDD** (`superpowers:test-driven-development`) — tests first.
- **Executing Plans** (`superpowers:executing-plans`) — with review checkpoints.
- **claude-mem Do** (`claude-mem:do`) — phased plan via subagents.
- **Subagent-Driven Development** (`superpowers:subagent-driven-development`).
- **SHINE Execute** (`shine:execute-phase`) — wave-based parallelism.
- **SHINE Quick** (`shine:quick`) — atomic commits without optional agents.

---

## 7. Code Quality & Review

- **Code Simplifier** (`code-simplifier:code-simplifier`) — reuse/quality review after edits.
- **Code Reviewer** (`superpowers:code-reviewer`) — at major step completion.
- **Verification Before Completion** (`superpowers:verification-before-completion`) — BEFORE claiming complete.

---

## 8. UI/UX Design & Frontend

- **UI/UX Pro Max** (`ui-ux-pro-max:ui-ux-pro-max`) — ANY frontend work. 50+ styles, 161 palettes.
- **SHINE UI Phase** (`shine:ui-phase`) — generate `UI-SPEC.md`.
- **SHINE UI Review** (`shine:ui-review`) — 6-pillar retro visual audit.

---

## 9. Memory & Cross-Session Context

- **claude-mem** (plugin) — search past sessions. Tools: `smart_search`, `search`, `timeline`, `smart_outline`, `smart_unfold`. PROACTIVELY search on _"remember when…"_, _"last time…"_.
- **Global Memory** — `~/.claude/memory/MEMORY.md` index + typed entries (`type: preference | client | project | style | external`). Update when learning stable patterns.

---

## 10. Parallel Work & Agent Teams

- **Dispatching Parallel Agents** (`superpowers:dispatching-parallel-agents`) — 2+ independent tasks.
- **Agent Teams** — PROACTIVELY SUGGEST when task has 2+ independent pieces.

### Agent Types (spawn with Agent tool)

**Core (6):** `Explore`, `Plan`, `general-purpose`, `code-simplifier`, `superpowers:code-reviewer`, `claude-code-guide`.

**SHINE engineering (21):**
- Plan/research: `shine-planner`, `shine-plan-checker`, `shine-roadmapper`, `shine-phase-researcher`, `shine-project-researcher`, `shine-research-synthesizer`, `shine-advisor-researcher`
- Execute/navigate: `shine-executor`, `shine-codebase-mapper`, `shine-assumptions-analyzer`, `shine-integration-checker`
- Verify/audit: `shine-verifier`, `shine-debugger`, `shine-security-auditor`, `shine-nyquist-auditor`, `shine-doc-verifier`, `shine-doc-writer`, `shine-ui-auditor`, `shine-ui-checker`, `shine-ui-researcher`, `shine-user-profiler`

**SHINE agency (18):**
- Client/account: `shine-client-researcher`, `shine-account-manager`, `shine-pm-coordinator`, `shine-persona-researcher`
- Sales/growth: `shine-sales-strategist`, `shine-lead-scorer`, `shine-competitor-scout`, `shine-proposal-writer`, `shine-copywriter`
- Content/brand: `shine-brand-voice-auditor`, `shine-content-editor`, `shine-translator`
- MarTech/data: `shine-martech-architect`, `shine-seo-strategist`, `shine-data-analyst`, `shine-crm-operator`
- Compliance/ops: `shine-gdpr-analyst`, `shine-retro-facilitator`

- **Git Worktrees** (`superpowers:using-git-worktrees`) — feature isolation.

---

## 11. Recurring Tasks & Monitoring

- **Ralph Loop** (`ralph-loop:*`) / Loop skill — polling, monitoring, repeated checks.

---

## 12. Project Management (SHINE)

- `/shine-progress` — where are we, what's next
- `/shine-new-project` — initialize with deep context
- `/shine-plan-phase` — detailed phase plans
- `/shine-execute-phase` — wave-based parallel execution
- `/shine-autonomous` — run all phases autonomously (use with care)
- `/shine-stats` — project statistics
- `/shine-verify-work` — UAT validation
- `/shine-add-todo`, `/shine-check-todos` — todo management
- `/shine-note` — idea capture
- `/shine-pause-work` / `/shine-resume-work` — session handoff
- `/shine-map-codebase` — parallel mapper agents

### Agency skill map (138 total)

| Intent | Category | Representative skills |
|---|---|---|
| proposal, preventivo, pitch, rfp | Sales/Proposal | `/proposal`, `/sales-deck`, `/rfp-response`, `/pricing-page`, `/value-prop`, `/exec-summary` |
| email, reply, follow-up, draft | Comms | `/draft-email`, `/follow-up`, `/linkedin-dm`, `/cold-email`, `/client-tone` |
| lead, enrich, ICP, persona | Growth | `/lead-enrich`, `/icp-define`, `/persona-build`, `/competitor-analysis`, `/sales-call-prep`, `/sales-call-debrief` |
| GDPR, PII, cookie, consent, DPIA | Compliance | `/gdpr-audit`, `/cookie-scan`, `/pii-safe`, `/compliance-ai`, `/nda-triage` |
| SEO, tag, GTM, GA4, attribution | MarTech/Data | `/seo-audit`, `/tag-audit`, `/meta-check`, `/ga4-audit`, `/attribution-model`, `/ab-test-plan`, `/kpi-tree`, `/dashboard-spec`, `/data-contract` |
| content, blog, post, newsletter | Content | `/content-calendar`, `/blog-post`, `/social-post`, `/newsletter`, `/landing-copy`, `/press-release`, `/case-study`, `/webinar-plan`, `/campaign-brief` |
| kickoff, retro, status, weekly, invoice | Ops/PM | `/kickoff`, `/retrospective`, `/status-report`, `/weekly-plan`, `/meeting-notes`, `/invoice-draft`, `/timesheet-summary`, `/capacity-plan`, `/process-doc`, `/vendor-onboarding`, `/sync` |
| swot, okr, roadmap, maturity, risk | Strategy | `/swot`, `/okr-draft`, `/roadmap-draft`, `/digital-maturity`, `/stakeholder-map`, `/risk-register`, `/change-plan`, `/discovery-call`, `/discovery-doc`, `/client-brief` |
| brand, voice, naming, logo, design | Brand/Design | `/brand-voice`, `/naming`, `/logo-brief`, `/design-crit` |
| tech spec, API, deploy, PR, migration | Tech/Dev | `/tech-spec`, `/api-design`, `/architecture-diagram`, `/deploy-checklist`, `/migration-plan`, `/test-strategy`, `/pr-review`, `/readme-generator`, `/changelog-draft`, `/incident-report` |
| translate, localize, FR/EN/ES | Language | `/translate` |
| ROI, estimate, budget | Finance | `/roi-estimate` |

---

## 13. Configuration & Setup

- **Update Config** (`update-config`) — settings, hooks, permissions, env vars.
- **Claude Automation Recommender** (`claude-code-setup:claude-automation-recommender`) — optimise Claude Code setup.
- **Claude Code Guide** (agent `claude-code-guide`) — Claude Code meta-questions.

---

## 14. Specialised

- **Claude API** (`claude-api`) — apps importing `anthropic` or `@anthropic-ai/sdk`.
- **Agent SDK Dev** (`agent-sdk-dev:new-sdk-app`) — new SDK apps. Verifiers: `agent-sdk-verifier-ts`, `…-py`.
- **Supabase** (plugin) — DB / auth / storage / edge functions.
- **Arize Skills** — LLM observability: `arize-trace`, `arize-instrumentation`, `arize-dataset`, `arize-experiment`, `arize-prompt-optimization`, `arize-link`. Requires `ax` CLI + `ARIZE_API_KEY` + `ARIZE_SPACE_ID`.
- **Codex** (`codex@openai-codex`) — OpenAI second opinion. `/codex:review`, `/codex:adversarial-review`, `/codex:rescue`, etc.
- **Finishing a Branch** (`superpowers:finishing-a-development-branch`).
- **Writing Skills** (`superpowers:writing-skills`).

---

See `mcp-capability-map.md` for the BYO MCP servers list (§15) and `tool-tiers.md` for the free-first fallback rule (§21).
