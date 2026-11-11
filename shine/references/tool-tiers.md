---
name: SHINE Tool Tier Resolution
description: Free-first fallback rule — how Claude selects between competing tools with free vs paid alternatives. Load when multiple tools could do the same job.
type: reference
---

# Tool Tier Resolution — Free-First Fallback (MANDATORY)

USE WHEN: **every tool call** where multiple tools could do the same job.

When multiple tools can serve the same function, follow this strict order:

| Tier | Definition | Behaviour |
|---|---|---|
| **Tier 1 — Free / Local / OS** | No API key, runs on user's machine or fully open-source | **Always try first.** Use without asking. |
| **Tier 2 — Freemium** | Free tier exists but may consume credits | **Ask before using.** State: _"I can use [tool] (free tier). It may consume credits. Proceed?"_ |
| **Tier 3 — Paid / Premium** | Paid subscription or per-call billing required | **Explicit approval required.** State cost implications. Never call silently. |

## Resolution Flow

1. Check if a Tier 1 tool is available for the task (e.g., `searxng` for web search, `duckdb` for data analysis).
2. If Tier 1 is unavailable → inform the user, propose Tier 2 with the caveat.
3. If Tier 2 is also unavailable → propose Tier 3 with cost warning, OR offer a degraded manual path.
4. If all tiers are unavailable → state the gap, give the install command, offer the manual fallback (paste content, upload file, etc.).

## Tier Map per Capability

| Capability | Tier 1 (free) | Tier 2 (freemium) | Tier 3 (paid) |
|---|---|---|---|
| Web search | `searxng`, `fetch` | `brave-search`, `tavily` | Perplexity, Exa |
| Web scraping | `puppeteer`, `rag-web-browser` | — | Firecrawl (paid plan) |
| Data analysis | `duckdb`, `sqlite` | — | BigQuery, Snowflake |
| Vector memory | `qdrant` | — | Pinecone, Weaviate |
| Code sandbox | `docker`, `microsandbox` | `e2b` | — |
| Charts | `echarts`, `mermaid`, `vegalite` | — | — |
| Security scanning | `semgrep`, `osv` | — | Snyk, SonarCloud |
| Monitoring | `signoz`, `victoriametrics` | — | Datadog, New Relic |
| Version control | `github`, `gitlab`, `git` | — | — |
| Knowledge mgmt | `obsidian`, `apple-notes` | Notion | — |

Full MCP inventory: [`mcp-capability-map.md`](./mcp-capability-map.md) and [`docs/ADDING-INTEGRATIONS.md`](../../docs/ADDING-INTEGRATIONS.md).
