#!/usr/bin/env node
// SHINE hook — PreToolUse (Write|Edit)
// Warns (non-blocking) when a write is about to land inside a path that
// typically contains generated artefacts, build output, or vendored deps
// that shouldn't be hand-edited. Exits 0 either way — this is a nudge,
// not a block. Use shine-prompt-guard for hard refusals.
//
// Opt-out: SHINE_DISABLE_READ_GUARD=1

'use strict';

const path = require('path');
let emitter;
try { emitter = require(path.join(__dirname, '_shine-hook-output.js')); }
catch { emitter = { emit: (_h, _l, t) => process.stderr.write(t.endsWith('\n') ? t : t + '\n') }; }

if (process.env.SHINE_DISABLE_READ_GUARD === '1') process.exit(0);

let input = '';
try { input = require('fs').readFileSync(0, 'utf8'); } catch { process.exit(0); }

let payload;
try { payload = JSON.parse(input); } catch { process.exit(0); }

const file = (payload && payload.tool_input && (payload.tool_input.file_path || payload.tool_input.path)) || '';
if (!file) process.exit(0);

const NOISY_PATHS = [
  /\/node_modules\//,
  /\/\.next\//,
  /\/dist\//,
  /\/build\//,
  /\/coverage\//,
  /\/__pycache__\//,
  /\/\.venv\//,
  /\/vendor\//,
  /\.min\.(js|css)$/,
  /\.map$/,
  /package-lock\.json$/,
  /yarn\.lock$/,
  /pnpm-lock\.yaml$/,
];

for (const re of NOISY_PATHS) {
  if (re.test(file)) {
    emitter.emit('read-guard', 'info',
      `[SHINE read-guard] Heads up: "${file}" looks like generated/vendored content. Prefer editing the source.`,
      { file });
    break;
  }
}
process.exit(0);
