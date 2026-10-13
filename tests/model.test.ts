import test from 'node:test';
import assert from 'node:assert/strict';
import { content } from '../src/content/foundation.ts';
import { projectSchema } from '../src/domain/contracts.ts';
import { compareVariants, exportProject, getVariant, initialProject, pathFor, supportsCapabilities, treeText } from '../src/domain/model.ts';

test('only the authored CLI capability is classified as supported', () => {
  assert.equal(supportsCapabilities(['cli'], false), true);
  for (const items of [[], ['cli', 'library'], ['website'], ['website', 'web-app']] as const)
    assert.equal(supportsCapabilities([...items], false), false);
  assert.equal(supportsCapabilities(['cli'], true), false);
});
test('layout option lookups reject unknown IDs', () => assert.throws(() => getVariant(content, 'invented')));
test('moves preserve node identity and do not mutate authored content', () => {
  const before = structuredClone(content);
  const changes = compareVariants(content.variants[0]!, content.variants[1]!);
  assert.deepEqual(changes.filter((c) => c.kind === 'moved').map((c) => c.id), ['entry', 'logic', 'tests']);
  assert.equal(changes.filter((c) => c.kind === 'added').length, 4);
  assert.equal(changes.filter((c) => c.kind === 'removed').length, 0);
  assert.deepEqual(content, before);
});
test('paths and tree use the current option', () => {
  const option = content.variants[1]!;
  assert.equal(pathFor(option, 'logic'), 'photo-renamer/internal/rename/rename.go');
  assert.match(treeText(option), /internal\//);
  assert.throws(() => pathFor(option, 'missing'));
});
test('exports are deterministic and preserve provenance, assumptions and limitations', () => {
  const output = exportProject(initialProject, content);
  assert.deepEqual(output, exportProject(structuredClone(initialProject), content));
  assert.deepEqual(JSON.parse(output.json), initialProject);
  for (const value of ['example-default', 'Example assumptions:', 'Still unknown:', 'Tool', 'Sources:', 'planned and unrun', 'no restore feature']) {
    assert.ok(output.text.toLowerCase().includes(value.toLowerCase()), value);
  }
});
test('capability ordering normalizes export bytes without changing input', () => {
  const a = {...initialProject, capabilities: ['cli', 'library'] as const};
  const b = {...initialProject, capabilities: ['library', 'cli'] as const};
  assert.deepEqual(exportProject({...a, capabilities: [...a.capabilities]}, content), exportProject({...b, capabilities: [...b.capabilities]}, content));
});
test('unsupported capability export is explicitly a nearby example', () => {
  assert.match(exportProject({...initialProject, capabilities: ['api']}, content).text, /not a design for the selected/);
});
test('project records reject unsupported versions, extra authoritative content, duplicate capabilities, and unknown choices', () => {
  for (const change of [{contentVersion: 'future'}, {projectSchemaVersion: 2}, {reviewer: 'verified'}, {capabilities: ['cli', 'cli']}, {variantId: 'invented'}])
    assert.equal(projectSchema.safeParse({...initialProject, ...change}).success, false);
});
