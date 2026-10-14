import test from 'node:test';
import assert from 'node:assert/strict';
import { catalog } from '../src/content/examples.ts';
import { explainRename, filterExamples, validateCatalog } from '../src/domain/learning.ts';

test('ten original illustrations cover eight language/technology labels with source records', () => {
  const parsed = validateCatalog(catalog);
  assert.equal(parsed.examples.length, 10);
  assert.equal(new Set(parsed.examples.map((e) => e.language)).size, 8);
  assert.equal(new Set(parsed.examples.map((e) => e.projectType)).size, 6);
  for (const example of parsed.examples) assert.equal(example.reference.reuse.mode, 'reference-only');
});
test('language and type filters intersect, including an honest empty result', () => {
  assert.equal(filterExamples(catalog.examples, 'All', 'All').length, 10);
  assert.equal(filterExamples(catalog.examples, 'Python', 'All').length, 3);
  assert.equal(filterExamples(catalog.examples, 'Python', 'Library')[0]?.id, 'python-library');
  assert.equal(filterExamples(catalog.examples, 'Go', 'Library').length, 0);
});
test('catalog rejects dangling, duplicate and unsafe source records', () => {
  const missing = structuredClone(catalog); missing.examples[0]!.sourceIds = ['missing'];
  assert.throws(() => validateCatalog(missing), /source/);
  const duplicate = structuredClone(catalog); duplicate.examples.push(duplicate.examples[0]!);
  assert.throws(() => validateCatalog(duplicate), /Duplicate/);
  const unsafe = structuredClone(catalog); unsafe.examples[0]!.reference.url = 'javascript:alert(1)';
  assert.throws(() => validateCatalog(unsafe));
  const copied = structuredClone(catalog) as unknown as {examples: {reference: {reuse: {mode: string}}}[]};
  copied.examples[0]!.reference.reuse.mode = 'copied';
  assert.throws(() => validateCatalog(copied));
});
test('ordinary entry rename preserves package-based entry while _test changes participation', () => {
  assert.equal(explainRename('entry', 'cli.go').tone, 'kept');
  assert.equal(explainRename('entry', 'cli_test.go').tone, 'changed');
});
test('test discovery follows the exact _test.go suffix', () => {
  assert.equal(explainRename('test', 'checks_test.go').tone, 'kept');
  assert.equal(explainRename('test', 'rename_checks.go').tone, 'changed');
  assert.equal(explainRename('test', 'test.go').tone, 'changed');
});
test('rename model rejects unsafe, colliding and out-of-scope constrained filenames', () => {
  for (const name of ['../main.go', '<script>.go', 'CON', '', 'cli.go ', '_cli.go', '.cli.go', 'cli_linux.go', 'cli_windows_amd64.go', 'cli_wasm_test.go', 'cgo.go', 'x'.repeat(62)+'.go'])
    assert.equal(explainRename('entry', name).valid, false, name);
  assert.equal(explainRename('entry', 'rename.go').valid, false);
  assert.equal(explainRename('test', 'main.go').valid, false);
});

test('new examples distinguish configured tool defaults from naming choices and include file roles', () => {
  for (const label of ['Rust','PHP','HTML & CSS','JavaScript','Java']) {
    const matches=filterExamples(catalog.examples,label,'All');
    assert.equal(matches.length,1);
    assert.ok(matches[0]!.fileRoles!.length >= 5);
    assert.ok(matches[0]!.assumptions!.length >= 3);
    assert.equal(matches[0]!.reference.kind,'Official documentation');
    assert.equal(matches[0]!.reference.reuse.checkedAt,'2026-10-14');
  }
  assert.equal(filterExamples(catalog.examples,'HTML & CSS','Static website')[0]?.nameKind,'Convention');
  assert.equal(filterExamples(catalog.examples,'JavaScript','CLI')[0]?.nameKind,'Author choice');
  assert.equal(filterExamples(catalog.examples,'All','Library').length,2);
});
