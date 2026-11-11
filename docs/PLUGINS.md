# SHINE — Plugins & MCP Map

SHINE doesn't hard-depend on any plugin or MCP server. The 29 decision rules route to specific integrations **when you have them enabled in the active profile**. This doc lists every plugin the framework supports, how to install it, and what happens when it's missing.

Since 1.1, plugins are **opt-in per profile**. The installer only runs `claude plugins install` on the plugins required by your chosen profile (`minimal` installs none; `dev` installs the full engineering stack). See [README.md#context-profiles](../README.md#context-profiles).

---

## 1. Plugins supported by the framework

Installed via `claude plugins install <name>` during setup — **only if the active profile requires them** (skippable entirely with `--no-plugins`). Run `shine current` to see which plugins are enabled in your session; run `shine activate <name>` to switch bundles.

### Official marketplace

| Plugin | Purpose | Routed by |
|---|---|---|
| `serena` | Semantic code navigation (symbolic reads, symbol refactor, pattern search) | Rule #2, #5 — preferred over bulk file reads |
| `context7` | Live library docs (React, Next.js, Django, etc.) | Rule #11 — library/framework questions |
| `playwright` | Browser automation, screenshots, E2E | Rule #12 — "open the browser", UI tests |
| `superpowers` | Productivity multi-tool pack | Ad-hoc |
| `code-simplifier` | Refactor for readability | `/simplify` |
| `ralph-loop` | Long-running agentic loops | Rule #15 |
| `typescript-lsp` | TS type-aware operations | Rule #2 in TS projects |
| `pyright-lsp` | Python type-aware operations | Rule #2 in Python projects |
| `supabase` | Supabase DB/auth ops | Rule #14 when project has a Supabase client |
| `agent-sdk-dev` | SDK for building custom agents | Meta — used when you author agents |
| `claude-code-setup` | Setup helpers | One-shot at install |

### LSP marketplace (`claude-code-lsps`)

| Plugin | Purpose |
|---|---|
| `pyright` | Python LSP |
| `basedpyright` | Stricter fork of Pyright |

### Third-party marketplaces

| Plugin | Source | Purpose |
|---|---|---|
| `ui-ux-pro-max` | `nextlevelbuilder/ui-ux-pro-max-skill` | UI/UX audit skills |
| `claude-mem` | `thedotmack/claude-mem` | Cross-session memory helpers |
| `arize-skills` | `Arize-ai/arize-skills` | ML/LLM observability skills |

All marketplace repos are declared under `extraKnownMarketplaces` in `settings.template.json` so `claude plugins install` can resolve them without extra setup.

---

## 2. MCP servers expected by the decision rules

SHINE doesn't install MCP servers — that's user-scoped in Claude Code. But several decision rules assume they exist. When a rule fires and the MCP is missing, the rule downgrades gracefully to "ask the user to connect it" (CLAUDE.md §16 — never fabricate).

> **Rule #21 — Tiered Fallback:** When multiple tools can serve the same function, SHINE always tries free/local/OS tools first (Tier 1), then freemium tools after asking (Tier 2), then paid tools only with explicit approval (Tier 3). See `CLAUDE.md §21` and [`ADDING-INTEGRATIONS.md`](./ADDING-INTEGRATIONS.md).

### Communication & productivity

| MCP | Rule | Tier | Connect via |
|---|---|---|---|
| **Gmail** (`you@youragency.com`) | #17 (draft-email), #18 (GDPR-in-threads) | — | Claude Code Gmail connector |
| **Google Calendar** | #10 (scheduling) | — | GCal MCP |
| **Asana** | #9 (project sync), #13 (status updates) | — | Asana MCP |
| **Slack** | #9, comms | 1 (free) | `npx -y @korotovsky/slack-mcp-server` |
| **ntfy** | notifications | 1 (free) | `npx -y @gitmotion/ntfy-me-mcp` |

### Sales & enrichment

| MCP | Rule | Tier | Purpose |
|---|---|---|---|
| **Apollo.io** | #20 (lead-enrich) | 3 (paid) | People & company enrichment, campaigns |
| **Hunter.io** / **Close** | #20 | 3 (paid) | Email patterns, CRM sync |

### Search & web intelligence

| MCP | Rule | Tier | Purpose |
|---|---|---|---|
| **SearXNG** | #16, #21 | 1 (free) | Self-hosted meta-search — Google/Bing/DDG aggregated, no API key |
| **Fetch** (official) | #16 | 1 (free) | HTTP URL → clean markdown |
| **Puppeteer** (official) | #12 | 1 (free) | Headless Chrome for JS-heavy scraping |
| **RAG Web Browser** | #16 | 1 (free) | Apify OS search + scrape + markdown pipeline |
| **Brave Search** | #16 | 2 (freemium) | Brave Search API — requires key, free tier |
| **Tavily** | #16 | 2 (freemium) | AI semantic search — free tier |
| **Perplexity** | #16 | 3 (paid) | Live web answers, citations |
| **Exa** | #16 | 3 (paid) | Semantic web search |
| **Firecrawl** / **Apify** | #16 | 3 (paid) | Scraping, structured extraction |

### Databases & local analytics

| MCP | Rule | Tier | Purpose |
|---|---|---|---|
| **DuckDB** | #21, data analysis | 1 (free) | Analytical SQL on local CSV/Parquet/JSON |
| **SQLite** (official) | #21 | 1 (free) | Embedded local database |
| **PostgreSQL** (official) | #14 | 1 (free) | PostgreSQL schema + query |
| **MySQL** | #14 | 1 (free) | MySQL with configurable access |
| **MongoDB** | analytics | 1 (free) | MongoDB collections query & analysis |
| **Redis** | caching, search | 1 (free) | Key-value store + search |
| **Excel** | data, proposals | 1 (free) | Read/write .xlsx workbooks |
| **Supabase** | #14 | — (plugin) | DB, auth, edge functions |

### Vector memory & semantic search

| MCP | Rule | Tier | Purpose |
|---|---|---|---|
| **Qdrant** | memory, RAG | 1 (free) | Production vector search engine (local Docker) |

### Sandbox & code execution

| MCP | Rule | Tier | Purpose |
|---|---|---|---|
| **Docker** | safe execution | 1 (free) | Container lifecycle, isolated code execution |
| **Microsandbox** | safe execution | 1 (free) | Self-hosted AI code sandbox |
| **E2B** | safe execution | 2 (freemium) | Cloud code sandbox |

### Data visualization

| MCP | Rule | Tier | Purpose |
|---|---|---|---|
| **ECharts** | reporting | 1 (free) | Interactive Apache ECharts chart generation |
| **Mermaid** | diagrams | 1 (free) | Flowcharts, sequence, Gantt, ER diagrams |
| **VegaLite** | stats | 1 (free) | Statistical visualizations |

### Security & scanning

| MCP | Rule | Tier | Purpose |
|---|---|---|---|
| **Semgrep** | code review | 1 (free) | SAST security scanning |
| **OSV** | dep audit | 1 (free) | Open Source Vulnerabilities database |
| **sslmon** | infra | 1 (free) | SSL cert and domain monitoring |

### Monitoring & observability

| MCP | Rule | Tier | Purpose |
|---|---|---|---|
| **Signoz** | #3, #13 | 1 (free) | OS APM — traces, metrics, logs |
| **VictoriaMetrics** | monitoring | 1 (free) | Prometheus-compatible metrics |
| **Kubernetes** | infra | 1 (free) | Multi-cluster K8s management |
| **Sentry** | #3 (debugger), #13 | 2 (freemium) | Error triage |

### Version control (extended)

| MCP | Rule | Tier | Purpose |
|---|---|---|---|
| **GitHub** (official) | #2, #7 | 1 (free) | PRs, issues, code search |
| **GitLab** (official) | #2, #7 | 1 (free) | GitLab project management |
| **Git** (official) | #2 | 1 (free) | Local Git repository ops |

### File systems & documents

| MCP | Rule | Tier | Purpose |
|---|---|---|---|
| **Filesystem** (official) | #2 | 1 (free) | Local FS with configurable paths |
| **FileStash** | remote files | 1 (free) | SFTP, S3, FTP, WebDAV, SMB |
| **eBook** | docs | 1 (free) | Read PDF + EPUB locally |
| **markitdown** / **pdf2md** | #6 (doc-writer) | 1 (free) | Convert PDFs to Markdown |

### Research & academic

| MCP | Rule | Tier | Purpose |
|---|---|---|---|
| **ArXiv** | research | 1 (free) | ArXiv paper search |
| **PapersWithCode** | research | 1 (free) | Papers + matching codebases |

### Knowledge management

| MCP | Rule | Tier | Purpose |
|---|---|---|---|
| **Obsidian** | knowledge | 1 (free) | Obsidian vault search and management |
| **Apple Notes** | knowledge | 1 (free) | macOS Apple Notes querying |

### Social media & content

| MCP | Rule | Tier | Purpose |
|---|---|---|---|
| **YouTube** | research, content | 1 (free) | Video transcript/subtitle analysis |
| **BlueSky** | social | 1 (free) | BlueSky feed search |

### Cloud & infrastructure

| MCP | Rule | Tier | Purpose |
|---|---|---|---|
| **Cloudflare** | deploy | 2 (freemium) | Workers, KV, R2, D1 |
| **Globalping** | network | 1 (free) | ping, traceroute, DNS from global probes |

### AI services

| MCP | Rule | Tier | Purpose |
|---|---|---|---|
| **OpenAI Chat** | multi-model | 2 (freemium) | Chat with OpenAI-compatible models |
| **HuggingFace Spaces** | AI | 1 (free) | Image, text, audio models |

### Dev tools (extended)

| MCP | Rule | Tier | Purpose |
|---|---|---|---|
| **Figma** | UI work | 1 (free) | Design → code-ready data |
| **OpenAPI Explorer** | API work | 1 (free) | OpenAPI/Swagger spec browsing |

### SEO & MarTech

| MCP | Rule | Tier | Purpose |
|---|---|---|---|
| **Ahrefs** (MCP) | #8 (SEO) | 3 (paid) | Keyword research, backlinks |
| **GSC** (via Ahrefs MCP) | #8 | 3 (paid) | Search Console data |

---

## 3. Auto-sync block inside CLAUDE.md

On every SessionStart, `hooks/integration-sync.js` rewrites this block inside `~/.claude/CLAUDE.md`:

```md
<!-- shine:plugins:begin -->
<!-- Auto-generated by hooks/integration-sync.js on SessionStart. Do not edit by hand. -->

### Enabled plugins
- `serena@claude-plugins-official`
- …

### Connected MCP servers
- `Gmail`
- `Apollo`
- …

<!-- shine:plugins:end -->
```

This means the routing rules always know what's currently available. If you disconnect Gmail, the next session drops it from the block and rule #17 adapts.

---

## 4. Missing-integration behaviour

When a rule needs an integration that isn't connected, SHINE follows CLAUDE.md §16:

1. **State the gap** — "I can draft this email, but Gmail MCP isn't connected, so I can't read the thread."
2. **Give the non-technical setup** — point at the Claude Code connector UI or the MCP install command.
3. **Offer a degraded path** — e.g., "Paste the thread inline and I'll draft from that."

Never fabricate thread content, never invent enrichment data, never guess API responses.

---

## 5. Adding a new MCP (quick reference)

```bash
# Example: add a custom MCP server
claude mcp add my-mcp --command "npx -y @myorg/mcp-server"
```

Or edit `~/.claude/settings.json`:

```jsonc
"mcpServers": {
  "my-mcp": {
    "command": "npx",
    "args": ["-y", "@myorg/mcp-server"],
    "env": { "MY_API_KEY": "${MY_API_KEY}" }
  }
}
```

SessionStart will pick it up, `integration-sync.js` will add it to the CLAUDE.md block, and the rules will be aware of it — though you may want to add a routing rule that says "prefer my-mcp for X task."

For the **full integration guide** — including how to create matching agents, skills, and decision rules — see [`docs/ADDING-INTEGRATIONS.md`](./ADDING-INTEGRATIONS.md).

---

## 6. Disabling a plugin without uninstalling

**Preferred: use a profile.** Switch to a profile that doesn't include the plugin:

```bash
shine activate minimal   # disables all plugins
shine activate writing   # only context7
```

`shine activate` rewrites `enabledPlugins` in `settings.json` atomically. Restart Claude Code for changes to take effect.

**Manual alternative:** Edit `settings.json` directly:

```jsonc
"enabledPlugins": {
  "playwright@claude-plugins-official": false
}
```

It stays on disk but won't load. Flip back to `true` any time — but note that the next `shine activate` overwrites the whole block.

**Disabling an MCP server** (without removing the connection):

```jsonc
"disabledMcpjsonServers": ["Desktop_Commander", "Claude_in_Chrome"]
```

The MCP stays configured but its tool schemas aren't loaded into context. Profiles set this array to suppress irrelevant MCPs per use case (e.g., `outbound` disables dev-oriented MCPs).

---

## 7. Tiered fallback strategy

When multiple tools serve the same function (e.g. web search), SHINE follows **Rule #21**:

```
Tier 1 (free/local/OS) → always try first, no questions asked
  ↓ unavailable
Tier 2 (freemium)      → ASK user before consuming credits
  ↓ unavailable
Tier 3 (paid)          → REQUIRE explicit approval, state costs
  ↓ unavailable
Manual fallback        → ask user to paste content / upload file
```

This ensures SHINE is cost-efficient by default while never blocking the user from accessing premium tools when they need them. See `CLAUDE.md §21` for the full rule.
