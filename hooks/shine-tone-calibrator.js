#!/usr/bin/env node
// SHINE hook — UserPromptSubmit
// Detects *correction signals* in the user's prompt ("too formal",
// "shorter", "more casual", "less pushy", "add warmth", etc.) and appends a
// one-line timestamped delta to ~/.claude/memory/style-<client>.md (or to
// style-global.md if no client is active).
//
// Purpose: over 5–10 corrections, the style file converges on the user's
// actual preference, so drafts match without re-prompting. This is the
// learning half of Rule #17 / style-email / style-proposal.
//
// Detection strategy (lexical, deliberate):
//   - Only fires when the prompt LOOKS like a correction of a prior draft
//     (contains one of a small curated list of signals).
//   - Extracts the correction direction (formality/length/warmth/etc.) and
//     the magnitude word if present (a bit / much / way).
//   - Never writes if no client context can be inferred AND
//     SHINE_TONE_GLOBAL=0 (opt-out for global file).
//
// Controls:
//   SHINE_DISABLE_TONE_CALIBRATOR=1     disable
//   SHINE_TONE_GLOBAL=0                 don't write to style-global.md
//   SHINE_TONE_MAX_ENTRIES=200          rotate file when entries exceed this
//
// Never logs the full prompt. Writes at most one line per turn. Fails open.

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

if (process.env.SHINE_DISABLE_TONE_CALIBRATOR === '1') process.exit(0);

const MEMORY_DIR = path.join(os.homedir(), '.claude', 'memory');
const SESSIONS_DIR = path.join(os.homedir(), '.claude', 'sessions');
const TONE_GLOBAL = process.env.SHINE_TONE_GLOBAL !== '0';
const MAX_ENTRIES = parseInt(process.env.SHINE_TONE_MAX_ENTRIES || '200', 10);

let payload = {};
try {
  const input = fs.readFileSync(0, 'utf8');
  if (input) payload = JSON.parse(input);
} catch { process.exit(0); }

const prompt = (payload && (payload.prompt || payload.user_prompt || payload.message)) || '';
if (!prompt || typeof prompt !== 'string' || prompt.length > 4000) process.exit(0);

// Curated correction signals — axis → regex list
const SIGNALS = [
  { axis: 'formality',  direction: 'more-casual', re: /\b(too formal|less formal|more casual|più informale|meno formale)\b/i },
  { axis: 'formality',  direction: 'more-formal', re: /\b(too casual|more formal|less casual|più formale|troppo informale)\b/i },
  { axis: 'length',     direction: 'shorter',     re: /\b(too long|shorter|more concise|make it brief|più corto|più breve)\b/i },
  { axis: 'length',     direction: 'longer',      re: /\b(too short|longer|more detail|expand|più lungo|più dettagliato)\b/i },
  { axis: 'warmth',     direction: 'warmer',      re: /\b(too cold|warmer|add warmth|più caloroso|più amichevole)\b/i },
  { axis: 'warmth',     direction: 'colder',      re: /\b(too warm|less friendly|more neutral|meno caloroso)\b/i },
  { axis: 'assertive',  direction: 'softer',      re: /\b(too pushy|less pushy|softer|less aggressive|meno diretto|meno aggressivo)\b/i },
  { axis: 'assertive',  direction: 'firmer',      re: /\b(too soft|more direct|more assertive|più diretto|più fermo)\b/i },
  { axis: 'jargon',     direction: 'less-jargon', re: /\b(too technical|less jargon|simpler words|meno tecnico|più semplice)\b/i },
  { axis: 'jargon',     direction: 'more-specific', re: /\b(too vague|more specific|more technical|più specifico|più tecnico)\b/i },
];

const hits = [];
for (const s of SIGNALS) {
  if (s.re.test(prompt)) hits.push({ axis: s.axis, direction: s.direction });
}
if (hits.length === 0) process.exit(0);

// Resolve active client: read ~/.claude/sessions/active-client (if set by a skill)
function activeClient() {
  try {
    const p = path.join(SESSIONS_DIR, 'active-client');
    if (fs.existsSync(p)) {
      const slug = fs.readFileSync(p, 'utf8').trim().toLowerCase();
      if (/^[a-z0-9][a-z0-9-]*$/.test(slug)) return slug;
    }
  } catch { /* noop */ }
  return null;
}

const client = activeClient();
const target = client
  ? path.join(MEMORY_DIR, `style-${client}.md`)
  : (TONE_GLOBAL ? path.join(MEMORY_DIR, 'style-global.md') : null);

if (!target) process.exit(0);

try {
  fs.mkdirSync(path.dirname(target), { recursive: true });

  // Seed file if missing
  if (!fs.existsSync(target)) {
    const header =
      `---\n` +
      `type: style\n` +
      `name: ${client ? `Style — ${client}` : 'Style — global'}\n` +
      `---\n\n` +
      `# Tone calibration log\n\n` +
      `Auto-populated by \`shine-tone-calibrator\` hook. Each entry = one observed correction.\n` +
      `Review periodically and consolidate into prose guidance at the top of this file.\n\n` +
      `## Entries\n\n`;
    fs.writeFileSync(target, header);
  }

  const ts = new Date().toISOString();
  const cwd = process.cwd();
  const deltas = hits.map(h => `${h.axis}:${h.direction}`).join(', ');
  const line = `- ${ts}  ·  ${deltas}  ·  cwd=${path.basename(cwd)}\n`;
  fs.appendFileSync(target, line);

  // Light rotation: if file has > MAX_ENTRIES `- ` lines, keep header + last MAX
  const raw = fs.readFileSync(target, 'utf8');
  const entryLines = raw.split('\n').filter(l => l.startsWith('- '));
  if (entryLines.length > MAX_ENTRIES) {
    const headerEnd = raw.indexOf('## Entries\n\n');
    if (headerEnd > -1) {
      const head = raw.slice(0, headerEnd + '## Entries\n\n'.length);
      const kept = entryLines.slice(-MAX_ENTRIES).join('\n') + '\n';
      fs.writeFileSync(target, head + kept);
    }
  }

  // Transparency nudge on stderr (no prompt content leaked)
  try {
    process.stderr.write(`[SHINE tone-calibrator] logged ${deltas} → ${path.basename(target)}\n`);
  } catch { /* noop */ }
} catch { /* fail open */ }

process.exit(0);
