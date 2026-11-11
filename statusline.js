#!/usr/bin/env node
// SHINE statusline — renders a single line below the prompt.
//
// Shows: model · cwd(basename) · git branch · active client (if any) · token-budget hint
//
// Claude Code invokes this command on every render; output goes to stdout.
// Keep it fast (<100ms) — no network calls, no heavy I/O.
//
// Active client detection:
//   ~/.claude/sessions/active-client  (single line with client slug)
//   or env CLAUDE_ACTIVE_CLIENT
//
// Colors: ANSI, degraded gracefully when not a TTY.

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const HOME = process.env.HOME || '~';
const TTY  = process.stdout.isTTY;

const C = TTY ? {
  dim:  (s) => `\x1b[2m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  green:(s) => `\x1b[32m${s}\x1b[0m`,
  ylw:  (s) => `\x1b[33m${s}\x1b[0m`,
  mag:  (s) => `\x1b[35m${s}\x1b[0m`,
  red:  (s) => `\x1b[31m${s}\x1b[0m`,
} : { dim:s=>s, cyan:s=>s, green:s=>s, ylw:s=>s, mag:s=>s, red:s=>s };

// --- Input from Claude Code (stdin JSON, optional) ---
let input = {};
try {
  const raw = fs.readFileSync(0, 'utf8');
  if (raw) input = JSON.parse(raw);
} catch { /* noop */ }

const model = (input.model && (input.model.display_name || input.model.id)) || process.env.ANTHROPIC_MODEL || 'claude';
const cwd   = (input.cwd) || process.cwd();

// --- Git branch (if any) — execFileSync, no shell interpretation ---
function gitBranch() {
  try {
    const b = execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
      cwd, stdio: ['ignore', 'pipe', 'ignore'], timeout: 300,
    }).toString().trim();
    return b || null;
  } catch { return null; }
}

// --- Active client ---
function activeClient() {
  if (process.env.CLAUDE_ACTIVE_CLIENT) return process.env.CLAUDE_ACTIVE_CLIENT;
  try {
    const p = path.join(HOME, '.claude', 'sessions', 'active-client');
    if (fs.existsSync(p)) return fs.readFileSync(p, 'utf8').trim() || null;
  } catch { /* noop */ }
  return null;
}

// --- Token / context hint from transcript size ---
function contextHint() {
  const p = process.env.CLAUDE_TRANSCRIPT_PATH;
  if (!p) return null;
  try {
    const kb = Math.round(fs.statSync(p).size / 1024);
    if (kb < 400)  return C.dim(`${kb}KB`);
    if (kb < 800)  return C.ylw(`${kb}KB`);
    return C.red(`${kb}KB`);
  } catch { return null; }
}

// --- Render ---
const parts = [];
parts.push(C.mag('✨ SHINE'));
parts.push(C.cyan(model));
parts.push(C.green(path.basename(cwd)));

const br = gitBranch();
if (br) parts.push(C.ylw(`⎇ ${br}`));

const cl = activeClient();
if (cl) parts.push(C.mag(`◆ ${cl}`));

const ctx = contextHint();
if (ctx) parts.push(ctx);

process.stdout.write(parts.join(C.dim(' · ')) + '\n');
