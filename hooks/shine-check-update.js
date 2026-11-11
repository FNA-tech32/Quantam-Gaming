#!/usr/bin/env node
// SHINE hook — SessionStart
// Checks whether a newer version of the SHINE framework is available on
// GitHub. Non-blocking: logs a one-line notice to stderr and exits 0.
//
// Controls:
//   SHINE_DISABLE_UPDATE_CHECK=1  → skip entirely
//   SHINE_UPDATE_REPO=owner/repo  → override the remote (default: diShine-digital-agency/shine-claude-code-framework)
//
// Never errors out of the session — every failure path returns exit 0.

'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
let emitter;
try { emitter = require(path.join(__dirname, '_shine-hook-output.js')); }
catch { emitter = { emit: (_h, _l, t) => process.stderr.write(t.endsWith('\n') ? t : t + '\n') }; }

if (process.env.SHINE_DISABLE_UPDATE_CHECK === '1') process.exit(0);

const REPO = process.env.SHINE_UPDATE_REPO || 'diShine-digital-agency/SHINE-Code-System';
const CACHE = path.join(process.env.HOME || '~', '.claude', 'cache', 'shine-update.json');
const TTL_MS = 24 * 60 * 60 * 1000; // 24h
const VERSION_FILE = path.join(process.env.HOME || '~', '.claude', 'shine', 'VERSION');

function localVersion() {
  try { return fs.readFileSync(VERSION_FILE, 'utf8').trim(); } catch { return null; }
}

function readCache() {
  try {
    const raw = JSON.parse(fs.readFileSync(CACHE, 'utf8'));
    if (Date.now() - raw.ts < TTL_MS) return raw;
  } catch { /* noop */ }
  return null;
}

function writeCache(obj) {
  try {
    fs.mkdirSync(path.dirname(CACHE), { recursive: true });
    fs.writeFileSync(CACHE, JSON.stringify(obj));
  } catch { /* noop */ }
}

function fetchLatest() {
  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.github.com',
      path: `/repos/${REPO}/releases/latest`,
      headers: { 'User-Agent': 'shine-update-check', 'Accept': 'application/vnd.github+json' },
      timeout: 4000,
    }, (res) => {
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => {
        try { resolve(JSON.parse(body).tag_name || null); } catch { resolve(null); }
      });
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
    req.end();
  });
}

(async () => {
  const local = localVersion();
  if (!local) process.exit(0);

  let cached = readCache();
  let latest = cached ? cached.latest : await fetchLatest();
  if (!cached && latest) writeCache({ ts: Date.now(), latest });

  if (latest && latest !== local && latest !== `v${local}`) {
    emitter.emit('check-update', 'info',
      `[SHINE] Update available: ${local} → ${latest}  (https://github.com/${REPO}/releases)`,
      { local, latest, repo: REPO });
  }
  process.exit(0);
})().catch(() => process.exit(0));
