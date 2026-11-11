# SHINE — Adding Integrations (MCP Servers, Tools & Connectors)

This guide explains how to extend SHINE by adding **any** MCP server, external tool, or data connector. SHINE is designed to be modular — this document is the canonical reference for plugging in new capabilities.

---

## 0. Philosophy: Free-First Tiered Fallback

SHINE follows a **tiered tool resolution** strategy. When multiple tools can serve the same function (e.g. web search), the framework always tries **free / local / open-source** options first, then proposes alternatives only when the free path can't deliver.

```
┌───────────────────────────────────────────────────────────────┐
│                  TOOL TIER RESOLUTION                         │
├───────────────────────────────────────────────────────────────┤
│  TIER 1 — FREE / LOCAL / OPEN SOURCE                         │
│  Always try first. No API key, runs on your machine.         │
│  Examples: SearXNG, Crawl4AI, DuckDB, SQLite, Docker         │
├───────────────────────────────────────────────────────────────┤
│  TIER 2 — FREEMIUM (API key, free tier)                      │
│  Use if Tier 1 is unavailable or insufficient.               │
│  ASK the user before consuming paid credits.                 │
│  Examples: Brave Search, Exa, E2B, Tavily                    │
├───────────────────────────────────────────────────────────────┤
│  TIER 3 — PAID / PREMIUM                                     │
│  Only use with explicit user approval.                       │
│  INFORM the user of cost implications before calling.        │
│  Examples: Firecrawl (paid plan), Ahrefs, Apollo.io          │
└───────────────────────────────────────────────────────────────┘
```

**Rules:**
1. **Never silently call a paid API.** Always inform the user and ask first.
2. **Always state the tier** when proposing a fallback: _"SearXNG isn't connected. I can try Brave Search (free tier, needs API key). Want me to?"_
3. **If all tiers are unavailable**, state the gap clearly and offer a manual path (paste content, upload file, etc.).

This strategy is enforced by **CLAUDE.md Rule #21**.

---

## 1. Quick-start: Add an MCP server in 60 seconds

### Option A: CLI (recommended)

```bash
# Syntax: claude mcp add <name> --command "<start command>"
# Examples:

# DuckDB (local analytics)
claude mcp add duckdb --command "npx -y @ktanaka101/mcp-server-duckdb"

# SearXNG (self-hosted meta-search)
claude mcp add searxng --command "npx -y @ihor-sokoliuk/mcp-searxng" \
  --env SEARXNG_URL=http://localhost:8080

# Qdrant (vector memory)
claude mcp add qdrant --command "npx -y @qdrant/mcp-server-qdrant" \
  --env QDRANT_URL=http://localhost:6333

# Docker (sandboxed execution)
claude mcp add docker --command "npx -y @quantgeekdev/docker-mcp"
```

### Option B: Edit `settings.json` directly

Add entries under `"mcpServers"`:

```jsonc
{
  "mcpServers": {
    "duckdb": {
      "command": "npx",
      "args": ["-y", "@ktanaka101/mcp-server-duckdb"],
      "env": {}
    },
    "searxng": {
      "command": "npx",
      "args": ["-y", "@ihor-sokoliuk/mcp-searxng"],
      "env": { "SEARXNG_URL": "http://localhost:8080" }
    },
    "qdrant": {
      "command": "npx",
      "args": ["-y", "@qdrant/mcp-server-qdrant"],
      "env": {
        "QDRANT_URL": "http://localhost:6333",
        "QDRANT_COLLECTION": "shine-memory"
      }
    },
    "docker": {
      "command": "npx",
      "args": ["-y", "@quantgeekdev/docker-mcp"],
      "env": {}
    }
  }
}
```

### What happens next

1. **Next session start**, `integration-sync.js` detects the new MCP and adds it to the auto-sync block in `CLAUDE.md`.
2. Claude can now **call the MCP's tools** without further setup.
3. For optimal routing, **add a decision rule** (see §3 below).

### Suppressing an MCP per profile

Every MCP loads its tool schemas into context — some are hundreds of tools. If you've installed an MCP but don't need it in every session, add it to the active profile's `disabledMcpjsonServers`:

```jsonc
// ~/.claude/shine/profiles/writing.json
{
  "name": "writing",
  "disabledMcpjsonServers": [
    "Desktop_Commander",
    "Claude_in_Chrome",
    "Apollo",
    "Figma"
  ]
}
```

Then `shine activate writing` and restart. The MCP stays connected (settings.json unchanged in that regard), but its tools don't occupy context. Switch to a different profile when you need it back.

---

## 2. Full MCP server reference (by category)

Below is every recommended MCP server, organized by capability. All are free/open-source unless marked with 🟡 (freemium) or 💰 (paid).

### 🔍 Search & Web Intelligence

| MCP Name | Install command | Purpose | Tier |
|---|---|---|---|
| `searxng` | `npx -y @ihor-sokoliuk/mcp-searxng` | Self-hosted meta-search (Google, Bing, DDG aggregated) | 1 (free) |
| `websearch` | `npx -y @mnhlt/websearch-mcp` | Self-hosted web search service | 1 (free) |
| `fetch` | `npx -y @modelcontextprotocol/server-fetch` | HTTP fetch → clean markdown | 1 (free) |
| `puppeteer` | `npx -y @modelcontextprotocol/server-puppeteer` | Headless Chrome for JS-heavy sites | 1 (free) |
| `rag-web-browser` | `npx -y @apify/mcp-server-rag-web-browser` | Search + scrape → markdown pipeline | 1 (free) |
| `brave-search` | `npx -y @modelcontextprotocol/server-brave-search` | Brave Search API | 🟡 2 |
| `tavily` | `npx -y @tomatio13/mcp-server-tavily` | AI-optimized semantic search | 🟡 2 |
| `google-news` | `npx -y @chanmeng666/server-google-news` | Google News with multi-language | 1 (free) |

### 🗄️ Databases & Analytics

| MCP Name | Install command | Purpose | Tier |
|---|---|---|---|
| `duckdb` | `npx -y @ktanaka101/mcp-server-duckdb` | Analytical SQL on local CSV/Parquet/JSON | 1 (free) |
| `sqlite` | `npx -y @modelcontextprotocol/server-sqlite` | Local embedded SQL database | 1 (free) |
| `postgres` | `npx -y @modelcontextprotocol/server-postgres` | PostgreSQL schema + query | 1 (free) |
| `mysql` | `npx -y @designcomputer/mysql-mcp-server` | MySQL with access controls | 1 (free) |
| `mongodb` | `npx -y @kiliczsh/mcp-mongo-server` | MongoDB query and analysis | 1 (free) |
| `redis` | `npx -y @redis/mcp-redis` | Redis key-value + search | 1 (free) |
| `excel` | `npx -y @haris-musa/excel-mcp-server` | Read/write .xlsx workbooks | 1 (free) |

### 🧠 Vector Memory & Semantic Search

| MCP Name | Install command | Purpose | Tier |
|---|---|---|---|
| `qdrant` | `npx -y @qdrant/mcp-server-qdrant` | Production vector search (local Docker) | 1 (free) |

### 📦 Sandbox & Code Execution

| MCP Name | Install command | Purpose | Tier |
|---|---|---|---|
| `docker` | `npx -y @quantgeekdev/docker-mcp` | Container lifecycle and isolated execution | 1 (free) |
| `microsandbox` | See [microsandbox.dev](https://github.com/microsandbox/microsandbox) | Self-hosted secure code sandbox | 1 (free) |
| `e2b` | `npx -y @e2b/mcp-server` | Cloud sandbox for code execution | 🟡 2 |

### 📊 Data Visualization

| MCP Name | Install command | Purpose | Tier |
|---|---|---|---|
| `echarts` | `npx -y @hustcc/mcp-echarts` | Apache ECharts interactive charts | 1 (free) |
| `mermaid` | `npx -y @hustcc/mcp-mermaid` | Diagrams and flowcharts as images | 1 (free) |
| `vegalite` | `npx -y @isaacwasserman/mcp-vegalite-server` | Statistical visualizations | 1 (free) |

### 🔒 Security & Scanning

| MCP Name | Install command | Purpose | Tier |
|---|---|---|---|
| `semgrep` | `npx -y @semgrep/mcp` | SAST code security scanning | 1 (free) |
| `osv` | `npx -y @stackloklabs/osv-mcp` | OS vulnerability database lookup | 1 (free) |
| `sslmon` | `npx -y @firesh/sslmon-mcp` | SSL certificate and domain monitoring | 1 (free) |

### 📈 Monitoring & Observability

| MCP Name | Install command | Purpose | Tier |
|---|---|---|---|
| `signoz` | `npx -y @drdroidlab/signoz-mcp-server` | Open-source APM (Datadog alternative) | 1 (free) |
| `victoriametrics` | See [VictoriaMetrics MCP](https://github.com/VictoriaMetrics-Community/mcp-victoriametrics) | Prometheus-compatible monitoring | 1 (free) |
| `kubernetes` | `npx -y @strowk/mcp-k8s-go` | Multi-cluster K8s management | 1 (free) |

### 🔄 Version Control

| MCP Name | Install command | Purpose | Tier |
|---|---|---|---|
| `github` | `npx -y @github/mcp-server` | GitHub PRs, issues, code search | 1 (free) |
| `gitlab` | `npx -y @modelcontextprotocol/server-gitlab` | GitLab project management | 1 (free) |
| `git` | `npx -y @modelcontextprotocol/server-git` | Local Git repository ops | 1 (free) |

### 📂 File Systems

| MCP Name | Install command | Purpose | Tier |
|---|---|---|---|
| `filesystem` | `npx -y @modelcontextprotocol/server-filesystem /path` | Local FS with configurable paths | 1 (free) |
| `filestash` | See [filestash](https://github.com/mickael-kerjean/filestash) | SFTP, S3, FTP, WebDAV, SMB | 1 (free) |

### 🧬 Research & Academic

| MCP Name | Install command | Purpose | Tier |
|---|---|---|---|
| `arxiv` | `npx -y @blazickjp/arxiv-mcp-server` | ArXiv paper search and retrieval | 1 (free) |
| `paperswithcode` | `npx -y @hbg/mcp-paperswithcode` | Papers + code repos combined | 1 (free) |

### 📝 Knowledge Management

| MCP Name | Install command | Purpose | Tier |
|---|---|---|---|
| `obsidian` | `npx -y @markuspfundstein/mcp-obsidian` | Obsidian vault search and management | 1 (free) |
| `apple-notes` | `npx -y @sirmews/apple-notes-mcp` | macOS Apple Notes querying | 1 (free) |

### 💬 Communication

| MCP Name | Install command | Purpose | Tier |
|---|---|---|---|
| `slack` | `npx -y @korotovsky/slack-mcp-server` | Slack channel read/write | 1 (free) |
| `ntfy` | `npx -y @gitmotion/ntfy-me-mcp` | Push notifications via ntfy.sh | 1 (free) |

### 📱 Social Media

| MCP Name | Install command | Purpose | Tier |
|---|---|---|---|
| `youtube` | `npx -y @anaisbetts/mcp-youtube` | YouTube transcript/subtitle analysis | 1 (free) |
| `bluesky` | `npx -y @keturiosakys/bluesky-context-server` | BlueSky feed search | 1 (free) |

### ⚡ Cloud & Infrastructure

| MCP Name | Install command | Purpose | Tier |
|---|---|---|---|
| `cloudflare` | `npx -y @cloudflare/mcp-server-cloudflare` | Workers, KV, R2, D1 | 🟡 2 |
| `globalping` | `npx -y @jsdelivr/globalping-mcp-server` | ping, traceroute, DNS from global probes | 1 (free) |

### 🤖 AI Services

| MCP Name | Install command | Purpose | Tier |
|---|---|---|---|
| `openai-chat` | `npx -y @pyroprompts/any-chat-completions-mcp` | Chat with OpenAI-compatible models | 🟡 2 |
| `hfspace` | `npx -y @evalstate/mcp-hfspace` | HuggingFace Spaces (image, text, audio) | 1 (free) |

### ⚙️ System Automation

| MCP Name | Install command | Purpose | Tier |
|---|---|---|---|
| `apple-shortcuts` | `npx -y @recursechat/mcp-server-apple-shortcuts` | Trigger macOS Shortcuts | 1 (free) |

### 🔗 Aggregators

| MCP Name | Install command | Purpose | Tier |
|---|---|---|---|
| `toolhive` | See [ToolHive](https://github.com/StacklokLabs/toolhive) | Containerized MCP deployment manager | 1 (free) |
| `mcp-get` | `npx -y @michaellatman/mcp-get` | CLI for installing/managing MCP servers | 1 (free) |

### 🗺️ Location & Geo

| MCP Name | Install command | Purpose | Tier |
|---|---|---|---|
| `google-maps` | `npx -y @modelcontextprotocol/server-google-maps` | Routing, places, geocoding | 🟡 2 |
| `iplocate` | `npx -y @iplocate/mcp-server-iplocate` | IP geolocation and VPN detection | 1 (free) |

### 💹 Finance

| MCP Name | Install command | Purpose | Tier |
|---|---|---|---|
| `dexpaprika` | `npx -y @donbagger/dexpaprika-mcp-server` | Crypto DEX data, token pricing | 1 (free) |
| `coinmarket` | `npx -y @anjor/coinmarket-mcp-server` | CoinMarketCap data | 🟡 2 |

### 💻 Dev Tools (Extended)

| MCP Name | Install command | Purpose | Tier |
|---|---|---|---|
| `figma` | `npx -y @glips/figma-context-mcp` | Figma design → code-ready data | 1 (free) |
| `openapi-explorer` | `npx -y @kadykov/mcp-openapi-schema-explorer` | OpenAPI/Swagger spec browsing | 1 (free) |

---

## 3. Wire the MCP to a decision rule

Adding the MCP makes it _available_. To make SHINE _automatically_ route to it, add a decision rule in `CLAUDE.md`.

### Example: Add a "data analysis" rule

Add this to the `## Decision Rules` section:

```markdown
22. **User provides a CSV / data file / asks for analysis** → check for `duckdb` MCP first (Tier 1, free, local SQL). If unavailable, suggest `sqlite` as fallback. If neither: ask user to install one.
```

### Example: Add a "web research" rule with tiered fallback

```markdown
23. **User asks for web research / competitive intel** → try `searxng` (Tier 1, free) → if unavailable, try `brave-search` (Tier 2, freemium, ASK before using credits) → if unavailable, try `fetch` MCP on specific URLs → if unavailable, ask user to paste content manually.
```

---

## 4. (Optional) Create a matching agent

If the MCP unlocks a whole workflow, create a dedicated agent:

```bash
cat > ~/.claude/agents/shine-data-engineer.md << 'EOF'
---
name: shine-data-engineer
description: "Local data analysis and visualization via DuckDB + ECharts"
tools: Read, Write, Bash, duckdb, echarts
color: blue
---

<role>
You are a data engineer. You analyse local data files using DuckDB SQL and
generate visual charts via ECharts. You always work locally — no cloud DBs.
</role>

<approach>
1. Identify and inspect the data source (CSV, Parquet, JSON, Excel).
2. Run exploratory SQL via DuckDB MCP.
3. Answer the user's analytical question with precise numbers.
4. Generate one or more ECharts visualizations if appropriate.
5. Return the 5-section report.
</approach>

<anti_patterns>
- Do not upload data to any external service.
- Do not guess column names — always inspect schema first.
- Do not hallucinate data points.
</anti_patterns>

<output_format>
## Summary
## Details
## Sources
## Open questions
## Next step
</output_format>
EOF
```

---

## 5. (Optional) Create a matching skill

For user-invocable slash commands:

```bash
mkdir -p ~/.claude/skills/shine-web-research
cat > ~/.claude/skills/shine-web-research/SKILL.md << 'EOF'
---
name: shine-web-research
description: "Deep web research using free-first tiered search"
argument-hint: "<topic or URL>"
allowed-tools:
  - Read
  - Write
  - Bash
  - searxng
  - fetch
  - brave-search
---

<objective>
Perform comprehensive web research on the given topic.
Use the tiered fallback strategy (CLAUDE.md §21):
1. SearXNG (free, local) — try first
2. Fetch MCP on known URLs — direct content retrieval
3. Brave Search (freemium) — ASK before using API credits
4. Manual fallback — ask user to provide sources

Output a structured research brief:
- Key findings (with verified sources)
- Source list with fetch dates
- Confidence assessment per claim
- Suggested follow-up queries
</objective>

<guardrails>
- Factual discipline (CLAUDE.md §16): every claim needs a retrieved source.
- Tier resolution (CLAUDE.md §21): never silently call a paid API.
- Watermark labels: [verified — src, date], [unverified — pattern inferred].
</guardrails>
EOF
```

---

## 6. Verify your integration

After adding any MCP, restart Claude Code and verify:

```bash
# Inside Claude Code:
/shine-help          # Check if the MCP appears in the integration list
/shine-health        # Run health check — counts agents, skills, hooks, MCPs
```

The `integration-sync.js` hook will automatically detect the new MCP on SessionStart and add it to the `<!-- shine:plugins:begin -->` block in `CLAUDE.md`.

---

## 7. Recommended starter pack

Copy-paste this block to install the top 5 priority MCPs in one go:

```bash
# 🔍 Priority 1: Free web search
claude mcp add searxng --command "npx -y @ihor-sokoliuk/mcp-searxng"

# 🗄️ Priority 2: Local analytics
claude mcp add duckdb --command "npx -y @ktanaka101/mcp-server-duckdb"

# 🧠 Priority 3: Vector memory
claude mcp add qdrant --command "npx -y @qdrant/mcp-server-qdrant"

# 📦 Priority 4: Sandboxed execution
claude mcp add docker --command "npx -y @quantgeekdev/docker-mcp"

# 📊 Priority 5: Data visualization
claude mcp add echarts --command "npx -y @hustcc/mcp-echarts"
claude mcp add mermaid-viz --command "npx -y @hustcc/mcp-mermaid"
```

---

## 8. Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| MCP not appearing in `/shine-help` | `integration-sync.js` hasn't run yet | Start a new Claude Code session |
| MCP tool calls timeout | Server not started or wrong port | Check the MCP's logs; verify the command runs standalone |
| "MCP not connected" warnings | MCP server crashed or was never installed | Run the install command again; check `which npx` |
| Tier confusion — Claude used a paid API without asking | Missing Rule #21 in CLAUDE.md | Ensure `CLAUDE.md` has the tiered fallback rule |
