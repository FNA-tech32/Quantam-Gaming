#!/usr/bin/env node
// SHINE hook — PreCompact
// Writes a lightweight "pre-compact snapshot" to ~/.claude/sessions/ before
// Claude Code compacts the transcript, so the user can recover context
// (open files, last client, last tool) after an auto-compact.
//
// Snapshot file: ~/.claude/sessions/precompact-<YYYYMMDD-HHMMSS>.md
//
// Controls:
//   SHINE_DISABLE_PRECOMPACT=1   skip
//   SHINE_PRECOMPACT_KEEP=20     number of snapshots to retain (default 20)

'use strict';

const fs = require('fs');
const path = require('path');

if (process.env.SHINE_DISABLE_PRECOMPACT === '1') process.exit(0);

const HOME = process.env.HOME || '~';
const DIR  = path.join(HOME, '.claude', 'sessions');
const KEEP = parseInt(process.env.SHINE_PRECOMPACT_KEEP || '20', 10);

function ts() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

let input = '';
try { input = fs.readFileSync(0, 'utf8'); } catch { /* noop */ }

let payload = {};
try { payload = JSON.parse(input); } catch { /* noop */ }

const cwd      = process.cwd();
const reason   = (payload && payload.trigger) || 'auto';
const tool     = (payload && payload.last_tool_name) || 'unknown';

try {
  fs.mkdirSync(DIR, { recursive: true });
  const file = path.join(DIR, `precompact-${ts()}.md`);
  const body = [
    `# SHINE pre-compact snapshot`,
    ``,
    `- **When:** ${new Date().toISOString()}`,
    `- **Trigger:** ${reason}`,
    `- **Last tool:** ${tool}`,
    `- **CWD:** ${cwd}`,
    ``,
    `> Compact was about to run. Use this file to remind yourself where you left off.`,
    ``,
  ].join('\n');
  fs.writeFileSync(file, body);

  // Retention — keep only the N most recent snapshots.
  const files = fs.readdirSync(DIR)
    .filter(f => f.startsWith('precompact-'))
    .map(f => ({ f, t: fs.statSync(path.join(DIR, f)).mtimeMs }))
    .sort((a, b) => b.t - a.t);
  for (const { f } of files.slice(KEEP)) {
    try { fs.unlinkSync(path.join(DIR, f)); } catch { /* noop */ }
  }
} catch { /* swallow */ }

process.exit(0);
