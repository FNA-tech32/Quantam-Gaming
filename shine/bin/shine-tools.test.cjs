#!/usr/bin/env node
// SHINE runtime test suite — zero deps, self-contained.
// Usage: node shine/bin/shine-tools.test.cjs
// Exit 0 if all tests pass, 1 otherwise.

const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const TOOL = path.resolve(__dirname, 'shine-tools.cjs');
let pass = 0, fail = 0;
const failures = [];

function run(args, opts = {}) {
  const r = spawnSync('node', [TOOL, ...args], {
    encoding: 'utf8',
    cwd: opts.cwd || process.cwd(),
    env: { ...process.env, HOME: opts.home || process.env.HOME },
  });
  return { stdout: r.stdout || '', stderr: r.stderr || '', code: r.status };
}

function test(name, fn) {
  try { fn(); pass++; process.stdout.write('  ✓ ' + name + '\n'); }
  catch (e) { fail++; failures.push({ name, err: e.message }); process.stdout.write('  ✗ ' + name + ' — ' + e.message + '\n'); }
}

function assert(cond, msg) { if (!cond) throw new Error(msg || 'assertion failed'); }

function mktmp(prefix = 'shine-test-') {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function cleanup(dir) {
  try { fs.rmSync(dir, { recursive: true, force: true }); } catch {}
}

// ─── Tests ──────────────────────────────────────────────────────────────────
process.stdout.write('\n== shine-tools.test ==\n\n');

process.stdout.write('[version]\n');
test('--version returns JSON with version', () => {
  const r = run(['--version']);
  assert(r.code === 0, 'exit ' + r.code);
  const j = JSON.parse(r.stdout);
  assert(typeof j.version === 'string', 'no version');
});

process.stdout.write('[help]\n');
test('help prints usage', () => {
  const r = run(['help']);
  assert(r.code === 0 && r.stdout.includes('Usage:'), 'bad help output');
});

process.stdout.write('[generate-slug]\n');
test('ASCII slug', () => {
  const r = run(['generate-slug', 'Hello World', '--raw']);
  assert(r.code === 0, 'exit');
  assert(JSON.parse(r.stdout).slug === 'hello-world', 'slug');
});
test('Unicode slug', () => {
  const r = run(['generate-slug', 'Café résumé', '--raw']);
  assert(r.code === 0);
  assert(JSON.parse(r.stdout).slug === 'cafe-resume');
});
test('no text → error', () => {
  const r = run(['generate-slug']);
  assert(r.code !== 0, 'should fail');
});

process.stdout.write('[frontmatter]\n');
test('parse valid frontmatter', () => {
  const d = mktmp();
  try {
    const f = path.join(d, 't.md');
    fs.writeFileSync(f, '---\nname: foo\nitems:\n  - a\n  - b\n---\nbody');
    const r = run(['frontmatter', f, '--raw']);
    assert(r.code === 0);
    const j = JSON.parse(r.stdout);
    assert(j.frontmatter.name === 'foo');
    assert(Array.isArray(j.frontmatter.items) && j.frontmatter.items.length === 2);
  } finally { cleanup(d); }
});
test('block scalar | literal', () => {
  const d = mktmp();
  try {
    const f = path.join(d, 't.md');
    fs.writeFileSync(f, '---\nname: foo\ndesc: |\n  line 1\n  line 2\n---\nbody');
    const r = run(['frontmatter', f, '--raw']);
    assert(r.code === 0);
    const j = JSON.parse(r.stdout);
    assert(j.frontmatter.desc.includes('line 1'), 'missing line 1');
    assert(j.frontmatter.desc.includes('line 2'), 'missing line 2');
  } finally { cleanup(d); }
});
test('no frontmatter → empty object', () => {
  const d = mktmp();
  try {
    const f = path.join(d, 't.md');
    fs.writeFileSync(f, 'no frontmatter here');
    const r = run(['frontmatter', f, '--raw']);
    assert(r.code === 0);
    const j = JSON.parse(r.stdout);
    assert(Object.keys(j.frontmatter).length === 0);
  } finally { cleanup(d); }
});

process.stdout.write('[state]\n');
test('state --set with value', () => {
  const d = mktmp();
  try {
    fs.mkdirSync(path.join(d, '.shine', 'phases', 'phase-01'), { recursive: true });
    const r = run(['state', '1', '--set', 'status=done', '--cwd', d, '--raw']);
    assert(r.code === 0, 'exit ' + r.code + ' ' + r.stderr);
    const j = JSON.parse(r.stdout);
    assert(j.ok === true);
    assert(j.value === 'done');
  } finally { cleanup(d); }
});
test('state --set without value → error', () => {
  const d = mktmp();
  try {
    const r = run(['state', '1', '--set', '--cwd', d]);
    assert(r.code !== 0, 'should fail');
    assert(r.stderr.toLowerCase().includes('requires') || r.stderr.includes('='), 'no helpful error');
  } finally { cleanup(d); }
});
test('state --set value with =', () => {
  const d = mktmp();
  try {
    const r = run(['state', '1', '--set', 'url=http://x?a=1', '--cwd', d, '--raw']);
    assert(r.code === 0);
    const j = JSON.parse(r.stdout);
    assert(j.value === 'http://x?a=1');
  } finally { cleanup(d); }
});

process.stdout.write('[commit]\n');
test('commit (no message) → error', () => {
  const d = mktmp();
  try {
    const r = run(['commit', '--cwd', d]);
    assert(r.code !== 0);
  } finally { cleanup(d); }
});

process.stdout.write('[roadmap]\n');
test('no ROADMAP.md → exists: false', () => {
  const d = mktmp();
  try {
    const r = run(['roadmap', '--cwd', d, '--raw']);
    assert(r.code === 0);
    const j = JSON.parse(r.stdout);
    assert(j.exists === false);
  } finally { cleanup(d); }
});
test('parse phases', () => {
  const d = mktmp();
  try {
    fs.writeFileSync(path.join(d, 'ROADMAP.md'),
      '# Roadmap\n## Phase 1 — First [done]\n## Phase 2 — Second [in-progress]\n## Phase 3 — Third [todo]\n');
    const r = run(['roadmap', '--cwd', d, '--raw']);
    assert(r.code === 0);
    const j = JSON.parse(r.stdout);
    assert(Array.isArray(j.phases) && j.phases.length === 3, 'phases count: ' + JSON.stringify(j.phases));
    assert(j.phases[1].status === 'in-progress', 'status parsing');
  } finally { cleanup(d); }
});

process.stdout.write('[workstream]\n');
test('workstream list (empty)', () => {
  const d = mktmp();
  try {
    const r = run(['workstream', 'list', '--cwd', d, '--raw']);
    assert(r.code === 0);
    const j = JSON.parse(r.stdout);
    assert(Array.isArray(j.workstreams));
  } finally { cleanup(d); }
});

process.stdout.write('[unknown]\n');
test('unknown subcommand → error', () => {
  const r = run(['bogus-cmd']);
  assert(r.code !== 0);
  assert(r.stderr.includes('unknown'));
});

// ─── Report ─────────────────────────────────────────────────────────────────
process.stdout.write('\n' + pass + ' passed, ' + fail + ' failed\n');
if (fail > 0) {
  process.stdout.write('\nFailures:\n');
  for (const f of failures) process.stdout.write('  ' + f.name + ': ' + f.err + '\n');
  process.exit(1);
}
process.exit(0);
