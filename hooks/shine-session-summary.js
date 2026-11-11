#!/usr/bin/env node
// SHINE hook — SessionEnd
// Appends a compact, human-readable session frame to
// ~/.claude/memory/learning-log.md at the end of a session.
//
// This complements the metadata-only, per-turn `shine-learning-log.js`
// (which writes JSONL for /shine-retro analytics). The markdown log here
// is one block per *session*, designed to be skimmed by the user or
// consolidated into typed memory via /shine-retro.
//
// Extraction strategy — metadata only, no prompt/response content:
//   - session window (first/last timestamps observed via precompact snapshots and JSONL log)
//   - cwd
//   - tool usage counts (from the JSONL log filtered to this session)
//   - placeholders for the user/Claude to fill in during /shine-retro:
//       Task: <inferred from cwd + top tools>
//       Outcome: <unknown at write time — filled via /shine-retro>
//       Preference observed: <unknown at write time — filled via /shine-retro>
//
// Content discipline (mandatory): the hook NEVER reads transcript content.
// Content-aware fields are placeholders only. This keeps the log PII-free.
//
// Controls:
//   SHINE_DISABLE_SESSION_SUMMARY=1  disable
//   SHINE_SESSION_SUMMARY_MAX=1000   max retained blocks (default 1000)
//
// Fails open.

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

if (process.env.SHINE_DISABLE_SESSION_SUMMARY === '1') process.exit(0);

const MD  = path.join(os.homedir(), '.claude', 'memory', 'learning-log.md');
const JSONL = path.join(os.homedir(), '.claude', 'memory', 'learning-log.jsonl');
const MAX = parseInt(process.env.SHINE_SESSION_SUMMARY_MAX || '1000', 10);

// Read stdin payload (Claude Code may pass metadata we can use)
let payload = {};
try {
  const input = fs.readFileSync(0, 'utf8');
  if (input) payload = JSON.parse(input);
} catch { /* noop */ }

function readJsonlTail(limit) {
  try {
    if (!fs.existsSync(JSONL)) return [];
    const raw = fs.readFileSync(JSONL, 'utf8');
    const lines = raw.split('\n').filter(Boolean);
    return lines.slice(-limit).map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  } catch { return []; }
}

function sessionWindowFrom(entries) {
  if (entries.length === 0) return { start: null, end: null, turns: 0 };
  return { start: entries[0].ts, end: entries[entries.length - 1].ts, turns: entries.length };
}

function topTools(entries, k = 5) {
  const counts = {};
  for (const e of entries) {
    const t = e && e.last_tool;
    if (!t) continue;
    counts[t] = (counts[t] || 0) + 1;
  }
  return Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0, k);
}

function sameSessionEntries(entries, cwd) {
  // Heuristic: session = entries in the last 6 hours with same cwd
  if (entries.length === 0) return [];
  const lastTs = Date.parse(entries[entries.length - 1].ts);
  const SIX_H = 6 * 60 * 60 * 1000;
  return entries.filter(e => {
    const t = Date.parse(e.ts);
    return e.cwd === cwd && (lastTs - t) <= SIX_H;
  });
}

try {
  fs.mkdirSync(path.dirname(MD), { recursive: true });

  const allEntries = readJsonlTail(2000);
  const cwd = process.cwd();
  const entries = sameSessionEntries(allEntries, cwd);
  const { start, end, turns } = sessionWindowFrom(entries);
  const top = topTools(entries);

  const seedHeader = !fs.existsSync(MD);
  if (seedHeader) {
    fs.writeFileSync(MD,
      `# SHINE Learning Log (markdown)\n\n` +
      `One block per session. Metadata only — no prompt or response content.\n` +
      `Review and consolidate via \`/shine-retro\`.\n\n` +
      `---\n\n`
    );
  }

  const nowIso = new Date().toISOString();
  const block =
    `## Session · ${nowIso}\n\n` +
    `- **cwd:** \`${cwd}\`\n` +
    `- **Window:** ${start || '?'} → ${end || nowIso}\n` +
    `- **Turns (same cwd, last 6h):** ${turns}\n` +
    `- **Top tools:** ${top.length ? top.map(([t,n]) => `${t}×${n}`).join(', ') : '—'}\n\n` +
    `### To fill via /shine-retro\n` +
    `- **Task:** _(inferred — to confirm)_\n` +
    `- **Outcome:** _(to confirm)_\n` +
    `- **Preference observed:** _(if any)_\n\n` +
    `---\n\n`;

  fs.appendFileSync(MD, block);

  // Rotate if oversized: keep header + last MAX blocks
  try {
    const stat = fs.statSync(MD);
    if (stat.size > MAX * 600) {
      const raw = fs.readFileSync(MD, 'utf8');
      const parts = raw.split(/\n## Session · /);
      if (parts.length > MAX + 1) {
        const head = parts[0]; // original intro
        const kept = parts.slice(-MAX).map(p => '## Session · ' + p).join('\n');
        fs.writeFileSync(MD, head.endsWith('\n') ? head + kept : head + '\n' + kept);
      }
    }
  } catch { /* noop */ }
} catch { /* fail open */ }

process.exit(0);
