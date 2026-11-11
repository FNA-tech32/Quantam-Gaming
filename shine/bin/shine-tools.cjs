#!/usr/bin/env node
/**
 * shine-tools.cjs — SHINE runtime engine
 *
 * Usage: node shine-tools.cjs <subcommand> [args] [--raw] [--cwd <path>]
 * Uses only safe child_process variants (spawnSync / execFileSync) — no shell.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const cp = require('child_process');
const spawnSync = cp.spawnSync;

// ─── Argument parsing ──────────────────────────────────────────────────────
function parseArgs(argv) {
  const args = { _: [], raw: false, cwd: null, flags: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--raw') args.raw = true;
    else if (a === '--cwd') args.cwd = argv[++i];
    else if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) { args.flags[key] = next; i++; }
      else args.flags[key] = true;
    } else args._.push(a);
  }
  return args;
}

function emit(data, raw) {
  if (raw) { process.stdout.write(JSON.stringify(data, null, 2) + '\n'); return; }
  if (typeof data === 'string') { process.stdout.write(data + '\n'); return; }
  if (data && typeof data === 'object') {
    for (const [k, v] of Object.entries(data)) {
      process.stdout.write(k + ': ' + (typeof v === 'object' ? JSON.stringify(v) : v) + '\n');
    }
    return;
  }
  process.stdout.write(String(data) + '\n');
}

function fail(msg, code) {
  process.stderr.write('shine-tools: ' + msg + '\n');
  process.exit(code || 1);
}

// ─── Filesystem helpers ────────────────────────────────────────────────────
function resolveCwd(args) {
  const cwd = args.cwd ? path.resolve(args.cwd) : process.cwd();
  if (!fs.existsSync(cwd)) fail('cwd does not exist: ' + cwd);
  return cwd;
}

function projectRoot(cwd) {
  let dir = cwd;
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, '.git')) ||
        fs.existsSync(path.join(dir, 'ROADMAP.md')) ||
        fs.existsSync(path.join(dir, 'package.json'))) return dir;
    dir = path.dirname(dir);
  }
  return cwd;
}

function shineDir(cwd) { return path.join(projectRoot(cwd), '.shine'); }
function phaseDir(cwd, phase) {
  return path.join(shineDir(cwd), 'phases', 'phase-' + String(phase).padStart(2, '0'));
}
function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }
function readIfExists(p) { try { return fs.readFileSync(p, 'utf8'); } catch { return null; } }
function writeFileAtomic(target, content) {
  ensureDir(path.dirname(target));
  const tmp = target + '.tmp.' + process.pid + '.' + Date.now();
  fs.writeFileSync(tmp, content);
  fs.renameSync(tmp, target);
}

// ─── Frontmatter parser (no deps) ──────────────────────────────────────────
function parseFrontmatter(text) {
  if (!text) return { frontmatter: {}, body: '' };
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { frontmatter: {}, body: text };
  const fm = {};
  let currentKey = null;
  let blockMode = null; // '|' literal, '>' folded
  let blockLines = [];
  const lines = m[1].split(/\r?\n/);
  const flushBlock = () => {
    if (!currentKey || !blockMode) return;
    const joiner = blockMode === '|' ? '\n' : ' ';
    fm[currentKey] = blockLines.join(joiner).replace(/\s+$/, '');
    blockMode = null;
    blockLines = [];
  };
  for (const rawLine of lines) {
    if (blockMode) {
      if (/^\S/.test(rawLine) || rawLine === '') {
        if (rawLine === '') { blockLines.push(''); continue; }
        flushBlock();
      } else {
        blockLines.push(rawLine.replace(/^\s{2,}/, ''));
        continue;
      }
    }
    const line = rawLine.replace(/\s+$/, '');
    if (!line) continue;
    const kv = line.match(/^([A-Za-z0-9_.-]+)\s*:\s*(.*)$/);
    if (kv) {
      flushBlock();
      currentKey = kv[1];
      let v = kv[2].trim();
      if (v === '|' || v === '>') { blockMode = v; blockLines = []; continue; }
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      if (v === 'true') v = true;
      else if (v === 'false') v = false;
      else if (v !== '' && !isNaN(Number(v))) v = Number(v);
      else if (v === '') v = [];
      fm[currentKey] = v;
    } else if (currentKey && /^\s*-\s+/.test(line)) {
      if (!Array.isArray(fm[currentKey])) fm[currentKey] = [];
      fm[currentKey].push(line.replace(/^\s*-\s+/, '').trim());
    }
  }
  flushBlock();
  return { frontmatter: fm, body: m[2] };
}

// ─── Config ────────────────────────────────────────────────────────────────
function configPath() { return path.join(os.homedir(), '.claude', 'shine', 'config.json'); }
function loadConfig() {
  const raw = readIfExists(configPath());
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}
function saveConfig(cfg) { writeFileAtomic(configPath(), JSON.stringify(cfg, null, 2)); }

// ─── Git helper (spawnSync — no shell) ─────────────────────────────────────
function git(args, cwd) {
  const r = spawnSync('git', args, { cwd: cwd, encoding: 'utf8' });
  return { ok: r.status === 0, stdout: (r.stdout || '').trim(), stderr: (r.stderr || '').trim(), code: r.status };
}

// ─── Subcommands ───────────────────────────────────────────────────────────
function cmdInit(args) {
  const cwd = resolveCwd(args);
  const phase = args._[1] || args.flags.phase || '1';
  const root = projectRoot(cwd);
  const pdir = phaseDir(cwd, phase);
  ensureDir(pdir);
  const plans = fs.readdirSync(pdir).filter(f => /^plan-.*\.md$/.test(f)).sort();
  emit({
    ok: true, project_root: root, phase: Number(phase), phase_dir: pdir, plans,
    context_path: path.join(pdir, 'CONTEXT.md'),
    requirements_path: path.join(root, 'REQUIREMENTS.md'),
    state_path: path.join(pdir, 'STATE.md'),
    roadmap_path: path.join(root, 'ROADMAP.md'),
    config: loadConfig(),
  }, true);
}

function cmdState(args) {
  const cwd = resolveCwd(args);
  const phase = args._[1] || '1';
  const pdir = phaseDir(cwd, phase);
  ensureDir(pdir);
  const statePath = path.join(pdir, 'STATE.md');
  const setFlag = args.flags.set;
  if (setFlag === true) fail('state: --set requires a value in key=value form');
  if (setFlag && typeof setFlag === 'string' && !setFlag.includes('=')) {
    fail('state: --set value must contain "=" (got "' + setFlag + '")');
  }
  if (setFlag && typeof setFlag === 'string' && setFlag.includes('=')) {
    const idx = setFlag.indexOf('=');
    const k = setFlag.slice(0, idx);
    const v = setFlag.slice(idx + 1);
    const current = readIfExists(statePath) || '# Phase State\n\n';
    const re = new RegExp('^- \\*\\*' + k + '\\*\\*: .*$', 'm');
    const line = '- **' + k + '**: ' + v;
    const next = re.test(current) ? current.replace(re, line) : current + line + '\n';
    writeFileAtomic(statePath, next);
    emit({ ok: true, key: k, value: v, state_path: statePath }, true);
    return;
  }
  const content = readIfExists(statePath) || '';
  const state = {};
  const re2 = /^- \*\*([A-Za-z0-9_-]+)\*\*:\s*(.+)$/gm;
  let m;
  while ((m = re2.exec(content)) !== null) state[m[1]] = m[2].trim();
  emit({ ok: true, state_path: statePath, state, raw: content }, true);
}

function cmdCommit(args) {
  const cwd = resolveCwd(args);
  const message = args._[1] || args.flags.message;
  if (!message) fail('commit: missing message');
  const scope = args.flags.scope || 'shine';
  const formatted = message.startsWith(scope + '(') ? message : 'shine(' + scope + '): ' + message;
  const add = git(['add', '-A'], cwd);
  if (!add.ok) fail('git add failed: ' + add.stderr);
  const diff = git(['diff', '--cached', '--quiet'], cwd);
  if (diff.code === 0) { emit({ ok: true, committed: false, reason: 'no staged changes' }, true); return; }
  const c = git(['commit', '-m', formatted], cwd);
  if (!c.ok) fail('git commit failed: ' + c.stderr);
  const sha = git(['rev-parse', 'HEAD'], cwd).stdout;
  emit({ ok: true, committed: true, sha, message: formatted }, true);
}

function cmdCommitToSubrepo(args) {
  const cwd = resolveCwd(args);
  const subrepo = args._[1];
  const message = args._[2] || args.flags.message;
  if (!subrepo || !message) fail('commit-to-subrepo: require <path> and <message>');
  const sub = path.resolve(cwd, subrepo);
  if (!fs.existsSync(path.join(sub, '.git'))) fail('not a git subrepo: ' + sub);
  const add = git(['add', '-A'], sub);
  if (!add.ok) fail(add.stderr);
  const diff = git(['diff', '--cached', '--quiet'], sub);
  if (diff.code === 0) { emit({ ok: true, committed: false }, true); return; }
  const c = git(['commit', '-m', 'shine: ' + message], sub);
  if (!c.ok) fail(c.stderr);
  emit({ ok: true, committed: true, subrepo: sub }, true);
}

function cmdRoadmap(args) {
  const cwd = resolveCwd(args);
  const rp = path.join(projectRoot(cwd), 'ROADMAP.md');
  const text = readIfExists(rp);
  if (!text) { emit({ ok: true, phases: [], roadmap_path: rp, exists: false }, true); return; }
  const phases = [];
  const re = /^##\s+Phase\s+(\d+)\s*[\u2014\-:]\s*(.+?)(?:\s+\[(done|in-progress|todo|blocked)\])?\s*$/gim;
  let m;
  while ((m = re.exec(text)) !== null) {
    phases.push({ number: Number(m[1]), title: m[2].trim(), status: m[3] ? m[3].toLowerCase() : 'todo' });
  }
  const only = args.flags.phase;
  const filtered = only ? phases.filter(p => p.number === Number(only)) : phases;
  emit({ ok: true, roadmap_path: rp, phases: filtered, total: phases.length }, true);
}

function cmdVerify(args) {
  const cwd = resolveCwd(args);
  const phase = args._[1] || '1';
  const pdir = phaseDir(cwd, phase);
  const check = args.flags.check || 'all';
  const checks = [];
  if (check === 'goal-backward' || check === 'all') {
    const hasPlan = fs.existsSync(pdir) && fs.readdirSync(pdir).some(f => /^plan-.*\.md$/.test(f));
    checks.push({ name: 'goal-backward', ok: hasPlan, detail: hasPlan ? 'plan present' : 'no plan found' });
  }
  if (check === 'task-completion' || check === 'all') {
    const s = readIfExists(path.join(pdir, 'STATE.md')) || '';
    const done = /\*\*status\*\*:\s*done/i.test(s);
    checks.push({ name: 'task-completion', ok: done, detail: done ? 'state=done' : 'state not done' });
  }
  if (check === 'code-quality' || check === 'all') {
    const st = git(['status', '--porcelain'], cwd);
    const clean = st.ok && st.stdout === '';
    checks.push({ name: 'code-quality', ok: clean, detail: clean ? 'tree clean' : 'uncommitted changes' });
  }
  const allOk = checks.every(c => c.ok);
  emit({ ok: allOk, phase: Number(phase), checks }, true);
}

function cmdFrontmatter(args) {
  const file = args._[1];
  if (!file) fail('frontmatter: missing file path');
  const text = readIfExists(path.resolve(file));
  if (text === null) fail('frontmatter: file not found: ' + file);
  emit(parseFrontmatter(text), true);
}

function cmdResolveModel(args) {
  const agent = args._[1] || '';
  const cfg = loadConfig();
  const profile = cfg.model_profile || 'balanced';
  const defaults = { quality: 'claude-opus-4-1', balanced: 'claude-sonnet-4-5', budget: 'claude-haiku-4', inherit: null };
  const overrides = cfg.model_overrides || {};
  const model = overrides[agent] || defaults[profile] || 'claude-sonnet-4-5';
  emit({ ok: true, agent, profile, model }, true);
}

function cmdGenerateSlug(args) {
  const text = args._.slice(1).join(' ') || args.flags.text;
  if (!text) fail('generate-slug: missing text');
  const slug = String(text).toLowerCase().normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '').slice(0, 80);
  emit({ ok: true, slug, source: text }, true);
}

function cmdWebsearch(args) {
  const query = args._.slice(1).join(' ') || args.flags.query;
  if (!query) fail('websearch: missing query');
  emit({
    ok: true, query, strategy: 'delegate-to-agent',
    hint: 'Invoke the WebSearch tool with this query; shine-tools does not perform network calls.',
  }, true);
}

function cmdConfigGet(args) {
  const key = args._[1];
  const cfg = loadConfig();
  if (!key) { emit({ ok: true, config: cfg }, true); return; }
  let v = cfg;
  for (const p of key.split('.')) v = v && v[p];
  emit({ ok: true, key, value: v === undefined ? null : v }, true);
}

function cmdConfigSetModelProfile(args) {
  const profile = args._[1] || args.flags.profile;
  const valid = ['quality', 'balanced', 'budget', 'inherit'];
  if (!valid.includes(profile)) fail('config-set-model-profile: profile must be one of ' + valid.join(', '));
  const cfg = loadConfig();
  cfg.model_profile = profile;
  saveConfig(cfg);
  emit({ ok: true, profile, config_path: configPath() }, true);
}

function cmdPhase(args) {
  const cwd = resolveCwd(args);
  const phase = args._[1] || '1';
  const pdir = phaseDir(cwd, phase);
  if (!fs.existsSync(pdir)) { emit({ ok: true, phase: Number(phase), exists: false, phase_dir: pdir }, true); return; }
  const files = fs.readdirSync(pdir);
  emit({
    ok: true, phase: Number(phase), exists: true, phase_dir: pdir,
    plans: files.filter(f => /^plan-.*\.md$/.test(f)),
    has_context: files.includes('CONTEXT.md'),
    has_state: files.includes('STATE.md'),
    has_summary: files.includes('SUMMARY.md'),
  }, true);
}

function cmdRequirements(args) {
  const cwd = resolveCwd(args);
  const rp = path.join(projectRoot(cwd), 'REQUIREMENTS.md');
  const text = readIfExists(rp);
  if (!text) { emit({ ok: true, exists: false, path: rp }, true); return; }
  const sections = [];
  const matches = [...text.matchAll(/^##\s+(.+)$/gm)];
  let last = null, lastIdx = 0;
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    if (last) sections.push({ title: last, body: text.slice(lastIdx, m.index).trim() });
    last = m[1].trim(); lastIdx = m.index + m[0].length;
  }
  if (last) sections.push({ title: last, body: text.slice(lastIdx).trim() });
  emit({ ok: true, exists: true, path: rp, sections }, true);
}

function cmdSummaryExtract(args) {
  const cwd = resolveCwd(args);
  const phase = args._[1] || '1';
  const sp = path.join(phaseDir(cwd, phase), 'SUMMARY.md');
  const text = readIfExists(sp);
  if (!text) { emit({ ok: true, exists: false, path: sp }, true); return; }
  const body = text.replace(/^#[^\n]*\n+/, '');
  const firstPara = body.split(/\n\n/)[0] || '';
  emit({ ok: true, path: sp, summary: firstPara.trim(), full_length: text.length }, true);
}

function cmdHistoryDigest(args) {
  const sessions = path.join(os.homedir(), '.claude', 'sessions');
  let entries = [];
  if (fs.existsSync(sessions)) {
    entries = fs.readdirSync(sessions)
      .filter(f => f.startsWith('precompact-') && f.endsWith('.md'))
      .sort().slice(-5)
      .map(f => {
        const p = path.join(sessions, f);
        const t = readIfExists(p) || '';
        return { file: f, path: p, bytes: t.length, preview: t.slice(0, 400) };
      });
  }
  emit({ ok: true, sessions_dir: sessions, digest: entries }, true);
}

function cmdWorkstream(args) {
  const cwd = resolveCwd(args);
  const sub = args._[1];
  const wsDir = path.join(shineDir(cwd), 'workstreams');
  ensureDir(wsDir);
  const list = () => fs.readdirSync(wsDir)
    .filter(f => f.endsWith('.json'))
    .map(f => { try { return JSON.parse(fs.readFileSync(path.join(wsDir, f), 'utf8')); } catch { return null; } })
    .filter(Boolean);
  switch (sub) {
    case 'list': emit({ ok: true, workstreams: list() }, true); return;
    case 'create': {
      const name = args._[2]; if (!name) fail('workstream create: missing name');
      const f = path.join(wsDir, name + '.json');
      if (fs.existsSync(f)) fail('workstream exists: ' + name);
      const ws = { name, created: new Date().toISOString(), status: 'active', phases: [] };
      writeFileAtomic(f, JSON.stringify(ws, null, 2));
      emit({ ok: true, workstream: ws }, true); return;
    }
    case 'status': {
      const name = args._[2]; if (!name) fail('workstream status: missing name');
      const raw = readIfExists(path.join(wsDir, name + '.json'));
      if (!raw) fail('workstream not found: ' + name);
      emit({ ok: true, workstream: JSON.parse(raw) }, true); return;
    }
    case 'set': {
      const name = args._[2]; if (!name) fail('workstream set: missing name');
      const cfg = loadConfig(); cfg.active_workstream = name; saveConfig(cfg);
      emit({ ok: true, active_workstream: name }, true); return;
    }
    case 'archive': {
      const name = args._[2]; if (!name) fail('workstream archive: missing name');
      const f = path.join(wsDir, name + '.json');
      const raw = readIfExists(f); if (!raw) fail('workstream not found: ' + name);
      const ws = JSON.parse(raw); ws.status = 'archived'; ws.archived = new Date().toISOString();
      writeFileAtomic(f, JSON.stringify(ws, null, 2));
      emit({ ok: true, workstream: ws }, true); return;
    }
    case 'progress': {
      const all = list();
      const active = all.find(w => w.name === loadConfig().active_workstream);
      emit({ ok: true, active, total: all.length, active_count: all.filter(w => w.status === 'active').length }, true);
      return;
    }
    default: fail('workstream: unknown subcommand. Expected: list|create|status|set|archive|progress');
  }
}

function cmdIndexSkills(args) {
  // Walk skills/ — parse each SKILL.md frontmatter — produce grouped index.
  // Safe: reads FS only, writes a single file. Idempotent.
  const scriptDir = path.dirname(__dirname); // shine/
  // Prefer repo layout: scriptDir = <repo>/shine, so skills/ is <repo>/skills
  const repoRoot = path.dirname(scriptDir);
  const skillsDir = args.flags.dir
    ? path.resolve(args.flags.dir)
    : (fs.existsSync(path.join(repoRoot, 'skills'))
        ? path.join(repoRoot, 'skills')
        : path.join(os.homedir(), '.claude', 'skills'));

  if (!fs.existsSync(skillsDir)) fail('index-skills: skills dir not found: ' + skillsDir);

  const entries = [];
  for (const name of fs.readdirSync(skillsDir)) {
    const skillPath = path.join(skillsDir, name, 'SKILL.md');
    if (!fs.existsSync(skillPath)) continue;
    const text = readIfExists(skillPath) || '';
    const fm = parseFrontmatter(text).frontmatter || {};
    entries.push({
      slug: name,
      name: fm.name || name,
      description: String(fm.description || '').replace(/\s+/g, ' ').trim(),
      category: fm.category || inferCategory(name),
      tools: fm['allowed-tools'] || fm.tools || '',
      argumentHint: fm['argument-hint'] || '',
    });
  }
  entries.sort((a, b) => a.slug.localeCompare(b.slug));

  // Group by category
  const byCat = {};
  for (const e of entries) (byCat[e.category] = byCat[e.category] || []).push(e);
  const catOrder = [
    'core', 'engineering', 'agency', 'marketing', 'sales',
    'consulting', 'tech', 'ops', 'data', 'brand', 'misc',
  ];
  const orderedCats = [
    ...catOrder.filter(c => byCat[c]),
    ...Object.keys(byCat).filter(c => !catOrder.includes(c)).sort(),
  ];

  if (args.flags.json || args.raw) {
    emit({ ok: true, total: entries.length, categories: byCat }, true);
    return;
  }

  const lines = [];
  lines.push('# Skill Index');
  lines.push('');
  lines.push('> Auto-generated by `shine-tools index-skills`. Do not edit by hand.');
  lines.push(`> ${entries.length} skills across ${orderedCats.length} categories · last regenerated from frontmatter.`);
  lines.push('');
  for (const cat of orderedCats) {
    const rows = byCat[cat];
    lines.push(`## ${capitalize(cat)} (${rows.length})`);
    lines.push('');
    lines.push('| Slug | Purpose | Args |');
    lines.push('|---|---|---|');
    for (const r of rows) {
      const desc = String(r.description || '—').replace(/\|/g, '\\|').slice(0, 120);
      const hint = String(r.argumentHint || '').replace(/\|/g, '\\|');
      lines.push(`| \`/${r.slug}\` | ${desc} | ${hint || '—'} |`);
    }
    lines.push('');
  }

  const out = args.flags.out
    ? path.resolve(args.flags.out)
    : path.join(skillsDir, 'INDEX.md');
  writeFileAtomic(out, lines.join('\n'));
  emit({ ok: true, total: entries.length, categories: Object.fromEntries(orderedCats.map(c => [c, byCat[c].length])), out }, args.raw);
}

function inferCategory(slug) {
  // Rough heuristic — SKILL.md can override with an explicit `category:` key.
  const s = slug.replace(/^shine-/, '');
  if (/^(proposal|draft-email|gdpr|lead-enrich|client-brief|kickoff|retrospective|roi-|seo-|tag-|cookie-|pii-|compliance|meta-|status-|sync|client-tone)/.test(s)) return 'agency';
  if (/^(cold-email|linkedin|follow-up|sales-|icp|persona|competitor|pricing)/.test(s)) return 'sales';
  if (/^(content-|blog|social|newsletter|landing|value-prop|press|case-study|webinar|campaign)/.test(s)) return 'marketing';
  if (/^(discovery|swot|okr|roadmap|stakeholder|risk|change|digital-|exec-)/.test(s)) return 'consulting';
  if (/^(tech-|api-|deploy|incident|pr-|readme|changelog|architecture|migration|test-)/.test(s)) return 'tech';
  if (/^(meeting|weekly|vendor|nda|invoice|timesheet|capacity|process)/.test(s)) return 'ops';
  if (/^(ga4|attribution|dashboard|kpi|ab-|data-)/.test(s)) return 'data';
  if (/^(brand-|naming|logo|design)/.test(s)) return 'brand';
  if (s.startsWith('shine-') || /^(plan|execute|verify|debug|ship|next|do|fast|quick|map|audit|review|autonomous|help|health|progress|resume|new-|add-|insert-|remove-|cleanup|forensics|docs-|secure-|validate-|ui-|complete-|stats|session-|manager)/.test(s)) return 'core';
  return 'misc';
}

function capitalize(s) { return s ? s[0].toUpperCase() + s.slice(1) : s; }

// ─── #16 cmdOnboard — starter memory scaffold ──────────────────────────────
function cmdOnboard(args) {
  // Non-destructive: only creates files that don't exist.
  const claudeDir = args.flags.dir
    ? path.resolve(args.flags.dir)
    : path.join(os.homedir(), '.claude');
  const memDir = path.join(claudeDir, 'memory');
  ensureDir(memDir);

  const written = [];
  const skipped = [];

  const files = {
    'preference-communication.md': [
      '---', 'type: preference', 'name: Communication defaults',
      'last_updated: ' + new Date().toISOString().slice(0, 10),
      'tags: [tone, sign-off, length]', '---', '',
      '# Communication defaults', '',
      '- Default tone: warm, direct, professional. No hype.',
      '- Sign-off: adapt to client register; informal "A presto" for familiar, full-name for formal first contact.',
      '- Length: bullet over prose for operational comms; prose for strategic docs.',
      '- Subject format for client email: `CLIENT | Specific topic`.',
      '',
    ].join('\n'),
    'preference-stack.md': [
      '---', 'type: preference', 'name: Technical stack defaults',
      'last_updated: ' + new Date().toISOString().slice(0, 10),
      'tags: [stack, languages]', '---', '',
      '# Stack preferences', '',
      '- Preferred languages: <edit me — e.g. TypeScript, Python>',
      '- Preferred frameworks: <edit me>',
      '- Hosting / runtime: <edit me>',
      '- Data conventions: <edit me>',
      '',
    ].join('\n'),
    'preference-factual-rag.md': [
      '---', 'type: preference', 'name: Factual discipline',
      'last_updated: ' + new Date().toISOString().slice(0, 10),
      'tags: [rag, hallucination]', '---', '',
      '# RAG discipline', '',
      '- Every factual claim must come from a source fetched this session.',
      '- Inferred patterns (e.g. `{first}.{last}@domain`) must carry "inferred — not verified".',
      '- On tool failure, stop and report — never guess.',
      '',
    ].join('\n'),
    'style-email-it.md': [
      '---', 'type: style', 'name: Italian email style',
      'last_updated: ' + new Date().toISOString().slice(0, 10),
      'tags: [email, italian]', '---', '',
      '# Email style — Italian', '',
      '- Warm opening: "Ciao <Name>," / "Buongiorno <Name>, spero tutto bene!"',
      '- Body: 1 sentence of context → bullet list of points → clear ask / next step.',
      '- Close: "A presto," (informal) or "A presto e buon lavoro," (slightly more formal).',
      '- Subject always: `CLIENT | Specific topic`.',
      '',
    ].join('\n'),
  };

  for (const [name, content] of Object.entries(files)) {
    const p = path.join(memDir, name);
    if (fs.existsSync(p)) { skipped.push(name); continue; }
    writeFileAtomic(p, content);
    written.push(name);
  }

  // Touch MEMORY.md if absent (just a minimal index)
  const idx = path.join(memDir, 'MEMORY.md');
  if (!fs.existsSync(idx)) {
    writeFileAtomic(idx, [
      '# Memory Index', '',
      '### Preferences',
      '- [Communication](preference-communication.md)',
      '- [Stack](preference-stack.md)',
      '- [Factual RAG](preference-factual-rag.md)', '',
      '### Styles',
      '- [Email (IT)](style-email-it.md)', '',
      '### Clients', '<!-- add entries here -->', '',
    ].join('\n'));
    written.push('MEMORY.md');
  } else skipped.push('MEMORY.md');

  emit({ ok: true, written, skipped, dir: memDir }, args.raw);
}

// ─── #1 (bonus) cmdDoctor — install health report ─────────────────────────
function cmdDoctor(args) {
  const claudeDir = args.flags.dir
    ? path.resolve(args.flags.dir)
    : path.join(os.homedir(), '.claude');
  const report = {
    ok: true,
    claude_dir: claudeDir,
    claude_dir_exists: fs.existsSync(claudeDir),
    node: process.version,
    platform: process.platform,
    checks: {},
  };
  const criticalFiles = [
    'CLAUDE.md',
    'shine/bin/shine-tools.cjs',
    'shine/VERSION',
    'memory/MEMORY.md',
  ];
  for (const f of criticalFiles) {
    const p = path.join(claudeDir, f);
    report.checks[f] = fs.existsSync(p);
    if (!report.checks[f]) report.ok = false;
  }
  // Count hooks / agents / skills installed
  const count = (sub) => {
    const d = path.join(claudeDir, sub);
    if (!fs.existsSync(d)) return 0;
    return fs.readdirSync(d).length;
  };
  report.counts = {
    agents: count('agents'),
    skills: count('skills'),
    hooks: count('hooks'),
  };
  emit(report, true);
  if (!report.ok) process.exit(1);
}

function cmdVersion() {
  const candidates = [
    path.join(__dirname, '..', 'VERSION'),
    path.join(os.homedir(), '.claude', 'shine', 'VERSION'),
  ];
  let v = 'unknown';
  for (const p of candidates) {
    const raw = readIfExists(p);
    if (raw) { v = raw.trim(); break; }
  }
  emit({ version: v, name: 'shine-tools' }, true);
}

function cmdHelp() {
  process.stdout.write([
    'shine-tools.cjs — SHINE runtime engine',
    '',
    'Usage:',
    '  shine-tools.cjs <subcommand> [args] [--raw] [--cwd <path>]',
    '',
    'Subcommands:',
    '  init <phase>                    Load phase context → JSON',
    '  state <phase> [--set k=v]       Read/write phase STATE.md',
    '  commit "<msg>" [--scope <s>]    Atomic git commit',
    '  commit-to-subrepo <p> "<m>"     Commit to a workspace subrepo',
    '  roadmap [--phase N]             Parse ROADMAP.md → JSON',
    '  verify <phase> [--check T]      goal-backward|task-completion|code-quality|all',
    '  frontmatter <file>              Parse YAML frontmatter → JSON',
    '  resolve-model <agent>           Return model for active profile',
    '  generate-slug "<text>"          Text → URL-safe slug',
    '  websearch "<query>"             Delegation stub for WebSearch tool',
    '  config-get [<key>]              Read config (dot-path)',
    '  config-set-model-profile <p>    quality|balanced|budget|inherit',
    '  phase <n>                       Read phase metadata',
    '  requirements                    Parse REQUIREMENTS.md sections',
    '  summary-extract <phase>         First-paragraph summary',
    '  history-digest                  Recent precompact snapshots',
    '  in <phase>                      Alias for init',
    '  workstream <sub> [args]         list|create|status|set|archive|progress',
    '  index-skills [--out <f>]        Regenerate skills/INDEX.md from SKILL.md frontmatter',
    '  onboard [--non-interactive]     Write a starter memory/preference-*.md + MEMORY.md index',
    '  doctor                          Print a JSON health report of the install',
    '  version                         Print version from shine/VERSION',
    '  help                            Show this help',
    '',
    'Exit codes: 0 success · 1 error · 2 abort',
    '',
  ].join('\n'));
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.flags.version || args.flags.v) return cmdVersion();
  const sub = args._[0];
  try {
    switch (sub) {
      case 'init':                     return cmdInit(args);
      case 'state':                    return cmdState(args);
      case 'commit':                   return cmdCommit(args);
      case 'commit-to-subrepo':        return cmdCommitToSubrepo(args);
      case 'roadmap':                  return cmdRoadmap(args);
      case 'verify':                   return cmdVerify(args);
      case 'frontmatter':              return cmdFrontmatter(args);
      case 'resolve-model':            return cmdResolveModel(args);
      case 'generate-slug':            return cmdGenerateSlug(args);
      case 'websearch':                return cmdWebsearch(args);
      case 'config-get':               return cmdConfigGet(args);
      case 'config-set-model-profile': return cmdConfigSetModelProfile(args);
      case 'phase':                    return cmdPhase(args);
      case 'requirements':             return cmdRequirements(args);
      case 'summary-extract':          return cmdSummaryExtract(args);
      case 'history-digest':           return cmdHistoryDigest(args);
      case 'in':                       return cmdInit(args);
      case 'workstream':               return cmdWorkstream(args);
      case 'index-skills':             return cmdIndexSkills(args);
      case 'onboard':                  return cmdOnboard(args);
      case 'doctor':                   return cmdDoctor(args);
      case 'version': case '--version': case '-v': return cmdVersion();
      case 'help': case '--help': case '-h': case undefined: return cmdHelp();
      default: fail('unknown subcommand: ' + sub + ' (try: help)');
    }
  } catch (err) {
    fail((sub || 'root') + ': ' + (err && err.message ? err.message : err));
  }
}

main();
