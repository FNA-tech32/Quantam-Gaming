---
name: shine-vector-search
description: "Store and retrieve semantic memories using Qdrant MCP vector database. Enables cross-session knowledge recall."
argument-hint: "'store <topic>' or 'recall <query>'"
allowed-tools:
  - Read
  - Write
  - Bash
---

<objective>
Manage semantic vector memory via Qdrant MCP:

**Store mode** (`/shine-vector-search store <topic>`):
1. Collect the key information/findings from the current session.
2. Generate a semantic embedding via the Qdrant MCP.
3. Store with metadata: topic, timestamp, source files, confidence.
4. Confirm storage with ID and summary.

**Recall mode** (`/shine-vector-search recall <query>`):
1. Search Qdrant for semantically similar past entries.
2. Return top 5 matches with relevance score, timestamp, and source.
3. Present as a structured table with inline previews.

**Requirements:**
- Qdrant MCP must be connected: `claude mcp add qdrant --command "npx -y @qdrant/mcp-server-qdrant"`
- Qdrant server running: `docker run -p 6333:6333 qdrant/qdrant`

If Qdrant is not available, fall back to `claude-mem` plugin for basic text search across memory files, or `grep` on `~/.claude/memory/`.
</objective>

<guardrails>
- Never store PII, secrets, or credentials in the vector database.
- Always include source attribution when recalling stored knowledge.
- Label recalled information with its original storage date — it may be stale.
- Fall back gracefully: Qdrant → claude-mem → grep on memory dir → ask user.
- Never fabricate recalled data — if no match found, say so.
</guardrails>
