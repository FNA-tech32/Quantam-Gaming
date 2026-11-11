#!/usr/bin/env node
// SHINE hook — PostToolUse (Bash|Edit|Write|MultiEdit|Agent|Task)
// Warns to stderr when the running transcript is getting large, so the
// user can trigger /compact before hitting a hard limit.
//
// Controls:
//   SHINE_CONTEXT_SOFT_KB=800         soft byte threshold in KB (default 800)
//   SHINE_CONTEXT_HARD_KB=1600        hard byte threshold in KB (default 1600)
//   SHINE_CONTEXT_SOFT_TOKENS=120000  soft token-budget threshold (default 120k)
//   SHINE_CONTEXT_HARD_TOKENS=180000  hard token-budget threshold (default 180k)
//   SHINE_DISABLE_CONTEXT_MONITOR=1   disable
//
// Token estimation: we use bytes/3.5 as a conservative estimate — good
// enough for an early-warning hook without a tokenizer dependency.
// Fails open (exit 0) on any error.

'use strict';

const fs = require('fs');
const path = require('path');
let emitter;
try { emitter = require(path.join(__dirname, '_shine-hook-output.js')); }
catch { emitter = { emit: (_h, _l, t) => process.stderr.write(t.endsWith('\n') ? t : t + '\n') }; }

if (process.env.SHINE_DISABLE_CONTEXT_MONITOR === '1') process.exit(0);

const SOFT_BYTES = parseInt(process.env.SHINE_CONTEXT_SOFT_KB || '800', 10) * 1024;
const HARD_BYTES = parseInt(process.env.SHINE_CONTEXT_HARD_KB || '1600', 10) * 1024;
const SOFT_TOKENS = parseInt(process.env.SHINE_CONTEXT_SOFT_TOKENS || '120000', 10);
const HARD_TOKENS = parseInt(process.env.SHINE_CONTEXT_HARD_TOKENS || '180000', 10);

function estimateTokens(bytes) {
  // 1 token ≈ 3.5 bytes (conservative for JSONL + code/logs mix).
  return Math.round(bytes / 3.5);
}

function transcriptPath() {
  const envPath = process.env.CLAUDE_TRANSCRIPT_PATH;
  if (envPath && fs.existsSync(envPath)) return envPath;
  return null;
}

function fmtK(n) { return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n); }

try {
  const p = transcriptPath();
  if (!p) process.exit(0);
  const { size } = fs.statSync(p);
  const tokens = estimateTokens(size);
  const kb = Math.round(size / 1024);

  const hitHard = size >= HARD_BYTES || tokens >= HARD_TOKENS;
  const hitSoft = size >= SOFT_BYTES || tokens >= SOFT_TOKENS;

  if (hitHard) {
    emitter.emit('context-monitor', 'warn',
      `[SHINE] 🔴 Transcript ${kb} KB · ~${fmtK(tokens)} tokens — hard limit crossed. Run /compact or /clear.`,
      { bytes: size, kb, tokens, threshold: 'hard' });
  } else if (hitSoft) {
    emitter.emit('context-monitor', 'info',
      `[SHINE] 🟡 Transcript ${kb} KB · ~${fmtK(tokens)} tokens — nearing budget (soft ${fmtK(SOFT_TOKENS)}).`,
      { bytes: size, kb, tokens, threshold: 'soft' });
  }
} catch { /* fail open */ }
process.exit(0);
