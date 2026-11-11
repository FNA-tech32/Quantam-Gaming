# SHINE — Customization Guide

Everything in SHINE is plain Markdown + JSON + small scripts. You can extend or rewrite any piece without forking.

---

## 1. What's safe to edit

| File / dir | Edit? | Notes |
|---|---|---|
| `~/.claude/CLAUDE.md` | ✅ Yes, **outside** the auto-sync block | The block `<!-- shine:plugins:begin --> … <!-- shine:plugins:end -->` is rewritten on every SessionStart by `integration-sync.js` |
| `~/.claude/settings.json` | ✅ Yes | Change the model, add your own MCP servers, tweak hook timeouts. `enabledPlugins` + `disabledMcpjsonServers` are managed by `shine activate` — prefer that CLI over hand-editing. |
| `~/.claude/shine/profiles/*.json` | ✅ Yes (add your own) | Copy an existing profile, customise, then `shine activate <your-name>`. |
| `~/.claude/shine/references/*.md` | ✅ Yes | These are the on-demand reference files (decision-rules, integrations-map, agency-playbook, tool-tiers, mcp-capability-map). Edit to match your own conventions. |
| `~/.claude/memory/*.md` | ✅ Yes | Add new client / project / style / external files |
| `~/.claude/agents/*.md` | ✅ Yes for your own, ⚠️ avoid editing `shine-*` directly | If you rewrite a SHINE agent, an update will overwrite it. Copy to a new name instead. |
| `~/.claude/skills/<you>/` | ✅ Yes | Your own skills live next to the shipped ones |
| `~/.claude/hooks/*` | ⚠️ Edit with care | These run on every session / tool call. A crash fails open (exit 0) except `shine-prompt-guard.js`. |

---

## 1a. Building a custom context profile

The 6 shipped profiles cover most cases, but you can create your own. Each profile is a JSON file at `~/.claude/shine/profiles/<name>.json` with this schema:

```jsonc
{
  "name": "my-profile",
  "description": "One-line human summary, shown in `shine list`.",
  "estimatedContextTokens": 45000,
  "enabledPlugins": {
    "context7@claude-plugins-official": true,
    "serena@claude-plugins-official": true
  },
  "disabledMcpjsonServers": [
    "Desktop_Commander",
    "Claude_in_Chrome"
  ]
}
```

Then activate:

```bash
shine list                 # verify it appears
shine show my-profile      # double-check JSON
shine activate my-profile  # rewrites ~/.claude/settings.json atomically
# restart Claude Code
```

**Tips when building a profile:**
- Start from an existing profile (`cp minimal.json my-profile.json`) and add only what you need.
- `enabledPlugins` uses fully-qualified names — format is `<plugin>@<marketplace>` (e.g., `serena@claude-plugins-official`).
- `disabledMcpjsonServers` is for MCPs already in your `settings.json` / `~/.claude.json` `mcpServers` block. It does not uninstall them — it tells Claude Code not to load their tool schemas in this profile.
- Estimate tokens empirically: activate the profile, run Claude Code, check `/context` or the statusline for the actual cost, update the JSON field. `estimatedContextTokens` is only a hint for the picker.

---

## 2. Environment & model

Edit `~/.claude/settings.json`:

```jsonc
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1",

    // Leave empty to hit api.anthropic.com. Only set if you route through a gateway.
    "ANTHROPIC_BASE_URL": "",

    "ANTHROPIC_DEFAULT_OPUS_MODEL":   "claude-opus-4-6",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "claude-sonnet-4-6",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL":  "claude-haiku-4-5",

    "DISABLE_PROMPT_CACHING": "0"
  },
  "model": "claude-opus-4-6"
}
```

### Telemetry (opt-in)

Off by default. To turn on OpenTelemetry export:

```jsonc
{
  "env": {
    "CLAUDE_CODE_ENABLE_TELEMETRY": "1",
    "OTEL_METRICS_EXPORTER":         "otlp",
    "OTEL_LOGS_EXPORTER":            "otlp",
    "OTEL_EXPORTER_OTLP_PROTOCOL":   "http/json",
    "OTEL_EXPORTER_OTLP_ENDPOINT":   "https://otel.your-collector.example/v1",
    "OTEL_RESOURCE_ATTRIBUTES":      "service.name=claude-code,deployment.environment=kevin-laptop"
  }
}
```

No OTEL fields are pre-filled — SHINE does not phone home by default.

### Custom gateway

If your org proxies Anthropic traffic:

```jsonc
"ANTHROPIC_BASE_URL": "https://anthropic.gateway.corp.example"
```

Leave blank for direct API access.

---

## 3. Adding a client to memory

```bash
cat > ~/.claude/memory/client-acme.md <<'EOF'
---
type: client
name: ACME S.p.A.
last_updated: 2026-04-15
tags: [martech, salesforce, milan]
---

# ACME S.p.A.

## Contacts
- **Main**: Maria Rossi, CMO, maria.rossi@acme.it
- **CC always**: Alex (internal PM)

## Engagement
- Retainer, monthly MD cap 12
- Quarterly review cadence
- Tone: formal IT, warm opening, always propose call before sending docs

## Active topics
- Salesforce Marketing Cloud migration
- Lead scoring model refresh
EOF
```

Then add one line under **Clients** in `memory/MEMORY.md`:

```md
- [ACME S.p.A.](client-acme.md) — Maria Rossi, MarTech retainer, Salesforce
```

That's it. Next time you say "draft a reply for ACME", rule #17 will load this file automatically.

---

## 4. Authoring a new skill

Skills live in `~/.claude/skills/<name>/SKILL.md`:

```md
---
name: contoso-weekly-report
description: "Generate CONTOSO's weekly tech-SEO status in your agency's style"
argument-hint: "[week-number]"
allowed-tools:
  - Read
  - Write
  - Grep
---

<objective>
Produce a one-pager in IT, structure:
1. Cosa abbiamo fatto (bullets, MDs burned)
2. Cosa c'è in coda
3. Blocker / attese
4. Prossimo step + data di sync

Pull data from ~/.claude/memory/client-stef.md and this week's notes in ./notes/.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): never invent KPI numbers; only cite measured data.
- **Language**: IT.
- **Never auto-send**: produce `./reports/stef-W<N>.md` and stop.
</guardrails>
```

Test: `/stef-weekly-report 16`.

---

## 5. Authoring a new agent

Agents live in `~/.claude/agents/<name>.md`:

```md
---
name: shine-my-specialist
description: "Deep-dive auditor for <domain>"
tools: Read, Grep, Glob, Bash, WebFetch
color: cyan
---

<role>
You are a senior <domain> auditor. Your job is to return a grounded 5-section report in under 400 lines.
</role>

<approach>
1. Restate the ask in one sentence.
2. List every source you'll need.
3. Fetch them (WebFetch / Grep / Read).
4. Synthesize findings.
5. Produce the 5-section report.
</approach>

<anti_patterns>
- Do not speculate. Say "I don't know" before guessing.
- Do not run destructive commands.
- Do not skip the Sources section.
</anti_patterns>

<output_format>
## Summary
## Details
## Sources
## Open questions
## Next step
</output_format>
```

Call it via the Task tool or by having CLAUDE.md's rules reference it.

---

## 6. Adding your own hook

Hooks are just executables. Add the script, then register it in `settings.json`:

```jsonc
"hooks": {
  "SessionStart": [
    {
      "hooks": [
        { "type": "command", "command": "node \"$HOME/.claude/hooks/my-hook.js\"", "timeout": 5 }
      ]
    }
  ]
}
```

### Hook contract

- **stdin**: JSON payload (for PreToolUse/PostToolUse it includes `tool_name` and `tool_input`; for SessionStart it's empty).
- **stdout**: generally ignored.
- **stderr**: shown to the user / model.
- **exit code**:
  - `0` — continue normally.
  - `2` — **abort the tool call** (PreToolUse only). stderr becomes the abort reason.
  - Any other non-zero — logged, session continues.

Always design hooks to **fail open**. A broken hook should never block Claude from running.

---

## 7. Adding MCP servers (capability expansion)

SHINE maps **60+ recommended MCP servers** across 20 capability categories. All follow Rule #21 (Tiered Fallback).

### Quick install (top 5 priorities)

```bash
# 🔍 Deep web search (free, no API key)
claude mcp add searxng --command "npx -y @ihor-sokoliuk/mcp-searxng"

# 🗄️ Local analytics (free, no server needed)
claude mcp add duckdb --command "npx -y @ktanaka101/mcp-server-duckdb"

# 🧠 Semantic vector memory (free, local Docker)
claude mcp add qdrant --command "npx -y @qdrant/mcp-server-qdrant"

# 📦 Sandboxed code execution (free)
claude mcp add docker --command "npx -y @quantgeekdev/docker-mcp"

# 📊 Data visualization (free)
claude mcp add echarts --command "npx -y @hustcc/mcp-echarts"
```

### Tiered fallback (Rule #21)

When multiple tools serve the same function:

```
Tier 1 (free/local)  → use automatically, no questions
Tier 2 (freemium)    → ASK before consuming credits
Tier 3 (paid)        → REQUIRE explicit approval
All unavailable      → manual fallback (paste/upload)
```

For the full integration guide — including how to create matching agents, skills, and decision rules — see [`docs/ADDING-INTEGRATIONS.md`](./ADDING-INTEGRATIONS.md). For the complete MCP map with tiers, see [`docs/PLUGINS.md`](./PLUGINS.md).

---

## 8. Opt-outs (env vars)

All shipped hooks respect these:

### Disable / enable

| Var | Effect |
|---|---|
| `SHINE_DISABLE_UPDATE_CHECK=1` | Skip the GitHub release check |
| `SHINE_DISABLE_CONTEXT_MONITOR=1` | Skip the transcript-size warning |
| `SHINE_DISABLE_PROMPT_GUARD=1` | Allow writes with secret-shaped content (dangerous) |
| `SHINE_DISABLE_READ_GUARD=1` | Suppress "editing generated file" warnings |
| `SHINE_DISABLE_PRECOMPACT=1` | Skip the precompact snapshot |
| `SHINE_DISABLE_LEARNING_LOG=1` | Stop appending per-turn JSONL metadata to `learning-log.jsonl` |
| `SHINE_DISABLE_SESSION_SUMMARY=1` | Stop appending per-session markdown blocks to `learning-log.md` |
| `SHINE_DISABLE_CLIENT_DETECT=1` | Stop pre-loading client memory via `UserPromptSubmit` |
| `SHINE_DISABLE_TONE_CALIBRATOR=1` | Stop tracking tone-correction signals |

### Tunables

| Var | Default | Effect |
|---|---|---|
| `SHINE_CONTEXT_SOFT_KB`, `SHINE_CONTEXT_HARD_KB` | 800 / 1600 | Transcript size thresholds in KB |
| `SHINE_PRECOMPACT_KEEP` | 20 | Retention count for precompact snapshots |
| `SHINE_LEARNING_LOG_MAX` | 10000 | LRU cap for per-turn JSONL entries |
| `SHINE_SESSION_SUMMARY_MAX` | 1000 | LRU cap for per-session markdown blocks |
| `SHINE_CLIENT_DETECT_MAX` | 3 | Max client memories pre-loaded per prompt |
| `SHINE_CLIENT_DETECT_MIN_LEN` | 4 | Minimum slug length to match (filters short common words) |
| `SHINE_TONE_GLOBAL` | 1 | When set to `0`, tone deltas only write to `style-<active-client>.md` (never `style-global.md`) |
| `SHINE_TONE_MAX_ENTRIES` | 200 | LRU cap per style file |
| `SHINE_HOOK_FORMAT` | `text` | Set to `json` for one-line JSONL output per notification (log pipelines) |
| `SHINE_UPDATE_REPO` | `diShine-digital-agency/shine-claude-code-framework` | Override the GitHub repo for update checks |

---

## 8. Statusline customization

Two options ship:

1. `statusline.js` (default) — Node, prints model · cwd · branch · active-client · context size.
2. `statusline.sh` — pure bash, no dependencies. Swap in `settings.json`:

```jsonc
"statusLine": {
  "type": "command",
  "command": "bash ~/.claude/statusline.sh"
}
```

### Setting the active client

Two ways:

```bash
# One-off, session-scoped
export CLAUDE_ACTIVE_CLIENT=stef

# Persistent, read by every new session
echo "stef" > ~/.claude/sessions/active-client
```

The statusline picks it up on next render. The `◆ <client>` badge turns on.

---

## 9. Rewriting decision rules

The 29 rules in `CLAUDE.md §Decision rules` are intentionally editable. Make them yours:

- Remove rules you don't use (e.g., if you don't do proposals, drop rule #19).
- Add client-specific rules. Example: "When the user mentions `BANDO RER`, always load `client-rer.md` **and** `external-bandi-pa.md` before replying."
- Tighten language. If Claude keeps hallucinating a certain kind of fact, add a rule that forbids it explicitly.
- **Rule #21 (Tiered Fallback)** is special — it governs tool selection priority across all capabilities. Customize the tier map in `CLAUDE.md §15` if you want to promote a paid tool to be used without asking.

The auto-sync block (`<!-- shine:plugins:begin -->`) at the bottom is managed by the framework — leave it alone.

---

## 10. Updating SHINE safely

```bash
cd ~/Downloads/shine-claude-code-framework
git pull
./install.sh --dry-run   # see what would change
./install.sh             # atomic backup + copy
```

If something breaks: `./uninstall.sh` restores the previous `~/.claude/`. If you've hand-edited shipped files, they'll be overwritten — keep custom agents/skills under new names and your own `hooks/*-custom.*` to survive updates cleanly.

> **MCP servers are safe across updates** — they live in `settings.json` under `mcpServers`, which `install.sh` merges rather than overwrites.
