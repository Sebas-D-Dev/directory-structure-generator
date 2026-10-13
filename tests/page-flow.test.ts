import test from 'node:test';
import assert from 'node:assert/strict';
import { astroFlow } from '../src/content/astro-flow.ts';
import { getFlowStep, stepIndex, validatePageFlow } from '../src/domain/page-flow.ts';

test('Astro flow has six explained files with two explicit phases and original provenance', () => {
  const lesson = validatePageFlow(astroFlow);
  assert.equal(lesson.files.length, 6);
  assert.deepEqual(lesson.steps.map((step) => step.phase), ['Build time', 'Build time', 'Build time', 'Request / browser time', 'Request / browser time']);
  assert.equal(lesson.verification, 'Source-reviewed; illustrative fixture not executed');
  assert.equal(lesson.files.find((file) => file.id === 'html')?.kind, 'Generated output');
  assert.equal(lesson.files.find((file) => file.id === 'page')?.nameKind, 'Tool rule');
  assert.equal(lesson.files.find((file) => file.id === 'layout')?.nameKind, 'Convention');
});
test('static and hydrated views preserve build and request boundaries', () => {
  assert.equal(getFlowStep(astroFlow, 'route', 'static').view, getFlowStep(astroFlow, 'route', 'interactive').view);
  assert.match(getFlowStep(astroFlow, 'compose', 'static').view.explanation, /initial markup/);
  assert.match(getFlowStep(astroFlow, 'compose', 'interactive').view.explanation, /prerendered HTML/);
  assert.match(getFlowStep(astroFlow, 'deliver', 'interactive').view.explanation, /does not run index.astro/);
  assert.match(getFlowStep(astroFlow, 'browser', 'static').view.caveat, /separately authored scripts/);
  assert.match(getFlowStep(astroFlow, 'browser', 'interactive').view.explanation, /existing HTML/);
  assert.throws(() => getFlowStep(astroFlow, 'missing', 'static'), /Unknown/);
});
test('step navigation clamps at both ends without mutating content', () => {
  const before = JSON.stringify(astroFlow);
  assert.equal(stepIndex(astroFlow, 0, -1), 0);
  assert.equal(stepIndex(astroFlow, 4, 1), 4);
  assert.equal(stepIndex(astroFlow, 2, 1), 3);
  assert.equal(JSON.stringify(astroFlow), before);
});
test('page flow rejects dangling and duplicate references and identities', () => {
  const dangling = structuredClone(astroFlow); dangling.steps[0]!.fileIds = ['missing'];
  assert.throws(() => validatePageFlow(dangling), /reference/);
  const sources = structuredClone(astroFlow); sources.files[0]!.sourceIds = ['missing'];
  assert.throws(() => validatePageFlow(sources), /reference/);
  const duplicate = structuredClone(astroFlow); duplicate.steps.push(duplicate.steps[0]!);
  assert.throws(() => validatePageFlow(duplicate), /Duplicate/);
  const disconnected = structuredClone(astroFlow); disconnected.files[0]!.preferredStep = 'deliver';
  assert.throws(() => validatePageFlow(disconnected), /connected/);
});
test('page flow rejects mixed phase ordering and incomplete explanation fields', () => {
  const order = structuredClone(astroFlow); order.steps[0]!.phase = 'Request / browser time';
  assert.throws(() => validatePageFlow(order), /Build steps/);
  const empty = structuredClone(astroFlow); empty.files[0]!.boundary = '';
  assert.throws(() => validatePageFlow(empty));
  const date = structuredClone(astroFlow); date.sources[0]!.reviewAfter = '2020-01-01';
  assert.throws(() => validatePageFlow(date), /review date/);
});
test('page flow rejects unsafe source URLs and fake experiment status', () => {
  const url = structuredClone(astroFlow); url.sources[0]!.url = 'javascript:alert(1)';
  assert.throws(() => validatePageFlow(url));
  const fake = {...astroFlow, verification:'Experiment passed'};
  assert.throws(() => validatePageFlow(fake));
});
