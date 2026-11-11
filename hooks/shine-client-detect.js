#!/usr/bin/env node
// SHINE hook — UserPromptSubmit
// Scans the user's prompt for any client slug declared in ~/.claude/memory/
// (via filenames `client-<slug>.md` or entries in MEMORY.md), and emits a
// JSON directive telling Claude Code to append the matching client file(s)
// as additional context for this turn.
//
// Why: Rules #17, #19, #20 all hinge on "client name detected" — pre-loading
// the file removes the reasoning hop and makes multi-client prompts work
// (e.g., "follow-up for ACME and CONTOSO" loads both).
//
// No prompt content is logged. Exits 0 on any error (fail open).
//
// Controls:
//   SHINE_DISABLE_CLIENT_DETECT=1       disable
//   SHINE_CLIENT_DETECT_MAX=3           max client files to inject per turn (default 3)
//   SHINE_CLIENT_DETECT_MIN_LEN=4       minimum slug length to match (default 4)

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

if (process.env.SHINE_DISABLE_CLIENT_DETECT === '1') process.exit(0);

const MEMORY_DIR = path.join(os.homedir(), '.claude', 'memory');
const MAX = parseInt(process.env.SHINE_CLIENT_DETECT_MAX || '3', 10);
const MIN_LEN = parseInt(process.env.SHINE_CLIENT_DETECT_MIN_LEN || '4', 10);

// Read stdin payload
let payload = {};
try {
  const input = fs.readFileSync(0, 'utf8');
  if (input) payload = JSON.parse(input);
} catch { process.exit(0); }

const prompt = (payload && (payload.prompt || payload.user_prompt || payload.message)) || '';
if (!prompt || typeof prompt !== 'string') process.exit(0);

// Discover client slugs: from filenames client-<slug>.md
let slugs = [];
try {
  if (fs.existsSync(MEMORY_DIR)) {
    slugs = fs.readdirSync(MEMORY_DIR)
      .filter(f => /^client-[a-z0-9][a-z0-9-]*\.md$/i.test(f))
      .map(f => f.replace(/^client-/i, '').replace(/\.md$/i, '').toLowerCase())
      .filter(s => s.length >= MIN_LEN);
  }
} catch { process.exit(0); }

if (slugs.length === 0) process.exit(0);

// Case-insensitive whole-word match on slug; also match common display variants
// (e.g., slug "acme-corp" also matches "acme corp" and "ACME").
function buildRegex(slug) {
  const parts = slug.split('-').filter(Boolean);
  // Match the full slug OR the first segment if ≥ MIN_LEN
  const alternatives = new Set([slug.replace(/-/g, '[\\s-]')]);
  if (parts[0] && parts[0].length >= MIN_LEN) alternatives.add(parts[0]);
  const pattern = Array.from(alternatives).map(a => `\\b${a}\\b`).join('|');
  return new RegExp(pattern, 'i');
}

const hits = [];
for (const slug of slugs) {
  try {
    if (buildRegex(slug).test(prompt)) hits.push(slug);
    if (hits.length >= MAX) break;
  } catch { /* noop */ }
}

if (hits.length === 0) process.exit(0);

// Emit additionalContext directive — Claude Code honors the JSON output form
// for UserPromptSubmit hooks. We stick to a conservative, well-formed object.
const additions = hits.map(slug => {
  const p = path.join(MEMORY_DIR, `client-${slug}.md`);
  return { type: 'file', path: p, label: `client:${slug}` };
});

const output = {
  hookSpecificOutput: {
    hookEventName: 'UserPromptSubmit',
    additionalContext: `The following client memory files have been pre-loaded based on slug detection in the user's prompt. Use them to answer.\n\n` +
      additions.map(a => `- @${a.path}`).join('\n'),
  },
  // Also write a human-readable nudge to stderr for transparency
};

process.stdout.write(JSON.stringify(output) + '\n');
try {
  process.stderr.write(`[SHINE client-detect] pre-loaded: ${hits.join(', ')}\n`);
} catch { /* noop */ }
process.exit(0);
