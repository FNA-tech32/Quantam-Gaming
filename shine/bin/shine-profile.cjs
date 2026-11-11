#!/usr/bin/env node
// SHINE profile manager — atomically switches ~/.claude/settings.json between
// curated plugin/MCP bundles. Profiles live in ~/.claude/shine/profiles/.
//
// Usage:
//   shine-profile list
//   shine-profile show <name>
//   shine-profile activate <name>
//   shine-profile current
//
// Exit codes: 0 success · 1 profile error · 2 usage error

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const HOME = os.homedir();
const PROFILES_DIR = path.join(HOME, '.claude/shine/profiles');
const SETTINGS_PATH = path.join(HOME, '.claude/settings.json');

function die(code, msg) { process.stderr.write(msg + '\n'); process.exit(code); }

function loadProfile(name) {
  const p = path.join(PROFILES_DIR, `${name}.json`);
  if (!fs.existsSync(p)) die(1, `Profile not found: ${name}\nRun 'shine-profile list' to see available profiles.`);
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch (e) { die(1, `Invalid profile JSON (${name}): ${e.message}`); }
}

function loadSettings() {
  if (!fs.existsSync(SETTINGS_PATH)) die(1, `No ~/.claude/settings.json. Run ./install.sh first.`);
  try { return JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf8')); }
  catch (e) { die(1, `Invalid settings.json: ${e.message}`); }
}

function listProfiles() {
  if (!fs.existsSync(PROFILES_DIR)) die(1, `Profiles dir missing: ${PROFILES_DIR}`);
  const files = fs.readdirSync(PROFILES_DIR).filter(f => f.endsWith('.json')).sort();
  console.log('Available profiles:\n');
  for (const f of files) {
    try {
      const p = JSON.parse(fs.readFileSync(path.join(PROFILES_DIR, f), 'utf8'));
      const tokens = p.estimatedContextTokens ? ` (~${Math.round(p.estimatedContextTokens/1000)}k)` : '';
      console.log(`  ${p.name.padEnd(10)} ${p.description}${tokens}`);
    } catch { /* skip bad */ }
  }
  console.log('\nActivate one: shine-profile activate <name>');
}

function showProfile(name) {
  const p = loadProfile(name);
  console.log(JSON.stringify(p, null, 2));
}

function currentProfile() {
  const s = loadSettings();
  const enabled = Object.keys(s.enabledPlugins || {}).filter(k => s.enabledPlugins[k]);
  console.log(`Enabled plugins (${enabled.length}):`);
  enabled.forEach(p => console.log(`  ${p}`));
  const disabled = s.disabledMcpjsonServers || [];
  console.log(`\nDisabled MCP servers (${disabled.length}):`);
  disabled.forEach(m => console.log(`  ${m}`));
}

function activateProfile(name) {
  const p = loadProfile(name);
  const s = loadSettings();
  s.enabledPlugins = p.enabledPlugins || {};
  s.disabledMcpjsonServers = p.disabledMcpjsonServers || [];

  const tmp = SETTINGS_PATH + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(s, null, 2));
  fs.renameSync(tmp, SETTINGS_PATH);

  const tokens = p.estimatedContextTokens ? ` (~${Math.round(p.estimatedContextTokens/1000)}k tokens)` : '';
  console.log(`✅ Activated profile: ${p.name}${tokens}`);
  console.log(`   ${p.description}`);
  console.log(`\n⚠️  Restart Claude Code for changes to take effect.`);
}

const [cmd, arg] = process.argv.slice(2);
switch (cmd) {
  case 'list':     listProfiles(); break;
  case 'show':     if (!arg) die(2, 'Usage: shine-profile show <name>'); showProfile(arg); break;
  case 'activate': if (!arg) die(2, 'Usage: shine-profile activate <name>'); activateProfile(arg); break;
  case 'current':  currentProfile(); break;
  default:
    die(2, `Usage:\n  shine-profile list\n  shine-profile show <name>\n  shine-profile activate <name>\n  shine-profile current`);
}
