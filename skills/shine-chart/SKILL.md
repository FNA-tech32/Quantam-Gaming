---
name: shine-chart
description: "Generate interactive charts (ECharts), diagrams (Mermaid), or statistical visualizations (VegaLite) from data or specifications."
argument-hint: "<chart type> from <data source or description>"
allowed-tools:
  - Read
  - Write
  - Bash
---

<objective>
Create publication-ready visualizations:

1. **Determine chart type** from user request:
   - Quantitative (bar, line, scatter, pie, radar) → `echarts` MCP
   - Structural (flowchart, sequence, ER, Gantt, mindmap) → `mermaid` MCP
   - Statistical (distribution, correlation, regression) → `vegalite` MCP
2. **Prepare data:** clean, aggregate, format for the selected tool.
3. **Generate chart:**
   - If MCP connected → use it directly.
   - If no MCP → generate standalone HTML with CDN-hosted library.
4. **Polish:** professional colors, labeled axes with units, data source citation.

Delegate to `shine-chart-builder` agent for complex multi-chart dashboards.
</objective>

<guardrails>
- Never truncate Y-axis without explicit `⚠️ Truncated axis` label.
- Never use 3D charts (perception distortion) — use 2D equivalents.
- Never use pie charts for > 6 categories — use bar/treemap.
- Always label axes with units. Always cite data source in subtitle.
- Use colorblind-safe palettes when possible.
</guardrails>
