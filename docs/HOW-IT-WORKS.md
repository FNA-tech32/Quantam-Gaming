# SHINE — How It Works

A narrative walkthrough of what happens from `claude` → response, so you can debug and extend with intent. For the static layout, see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## 1. Session start

When you run `claude` in a project directory:

1. **Claude Code reads `~/.claude/settings.json`** — picks up the model, env vars, hooks, `enabledPlugins` (profile-gated since 1.1), `disabledMcpjsonServers`, MCP servers, and statusline command.
2. **SessionStart hooks fire in order** (5–15s timeouts each, all non-blocking on failure):
   - `global-memory-symlink.sh` — if `./memory` doesn't exist or is already a matching symlink, links it to `~/.claude/memory/`. Opt-out: `touch ~/.claude/.no-memory-symlink`.
   - `shine-check-update.js` — fetches the latest GitHub release tag (cached 24h) and prints a stderr notice if you're behind.
   - `integration-sync.js` — rewrites the `<!-- shine:plugins:begin -->` block inside `~/.claude/CLAUDE.md` so the routing rules always know what's connected.
3. **The slim `CLAUDE.md` (~6KB) loads into the system prompt**, along with any `memory/preference-*.md` files (always-on) and the auto-synced plugins/MCP block. On-demand reference files in `shine/references/` are **not** loaded yet — skills/agents read them when a rule actually needs them.
4. **Statusline renders** — `statusline.js` prints `✨ SHINE · <model> · <cwd> · ⎇ <branch> · ◆ <client> · <ctx>KB`.

You now see the prompt. The model has the core identity, top-level decision rules, the §16 Factual / RAG discipline table, your preferences, and pointers to the detailed references. It does **not** yet have client memory, project memory, the full 29-rule matrix, the MCP inventory, or the agency playbook — those load **just before reasoning** via the `UserPromptSubmit` hooks (§1a below) or lazily when a rule fires.

**Context profile.** The set of plugins the model knows about is determined by the active profile in `~/.claude/shine/profiles/*.json`. Check with `shine current`; switch with `shine activate <name>` and restart the session.

### 1a. UserPromptSubmit pre-load (cuts §17 / §19 / §20 latency)

When you press Enter, **before** the model sees your prompt, two `UserPromptSubmit` hooks run in parallel:

- **`shine-client-detect.js`** — scans the prompt for client slugs derived from `memory/client-<slug>.md` filenames. On a hit, it emits a JSON `additionalContext` directive (`@~/.claude/memory/client-<slug>.md`) so Claude Code injects the client memory into the very next turn. No "which client?" round-trip; rules §17 / §19 / §20 fire with full context already loaded. Opt-out: `SHINE_DISABLE_CLIENT_DETECT=1`.
- **`shine-tone-calibrator.js`** — regex-only detection of tone-correction signals across 5 axes (formality / length / warmth / assertiveness / jargon, EN + IT). Writes a timestamped delta to `memory/style-<active-client>.md` (or `style-global.md`). The next time you draft anything with that client, the style file is loaded and Claude calibrates to your accumulated corrections. Opt-out: `SHINE_DISABLE_TONE_CALIBRATOR=1`.

Both hooks are PII-free: client-detect only matches against known slug filenames; tone-calibrator only inspects regex signals, never prompt content.

---

## 2. The 29 decision rules

Every prompt is pattern-matched against the rules in `CLAUDE.md §Decision rules`. The rules are literal — you can read them. Rule #21 is special: it governs **tool tier resolution** across all capabilities (see §3a below). Rules §22–§29 map specific MCP-capability clusters. A few illustrative examples:

| # | Trigger | Action |
|---|---|---|
| 1 | "plan / strategy / roadmap" + technical scope | Delegate to `shine-planner` agent |
| 2 | "implement / build / code" + known files | Delegate to `shine-executor` agent |
| 3 | "why doesn't … / error / broken" | Delegate to `shine-debugger` agent |
| 4 | Any write + risky path (secrets, prod config) | Stop, ask for confirmation |
| 7 | "review PR / code review" | Run `shine-review` skill |
| 11 | Library / framework question | Route to `context7` plugin for live docs |
| 15 | Long-running sub-investigation | Spawn sub-agent via Task tool, don't inline |
| 16 | Any factual claim (company, person, number, URL) | Ground in a live retrieval, never fabricate; apply verified-source watermark |
| 17 | Client name + communication verb | Load `client-<slug>.md` + `style-email-*.md`, run `draft-email` skill |
| 18 | PII / personal data mentioned | Run `gdpr-analyst` check before storing |
| 19 | "proposal / preventivo" | Load client memory, run `proposal` skill (MoSCoW, MD, 15% discount) |
| 20 | Lead list mentioned | Run `lead-enrich` skill, Apollo/Hunter MCP |
| **21** | **Any tool selection with free + paid alternatives** | **Tiered fallback: Tier 1 (free) → Tier 2 (freemium, ask) → Tier 3 (paid, explicit approval)** |
| 22 | "research / investigate / find sources" on the open web | Delegate to `shine-web-researcher` (searxng → fetch → brave-search) |
| 23 | "analyze CSV / SQL / spreadsheet / KPI" | Delegate to `shine-data-engineer` (duckdb / sqlite / excel / echarts) |
| 24 | "chart / diagram / dashboard" | Delegate to `shine-chart-builder` (echarts / mermaid / vegalite) |
| 25 | "scan / vulnerability / dependency audit" | Delegate to `shine-vulnerability-scanner` (semgrep / osv / sslmon) |
| 26 | "run this code / sandbox / try this snippet" | Delegate to `shine-sandbox-runner` (docker / microsandbox / e2b) |
| 28 | "deploy / cluster / monitoring / probe" | Delegate to `shine-infra-ops` (docker / kubernetes / signoz / globalping) |

When a rule fires, Claude does **exactly** what the rule says. If multiple rules match, the more specific one wins.

---

## 3. Skills vs agents — when each fires

- **Skills** = slash commands. You type `/proposal CONTOSO tech-SEO`; Claude reads `skills/proposal/SKILL.md` as a system instruction and runs it. Skills are explicit, single-shot, user-triggered.
- **Agents** = sub-agents spawned via the Task tool. Claude decides to delegate (per the decision rules) when a task needs fresh context or a different tool budget. Each agent runs in its own context window and returns a 5-section report.

Rule of thumb:

> **If the user asks for it by name → skill. If the main thread needs help staying focused → agent.**

---

## 4. Memory lifecycle

### Typed index

`memory/MEMORY.md` is the human-readable index. Each entry points to a file with frontmatter:

```yaml
---
type: client              # preference | client | project | style | external
name: CONTOSO Italia
last_updated: 2026-04-14
tags: [tech-seo, salesforce, flat-budget]
---
```

### Load strategy

- `type: preference` — injected on every SessionStart, always available.
- `type: client` — loaded when the client slug appears in the prompt (rule #17, #19, #20).
- `type: project` — loaded when a project slug is mentioned.
- `type: style` — loaded alongside the matching client/project.
- `type: external` — lazy; only fetched when a skill explicitly requests it.

### Volatility

- `memory/` is **stable** — update rarely, after a pattern is validated.
- `sessions/` is **volatile** — precompact snapshots, active-client marker, ephemeral scratch.
- Never store secrets in either. Credentials belong in macOS Keychain or `~/.config/<tool>/` files referenced by your shell env.

---

## 5. Tool-use lifecycle (PreToolUse → PostToolUse)

When Claude invokes a tool (Bash, Edit, Write, Agent, Task, …):

1. **PreToolUse hooks fire** (if the matcher matches the tool name):
   - `shine-prompt-guard.js` on `Write|Edit` — inspects `file_path` and `content` for secret-shaped patterns (sk-…, ghp_…, AKIA…, AIza…, Stripe live, Slack xox, PEM). On hit, **exits 2 — aborts the tool call** and tells the model why. Opt-out: `SHINE_DISABLE_PROMPT_GUARD=1`.
   - `shine-read-guard.js` on `Write|Edit` — warns (stderr, exit 0) when the path is `node_modules/`, `dist/`, a lockfile, etc.
2. **Tool runs** (unless aborted).
3. **PostToolUse hooks fire**:
   - `shine-context-monitor.js` on `Bash|Edit|Write|MultiEdit|Agent|Task` — checks transcript size; at 800 KB prints a "soft limit" notice, at 1.6 MB a "hard limit" notice. Thresholds tunable via `SHINE_CONTEXT_SOFT_KB` / `SHINE_CONTEXT_HARD_KB`.

No hook can rewrite tool input. They can **block** (exit 2) or **warn** (stderr + exit 0). This is deliberate — we want hooks to be easy to reason about. The two `UserPromptSubmit` hooks (`shine-client-detect`, `shine-tone-calibrator`) are the one exception: they emit JSON to stdout to inject `additionalContext` into the next turn (a Claude Code feature, not a side-effect).

---

## 5a. End-of-turn & end-of-session (Stop / SessionEnd)

Once Claude finishes a turn:

- **`shine-learning-log.js`** (Stop) — appends a single JSONL line to `~/.claude/memory/learning-log.jsonl`: `{ts, cwd, last_tool, transcript_bytes, event}`. **Metadata only**, no conversation content. LRU cap `SHINE_LEARNING_LOG_MAX=10000`.

When the whole session ends (you exit `claude`, the process is killed, or Claude Code transitions to a new project):

- **`shine-session-summary.js`** (SessionEnd) — reads the JSONL tail to compute the session window (last 6h same cwd), turn count, and top tools. Appends a markdown block to `~/.claude/memory/learning-log.md` with placeholders `Task:` / `Outcome:` / `Preference observed:` for `/shine-retro` to fill on the next weekly review. Cap `SHINE_SESSION_SUMMARY_MAX=1000`.

Together, these two files feed the cross-session learning loop. Run `/shine-retro` weekly to consolidate observations into typed memory updates (the skill never edits memory directly — it proposes diffs).

---

## 6. PreCompact — the snapshot you'll thank yourself for

When Claude Code triggers a compact (auto or manual), `shine-precompact.js` writes a small Markdown file to `~/.claude/sessions/precompact-<timestamp>.md`:

```markdown
# SHINE pre-compact snapshot
- **When:** 2026-04-15T09:41:23.000Z
- **Trigger:** auto
- **Last tool:** Edit
- **CWD:** /Users/you/work/contoso-tech-seo
```

Retention is 20 by default (`SHINE_PRECOMPACT_KEEP`). After a compact you lose a lot of context; this file is how you quickly orient yourself — "I was in the CONTOSO project, last edited a file, compact was automatic."

---

## 7. Two canonical flows

### 7.1 "Draft a reply to Jamie about ACME link building"

1. Prompt matches **rule #17** (client `ACME` in memory + "draft / reply").
2. Claude loads `memory/client-acme.md` + `memory/style-email-it.md`.
3. Reads the last thread via Gmail MCP (you@youragency.com).
4. Spawns the `draft-email` skill → produces subject `ACME | <topic>`, warm IT opening, bullet body, short sign-off, correct CC list (Alex + Morgan).
5. Output is a **draft**, never auto-sent — CLAUDE.md §16 + skill `<guardrails>`.

### 7.2 "Proposta per CONTOSO SEO Q2 2026"

1. Prompt matches **rule #19** (keyword `proposta / proposal`).
2. Claude loads `memory/client-contoso.md` (flat budget, tech-SEO focus, Salesforce CRM, Sam Taylor).
3. Runs the `proposal` skill:
   - MoSCoW structure
   - MDs at 8h each
   - ~15% discount option flagged
   - Italian language, Kevin's proposal style
   - Proposes a discussion call **before** sending the PDF.
4. Returns a draft `.md` file for Kevin to review, not a sent document.

---

## 7a. Tiered fallback in action

### "Research competitor pricing for CONTOSO"

1. Prompt matches **rule #16** (factual claim about company) and **rule #21** (tool tier resolution).
2. Claude checks for Tier 1 (free) search tools:
   - `searxng` installed? → **Yes** → use it. No questions asked.
   - If not installed, check `fetch` MCP for direct URL access.
3. If Tier 1 unavailable, Claude informs the user:
   - _"SearXNG isn't connected. I can try Brave Search (free tier, needs API key). Proceed?"_
4. If user approves Tier 2 → use `brave-search`. If not, try Tier 3:
   - _"I can use Perplexity (paid API). This will consume credits. Proceed?"_
5. If all tiers unavailable → manual fallback:
   - _"No search tools available. Please paste the competitor's pricing page content."_
6. Results are grounded in retrieved sources (rule #16), with watermark labels.

This flow ensures **zero surprise costs** while never blocking the user.

---

## 8. Failure modes & debugging

| Symptom | Likely cause | Fix |
|---|---|---|
| SessionStart feels slow | A hook is hitting a network timeout | `SHINE_DISABLE_UPDATE_CHECK=1`, or check `~/.claude/cache/shine-update.json` |
| `/integration-sync` block not updating | `integration-sync.js` can't write CLAUDE.md | Check permissions; run `node ~/.claude/hooks/integration-sync.js` manually |
| Writes blocked with "prompt-guard" | Real secret detected | Move the secret to env / keychain; if false positive, `SHINE_DISABLE_PROMPT_GUARD=1` for the session |
| Hallucinated company facts | Rule #16 not firing | Add the specific fact pattern to CLAUDE.md or to the skill's `<guardrails>` |
| Update notice keeps appearing after updating | Cache stale | `rm ~/.claude/cache/shine-update.json` |
| Tool used paid API without asking | Rule #21 not firing | Ensure CLAUDE.md has the tiered fallback rule (see §21) |
| MCP tools not appearing | Server not registered | Run `claude mcp add <name> --command "..."` or edit `settings.json` |

For deeper customization — adding your own agents, skills, hooks, MCP servers, or rewriting decision rules — see [CUSTOMIZATION.md](./CUSTOMIZATION.md) and [ADDING-INTEGRATIONS.md](./ADDING-INTEGRATIONS.md).
