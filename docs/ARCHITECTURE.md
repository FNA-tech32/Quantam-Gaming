# SHINE — Architecture (v2 — Extended Capabilities)

This doc explains **how the SHINE Claude Code Framework is organized on disk and at runtime.** If you want a higher-level walkthrough of what happens during a session, see [HOW-IT-WORKS.md](./HOW-IT-WORKS.md).

![SHINE business value map](./business-value2.svg)

<sub>Business-view companion: input → engine → deliverables, with always-on guardrails and ROI framing. Use this when explaining SHINE to stakeholders who don't need the on-disk details below.</sub>

---

## 1. On-disk layout

After `./install.sh`, `~/.claude/` looks like this:

```
~/.claude/
├── CLAUDE.md                 # Slim global instructions (~6KB) — identity, top rules, RAG discipline, pointers
├── settings.json             # User-editable config (model, hooks, enabledPlugins, MCP, env)
├── statusline.js             # Default statusline renderer (Node)
├── statusline.sh             # Pure-bash fallback (no Node, no jq required)
├── agents/                   # 45 agent .md files (+ 7 on-demand partials) — invoked via the Task tool
├── skills/                   # 149 skill directories — each has SKILL.md + optional scripts
├── hooks/                    # 11 hook scripts — SessionStart / UserPromptSubmit / Pre+PostToolUse / PreCompact / Stop / SessionEnd
├── memory/                   # Typed persistent memory (preference | client | project | style | external)
├── sessions/                 # Volatile session state (precompact snapshots, active-client)
├── projects/                 # Per-project transcripts (Claude Code writes these)
├── tasks/ teams/ todos/      # Claude Code internal state
├── debug/ backups/ cache/    # Support dirs
└── shine/
    ├── VERSION               # Framework version marker (for update checks)
    ├── bin/
    │   ├── shine             # Bash shim — unified CLI
    │   ├── shine-profile.cjs # Profile activator (rewrites settings.json atomically)
    │   └── shine-tools.cjs   # doctor / onboard / index-skills / --version
    ├── profiles/             # Context profiles: minimal.json, writing.json, outbound.json, seo.json, dev.json, full.json
    ├── references/           # On-demand reference files loaded by skills/agents — NOT auto-loaded by CLAUDE.md
    │   ├── integrations-map.md       # Full plugin/MCP routing (was CLAUDE.md §§1-14)
    │   ├── mcp-capability-map.md     # BYO MCP inventory (was §15)
    │   ├── agency-playbook.md        # Tone / GDPR / proposals / lead enrichment (was §§17-20)
    │   ├── tool-tiers.md             # Free-first fallback (was §21)
    │   ├── decision-rules.md         # Full 29-rule matrix
    │   ├── questioning.md            # Discovery-question rules
    │   └── ui-brand.md               # UI/brand conventions
    └── templates/            # Deliverable templates (watermark.md, proposal.md, etc.)
```

**Reversibility.** `install.sh` takes an atomic snapshot of any existing `~/.claude/` into `~/.claude-backup-<timestamp>/` before writing anything. `./uninstall.sh` restores the most recent snapshot; `./uninstall.sh --purge` wipes `~/.claude/` entirely with a typed confirmation.

---

## 2. Runtime layers

```
┌──────────────────────────────────────────────────────────────┐
│  User prompt                                                 │
└───────────────┬──────────────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────────────────────┐
│  CLAUDE.md — 29 decision rules + Rule #21 (Tiered Fallback)   │
│  Pattern-match the prompt → route to agent / skill / tool     │
└───────────────┬──────────────────────────────────────────────┘
                │
   ┌────────────┼────────────┬─────────────┬──────────────┐
   ▼            ▼            ▼             ▼              ▼
 Skills       Agents      Plugins       MCP           Hooks
 (slash       (Task       (serena,      servers       (Session*,
 commands)    subagents)  context7…)    (60+ avail,   Pre/Post
                                        tiered:       ToolUse,
                                        free first)   PreCompact)
```

### 2.1 CLAUDE.md is the router (slim core + on-demand references)

Since 1.1, `CLAUDE.md` is a **slim ~6KB core** that always loads. It contains: identity, auto-use principle, the top-level decision rules (condensed), the full §16 Factual / RAG Discipline table (MANDATORY — unchanged), memory pointers, and links to on-demand reference files in `shine/references/`.

The 29-rule matrix, plugin-by-plugin routing, MCP inventory, and agency playbooks live in separate files that skills/agents read **only when needed**:

| Reference file | Holds | Loaded when |
|---|---|---|
| `shine/references/decision-rules.md` | Full 29-rule matrix | Edge-case routing questions |
| `shine/references/integrations-map.md` | Per-category plugin/MCP routing (§§1-14) | Choosing between two integrations |
| `shine/references/mcp-capability-map.md` | BYO MCP inventory (§15) | User asks "what MCPs exist for X?" |
| `shine/references/agency-playbook.md` | Tone, GDPR, proposals, lead enrichment (§§17-20) | Client-facing task |
| `shine/references/tool-tiers.md` | Free-first fallback (§21) | Multiple tools could serve the same job |

Rules #1–#15 still handle engineering (plan / implement / debug / review). §§16–§20 cover agency workflows (factual RAG, watermarking, email, proposals, lead enrichment). Rule #21 governs **tool tier resolution** (free first, freemium ASK, paid explicit-approval). Rules §§22–§29 map MCP-capability clusters (web research, local analytics, charts, security, sandbox, monitoring, infra).

Example:

> **Rule 17** — When the prompt contains a client name from `memory/*client-*.md` and a communication verb (reply, draft, follow up), load the matching `type: client` memory file + `style-email-*.md`, then run the `draft-email` skill.

The routing is in plain Markdown, inspectable and editable — **and now split by relevance** so the always-loaded context stays small.

### 2.2 Agents (45 + 7 partials)

`agents/*.md` files. Each parent agent has:

- **Frontmatter**: `name`, `description`, `tools`, `color`
- `<role>`: mission statement
- `<approach>`: numbered workflow
- `<anti_patterns>`: explicit don'ts
- `<output_format>`: enforces the 5-section report — **Summary · Details · Sources · Open questions · Next step**

Three groups:

1. **Core engineering agents (21)** — `shine-planner`, `shine-executor`, `shine-verifier`, `shine-security-auditor`, `shine-debugger`, `shine-codebase-mapper`, `shine-advisor-researcher`, `shine-roadmapper`, `shine-ui-auditor`, etc.
2. **Agency agents (18)** — `shine-client-researcher`, `shine-proposal-writer`, `shine-gdpr-analyst`, `shine-brand-voice-auditor`, `shine-competitor-scout`, `shine-seo-strategist`, `shine-martech-architect`, `shine-copywriter`, `shine-translator`, `shine-account-manager`, `shine-pm-coordinator`, `shine-crm-operator`, `shine-lead-scorer`, `shine-persona-researcher`, etc.
3. **MCP-capability agents (6)** — `shine-web-researcher`, `shine-data-engineer`, `shine-vulnerability-scanner`, `shine-chart-builder`, `shine-sandbox-runner`, `shine-infra-ops`. Mapped 1:1 to the §22–§29 rules.

**On-demand partials (7)** — `shine-planner-goal-backward.md`, `shine-planner-tdd-checkpoints.md`, `shine-planner-execution-flow.md`, `shine-debugger-techniques.md`, `shine-debugger-research-kb.md`, `shine-debugger-checkpoints.md`, `shine-doc-writer-templates.md`. Referenced from their parent agents via `@~/.claude/agents/<file>.md`. They have **no frontmatter** — each starts with a `<!-- Partial of <parent> -->` sentinel comment that the lint script uses to skip them. This refactor cut the three biggest agents by 17 / 46 / 68% respectively, reducing per-delegation token cost when the partial isn't needed.

### 2.3 Skills (149)

`skills/<name>/SKILL.md` + optional scripts. Skills are **user-invocable slash commands** (`/skill-name args`). Each SKILL.md has:

- Frontmatter: `name`, `description`, `argument-hint`, `allowed-tools`
- `<objective>`: what the skill produces
- `<guardrails>`: factual discipline, language detection, never-auto-send

Current categorisation (run `node shine/bin/shine-tools.cjs index-skills` to regenerate `skills/INDEX.md`):

| Category | Count | Examples |
|---|---|---|
| Core SHINE | 42 | `shine-review`, `shine-plan`, `shine-verify`, `shine-debug`, `shine-doc`, `shine-retro`, `shine-pipeline`, `shine-tour`, … |
| Early agency | 17 | `proposal`, `draft-email`, `gdpr-audit`, `lead-enrich`, `client-brief`, `kickoff` |
| Marketing / Content | 10 | `content-calendar`, `blog-post`, `newsletter`, `landing-copy`, `value-prop` |
| Sales / Outreach | 10 | `cold-email`, `linkedin-dm`, `sales-deck`, `icp-define`, `pricing-page` |
| Consulting / Strategy | 11 | `discovery-call`, `swot`, `okr-draft`, `roadmap-draft`, `exec-summary` |
| Tech / Dev | 10 | `tech-spec`, `api-design`, `deploy-checklist`, `pr-review`, `migration-plan` |
| Ops / PM | 8 | `meeting-notes`, `weekly-plan`, `nda-triage`, `invoice-draft`, `capacity-plan` |
| Data / Analytics | 7 | `ga4-audit`, `attribution-model`, `kpi-tree`, `ab-test-plan`, `data-contract` |
| Brand | 4 | `brand-voice`, `naming`, `logo-brief`, `rfp-response` |
| Misc / cross-cut | 30 | `translate`, `learning-loop`, capability-specific MCP skills, and agency cross-cutting workflows |

### 2.4 Hooks (11)

Listed in `settings.template.json` and installed to `~/.claude/hooks/`:

| Hook | Trigger | Purpose |
|---|---|---|
| `global-memory-symlink.sh` | SessionStart | Symlink `./memory/` → `~/.claude/memory/` so project sessions share typed memory |
| `shine-check-update.js` | SessionStart | Non-blocking GitHub release check, cached 24h |
| `integration-sync.js` | SessionStart | Refresh the auto-sync block inside `CLAUDE.md` with current plugins + MCP servers |
| `shine-client-detect.js` | UserPromptSubmit | Scan prompt for `memory/client-<slug>.md` matches → emit `additionalContext` pre-loading the client memory before reasoning |
| `shine-tone-calibrator.js` | UserPromptSubmit | Regex-only detection of tone-correction signals (EN + IT, 5 axes) → append timestamped delta to `memory/style-<client>.md` or `memory/style-global.md` |
| `shine-context-monitor.js` | PostToolUse (Bash\|Edit\|Write\|MultiEdit\|Agent\|Task) | Warn when transcript approaches compact threshold |
| `shine-prompt-guard.js` | PreToolUse (Write\|Edit) | **Blocks** writes that look like secrets (.env, API keys, PEM, JWT-shaped) — exits 2 |
| `shine-read-guard.js` | PreToolUse (Write\|Edit) | **Warns** on writes into `node_modules/`, `dist/`, lockfiles, etc. — exits 0 |
| `shine-precompact.js` | PreCompact | Snapshot of last tool + CWD + timestamp to `~/.claude/sessions/precompact-*.md` |
| `shine-learning-log.js` | Stop | Append one JSONL line per turn to `~/.claude/memory/learning-log.jsonl` (metadata only — PII-free) |
| `shine-session-summary.js` | SessionEnd | Append a markdown session block to `~/.claude/memory/learning-log.md` (window · cwd · tool counts · placeholders for `/shine-retro`) |

Every hook exits 0 on failure except `shine-prompt-guard.js`, which exits 2 to abort the offending tool call. Opt-outs via env vars (`SHINE_DISABLE_*`). The two `UserPromptSubmit` hooks emit structured JSON output — `shine-client-detect` uses the `additionalContext` directive documented by Claude Code to inject memory before the model reasons, which cuts Rule #17 / #19 / #20 latency by removing the "which client?" round-trip.

### 2.5 Plugins & MCP (profile-gated since 1.1)

Plugins are installed via `claude plugins install` during `install.sh` — **but only the subset required by the chosen context profile**. The framework supports all 16 plugins; which ones are _enabled_ depends on the profile you activate:

- **Official marketplace**: serena, context7, playwright, superpowers, code-simplifier, ralph-loop, typescript-lsp, pyright-lsp, supabase, agent-sdk-dev, claude-code-setup
- **LSP marketplace**: pyright, basedpyright
- **Third-party**: ui-ux-pro-max, claude-mem, arize-skills

**Context profiles** (`shine/profiles/*.json`) each declare `enabledPlugins`, `disabledMcpjsonServers`, and `estimatedContextTokens`. `shine activate <name>` atomically rewrites those fields in `~/.claude/settings.json`. Restart Claude Code for changes to take effect.

| Profile | Plugins enabled | MCPs disabled | Context |
|---|---|---|---|
| `minimal` | — | — | ~15k |
| `writing` | context7 | — | ~20k |
| `outbound` | context7 | (keeps prospecting: Apollo, Gmail, CommonRoom) | ~35k |
| `seo` | context7 | (keeps Ahrefs) | ~40k |
| `dev` | serena, pyright, basedpyright, typescript-lsp, playwright, supabase, code-simplifier, superpowers | — | ~70k |
| `full` | all 16 | — | ~95k |

**Why this matters.** Pre-1.1, SHINE enabled all 16 plugins by default (~95k baseline). Combined with a user's claude.ai MCP set, sessions routinely crossed 200k before the first prompt. The profile system makes activation opt-in so the baseline is lean and predictable.

MCP servers themselves are still user-configured — see [ADDING-INTEGRATIONS.md](./ADDING-INTEGRATIONS.md). Profiles can also _disable_ MCPs you've connected in `settings.json`, via the `disabledMcpjsonServers` array. All tools follow **Rule #21 (Tiered Fallback)** — free/local first, freemium after asking, paid only with explicit approval.

See:
- [PLUGINS.md](./PLUGINS.md) — full MCP map with tiers
- [ADDING-INTEGRATIONS.md](./ADDING-INTEGRATIONS.md) — step-by-step guide to add any MCP

### 2.6 Memory

Typed Markdown index at `memory/MEMORY.md` + files named `<type>-<slug>.md` with YAML frontmatter. Types:

| Type | Load strategy |
|---|---|
| `preference` | Always in context — small, stable |
| `client` | Loaded when rule #17/#19/#20 fires with a matching client name |
| `project` | Loaded when a project slug is mentioned |
| `style` | Paired with client/project context |
| `external` | Lazy — fetched on demand |

Never store secrets in `memory/` — that directory is copied by backup, and may be synced across machines.

---

## 3. Why this shape

- **Transparency over magic.** All routing lives in editable Markdown. You can read `CLAUDE.md` and predict what Claude will do.
- **Reversibility over convenience.** Every install takes a backup. Every hook exits gracefully. Nothing ships that Kevin can't remove in one command.
- **RAG over hallucination.** `CLAUDE.md §16` is the strictest rule in the framework: factual claims require a retrieved source in the current session. Agents and skills enforce this in their `<output_format>` and `<guardrails>`.
- **Agency-first, engineer-friendly.** The core engineering agents from the original upstream framework are preserved; agency agents and skills are additive. Consultants get proposals, GDPR, and brand voice; engineers get planners, debuggers, and migration plans.

---

## 4. File-level ownership map

| Who owns it | Files |
|---|---|
| Framework (don't hand-edit) | `agents/*`, `skills/*/SKILL.md` marked `owned: shine`, auto-sync block inside `CLAUDE.md` |
| User-editable | Everything in `settings.json` outside the auto-sync block, `memory/*`, any skill/agent you author |
| Volatile | `sessions/*`, `projects/*`, `cache/*`, `debug/*` |

See [CUSTOMIZATION.md](./CUSTOMIZATION.md) for how to extend the framework without breaking updates.
See [ADDING-INTEGRATIONS.md](./ADDING-INTEGRATIONS.md) for how to add MCP servers, tools, and connectors.
