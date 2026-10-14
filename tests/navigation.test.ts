import test from 'node:test';
import assert from 'node:assert/strict';
import { legacyDestination, legacySections } from '../src/domain/navigation.ts';
import { advanceStoryClock, nextStoryBeat, storyConnectorPoints, storyBeatCount, storyBeatMs, storyCycleMs, storyControlLabel } from '../src/domain/story.ts';

test('earlier section links map to explicit same-site routes', () => {
  assert.equal(Object.keys(legacySections).length, 9);
  for (const [hash, route] of Object.entries(legacySections)) {
    assert.equal(legacyDestination(`#${hash}`), route);
    assert.match(route, /^\/(examples\/|lab\/|sources\/)/);
  }
  assert.equal(legacyDestination('#%61stro-flow'), '/examples/astro/#astro-flow');
});
test('unknown, malformed and unsafe hashes never supply a navigation target', () => {
  for (const hash of ['', '#main', '#missing', '#__proto__', '#constructor', '#https://example.com', '#//example.com', '#%E0%A4%A']) assert.equal(legacyDestination(hash), undefined);
});
test('three story beats and a quiet hold repeat without a replay state', () => {
  assert.equal(storyBeatMs, 3200);
  assert.equal(storyBeatCount, 4);
  assert.equal(storyCycleMs, 12800);
  assert.deepEqual([0,1,2,3,4].map(nextStoryBeat), [1,2,3,0,1]);
});
test('story controls describe the current available action', () => {
  assert.equal(storyControlLabel('playing'), 'Pause story');
  assert.equal(storyControlLabel('paused'), 'Resume story');
  assert.equal(storyControlLabel('static'), 'Resume story');
});

test('the decorative marker follows the authored connector from checks toward source', () => {
  const points = storyConnectorPoints();
  assert.equal(points.length, 25);
  assert.deepEqual(points[0], {x:364,y:100,opacity:0,offset:0});
  assert.deepEqual(points.at(-1), {x:278,y:52,opacity:0,offset:1});
  assert.ok(points.slice(1,-1).every((point) => point.opacity === 1));
  assert.ok(points.every((point) => point.x >= 278 && point.x <= 364 && point.y >= 52 && point.y <= 100));
  assert.ok(points.every((point,index) => index === 0 || point.x <= points[index-1]!.x));
});

test('delayed story callbacks skip missed phases without catch-up or permanent clock drift', () => {
  assert.deepEqual(advanceStoryClock(0,3200,3200),{beat:1,remaining:3200});
  assert.deepEqual(advanceStoryClock(0,3200,14100),{beat:0,remaining:1900});
  assert.deepEqual(advanceStoryClock(3,1,1),{beat:0,remaining:3200});
  assert.deepEqual(advanceStoryClock(0,2000,0),{beat:0,remaining:2000});
});
