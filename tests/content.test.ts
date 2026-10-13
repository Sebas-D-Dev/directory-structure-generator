import test from 'node:test';
import assert from 'node:assert/strict';
import { content } from '../src/content/foundation.ts';
import { validateBundle, validateSegment } from '../src/domain/validate.ts';
import { sourceSchema } from '../src/domain/contracts.ts';

function changed(mutator: (copy: typeof content) => void) {
  const copy = structuredClone(content);
  mutator(copy);
  return copy;
}
test('the authored bundle meets the complete explanation and cross-reference contracts', () => {
  assert.equal(validateBundle(content).variants.length, 2);
});
for (const name of ['..', '.', '/etc', 'a/b', 'a\\b', 'C:', 'NUL', 'con.txt', 'x.', 'x ', '\u0000', 'e\u0301']) {
  test(`reject unsafe segment ${JSON.stringify(name)}`, () => assert.throws(() => validateSegment(name)));
}
for (const name of ['main.go', '[slug]', '(group)', '_private', 'é']) {
  test(`preserve valid segment ${name}`, () => assert.doesNotThrow(() => validateSegment(name)));
}
test('reject duplicate IDs and case-colliding paths', () => {
  assert.throws(() => validateBundle(changed((copy) => {copy.sources.push(copy.sources[0]!);})), /Duplicate/);
  assert.throws(() => validateBundle(changed((copy) => {copy.variants[0]!.nodes[2]!.name = 'GO.MOD';})), /sibling/);
});
test('reject cycles, missing parents, and multiple roots', () => {
  assert.throws(() => validateBundle(changed((copy) => {copy.variants[1]!.nodes[2]!.parentId = 'rename-command';})), /Cyclic/);
  assert.throws(() => validateBundle(changed((copy) => {copy.variants[0]!.nodes[2]!.parentId = 'missing';})), /parent/);
  assert.throws(() => validateBundle(changed((copy) => {copy.variants[0]!.nodes[2]!.parentId = null;})), /root/);
});
test('reject dangling claims, sources, and variant references', () => {
  assert.throws(() => validateBundle(changed((copy) => {copy.variants[0]!.nodes[0]!.explanation.claimIds = ['missing'];})), /claim/);
  assert.throws(() => validateBundle(changed((copy) => {copy.claims[0]!.sourceIds = ['missing'];})), /source/);
  assert.throws(() => validateBundle({...content, lesson: {...content.lesson, variantIds: ['missing', 'flat-command']}}), /variant/);
});
test('two option references must be distinct', () => {
  assert.throws(() => validateBundle({...content, lesson: {...content.lesson, variantIds: ['flat-command', 'flat-command']}}), /Duplicate/);
});
test('reject malformed and unsafe source URLs without throwing from safeParse', () => {
  for (const url of ['not-url', 'javascript:alert(1)', 'http://example.com', 'https://user:password@example.com'])
    assert.equal(sourceSchema.safeParse({...content.sources[0], url}).success, false);
});
test('reject empty inspector fields, oversized fields, and unknown fields', () => {
  assert.throws(() => validateBundle(changed((copy) => {copy.variants[0]!.nodes[0]!.explanation.summary = '';})));
  assert.throws(() => validateBundle(changed((copy) => {copy.variants[0]!.nodes[0]!.explanation.summary = 'x'.repeat(10001);})));
  assert.throws(() => validateBundle({...content, execute: 'alert(1)'}));
});
test('draft cannot smuggle observed results into an unrun experiment', () => {
  assert.throws(() => validateBundle({...content, lesson: {...content.lesson, experiment: {...content.lesson.experiment, result: 'passed'}}}));
});
