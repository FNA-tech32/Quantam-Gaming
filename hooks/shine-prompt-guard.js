#!/usr/bin/env node
// SHINE hook — PreToolUse (Write|Edit)
// Blocks writes that look like they would commit secrets to disk.
// Exits 2 to abort the tool call when a violation is detected — Claude Code
// surfaces the stderr message to the model.
//
// Patterns detected:
//   - .env / .env.* paths
//   - API-key-shaped tokens (sk-…, ghp_…, AWS AKIA…, Stripe live keys, JWT-ish)
//   - Obvious hard-coded OpenAI/Anthropic/Google keys in the new content
//
// Opt-out: SHINE_DISABLE_PROMPT_GUARD=1

'use strict';

const path = require('path');
let emitter;
try { emitter = require(path.join(__dirname, '_shine-hook-output.js')); }
catch { emitter = { emit: (_h, _l, t) => process.stderr.write(t.endsWith('\n') ? t : t + '\n') }; }

if (process.env.SHINE_DISABLE_PROMPT_GUARD === '1') process.exit(0);

let input = '';
try {
  input = require('fs').readFileSync(0, 'utf8'); // stdin
} catch { process.exit(0); }

let payload;
try { payload = JSON.parse(input); } catch { process.exit(0); }

const tool = (payload && payload.tool_name) || '';
const p    = (payload && payload.tool_input) || {};
const file = p.file_path || p.path || '';
const body = p.content || p.new_string || '';

const BANNED_PATHS = [
  /(^|\/)\.env(\.|$)/i,
  /\bid_rsa\b/i,
  /\bid_ed25519\b/i,
  /\.pem$/i,
  /credentials\.json$/i,
];

const SECRET_PATTERNS = [
  { label: 'OpenAI key',      re: /\bsk-[A-Za-z0-9]{20,}\b/ },
  { label: 'Anthropic key',   re: /\bsk-ant-[A-Za-z0-9_\-]{20,}\b/ },
  { label: 'GitHub PAT',      re: /\bghp_[A-Za-z0-9]{30,}\b/ },
  { label: 'GitHub fine-grained', re: /\bgithub_pat_[A-Za-z0-9_]{30,}\b/ },
  { label: 'AWS access key',  re: /\bAKIA[0-9A-Z]{16}\b/ },
  { label: 'Google API key',  re: /\bAIza[0-9A-Za-z_\-]{30,}\b/ },
  { label: 'Stripe live key', re: /\bsk_live_[0-9A-Za-z]{20,}\b/ },
  { label: 'Slack token',     re: /\bxox[baprs]-[0-9A-Za-z\-]{10,}\b/ },
];

const hits = [];

for (const re of BANNED_PATHS) {
  if (re.test(file)) hits.push(`blocked path (${re}): ${file}`);
}
for (const { label, re } of SECRET_PATTERNS) {
  if (re.test(body)) hits.push(`${label}-shaped token in content`);
}

if (hits.length) {
  emitter.emit('prompt-guard', 'block',
    `[SHINE prompt-guard] Refusing ${tool} — potential secret exposure:\n  - ${hits.join('\n  - ')}\n` +
    `If this is intentional, set SHINE_DISABLE_PROMPT_GUARD=1 for this session.`,
    { tool, file, hits });
  process.exit(2);
}
process.exit(0);
