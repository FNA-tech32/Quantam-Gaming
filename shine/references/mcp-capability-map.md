---
name: SHINE MCP Capability Map
description: Full BYO (bring-your-own) map of MCP servers grouped by capability with tier labels. Load when the user asks what MCPs exist for a given task.
type: reference
---

# BYO — Extended Capability Map (MCP Servers)

SHINE ships with plugins but does **not** bundle MCP servers — those are user-configured. See [`docs/ADDING-INTEGRATIONS.md`](../../docs/ADDING-INTEGRATIONS.md) for install commands.

**All tools follow the Tier Fallback rule (see `tool-tiers.md`): free/local first, freemium second (ask before using credits), paid third (explicit approval).**

### Search & Web Scraping
| MCP | Tier | Purpose |
|---|---|---|
| `searxng` | 1 (free) | Self-hosted meta-search (Google, Bing, DDG aggregated) |
| `fetch` | 1 (free) | HTTP URL → clean markdown |
| `puppeteer` | 1 (free) | Headless Chrome for JS-heavy sites |
| `rag-web-browser` | 1 (free) | Search + scrape + markdown pipeline |
| `brave-search` | 2 (freemium) | Brave Search API |
| `tavily` | 2 (freemium) | AI semantic search |

### Databases & Analytics
| MCP | Tier | Purpose |
|---|---|---|
| `duckdb` | 1 (free) | Analytical SQL on local CSV/Parquet/JSON |
| `sqlite` | 1 (free) | Embedded local database |
| `postgres` | 1 (free) | PostgreSQL schema + query |
| `mysql` | 1 (free) | MySQL with configurable access |
| `mongodb` | 1 (free) | MongoDB collections |
| `redis` | 1 (free) | Key-value + search |
| `excel` | 1 (free) | Read/write .xlsx workbooks |

### Vector Memory & Semantic Search
| `qdrant` | 1 (free) | Production vector search engine |

### Sandbox & Code Execution
| `docker` | 1 (free) | Container lifecycle, isolated execution |
| `microsandbox` | 1 (free) | Self-hosted code sandbox |
| `e2b` | 2 (freemium) | Cloud sandbox |

### Data Visualization
| `echarts` | 1 (free) | Interactive Apache ECharts |
| `mermaid` | 1 (free) | Flowcharts, sequence, Gantt |
| `vegalite` | 1 (free) | Statistical visualizations |

### Security & Vulnerability Scanning
| `semgrep` | 1 (free) | SAST code security scanning |
| `osv` | 1 (free) | Open Source Vulnerability database |
| `sslmon` | 1 (free) | SSL cert and domain monitoring |

### Monitoring & Observability
| `signoz` | 1 (free) | Open-source APM |
| `victoriametrics` | 1 (free) | Prometheus-compatible metrics |
| `kubernetes` | 1 (free) | Multi-cluster K8s |

### Version Control (extended)
| `github` | 1 (free) | GitHub PRs, issues, code search |
| `gitlab` | 1 (free) | GitLab project management |
| `git` | 1 (free) | Local Git repository ops |

### File Systems & Documents
| `filesystem` | 1 (free) | Local FS with configurable paths |
| `filestash` | 1 (free) | SFTP, S3, FTP, WebDAV, SMB |
| `ebook` | 1 (free) | Read PDF + EPUB locally |

### Research & Academic
| `arxiv` | 1 (free) | ArXiv paper search |
| `paperswithcode` | 1 (free) | Papers + matching codebases |

### Knowledge Management
| `obsidian` | 1 (free) | Obsidian vault integration |
| `apple-notes` | 1 (free) | macOS Apple Notes |

### Communication
| `slack` | 1 (free) | Slack channels read/write |
| `ntfy` | 1 (free) | Push notifications |

### Social Media
| `youtube` | 1 (free) | Video transcripts/subtitles |
| `bluesky` | 1 (free) | BlueSky feed search |

### Cloud & Infrastructure
| `cloudflare` | 2 (freemium) | Workers, KV, R2, D1 |
| `globalping` | 1 (free) | Network probes worldwide |

### AI Services
| `openai-chat` | 2 (freemium) | Multi-model chat (Groq, Perplexity, xAI) |
| `hfspace` | 1 (free) | HuggingFace Spaces |

### System Automation
| `apple-shortcuts` | 1 (free) | Trigger macOS Shortcuts |

### Aggregators & MCP Management
| `toolhive` | 1 (free) | Containerized MCP deployment |
| `mcp-get` | 1 (free) | CLI for MCP server management |

### Location & Geo
| `google-maps` | 2 (freemium) | Routing, places, geocoding |
| `iplocate` | 1 (free) | IP geolocation |

### Finance
| `dexpaprika` | 1 (free) | Crypto DEX data |
| `coinmarket` | 2 (freemium) | CoinMarketCap API |

### Dev Tools (extended)
| `figma` | 1 (free) | Design → code-ready data |
| `openapi-explorer` | 1 (free) | OpenAPI/Swagger spec browser |

> Missing MCP → SHINE states the gap and offers a degraded path. Never fabricates.
