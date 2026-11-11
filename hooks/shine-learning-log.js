#!/usr/bin/env node
// SHINE hook — Stop (fires when the main agent finishes a turn)
// Appends a tiny JSONL entry to ~/.claude/memory/learning-log.jsonl so that
// /shine-retro can review patterns across sessions and propose memory updates.
//
// Captures: timestamp, cwd, last tool (if provided via payload), transcript
// size as a proxy for turn "weight". Never reads conversation content — no
// PII risk. One line per turn, capped retention.
//
// Controls:
//   SHINE_DISABLE_LEARNING_LOG=1   disable
//   SHINE_LEARNING_LOG_MAX=10000   max retained lines (default 10000 ~ a few MB)
//
// Fails open — exits 0 on any error.

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

if (process.env.SHINE_DISABLE_LEARNING_LOG === '1') process.exit(0);

const LOG = path.join(os.homedir(), '.claude', 'memory', 'learning-log.jsonl');
const MAX = parseInt(process.env.SHINE_LEARNING_LOG_MAX || '10000', 10);

// Optional stdin payload from Claude Code; ignore failure.
let payload = {};
try {
  const input = fs.readFileSync(0, 'utf8');
  if (input) payload = JSON.parse(input);
} catch { /* noop */ }

function transcriptSize() {
  const p = process.env.CLAUDE_TRANSCRIPT_PATH;
  if (!p) return null;
  try { return fs.statSync(p).size; } catch { return null; }
}

try {
  fs.mkdirSync(path.dirname(LOG), { recursive: true });

  const entry = {
    ts: new Date().toISOString(),
    cwd: process.cwd(),
    last_tool: payload.last_tool_name || payload.tool_name || null,
    transcript_bytes: transcriptSize(),
    event: payload.event || process.env.CLAUDE_HOOK_EVENT || 'stop',
  };

  fs.appendFileSync(LOG, JSON.stringify(entry) + '\n');

  // Trim if oversized (cheap: periodic truncation, not every run).
  // Do trimming only when file crosses MAX+200 lines to avoid thrash.
  try {
    const stat = fs.statSync(LOG);
    // Rough line estimate via size/120 avg
    if (stat.size > MAX * 200) {
      const lines = fs.readFileSync(LOG, 'utf8').split('\n').filter(Boolean);
      if (lines.length > MAX) {
        const trimmed = lines.slice(-MAX).join('\n') + '\n';
        const tmp = LOG + '.tmp';
        fs.writeFileSync(tmp, trimmed);
        fs.renameSync(tmp, LOG);
      }
    }
  } catch { /* noop */ }
} catch { /* fail open */ }

process.exit(0);
