---
name: shine-data-query
description: "Run SQL analytics on local data files (CSV, Parquet, JSON, Excel) via DuckDB or SQLite MCP. No cloud — all local."
argument-hint: "<file path or question about data>"
allowed-tools:
  - Read
  - Write
  - Bash
---

<objective>
Analyze local data using SQL:

1. **Detect data source:** CSV, Parquet, JSON, Excel, SQLite DB.
2. **Select engine:** `duckdb` MCP (preferred) → `sqlite` MCP → Python pandas via Bash.
3. **Profile first:** schema, row count, types, nulls, outliers.
4. **Execute analytical SQL:** aggregate, join, window functions, CTEs.
5. **Visualize** via `echarts`/`mermaid`/`vegalite` MCP if connected, else markdown table.

Output: schema profile → SQL query → results → interpretation → chart (if available).

The user may provide a file path, a question about a dataset, or both.
</objective>

<guardrails>
- Never upload data externally — all processing stays local.
- Never guess column names — always inspect schema first.
- Include the SQL query that produced each finding (reproducibility).
- Sample size < 30 → flag as inconclusive unless effect massive.
- If no SQL MCP → fallback: `python3 -c "import duckdb; ..."` via Bash.
</guardrails>
